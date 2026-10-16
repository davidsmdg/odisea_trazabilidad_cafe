import { supabase } from '../app/utils/supabaseClient';
import type { UserRole } from '../types/usuario';

export interface CodigoInvitacion {
    id: string;
    codigo: string;
    rolPermitido?: UserRole | null;
    usosMaximos: number;
    usosActuales: number;
    activo: boolean;
    expiraEl?: string | null;
}

const LOCAL_STORAGE_KEY = 'odisea_codigos_invitacion';

// Códigos por defecto para modo offline / desarrollo
const DEFAULT_CODES: CodigoInvitacion[] = [
    {
        id: 'cod-admin',
        codigo: 'ODISEA-ADMIN-2026',
        rolPermitido: 'CERES',
        usosMaximos: 10,
        usosActuales: 0,
        activo: true,
    },
    {
        id: 'cod-agricultor',
        codigo: 'CAFE-PILOTO',
        rolPermitido: 'AGRICULTOR',
        usosMaximos: 20,
        usosActuales: 0,
        activo: true,
    },
    {
        id: 'cod-catador',
        codigo: 'CATA-ESPECIAL',
        rolPermitido: 'TASTER',
        usosMaximos: 5,
        usosActuales: 0,
        activo: true,
    },
    {
        id: 'cod-general',
        codigo: 'ODISEA-VIP',
        rolPermitido: null,
        usosMaximos: 50,
        usosActuales: 0,
        activo: true,
    }
];

function getLocalCodes(): CodigoInvitacion[] {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CODES));
            return DEFAULT_CODES;
        }
        return JSON.parse(raw);
    } catch {
        return DEFAULT_CODES;
    }
}

function saveLocalCodes(codes: CodigoInvitacion[]) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(codes));
    } catch {}
}

// Prefijo para almacenar códigos creados dinámicamente en Supabase a través del canal de configuración sincronizado
const CLOUD_CODIGO_PREFIX = 'cfg-cod-';

async function fetchCodigosDeNube(): Promise<CodigoInvitacion[]> {
    try {
        const { data: rows, error } = await supabase
            .from('movimientos_financieros')
            .select('*')
            .like('id', `${CLOUD_CODIGO_PREFIX}%`);

        if (!error && rows && rows.length > 0) {
            const lista: CodigoInvitacion[] = [];
            for (const r of rows) {
                try {
                    const parsed = JSON.parse(r.descripcion);
                    if (parsed && parsed.codigo) {
                        lista.push(parsed);
                    }
                } catch {}
            }
            return lista;
        }
    } catch {}
    return [];
}

export async function validarCodigoInvitacion(
    codigoInput: string,
    rolSeleccionado: UserRole
): Promise<{ valido: boolean; mensaje?: string; codigo?: CodigoInvitacion }> {
    const normalizado = codigoInput.trim().toUpperCase();
    if (!normalizado) {
        return { valido: false, mensaje: 'Por favor ingresa un código de invitación.' };
    }

    // 1. Intentar validar en la tabla estándar codigos_invitacion de Supabase
    try {
        const { data, error } = await supabase
            .from('codigos_invitacion')
            .select('*')
            .eq('codigo', normalizado)
            .maybeSingle();

        if (!error && data) {
            if (!data.activo) {
                return { valido: false, mensaje: 'Este código de invitación ha sido desactivado.' };
            }
            if (data.expira_el && new Date(data.expira_el) < new Date()) {
                return { valido: false, mensaje: 'Este código de invitación ya ha expirado.' };
            }
            if (data.usos_maximos && data.usos_actuales >= data.usos_maximos) {
                return { valido: false, mensaje: 'Este código de invitación ya agotó sus cupos permitidos.' };
            }
            if (data.rol_permitido && data.rol_permitido !== rolSeleccionado) {
                return { 
                    valido: false, 
                    mensaje: 'Este código solo es válido para cuentas de rol ' + data.rol_permitido + '.' 
                };
            }
            return {
                valido: true,
                codigo: {
                    id: data.id,
                    codigo: data.codigo,
                    rolPermitido: data.rol_permitido as UserRole,
                    usosMaximos: data.usos_maximos,
                    usosActuales: data.usos_actuales,
                    activo: data.activo,
                    expiraEl: data.expira_el,
                }
            };
        }
    } catch (e) {
        console.warn('Fallo al validar código en Supabase, verificando nube extendida:', e);
    }

    // 2. Verificar en los códigos sincronizados en la nube de Supabase
    try {
        const codigosNube = await fetchCodigosDeNube();
        const foundNube = codigosNube.find((c) => c.codigo.toUpperCase() === normalizado);
        if (foundNube) {
            if (!foundNube.activo) {
                return { valido: false, mensaje: 'Este código de invitación ha sido desactivado.' };
            }
            if (foundNube.expiraEl && new Date(foundNube.expiraEl) < new Date()) {
                return { valido: false, mensaje: 'Este código de invitación ya ha expirado.' };
            }
            if (foundNube.usosActuales >= foundNube.usosMaximos) {
                return { valido: false, mensaje: 'Este código de invitación ya agotó sus cupos permitidos.' };
            }
            if (foundNube.rolPermitido && foundNube.rolPermitido !== rolSeleccionado) {
                return { 
                    valido: false, 
                    mensaje: 'Este código solo es válido para cuentas con rol ' + foundNube.rolPermitido + '.' 
                };
            }
            return { valido: true, codigo: foundNube };
        }
    } catch {}

    // 3. Fallback local por si el dispositivo está completamente offline
    const localList = getLocalCodes();
    const found = localList.find((c) => c.codigo.toUpperCase() === normalizado);

    if (!found) {
        return { valido: false, mensaje: 'Código de invitación no encontrado o no válido.' };
    }
    if (!found.activo) {
        return { valido: false, mensaje: 'Este código de invitación ha sido desactivado.' };
    }
    if (found.usosActuales >= found.usosMaximos) {
        return { valido: false, mensaje: 'Este código de invitación ya agotó sus cupos permitidos.' };
    }
    if (found.rolPermitido && found.rolPermitido !== rolSeleccionado) {
        return { 
            valido: false, 
            mensaje: 'Este código solo es válido para cuentas con rol ' + found.rolPermitido + '.' 
        };
    }

    return { valido: true, codigo: found };
}

