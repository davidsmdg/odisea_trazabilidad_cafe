import { INITIAL_LIDERES_LINKS, INITIAL_CATADORES_LINKS, INITIAL_TOSTADORES_LINKS } from '../data/conexiones.mock';
import type { LinkLider, LinkCatador, LinkTostador } from '../types/link';

export async function getLiderConexiones(): Promise<LinkLider[]> {
    await new Promise(r => setTimeout(r, 400));
    const stored = localStorage.getItem('links_lider');
    if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem('links_lider', JSON.stringify(INITIAL_LIDERES_LINKS));
    return INITIAL_LIDERES_LINKS;
}

export async function saveLiderConexiones(links: LinkLider[]): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    localStorage.setItem('links_lider', JSON.stringify(links));
}

export async function getCatadorConexiones(): Promise<LinkCatador[]> {
    await new Promise(r => setTimeout(r, 400));
    const stored = localStorage.getItem('links_catador');
    if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem('links_catador', JSON.stringify(INITIAL_CATADORES_LINKS));
    return INITIAL_CATADORES_LINKS;
}

export async function saveCatadorConexiones(links: LinkCatador[]): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    localStorage.setItem('links_catador', JSON.stringify(links));
}

export async function getTostadorConexiones(): Promise<LinkTostador[]> {
    await new Promise(r => setTimeout(r, 400));
    const stored = localStorage.getItem('links_tostador');
    if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem('links_tostador', JSON.stringify(INITIAL_TOSTADORES_LINKS));
    return INITIAL_TOSTADORES_LINKS;
}

export async function saveTostadorConexiones(links: LinkTostador[]): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    localStorage.setItem('links_tostador', JSON.stringify(links));
}
