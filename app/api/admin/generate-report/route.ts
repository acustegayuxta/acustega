import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import {
  buildPDF,
  parseReportJson,
  buildCasosContext,
  REPORT_SYSTEM_PROMPT,
} from "@/lib/acoustic-report";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function answersToText(answers: Record<string, string>): string {
  const q = (id: string) => answers[id]?.trim() || "";

  const sections = [
    {
      title: "IDENTIDAD DEL ESPACIO",
      fields: [
        ["Nombre del proyecto", q("nombre_proyecto")],
        ["Ubicación", q("ubicacion")],
        ["Tipo de proyecto", q("tipo_proyecto")],
        ["Tipo de espacio", q("tipo_espacio")],
        ["Área aproximada", q("area_m2")],
      ],
    },
    {
      title: "USO DEL ESPACIO",
      fields: [
        ["Uso principal", q("uso_principal")],
        ["Personas simultáneas", q("personas")],
        ["Géneros / contenido", q("generos")],
        ["Sala de control separada", q("sala_control")],
        ["Instrumentos de alto SPL", q("alto_spl")],
      ],
    },
    {
      title: "CONDICIONES FÍSICAS",
      fields: [
        ["Dimensiones (L × A × H)", q("dimensiones")],
        ["Materiales actuales", q("materiales_actual")],
        ["Ventanas", q("ventanas")],
        ["Ruido externo", q("ruido_externo")],
        ["Piso / nivel", q("nivel_edificio")],
      ],
    },
    {
      title: "OBJETIVOS ACÚSTICOS",
      fields: [
        ["Problema principal", q("problema_principal")],
        ["Aislamiento requerido", q("aislamiento")],
        ["RT60 objetivo", q("rt60_objetivo")],
        ["Tratamiento de bajas", q("bajas_frecuencias")],
        ["Sweet spot / punto de escucha", q("sweet_spot")],
      ],
    },
    {
      title: "ESTÉTICA Y DISEÑO",
      fields: [
        ["Estilo visual", q("estilo_visual")],
        ["Colores y materiales preferidos", q("colores_materiales")],
        ["Referencias visuales", q("referencias")],
        ["Restricciones arquitectónicas", q("restricciones_arq")],
      ],
    },
    {
      title: "PRESUPUESTO Y PLAZOS",
      fields: [
        ["Presupuesto tratamiento acústico", q("presupuesto")],
        ["Presupuesto mobiliario/equipo", q("presupuesto_mob")],
        ["Fecha objetivo", q("fecha_objetivo")],
        ["Contratista", q("contratista")],
      ],
    },
  ];

  return sections
    .map(({ title, fields }) => {
      const lines = fields
        .filter(([, v]) => v)
        .map(([k, v]) => `  - ${k}: ${v}`);
      return lines.length ? `${title}:\n${lines.join("\n")}` : null;
    })
    .filter(Boolean)
    .join("\n\n");
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY no configurado" }, { status: 500 });
  }

  const { answers } = await req.json() as { answers: Record<string, string> };

  if (!answers || !Object.keys(answers).length) {
    return Response.json({ error: "No se recibieron respuestas del cuestionario" }, { status: 400 });
  }

  const briefText = answersToText(answers);
  const spaceLabel = answers.nombre_proyecto || answers.tipo_espacio || "Espacio acústico";

  try {
    const casosContext = await buildCasosContext();

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: REPORT_SYSTEM_PROMPT + casosContext,
      messages: [{
        role: "user",
        content: `Espacio: ${spaceLabel}\n\nCUESTIONARIO DE PROYECTO (respondido por el cliente):\n\n${briefText}`,
      }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const data = parseReportJson(content.text);
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
    return Response.json({ error: error.message || "Error generando el reporte" }, { status: 500 });
  }
}
