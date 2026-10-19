import { supabase } from '../app/utils/supabaseClient';
import type { MovimientoFinanciero, CategoriaFinanciera, PeriodoCosecha } from '../types/finanzas';
import { CATEGORIAS_DEFAULT } from '../app/producer/data/categoriasFinanzas';
import {
    getMovimientos as storeGetMovimientos,
    addMovimiento as storeAdd,
    updateMovimiento as storeUpdate,
    deleteMovimiento as storeDelete,
    getCategorias as storeGetCategorias,
    addCategoria as storeAddCategoria,
    archivarCategoria as storeArchivarCategoria,
    getPeriodos as storeGetPeriodos,
    getPeriodoActivo as storeGetPeriodoActivo,
    renombrarPeriodo as storeRenombrarPeriodo,
    sembrarSaldoInicial as storeSembrar,
    tieneMovimientos as storeTieneMovimientos,
    type SemillaSaldo,
} from '../app/producer/utils/finanzasStore';

export async function getPeriodos(): Promise<PeriodoCosecha[]> {
    try {
        const { data, error } = await supabase.from('periodos_cosecha').select('*');
        if (!error && data && data.length > 0) {
            return data.map((p) => ({
                id: p.id,
                nombre: p.nombre,
                anio: p.anio || new Date().getFullYear(),
                activo: p.activo,
                creadoISO: p.creado_iso || p.creado_en,
            }));
        }
    } catch (e) {
        console.warn('Error fetching periodos from Supabase:', e);
    }
    return storeGetPeriodos();
}

export async function getPeriodoActivo(): Promise<PeriodoCosecha> {
    const list = await getPeriodos();
    const activo = list.find((p) => p.activo) || list[0];
    if (activo) return activo;

    const anio = new Date().getFullYear();
    const nuevo: PeriodoCosecha = {
        id: `per-${anio}`,
        nombre: `Cosecha principal ${anio}`,
        anio,
        activo: true,
        creadoISO: new Date().toISOString(),
    };
    try {
        await supabase.from('periodos_cosecha').upsert({
            id: nuevo.id,
            nombre: nuevo.nombre,
            anio: nuevo.anio,
            activo: nuevo.activo,
            creado_iso: nuevo.creadoISO,
        });
    } catch {}
    return nuevo;
}

export async function renombrarPeriodo(id: string, nombre: string): Promise<void> {
    storeRenombrarPeriodo(id, nombre);
    try {
        await supabase.from('periodos_cosecha').update({ nombre }).eq('id', id);
    } catch (e) {
        console.error('Error updating periodo in Supabase:', e);
    }
}

export async function getCategorias(): Promise<CategoriaFinanciera[]> {
    try {
        const { data, error } = await supabase.from('categorias_financieras').select('*');
        if (!error && data && data.length > 0) {
            return data.map((c) => ({
                id: c.id,
                libro: (c.libro as any) || 'cafe',
                tipo: c.tipo as any,
                label: c.label || c.nombre,
                icono: c.icono,
                esPropia: c.es_propia,
                archivada: c.archivada,
            }));
        }
    } catch (e) {
        console.warn('Error fetching categorias from Supabase:', e);
    }
    return storeGetCategorias();
}

export async function addCategoria(data: Omit<CategoriaFinanciera, 'id' | 'esPropia'>): Promise<CategoriaFinanciera> {
    const local = storeAddCategoria(data);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('categorias_financieras').insert({
            id: local.id,
            nombre: local.label,
            label: local.label,
            tipo: local.tipo,
            libro: local.libro,
            icono: local.icono,
            color: '#5f705f',
            es_propia: true,
            archivada: false,
            productor_id: user?.id,
        });
    } catch (e) {
        console.error('Error adding categoria to Supabase:', e);
    }
    return local;
}

export async function archivarCategoria(id: string): Promise<void> {
    storeArchivarCategoria(id);
    try {
        await supabase.from('categorias_financieras').update({ archivada: true }).eq('id', id);
    } catch (e) {
        console.error('Error archiving categoria in Supabase:', e);
    }
}

export async function getMovimientos(): Promise<MovimientoFinanciero[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        let query = supabase.from('movimientos_financieros').select('*');
        if (user) {
            query = query.or(`productor_id.eq.${user.id},productor_id.is.null`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
            const soloFinanzas = data.filter((m) => 
                !m.id.startsWith('cfg-cod-') && 
                !m.id.startsWith('evt-tel-') && 
                !m.id.startsWith('evt-canje-') &&
                m.categoria_id !== 'sistema-codigos' &&
                m.categoria_id !== 'evento-telemetria' &&
                m.categoria_id !== 'evento-canje'
            );
            return soloFinanzas.map((m) => ({
                id: m.id,
                libro: (m.libro as any) || 'cafe',
                tipo: m.tipo as any,
                categoriaId: m.categoria_id,
                categoriaLabel: m.categoria_label || m.categoria_id,
                icono: m.icono || 'Receipt',
                monto: Number(m.monto) || 0,
                fechaISO: m.fecha_iso || m.fecha || new Date().toISOString(),
                nota: m.nota || m.descripcion,
                periodoId: m.periodo_id,
                cosechaCodigo: m.cosecha_codigo,
                productorNombre: m.productor_nombre,
                origen: (m.origen as any) || 'manual',
            }));
        }
    } catch (e) {
        console.warn('Error fetching movimientos from Supabase:', e);
    }
    return storeGetMovimientos();
}

