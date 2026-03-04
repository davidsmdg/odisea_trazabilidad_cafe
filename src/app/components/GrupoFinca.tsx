import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MapPin, TrendingUp, Shield, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { LoteBancoCard } from './LoteBancoCard';

interface GrupoFincaProps {
  grupo: {
    id: string;
    nombre: string;
    municipio: string;
    altitud: string;
    impacto: 'Alto' | 'Medio' | 'Bajo';
    ueEstado: 'Verificado' | 'En revisión' | 'Pendiente';
    cafesCount: number;
    lotes: Array<{
      id: string;
      titulo: string;
      proceso: 'Lavado' | 'Honey' | 'Natural';
      puntaje: number;
      notas: string[];
      reputacion: 'Alta' | 'Media' | 'Nueva';
      ueEstado: 'Verificado' | 'En revisión' | 'Pendiente';
      disponibilidad: number;
      cadena: 'Completa' | 'Parcial';
    }>;
  };
  defaultExpanded?: boolean;
  onLoteClick: (lote: any) => void;
}

const ueColors = {
  Verificado: 'border-primary text-primary',
  'En revisión': 'border-orange-500 text-orange-600',
  Pendiente: 'border-gray-400 text-gray-600',
};

export function GrupoFinca({ grupo, defaultExpanded = false, onLoteClick }: GrupoFincaProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      layout
    >
      <Card className="bg-white border-border shadow-sm overflow-hidden">
        {/* Header del grupo - Clickeable para expandir/colapsar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
          role="button"
          tabIndex={0}
          className="w-full p-6 hover:bg-secondary/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {grupo.nombre}
                </h3>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {grupo.municipio} • {grupo.altitud}
                  </span>
                </div>
                <span className="font-medium text-foreground">{grupo.cafesCount} cafés</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Impacto: {grupo.impacto}
                </Badge>
                <Badge variant="outline" className={`gap-1.5 ${ueColors[grupo.ueEstado]}`}>
                  <Shield className="h-3.5 w-3.5" />
                  UE: {grupo.ueEstado}
                </Badge>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="gap-2" onClick={(e) => {
              e.stopPropagation();
              // Acción para ver perfil
            }}>
              <ExternalLink className="h-4 w-4" />
              Ver perfil de finca
            </Button>
          </div>
        </div>

        {/* Contenido expandible - Grid de lotes */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 border-t border-border bg-secondary/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {grupo.lotes.map((lote) => (
                    <LoteBancoCard key={lote.id} lote={lote} onClick={() => onLoteClick(lote)} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
