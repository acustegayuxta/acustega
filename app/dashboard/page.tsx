"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PromptQuestionnaire from "@/components/prompt-questionnaire/PromptQuestionnaire";
import {
  Sparkles,
  Calculator,
  FileText,
  ClipboardList,
  BookOpen,
  Database,
  ArrowLeft,
  LogOut,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  MessageSquare,
  BarChart2,
} from "lucide-react";

const CotizadorAdmin   = dynamic(() => import("@/components/cotizador/CotizadorAdmin"),           { ssr: false });
const CasosEstudio     = dynamic(() => import("@/components/casos-estudio/CasosEstudio"),         { ssr: false });
const BaseConocimiento = dynamic(() => import("@/components/base-conocimiento/BaseConocimiento"), { ssr: false });
const AsesorInterno    = dynamic(() => import("@/components/asesor-interno/AsesorInterno"),       { ssr: false });

// ── Palette ───────────────────────────────────────────────────────────────────

const BG      = "#0D1117";
const CARD    = "#161B22";
const SURFACE = "#1C2128";
const CYAN    = "#00D4FF";
const AMBER   = "#F59E0B";
const PURPLE  = "#8B5CF6";
const GREEN   = "#3FB950";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActiveTool = "asesor" | "cotizador" | "reportes" | "cuestionario" | "casos" | "conocimiento" | null;

// ── Metric cards config ───────────────────────────────────────────────────────

const METRICS = [
  { label: "Reportes vendidos", value: "—", sub: "este mes",  accent: CYAN,   Icon: FileText     },
  { label: "Ingresos",          value: "—", sub: "USD",       accent: AMBER,  Icon: DollarSign   },
  { label: "Consultas IA",      value: "—", sub: "activas",   accent: PURPLE, Icon: MessageSquare},
  { label: "Cotizaciones",      value: "—", sub: "generadas", accent: GREEN,  Icon: BarChart2    },
];

// ── Tool cards config ─────────────────────────────────────────────────────────

const TOOLS: {
  id: ActiveTool;
  label: string;
  desc: string;
  accent: string;
  Icon: React.FC<{ size?: number; strokeWidth?: number }>;
  featured?: boolean;
}[] = [
  {
    id: "asesor",
    label: "Asesor AI",
    desc: "Cuestionario acústico de 28 preguntas con análisis de IA y generación de reporte",
    accent: CYAN,
    Icon: Sparkles,
    featured: true,
  },
  {
    id: "cotizador",
    label: "Cotizador",
    desc: "Genera cotizaciones detalladas para proyectos acústicos",
    accent: GREEN,
    Icon: Calculator,
  },
  {
    id: "reportes",
    label: "Reportes PDF",
    desc: "Genera reportes acústicos profesionales en PDF directamente",
    accent: AMBER,
    Icon: FileText,
  },
  {
    id: "cuestionario",
    label: "Cuestionario",
    desc: "Genera prompts de diseño visual para Midjourney y DALL-E",
    accent: PURPLE,
    Icon: ClipboardList,
  },
  {
    id: "casos",
    label: "Casos de Estudio",
    desc: "Gestiona y analiza proyectos acústicos ejecutados",
    accent: CYAN,
    Icon: BookOpen,
  },
  {
    id: "conocimiento",
    label: "Base de Conocimiento",
    desc: "Materiales, proveedores, resultados y proyectos de referencia",
    accent: PURPLE,
    Icon: Database,
  },
];

