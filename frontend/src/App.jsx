import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';

function App() {
  // ── View State: 'landing' | 'auth' | 'chat' ──────────────
  const [view, setView] = useState('landing');

  // ── User State ────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('opsmind_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // If user is already logged in on mount, skip landing and go straight to chat
  useEffect(() => {
    if (user) setView('chat');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Chat Sessions ─────────────────────────────────────────
  const [sessions, setSessions] = useState(() => {
    if (!user) return [{ id: Date.now(), title: 'New Chat', messages: [], uploadedFiles: [] }];
    const saved = localStorage.getItem(`opsmind_chats_${user.email}`);
    if (saved) return JSON.parse(saved);
    return [{ id: Date.now(), title: 'New Chat', messages: [], uploadedFiles: [] }];
  });

  const [activeSessionId, setActiveSessionId] = useState(sessions[0]?.id);

  // Persist sessions to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`opsmind_chats_${user.email}`, JSON.stringify(sessions));
    }
  }, [sessions, user]);

  // Reload sessions when user changes (login/logout)
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`opsmind_chats_${user.email}`);
      const loadedSessions = saved
        ? JSON.parse(saved)
        : [{ id: Date.now(), title: 'New Chat', messages: [], uploadedFiles: [] }];
      setSessions(loadedSessions);
      setActiveSessionId(loadedSessions[0].id);
    } else {
      setSessions([{ id: Date.now(), title: 'New Chat', messages: [], uploadedFiles: [] }]);
    }
  }, [user]);

  // ── Auth Handlers ─────────────────────────────────────────
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setView('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('opsmind_token');
    localStorage.removeItem('opsmind_user');
    setUser(null);
    setView('landing');
  };

  // ── Session Handlers ──────────────────────────────────────
  const createNewChat = () => {
    const newSession = { id: Date.now(), title: 'New Chat', messages: [], uploadedFiles: [] };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const updateActiveSession = (updater) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === activeSessionId) {
          const newData = typeof updater === 'function' ? updater(session) : updater;
          return { ...session, ...newData };
        }
        return session;
      })
    );
  };

  const renameSession = (id, newTitle) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === id ? { ...session, title: newTitle } : session))
    );
  };

  const deleteSession = (id) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const newSession = { id: Date.now(), title: 'New Chat', messages: [], uploadedFiles: [] };
        setActiveSessionId(newSession.id);
        return [newSession];
      }
      if (activeSessionId === id) setActiveSessionId(remaining[0].id);
      return remaining;
    });
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // ── Render ────────────────────────────────────────────────
  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('auth')} onSignIn={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return (
      <AuthPage
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setView('landing')}
      />
    );
  }

  // view === 'chat'
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg-base)', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)' }}>
      <Header user={user} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          createNewChat={createNewChat}
          renameSession={renameSession}
          deleteSession={deleteSession}
        />
        <ChatArea
          activeSession={activeSession}
          updateSession={updateActiveSession}
          user={user}
          onRequireAuth={() => setView('auth')}
        />
      </div>
    </div>
  );
}

export default App;
