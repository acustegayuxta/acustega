"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const GOLD = "#C9A84C";
const COPPER = "#B87333";
const CREAM = "#F5F0E8";
const BG = "#080808";
const SURFACE = "#111111";
const BORDER = "#1e1e1e";
const WA_GREEN = "#25D366";

const NAV = [
  { label: "Asesor",      href: "/asesor"       },
  { label: "Proyectos",   href: "#proyectos"    },
  { label: "Curso",       href: "#curso"        },
  { label: "Consultoría", href: "#consultoria"  },
];

const ARTISTS = ["Maluma", "Karol G", "Feid", "S. Yatra"];

const SPACES = [
  { id: "estudio",        label: "Estudio",        emoji: "🎙️", subtitle: "Grabación profesional"  },
  { id: "home-studio",    label: "Home Studio",    emoji: "🎧", subtitle: "Producción en casa"      },
  { id: "iglesia",        label: "Iglesia",        emoji: "⛪", subtitle: "Espacios de culto"       },
  { id: "restaurante",    label: "Restaurante",    emoji: "🍽️", subtitle: "Ambiente y confort"      },
  { id: "sonido-en-vivo", label: "Sonido en vivo", emoji: "🎤", subtitle: "Eventos y conciertos"   },
  { id: "oficina",        label: "Oficina",        emoji: "💼", subtitle: "Productividad y foco"   },
  { id: "industrial",     label: "Industrial",     emoji: "🏭", subtitle: "Control de ruido"       },
];

