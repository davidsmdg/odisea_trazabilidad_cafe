export interface Experimento {
    id: string;
    lote: string;
    fechaRegistro: string;
    tipoProceso: string;
    humedad: string;
    temperatura: string;
    notas: string;
    estado: 'En Proceso' | 'Evaluado' | 'Descartado';
    resultadoFinal?: 'Replicar Maestra' | 'Descartar';
    puntajeObjetivo?: number;
    puntajeObtenido?: number;
    insumos?: string;
    pasosReplicacion: string[];
}
