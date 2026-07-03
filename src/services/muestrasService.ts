import { MUESTRAS_MOCK, MuestraMockItem } from '../data/muestras.mock';

export async function getMuestras(): Promise<MuestraMockItem[]> {
    await new Promise(r => setTimeout(r, 450));
    return MUESTRAS_MOCK;
}
