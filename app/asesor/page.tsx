"use client";

import { useState, useEffect, useRef } from "react";

const GOLD = "#C9A84C";
const COPPER = "#B87333";
const CREAM = "#F5F0E8";
const BG = "#080808";
const SURFACE = "#111111";
const BORDER = "#1e1e1e";

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
  { id: "estudio",        label: "Estudio",        emoji: "🎙️", subtitle: "Grabación profesional"   },
  { id: "home-studio",    label: "Home Studio",    emoji: "🎧", subtitle: "Producción en casa"       },
  { id: "iglesia",        label: "Iglesia",         emoji: "⛪", subtitle: "Espacios de culto"        },
  { id: "restaurante",    label: "Restaurante",     emoji: "🍽️", subtitle: "Ambiente y confort"       },
  { id: "sonido-en-vivo", label: "Sonido en vivo",  emoji: "🎤", subtitle: "Eventos y conciertos"    },
  { id: "oficina",        label: "Oficina",         emoji: "💼", subtitle: "Productividad y foco"    },
  { id: "industrial",     label: "Industrial",      emoji: "🏭", subtitle: "Control de ruido"        },
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

// ── Sub-components ─────────────────────────────────────────────────────────

function AdvisorLogo() {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
        {/* Outer ring — slow CW */}
        <g style={{ transformOrigin: "50px 50px", animation: "spin-cw 8s linear infinite" }}>
          <circle cx="50" cy="50" r="46" fill="none" stroke={GOLD} strokeWidth="0.8" strokeDasharray="6 4" />
        </g>
        {/* Mid ring — CCW */}
        <g style={{ transformOrigin: "50px 50px", animation: "spin-ccw 5s linear infinite" }}>
          <circle cx="50" cy="50" r="36" fill="none" stroke={COPPER} strokeWidth="1" strokeDasharray="3 5" />
        </g>
        {/* Inner ring — fast CW */}
        <g style={{ transformOrigin: "50px 50px", animation: "spin-cw 3s linear infinite" }}>
          <circle cx="50" cy="50" r="26" fill="none" stroke={GOLD} strokeWidth="1.2" strokeDasharray="8 3" />
        </g>
        {/* Center dot */}
        <circle
          cx="50" cy="50" r="5"
          fill={GOLD}
          style={{ transformOrigin: "50px 50px", animation: "center-dot-pulse 2s ease-in-out infinite" }}
        />
      </svg>
    </div>
  );
}

