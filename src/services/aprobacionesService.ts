import { HISTORIAL_MOCK } from '../data/historialAprobaciones.mock';
import type { RegistroAuditoria } from '../types/auditoria';

export async function getHistorialAprobaciones(): Promise<RegistroAuditoria[]> {
    await new Promise(r => setTimeout(r, 450));
    return HISTORIAL_MOCK;
}
