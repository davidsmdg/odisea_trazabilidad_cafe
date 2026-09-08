import { getLotesMaster, addLote as storeAddLote, updateLote as storeUpdateLote, getValidationStageForLote as storeGetValidationStage, updateValidationStage as storeUpdateValidationStage } from '../app/utils/loteStore';
import { LOTES_MARKET_DEFAULT } from '../data/lotes.mock';
import type { LoteUnificado } from '../types/lote';

export async function getLotes(): Promise<LoteUnificado[]> {
    await new Promise(r => setTimeout(r, 500));
    return getLotesMaster();
}

export async function getLotePorId(id: string): Promise<LoteUnificado | undefined> {
    await new Promise(r => setTimeout(r, 450));
    return getLotesMaster().find(l => l.id === id);
}

export async function addLote(lote: LoteUnificado): Promise<void> {
    await new Promise(r => setTimeout(r, 600));
    storeAddLote(lote);
}

export async function updateLote(id: string, updates: Partial<LoteUnificado>): Promise<void> {
    await new Promise(r => setTimeout(r, 400));
    storeUpdateLote(id, updates);
}

export async function getLotesMarket(): Promise<any[]> {
    await new Promise(r => setTimeout(r, 500));
    return LOTES_MARKET_DEFAULT;
}

export async function getValidationStageForLote(loteId: string): Promise<any> {
    await new Promise(r => setTimeout(r, 300));
    return storeGetValidationStage(loteId);
}

export async function updateValidationStage(loteId: string, nextStage: any, responsable: string, motivo?: string): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
    storeUpdateValidationStage(loteId, nextStage, responsable, motivo);
}

export async function isLotePublicado(loteId: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 350));
    return storeGetValidationStage(loteId).stage === 'Publicado';
}
