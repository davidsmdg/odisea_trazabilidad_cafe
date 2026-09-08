const FLAG = 'odisea_onboarding_productor';

export function debeVerOnboarding(): boolean {
    try {
        return !localStorage.getItem(FLAG);
    } catch {
        return false;
    }
}

export function marcarOnboarding(estado: 'completo' | 'saltado' = 'completo') {
    try {
        localStorage.setItem(FLAG, estado);
    } catch {}
}
