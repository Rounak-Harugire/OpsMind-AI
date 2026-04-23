import React from 'react';
import { Sparkles, LogOut, User } from 'lucide-react';

export default function Header({ user, onLogout }) {
  return (
    <header
      className="shrink-0 z-30 flex items-center justify-between px-5 h-[60px]"
      style={{
        background: 'rgba(8, 12, 21, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            boxShadow: '0 0 14px rgba(99,102,241,0.45)',
          }}
        >
          <Sparkles size={13} color="white" />
        </div>
        <span
          className="text-[14px] font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          OpsMind <span style={{ color: '#818cf8' }}>AI</span>
        </span>
      </div>

      {/* ── User Controls ─────────────────────────────── */}
      {user && (
        <div className="flex items-center gap-3">
          {/* Avatar + Name */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: 'rgba(99,102,241,0.18)',
                border: '1px solid rgba(99,102,241,0.35)',
                color: '#818cf8',
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={13} />}
            </div>
            <span
              className="text-xs font-medium hidden sm:block max-w-[120px] truncate"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              {user.name}
            </span>
          </div>

          {/* Divider */}
          <div
            className="h-4 w-px hidden sm:block"
            style={{ background: 'var(--color-border)' }}
          />

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Logout"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <LogOut size={13} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}
