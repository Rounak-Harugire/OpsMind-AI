import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  Paperclip,
  SendHorizonal,
  FileText,
  CheckCircle2,
  BrainCircuit,
  Info,
  User,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

/* ── Source Tile ──────────────────────────────────── */
function SourceTile({ name }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium border transition-colors"
      style={{
        background: 'rgba(30, 41, 59, 0.4)',
        borderColor: 'rgba(51, 65, 85, 0.5)',
        color: '#94a3b8',
        maxWidth: '180px',
      }}
      title={name}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
        e.currentTarget.style.color = '#c4b5fd';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
        e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.5)';
        e.currentTarget.style.color = '#94a3b8';
      }}
    >
      <Info size={11} style={{ flexShrink: 0 }} />
      <span className="truncate">{name}</span>
    </div>
  );
}

/* ── "Thinking" Animation ─────────────────────────── */
function ThinkingAnimation() {
  return (
    <div className="flex gap-1.5 items-center px-2 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: 'bounce 1.4s infinite ease-in-out both' }} />
    </div>
  );
}

/* ── Empty State ──────────────────────────────────── */
function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 animate-fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(16,185,129,0.1))',
          border: '1px solid rgba(139,92,246,0.25)',
        }}
      >
        <BrainCircuit size={28} style={{ color: '#a78bfa' }} />
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
        OpsMind Assistant
      </h2>
      <p className="max-w-sm text-sm" style={{ color: 'var(--color-text-subtle)', lineHeight: '1.7' }}>
        Upload a PDF or SOP document, then ask anything. I'll find the exact answer and cite my sources.
      </p>
    </div>
  );
}

