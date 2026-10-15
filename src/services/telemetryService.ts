import { supabase } from '../app/utils/supabaseClient';

export interface TelemetryEvent {
  id: string;
  tipo: 'login' | 'register' | 'onboarding_iniciado' | 'onboarding_completado' | 'onboarding_omitido' | 'codigo_canjeado';
  usuarioId?: string;
  nombre?: string;
  contacto?: string;
  rol?: string;
  detalles?: Record<string, any>;
  timestamp: string;
}

const STORAGE_KEY_EVENTS = 'odisea_telemetry_events';

function getStoredEvents(): TelemetryEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredEvents(events: TelemetryEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events.slice(0, 500))); // límite de 500 eventos
  } catch {}
}

export async function registrarEvento(
  tipo: TelemetryEvent['tipo'],
  data: {
    usuarioId?: string;
    nombre?: string;
    contacto?: string;
    rol?: string;
    detalles?: Record<string, any>;
  }
): Promise<void> {
  const evento: TelemetryEvent = {
    id: 'evt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    tipo,
    usuarioId: data.usuarioId,
    nombre: data.nombre,
    contacto: data.contacto,
    rol: data.rol,
    detalles: data.detalles || {},
    timestamp: new Date().toISOString(),
  };

  // 1. Guardar localmente de inmediato (garantiza cero fallos si no hay red)
  const locales = getStoredEvents();
  saveStoredEvents([evento, ...locales]);

  // 2. Intentar registrar en Supabase de forma asíncrona
  try {
    await supabase.from('eventos_telemetria').insert({
      id: evento.id,
      tipo: evento.tipo,
      usuario_id: evento.usuarioId || null,
      nombre: evento.nombre || null,
      contacto: evento.contacto || null,
      rol: evento.rol || null,
      detalles: evento.detalles,
      created_at: evento.timestamp,
    });
  } catch {
    // Si no existe la tabla en Supabase o estamos offline, el evento persiste en localStorage
  }
}

export interface MetricSummary {
  totalLogins: number;
  totalRegistros: number;
  totalOnboardingIniciados: number;
  totalOnboardingCompletados: number;
  tasaOnboarding: number;
  usuariosPorRol: Record<string, number>;
  eventosRecientes: TelemetryEvent[];
  usuariosEnOnboarding: {
    nombre: string;
    contacto?: string;
    rol: string;
    estado: 'completado' | 'en_progreso';
    fecha: string;
  }[];
}

export async function obtenerResumenMetricas(): Promise<MetricSummary> {
  let eventos = getStoredEvents();

  // Intentar traer los más recientes de Supabase si está disponible
  try {
    const { data } = await supabase
      .from('eventos_telemetria')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (data && data.length > 0) {
      const mapeados: TelemetryEvent[] = data.map((d: any) => ({
        id: d.id,
        tipo: d.tipo,
        usuarioId: d.usuario_id,
        nombre: d.nombre,
        contacto: d.contacto,
        rol: d.rol,
        detalles: d.detalles,
        timestamp: d.created_at,
      }));
      // Mezclar deduplicando por id
      const ids = new Set(mapeados.map((e) => e.id));
      const localesUnicos = eventos.filter((e) => !ids.has(e.id));
      eventos = [...mapeados, ...localesUnicos].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
  } catch {}

  // Contadores
  const totalLogins = eventos.filter((e) => e.tipo === 'login').length;
  const totalRegistros = eventos.filter((e) => e.tipo === 'register').length;
  const onboardingIniciados = eventos.filter((e) => e.tipo === 'onboarding_iniciado').length;
  const onboardingCompletados = eventos.filter((e) => e.tipo === 'onboarding_completado').length;

  const tasaOnboarding =
    onboardingIniciados > 0
      ? Math.round((onboardingCompletados / onboardingIniciados) * 100)
      : onboardingCompletados > 0
      ? 100
      : 0;

  const usuariosPorRol: Record<string, number> = {};
  eventos
    .filter((e) => e.tipo === 'register' || e.tipo === 'login')
    .forEach((e) => {
      const r = e.rol || 'Desconocido';
      usuariosPorRol[r] = (usuariosPorRol[r] || 0) + 1;
    });

  // Trazabilidad de usuarios y estado de onboarding
  const usuariosMap = new Map<string, {
    nombre: string;
    contacto?: string;
    rol: string;
    estado: 'completado' | 'en_progreso';
    fecha: string;
  }>();

  // Revisar completados
  eventos.forEach((e) => {
    const clave = e.contacto || e.usuarioId || e.nombre;
    if (!clave) return;

    if (e.tipo === 'onboarding_completado') {
      usuariosMap.set(clave, {
        nombre: e.nombre || 'Productor',
        contacto: e.contacto,
        rol: e.rol || 'AGRICULTOR',
        estado: 'completado',
        fecha: e.timestamp,
      });
    } else if (e.tipo === 'onboarding_iniciado' || e.tipo === 'register') {
      if (!usuariosMap.has(clave)) {
        usuariosMap.set(clave, {
          nombre: e.nombre || 'Productor',
          contacto: e.contacto,
          rol: e.rol || 'AGRICULTOR',
          estado: 'en_progreso',
          fecha: e.timestamp,
        });
      }
    }
  });

  return {
    totalLogins,
    totalRegistros,
    totalOnboardingIniciados: Math.max(onboardingIniciados, onboardingCompletados),
    totalOnboardingCompletados: onboardingCompletados,
    tasaOnboarding,
    usuariosPorRol,
    eventosRecientes: eventos.slice(0, 50),
    usuariosEnOnboarding: Array.from(usuariosMap.values()),
  };
}
