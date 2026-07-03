import type { LinkLider, LinkCatador, LinkTostador } from '../types/link';

export const INITIAL_LIDERES_LINKS: LinkLider[] = [
    { id: '1', productor: 'María González', lider: 'Carlos Augusto Restrepo' },
    { id: '2', productor: 'Carlos Martínez', lider: 'Dora Estela Muñoz' }
];

export const INITIAL_CATADORES_LINKS: LinkCatador[] = [
    { id: '1', productor: 'María González', catador: 'Pedro Nel Giraldo' },
    { id: '2', productor: 'Elena Ruiz', catador: 'Sofía Andrade' }
];

export const INITIAL_TOSTADORES_LINKS: LinkTostador[] = [
    { id: '1', loteId: 'LOT-HUILA-084', tostador: 'Blue Bottle Coffee (USA)' },
    { id: '2', loteId: 'LOT-ANT-112', tostador: 'Workshop Coffee (UK)' }
];

export const MOCK_PRODUCTORES = ['María González', 'Carlos Martínez', 'Jorge Torres', 'Elena Ruiz'];
export const MOCK_LIDERES = ['Carlos Augusto Restrepo', 'Dora Estela Muñoz'];
export const MOCK_CATADORES = ['Pedro Nel Giraldo', 'Sofía Andrade'];
export const MOCK_TOSTADORES = ['Blue Bottle Coffee (USA)', 'Workshop Coffee (UK)', 'The Barn (Alemania)'];
