"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";
const RED     = "#ef4444";

const TIPOS_ESPACIO = [
  { value: "estudio_grabacion", label: "Estudio de grabación" },
  { value: "home_studio",       label: "Home studio" },
  { value: "podcast",           label: "Podcast" },
  { value: "sala_ensayo",       label: "Sala de ensayo" },
  { value: "otro",              label: "Otro" },
];

interface CasoEstudio {
  id: string;
  nombre_proyecto: string;
  ciudad: string;
  tipo_espacio: string;
  dimensiones: string;
  materiales_acusticos: string;
  resultado_medicion: string;
  problemas_encontrados: string;
  solucion_aplicada: string;
  fecha_proyecto: string;
  created_at: string;
}

const EMPTY_FORM = {
  nombre_proyecto:      "",
  ciudad:               "",
  tipo_espacio:         "",
  dimensiones:          "",
  materiales_acusticos: "",
  resultado_medicion:   "",
  problemas_encontrados:"",
  solucion_aplicada:    "",
  fecha_proyecto:       "",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold" style={{ color: CREAM }}>
        {label}{required && <span style={{ color: CYAN }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Input({
  value, onChange, placeholder, type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{
        backgroundColor: SURFACE2,
        border: `1px solid ${BORDER}`,
        color: CREAM,
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = CYAN)}
      onBlur={(e)  => (e.currentTarget.style.borderColor = BORDER)}
    />
  );
}

function Textarea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
      style={{
        backgroundColor: SURFACE2,
        border: `1px solid ${BORDER}`,
        color: CREAM,
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = CYAN)}
      onBlur={(e)  => (e.currentTarget.style.borderColor = BORDER)}
    />
  );
}

// ── Case card ─────────────────────────────────────────────────────────────────