const STEPS = [
  {
    number: "01",
    title: "Describe tu espacio",
    body: "Cuéntale al asesor IA las dimensiones, materiales y el problema principal de tu espacio.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Recibe tu diagnóstico",
    body: "La IA analiza las frecuencias problemáticas y te explica exactamente qué está pasando y por qué.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Obtén tu reporte",
    body: "Descarga el informe acústico completo con materiales, medidas y plan de acción por solo 9.99 USD.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/acustega",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/acustega",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://co.linkedin.com/company/acustega",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/Acustega_",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

// ── Logo (spinning rings) ────────────────────────────────────────────────────

function RingsLogo({ size = 40 }: { size?: number }) {
  const cx = 50;
  const cy = 50;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin-cw 8s linear infinite" }}>
        <circle cx={cx} cy={cy} r="46" fill="none" stroke={GOLD}   strokeWidth="1"   strokeDasharray="6 4" />
      </g>
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin-ccw 5s linear infinite" }}>
        <circle cx={cx} cy={cy} r="36" fill="none" stroke={COPPER} strokeWidth="1.2" strokeDasharray="3 5" />
      </g>
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin-cw 3s linear infinite" }}>
        <circle cx={cx} cy={cy} r="26" fill="none" stroke={GOLD}   strokeWidth="1.5" strokeDasharray="8 3" />
      </g>
      <circle
        cx={cx} cy={cy} r="5"
        fill={GOLD}
        style={{ transformOrigin: `${cx}px ${cy}px`, animation: "center-dot-pulse 2s ease-in-out infinite" }}
      />
    </svg>
  );
}

// ── Sound wave canvas ────────────────────────────────────────────────────────

function SoundWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let tick = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const waves = [
      { freq: 0.013, amp: 18, phase: 0,   speed: 1.4, color: GOLD,   alpha: 0.35, width: 1.5 },
      { freq: 0.019, amp: 12, phase: 2.1, speed: 2.0, color: COPPER, alpha: 0.22, width: 1.2 },
      { freq: 0.009, amp: 26, phase: 4.4, speed: 0.9, color: GOLD,   alpha: 0.10, width: 2   },
      { freq: 0.025, amp: 8,  phase: 1.3, speed: 2.6, color: COPPER, alpha: 0.16, width: 1   },
    ];

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      waves.forEach((wave) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 1.5) {
          const y = h / 2 + Math.sin(x * wave.freq + tick * 0.016 * wave.speed + wave.phase) * wave.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.alpha;
        ctx.lineWidth   = wave.width;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      tick++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// ── Header ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        backgroundColor: `${BG}e0`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${GOLD}18`,
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 select-none">
        <RingsLogo size={34} />
        <span className="text-base font-bold tracking-[0.22em] leading-none" style={{ color: CREAM }}>
          ACUSTEG<span style={{ color: GOLD }}>A</span>
        </span>
      </Link>

      <nav className="flex items-center gap-6">
        {NAV.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="text-[12px] font-medium tracking-wider uppercase transition-colors hover:opacity-100"
            style={{ color: `${CREAM}80` }}
            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={(e) => (e.currentTarget.style.color = `${CREAM}80`)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}>
      <Header />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden pt-16">

        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}12 0%, transparent 65%)`,
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto gap-6">

          {/* Badge */}
          <div className="animate-fade-up">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase"
              style={{ border: `1px solid ${GOLD}35`, color: GOLD, backgroundColor: `${GOLD}0e` }}
            >
              <span
                className="animate-dot-pulse inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
              Inteligencia Acústica · Medellín, Colombia
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up-1 text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight"
            style={{ color: CREAM }}
          >
            El sonido de tu espacio,{" "}
            <span style={{ color: GOLD }}>controlado.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up-2 text-base sm:text-lg leading-relaxed max-w-xl"
            style={{ color: `${CREAM}75` }}
          >
            Combinamos inteligencia artificial con más de 20 años de experiencia
            acústica para diagnosticar y transformar cualquier espacio — desde
            un home studio hasta una sala de conciertos.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-3 flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              href="/asesor"
              className="px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${COPPER})`, color: BG }}
            >
              Analizar mi espacio
            </Link>
            <a
              href="#proyectos"
              className="px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors"
              style={{ border: `1px solid ${GOLD}35`, color: CREAM, backgroundColor: `${GOLD}0a` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${GOLD}80`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${GOLD}35`)}
            >
              Ver proyectos
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-up-4 flex items-center gap-8 mt-4">
            {[
              { value: "100+", label: "Estudios" },
              { value: "20+",  label: "Años de experiencia" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="text-3xl font-bold leading-none" style={{ color: GOLD }}>{value}</span>
                <span className="text-[11px] font-medium tracking-wider uppercase" style={{ color: `${CREAM}55` }}>
                  {label}
                </span>
              </div>
            ))}

            <div className="w-px h-10 self-center" style={{ backgroundColor: `${GOLD}25` }} />

            <div className="flex flex-col items-start gap-1.5">
              <p className="text-[9px] font-medium tracking-[0.2em] uppercase" style={{ color: `${CREAM}40` }}>
                Artistas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ARTISTS.map((artist) => (
                  <span
                    key={artist}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ border: `1px solid ${COPPER}45`, color: COPPER, backgroundColor: `${COPPER}0e` }}
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sound wave at bottom of hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-28"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }}
        >
          <SoundWaveCanvas />
        </div>

        {/* Bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
          style={{ background: `linear-gradient(to top, ${BG} 0%, transparent 100%)` }}
        />
      </section>

      {/* ── Spaces grid ───────────────────────────────────────────────────── */}
      <section id="proyectos" className="px-6 py-24 max-w-4xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: COPPER }}>
            Espacios
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: CREAM }}>
            ¿Qué espacio vamos a{" "}
            <span style={{ color: GOLD }}>optimizar?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed max-w-md mx-auto" style={{ color: `${CREAM}60` }}>
            Selecciona tu tipo de espacio y recibe un diagnóstico acústico personalizado en minutos.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SPACES.map((space, i) => {
            const isLast = i === SPACES.length - 1;
            return (
              <Link
                key={space.id}
                href="/asesor"
                className={`group flex items-center gap-3 px-4 py-4 rounded-2xl transition-all${isLast ? " col-span-2 sm:col-span-1 sm:col-start-2" : ""}`}
                style={{
                  backgroundColor: SURFACE,
                  border: `1px solid ${BORDER}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}50`;
                  (e.currentTarget as HTMLElement).style.backgroundColor = `${GOLD}0a`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = BORDER;
                  (e.currentTarget as HTMLElement).style.backgroundColor = SURFACE;
                }}
              >
                <span className="text-2xl leading-none flex-shrink-0">{space.emoji}</span>
                <div className="flex flex-col min-w-0">
                  <span
                    className="text-sm font-bold leading-tight truncate transition-colors group-hover:text-[color:var(--gold)]"
                    style={{ color: CREAM, ["--gold" as string]: GOLD }}
                  >
                    {space.label}
                  </span>
                  <span className="text-[11px] leading-tight truncate mt-0.5" style={{ color: `${CREAM}50` }}>
                    {space.subtitle}
                  </span>
                </div>
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="w-4 h-4 flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200"
                  style={{ color: GOLD }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="curso" className="px-6 py-24" style={{ borderTop: `1px solid ${GOLD}10` }}>
        <div className="max-w-4xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: COPPER }}>
              Proceso
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: CREAM }}>
              Cómo{" "}
              <span style={{ color: GOLD }}>funciona</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed max-w-md mx-auto" style={{ color: `${CREAM}60` }}>
              Tres pasos para transformar tu espacio con inteligencia acústica.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative flex flex-col gap-4 p-6 rounded-2xl" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>

                {/* Connector line (between cards, desktop only) */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden sm:block absolute top-[2.4rem] left-full w-6 h-px z-10"
                    style={{ backgroundColor: `${GOLD}30` }}
                  />
                )}

                {/* Step number */}
                <span
                  className="text-[11px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: `${GOLD}60` }}
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${GOLD}12`, color: GOLD, border: `1px solid ${GOLD}25` }}
                >
                  {step.icon}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold leading-tight" style={{ color: CREAM }}>
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: `${CREAM}60` }}>
                    {step.body}
                  </p>
                </div>

                {/* Price badge on last step */}
                {i === STEPS.length - 1 && (
                  <span
                    className="self-start px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD}, ${COPPER})`,
                      color: BG,
                    }}
                  >
                    9.99 USD
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/asesor"
              className="inline-flex px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${COPPER})`, color: BG }}
            >
              Comenzar análisis gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        id="consultoria"
        className="px-6 py-12"
        style={{ borderTop: `1px solid ${GOLD}14` }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <RingsLogo size={24} />
              <span className="text-sm font-bold tracking-[0.22em]" style={{ color: CREAM }}>
                ACUSTEG<span style={{ color: GOLD }}>A</span>
              </span>
            </div>
            <p className="text-[11px]" style={{ color: `${CREAM}40` }}>
              Medellín, Colombia
            </p>
            <p className="text-[10px] mt-1" style={{ color: `${CREAM}28` }}>
              © {new Date().getFullYear()} Acustega. Todos los derechos reservados.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ color: `${GOLD}80`, border: `1px solid ${GOLD}20`, backgroundColor: `${GOLD}08` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = GOLD;
                  (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}50`;
                  (e.currentTarget as HTMLElement).style.backgroundColor = `${GOLD}14`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = `${GOLD}80`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}20`;
                  (e.currentTarget as HTMLElement).style.backgroundColor = `${GOLD}08`;
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── WhatsApp floating button ───────────────────────────────────────── */}
      <a
        href="https://wa.me/573137449008"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: WA_GREEN, boxShadow: `0 4px 20px ${WA_GREEN}55` }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
