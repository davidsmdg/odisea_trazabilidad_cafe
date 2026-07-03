import { getAnomalyConfig as storeGetConfig, updateAnomalyConfig as storeUpdateConfig, getAnomalies as storeGetAnomalies, resolveAnomaly as storeResolveAnomaly, detectAnomaly as storeDetectAnomaly, detectHarvestDateAnomaly as storeDetectHarvestDateAnomaly } from '../app/utils/anomalyStore';
import type { AnomalyRecord, AnomalyConfig } from '../types/anomaly';

export async function getAnomalyConfig(): Promise<AnomalyConfig> {
    await new Promise(r => setTimeout(r, 300));
    return storeGetConfig();
}

export async function updateAnomalyConfig(config: AnomalyConfig): Promise<void> {
    await new Promise(r => setTimeout(r, 400));
    storeUpdateConfig(config);
}

export async function getAnomalies(): Promise<AnomalyRecord[]> {
    await new Promise(r => setTimeout(r, 500));
    return storeGetAnomalies();
}

export async function resolveAnomaly(anomalyId: string, estado: AnomalyRecord['estadoResolucion'], comentario: string): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
    storeResolveAnomaly(anomalyId, estado, comentario);
}

export async function detectAnomaly(loteId: string, tipoDato: AnomalyRecord['tipoDato'], valor: number, finca: string, productor: string): Promise<AnomalyRecord | null> {
    await new Promise(r => setTimeout(r, 400));
    return storeDetectAnomaly(loteId, tipoDato, valor, finca, productor);
}

export async function detectHarvestDateAnomaly(loteId: string, fechaStr: string, finca: string, productor: string): Promise<AnomalyRecord | null> {
    await new Promise(r => setTimeout(r, 400));
    return storeDetectHarvestDateAnomaly(loteId, fechaStr, finca, productor);
}
