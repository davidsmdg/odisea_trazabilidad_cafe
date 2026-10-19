import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

interface VersionInfo {
  version: string;
  buildTime: string;
}

export function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Solo chequear en producción o entorno desplegado
    let timer: NodeJS.Timeout;

    const checkVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        if (res.ok) {
          const data: VersionInfo = await res.json();
          const currentVersion = localStorage.getItem('odisea_app_version');
          if (currentVersion && currentVersion !== data.version) {
            setUpdateAvailable(true);
          } else if (!currentVersion) {
            localStorage.setItem('odisea_app_version', data.version);
          }
        }
      } catch {}
    };

    checkVersion();
    timer = setInterval(checkVersion, 60000); // Revisar cada 60 segundos

    return () => clearInterval(timer);
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // 1. Limpiar caches de Service Worker
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // 2. Desregistrar service workers si existen
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const r of registrations) {
          await r.unregister();
        }
      }
      // 3. Obtener la nueva version
      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data: VersionInfo = await res.json();
        localStorage.setItem('odisea_app_version', data.version);
      }
    } catch {}

    // 4. Forzar recarga completa desde el servidor
    window.location.reload();
  };

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#2D3E33] text-white px-4 py-2.5 shadow-lg flex items-center justify-between text-xs sm:text-sm animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-amber-400 shrink-0 animate-pulse" />
        <span className="font-semibold">
          Hay una nueva versión de la plataforma disponible con mejoras de sincronización.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw size={12} className={isUpdating ? 'animate-spin' : ''} />
          {isUpdating ? 'Actualizando...' : 'Actualizar ahora'}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          title="Descartar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
