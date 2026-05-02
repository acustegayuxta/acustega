import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Eres un experto en diseño acústico y tratamiento de espacios. Analiza imágenes y documentos de proyectos acústicos para extraer información estructurada del caso de estudio.`;

const PROMPT = `Analiza todos los archivos adjuntos (fotos y/o documentos) de este proyecto acústico.
Devuelve ÚNICAMENTE un objeto JSON con estos campos exactos, sin markdown ni texto adicional:

{
  "nombre_proyecto": "nombre del estudio o sala (si no está claro, inventa uno descriptivo)",
  "ciudad": "ciudad donde está ubicado (usa vacío si no se puede determinar)",
  "tipo_espacio": "uno de exactamente: estudio_grabacion | home_studio | podcast | sala_ensayo | otro",
  "dimensiones": "dimensiones estimadas, ej: '5m × 4m × 2.8m'",
  "materiales_acusticos": "materiales acústicos visibles o mencionados",
  "resultado_medicion": "resultados de medición si los hay (RT60, SPL, etc.); si no hay, deja vacío",
  "problemas_encontrados": "problemas acústicos identificados",
  "solucion_aplicada": "soluciones de tratamiento aplicadas o visibles"
}

Para tipo_espacio elige SIEMPRE uno de los 5 valores permitidos.
Responde SOLO con el JSON, sin texto antes ni después.`;

const VALID_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY no configurado" }, { status: 500 });
  }

  const formData = await req.formData();
  const files    = formData.getAll("files") as File[];

  if (!files.length) {
    return Response.json({ error: "No se enviaron archivos" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentBlocks: any[] = [];

  for (const file of files) {
    const buffer  = Buffer.from(await file.arrayBuffer());
    const base64  = buffer.toString("base64");
    const mime    = file.type;

    if (mime === "application/pdf") {
      contentBlocks.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: base64 },
      });
    } else if (VALID_IMAGE_TYPES.has(mime)) {
      contentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: mime, data: base64 },
      });
    } else if (mime.startsWith("image/")) {
      // Fallback: treat unknown image subtypes as jpeg
      contentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: "image/jpeg", data: base64 },
      });
    }
    // Skip unsupported types silently
  }

  if (!contentBlocks.length) {
    return Response.json({ error: "Ningún archivo válido (usa imágenes o PDF)" }, { status: 400 });
  }

  contentBlocks.push({ type: "text", text: PROMPT });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: "user", content: contentBlocks }],
  });

  const raw = response.content[0]?.type === "text" ? response.content[0].text.trim() : "";

  // Strip possible ```json ... ``` fences
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return Response.json({ error: "La IA no devolvió un JSON válido", raw }, { status: 500 });
  }

  try {
    const fields = JSON.parse(jsonMatch[0]) as Record<string, string>;
    return Response.json({ fields });
  } catch {
    return Response.json({ error: "Error al parsear respuesta de IA", raw }, { status: 500 });
  }
}
