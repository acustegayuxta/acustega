import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function fetchKnowledgeBase() {
  const supabase = adminClient();
  const [proyectos, materiales, proveedores, resultados] = await Promise.all([
    supabase.from("acustega_proyectos").select("nombre,tipo_espacio,ciudad,largo_m,ancho_m,alto_m,materiales_usados,notas").limit(10),
    supabase.from("acustega_materiales").select("nombre,tipo,marca,precio_usd_m2,paises_disponibles,notas").limit(20),
    supabase.from("acustega_proveedores").select("nombre,pais,categorias_material,precios_referencia").limit(10),
    supabase.from("acustega_resultados").select("tipo_problema,solucion_aplicada,rt60_antes_ms,rt60_despues_ms,efectividad,testimonial").limit(10),
  ]);
  return {
    proyectos: proyectos.data ?? [],
    materiales: materiales.data ?? [],
    proveedores: proveedores.data ?? [],
    resultados: resultados.data ?? [],
  };
}

const SYSTEM = `Eres el jefe de diseño acústico de Acustega, con 20 años diseñando estudios de grabación para artistas como Maluma, Karol G, Feid y Sebastian Yatra en Medellín, Colombia.

Tu tarea es generar un prompt detallado y profesional para Rendair (herramienta de visualización arquitectónica con IA). El prompt debe ser en inglés, estar dividido en secciones claramente marcadas, y ser suficientemente rico en detalle visual, técnico y estético como para que Rendair genere renders fotorrealistas precisos.

Usa toda la información del cuestionario y la base de conocimiento para dar recomendaciones concretas de materiales, distribución y estética.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY no configurado" }, { status: 500 });
  }

  const { answers } = await req.json() as { answers: Record<string, string> };

  if (!answers || !Object.keys(answers).length) {
    return Response.json({ error: "No se recibieron respuestas del cuestionario" }, { status: 400 });
  }

  const kb = await fetchKnowledgeBase();

  const answersText = Object.entries(answers)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const kbText = [
    kb.proyectos.length  ? `PROYECTOS REFERENCIA:\n${JSON.stringify(kb.proyectos, null, 2)}`  : "",
    kb.materiales.length ? `MATERIALES DISPONIBLES:\n${JSON.stringify(kb.materiales, null, 2)}` : "",
    kb.proveedores.length? `PROVEEDORES:\n${JSON.stringify(kb.proveedores, null, 2)}`          : "",
    kb.resultados.length ? `RESULTADOS PREVIOS:\n${JSON.stringify(kb.resultados, null, 2)}`    : "",
  ].filter(Boolean).join("\n\n");

  const userMessage = `
RESPUESTAS DEL CUESTIONARIO:
${answersText}

${kbText ? `BASE DE CONOCIMIENTO ACUSTEGA:\n${kbText}` : ""}

Genera un prompt completo para Rendair con estas secciones exactas:

## SPACE OVERVIEW
[Descripción general del espacio: tipo, dimensiones, uso, contexto]

## ACOUSTIC TREATMENT DESIGN
[Distribución detallada del tratamiento: paneles absorbentes, difusores, bass traps — materiales específicos, posiciones, densidades]

## INTERIOR FINISHES & MATERIALS
[Materiales de acabado: paredes, piso, techo, ventanas, puertas — texturas, colores, especificaciones]

## FURNITURE & EQUIPMENT LAYOUT
[Mobiliario técnico: consola, monitores, racks, sillas, mesas — posiciones y orientación]

## LIGHTING DESIGN
[Diseño de iluminación: tipo, temperatura de color, zonas, ambiente general]

## VISUAL STYLE & MOOD
[Estilo visual: referencias, paleta de colores, atmósfera, sensación general]

## RENDAIR PROMPT (English, copy-paste ready)
[Un párrafo largo y detallado en inglés, formato prompt, listo para pegar en Rendair. Debe incluir todos los elementos visuales clave en una sola descripción densa y evocadora, en estilo "architectural visualization, photorealistic render..."]
`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM,
    messages: [{ role: "user", content: userMessage }],
  });

  const prompt = response.content[0]?.type === "text" ? response.content[0].text : "";

  return Response.json({ prompt });
}
