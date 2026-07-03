import { EXPORTS_MOCK } from '../data/exportaciones.mock';
import type { ExportLog } from '../types/export';

export async function getExportaciones(): Promise<ExportLog[]> {
    await new Promise(r => setTimeout(r, 500));
    return EXPORTS_MOCK;
}
