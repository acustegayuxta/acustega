"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";

// ── Types ──────────────────────────────────────────────────────────────────

type Role = "assistant" | "user";

interface Message {
  id: number;
  role: Role;
  text: string;
}

interface Space {
  id: string;
  label: string;
  emoji: string;
  subtitle: string;
}

// ── Data ───────────────────────────────────────────────────────────────────

const SPACES: Space[] = [
  { id: "estudio",        label: "Estudio",        emoji: "🎙️", subtitle: "Grabación profesional"  },
  { id: "home-studio",    label: "Home Studio",    emoji: "🎧", subtitle: "Producción en casa"      },
  { id: "iglesia",        label: "Iglesia",        emoji: "🏛️", subtitle: "Espacios de culto"       },
  { id: "restaurante",    label: "Restaurante",    emoji: "🔉", subtitle: "Ambiente y confort"      },
  { id: "sonido-en-vivo", label: "Sonido en vivo", emoji: "🎤", subtitle: "Eventos y conciertos"    },
  { id: "oficina",        label: "Oficina",        emoji: "🔇", subtitle: "Productividad y foco"    },
  { id: "industrial",     label: "Industrial",     emoji: "⚙️", subtitle: "Control de ruido"        },
];

// ── API helper ──────────────────────────────────────────────────────────────

