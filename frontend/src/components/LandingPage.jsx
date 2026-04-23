import React, { useRef } from 'react';
import { Zap, Target, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const VALUES = [
  {
    icon: Zap,
    accent: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.25)',
    title: 'Instant Answers',
    desc: 'Get precise answers from thousands of SOP pages in under 3 seconds — no more manual searching through binders.',
  },
  {
    icon: Target,
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.10)',
    border: 'rgba(16, 185, 129, 0.22)',
    title: 'Pinpoint Accuracy',
    desc: 'RAG-powered retrieval grounds every response in your actual documents — zero hallucination, only cited facts.',
  },
  {
    icon: ShieldCheck,
    accent: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.10)',
    border: 'rgba(167, 139, 250, 0.22)',
    title: 'Enterprise Secure',
    desc: 'Your documents never leave your infrastructure. All processing runs privately on your own MongoDB instance.',
  },
];

export default function LandingPage({ onGetStarted, onSignIn }) {
  const heroRef = useRef(null);

  /* ── Shared layout tokens ─────────────────────── */
  const CONTAINER = {
    maxWidth: '1152px',
    margin: '0 auto',
    width: '100%',
    padding: '0 24px',
  };

  const SECTION_PAD = {
    paddingTop: '96px',
    paddingBottom: '96px',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowX: 'hidden',
        background: 'var(--color-bg-base)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-text-primary)',
        position: 'relative',
      }}
    >
      {/* ── Fixed grid background ─────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.045) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
      {/* Fixed radial spotlight */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 25%, rgba(139,92,246,0.13) 0%, transparent 68%)',
        }}
      />

      {/* ── All page content sits above fixed bg ───── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>

        {/* ══ STICKY HEADER ══════════════════════════ */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            width: '100%',
            background: 'rgba(11,15,26,0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              ...CONTAINER,
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  boxShadow: '0 0 16px rgba(139,92,246,0.45)',
                }}
              >
                <Sparkles size={14} color="white" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px' }}>
                OpsMind <span style={{ color: '#a78bfa' }}>AI</span>
              </span>
            </div>

            {/* Nav links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {['Features', 'Security', 'Pricing'].map((l) => (
                <button
                  key={l}
                  style={{
                    color: 'var(--color-text-muted)', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--color-text-primary)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
                >
                  {l}
                </button>
              ))}
            </nav>

            <button
              onClick={onSignIn}
              className="btn-glow"
              style={{
                padding: '8px 20px', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer',
              }}
            >
              Sign In
            </button>
          </div>
        </header>

        {/* ══ HERO SECTION ══════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            width: '100%',
            paddingTop: '112px',
            paddingBottom: '96px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ ...CONTAINER, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Live badge */}
            <div
              className="animate-fade-slide-up stagger-1"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '9999px',
                fontSize: '12px', fontWeight: 600, marginBottom: '32px',
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#c4b5fd',
              }}
            >
              <span
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#34d399', animation: 'pulse-glow 2s infinite', flexShrink: 0,
                }}
              />
              RAG-Powered Enterprise AI · Now Live
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-slide-up stagger-2"
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 5.25rem)',
                fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.06,
                marginBottom: '28px', width: '100%',
              }}
            >
              <span style={{ color: 'var(--color-text-primary)' }}>Ask Anything.</span>
              <br />
              <span className="gradient-text">From Any Document.</span>
            </h1>

            {/* Sub-headline */}
            <p
              className="animate-fade-slide-up stagger-3"
              style={{
                maxWidth: '540px', margin: '0 auto',
                color: 'var(--color-text-subtle)', fontSize: '1.125rem', lineHeight: 1.75,
                marginBottom: '48px',
              }}
            >
              OpsMind AI transforms your SOPs, manuals, and PDFs into an intelligent knowledge base.
              Instant, cited answers — streamed in real-time.
            </p>

            {/* CTA row */}
            <div
              className="animate-fade-slide-up stagger-4"
              style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                justifyContent: 'center', gap: '16px', width: '100%',
              }}
            >
              <button
                onClick={onGetStarted}
                className="btn-glow"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px 32px', borderRadius: '12px', minWidth: '200px',
                  fontSize: '16px', fontWeight: 700, color: 'white', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Let's Get Started <ArrowRight size={17} />
              </button>
              <button
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px 32px', borderRadius: '12px', minWidth: '160px',
                  fontSize: '14px', fontWeight: 600,
                  color: 'var(--color-text-subtle)',
                  border: '1px solid var(--color-border)', background: 'transparent',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-subtle)';
                }}
              >
                Watch a Demo
              </button>
            </div>

            {/* Social proof */}
            <p
              className="animate-fade-slide-up stagger-5"
              style={{ marginTop: '28px', fontSize: '12px', color: 'var(--color-text-muted)' }}
            >
              Trusted by operations teams at&nbsp;
              <strong style={{ color: 'var(--color-text-subtle)' }}>50+ enterprises</strong>
            </p>
          </div>
        </section>

        {/* ══ VALUE GRID SECTION ══════════════════════════════ */}
        <section style={{ width: '100%', ...SECTION_PAD }}>
          <div style={{ ...CONTAINER }}>

            {/* Section header */}
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <p style={{
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.12em', color: '#a78bfa', marginBottom: '16px',
              }}>
                Why OpsMind
              </p>
              <h2 style={{
                fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 700,
                color: 'var(--color-text-primary)', lineHeight: 1.25,
              }}>
                Built for the enterprise,<br /> designed for humans
              </h2>
            </div>

            {/* 3-column card grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '32px',
                alignItems: 'stretch',
              }}
            >
              {VALUES.map(({ icon: Icon, accent, glow, border, title, desc }) => (
                <div
                  key={title}
                  className="value-card"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', padding: '40px 32px',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: glow, border: `1px solid ${border}`,
                    marginBottom: '24px', flexShrink: 0,
                  }}>
                    <Icon size={23} color={accent} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-subtle)', lineHeight: 1.75 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BOTTOM CTA BANNER ═══════════════════════════════ */}
        <section style={{ width: '100%', ...SECTION_PAD }}>
          <div style={{ ...CONTAINER }}>
            <div
              style={{
                display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', justifyContent: 'space-between',
                gap: '32px', padding: '56px 48px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(16,185,129,0.06) 100%)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              <div>
                <h2 style={{
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.875rem)', fontWeight: 700,
                  color: 'var(--color-text-primary)', marginBottom: '8px',
                }}>
                  Ready to know your docs inside out?
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--color-text-subtle)', lineHeight: 1.6 }}>
                  Upload your first SOP in minutes. No credit card required.
                </p>
              </div>
              <button
                onClick={onGetStarted}
                className="btn-glow"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 32px', borderRadius: '12px', minWidth: '180px',
                  fontSize: '16px', fontWeight: 700, color: 'white',
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)', flexShrink: 0,
                }}
              >
                Start for Free <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ═════════════════════════════════════════ */}
        <footer
          style={{
            width: '100%', padding: '24px', textAlign: 'center',
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)', fontSize: '12px',
          }}
        >
          © 2026 OpsMind AI. All rights reserved.
        </footer>

      </div>{/* /z-index wrapper */}
    </div>
  );
}