export async function addMovimiento(data: Omit<MovimientoFinanciero, 'id'>): Promise<MovimientoFinanciero> {
    const local = storeAdd(data);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('movimientos_financieros').insert({
            id: local.id,
            periodo_id: local.periodoId,
            tipo: local.tipo,
            categoria_id: local.categoriaId,
            categoria_label: local.categoriaLabel,
            monto: local.monto,
            fecha: local.fechaISO.split('T')[0],
            fecha_iso: local.fechaISO,
            descripcion: local.nota,
            nota: local.nota,
            cosecha_id: local.cosechaCodigo,
            cosecha_codigo: local.cosechaCodigo,
            libro: local.libro,
            icono: local.icono,
            productor_id: user?.id,
            productor_nombre: local.productorNombre || user?.user_metadata?.nombre,
            origen: local.origen,
        });
    } catch (e) {
        console.error('Error adding movimiento to Supabase:', e);
    }
    return local;
}

export async function updateMovimiento(id: string, cambios: Partial<MovimientoFinanciero>): Promise<void> {
    storeUpdate(id, cambios);
    try {
        const dbUpdates: Record<string, any> = {};
        if (cambios.monto !== undefined) dbUpdates.monto = cambios.monto;
        if (cambios.nota !== undefined) {
            dbUpdates.nota = cambios.nota;
            dbUpdates.descripcion = cambios.nota;
        }
        if (cambios.fechaISO !== undefined) {
            dbUpdates.fecha_iso = cambios.fechaISO;
            dbUpdates.fecha = cambios.fechaISO.split('T')[0];
        }
        if (cambios.categoriaId !== undefined) dbUpdates.categoria_id = cambios.categoriaId;
        if (cambios.categoriaLabel !== undefined) dbUpdates.categoria_label = cambios.categoriaLabel;
        if (cambios.icono !== undefined) dbUpdates.icono = cambios.icono;
        if (cambios.libro !== undefined) dbUpdates.libro = cambios.libro;
        if (cambios.tipo !== undefined) dbUpdates.tipo = cambios.tipo;

        if (Object.keys(dbUpdates).length > 0) {
            await supabase.from('movimientos_financieros').update(dbUpdates).eq('id', id);
        }
    } catch (e) {
        console.error('Error updating movimiento in Supabase:', e);
    }
}

export async function deleteMovimiento(id: string): Promise<void> {
    storeDelete(id);
    try {
        await supabase.from('movimientos_financieros').delete().eq('id', id);
    } catch (e) {
        console.error('Error deleting movimiento from Supabase:', e);
    }
}

export async function sembrarSaldoInicial(periodoId: string, semilla: SemillaSaldo, productorNombre?: string): Promise<void> {
    const hoy = new Date().toISOString();

    if (semilla.ingresoCafe && semilla.ingresoCafe > 0) {
        await addMovimiento({
            libro: 'cafe',
            tipo: 'ingreso',
            categoriaId: 'ing-cafe-venta',
            categoriaLabel: 'Venta de café',
            icono: 'TrendingUp',
            monto: semilla.ingresoCafe,
            fechaISO: hoy,
            nota: 'Saldo inicial aproximado',
            periodoId,
            productorNombre,
            origen: 'saldo-inicial',
        });
    }
    if (semilla.gastoCafe && semilla.gastoCafe > 0) {
        await addMovimiento({
            libro: 'cafe',
            tipo: 'gasto',
            categoriaId: 'gas-cafe-insumos',
            categoriaLabel: 'Insumos y fertilizantes',
            icono: 'Sprout',
            monto: semilla.gastoCafe,
            fechaISO: hoy,
            nota: 'Saldo inicial aproximado',
            periodoId,
            productorNombre,
            origen: 'saldo-inicial',
        });
    }
    if (semilla.gastoHogar && semilla.gastoHogar > 0) {
        await addMovimiento({
            libro: 'hogar',
            tipo: 'gasto',
            categoriaId: 'gas-hog-mercado',
            categoriaLabel: 'Mercado y comida',
            icono: 'ShoppingBag',
            monto: semilla.gastoHogar,
            fechaISO: hoy,
            nota: 'Saldo inicial aproximado',
            periodoId,
            productorNombre,
            origen: 'saldo-inicial',
        });
    }
}

export async function tieneMovimientos(): Promise<boolean> {
    const list = await getMovimientos();
    return list.length > 0;
}

export type { SemillaSaldo };
