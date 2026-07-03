import { PRODUCTORES_MOCK, LIDERES_MOCK, CATADORES_MOCK, TOSTADORES_MOCK } from '../data/directorio.mock';
import type { DirectorioUsuario } from '../types/directorio';

export async function getProductores(): Promise<DirectorioUsuario[]> {
    await new Promise(r => setTimeout(r, 400));
    let current = [...PRODUCTORES_MOCK];
    const savedProductor = localStorage.getItem('perfil_productor');
    if (savedProductor) {
        try {
            const parsed = JSON.parse(savedProductor);
            current = current.map(p => p.id === 'p1' ? {
                ...p,
                nombre: parsed.nombre || p.nombre,
                contacto: parsed.celular || p.contacto
            } : p);
        } catch (e) {}
    }
    return current;
}

export async function getLideres(): Promise<DirectorioUsuario[]> {
    await new Promise(r => setTimeout(r, 400));
    let current = [...LIDERES_MOCK];
    const savedLider = localStorage.getItem('perfil_lider');
    if (savedLider) {
        try {
            const parsed = JSON.parse(savedLider);
            current = current.map(l => l.id === 'l1' ? {
                ...l,
                nombre: parsed.nombre || l.nombre,
                contacto: parsed.celular || l.contacto
            } : l);
        } catch (e) {}
    }
    return current;
}

export async function getCatadores(): Promise<DirectorioUsuario[]> {
    await new Promise(r => setTimeout(r, 400));
    let current = [...CATADORES_MOCK];
    const savedCatador = localStorage.getItem('perfil_catador');
    if (savedCatador) {
        try {
            const parsed = JSON.parse(savedCatador);
            current = current.map(c => c.id === 'c1' ? {
                ...c,
                nombre: parsed.nombre || c.nombre,
                contacto: parsed.celular || c.contacto
            } : c);
        } catch (e) {}
    }
    return current;
}

export async function getTostadores(): Promise<DirectorioUsuario[]> {
    await new Promise(r => setTimeout(r, 400));
    let current = [...TOSTADORES_MOCK];
    const savedTostador = localStorage.getItem('perfil_tostador');
    if (savedTostador) {
        try {
            const parsed = JSON.parse(savedTostador);
            current = current.map(t => t.id === 't1' ? {
                ...t,
                nombre: parsed.nombreTostador || t.nombre,
                contacto: parsed.celular || t.contacto
            } : t);
        } catch (e) {}
    }
    return current;
}
