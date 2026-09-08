export interface RevisionMockItem {
    id: string;
    finca: string;
    municipio: string;
    fechaSolicitud: string;
    estado: 'Pendiente' | 'Alerta EUDR' | 'En Proceso';
    prioridad: 'Alta' | 'Media' | 'Baja';
    tipo: string;
}

export const REVISIONES_MOCK: RevisionMockItem[] = [
    {
        id: 'FL-2024-001A',
        finca: 'Finca La Secreta',
        municipio: 'Pitalito',
        fechaSolicitud: '02 Mar 2024',
        estado: 'Pendiente',
        prioridad: 'Alta',
        tipo: 'Predio Nuevo (EUDR)',
    },
    {
        id: 'FL-2024-002B',
        finca: 'Mirador del Valle',
        municipio: 'Acevedo',
        fechaSolicitud: '01 Mar 2024',
        estado: 'Alerta EUDR',
        prioridad: 'Alta',
        tipo: 'Recertificación Anual',
    },
    {
        id: 'FL-2024-005C',
        finca: 'Lote Las Rocas',
        municipio: 'Garzón',
        fechaSolicitud: '28 Feb 2024',
        estado: 'En Proceso',
        prioridad: 'Media',
        tipo: 'Ampliación Lote',
    }
];
