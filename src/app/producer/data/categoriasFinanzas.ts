import type { CategoriaFinanciera } from '../../../types/finanzas';

/** Categorías que aparecen por defecto. La productora puede archivarlas o crear las suyas. */
export const CATEGORIAS_DEFAULT: CategoriaFinanciera[] = [
    // ── Café · gastos ──
    { id: 'cf-g-jornales', libro: 'cafe', tipo: 'gasto', label: 'Jornales y recolección', icono: 'jornales', esPropia: false },
    { id: 'cf-g-abonos', libro: 'cafe', tipo: 'gasto', label: 'Abonos y fertilizantes', icono: 'abonos', esPropia: false },
    { id: 'cf-g-control', libro: 'cafe', tipo: 'gasto', label: 'Fungicidas y control', icono: 'control', esPropia: false },
    { id: 'cf-g-transporte', libro: 'cafe', tipo: 'gasto', label: 'Fletes y transporte', icono: 'transporte', esPropia: false },
    { id: 'cf-g-herramientas', libro: 'cafe', tipo: 'gasto', label: 'Herramientas y arreglos', icono: 'herramientas', esPropia: false },
    { id: 'cf-g-beneficio', libro: 'cafe', tipo: 'gasto', label: 'Beneficio (agua, luz, despulpado)', icono: 'beneficio', esPropia: false },
    { id: 'cf-g-otro', libro: 'cafe', tipo: 'gasto', label: 'Otro gasto del café', icono: 'otro', esPropia: false },

    // ── Café · ingresos ──
    { id: 'cf-i-pergamino', libro: 'cafe', tipo: 'ingreso', label: 'Venta de café pergamino', icono: 'cafe', esPropia: false },
    { id: 'cf-i-cereza', libro: 'cafe', tipo: 'ingreso', label: 'Venta de café cereza', icono: 'cafe', esPropia: false },
    { id: 'cf-i-pasilla', libro: 'cafe', tipo: 'ingreso', label: 'Venta de pasilla', icono: 'cafe', esPropia: false },
    { id: 'cf-i-otro', libro: 'cafe', tipo: 'ingreso', label: 'Otro ingreso del café', icono: 'otro', esPropia: false },

    // ── Hogar · gastos ──
    { id: 'hg-g-mercado', libro: 'hogar', tipo: 'gasto', label: 'Mercado y comida', icono: 'mercado', esPropia: false },
    { id: 'hg-g-servicios', libro: 'hogar', tipo: 'gasto', label: 'Servicios (luz, agua, gas)', icono: 'servicios', esPropia: false },
    { id: 'hg-g-educacion', libro: 'hogar', tipo: 'gasto', label: 'Educación', icono: 'educacion', esPropia: false },
    { id: 'hg-g-salud', libro: 'hogar', tipo: 'gasto', label: 'Salud y medicinas', icono: 'salud', esPropia: false },
    { id: 'hg-g-transporte', libro: 'hogar', tipo: 'gasto', label: 'Transporte de la familia', icono: 'transporteFam', esPropia: false },
    { id: 'hg-g-ropa', libro: 'hogar', tipo: 'gasto', label: 'Ropa y calzado', icono: 'ropa', esPropia: false },
    { id: 'hg-g-deudas', libro: 'hogar', tipo: 'gasto', label: 'Deudas y préstamos', icono: 'deudas', esPropia: false },
    { id: 'hg-g-otro', libro: 'hogar', tipo: 'gasto', label: 'Otro gasto de la casa', icono: 'casa', esPropia: false },

    // ── Hogar · ingresos ──
    { id: 'hg-i-jornal', libro: 'hogar', tipo: 'ingreso', label: 'Trabajo en otra finca', icono: 'jornal', esPropia: false },
    { id: 'hg-i-negocio', libro: 'hogar', tipo: 'ingreso', label: 'Otro cultivo o negocio', icono: 'negocio', esPropia: false },
    { id: 'hg-i-remesa', libro: 'hogar', tipo: 'ingreso', label: 'Ayuda o remesa familiar', icono: 'remesa', esPropia: false },
    { id: 'hg-i-otro', libro: 'hogar', tipo: 'ingreso', label: 'Otro ingreso de la casa', icono: 'otro', esPropia: false },
];

export const CAT_SALDO_INICIAL = 'saldo-inicial';
