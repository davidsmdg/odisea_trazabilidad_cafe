import type { LoteUnificado, MovimientoHistorial, ValidationStage, ValidationLogEntry, RegistroValidacionStage } from '../../types/lote';
import { SEED_LOTES } from '../../data/lotes.mock';

export type { LoteUnificado, MovimientoHistorial, ValidationStage, ValidationLogEntry, RegistroValidacionStage };

export function getLotesMaster(): LoteUnificado[] {
    const raw = localStorage.getItem('odisea_lotes_master');
    if (!raw) {
        localStorage.setItem('odisea_lotes_master', JSON.stringify(SEED_LOTES));
        return SEED_LOTES;
    }
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : SEED_LOTES;
    } catch (e) {
        return SEED_LOTES;
    }
}

export function saveLotesMaster(lotes: LoteUnificado[]) {
    localStorage.setItem('odisea_lotes_master', JSON.stringify(lotes));
}

// ValidationStage / ValidationLogEntry / RegistroValidacionStage viven en types/lote.ts
// (se importan y re-exportan arriba).

export function getValidationStages(): RegistroValidacionStage[] {
    const raw = localStorage.getItem('odisea_validaciones_stage_gate');
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

export function getValidationStageForLote(loteId: string): RegistroValidacionStage {
    const stages = getValidationStages();
    const found = stages.find(s => s.loteId === loteId);
    if (found) {
        return found;
    }
    
    // Por compatibilidad de demo, lotes semilla se autodeclaran como Publicados. Lotes nuevos como Capturados.
    const isSeed = loteId.startsWith('LOT-HUILA') || loteId.startsWith('LOT-ANT') || loteId.startsWith('LOT-NAR') || loteId.startsWith('LOT-0') || loteId.startsWith('lc');
    const defaultStage: ValidationStage = isSeed ? 'Publicado' : 'Capturado';
    
    return {
        loteId,
        stage: defaultStage,
        historial: [
            {
                timestamp: '2026-07-02 08:00',
                estadoNuevo: defaultStage,
                responsable: 'Sistema Ceres (Autodetección)',
                motivo: 'Estado asignado por compatibilidad inicial.'
            }
        ]
    };
}

export function updateValidationStage(loteId: string, nextStage: ValidationStage, responsable: string, motivo?: string) {
    const stages = getValidationStages();
    const existingIndex = stages.findIndex(s => s.loteId === loteId);
    const timestamp = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    
    if (existingIndex >= 0) {
        const existing = stages[existingIndex];
        const logEntry: ValidationLogEntry = {
            timestamp,
            estadoAnterior: existing.stage,
            estadoNuevo: nextStage,
            responsable,
            motivo
        };
        existing.stage = nextStage;
        existing.historial.push(logEntry);
        stages[existingIndex] = existing;
    } else {
        const logEntry: ValidationLogEntry = {
            timestamp,
            estadoNuevo: nextStage,
            responsable,
            motivo
        };
        stages.push({
            loteId,
            stage: nextStage,
            historial: [logEntry]
        });
    }
    localStorage.setItem('odisea_validaciones_stage_gate', JSON.stringify(stages));
}

export function isLotePublicado(loteId: string): boolean {
    return getValidationStageForLote(loteId).stage === 'Publicado';
}

export function addLote(lote: LoteUnificado) {
    const current = getLotesMaster();
    current.unshift(lote);
    saveLotesMaster(current);
    updateValidationStage(lote.id, 'Capturado', 'Sistema (Creación del Lote)', 'Lote registrado desde campo por el productor.');
}

export function updateLote(loteId: string, updates: Partial<LoteUnificado>) {
    const current = getLotesMaster();
    const updated = current.map(l => l.id === loteId ? { ...l, ...updates } : l);
    saveLotesMaster(updated);
}
