import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole, AuthUser } from '../../types/usuario';
import { MOCK_USERS } from '../../data/usuarios.mock';

export type { UserRole, AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  /** `identificador` es un correo (institucional) o un celular (productor). */
  login: (identificador: string, password: string) => Promise<void>;
  /** `contacto` es correo para roles institucionales y celular para AGRICULTOR. */
  register: (name: string, contacto: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const soloDigitos = (v: string) => v.replace(/\D/g, '');
const pareceCelular = (v: string) => !v.includes('@') && soloDigitos(v).length >= 7;

const REGISTRADOS_KEY = 'odisea_usuarios_registrados';

function getRegistrados(): AuthUser[] {
  try {
    const raw = localStorage.getItem(REGISTRADOS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function addRegistrado(u: AuthUser) {
  try {
    const list = getRegistrados().filter(
      (x) =>
        !(u.email && x.email?.toLowerCase() === u.email.toLowerCase()) &&
        !(u.celular && x.celular && soloDigitos(x.celular) === soloDigitos(u.celular))
    );
    localStorage.setItem(REGISTRADOS_KEY, JSON.stringify([...list, u]));
  } catch {}
}

function inicialesDe(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
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

  const login = async (identificador: string, _password: string) => {
    // Simulamos latencia de red
    await new Promise((r) => setTimeout(r, 800));

    const id = identificador.trim();
    const esCel = pareceCelular(id);
    const idDigitos = soloDigitos(id);

    const buscar = (lista: AuthUser[]) =>
      lista.find((u) =>
        esCel
          ? u.celular && soloDigitos(u.celular) === idDigitos
          : u.email?.toLowerCase() === id.toLowerCase()
      );

    const found = buscar(MOCK_USERS) || buscar(getRegistrados());
    if (found) {
      persistUser(found);
      return;
    }

    // Si no existe, creamos uno genérico para demo
    const genericUser: AuthUser = esCel
      ? {
          id: `u_${Date.now()}`,
          name: 'Productor',
          celular: id,
          role: 'AGRICULTOR',
          avatarInitials: 'PR',
        }
      : {
          id: `u_${Date.now()}`,
          name: id.split('@')[0],
          email: id,
          role: 'AGRICULTOR',
          avatarInitials: id.slice(0, 2).toUpperCase(),
        };
    persistUser(genericUser);
  };

  const register = async (name: string, contacto: string, _password: string, role: UserRole) => {
    await new Promise((r) => setTimeout(r, 900));
    const esProductor = role === 'AGRICULTOR';
    const newUser: AuthUser = {
      id: `u_${Date.now()}`,
      name,
      role,
      avatarInitials: inicialesDe(name),
      ...(esProductor ? { celular: contacto.trim() } : { email: contacto.trim() }),
    };
    addRegistrado(newUser);
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
