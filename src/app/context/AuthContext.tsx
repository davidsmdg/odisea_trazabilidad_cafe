import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole, AuthUser } from '../../types/usuario';
import { MOCK_USERS } from '../../data/usuarios.mock';

export type { UserRole, AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'cerescrop_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al montar
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const persistUser = (u: AuthUser) => {
    setUser(u);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
  };

  const login = async (email: string, _password: string) => {
    // Simulamos latencia de red
    await new Promise((r) => setTimeout(r, 800));

    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      persistUser(found);
      return;
    }
    // Si no existe, creamos uno genérico para demo
    const genericUser: AuthUser = {
      id: `u_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'AGRICULTOR',
      avatarInitials: email.slice(0, 2).toUpperCase(),
    };
    persistUser(genericUser);
  };

  const register = async (name: string, email: string, _password: string, role: UserRole) => {
    await new Promise((r) => setTimeout(r, 900));
    const newUser: AuthUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      role,
      avatarInitials: name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    };
    persistUser(newUser);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
