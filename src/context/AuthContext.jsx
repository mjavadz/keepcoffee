import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setCsrfToken } from '../api';

const AuthContext = createContext(null);
const AUTH_HINT_KEY = 'keepcoffee_auth_hint';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthPayload = useCallback((payload) => {
    setCsrfToken(payload?.csrfToken);
    const u = payload?.user ?? null;
    setUser(u);
    try {
      if (u) {
        localStorage.setItem(AUTH_HINT_KEY, '1');
      } else {
        localStorage.removeItem(AUTH_HINT_KEY);
      }
    } catch {}
    return u;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/me');
      return handleAuthPayload(res);
    } catch (err) {
      return handleAuthPayload(null);
    }
  }, [handleAuthPayload]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await refresh();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return handleAuthPayload(res);
  }, [handleAuthPayload]);

  const register = useCallback(async (displayName, email, password) => {
    const res = await api.post('/auth/register', { displayName, email, password });
    return handleAuthPayload(res);
  }, [handleAuthPayload]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      handleAuthPayload(null);
    }
  }, [handleAuthPayload]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
