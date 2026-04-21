import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { nombre, email, mensaje } = await req.json() as {
    nombre?: string;
    email?: string;
    mensaje?: string;
  };

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: "nombre, email y mensaje son requeridos" }, { status: 400 });
  }

  const { error } = await supabase
    .from("acustega_leads")
    .insert({ nombre, email, mensaje });

  if (error) {
    console.error("supabase insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
