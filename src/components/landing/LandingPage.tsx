"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import gsap from "gsap"
import {
  Kanban,
  BarChart3,
  FileText,
  Mic2,
  ArrowRight,
  Sparkles,
  Rocket,
  Zap,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { label: "Features", href: "#features" },
  ]

  return (
    <nav
      className={`landing-nav fixed top-0 inset-x-0 z-50 border-b border-transparent ${
        scrolled ? "landing-nav-scrolled" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-syne text-xl tracking-tight text-[var(--text-primary)] select-none">
          Hunt<span className="text-[var(--accent-cyan)]">rrr</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold
              bg-gradient-to-r from-[#00d4ff] to-[#4f8ef7] text-[#001018]
              hover:shadow-[0_0_24px_rgba(0,212,255,0.3)] transition-shadow"
          >
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[var(--text-primary)] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-[rgba(79,142,247,0.1)] bg-[rgba(8,12,20,0.95)] backdrop-blur-xl"
        >
          <div className="px-5 py-5 space-y-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center rounded-full px-5 py-2.5 text-sm font-semibold
                bg-gradient-to-r from-[#00d4ff] to-[#4f8ef7] text-[#001018]"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

/* ═══════════════════════════════════════════
   FLOATING KANBAN CARDS (Hero)
   ═══════════════════════════════════════════ */
const kanbanCards = [
  {
    company: "Google",
    role: "Frontend Engineer",
    status: "interview",
    statusLabel: "Interview",
    className: "floating-card-1 top-[20%] left-[2%] sm:left-[4%] rotate-[-3deg]",
  },
  {
    company: "Tokopedia",
    role: "Full Stack Dev",
    status: "applied",
    statusLabel: "Applied",
    className: "floating-card-2 top-[18%] right-[2%] sm:right-[6%] rotate-[2deg]",
  },
  {
    company: "Gojek",
    role: "Mobile Engineer",
    status: "offer",
    statusLabel: "Offer 🎉",
    className: "floating-card-3 bottom-[22%] left-[6%] sm:left-[8%] rotate-[3deg]",
  },
  {
    company: "Shopee",
    role: "UI/UX Designer",
    status: "wishlist",
    statusLabel: "Wishlist",
    className: "floating-card-4 bottom-[12%] right-[4%] sm:right-[10%] rotate-[-2deg]",
  },
]

function FloatingKanbanCards() {
  return (
    <>
      {kanbanCards.map((card, i) => (
        <div
          key={i}
          className={`absolute hidden lg:block glass-card rounded-xl px-4 py-3 w-[200px] select-none ${card.className}`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[var(--text-primary)]">{card.company}</span>
            <span className={`status-pill status-${card.status}`}>{card.statusLabel}</span>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">{card.role}</span>
        </div>
      ))}
    </>
  )
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!headlineRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { y: 60, opacity: 0, rotateX: -40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
        }
      )
      gsap.fromTo(
        ".hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.6, ease: "power2.out" }
      )
      gsap.fromTo(
        ".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.85, ease: "power2.out" }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const headlineWords = ["Stop", "Searching.", "Start", "Hunting."]

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-5 overflow-hidden"
      id="hero"
    >
      {/* Background blobs */}
      <div className="landing-blob landing-blob-1" />
      <div className="landing-blob landing-blob-2" />

      {/* Grid overlay */}
      <div className="absolute inset-0 landing-grid" />

      {/* Sparkle dots */}
      {[
        { top: "12%", left: "18%", delay: "0s" },
        { top: "25%", right: "22%", delay: "1s" },
        { top: "65%", left: "12%", delay: "0.5s" },
        { top: "70%", right: "16%", delay: "1.5s" },
        { top: "40%", left: "30%", delay: "2s" },
        { top: "55%", right: "30%", delay: "0.7s" },
      ].map((dot, i) => (
        <div
          key={i}
          className="sparkle-dot"
          style={{ top: dot.top, left: dot.left, right: dot.right, animationDelay: dot.delay }}
        />
      ))}

      {/* Floating kanban cards */}
      <FloatingKanbanCards />

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.06)]"
        >
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent-cyan)]" />
          <span className="text-xs font-medium text-[var(--accent-cyan)]">Research · Reach · Result</span>
        </motion.div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-syne text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight"
          style={{ perspective: "600px" }}
        >
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className={`hero-word inline-block opacity-0 mr-3 sm:mr-4 ${
                i >= 2 ? "landing-gradient-text" : "text-[var(--text-primary)]"
              }`}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p className="hero-sub opacity-0 mt-6 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Track setiap target dari <span className="text-[var(--accent-cyan)] font-medium">spotted</span> sampai{" "}
          <span className="text-[#10b981] font-medium">captured</span> — semua di satu dashboard. Every application is a calculated move.
        </p>

        {/* CTAs */}
        <div className="hero-cta opacity-0 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="glow-button inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold
              bg-gradient-to-r from-[#00d4ff] to-[#4f8ef7] text-[#001018]
              hover:shadow-[0_0_32px_rgba(0,212,255,0.35)] transition-all duration-300"
          >
            <Rocket className="h-4 w-4" />
            Mulai Sekarang — Gratis
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold
              border border-[rgba(79,142,247,0.25)] text-[var(--text-secondary)]
              hover:border-[rgba(0,212,255,0.4)] hover:text-[var(--accent-cyan)]
              transition-all duration-300 bg-transparent"
          >
            Lihat Fitur <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Trust badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-xs text-[var(--text-muted)] flex items-center justify-center gap-1.5"
        >
          <svg className="h-3 w-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          100% free · No credit card · Data terenkripsi
        </motion.p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   FEATURES SECTION
   ═══════════════════════════════════════════ */
const features = [
  {
    icon: Kanban,
    title: "Kanban Board",
    description: "Drag & drop lamaran lo kayak Trello. Dari Wishlist → Applied → Interview → Offer. Satisfying banget!",
    color: "#00d4ff",
    glow: "rgba(0, 212, 255, 0.1)",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Dashboard analytics yang bikin lo tau success rate, response time, dan tren karir lo secara real-time.",
    color: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.1)",
  },
  {
    icon: FileText,
    title: "Cover Letter AI",
    description: "Generate cover letter yang personalized buat setiap job. Tinggal klik, langsung dapet draft yang solid.",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.1)",
  },
  {
    icon: Mic2,
    title: "Interview Prep",
    description: "Notes & tips buat setiap interview. Track pertanyaan yang sering keluar dan prep answers lo di sini.",
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.1)",
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -8, y: x * 8 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="feature-card-tilt"
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div className="glass-card rounded-2xl p-6 sm:p-7 h-full relative overflow-hidden group cursor-default">
        {/* Glow background on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(300px circle at 50% 0%, ${feature.glow}, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
            style={{ background: feature.glow, border: `1px solid ${feature.color}22` }}
          >
            <Icon className="h-5 w-5" style={{ color: feature.color }} />
          </div>

          <h3 className="font-syne text-lg font-bold text-[var(--text-primary)] mb-2">{feature.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="relative pt-5 sm:pt-10 pb-3 sm:pb-4 px-5" ref={ref}>
      {/* Background */}
      <div className="landing-blob landing-blob-3" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.06)] text-[#a78bfa] mb-4">
              <Zap className="h-3 w-3" /> Power Features
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)]"
          >
            Semua yang Lo Butuhin, <br className="hidden sm:block" />
            <span className="landing-gradient-text-subtle">Satu Dashboard.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-[var(--text-secondary)] text-base sm:text-lg max-w-lg mx-auto"
          >
            Stop pake spreadsheet random. Upgrade ke system yang actually works.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}


/* ═══════════════════════════════════════════
   MARQUEE TICKER
   ═══════════════════════════════════════════ */
function MarqueeTicker() {
  const items = [
    "Kanban Board", "Analytics", "Cover Letter AI", "Interview Prep",
    "Timeline", "Job Contacts", "Profile", "Export PDF",
  ]

  return (
    <div className="relative py-8 sm:py-10 overflow-hidden">
      <div className="section-glow-divider max-w-3xl mx-auto mb-8" />

      <div className="overflow-hidden opacity-50 hover:opacity-70 transition-opacity duration-300">
        <div className="marquee-track">
          {Array(4)
            .fill(items)
            .flat()
            .map((text, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-6 text-sm text-[var(--text-muted)] font-medium whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] opacity-50" />
                {text}
              </span>
            ))}
        </div>
      </div>

      <div className="section-glow-divider max-w-3xl mx-auto mt-8" />
    </div>
  )
}

/* ═══════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════ */
function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative py-14 sm:py-20 px-5 overflow-hidden" ref={ref}>
      <div className="landing-blob landing-blob-4" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Animated gradient border card */}
          <div className="cta-border-wrap rounded-3xl p-[1px]">
            <div className="rounded-3xl bg-[rgba(8,12,20,0.92)] backdrop-blur-2xl overflow-hidden">
              <div className="px-8 py-12 sm:px-14 sm:py-16 md:flex items-center gap-12">

                {/* Left — text content */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-snug">
                    Berhenti scroll lowongan,{" "}
                    <span className="landing-gradient-text-subtle">mulai tracking.</span>
                  </h2>

                  <p className="mt-4 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-md">
                    Satu klik, langsung punya command center buat seluruh job hunt lo. Gratis, cepat, aman.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href="/login"
                      className="glow-button inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold
                        bg-gradient-to-r from-[#00d4ff] to-[#4f8ef7] text-[#001018]
                        hover:shadow-[0_0_32px_rgba(0,212,255,0.3)] transition-all duration-300"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Mulai Sekarang
                    </Link>
                    <span className="text-xs text-[var(--text-muted)]">Setup &lt; 30 detik</span>
                  </div>
                </div>

                {/* Right — trust cards */}
                <div className="mt-10 md:mt-0 flex flex-col gap-3 md:w-52 shrink-0">
                  <div className="rounded-xl border border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.04)] px-4 py-3">
                    <div className="flex items-center gap-2.5 mb-1">
                      <svg className="h-4 w-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span className="text-xs font-semibold text-emerald-400">Terenkripsi</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Data lo dienkripsi end-to-end. Ga ada yang bisa intip.</p>
                  </div>

                  <div className="rounded-xl border border-[rgba(0,212,255,0.12)] bg-[rgba(0,212,255,0.03)] px-4 py-3">
                    <div className="flex items-center gap-2.5 mb-1">
                      <svg className="h-4 w-4 text-[var(--accent-cyan)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="text-xs font-semibold text-[var(--accent-cyan)]">Privasi</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Data lo milik lo. Ga dijual, ga di-share, period.</p>
                  </div>

                  <div className="rounded-xl border border-[rgba(139,92,246,0.12)] bg-[rgba(139,92,246,0.03)] px-4 py-3">
                    <div className="flex items-center gap-2.5 mb-1">
                      <Zap className="h-4 w-4 text-purple-400 shrink-0" />
                      <span className="text-xs font-semibold text-purple-400">Instant</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">No install, no setup ribet. Langsung gas di browser.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-[rgba(79,142,247,0.08)] py-8 px-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-syne text-sm text-[var(--text-muted)]">
          Hunt<span className="text-[var(--accent-cyan)]">rrr</span> © {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-5 text-xs text-[var(--text-muted)]">
          <Link href="/login" className="hover:text-[var(--accent-cyan)] transition-colors">
            Login
          </Link>
          <a href="#features" className="hover:text-[var(--accent-cyan)] transition-colors">
            Features
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-[#080c14] text-[var(--text-primary)] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <MarqueeTicker />
      <CTASection />
      <Footer />
    </div>
  )
}
