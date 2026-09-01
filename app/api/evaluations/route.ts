import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function makeClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

function hashTx() {
  return `0x${Math.random().toString(16).slice(2, 10)}...${Math.random()
    .toString(16)
    .slice(2, 8)}`;
}

export async function GET(request: Request) {
  const supabase = makeClient();
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const pilotId = searchParams.get("pilot_id");
  if (pilotId) {
    const { data, error } = await supabase
      .from("evaluations")
      .select("*")
      .eq("pilot_id", pilotId)
      .single();
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data);
  }
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}

export async function POST(request: Request) {
  const supabase = makeClient();
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.pilot_id !== "string") {
    return Response.json({ error: "pilot_id required" }, { status: 400 });
  }
  const { pilot_id, technical_merit, kpi_accuracy, cybersecurity, scalability, dpiit_recognition, evaluator_notes } = body;

  const { data: evaluation, error: evalError } = await supabase
    .from("evaluations")
    .upsert(
      {
        pilot_id,
        ...(typeof technical_merit === "number" ? { technical_merit } : {}),
        ...(typeof kpi_accuracy === "number" ? { kpi_accuracy } : {}),
        ...(typeof cybersecurity === "number" ? { cybersecurity } : {}),
        ...(typeof scalability === "number" ? { scalability } : {}),
        ...(typeof dpiit_recognition === "number" ? { dpiit_recognition } : {}),
        ...(typeof evaluator_notes === "string" ? { evaluator_notes } : {}),
      },
      { onConflict: "pilot_id" }
    )
    .select("*")
    .single();
  if (evalError) {
    return Response.json({ error: evalError.message }, { status: 500 });
  }

  // The compute_weighted_score() trigger has already set weighted_score and
  // is_approved. If the aggregate clears the 85% threshold, mark the pilot for
  // scale-up and disburse its escrow tranche exactly once.
  if (!evaluation.is_approved) {
    return Response.json({
      evaluation,
      approved: false,
      weighted_score: evaluation.weighted_score,
    });
  }

  const { data: pilot } = await supabase
    .from("pilots")
    .select("id, tranche_amount, status")
    .eq("id", pilot_id)
    .single();

  if (pilot && pilot.status !== "scaled_up") {
    await supabase
      .from("pilots")
      .update({ status: "scaled_up", audit_score: evaluation.weighted_score })
      .eq("id", pilot_id);
  }

  const existingTx = await supabase
    .from("escrow_transactions")
    .select("id")
    .eq("pilot_id", pilot_id)
    .limit(1);
  let payout;
  if (existingTx.data && existingTx.data.length === 0) {
    const amount = pilot?.tranche_amount ?? 0;
    const tx_hash = hashTx();
    const { data: tx, error: txError } = await supabase
      .from("escrow_transactions")
      .insert({ pilot_id, amount, tx_hash, status: "disbursed" })
      .select("amount, tx_hash")
      .single();
    if (txError) {
      return Response.json({ error: txError.message }, { status: 500 });
    }
    payout = { amount: tx?.amount ?? amount, tx_hash: tx?.tx_hash ?? tx_hash };
  }

  return Response.json({
    evaluation,
    approved: true,
    weighted_score: evaluation.weighted_score,
    ...(payout ? { payout } : {}),
  });
}