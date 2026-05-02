"use client";

import { useState } from "react";

const BG      = "#0D1117";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";
const GREEN   = "#22c55e";

// ── Tag options ───────────────────────────────────────────────────────────────

const WORK_TYPES       = ["Grabación musical", "Podcast / Radio", "Voz en off / Doblaje", "Home Studio", "Streaming / Gaming", "Sala de reuniones", "Home Office", "Cine en casa", "Sala de ensayo", "Educación / Aula"];
const PEOPLE_OPTS      = ["1 persona", "2 – 4", "5 – 10", "Más de 10"];
const PROPERTY_OPTS    = ["Apartamento", "Casa", "Local comercial", "Oficina", "Bodega / Almacén", "Sótano", "Otro"];
const CONSTRAINT_OPTS  = ["Sin restricciones", "Sin demolición", "Techo bajo < 2.4m", "Espacio reducido", "Sin luz natural", "Solo inquilino", "Edificio histórico"];
const AESTHETIC_OPTS   = ["Moderna", "Industrial", "Cálida / Madera", "Minimalista", "Vintage / Retro", "Futurista / Neon"];
const LIGHTING_OPTS    = ["Cálida / Edison", "Fría / Blanca", "LED RGB", "Luz natural", "Industrial", "Mixta"];
const ATMOSPHERE_OPTS  = ["Íntima", "Profesional", "Creativa", "Relajante", "Enérgica", "Lujosa"];
const ELECTRICAL_OPTS  = ["Sí necesito", "Ya tengo", "No sé aún", "No necesito"];
const AC_OPTS          = ["Sí necesito", "Ya tengo", "No sé aún", "No necesito"];
const BUDGET_OPTS      = ["Básico < $5M", "$5M – $15M", "$15M – $30M", "Gama alta > $30M", "A definir"];
const INCLUDES_OPTS    = ["Solo acústica / obra", "Equipos de audio", "Mobiliario", "Iluminación", "Todo incluido"];
const GOAL_OPTS        = ["Aislamiento acústico", "Estética / diseño", "Calidad de grabación", "Comodidad / confort", "Mejor precio-calidad"];

// ── State type ────────────────────────────────────────────────────────────────

interface FormState {
  // S1 — Identidad y visión
  clientName: string;
  mainActivity: string;
  vision: string;
  visualReferences: string;
  // S2 — Uso y flujo
  workTypes: string[];
  peopleCount: string;
  zones: string;
  scheduleRestrictions: string;
  // S3 — Espacio físico
  dimensions: string;
  propertyType: string;
  physicalConstraints: string[];
  existingElements: string;
  // S4 — Iluminación y atmósfera
  aesthetics: string[];
  colorPalette: string;
  lightingType: string[];
  atmosphere: string[];
  // S5 — Equipamiento y tecnología
  equipment: string;
  vocalBooth: boolean;
  electricalNeeds: string;
  airConditioning: string;
  // S6 — Presupuesto y tiempos
  budgetRange: string;
  deadline: string;
  budgetIncludes: string[];
  priorWork: string;
  // S7 — Expectativas finales
  mainGoal: string[];
  projectReferences: string;
  notWanted: string;
  additionalComments: string;
}

const INITIAL: FormState = {
  clientName: "", mainActivity: "", vision: "", visualReferences: "",
  workTypes: [], peopleCount: "", zones: "", scheduleRestrictions: "",
  dimensions: "", propertyType: "", physicalConstraints: [], existingElements: "",
  aesthetics: [], colorPalette: "", lightingType: [], atmosphere: [],
  equipment: "", vocalBooth: false, electricalNeeds: "", airConditioning: "",
  budgetRange: "", deadline: "", budgetIncludes: [], priorWork: "",
  mainGoal: [], projectReferences: "", notWanted: "", additionalComments: "",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-4 rounded-xl mb-1"
      style={{ backgroundColor: `${CYAN}0a`, border: `1px solid ${CYAN}20` }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
        style={{ backgroundColor: `${CYAN}20`, color: CYAN }}
      >
        {num}
      </div>
      <div>
        <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: `${CYAN}80` }}>
          Sección {num} de 7
        </p>
        <p className="text-sm font-bold leading-tight" style={{ color: CREAM }}>{title}</p>
      </div>
    </div>
  );
}

