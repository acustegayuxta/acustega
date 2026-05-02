import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export interface CasoEstudio {
  id: string;
  nombre_proyecto: string;
  ciudad: string;
  tipo_espacio: string;
  dimensiones: string;
  materiales_acusticos: string;
  resultado_medicion: string;
  problemas_encontrados: string;
  solucion_aplicada: string;
  fecha_proyecto: string;
  created_at: string;
}

export async function GET() {
  const { data, error } = await supabase
    .from("casos_estudio")
    .select("*")
    .order("fecha_proyecto", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ casos: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<CasoEstudio, "id" | "created_at">;

  const { data, error } = await supabase
    .from("casos_estudio")
    .insert([body])
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ caso: data }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json() as { id: string };

  const { error } = await supabase
    .from("casos_estudio")
    .delete()
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
