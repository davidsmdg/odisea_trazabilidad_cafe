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
    fase: number;
    modalidad: 'diario' | 'objetivo';
    detallesObjetivo?: {
        variedad: string;
        proceso: string;
    };
    calificacion: number;
    macroperfil: string;
    clientes: any[];
    factorRendimiento: number | null;
}
