import type {
    MovimientoFinanciero,
    CategoriaFinanciera,
    PeriodoCosecha,
    Libro,
    TipoMovimiento,
} from '../../../types/finanzas';
import { CATEGORIAS_DEFAULT } from '../data/categoriasFinanzas';

const K_MOV = 'odisea_finanzas_movimientos';
const K_CAT = 'odisea_finanzas_categorias_custom'; // { custom: CategoriaFinanciera[], archivadas: string[] }
const K_PER = 'odisea_finanzas_periodos';

function leer<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
    } catch {
        return fallback;
    }
}

function escribir(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ───────── Periodos ───────── */

export function getPeriodos(): PeriodoCosecha[] {
    let periodos = leer<PeriodoCosecha[]>(K_PER, []);
    if (periodos.length === 0) {
        const anio = new Date().getFullYear();
        periodos = [
            {
                id: `per-${anio}`,
                nombre: `Cosecha principal ${anio}`,
                anio,
                activo: true,
                creadoISO: new Date().toISOString(),
            },
        ];
        escribir(K_PER, periodos);
    }
    return periodos;
}

export function getPeriodoActivo(): PeriodoCosecha {
    const periodos = getPeriodos();
    return periodos.find((p) => p.activo) || periodos[0];
}

export function guardarPeriodos(periodos: PeriodoCosecha[]) {
    escribir(K_PER, periodos);
}

export function renombrarPeriodo(id: string, nombre: string) {
    guardarPeriodos(getPeriodos().map((p) => (p.id === id ? { ...p, nombre } : p)));
}

/* ───────── Categorías ───────── */

interface CatStore {
    custom: CategoriaFinanciera[];
    archivadas: string[];
}

function getCatStore(): CatStore {
    return leer<CatStore>(K_CAT, { custom: [], archivadas: [] });
}

export function getCategorias(): CategoriaFinanciera[] {
    const { custom, archivadas } = getCatStore();
    const defaults = CATEGORIAS_DEFAULT.filter((c) => !archivadas.includes(c.id));
    return [...defaults, ...custom.filter((c) => !c.archivada)];
}

export function getCategoriasDe(libro: Libro, tipo: TipoMovimiento): CategoriaFinanciera[] {
    return getCategorias().filter((c) => c.libro === libro && c.tipo === tipo);
}

export function addCategoria(data: Omit<CategoriaFinanciera, 'id' | 'esPropia'>): CategoriaFinanciera {
    const store = getCatStore();
    const nueva: CategoriaFinanciera = { ...data, id: `cat-${Date.now()}`, esPropia: true };
    escribir(K_CAT, { ...store, custom: [...store.custom, nueva] });
    return nueva;
}

export function archivarCategoria(id: string) {
    const store = getCatStore();
    const esDefault = CATEGORIAS_DEFAULT.some((c) => c.id === id);
    if (esDefault) {
        escribir(K_CAT, { ...store, archivadas: [...new Set([...store.archivadas, id])] });
    } else {
        escribir(K_CAT, {
            ...store,
            custom: store.custom.map((c) => (c.id === id ? { ...c, archivada: true } : c)),
        });
    }
}

/* ───────── Movimientos ───────── */

export function getMovimientos(): MovimientoFinanciero[] {
    return leer<MovimientoFinanciero[]>(K_MOV, []);
}

function guardarMovimientos(movs: MovimientoFinanciero[]) {
    escribir(K_MOV, movs);
}

export function addMovimiento(data: Omit<MovimientoFinanciero, 'id'>): MovimientoFinanciero {
    const nuevo: MovimientoFinanciero = { ...data, id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    guardarMovimientos([nuevo, ...getMovimientos()]);
    return nuevo;
}

export function updateMovimiento(id: string, cambios: Partial<MovimientoFinanciero>) {
    guardarMovimientos(getMovimientos().map((m) => (m.id === id ? { ...m, ...cambios } : m)));
}

export function deleteMovimiento(id: string) {
    guardarMovimientos(getMovimientos().filter((m) => m.id !== id));
}

/* ───────── Saldo inicial (semilla del arranque) ───────── */

export interface SemillaSaldo {
    gastoCafe?: number;
    ingresoCafe?: number;
    gastoHogar?: number;
    ingresoHogar?: number;
}

export function sembrarSaldoInicial(periodoId: string, s: SemillaSaldo, productorNombre?: string) {
    const fecha = new Date().toISOString();
    const base = {
        periodoId,
        fechaISO: fecha,
        origen: 'saldo-inicial' as const,
        icono: 'ahorro',
        nota: 'Aproximado al empezar a llevar las cuentas',
        productorNombre,
    };
    const nuevos: Omit<MovimientoFinanciero, 'id'>[] = [];
    const push = (libro: Libro, tipo: TipoMovimiento, monto?: number) => {
        if (monto && monto > 0)
            nuevos.push({
                ...base,
                libro,
                tipo,
                monto,
                categoriaId: 'saldo-inicial',
                categoriaLabel: 'Saldo al empezar',
            });
    };
    push('cafe', 'gasto', s.gastoCafe);
    push('cafe', 'ingreso', s.ingresoCafe);
    push('hogar', 'gasto', s.gastoHogar);
    push('hogar', 'ingreso', s.ingresoHogar);
    if (nuevos.length === 0) return;
    const conId = nuevos.map((n, i) => ({ ...n, id: `mov-seed-${Date.now()}-${i}` }));
    guardarMovimientos([...conId, ...getMovimientos()]);
}

export function tieneMovimientos(): boolean {
    return getMovimientos().length > 0;
}
