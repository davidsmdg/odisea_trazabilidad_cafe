import { INITIAL_COSECHAS } from '../data/cosechas.mock';
import type { Cosecha } from '../types/cosecha';

const KEY = 'lotes_produccion';

export async function getCosechas(): Promise<Cosecha[]> {
    await new Promise(r => setTimeout(r, 550));
    const saved = localStorage.getItem(KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {}
    }
    localStorage.setItem(KEY, JSON.stringify(INITIAL_COSECHAS));
    return INITIAL_COSECHAS;
}

export async function saveCosechas(cosechas: Cosecha[]): Promise<void> {
    await new Promise(r => setTimeout(r, 450));
    localStorage.setItem(KEY, JSON.stringify(cosechas));
}
