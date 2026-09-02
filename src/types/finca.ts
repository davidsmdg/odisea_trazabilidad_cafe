export interface UbicacionGPS {
    lat: number;
    lng: number;
    precisionMetros: number;
    fechaISO: string;
    metodo: 'GPS' | 'Manual';
}

export interface LoteCafe {
    id: string;
    nombre: string;
    area: string;
    variedades: string[];
    coordenadaCentral: string; // Un solo punto (texto "Lat: x, Long: y") — compat con vistas Odisea
    estadoEUDR: 'Verificado' | 'En revisión' | 'Pendiente';

    // Ubicación estructurada capturada por el productor (GPS del celular, funciona offline)
    ubicacion?: UbicacionGPS;

    // Datos agronómicos que le importan al productor (opcionales)
    numeroArboles?: number;
    edadCultivoAnios?: number;
    altitudMsnm?: number;
    tipoSombrio?: 'Sol' | 'Semisombra' | 'Sombra';
    fuenteAgua?: 'Nacimiento propio' | 'Quebrada' | 'Acueducto veredal' | 'Aljibe' | 'Agua lluvia';

    // Linderos EUDR (se capturan aparte, más adelante)
    poligonoCoordenadas?: [number, number][];
    poligonoMetodo?: 'GPS' | 'Dibujo Manual' | 'Importado';
    poligonoFechaCaptura?: string;
    poligonoPrecision?: string;
    poligonoAreaCalculada?: number;
    overlapWarning?: string;
    areaWarning?: string;
}

/** Alias con el nombre que usa el productor. */
export type Parcela = LoteCafe;

export interface Finca {
    id: string;
    nombre: string;
    departamento: string;
    municipio: string;
    /** Área total aproximada de la finca en hectáreas (lo mínimo que pide el registro). */
    areaAproximada?: string;
    lotesDeCafe: LoteCafe[];

    // Datos para exportación (EUDR) — opcionales, se completan cuando se pueda
    cedulaCafetera: string;
    tipoTenencia: string;
    esComunidadEtnica: boolean;
    docTenenciaNombre?: string;
}

export interface PoligonoGeospatial {
    coordenadas: [number, number][]; // [[lat, lng], [lat, lng], ...]
    metodo: 'GPS' | 'Dibujo Manual' | 'Importado';
    fechaCaptura: string;
    precisionEstimada: string;
    areaCalculada: number; // en Hectáreas
}
