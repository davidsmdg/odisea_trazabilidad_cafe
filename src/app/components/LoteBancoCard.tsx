import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shield, ExternalLink, MapPin } from 'lucide-react';
import { useState } from 'react';
import { cn } from './ui/utils';

interface LoteBancoCardProps {
  lote: {
    id: string;
    titulo: string;
    productor: string;
    finca: string;
    variedad: string;
    proceso: 'Lavado' | 'Honey' | 'Natural';
    puntaje: number;
    macroperfil: 'Especiado' | 'Floral' | 'Frutal' | 'Colombia' | 'Chocolate' | 'Caramelo';
    descripcionPerfil: string;
    ueEstado: 'Verificado' | 'En revisión' | 'Pendiente';
    disponibilidad: number;
    cadena: 'Completa' | 'Parcial';
    imagen?: string;
  };
  onClick: () => void;
}

const macroperfilConfig = {
  Especiado: { color: 'bg-amber-100 text-amber-900 border-amber-200', label: 'Especiado' },
  Floral: { color: 'bg-rose-100 text-rose-900 border-rose-200', label: 'Floral' },
  Frutal: { color: 'bg-emerald-100 text-emerald-900 border-emerald-200', label: 'Frutal' },
  Colombia: { color: 'bg-[#e3d5b8]/30 text-[#5f705f] border-[#e3d5b8]/50', label: 'Perfil Colombia' },
  Chocolate: { color: 'bg-amber-100 text-[#5D4037] border-amber-200', label: 'Chocolate' },
  Caramelo: { color: 'bg-orange-50 text-orange-900 border-orange-200', label: 'Caramelo' },
  Balanceado: { color: 'bg-blue-50 text-blue-900 border-blue-200', label: 'Balanceado' },
  Default: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Perfil' },
};

const ueColors = {
  Verificado: 'bg-primary text-primary-foreground',
  'En revisión': 'bg-orange-500 text-white',
  Pendiente: 'bg-gray-400 text-white',
};

export function LoteBancoCard({ lote, onClick }: LoteBancoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer overflow-hidden group relative flex flex-col"
      onClick={onClick}
    >
      {/* Container de Imagen con Overlay */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={lote.imagen || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={lote.titulo}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badge de Proceso flotante sobre imagen */}
        <div className="absolute top-4 left-4">
          <Badge className={cn(
            "backdrop-blur-md border px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider",
            lote.proceso === 'Natural' ? "bg-orange-500/20 text-orange-100 border-orange-400/30" :
              lote.proceso === 'Honey' ? "bg-amber-500/20 text-amber-100 border-amber-400/30" :
                "bg-blue-500/20 text-blue-100 border-blue-400/30"
          )}>
            {lote.proceso}
          </Badge>
        </div>

        {/* Puntos flotantes sobre imagen */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-white shadow-xl flex flex-col items-center min-w-[50px]">
          <span className="text-[8px] font-medium uppercase text-gray-400 leading-none mb-0.5">Puntos</span>
          <span className="text-xl font-sans font-semibold text-gray-800 leading-none">{lote.puntaje}</span>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1">
        {/* Header: Productor (Principal) y Origen/Lote (Subtexto) */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5 text-left">
              <h4 className="text-xl font-sans font-bold text-gray-800 leading-tight group-hover:text-[#5f705f] transition-colors">
                {lote.variedad} • {lote.macroperfil}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[11px] font-medium text-[#5f705f]">{lote.productor}</span>
                <span className="text-gray-200 text-[10px]">•</span>
                <span className="text-[11px] font-medium text-[#8a9a8a]">{lote.finca}</span>
              </div>
            </div>
          </div>

          {/* Variedad Destacada */}
          <div className="pt-0.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-[11px] font-medium border border-gray-100 shadow-sm">
              Variedad: {lote.variedad}
            </span>
          </div>
        </div>

        {/* Perfil de Sabor */}
        <div className="space-y-2 py-3 border-y border-gray-50">
          <div className="flex items-center gap-2">
            <Badge className={cn("text-[10px] font-medium px-2.5 py-0.5 rounded-md border shadow-none", (macroperfilConfig[lote.macroperfil] || macroperfilConfig.Default).color)}>
              {(macroperfilConfig[lote.macroperfil] || macroperfilConfig.Default).label}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 italic">
            "{lote.descripcionPerfil}"
          </p>
        </div>

        {/* Estado y Disponibilidad */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[9px] font-medium uppercase text-gray-400">Disponibilidad</span>
            <span className="text-sm font-sans font-semibold text-gray-800">{lote.disponibilidad} sacos</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <Shield className="h-3 w-3 text-[#5f705f]" />
            <span className="text-[10px] font-medium text-gray-600">UE: Verificado</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 h-10 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-medium text-[11px] shadow-sm transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Ver Trazabilidad
          </Button>
          <Button
            variant="outline"
            className="px-4 h-10 border border-[#5f705f]/20 text-[#5f705f] rounded-xl font-medium text-[11px] hover:border-[#5f705f]/40 hover:bg-[#5f705f]/5 transition-all bg-white"
            onClick={(e) => {
              e.stopPropagation();
              // Acción reservar
            }}
          >
            Reservar
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
