"use client";

import { useRouter } from "next/navigation";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00D4FF";
const AMBER   = "#F59E0B";
const PURPLE  = "#8B5CF6";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";

// ── Space types ───────────────────────────────────────────────────────────────

const SPACES = [
  {
    label: "Estudio de grabación",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="4" stroke={CYAN} strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="8" stroke={CYAN} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Home studio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z" stroke={PURPLE} strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="9" y="13" width="6" height="8" rx="1" stroke={PURPLE} strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: "Sala de ensayo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <ellipse cx="12" cy="17" rx="5" ry="3" stroke={AMBER} strokeWidth="1.5"/>
        <path d="M7 17V9c0-2.76 2.24-5 5-5s5 2.24 5 5v8" stroke={AMBER} strokeWidth="1.5"/>
        <path d="M9 9h6" stroke={AMBER} strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Podcast studio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="9" y="2" width="6" height="11" rx="3" stroke={CYAN} strokeWidth="1.5"/>
        <path d="M5 10a7 7 0 0014 0" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 17v4M9 21h6" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Auditorio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 18c0-5 4-9 9-9s9 4 9 9" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 18c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke={PURPLE} strokeWidth="1" strokeDasharray="2 1.5" strokeLinecap="round"/>
        <path d="M10 18c0-1.1.9-2 2-2s2 .9 2 2" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3 18h18" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Sala de mezcla",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="2" y="6" width="20" height="12" rx="2" stroke={AMBER} strokeWidth="1.5"/>
        <path d="M6 12v3M10 9v6M14 11v4M18 8v7" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="6" cy="10" r="1.5" fill={AMBER}/>
        <circle cx="10" cy="8" r="1.5" fill={AMBER}/>
        <circle cx="14" cy="10" r="1.5" fill={AMBER}/>
        <circle cx="18" cy="7" r="1.5" fill={AMBER}/>
      </svg>
    ),
  },
  {
    label: "Sala de eventos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 3l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 12l-3.75 2.75 1.5-4.5L6 7.5h4.5z"
          stroke={CYAN} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5 19h14M7 21h10" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// ── Steps ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Describe tu espacio",
    desc: "Cuéntale al asesor las medidas, materiales y uso de tu sala. Sin tecnicismos.",
    color: CYAN,
  },
  {
    num: "02",
    title: "Recibe diagnóstico IA",
    desc: "Nuestra IA analiza frecuencias problemáticas, modos de sala y reflexiones críticas.",
    color: PURPLE,
  },
  {
    num: "03",
    title: "Obtén reporte profesional",
    desc: "Descarga un PDF con soluciones concretas, materiales y layout de tratamiento.",
    color: AMBER,
  },
];

// ── Artists ───────────────────────────────────────────────────────────────────

const ARTISTS = ["Maluma", "Karol G", "Feid", "Yatra", "The Rude Boyz"];

// ── Logo ──────────────────────────────────────────────────────────────────────

