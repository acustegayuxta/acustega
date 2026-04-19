import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Stream } from "@anthropic-ai/sdk/core/streaming";
import { LOCALE_NAMES, type Locale } from "@/lib/i18n";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres el asesor acústico de Acustega, creado por un equipo de profesionales y expertos acústicos con 20 años de experiencia diseñando estudios para Maluma, Karol G, Feid y Sebastián Yatra en Medellín, Colombia. Diagnostica problemas acústicos de cualquier espacio y da recomendaciones concretas y prácticas. Sé directo, usa tuteo, máximo 4 párrafos cortos, responde en el idioma del usuario. Explica siempre el POR QUÉ de cada recomendación.

Haz una o dos preguntas por turno. Recopila progresivamente: dimensiones del espacio, materiales de paredes/piso/techo, país, problema principal y presupuesto (menos de 500 USD, 500–2000 USD, o más de 2000 USD). Nunca recomiendes espuma de huevo para aislamiento.

Para proyectos con presupuesto mayor a 3000 USD, recomienda una sesión directa con nuestros expertos acústicos: videollamada por 80 USD o paquete completo por 350 USD.

Cuando hayas completado el diagnóstico y entregado tus recomendaciones principales, cierra con este mensaje exacto al final de tu respuesta: "Puedes descargar tu reporte acústico completo en PDF por $9.99 USD — incluye diagnóstico detallado, plan de tratamiento, lista de materiales con proveedores locales, tabla de presupuesto y próximos pasos. Haz clic en el botón PDF que aparece arriba para generarlo." No menciones WhatsApp, wa.link ni ningún enlace externo para la entrega del reporte. El reporte se descarga directamente desde esta app.

Menciona el curso en Hotmart por 197 USD con casos reales de estudios profesionales solo después de haber entregado valor primero, nunca al inicio de la conversación.`;

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

  let stream: Stream<Anthropic.RawMessageStreamEvent>;

  try {
    // Awaiting create() with stream:true establishes the HTTP connection and
    // surfaces auth/billing errors (400/401) before we return any Response.
    stream = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      stream: true,
      system: `${SYSTEM_PROMPT}\n\nEl usuario quiere asesoría para su espacio: ${spaceLabel}.\n${locale && LOCALE_NAMES[locale as Locale] ? `Respond exclusively in ${LOCALE_NAMES[locale as Locale]}.` : ""}`,
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
