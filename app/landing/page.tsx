"use client";

import Link from "next/link";

const BG      = "#0D1117";
const SURFACE = "#161B22";
const SURFACE2= "#1C2128";
const CYAN    = "#00B4D8";
const AMBER   = "#F59E0B";
const CREAM   = "#F0F6FC";
const MUTED   = "#8B949E";
const BORDER  = "#30363D";
const WA_GREEN= "#25D366";

const NAV = [
  { label: "Asesor",    href: "/asesor"    },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Precios",   href: "#precios"   },
  { label: "Contacto",  href: "#contacto"  },
];

const STATS = [
  { value: "100+", label: "Espacios" },
  { value: "20+",  label: "Años exp." },
  { value: "4.9",  label: "Rating" },
];

const PRICING = [
  {
    name: "Hogar",
    price: "$49",
    desc: "Residencias y home studios",
    features: [
      "Diagnóstico acústico con IA",
      "Reporte PDF básico",
      "1 revisión incluida",
      "Soporte por email",
    ],
    cta: "Comenzar",
    highlight: false,
  },
  {
    name: "Estudio",
    price: "$149",
    desc: "Estudios de grabación profesionales",
    features: [
      "Diagnóstico acústico avanzado",
      "Reporte PDF completo",
      "3 revisiones incluidas",
      "Videollamada con experto",
      "Plan de materiales",
    ],
    cta: "Elegir Estudio",
    highlight: true,
  },
  {
    name: "Industria",
    price: "$299",
    desc: "Espacios industriales y comerciales",
    features: [
      "Diagnóstico técnico completo",
      "Reporte técnico detallado",
      "Revisiones ilimitadas",
      "Consultoría presencial",
      "Plan de obra acústica",
      "Certificación técnica",
    ],
    cta: "Contactar",
    highlight: false,
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/acustega",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
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
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
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

function TriangleLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <polygon points="16,3 30,28 2,28" fill="none" stroke={CYAN} strokeWidth="1.8" strokeLinejoin="round" />
      <polygon points="16,12 23,26 9,26" fill={CYAN} fillOpacity="0.15" />
      <line x1="9" y1="21" x2="23" y2="21" stroke={CYAN} strokeWidth="1.8" strokeOpacity="0.7" strokeLinecap="round" />
      <circle cx="16" cy="25.5" r="1.8" fill={AMBER} />
    </svg>
  );
}

