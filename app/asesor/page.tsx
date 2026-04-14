"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
  { id: "iglesia",        label: "Iglesia",        emoji: "⛪",  subtitle: "Espacios de culto"       },
  { id: "restaurante",    label: "Restaurante",    emoji: "🍽️", subtitle: "Ambiente y confort"      },
  { id: "sonido-en-vivo", label: "Sonido en vivo", emoji: "🎤", subtitle: "Eventos y conciertos"    },
  { id: "oficina",        label: "Oficina",        emoji: "💼", subtitle: "Productividad y foco"    },
  { id: "industrial",     label: "Industrial",     emoji: "🏭", subtitle: "Control de ruido"        },
];

// ── API helper ──────────────────────────────────────────────────────────────

async function streamAssistantReply(
  messages: Message[],
  spaceLabel: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const res = await fetch("/api/asesor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, spaceLabel }),
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

// ── Main page ───────────────────────────────────────────────────────────────

export default function AsesorPage() {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
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

  const handleSelectSpace = async (space: Space) => {
    setSelectedSpace(space);
    setMessages([]);
    setIsTyping(false);
    setIsStreaming(true);

    const trigger: Message = { id: 0, role: "user", text: "Hola" };
    const greetingId = 1;
    setMessages([{ id: greetingId, role: "assistant", text: "" }]);

    try {
      let accumulated = "";
      await streamAssistantReply([trigger], space.label, (chunk) => {
        accumulated += chunk;
        setMessages([{ id: greetingId, role: "assistant", text: accumulated }]);
      });
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

  if (!selectedSpace) {
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
                  <SpaceCard space={space} onSelect={handleSelectSpace} />
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
