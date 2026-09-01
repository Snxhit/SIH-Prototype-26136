import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function makeClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  const supabase = makeClient();
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("pilots")
    .select(
      "id, challenge_id, status, tranche_amount, environment, data_privacy, stop_loss, ip_retainment, audit_score, created_at"
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}

export async function PUT(request: Request) {
  const supabase = makeClient();
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.pilot_id !== "string") {
    return Response.json({ error: "pilot_id required" }, { status: 400 });
  }
  const { pilot_id, environment, data_privacy, stop_loss, ip_retainment } = body;
  const { data, error } = await supabase
    .from("pilots")
    .update({
      ...(typeof environment === "string" ? { environment } : {}),
      ...(typeof data_privacy === "string" ? { data_privacy } : {}),
      ...(typeof stop_loss === "string" ? { stop_loss } : {}),
      ...(typeof ip_retainment === "string" ? { ip_retainment } : {}),
    })
    .eq("id", pilot_id);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}