import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BancoHeaderProps {
  departamento: string;
  disponibles: number;
  ueVerificadoActive?: boolean;
}

export function BancoHeader({ departamento, disponibles, ueVerificadoActive }: BancoHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden mb-12 bg-[#5f705f] min-h-[300px] flex items-center"
    >
      <div className="absolute inset-0 opacity-40">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1635991062422-b3e2f8c36dce?q=80&w=1080"
          alt="Coffee mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5f705f] via-[#5f705f]/80 to-transparent" />
      </div>

      <div className="relative z-10 px-12 py-12 flex flex-col md:flex-row md:items-end justify-between w-full gap-8">
        <div className="max-w-2xl">
          <span className="text-[#FDFDF8] font-medium tracking-widest uppercase text-xs mb-4 block">
            Portafolio de Cafés • Origen Protegido
          </span>
          <h1 className="text-5xl md:text-6xl font-sans text-white mb-6 leading-tight">
            Descubre cafés <br />
            <span className="italic">con propósito.</span>
          </h1>
          <p className="text-xl text-white/80 font-light max-w-lg">
            Explora los diferentes lotes y nanolotes con procesos e historias de impacto de diferentes regiones de Colombia.
          </p>
        </div>

        <div className="flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/20">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-tighter text-white/60 font-bold mb-1">Disponibles</p>
            <p className="text-3xl font-sans text-white leading-none">
              {disponibles}
            </p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-tighter text-white/60 font-bold mb-1">EUDR Status</p>
            <Badge className="bg-emerald-500 text-white border-none text-[10px] px-2 py-0">100% Ok</Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