// ── Password gate ─────────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json() as { ok: boolean };
      if (data.ok) {
        sessionStorage.setItem("acustega_dashboard_auth", "true");
        onAuth();
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5"
      style={{ backgroundColor: BG, fontFamily: "'Satoshi', sans-serif" }}>
      <div className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6"
        style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-center">
          <p className="text-xl font-bold tracking-wide" style={{ color: CYAN }}>
            ACUSTEGA<span style={{ color: AMBER }}>AI</span>
          </p>
          <p className="text-xs mt-1.5 tracking-widest uppercase" style={{ color: MUTED }}>
            Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: MUTED }}>Contraseña</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ backgroundColor: SURFACE, border: `1px solid ${error ? "#ef4444" : BORDER}`, color: CREAM }}
              onFocus={(e) => (e.currentTarget.style.borderColor = CYAN)}
              onBlur={(e)  => (e.currentTarget.style.borderColor = error ? "#ef4444" : BORDER)}
            />
          </div>
          {error && <p className="text-xs text-center" style={{ color: "#ef4444" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: loading || !password ? `${CYAN}40` : CYAN,
              color: BG,
              cursor: loading || !password ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verificando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Prompt result ─────────────────────────────────────────────────────────────

function PromptResult({ prompt, onReset }: { prompt: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: CYAN }}>Prompt generado</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: CREAM }}>Listo para Midjourney / DALL-E</p>
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${GREEN}18`, border: `1px solid ${GREEN}35` }}>
          <Check size={14} color={GREEN} strokeWidth={2.5} />
        </div>
      </div>

      <div className="w-full rounded-xl p-4 text-xs leading-relaxed font-mono"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: CREAM, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {prompt}
      </div>

      <div className="flex gap-3">
        <button onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
          style={{ backgroundColor: copied ? GREEN : CYAN, color: BG, boxShadow: `0 4px 20px ${copied ? GREEN : CYAN}35` }}>
          {copied ? <><Check size={15} strokeWidth={2.5} />Copiado</> : <><Copy size={15} />Copiar prompt</>}
        </button>
        <button onClick={onReset}
          className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: MUTED }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = CREAM)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}>
          Nueva consulta
        </button>
      </div>
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, accent, Icon }: {
  label: string; value: string; sub: string; accent: string;
  Icon: React.FC<{ size?: number; strokeWidth?: number }>;
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color: MUTED }}>{label}</p>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}15` }}>
          <Icon size={14} strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: accent, fontVariantNumeric: "tabular-nums" }}>{value}</p>
        <p className="text-[11px] mt-0.5" style={{ color: `${MUTED}80` }}>{sub}</p>
      </div>
    </div>
  );
}

// ── Tool card ─────────────────────────────────────────────────────────────────

