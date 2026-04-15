"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";

// ── Feature cards ────────────────────────────────────────────────────────────

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke={CYAN} strokeWidth="1.5"/>
        <path d="M7 10h6M7 13h4" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="10" cy="7" r="1.5" fill={CYAN}/>
      </svg>
    ),
    title: "Diagnóstico acústico",
    desc: "Resumen detallado de los problemas identificados en tu espacio.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M4 10h12M4 6h8M4 14h6" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="15" cy="6" r="2" fill={AMBER} fillOpacity="0.9"/>
      </svg>
    ),
    title: "Plan de tratamiento",
    desc: "Recomendaciones específicas de aislamiento, absorción y difusión.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M10 3v14M3 10h14" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="6" y="6" width="8" height="8" rx="1" stroke={CYAN} strokeWidth="1.2" strokeDasharray="2 1"/>
      </svg>
    ),
    title: "Lista de materiales",
    desc: "Materiales recomendados con proveedores locales por país.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <rect x="3" y="5" width="14" height="10" rx="1.5" stroke={AMBER} strokeWidth="1.5"/>
        <path d="M7 9h6M7 12h4" stroke={AMBER} strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M3 8h14" stroke={AMBER} strokeWidth="1" strokeOpacity="0.5"/>
      </svg>
    ),
    title: "Tabla de presupuesto",
    desc: "Rangos de costo en USD con opciones económicas y premium.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M10 3l1.8 5.5h5.8l-4.7 3.4 1.8 5.6L10 14l-4.7 3.5 1.8-5.6L2.4 8.5h5.8z"
          stroke={CYAN} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Próximos pasos",
    desc: "Plan de acción numerado para implementar las mejoras acústicas.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="7" stroke={CYAN} strokeWidth="1.5"/>
        <path d="M10 6v4l3 3" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Portada profesional",
    desc: "Reporte con marca Acustega AI, espacio, ciudad y fecha.",
  },
];

// ── Rings logo ────────────────────────────────────────────────────────────────

