import { EXPERIMENTOS_MOCK } from '../data/experimentos.mock';
import type { Experimento } from '../types/experimento';

const KEY = 'experimentos_cafe';

export async function getExperimentos(): Promise<Experimento[]> {
    await new Promise(r => setTimeout(r, 600));
    const saved = localStorage.getItem(KEY);
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem(KEY, JSON.stringify(EXPERIMENTOS_MOCK));
    return EXPERIMENTOS_MOCK;
}

export async function saveExperimentos(experimentos: Experimento[]): Promise<void> {
    await new Promise(r => setTimeout(r, 450));
    localStorage.setItem(KEY, JSON.stringify(experimentos));
}
