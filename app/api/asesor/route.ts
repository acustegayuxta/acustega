import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres el asesor acústico de Acustega, creado por un equipo de profesionales y expertos acústicos con 20 años de experiencia diseñando estudios para Maluma, Karol G, Feid y Sebastián Yatra en Medellín, Colombia. Diagnostica problemas acústicos de cualquier espacio y da recomendaciones concretas y prácticas. Sé directo, usa tuteo, máximo 4 párrafos cortos, responde en el idioma del usuario. Explica siempre el POR QUÉ de cada recomendación.

Haz una o dos preguntas por turno. Recopila progresivamente: dimensiones del espacio, materiales de paredes/piso/techo, país, problema principal y presupuesto (menos de 500 USD, 500–2000 USD, o más de 2000 USD). Nunca recomiendes espuma de huevo para aislamiento.

Para proyectos con presupuesto mayor a 3000 USD, recomienda una sesión directa con nuestros expertos acústicos: videollamada por 80 USD o paquete completo por 350 USD.

Después de entregar el diagnóstico, ofrece el informe acústico completo por 9.99 USD. Menciona el curso en Hotmart por 197 USD con casos reales de estudios profesionales solo después de haber entregado valor primero, nunca al inicio de la conversación.`;

export async function POST(req: NextRequest) {
  const { messages, spaceLabel } = await req.json();

  // Convert internal message format to Anthropic MessageParam format
  const anthropicMessages: Anthropic.MessageParam[] = messages.map(
    (m: { role: "user" | "assistant"; text: string }) => ({
      role: m.role,
      content: m.text,
    })
  );

  // Validate API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let stream: Anthropic.Stream<Anthropic.RawMessageStreamEvent>;

  try {
    stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: `${SYSTEM_PROMPT}\n\nEl usuario quiere asesoría para su espacio: ${spaceLabel}.`,
      messages: anthropicMessages,
      cache_control: { type: "ephemeral" },
    });

    // Eagerly trigger the API call so auth/billing errors surface before we return
    await stream.initialMessage();
  } catch (err) {
    const apiErr = err as Anthropic.APIError;
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
