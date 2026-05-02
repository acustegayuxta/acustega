"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const PURPLE  = "#8B5CF6";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";
const RED     = "#ef4444";
const GREEN   = "#22c55e";

// ── Shared primitives ─────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold" style={{ color: CREAM }}>
        {label}{required && <span style={{ color: CYAN }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Inp({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM }}
      onFocus={(e) => (e.currentTarget.style.borderColor = CYAN)}
      onBlur={(e)  => (e.currentTarget.style.borderColor = BORDER)}
    />
  );
}

function Txt({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
      style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM }}
      onFocus={(e) => (e.currentTarget.style.borderColor = CYAN)}
      onBlur={(e)  => (e.currentTarget.style.borderColor = BORDER)}
    />
  );
}

function Sel({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: value ? CREAM : MUTED }}
    >
      <option value="">— Seleccionar —</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function SaveBtn({ saving, editingId }: { saving: boolean; editingId: string | null }) {
  return (
    <button type="submit" disabled={saving}
      className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
      style={{ backgroundColor: saving ? `${CYAN}50` : CYAN, color: BG, cursor: saving ? "not-allowed" : "pointer" }}
    >
      {saving ? "Guardando…" : editingId ? "Actualizar" : "Agregar"}
    </button>
  );
}

function StatusBar({ error, success }: { error: string; success: boolean }) {
  if (!error && !success) return null;
  return (
    <div className="px-4 py-2.5 rounded-lg text-xs font-medium"
      style={{ backgroundColor: error ? `${RED}15` : `${GREEN}15`, border: `1px solid ${error ? RED : GREEN}30`, color: error ? RED : GREEN }}>
      {error || "Guardado correctamente"}
    </div>
  );
}