async function streamAssistantReply(
  messages: Message[],
  spaceLabel: string,
  onChunk: (chunk: string) => void,
  photo?: string | null
): Promise<void> {
  const res = await fetch("/api/asesor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, spaceLabel, ...(photo ? { photo } : {}) }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `API error ${res.status}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

// ── Rings logo ──────────────────────────────────────────────────────────────

function RingsLogo({ size = 72 }: { size?: number }) {
  const cx = size / 2;
  const r1 = size * 0.42;
  const r2 = size * 0.30;
  const r3 = size * 0.18;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <defs>
        <radialGradient id="rl-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={CYAN} stopOpacity="0.18" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0"    />
        </radialGradient>
        <filter id="rl-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cx} r={cx} fill="url(#rl-glow)" />
      {/* Outer ring */}
      <circle cx={cx} cy={cx} r={r1} stroke={CYAN} strokeWidth="1.2" strokeDasharray="10 5"
        style={{ transformOrigin: `${cx}px ${cx}px`, animation: "rl-outer 4s ease-in-out infinite 0.8s" }} />
      {/* Mid ring */}
      <circle cx={cx} cy={cx} r={r2} stroke={CYAN} strokeWidth="1.6" strokeDasharray="6 3"
        style={{ transformOrigin: `${cx}px ${cx}px`, animation: "rl-mid 3.2s ease-in-out infinite 0.4s" }} />
      {/* Inner ring */}
      <circle cx={cx} cy={cx} r={r3} stroke={CYAN} strokeWidth="2"
        style={{ transformOrigin: `${cx}px ${cx}px`, animation: "rl-inner 2.5s ease-in-out infinite" }} />
      {/* Center dot */}
      <circle cx={cx} cy={cx} r={size * 0.045} fill={CYAN} filter="url(#rl-blur)"
        style={{ transformOrigin: `${cx}px ${cx}px`, animation: "rl-inner 2.5s ease-in-out infinite" }} />
    </svg>
  );
}

// ── Space card ──────────────────────────────────────────────────────────────

function SpaceCard({ space, onSelect }: { space: Space; onSelect: (s: Space) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(space)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-150"
      style={{
        backgroundColor: hovered ? SURFACE2 : SURFACE,
        borderTop:    `1px solid ${hovered ? CYAN + "50" : BORDER}`,
        borderRight:  `1px solid ${hovered ? CYAN + "50" : BORDER}`,
        borderBottom: `1px solid ${hovered ? CYAN + "50" : BORDER}`,
        borderLeft:   `3px solid ${CYAN}`,
        borderRadius: "10px",
        transform: hovered ? "translateX(2px)" : "translateX(0)",
      }}
    >
      {/* Emoji */}
      <span className="text-xl leading-none flex-shrink-0 w-7 text-center">{space.emoji}</span>

      {/* Text */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-bold leading-tight truncate" style={{ color: CREAM }}>
          {space.label}
        </span>
        <span className="text-[11px] leading-tight truncate mt-0.5" style={{ color: MUTED }}>
          {space.subtitle}
        </span>
      </div>

      {/* Arrow */}
      <svg
        viewBox="0 0 16 16" fill="none" stroke={CYAN} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="w-3.5 h-3.5 flex-shrink-0 transition-all duration-150"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-4px)" }}
      >
        <path d="M3 8h10M8 3l5 5-5 5" />
      </svg>
    </button>
  );
}

// ── Typing indicator ────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 px-4">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${CYAN}18`, border: `1px solid ${CYAN}35` }}>
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="3" fill={CYAN} />
          <circle cx="8" cy="8" r="6.5" stroke={CYAN} strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>
      {/* Dots bubble */}
      <div className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl rounded-bl-sm"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: CYAN, animation: `bounce-dot 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

// ── Chat bubble ─────────────────────────────────────────────────────────────

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2.5 px-4 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Assistant avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
          style={{ backgroundColor: `${CYAN}18`, border: `1px solid ${CYAN}35` }}>
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden>
            <circle cx="8" cy="8" r="3" fill={CYAN} />
            <circle cx="8" cy="8" r="6.5" stroke={CYAN} strokeWidth="1" strokeOpacity="0.4" />
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div
        className="max-w-[72%] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap"
        style={
          isUser
            ? {
                background: `linear-gradient(135deg, ${CYAN}, #0090b8)`,
                color: BG,
                fontWeight: 500,
                borderRadius: "18px 18px 4px 18px",
              }
            : {
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER}`,
                color: CREAM,
                borderRadius: "18px 18px 18px 4px",
              }
        }
      >
        {message.text}
      </div>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────

interface NormativaItem { id: string; label: string; flag: string; normativa: string }

const NORMATIVAS: NormativaItem[] = [
  { id: "colombia",  label: "Colombia",  flag: "🇨🇴", normativa: "Resolución 0627" },
  { id: "venezuela", label: "Venezuela", flag: "🇻🇪", normativa: "COVENIN 1565"    },
  { id: "mexico",    label: "México",    flag: "🇲🇽", normativa: "NOM-081"          },
  { id: "espana",    label: "España",    flag: "🇪🇸", normativa: "RD 1367"          },
  { id: "usa",       label: "USA",       flag: "🇺🇸", normativa: "OSHA"             },
  { id: "otro",      label: "Otro país", flag: "🌍",  normativa: "ISO 1996"         },
];

// ── Main page ───────────────────────────────────────────────────────────────

interface Dims { largo: string; ancho: string; altura: string }

function calcModes(d: number): [number, number, number] {
  return [1, 2, 3].map((n) => Math.round((343 * n) / (2 * d))) as [number, number, number];
}

export default function AsesorPage() {
  const router = useRouter();
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [pendingSpace,  setPendingSpace]  = useState<Space | null>(null);
  const [dims,          setDims]          = useState<Dims>({ largo: "", ancho: "", altura: "" });
  const [normativa,     setNormativa]     = useState<NormativaItem | null>(null);
  const [photo,         setPhoto]         = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [messages,     setMessages]     = useState<Message[]>([]);
  const [apiMessages,  setApiMessages]  = useState<Message[]>([]);
  const [input,        setInput]        = useState("");
  const [isTyping,     setIsTyping]     = useState(false);
  const [isStreaming,  setIsStreaming]   = useState(false);
  const [idCounter,    setIdCounter]    = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Save conversation to localStorage for the report page.
  // Messages are cleaned before storing: control characters stripped,
  // whitespace normalized, so the report API receives safe plain strings.
  useEffect(() => {
    if (!selectedSpace || messages.length === 0) return;

    const cleanText = (text: string): string =>
      text
        // Strip control chars except tab and newline
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
        // Collapse 3+ consecutive newlines into 2
        .replace(/\n{3,}/g, "\n\n")
        // Trim leading/trailing whitespace
        .trim();

    const cleaned = messages.map((m) => ({
      ...m,
      text: cleanText(m.text),
    }));

    try {
      localStorage.setItem(
        "acustega_reporte",
        JSON.stringify({ messages: cleaned, spaceLabel: selectedSpace.label })
      );
    } catch {
      // ignore quota errors
    }
  }, [messages, selectedSpace]);

  const handleSpaceCardClick = (space: Space) => {
    setPhoto(null);
    setNormativa(null);
    setDims({ largo: "", ancho: "", altura: "" });
    setPendingSpace(space);
  };

  const handleSelectSpace = async (space: Space, opts?: { dims?: Dims; normativa?: NormativaItem | null; photo?: string | null }) => {
    setPendingSpace(null);
    setSelectedSpace(space);
    setMessages([]);
    setIsTyping(false);
    setIsStreaming(true);

    const hasDims = opts?.dims?.largo && opts?.dims?.ancho && opts?.dims?.altura;
    let triggerText = "Hola";
    if (hasDims) {
      triggerText = `Hola. Mi espacio mide ${opts!.dims!.largo}m de largo, ${opts!.dims!.ancho}m de ancho y ${opts!.dims!.altura}m de altura.`;
    } else if (opts?.normativa) {
      triggerText = `Hola. Tengo un espacio industrial en ${opts.normativa.label}. La normativa aplicable es ${opts.normativa.normativa}.`;
    }
    const trigger: Message = { id: 0, role: "user", text: triggerText };
    const greetingId = 1;
    setMessages([{ id: greetingId, role: "assistant", text: "" }]);

    try {
      let accumulated = "";
      await streamAssistantReply([trigger], space.label, (chunk) => {
        accumulated += chunk;
        setMessages([{ id: greetingId, role: "assistant", text: accumulated }]);
      }, opts?.photo);
      const greetingMsg: Message = { id: greetingId, role: "assistant", text: accumulated };
      setApiMessages([trigger, greetingMsg]);
      setIdCounter(2);
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message.includes("credit")
          ? "Saldo insuficiente. Por favor contacta al administrador."
          : "Error al conectar con el asesor. Por favor intenta de nuevo.";
      setMessages([{ id: greetingId, role: "assistant", text: msg }]);
      setIdCounter(2);
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleBack = () => {
    if (pendingSpace) {
      setPendingSpace(null);
      setNormativa(null);
      setPhoto(null);
      return;
    }
    setSelectedSpace(null);
    setMessages([]);
    setApiMessages([]);
    setInput("");
    setIsTyping(false);
    setIsStreaming(false);
    setIdCounter(0);
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping || isStreaming) return;

    const userId      = idCounter;
    const assistantId = idCounter + 1;
    const userMsg: Message = { id: userId, role: "user", text };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const history = [...apiMessages, userMsg];

    try {
      setIsTyping(false);
      setIsStreaming(true);
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", text: "" }]);

      let accumulated = "";
      await streamAssistantReply(history, selectedSpace!.label, (chunk) => {
        accumulated += chunk;
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, text: accumulated } : m)
        );
      });

      const assistantMsg: Message = { id: assistantId, role: "assistant", text: accumulated };
      setApiMessages([...history, assistantMsg]);
      setIdCounter(assistantId + 1);
    } catch {
      setIsTyping(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, text: "Lo siento, hubo un error. Por favor intenta de nuevo." } : m
        )
      );
      setIdCounter(assistantId + 1);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isTyping, isStreaming, idCounter, apiMessages, selectedSpace]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const isBusy = isTyping || isStreaming;

  // ── Space selection screen ────────────────────────────────────────────────

  if (!selectedSpace && !pendingSpace) {
    return (
      <>
        <style>{`
          @keyframes rl-outer  { 0%,100%{opacity:.35} 50%{opacity:.08} }
          @keyframes rl-mid    { 0%,100%{opacity:.60} 50%{opacity:.15} }
          @keyframes rl-inner  { 0%,100%{opacity:.90} 50%{opacity:.30} }
          @keyframes bounce-dot {
            0%,80%,100% { transform: translateY(0); }
            40%         { transform: translateY(-6px); }
          }
        `}</style>
        <main
          className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
          style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
        >
          <div className="w-full max-w-sm flex flex-col items-center gap-6">

            {/* Header label */}
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ color: MUTED }}>
              ACUSTEGA<span style={{ color: CYAN }}>AI</span>
            </p>

            {/* Logo */}
            <RingsLogo size={80} />

            {/* Title */}
            <div className="text-center">
              <h1 className="text-lg font-bold leading-snug" style={{ color: CREAM }}>
                ¿Qué espacio vamos a optimizar?
              </h1>
              <p className="text-[12px] mt-1" style={{ color: MUTED }}>
                Selecciona para comenzar el diagnóstico
              </p>
            </div>

            {/* Space grid */}
            <div className="w-full grid grid-cols-2 gap-2">
              {SPACES.map((space, i) => (
                <div key={space.id} className={i === SPACES.length - 1 ? "col-span-2" : ""}>
                  <SpaceCard space={space} onSelect={handleSpaceCardClick} />
                </div>
              ))}
            </div>

            {/* Footer */}
            <p className="text-[9px] tracking-[0.25em] uppercase mt-2" style={{ color: `${MUTED}45` }}>
              Powered by Acustega
            </p>
          </div>
        </main>
      </>
    );
  }

  // ── Photo upload helper ───────────────────────────────────────────────────

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1024;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setPhoto(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  };

  const PhotoUpload = () => (
    <div className="flex flex-col gap-2">
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      {photo ? (
        <div className="relative w-full rounded-xl overflow-hidden" style={{ border: `1px solid ${CYAN}50` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="Espacio" className="w-full object-cover" style={{ maxHeight: 160 }} />
          <button
            onClick={() => setPhoto(null)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: "rgba(13,17,23,0.8)", color: CREAM }}
          >✕</button>
        </div>
      ) : (
        <button
          onClick={() => photoInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all"
          style={{ border: `1px dashed ${BORDER}`, color: MUTED, backgroundColor: "transparent" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = CYAN + "60"; (e.currentTarget as HTMLButtonElement).style.color = CYAN; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="1" y="3" width="14" height="10" rx="1.5"/>
            <circle cx="8" cy="8" r="2.5"/>
            <path d="M5 3l1-2h4l1 2"/>
          </svg>
          Subir foto del espacio (opcional)
        </button>
      )}
    </div>
  );

  // ── Industrial normativa screen ───────────────────────────────────────────

  if (pendingSpace?.id === "industrial") {
    return (
      <>
        <style>{`
          @keyframes rl-outer  { 0%,100%{opacity:.35} 50%{opacity:.08} }
          @keyframes rl-mid    { 0%,100%{opacity:.60} 50%{opacity:.15} }
          @keyframes rl-inner  { 0%,100%{opacity:.90} 50%{opacity:.30} }
        `}</style>
        <main
          className="min-h-screen flex flex-col"
          style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
        >
          {/* Header */}
          <header
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ backgroundColor: SURFACE, borderBottom: `1px solid ${BORDER}` }}
          >
            <button
              onClick={handleBack}
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${CYAN}15`, border: `1px solid ${CYAN}35` }}>
              <span className="text-sm leading-none">{pendingSpace.emoji}</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold leading-tight" style={{ color: CREAM }}>
                {pendingSpace.label}
              </span>
              <span className="text-[10px]" style={{ color: CYAN }}>Normativa de ruido</span>
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 max-w-md mx-auto w-full">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-1" style={{ color: CYAN }}>
                Control de ruido industrial
              </p>
              <h2 className="text-base font-bold leading-snug" style={{ color: CREAM }}>
                ¿En qué país está tu planta?
              </h2>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: MUTED }}>
                Aplicaremos la normativa local vigente en el diagnóstico
              </p>
            </div>

            {/* Country grid */}
            <div className="grid grid-cols-2 gap-2">
              {NORMATIVAS.map((item) => {
                const selected = normativa?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setNormativa(item)}
                    className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: selected ? `${CYAN}18` : SURFACE,
                      border: `1.5px solid ${selected ? CYAN : BORDER}`,
                    }}
                    onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = CYAN + "50"; }}
                    onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; }}
                  >
                    <span className="text-xl leading-none">{item.flag}</span>
                    <span className="text-xs font-bold leading-tight" style={{ color: selected ? CYAN : CREAM }}>
                      {item.label}
                    </span>
                    <span className="text-[10px] leading-tight font-mono" style={{ color: selected ? CYAN + "CC" : MUTED }}>
                      {item.normativa}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Photo upload */}
            <PhotoUpload />

            {/* CTA */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => handleSelectSpace(pendingSpace, { normativa, photo })}
                disabled={!normativa}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  backgroundColor: normativa ? CYAN : `${CYAN}40`,
                  color: BG,
                  cursor: normativa ? "pointer" : "not-allowed",
                  boxShadow: normativa ? `0 4px 20px ${CYAN}35` : "none",
                }}
                onMouseEnter={(e) => { if (normativa) { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 28px ${CYAN}55`; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; } }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = normativa ? `0 4px 20px ${CYAN}35` : "none"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                Continuar al asesor
                <svg viewBox="0 0 16 16" fill="none" stroke={BG} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M3 8h10M8 3l5 5-5 5" />
                </svg>
              </button>

              <button
                onClick={() => handleSelectSpace(pendingSpace, { photo })}
                className="w-full py-2.5 text-xs transition-colors"
                style={{ color: `${MUTED}70` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = `${MUTED}70`)}
              >
                Saltar todo
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Room modes calculator screen ─────────────────────────────────────────

  if (pendingSpace) {
    const dimFields: { key: keyof Dims; label: string }[] = [
      { key: "largo",  label: "Largo"  },
      { key: "ancho",  label: "Ancho"  },
      { key: "altura", label: "Altura" },
    ];

    const parsed = {
      largo:  parseFloat(dims.largo),
      ancho:  parseFloat(dims.ancho),
      altura: parseFloat(dims.altura),
    };

    const hasAny    = dimFields.some(({ key }) => dims[key] !== "" && !isNaN(parsed[key]) && parsed[key] > 0);
    const hasAll    = dimFields.every(({ key }) => dims[key] !== "" && !isNaN(parsed[key]) && parsed[key] > 0);

    const modeRows: { label: string; key: keyof Dims; modes: [number, number, number] | null }[] = dimFields.map(({ key, label }) => ({
      label,
      key,
      modes: dims[key] !== "" && !isNaN(parsed[key]) && parsed[key] > 0
        ? calcModes(parsed[key])
        : null,
    }));

    return (
      <>
        <style>{`
          @keyframes rl-outer  { 0%,100%{opacity:.35} 50%{opacity:.08} }
          @keyframes rl-mid    { 0%,100%{opacity:.60} 50%{opacity:.15} }
          @keyframes rl-inner  { 0%,100%{opacity:.90} 50%{opacity:.30} }
        `}</style>
        <main
          className="min-h-screen flex flex-col"
          style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
        >
          {/* Header */}
          <header
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ backgroundColor: SURFACE, borderBottom: `1px solid ${BORDER}` }}
          >
            <button
              onClick={handleBack}
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

            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${CYAN}15`, border: `1px solid ${CYAN}35` }}>
              <span className="text-sm leading-none">{pendingSpace.emoji}</span>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold leading-tight" style={{ color: CREAM }}>
                {pendingSpace.label}
              </span>
              <span className="text-[10px]" style={{ color: CYAN }}>
                Calculadora de modos de sala
              </span>
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 max-w-md mx-auto w-full">

            {/* Title */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-1" style={{ color: CYAN }}>
                Modos axiales
              </p>
              <h2 className="text-base font-bold leading-snug" style={{ color: CREAM }}>
                Ingresa las dimensiones de tu espacio
              </h2>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: MUTED }}>
                Calculamos las frecuencias de resonancia usando f = 343 / (2 × dimensión)
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3">
              {dimFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: MUTED }}>
                    {label}
                  </label>
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{
                      backgroundColor: SURFACE,
                      border: `1px solid ${dims[key] !== "" && !isNaN(parseFloat(dims[key])) && parseFloat(dims[key]) > 0 ? CYAN + "60" : BORDER}`,
                    }}
                  >
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={dims[key]}
                      onChange={(e) => setDims((d) => ({ ...d, [key]: e.target.value }))}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: CREAM, caretColor: CYAN }}
                    />
                    <span className="text-xs font-medium flex-shrink-0" style={{ color: MUTED }}>m</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Results table */}
            {hasAny && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${BORDER}` }}
              >
                {/* Table header */}
                <div
                  className="grid grid-cols-4 px-3 py-2"
                  style={{ backgroundColor: SURFACE2 }}
                >
                  {["Dimensión", "f₁", "f₂", "f₃"].map((h) => (
                    <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-center"
                      style={{ color: CYAN }}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                {modeRows.map(({ label, key, modes }, i) => (
                  <div
                    key={key}
                    className="grid grid-cols-4 px-3 py-2.5 items-center"
                    style={{
                      backgroundColor: i % 2 === 0 ? SURFACE : `${SURFACE}80`,
                      borderTop: `1px solid ${BORDER}`,
                    }}
                  >
                    <span className="text-xs font-semibold" style={{ color: CREAM }}>{label}</span>
                    {modes
                      ? modes.map((f, mi) => (
                          <span key={mi} className="text-xs text-center font-mono"
                            style={{ color: mi === 0 ? AMBER : MUTED }}>
                            {f} Hz
                          </span>
                        ))
                      : [0, 1, 2].map((mi) => (
                          <span key={mi} className="text-xs text-center" style={{ color: `${MUTED}40` }}>—</span>
                        ))
                    }
                  </div>
                ))}

                {hasAll && (
                  <div
                    className="px-3 py-2 text-[10px] leading-relaxed"
                    style={{ backgroundColor: `${AMBER}10`, borderTop: `1px solid ${AMBER}30`, color: `${AMBER}CC` }}
                  >
                    Los modos f₁ resaltados son los que más afectan tu mezcla. Tratalos primero.
                  </div>
                )}
              </div>
            )}

            {/* Photo upload */}
            <PhotoUpload />

            {/* CTA */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => handleSelectSpace(pendingSpace, { dims: hasAll ? dims : undefined, photo })}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
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
                Continuar al asesor
                <svg viewBox="0 0 16 16" fill="none" stroke={BG} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M3 8h10M8 3l5 5-5 5" />
                </svg>
              </button>

              <button
                onClick={() => handleSelectSpace(pendingSpace, { photo })}
                className="w-full py-2.5 text-xs transition-colors"
                style={{ color: `${MUTED}70` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = `${MUTED}70`)}
              >
                Saltar todo
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Chat screen ───────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes rl-outer  { 0%,100%{opacity:.35} 50%{opacity:.08} }
        @keyframes rl-mid    { 0%,100%{opacity:.60} 50%{opacity:.15} }
        @keyframes rl-inner  { 0%,100%{opacity:.90} 50%{opacity:.30} }
        @keyframes bounce-dot {
          0%,80%,100% { transform: translateY(0); }
          40%         { transform: translateY(-6px); }
        }
      `}</style>
      <main
        className="h-screen flex flex-col"
        style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
      >
        {/* ── Header ── */}
        <header
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{
            backgroundColor: SURFACE,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {/* Back button */}
          <button
            onClick={handleBack}
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

          {/* Space avatar */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${CYAN}15`, border: `1px solid ${CYAN}35` }}>
            <span className="text-sm leading-none">{selectedSpace.emoji}</span>
          </div>

          {/* Name + subtitle */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold leading-tight truncate" style={{ color: CREAM }}>
              {selectedSpace.label}
            </span>
            <span className="text-[10px] leading-tight" style={{ color: CYAN }}>
              Asesor Acústico · Acustega
            </span>
          </div>

          {/* Online indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
            <span className="text-[10px]" style={{ color: `${MUTED}80` }}>En línea</span>
          </div>

          {/* Report button */}
          {messages.length > 1 && (
            <button
              onClick={() => router.push("/reporte")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex-shrink-0 transition-all"
              style={{
                backgroundColor: `${AMBER}18`,
                border: `1px solid ${AMBER}45`,
                color: AMBER,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${AMBER}28`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${AMBER}18`;
              }}
              title="Descargar reporte PDF"
            >
              <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                <path d="M7 1v7M4 5l3 3 3-3" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 10h10" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              PDF
            </button>
          )}
        </header>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-3">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && !isStreaming && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input area ── */}
        <div className="flex-shrink-0 px-4 py-3"
          style={{ borderTop: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
            style={{
              backgroundColor: BG,
              border: `1px solid ${inputFocused ? CYAN + "70" : BORDER}`,
              boxShadow: inputFocused ? `0 0 0 3px ${CYAN}12` : "none",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Escribe tu respuesta..."
              disabled={isBusy}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: CREAM, caretColor: CYAN }}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isBusy}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                backgroundColor: input.trim() && !isBusy ? CYAN : `${BORDER}80`,
                opacity: input.trim() && !isBusy ? 1 : 0.5,
              }}
              aria-label="Enviar"
            >
              <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round"
                className="w-3.5 h-3.5"
                stroke={input.trim() && !isBusy ? BG : MUTED}
                strokeWidth="2">
                <path d="M14 2L7 9M14 2L9 14l-2-5-5-2 12-5z" />
              </svg>
            </button>
          </div>

          <p className="text-center mt-2 text-[9px] tracking-[0.22em] uppercase"
            style={{ color: `${MUTED}35` }}>
            Powered by Acustega
          </p>
        </div>
      </main>
    </>
  );
}