function IsometricRoom() {
  return (
    <svg viewBox="0 0 360 240" className="w-full h-full" fill="none" aria-hidden>
      <defs>
        <radialGradient id="rglow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={CYAN} stopOpacity="0.18" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
        <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="180" cy="128" rx="165" ry="110" fill="url(#rglow)" />
      <polygon points="40,102 180,32 180,138 40,186" fill="#121b2e" stroke={BORDER} strokeWidth="0.8" />
      <polygon points="180,32 320,102 320,186 180,138" fill="#0e1622" stroke={BORDER} strokeWidth="0.8" />
      <polygon points="40,186 180,138 320,186 180,224" fill="#090e16" stroke={BORDER} strokeWidth="0.8" />
      <line x1="180" y1="32" x2="180" y2="138" stroke={CYAN} strokeWidth="1" strokeOpacity="0.45" />
      <line x1="42" y1="102" x2="179" y2="33" stroke={CYAN} strokeWidth="1.4" strokeOpacity="0.35" />
      <line x1="181" y1="33" x2="318" y2="102" stroke={AMBER} strokeWidth="1.4" strokeOpacity="0.35" />
      <polygon points="52,104 96,79 96,97 52,122"    fill={CYAN}  fillOpacity="0.13" stroke={CYAN}  strokeWidth="0.65" strokeOpacity="0.55" />
      <polygon points="104,76 148,52 148,70 104,94"  fill={CYAN}  fillOpacity="0.13" stroke={CYAN}  strokeWidth="0.65" strokeOpacity="0.55" />
      <polygon points="156,49 178,37 178,54 156,66"  fill={CYAN}  fillOpacity="0.08" stroke={CYAN}  strokeWidth="0.55" strokeOpacity="0.3"  />
      <polygon points="52,128 96,104 96,118 52,142"  fill={AMBER} fillOpacity="0.10" stroke={AMBER} strokeWidth="0.65" strokeOpacity="0.45" />
      <polygon points="104,100 148,76 148,90 104,114" fill={AMBER} fillOpacity="0.10" stroke={AMBER} strokeWidth="0.65" strokeOpacity="0.45" />
      <polygon points="184,36 228,62 228,80 184,54"  fill={AMBER} fillOpacity="0.13" stroke={AMBER} strokeWidth="0.65" strokeOpacity="0.55" />
      <polygon points="236,65 280,91 280,109 236,83"  fill={AMBER} fillOpacity="0.13" stroke={AMBER} strokeWidth="0.65" strokeOpacity="0.55" />
      <polygon points="288,94 316,110 316,124 288,108" fill={AMBER} fillOpacity="0.08" stroke={AMBER} strokeWidth="0.55" strokeOpacity="0.3"  />
      <polygon points="184,60 228,86 228,100 184,74"  fill={CYAN}  fillOpacity="0.08" stroke={CYAN}  strokeWidth="0.55" strokeOpacity="0.35" />
      <polygon points="236,89 280,115 280,126 236,100" fill={CYAN}  fillOpacity="0.08" stroke={CYAN}  strokeWidth="0.55" strokeOpacity="0.35" />
      <polygon points="70,188 130,160 188,175 128,203" fill="#182336" stroke={CYAN}  strokeWidth="0.9" strokeOpacity="0.75" />
      <polygon points="70,188 128,203 128,215 70,200"  fill="#101c2c" stroke={BORDER} strokeWidth="0.6" />
      <polygon points="128,203 188,175 188,187 128,215" fill="#132030" stroke={BORDER} strokeWidth="0.6" />
      <polygon points="96,174 134,154 143,159 105,179"  fill="#070d14" stroke={CYAN} strokeWidth="0.9" strokeOpacity="0.9" />
      <polygon points="99,175 131,157 139,161 107,179"  fill={CYAN} fillOpacity="0.07" />
      <line x1="100" y1="170" x2="136" y2="151" stroke={CYAN} strokeWidth="0.4" strokeOpacity="0.4" />
      <line x1="102" y1="173" x2="138" y2="154" stroke={CYAN} strokeWidth="0.4" strokeOpacity="0.3" />
      <polygon points="282,162 316,143 316,172 282,191" fill="#121e2c" stroke={AMBER} strokeWidth="0.9" strokeOpacity="0.7" />
      <ellipse cx="299" cy="166" rx="9" ry="7" fill="none" stroke={AMBER} strokeWidth="0.7" strokeOpacity="0.55" transform="rotate(-30 299 166)" />
      <ellipse cx="299" cy="166" rx="4" ry="3.2" fill={AMBER} fillOpacity="0.22" transform="rotate(-30 299 166)" />
      <path d="M 274,148 Q 260,166 274,184" stroke={CYAN} strokeWidth="0.9" strokeOpacity="0.4" />
      <path d="M 264,143 Q 246,166 264,189" stroke={CYAN} strokeWidth="0.65" strokeOpacity="0.22" />
      <line x1="110" y1="212" x2="180" y2="138" stroke={BORDER} strokeWidth="0.4" strokeOpacity="0.5" />
      <line x1="250" y1="212" x2="180" y2="138" stroke={BORDER} strokeWidth="0.4" strokeOpacity="0.5" />
      <circle cx="180" cy="32" r="3.5" fill={CYAN} fillOpacity="0.9" filter="url(#glow-sm)" />
    </svg>
  );
}

function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{ backgroundColor: `${BG}ee`, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: `1px solid ${BORDER}` }}
    >
      <Link href="/" className="flex items-center gap-2.5 select-none">
        <TriangleLogo size={28} />
        <span className="text-sm font-bold tracking-[0.2em] leading-none" style={{ color: CREAM }}>
          ACUSTEG<span style={{ color: CYAN }}>A</span>
        </span>
      </Link>
      <nav className="flex items-center gap-6">
        {NAV.map(({ label, href }) => (
          <Link key={label} href={href} className="text-[12px] font-medium tracking-wide transition-colors" style={{ color: MUTED }}
            onMouseEnter={(e) => (e.currentTarget.style.color = CREAM)}
            onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
          >
            {label}
          </Link>
        ))}
        <Link href="/asesor" className="px-4 py-1.5 rounded-lg text-[12px] font-semibold tracking-wide transition-opacity hover:opacity-85" style={{ backgroundColor: CYAN, color: BG }}>
          Analizar
        </Link>
      </nav>
    </header>
  );
}

