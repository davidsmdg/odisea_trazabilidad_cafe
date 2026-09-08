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

export async function validarCodigoInvitacion(
    codigoInput: string,
    rolSeleccionado: UserRole
): Promise<{ valido: boolean; mensaje?: string; codigo?: CodigoInvitacion }> {
    const normalizado = codigoInput.trim().toUpperCase();
    if (!normalizado) {
        return { valido: false, mensaje: 'Por favor ingresa un código de invitación.' };
    }

    // 1. Intentar validar en Supabase
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
        console.warn('Fallo al validar código en Supabase, recurriendo a validación local:', e);
    }

    // 2. Fallback local si la tabla aún no existe o estamos sin conexión
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

    // 1. Intentar actualizar en Supabase
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
        console.warn('No se pudo incrementar uso en Supabase:', e);
    }

    // 2. Actualizar conteo local
    const localList = getLocalCodes();
    const updated = localList.map((c) =>
        c.codigo.toUpperCase() === normalizado
            ? { ...c, usosActuales: c.usosActuales + 1 }
            : c
    );
    saveLocalCodes(updated);
}

export async function getTodosLosCodigos(): Promise<CodigoInvitacion[]> {
    try {
        const { data, error } = await supabase
            .from('codigos_invitacion')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
            return data.map((d) => ({
                id: d.id,
                codigo: d.codigo,
                rolPermitido: d.rol_permitido,
                usosMaximos: d.usos_maximos,
                usosActuales: d.usos_actuales,
                activo: d.activo,
                expiraEl: d.expira_el,
            }));
        }
    } catch {}

    return getLocalCodes();
}

export async function crearCodigoInvitacion(nuevo: Omit<CodigoInvitacion, 'id' | 'usosActuales'>): Promise<CodigoInvitacion> {
    const codigoObj: CodigoInvitacion = {
        id: 'cod-' + Date.now(),
        ...nuevo,
        codigo: nuevo.codigo.trim().toUpperCase(),
        usosActuales: 0,
    };

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
            return {
                id: data.id,
                codigo: data.codigo,
                rolPermitido: data.rol_permitido,
                usosMaximos: data.usos_maximos,
                usosActuales: data.usos_actuales,
                activo: data.activo,
            };
        }
    } catch {}

    const local = getLocalCodes();
    saveLocalCodes([codigoObj, ...local]);
    return codigoObj;
}
