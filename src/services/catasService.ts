import { supabase } from '../app/utils/supabaseClient';

export interface RegistroCata {
    id: string;
    lote_id: string;
    catador_id: string;
    acidez: number;
    cuerpo: number;
    dulzor: number;
    balance: number;
    limpieza: number;
    fragancia?: number;
    sabor?: number;
    puntaje_total: number;
    comentarios?: string;
    desglose_notas?: string[];
    fecha_cata: string;
}

export async function getHistorialCatas(catadorId: string): Promise<RegistroCata[]> {
    const { data, error } = await supabase
        .from('catas')
        .select('*')
        .eq('catador_id', catadorId)
        .order('fecha_cata', { ascending: false });

    if (error) {
        console.error('Error fetching historial catas:', error);
        return [];
    }
    return data || [];
}

export async function addCata(cata: Omit<RegistroCata, 'id' | 'fecha_cata'>): Promise<void> {
    const { error } = await supabase
        .from('catas')
        .insert({
            ...cata,
            id: crypto.randomUUID(),
            fecha_cata: new Date().toISOString()
        });

    if (error) {
        console.error('Error inserting cata:', error);
        throw error;
    }
}