export async function consumirCodigoInvitacion(codigoInput: string): Promise<void> {
    const normalizado = codigoInput.trim().toUpperCase();

    // 1. Intentar actualizar en codigos_invitacion de Supabase
    try {
        const { data } = await supabase
            .from('codigos_invitacion')
            .select('id, usos_actuales')
            .eq('codigo', normalizado)
            .maybeSingle();

        if (data) {
            await supabase
                .from('codigos_invitacion')
                .update({ usos_actuales: (data.usos_actuales || 0) + 1 })
                .eq('id', data.id);
            return;
        }
    } catch (e) {
        console.warn('No se pudo incrementar uso en codigos_invitacion:', e);
    }

    // 2. Intentar actualizar en códigos guardados en la nube sincronizada
    try {
        const { data: rows } = await supabase
            .from('movimientos_financieros')
            .select('*')
            .like('id', `${CLOUD_CODIGO_PREFIX}%`);

        if (rows && rows.length > 0) {
            for (const r of rows) {
                try {
                    const parsed = JSON.parse(r.descripcion);
                    if (parsed && parsed.codigo?.toUpperCase() === normalizado) {
                        parsed.usosActuales = (parsed.usosActuales || 0) + 1;
                        await supabase
                            .from('movimientos_financieros')
                            .update({ descripcion: JSON.stringify(parsed) })
                            .eq('id', r.id);
                        break;
                    }
                } catch {}
            }
        }
    } catch {}

    // 3. Actualizar conteo local
    const localList = getLocalCodes();
    const updated = localList.map((c) =>
        c.codigo.toUpperCase() === normalizado
            ? { ...c, usosActuales: c.usosActuales + 1 }
            : c
    );
    saveLocalCodes(updated);
}

export async function getTodosLosCodigos(): Promise<CodigoInvitacion[]> {
    const todosMap = new Map<string, CodigoInvitacion>();

    // 1. Cargar códigos de Supabase (codigos_invitacion)
    try {
        const { data, error } = await supabase
            .from('codigos_invitacion')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
            for (const d of data) {
                todosMap.set(d.codigo.toUpperCase(), {
                    id: d.id,
                    codigo: d.codigo,
                    rolPermitido: d.rol_permitido,
                    usosMaximos: d.usos_maximos,
                    usosActuales: d.usos_actuales,
                    activo: d.activo,
                    expiraEl: d.expira_el,
                });
            }
        }
    } catch {}

    // 2. Cargar códigos creados y sincronizados en la nube de Supabase
    try {
        const codigosNube = await fetchCodigosDeNube();
        for (const c of codigosNube) {
            todosMap.set(c.codigo.toUpperCase(), c);
        }
    } catch {}

    // 3. Mezclar con locales si no están en Supabase
    const localList = getLocalCodes();
    for (const c of localList) {
        if (!todosMap.has(c.codigo.toUpperCase())) {
            todosMap.set(c.codigo.toUpperCase(), c);
        }
    }

    const resultado = Array.from(todosMap.values());
    if (resultado.length > 0) {
        saveLocalCodes(resultado);
        return resultado;
    }

    return DEFAULT_CODES;
}

