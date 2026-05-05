"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PromptQuestionnaire from "@/components/prompt-questionnaire/PromptQuestionnaire";
import {
  Calculator,
  ClipboardList,
  BookOpen,
  Database,
  Mic2,
  LogOut,
  Menu,
  X,
  Check,
  Copy,
} from "lucide-react";

const CotizadorAdmin   = dynamic(() => import("@/components/cotizador/CotizadorAdmin"),               { ssr: false });
const CasosEstudio     = dynamic(() => import("@/components/casos-estudio/CasosEstudio"),             { ssr: false });
const BaseConocimiento = dynamic(() => import("@/components/base-conocimiento/BaseConocimiento"),     { ssr: false });
const AsesorInterno    = dynamic(() => import("@/components/asesor-interno/AsesorInterno"),           { ssr: false });

// ── Palette ───────────────────────────────────────────────────────────────────

const BG       = "#0D1117";
const SIDEBAR  = "#161B22";
const SURFACE  = "#1C2128";
const HOVER    = "#1F2937";
const CYAN     = "#00D4FF";
const AMBER    = "#F59E0B";
const CREAM    = "#F0F6FC";
const MUTED    = "#8B949E";
const BORDER   = "#30363D";

// ── Tab config ────────────────────────────────────────────────────────────────

type Tab = "cotizador" | "cuestionario" | "casos-estudio" | "conocimiento" | "asesor-interno";

const TABS: { id: Tab; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "cotizador",      label: "Cotizador",          Icon: Calculator   },
  { id: "cuestionario",   label: "Cuestionario",        Icon: ClipboardList },
  { id: "casos-estudio",  label: "Casos de Estudio",    Icon: BookOpen     },
  { id: "conocimiento",   label: "Base de Conocimiento",Icon: Database     },
  { id: "asesor-interno", label: "Asesor Interno",      Icon: Mic2         },
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
      style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}>
      <div className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6"
        style={{ backgroundColor: SIDEBAR, border: `1px solid ${BORDER}` }}>

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
            <label className="text-xs font-semibold" style={{ color: MUTED }}>Contraseña</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${error ? "#ef4444" : BORDER}`,
                color: CREAM,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = CYAN)}
              onBlur={(e)  => (e.currentTarget.style.borderColor = error ? "#ef4444" : BORDER)}
            />
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: "#ef4444" }}>{error}</p>
          )}

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
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: CYAN }}>
            Prompt generado
          </p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: CREAM }}>
            Listo para Midjourney / DALL-E
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#22c55e18", border: "1px solid #22c55e35" }}>
          <Check size={14} color="#22c55e" strokeWidth={2.5} />
        </div>
      </div>

      <div className="w-full rounded-xl p-4 text-xs leading-relaxed font-mono"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: CREAM, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {prompt}
      </div>

      <div className="flex gap-3">
        <button onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            backgroundColor: copied ? "#22c55e" : CYAN,
            color: BG,
            boxShadow: `0 4px 20px ${copied ? "#22c55e" : CYAN}35`,
          }}>
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

// ── Sidebar nav item ──────────────────────────────────────────────────────────

function NavItem({
  tab, active, onClick,
}: {
  tab: typeof TABS[number]; active: boolean; onClick: () => void;
}) {
  const { Icon, label } = tab;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
      style={{
        backgroundColor: active ? `${CYAN}14` : "transparent",
        color: active ? CYAN : MUTED,
        borderLeft: active ? `2px solid ${CYAN}` : "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER;
          (e.currentTarget as HTMLButtonElement).style.color = CREAM;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = MUTED;
        }
      }}
    >
      <Icon size={16} strokeWidth={active ? 2 : 1.5} />
      <span className="truncate">{label}</span>
    </button>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [authenticated,   setAuthenticated]   = useState(false);
  const [checkingAuth,    setCheckingAuth]    = useState(true);
  const [tab,             setTab]             = useState<Tab>("cotizador");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [sidebarOpen,     setSidebarOpen]     = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("acustega_dashboard_auth") === "true";
    setAuthenticated(isAuth);
    setCheckingAuth(false);
  }, []);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setGeneratedPrompt("");
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("acustega_dashboard_auth");
    setAuthenticated(false);
  };

  const activeTab = TABS.find((t) => t.id === tab)!;

  if (checkingAuth) {
    return <div className="min-h-screen" style={{ backgroundColor: BG }} />;
  }

  if (!authenticated) {
    return <PasswordGate onAuth={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ backgroundColor: `${BG}cc` }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className="fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300 lg:translate-x-0"
        style={{
          width: 240,
          backgroundColor: SIDEBAR,
          borderRight: `1px solid ${BORDER}`,
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <p className="text-sm font-bold tracking-wide" style={{ color: CYAN }}>
              ACUSTEGA<span style={{ color: AMBER }}>AI</span>
            </p>
            <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: MUTED }}>
              Dashboard
            </p>
          </div>
          {/* Close button — mobile only */}
          <button
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: MUTED }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {TABS.map((t) => (
            <NavItem
              key={t.id}
              tab={t}
              active={tab === t.id}
              onClick={() => handleTabChange(t.id)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: MUTED }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER;
              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = MUTED;
            }}
          >
            <LogOut size={15} strokeWidth={1.5} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[240px]">

        {/* Top header */}
        <header
          className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4"
          style={{
            backgroundColor: `${BG}f0`,
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: MUTED, backgroundColor: SURFACE }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={16} />
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <activeTab.Icon size={16} strokeWidth={1.5} />
            <h1 className="text-sm font-semibold truncate" style={{ color: CREAM }}>
              {activeTab.label}
            </h1>
          </div>

          {/* Logout — desktop, subtle */}
          <button
            className="hidden lg:flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: MUTED }}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER;
              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = MUTED;
            }}
          >
            <LogOut size={13} strokeWidth={1.5} />
            Salir
          </button>
        </header>

        {/* Content */}
        <main className="flex-1">
          {tab === "cotizador" ? (
            <CotizadorAdmin />
          ) : tab === "casos-estudio" ? (
            <CasosEstudio />
          ) : tab === "conocimiento" ? (
            <BaseConocimiento />
          ) : tab === "asesor-interno" ? (
            <AsesorInterno />
          ) : (
            <div className="px-6 py-8 max-w-2xl mx-auto w-full">
              <div
                className="mb-6 px-4 py-3 rounded-xl text-xs font-medium"
                style={{ backgroundColor: `${AMBER}10`, border: `1px solid ${AMBER}25`, color: AMBER }}
              >
                Modo reunión con cliente · Completa el cuestionario y genera el prompt de diseño al instante
              </div>

              {generatedPrompt ? (
                <PromptResult prompt={generatedPrompt} onReset={() => setGeneratedPrompt("")} />
              ) : (
                <PromptQuestionnaire onGenerated={setGeneratedPrompt} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
