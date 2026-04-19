"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { detectLocale, t, getFeatures, getLoadingMessages, getPagePreviews, type Locale } from "@/lib/i18n";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";

// ── Feature card icons (text sourced from i18n) ───────────────────────────────

const FEATURE_ICONS: React.ReactNode[] = [
  (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke={CYAN} strokeWidth="1.5"/>
      <path d="M7 10h6M7 13h4" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="7" r="1.5" fill={CYAN}/>
    </svg>
  ),
  (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M4 10h12M4 6h8M4 14h6" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="15" cy="6" r="2" fill={AMBER} fillOpacity="0.9"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 3v14M3 10h14" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="6" y="6" width="8" height="8" rx="1" stroke={CYAN} strokeWidth="1.2" strokeDasharray="2 1"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="3" y="5" width="14" height="10" rx="1.5" stroke={AMBER} strokeWidth="1.5"/>
      <path d="M7 9h6M7 12h4" stroke={AMBER} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M3 8h14" stroke={AMBER} strokeWidth="1" strokeOpacity="0.5"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 3l1.8 5.5h5.8l-4.7 3.4 1.8 5.6L10 14l-4.7 3.5 1.8-5.6L2.4 8.5h5.8z"
        stroke={CYAN} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" stroke={CYAN} strokeWidth="1.5"/>
      <path d="M10 6v4l3 3" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
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

// ── Loading messages ──────────────────────────────────────────────────────────

function LoadingMessages({ locale }: { locale: Locale }) {
  const messages = getLoadingMessages(locale);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-40 px-8"
      style={{ backgroundColor: "rgba(13,17,23,0.92)", backdropFilter: "blur(8px)" }}
    >
      <svg className="w-10 h-10 animate-spin mb-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={BORDER} strokeWidth="2.5"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      <p
        className="text-sm font-medium text-center leading-relaxed transition-all duration-400"
        style={{
          color: CREAM,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          maxWidth: 280,
        }}
      >
        {messages[index]}
      </p>
      <p className="text-[10px] mt-4" style={{ color: MUTED }}>
        {t(locale, "reportLoadingFooter")}
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ReportePage() {
  const router = useRouter();
  const paddleRef = useRef<Paddle | null>(null);

  const [locale,          setLocale]          = useState<Locale>("es");
  const [hasConversation, setHasConversation] = useState(false);
  const [spaceLabel,      setSpaceLabel]      = useState<string | null>(null);
  const [status,          setStatus]          = useState<"idle" | "paying" | "loading" | "success" | "error">("idle");
  const [errorMsg,        setErrorMsg]        = useState("");
  const [showUpsell,      setShowUpsell]      = useState(false);
  const [upsellStatus,    setUpsellStatus]    = useState<"idle" | "paying" | "loading">("idle");
  const [promptText,      setPromptText]      = useState("");
  const [copied,          setCopied]          = useState(false);

  // Tracks which product is being purchased so eventCallback routes correctly
  const pendingPurchaseType = useRef<"pdf" | "bundle" | "prompt">("pdf");
  // Email captured from Paddle checkout.completed event
  const buyerEmailRef = useRef<string | null>(null);

  // ── Detect locale ────────────────────────────────────────────────────────

  useEffect(() => { setLocale(detectLocale()); }, []);

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

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-acustico-${space.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Send PDF by email if we have the buyer's address (fire-and-forget)
      const email = buyerEmailRef.current;
      if (email) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          fetch("/api/email-reporte", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdfBase64: base64, email, spaceLabel: space, locale }),
          })
            .then((r) => console.log("[Email] status:", r.status))
            .catch((e) => console.error("[Email] failed:", e));
        };
        reader.readAsDataURL(blob);
      }

      setStatus("success");
      setShowUpsell(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al generar el reporte.");
      setStatus("error");
    }
  }, [locale]);

  // ── Generate design prompt (called after prompt purchase) ────────────────

  const generatePrompt = useCallback(async () => {
    setUpsellStatus("loading");

    let messages: Array<{ role: string; text: string }> = [];
    let space = "";

    try {
      const raw = localStorage.getItem("acustega_reporte");
      if (!raw) throw new Error("No hay conversación guardada.");
      const parsed = JSON.parse(raw);
      messages = parsed.messages ?? [];
      space = parsed.spaceLabel ?? "Espacio";
    } catch {
      setUpsellStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/prompt-diseno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, spaceLabel: space }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Error ${res.status}`);
      }

      const data = await res.json() as { prompt: string };
      setPromptText(data.prompt);
      setUpsellStatus("idle");
    } catch {
      setUpsellStatus("idle");
    }
  }, []);

  // ── Initialize Paddle (once only) ───────────────────────────────────────

  // Keep latest callbacks in refs so eventCallback closure never goes stale
  const generateAndDownloadRef = useRef(generateAndDownload);
  useEffect(() => { generateAndDownloadRef.current = generateAndDownload; }, [generateAndDownload]);

  const generatePromptRef = useRef(generatePrompt);
  useEffect(() => { generatePromptRef.current = generatePrompt; }, [generatePrompt]);

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
          // Capture buyer email from Paddle event data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const email = (event.data as any)?.customer?.email as string | undefined;
          if (email) buyerEmailRef.current = email;
          if (pendingPurchaseType.current === "prompt") {
            generatePromptRef.current();
          } else {
            generateAndDownloadRef.current();
          }
        }
        if (event.name === "checkout.closed") {
          if (statusRef.current === "paying") setStatus("idle");
          if (pendingPurchaseType.current === "prompt") setUpsellStatus("idle");
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

  const openCheckout = (priceId: string, type: "pdf" | "bundle") => {
    console.log("[Paddle] openCheckout — priceId:", priceId, "type:", type);

    if (!paddleRef.current) {
      console.error("[Paddle] Not initialized yet");
      return;
    }
    if (status === "loading" || status === "paying") return;

    pendingPurchaseType.current = type;
    setStatus("paying");
    setErrorMsg("");

    try {
      paddleRef.current.Checkout.open({
        items: [{ priceId, quantity: 1 }],
      });
      console.log("[Paddle] Checkout.open() called");
    } catch (err) {
      console.error("[Paddle] Checkout.open() error:", err);
      setStatus("error");
      setErrorMsg("No se pudo abrir el checkout. Ver consola para detalles.");
    }
  };

  const handleBuyPdf    = () => openCheckout(process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!, "pdf");
  const handleBuyBundle = () => {
    console.log("[Bundle] priceId:", process.env.NEXT_PUBLIC_PADDLE_PRICE_BUNDLE_ID);
    openCheckout(process.env.NEXT_PUBLIC_PADDLE_PRICE_BUNDLE_ID!, "bundle");
  };
  const handleBuyPrompt = () => {
    if (!paddleRef.current || upsellStatus === "paying" || upsellStatus === "loading") return;
    pendingPurchaseType.current = "prompt";
    setUpsellStatus("paying");
    try {
      paddleRef.current.Checkout.open({
        items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PROMPT_ID!, quantity: 1 }],
      });
    } catch (err) {
      console.error("[Paddle] Upsell checkout error:", err);
      setUpsellStatus("idle");
    }
  };

  // ── Button helpers ───────────────────────────────────────────────────────

  const isBusy = status === "paying" || status === "loading";

  const DownloadIcon = () => (
    <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
      <path d="M9 2v9M5 7l4 4 4-4" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 13h12" stroke={BG} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const features = getFeatures(locale);
  const pagePreviews = getPagePreviews(locale);

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
            aria-label={t(locale, "back")}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke={CREAM} strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>

          <RingsLogo size={32} />

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-bold leading-tight" style={{ color: CREAM }}>
              {t(locale, "reportHeaderTitle")}
            </span>
            <span className="text-[10px]" style={{ color: CYAN }}>
              ACUSTEGA<span style={{ color: AMBER }}>AI</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold" style={{ color: AMBER }}>$9.99</span>
            <span className="text-[10px] block" style={{ color: MUTED }}>{t(locale, "reportPriceLabel")}</span>
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
            {t(locale, "reportTitle")}<br />
            <span style={{ color: CYAN }}>{t(locale, "reportTitleAccent")}</span>
          </h1>

          <p className="text-sm max-w-xs leading-relaxed" style={{ color: MUTED }}>
            {t(locale, "reportSubtitle")}
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
              {t(locale, "reportSpace")}: {spaceLabel}
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
              {t(locale, "reportNoConversation")}
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
            {t(locale, "reportIncludesLabel")}
          </p>
          <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
            {FEATURE_ICONS.map((icon, i) => (
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
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight" style={{ color: CREAM }}>
                    {features[i]?.title}
                  </p>
                  <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: MUTED }}>
                    {features[i]?.desc}
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
              {t(locale, "reportSuccess")}
            </div>
          )}

          {/* ── Bundle button (highlighted) ── */}
          <button
            onClick={handleBuyBundle}
            disabled={isBusy || !hasConversation || status === "success"}
            className="w-full flex flex-col items-center gap-1 py-4 rounded-xl text-sm font-bold tracking-wide transition-all relative overflow-hidden"
            style={{
              backgroundColor: isBusy || !hasConversation ? `${CYAN}40` : CYAN,
              color: BG,
              boxShadow: !isBusy && hasConversation ? `0 4px 24px ${CYAN}45` : "none",
              opacity: !hasConversation ? 0.5 : 1,
              cursor: !hasConversation || isBusy ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isBusy && hasConversation) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 32px ${CYAN}60`;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 24px ${CYAN}45`;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            {/* Badge */}
            <span
              className="absolute top-0 right-0 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg"
              style={{ backgroundColor: AMBER, color: BG }}
            >
              {t(locale, "reportBundleLabel")}
            </span>
            <span className="flex items-center gap-2">
              {isBusy && status === "paying" ? <Spinner /> : (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                  <path d="M9 2v9M5 7l4 4 4-4" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 13h12" stroke={BG} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              {t(locale, "reportBundleBtn")}
            </span>
            <span className="text-[10px] font-normal opacity-80">
              {t(locale, "reportBundleSubtext")}
            </span>
          </button>

          {/* ── PDF-only button ── */}
          <button
            onClick={handleBuyPdf}
            disabled={isBusy || !hasConversation || status === "success"}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all"
            style={{
              backgroundColor: "transparent",
              border: `1.5px solid ${!hasConversation || isBusy ? AMBER + "40" : AMBER}`,
              color: !hasConversation || isBusy ? `${AMBER}60` : AMBER,
              opacity: !hasConversation ? 0.5 : 1,
              cursor: !hasConversation || isBusy ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isBusy && hasConversation) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${AMBER}12`;
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            {isBusy ? <Spinner /> : <DownloadIcon />}
            {t(locale, "reportPdfBtn")}
          </button>

          <p className="text-[10px] text-center" style={{ color: `${MUTED}60` }}>
            {t(locale, "reportFooter")}
          </p>

          {/* Go to advisor link */}
          {!hasConversation && (
            <button
              onClick={() => router.push("/asesor")}
              className="text-xs font-medium underline"
              style={{ color: CYAN }}
            >
              {t(locale, "goToAdvisor")}
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
              🔧 [DEV] Saltar pago → generar PDF
            </button>
          )}
        </div>

        {/* ── Loading overlay ── */}
        {status === "loading" && <LoadingMessages locale={locale} />}

        {/* ── Upsell overlay ── */}
        {showUpsell && (
          <div
            className="fixed inset-0 flex items-end justify-center z-50 px-4 pb-8"
            style={{ backgroundColor: "rgba(13,17,23,0.85)", backdropFilter: "blur(6px)" }}
          >
            <div
              className="w-full max-w-md rounded-2xl p-6 flex flex-col items-center gap-4"
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER}`,
                boxShadow: `0 -8px 40px rgba(0,0,0,0.6)`,
                animation: "fade-up 0.35s ease-out both",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {promptText ? (
                /* ── Prompt result view ── */
                <>
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase"
                        style={{ color: CYAN }}>{t(locale, "upsellPromptReady")}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: CREAM }}>
                        {t(locale, "upsellPromptSubtitle")}
                      </p>
                    </div>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `#22c55e18`, border: `1px solid #22c55e35` }}
                    >
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <path d="M3 8l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Prompt text box */}
                  <div
                    className="w-full rounded-xl p-4 text-xs leading-relaxed"
                    style={{
                      backgroundColor: `${BG}`,
                      border: `1px solid ${BORDER}`,
                      color: CREAM,
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {promptText}
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(promptText).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2500);
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      backgroundColor: copied ? `#22c55e` : CYAN,
                      color: BG,
                      boxShadow: `0 4px 20px ${copied ? "#22c55e" : CYAN}35`,
                    }}
                  >
                    {copied ? (
                      <>
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                          <path d="M3 8l3 3 7-7" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {t(locale, "upsellCopied")}
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                          <rect x="5" y="5" width="8" height="8" rx="1.2" stroke={BG} strokeWidth="1.6"/>
                          <path d="M3 11V3h8" stroke={BG} strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                        {t(locale, "upsellCopy")}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowUpsell(false)}
                    className="text-xs transition-colors"
                    style={{ color: `${MUTED}70` }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = `${MUTED}70`)}
                  >
                    {t(locale, "upsellClose")}
                  </button>
                </>
              ) : upsellStatus === "loading" ? (
                /* ── Generating state ── */
                <div className="flex flex-col items-center gap-3 py-4">
                  <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke={BORDER} strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke={CYAN} strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm font-medium" style={{ color: CREAM }}>
                    {t(locale, "upsellGenerating")}
                  </p>
                  <p className="text-xs" style={{ color: MUTED }}>
                    {t(locale, "upsellGeneratingDesc")}
                  </p>
                </div>
              ) : (
                /* ── Default upsell view ── */
                <>
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${CYAN}15`, border: `1px solid ${CYAN}30` }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke={CYAN} strokeWidth="1.5"/>
                      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke={CYAN} strokeWidth="1.5"/>
                      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={AMBER} strokeWidth="1.5"/>
                      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke={AMBER} strokeWidth="1.5"/>
                    </svg>
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2"
                      style={{ color: CYAN }}>
                      {t(locale, "upsellStep")}
                    </p>
                    <h2 className="text-lg font-bold leading-snug mb-1.5" style={{ color: CREAM }}>
                      {t(locale, "upsellTitle1")}
                    </h2>
                    <p className="text-base font-bold" style={{ color: CYAN }}>
                      {t(locale, "upsellTitle2")}
                    </p>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: MUTED }}>
                      {t(locale, "upsellDesc")}
                    </p>
                  </div>

                  {/* Buy button */}
                  <button
                    onClick={handleBuyPrompt}
                    disabled={upsellStatus === "paying"}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold tracking-wide transition-all"
                    style={{
                      backgroundColor: upsellStatus === "paying" ? `${AMBER}60` : AMBER,
                      color: BG,
                      boxShadow: upsellStatus !== "paying" ? `0 4px 20px ${AMBER}35` : "none",
                      cursor: upsellStatus === "paying" ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (upsellStatus !== "paying") {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 28px ${AMBER}50`;
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px ${AMBER}35`;
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }}
                  >
                    {upsellStatus === "paying" ? (
                      <><Spinner />{t(locale, "upsellProcessing")}</>
                    ) : (
                      <>
                        <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                          <path d="M9 2l2 5h5l-4 3 1.5 5L9 12l-4.5 3L6 10 2 7h5z"
                            stroke={BG} strokeWidth="1.6" strokeLinejoin="round"/>
                        </svg>
                        {t(locale, "upsellBtn")}
                      </>
                    )}
                  </button>

                  {/* Dismiss */}
                  <button
                    onClick={() => setShowUpsell(false)}
                    className="text-xs transition-colors"
                    style={{ color: `${MUTED}70` }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = `${MUTED}70`)}
                  >
                    {t(locale, "upsellDismiss")}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Sample pages preview ── */}
        <div
          className="px-5 pb-10"
          style={{ animation: "fade-up 0.6s ease-out 0.35s both" }}
        >
          <div className="max-w-md mx-auto">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4 text-center"
              style={{ color: MUTED }}>
              {t(locale, "reportPagesLabel")}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {pagePreviews.map((p, i) => {
                const color = i % 2 === 0 ? CYAN : AMBER;
                return (
                  <div
                    key={p.num}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl"
                    style={{
                      backgroundColor: SURFACE,
                      border: `1px solid ${BORDER}`,
                      width: 80,
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color }}>{p.num}</span>
                    <div
                      className="w-full rounded"
                      style={{ height: 52, backgroundColor: SURFACE2, border: `1px solid ${color}20` }}
                    />
                    <span className="text-[9px] text-center leading-tight" style={{ color: MUTED }}>
                      {p.label}
                    </span>
                  </div>
                );
              })}
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
