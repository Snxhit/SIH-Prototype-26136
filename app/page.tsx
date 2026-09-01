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

const ticker: { text: string; color: string }[] = [
  { text: "SIMULATION: ₹2.5Cr Disbursed to AgroVision AI", color: "text-[#FF6B35]" },
  { text: "📡 HydroSense Milestone 2 Telemetry Received", color: "text-[#FFFFFF]" },
  { text: "🚀 Challenge Model: Land Encroachment AI (₹48L)", color: "text-[#E2E8F0]" },
  { text: "✅ GFR-Informed Template Formulation Active", color: "text-[#FF6B35]" },
  { text: "🔒 Sandbox: 5km Urban Zone Parametrized", color: "text-[#FFFFFF]" },
  { text: "💡 QCBS Rubric · DPIIT Gate Verified", color: "text-[#E2E8F0]" },
];

const stats = [
  { value: "₹10 Cr+", label: "Escrow Managed", sub: "Across active test pilots", orange: true },
  { value: "6", label: "Legal Templates", sub: "GFR & CVC aligned contracts", orange: false },
  { value: "48h", label: "Disbursement SLA", sub: "Automated audit release", orange: true },
  { value: "100%", label: "IP Retained", sub: "Owned by startups", orange: false },
];

const features: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: FileText,
    title: "Legal Template Studio",
    body: "6 standardized GFR-informed contract models with live variable binding and instant Markdown exports.",
  },
  {
    icon: Boxes,
    title: "Controlled Sandbox",
    body: "Parametrize geographical boundaries, synthetic data pipelines, and error stop-loss limits.",
  },
  {
    icon: Award,
    title: "QCBS Evaluation Matrix",
    body: "5-pillar weighted scoring framework aligned to CVC guidance for auditable evaluation consensus.",
  },
  {
    icon: Building,
    title: "Department Studio",
    body: "Formulate problem statements around outcome KPIs instead of restrictive hardware specs.",
  },
  {
    icon: Rocket,
    title: "Startup Hub",
    body: "One-click fast track applications with GFR Rule 173(i) waivers for turnover and past track record.",
  },
  {
    icon: Wallet,
    title: "Smart Escrow Ledger",
    body: "Tranche-based automated fund release linked to verified milestone telemetry and audit approvals.",
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
    <Link href="/" className="group flex items-center gap-3.5">
      <div className="rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] p-[1.5px] shadow-lg shadow-[#FF6B35]/30 transition-transform group-hover:scale-105">
        <div className="flex size-11 items-center justify-center rounded-[14px] bg-[#0B3D26]">
          <Sparkles className="size-5 text-[#FF6B35]" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-serif text-2xl font-bold tracking-normal text-[#FFFFFF]">GovInnovate</span>
        <span className="bg-gradient-to-r from-[#FF6B35] via-[#FFA07A] to-[#FFFFFF] bg-clip-text font-serif text-2xl font-bold italic text-transparent">
          OS
        </span>
        <span className="ml-1.5 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#FF6B35]">
          PROTOTYPE
        </span>
      </div>
    </Link>
  );
}

function PrimaryButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/dashboard"
      className={`inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#EA580C] font-extrabold text-xs uppercase tracking-wider text-white shadow-xl shadow-[#FF6B35]/40 transition hover:-translate-y-0.5 hover:from-[#EA580C] hover:to-[#FF6B35] hover:shadow-[#FF6B35]/50 ${className}`}
    >
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0F5132] text-[#FFFFFF]">
      {/* NAV */}
      <nav className="fixed top-0 z-50 flex h-[76px] w-full items-center border-b border-[#166534] bg-[#0B3D26]/95 shadow-xl backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
          <GlowLogoMark />
          <div className="hidden items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#E2E8F0] md:flex">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="transition hover:text-[#FF6B35]">
                {l.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/dashboard"
              className="rounded-xl border border-[#166534] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] transition hover:bg-[#166534]"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#EA580C] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF6B35]/35 transition hover:-translate-y-0.5 hover:from-[#EA580C] hover:to-[#FF6B35] hover:shadow-[#FF6B35]/50"
            >
              Launch Platform →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28">
        <div className="pointer-events-none absolute -z-10 left-1/3 top-1/4 h-[450px] w-[850px] -translate-x-1/2 rounded-full bg-[#FF6B35]/10 blur-[140px]" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-8">
          {/* Left */}
          <div className="space-y-6 text-left lg:col-span-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#166534] bg-[#0B3D26]/90 px-4 py-1.5 shadow-xl backdrop-blur-xl">
              <span className="size-2.5 animate-pulse rounded-full bg-[#FF6B35]" />
              <span className="font-mono text-xs font-bold text-[#E2E8F0]">
                Public Procurement & Sandbox Gateway Model
              </span>
            </div>

            <div>
              <h1 className="font-serif text-5xl font-normal leading-[1.05] tracking-tight text-[#FFFFFF] sm:text-6xl lg:text-7xl">
                Where Government
              </h1>
              <h1 className="font-serif text-5xl font-normal leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                <em className="italic text-[#E2E8F0]">Meets</em>{" "}
                <em className="bg-gradient-to-r from-[#FF6B35] via-[#FFA07A] to-[#FFFFFF] bg-clip-text italic text-transparent">
                  Innovation.
                </em>
              </h1>
            </div>

            <p className="max-w-lg text-base font-medium leading-relaxed text-[#E2E8F0]">
              Connecting government departments with DPIIT-recognised startups through controlled
              sandboxes, milestone-gated escrow, and zero red-tape delays. GFR 173(i) compliant by
              design.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <PrimaryButton className="px-7 py-3.5">
                <span>Launch Platform</span>
                <ArrowRight className="size-4" />
              </PrimaryButton>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[#166534] bg-[#0B3D26] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-lg transition hover:bg-[#166534]"
              >
                <Play className="size-4 text-[#FF6B35]" />
                <span>Simulate Demo</span>
              </Link>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-2 gap-2.5 pt-4 sm:grid-cols-4">
              {pillars.map((p) => (
                <div key={p.value} className="rounded-xl border border-[#166534] bg-[#0B3D26]/90 p-2.5 text-center">
                  <span className="block font-mono text-[11px] font-bold text-[#FF6B35]">{p.value}</span>
                  <span className="block text-[9px] font-bold uppercase text-[#E2E8F0]">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: orbital graphic */}
          <div className="relative flex items-center justify-center pt-8 lg:col-span-6 lg:pt-0">
            <div className="relative flex aspect-square w-full max-w-[480px] items-center justify-center">
              <div className="pointer-events-none absolute inset-0 animate-spin-slow rounded-full border border-dashed border-[#166534]/70" />
              <div className="pointer-events-none absolute inset-8 animate-reverse-spin rounded-full border border-[#166534]">
                <div className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 animate-pulse rounded-full bg-[#FF6B35] shadow-[0_0_12px_#FF6B35]" />
              </div>
              <div className="pointer-events-none absolute inset-20 animate-spin-slow rounded-full border border-[#FF6B35]/25">
                <div className="absolute -left-1.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[#FFFFFF] shadow-[0_0_8px_#FFFFFF]" />
              </div>

              <div className="relative z-10 flex size-44 flex-col items-center justify-center rounded-full border-2 border-[#FF6B35]/40 bg-gradient-to-br from-[#0B3D26] via-[#0F5132] to-[#166534] p-4 text-center shadow-2xl backdrop-blur-2xl">
                <div className="mb-1.5 flex size-12 items-center justify-center rounded-2xl border border-[#FF6B35]/30 bg-[#FF6B35]/20 text-[#FF6B35]">
                  <ShieldCheck className="size-6" />
                </div>
                <span className="text-xs font-black tracking-tight text-[#FFFFFF]">GovInnovate Engine</span>
                <span className="mt-0.5 font-mono text-[10px] font-bold text-[#FF6B35]">
                  Autonomous Gateway
                </span>
              </div>

              <div className="absolute left-2 top-2 z-20 flex animate-float-slow items-center gap-3 rounded-2xl border border-[#166534] bg-[#0B3D26]/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
                <div className="flex size-8 items-center justify-center rounded-xl bg-[#FFFFFF]/10 font-bold text-[#FFFFFF]">
                  <Building2 className="size-4 text-[#FFFFFF]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#FFFFFF]">Gov Department</div>
                  <div className="text-[9px] text-[#E2E8F0]/80">Problem KPI Formulation</div>
                </div>
              </div>

              <div className="absolute right-0 top-6 z-20 flex animate-float-delayed items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2.5 text-[#0B3D26] shadow-2xl">
                <div className="flex size-8 items-center justify-center rounded-xl bg-[#FF6B35]/15 font-bold text-[#FF6B35]">
                  <Wallet className="size-4 text-[#FF6B35]" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-[#0B3D26]">Smart Escrow</div>
                  <div className="font-mono text-[10px] font-bold text-[#FF6B35]">₹4.85 Cr Secured</div>
                </div>
              </div>

              <div className="absolute bottom-6 left-0 z-20 flex animate-float-delayed items-center gap-3 rounded-2xl border border-[#FF6B35]/40 bg-[#0B3D26]/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
                <div className="flex size-8 items-center justify-center rounded-xl bg-[#FF6B35]/20 font-bold text-[#FF6B35]">
                  <Rocket className="size-4 text-[#FF6B35]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#FFFFFF]">DPIIT Startup Hub</div>
                  <div className="text-[9px] text-[#FF6B35]">100% IP Retained</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-2 z-20 flex animate-float-slow items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2.5 text-[#0B3D26] shadow-2xl">
                <div className="flex size-8 items-center justify-center rounded-xl bg-[#0F5132]/10 font-bold text-[#0F5132]">
                  <BadgeCheck className="size-4 text-[#0F5132]" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-[#0B3D26]">GeM Scale-Up</div>
                  <div className="text-[10px] font-medium text-[#166534]">Single-Source Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE TICKER */}
      <div className="relative overflow-hidden border-y border-[#166534] bg-[#0B3D26] py-3.5 backdrop-blur-md">
        <div className="flex w-max animate-marquee font-mono text-xs font-bold tracking-wider text-[#E2E8F0]">
          <div className="flex shrink-0 items-center">
            {ticker.map((t) => (
              <span key={t.text} className={`px-6 ${t.color}`}>
                {t.text}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center" aria-hidden>
            {ticker.map((t) => (
              <span key={`${t.text}-2`} className={`px-6 ${t.color}`}>
                {t.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <section className="border-b border-[#166534] bg-[#0B3D26] py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-[#166534] bg-[#0F5132] p-6 shadow-xl">
              <div
                className={`font-serif text-3xl font-bold sm:text-4xl ${s.orange ? "text-[#FF6B35]" : "text-[#FFFFFF]"}`}
              >
                {s.value}
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">{s.label}</div>
              <div className="mt-0.5 text-[11px] text-[#E2E8F0]/70">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#0F5132] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/15 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
              Architecture
            </span>
            <h2 className="mt-4 font-serif text-4xl text-[#FFFFFF] sm:text-5xl">Platform Features</h2>
            <p className="mt-2 text-sm font-medium text-[#E2E8F0]">
              Six integrated modules covering the complete sandbox and innovation lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="space-y-4 rounded-3xl border border-[#166534] bg-[#0B3D26] p-7 shadow-xl transition hover:border-[#FF6B35]/50"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl border border-[#FF6B35]/30 bg-[#FF6B35]/15 text-[#FF6B35]">
                  <f.icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFFFFF]">{f.title}</h3>
                <p className="text-xs leading-relaxed text-[#E2E8F0]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-[#166534] bg-[#0B3D26] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/15 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
              Workflow
            </span>
            <h2 className="mt-4 font-serif text-4xl text-[#FFFFFF] sm:text-5xl">How GovInnovate OS Works</h2>
            <p className="mt-2 text-sm font-medium text-[#E2E8F0]">
              A 5-step milestone pipeline from challenge formulation to scale-up.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.n} className="space-y-3 rounded-3xl border border-[#166534] bg-[#0F5132] p-6 text-center">
                <div className="mx-auto flex size-9 items-center justify-center rounded-xl bg-[#FF6B35] font-mono text-sm font-black text-white shadow-lg shadow-[#FF6B35]/30">
                  {s.n}
                </div>
                <h4 className="text-sm font-bold text-[#FFFFFF]">{s.title}</h4>
                <p className="text-xs leading-relaxed text-[#E2E8F0]">{s.body}</p>
                {i < steps.length - 1 && (
                  <div className="mx-auto mt-2 hidden h-px w-8 bg-[#166534] lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHOM */}
      <section id="for-whom" className="bg-[#0F5132] py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
          <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-[#FF6B35]/30 bg-[#0B3D26] p-8 shadow-2xl sm:p-10">
            <div>
              <span className="rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FF6B35]">
                For Government
              </span>
              <h3 className="mt-4 mb-3 font-serif text-3xl text-[#FFFFFF]">
                Post challenges,<br />
                not specifications.
              </h3>
              <ul className="mt-4 space-y-3 text-xs text-[#E2E8F0]">
                {govChecklist.map((c) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-[#FF6B35]" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <PrimaryButton className="w-full justify-center py-3.5">
              Post a Problem Statement →
            </PrimaryButton>
          </div>

          <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-[#166534] bg-[#0B3D26] p-8 shadow-2xl transition hover:border-[#FF6B35]/30 sm:p-10">
            <div>
              <span className="rounded-full border border-[#1E7E4A] bg-[#166534] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#E2E8F0]">
                For DPIIT Startups
              </span>
              <h3 className="mt-4 mb-3 font-serif text-3xl text-[#FFFFFF]">
                Compete on merit,<br />
                not legacy.
              </h3>
              <ul className="mt-4 space-y-3 text-xs text-[#E2E8F0]">
                {startupChecklist.map((c) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-[#FF6B35]" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="w-full rounded-xl bg-[#166534] py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-lg transition hover:bg-[#1E7E4A]"
            >
              Enter Startup Hub →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#166534] bg-[#0B3D26] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] font-bold text-white">
              <Sparkles className="size-4" />
            </div>
            <span className="font-serif text-base font-bold text-[#FFFFFF]">GovInnovate OS</span>
            <span className="ml-2 text-xs font-medium text-[#E2E8F0]/70">
              Public Procurement & Sandbox Platform Prototype
            </span>
          </div>
          <div className="font-mono text-xs text-[#E2E8F0]/70">
            Prototype Environment · GFR & CVC Aligned Modern Gov-Tech
          </div>
        </div>
      </footer>
    </div>
  );
}