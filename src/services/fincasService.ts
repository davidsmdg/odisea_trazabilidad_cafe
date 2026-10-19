import { supabase } from '../app/utils/supabaseClient';
import type { Finca } from '../types/finca';

const LOCAL_FINCAS_KEY = 'odisea_fincas';

function esUUID(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function generarUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function getLocalFincas(): Finca[] {
    try {
        const raw = localStorage.getItem(LOCAL_FINCAS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveLocalFincas(fincas: Finca[]) {
    try {
        localStorage.setItem(LOCAL_FINCAS_KEY, JSON.stringify(fincas));
    } catch {}
}

export async function getFincas(): Promise<Finca[]> {
    const local = getLocalFincas();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Si no hay usuario en sesión, retornar solo local si coincide, sino vacío
        if (!user) return local;

        const { data, error } = await supabase
            .from('fincas')
            .select('*')
            .eq('productor_id', user.id);

        if (!error && data) {
            const mapped: Finca[] = data.map((f) => ({
                id: f.id,
                nombre: f.nombre,
                departamento: f.departamento,
                municipio: f.municipio,
                areaAproximada: f.hectareas ? String(f.hectareas) : undefined,
                cedulaCafetera: f.cedula_cafetera || '',
                tipoTenencia: f.tipo_tenencia || '',
                esComunidadEtnica: f.es_comunidad_etnica || false,
                lotesDeCafe: Array.isArray(f.lotes_de_cafe) ? f.lotes_de_cafe : [],
            }));
            saveLocalFincas(mapped);
            return mapped;
        }
    } catch (e) {
        console.warn('Error fetching fincas from Supabase, using local:', e);
    }

    return local;
}

export async function saveFincas(fincas: Finca[]): Promise<void> {
    // Normalizar IDs para que sean UUID válidos requeridos por la columna UUID de Postgres
    const normalizadas: Finca[] = fincas.map((f) => ({
        ...f,
        id: esUUID(f.id) ? f.id : generarUUID(),
        lotesDeCafe: (f.lotesDeCafe || []).map((l) => ({
            ...l,
            id: esUUID(l.id) ? l.id : generarUUID(),
        })),
    }));

    saveLocalFincas(normalizadas);

    try {
        const { data: { user } } = await supabase.auth.getUser();
        let prodId: string | null = user?.id || null;

        for (const f of normalizadas) {
            const areaNum = parseFloat(f.areaAproximada || '1') || 1.0;
            const primeraCoord = f.lotesDeCafe[0]?.coordenadaCentral || '';
            const latMatch = primeraCoord.match(/Lat:\s*([-\d.]+)/);
            const lngMatch = primeraCoord.match(/Long:\s*([-\d.]+)/);
            const lat = latMatch ? parseFloat(latMatch[1]) : 0.0;
            const lng = lngMatch ? parseFloat(lngMatch[1]) : 0.0;

            const { error } = await supabase
                .from('fincas')
                .upsert({
                    id: f.id,
                    productor_id: prodId,
                    nombre: f.nombre,
                    departamento: f.departamento,
                    municipio: f.municipio,
                    cedula_cafetera: f.cedulaCafetera || null,
                    tipo_tenencia: f.tipoTenencia || 'Propiedad Titulada',
                    es_comunidad_etnica: f.esComunidadEtnica || false,
                    lotes_de_cafe: f.lotesDeCafe,
                    hectareas: areaNum,
                    latitud: lat,
                    longitud: lng,
                });

            if (error) {
                console.error('Error guardando finca en Supabase, encolando offline:', error);
                const { encolarOperacion } = await import('./offlineSyncService');
                await encolarOperacion('finca', 'crear', { ...f, productorId: prodId });
            }
        }
    } catch (e) {
        console.error('Error en saveFincas, encolando offline:', e);
        try {
            const { encolarOperacion } = await import('./offlineSyncService');
            for (const f of normalizadas) {
                await encolarOperacion('finca', 'crear', f);
            }
        } catch {}
    }
}

