import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  if (key) {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("template_key", key)
      .single();
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data);
  }

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("doc_id", { ascending: true });
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}