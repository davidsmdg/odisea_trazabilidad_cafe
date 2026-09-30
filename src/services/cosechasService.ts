import { supabase } from '../app/utils/supabaseClient';
import type { Cosecha } from '../types/cosecha';

export async function getCosechas(): Promise<Cosecha[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('lotes')
        .select('*')
        .eq('productor_id', user.id);

    if (error) {
        console.error('Error fetching cosechas:', error);
        return [];
    }

    return (data || []).map(l => {
        const meta = l.metadata || {};
        return {
            id: l.id,
            codigo: l.codigo,
            productor: meta.productor || 'María González',
            cosecha: meta.cosecha || 'Cosecha Principal',
            finca: meta.finca || 'Finca La Esperanza',
            parcelas: meta.parcelas || [],
            estado: l.estado_actual || 'Cereza',
            pesos: {
                cereza: Number(l.peso_cereza) || 0,
                pergamino: Number(l.peso_pergamino) || 0,
                verde: Number(l.peso_verde) || 0,
                objetivo: meta.pesos?.objetivo || 0
            },
            fase: meta.fase || 1,
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

export async function saveCosechas(cosechas: Cosecha[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const c of cosechas) {
        // Buscar el id de la finca correspondiente o asociar el primero
        const { data: fincas } = await supabase
            .from('fincas')
            .select('id')
            .eq('productor_id', user.id);

        const fincaId = fincas?.[0]?.id;
        if (!fincaId) {
            console.error('No finca found for producer to associate with harvest');
            continue;
        }

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
                productor_id: user.id,
                variedad: c.detallesObjetivo?.variedad || 'Bourbon Rosado',
                proceso: c.detallesObjetivo?.proceso || 'Lavado',
                estado_actual: c.estado,
                peso_cereza: c.pesos.cereza || 0,
                peso_pergamino: c.pesos.pergamino || 0,
                peso_verde: c.pesos.verde || 0,
                calificacion_final: c.calificacion || 0,
                metadata: {
                    productor: c.productor,
                    cosecha: c.cosecha,
                    finca: c.finca,
                    parcelas: c.parcelas,
                    pesos: {
                        objetivo: c.pesos.objetivo || 0
                    },
                    fase: c.fase,
                    modalidad: c.modalidad,
                    macroperfil: c.macroperfil,
                    clientes: c.clientes,
                    factorRendimiento: c.factorRendimiento
                }
            });
        if (error) {
            console.error('Error saving harvest/lote:', error);
        }
    }
}

