import { motion } from 'motion/react';
import { Shield, Check, Info, Map as MapIcon, Trees, Users, FileText, Globe, Landmark, Scale, Award } from 'lucide-react';
import { Badge } from './ui/badge';

export function EUDRCompliance() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-2xl flex flex-col">
      <div className="bg-[#5f705f] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-white/20 text-white border-white/30 text-[10px] uppercase font-black tracking-widest">Reglamento (UE) 2023/1115</Badge>
          </div>
          <h3 className="text-4xl font-sans font-black mb-2">Monitor de Trazabilidad EUDR</h3>
          <p className="text-white/60 text-sm font-medium mb-6">Cumplimiento de No-Deforestación y Legalidad Internacional</p>

          <div className="space-y-2 max-w-md">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
              <span>Nivel de cumplimiento</span>
              <span>85%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-12">
        {/* Section 1: Geolocalización y Cartografía */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#5f705f]">
              <div className="p-2.5 bg-[#5f705f]/10 rounded-2xl">
                <Globe className="h-6 w-6" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em]">Georreferenciación y Cartografía</h4>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] px-3 py-1">NIVEL 3: COMPLETO</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative group">
              <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                <Users size={10} className="text-emerald-600" />
                <span className="text-[8px] font-black text-emerald-700 uppercase">Ambiental</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <MapIcon className="h-4 w-4 text-[#5f705f]" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Definición de Lote</span>
              </div>
              <p className="text-sm font-bold text-slate-700">Polígonos de límites precisos (WGS84)</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
                <Check size={12} /> Verificado por Sensor GPS
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative group">
              <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                <Users size={10} className="text-emerald-600" />
                <span className="text-[8px] font-black text-emerald-700 uppercase">Ambiental</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Trees className="h-4 w-4 text-[#5f705f]" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Análisis IDEAM</span>
              </div>
              <p className="text-sm font-bold text-slate-700">Sobreposición: Áreas Protegidas / Bosque Primario</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
                <Check size={12} /> 0% Traslape Detectado
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Legalidad y Social */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#5f705f]">
              <div className="p-2.5 bg-[#5f705f]/10 rounded-2xl">
                <Landmark className="h-6 w-6" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em]">Criterios de Legalidad Social</h4>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] px-3 py-1">VALIDADO</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 relative">
              <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 w-fit mb-2">
                <Users size={10} className="text-blue-600" />
                <span className="text-[8px] font-black text-blue-700 uppercase">Líder Social</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Identificación</span>
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-emerald-500 rounded-full" />
                <div>
                  <p className="text-xs font-black text-slate-900 leading-none mb-1 uppercase">Cédula Cafetera</p>
                  <p className="text-sm font-bold text-slate-500">CC-*******42</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 w-fit mb-2">
                <Users size={10} className="text-blue-600" />
                <span className="text-[8px] font-black text-blue-700 uppercase">Líder Social</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tenencia Tierra</span>
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-emerald-500 rounded-full" />
                <div>
                  <p className="text-xs font-black text-slate-900 leading-none mb-1 uppercase">Tipo</p>
                  <p className="text-sm font-bold text-slate-500">Propiedad Titulada</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 w-fit mb-2">
                <Users size={10} className="text-blue-600" />
                <span className="text-[8px] font-black text-blue-700 uppercase">Líder Social</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Social/Etnico</span>
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-emerald-500 rounded-full" />
                <div>
                  <p className="text-xs font-black text-slate-900 leading-none mb-1 uppercase">Validación Líder</p>
                  <p className="text-sm font-bold text-slate-500">No requiere certificado étnico</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 mt-4 flex items-center gap-6">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Scale size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">Diligencia Debida Diferenciada</p>
              <p className="text-sm font-bold text-amber-700/80">Nivel Aligerado: Aplicado por riesgo despreciable de deforestación en caficultura colombiana establecida.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Certificaciones y Garantía */}
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-4 border-white bg-emerald-50 flex items-center justify-center text-[#5f705f] shadow-sm">
                <Award size={20} />
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                <Shield size={20} />
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Sellos de Support</p>
              <div className="flex gap-2">
                <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">Rainforest Alliance</span>
                <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">Fairtrade</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">DDS-ID</p>
              <p className="text-xs font-mono font-bold text-slate-500">COL-042-2026-X</p>
            </div>
            <button className="px-8 py-4 bg-[#5f705f] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#234d24] transition-all shadow-xl shadow-[#5f705f]/20 active:scale-95">
              Declaración de Conformidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