function SpaceCard({
  space,
  onSelect,
}: {
  space: Space;
  onSelect: (s: Space) => void;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => onSelect(space)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
      style={{
        backgroundColor: pressed ? `${GOLD}18` : SURFACE,
        border: `1px solid ${pressed ? GOLD + "50" : BORDER}`,
        transform: pressed ? "scale(0.97)" : "scale(1)",
      }}
    >
      <span className="text-lg leading-none flex-shrink-0">{space.emoji}</span>
      <div className="flex flex-col min-w-0">
        <span className="text-[13px] font-bold leading-tight truncate" style={{ color: CREAM }}>
          {space.label}
        </span>
        <span className="text-[10px] leading-tight truncate" style={{ color: `${CREAM}50` }}>
          {space.subtitle}
        </span>
      </div>
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}30` }}
      >
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={GOLD}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="8" cy="8" r="6" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: GOLD,
              animation: `bounce-dot 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-2 px-4 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
          style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}30` }}
        >
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={GOLD}>
            <circle cx="8" cy="8" r="3" />
            <circle cx="8" cy="8" r="6" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
      )}
      <div
        className="max-w-[72%] px-4 py-2.5 text-[13px] leading-relaxed"
        style={
          isUser
            ? {
                background: `linear-gradient(135deg, ${GOLD}cc, ${COPPER}cc)`,
                color: BG,
                borderRadius: "16px 16px 4px 16px",
                fontWeight: 500,
              }
            : {
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER}`,
                color: `${CREAM}dd`,
                borderRadius: "16px 16px 16px 4px",
              }
        }
      >
        {message.text}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function AsesorPage() {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  // messages visible in chat (excludes the hidden initial trigger)
  const [messages, setMessages] = useState<Message[]>([]);
  // full conversation sent to the API (includes the hidden initial user message)
  const [apiMessages, setApiMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // When space is selected, kick off the API for the opening greeting
  const handleSelectSpace = async (space: Space) => {
    setSelectedSpace(space);
    setMessages([]);
    setIsTyping(true);

    // Hidden initial user message triggers the greeting — not shown in UI
    const trigger: Message = { id: 0, role: "user", text: "Hola" };
    const greetingId = 1;

    try {
      // Pre-add empty assistant bubble so streaming fills it in
      setIsTyping(false);
      setIsStreaming(true);
      setMessages([{ id: greetingId, role: "assistant", text: "" }]);

      let accumulated = "";
      await streamAssistantReply([trigger], space.label, (chunk) => {
        accumulated += chunk;
        setMessages([{ id: greetingId, role: "assistant", text: accumulated }]);
      });

      // Persist the full exchange for future API calls
      const greetingMsg: Message = { id: greetingId, role: "assistant", text: accumulated };
      setApiMessages([trigger, greetingMsg]);
      setIdCounter(2);
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message.includes("credit")
          ? "Saldo insuficiente en la cuenta de Acustega. Por favor contacta al administrador."
          : "Lo siento, hubo un error al conectar con el asesor. Por favor intenta de nuevo.";
      setMessages([{ id: greetingId, role: "assistant", text: msg }]);
      setIdCounter(2); // always advance so handleSend never reuses id 1
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
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping || isStreaming) return;

    const userId = idCounter;
    const assistantId = idCounter + 1;
    const userMsg: Message = { id: userId, role: "user", text };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Build the full history for the API
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
          m.id === assistantId
            ? { ...m, text: "Lo siento, hubo un error. Por favor intenta de nuevo." }
            : m
        )
      );
      setIdCounter(assistantId + 1);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const isBusy = isTyping || isStreaming;

  // ── Home screen ──────────────────────────────────────────────────────────
  if (!selectedSpace) {
    return (
      <main
        className="h-screen flex flex-col items-center justify-center px-5 overflow-hidden"
        style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
      >
        <div className="w-full max-w-sm flex flex-col items-center gap-4">

          {/* Logo + heading */}
          <div className="flex flex-col items-center gap-2">
            <AdvisorLogo />
            <div className="text-center">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: COPPER }}>
                Asesor Acústico
              </p>
              <h1 className="text-base font-bold mt-0.5" style={{ color: CREAM }}>
                ¿Qué espacio vamos a optimizar?
              </h1>
            </div>
          </div>

          {/* Space grid */}
          <div className="w-full grid grid-cols-2 gap-2">
            {SPACES.map((space, i) => {
              const isLast = i === SPACES.length - 1;
              return (
                <div key={space.id} className={isLast ? "col-span-2" : ""}>
                  <SpaceCard space={space} onSelect={handleSelectSpace} />
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-[9px] tracking-widest uppercase" style={{ color: `${CREAM}28` }}>
            Powered by Acustega
          </p>
        </div>
      </main>
    );
  }

  // ── Chat screen ──────────────────────────────────────────────────────────
  return (
    <main
      className="h-screen flex flex-col"
      style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <button
          onClick={handleBack}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
          aria-label="Volver"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}40` }}
        >
          <span className="text-sm leading-none">{selectedSpace.emoji}</span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold leading-tight truncate" style={{ color: CREAM }}>
            {selectedSpace.label}
          </span>
          <span className="text-[10px] leading-tight" style={{ color: GOLD }}>
            Asesor Acústico · Acustega
          </span>
        </div>

        {/* Online dot */}
        <div className="ml-auto flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
          />
          <span className="text-[10px]" style={{ color: `${CREAM}50` }}>En línea</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && !isStreaming && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl"
          style={{
            backgroundColor: SURFACE,
            border: `1px solid ${BORDER}`,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu respuesta..."
            disabled={isBusy}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{
              color: CREAM,
              caretColor: GOLD,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isBusy}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity"
            style={{
              background:
                input.trim() && !isBusy
                  ? `linear-gradient(135deg, ${GOLD}, ${COPPER})`
                  : `${GOLD}25`,
              opacity: input.trim() && !isBusy ? 1 : 0.5,
            }}
            aria-label="Enviar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" style={{ stroke: input.trim() && !isBusy ? BG : GOLD }}>
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p className="text-center mt-2 text-[9px] tracking-widest uppercase" style={{ color: `${CREAM}25` }}>
          Powered by Acustega
        </p>
      </div>
    </main>
  );
}
