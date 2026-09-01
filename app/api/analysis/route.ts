import { NextResponse } from "next/server";

export const runtime = "nodejs";

export interface AnalysisFinding {
  area: string;
  verdict: "met" | "partial" | "missed";
  citation: string;
}

export interface AnalysisResult {
  mode: "llm" | "heuristic";
  score: number;
  summary: string;
  findings: AnalysisFinding[];
}

const SYSTEM_PROMPT = `You are an assistive procurement screening officer. Evaluate a startup's milestone evidence against the government department's stated target metrics.

Reply with STRICT JSON only (no markdown fences) in exactly this schema:
{
  "score": 0-100 (integer, mission-readiness of the evidence),
  "summary": "one or two sentence assessment in plain English",
  "findings": [
    { "area": "target metric or deliverable clause", "verdict": "met" | "partial" | "missed", "citation": "exact snippet of evidence (or target metric) that supports this verdict" }
  ]
}

Rules:
- Vary the finding count with the number of target metrics (1..4 findings).
- "met" only when the evidence demonstrably satisfies the wording/percentage of the metric; "partial" when adjacent but below the stated bar; "missed" when unsupported.
- Never invent numbers not present in the evidence when writing citations.
- Be conservative: prefer a slightly lower score over an optimistic one.
- Keep all text under 220 words total.`;

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "that", "into", "through", "during",
  "against", "across", "within", "using", "would", "will", "must", "should",
  "this", "their", "our", "your", "its", "all", "each", "every", "both",
]);

const stem = (word: string) =>
  word.length > 6 && word.endsWith("ed")
    ? word.slice(0, -2)
    : word.length > 6 && word.endsWith("ing")
      ? word.slice(0, -3)
      : word;

function heuristicScreen(evidence: string, metrics: string): AnalysisResult {
  const evidenceLower = ` ${evidence.toLowerCase()} `;
  const clauses = metrics
    .split(/\n|•|▸|;|;/)
    .map((s) => s.replace(/(-|\d+\.)\s+/g, "").trim())
    .filter((s) => s.length >= 4);

  const keywordSets = clauses.map((clause) =>
    [...new Set(
      clause
        .toLowerCase()
        .replace(/[^a-z0-9%.\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length >= 3 && w.length <= 24 && !STOP_WORDS.has(w))
    )]
  );

  const findings: AnalysisFinding[] = [];
  let matchedKeywords = 0;
  let totalKeywords = 0;

  clauses.forEach((clause, i) => {
    const words = keywordSets[i];
    if (words.length === 0) return;
    totalKeywords += words.length;
    const evidenceStem = stem(evidenceLower);
    const matched = words.filter(
      (w) => evidenceLower.includes(w) || evidenceStem.includes(stem(w))
    );
    matchedKeywords += matched.length;
    const ratio = matched.length / words.length;
    const verdict: AnalysisFinding["verdict"] =
      ratio === 0 ? "missed" : ratio >= 0.8 ? "met" : "partial";
    findings.push({
      area: clause,
      verdict,
      citation:
        matched.length > 0
          ? `Evidence matched keyword${matched.length > 1 ? "s" : ""}: ${matched
              .slice(0, 4)
              .join(", ")}`
          : `No evidence found for target "${clause}"`,
    });
  });

  if (totalKeywords === 0) {
    return {
      mode: "heuristic",
      score: 25,
      summary: "No analyzable keywords in the target metric; manual review advised.",
      findings: [
        {
          area: metrics,
          verdict: "partial",
          citation: "Target metric contains no extractable measurement keywords.",
        },
      ],
    };
  }

  return {
    mode: "heuristic",
    score: Math.round((matchedKeywords / totalKeywords) * 100),
    summary: `Keyword screen: ${matchedKeywords} of ${totalKeywords} target keywords found in evidence (${Math.round(
      (matchedKeywords / totalKeywords) * 100
    )}% readiness). Human QCBS review still required.`,
    findings,
  };
}

async function llmScreen(evidence: string, metrics: string): Promise<AnalysisResult | null> {
  const base = (process.env.AI_BASE_URL ?? "").replace(/\/+$/, "");
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!base || !apiKey || !model) return null;

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    {
      role: "user" as const,
      content: `TARGET_METRICS:\n${metrics}\n\nMILESTONE EVIDENCE:\n${evidence}`,
    },
  ];
  const baseBody = { model, temperature: 0, max_tokens: 1500, messages };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  const attempt = async (withJsonMode: boolean) => {
    return fetch(`${base}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(
        withJsonMode ? { ...baseBody, response_format: { type: "json_object" } } : baseBody
      ),
    });
  };

  try {
    let res = await attempt(true);
    if (!res.ok) res = await attempt(false);
    if (!res.ok) return null;
    const data = await res.json();
    const content: unknown = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.length === 0) return null;
    const parsed: unknown = JSON.parse(content);
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;

    const rawScore = Number(obj.score);
    const score = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(100, Math.round(rawScore)))
      : 0;
    const rawFindings = Array.isArray(obj.findings) ? obj.findings : [];
    const findings: AnalysisFinding[] = rawFindings
      .filter((f): f is Record<string, unknown> => !!f && typeof f === "object")
      .slice(0, 6)
      .map((f) => ({
        area: typeof f.area === "string" ? f.area.slice(0, 160) : "Finding",
        verdict: ["met", "partial", "missed"].includes(String(f.verdict))
          ? (f.verdict as AnalysisFinding["verdict"])
          : "partial",
        citation: typeof f.citation === "string" ? f.citation.slice(0, 400) : "",
      }));

    return {
      mode: "llm",
      score,
      summary:
        typeof obj.summary === "string" ? obj.summary.slice(0, 400) : "Screening complete.",
      findings: findings.length > 0 ? findings : [{ area: "Evidence", verdict: "partial", citation: "Model returned no structured findings." }],
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const obj = (body ?? {}) as Record<string, unknown>;
  const evidence_text = typeof obj.evidence_text === "string" ? obj.evidence_text.trim().slice(0, 6000) : "";
  const target_metrics = typeof obj.target_metrics === "string" ? obj.target_metrics.trim().slice(0, 1200) : "";
  if (!evidence_text || !target_metrics) {
    return NextResponse.json(
      { error: "evidence_text and target_metrics are required string fields." },
      { status: 400 }
    );
  }

  const llm = await llmScreen(evidence_text, target_metrics);
  if (llm) return NextResponse.json(llm);
  return NextResponse.json(heuristicScreen(evidence_text, target_metrics));
}