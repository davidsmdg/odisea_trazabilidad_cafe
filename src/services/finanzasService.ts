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
import type { MovimientoFinanciero, CategoriaFinanciera } from '../types/finanzas';

const d = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getMovimientos(): Promise<MovimientoFinanciero[]> {
    await d(350);
    return storeGetMovimientos();
}

export async function addMovimiento(data: Omit<MovimientoFinanciero, 'id'>) {
    await d(300);
    return storeAdd(data);
}

export async function updateMovimiento(id: string, cambios: Partial<MovimientoFinanciero>) {
    await d(300);
    storeUpdate(id, cambios);
}

export async function deleteMovimiento(id: string) {
    await d(250);
    storeDelete(id);
}

export async function getCategorias(): Promise<CategoriaFinanciera[]> {
    await d(200);
    return storeGetCategorias();
}

export async function addCategoria(data: Omit<CategoriaFinanciera, 'id' | 'esPropia'>) {
    await d(250);
    return storeAddCategoria(data);
}

export async function archivarCategoria(id: string) {
    await d(200);
    storeArchivarCategoria(id);
}

export async function getPeriodos() {
    await d(150);
    return storeGetPeriodos();
}

export async function getPeriodoActivo() {
    await d(120);
    return storeGetPeriodoActivo();
}

export async function renombrarPeriodo(id: string, nombre: string) {
    await d(200);
    storeRenombrarPeriodo(id, nombre);
}

export async function sembrarSaldoInicial(periodoId: string, semilla: SemillaSaldo, productorNombre?: string) {
    await d(300);
    storeSembrar(periodoId, semilla, productorNombre);
}

export async function tieneMovimientos(): Promise<boolean> {
    await d(100);
    return storeTieneMovimientos();
}

export type { SemillaSaldo };
