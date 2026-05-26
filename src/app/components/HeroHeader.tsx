import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroHeader() {
  const navigate = useNavigate();
  const [loteId, setLoteId] = useState('');

  const handleValorar = () => {
    if (loteId.trim()) {
      // If user writes something like "LOT-HUI-084" or just "HUI-084", we navigate to it.
      // Prefixing with LOT- if they didn't add it could be an option, but let's just pass what they typed.
      let finalId = loteId.trim().toUpperCase();
      if (!finalId.startsWith('LOT-')) {
        finalId = 'LOT-' + finalId;
      }
      navigate(`/trazabilidad/publica/${finalId}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValorar();
    }
  };

  return (
    <div className="relative h-[85vh] min-h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1635991062422-b3e2f8c36dce?q=80&w=1920"
          alt="Coffee farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
      </div>

      <div className="relative h-full max-w-[1200px] mx-auto px-8 flex flex-col justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="text-[#e3d5b8] font-semibold tracking-widest uppercase text-sm mb-6 block drop-shadow-md">
            Impacto en el Origen
          </span>
          <h1 className="text-6xl md:text-8xl font-sans leading-[1.1] mb-8 drop-shadow-2xl">
            Descubre el origen de <br />
            <span className="italic">cada grano.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 drop-shadow-lg max-w-2xl font-light">
            Selecciona una región para conocer a los productores que, desde zonas de difícil acceso,
            ofrecen cafés excepcionales a través de relaciones comerciales directas y seguras.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <button
              onClick={() => navigate('/banco-cafes')}
              className="px-8 py-4 bg-[#FDFDF8] text-[#5f705f] rounded-full font-bold text-lg hover:bg-white transition-all shadow-xl cursor-pointer"
            >
              Ver Portafolio
            </button>
            <div className="flex bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1.5 pl-6 items-center shadow-xl w-full max-w-md">
              <input 
                type="text" 
                value={loteId}
                onChange={(e) => setLoteId(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ingresa tu lote (Ej: HUILA-084)"
                className="bg-transparent border-none text-white outline-none placeholder:text-white/60 text-base flex-1 min-w-0"
              />
              <button 
                onClick={handleValorar}
                className="px-6 py-3 bg-[#bb8d3b] hover:bg-[#a67c33] text-white rounded-full font-bold transition-all shadow-md whitespace-nowrap"
              >
                Valorar tu café
              </button>
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
