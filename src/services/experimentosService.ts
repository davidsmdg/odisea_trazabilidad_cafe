import { EXPERIMENTOS_MOCK } from '../data/experimentos.mock';
import type { Experimento } from '../types/experimento';
import { supabase } from '../app/utils/supabaseClient';

const KEY_PREFIX = 'experimentos_cafe_';

export async function getExperimentos(): Promise<Experimento[]> {
    await new Promise(r => setTimeout(r, 600));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const key = `${KEY_PREFIX}${user.email}`;
    const saved = localStorage.getItem(key);
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }

    if (user.email === 'maria@finca.co') {
        localStorage.setItem(key, JSON.stringify(EXPERIMENTOS_MOCK));
        return EXPERIMENTOS_MOCK;
    }

    return [];
}

export async function saveExperimentos(experimentos: Experimento[]): Promise<void> {
    await new Promise(r => setTimeout(r, 450));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const key = `${KEY_PREFIX}${user.email}`;
    localStorage.setItem(key, JSON.stringify(experimentos));
}
