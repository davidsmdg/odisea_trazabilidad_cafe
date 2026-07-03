export interface MovimientoHistorial {
    id: string;
    estado: 'En Finca' | 'En Bodega' | 'Listo Exportación' | 'En Tránsito' | 'Entregado';
    ubicacion: string;
    fecha: string;
    descripcion: string;
    operador: string;
}

export interface LoteUnificado {
    id: string;
    productor: string;
    finca: string;
    municipio: string;
    variedad: string;
    proceso: string;
    estado: 'En Finca' | 'En Bodega' | 'Listo Exportación' | 'En Tránsito' | 'Entregado';
    almacenamiento: string;
    fecha: string;
    calificacion?: number;
    macroperfil?: string;
    tostadorAsignado?: string;
    tostadorPais?: string;
    liderAsignado?: string;
    catadorAsignado?: string;
    ofrecidoPorProductor?: boolean;
    aprobadoComercializacion?: boolean;
    regionesDisponibles?: ('USA' | 'EU')[];
    historialMovimientos?: MovimientoHistorial[];
    estadoJAC?: 'Apto' | 'Subsanable' | 'No Apto' | 'Pendiente';
    coordenadas?: string;
    areaPoligono?: string;
    riesgoDeforestacion?: string;
    verificadoEUDR?: boolean;
    pruebasAlistamiento?: {
        humedad: number;
        actividadAgua: number;
        pasilla: number;
        empaque: string;
        fecha: string;
    };
    pesos: {
        cereza: number;
        pergamino: number;
        verde: number;
    };
}

const SEED_LOTES: LoteUnificado[] = [
    {
        id: 'LOT-HUILA-084',
        productor: 'María González',
        finca: 'Finca La Esperanza',
        municipio: 'San Agustín, Huila',
        variedad: 'Bourbon Rosado',
        proceso: 'Lavado',
        estado: 'En Bodega',
        almacenamiento: 'Estiba A-12',
        fecha: '02 Mar 2026',
        calificacion: 86.25,
        macroperfil: 'Chocolate y Caramelo',
        liderAsignado: 'Carlos Augusto Restrepo',
        catadorAsignado: 'Pedro Nel Giraldo',
        tostadorAsignado: 'Blue Bottle Coffee (USA)',
        tostadorPais: 'USA',
        ofrecidoPorProductor: true,
        aprobadoComercializacion: true,
        regionesDisponibles: ['USA', 'EU'],
        estadoJAC: 'Apto',
        coordenadas: '1.8843° N, 76.2931° W',
        areaPoligono: '12.04 Hectáreas (Polígono Cerrado)',
        riesgoDeforestacion: '0.0% (Riesgo Nulo)',
        verificadoEUDR: true,
        historialMovimientos: [
            { id: 'mov-1', estado: 'En Finca', ubicacion: 'Finca La Esperanza', fecha: '2026-03-02', descripcion: 'Recolección manual selectiva y beneficio húmedo por María González.', operador: 'María González' },
            { id: 'mov-2', estado: 'En Bodega', ubicacion: 'Bodega Central Acopio', fecha: '2026-03-15', descripcion: 'Trillado y almacenamiento en Estiba A-12.', operador: 'Logística Odisea' }
        ],
        pesos: { cereza: 1200, pergamino: 250, verde: 180 }
    },
    {
        id: 'LOT-ANT-112',
        productor: 'Carlos Martínez',
        finca: 'Lote El Naranjo',
        municipio: 'Acevedo, Huila',
        variedad: 'Castillo',
        proceso: 'Natural',
        estado: 'En Finca',
        almacenamiento: 'Pendiente Recibo',
        fecha: '01 Mar 2026',
        calificacion: 84.50,
        macroperfil: 'Frutos Rojos',
        liderAsignado: 'Dora Estela Muñoz',
        catadorAsignado: 'Sofía Andrade',
        tostadorAsignado: 'Workshop Coffee (UK)',
        tostadorPais: 'UK',
        ofrecidoPorProductor: true,
        aprobadoComercializacion: false, // Esperando aprobación en el Inbox
        regionesDisponibles: ['USA'],
        estadoJAC: 'Subsanable',
        coordenadas: '5.6421° N, 75.6120° W',
        areaPoligono: '6.50 Hectáreas (Polígono Cerrado)',
        riesgoDeforestacion: '0.0% (Riesgo Nulo)',
        verificadoEUDR: false,
        historialMovimientos: [
            { id: 'mov-3', estado: 'En Finca', ubicacion: 'Finca El Naranjo', fecha: '2026-03-01', descripcion: 'Cosecha natural y secado en patios.', operador: 'Carlos Martínez' }
        ],
        pesos: { cereza: 900, pergamino: 180, verde: 120 }
    },
    {
        id: 'LOT-NAR-225',
        productor: 'Elena Ruiz',
        finca: 'Finca Santa Helena',
        municipio: 'Pitalito, Huila',
        variedad: 'Geisha',
        proceso: 'Lavado',
        estado: 'Listo Exportación',
        almacenamiento: 'Silo Secado 2',
        fecha: '28 Feb 2026',
        calificacion: 89.00,
        macroperfil: 'Floral y Cítrico',
        liderAsignado: 'Dora Estela Muñoz',
        catadorAsignado: 'Sofía Andrade',
        tostadorAsignado: 'Blue Bottle Coffee (USA)',
        tostadorPais: 'USA',
        ofrecidoPorProductor: true,
        aprobadoComercializacion: true,
        regionesDisponibles: ['USA', 'EU'],
        estadoJAC: 'No Apto',
        coordenadas: '1.4590° N, 77.2780° W',
        areaPoligono: '8.12 Hectáreas (Polígono Cerrado)',
        riesgoDeforestacion: '0.0% (Riesgo Nulo)',
        verificadoEUDR: true,
        historialMovimientos: [
            { id: 'mov-4', estado: 'En Finca', ubicacion: 'Finca Santa Helena', fecha: '2026-02-28', descripcion: 'Cosecha selectiva varietal Geisha.', operador: 'Elena Ruiz' },
            { id: 'mov-5', estado: 'En Bodega', ubicacion: 'Bodega Central Acopio', fecha: '2026-03-10', descripcion: 'Pruebas físicas y sensoriales SCA aprobadas.', operador: 'Sofía Andrade' },
            { id: 'mov-6', estado: 'Listo Exportación', ubicacion: 'Puerto de Cartagena', fecha: '2026-03-25', descripcion: 'Expedición de Bill of Lading y carga lista para zarpar.', operador: 'Exportación Odisea' }
        ],
        pesos: { cereza: 1500, pergamino: 320, verde: 240 }
    }
];

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

export type ValidationStage = 'Capturado' | 'En validación' | 'Validado' | 'Rechazado' | 'Publicado';

export interface ValidationLogEntry {
    timestamp: string;
    estadoAnterior?: ValidationStage;
    estadoNuevo: ValidationStage;
    responsable: string;
    motivo?: string;
}

export interface RegistroValidacionStage {
    loteId: string;
    stage: ValidationStage;
    historial: ValidationLogEntry[];
}

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
