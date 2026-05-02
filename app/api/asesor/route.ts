import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Stream } from "@anthropic-ai/sdk/core/streaming";
import { LOCALE_NAMES, type Locale } from "@/lib/i18n";
import { createClient } from "@supabase/supabase-js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function labelToTipoEspacio(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("estudio") || l.includes("grabaci") || l.includes("recording")) return "estudio_grabacion";
  if (l.includes("home") || l.includes("casa")) return "home_studio";
  if (l.includes("podcast") || l.includes("locuci")) return "podcast";
  if (l.includes("ensayo") || l.includes("rehearsal")) return "sala_ensayo";
  return "otro";
}

async function fetchSpaceContext(spaceLabel: string): Promise<string> {
  const tipoEspacio = labelToTipoEspacio(spaceLabel);
  const supabase = adminClient();

  const [proyectosRes, materialesRes] = await Promise.all([
    supabase
      .from("acustega_proyectos")
      .select("nombre,tipo_espacio,ciudad,largo_m,ancho_m,alto_m,materiales_usados,notas")
      .eq("tipo_espacio", tipoEspacio)
      .limit(5),
    supabase
      .from("acustega_materiales")
      .select("nombre,tipo,marca,precio_usd_m2,paises_disponibles,notas")
      .limit(15),
  ]);

  const proyectos = proyectosRes.data ?? [];
  const materiales = materialesRes.data ?? [];

  if (!proyectos.length && !materiales.length) return "";

  const parts: string[] = [];
  if (proyectos.length) {
    parts.push(`PROYECTOS SIMILARES (tipo: ${tipoEspacio}):\n${JSON.stringify(proyectos, null, 2)}`);
  }
  if (materiales.length) {
    parts.push(`MATERIALES DISPONIBLES EN CATÁLOGO:\n${JSON.stringify(materiales, null, 2)}`);
  }

  return `\n\nBASE DE CONOCIMIENTO ACUSTEGA:\n${parts.join("\n\n")}`;
}

const SYSTEM_PROMPT = `Eres el asesor acustico de Acustega, creado por un equipo de ingenieros acusticos con 20 anos de experiencia disenando estudios para Maluma, Karol G, Feid y Sebastian Yatra en Medellin, Colombia. Tu objetivo es diagnosticar el espacio del usuario y guiarlo hacia soluciones concretas.

ESTILO: Directo, cercano, tuteo. Maximo 3 parrafos cortos por respuesta. Explica siempre el POR QUE de cada recomendacion. Nunca uses listas largas. Nunca recomiendes espuma de huevo para aislamiento.

FLUJO DE PREGUNTAS: Haz maximo 2 preguntas por turno. Recopila en este orden: 1) dimensiones del espacio (largo, ancho, altura), 2) materiales de paredes piso y techo, 3) problema principal que quiere resolver, 4) pais donde esta ubicado, 5) presupuesto disponible (menos de 500 USD, 500 a 2000 USD, o mas de 2000 USD). Si el usuario ya dio informacion en la calculadora de modos usala sin volver a preguntar.

CONVERSION: Cuando tengas suficiente informacion para un diagnostico solido, entrega tus recomendaciones principales y cierra con este mensaje exacto: "Puedes descargar tu reporte acustico completo en PDF por $9.99 USD, incluye diagnostico detallado, plan de tratamiento, lista de materiales con proveedores locales, tabla de presupuesto y proximos pasos. Haz clic en el boton PDF que aparece arriba para generarlo."`;

export async function POST(req: NextRequest) {
  const { messages, spaceLabel, photo, locale } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  // Convert internal message format to Anthropic MessageParam format.
  // If a photo (base64 data URL) is provided, attach it to the first user message.
  const anthropicMessages: Anthropic.MessageParam[] = messages.map(
    (m: { role: "user" | "assistant"; text: string }, index: number) => {
      if (photo && index === 0 && m.role === "user") {
        const mimeMatch = (photo as string).match(/^data:(image\/\w+);base64,/);
        const mediaType = (mimeMatch?.[1] ?? "image/jpeg") as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
        const base64Data = (photo as string).split(",")[1];
        return {
          role: m.role,
          content: [
            { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data: base64Data } },
            { type: "text" as const, text: m.text },
          ],
        };
      }
      return { role: m.role, content: m.text };
    }
  );

  const spaceContext = await fetchSpaceContext(spaceLabel ?? "").catch(() => "");

  let stream: Stream<Anthropic.RawMessageStreamEvent>;

  try {
    // Awaiting create() with stream:true establishes the HTTP connection and
    // surfaces auth/billing errors (400/401) before we return any Response.
    stream = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      stream: true,
      system: `${SYSTEM_PROMPT}\n\nEl usuario quiere asesoría para su espacio: ${spaceLabel}.${spaceContext}\n${locale && LOCALE_NAMES[locale as Locale] ? `Respond exclusively in ${LOCALE_NAMES[locale as Locale]}.` : ""}`,
      messages: anthropicMessages,
    });
  } catch (err) {
    const apiErr = err as InstanceType<typeof Anthropic.APIError>;
    const status = apiErr.status ?? 500;
    const message =
      (apiErr.error as { error?: { message?: string } })?.error?.message ??
      apiErr.message ??
      "Error connecting to Anthropic API";

    return Response.json({ error: message }, { status });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
