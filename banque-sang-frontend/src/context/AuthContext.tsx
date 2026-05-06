import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export const AUTH_SESSION_KEY = 'savelife.auth.session';

export type UserRole = 'DONNEUR' | 'MEDECIN_HOPITAL' | 'AGENT_BANQUE' | 'ADMINISTRATEUR';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
  fullName?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  getDashboardPath: (role?: UserRole | null) => string;
}

const roleDashboardPaths: Record<UserRole, string> = {
  DONNEUR: '/donor/dashboard',
  MEDECIN_HOPITAL: '/hospital/dashboard',
  AGENT_BANQUE: '/agent/dashboard',
  ADMINISTRATEUR: '/admin/dashboard',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;
  const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) return null;
  try {
    const parsed = JSON.parse(rawSession) as AuthSession;
    if (
      parsed &&
      typeof parsed.token === 'string' &&
      parsed.user &&
      typeof parsed.user.email === 'string' &&
      typeof parsed.user.role === 'string'
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
};

export const getDashboardPath = (role?: UserRole | null): string => {
  if (!role) return '/auth/login';
  return roleDashboardPaths[role] ?? '/auth/login';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (session) {
      window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
    }
  }, [session]);

  const login = useCallback(async (payload: LoginPayload) => {
    if (!payload.email.trim() || !payload.password.trim()) {
      throw new Error('Email et mot de passe requis.');
    }

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Email ou mot de passe incorrect.');
    }

    const data = await response.json();

    // Normalisation du rôle : convertir le format backend vers le format frontend
    let normalizedRole = data.user.role;
    if (normalizedRole === 'MEDECINHOPITAL') {
      normalizedRole = 'MEDECIN_HOPITAL';
    } else if (normalizedRole === 'AGENTBANQUE') {
      normalizedRole = 'AGENT_BANQUE';
    }

    const nextSession: AuthSession = {
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        role: normalizedRole as UserRole,
      },
    };

    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => Boolean(session?.user && roles.includes(session.user.role)),
    [session]
  );

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    const token = session?.token ?? null;
    return {
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      hasRole,
      getDashboardPath,
    };
  }, [hasRole, login, logout, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
