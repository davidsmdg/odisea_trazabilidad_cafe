import type { ExportLog } from '../types/export';

export const EXPORTS_MOCK: ExportLog[] = [
    {
        id: 'EXP-042',
        loteId: 'LOT-HUILA-084',
        tostador: 'Blue Bottle Coffee (USA)',
        destino: 'Puerto de Oakland, California',
        precioFob: 'USD 2.85 / lb',
        billOfLading: 'MSC-HUI-8842',
        fechaDespacho: '22 May 2026',
        estadoTránsito: 'En Tránsito'
    },
    {
        id: 'EXP-045',
        loteId: 'LOT-ANT-112',
        tostador: 'Workshop Coffee (UK)',
        destino: 'Puerto de Londres, Inglaterra',
        precioFob: 'USD 3.10 / lb',
        billOfLading: 'OOL-ANT-9912',
        fechaDespacho: '15 May 2026',
        estadoTránsito: 'Entregado'
    },
    {
        id: 'EXP-048',
        loteId: 'LOT-NAR-225',
        tostador: 'The Barn (Alemania)',
        destino: 'Puerto de Hamburgo, Alemania',
        precioFob: 'USD 2.95 / lb',
        billOfLading: 'HLC-NAR-7721',
        fechaDespacho: 'Hace 2 días',
        estadoTránsito: 'En Puerto'
    }
];