function CasoCard({ caso, onDelete }: { caso: CasoEstudio; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const tipoLabel = TIPOS_ESPACIO.find((t) => t.value === caso.tipo_espacio)?.label ?? caso.tipo_espacio;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: `${CYAN}18`, color: CYAN, border: `1px solid ${CYAN}30` }}
          >
            {tipoLabel}
          </span>
          <span className="text-sm font-bold truncate" style={{ color: CREAM }}>
            {caso.nombre_proyecto}
          </span>
          <span className="text-xs shrink-0" style={{ color: MUTED }}>
            {caso.ciudad}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          {caso.fecha_proyecto && (
            <span className="text-xs" style={{ color: MUTED }}>
              {new Date(caso.fecha_proyecto + "T00:00:00").toLocaleDateString("es-CO", {
                month: "short", year: "numeric",
              })}
            </span>
          )}
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-3.5 h-3.5 transition-transform"
            style={{
              color: MUTED,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div
          className="px-4 pb-4 flex flex-col gap-3"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <div className="pt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {caso.dimensiones && (
              <DetailRow label="Dimensiones" value={caso.dimensiones} />
            )}
            {caso.materiales_acusticos && (
              <DetailRow label="Materiales acústicos" value={caso.materiales_acusticos} />
            )}
            {caso.resultado_medicion && (
              <DetailRow label="Resultado de medición" value={caso.resultado_medicion} />
            )}
            {caso.problemas_encontrados && (
              <DetailRow label="Problemas encontrados" value={caso.problemas_encontrados} />
            )}
            {caso.solucion_aplicada && (
              <DetailRow label="Solución aplicada" value={caso.solucion_aplicada} spanFull />
            )}
          </div>
          <div className="flex justify-end pt-1">
            <button
              onClick={onDelete}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                backgroundColor: `${RED}15`,
                border: `1px solid ${RED}30`,
                color: RED,
              }}
            >
              Eliminar caso
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, spanFull }: { label: string; value: string; spanFull?: boolean }) {
  return (
    <div className={spanFull ? "sm:col-span-2" : ""}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: MUTED }}>
        {label}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: CREAM }}>
        {value}
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CasosEstudio() {
  const [casos,     setCasos]     = useState<CasoEstudio[]>([]);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError,   setAiError]   = useState("");
  const aiFileRef = useRef<HTMLInputElement>(null);

  const loadCasos = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/casos-estudio");
      const data = await res.json() as { casos: CasoEstudio[]; error?: string };
      if (data.error) setError(data.error);
      else setCasos(data.casos);
    } catch {
      setError("Error al cargar casos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCasos(); }, [loadCasos]);

  const set = (field: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre_proyecto || !form.ciudad || !form.tipo_espacio) {
      setError("Nombre del proyecto, ciudad y tipo de espacio son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res  = await fetch("/api/admin/casos-estudio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { caso?: CasoEstudio; error?: string };
      if (data.error) { setError(data.error); return; }
      setForm(EMPTY_FORM);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await loadCasos();
    } catch {
      setError("Error al guardar el caso");
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setAnalyzing(true);
    setAiError("");
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const res  = await fetch("/api/admin/analyze-case", { method: "POST", body: fd });
      const data = await res.json() as { fields?: Record<string, string>; error?: string };
      if (!res.ok || data.error) { setAiError(data.error ?? "Error al analizar"); return; }
      if (data.fields) {
        setForm((prev) => ({
          ...prev,
          nombre_proyecto:      data.fields!.nombre_proyecto      ?? prev.nombre_proyecto,
          ciudad:               data.fields!.ciudad               ?? prev.ciudad,
          tipo_espacio:         data.fields!.tipo_espacio         ?? prev.tipo_espacio,
          dimensiones:          data.fields!.dimensiones          ?? prev.dimensiones,
          materiales_acusticos: data.fields!.materiales_acusticos ?? prev.materiales_acusticos,
          resultado_medicion:   data.fields!.resultado_medicion   ?? prev.resultado_medicion,
          problemas_encontrados:data.fields!.problemas_encontrados?? prev.problemas_encontrados,
          solucion_aplicada:    data.fields!.solucion_aplicada    ?? prev.solucion_aplicada,
        }));
      }
    } catch {
      setAiError("Error de conexión con la IA");
    } finally {
      setAnalyzing(false);
      if (aiFileRef.current) aiFileRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este caso de estudio?")) return;
    try {
      await fetch("/api/admin/casos-estudio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCasos((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Error al eliminar el caso");
    }
  };

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto w-full flex flex-col gap-8">

      {/* Context banner */}
      <div
        className="px-4 py-3 rounded-xl text-xs"
        style={{
          backgroundColor: `${CYAN}10`,
          border: `1px solid ${CYAN}25`,
          color: CYAN,
        }}
      >
        Los casos guardados se inyectan automáticamente como contexto en el prompt de la IA al generar reportes, para que tenga referencia de proyectos reales de Acustega.
      </div>

      {/* ── AI Autofill ── */}
      <div className="flex flex-col gap-3">
        <input
          ref={aiFileRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleAnalyze}
        />
        <button
          type="button"
          onClick={() => aiFileRef.current?.click()}
          disabled={analyzing}
          className="flex items-center gap-2.5 self-start px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            backgroundColor: analyzing ? `#8B5CF620` : `#8B5CF618`,
            border: `1px solid ${analyzing ? "#8B5CF6" : "#8B5CF640"}`,
            color: "#8B5CF6",
            cursor: analyzing ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => { if (!analyzing) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#8B5CF628"; }}
          onMouseLeave={(e) => { if (!analyzing) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#8B5CF618"; }}
        >
          {analyzing ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#8B5CF6" strokeWidth="2" strokeOpacity="0.3"/>
                <path d="M8 2a6 6 0 0 1 6 6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Analizando con IA…
            </>
          ) : (
            <>
              <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                <path d="M9 2l1.5 4H15l-3.5 2.5 1.3 4L9 10.5 5.2 12.5l1.3-4L3 6h4.5z"
                  stroke="#8B5CF6" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Autocompletar con IA
            </>
          )}
        </button>
        {analyzing && (
          <p className="text-xs" style={{ color: "#8B5CF6" }}>
            Subí fotos o un PDF del proyecto · la IA leerá el contenido y llenará el formulario
          </p>
        )}
        {aiError && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: `${RED}15`, color: RED }}>
            {aiError}
          </p>
        )}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4" style={{ color: CYAN }}>
            Agregar caso de estudio
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre del proyecto" required>
              <Input value={form.nombre_proyecto} onChange={set("nombre_proyecto")} placeholder="Ej: Studio Norte Bogotá" />
            </Field>

            <Field label="Ciudad" required>
              <Input value={form.ciudad} onChange={set("ciudad")} placeholder="Ej: Medellín" />
            </Field>

            <Field label="Tipo de espacio" required>
              <select
                value={form.tipo_espacio}
                onChange={(e) => set("tipo_espacio")(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: SURFACE2,
                  border: `1px solid ${BORDER}`,
                  color: form.tipo_espacio ? CREAM : MUTED,
                }}
              >
                <option value="" disabled>Seleccionar tipo...</option>
                {TIPOS_ESPACIO.map((t) => (
                  <option key={t.value} value={t.value} style={{ color: CREAM, backgroundColor: SURFACE2 }}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fecha del proyecto">
              <Input value={form.fecha_proyecto} onChange={set("fecha_proyecto")} type="date" />
            </Field>

            <Field label="Dimensiones del espacio">
              <Input value={form.dimensiones} onChange={set("dimensiones")} placeholder="Ej: 4m x 5m x 2.8m" />
            </Field>

            <Field label="Materiales acústicos usados">
              <Input value={form.materiales_acusticos} onChange={set("materiales_acusticos")} placeholder="Ej: Panel Rockwool 60mm, difusores MDF" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <Field label="Resultado de medición">
              <Textarea value={form.resultado_medicion} onChange={set("resultado_medicion")} placeholder="Ej: RT60 reducido de 1.2s a 0.4s, IACC mejorado..." />
            </Field>

            <Field label="Problemas encontrados">
              <Textarea value={form.problemas_encontrados} onChange={set("problemas_encontrados")} placeholder="Ej: Exceso de reverberación en bajas frecuencias, flutter echo en paredes paralelas..." />
            </Field>

            <Field label="Solución aplicada">
              <Textarea value={form.solucion_aplicada} onChange={set("solucion_aplicada")} placeholder="Ej: Instalación de trampas de graves en esquinas, paneles absorbentes en primera reflexión..." rows={4} />
            </Field>
          </div>
        </div>

        {error && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: `${RED}15`, color: RED }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="self-start px-6 py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            backgroundColor: saving ? `${CYAN}50` : success ? "#22c55e" : CYAN,
            color: BG,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Guardando..." : success ? "¡Guardado!" : "Guardar caso"}
        </button>
      </form>

      {/* ── Cases list ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: CYAN }}>
            Casos guardados
          </p>
          <span className="text-xs" style={{ color: MUTED }}>
            {casos.length} {casos.length === 1 ? "caso" : "casos"}
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-center py-8" style={{ color: MUTED }}>Cargando...</p>
        ) : casos.length === 0 ? (
          <div
            className="text-xs text-center py-10 rounded-xl"
            style={{ border: `1px dashed ${BORDER}`, color: MUTED }}
          >
            No hay casos guardados aún
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {casos.map((caso) => (
              <CasoCard key={caso.id} caso={caso} onDelete={() => handleDelete(caso.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
