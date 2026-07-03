// Motor de Validación Geoespacial para Odisea Trace

export interface PoligonoGeospatial {
    coordenadas: [number, number][]; // [[lat, lng], [lat, lng], ...]
    metodo: 'GPS' | 'Dibujo Manual' | 'Importado';
    fechaCaptura: string;
    precisionEstimada: string;
    areaCalculada: number; // en Hectáreas
}

// Cajas delimitadoras de plausibilidad por departamento colombiano (Latitud, Longitud)
export const REGION_BOUNDS: Record<string, { latMin: number, latMax: number, lngMin: number, lngMax: number }> = {
    'Huila': { latMin: 1.5, latMax: 3.5, lngMin: -76.8, lngMax: -74.0 },
    'Antioquia': { latMin: 5.5, latMax: 8.9, lngMin: -77.0, lngMax: -73.8 },
    'Cauca': { latMin: 0.9, latMax: 3.2, lngMin: -78.5, lngMax: -75.7 },
    'Tolima': { latMin: 2.8, latMax: 5.3, lngMin: -76.2, lngMax: -74.3 },
    'Caldas': { latMin: 4.8, latMax: 5.8, lngMin: -76.0, lngMax: -74.8 }
};

// Umbrales máximos configurables de área por defecto (Hectáreas)
export const REGION_MAX_AREA_DEFAULT: Record<string, number> = {
    'Antioquia': 8.0,
    'Huila': 12.0,
    'Cauca': 5.0,
    'Tolima': 10.0,
    'Caldas': 7.0
};

/**
 * Valida si todos los puntos de un polígono se encuentran dentro de los límites declarados del departamento.
 */
export function validateBounds(departamento: string, coordinates: [number, number][]): boolean {
    const bounds = REGION_BOUNDS[departamento];
    if (!bounds || coordinates.length === 0) return true; // Si no hay bounds configurados, pasa

    return coordinates.every(([lat, lng]) => {
        return lat >= bounds.latMin && lat <= bounds.latMax &&
               lng >= bounds.lngMin && lng <= bounds.lngMax;
    });
}

/**
 * Calcula el área en Hectáreas del polígono a partir de la fórmula de Shoelace (Gauss)
 * y una proyección de escala local (1 lat = 111,000m, 1 lng = 110,800m).
 */
export function calculatePolygonArea(coordinates: [number, number][]): number {
    if (coordinates.length < 3) return 0;

    let area = 0;
    const numPoints = coordinates.length;

    for (let i = 0; i < numPoints; i++) {
        const j = (i + 1) % numPoints;
        
        // Conversión a metros aproximada para Colombia (latitud ~3.5 N)
        const x1 = coordinates[i][1] * 110800; // longitud a metros
        const y1 = coordinates[i][0] * 111000; // latitud a metros
        const x2 = coordinates[j][1] * 110800;
        const y2 = coordinates[j][0] * 111000;

        area += (x1 * y2) - (x2 * y1);
    }

    const areaM2 = Math.abs(area) / 2;
    const areaHa = areaM2 / 10000; // Convertir m² a hectáreas
    
    // Retornar a 2 decimales
    return Math.round(areaHa * 100) / 100;
}

/**
 * Algoritmo Ray-Casting para comprobar si un punto [lat, lng] está dentro de un polígono.
 */
export function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            
        if (intersect) inside = !inside;
    }
    
    return inside;
}

/**
 * Compara dos polígonos para detectar solapamiento (intersección o contención de puntos).
 */
export function checkPolygonOverlap(polyA: [number, number][], polyB: [number, number][]): boolean {
    if (polyA.length === 0 || polyB.length === 0) return false;

    // 1. Check del Bounding Box primero (optimización rápida)
    const latsA = polyA.map(p => p[0]);
    const lngsA = polyA.map(p => p[1]);
    const latsB = polyB.map(p => p[0]);
    const lngsB = polyB.map(p => p[1]);

    const minLatA = Math.min(...latsA), maxLatA = Math.max(...latsA);
    const minLngA = Math.min(...lngsA), maxLngA = Math.max(...lngsA);
    const minLatB = Math.min(...latsB), maxLatB = Math.max(...latsB);
    const minLngB = Math.min(...lngsB), maxLngB = Math.max(...lngsB);

    const boundingBoxOverlap = !(
        minLatA > maxLatB ||
        maxLatA < minLatB ||
        minLngA > maxLngB ||
        maxLngA < minLngB
    );

    if (!boundingBoxOverlap) return false;

    // 2. Si las cajas colisionan, verificamos si algún vértice de A está dentro de B
    for (const p of polyA) {
        if (isPointInPolygon(p, polyB)) return true;
    }

    // 3. O viceversa, si algún vértice de B está dentro de A
    for (const p of polyB) {
        if (isPointInPolygon(p, polyA)) return true;
    }

    return false;
}
