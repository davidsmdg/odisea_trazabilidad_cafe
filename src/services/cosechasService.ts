import { supabase } from '../app/utils/supabaseClient';
import type { Cosecha } from '../types/cosecha';

export async function getCosechas(): Promise<Cosecha[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Si hay usuario logueado en Supabase, intentamos consultar primero
    if (user) {
        const { data, error } = await supabase
            .from('lotes')
            .select('*')
            .eq('productor_id', user.id);

        if (!error && data && data.length > 0) {
            return data.map(l => {
                const meta = l.metadata || {};
                return {
                    id: l.id,
                    codigo: l.codigo,
                    productor: meta.productor || 'Productor',
                    cosecha: meta.cosecha || 'Cosecha Principal',
                    finca: meta.finca || 'Finca Cafetera',
                    parcelas: meta.parcelas || [],
                    estado: l.estado_actual || 'Cereza',
                    pesos: {
                        cereza: Number(l.peso_cereza) || 0,
                        pergamino: Number(l.peso_pergamino) || 0,
                        verde: Number(l.peso_verde) || 0,
                        objetivo: meta.pesos?.objetivo || 0
                    },
                    fase: meta.fase !== undefined ? meta.fase : 1,
                    modalidad: meta.modalidad || 'diario',
                    detallesObjetivo: l.variedad && l.proceso ? {
                        variedad: l.variedad,
                        proceso: l.proceso
                    } : meta.detallesObjetivo,
                    calificacion: Number(l.calificacion_final) || meta.calificacion || 0,
                    macroperfil: meta.macroperfil || '',
                    clientes: meta.clientes || [],
                    factorRendimiento: meta.factorRendimiento ?? null
                };
            });
        }
    }

    // Fallback inteligente para modo demo / local storage
    try {
        const saved = localStorage.getItem('lotes_produccion');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Error reading lotes_produccion fallback:', e);
    }

    return [];
}

export async function saveCosechas(cosechas: Cosecha[]): Promise<void> {
    // 1. Siempre respaldar y sincronizar en localStorage para consistencia inmediata entre vistas
    try {
        localStorage.setItem('lotes_produccion', JSON.stringify(cosechas));
    } catch (e) {
        console.error('Error writing lotes_produccion to localStorage:', e);
    }

    const { data: { user } } = await supabase.auth.getUser();

    let defaultFincaId: string | null = null;
    let productorId: string | null = user?.id || null;

    if (user) {
        const { data: fincas } = await supabase
            .from('fincas')
            .select('id')
            .eq('productor_id', user.id);
        defaultFincaId = fincas?.[0]?.id || null;
    }

    if (!defaultFincaId) {
        try {
            const { data: dbFincas } = await supabase.from('fincas').select('id, nombre, productor_id');
            if (dbFincas && dbFincas.length > 0) {
                defaultFincaId = dbFincas[0].id;
                if (!productorId && dbFincas[0].productor_id) productorId = dbFincas[0].productor_id;
            }
        } catch {}
    }

    for (const c of cosechas) {
        const fincaId = defaultFincaId;
        if (!fincaId) continue;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(c.id);
        const loteId = isUuid ? c.id : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (x) => {
            const r = (Math.random() * 16) | 0;
            return (x === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }));

        const { error } = await supabase
            .from('lotes')
            .upsert({
                id: loteId,
                codigo: c.codigo || `LOT-${loteId.slice(0, 8).toUpperCase()}`,
                finca_id: fincaId,
                productor_id: productorId,
                variedad: c.detallesObjetivo?.variedad || 'Bourbon Rosado',
                proceso: c.detallesObjetivo?.proceso || 'Lavado',
                estado_actual: c.estado,
                peso_cereza: c.pesos?.cereza || 0,
                peso_pergamino: c.pesos?.pergamino || 0,
                peso_verde: c.pesos?.verde || 0,
                calificacion_final: c.calificacion || 0,
                metadata: {
                    productor: c.productor,
                    cosecha: c.cosecha,
                    finca: c.finca,
                    parcelas: c.parcelas,
                    pesos: {
                        objetivo: c.pesos?.objetivo || 0
                    },
                    fase: c.fase,
                    modalidad: c.modalidad,
                    macroperfil: c.macroperfil,
                    clientes: c.clientes,
                    factorRendimiento: c.factorRendimiento
                }
            });
        if (error) {
            console.error('Error saving harvest/lote, encolando offline:', error);
            const { encolarOperacion } = await import('./offlineSyncService');
            await encolarOperacion('cosecha', 'crear', {
                id: loteId,
                codigo: c.codigo || `LOT-${loteId.slice(0, 8).toUpperCase()}`,
                fincaId,
                productorId,
                variedad: c.detallesObjetivo?.variedad || 'Bourbon Rosado',
                proceso: c.detallesObjetivo?.proceso || 'Lavado',
                estado: c.estado,
                pesos: c.pesos,
                calificacion: c.calificacion,
                metadata: {
                    productor: c.productor,
                    cosecha: c.cosecha,
                    finca: c.finca,
                    parcelas: c.parcelas,
                    pesos: { objetivo: c.pesos?.objetivo || 0 },
                    fase: c.fase,
                    modalidad: c.modalidad,
                    macroperfil: c.macroperfil,
                    clientes: c.clientes,
                    factorRendimiento: c.factorRendimiento
                }
            });
        }
    }
}

