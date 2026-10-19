import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole, AuthUser } from '../../types/usuario';
import { supabase } from '../utils/supabaseClient';
import { MOCK_USERS } from '../../data/usuarios.mock';
import { registrarEvento } from '../../services/telemetryService';

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

  const fetchUserProfile = async (userId: string): Promise<AuthUser | null> => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombre, email, celular, rol, avatar_initials')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.nombre,
      email: data.email,
      celular: data.celular || undefined,
      role: data.rol as UserRole,
      avatarInitials: data.avatar_initials || 'US',
    };
  };

  // Restore and listen to session
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
          setIsLoading(false);
          return;
        }
      }
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const SESSION_KEY = 'cerescrop_user';

  const persistLocalUser = (u: AuthUser) => {
    setUser(u);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    registrarEvento('login', {
      usuarioId: u.id,
      nombre: u.name,
      contacto: u.celular || u.email,
      rol: u.role,
    });
  };

  const login = async (identificador: string, password: string) => {
    const id = identificador.trim();
    const esCel = pareceCelular(id);
    const idDigitos = soloDigitos(id);

    // Si Supabase está configurado, intentar autenticación en Supabase
    if (import.meta.env.VITE_SUPABASE_URL) {
      // 1. Determinar el email con el cual autenticar en Supabase Auth
      let emailAuth = id;
      if (esCel) {
        emailAuth = `${idDigitos}@celular.odisea.co`;
        // También podemos verificar si ya existe un perfil con este celular que use otro email
        try {
          const { data: perfilFound } = await supabase
            .from('perfiles')
            .select('email, celular')
            .eq('celular', idDigitos)
            .maybeSingle();
          if (perfilFound?.email) {
            emailAuth = perfilFound.email;
          }
        } catch {}
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailAuth,
          password,
        });

        if (!error && data.user) {
          const profile = await fetchUserProfile(data.user.id);
          if (profile) {
            setUser(profile);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
            registrarEvento('login', {
              usuarioId: profile.id,
              nombre: profile.name,
              contacto: profile.celular || profile.email,
              rol: profile.role,
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Supabase auth failed, trying fallback:', err);
      }
    }

    // Flujo demo / local si no hay conexión
    await new Promise((r) => setTimeout(r, 600));

    const buscar = (lista: AuthUser[]) =>
      lista.find((u) =>
        esCel
          ? u.celular && soloDigitos(u.celular) === idDigitos
          : u.email?.toLowerCase() === id.toLowerCase()
      );

    // Consultar tabla usuarios en Supabase para obtener el nombre real guardado
    try {
      let query = supabase.from('usuarios').select('*');
      if (esCel) {
        query = query.eq('celular', idDigitos);
      } else {
        query = query.eq('email', id.toLowerCase());
      }
      const { data: usuarioDb } = await query.maybeSingle();
      if (usuarioDb) {
        const uCloud: AuthUser = {
          id: `u_${usuarioDb.id || Date.now()}`,
          name: usuarioDb.nombre,
          role: (usuarioDb.rol as UserRole) || 'AGRICULTOR',
          avatarInitials: inicialesDe(usuarioDb.nombre),
          email: usuarioDb.email || undefined,
          celular: usuarioDb.celular || undefined,
        };
        addRegistrado(uCloud);
        persistLocalUser(uCloud);
        return;
      }
    } catch {}

    const found = buscar(getRegistrados());
    if (found) {
      persistLocalUser(found);
      return;
    }

    // Si no está registrado en ningún lado, no permitir el acceso con datos ficticios
    throw new Error('Usuario no registrado. Debes registrarte primero con un código de invitación válido.');
  };

  const register = async (name: string, contacto: string, password: string, role: UserRole) => {
    const rawContacto = contacto.trim();
    const esEmail = rawContacto.includes('@');
    const esCel = pareceCelular(rawContacto);
    const celDigitos = soloDigitos(rawContacto);

    // Email de autenticación en Supabase: si es celular, usamos un email único sintético
    const emailSupabase = esEmail ? rawContacto : `${celDigitos}@celular.odisea.co`;

    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: emailSupabase,
          password,
          options: {
            data: {
              nombre: name,
              rol: role,
              celular: esCel ? celDigitos : null,
            },
          },
        });

        if (!error && data.user) {
          // Asegurar que el perfil quede con el celular y nombre en la tabla perfiles
          try {
            await supabase.from('perfiles').upsert({
              id: data.user.id,
              nombre: name,
              email: emailSupabase,
              celular: esCel ? celDigitos : null,
              rol: role,
              avatar_initials: inicialesDe(name),
              estado: 'Habilitado',
            });
          } catch (upsertErr) {
            console.warn('Error upserting perfil in Supabase:', upsertErr);
          }

          await new Promise((resolve) => setTimeout(resolve, 800));
          const profile = await fetchUserProfile(data.user.id);
          if (profile) {
            setUser(profile);
            registrarEvento('register', {
              usuarioId: profile.id,
              nombre: profile.name,
              contacto: profile.celular || profile.email,
              rol: profile.role,
            });
            return;
          }
        } else if (error) {
          console.warn('Supabase signUp error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase signup failed, storing locally:', err);
      }
    }

    await new Promise((r) => setTimeout(r, 600));
    const newUser: AuthUser = {
      id: `u_${Date.now()}`,
      name,
      role,
      avatarInitials: inicialesDe(name),
      ...(esEmail ? { email: rawContacto } : { celular: rawContacto }),
    };

    // Asegurar que el usuario quede en la base de datos Supabase usuarios
    try {
      await supabase.from('usuarios').upsert({
        nombre: name,
        email: esEmail ? rawContacto : null,
        celular: esCel ? rawContacto : null,
        rol: role,
        actualizado_en: new Date().toISOString(),
      }, { onConflict: 'email' });
    } catch (e) {
      console.warn('Error saving to supabase usuarios:', e);
    }

    addRegistrado(newUser);
    persistLocalUser(newUser);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
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

