/** Formato de plata simple para el productor: $2.500.000 (COP, sin decimales). */
export function formatoPlata(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(Math.round(valor || 0));
}

/** Solo el número con separador de miles: 2.500.000 */
export function formatoNumero(valor: number): string {
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Math.round(valor || 0));
}

/** Fecha corta amigable: "5 ago" */
export function fechaCorta(iso: string): string {
    return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(new Date(iso));
}

/** Etiqueta de día para agrupar: "Hoy", "Ayer" o "lunes 5 de agosto". */
export function etiquetaDia(iso: string): string {
    const f = new Date(iso);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);
    const mismoDia = (a: Date, b: Date) =>
        a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    if (mismoDia(f, hoy)) return 'Hoy';
    if (mismoDia(f, ayer)) return 'Ayer';
    return new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(f);
}

/** "agosto 2026" */
export function mesLabel(d: Date): string {
    return new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(d);
}
