import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const ALLOWED: Record<string, true> = {
  proyectos:   true,
  proveedores: true,
  materiales:  true,
  resultados:  true,
};

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ tabla: string }> }
) {
  const { tabla } = await ctx.params;
  if (!ALLOWED[tabla]) return Response.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await adminClient()
    .from(`acustega_${tabla}`)
    .select("*")
    .order("created_at", { ascending: false });

  return Response.json({ data: data ?? [], error: error?.message });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ tabla: string }> }
) {
  const { tabla } = await ctx.params;
  if (!ALLOWED[tabla]) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json() as Record<string, unknown>;

  const { data, error } = await adminClient()
    .from(`acustega_${tabla}`)
    .insert([body])
    .select()
    .single();

  return Response.json({ data, error: error?.message }, { status: error ? 500 : 201 });
}
