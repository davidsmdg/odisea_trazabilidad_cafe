import { INITIAL_FINCAS } from '../data/fincas.mock';
import type { Finca } from '../types/finca';

const KEY = 'odisea_fincas';

export async function getFincas(): Promise<Finca[]> {
    await new Promise(r => setTimeout(r, 600));
    const saved = localStorage.getItem(KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {}
    }
    localStorage.setItem(KEY, JSON.stringify(INITIAL_FINCAS));
    return INITIAL_FINCAS;
}

export async function saveFincas(fincas: Finca[]): Promise<void> {
    await new Promise(r => setTimeout(r, 450));
    localStorage.setItem(KEY, JSON.stringify(fincas));
}