function RingsLogo({ size = 40 }: { size?: number }) {
  const cx = size / 2;
  const r1 = size * 0.42;
  const r2 = size * 0.30;
  const r3 = size * 0.18;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <circle cx={cx} cy={cx} r={r1} stroke={CYAN} strokeWidth="1.2" strokeDasharray="8 4" opacity="0.5"/>
      <circle cx={cx} cy={cx} r={r2} stroke={CYAN} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.75"/>
      <circle cx={cx} cy={cx} r={r3} stroke={CYAN} strokeWidth="2"/>
      <circle cx={cx} cy={cx} r={size * 0.045} fill={CYAN}/>
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.15; transform: scale(1.04); }
        }
        .fade-up { animation: fade-up 0.7s ease-out both; }
      `}</style>

      <main style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)", color: CREAM }}>

        {/* ── Header ── */}
        <header
          className="flex items-center justify-between px-5 py-4 sticky top-0 z-30"
          style={{ backgroundColor: `${BG}e8`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}40` }}
        >
          <div className="flex items-center gap-2.5">
            <RingsLogo size={32} />
            <span className="font-bold text-sm tracking-wide">
              ACUSTEGA<span style={{ color: AMBER }}>AI</span>
            </span>
          </div>
          <button
            onClick={() => router.push("/asesor")}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ backgroundColor: CYAN, color: BG }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Comenzar gratis
          </button>
        </header>

        {/* ── Hero ── */}
        <section className="relative flex flex-col items-center text-center px-6 pt-16 pb-20 overflow-hidden">
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${CYAN}18 0%, transparent 70%)`,
              animation: "pulse-ring 5s ease-in-out infinite",
            }}
          />

          <div className="fade-up relative z-10 max-w-lg mx-auto">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-8"
              style={{ backgroundColor: `${CYAN}12`, border: `1px solid ${CYAN}30`, color: CYAN }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: CYAN }} />
              Inteligencia Acústica · Acustega AI
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
              Consultoría acústica{" "}
              <span style={{ color: CYAN }}>potenciada por</span>{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${PURPLE}, ${CYAN})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                inteligencia artificial
              </span>
            </h1>

            <p className="text-sm leading-relaxed mb-10 max-w-sm mx-auto" style={{ color: MUTED }}>
              Describe tu estudio o sala y recibe en minutos un diagnóstico acústico profesional con soluciones específicas para tu espacio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push("/asesor")}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold transition-all"
                style={{
                  backgroundColor: CYAN,
                  color: BG,
                  boxShadow: `0 6px 30px ${CYAN}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 10px 40px ${CYAN}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 6px 30px ${CYAN}40`;
                }}
              >
                Analizar mi espacio →
              </button>
              <span className="text-xs" style={{ color: `${MUTED}80` }}>
                Gratis · Sin registro · 3 minutos
              </span>
            </div>
          </div>

          {/* Stats strip */}
          <div
            className="fade-up relative z-10 mt-14 flex items-center justify-center gap-8 w-full max-w-sm"
            style={{ animationDelay: "0.15s" }}
          >
            {[
              { value: "+100", label: "estudios" },
              { value: "+10", label: "países" },
              { value: "3 min", label: "diagnóstico" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold" style={{ color: CYAN }}>{s.value}</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cómo funciona ── */}
        <section className="px-5 py-16" style={{ backgroundColor: SURFACE }}>
          <div className="max-w-md mx-auto">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-center mb-2" style={{ color: CYAN }}>
              Cómo funciona
            </p>
            <h2 className="text-xl font-bold text-center mb-10" style={{ color: CREAM }}>
              De cero a reporte en minutos
            </h2>

            <div className="flex flex-col gap-5">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="flex gap-4 p-5 rounded-2xl"
                  style={{
                    backgroundColor: SURFACE2,
                    border: `1px solid ${step.color}25`,
                    animation: `fade-up 0.6s ease-out ${i * 0.1 + 0.1}s both`,
                  }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: CREAM }}>{step.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tipos de espacio ── */}
        <section className="px-5 py-16">
          <div className="max-w-md mx-auto">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-center mb-2" style={{ color: PURPLE }}>
              Tu espacio
            </p>
            <h2 className="text-xl font-bold text-center mb-2" style={{ color: CREAM }}>
              ¿Qué tipo de sala tienes?
            </h2>
            <p className="text-xs text-center mb-10" style={{ color: MUTED }}>
              Selecciona tu espacio y comenzamos el análisis
            </p>

            <div className="grid grid-cols-2 gap-3">
              {SPACES.map((space, i) => (
                <button
                  key={space.label}
                  onClick={() => router.push("/asesor")}
                  className="flex flex-col items-start gap-3 p-4 rounded-2xl text-left transition-all"
                  style={{
                    backgroundColor: SURFACE,
                    border: `1px solid ${BORDER}`,
                    animation: `fade-up 0.5s ease-out ${i * 0.06 + 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${CYAN}50`;
                    e.currentTarget.style.backgroundColor = `${CYAN}08`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = BORDER;
                    e.currentTarget.style.backgroundColor = SURFACE;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: SURFACE2 }}
                  >
                    {space.icon}
                  </div>
                  <p className="text-xs font-bold leading-snug" style={{ color: CREAM }}>
                    {space.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Credenciales ── */}
        <section className="px-5 py-16" style={{ backgroundColor: SURFACE }}>
          <div className="max-w-md mx-auto">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-center mb-2" style={{ color: AMBER }}>
              Trayectoria
            </p>
            <h2 className="text-xl font-bold text-center mb-3" style={{ color: CREAM }}>
              Detrás de la IA, una década de obra
            </h2>
            <p className="text-xs text-center mb-10 leading-relaxed" style={{ color: MUTED }}>
              Acustega combina experiencia real en diseño acústico con IA de última generación.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { value: "+100", label: "Estudios diseñados" },
                { value: "+10", label: "Países en LATAM" },
                { value: "20+", label: "Años de experiencia" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 p-4 rounded-2xl text-center"
                  style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}` }}
                >
                  <span className="text-xl font-bold" style={{ color: AMBER }}>{stat.value}</span>
                  <span className="text-[10px] leading-tight" style={{ color: MUTED }}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Artists */}
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-center mb-4" style={{ color: `${MUTED}80` }}>
              Diseñamos los estudios donde se forjó el sonido global de Medellín
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {ARTISTS.map((artist) => (
                <span
                  key={artist}
                  className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${AMBER}12`,
                    border: `1px solid ${AMBER}30`,
                    color: AMBER,
                  }}
                >
                  {artist}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="px-5 py-20 flex flex-col items-center text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${PURPLE}12 0%, transparent 65%)`,
            }}
          />
          <div className="relative z-10 max-w-sm mx-auto">
            <RingsLogo size={64} />
            <h2 className="text-2xl font-bold mt-6 mb-3 leading-snug" style={{ color: CREAM }}>
              Tu estudio merece sonar{" "}
              <span style={{ color: CYAN }}>como fue diseñado</span>
            </h2>
            <p className="text-sm mb-10 leading-relaxed" style={{ color: MUTED }}>
              Obtén un diagnóstico acústico profesional en minutos, sin necesidad de contratar una consultoría costosa.
            </p>
            <button
              onClick={() => router.push("/asesor")}
              className="w-full py-4 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: CYAN,
                color: BG,
                boxShadow: `0 6px 30px ${CYAN}40`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 10px 40px ${CYAN}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 6px 30px ${CYAN}40`;
              }}
            >
              Analizar mi espacio gratis →
            </button>
            <p className="text-[11px] mt-4" style={{ color: `${MUTED}60` }}>
              Sin registro · Sin tarjeta · Resultado en 3 minutos
            </p>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-5 py-6 text-center" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: `${MUTED}40` }}>
            Acustega AI · Medellín, Colombia · Inteligencia acústica para Latinoamérica
          </p>
        </footer>

      </main>
    </>
  );
}
