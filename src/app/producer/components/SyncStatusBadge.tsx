import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getOperacionesPendientes, sincronizarPendientes } from '../../../services/offlineSyncService';

export function SyncStatusBadge() {
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendientes, setPendientes] = useState<number>(0);
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const [recienSincronizado, setRecienSincronizado] = useState<boolean>(false);

  const actualizarConteo = async () => {
    try {
      const items = await getOperacionesPendientes();
      setPendientes(items.length);
    } catch {
      setPendientes(0);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      actualizarConteo();
    };
    const handleOffline = () => {
      setOnline(false);
      actualizarConteo();
    };
    const handleQueueChange = () => {
      actualizarConteo();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('odisea:sync-queue-updated', handleQueueChange);

    actualizarConteo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('odisea:sync-queue-updated', handleQueueChange);
    };
  }, []);

  const handleSincronizarManual = async () => {
    if (sincronizando || !online) return;
    setSincronizando(true);
    try {
      const res = await sincronizarPendientes();
      await actualizarConteo();
      if (res.subidos > 0) {
        setRecienSincronizado(true);
        setTimeout(() => setRecienSincronizado(false), 3000);
      }
    } finally {
      setSincronizando(false);
    }
  };

  // Si está online y no hay nada pendiente ni recién sincronizado, mostramos un discreto indicador o nada
  if (online && pendientes === 0 && !recienSincronizado) {
    return (
      <div 
        title="Todo sincronizado con el servidor"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold border border-emerald-500/20"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden sm:inline">En línea</span>
      </div>
    );
  }

  if (recienSincronizado) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-sm animate-fade-in">
        <CheckCircle2 size={13} className="shrink-0" />
        <span>¡Guardado en la nube!</span>
      </div>
    );
  }

  // Hay pendientes o estamos offline
  return (
    <button
      onClick={handleSincronizarManual}
      disabled={!online || sincronizando}
      title={online ? 'Toca para sincronizar los datos pendientes ahora' : 'Sin conexión: los datos están a salvo en tu teléfono'}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all shadow-sm ${
        !online
          ? 'bg-amber-100 text-amber-900 border border-amber-300'
          : 'bg-[#BD4A1F] text-white hover:bg-[#a63e18]'
      }`}
    >
      {!online ? (
        <>
          <WifiOff size={13} className="text-amber-800 shrink-0" />
          <span>{pendientes > 0 ? `${pendientes} por subir (Offline)` : 'Sin señal'}</span>
        </>
      ) : (
        <>
          <RefreshCw size={12} className={`shrink-0 ${sincronizando ? 'animate-spin' : ''}`} />
          <span>{sincronizando ? 'Subiendo...' : `${pendientes} pendiente${pendientes > 1 ? 's' : ''} · Subir ya`}</span>
        </>
      )}
    </button>
  );
}
