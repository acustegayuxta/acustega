"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PromptQuestionnaire from "@/components/prompt-questionnaire/PromptQuestionnaire";

const CotizadorAdmin  = dynamic(() => import("@/components/cotizador/CotizadorAdmin"),        { ssr: false });
const CasosEstudio    = dynamic(() => import("@/components/casos-estudio/CasosEstudio"),       { ssr: false });

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";

type Tab = "cotizador" | "cuestionario" | "casos-estudio";

// ── Password gate ─────────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword]   = useState("");
  const [error,    setError]      = useState("");
  const [loading,  setLoading]    = useState(false);

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
        sessionStorage.setItem("acustega_admin_auth", "true");
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
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ backgroundColor: BG }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        {/* Logo */}
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: CYAN }}>
            ACUSTEGA<span style={{ color: AMBER }}>AI</span>
          </p>
          <p className="text-xs mt-1" style={{ color: MUTED }}>Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold" style={{ color: CREAM }}>Contraseña</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: SURFACE2,
                border: `1px solid ${error ? "#ef4444" : BORDER}`,
                color: CREAM,
              }}
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
              backgroundColor: loading || !password ? `${CYAN}50` : CYAN,
              color: BG,
              cursor: loading || !password ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Prompt result view ────────────────────────────────────────────────────────

function PromptResult({ prompt, onReset }: { prompt: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: CYAN }}>
            PROMPT GENERADO
          </p>
          <p className="text-sm font-bold mt-0.5" style={{ color: CREAM }}>
            Listo para usar en Midjourney / DALL-E
          </p>
        </div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#22c55e18", border: "1px solid #22c55e35" }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M3 8l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div
        className="w-full rounded-xl p-4 text-xs leading-relaxed"
        style={{
          backgroundColor: SURFACE2,
          border: `1px solid ${BORDER}`,
          color: CREAM,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {prompt}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            backgroundColor: copied ? "#22c55e" : CYAN,
            color: BG,
            boxShadow: `0 4px 20px ${copied ? "#22c55e" : CYAN}35`,
          }}
        >
          {copied ? (
            <>
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 8l3 3 7-7" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copiado
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <rect x="5" y="5" width="8" height="8" rx="1.2" stroke={BG} strokeWidth="1.6" />
                <path d="M3 11V3h8" stroke={BG} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Copiar prompt
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: SURFACE2,
            border: `1px solid ${BORDER}`,
            color: MUTED,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = CREAM)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
        >
          Nueva consulta
        </button>
      </div>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated,  setAuthenticated]  = useState(false);
  const [checkingAuth,   setCheckingAuth]   = useState(true);
  const [tab,            setTab]            = useState<Tab>("cotizador");
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  useEffect(() => {
    const isAuth = sessionStorage.getItem("acustega_admin_auth") === "true";
    setAuthenticated(isAuth);
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <div className="min-h-screen" style={{ backgroundColor: BG }} />;
  }

  if (!authenticated) {
    return <PasswordGate onAuth={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
      >
        <div>
          <span className="text-sm font-bold" style={{ color: CYAN }}>
            ACUSTEGA<span style={{ color: AMBER }}>AI</span>
          </span>
          <span className="text-xs ml-2" style={{ color: MUTED }}>Admin</span>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem("acustega_admin_auth"); setAuthenticated(false); }}
          className="text-xs transition-colors"
          style={{ color: `${MUTED}80` }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = MUTED)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = `${MUTED}80`)}
        >
          Cerrar sesión
        </button>
      </header>

      {/* Tabs */}
      <div
        className="flex gap-1 px-6 py-3"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        {(["cotizador", "cuestionario", "casos-estudio"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setGeneratedPrompt(""); }}
            className="px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all"
            style={{
              backgroundColor: tab === t ? `${CYAN}18` : "transparent",
              border: `1px solid ${tab === t ? CYAN : "transparent"}`,
              color: tab === t ? CYAN : MUTED,
            }}
          >
            {t === "cotizador" ? "Cotizador" : t === "cuestionario" ? "Cuestionario de diseño" : "Casos de Estudio"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1">
        {tab === "cotizador" ? (
          <CotizadorAdmin />
        ) : tab === "casos-estudio" ? (
          <CasosEstudio />
        ) : (
          <div className="px-6 py-6 max-w-2xl mx-auto w-full">
            {/* Context label */}
            <div
              className="mb-6 px-4 py-3 rounded-xl text-xs"
              style={{
                backgroundColor: `${AMBER}10`,
                border: `1px solid ${AMBER}25`,
                color: AMBER,
              }}
            >
              Modo reunión con cliente · Completa el cuestionario y genera el prompt de diseño al instante
            </div>

            {generatedPrompt ? (
              <PromptResult
                prompt={generatedPrompt}
                onReset={() => setGeneratedPrompt("")}
              />
            ) : (
              <PromptQuestionnaire
                onGenerated={setGeneratedPrompt}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
