"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import {
  Copy,
  Download,
  FileCode2,
  FileSignature,
  Lock,
  Shield,
  ShoppingCart,
  Sliders,
  Sparkles,
  Target,
  Check,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  type ChallengePrefill,
  type Template,
  type TemplateKey,
  MOCK_TEMPLATES,
  TEMPLATE_KEYS,
  renderTemplateBody,
  buildChallengePrefill,
} from "@/lib/templates";

const TEMPLATE_ICONS: Record<TemplateKey, ElementType> = {
  problem_statement: Target,
  evaluation_criteria: Sliders,
  pilot_agreement: FileSignature,
  ip_data_clause: Shield,
  cybersecurity_risk: Lock,
  procurement_scaleup: ShoppingCart,
};

const TEMPLATE_ACCENTS: Record<TemplateKey, string> = {
  problem_statement: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  evaluation_criteria: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pilot_agreement: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  ip_data_clause: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  cybersecurity_risk: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  procurement_scaleup: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

const PARAM_PLACEHOLDERS: Record<TemplateKey, string[]> = {
  problem_statement: ["e.g. Water Supply & Sanitation Department, GoM", "e.g. >95% leak detection accuracy in 48h", "e.g. 5 km pipeline over 60 days"],
  evaluation_criteria: ["e.g. 85.0% Weighted Aggregate Score", "e.g. QCBS 80:20", "e.g. TRL 6 to TRL 8"],
  pilot_agreement: ["e.g. Department of Urban Development, GoM", "e.g. HydroSense DeepTech Innovations Pvt Ltd", "e.g. Rs 38,00,000 in Smart Escrow"],
  ip_data_clause: ["e.g. HydroSense DeepTech Innovations Pvt Ltd", "e.g. Non-Exclusive, Royalty-Free License", "e.g. MeitY Data Centers, Mumbai Region"],
  cybersecurity_risk: ["e.g. Max 5.0% Anomaly Deviation", "e.g. CERT-In Empanelled Audit", "e.g. Automated Failover to Manual Ops"],
  procurement_scaleup: ["e.g. Score >= 85.0% on QCBS Matrix", "e.g. 80 ULBs state-wide", "e.g. GeM Innovation Category / GFR 194"],
};

export default function TemplateStudio({
  onUseInChallenge,
}: {
  onUseInChallenge: (prefill: ChallengePrefill) => void;
}) {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [selectedKey, setSelectedKey] = useState<TemplateKey>("problem_statement");
  const [params, setParams] = useState<string[]>(MOCK_TEMPLATES[0].default_values);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) setTemplates(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => templates.find((t) => t.template_key === selectedKey) ?? MOCK_TEMPLATES[0],
    [templates, selectedKey]
  );

  const handleSelect = (key: TemplateKey) => {
    setSelectedKey(key);
    const next = templates.find((t) => t.template_key === key);
    setParams(next?.default_values.map((value) => value ?? "") ?? []);
    setCopied(false);
    setApplied(false);
  };

  const rendered = useMemo(
    () =>
      renderTemplateBody(selected.body_template, [
        params[0] ?? "",
        params[1] ?? "",
        params[2] ?? "",
      ]),
    [selected.body_template, params]
  );

  const Icon = TEMPLATE_ICONS[selected.template_key];
  const Accent = TEMPLATE_ACCENTS[selected.template_key];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rendered);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([rendered], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = selected.filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleUseInChallenge = () => {
    onUseInChallenge(
      buildChallengePrefill([params[0] ?? "", params[1] ?? "", params[2] ?? ""])
    );
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileCode2 className="size-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Templates & Legal Document Studio
            </h2>
            <p className="text-sm text-muted-foreground">
              Six pre-vetted GFR-aligned templates with live parameterized
              generation for Maharashtra procurement.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3" /> {templates.length} pre-vetted templates
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileSignature className="size-4" /> Template Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5">
              {TEMPLATE_KEYS.map((key) => {
                const template = templates.find((t) => t.template_key === key);
                if (!template) return null;
                const ItemIcon = TEMPLATE_ICONS[key];
                const isActive = key === selectedKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelect(key)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                      isActive
                        ? "border-primary/40 bg-primary/5"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${TEMPLATE_ACCENTS[key]}`}
                    >
                      <ItemIcon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{template.title}</p>
                      <p className="truncate font-mono text-[11px] text-muted-foreground">
                        {template.doc_id} · {template.hash}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <div className="rounded-t-xl bg-slate-950 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-md ${Accent}`}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-semibold text-slate-100">
                    {selected.filename}
                  </p>
                  <p className="truncate font-mono text-[11px] text-slate-400">
                    φ-hash {selected.hash}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  <Download className="size-3.5" /> Export .md
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {selected.labels.map((label, index) => (
                <div key={label} className="space-y-1.5">
                  <Label htmlFor={`param-${index}`}>{label}</Label>
                  <Input
                    id={`param-${index}`}
                    value={params[index] ?? ""}
                    onChange={(event) => {
                      const next = [...params];
                      next[index] = event.target.value;
                      setParams(next);
                    }}
                    placeholder={PARAM_PLACEHOLDERS[selected.template_key][index]}
                  />
                </div>
              ))}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <Label>Document Preview</Label>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {rendered.length.toLocaleString()} chars
                </span>
              </div>
              <pre className="field-sizing-content max-h-72 min-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 font-mono text-[12px] leading-relaxed text-foreground">
                {rendered}
              </pre>
            </div>
          </CardContent>
          <div className="flex items-center justify-between gap-3 rounded-b-xl border-t bg-muted/50 p-(--card-spacing)">
            <p className="text-xs text-muted-foreground">
              GFR 173(i) · verifiable, outcome-linked legal framework ready for
              department adoption.
            </p>
            <Button onClick={handleUseInChallenge} className="gap-2">
              {applied ? <Check className="size-4" /> : <Sparkles className="size-4" />}
              {applied ? "Form Prefilled" : "Use in New Challenge"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}