function Tag({
  label, selected, onToggle, accent = "cyan",
}: {
  label: string; selected: boolean; onToggle: () => void; accent?: "cyan" | "amber";
}) {
  const color = accent === "amber" ? AMBER : CYAN;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        backgroundColor: selected ? `${color}1a` : SURFACE2,
        border: `1px solid ${selected ? color : BORDER}`,
        color: selected ? color : MUTED,
      }}
    >
      {label}
    </button>
  );
}

function FieldLabel({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] font-bold tabular-nums" style={{ color: `${CYAN}70` }}>{num}.</span>
      <span className="text-xs font-bold" style={{ color: CREAM }}>{text}</span>
    </div>
  );
}

function TextField({
  num, label, placeholder, value, onChange,
}: {
  num: number; label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel num={num} text={label} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
        style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM }}
      />
    </div>
  );
}

function TextArea({
  num, label, placeholder, value, onChange, rows = 3,
}: {
  num: number; label: string; placeholder: string; value: string;
  onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel num={num} text={label} />
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
        style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM }}
      />
    </div>
  );
}

function TagGroup({
  num, label, options, selected, onToggle, single = false, accent = "cyan",
}: {
  num: number; label: string; options: string[]; selected: string | string[];
  onToggle: (v: string) => void; single?: boolean; accent?: "cyan" | "amber";
}) {
  const isSelected = (o: string) =>
    Array.isArray(selected) ? selected.includes(o) : selected === o;
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel num={num} text={label} />
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Tag key={o} label={o} selected={isSelected(o)} onToggle={() => onToggle(o)}
            accent={accent} />
        ))}
      </div>
    </div>
  );
}

function YesNo({
  num, label, value, onChange,
}: {
  num: number; label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel num={num} text={label} />
      <div className="flex gap-2">
        <Tag label="No" selected={!value} accent="amber" onToggle={() => onChange(false)} />
        <Tag label="Sí" selected={value} accent="amber" onToggle={() => onChange(true)} />
      </div>
    </div>
  );
}

// ── Export helper ─────────────────────────────────────────────────────────────

