import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Boxes,
  Building,
  Building2,
  CheckCircle2,
  FileText,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Government", href: "#for-whom" },
  { label: "For Startups", href: "#for-whom" },
];

const pillars = [
  { value: "GFR-Informed", label: "Procurement" },
  { value: "CVC-Aligned", label: "Transparency" },
  { value: "DPIIT-Friendly", label: "Startup Flow" },
  { value: "MeitY Cloud", label: "Compatible" },
];

const ticker: { text: string }[] = [
  { text: "SIMULATION: ₹12.5L Escrow Vault Live" },
  { text: "HydroSense Milestone Evidence Received" },
  { text: "Challenge Model: Land Encroachment AI (₹48L)" },
  { text: "QCBS Rubric · DPIIT Gate Verified" },
  { text: "Sandbox: 5km Urban Zone Parametrized" },
  { text: "GovInnovate OS Prototype Ready" },
];

const stats = [
  { value: "₹10 Cr+", label: "Escrow Pool", sub: "Aggregate platform liquidity", accent: "text-indigo-400" },
  { value: "6", label: "Legal Templates", sub: "GFR & CVC aligned models", accent: "text-emerald-400" },
  { value: "48h", label: "Disbursement SLA", sub: "Automated audit release", accent: "text-cyan-400" },
  { value: "100%", label: "IP Retained", sub: "Owned by startups", accent: "text-purple-400" },
];

const features: { icon: LucideIcon; title: string; body: string; accent: string }[] = [
  {
    icon: FileText,
    title: "Legal Template Studio",
    body: "6 standardized GFR-informed contract models with live variable binding and instant Markdown exports.",
    accent: "text-indigo-400",
  },
  {
    icon: Boxes,
    title: "Controlled Sandbox",
    body: "Parametrize geographical boundaries, synthetic data pipelines, and error stop-loss limits.",
    accent: "text-emerald-400",
  },
  {
    icon: Award,
    title: "QCBS Evaluation Matrix",
    body: "5-pillar weighted scoring framework aligned to CVC guidance for auditable evaluation consensus.",
    accent: "text-cyan-400",
  },
  {
    icon: Building,
    title: "Department Studio",
    body: "Formulate problem statements around outcome KPIs instead of restrictive hardware specs.",
    accent: "text-purple-400",
  },
  {
    icon: Rocket,
    title: "Startup Hub",
    body: "One-click fast track applications with GFR Rule 173(i) waivers for turnover and past track record.",
    accent: "text-indigo-400",
  },
  {
    icon: Wallet,
    title: "Smart Escrow Ledger",
    body: "Tranche-based automated fund release linked to verified milestone telemetry and audit approvals.",
    accent: "text-emerald-400",
  },
];

const steps = [
  { n: "1", title: "Post Challenge", body: "Department formulates problem with outcome KPI and committed escrow balance." },
  { n: "2", title: "Startup Intake", body: "DPIIT startups apply with waiver provisions under GFR Rule 173(i)." },
  { n: "3", title: "Sandbox Trial", body: "Execute in a controlled, risk-isolated testbed using live or synthetic feeds." },
  { n: "4", title: "Audit & Escrow", body: "Committee reviews telemetry, releasing escrow tranches within 48 hours." },
  { n: "5", title: "Scale-Up Ready", body: "Pilots scoring ≥85% receive direct conversion scale certificates for GeM." },
];

const govChecklist = [
  "Fast-track challenges with attached sandbox boundaries",
  "Full audit compliance aligned with GFR & CVC rules",
  "Real-time telemetry monitoring with stop-loss protection",
];

const startupChecklist = [
  "GFR 173(i) waiver on past turnover and experience",
  "100% IP ownership retained contractually",
  "48-hour escrow tranche releases upon milestone validation",
];

function GlowLogoMark() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-[#0b1225]">
          <Sparkles className="size-4 text-indigo-400" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-normal text-white">GovInnovate</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
          OS
        </span>
        <span className="ml-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-400">
          PROTOTYPE
        </span>
      </div>
    </Link>
  );
}