/* ── ChatArea ─────────────────────────────────────── */
export default function ChatArea({ activeSession, updateSession, user, onRequireAuth }) {
  const [query, setQuery]             = useState('');
  const [isTyping, setIsTyping]       = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDocPanel, setShowDocPanel] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef   = useRef(null);
  const textareaRef    = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession.messages, isAnalyzing]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    const el = textareaRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 160)}px`; }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  /* ── Upload ─────────────────────────────────── */
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploading(true);
    const newFiles = [...activeSession.uploadedFiles];
    for (const file of files) {
      const fd = new FormData();
      fd.append('pdf', file);
      try { await axios.post(`${API}/upload`, fd); newFiles.push(file.name); }
      catch { alert(`Failed to upload: ${file.name}`); }
    }
    updateSession({ uploadedFiles: newFiles });
    setIsUploading(false);
    e.target.value = null;
  };

  /* ── Chat / SSE ────────────────────────────── */
  const handleSubmit = async () => {
    if (!user) { onRequireAuth(); return; }
    if (!query.trim() || isTyping || isAnalyzing) return;

    const userMsg       = { role: 'user', content: query };
    const prevMessages  = [...activeSession.messages, userMsg];
    let newTitle        = activeSession.title;
    if (newTitle === 'New Chat') newTitle = query.length > 28 ? query.slice(0, 28) + '…' : query;

    updateSession({ messages: prevMessages, title: newTitle });
    setQuery('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsAnalyzing(true);

    let streamStarted = false;
    try {
      const res     = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const reader  = res.body.getReader();
      const dec     = new TextDecoder('utf-8');
      let acc       = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = dec.decode(value, { stream: true }).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const obj = JSON.parse(data);
            if (!streamStarted) {
               // When first chunk hits, remove analyzing and show typing inside empty AI bubble
              streamStarted = true;
              setIsAnalyzing(false);
              setIsTyping(true);
              updateSession({ messages: [...prevMessages, { role: 'ai', content: '', sources: [] }] });
            }
            if (obj.text) acc += obj.text;
            updateSession((cur) => {
              const msgs = [...cur.messages];
              const last = msgs.length - 1;
              if (msgs[last]?.role === 'ai') {
                if (obj.sources) msgs[last].sources = obj.sources;
                msgs[last].content = acc;
              }
              return { messages: msgs };
            });
          } catch { /* ignore partial chunk */ }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsAnalyzing(false);
      setIsTyping(false);
    }
  };

  const canSend = query.trim() && !isTyping && !isAnalyzing;
  const hasFiles = activeSession.uploadedFiles && activeSession.uploadedFiles.length > 0;

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0B0F1A]">
      
      {/* ── Center: Main Chat ──────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Toggle Right Panel Button (Absolute top right of chat area) */}
        <button 
           onClick={() => setShowDocPanel(!showDocPanel)}
           className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-[#111827]/80 hover:bg-[#1f2937] border border-[#374151] transition-colors text-slate-400"
           title="Toggle Document Panel"
        >
          {showDocPanel ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-8">
          {activeSession.messages.length === 0 && !isAnalyzing ? (
            <EmptyState />
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
              {activeSession.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 animate-fade-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* AI Avatar */}
                  {msg.role === 'ai' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                        border: '1px solid rgba(139,92,246,0.3)',
                      }}
                    >
                      <BrainCircuit size={16} style={{ color: '#a78bfa' }} />
                    </div>
                  )}

                  <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* The Bubble */}
                    <div
                      className="px-5 py-3.5 text-[14.5px] shadow-sm relative"
                      style={{
                        background: msg.role === 'user' ? '#7c3aed' : 'rgba(30, 41, 59, 0.4)',
                        color: msg.role === 'user' ? '#ffffff' : 'var(--color-text-primary)',
                        borderRadius: msg.role === 'user' ? '24px 24px 6px 24px' : '6px 24px 24px 24px',
                        border: msg.role === 'ai' ? '1px solid rgba(51,65,85,0.5)' : 'none',
                        lineHeight: '1.7',
                      }}
                    >
                      {msg.role === 'ai' ? (
                        msg.content ? (
                          <div className="prose-ai">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <ThinkingAnimation />
                        )
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}

                      {/* Source tiles embedded INSIDE AI bubble at the bottom */}
                      {msg.role === 'ai' && msg.sources?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-700/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>
                            Referenced Sources
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((src, i) => <SourceTile key={i} name={src} />)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {msg.role === 'user' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md"
                      style={{
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <User size={16} style={{ color: '#cbd5e1' }} />
                    </div>
                  )}
                </div>
              ))}

              {/* Advanced Analyzing Skeleton/Dots (Shows before streaming starts) */}
              {isAnalyzing && (
                <div className="flex gap-4 justify-start animate-fade-slide-up">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <BrainCircuit size={16} style={{ color: '#a78bfa' }} />
                  </div>
                  <div className="px-5 py-3.5 text-[14.5px] shadow-sm relative flex items-center gap-2" style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '6px 24px 24px 24px', border: '1px solid rgba(51,65,85,0.5)' }}>
                     <ThinkingAnimation />
                     <span className="text-[12px] text-violet-400 font-medium ml-1">Searching knowledge base...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-6" />
            </div>
          )}
        </div>

        {/* ── Floating Input Box ──────────────────────── */}
        <div className="px-4 pb-6 w-full">
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-3xl"
              style={{
                background: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(51, 65, 85, 0.8)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                transition: 'all 0.2s ease-in-out',
                position: 'relative'
              }}
              onFocusCapture={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(139,92,246,0.3), 0 8px 32px rgba(0,0,0,0.4)';
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.8)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
              }}
            >
              <div className="flex items-end gap-2 p-2 pl-4">
                {/* Hidden file input */}
                <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" className="hidden" />

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isUploading}
                  title="Upload PDF"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 mb-1"
                  style={{ 
                    color: isUploading ? '#8b5cf6' : '#94a3b8', 
                    background: isUploading ? 'rgba(139,92,246,0.1)' : 'transparent',
                    border: 'none', cursor: 'pointer' 
                  }}
                  onMouseEnter={(e) => { if (!isUploading) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#cbd5e1'; } }}
                  onMouseLeave={(e) => { if (!isUploading) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
                >
                  <Paperclip size={18} />
                </button>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Message OpsMind..."
                  disabled={isTyping || isAnalyzing}
                  className="flex-1 bg-transparent resize-none outline-none text-[15px] pt-3 pb-3 custom-scrollbar"
                  style={{
                    color: '#f8fafc',
                    fontFamily: 'var(--font-sans)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    lineHeight: '1.5',
                  }}
                />

                {/* Circular Send Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSend}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mb-0.5 ml-1 transition-all"
                  style={{
                    background: canSend ? '#8b5cf6' : 'rgba(51, 65, 85, 0.5)',
                    color: canSend ? '#ffffff' : '#64748b',
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    border: 'none',
                  }}
                >
                  <SendHorizonal size={18} style={{ marginLeft: canSend ? '2px' : '0' }} />
                </button>
              </div>
            </div>
            <p className="text-center text-[11px] mt-3" style={{ color: '#64748b' }}>
              OpsMind AI may make mistakes. Always verify with source documents.
            </p>
          </div>
        </div>

      </div>

      {/* ── Right: Document Info Panel (Collapsible) ────────── */}
      {showDocPanel && (
        <div 
           className="w-72 flex flex-col border-l border-[#1e293b] bg-[#0d1321] transition-all"
           style={{ zIndex: 5 }}
        >
          <div className="p-4 border-b border-[#1e293b]">
             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Knowledge Base</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
             {!hasFiles ? (
                <div className="text-center py-10 opacity-60">
                   <FileText size={32} className="mx-auto text-slate-500 mb-3" />
                   <p className="text-xs text-slate-400">No documents uploaded for this session yet.</p>
                </div>
             ) : (
                <div className="space-y-3">
                   <p className="text-[11px] text-slate-500 font-semibold uppercase">Active Documents</p>
                   {activeSession.uploadedFiles.map((n, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#1e293b]/50 border border-[#334155]/50">
                         <div className="mt-0.5"><FileText size={16} className="text-violet-400" /></div>
                         <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-200 truncate font-medium">{n}</p>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                               <CheckCircle2 size={10} /> Processed & Ready
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        </div>
      )}

    </div>
  );
}
