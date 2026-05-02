"use client";

import { useState } from "react";

const BG      = "#0D1117";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";

const WORK_TYPES = [
  "Grabación musical", "Podcast / Radio", "Voz en off",
  "Home Studio", "Streaming / Gaming", "Sala de reuniones",
  "Home Office", "Cine en casa",
];
const PEOPLE_OPTIONS = ["1 persona", "2 – 4", "5 – 10", "Más de 10"];
const AESTHETICS     = ["Moderna", "Industrial", "Cálida / Madera", "Minimalista", "Vintage", "Futurista"];
const CONSTRAINTS    = ["Sin restricciones", "Sin demolición", "Techo bajo", "Espacio reducido", "Sin luz natural", "Solo inquilino"];
const BUDGET_OPTIONS = ["Básico < $5M", "$5M – $15M", "$15M – $30M", "Gama alta > $30M"];

interface QuestionnaireData {
  spaceLabel: string;
  projectName: string;
  workTypes: string[];
  peopleCount: string;
  vocalBooth: boolean;
  aesthetics: string[];
  structuralConstraints: string[];
  budgetRange: string;
  specificNotes: string;
}

interface Props {
  initialSpaceLabel?: string;
  messages?: Array<{ role: string; text: string }>;
  onGenerated: (promptText: string) => void;
  onCancel?: () => void;
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
        backgroundColor: selected ? `${color}20` : SURFACE2,
        border: `1px solid ${selected ? color : BORDER}`,
        color: selected ? color : MUTED,
      }}
    >
      {label}
    </button>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold" style={{ color: CREAM }}>{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function InputField({
  label, placeholder, value, onChange, multiline = false,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; multiline?: boolean;
}) {
  const shared = {
    className: "w-full px-3 py-2.5 rounded-lg text-sm outline-none",
    style: { backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM },
    placeholder,
    value,
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold" style={{ color: CREAM }}>{label}</label>
      {multiline ? (
        <textarea
          {...shared}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
        />
      ) : (
        <input
          {...shared}
          type="text"
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default function PromptQuestionnaire({ initialSpaceLabel, messages, onGenerated, onCancel }: Props) {
  const [data, setData] = useState<QuestionnaireData>({
    spaceLabel: initialSpaceLabel || "",
    projectName: "",
    workTypes: [],
    peopleCount: "",
    vocalBooth: false,
    aesthetics: [],
    structuralConstraints: [],
    budgetRange: "",
    specificNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const toggleMulti = (field: "workTypes" | "aesthetics" | "structuralConstraints", value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const setSingle = (field: "peopleCount" | "budgetRange", value: string) => {
    setData((prev) => ({ ...prev, [field]: prev[field] === value ? "" : value }));
  };

  const handleSubmit = async () => {
    const space = data.spaceLabel || initialSpaceLabel;
    if (!space) {
      setError("Indica el tipo de espacio para continuar.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/prompt-diseno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages || [],
          spaceLabel: space,
          questionnaire: {
            projectName:            data.projectName,
            workTypes:              data.workTypes,
            peopleCount:            data.peopleCount,
            vocalBooth:             data.vocalBooth,
            aesthetics:             data.aesthetics,
            structuralConstraints:  data.structuralConstraints,
            budgetRange:            data.budgetRange,
            specificNotes:          data.specificNotes,
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Error ${res.status}`);
      }
      const result = await res.json() as { prompt: string };
      onGenerated(result.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generando el prompt. Intenta de nuevo.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={BORDER} strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke={CYAN} strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-medium" style={{ color: CREAM }}>Generando prompt de diseño...</p>
        <p className="text-xs" style={{ color: MUTED }}>Claude está analizando tus respuestas</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: CYAN }}>
            CUESTIONARIO DE DISEÑO
          </p>
          <p className="text-sm font-bold mt-0.5" style={{ color: CREAM }}>
            Personaliza tu prompt de IA
          </p>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="text-xs transition-colors" style={{ color: `${MUTED}80` }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = `${MUTED}80`)}
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Space label — only shown in standalone mode */}
      {!initialSpaceLabel && (
        <InputField
          label="Tipo de espacio *"
          placeholder="Ej: Estudio de grabación, home studio, sala de reuniones..."
          value={data.spaceLabel}
          onChange={(v) => setData((prev) => ({ ...prev, spaceLabel: v }))}
        />
      )}

      {/* Q1 */}
      <InputField
        label="1. Nombre del proyecto"
        placeholder="Ej: Studio Lulo, Podcast El Café, Sala Norte..."
        value={data.projectName}
        onChange={(v) => setData((prev) => ({ ...prev, projectName: v }))}
      />

      {/* Q2 */}
      <Question label="2. Tipo de trabajo">
        {WORK_TYPES.map((t) => (
          <Tag key={t} label={t} selected={data.workTypes.includes(t)}
            onToggle={() => toggleMulti("workTypes", t)} />
        ))}
      </Question>

      {/* Q3 */}
      <Question label="3. Cantidad de personas">
        {PEOPLE_OPTIONS.map((o) => (
          <Tag key={o} label={o} selected={data.peopleCount === o} accent="amber"
            onToggle={() => setSingle("peopleCount", o)} />
        ))}
      </Question>

      {/* Q4 */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold" style={{ color: CREAM }}>4. ¿Necesitas cabina vocal?</p>
        <div className="flex gap-2">
          <Tag label="No" selected={!data.vocalBooth} accent="amber"
            onToggle={() => setData((prev) => ({ ...prev, vocalBooth: false }))} />
          <Tag label="Sí" selected={data.vocalBooth} accent="amber"
            onToggle={() => setData((prev) => ({ ...prev, vocalBooth: true }))} />
        </div>
      </div>

      {/* Q5 */}
      <Question label="5. Estética visual">
        {AESTHETICS.map((a) => (
          <Tag key={a} label={a} selected={data.aesthetics.includes(a)}
            onToggle={() => toggleMulti("aesthetics", a)} />
        ))}
      </Question>

      {/* Q6 */}
      <Question label="6. Restricciones estructurales">
        {CONSTRAINTS.map((c) => (
          <Tag key={c} label={c} selected={data.structuralConstraints.includes(c)}
            onToggle={() => toggleMulti("structuralConstraints", c)} />
        ))}
      </Question>

      {/* Q7 */}
      <Question label="7. Rango de presupuesto">
        {BUDGET_OPTIONS.map((b) => (
          <Tag key={b} label={b} selected={data.budgetRange === b} accent="amber"
            onToggle={() => setSingle("budgetRange", b)} />
        ))}
      </Question>

      {/* Q8 */}
      <InputField
        label="8. Algo específico a incluir"
        placeholder="Ej: Colores azul marino y dorado, ventana panorámica, iluminación cálida..."
        value={data.specificNotes}
        onChange={(v) => setData((prev) => ({ ...prev, specificNotes: v }))}
        multiline
      />

      {/* Error */}
      {error && (
        <div
          className="px-3 py-2.5 rounded-lg text-xs text-center"
          style={{ backgroundColor: "#ef444415", border: "1px solid #ef444435", color: "#ef4444" }}
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold tracking-wide transition-all"
        style={{
          backgroundColor: CYAN,
          color: BG,
          boxShadow: `0 4px 20px ${CYAN}35`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 28px ${CYAN}55`;
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px ${CYAN}35`;
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        }}
      >
        <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
          <path d="M9 2l2 5h5l-4 3 1.5 5L9 12l-4.5 3L6 10 2 7h5z"
            stroke={BG} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        Generar prompt de diseño
      </button>
    </div>
  );
}
