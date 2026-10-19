import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Check, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [esIos, setEsIos] = useState<boolean>(false);
  const [yaInstalada, setYaInstalada] = useState<boolean>(false);

  useEffect(() => {
    // Detectar si ya corre como standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setYaInstalada(true);
      return;
    }

    // Detectar iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setEsIos(isIosDevice);

    // Evento de instalación en Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Mostrar modal al menos una vez si nunca se ha descartado
      const yaMostrado = localStorage.getItem('odisea_pwa_prompt_dismissed');
      if (!yaMostrado) {
        // Dar 2 segundos de espera tras entrar a la app para no ser invasivo
        setTimeout(() => {
          setMostrarModal(true);
        }, 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Si es iOS y nunca se ha visto, mostrar banner con instrucciones
    if (isIosDevice) {
      const yaMostradoIos = localStorage.getItem('odisea_pwa_prompt_dismissed');
      if (!yaMostradoIos) {
        setTimeout(() => {
          setMostrarModal(true);
        }, 2500);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstalar = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setMostrarModal(false);
          setYaInstalada(true);
        }
      } catch (err) {
        console.warn('Error al activar prompt PWA:', err);
      }
      setDeferredPrompt(null);
    }
  };

  const handleCerrar = () => {
    setMostrarModal(false);
    localStorage.setItem('odisea_pwa_prompt_dismissed', 'true');
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
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-[#2D3E33]/60 hover:text-[#2D3E33] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2D3E33] flex items-center justify-center text-[#E5A84B] shadow-md">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="font-heading text-lg text-[#2D3E33] uppercase leading-tight">Instalar Mi Finca</h3>
            <p className="text-[12px] font-bold text-[#4A2E3D]/80">Acceso rápido y funciona sin internet</p>
          </div>
        </div>

        <p className="text-[13px] text-[#4A2E3D] font-medium leading-relaxed mb-4">
          Instala la aplicación en tu celular para guardar tus cosechas y cuentas cafetaleras incluso cuando no tengas señal o datos en el campo.
        </p>

        {esIos ? (
          <div className="bg-white/80 rounded-2xl p-3.5 border border-[#2D3E33]/10 text-[12px] text-[#2D3E33] space-y-2 mb-4">
            <p className="font-bold flex items-center gap-1.5">
              <Share2 size={15} className="text-[#BD4A1F]" /> 1. Toca el botón <strong>Compartir</strong> en Safari.
            </p>
            <p className="font-bold flex items-center gap-1.5">
              <PlusSquare size={15} className="text-[#BD4A1F]" /> 2. Elige <strong>"Agregar a pantalla de inicio"</strong>.
            </p>
          </div>
        ) : (
          deferredPrompt && (
            <button
              onClick={handleInstalar}
              className="w-full py-3.5 rounded-full bg-[#BD4A1F] hover:bg-[#a63e18] text-[#F6F2EC] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#BD4A1F]/30 transition-all mb-2"
            >
              <Download size={18} /> Instalar ahora en mi celular
            </button>
          )
        )}

        <button
          onClick={handleCerrar}
          className="w-full py-2.5 rounded-full text-center text-xs font-bold text-[#2D3E33]/60 hover:text-[#2D3E33] transition-colors"
        >
          Ahora no, continuar en el navegador
        </button>
      </div>
    </div>
  );
}
