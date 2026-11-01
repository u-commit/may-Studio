import { useState } from 'react';
import { AuthContext, SESSION_KEY } from './authContext';

function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  function signIn(nextSession) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function signOut() {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
