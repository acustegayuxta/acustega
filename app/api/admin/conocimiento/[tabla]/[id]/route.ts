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

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ tabla: string; id: string }> }
) {
  const { tabla, id } = await ctx.params;
  if (!ALLOWED[tabla]) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json() as Record<string, unknown>;

  const { data, error } = await adminClient()
    .from(`acustega_${tabla}`)
    .update(body)
    .eq("id", id)
    .select()
    .single();

  return Response.json({ data, error: error?.message }, { status: error ? 500 : 200 });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ tabla: string; id: string }> }
) {
  const { tabla, id } = await ctx.params;
  if (!ALLOWED[tabla]) return Response.json({ error: "Not found" }, { status: 404 });

  const { error } = await adminClient()
    .from(`acustega_${tabla}`)
    .delete()
    .eq("id", id);

  return Response.json({ ok: !error, error: error?.message }, { status: error ? 500 : 200 });
}
