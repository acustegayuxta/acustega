"use client";

import { useEffect, useRef, useState } from "react";

const GOLD = "#C9A84C";
const COPPER = "#B87333";
const CREAM = "#F5F0E8";
const BG = "#080808";

const ARTISTS = ["Maluma", "Karol G", "Feid", "S. Yatra"];

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
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const waves = [
      { freq: 0.013, amp: 16, phase: 0,   speed: 1.4, color: GOLD,   alpha: 0.35, width: 1.5 },
      { freq: 0.019, amp: 11, phase: 2.1, speed: 2.0, color: COPPER, alpha: 0.25, width: 1.2 },
      { freq: 0.009, amp: 22, phase: 4.4, speed: 0.9, color: GOLD,   alpha: 0.12, width: 2   },
      { freq: 0.025, amp: 7,  phase: 1.3, speed: 2.6, color: COPPER, alpha: 0.18, width: 1   },
    ];

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      waves.forEach((wave) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 1.5) {
          const y =
            h / 2 +
            Math.sin(x * wave.freq + tick * 0.016 * wave.speed + wave.phase) *
              wave.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.alpha;
        ctx.lineWidth = wave.width;
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      tick++;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <main
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${GOLD}14 0%, transparent 65%)`,
          filter: "blur(70px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-20 max-w-xl w-full mx-auto text-center gap-4">

        {/* ── Logo ── */}
        <div className="animate-fade-up relative w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
            <circle cx="50" cy="50" r="47" fill="none" stroke={GOLD}   strokeWidth="0.6" className="animate-ring-outer" />
            <circle cx="50" cy="50" r="37" fill="none" stroke={GOLD}   strokeWidth="0.9" className="animate-ring-mid" />
            <circle cx="50" cy="50" r="27" fill="none" stroke={COPPER} strokeWidth="1.2" className="animate-ring-inner" />
          </svg>
          <svg viewBox="0 0 36 36" className="relative w-6 h-6" aria-hidden>
            {[
              { x: 2,  h: 10, delay: "0s"    },
              { x: 9,  h: 17, delay: "0.15s" },
              { x: 16, h: 24, delay: "0.3s"  },
              { x: 23, h: 17, delay: "0.15s" },
              { x: 30, h: 10, delay: "0s"    },
            ].map((bar, i) => (
              <rect
                key={i}
                x={bar.x} y={(36 - bar.h) / 2}
                width="5" height={bar.h} rx="2.5"
                fill={i === 2 ? GOLD : COPPER}
                style={{
                  animation: "bar-wave 1.2s ease-in-out infinite",
                  animationDelay: bar.delay,
                  transformOrigin: "center",
                  transformBox: "fill-box",
                }}
              />
            ))}
          </svg>
        </div>

        {/* ── Brand ── */}
        <div className="animate-fade-up-1 flex flex-col items-center gap-0.5">
          <h1
            className="text-[2rem] font-bold tracking-[0.28em] leading-none"
            style={{ color: CREAM }}
          >
            ACUSTEG<span style={{ color: GOLD }}>A</span>
          </h1>
          <p
            className="text-[10px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: COPPER }}
          >
            Acoustic intelligence.
          </p>
        </div>

        {/* ── Badge ── */}
        <div className="animate-fade-up-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.16em] uppercase"
            style={{
              border: `1px solid ${GOLD}38`,
              color: GOLD,
              backgroundColor: `${GOLD}0d`,
            }}
          >
            <span
              className="animate-dot-pulse inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: GOLD }}
            />
            En construcción
          </span>
        </div>

        {/* ── Title ── */}
        <h2
          className="animate-fade-up-3 text-[1.45rem] font-bold leading-snug"
          style={{ color: CREAM }}
        >
          El sonido de tu espacio,{" "}
          <span style={{ color: GOLD }}>controlado.</span>
        </h2>

        {/* ── Subtitle ── */}
        <p
          className="animate-fade-up-4 text-[0.8rem] leading-relaxed max-w-sm -mt-1"
          style={{ color: `${CREAM}80` }}
        >
          La primera plataforma de inteligencia acústica para Latinoamérica.
          Diseña, analiza y optimiza la experiencia sonora de cualquier espacio — en tiempo real.
        </p>

        {/* ── Email form ── */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-up-5 w-full max-w-sm"
          aria-label="Registro de interés"
        >
          {!submitted ? (
            <div
              className="flex gap-2 p-1 rounded-xl"
              style={{
                border: `1px solid ${GOLD}28`,
                backgroundColor: `${CREAM}07`,
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 bg-transparent px-3 py-1.5 text-xs outline-none"
                style={{ color: CREAM, caretColor: GOLD }}
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 active:opacity-75"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${COPPER} 100%)`,
                  color: BG,
                  whiteSpace: "nowrap",
                }}
              >
                Notificarme
              </button>
            </div>
          ) : (
            <div
              className="py-2 px-4 rounded-xl text-xs font-medium"
              style={{
                border: `1px solid ${GOLD}28`,
                color: GOLD,
                backgroundColor: `${GOLD}0d`,
              }}
            >
              ¡Listo! Te avisamos en cuanto abramos.
            </div>
          )}
        </form>

        {/* ── Artist chips ── */}
        <div className="animate-fade-up-6 flex flex-col items-center gap-2">
          <p
            className="text-[9px] font-medium tracking-[0.2em] uppercase"
            style={{ color: `${CREAM}45` }}
          >
            Confiado por artistas como
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {ARTISTS.map((artist) => (
              <span
                key={artist}
                className="px-3 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  border: `1px solid ${COPPER}45`,
                  color: COPPER,
                  backgroundColor: `${COPPER}0e`,
                }}
              >
                {artist}
              </span>
            ))}
          </div>
        </div>

        {/* ── Social icons ── */}
        <div className="animate-fade-up-6 flex items-center gap-4">
          {[
            {
              label: "Instagram",
              href: "https://www.instagram.com/acustega",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
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
          ].map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="transition-opacity hover:opacity-70"
              style={{ color: GOLD }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Sound wave canvas ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
        }}
      >
        <SoundWaveCanvas />
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-14"
        style={{ background: `linear-gradient(to top, ${BG} 0%, transparent 100%)` }}
      />

      {/* ── WhatsApp FAB ── */}
      <a
        href="https://wa.me/573137449008"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.486a.75.75 0 0 0 .921.921l5.641-1.471A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.354l-.355-.211-3.684.96.979-3.585-.232-.369A9.713 9.713 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
        </svg>
      </a>
    </main>
  );
}
