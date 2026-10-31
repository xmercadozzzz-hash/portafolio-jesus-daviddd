import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';
import { AUTH_EXPIRED_EVENT, tokenStore } from '../services/http.js';
import { AUTH_ENABLED } from '../services/config.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());

  const login = useCallback(async (usuario, clave) => {
    const t = await authService.login(usuario, clave);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
  }, []);

  // Si la API responde 401 (token vencido), cerramos la sesión local.
  useEffect(() => {
    const onExpired = () => setToken(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const value = useMemo(
    () => ({
      authEnabled: AUTH_ENABLED,
      isAuthenticated: !AUTH_ENABLED || Boolean(token),
      login,
      logout,
    }),
    [token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
