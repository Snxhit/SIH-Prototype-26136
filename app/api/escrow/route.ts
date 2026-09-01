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

export async function GET() {
  const supabase = makeClient();
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { data: vault, error: balErr } = await supabase.rpc(
    "get_escrow_vault_balance"
  );
  const { data: transactions, error: txErr } = await supabase
    .from("escrow_transactions")
    .select("*")
    .order("disbursed_at", { ascending: false });
  if (balErr || txErr) {
    return Response.json(
      { error: balErr?.message ?? txErr?.message ?? "Could not read escrow" },
      { status: 500 }
    );
  }
  const total_disbursed =
    (transactions ?? []).reduce(
      (sum, tx) => sum + (tx.status === "disbursed" ? tx.amount : 0),
      0
    ) ?? 0;
  return Response.json({
    vault_balance: vault ?? 0,
    total_disbursed,
    total_allocated: (vault ?? 0) + total_disbursed,
    transactions: transactions ?? [],
  });
}

export async function POST(request: Request) {
  const supabase = makeClient();
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.pilot_id !== "string" || typeof body.amount !== "number") {
    return Response.json({ error: "pilot_id and amount required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("escrow_transactions")
    .insert({
      pilot_id: body.pilot_id,
      amount: body.amount,
      tx_hash: typeof body.tx_hash === "string" ? body.tx_hash : hashTx(),
      status: typeof body.status === "string" ? body.status : "disbursed",
    })
    .select("*")
    .single();
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}