function DeleteBtn({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
      style={{ backgroundColor: `${RED}15`, border: `1px solid ${RED}30`, color: RED, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      Eliminar
    </button>
  );
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
      style={{ backgroundColor: `${AMBER}15`, border: `1px solid ${AMBER}30`, color: AMBER }}
    >
      Editar
    </button>
  );
}

// ── Upload helper ─────────────────────────────────────────────────────────────

async function uploadFiles(files: File[], prefix: string): Promise<string[]> {
  if (!files.length) return [];
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  fd.append("prefix", prefix);
  const res  = await fetch("/api/admin/conocimiento/upload", { method: "POST", body: fd });
  const data = await res.json() as { urls?: string[] };
  return data.urls ?? [];
}

// ── API helpers ───────────────────────────────────────────────────────────────

const api = {
  get:    (tabla: string) =>
    fetch(`/api/admin/conocimiento/${tabla}`).then((r) => r.json()),
  post:   (tabla: string, body: unknown) =>
    fetch(`/api/admin/conocimiento/${tabla}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()),
  put:    (tabla: string, id: string, body: unknown) =>
    fetch(`/api/admin/conocimiento/${tabla}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()),
  delete: (tabla: string, id: string) =>
    fetch(`/api/admin/conocimiento/${tabla}/${id}`, { method: "DELETE" }).then((r) => r.json()),
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Proyecto {
  id: string; nombre: string; tipo_espacio: string; artista: string;
  ciudad: string; pais: string; largo_m: number | null; ancho_m: number | null;
  alto_m: number | null; materiales_usados: string; presupuesto_usd: number | null;
  notas: string; fotos_urls: string[]; estado: string; created_at: string;
}
interface Proveedor {
  id: string; nombre: string; pais: string; ciudad: string; tipo: string;
  categorias_material: string[]; precios_referencia: string;
  contacto_email: string; sitio_web: string; notas: string; activo: boolean; created_at: string;
}
interface Material {
  id: string; nombre: string; tipo: string; marca: string; precio_usd_m2: number | null;
  proveedor_id: string | null; paises_disponibles: string; notas: string; created_at: string;
}
interface Resultado {
  id: string; proyecto_id: string; tipo_problema: string; solucion_aplicada: string;
  rt60_antes_ms: number | null; rt60_despues_ms: number | null; stc_resultado: number | null;
  efectividad: number | null; notas: string; testimonial: string; created_at: string;
}

// ── TIPOS_ESPACIO ─────────────────────────────────────────────────────────────

const TIPOS_ESPACIO = [
  { value: "estudio_grabacion", label: "Estudio de grabación" },
  { value: "home_studio",       label: "Home studio" },
  { value: "sala_ensayo",       label: "Sala de ensayo" },
  { value: "podcast_studio",    label: "Podcast studio" },
  { value: "auditorio",         label: "Auditorio" },
  { value: "sala_mezcla",       label: "Sala de mezcla" },
  { value: "sala_eventos",      label: "Sala de eventos" },
];

const TIPOS_MATERIAL = [
  { value: "absorbente",      label: "Absorbente" },
  { value: "difusor",         label: "Difusor" },
  { value: "aislante",        label: "Aislante" },
  { value: "trampa_graves",   label: "Trampa de graves" },
  { value: "panel_perforado", label: "Panel perforado" },
  { value: "membrana",        label: "Membrana" },
];

const TIPOS_PROBLEMA = [
  { value: "flutter_echo",          label: "Flutter echo" },
  { value: "modos_sala",            label: "Modos de sala" },
  { value: "reverb_excesiva",       label: "Reverb excesiva" },
  { value: "reflexiones_tempranas", label: "Reflexiones tempranas" },
  { value: "comb_filtering",        label: "Comb filtering" },
  { value: "ruido_externo",         label: "Ruido externo" },
  { value: "otro",                  label: "Otro" },
];

// ── ItemHeader: expand/collapse card header ──────────────────────────────────

function ItemHeader({ title, subtitle, tag, tagColor, expanded, onToggle }: {
  title: string; subtitle?: string; tag?: string; tagColor?: string;
  expanded: boolean; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 text-left gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {tag && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: `${tagColor ?? CYAN}18`, color: tagColor ?? CYAN, border: `1px solid ${tagColor ?? CYAN}30` }}>
            {tag}
          </span>
        )}
        <span className="text-sm font-bold truncate" style={{ color: CREAM }}>{title}</span>
        {subtitle && <span className="text-xs shrink-0 hidden sm:block" style={{ color: MUTED }}>{subtitle}</span>}
      </div>
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0 transition-transform"
        style={{ color: MUTED, transform: expanded ? "rotate(180deg)" : "none" }}>
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// ── PROYECTOS TAB ─────────────────────────────────────────────────────────────

const EMPTY_PROYECTO = {
  nombre: "", tipo_espacio: "", artista: "", ciudad: "", pais: "",
  largo_m: "", ancho_m: "", alto_m: "", materiales_usados: "",
  presupuesto_usd: "", notas: "", fotos_urls: [] as string[],
};

function ProyectosTab() {
  const [items,      setItems]      = useState<Proyecto[]>([]);
  const [form,       setForm]       = useState(EMPTY_PROYECTO);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);
  const [expanded,   setExpanded]   = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.get("proyectos") as { data: Proyecto[] };
    setItems(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof EMPTY_PROYECTO) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const reset = () => { setForm(EMPTY_PROYECTO); setEditingId(null); setPendingFiles([]); if (fileRef.current) fileRef.current.value = ""; };

  const handleEdit = (p: Proyecto) => {
    setForm({
      nombre: p.nombre, tipo_espacio: p.tipo_espacio, artista: p.artista ?? "",
      ciudad: p.ciudad ?? "", pais: p.pais ?? "",
      largo_m: p.largo_m?.toString() ?? "", ancho_m: p.ancho_m?.toString() ?? "",
      alto_m: p.alto_m?.toString() ?? "", materiales_usados: p.materiales_usados ?? "",
      presupuesto_usd: p.presupuesto_usd?.toString() ?? "",
      notas: p.notas ?? "", fotos_urls: p.fotos_urls ?? [],
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removePhoto = (url: string) =>
    setForm((p) => ({ ...p, fotos_urls: p.fotos_urls.filter((u) => u !== url) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.tipo_espacio) { setError("Nombre y tipo de espacio son obligatorios"); return; }
    setSaving(true); setError(""); setSuccess(false);
    try {
      const newUrls = await uploadFiles(pendingFiles, "proyectos");
      const payload = {
        nombre: form.nombre, tipo_espacio: form.tipo_espacio, artista: form.artista || null,
        ciudad: form.ciudad || null, pais: form.pais || null,
        largo_m: form.largo_m ? parseFloat(form.largo_m) : null,
        ancho_m: form.ancho_m ? parseFloat(form.ancho_m) : null,
        alto_m:  form.alto_m  ? parseFloat(form.alto_m)  : null,
        materiales_usados: form.materiales_usados || null,
        presupuesto_usd: form.presupuesto_usd ? parseFloat(form.presupuesto_usd) : null,
        notas: form.notas || null,
        fotos_urls: [...form.fotos_urls, ...newUrls],
      };
      const res = editingId
        ? await api.put("proyectos", editingId, payload)
        : await api.post("proyectos", payload);
      if (res.error) { setError(res.error); return; }
      setSuccess(true); reset(); await load();
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Error de conexión"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await api.delete("proyectos", id);
    await load();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <form onSubmit={handleSubmit}
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: editingId ? AMBER : CYAN }}>
          {editingId ? "Editando proyecto" : "Agregar proyecto"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" required><Inp value={form.nombre} onChange={set("nombre")} placeholder="Ej: Studio Oro Medellín" /></Field>
          <Field label="Tipo de espacio" required>
            <Sel value={form.tipo_espacio} onChange={set("tipo_espacio")} options={TIPOS_ESPACIO} />
          </Field>
          <Field label="Artista / Cliente"><Inp value={form.artista} onChange={set("artista")} placeholder="Ej: Feid" /></Field>
          <Field label="Ciudad"><Inp value={form.ciudad} onChange={set("ciudad")} placeholder="Ej: Medellín" /></Field>
          <Field label="País"><Inp value={form.pais} onChange={set("pais")} placeholder="Ej: Colombia" /></Field>
          <Field label="Presupuesto (USD)"><Inp value={form.presupuesto_usd} onChange={set("presupuesto_usd")} type="number" placeholder="0" /></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Largo (m)"><Inp value={form.largo_m} onChange={set("largo_m")} type="number" placeholder="0" /></Field>
          <Field label="Ancho (m)"><Inp value={form.ancho_m} onChange={set("ancho_m")} type="number" placeholder="0" /></Field>
          <Field label="Alto (m)">  <Inp value={form.alto_m}  onChange={set("alto_m")}  type="number" placeholder="0" /></Field>
        </div>
        <Field label="Materiales usados"><Txt value={form.materiales_usados} onChange={set("materiales_usados")} placeholder="Lana mineral 5cm, Bass traps esquinas…" rows={2} /></Field>
        <Field label="Notas"><Txt value={form.notas} onChange={set("notas")} placeholder="Observaciones generales…" /></Field>

        {/* Photos */}
        <Field label="Fotos">
          {form.fotos_urls.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {form.fotos_urls.map((url) => (
                <div key={url} className="relative group">
                  <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover" style={{ border: `1px solid ${BORDER}` }} />
                  <button type="button" onClick={() => removePhoto(url)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: RED, color: "#fff" }}>×</button>
                </div>
              ))}
            </div>
          )}
          <input ref={fileRef} type="file" multiple accept="image/*,application/pdf"
            onChange={(e) => setPendingFiles(Array.from(e.target.files ?? []))}
            className="text-xs" style={{ color: MUTED }} />
          {pendingFiles.length > 0 && (
            <p className="text-[10px]" style={{ color: CYAN }}>{pendingFiles.length} archivo(s) pendiente(s)</p>
          )}
        </Field>

        <StatusBar error={error} success={success} />
        <div className="flex gap-3">
          <SaveBtn saving={saving} editingId={editingId} />
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2.5 rounded-lg text-sm transition-all"
              style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: MUTED }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-xs text-center py-6" style={{ color: MUTED }}>Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: MUTED }}>Sin proyectos aún</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((p) => (
            <div key={p.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
              <ItemHeader title={p.nombre} subtitle={p.artista ?? p.ciudad ?? ""}
                tag={TIPOS_ESPACIO.find((t) => t.value === p.tipo_espacio)?.label ?? p.tipo_espacio}
                tagColor={CYAN} expanded={expanded === p.id} onToggle={() => setExpanded(expanded === p.id ? null : p.id)} />
              {expanded === p.id && (
                <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div className="pt-3 grid grid-cols-2 gap-3 text-xs">
                    {p.ciudad && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Ciudad</p><p style={{ color: CREAM }}>{p.ciudad}{p.pais ? `, ${p.pais}` : ""}</p></div>}
                    {p.presupuesto_usd && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Presupuesto</p><p style={{ color: CREAM }}>${p.presupuesto_usd.toLocaleString()} USD</p></div>}
                    {(p.largo_m || p.ancho_m) && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Dimensiones</p><p style={{ color: CREAM }}>{p.largo_m}m × {p.ancho_m}m × {p.alto_m}m</p></div>}
                    {p.materiales_usados && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Materiales</p><p style={{ color: CREAM }}>{p.materiales_usados}</p></div>}
                    {p.notas && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Notas</p><p style={{ color: CREAM }}>{p.notas}</p></div>}
                  </div>
                  {p.fotos_urls?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.fotos_urls.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover" style={{ border: `1px solid ${BORDER}` }} />
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 justify-end pt-1">
                    <EditBtn onClick={() => handleEdit(p)} />
                    <DeleteBtn onClick={() => handleDelete(p.id)} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PROVEEDORES TAB ───────────────────────────────────────────────────────────

const EMPTY_PROVEEDOR = {
  nombre: "", pais: "", ciudad: "", tipo: "",
  categorias: "", precios_referencia: "", contacto_email: "", sitio_web: "", notas: "",
};

function ProveedoresTab() {
  const [items,     setItems]     = useState<Proveedor[]>([]);
  const [form,      setForm]      = useState(EMPTY_PROVEEDOR);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);
  const [expanded,  setExpanded]  = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.get("proveedores") as { data: Proveedor[] };
    setItems(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof EMPTY_PROVEEDOR) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const reset = () => { setForm(EMPTY_PROVEEDOR); setEditingId(null); };

  const handleEdit = (p: Proveedor) => {
    setForm({
      nombre: p.nombre, pais: p.pais, ciudad: p.ciudad ?? "", tipo: p.tipo,
      categorias: (p.categorias_material ?? []).join(", "),
      precios_referencia: p.precios_referencia ?? "",
      contacto_email: p.contacto_email ?? "", sitio_web: p.sitio_web ?? "", notas: p.notas ?? "",
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.pais || !form.tipo) { setError("Nombre, país y tipo son obligatorios"); return; }
    setSaving(true); setError(""); setSuccess(false);
    try {
      const payload = {
        nombre: form.nombre, pais: form.pais, ciudad: form.ciudad || null, tipo: form.tipo,
        categorias_material: form.categorias.split(",").map((s) => s.trim()).filter(Boolean),
        precios_referencia: form.precios_referencia || null,
        contacto_email: form.contacto_email || null, sitio_web: form.sitio_web || null,
        notas: form.notas || null,
      };
      const res = editingId ? await api.put("proveedores", editingId, payload) : await api.post("proveedores", payload);
      if (res.error) { setError(res.error); return; }
      setSuccess(true); reset(); await load();
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Error de conexión"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este proveedor?")) return;
    await api.delete("proveedores", id);
    await load();
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="rounded-xl p-5 flex flex-col gap-4"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: editingId ? AMBER : CYAN }}>
          {editingId ? "Editando proveedor" : "Agregar proveedor"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" required><Inp value={form.nombre} onChange={set("nombre")} placeholder="Ej: Acoustics Colombia" /></Field>
          <Field label="Tipo" required>
            <Sel value={form.tipo} onChange={set("tipo")} options={[
              { value: "fabricante", label: "Fabricante" },
              { value: "distribuidor", label: "Distribuidor" },
              { value: "importador", label: "Importador" },
            ]} />
          </Field>
          <Field label="País" required><Inp value={form.pais} onChange={set("pais")} placeholder="Colombia" /></Field>
          <Field label="Ciudad"><Inp value={form.ciudad} onChange={set("ciudad")} placeholder="Medellín" /></Field>
          <Field label="Contacto / Email"><Inp value={form.contacto_email} onChange={set("contacto_email")} placeholder="ventas@ejemplo.com" /></Field>
          <Field label="Sitio web"><Inp value={form.sitio_web} onChange={set("sitio_web")} placeholder="https://ejemplo.com" /></Field>
        </div>
        <Field label="Productos (separados por coma)"><Inp value={form.categorias} onChange={set("categorias")} placeholder="lana mineral, espuma acústica, bass traps" /></Field>
        <Field label="Precios de referencia"><Txt value={form.precios_referencia} onChange={set("precios_referencia")} placeholder="Lana mineral 50mm: $8 USD/m²…" rows={2} /></Field>
        <Field label="Notas"><Txt value={form.notas} onChange={set("notas")} rows={2} /></Field>
        <StatusBar error={error} success={success} />
        <div className="flex gap-3">
          <SaveBtn saving={saving} editingId={editingId} />
          {editingId && <button type="button" onClick={reset} className="px-4 py-2.5 rounded-lg text-sm" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: MUTED }}>Cancelar</button>}
        </div>
      </form>

      {loading ? <p className="text-xs text-center py-6" style={{ color: MUTED }}>Cargando…</p> : items.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: MUTED }}>Sin proveedores aún</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((p) => (
            <div key={p.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
              <ItemHeader title={p.nombre} subtitle={`${p.ciudad ?? ""}${p.ciudad && p.pais ? ", " : ""}${p.pais}`}
                tag={p.tipo} tagColor={PURPLE} expanded={expanded === p.id} onToggle={() => setExpanded(expanded === p.id ? null : p.id)} />
              {expanded === p.id && (
                <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div className="pt-3 grid grid-cols-2 gap-3 text-xs">
                    {p.categorias_material?.length > 0 && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Productos</p><p style={{ color: CREAM }}>{p.categorias_material.join(", ")}</p></div>}
                    {p.precios_referencia && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Precios</p><p style={{ color: CREAM }}>{p.precios_referencia}</p></div>}
                    {p.contacto_email && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Email</p><p style={{ color: CREAM }}>{p.contacto_email}</p></div>}
                    {p.sitio_web && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Web</p><a href={p.sitio_web} target="_blank" rel="noopener noreferrer" style={{ color: CYAN }}>{p.sitio_web}</a></div>}
                    {p.notas && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Notas</p><p style={{ color: CREAM }}>{p.notas}</p></div>}
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <EditBtn onClick={() => handleEdit(p)} />
                    <DeleteBtn onClick={() => handleDelete(p.id)} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MATERIALES TAB ────────────────────────────────────────────────────────────

const EMPTY_MATERIAL = {
  nombre: "", tipo: "", marca: "", precio_usd_m2: "",
  proveedor_id: "", paises_disponibles: "", notas: "",
};

function MaterialesTab() {
  const [items,       setItems]       = useState<Material[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form,        setForm]        = useState(EMPTY_MATERIAL);
  const [editingId,   setEditingId]   = useState<string | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);
  const [expanded,    setExpanded]    = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [mRes, pRes] = await Promise.all([api.get("materiales"), api.get("proveedores")]) as [{ data: Material[] }, { data: Proveedor[] }];
    setItems(mRes.data ?? []);
    setProveedores(pRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof EMPTY_MATERIAL) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const reset = () => { setForm(EMPTY_MATERIAL); setEditingId(null); };

  const handleEdit = (m: Material) => {
    setForm({
      nombre: m.nombre, tipo: m.tipo, marca: m.marca ?? "",
      precio_usd_m2: m.precio_usd_m2?.toString() ?? "",
      proveedor_id: m.proveedor_id ?? "",
      paises_disponibles: m.paises_disponibles ?? "", notas: m.notas ?? "",
    });
    setEditingId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.tipo) { setError("Nombre y tipo son obligatorios"); return; }
    setSaving(true); setError(""); setSuccess(false);
    try {
      const payload = {
        nombre: form.nombre, tipo: form.tipo, marca: form.marca || null,
        precio_usd_m2: form.precio_usd_m2 ? parseFloat(form.precio_usd_m2) : null,
        proveedor_id: form.proveedor_id || null,
        paises_disponibles: form.paises_disponibles || null, notas: form.notas || null,
      };
      const res = editingId ? await api.put("materiales", editingId, payload) : await api.post("materiales", payload);
      if (res.error) { setError(res.error); return; }
      setSuccess(true); reset(); await load();
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Error de conexión"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este material?")) return;
    await api.delete("materiales", id);
    await load();
  };

  const proveedorName = (id: string | null) =>
    id ? (proveedores.find((p) => p.id === id)?.nombre ?? id) : "—";

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="rounded-xl p-5 flex flex-col gap-4"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: editingId ? AMBER : CYAN }}>
          {editingId ? "Editando material" : "Agregar material"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" required><Inp value={form.nombre} onChange={set("nombre")} placeholder="Ej: Lana mineral Isover 50mm" /></Field>
          <Field label="Tipo" required><Sel value={form.tipo} onChange={set("tipo")} options={TIPOS_MATERIAL} /></Field>
          <Field label="Marca"><Inp value={form.marca} onChange={set("marca")} placeholder="Isover, Rockwool…" /></Field>
          <Field label="Precio USD/m²"><Inp value={form.precio_usd_m2} onChange={set("precio_usd_m2")} type="number" placeholder="0.00" /></Field>
          <Field label="Proveedor">
            <Sel value={form.proveedor_id} onChange={set("proveedor_id")}
              options={proveedores.map((p) => ({ value: p.id, label: p.nombre }))} />
          </Field>
          <Field label="Países disponibles"><Inp value={form.paises_disponibles} onChange={set("paises_disponibles")} placeholder="Colombia, México, Perú" /></Field>
        </div>
        <Field label="Notas"><Txt value={form.notas} onChange={set("notas")} rows={2} /></Field>
        <StatusBar error={error} success={success} />
        <div className="flex gap-3">
          <SaveBtn saving={saving} editingId={editingId} />
          {editingId && <button type="button" onClick={reset} className="px-4 py-2.5 rounded-lg text-sm" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: MUTED }}>Cancelar</button>}
        </div>
      </form>

      {loading ? <p className="text-xs text-center py-6" style={{ color: MUTED }}>Cargando…</p> : items.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: MUTED }}>Sin materiales aún</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((m) => (
            <div key={m.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
              <ItemHeader title={m.nombre} subtitle={m.marca ?? ""}
                tag={TIPOS_MATERIAL.find((t) => t.value === m.tipo)?.label ?? m.tipo}
                tagColor={AMBER} expanded={expanded === m.id} onToggle={() => setExpanded(expanded === m.id ? null : m.id)} />
              {expanded === m.id && (
                <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div className="pt-3 grid grid-cols-2 gap-3 text-xs">
                    {m.precio_usd_m2 != null && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Precio</p><p style={{ color: CREAM }}>${m.precio_usd_m2}/m²</p></div>}
                    <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Proveedor</p><p style={{ color: CREAM }}>{proveedorName(m.proveedor_id)}</p></div>
                    {m.paises_disponibles && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Países</p><p style={{ color: CREAM }}>{m.paises_disponibles}</p></div>}
                    {m.notas && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Notas</p><p style={{ color: CREAM }}>{m.notas}</p></div>}
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <EditBtn onClick={() => handleEdit(m)} />
                    <DeleteBtn onClick={() => handleDelete(m.id)} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── RESULTADOS TAB ────────────────────────────────────────────────────────────

const EMPTY_RESULTADO = {
  proyecto_id: "", tipo_problema: "", solucion_aplicada: "",
  rt60_antes_ms: "", rt60_despues_ms: "", stc_resultado: "",
  efectividad: "", notas: "", testimonial: "",
};

function ResultadosTab() {
  const [items,     setItems]     = useState<Resultado[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [form,      setForm]      = useState(EMPTY_RESULTADO);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);
  const [expanded,  setExpanded]  = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [rRes, pRes] = await Promise.all([api.get("resultados"), api.get("proyectos")]) as [{ data: Resultado[] }, { data: Proyecto[] }];
    setItems(rRes.data ?? []);
    setProyectos(pRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof EMPTY_RESULTADO) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const reset = () => { setForm(EMPTY_RESULTADO); setEditingId(null); };

  const handleEdit = (r: Resultado) => {
    setForm({
      proyecto_id: r.proyecto_id, tipo_problema: r.tipo_problema,
      solucion_aplicada: r.solucion_aplicada ?? "",
      rt60_antes_ms: r.rt60_antes_ms?.toString() ?? "",
      rt60_despues_ms: r.rt60_despues_ms?.toString() ?? "",
      stc_resultado: r.stc_resultado?.toString() ?? "",
      efectividad: r.efectividad?.toString() ?? "",
      notas: r.notas ?? "", testimonial: r.testimonial ?? "",
    });
    setEditingId(r.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.proyecto_id || !form.tipo_problema || !form.solucion_aplicada) {
      setError("Proyecto, tipo de problema y solución son obligatorios"); return;
    }
    setSaving(true); setError(""); setSuccess(false);
    try {
      const payload = {
        proyecto_id: form.proyecto_id, tipo_problema: form.tipo_problema,
        solucion_aplicada: form.solucion_aplicada,
        rt60_antes_ms:  form.rt60_antes_ms  ? parseInt(form.rt60_antes_ms)  : null,
        rt60_despues_ms: form.rt60_despues_ms ? parseInt(form.rt60_despues_ms) : null,
        stc_resultado:  form.stc_resultado  ? parseInt(form.stc_resultado)  : null,
        efectividad:    form.efectividad    ? parseInt(form.efectividad)    : null,
        notas: form.notas || null, testimonial: form.testimonial || null,
      };
      const res = editingId ? await api.put("resultados", editingId, payload) : await api.post("resultados", payload);
      if (res.error) { setError(res.error); return; }
      setSuccess(true); reset(); await load();
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Error de conexión"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este resultado?")) return;
    await api.delete("resultados", id);
    await load();
  };

  const proyectoName = (id: string) =>
    proyectos.find((p) => p.id === id)?.nombre ?? id;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="rounded-xl p-5 flex flex-col gap-4"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: editingId ? AMBER : CYAN }}>
          {editingId ? "Editando resultado" : "Agregar resultado"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Proyecto" required>
            <Sel value={form.proyecto_id} onChange={set("proyecto_id")}
              options={proyectos.map((p) => ({ value: p.id, label: p.nombre }))} />
          </Field>
          <Field label="Tipo de problema" required>
            <Sel value={form.tipo_problema} onChange={set("tipo_problema")} options={TIPOS_PROBLEMA} />
          </Field>
          <Field label="RT60 antes (ms)"><Inp value={form.rt60_antes_ms} onChange={set("rt60_antes_ms")} type="number" placeholder="800" /></Field>
          <Field label="RT60 después (ms)"><Inp value={form.rt60_despues_ms} onChange={set("rt60_despues_ms")} type="number" placeholder="350" /></Field>
          <Field label="STC resultado"><Inp value={form.stc_resultado} onChange={set("stc_resultado")} type="number" placeholder="52" /></Field>
          <Field label="Efectividad (1–10)"><Inp value={form.efectividad} onChange={set("efectividad")} type="number" placeholder="8" /></Field>
        </div>
        <Field label="Solución aplicada" required><Txt value={form.solucion_aplicada} onChange={set("solucion_aplicada")} placeholder="Describe la solución implementada…" rows={3} /></Field>
        <Field label="Notas internas"><Txt value={form.notas} onChange={set("notas")} rows={2} /></Field>
        <Field label="Testimonial del cliente"><Txt value={form.testimonial} onChange={set("testimonial")} placeholder='"El sonido mejoró notablemente…" — Nombre, Proyecto' rows={2} /></Field>
        <StatusBar error={error} success={success} />
        <div className="flex gap-3">
          <SaveBtn saving={saving} editingId={editingId} />
          {editingId && <button type="button" onClick={reset} className="px-4 py-2.5 rounded-lg text-sm" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: MUTED }}>Cancelar</button>}
        </div>
      </form>

      {loading ? <p className="text-xs text-center py-6" style={{ color: MUTED }}>Cargando…</p> : items.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: MUTED }}>Sin resultados aún</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((r) => (
            <div key={r.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
              <ItemHeader title={proyectoName(r.proyecto_id)}
                tag={TIPOS_PROBLEMA.find((t) => t.value === r.tipo_problema)?.label ?? r.tipo_problema}
                tagColor={PURPLE} subtitle={r.efectividad != null ? `${r.efectividad}/10` : ""}
                expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />
              {expanded === r.id && (
                <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div className="pt-3 grid grid-cols-2 gap-3 text-xs">
                    {r.rt60_antes_ms != null && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>RT60 antes</p><p style={{ color: CREAM }}>{r.rt60_antes_ms} ms</p></div>}
                    {r.rt60_despues_ms != null && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>RT60 después</p><p style={{ color: GREEN }}>{r.rt60_despues_ms} ms</p></div>}
                    {r.stc_resultado != null && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>STC</p><p style={{ color: CREAM }}>{r.stc_resultado}</p></div>}
                    {r.efectividad != null && <div><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Efectividad</p><p style={{ color: AMBER }}>{r.efectividad}/10</p></div>}
                    {r.solucion_aplicada && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Solución</p><p style={{ color: CREAM }}>{r.solucion_aplicada}</p></div>}
                    {r.notas && <div className="col-span-2"><p className="font-bold uppercase tracking-widest text-[9px] mb-0.5" style={{ color: MUTED }}>Notas</p><p style={{ color: CREAM }}>{r.notas}</p></div>}
                    {r.testimonial && <div className="col-span-2 rounded-lg p-3" style={{ backgroundColor: `${AMBER}10`, border: `1px solid ${AMBER}25` }}><p className="font-bold uppercase tracking-widest text-[9px] mb-1" style={{ color: AMBER }}>Testimonial</p><p className="text-xs italic" style={{ color: CREAM }}>{r.testimonial}</p></div>}
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <EditBtn onClick={() => handleEdit(r)} />
                    <DeleteBtn onClick={() => handleDelete(r.id)} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

type SubTab = "proyectos" | "proveedores" | "materiales" | "resultados";

const SUB_TABS: { value: SubTab; label: string; color: string }[] = [
  { value: "proyectos",   label: "Proyectos",   color: CYAN   },
  { value: "proveedores", label: "Proveedores", color: PURPLE },
  { value: "materiales",  label: "Materiales",  color: AMBER  },
  { value: "resultados",  label: "Resultados",  color: GREEN  },
];

export default function BaseConocimiento() {
  const [subTab, setSubTab] = useState<SubTab>("proyectos");

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto w-full">
      {/* Sub-tab bar */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {SUB_TABS.map((t) => (
          <button key={t.value} onClick={() => setSubTab(t.value)}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              backgroundColor: subTab === t.value ? `${t.color}20` : "transparent",
              border: `1px solid ${subTab === t.value ? t.color : "transparent"}`,
              color: subTab === t.value ? t.color : MUTED,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "proyectos"   && <ProyectosTab />}
      {subTab === "proveedores" && <ProveedoresTab />}
      {subTab === "materiales"  && <MaterialesTab />}
      {subTab === "resultados"  && <ResultadosTab />}
    </div>
  );
}
