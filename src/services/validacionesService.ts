import { VALIDACIONES_MOCK } from '../data/validaciones.mock';
import type { ValidacionItem } from '../types/validation';

const KEY = 'lider_validaciones';

export async function getValidaciones(): Promise<ValidacionItem[]> {
    await new Promise(r => setTimeout(r, 500));
    const saved = localStorage.getItem(KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {}
    }
    localStorage.setItem(KEY, JSON.stringify(VALIDACIONES_MOCK));
    return VALIDACIONES_MOCK;
}

export async function saveValidaciones(validaciones: ValidacionItem[]): Promise<void> {
    await new Promise(r => setTimeout(r, 450));
    localStorage.setItem(KEY, JSON.stringify(validaciones));
}
