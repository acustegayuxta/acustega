"use client";

import { useState } from "react";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const PURPLE  = "#8B5CF6";
const GREEN   = "#22c55e";
const PINK    = "#EC4899";
const ORANGE  = "#F97316";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";
const RED     = "#ef4444";

// ── Questions definition ──────────────────────────────────────────────────────

const SECTIONS = [
  { label: "Identidad del espacio",  color: CYAN   },
  { label: "Uso del espacio",        color: PURPLE },
  { label: "Condiciones físicas",    color: AMBER  },
  { label: "Objetivos acústicos",    color: GREEN  },
  { label: "Estética y diseño",      color: PINK   },
  { label: "Presupuesto y plazos",   color: ORANGE },
];

type QType = "text" | "textarea" | "select" | "radio";

interface Question {
  id: string;
  section: number;
  label: string;
  type: QType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

const QUESTIONS: Question[] = [
  // ── Identidad ──
  { id: "nombre_proyecto",   section: 0, required: true,  type: "text",     label: "¿Cuál es el nombre del proyecto o estudio?",            placeholder: "Ej: Studio Norte Medellín" },
  { id: "ubicacion",         section: 0, required: true,  type: "text",     label: "¿Ciudad y país donde está ubicado?",                    placeholder: "Ej: Medellín, Colombia" },
  { id: "tipo_proyecto",     section: 0,                  type: "radio",    label: "¿Es obra nueva o renovación de un espacio existente?",  options: ["Obra nueva", "Renovación / adecuación", "Adaptación de local comercial"] },
  { id: "tipo_espacio",      section: 0, required: true,  type: "select",   label: "Tipo principal del espacio",                            options: ["Estudio de grabación profesional", "Home studio", "Sala de ensayo", "Podcast studio", "Sala de mezcla y mastering", "Auditorio o sala de eventos", "Sala de conferencias", "Otro"] },
  { id: "area_m2",           section: 0,                  type: "text",     label: "¿Área aproximada del espacio? (m²)",                    placeholder: "Ej: 25 m²" },

  // ── Uso ──
  { id: "uso_principal",     section: 1, required: true,  type: "textarea", label: "¿Cuál es el uso principal del espacio?",                placeholder: "Grabación de voz, mezcla, mastering, ensayos de banda…" },
  { id: "personas",          section: 1,                  type: "select",   label: "¿Cuántas personas trabajarán simultáneamente?",         options: ["1 persona", "2–3 personas", "4–6 personas", "Más de 6"] },
  { id: "generos",           section: 1,                  type: "textarea", label: "¿Qué géneros o tipo de contenido se producirá?",        placeholder: "Urbano, reguetón, pop, podcasts, bandas en vivo…" },
  { id: "sala_control",      section: 1,                  type: "radio",    label: "¿Se requiere sala de control separada de la sala de grabación?", options: ["Sí, sala de control independiente", "No, espacio unificado", "Aún no decidido"] },
  { id: "alto_spl",          section: 1,                  type: "radio",    label: "¿Se grabará batería u otros instrumentos de alto SPL?", options: ["Sí, es parte del uso habitual", "Ocasionalmente", "No"] },

  // ── Condiciones ──
  { id: "dimensiones",       section: 2, required: true,  type: "text",     label: "Dimensiones del espacio (largo × ancho × alto)",       placeholder: "Ej: 6m × 5m × 2.8m" },
  { id: "materiales_actual", section: 2,                  type: "textarea", label: "Materiales actuales de paredes, piso y techo",          placeholder: "Paredes: bloque sin revocar. Piso: concreto. Techo: losa…" },
  { id: "ventanas",          section: 2,                  type: "text",     label: "¿Hay ventanas? ¿Cuántas y de qué tamaño?",             placeholder: "Ej: 2 ventanas de 1.2 × 0.8 m" },
  { id: "ruido_externo",     section: 2,                  type: "textarea", label: "Fuentes de ruido externo a considerar",                 placeholder: "Tráfico, vecinos, planta HVAC, zona industrial…" },
  { id: "nivel_edificio",    section: 2,                  type: "text",     label: "¿En qué piso o nivel del edificio está ubicado?",       placeholder: "Ej: Piso 3, edificio residencial" },

  // ── Objetivos ──
  { id: "problema_principal",section: 3, required: true,  type: "select",   label: "Principal problema acústico a resolver",               options: ["Reverberación excesiva", "Flutter echo (eco repetitivo)", "Modos de sala (bajos retumbantes)", "Ruido externo (colación)", "Aislamiento entre recintos", "Balance de frecuencias deficiente"] },
  { id: "aislamiento",       section: 3,                  type: "radio",    label: "¿Se requiere aislamiento acústico hacia el exterior?",  options: ["Sí, aislamiento total", "Reducción moderada", "No es prioridad"] },
  { id: "rt60_objetivo",     section: 3,                  type: "select",   label: "RT60 objetivo (tiempo de reverberación buscado)",       options: ["Muy seco 0.2–0.3 s (voz, podcast)", "Seco 0.3–0.4 s (home studio)", "Estándar 0.4–0.5 s (estudio profesional)", "Vivo 0.5–0.8 s (sala de ensayo)", "No sé / necesito asesoría"] },
  { id: "bajas_frecuencias", section: 3,                  type: "radio",    label: "¿Se necesita tratamiento especial de bajas frecuencias (bass traps)?", options: ["Sí, es prioritario", "Moderado", "No es necesario"] },
  { id: "sweet_spot",        section: 3,                  type: "textarea", label: "Punto de escucha principal o sweet spot",               placeholder: "Posición de la consola, monitor principal, silla del productor…" },

  // ── Estética ──
  { id: "estilo_visual",     section: 4, required: true,  type: "select",   label: "Estilo visual deseado",                                options: ["Industrial / urbano", "Minimalista moderno", "Vintage / cálido / análogo", "High-end profesional", "Orgánico / natural / madera", "Oscuro y cinematográfico", "Sin preferencia específica"] },
  { id: "colores_materiales",section: 4,                  type: "textarea", label: "Colores o materiales preferidos",                      placeholder: "Tonos oscuros, maderas naturales, concreto expuesto, acústica de color…" },
  { id: "referencias",       section: 4,                  type: "textarea", label: "Referencias visuales de estudios que les gusten",       placeholder: "Mención de estudios famosos, links de Pinterest, Instagram…" },
  { id: "restricciones_arq", section: 4,                  type: "textarea", label: "Elementos arquitectónicos a conservar o restricciones", placeholder: "Columnas, ventanas que no se pueden tapar, altura mínima requerida…" },

  // ── Presupuesto ──
  { id: "presupuesto",       section: 5, required: true,  type: "select",   label: "Presupuesto total para el tratamiento acústico",        options: ["Menos de $2.000 USD", "$2.000 – $5.000 USD", "$5.000 – $15.000 USD", "$15.000 – $50.000 USD", "Más de $50.000 USD", "Por definir"] },
  { id: "presupuesto_mob",   section: 5,                  type: "radio",    label: "¿Hay presupuesto separado para mobiliario y equipo?",   options: ["Sí, presupuesto separado", "Todo incluido en el anterior", "Aún no definido"] },
  { id: "fecha_objetivo",    section: 5,                  type: "text",     label: "Fecha límite u objetivo de entrega",                    placeholder: "Ej: Junio 2026, en 3 meses, sin fecha límite…" },
  { id: "contratista",       section: 5,                  type: "radio",    label: "¿Tienen contratista o necesitan recomendación?",        options: ["Tenemos contratista propio", "Necesitamos recomendación de instaladores", "El cliente lo contratará"] },
];

// ── UI Primitives ─────────────────────────────────────────────────────────────

function Field({ label, required, color = CYAN, children }: {
  label: string; required?: boolean; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold leading-snug" style={{ color: CREAM }}>
        {label}{required && <span style={{ color }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM }}
      onFocus={(e) => (e.currentTarget.style.borderColor = CYAN)}
      onBlur={(e)  => (e.currentTarget.style.borderColor = BORDER)}
    />
  );
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
      style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM }}
      onFocus={(e) => (e.currentTarget.style.borderColor = CYAN)}
      onBlur={(e)  => (e.currentTarget.style.borderColor = BORDER)}
    />
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: value ? CREAM : MUTED }}
    >
      <option value="">— Seleccionar —</option>
      {options.map((o) => <option key={o} value={o} style={{ backgroundColor: SURFACE2, color: CREAM }}>{o}</option>)}
    </select>
  );
}

