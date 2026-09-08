/**
 * Precio de referencia diario de la carga de café (mock, por departamento).
 * Reemplaza al panel de precio + simulador de sobreprecio del dashboard anterior.
 * Cuando haya fuente real (FNC / bolsa), se cambia solo este archivo.
 */
export interface PrecioReferencia {
    departamento: string;
    precioCarga: number; // COP por carga de 125 kg de pergamino seco
    variacionPct: number;
    factorRendimiento: number;
    actualizado: string;
}

export const PRECIOS_REFERENCIA: Record<string, PrecioReferencia> = {
    Antioquia: { departamento: 'Antioquia', precioCarga: 2185000, variacionPct: 2.4, factorRendimiento: 89.5, actualizado: 'Hoy' },
    Huila: { departamento: 'Huila', precioCarga: 2140000, variacionPct: 1.8, factorRendimiento: 92.0, actualizado: 'Hoy' },
    Cauca: { departamento: 'Cauca', precioCarga: 2155000, variacionPct: -0.6, factorRendimiento: 90.0, actualizado: 'Hoy' },
    Tolima: { departamento: 'Tolima', precioCarga: 2130000, variacionPct: 0.9, factorRendimiento: 90.5, actualizado: 'Hoy' },
    Caldas: { departamento: 'Caldas', precioCarga: 2170000, variacionPct: 1.2, factorRendimiento: 91.0, actualizado: 'Hoy' },
    Nariño: { departamento: 'Nariño', precioCarga: 2195000, variacionPct: 1.5, factorRendimiento: 93.0, actualizado: 'Hoy' },
    Quindío: { departamento: 'Quindío', precioCarga: 2168000, variacionPct: 0.7, factorRendimiento: 90.8, actualizado: 'Hoy' },
    Risaralda: { departamento: 'Risaralda', precioCarga: 2172000, variacionPct: 1.0, factorRendimiento: 90.6, actualizado: 'Hoy' },
    Santander: { departamento: 'Santander', precioCarga: 2150000, variacionPct: 0.4, factorRendimiento: 89.0, actualizado: 'Hoy' },
    'Norte de Santander': { departamento: 'Norte de Santander', precioCarga: 2145000, variacionPct: 0.3, factorRendimiento: 88.5, actualizado: 'Hoy' },
};

export const DEPARTAMENTO_POR_DEFECTO = 'Huila';

export function getPrecioReferencia(departamento?: string): PrecioReferencia {
    return (departamento && PRECIOS_REFERENCIA[departamento]) || PRECIOS_REFERENCIA[DEPARTAMENTO_POR_DEFECTO];
}
