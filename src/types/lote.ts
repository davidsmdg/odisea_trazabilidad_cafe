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
    precioBaseKgUSD?: number;
    tarifaOdisea?: number;
    porcentajeLogistica?: number;
    precioProductorCOP?: number;
    costoTransporteNacionalCOP?: number;
    tarifaOdiseaUSD?: number;
    costoLogisticaExportImportUSD?: number;
    tasaCambioUSD_COP?: number;
    tasaCambioEUR_USD?: number;
    monedaVisualizacion?: 'COP' | 'USD' | 'EUR';
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
