import { supabase } from '../app/utils/supabaseClient';
import type { Finca } from '../types/finca';

export async function getFincas(): Promise<Finca[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('fincas')
        .select('*')
        .eq('productor_id', user.id);

    if (error) {
        console.error('Error fetching fincas:', error);
        return [];
    }

    return (data || []).map(f => ({
        id: f.id,
        nombre: f.nombre,
        departamento: f.departamento,
        municipio: f.municipio,
        cedulaCafetera: f.cedula_cafetera || '',
        tipoTenencia: f.tipo_tenencia || '',
        esComunidadEtnica: f.es_comunidad_etnica || false,
        lotesDeCafe: f.lotes_de_cafe || []
    }));
}

export async function saveFincas(fincas: Finca[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const f of fincas) {
        const { error } = await supabase
            .from('fincas')
            .upsert({
                id: f.id,
                productor_id: user.id,
                nombre: f.nombre,
                departamento: f.departamento,
                municipio: f.municipio,
                cedula_cafetera: f.cedulaCafetera,
                tipo_tenencia: f.tipoTenencia,
                es_comunidad_etnica: f.esComunidadEtnica,
                lotes_de_cafe: f.lotesDeCafe,
                hectareas: f.lotesDeCafe.reduce((acc, l) => acc + (Number(l.poligonoAreaCalculada) || 0), 0) || 1.0,
                latitud: f.lotesDeCafe[0] ? parseFloat(f.lotesDeCafe[0].coordenadaCentral.split(',')[0]) || 0.0 : 0.0,
                longitud: f.lotesDeCafe[0] ? parseFloat(f.lotesDeCafe[0].coordenadaCentral.split(',')[1]) || 0.0 : 0.0,
            });
        if (error) {
            console.error('Error saving finca:', error);
        }
    }
}