function RadioInput({ value, onChange, options, color }: {
  value: string; onChange: (v: string) => void; options: string[]; color?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all"
            style={{
              borderColor: value === o ? (color ?? CYAN) : BORDER,
              backgroundColor: value === o ? `${color ?? CYAN}20` : "transparent",
            }}
          >
            {value === o && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color ?? CYAN }} />}
          </div>
          <input type="radio" className="hidden" checked={value === o} onChange={() => onChange(o)} />
          <span className="text-sm transition-colors" style={{ color: value === o ? CREAM : MUTED }}>
            {o}
          </span>
        </label>
      ))}
    </div>
  );
}

// ── Result View ───────────────────────────────────────────────────────────────

function ResultView({ prompt, onReset }: { prompt: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Extract just the Rendair prompt section for quick copy
  const rendairMatch = prompt.match(/## RENDAIR PROMPT[\s\S]*?(?=\n## |$)/i);
  const rendairSection = rendairMatch ? rendairMatch[0].replace(/## RENDAIR PROMPT.*\n/i, "").trim() : "";

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: CYAN }}>
            Prompt generado para Rendair
          </p>
          <p className="text-sm font-bold mt-0.5" style={{ color: CREAM }}>
            Revisá y copiá el prompt completo o solo la sección Rendair
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${GREEN}18`, border: `1px solid ${GREEN}30` }}>
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M3 8l3 3 7-7" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Full prompt */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-4 py-2 flex items-center justify-between"
          style={{ backgroundColor: SURFACE2, borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>
            Prompt completo
          </span>
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
            style={{ backgroundColor: copied ? `${GREEN}20` : `${CYAN}15`, color: copied ? GREEN : CYAN, border: `1px solid ${copied ? GREEN : CYAN}30` }}
          >
            {copied ? (
              <><svg viewBox="0 0 14 14" fill="none" className="w-3 h-3"><path d="M2 7l3 3 7-7" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Copiado</>
            ) : (
              <><svg viewBox="0 0 14 14" fill="none" className="w-3 h-3"><rect x="4" y="4" width="7" height="7" rx="1" stroke={CYAN} strokeWidth="1.4"/><path d="M2 10V2h8" stroke={CYAN} strokeWidth="1.4" strokeLinecap="round"/></svg>Copiar todo</>
            )}
          </button>
        </div>
        <textarea readOnly value={prompt} rows={18}
          className="w-full px-4 py-3 text-xs leading-relaxed outline-none resize-y font-mono"
          style={{ backgroundColor: BG, color: CREAM, minHeight: 280 }}
        />
      </div>

      {/* Quick Rendair section copy */}
      {rendairSection && (
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${PURPLE}35` }}>
          <div className="px-4 py-2 flex items-center justify-between"
            style={{ backgroundColor: `${PURPLE}12`, borderBottom: `1px solid ${PURPLE}25` }}>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: PURPLE }}>
              Solo el prompt Rendair (copy-paste listo)
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(rendairSection); }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: `${PURPLE}20`, color: PURPLE, border: `1px solid ${PURPLE}30` }}
            >
              Copiar
            </button>
          </div>
          <div className="px-4 py-3 text-xs leading-relaxed font-mono" style={{ backgroundColor: `${PURPLE}08`, color: CREAM }}>
            {rendairSection}
          </div>
        </div>
      )}

      <button onClick={onReset}
        className="self-start text-xs px-4 py-2 rounded-lg transition-all"
        style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: MUTED }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = CREAM)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
      >
        ← Nuevo cuestionario
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AsesorInterno() {
  const [answers,        setAnswers]        = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [phase,          setPhase]          = useState<"questionnaire" | "generating" | "result">("questionnaire");
  const [prompt,         setPrompt]         = useState("");
  const [error,          setError]          = useState("");

  const sectionQuestions = QUESTIONS.filter((q) => q.section === currentSection);
  const sectionColor     = SECTIONS[currentSection].color;
  const isLast           = currentSection === SECTIONS.length - 1;

  const set = (id: string) => (val: string) =>
    setAnswers((prev) => ({ ...prev, [id]: val }));

  const canAdvance = () => {
    const required = sectionQuestions.filter((q) => q.required);
    return required.every((q) => (answers[q.id] ?? "").trim().length > 0);
  };

  const handleGenerate = async () => {
    setPhase("generating");
    setError("");
    try {
      const res  = await fetch("/api/admin/generate-design-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json() as { prompt?: string; error?: string };
      if (!res.ok || data.error) { setError(data.error ?? "Error al generar"); setPhase("questionnaire"); return; }
      setPrompt(data.prompt ?? "");
      setPhase("result");
    } catch {
      setError("Error de conexión con la IA");
      setPhase("questionnaire");
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentSection(0);
    setPhase("questionnaire");
    setPrompt("");
    setError("");
  };

  // ── Result phase ──
  if (phase === "result") {
    return (
      <div className="px-6 py-6 max-w-3xl mx-auto w-full">
        <ResultView prompt={prompt} onReset={handleReset} />
      </div>
    );
  }

  // ── Generating phase ──
  if (phase === "generating") {
    return (
      <div className="px-6 py-20 max-w-3xl mx-auto w-full flex flex-col items-center gap-5">
        <svg className="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={BORDER} strokeWidth="2.5"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <p className="text-sm font-medium text-center" style={{ color: CREAM }}>
          Consultando base de conocimiento y generando prompt…
        </p>
        <p className="text-xs text-center" style={{ color: MUTED }}>
          Esto puede tomar 15–30 segundos
        </p>
      </div>
    );
  }

  // ── Questionnaire phase ──
  const answeredCount = Object.values(answers).filter((v) => v?.trim()).length;
  const progressPct   = Math.round((answeredCount / QUESTIONS.length) * 100);

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto w-full flex flex-col gap-6">

      {/* Progress */}
      <div className="flex flex-col gap-3">
        {/* Section pills */}
        <div className="flex gap-1.5 flex-wrap">
          {SECTIONS.map((s, i) => (
            <button key={i} onClick={() => setCurrentSection(i)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all"
              style={{
                backgroundColor: currentSection === i ? `${s.color}20` : i < currentSection ? `${s.color}10` : "transparent",
                border: `1px solid ${currentSection === i ? s.color : i < currentSection ? `${s.color}40` : BORDER}`,
                color: currentSection === i ? s.color : i < currentSection ? `${s.color}80` : MUTED,
              }}
            >
              {i < currentSection ? "✓ " : ""}{s.label}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative h-1 rounded-full" style={{ backgroundColor: SURFACE2 }}>
          <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: sectionColor }} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold" style={{ color: sectionColor }}>
            Sección {currentSection + 1} de {SECTIONS.length} — {SECTIONS[currentSection].label}
          </p>
          <p className="text-[10px]" style={{ color: MUTED }}>{answeredCount}/{QUESTIONS.length} respondidas</p>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5 rounded-xl p-5"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
        {sectionQuestions.map((q) => (
          <Field key={q.id} label={q.label} required={q.required} color={sectionColor}>
            {q.type === "text"     && <TextInput   value={answers[q.id] ?? ""} onChange={set(q.id)} placeholder={q.placeholder} />}
            {q.type === "textarea" && <TextArea    value={answers[q.id] ?? ""} onChange={set(q.id)} placeholder={q.placeholder} />}
            {q.type === "select"   && <SelectInput value={answers[q.id] ?? ""} onChange={set(q.id)} options={q.options!} />}
            {q.type === "radio"    && <RadioInput  value={answers[q.id] ?? ""} onChange={set(q.id)} options={q.options!} color={sectionColor} />}
          </Field>
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs px-4 py-2.5 rounded-lg" style={{ backgroundColor: `${RED}15`, color: RED }}>
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentSection((p) => Math.max(0, p - 1))}
          disabled={currentSection === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            backgroundColor: currentSection === 0 ? "transparent" : SURFACE2,
            border: `1px solid ${currentSection === 0 ? "transparent" : BORDER}`,
            color: currentSection === 0 ? "transparent" : MUTED,
            cursor: currentSection === 0 ? "default" : "pointer",
          }}
        >
          ← Anterior
        </button>

        {isLast ? (
          <button
            onClick={handleGenerate}
            disabled={!canAdvance()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: canAdvance() ? PURPLE : `${PURPLE}40`,
              color: canAdvance() ? "#fff" : `${PURPLE}80`,
              boxShadow: canAdvance() ? `0 4px 20px ${PURPLE}40` : "none",
              cursor: canAdvance() ? "pointer" : "not-allowed",
            }}
          >
            <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
              <path d="M9 2l1.5 4H15l-3.5 2.5 1.3 4L9 10.5 5.2 12.5l1.3-4L3 6h4.5z"
                stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            Generar prompt para Rendair
          </button>
        ) : (
          <button
            onClick={() => setCurrentSection((p) => Math.min(SECTIONS.length - 1, p + 1))}
            disabled={!canAdvance()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: canAdvance() ? sectionColor : `${sectionColor}40`,
              color: canAdvance() ? (sectionColor === AMBER ? BG : "#fff") : `${sectionColor}80`,
              cursor: canAdvance() ? "pointer" : "not-allowed",
            }}
          >
            Siguiente sección →
          </button>
        )}
      </div>

      {!canAdvance() && (
        <p className="text-[10px] text-center" style={{ color: MUTED }}>
          Completa los campos obligatorios (<span style={{ color: sectionColor }}>*</span>) para continuar
        </p>
      )}
    </div>
  );
}
