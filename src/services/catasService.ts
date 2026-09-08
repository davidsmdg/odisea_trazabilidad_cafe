import { HISTORIAL_MOCK, HistorialCataMockItem } from '../data/historialCatas.mock';

export async function getHistorialCatas(): Promise<HistorialCataMockItem[]> {
    await new Promise(r => setTimeout(r, 500));
    return HISTORIAL_MOCK;
}
