/** Libro contable: el café (actividad productiva) o la casa (hogar/familia). */
export type Libro = 'cafe' | 'hogar';

export type TipoMovimiento = 'ingreso' | 'gasto';

export interface CategoriaFinanciera {
    id: string;
    libro: Libro;
    tipo: TipoMovimiento;
    label: string;
    /** Clave del ícono en iconosFinanzas. */
    icono: string;
    /** true si la creó la productora (aparece por defecto de ahí en adelante). */
    esPropia: boolean;
    archivada?: boolean;
}

export interface MovimientoFinanciero {
    id: string;
    libro: Libro;
    tipo: TipoMovimiento;
    categoriaId: string;
    /** Copia del nombre de la categoría al momento de anotar (por si luego se renombra). */
    categoriaLabel: string;
    icono: string;
    monto: number; // COP
    fechaISO: string;
    nota?: string;
    periodoId: string;
    /** Solo café: código de la cosecha/lote asociada, opcional. */
    cosechaCodigo?: string;
    /** Imputación del movimiento: toda la finca, una parcela específica o una cosecha/lote */
    asociacionTipo?: 'finca' | 'parcela' | 'cosecha';
    /** Nombre de la parcela o código de la cosecha si aplica */
    asociacionValor?: string;
    /** Nombre del productor dueño del movimiento (para la vista de Odisea admin). */
    productorNombre?: string;
    origen: 'manual' | 'saldo-inicial';
}

export interface PeriodoCosecha {
    id: string;
    nombre: string; // "Cosecha principal 2026"
    anio: number;
    activo: boolean;
    creadoISO: string;
}

export interface ResumenLibro {
    ingresos: number;
    gastos: number;
    saldo: number;
}