function GoToDashboard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/dashboard"
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 hover:shadow-indigo-500/40 ${className}`}
    >
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05080f] text-white">
      {/* NAV */}
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center border-b border-white/[0.08] bg-[#05080f]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
          <GlowLogoMark />
          <div className="hidden items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300 md:flex">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="transition hover:text-indigo-400">
                {l.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <GoToDashboard className="px-5 py-2.5">
              <span>Go to Dashboard</span>
              <ArrowRight className="size-4" />
            </GoToDashboard>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-24">
        <div className="pointer-events-none absolute -z-10 left-1/3 top-1/4 h-[450px] w-[850px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="pointer-events-none absolute -z-10 right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-8">
          {/* Left */}
          <div className="space-y-6 text-left lg:col-span-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#0b1225] px-4 py-1.5 shadow-xl">
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="font-mono text-xs font-bold text-slate-300">
                Public Procurement & Sandbox Gateway Model
              </span>
            </div>

            <div>
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Where Government
              </h1>
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text italic text-transparent">
                  Meets Innovation.
                </span>
              </h1>
            </div>

            <p className="max-w-lg text-base font-medium leading-relaxed text-slate-300">
              Connecting government departments with DPIIT-recognised startups through controlled
              sandboxes, milestone-gated escrow, and zero red-tape delays. GFR 173(i) compliant by
              design.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <GoToDashboard className="px-7 py-3.5">
                <span>Go to Dashboard</span>
                <ArrowRight className="size-4" />
              </GoToDashboard>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0b1225] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#0b1225]/70"
              >
                <Play className="size-4 text-indigo-400" />
                <span>Run Auto-Demo</span>
              </Link>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-2 gap-2.5 pt-4 sm:grid-cols-4">
              {pillars.map((p, i) => (
                <div
                  key={p.value}
                  className="rounded-xl border border-white/[0.08] bg-[#0b1225] p-2.5 text-center"
                >
                  <span
                    className={`block font-mono text-[11px] font-bold ${
                      i % 2 === 0 ? "text-indigo-400" : "text-cyan-400"
                    }`}
                  >
                    {p.value}
                  </span>
                  <span className="block text-[9px] font-bold uppercase text-slate-400">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: orbital graphic */}
          <div className="relative flex items-center justify-center pt-8 lg:col-span-6 lg:pt-0">
            <div className="relative flex aspect-square w-full max-w-[480px] items-center justify-center">
              <div className="pointer-events-none absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/[0.1]" />
              <div className="pointer-events-none absolute inset-8 animate-reverse-spin rounded-full border border-indigo-500/30">
                <div className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]" />
              </div>
              <div className="pointer-events-none absolute inset-20 animate-spin-slow rounded-full border border-cyan-500/25">
                <div className="absolute -left-1.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </div>

              <div className="relative z-10 flex size-44 flex-col items-center justify-center rounded-full border-2 border-indigo-500/40 bg-gradient-to-br from-[#0b1225] via-[#0b1225] to-[#1e1b4b] p-4 text-center shadow-2xl backdrop-blur-2xl">
                <div className="mb-1.5 flex size-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/20 text-indigo-400">
                  <ShieldCheck className="size-6" />
                </div>
                <span className="text-xs font-black tracking-tight text-white">GovInnovate Engine</span>
                <span className="mt-0.5 font-mono text-[10px] font-bold text-indigo-400">
                  Autonomous Gateway
                </span>
              </div>

              <div className="absolute left-2 top-2 z-20 flex animate-float-slow items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0b1225]/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
                <div className="flex size-8 items-center justify-center rounded-xl bg-white/5 text-slate-300">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Gov Department</div>
                  <div className="text-[9px] text-slate-400">Problem KPI Formulation</div>
                </div>
              </div>

              <div className="absolute right-0 top-6 z-20 flex animate-float-delayed items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#0b1225]/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
                <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Wallet className="size-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Smart Escrow</div>
                  <div className="font-mono text-[10px] font-bold text-emerald-400">₹4.85 Cr Secured</div>
                </div>
              </div>

              <div className="absolute bottom-6 left-0 z-20 flex animate-float-delayed items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0b1225]/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
                <div className="flex size-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                  <Rocket className="size-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">DPIIT Startup Hub</div>
                  <div className="text-[9px] text-cyan-400">100% IP Retained</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-2 z-20 flex animate-float-slow items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0b1225]/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
                <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                  <BadgeCheck className="size-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">GeM Scale-Up</div>
                  <div className="text-[10px] font-medium text-purple-400">Single-Source Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE TICKER */}
      <div className="relative overflow-hidden border-y border-white/[0.08] bg-[#0b1225] py-3.5">
        <div className="flex w-max animate-marquee font-mono text-xs font-bold tracking-wider text-slate-300">
          <div className="flex shrink-0 items-center">
            {ticker.map((t) => (
              <span key={t.text} className="px-6">
                {t.text}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center" aria-hidden>
            {ticker.map((t) => (
              <span key={`${t.text}-2`} className="px-6">
                {t.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <section className="border-b border-white/[0.08] bg-[#0b1225] py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-white/[0.08] bg-[#05080f] p-6 shadow-xl">
              <div className={`font-mono text-3xl font-black sm:text-4xl ${s.accent}`}>{s.value}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-wider text-white">{s.label}</div>
              <div className="mt-0.5 text-[11px] text-slate-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#05080f] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-indigo-400">
              Architecture
            </span>
            <h2 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Platform Features</h2>
            <p className="mt-2 text-sm font-medium text-slate-400">
              Six integrated modules covering the complete sandbox and innovation lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="space-y-4 rounded-3xl border border-white/[0.08] bg-[#0b1225] p-7 shadow-xl transition hover:border-indigo-500/40"
              >
                <div className={`flex size-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/5 ${f.accent}`}>
                  <f.icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-white/[0.08] bg-[#0b1225] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
              Workflow
            </span>
            <h2 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">How GovInnovate OS Works</h2>
            <p className="mt-2 text-sm font-medium text-slate-400">
              A 5-step milestone pipeline from challenge formulation to scale-up.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <div key={s.n} className="space-y-3 rounded-3xl border border-white/[0.08] bg-[#05080f] p-6 text-center">
                <div className="mx-auto flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 font-mono text-sm font-black text-white shadow-lg shadow-indigo-500/30">
                  {s.n}
                </div>
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-xs leading-relaxed text-slate-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHOM */}
      <section id="for-whom" className="bg-[#05080f] py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
          <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-indigo-500/30 bg-[#0b1225] p-8 shadow-2xl sm:p-10">
            <div>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                For Government
              </span>
              <h3 className="mt-4 mb-3 text-3xl font-extrabold text-white">
                Post challenges,
                <br />
                not specifications.
              </h3>
              <ul className="mt-4 space-y-3 text-xs text-slate-300">
                {govChecklist.map((c) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-indigo-400" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <GoToDashboard className="w-full py-3.5">
              Open Department Studio →
            </GoToDashboard>
          </div>

          <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-white/[0.08] bg-[#0b1225] p-8 shadow-2xl transition hover:border-emerald-500/40 sm:p-10">
            <div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                For DPIIT Startups
              </span>
              <h3 className="mt-4 mb-3 text-3xl font-extrabold text-white">
                Compete on merit,
                <br />
                not legacy.
              </h3>
              <ul className="mt-4 space-y-3 text-xs text-slate-300">
                {startupChecklist.map((c) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#05080f] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-emerald-500/10"
            >
              Enter Startup Hub →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#0b1225] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 font-bold text-white">
              <Sparkles className="size-4" />
            </div>
            <span className="text-base font-bold text-white">GovInnovate OS</span>
            <span className="ml-2 text-xs font-medium text-slate-400">
              Public Procurement & Sandbox Platform Prototype
            </span>
          </div>
          <div className="font-mono text-xs text-slate-400">
            Prototype Environment · GFR & CVC Aligned Modern Gov-Tech
          </div>
        </div>
      </footer>
    </div>
  );
}
