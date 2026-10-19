import { supabase } from '../app/utils/supabaseClient';

export interface OperacionPendiente {
  id: string;
  entidad: 'cosecha' | 'finca' | 'movimiento' | 'evento';
  accion: 'crear' | 'actualizar';
  datos: any;
  fechaCreacion: string;
  reintentos: number;
}

const DB_NAME = 'odisea_offline_db';
const DB_VERSION = 1;
const STORE_QUEUE = 'sync_queue';
const STORE_DATA = 'offline_entities';
const LS_BACKUP_KEY = 'odisea_offline_queue_backup';

// Soporte robusto y nativo de IndexedDB
function abrirDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => resolve(null);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_QUEUE)) {
          db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_DATA)) {
          db.createObjectStore(STORE_DATA, { keyPath: 'clave' });
        }
      };
    } catch {
      resolve(null);
    }
  });
}

// Respaldo en LocalStorage por si el dispositivo es muy antiguo o no tiene IndexedDB
function guardarEnLS(cola: OperacionPendiente[]) {
  try {
    localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(cola));
  } catch {}
}

function leerDeLS(): OperacionPendiente[] {
  try {
    const raw = localStorage.getItem(LS_BACKUP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Guarda una entidad en la base de datos local permanente */
export async function guardarEntidadLocal(clave: string, valor: any): Promise<void> {
  try {
    localStorage.setItem(`odisea_entity_${clave}`, JSON.stringify(valor));
  } catch {}

  const db = await abrirDB();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_DATA, 'readwrite');
    const store = tx.objectStore(STORE_DATA);
    store.put({ clave, valor, actualizado: new Date().toISOString() });
  } catch {}
}

/** Lee una entidad local permanente */
export async function leerEntidadLocal<T>(clave: string): Promise<T | null> {
  const db = await abrirDB();
  if (db) {
    try {
      const result = await new Promise<any>((resolve) => {
        const tx = db.transaction(STORE_DATA, 'readonly');
        const store = tx.objectStore(STORE_DATA);
        const req = store.get(clave);
        req.onsuccess = () => resolve(req.result?.valor || null);
        req.onerror = () => resolve(null);
      });
      if (result) return result;
    } catch {}
  }

  try {
    const raw = localStorage.getItem(`odisea_entity_${clave}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Encola una operación que debe enviarse a Supabase cuando haya internet */
export async function encolarOperacion(
  entidad: OperacionPendiente['entidad'],
  accion: OperacionPendiente['accion'],
  datos: any
): Promise<OperacionPendiente> {
  const operacion: OperacionPendiente = {
    id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    entidad,
    accion,
    datos,
    fechaCreacion: new Date().toISOString(),
    reintentos: 0,
  };

  // 1. Guardar en IndexedDB
  const db = await abrirDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_QUEUE);
      store.put(operacion);
    } catch {}
  }

  // 2. Respaldo simultáneo en LocalStorage
  const colaActual = leerDeLS();
  guardarEnLS([...colaActual, operacion]);

  // Notificar cambio en la cola
  window.dispatchEvent(new CustomEvent('odisea:sync-queue-updated'));

  // Si hay señal, intentar sincronizar de una vez en segundo plano
  if (navigator.onLine) {
    sincronizarPendientes().catch(() => {});
  }

  return operacion;
}

/** Obtiene todas las operaciones pendientes de sincronización */
export async function getOperacionesPendientes(): Promise<OperacionPendiente[]> {
  const db = await abrirDB();
  if (db) {
    try {
      const pendientes = await new Promise<OperacionPendiente[]>((resolve) => {
        const tx = db.transaction(STORE_QUEUE, 'readonly');
        const store = tx.objectStore(STORE_QUEUE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
      if (pendientes && pendientes.length > 0) return pendientes;
    } catch {}
  }
  return leerDeLS();
}

/** Elimina una operación ya sincronizada con éxito */
async function removerOperacion(id: string): Promise<void> {
  const db = await abrirDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_QUEUE);
      store.delete(id);
    } catch {}
  }
  const cola = leerDeLS().filter((item) => item.id !== id);
  guardarEnLS(cola);
  window.dispatchEvent(new CustomEvent('odisea:sync-queue-updated'));
}

/** Procesa toda la cola pendiente y la envía a Supabase */
export async function sincronizarPendientes(): Promise<{ exito: boolean; subidos: number }> {
  if (!navigator.onLine) return { exito: false, subidos: 0 };

  const pendientes = await getOperacionesPendientes();
  if (pendientes.length === 0) return { exito: true, subidos: 0 };

  let subidos = 0;

  for (const item of pendientes) {
    try {
      if (item.entidad === 'finca') {
        const f = item.datos;
        const areaNum = parseFloat(f.areaAproximada || '1') || 1.0;
        const primeraCoord = f.lotesDeCafe?.[0]?.coordenadaCentral || '';
        const latMatch = primeraCoord.match(/Lat:\s*([-\d.]+)/);
        const lngMatch = primeraCoord.match(/Long:\s*([-\d.]+)/);

        await supabase.from('fincas').upsert({
          id: f.id,
          productor_id: f.productorId || null,
          nombre: f.nombre,
          departamento: f.departamento,
          municipio: f.municipio,
          cedula_cafetera: f.cedulaCafetera || null,
          tipo_tenencia: f.tipoTenencia || 'Propiedad Titulada',
          es_comunidad_etnica: f.esComunidadEtnica || false,
          lotes_de_cafe: f.lotesDeCafe,
          hectareas: areaNum,
          latitud: latMatch ? parseFloat(latMatch[1]) : 0.0,
          longitud: lngMatch ? parseFloat(lngMatch[1]) : 0.0,
        });
      } else if (item.entidad === 'cosecha') {
        const c = item.datos;
        await supabase.from('lotes').upsert({
          id: c.id,
          codigo: c.codigo,
          finca_id: c.fincaId || null,
          productor_id: c.productorId || null,
          variedad: c.variedad || 'Bourbon Rosado',
          proceso: c.proceso || 'Lavado',
          estado_actual: c.estado || 'Cereza',
          peso_cereza: c.pesos?.cereza || 0,
          peso_pergamino: c.pesos?.pergamino || 0,
          peso_verde: c.pesos?.verde || 0,
          calificacion_final: c.calificacion || 0,
          metadata: c.metadata || {},
        });
      } else if (item.entidad === 'movimiento') {
        const m = item.datos;
        await supabase.from('movimientos_financieros').upsert({
          id: m.id,
          periodo_id: m.periodoId,
          tipo: m.tipo,
          categoria_id: m.categoriaId,
          categoria_label: m.categoriaLabel,
          monto: m.monto,
          fecha: m.fechaISO.split('T')[0],
          fecha_iso: m.fechaISO,
          descripcion: m.nota,
          nota: m.nota,
          cosecha_id: m.cosechaCodigo,
          cosecha_codigo: m.cosechaCodigo,
          libro: m.libro,
          icono: m.icono,
          productor_id: m.productorId || null,
          productor_nombre: m.productorNombre,
          origen: m.origen,
        });
      }

      await removerOperacion(item.id);
      subidos++;
    } catch (e) {
      console.warn('Error subiendo operacion pendiente:', item.id, e);
      // Detener bucle si se cayó la red a mitad de sincronización
      if (!navigator.onLine) break;
    }
  }

  return { exito: true, subidos };
}

// Iniciar listener de reconexión automático
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('📶 Conexión recuperada, sincronizando datos pendientes con Supabase...');
    sincronizarPendientes().catch(() => {});
  });
}