function ToolCard({ tool, onClick }: {
  tool: typeof TOOLS[number]; onClick: () => void;
}) {
  const { label, desc, accent, Icon, featured } = tool;
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
      style={{
        backgroundColor: hovered ? `${CARD}` : CARD,
        border: `1px solid ${hovered || featured ? accent : BORDER}`,
        boxShadow: hovered || featured ? `0 0 0 1px ${accent}30, 0 4px 24px ${accent}12` : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}25` }}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
        {featured && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase"
            style={{ backgroundColor: `${CYAN}15`, color: CYAN, border: `1px solid ${CYAN}30` }}>
            Destacado
          </span>
        )}
      </div>

      {/* Label + desc */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold" style={{ color: hovered ? accent : CREAM }}>
          {label}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
          {desc}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex items-center gap-1.5 text-xs font-medium"
        style={{ color: hovered ? accent : `${MUTED}60` }}>
        <TrendingUp size={12} strokeWidth={1.5} />
        <span>Abrir herramienta</span>
      </div>
    </button>
  );
}

// ── Dashboard home ────────────────────────────────────────────────────────────

function DashboardHome({
  onSelectTool,
  greeting,
  dateStr,
}: {
  onSelectTool: (t: ActiveTool) => void;
  greeting: string;
  dateStr: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: CREAM }}>
          {greeting}, equipo Acustega
        </h2>
        {dateStr && (
          <p className="text-sm mt-1 capitalize" style={{ color: MUTED }}>{dateStr}</p>
        )}
      </div>

      {/* Metric cards */}
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: MUTED }}>
          Resumen
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </section>

      {/* Tool cards */}
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: MUTED }}>
          Herramientas
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => onSelectTool(tool.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Tool content ──────────────────────────────────────────────────────────────

function ToolContent({ tool, generatedPrompt, setGeneratedPrompt }: {
  tool: ActiveTool;
  generatedPrompt: string;
  setGeneratedPrompt: (p: string) => void;
}) {
  if (tool === "asesor" || tool === "reportes") return <AsesorInterno />;
  if (tool === "cotizador")   return <CotizadorAdmin />;
  if (tool === "casos")       return <CasosEstudio />;
  if (tool === "conocimiento") return <BaseConocimiento />;
  if (tool === "cuestionario") {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-6 px-4 py-3 rounded-xl text-xs font-medium"
          style={{ backgroundColor: `${AMBER}10`, border: `1px solid ${AMBER}25`, color: AMBER }}>
          Modo reunión con cliente · Completa el cuestionario y genera el prompt de diseño al instante
        </div>
        {generatedPrompt ? (
          <PromptResult prompt={generatedPrompt} onReset={() => setGeneratedPrompt("")} />
        ) : (
          <PromptQuestionnaire onGenerated={setGeneratedPrompt} />
        )}
      </div>
    );
  }
  return null;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [authenticated,   setAuthenticated]   = useState(false);
  const [checkingAuth,    setCheckingAuth]    = useState(true);
  const [activeTool,      setActiveTool]      = useState<ActiveTool>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [greeting,        setGreeting]        = useState("");
  const [dateStr,         setDateStr]         = useState("");

  useEffect(() => {
    const isAuth = sessionStorage.getItem("acustega_dashboard_auth") === "true";
    setAuthenticated(isAuth);
    setCheckingAuth(false);

    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches");
    setDateStr(
      new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    );
  }, []);

  const handleSelectTool = (t: ActiveTool) => {
    setActiveTool(t);
    setGeneratedPrompt("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setActiveTool(null);
    setGeneratedPrompt("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("acustega_dashboard_auth");
    setAuthenticated(false);
  };

  const activeMeta = TOOLS.find((t) => t.id === activeTool);

  if (checkingAuth) {
    return <div className="min-h-screen" style={{ backgroundColor: BG }} />;
  }

  if (!authenticated) {
    return <PasswordGate onAuth={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, fontFamily: "'Satoshi', sans-serif", color: CREAM }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20"
        style={{
          backgroundColor: `${BG}e8`,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          {/* Back button or Logo */}
          {activeTool ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-medium transition-colors mr-2"
              style={{ color: MUTED }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = CREAM)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              <span className="hidden sm:inline">Volver</span>
            </button>
          ) : null}

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${CYAN}15`, border: `1px solid ${CYAN}25` }}>
              <Sparkles size={14} strokeWidth={1.5} color={CYAN} />
            </div>
            <span className="text-sm font-bold tracking-wide" style={{ color: CREAM }}>
              ACUSTEGA<span style={{ color: AMBER }}>AI</span>
            </span>
          </div>

          {/* Active tool label */}
          {activeTool && activeMeta && (
            <>
              <span style={{ color: BORDER }}>·</span>
              <span className="text-sm font-medium truncate" style={{ color: MUTED }}>
                {activeMeta.label}
              </span>
            </>
          )}

          <div className="flex-1" />

          {/* Avatar + logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: MUTED }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1F2937";
                (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = MUTED;
              }}
            >
              <LogOut size={13} strokeWidth={1.5} />
              <span className="hidden sm:inline">Salir</span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: `${CYAN}20`, border: `1.5px solid ${CYAN}40`, color: CYAN }}>
              A
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTool ? (
          <ToolContent
            tool={activeTool}
            generatedPrompt={generatedPrompt}
            setGeneratedPrompt={setGeneratedPrompt}
          />
        ) : (
          <DashboardHome
            onSelectTool={handleSelectTool}
            greeting={greeting}
            dateStr={dateStr}
          />
        )}
      </main>
    </div>
  );
}
