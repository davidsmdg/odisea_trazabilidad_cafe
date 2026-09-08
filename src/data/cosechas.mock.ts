import type { Cosecha } from '../types/cosecha';

export const INITIAL_COSECHAS: Cosecha[] = [
    {
        id: 'lc1',
        codigo: 'LOTE-042',
        productor: 'María González',
        cosecha: 'Oct-Nov 2024',
        finca: 'Finca La Esperanza',
        parcelas: ['Lote El Mirador'],
        estado: 'Verde (Trillado)',
        pesos: { cereza: 1200, pergamino: 250, verde: 180, objetivo: 1500 },
        fase: 3,
        modalidad: 'objetivo',
        detallesObjetivo: { variedad: 'Bourbon Rosado', proceso: 'Lavado' },
        calificacion: 86.5,
        macroperfil: 'Frutal',
        clientes: [],
        factorRendimiento: 91.5
    },
    {
        id: 'lc2',
        codigo: 'LOTE-043',
        productor: 'María González',
        cosecha: 'Nov 2024',
        finca: 'Finca La Esperanza',
        parcelas: ['Lote Central'],
        estado: 'Pergamino (Seco)',
        pesos: { cereza: 800, pergamino: 165, verde: 0 },
        fase: 2,
        modalidad: 'diario',
        calificacion: 0,
        macroperfil: '',
        clientes: [],
        factorRendimiento: null
    },
    {
        id: 'lc3',
        codigo: 'LOTE-101',
        productor: 'María González',
        cosecha: 'Dic 2024',
        finca: 'Finca Santa Helena',
        parcelas: ['Lote Las Piedras'],
        estado: 'Cereza (Fresco)',
        pesos: { cereza: 450, pergamino: 0, verde: 0, objetivo: 500 },
        fase: 1,
        modalidad: 'objetivo',
        detallesObjetivo: { variedad: 'Geisha', proceso: 'Natural' },
        calificacion: 0,
        macroperfil: '',
        clientes: [],
        factorRendimiento: null
    }
];
