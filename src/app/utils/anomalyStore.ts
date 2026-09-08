import type { AnomalyRecord, AnomalyConfig } from '../../types/anomaly';

export type { AnomalyRecord, AnomalyConfig };

const CONFIG_KEY = 'odisea_config_anomalias';
const LOG_KEY = 'odisea_anomalias';

const DEFAULT_CONFIG: AnomalyConfig = {
    umbralDesviacionPorcentaje: 50,
    umbralDesviacionEstandar: 2.0
};

export function getAnomalyConfig(): AnomalyConfig {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return DEFAULT_CONFIG;
    }
}

export function updateAnomalyConfig(config: AnomalyConfig): void {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getAnomalies(): AnomalyRecord[] {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

export function addAnomaly(anomaly: Omit<AnomalyRecord, 'id' | 'timestamp' | 'estadoResolucion'>): AnomalyRecord {
    const list = getAnomalies();
    const newRecord: AnomalyRecord = {
        ...anomaly,
        id: 'ANOM-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: new Date().toLocaleDateString('es-CO') + ' ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        estadoResolucion: 'Pendiente'
    };
    list.unshift(newRecord);
    localStorage.setItem(LOG_KEY, JSON.stringify(list));
    return newRecord;
}

export function resolveAnomaly(anomalyId: string, estado: AnomalyRecord['estadoResolucion'], comentario: string): void {
    const list = getAnomalies();
    const updated = list.map(item => {
        if (item.id === anomalyId) {
            return {
                ...item,
                estadoResolucion: estado,
                comentarioResolucion: comentario
            };
        }
        return item;
    });
    localStorage.setItem(LOG_KEY, JSON.stringify(updated));
}

// Valores de referencia globales en caso de no contar con suficientes datos históricos
const REGIONAL_DEFAULTS: Record<string, number> = {
    'peso_cereza': 600, // Kg de cereza promedio por cosecha
    'peso_pergamino': 110, // Kg pergamino seco
    'factor_rendimiento': 94 // factor estándar
};

/**
 * Evalúa si una nueva entrada representa una anomalía frente al historial de la finca.
 * Si se detecta una anomalía, la registra en el log y retorna el registro.
 */
export function detectAnomaly(
    loteId: string,
    tipoDato: AnomalyRecord['tipoDato'],
    valor: number,
    finca: string,
    productor: string
): AnomalyRecord | null {
    const config = getAnomalyConfig();
    
    // 1. Obtener valores históricos del master
    const masterRaw = localStorage.getItem('odisea_lotes_master');
    let master: any[] = [];
    if (masterRaw) {
        try { master = JSON.parse(masterRaw); } catch (e) {}
    }

    // Filtrar lotes de la misma finca
    const matchFinca = master.filter(l => l.finca && l.finca.toLowerCase() === finca.toLowerCase());
    
    const historicalVals: number[] = [];
    matchFinca.forEach(l => {
        if (tipoDato === 'peso_cereza' && l.pesos?.cereza && Number(l.pesos.cereza) > 0) {
            historicalVals.push(Number(l.pesos.cereza));
        } else if (tipoDato === 'peso_pergamino' && l.pesos?.pergamino && Number(l.pesos.pergamino) > 0) {
            historicalVals.push(Number(l.pesos.pergamino));
        } else if (tipoDato === 'factor_rendimiento' && l.factorRendimiento && Number(l.factorRendimiento) > 0) {
            historicalVals.push(Number(l.factorRendimiento));
        }
    });

    let isAnomaly = false;
    let deviationDesc = '';
    let expectedValue = 0;

    if (historicalVals.length >= 3) {
        // Análisis estadístico robusto: Media y Desviación Estándar
        const mean = historicalVals.reduce((a, b) => a + b, 0) / historicalVals.length;
        const variance = historicalVals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / historicalVals.length;
        const stdDev = Math.sqrt(variance);
        expectedValue = Math.round(mean * 100) / 100;

        const pctDiff = (Math.abs(valor - mean) / mean) * 100;

        if (stdDev > 0) {
            const devSigma = Math.abs(valor - mean) / stdDev;
            if (devSigma > config.umbralDesviacionEstandar) {
                isAnomaly = true;
                deviationDesc = `±${devSigma.toFixed(1)} Desviaciones Estándar (Media: ${expectedValue})`;
            }
        } else if (pctDiff > config.umbralDesviacionPorcentaje) {
            isAnomaly = true;
            deviationDesc = `±${pctDiff.toFixed(0)}% de variación vs media histórica (Media: ${expectedValue})`;
        }
    } else {
        // En caso de pocos datos históricos, comparar contra el promedio regional de referencia
        const defaultRef = REGIONAL_DEFAULTS[tipoDato] || 100;
        expectedValue = defaultRef;
        const pctDiff = (Math.abs(valor - defaultRef) / defaultRef) * 100;

        if (pctDiff > config.umbralDesviacionPorcentaje) {
            isAnomaly = true;
            deviationDesc = `±${pctDiff.toFixed(0)}% vs valor esperado regional (${defaultRef})`;
        }
    }

    if (isAnomaly) {
        return addAnomaly({
            loteId,
            tipoDato,
            valorIngresado: valor,
            valorEsperado: expectedValue,
            desviacionCalculada: deviationDesc,
            finca,
            productor
        });
    }

    return null;
}

/**
 * Valida si una fecha de cosecha seleccionada está fuera de las temporadas de cosecha plausibles en Colombia
 */
export function detectHarvestDateAnomaly(
    loteId: string,
    fechaStr: string,
    finca: string,
    productor: string
): AnomalyRecord | null {
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return null;

    const mes = fecha.getMonth(); // 0 = Ene, 11 = Dic
    
    // Temporadas principales de cosecha en Colombia:
    // Cosecha Principal (Mitaca/Principal): Marzo-Junio (meses 2 a 5) y Septiembre-Diciembre (meses 8 a 11)
    // Meses atípicos de muy baja producción (Enero, Febrero, Julio, Agosto)
    const mesesAnomalos = [0, 1, 6, 7]; // Ene, Feb, Jul, Ago
    
    if (mesesAnomalos.includes(mes)) {
        const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return addAnomaly({
            loteId,
            tipoDato: 'fecha_cosecha',
            valorIngresado: nombresMeses[mes],
            valorEsperado: 'Temporada Cosecha (Mar-Jun o Sep-Dic)',
            desviacionCalculada: `Cosecha registrada en mes de baja producción estacional (${nombresMeses[mes]})`,
            finca,
            productor
        });
    }

    return null;
}
