export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const INSTALLED_KEY = 'odisea_pwa_installed';

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

/** Verifica si la app ya está instalada o corriendo en modo standalone */
export function isPwaInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  if (isStandalone) {
    try {
      localStorage.setItem(INSTALLED_KEY, 'true');
    } catch {}
    return true;
  }

  try {
    return localStorage.getItem(INSTALLED_KEY) === 'true';
  } catch {
    return false;
  }
}

/**Marca la app como instalada y avisa a toda la interfaz para ocultar botones */
export function markPwaInstalled(): void {
  try {
    localStorage.setItem(INSTALLED_KEY, 'true');
  } catch {}
  deferredInstallPrompt = null;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('odisea:pwa-installed'));
  }
}

/** Obtiene el evento nativo de instalación si Chrome/Android ya lo disparó */
export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredInstallPrompt;
}

/** Dispara el prompt nativo de instalación o retorna 'manual' si requiere guía */
export async function triggerPwaInstall(): Promise<'installed' | 'dismissed' | 'manual'> {
  if (deferredInstallPrompt) {
    try {
      await deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      if (choice.outcome === 'accepted') {
        markPwaInstalled();
        return 'installed';
      }
      return 'dismissed';
    } catch (err) {
      console.warn('Error ejecutando prompt de instalación PWA:', err);
      deferredInstallPrompt = null;
      return 'manual';
    }
  }
  return 'manual';
}

/** Solicita abrir el modal de instalación (o guía manual) desde cualquier botón */
export function openPwaInstallModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('odisea:open-pwa-modal'));
  }
}

// Inicializar listeners globales desde el primer segundo que carga la app
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredInstallPrompt = e as BeforeInstallPromptEvent;
    // Si el navegador ofrece instalarla, significa que NO está instalada actualmente
    try {
      localStorage.removeItem(INSTALLED_KEY);
    } catch {}
    window.dispatchEvent(new CustomEvent('odisea:pwa-prompt-ready'));
  });

  window.addEventListener('appinstalled', () => {
    markPwaInstalled();
  });
}
