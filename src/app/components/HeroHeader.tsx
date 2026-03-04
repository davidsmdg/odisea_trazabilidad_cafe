import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroHeader() {
  return (
    <div className="relative h-[85vh] min-h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1635991062422-b3e2f8c36dce?q=80&w=1920"
          alt="Coffee farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
      </div>

      <div className="relative h-full max-w-[1200px] mx-auto px-8 flex flex-col justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="text-[#F5F5DC] font-medium tracking-widest uppercase text-sm mb-6 block drop-shadow-lg">
            Plataforma de Trazabilidad Premium
          </span>
          <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] mb-8 drop-shadow-2xl">
            Descubre el origen de <br />
            <span className="italic">cada grano.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 drop-shadow-lg max-w-2xl font-light">
            Monitoreo en tiempo real, cumplimiento normativo EUDR y la historia de los
            caficultores que transforman el campo colombiano.
          </p>
          <div className="flex flex-wrap gap-6">
            <button className="px-10 py-4 bg-[#F5F5DC] text-[#2C5F2D] rounded-full font-bold text-lg hover:bg-white transition-all shadow-xl">
              Explorar Mapa
            </button>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full border border-white/20">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">124 Lotes Verificados Hoy</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 right-0 p-8 text-white/60 text-sm italic">
        Finca Los Arrayanes, Caldas, Colombia
      </div>
    </div>
  );
}
