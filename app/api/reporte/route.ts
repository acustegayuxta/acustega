import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { jsPDF } from "jspdf";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Types ───────────────────────────────────────────────────────────────────

interface ReportData {
  spaceName:  string;
  diagnosis:  string;
  mainProblems: string[];
  treatment: {
    isolation: string;
    absorption: string;
    diffusion:  string;
    priority:   string;
  };
  materials: Array<{
    name:        string;
    specification: string;
    quantity:    string;
    purpose:     string;
    minCostUSD:  number;
    maxCostUSD:  number;
  }>;
  suppliers: {
    colombia:  string[];
    venezuela: string[];
    mexico:    string[];
  };
  budgetItems: Array<{ description: string; minUSD: number; maxUSD: number }>;
  totalMinUSD: number;
  totalMaxUSD: number;
  nextSteps:   string[];
}

// ── Claude prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert acoustic engineer. Analyze the conversation and return ONLY valid JSON (no markdown, no code fences, no extra text):
{
  "spaceName": "name of space",
  "diagnosis": "2-3 sentence overall acoustic diagnosis",
  "mainProblems": ["problem 1", "problem 2", "problem 3", "problem 4"],
  "treatment": {
    "isolation": "isolation recommendations paragraph",
    "absorption": "sound absorption recommendations paragraph",
    "diffusion": "diffusion recommendations paragraph",
    "priority": "single sentence: what to do first and why"
  },
  "materials": [
    { "name": "string", "specification": "thickness/density", "quantity": "amount", "purpose": "what it solves", "minCostUSD": 50, "maxCostUSD": 150 }
  ],
  "suppliers": {
    "colombia": ["Homecenter", "Rockwool Colombia"],
    "venezuela": ["EPA"],
    "mexico": ["Home Depot Mexico", "Construrama"]
  },
  "budgetItems": [
    { "description": "string", "minUSD": 100, "maxUSD": 300 }
  ],
  "totalMinUSD": 500,
  "totalMaxUSD": 1500,
  "nextSteps": ["Step 1: action", "Step 2: action", "Step 3: action", "Step 4: action", "Step 5: action"]
}`;

// ── PDF builder ──────────────────────────────────────────────────────────────

function buildPDF(data: ReportData, spaceLabel: string): ArrayBuffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 18, CW = W - M * 2;
  type RGB = [number, number, number];

  const C: Record<string, RGB> = {
    dark:    [13,  17,  23],
    cyan:    [0,   180, 216],
    amber:   [245, 158, 11],
    cream:   [240, 246, 252],
    muted:   [139, 148, 158],
    white:   [255, 255, 255],
    text:    [17,  24,  39],
    gray:    [107, 114, 128],
    light:   [248, 249, 250],
    border:  [229, 231, 235],
    surface: [22,  27,  34],
    amberBg: [255, 251, 235],
  };

  const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const ink  = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const pen  = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);

  let y = M;
  let pageNum = 0;

  const addPage = () => {
    doc.addPage();
    pageNum++;
    fill(C.white); doc.rect(0, 0, W, H, "F");
    fill(C.dark);  doc.rect(0, 0, W, 10, "F");
    ink(C.muted); doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.text("ACUSTEGA AI  ·  Reporte Acústico Profesional", M, 6.5);
    doc.text(`Página ${pageNum}`, W - M, 6.5, { align: "right" });
    y = 18;
  };

  const chk = (need = 8) => { if (y + need > H - M) addPage(); };

  const sectionHeader = (title: string) => {
    chk(16); fill(C.cyan); doc.rect(M, y, CW, 10, "F");
    ink(C.white); doc.setFontSize(9.5); doc.setFont("helvetica", "bold");
    doc.text(title, M + 5, y + 7); y += 14;
  };

  const subHeader = (title: string) => {
    chk(12); ink(C.cyan); doc.setFontSize(9.5); doc.setFont("helvetica", "bold");
    doc.text(title, M, y); y += 5;
    pen(C.border); doc.setLineWidth(0.3); doc.line(M, y, M + CW, y); y += 4;
  };

  const para = (str: string, indent = 0, col: RGB = C.text) => {
    if (!str) return;
    ink(col); doc.setFontSize(9.5); doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(str, CW - indent);
    (lines as string[]).forEach((l) => { chk(6); doc.text(l, M + indent, y); y += 5.5; });
    y += 2;
  };

  const bullet = (str: string) => {
    chk(8); fill(C.cyan); doc.circle(M + 2.5, y - 1.2, 1.3, "F");
    ink(C.text); doc.setFontSize(9.5); doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(str, CW - 9) as string[];
    lines.forEach((l, i) => { if (i > 0) chk(6); doc.text(l, M + 7, y + i * 5.5); });
    y += lines.length * 5.5 + 2;
  };

  // ── COVER ──────────────────────────────────────────────────────────────────

  pageNum = 1;
  fill(C.dark); doc.rect(0, 0, W, H, "F");

  // Cyan header band
  fill(C.cyan); doc.rect(0, 0, W, 65, "F");

  // Triangle logo
  const cx = W / 2, ty = 24, ts = 11;
  pen(C.white); doc.setLineWidth(0.9);
  doc.line(cx, ty - ts, cx + ts * 0.866, ty + ts * 0.5);
  doc.line(cx + ts * 0.866, ty + ts * 0.5, cx - ts * 0.866, ty + ts * 0.5);
  doc.line(cx - ts * 0.866, ty + ts * 0.5, cx, ty - ts);
  doc.line(cx - ts * 0.43, ty + ts * 0.1, cx + ts * 0.43, ty + ts * 0.1);
  fill(C.amber); doc.circle(cx, ty + ts * 0.5, 1.6, "F");

  // Title
  doc.setFontSize(28); doc.setFont("helvetica", "bold");
  const acuT = "ACUSTEGA", aiT = " AI";
  const tX = (W - doc.getTextWidth(acuT + aiT)) / 2;
  ink(C.white); doc.text(acuT, tX, 52);
  ink(C.amber); doc.text(aiT, tX + doc.getTextWidth(acuT), 52);
  ink(C.white); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("REPORTE ACÚSTICO PROFESIONAL", W / 2, 59.5, { align: "center" });

  // Space name box
  fill(C.surface); doc.roundedRect(M, 80, CW, 30, 3, 3, "F");
  ink(C.muted); doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
  doc.text("ESPACIO ANALIZADO", W / 2, 90, { align: "center" });
  ink(C.cream); doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text(spaceLabel, W / 2, 103, { align: "center" });

  // Date
  const dateStr = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  ink(C.muted); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(dateStr, W / 2, 126, { align: "center" });

  // Divider
  pen([40, 48, 58] as RGB); doc.setLineWidth(0.5);
  doc.line(M + 25, 131, W - M - 25, 131);

  // Includes list
  ink(C.muted); doc.setFontSize(7.5);
  doc.text("ESTE REPORTE INCLUYE:", W / 2, 142, { align: "center" });
  const includes = [
    "Diagnóstico acústico completo",
    "Plan de tratamiento personalizado",
    "Lista de materiales con especificaciones",
    "Proveedores locales por país",
    "Presupuesto detallado en USD",
    "Próximos pasos priorizados",
  ];
  includes.forEach((item, i) => {
    const ix = i % 2 === 0 ? M + 12 : W / 2 + 8;
    const iy = 152 + Math.floor(i / 2) * 10;
    fill(C.cyan); doc.circle(ix - 4, iy - 1.5, 1.2, "F");
    ink(C.cream); doc.setFontSize(8.5); doc.text(item, ix, iy);
  });

  // Bottom bar
  fill(C.cyan); doc.rect(0, H - 14, W, 14, "F");
  ink(C.white); doc.setFontSize(8.5); doc.setFont("helvetica", "bold");
  doc.text("acustega.com  ·  Medellín, Colombia", W / 2, H - 5.5, { align: "center" });

  // ── PAGE 2: DIAGNOSIS ──────────────────────────────────────────────────────

  addPage();
  sectionHeader("DIAGNÓSTICO ACÚSTICO");
  para(data.diagnosis);
  y += 2;
  subHeader("Problemas Identificados");
  data.mainProblems.forEach((p) => bullet(p));

  // ── PAGE 3: TREATMENT ──────────────────────────────────────────────────────

  if (y > 210) addPage(); else y += 8;
  sectionHeader("PLAN DE TRATAMIENTO");
  subHeader("Aislamiento Acústico");
  para(data.treatment.isolation);
  subHeader("Absorción");
  para(data.treatment.absorption);
  subHeader("Difusión");
  para(data.treatment.diffusion);

  // Priority box
  chk(22); y += 2;
  fill(C.amberBg); doc.rect(M, y, CW, 20, "F");
  fill(C.amber);   doc.rect(M, y, 3, 20, "F");
  pen(C.amber); doc.setLineWidth(0.3); doc.rect(M, y, CW, 20, "S");
  ink(C.amber); doc.setFontSize(7.5); doc.setFont("helvetica", "bold");
  doc.text("PRIORIDAD RECOMENDADA", M + 8, y + 7);
  ink(C.text); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  const pLines = doc.splitTextToSize(data.treatment.priority, CW - 14) as string[];
  pLines.slice(0, 2).forEach((l, i) => doc.text(l, M + 8, y + 13 + i * 5.5));
  y += 26;

  // ── PAGE 4: MATERIALS ──────────────────────────────────────────────────────

  addPage();
  sectionHeader("MATERIALES RECOMENDADOS");

  // Table header
  fill(C.surface); doc.rect(M, y, CW, 9, "F");
  ink(C.cyan); doc.setFontSize(7.5); doc.setFont("helvetica", "bold");
  const mc = [0, 52, 90, 118, 146];
  doc.text("Material",       M + mc[0] + 2, y + 6.2);
  doc.text("Especificación", M + mc[1] + 2, y + 6.2);
  doc.text("Cantidad",       M + mc[2] + 2, y + 6.2);
  doc.text("Mín USD",        M + mc[3] + 2, y + 6.2);
  doc.text("Máx USD",        M + mc[4] + 2, y + 6.2);
  y += 11;

  data.materials.slice(0, 8).forEach((mat, i) => {
    chk(9);
    if (i % 2 === 0) { fill(C.light); doc.rect(M, y - 1, CW, 9, "F"); }
    const trunc = (s: string, n: number) => s.length > n ? s.slice(0, n - 1) + "…" : s;
    doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); ink(C.text);
    doc.text(trunc(mat.name, 22),           M + mc[0] + 2, y + 5.5);
    doc.setFont("helvetica", "normal"); ink(C.gray);
    doc.text(trunc(mat.specification, 18),  M + mc[1] + 2, y + 5.5);
    doc.text(trunc(mat.quantity, 14),       M + mc[2] + 2, y + 5.5);
    ink(C.text);
    doc.text(`$${mat.minCostUSD}`,          M + mc[3] + 2, y + 5.5);
    doc.text(`$${mat.maxCostUSD}`,          M + mc[4] + 2, y + 5.5);
    y += 8.5;
  });

  y += 8;
  subHeader("Proveedores por País");
  const countries = [
    { name: "Colombia",  items: data.suppliers.colombia  },
    { name: "Venezuela", items: data.suppliers.venezuela },
    { name: "Mexico",    items: data.suppliers.mexico    },
  ];
  countries.forEach(({ name, items }) => {
    chk(12);
    ink(C.text); doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.text(name, M + 2, y); y += 5.5;
    ink(C.gray); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
    doc.text(items.join("  ·  "), M + 8, y); y += 7;
  });

  // ── PAGE 5: BUDGET ─────────────────────────────────────────────────────────

  if (y > 210) addPage(); else y += 8;
  sectionHeader("PRESUPUESTO ESTIMADO");

  fill(C.surface); doc.rect(M, y, CW, 9, "F");
  ink(C.cyan); doc.setFontSize(7.5); doc.setFont("helvetica", "bold");
  doc.text("Descripción",   M + 3,       y + 6.2);
  doc.text("Mínimo USD",    M + CW - 52, y + 6.2);
  doc.text("Máximo USD",    M + CW - 23, y + 6.2);
  y += 11;

  data.budgetItems.forEach((item, i) => {
    chk(9);
    if (i % 2 === 0) { fill(C.light); doc.rect(M, y - 1, CW, 9, "F"); }
    ink(C.text); doc.setFontSize(9); doc.setFont("helvetica", "normal");
    const desc = item.description.length > 46 ? item.description.slice(0, 43) + "…" : item.description;
    doc.text(desc, M + 3, y + 5.5);
    doc.text(`$${item.minUSD.toLocaleString()}`, M + CW - 52, y + 5.5);
    doc.text(`$${item.maxUSD.toLocaleString()}`, M + CW - 23, y + 5.5);
    y += 8.5;
  });

  chk(12);
  fill(C.cyan); doc.rect(M, y, CW, 11, "F");
  ink(C.white); doc.setFontSize(9.5); doc.setFont("helvetica", "bold");
  doc.text("TOTAL ESTIMADO",                            M + 3,       y + 7.5);
  doc.text(`$${data.totalMinUSD.toLocaleString()}`,     M + CW - 52, y + 7.5);
  doc.text(`$${data.totalMaxUSD.toLocaleString()}`,     M + CW - 23, y + 7.5);
  y += 15;

  // ── PAGE 6: NEXT STEPS ──────────────────────────────────────────────────────

  if (y > 200) addPage(); else y += 8;
  sectionHeader("PRÓXIMOS PASOS");

  data.nextSteps.forEach((step, i) => {
    chk(14);
    fill(C.cyan); doc.circle(M + 4.5, y + 3.5, 4.5, "F");
    ink(C.white); doc.setFontSize(8); doc.setFont("helvetica", "bold");
    doc.text(String(i + 1), M + 4.5, y + 5, { align: "center" });
    const clean = step.replace(/^step\s+\d+[:.]\s*/i, "").replace(/^\d+[.:]\s*/, "");
    ink(C.text); doc.setFontSize(9.5); doc.setFont("helvetica", "normal");
    const sLines = doc.splitTextToSize(clean, CW - 14) as string[];
    sLines.forEach((l, li) => { if (li > 0) chk(6); doc.text(l, M + 12, y + 4 + li * 5.5); });
    y += Math.max(12, sLines.length * 5.5 + 6);
  });

  // Footer
  chk(14); y += 4;
  pen(C.border); doc.setLineWidth(0.4); doc.line(M, y, M + CW, y); y += 6;
  ink(C.muted); doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
  doc.text("Generado por Acustega AI  ·  acustega.com  ·  Medellín, Colombia", W / 2, y, { align: "center" });
  y += 5;
  doc.text("Los costos son estimaciones de referencia y pueden variar según el mercado local.", W / 2, y, { align: "center" });

  return doc.output("arraybuffer");
}

// ── JSON sanitizer ───────────────────────────────────────────────────────────
// Escapes raw control characters found inside JSON string values without
// touching the structural characters outside strings. This fixes the common
// "Unexpected token / Expected ',' or ']'" errors caused by LLMs embedding
// literal newlines or other control chars inside string values.

function sanitizeJsonString(raw: string): string {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      result += char;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString) {
      const code = char.charCodeAt(0);
      if (code < 0x20) {
        // Escape raw control characters inside string values
        switch (char) {
          case "\n": result += "\\n"; break;
          case "\r": result += "\\r"; break;
          case "\t": result += "\\t"; break;
          default:   result += `\\u${code.toString(16).padStart(4, "0")}`; break;
        }
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }

  return result;
}

function parseReportJson(raw: string): ReportData {
  // Strip markdown fences
  const stripped = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  // Extract the outermost JSON object
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in Claude response");

  const jsonStr = match[0];

  // First attempt: parse as-is
  try {
    return JSON.parse(jsonStr) as ReportData;
  } catch {
    // Second attempt: sanitize control characters inside strings
    try {
      return JSON.parse(sanitizeJsonString(jsonStr)) as ReportData;
    } catch (err2) {
      const e = err2 as Error;
      throw new Error(`JSON parse failed after sanitization: ${e.message}`);
    }
  }
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { messages, spaceLabel } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }
  if (!messages?.length) {
    return Response.json({ error: "No conversation provided" }, { status: 400 });
  }

  const conversationText = (messages as Array<{ role: string; text: string }>)
    .filter((m) => m.text?.trim())
    .map((m) => `${m.role === "user" ? "Cliente" : "Asesor"}: ${m.text}`)
    .join("\n\n");

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Espacio: ${spaceLabel}\n\nConversación:\n${conversationText}` }],
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
    return Response.json({ error: error.message || "Error generating report" }, { status: 500 });
  }
}
