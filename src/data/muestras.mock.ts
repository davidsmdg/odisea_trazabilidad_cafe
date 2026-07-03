export interface MuestraMockItem {
    id: string;
    bache: string;
    productor: string;
    finca: string;
    municipio: string;
    variedad: string;
    proceso: string;
    fechaIngreso: string;
}

export const MUESTRAS_MOCK: MuestraMockItem[] = [
    {
        id: 'LOT-HUILA-084',
        bache: 'Bache #3',
        productor: 'María González',
        finca: 'Finca La Esperanza',
        municipio: 'San Agustín',
        variedad: 'Caturra / Castillo',
        proceso: 'Lavado',
        fechaIngreso: 'Hoy, 08:30 AM',
    },
    {
        id: 'LOT-ANT-112',
        bache: 'Bache #1',
        productor: 'Carlos Martínez',
        finca: 'El Mirador',
        municipio: 'Acevedo',
        variedad: 'Geisha',
        proceso: 'Natural',
        fechaIngreso: 'Hace 3 horas',
    },
    {
        id: 'LOT-NAR-225',
        bache: 'Bache #1',
        productor: 'Jorge Torres',
        finca: 'Santa Helena',
        municipio: 'Garzón',
        variedad: 'Bourbon Rosado',
        proceso: 'Honey',
        fechaIngreso: 'Ayer',
    },
];
