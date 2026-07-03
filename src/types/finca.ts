export interface LoteCafe {
    id: string;
    nombre: string;
    area: string;
    variedades: string[];
    coordenadaCentral: string; // Un solo punto
    estadoEUDR: 'Verificado' | 'En revisión' | 'Pendiente';
    poligonoCoordenadas?: [number, number][];
    poligonoMetodo?: 'GPS' | 'Dibujo Manual' | 'Importado';
    poligonoFechaCaptura?: string;
    poligonoPrecision?: string;
    poligonoAreaCalculada?: number;
    overlapWarning?: string;
    areaWarning?: string;
}

export interface Finca {
    id: string;
    nombre: string;
    departamento: string;
    municipio: string;
    cedulaCafetera: string;
    tipoTenencia: string;
    esComunidadEtnica: boolean;
    lotesDeCafe: LoteCafe[];
}

export interface PoligonoGeospatial {
    coordenadas: [number, number][]; // [[lat, lng], [lat, lng], ...]
    metodo: 'GPS' | 'Dibujo Manual' | 'Importado';
    fechaCaptura: string;
    precisionEstimada: string;
    areaCalculada: number; // en Hectáreas
}