function RingsLogo({ size = 56 }: { size?: number }) {
  const cx = size / 2;
  const r1 = size * 0.42;
  const r2 = size * 0.30;
  const r3 = size * 0.18;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <defs>
        <radialGradient id="rp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={CYAN} stopOpacity="0.18" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0"    />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cx} r={cx} fill="url(#rp-glow)" />
      <circle cx={cx} cy={cx} r={r1} stroke={CYAN} strokeWidth="1.2" strokeDasharray="8 4"
        style={{ transformOrigin: `${cx}px ${cx}px`, animation: "rp-outer 4s ease-in-out infinite 0.8s" }} />
      <circle cx={cx} cy={cx} r={r2} stroke={CYAN} strokeWidth="1.5" strokeDasharray="5 3"
        style={{ transformOrigin: `${cx}px ${cx}px`, animation: "rp-mid 3.2s ease-in-out infinite 0.4s" }} />
      <circle cx={cx} cy={cx} r={r3} stroke={CYAN} strokeWidth="2"
        style={{ transformOrigin: `${cx}px ${cx}px`, animation: "rp-inner 2.5s ease-in-out infinite" }} />
      <circle cx={cx} cy={cx} r={size * 0.045} fill={CYAN}
        style={{ transformOrigin: `${cx}px ${cx}px`, animation: "rp-inner 2.5s ease-in-out infinite" }} />
    </svg>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke={BG} strokeWidth="2.5" strokeOpacity="0.3"/>
      <path d="M8 2a6 6 0 0 1 6 6" stroke={BG} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ReportePage() {
  const router = useRouter();
  const paddleRef = useRef<Paddle | null>(null);

  const [hasConversation, setHasConversation] = useState(false);
  const [spaceLabel, setSpaceLabel] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "paying" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Load conversation from localStorage ──────────────────────────────────

  useEffect(() => {
    try {
      const raw = localStorage.getItem("acustega_reporte");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.messages && parsed.messages.length > 0) {
          setHasConversation(true);
          setSpaceLabel(parsed.spaceLabel ?? null);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // ── Generate and download PDF (called after payment) ─────────────────────

  const generateAndDownload = useCallback(async () => {
    let messages: Array<{ role: string; text: string }> = [];
    let space = "";

    try {
      const raw = localStorage.getItem("acustega_reporte");
      if (!raw) throw new Error("No hay conversación guardada.");
      const parsed = JSON.parse(raw);
      messages = parsed.messages ?? [];
      space = parsed.spaceLabel ?? "Espacio";
    } catch {
      setErrorMsg("No se encontró la conversación. Ve al asesor primero.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, spaceLabel: space }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Error ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-acustico-${space.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al generar el reporte.");
      setStatus("error");
    }
  }, []);

  // ── Initialize Paddle (once only) ───────────────────────────────────────

  // Keep latest callback in a ref so the eventCallback closure never goes stale
  const generateAndDownloadRef = useRef(generateAndDownload);
  useEffect(() => { generateAndDownloadRef.current = generateAndDownload; }, [generateAndDownload]);

  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    console.log("[Paddle] Initializing — environment: sandbox");
    console.log("[Paddle] Client token:", process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);

    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: "dark",
          locale: "es",
        },
      },
      eventCallback(event) {
        console.log("[Paddle] Event:", event.name, event);
        if (event.name === "checkout.completed") {
          generateAndDownloadRef.current();
        }
        if (event.name === "checkout.closed" && statusRef.current === "paying") {
          setStatus("idle");
        }
      },
    })
      .then((paddle) => {
        if (paddle) {
          console.log("[Paddle] Initialized OK:", paddle);
          paddleRef.current = paddle;
        } else {
          console.error("[Paddle] initializePaddle returned null/undefined");
        }
      })
      .catch((err) => {
        console.error("[Paddle] Initialization error:", err);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once — refs keep callbacks fresh

  // ── DEV bypass: skip checkout ────────────────────────────────────────────

  const handleBypass = () => {
    console.log("[DEV] Skipping Paddle checkout — calling generateAndDownload directly");
    generateAndDownloadRef.current();
  };

  // ── Open Paddle checkout ─────────────────────────────────────────────────

  const handleBuy = () => {
    console.log("[Paddle] handleBuy — paddleRef:", paddleRef.current);
    console.log("[Paddle] Price ID:", process.env.NEXT_PUBLIC_PADDLE_PRICE_ID);

    if (!paddleRef.current) {
      console.error("[Paddle] Not initialized yet");
      return;
    }
    if (status === "loading" || status === "paying") return;

    setStatus("paying");
    setErrorMsg("");

    try {
      paddleRef.current.Checkout.open({
        items: [
          {
            priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!,
            quantity: 1,
          },
        ],
      });
      console.log("[Paddle] Checkout.open() called");
    } catch (err) {
      console.error("[Paddle] Checkout.open() error:", err);
      setStatus("error");
      setErrorMsg("No se pudo abrir el checkout. Ver consola para detalles.");
    }
  };

  // ── Button label helpers ─────────────────────────────────────────────────

  const isBusy = status === "paying" || status === "loading";

  const buttonLabel = () => {
    if (status === "loading") return (
      <><Spinner />Generando reporte...</>
    );
    if (status === "paying") return (
      <><Spinner />Procesando pago...</>
    );
    return (
      <>
        <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
          <path d="M9 2v9M5 7l4 4 4-4" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 13h12" stroke={BG} strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Descargar reporte · $9.99
      </>
    );
  };

  return (
    <>
      <style>{`
        @keyframes rp-outer  { 0%,100%{opacity:.35} 50%{opacity:.08} }
        @keyframes rp-mid    { 0%,100%{opacity:.60} 50%{opacity:.15} }
        @keyframes rp-inner  { 0%,100%{opacity:.90} 50%{opacity:.30} }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
      >
        {/* ── Header ── */}
        <header
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
        >
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ backgroundColor: `${BORDER}60` }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${CYAN}20`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${BORDER}60`)}
            aria-label="Volver"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke={CREAM} strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>

          <RingsLogo size={32} />

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-bold leading-tight" style={{ color: CREAM }}>
              Reporte Acústico
            </span>
            <span className="text-[10px]" style={{ color: CYAN }}>
              ACUSTEGA<span style={{ color: AMBER }}>AI</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold" style={{ color: AMBER }}>$9.99</span>
            <span className="text-[10px] block" style={{ color: MUTED }}>USD</span>
          </div>
        </header>

        {/* ── Hero section ── */}
        <div
          className="flex flex-col items-center px-5 py-10 text-center"
          style={{ animation: "fade-up 0.6s ease-out both" }}
        >
          <div className="mb-5">
            <RingsLogo size={72} />
          </div>

          <h1 className="text-2xl font-bold leading-snug mb-2" style={{ color: CREAM }}>
            Reporte Profesional<br />
            <span style={{ color: CYAN }}>de Acústica</span>
          </h1>

          <p className="text-sm max-w-xs leading-relaxed" style={{ color: MUTED }}>
            Genera un PDF completo con diagnóstico, plan de tratamiento, materiales y presupuesto
            basado en tu conversación con el asesor.
          </p>

          {spaceLabel && (
            <div
              className="mt-4 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${CYAN}15`,
                border: `1px solid ${CYAN}35`,
                color: CYAN,
              }}
            >
              Espacio: {spaceLabel}
            </div>
          )}

          {!hasConversation && (
            <div
              className="mt-4 px-4 py-2 rounded-xl text-xs"
              style={{
                backgroundColor: `${AMBER}12`,
                border: `1px solid ${AMBER}30`,
                color: AMBER,
              }}
            >
              Completa una consulta con el asesor antes de generar el reporte.
            </div>
          )}
        </div>

        {/* ── Feature grid ── */}
        <div
          className="px-5 pb-6"
          style={{ animation: "fade-up 0.6s ease-out 0.1s both" }}
        >
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4 text-center"
            style={{ color: MUTED }}>
            Incluye
          </p>
          <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-3.5 rounded-xl"
                style={{
                  backgroundColor: SURFACE,
                  border: `1px solid ${BORDER}`,
                  animation: `fade-up 0.5s ease-out ${0.05 * i + 0.15}s both`,
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${CYAN}12` }}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight" style={{ color: CREAM }}>
                    {f.title}
                  </p>
                  <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: MUTED }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA section ── */}
        <div
          className="px-5 pb-10 flex flex-col items-center gap-3 max-w-md mx-auto w-full"
          style={{ animation: "fade-up 0.6s ease-out 0.3s both" }}
        >
          {/* Error message */}
          {status === "error" && (
            <div
              className="w-full px-4 py-3 rounded-xl text-xs text-center"
              style={{
                backgroundColor: `#ef444415`,
                border: `1px solid #ef444435`,
                color: "#ef4444",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Success message */}
          {status === "success" && (
            <div
              className="w-full px-4 py-3 rounded-xl text-xs text-center font-medium"
              style={{
                backgroundColor: `#22c55e15`,
                border: `1px solid #22c55e35`,
                color: "#22c55e",
              }}
            >
              ✓ Reporte descargado exitosamente
            </div>
          )}

          {/* Buy / Download button */}
          <button
            onClick={handleBuy}
            disabled={isBusy || !hasConversation || status === "success"}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold tracking-wide transition-all"
            style={{
              backgroundColor: isBusy || !hasConversation ? `${AMBER}60` : AMBER,
              color: BG,
              boxShadow: !isBusy && hasConversation ? `0 4px 20px ${AMBER}35` : "none",
              opacity: !hasConversation ? 0.5 : 1,
              cursor: !hasConversation || isBusy ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isBusy && hasConversation) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 28px ${AMBER}50`;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px ${AMBER}35`;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            {buttonLabel()}
          </button>

          <p className="text-[10px] text-center" style={{ color: `${MUTED}60` }}>
            Pago seguro con Paddle · PDF generado con IA · Acustega AI
          </p>

          {/* Go to advisor link */}
          {!hasConversation && (
            <button
              onClick={() => router.push("/asesor")}
              className="text-xs font-medium underline"
              style={{ color: CYAN }}
            >
              Ir al asesor →
            </button>
          )}

          {/* DEV bypass — skip Paddle and generate PDF directly */}
          {process.env.NODE_ENV === "development" && (
            <button
              onClick={handleBypass}
              disabled={!hasConversation || status === "loading"}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1px dashed #6b7280`,
                color: "#6b7280",
                opacity: !hasConversation ? 0.4 : 1,
                cursor: !hasConversation ? "not-allowed" : "pointer",
              }}
            >
              ⚙ [DEV] Saltar pago → generar PDF
            </button>
          )}
        </div>

        {/* ── Sample pages preview ── */}
        <div
          className="px-5 pb-10"
          style={{ animation: "fade-up 0.6s ease-out 0.35s both" }}
        >
          <div className="max-w-md mx-auto">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4 text-center"
              style={{ color: MUTED }}>
              Páginas del reporte
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {[
                { num: "01", label: "Portada",        color: CYAN  },
                { num: "02", label: "Diagnóstico",    color: CYAN  },
                { num: "03", label: "Tratamiento",    color: AMBER },
                { num: "04", label: "Materiales",     color: CYAN  },
                { num: "05", label: "Presupuesto",    color: AMBER },
                { num: "06", label: "Próximos pasos", color: CYAN  },
              ].map((p) => (
                <div
                  key={p.num}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl"
                  style={{
                    backgroundColor: SURFACE,
                    border: `1px solid ${BORDER}`,
                    width: 80,
                  }}
                >
                  <span className="text-xs font-bold" style={{ color: p.color }}>{p.num}</span>
                  <div
                    className="w-full rounded"
                    style={{ height: 52, backgroundColor: SURFACE2, border: `1px solid ${p.color}20` }}
                  />
                  <span className="text-[9px] text-center leading-tight" style={{ color: MUTED }}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-5 text-center" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: `${MUTED}40` }}>
            Acustega AI · Medellín, Colombia
          </p>
        </div>
      </main>
    </>
  );
}
