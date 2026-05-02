import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  buildPDF,
  parseReportJson,
  buildCasosContext,
  REPORT_SYSTEM_PROMPT,
} from "@/lib/acoustic-report";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, spaceLabel } = await req.json();

  console.log("[Reporte] messages recibidos:", JSON.stringify(messages?.slice(0, 2)));
  console.log("[Reporte] spaceLabel:", spaceLabel);

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }
  if (!messages?.length) {
    return Response.json({ error: "No conversation provided" }, { status: 400 });
  }

  const userMessages = (messages as Array<{ role: string; text: string }>)
    .filter((m) => m.role === "user" && m.text?.trim());

  const userChars = userMessages.reduce((acc, m) => acc + m.text.length, 0);

  if (userMessages.length < 2 || userChars < 50) {
    return Response.json(
      { error: "La conversación es muy corta para generar un reporte. Completa la consulta con el asesor antes de continuar." },
      { status: 400 }
    );
  }

  const conversationText = (messages as Array<{ role: string; text: string }>)
    .filter((m) => m.text?.trim())
    .map((m) => `${m.role === "user" ? "Cliente" : "Asesor"}: ${m.text}`)
    .join("\n\n");

  try {
    const casosContext = await buildCasosContext();

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: REPORT_SYSTEM_PROMPT + casosContext,
      messages: [{ role: "user", content: `Espacio: ${spaceLabel}\n\nConversación:\n${conversationText}` }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const rawText = content.text;
    console.log("[Reporte] respuesta Anthropic:", rawText);

    const data = parseReportJson(rawText);
    const pdfBuffer = buildPDF(data, spaceLabel);
    const slug = spaceLabel.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reporte-acustico-${slug}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    const error = err as Error;
    return Response.json({ error: error.message || "Error generating report" }, { status: 500 });
  }
}
