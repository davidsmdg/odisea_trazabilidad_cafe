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
      className="relative rounded-3xl overflow-hidden mb-12 bg-[#2C5F2D] min-h-[300px] flex items-center"
    >
      <div className="absolute inset-0 opacity-40">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1635991062422-b3e2f8c36dce?q=80&w=1080"
          alt="Coffee mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C5F2D] via-[#2C5F2D]/80 to-transparent" />
      </div>

      <div className="relative z-10 px-12 py-12 flex flex-col md:flex-row md:items-end justify-between w-full gap-8">
        <div className="max-w-2xl">
          <span className="text-[#F5F5DC] font-medium tracking-widest uppercase text-xs mb-4 block">
            Banco de Cafés • Origen Protegido
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
            Descubre {departamento} <br />
            <span className="italic">en cada taza.</span>
          </h1>
          <p className="text-xl text-white/80 font-light max-w-lg">
            Explora la diversidad de microclimas y procesos de las fincas más innovadoras de la región.
          </p>
        </div>

        <div className="flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/20">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-tighter text-white/60 font-bold mb-1">Disponibles</p>
            <p className="text-3xl font-serif text-white leading-none">
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
