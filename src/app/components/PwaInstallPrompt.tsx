import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare, MoreVertical } from 'lucide-react';
import {
  isPwaInstalled,
  getDeferredInstallPrompt,
  triggerPwaInstall,
  markPwaInstalled,
} from '../utils/pwaInstallManager';

export function PwaInstallPrompt() {
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [esIos, setEsIos] = useState<boolean>(false);
  const [yaInstalada, setYaInstalada] = useState<boolean>(isPwaInstalled());
  const [tienePromptNativo, setTienePromptNativo] = useState<boolean>(!!getDeferredInstallPrompt());

  useEffect(() => {
    if (isPwaInstalled()) {
      setYaInstalada(true);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setEsIos(isIosDevice);

    const checkPrompt = () => {
      setTienePromptNativo(!!getDeferredInstallPrompt());
    };

    const handleOpenManual = () => {
      setTienePromptNativo(!!getDeferredInstallPrompt());
      setMostrarModal(true);
    };

    const handleInstalled = () => {
      setYaInstalada(true);
      setMostrarModal(false);
    };

    window.addEventListener('odisea:pwa-prompt-ready', checkPrompt);
    window.addEventListener('odisea:open-pwa-modal', handleOpenManual);
    window.addEventListener('odisea:pwa-installed', handleInstalled);

    // Mostrar automáticamente una primera vez si no ha sido descartado antes
    const yaDescartado = localStorage.getItem('odisea_pwa_prompt_dismissed');
    if (!yaDescartado) {
      const timer = setTimeout(() => {
        if (!isPwaInstalled()) {
          setTienePromptNativo(!!getDeferredInstallPrompt());
          setMostrarModal(true);
        }
      }, 2200);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('odisea:pwa-prompt-ready', checkPrompt);
        window.removeEventListener('odisea:open-pwa-modal', handleOpenManual);
        window.removeEventListener('odisea:pwa-installed', handleInstalled);
      };
    }

    return () => {
      window.removeEventListener('odisea:pwa-prompt-ready', checkPrompt);
      window.removeEventListener('odisea:open-pwa-modal', handleOpenManual);
      window.removeEventListener('odisea:pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstalar = async () => {
    const res = await triggerPwaInstall();
    if (res === 'installed') {
      setMostrarModal(false);
      setYaInstalada(true);
    } else if (res === 'dismissed') {
      setTienePromptNativo(false);
    }
  };

  const handleCerrar = () => {
    setMostrarModal(false);
    try {
      localStorage.setItem('odisea_pwa_prompt_dismissed', 'true');
    } catch {}
  };

  const handleYaLaInstale = () => {
    markPwaInstalled();
    setMostrarModal(false);
    setYaInstalada(true);
  };

  if (yaInstalada || !mostrarModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-[2rem] bg-[#F6F2EC] text-[#2D3E33] p-6 shadow-2xl border border-white/20 relative">
        <button
          onClick={handleCerrar}
          aria-label="Cerrar aviso de instalación"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-[#2D3E33]/60 hover:text-[#2D3E33] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2D3E33] flex items-center justify-center text-[#E5A84B] shadow-md shrink-0">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="font-heading text-lg text-[#2D3E33] uppercase leading-tight">Instalar Mi Finca</h3>
            <p className="text-[12px] font-bold text-[#4A2E3D]/80">Acceso rápido y funciona sin internet</p>
          </div>
        </div>

        <p className="text-[13px] text-[#4A2E3D] font-medium leading-relaxed mb-4">
          Descarga la aplicación en la pantalla principal de tu celular para anotar cosechas y cuentas incluso sin señal ni datos en la finca.
        </p>

        {tienePromptNativo ? (
          <button
            onClick={handleInstalar}
            className="w-full py-3.5 rounded-full bg-[#BD4A1F] hover:bg-[#a63e18] text-[#F6F2EC] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#BD4A1F]/30 transition-all mb-3 cursor-pointer"
          >
            <Download size={18} /> Descargar e instalar ahora
          </button>
        ) : esIos ? (
          <div className="bg-white rounded-2xl p-4 border border-[#2D3E33]/15 text-[13px] text-[#2D3E33] space-y-2.5 mb-4 shadow-sm">
            <p className="font-extrabold text-[#BD4A1F] uppercase text-[11px] tracking-wider">Pasos en tu iPhone:</p>
            <p className="font-bold flex items-center gap-2">
              <Share2 size={16} className="text-[#BD4A1F] shrink-0" />
              <span>1. Toca el botón <strong>Compartir</strong> abajo en Safari.</span>
            </p>
            <p className="font-bold flex items-center gap-2">
              <PlusSquare size={16} className="text-[#BD4A1F] shrink-0" />
              <span>2. Elige <strong>"Agregar a pantalla de inicio"</strong>.</span>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 border border-[#2D3E33]/15 text-[13px] text-[#2D3E33] space-y-2.5 mb-4 shadow-sm">
            <p className="font-extrabold text-[#BD4A1F] uppercase text-[11px] tracking-wider">Cómo instalarla en 2 toques:</p>
            <p className="font-bold flex items-start gap-2">
              <MoreVertical size={16} className="text-[#BD4A1F] shrink-0 mt-0.5" />
              <span>1. Toca los <strong>3 puntos (⋮)</strong> arriba a la derecha de tu navegador.</span>
            </p>
            <p className="font-bold flex items-start gap-2">
              <Download size={16} className="text-[#BD4A1F] shrink-0 mt-0.5" />
              <span>2. Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleYaLaInstale}
            className="w-full py-2 rounded-full text-center text-xs font-extrabold text-[#2D3E33] hover:bg-black/5 transition-colors cursor-pointer"
          >
            ✓ Ya la instalé, no volver a mostrar
          </button>
          <button
            onClick={handleCerrar}
            className="w-full py-2 rounded-full text-center text-xs font-bold text-[#2D3E33]/60 hover:text-[#2D3E33] transition-colors cursor-pointer"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}
