import React, { useState } from 'react';
import {
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react';

export default function Sidebar({
  sessions,
  activeSessionId,
  setActiveSessionId,
  createNewChat,
  renameSession,
  deleteSession,
}) {
  const [collapsed, setCollapsed]   = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [editTitle, setEditTitle]   = useState('');

  const SIDEBAR_W   = 268;
  const COLLAPSED_W = 56;

  const handleEditStart = (e, id, title) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
  };

  const handleEditSave = (e, id) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    if (editTitle.trim()) renameSession(id, editTitle.trim());
    setEditingId(null);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat?')) deleteSession(id);
  };

  return (
    <aside
      className="relative shrink-0 flex flex-col h-full overflow-hidden"
      style={{
        width: collapsed ? COLLAPSED_W : SIDEBAR_W,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── Top bar ─────────────────────────────────── */}
      <div
        className="h-[52px] flex items-center justify-between px-3 shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        {/* New Chat button */}
        <button
          onClick={createNewChat}
          title="New Chat"
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-xs font-semibold"
          style={{ color: 'var(--color-text-subtle)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-bg-hover)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-subtle)';
          }}
        >
          <MessageSquarePlus size={16} />
          {!collapsed && <span>New Chat</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-bg-hover)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ── Sessions List ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 px-2">
        {!collapsed && (
          <p
            className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2 mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Recents
          </p>
        )}

        <div className="space-y-0.5">
          {sessions.map((session) => {
            const isActive = activeSessionId === session.id;
            const isEditing = editingId === session.id;

            return (
              <div
                key={session.id}
                onClick={() => !isEditing && setActiveSessionId(session.id)}
                className="group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                  border: isActive
                    ? '1px solid rgba(99,102,241,0.2)'
                    : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Icon */}
                <MessageSquare
                  size={14}
                  className="shrink-0"
                  color={isActive ? '#818cf8' : 'var(--color-text-muted)'}
                />

                {/* Title / Edit input */}
                {!collapsed && (
                  isEditing ? (
                    <form
                      onSubmit={(e) => handleEditSave(e, session.id)}
                      className="flex-1 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={(e) => handleEditSave(e, session.id)}
                        className="flex-1 bg-transparent text-xs outline-none"
                        style={{
                          color: 'var(--color-text-primary)',
                          borderBottom: '1px solid rgba(99,102,241,0.5)',
                          paddingBottom: '1px',
                        }}
                      />
                      <button type="submit" style={{ color: '#10b981' }}>
                        <Check size={12} />
                      </button>
                    </form>
                  ) : (
                    <span
                      className="flex-1 text-xs truncate"
                      style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-subtle)' }}
                    >
                      {session.title}
                    </span>
                  )
                )}

                {/* Hover actions */}
                {!collapsed && !isEditing && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => handleEditStart(e, session.id, session.title)}
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--color-text-muted)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#818cf8')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                      title="Rename"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--color-text-muted)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
