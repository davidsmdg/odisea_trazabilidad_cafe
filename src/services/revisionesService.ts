import { REVISIONES_MOCK, RevisionMockItem } from '../data/revisiones.mock';

export async function getRevisiones(): Promise<RevisionMockItem[]> {
    await new Promise(r => setTimeout(r, 500));
    return REVISIONES_MOCK;
}
