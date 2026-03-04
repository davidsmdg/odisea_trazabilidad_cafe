import { motion } from 'motion/react';
import { Shield, Check, Info, Map as MapIcon, Trees } from 'lucide-react';

export function EUDRCompliance() {
  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg mb-12">
      <div className="bg-[#2C5F2D] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shield className="h-8 w-8" />
          <div>
            <h3 className="text-xl font-serif">Certificación EUDR</h3>
            <p className="text-sm text-white/80">Reglamento contra la Deforestación de la UE</p>
          </div>
        </div>
        <div className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold border border-white/30">
          Estado: Verificado
        </div>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#2C5F2D]">
              <div className="p-2 bg-[#2C5F2D]/10 rounded-lg">
                <MapIcon className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-wider">Geolocalización</h4>
            </div>
            <p className="text-sm text-gray-600">
              Coordenadas poligonales verificadas. El lote se encuentra fuera de áreas forestales protegidas
              según los límites de 2020.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
              <Check className="h-4 w-4" />
              <span>Polígono Validado</span>
            </div>
          </div>

          <div className="space-y-4 border-x border-border px-8">
            <div className="flex items-center gap-3 text-[#2C5F2D]">
              <div className="p-2 bg-[#2C5F2D]/10 rounded-lg">
                <Trees className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-wider">No-Deforestación</h4>
            </div>
            <p className="text-sm text-gray-600">
              Análisis de imágenes satelitales (Sentinel-2) confirma cero degradación forestal
              en los últimos 5 años.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
              <Check className="h-4 w-4" />
              <span>Análisis Satelital OK</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#2C5F2D]">
              <div className="p-2 bg-[#2C5F2D]/10 rounded-lg">
                <Info className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-wider">Legalidad Nacional</h4>
            </div>
            <p className="text-sm text-gray-600">
              Documentación legal de propiedad y cumplimiento de normativas laborales
              colombianas vigentes.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
              <Check className="h-4 w-4" />
              <span>Leyes Locales Cumplidas</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-between">
          <div className="text-sm text-gray-500 italic">
            ID de Diligencia Debida: <span className="font-mono text-gray-800">EU-2026-COL-HUI-042-X</span>
          </div>
          <button className="text-[#2C5F2D] text-sm font-bold hover:underline">
            Descargar Declaración Completa
          </button>
        </div>
      </div>
    </div>
  );
}
