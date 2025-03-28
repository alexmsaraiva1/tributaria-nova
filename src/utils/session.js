const SESSION_KEY = 'tributaria_session';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

export const createSession = (userData) => {
  const session = {
    token: generateSessionToken(),
    user: userData,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRY
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getSession = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  const session = JSON.parse(sessionStr);
  
  // Verifica se a sessão expirou
  if (Date.now() > session.expiresAt) {
    clearSession();
    return null;
  }

  return session;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = () => {
  const session = getSession();
  return session !== null;
};

export const getCurrentUser = () => {
  const session = getSession();
  return session?.user || null;
};

export const refreshSession = () => {
  const session = getSession();
  if (session) {
    session.expiresAt = Date.now() + SESSION_EXPIRY;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}; 