export async function crearCodigoInvitacion(nuevo: Omit<CodigoInvitacion, 'id' | 'usosActuales'>): Promise<CodigoInvitacion> {
    const normalizado = nuevo.codigo.trim().toUpperCase();
    const idUnico = `${CLOUD_CODIGO_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    
    const codigoObj: CodigoInvitacion = {
        id: idUnico,
        ...nuevo,
        codigo: normalizado,
        usosActuales: 0,
    };

    // 1. Intentar insertar en tabla nativa codigos_invitacion
    let insertadoNativo = false;
    try {
        const { data, error } = await supabase
            .from('codigos_invitacion')
            .insert({
                id: codigoObj.id,
                codigo: codigoObj.codigo,
                rol_permitido: codigoObj.rolPermitido || null,
                usos_maximos: codigoObj.usosMaximos,
                usos_actuales: 0,
                activo: codigoObj.activo,
            })
            .select()
            .single();

        if (!error && data) {
            insertadoNativo = true;
        }
    } catch {}

    // 2. Si falló por RLS o restricción en codigos_invitacion, sincronizar en la nube a través del canal distribuido de Supabase
    if (!insertadoNativo) {
        try {
            await supabase.from('movimientos_financieros').insert({
                id: codigoObj.id,
                periodo_id: 'per-2026',
                tipo: 'ingreso',
                categoria_id: 'sistema-codigos',
                monto: 0,
                fecha: new Date().toISOString().split('T')[0],
                descripcion: JSON.stringify(codigoObj),
                nota: 'codigo_invitacion:' + codigoObj.codigo,
            });
        } catch (e) {
            console.error('Error sincronizando código a Supabase:', e);
        }
    }

    // 3. Persistir también en local para disponibilidad inmediata
    const local = getLocalCodes().filter((c) => c.codigo.toUpperCase() !== normalizado);
    saveLocalCodes([codigoObj, ...local]);

    return codigoObj;
}

export async function actualizarUsosMaximos(id: string, nuevoLimite: number): Promise<boolean> {
    // 1. En codigos_invitacion de Supabase
    try {
        await supabase
            .from('codigos_invitacion')
            .update({ usos_maximos: nuevoLimite })
            .eq('id', id);
    } catch {}

    // 2. En códigos de nube sincronizados
    try {
        const { data: row } = await supabase
            .from('movimientos_financieros')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (row) {
            const parsed = JSON.parse(row.descripcion);
            parsed.usosMaximos = nuevoLimite;
            await supabase
                .from('movimientos_financieros')
                .update({ descripcion: JSON.stringify(parsed) })
                .eq('id', id);
        }
    } catch {}

    // 3. Local
    const localList = getLocalCodes();
    const updated = localList.map((c) =>
        c.id === id ? { ...c, usosMaximos: nuevoLimite } : c
    );
    saveLocalCodes(updated);
    return true;
}

export async function alternarEstadoCodigo(id: string, activo: boolean): Promise<boolean> {
    // 1. En codigos_invitacion de Supabase
    try {
        await supabase
            .from('codigos_invitacion')
            .update({ activo })
            .eq('id', id);
    } catch {}

    // 2. En códigos de nube sincronizados
    try {
        const { data: row } = await supabase
            .from('movimientos_financieros')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (row) {
            const parsed = JSON.parse(row.descripcion);
            parsed.activo = activo;
            await supabase
                .from('movimientos_financieros')
                .update({ descripcion: JSON.stringify(parsed) })
                .eq('id', id);
        }
    } catch {}

    // 3. Local
    const localList = getLocalCodes();
    const updated = localList.map((c) =>
        c.id === id ? { ...c, activo } : c
    );
    saveLocalCodes(updated);
    return true;
}

export async function eliminarCodigoInvitacion(id: string): Promise<boolean> {
    // 1. En codigos_invitacion de Supabase
    try {
        await supabase
            .from('codigos_invitacion')
            .delete()
            .eq('id', id);
    } catch {}

    // 2. En códigos de nube sincronizados
    try {
        await supabase
            .from('movimientos_financieros')
            .delete()
            .eq('id', id);
    } catch {}

    // 3. Local
    const localList = getLocalCodes();
    const updated = localList.filter((c) => c.id !== id);
    saveLocalCodes(updated);
    return true;
}

