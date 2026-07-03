import { MOCK_USERS, DEFAULT_USERS } from '../data/usuarios.mock';
import type { AuthUser, UserRecord } from '../types/usuario';

const KEY = 'odisea_usuarios';

export async function getMockUsers(): Promise<AuthUser[]> {
    await new Promise(r => setTimeout(r, 300));
    return MOCK_USERS;
}

export async function getDefaultUsers(): Promise<UserRecord[]> {
    await new Promise(r => setTimeout(r, 500));
    const saved = localStorage.getItem(KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {}
    }
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
}

export async function saveDefaultUsers(users: UserRecord[]): Promise<void> {
    await new Promise(r => setTimeout(r, 400));
    localStorage.setItem(KEY, JSON.stringify(users));
}
