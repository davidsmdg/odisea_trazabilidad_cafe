export interface EventoTrazabilidad {
    id: string;
    etapa: 'recoleccion' | 'fermentacion' | 'secado' | 'trilla' | 'catacion' | 'venta';
    titulo: string;
    descripcion: string;
    fecha: string;
    detalles?: string;
}

export interface Cosecha {
    id: string;
    codigo: string;
    productor: string;
    cosecha: string;
    finca: string;
    parcelas: string[];
    estado: string;
    pesos: {
        cereza: number;
        pergamino: number;
        verde: number;
        objetivo?: number;
    };
    fase: number; // 0: meta, 1: cereza, 2: seco, 3: verde
    modalidad: 'diario' | 'objetivo';
    detallesObjetivo?: {
        variedad: string;
        proceso: string;
    };
    calificacion: number;
    macroperfil: string;
    clientes: any[];
    factorRendimiento: number | null;
    fechasFases?: {
        cereza?: string;
        secadoInicio?: string;
        pergaminoListo?: string;
        verde?: string;
    };
    bitacora?: EventoTrazabilidad[];
}
