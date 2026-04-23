import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, ArrowLeft, Eye, EyeOff, FileText, Zap, ShieldCheck } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const FEATURES = [
  { icon: FileText,    label: 'Upload any PDF or SOP document instantly' },
  { icon: Zap,         label: 'Get answers streamed in real-time via AI' },
  { icon: ShieldCheck, label: 'Your data stays private — enterprise-grade security' },
];

export default function AuthPage({ onLoginSuccess, onBack }) {
  const [isLogin, setIsLogin]     = useState(true);
  const [showPw, setShowPw]       = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [formData, setFormData]   = useState({ name: '', email: '', password: '' });
  const [touched, setTouched]     = useState({ name: false, email: false, password: false });

  const handleBlur   = (f) => setTouched((t) => ({ ...t, [f]: true }));
  const handleChange = (f, v) => setFormData((d) => ({ ...d, [f]: v }));

  const validate = () => {
    const e = {};
    if (!isLogin && !formData.name.trim())                             e.name     = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))          e.email    = 'Valid email required';
    if (formData.password.length < 6)                                  e.password = 'Minimum 6 characters';
    return e;
  };
  const errors    = validate();
  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (hasErrors) return;
    setError(''); setIsLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const res      = await axios.post(`${API}${endpoint}`, formData);
      localStorage.setItem('opsmind_token', res.data.token);
      localStorage.setItem('opsmind_user', JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setTouched({ name: false, email: false, password: false });
  };

  /* Border color helper inline */
  const fieldBorder = (f) =>
    touched[f] && errors[f]   ? '#ef4444' :
    touched[f] && !errors[f]  ? '#10b981' :
                                 'rgba(139, 92, 246, 0.2)';

  /* ── UNIFIED FULL-PAGE CENTERED STACK ───────── */
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: '48px 16px',
        background: 'var(--color-bg-base)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-text-primary)'
      }}
    >
      {/* Background gradients */}
      <div style={{
          position: 'fixed',
          top: '25%', right: '10%',
          width: '300px', height: '300px',
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(44px)'
      }} />
      
      <div style={{
          position: 'fixed',
          bottom: '25%', left: '10%',
          width: '250px', height: '250px',
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          filter: 'blur(32px)'
      }} />

      {/* ── THE GLASSMORPHIC CARD ─────────────────── */}
      <div
        className="glass-card custom-scrollbar"
        style={{
          width: '100%',
          maxWidth: '448px', // max-w-md
          padding: '32px',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Back Link */}
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '24px', fontSize: '14px',
            color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ArrowLeft size={15} /> Back to Home
        </button>

        {/* Header Section (The Principle) */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <div style={{
            width: '40px', height: '4px', borderRadius: '4px',
            background: 'linear-gradient(90deg, #8b5cf6, #10b981)',
            marginBottom: '16px', margin: '0 auto'
          }} />
          <blockquote style={{
            fontStyle: 'italic', fontSize: '18px', fontWeight: 600,
            color: 'var(--color-text-primary)', lineHeight: 1.4, marginBottom: '8px'
          }}>
            "The right information at the right moment is worth more than a thousand searches."
          </blockquote>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            — The OpsMind Principle
          </p>
        </div>

        {/* Value List */}
        <ul style={{
          display: 'flex', flexDirection: 'column', gap: '12px',
          width: '100%', marginBottom: '24px', listStyle: 'none'
        }}>
          {FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={14} color="#a78bfa" />
              </div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>{label}</span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <hr style={{
          width: '100%', border: 'none', borderTop: '1px solid var(--color-border)',
          marginBottom: '24px', opacity: 0.6
        }} />

        {/* Form Instructional Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div
            style={{
              width: '28px', height: '28px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            }}
          >
            <Sparkles size={14} color="white" />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
        </div>
        
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          {isLogin ? 'Sign in to continue your OpsMind session.' : 'Start chatting with your documents today.'}
        </p>

        {/* Error */}
        {error && (
          <div style={{
            width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', marginBottom: '20px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5'
          }}>
            {error}
          </div>
        )}

        {/* The Form Fields */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
          
          {/* Name (Signup only) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className="input-glow"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px',
                  background: 'var(--color-bg-surface)', border: `1px solid ${fieldBorder('name')}`,
                  color: 'var(--color-text-primary)'
                }}
              />
              {touched.name && errors.name && <p style={{ fontSize: '12px', color: '#f87171' }}>{errors.name}</p>}
            </div>
          )}

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className="input-glow"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px',
                background: 'var(--color-bg-surface)', border: `1px solid ${fieldBorder('email')}`,
                color: 'var(--color-text-primary)'
              }}
            />
            {touched.email && errors.email && <p style={{ fontSize: '12px', color: '#f87171' }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className="input-glow"
              style={{
                width: '100%', padding: '12px 16px', paddingRight: '44px', borderRadius: '12px', fontSize: '14px',
                background: 'var(--color-bg-surface)', border: `1px solid ${fieldBorder('password')}`,
                color: 'var(--color-text-primary)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: 'absolute', right: '12px', top: '12px',
                color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {touched.password && errors.password && <p style={{ fontSize: '12px', color: '#f87171', position: 'relative' }}>{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-glow"
            style={{
              width: '100%', padding: '14px 0', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
              color: 'white', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: isLoading ? 0.72 : 1
            }}
          >
            {isLoading ? 'Processing…' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Footer Link */}
        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={toggleMode}
            style={{
              fontWeight: 600, color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.target.style.color = '#c4b5fd')}
            onMouseLeave={(e) => (e.target.style.color = '#a78bfa')}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  );
}