function Check({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4 flex-shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" fill={color} fillOpacity="0.15" />
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: BG, fontFamily: "var(--font-outfit)", color: CREAM, minHeight: "100vh" }}>
      <Header />

      <section className="min-h-screen flex items-center pt-16 px-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20">
          <div className="flex flex-col gap-7">
            <span className="self-start inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.15em] uppercase"
              style={{ border: `1px solid ${CYAN}35`, color: CYAN, backgroundColor: `${CYAN}0d` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CYAN, boxShadow: `0 0 6px ${CYAN}` }} />
              Inteligencia Acústica · IA
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight" style={{ color: CREAM }}>
              Tu espacio sin <span style={{ color: CYAN }}>ruido</span><br />Diseñado por IA
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-md" style={{ color: MUTED }}>
              Diagnosticamos y transformamos cualquier espacio con 20 años de experiencia acústica y modelos de IA entrenados con cientos de proyectos reales.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/asesor" className="px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-opacity hover:opacity-85" style={{ backgroundColor: CYAN, color: BG }}>
                Analizar mi espacio
              </Link>
              <a href="#precios" className="px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors"
                style={{ border: `1px solid ${BORDER}`, color: CREAM, backgroundColor: SURFACE }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${CYAN}60`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}>
                Ver precios
              </a>
            </div>
            <div className="flex items-center gap-1.5 pt-2">
              {["Maluma", "Karol G", "Feid"].map((a) => (
                <span key={a} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ border: `1px solid ${BORDER}`, color: MUTED, backgroundColor: SURFACE }}>
                  {a}
                </span>
              ))}
              <span className="text-[10px]" style={{ color: MUTED }}>+ más</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden flex flex-col"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: `0 0 60px ${CYAN}18` }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
              <span className="ml-3 text-[11px] font-medium" style={{ color: MUTED }}>acustega — análisis.acústico</span>
            </div>
            <div className="w-full aspect-[3/2] bg-[#090e16] p-4"><IsometricRoom /></div>
            <div className="grid grid-cols-3" style={{ borderTop: `1px solid ${BORDER}` }}>
              {STATS.map(({ value, label }, i) => (
                <div key={label} className="flex flex-col items-center py-4 gap-0.5"
                  style={{ borderRight: i < STATS.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <span className="text-xl font-bold" style={{ color: CYAN }}>{value}</span>
                  <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: MUTED }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="precios" className="px-6 py-24" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: CYAN }}>Precios</p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Elige tu <span style={{ color: AMBER }}>plan</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed max-w-md mx-auto" style={{ color: MUTED }}>
              Sin suscripción. Pago único por diagnóstico y reporte completo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRICING.map((plan) => (
              <div key={plan.name} className="relative flex flex-col rounded-2xl p-6 gap-6"
                style={{ backgroundColor: plan.highlight ? SURFACE2 : SURFACE, border: `1px solid ${plan.highlight ? CYAN + "60" : BORDER}`, boxShadow: plan.highlight ? `0 0 40px ${CYAN}14` : "none" }}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase"
                    style={{ backgroundColor: CYAN, color: BG }}>Popular</span>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: plan.highlight ? CYAN : MUTED }}>{plan.name}</span>
                  <p className="text-[12px]" style={{ color: MUTED }}>{plan.desc}</p>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold" style={{ color: CREAM }}>{plan.price}</span>
                  <span className="mb-1 text-sm" style={{ color: MUTED }}>USD</span>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: MUTED }}>
                      <Check color={plan.highlight ? CYAN : AMBER} />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/asesor" className="text-center py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-opacity hover:opacity-85"
                  style={plan.highlight ? { backgroundColor: CYAN, color: BG } : { border: `1px solid ${BORDER}`, color: CREAM, backgroundColor: "transparent" }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contacto" className="px-6 py-10" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <TriangleLogo size={22} />
              <span className="text-sm font-bold tracking-[0.2em]" style={{ color: CREAM }}>
                ACUSTEG<span style={{ color: CYAN }}>A</span>
              </span>
            </div>
            <p className="text-[11px]" style={{ color: MUTED }}>Medellín, Colombia</p>
            <p className="text-[10px] mt-0.5" style={{ color: `${MUTED}60` }}>
              © {new Date().getFullYear()} Acustega. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ label, href, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: MUTED, border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = CYAN; (e.currentTarget as HTMLElement).style.borderColor = `${CYAN}50`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = MUTED; (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}>
                {icon}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <a href="https://wa.me/573137449008" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ width: 52, height: 52, backgroundColor: WA_GREEN, boxShadow: `0 4px 20px ${WA_GREEN}55` }}>
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
