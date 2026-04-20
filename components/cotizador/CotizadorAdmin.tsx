"use client";

import { useState, useMemo } from "react";
import itemsData from "@/data/items-cotizador.json";

// ── Design tokens ──────────────────────────────────────────────────────────────

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";
const RED     = "#ef4444";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Item {
  id: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  precio: number; // COP
}

interface Categoria {
  id: string;
  nombre: string;
  items: Item[];
}

interface ClientData {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  ciudad: string;
  espacio: string;
  notas: string;
}


// ── Static data ────────────────────────────────────────────────────────────────

const categorias = itemsData.categorias as Categoria[];

const itemMap = new Map<string, Item & { catId: string; catNombre: string }>(
  categorias.flatMap((cat) =>
    cat.items.map((item) => [item.id, { ...item, catId: cat.id, catNombre: cat.nombre }])
  )
);

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

function toCOP(n: number) {
  return n;
}

// ── PDF (client-side print window) ────────────────────────────────────────────

function printQuote(
  client: ClientData,
  lines: Array<{ item: Item & { catId: string; catNombre: string }; qty: number; discount: number }>,
  total: number,
) {
  const fecha = new Date().toLocaleDateString("es-CO", {
    year: "numeric", month: "long", day: "numeric",
  });

  const rows = lines
    .map(({ item, qty, discount }) => {
      const precioCop = toCOP(item.precio);
      const subtotal  = precioCop * qty * (1 - discount / 100);
      const dtoCell   = discount > 0
        ? `<td style="text-align:center;white-space:nowrap;color:#d97706;font-weight:600">−${discount}%</td>`
        : `<td style="text-align:center;color:#aaa">—</td>`;
      return `
        <tr>
          <td>${item.nombre}<br><span style="color:#888;font-size:11px">${item.descripcion}</span></td>
          <td style="text-align:center;white-space:nowrap">${qty}</td>
          <td style="text-align:center;white-space:nowrap">${item.unidad}</td>
          <td style="text-align:right;white-space:nowrap">${fmt(precioCop)}</td>
          ${dtoCell}
          <td style="text-align:right;white-space:nowrap;font-weight:600">${fmt(subtotal)}</td>
        </tr>`;
    })
    .join("");

  const clientFields = [
    ["Nombre",    client.nombre],
    ["Empresa",   client.empresa],
    ["Email",     client.email],
    ["Teléfono",  client.telefono],
    ["Ciudad",    client.ciudad],
    ["Espacio",   client.espacio],
  ]
    .filter(([, v]) => v)
    .map(([l, v]) => `<div class="cf"><label>${l}</label><span>${v}</span></div>`)
    .join("");

  const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>Cotización · ${client.nombre || "Cliente"} · Acustega AI</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; color: #111; font-size: 13px; padding: 36px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start;
            border-bottom: 2.5px solid #00B4D8; padding-bottom:18px; margin-bottom:24px; }
  .brand { font-size:24px; font-weight:900; color:#00B4D8; letter-spacing:-.5px; }
  .brand em { color:#F59E0B; font-style:normal; }
  .brand p  { color:#666; font-size:12px; font-weight:400; margin-top:4px; }
  .meta { text-align:right; font-size:12px; color:#555; line-height:1.7; }
  .meta strong { font-size:14px; color:#111; letter-spacing:.08em; }
  .client-box { background:#f7f8fa; border-radius:8px; padding:14px 18px; margin-bottom:20px; }
  .client-box h3 { font-size:10px; text-transform:uppercase; letter-spacing:.15em; color:#888; margin-bottom:10px; }
  .client-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px 28px; }
  .cf label { font-size:10px; color:#999; display:block; }
  .cf span  { font-weight:600; font-size:13px; }
  table { width:100%; border-collapse:collapse; margin-bottom:20px; }
  thead th { background:#0D1117; color:#fff; padding:9px 12px; font-size:10px;
             text-transform:uppercase; letter-spacing:.1em; }
  thead th:first-child { text-align:left; }
  tbody td { padding:9px 12px; border-bottom:1px solid #eee; vertical-align:top; line-height:1.4; }
  tbody tr:nth-child(even) td { background:#fafafa; }
  .total-row { text-align:right; font-size:15px; font-weight:700; padding:12px 0;
               border-top:2px solid #00B4D8; }
  .total-row span { color:#00B4D8; font-size:20px; }
  .notes { margin-top:20px; padding:14px 16px; background:#fffbeb;
           border-left:4px solid #F59E0B; border-radius:0 8px 8px 0; }
  .notes h4 { font-size:10px; text-transform:uppercase; letter-spacing:.12em; color:#92400e; margin-bottom:6px; }
  .footer { margin-top:36px; border-top:1px solid #e5e7eb; padding-top:12px;
            text-align:center; color:#aaa; font-size:10px; }
  @media print { body { padding:24px; } }
</style>
</head><body>
<div class="header">
  <div>
    <div class="brand">ACUSTEGA<em>AI</em></div>
    <p>Ingeniería Acústica Profesional · Medellín, Colombia</p>
    <p style="margin-top:2px">hola@acustega.com</p>
  </div>
  <div class="meta">
    <strong>COTIZACIÓN</strong><br>
    ${fecha}${client.ciudad ? `<br>Cliente: ${client.ciudad}` : ""}
  </div>
</div>

<div class="client-box">
  <h3>Datos del cliente</h3>
  <div class="client-grid">${clientFields}</div>
</div>

<table>
  <thead><tr>
    <th>Ítem / Descripción</th>
    <th style="text-align:center">Cant.</th>
    <th style="text-align:center">Unidad</th>
    <th style="text-align:right">Precio unit.</th>
    <th style="text-align:center">Dto.</th>
    <th style="text-align:right">Subtotal</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>

<div class="total-row">
  Total: <span>${fmt(total)}</span>
</div>

${client.notas ? `<div class="notes"><h4>Notas</h4><p>${client.notas}</p></div>` : ""}

<div class="footer">
  Cotización generada con Acustega AI · Precios en COP · Válida por 30 días
</div>

<script>window.onload = () => window.print();</script>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

// ── Spinner ────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke={BG} strokeWidth="2.5" strokeOpacity="0.4" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke={BG} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Input helper ───────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, type = "text", placeholder = "", full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  full?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
        style={{ color: MUTED }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none px-3 py-2 rounded-lg"
        style={{
          backgroundColor: SURFACE2,
          border: `1px solid ${focused ? CYAN + "70" : BORDER}`,
          color: CREAM,
          caretColor: CYAN,
        }}
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function CotizadorAdmin() {
  const [client, setClient] = useState<ClientData>({
    nombre: "", empresa: "", email: "", telefono: "",
    ciudad: "", espacio: "", notas: "",
  });

  // itemId → quantity
  const [selected, setSelected] = useState<Record<string, number>>({});

  // itemId → discount %
  const [discounts, setDiscounts] = useState<Record<string, number>>({});

  // which categories are expanded
  const [openCats, setOpenCats] = useState<Set<string>>(
    new Set(categorias.map((c) => c.id))
  );

  const [generatingLink, setGeneratingLink] = useState(false);
  const [wompiUrl, setWompiUrl]             = useState<string | null>(null);
  const [linkError, setLinkError]           = useState("");
  const [copied, setCopied]                 = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedLines = useMemo(
    () =>
      Object.entries(selected)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ item: itemMap.get(id)!, qty, discount: discounts[id] ?? 0 }))
        .filter((l) => l.item),
    [selected, discounts]
  );

  const total = useMemo(
    () => selectedLines.reduce((sum, { item, qty, discount }) => {
      const sub = toCOP(item.precio) * qty;
      return sum + sub * (1 - discount / 100);
    }, 0),
    [selectedLines]
  );

  // group selected lines by category for the summary
  const summaryByCat = useMemo(() => {
    const map = new Map<string, { nombre: string; lines: typeof selectedLines; subtotal: number }>();
    for (const line of selectedLines) {
      const key = line.item.catId;
      if (!map.has(key)) map.set(key, { nombre: line.item.catNombre, lines: [], subtotal: 0 });
      const entry = map.get(key)!;
      entry.lines.push(line);
      entry.subtotal += toCOP(line.item.precio) * line.qty * (1 - line.discount / 100);
    }
    return [...map.values()];
  }, [selectedLines]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const set = (field: keyof ClientData) => (v: string) =>
    setClient((prev) => ({ ...prev, [field]: v }));

  const toggleItem = (id: string) => {
    setSelected((prev) =>
      prev[id] ? (({ [id]: _, ...rest }) => rest)(prev) : { ...prev, [id]: 1 }
    );
    setDiscounts((prev) => {
      if (selected[id]) { const { [id]: _, ...rest } = prev; return rest; }
      return prev;
    });
  };

  const setDiscount = (id: string, pct: number) =>
    setDiscounts((prev) => ({ ...prev, [id]: Math.min(100, Math.max(0, isNaN(pct) ? 0 : pct)) }));

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) setSelected((prev) => (({ [id]: _, ...rest }) => rest)(prev));
    else setSelected((prev) => ({ ...prev, [id]: qty }));
  };

  const toggleCat = (id: string) =>
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handlePdf = () => printQuote(client, selectedLines, total);

  const handleWompiLink = async () => {
    setLinkError("");
    setWompiUrl(null);
    setGeneratingLink(true);
    try {
      const res = await fetch("/api/wompi-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, items: selectedLines.map(({ item, qty, discount }) => ({
          id: item.id, nombre: item.nombre, qty, discount,
          precioUsd: item.precio,
        })), totalUsd: total }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Error generando link");
      setWompiUrl(data.url);
    } catch (e) {
      setLinkError(e instanceof Error ? e.message : "Error generando link de pago");
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyLink = () => {
    if (!wompiUrl) return;
    navigator.clipboard.writeText(wompiUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const hasItems = selectedLines.length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}>

      {/* ── Header ── */}
      <header
        className="flex items-center gap-3 px-6 py-3.5 flex-shrink-0"
        style={{ backgroundColor: SURFACE, borderBottom: `1px solid ${BORDER}` }}
      >
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: MUTED }}>
          ACUSTEGA<span style={{ color: CYAN }}>AI</span>
        </p>
        <span style={{ color: BORDER }}>·</span>
        <span className="text-sm font-semibold" style={{ color: CREAM }}>Cotizador</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
          style={{ backgroundColor: `${AMBER}20`, color: AMBER, border: `1px solid ${AMBER}40` }}>
          Admin
        </span>
      </header>

      {/* ── Two-column body ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: 0 }}>

        {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6"
          style={{ borderRight: `1px solid ${BORDER}` }}>

          {/* ── Client data ── */}
          <section>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4"
              style={{ color: CYAN }}>
              Datos del cliente
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre"    value={client.nombre}   onChange={set("nombre")}   placeholder="Juan García" />
              <Field label="Empresa"   value={client.empresa}  onChange={set("empresa")}  placeholder="Estudios XYZ" />
              <Field label="Email"     value={client.email}    onChange={set("email")}    type="email" placeholder="juan@ejemplo.com" />
              <Field label="Teléfono"  value={client.telefono} onChange={set("telefono")} placeholder="+57 300 000 0000" />
              <Field label="Ciudad"    value={client.ciudad}   onChange={set("ciudad")}   placeholder="Medellín" />
              <Field label="Espacio"   value={client.espacio}  onChange={set("espacio")}  placeholder="Estudio de grabación 30m²" />

              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: MUTED }}>Notas</label>
                <textarea
                  value={client.notas}
                  onChange={(e) => setClient((p) => ({ ...p, notas: e.target.value }))}
                  rows={2}
                  placeholder="Condiciones especiales, descuentos, plazos..."
                  className="w-full bg-transparent text-sm outline-none px-3 py-2 rounded-lg resize-none"
                  style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM, caretColor: CYAN }}
                />
              </div>
            </div>
          </section>

          {/* ── Items by category ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: CYAN }}>
                Ítems
              </p>
              {hasItems && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: `${CYAN}20`, color: CYAN, border: `1px solid ${CYAN}40` }}>
                  {selectedLines.length} seleccionado{selectedLines.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {categorias.map((cat) => {
                const isOpen   = openCats.has(cat.id);
                const catCount = cat.items.filter((i) => selected[i.id]).length;

                return (
                  <div key={cat.id} className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${catCount > 0 ? CYAN + "40" : BORDER}` }}>

                    {/* Category header */}
                    <button
                      onClick={() => toggleCat(cat.id)}
                      className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                      style={{ backgroundColor: catCount > 0 ? `${CYAN}12` : SURFACE }}
                    >
                      <div className="flex items-center gap-2.5">
                        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
                          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                          <path d="M5 3l6 5-6 5" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm font-semibold" style={{ color: CREAM }}>{cat.nombre}</span>
                        <span className="text-[10px]" style={{ color: MUTED }}>
                          {cat.items.length} ítems
                        </span>
                      </div>
                      {catCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: CYAN, color: BG }}>
                          {catCount}
                        </span>
                      )}
                    </button>

                    {/* Items list */}
                    {isOpen && (
                      <div style={{ backgroundColor: SURFACE }}>
                        {cat.items.map((item, idx) => {
                          const isChecked = !!selected[item.id];
                          const qty       = selected[item.id] ?? 1;
                          return (
                            <div
                              key={item.id}
                              className="flex items-start gap-3 px-4 py-3 transition-colors"
                              style={{
                                backgroundColor: isChecked ? `${CYAN}08` : "transparent",
                                borderTop: idx === 0 ? `1px solid ${BORDER}` : `1px solid ${BORDER}40`,
                              }}
                            >
                              {/* Checkbox */}
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                                style={{
                                  backgroundColor: isChecked ? CYAN : "transparent",
                                  border: `1.5px solid ${isChecked ? CYAN : BORDER}`,
                                }}
                              >
                                {isChecked && (
                                  <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                                    <path d="M2 5l2.5 2.5L8 3" stroke={BG} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </button>

                              {/* Name + description */}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold leading-tight" style={{ color: isChecked ? CREAM : `${CREAM}90` }}>
                                  {item.nombre}
                                </p>
                                <p className="text-[10px] leading-snug mt-0.5" style={{ color: MUTED }}>
                                  {item.descripcion}
                                </p>
                              </div>

                              {/* Unit + price */}
                              <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                                <span className="text-[10px]" style={{ color: MUTED }}>{item.unidad}</span>
                                <span className="text-xs font-bold font-mono" style={{ color: isChecked ? AMBER : MUTED }}>
                                  {fmt(toCOP(item.precio))}
                                </span>
                              </div>

                              {/* Qty + Discount inputs */}
                              {isChecked && (
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                  {/* Qty */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => setQty(item.id, qty - 1)}
                                      className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-colors"
                                      style={{ backgroundColor: SURFACE2, color: MUTED, border: `1px solid ${BORDER}` }}
                                    >−</button>
                                    <input
                                      type="number"
                                      min={1}
                                      value={qty}
                                      onChange={(e) => setQty(item.id, parseInt(e.target.value) || 1)}
                                      className="w-10 text-center text-xs font-bold outline-none rounded"
                                      style={{ backgroundColor: SURFACE2, border: `1px solid ${CYAN}50`, color: CYAN, padding: "3px 2px" }}
                                    />
                                    <button
                                      onClick={() => setQty(item.id, qty + 1)}
                                      className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-colors"
                                      style={{ backgroundColor: SURFACE2, color: CYAN, border: `1px solid ${BORDER}` }}
                                    >+</button>
                                  </div>
                                  {/* Discount */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px]" style={{ color: MUTED }}>Dto.</span>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={discounts[item.id] ?? 0}
                                      onChange={(e) => setDiscount(item.id, parseFloat(e.target.value))}
                                      className="w-10 text-center text-xs font-bold outline-none rounded"
                                      style={{ backgroundColor: SURFACE2, border: `1px solid ${AMBER}50`, color: AMBER, padding: "3px 2px" }}
                                    />
                                    <span className="text-[10px]" style={{ color: MUTED }}>%</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ══ RIGHT PANEL — Summary ════════════════════════════════════════════ */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0 overflow-y-auto px-5 py-6 flex flex-col gap-5"
          style={{ backgroundColor: `${SURFACE}80` }}>

          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: CYAN }}>
            Resumen
          </p>

          {/* Client summary */}
          {(client.nombre || client.empresa) && (
            <div className="rounded-xl px-4 py-3" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
              {client.nombre  && <p className="text-sm font-bold" style={{ color: CREAM }}>{client.nombre}</p>}
              {client.empresa && <p className="text-xs" style={{ color: MUTED }}>{client.empresa}</p>}
              {client.email   && <p className="text-xs mt-1" style={{ color: MUTED }}>{client.email}</p>}
              {client.ciudad  && <p className="text-xs" style={{ color: MUTED }}>{client.ciudad}</p>}
            </div>
          )}

          {/* Empty state */}
          {!hasItems && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 opacity-20">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke={CYAN} strokeWidth="1.5" />
                <path d="M8 12h8M8 8h5M8 16h3" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-xs" style={{ color: `${MUTED}60` }}>
                Selecciona ítems del panel izquierdo
              </p>
            </div>
          )}

          {/* Line items */}
          {hasItems && (
            <div className="flex flex-col gap-4">
              {summaryByCat.map((cat) => (
                <div key={cat.nombre}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>
                    {cat.nombre}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {cat.lines.map(({ item, qty, discount }) => {
                      const bruto = toCOP(item.precio) * qty;
                      const sub   = bruto * (1 - discount / 100);
                      return (
                        <div key={item.id} className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-tight truncate" style={{ color: CREAM }}>
                              {item.nombre}
                            </p>
                            <p className="text-[10px]" style={{ color: MUTED }}>
                              {qty} × {fmt(toCOP(item.precio))}
                            </p>
                            {discount > 0 && (
                              <p className="text-[10px] font-semibold" style={{ color: AMBER }}>
                                −{discount}% descuento
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-bold font-mono flex-shrink-0" style={{ color: AMBER }}>
                            {fmt(sub)}
                          </span>
                        </div>
                      );
                    })}
                    {/* Cat subtotal */}
                    <div className="flex justify-between pt-1 border-t text-[11px]"
                      style={{ borderColor: `${BORDER}60` }}>
                      <span style={{ color: MUTED }}>Subtotal {cat.nombre}</span>
                      <span className="font-semibold font-mono" style={{ color: CREAM }}>
                        {fmt(cat.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grand total */}
          {hasItems && (
            <div className="rounded-xl px-4 py-4 mt-auto"
              style={{ backgroundColor: `${CYAN}12`, border: `1.5px solid ${CYAN}35` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: CYAN }}>Total</span>
                <span className="text-xl font-bold font-mono" style={{ color: CYAN }}>
                  {fmt(total)}
                </span>
              </div>
              <p className="text-[10px] mt-1 text-right" style={{ color: `${MUTED}60` }}>
                {selectedLines.length} ítem{selectedLines.length !== 1 ? "s" : ""} · Precios en COP
              </p>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div className="flex flex-col gap-2 pt-1">

            {/* PDF */}
            <button
              onClick={handlePdf}
              disabled={!hasItems}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: hasItems ? CYAN : `${CYAN}30`,
                color: hasItems ? BG : `${CREAM}40`,
                cursor: hasItems ? "pointer" : "not-allowed",
                boxShadow: hasItems ? `0 4px 20px ${CYAN}30` : "none",
              }}
              onMouseEnter={(e) => { if (hasItems) (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 28px ${CYAN}50`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = hasItems ? `0 4px 20px ${CYAN}30` : "none"; }}
            >
              <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                <path d="M9 2v9M5 7l4 4 4-4" stroke={hasItems ? BG : `${CREAM}40`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 14h12" stroke={hasItems ? BG : `${CREAM}40`} strokeWidth="2" strokeLinecap="round" />
              </svg>
              Generar cotización PDF
            </button>

            {/* Wompi */}
            <button
              onClick={handleWompiLink}
              disabled={!hasItems || generatingLink}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1.5px solid ${hasItems && !generatingLink ? AMBER : AMBER + "40"}`,
                color: hasItems && !generatingLink ? AMBER : `${AMBER}40`,
                cursor: !hasItems || generatingLink ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => { if (hasItems && !generatingLink) (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${AMBER}12`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              {generatingLink ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke={AMBER} strokeWidth="2" strokeOpacity="0.3" />
                    <path d="M8 2a6 6 0 0 1 6 6" stroke={AMBER} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Generando link...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                    <path d="M10 3h5v5M13 8l-7 7M5 14H3v-5" stroke={hasItems ? AMBER : `${AMBER}40`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Generar link de pago Wompi
                </>
              )}
            </button>

            {/* Error */}
            {linkError && (
              <p className="text-[11px] text-center px-2" style={{ color: RED }}>{linkError}</p>
            )}

            {/* Wompi link result */}
            {wompiUrl && (
              <div className="rounded-xl p-3 flex flex-col gap-2"
                style={{ backgroundColor: `${AMBER}10`, border: `1px solid ${AMBER}40` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: AMBER }}>
                  Link de pago generado
                </p>
                <p className="text-[11px] break-all font-mono" style={{ color: CREAM }}>{wompiUrl}</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all"
                  style={{
                    backgroundColor: copied ? "#22c55e" : AMBER,
                    color: BG,
                  }}
                >
                  {copied ? (
                    <><svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><path d="M2 7l3 3 7-7" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>¡Copiado!</>
                  ) : (
                    <><svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><rect x="4" y="4" width="7" height="7" rx="1" stroke={BG} strokeWidth="1.5" /><path d="M2 10V2h8" stroke={BG} strokeWidth="1.5" strokeLinecap="round" /></svg>Copiar link</>
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="text-[9px] text-center tracking-[0.2em] uppercase" style={{ color: `${MUTED}30` }}>
            Acustega AI · Admin
          </p>
        </div>
      </div>
    </div>
  );
}
