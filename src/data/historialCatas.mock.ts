export interface HistorialCataMockItem {
    id: string;
    productor: string;
    bache: string;
    fecha: string;
    puntaje: number;
    nivel: string;
    perfil: {
        attribute: string;
        value: number;
    }[];
}

export const HISTORIAL_MOCK: HistorialCataMockItem[] = [
    {
        id: 'LOT-HUILA-084',
        productor: 'María González',
        bache: 'Bache #3',
        fecha: '09 Mar 2024',
        puntaje: 86.5,
        nivel: 'Especialidad',
        perfil: [
            { attribute: 'Acidez', value: 8.0 },
            { attribute: 'Cuerpo', value: 7.5 },
            { attribute: 'Dulzor', value: 8.5 },
            { attribute: 'Balance', value: 8.0 },
            { attribute: 'Limpieza', value: 8.5 }
        ]
    },
    {
        id: 'LOT-HUILA-084',
        productor: 'María González',
        bache: 'Bache #2',
        fecha: '15 Feb 2024',
        puntaje: 86.0,
        nivel: 'Especialidad',
        perfil: [
            { attribute: 'Acidez', value: 7.5 },
            { attribute: 'Cuerpo', value: 8.0 },
            { attribute: 'Dulzor', value: 8.0 },
            { attribute: 'Balance', value: 8.0 },
            { attribute: 'Limpieza', value: 8.5 }
        ]
    },
    {
        id: 'LOT-ANT-112',
        productor: 'Carlos Martínez',
        bache: 'Bache #1',
        fecha: '05 Mar 2024',
        puntaje: 83.0,
        nivel: 'Premium',
        perfil: [
            { attribute: 'Acidez', value: 7.5 },
            { attribute: 'Cuerpo', value: 7.5 },
            { attribute: 'Dulzor', value: 7.5 },
            { attribute: 'Balance', value: 7.0 },
            { attribute: 'Limpieza', value: 8.0 }
        ]
    },
    {
        id: 'LOT-NAR-225',
        productor: 'Jorge Torres',
        bache: 'Bache #1',
        fecha: '01 Mar 2024',
        puntaje: 88.2,
        nivel: 'Especialidad',
        perfil: [
            { attribute: 'Acidez', value: 8.5 },
            { attribute: 'Cuerpo', value: 8.0 },
            { attribute: 'Dulzor', value: 8.5 },
            { attribute: 'Balance', value: 8.5 },
            { attribute: 'Limpieza', value: 9.0 }
        ]
    }
];