function buildTxt(s: FormState): string {
  const now = new Date().toLocaleDateString("es-CO", { dateStyle: "long" });
  const bar  = "─".repeat(52);
  const dbar = "═".repeat(52);

  const sec = (n: number, title: string) =>
    `\n${dbar}\nSECCIÓN ${n}: ${title.toUpperCase()}\n${dbar}`;

  const q = (n: number, question: string, answer: string | string[] | boolean): string => {
    let ans: string;
    if (typeof answer === "boolean") ans = answer ? "Sí" : "No";
    else if (Array.isArray(answer)) ans = answer.length ? answer.join(", ") : "(sin respuesta)";
    else ans = answer.trim() || "(sin respuesta)";
    return `\n${n}. ${question}\n   ${ans}`;
  };

  return [
    "CUESTIONARIO COMPLETO DE DISEÑO ACÚSTICO",
    "Acustega AI · acustega.com",
    bar,
    `Cliente : ${s.clientName || "Sin nombre"}`,
    `Fecha   : ${now}`,

    sec(1, "Identidad y visión"),
    q(1,  "Nombre del cliente y del proyecto",           s.clientName),
    q(2,  "Actividad principal en el espacio",           s.mainActivity),
    q(3,  "Visión o concepto del proyecto",              s.vision),
    q(4,  "Referencias visuales o inspiraciones",        s.visualReferences),

    sec(2, "Uso y flujo del espacio"),
    q(5,  "Tipo de uso del espacio",                     s.workTypes),
    q(6,  "Cantidad de usuarios habituales",             s.peopleCount),
    q(7,  "Zonas diferenciadas de uso",                  s.zones),
    q(8,  "Restricciones de horario o ruido",            s.scheduleRestrictions),

    sec(3, "Espacio físico"),
    q(9,  "Dimensiones aproximadas (largo × ancho × alto)", s.dimensions),
    q(10, "Tipo de inmueble",                            s.propertyType),
    q(11, "Restricciones físicas o constructivas",       s.physicalConstraints),
    q(12, "Elementos a conservar o integrar",            s.existingElements),

    sec(4, "Iluminación y atmósfera"),
    q(13, "Estética visual deseada",                     s.aesthetics),
    q(14, "Paleta de colores o preferencias cromáticas", s.colorPalette),
    q(15, "Tipo de iluminación preferida",               s.lightingType),
    q(16, "Atmósfera que quiere transmitir",             s.atmosphere),

    sec(5, "Equipamiento y tecnología"),
    q(17, "Equipos actuales o planeados",                s.equipment),
    q(18, "¿Requiere cabina vocal?",                     s.vocalBooth),
    q(19, "Red eléctrica especial o circuito dedicado",  s.electricalNeeds),
    q(20, "Aire acondicionado silencioso",               s.airConditioning),

    sec(6, "Presupuesto y tiempos"),
    q(21, "Rango de presupuesto total",                  s.budgetRange),
    q(22, "Fecha límite o entrega deseada",              s.deadline),
    q(23, "¿Qué incluye el presupuesto?",                s.budgetIncludes),
    q(24, "Trabajo previo realizado en el espacio",      s.priorWork),

    sec(7, "Expectativas finales"),
    q(25, "Resultado más importante para el cliente",    s.mainGoal),
    q(26, "Proyectos de referencia que le inspiren",     s.projectReferences),
    q(27, "Lo que definitivamente NO quiere",            s.notWanted),
    q(28, "Comentarios adicionales o preguntas",         s.additionalComments),

    `\n${bar}\nGenerado con Acustega AI · acustega.com`,
  ].join("\n");
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CuestionarioCompleto() {
  const [s, setS] = useState<FormState>(INITIAL);
  const [exported, setExported] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setS((prev) => ({ ...prev, [key]: val }));

  const toggleMulti = (key: "workTypes" | "physicalConstraints" | "aesthetics" | "lightingType" | "atmosphere" | "budgetIncludes" | "mainGoal", val: string) =>
    setS((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(val)
        ? (prev[key] as string[]).filter((v) => v !== val)
        : [...(prev[key] as string[]), val],
    }));

  const setSingle = (key: "peopleCount" | "propertyType" | "electricalNeeds" | "airConditioning" | "budgetRange", val: string) =>
    setS((prev) => ({ ...prev, [key]: prev[key] === val ? "" : val }));

  const handleExport = () => {
    const txt = buildTxt(s);
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = s.clientName.trim()
      ? s.clientName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      : "cliente";
    a.download = `cuestionario-${slug}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleReset = () => {
    if (confirm("¿Limpiar todas las respuestas?")) setS(INITIAL);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto pb-10">

      {/* ── Sección 1 ── */}
      <div className="flex flex-col gap-4">
        <SectionHeader num={1} title="Identidad y visión" />
        <TextField num={1} label="Nombre del cliente y del proyecto"
          placeholder="Ej: Juan García · Studio Norte"
          value={s.clientName} onChange={(v) => set("clientName", v)} />
        <TextArea num={2} label="¿Qué actividad principal se realiza en el espacio?"
          placeholder="Describe el uso principal: grabación, podcast, home office, ensayo..."
          value={s.mainActivity} onChange={(v) => set("mainActivity", v)} />
        <TextArea num={3} label="¿Cuál es la visión o concepto del proyecto?"
          placeholder="¿Cómo imagina el espacio terminado? ¿Qué sensación quiere generar?"
          value={s.vision} onChange={(v) => set("vision", v)} />
        <TextArea num={4} label="¿Tiene referencias visuales o de inspiración?"
          placeholder="Lugares, marcas, estudios, videos, imágenes de Pinterest, etc."
          value={s.visualReferences} onChange={(v) => set("visualReferences", v)} />
      </div>

      {/* ── Sección 2 ── */}
      <div className="flex flex-col gap-4">
        <SectionHeader num={2} title="Uso y flujo del espacio" />
        <TagGroup num={5} label="Tipo de uso del espacio (puede elegir varios)"
          options={WORK_TYPES} selected={s.workTypes}
          onToggle={(v) => toggleMulti("workTypes", v)} />
        <TagGroup num={6} label="Cantidad de usuarios habituales del espacio"
          options={PEOPLE_OPTS} selected={s.peopleCount} single
          onToggle={(v) => setSingle("peopleCount", v)} accent="amber" />
        <TextArea num={7} label="¿Habrá zonas diferenciadas de uso?"
          placeholder="Ej: zona de grabación, sala de control, sala de espera, lounge..."
          value={s.zones} onChange={(v) => set("zones", v)} />
        <TextArea num={8} label="¿Hay restricciones de horario o ruido?"
          placeholder="Ej: vecinos sensibles al ruido, edificio con restricciones nocturnas..."
          value={s.scheduleRestrictions} onChange={(v) => set("scheduleRestrictions", v)} />
      </div>

      {/* ── Sección 3 ── */}
      <div className="flex flex-col gap-4">
        <SectionHeader num={3} title="Espacio físico" />
        <TextField num={9} label="Dimensiones aproximadas del espacio (largo × ancho × alto)"
          placeholder="Ej: 6m × 4m × 2.8m"
          value={s.dimensions} onChange={(v) => set("dimensions", v)} />
        <TagGroup num={10} label="Tipo de inmueble"
          options={PROPERTY_OPTS} selected={s.propertyType} single
          onToggle={(v) => setSingle("propertyType", v)} accent="amber" />
        <TagGroup num={11} label="Restricciones físicas o constructivas (puede elegir varias)"
          options={CONSTRAINT_OPTS} selected={s.physicalConstraints}
          onToggle={(v) => toggleMulti("physicalConstraints", v)} />
        <TextArea num={12} label="¿Hay elementos que desea conservar o integrar al diseño?"
          placeholder="Ej: ventana existente, columna, piso de madera, escritorio en U..."
          value={s.existingElements} onChange={(v) => set("existingElements", v)} />
      </div>

      {/* ── Sección 4 ── */}
      <div className="flex flex-col gap-4">
        <SectionHeader num={4} title="Iluminación y atmósfera" />
        <TagGroup num={13} label="Estética visual deseada (puede elegir varias)"
          options={AESTHETIC_OPTS} selected={s.aesthetics}
          onToggle={(v) => toggleMulti("aesthetics", v)} />
        <TextArea num={14} label="¿Tiene preferencia de colores o paleta cromática?"
          placeholder="Ej: tonos oscuros con detalles dorados, madera clara y blanco, azul marino..."
          value={s.colorPalette} onChange={(v) => set("colorPalette", v)} rows={2} />
        <TagGroup num={15} label="Tipo de iluminación preferida (puede elegir varias)"
          options={LIGHTING_OPTS} selected={s.lightingType}
          onToggle={(v) => toggleMulti("lightingType", v)} />
        <TagGroup num={16} label="Atmósfera que quiere transmitir (puede elegir varias)"
          options={ATMOSPHERE_OPTS} selected={s.atmosphere}
          onToggle={(v) => toggleMulti("atmosphere", v)} />
      </div>

      {/* ── Sección 5 ── */}
      <div className="flex flex-col gap-4">
        <SectionHeader num={5} title="Equipamiento y tecnología" />
        <TextArea num={17} label="¿Qué equipos tiene actualmente o planea tener?"
          placeholder="Ej: interfaz Focusrite, monitores Yamaha HS8, micrófono Neumann, batería acústica..."
          value={s.equipment} onChange={(v) => set("equipment", v)} />
        <YesNo num={18} label="¿Requiere cabina vocal o cuarto de locución?"
          value={s.vocalBooth} onChange={(v) => set("vocalBooth", v)} />
        <TagGroup num={19} label="Red eléctrica especial o circuito dedicado"
          options={ELECTRICAL_OPTS} selected={s.electricalNeeds} single
          onToggle={(v) => setSingle("electricalNeeds", v)} accent="amber" />
        <TagGroup num={20} label="Aire acondicionado silencioso (tipo mini-split)"
          options={AC_OPTS} selected={s.airConditioning} single
          onToggle={(v) => setSingle("airConditioning", v)} accent="amber" />
      </div>

      {/* ── Sección 6 ── */}
      <div className="flex flex-col gap-4">
        <SectionHeader num={6} title="Presupuesto y tiempos" />
        <TagGroup num={21} label="Rango de presupuesto total del proyecto"
          options={BUDGET_OPTS} selected={s.budgetRange} single
          onToggle={(v) => setSingle("budgetRange", v)} accent="amber" />
        <TextField num={22} label="Fecha límite o entrega deseada"
          placeholder="Ej: Julio 2025, antes de diciembre, sin fecha fija..."
          value={s.deadline} onChange={(v) => set("deadline", v)} />
        <TagGroup num={23} label="¿Qué incluye el presupuesto? (puede elegir varios)"
          options={INCLUDES_OPTS} selected={s.budgetIncludes}
          onToggle={(v) => toggleMulti("budgetIncludes", v)} />
        <TextArea num={24} label="¿Ya hay algún trabajo previo realizado en el espacio?"
          placeholder="Ej: ya instalaron drywall, hay paneles de espuma, el cielo ya está intervenido..."
          value={s.priorWork} onChange={(v) => set("priorWork", v)} rows={2} />
      </div>

      {/* ── Sección 7 ── */}
      <div className="flex flex-col gap-4">
        <SectionHeader num={7} title="Expectativas finales" />
        <TagGroup num={25} label="Resultado más importante para el cliente (puede elegir varios)"
          options={GOAL_OPTS} selected={s.mainGoal}
          onToggle={(v) => toggleMulti("mainGoal", v)} />
        <TextArea num={26} label="¿Tiene proyectos o estudios de referencia que le inspiren?"
          placeholder="Nombres de estudios, links, fotos, descripciones que admire..."
          value={s.projectReferences} onChange={(v) => set("projectReferences", v)} />
        <TextArea num={27} label="¿Qué es lo que definitivamente NO quiere en el espacio?"
          placeholder="Colores que no le gustan, materiales, estilos, elementos a evitar..."
          value={s.notWanted} onChange={(v) => set("notWanted", v)} rows={2} />
        <TextArea num={28} label="Comentarios adicionales, preguntas o información relevante"
          placeholder="Todo lo que considere importante y no haya cubierto el cuestionario..."
          value={s.additionalComments} onChange={(v) => set("additionalComments", v)} rows={3} />
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold tracking-wide transition-all"
          style={{
            backgroundColor: exported ? GREEN : AMBER,
            color: BG,
            boxShadow: `0 4px 20px ${exported ? GREEN : AMBER}35`,
          }}
        >
          {exported ? (
            <>
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 8l3 3 7-7" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Descargado
            </>
          ) : (
            <>
              <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                <path d="M9 2v9M5 7l4 4 4-4" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 14h12" stroke={BG} strokeWidth="2" strokeLinecap="round" />
              </svg>
              Exportar cuestionario (.txt)
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: SURFACE2,
            border: `1px solid ${BORDER}`,
            color: MUTED,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = CREAM)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
