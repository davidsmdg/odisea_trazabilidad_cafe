import { supabase } from '../app/utils/supabaseClient';

export interface TelemetryEvent {
  id: string;
  tipo: 
    | 'login' 
    | 'register' 
    | 'onboarding_iniciado' 
    | 'onboarding_completado' 
    | 'onboarding_omitido' 
    | 'codigo_canjeado'
    | 'cosecha_creada'
    | 'cereza_sumada'
    | 'secado_iniciado'
    | 'pergamino_registrado'
    | 'trilla_registrada';
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
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events.slice(0, 1000))); // límite de 1000 eventos
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

  // 1. Guardar localmente de inmediato (garantiza persistencia inmediata)
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
    // Si no existe la tabla o estamos offline, el evento persiste en localStorage
  }
}

export interface UsuarioConexion {
  usuarioId?: string;
  nombre: string;
  contacto?: string;
  rol: string;
  ultimaConexion: string;
  totalLogins: number;
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
  usuariosConectados: UsuarioConexion[];
  operacionesCafe: {
    totalCosechas: number;
    kilosCereza: number;
    kilosPergamino: number;
    kilosVerde: number;
  };
}

export async function obtenerResumenMetricas(): Promise<MetricSummary> {
  let eventos = getStoredEvents();

  // Intentar traer los más recientes de Supabase si está disponible
  try {
    const { data } = await supabase
      .from('eventos_telemetria')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(300);

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
      const ids = new Set(mapeados.map((e) => e.id));
      const localesUnicos = eventos.filter((e) => !ids.has(e.id));
      eventos = [...mapeados, ...localesUnicos];
    }
  } catch {}

  // Extraer también eventos directos de los lotes reales existentes (Supabase o localStorage)
  try {
    const { data: dbLotes } = await supabase.from('lotes').select('*').order('created_at', { ascending: false });
    let todosLosLotes: any[] = dbLotes || [];

    // Complementar con lotes_produccion local
    const rawLocal = localStorage.getItem('lotes_produccion');
    if (rawLocal) {
      try {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed)) {
          const codigosExistentes = new Set(todosLosLotes.map((l: any) => l.codigo || l.id));
          for (const pl of parsed) {
            if (!codigosExistentes.has(pl.codigo) && !codigosExistentes.has(pl.id)) {
              todosLosLotes.push(pl);
            }
          }
        }
      } catch {}
    }

    // Convertir cada lote existente en eventos sintéticos si no están ya en la bitácora
    const eventIds = new Set(eventos.map((e) => e.id));
    for (const l of todosLosLotes) {
      const cod = l.codigo || l.id;
      const meta = l.metadata || {};
      const fecha = l.created_at || l.fecha_cosecha || meta.fecha || new Date().toISOString();
      const cereza = Number(l.peso_cereza ?? l.pesos?.cereza) || 0;
      const pergamino = Number(l.peso_pergamino ?? l.pesos?.pergamino) || 0;
      const verde = Number(l.peso_verde ?? l.pesos?.verde) || 0;

      // Evento de creación
      const idCreacion = `lote-creado-${cod}`;
      if (!eventIds.has(idCreacion)) {
        eventos.push({
          id: idCreacion,
          tipo: 'cosecha_creada',
          nombre: meta.productor || 'David',
          contacto: meta.celular || 'david@odisea.co',
          rol: 'AGRICULTOR',
          detalles: {
            codigo: cod,
            variedad: l.variedad || meta.detallesObjetivo?.variedad || 'Caturra',
            kilosCereza: cereza,
            finca: meta.finca || 'Finca La Esperanza',
          },
          timestamp: fecha,
        });
        eventIds.add(idCreacion);
      }

      // Si tiene cereza recolectada (>0)
      if (cereza > 0) {
        const idCereza = `lote-cereza-${cod}`;
        if (!eventIds.has(idCereza)) {
          eventos.push({
            id: idCereza,
            tipo: 'cereza_sumada',
            nombre: meta.productor || 'David',
            contacto: meta.celular || 'david@odisea.co',
            rol: 'AGRICULTOR',
            detalles: {
              codigo: cod,
              kilosSumados: cereza,
              totalCereza: cereza,
            },
            timestamp: fecha,
          });
          eventIds.add(idCereza);
        }
      }

      // Si está en secado o tiene pergamino
      const fase = meta.fase ?? l.fase;
      if (fase >= 2 || l.estado_actual === 'En Secado' || pergamino > 0) {
        const idSecado = `lote-secado-${cod}`;
        if (!eventIds.has(idSecado)) {
          eventos.push({
            id: idSecado,
            tipo: 'secado_iniciado',
            nombre: meta.productor || 'David',
            contacto: meta.celular || 'david@odisea.co',
            rol: 'AGRICULTOR',
            detalles: {
              codigo: cod,
              kilosCereza: cereza,
            },
            timestamp: fecha,
          });
          eventIds.add(idSecado);
        }
      }

      // Si tiene pergamino seco registrado
      if (pergamino > 0) {
        const idPerg = `lote-pergamino-${cod}`;
        if (!eventIds.has(idPerg)) {
          eventos.push({
            id: idPerg,
            tipo: 'pergamino_registrado',
            nombre: meta.productor || 'David',
            contacto: meta.celular || 'david@odisea.co',
            rol: 'AGRICULTOR',
            detalles: {
              codigo: cod,
              kilosPergamino: pergamino,
              factorRendimiento: meta.factorRendimiento || null,
            },
            timestamp: fecha,
          });
          eventIds.add(idPerg);
        }
      }

      // Si tiene café verde trillado
      if (verde > 0) {
        const idVerde = `lote-verde-${cod}`;
        if (!eventIds.has(idVerde)) {
          eventos.push({
            id: idVerde,
            tipo: 'trilla_registrada',
            nombre: meta.productor || 'David',
            contacto: meta.celular || 'david@odisea.co',
            rol: 'AGRICULTOR',
            detalles: {
              codigo: cod,
              kilosVerde: verde,
            },
            timestamp: fecha,
          });
          eventIds.add(idVerde);
        }
      }
    }
  } catch (err) {
    console.error('Error sincronizando lotes a eventos de telemetría:', err);
  }

  // Ordenar cronológicamente descendente
  eventos.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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

  // Mapa de usuarios y su última conexión
  const conexionesMap = new Map<string, UsuarioConexion>();

  // Revisar logins y eventos para calcular última conexión
  for (const e of eventos) {
    const clave = e.contacto || e.usuarioId || e.nombre;
    if (!clave) continue;

    if (!conexionesMap.has(clave)) {
      conexionesMap.set(clave, {
        usuarioId: e.usuarioId,
        nombre: e.nombre || 'Usuario',
        contacto: e.contacto,
        rol: e.rol || 'AGRICULTOR',
        ultimaConexion: e.timestamp,
        totalLogins: e.tipo === 'login' ? 1 : 0,
      });
    } else {
      const item = conexionesMap.get(clave)!;
      if (e.tipo === 'login') {
        item.totalLogins += 1;
      }
      // Si el timestamp es más reciente, actualizar fecha
      if (new Date(e.timestamp) > new Date(item.ultimaConexion)) {
        item.ultimaConexion = e.timestamp;
      }
      if (e.nombre && item.nombre === 'Usuario') item.nombre = e.nombre;
      if (e.rol && item.rol === 'AGRICULTOR') item.rol = e.rol;
    }
  }

  // Trazabilidad de usuarios y estado de onboarding
  const usuariosMap = new Map<string, {
    nombre: string;
    contacto?: string;
    rol: string;
    estado: 'completado' | 'en_progreso';
    fecha: string;
  }>();

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

  // Métricas de operaciones de café
  const cosechasCreadas = eventos.filter((e) => e.tipo === 'cosecha_creada').length;
  let kilosCereza = 0;
  let kilosPergamino = 0;
  let kilosVerde = 0;

  for (const e of eventos) {
    if (e.tipo === 'cereza_sumada') {
      kilosCereza += Number(e.detalles?.kilosSumados) || 0;
    } else if (e.tipo === 'cosecha_creada') {
      kilosCereza += Number(e.detalles?.kilosCereza) || 0;
    } else if (e.tipo === 'pergamino_registrado') {
      kilosPergamino += Number(e.detalles?.kilosPergamino) || 0;
    } else if (e.tipo === 'trilla_registrada') {
      kilosVerde += Number(e.detalles?.kilosVerde) || 0;
    }
  }

  // Si aún no hay eventos detallados pero hay lotes guardados localmente, sumar de lotes_produccion
  try {
    const rawLotes = localStorage.getItem('lotes_produccion');
    if (rawLotes) {
      const lotes = JSON.parse(rawLotes);
      if (Array.isArray(lotes) && lotes.length > 0) {
        if (kilosCereza === 0) {
          kilosCereza = lotes.reduce((acc, l) => acc + (Number(l.pesos?.cereza) || 0), 0);
        }
        if (kilosPergamino === 0) {
          kilosPergamino = lotes.reduce((acc, l) => acc + (Number(l.pesos?.pergamino) || 0), 0);
        }
        if (kilosVerde === 0) {
          kilosVerde = lotes.reduce((acc, l) => acc + (Number(l.pesos?.verde) || 0), 0);
        }
      }
    }
  } catch {}

  return {
    totalLogins,
    totalRegistros,
    totalOnboardingIniciados: Math.max(onboardingIniciados, onboardingCompletados),
    totalOnboardingCompletados: onboardingCompletados,
    tasaOnboarding,
    usuariosPorRol,
    eventosRecientes: eventos.slice(0, 100),
    usuariosEnOnboarding: Array.from(usuariosMap.values()),
    usuariosConectados: Array.from(conexionesMap.values()).sort(
      (a, b) => new Date(b.ultimaConexion).getTime() - new Date(a.ultimaConexion).getTime()
    ),
    operacionesCafe: {
      totalCosechas: Math.max(cosechasCreadas, 0),
      kilosCereza,
      kilosPergamino,
      kilosVerde,
    },
  };
}
