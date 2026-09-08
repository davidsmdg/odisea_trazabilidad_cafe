import type { Experimento } from '../types/experimento';

export const EXPERIMENTOS_MOCK: Experimento[] = [
    {
        id: 'EXP-001',
        lote: 'Lote El Mirador - Bourbon',
        fechaRegistro: '2026-03-10',
        tipoProceso: 'Fermentación Anaeróbica',
        humedad: '11.5%',
        temperatura: '18°C',
        notes: 'Fermentación en cereza controlada en tanques plásticos.',
        notas: 'Fermentación en cereza controlada en tanques plásticos.',
        estado: 'Evaluado',
        resultadoFinal: 'Replicar Maestra',
        puntajeObjetivo: 87.5,
        puntajeObtenido: 88.0,
        insumos: 'Levadura frutal (Saccharomyces cerevisiae)',
        pasosReplicacion: [
            'Selección estricta de cereza muy madura (mín. 20° Brix)',
            'Reposo inicial en cereza por 24 horas a la sombra',
            'Fermentación anaeróbica sellada por 72h con temperatura a 18°C',
            'Secado lento en marquesina con polisombra por 15 días'
        ]
    },
    {
        id: 'EXP-002',
        lote: 'Lote San Juan - Caturra',
        fechaRegistro: '2026-02-28',
        tipoProceso: 'Honey Amarillo',
        humedad: '12%',
        temperatura: '20°C',
        notes: 'Despulpe sin agua para conservar mucílago intacto.',
        notas: 'Despulpe sin agua para conservar mucílago intacto.',
        estado: 'En Proceso',
        puntajeObjetivo: 85.0,
        insumos: 'Ninguno (Proceso natural de la finca)',
        pasosReplicacion: [
            'Despulpe en seco el mismo día de la recolección',
            'Tendido inmediato en camas africanas elevadas'
        ]
    }
];
