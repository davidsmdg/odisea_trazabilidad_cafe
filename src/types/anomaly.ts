export interface AnomalyRecord {
    id: string;
    loteId: string;
    tipoDato: 'peso_cereza' | 'peso_pergamino' | 'factor_rendimiento' | 'fecha_cosecha';
    valorIngresado: string | number;
    valorEsperado: string | number;
    desviacionCalculada: string;
    timestamp: string;
    estadoResolucion: 'Pendiente' | 'Confirmado Válido' | 'Confirmado Error';
    comentarioResolucion?: string;
    finca: string;
    productor: string;
}

export interface AnomalyConfig {
    umbralDesviacionPorcentaje: number;
    umbralDesviacionEstandar: number;
}
