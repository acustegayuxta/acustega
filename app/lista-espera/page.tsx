"use client";

import { useState } from "react";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";
const RED     = "#ef4444";

export default function ListaEspera() {
  const [nombre,  setNombre]  = useState("");
  const [email,   setEmail]   = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/acustega-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Error al registrar");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
    >
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-2">
        <span className="text-3xl font-black tracking-tight" style={{ color: CREAM }}>
          ACUSTEGA<span style={{ color: CYAN }}>AI</span>
        </span>
        <span
          className="text-[10px] font-bold tracking-[0.3em] uppercase px-3 py-1 rounded-full"
          style={{ backgroundColor: `${AMBER}20`, color: AMBER, border: `1px solid ${AMBER}40` }}
        >
          Próximamente
        </span>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl px-8 py-10 flex flex-col gap-6"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        {success ? (
          /* ── Confirmación ── */
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${CYAN}20`, border: `1.5px solid ${CYAN}50` }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                <path d="M5 12l5 5L19 7" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: CREAM }}>¡Estás en la lista!</p>
              <p className="text-sm mt-1" style={{ color: MUTED }}>
                Te avisaremos cuando Acustega AI esté disponible. Gracias por tu interés.
              </p>
            </div>
          </div>
        ) : (
          /* ── Formulario ── */
          <>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-black leading-tight" style={{ color: CREAM }}>
                Acustega AI está llegando
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                La primera plataforma de consultoría acústica potenciada por inteligencia artificial.
                Diseño, simulación y asesoría profesional para estudios, oficinas, hoteles y más —
                desde cualquier lugar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full text-sm outline-none px-3 py-2.5 rounded-lg"
                  style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM, caretColor: CYAN }}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full text-sm outline-none px-3 py-2.5 rounded-lg"
                  style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM, caretColor: CYAN }}
                />
              </div>

              {/* Mensaje */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
                  ¿Qué tipo de proyecto tienes?
                </label>
                <textarea
                  required
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Estudio de grabación, oficina, restaurante..."
                  rows={3}
                  className="w-full text-sm outline-none px-3 py-2.5 rounded-lg resize-none"
                  style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, color: CREAM, caretColor: CYAN }}
                />
              </div>

              {error && (
                <p className="text-[11px] text-center" style={{ color: RED }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  backgroundColor: loading ? `${CYAN}60` : CYAN,
                  color: BG,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : `0 4px 20px ${CYAN}30`,
                }}
              >
                {loading ? "Registrando..." : "Unirme a la lista de espera"}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="mt-8 text-[10px] tracking-[0.2em] uppercase" style={{ color: `${MUTED}50` }}>
        Acustega · Ingeniería Acústica Profesional · Medellín, Colombia
      </p>
    </main>
  );
}
