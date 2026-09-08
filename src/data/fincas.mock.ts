import type { Finca } from '../types/finca';

export const INITIAL_FINCAS: Finca[] = [
    {
        id: '1',
        nombre: 'Finca La Esperanza',
        departamento: 'Huila',
        municipio: 'Palestina',
        cedulaCafetera: 'CC-108345',
        tipoTenencia: 'Propiedad Titulada',
        esComunidadEtnica: false,
        lotesDeCafe: [
            {
                id: 'p1',
                nombre: 'Lote El Mirador',
                area: '4.92',
                variedades: ['Caturra'],
                coordenadaCentral: 'Lat: 1.884, Long: -76.297',
                estadoEUDR: 'Verificado',
                poligonoCoordenadas: [
                    [1.884, -76.297],
                    [1.886, -76.297],
                    [1.886, -76.295],
                    [1.884, -76.295]
                ],
                poligonoMetodo: 'GPS',
                poligonoFechaCaptura: '2026-05-12',
                poligonoPrecision: '+/- 2.1 metros',
                poligonoAreaCalculada: 4.92
            },
            {
                id: 'p2',
                nombre: 'Lote La Quebrada',
                area: '1.8',
                variedades: ['Castillo'],
                coordenadaCentral: '',
                estadoEUDR: 'Pendiente'
            }
        ]
    }
];
