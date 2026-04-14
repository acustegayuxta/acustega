"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const BG   = "#0D1117";
const CYAN = "#00B4D8";
const MUTED = "#8B949E";

const SPLASH_DELAY = 3000;  // ms before fade starts
const FADE_DURATION = 500;  // ms fade-out takes

export default function SplashPage() {
  const router = useRouter();
  const [fading, setFading] = useState(false);
  const triggered = useRef(false);

  const navigate = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;
    setFading(true);
    setTimeout(() => router.push("/landing"), FADE_DURATION);
  }, [router]);

  useEffect(() => {
    const t = setTimeout(navigate, SPLASH_DELAY);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <>
      <style>{`
        @keyframes ring-breathe-outer {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.08; }
        }
        @keyframes ring-breathe-mid {
          0%, 100% { opacity: 0.60; }
          50%       { opacity: 0.15; }
        }
        @keyframes ring-breathe-inner {
          0%, 100% { opacity: 0.90; }
          50%       { opacity: 0.30; }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes sonar-out {
          0%   { transform: scale(0.35); opacity: 0.55; }
          100% { transform: scale(1.55); opacity: 0;    }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div
        className="fixed inset-0 flex flex-col items-center justify-center select-none"
        style={{
          backgroundColor: BG,
          fontFamily: "var(--font-outfit)",
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_DURATION}ms ease-out`,
        }}
      >
        {/* ── Centered content ── */}
        <div
          className="flex flex-col items-center gap-10"
          style={{ animation: "fade-in-up 0.7s ease-out both" }}
        >

          {/* ── Rings logo ── */}
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            fill="none"
            aria-label="Acustega logo"
          >
            <defs>
              <radialGradient id="sp-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={CYAN} stopOpacity="0.22" />
                <stop offset="100%" stopColor={CYAN} stopOpacity="0"    />
              </radialGradient>
              <filter id="sp-blur" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient background glow */}
            <circle cx="90" cy="90" r="90" fill="url(#sp-glow)" />

            {/* Sonar ring — expands outward continuously */}
            <circle
              cx="90" cy="90" r="62"
              stroke={CYAN}
              strokeWidth="1.2"
              fill="none"
              style={{
                transformOrigin: "90px 90px",
                animation: "sonar-out 2.4s ease-out infinite",
              }}
            />

            {/* Outer ring */}
            <circle
              cx="90" cy="90" r="76"
              stroke={CYAN}
              strokeWidth="1.5"
              strokeDasharray="12 6"
              fill="none"
              style={{
                transformOrigin: "90px 90px",
                animation: "ring-breathe-outer 4s ease-in-out infinite 0.9s",
              }}
            />

            {/* Mid ring */}
            <circle
              cx="90" cy="90" r="56"
              stroke={CYAN}
              strokeWidth="2"
              strokeDasharray="7 4"
              fill="none"
              style={{
                transformOrigin: "90px 90px",
                animation: "ring-breathe-mid 3.2s ease-in-out infinite 0.45s",
              }}
            />

            {/* Inner ring */}
            <circle
              cx="90" cy="90" r="36"
              stroke={CYAN}
              strokeWidth="2.5"
              fill="none"
              style={{
                transformOrigin: "90px 90px",
                animation: "ring-breathe-inner 2.6s ease-in-out infinite",
              }}
            />

            {/* Center dot */}
            <circle
              cx="90" cy="90" r="7"
              fill={CYAN}
              filter="url(#sp-blur)"
              style={{
                transformOrigin: "90px 90px",
                animation: "dot-pulse 2.6s ease-in-out infinite",
              }}
            />
          </svg>

          {/* ── Text ── */}
          <div className="flex flex-col items-center gap-2.5">
            <h1
              className="font-bold leading-none"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 3.5rem)",
                letterSpacing: "0.22em",
                color: "white",
              }}
            >
              ACUSTEGA<span style={{ color: CYAN }}>AI</span>
            </h1>
            <p
              className="text-sm font-medium"
              style={{
                letterSpacing: "0.35em",
                color: MUTED,
                textTransform: "uppercase",
              }}
            >
              Acoustic Intelligence
            </p>
          </div>
        </div>

        {/* ── Skip button ── */}
        <button
          onClick={navigate}
          className="fixed bottom-8 right-8 text-xs font-medium transition-colors hover:text-white"
          style={{ color: `${MUTED}70`, letterSpacing: "0.08em" }}
        >
          Saltar →
        </button>
      </div>
    </>
  );
}
