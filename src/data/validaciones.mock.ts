import type { ValidacionItem } from '../types/validation';

export const VALIDACIONES_MOCK: ValidacionItem[] = [
    {
        id: '1',
        loteId: 'LOT-HUILA-084',
        agricultor: 'María González',
        finca: 'Finca La Esperanza',
        vereda: 'Vereda La Estrella',
        municipio: 'San Agustín, Huila',
        estado: 'Pendiente',
        fecha: 'Hoy, 2:30 PM',
        tipo: 'Validación Técnica EUDR',
        alistamiento: 'Apto'
    },
    {
        id: '2',
        loteId: 'LOT-ANT-112',
        agricultor: 'Carlos Martínez',
        finca: 'Lote El Naranjo',
        vereda: 'Vereda El Playón',
        municipio: 'Acevedo, Huila',
        estado: 'Pendiente',
        fecha: 'Ayer',
        tipo: 'Actualización de Perfil',
        alistamiento: 'Subsanable'
    },
    {
        id: '3',
        loteId: 'LOT-NAR-225',
        agricultor: 'Elena Ruiz',
        finca: 'Finca Santa Helena',
        vereda: 'Vereda El Diviso',
        municipio: 'Pitalito, Huila',
        estado: 'Revisado',
        fecha: 'Hace 3 días',
        tipo: 'Validación Técnica EUDR',
        alistamiento: 'No Apto'
    }
];
