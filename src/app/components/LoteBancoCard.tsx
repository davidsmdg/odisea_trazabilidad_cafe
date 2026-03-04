import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shield, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface LoteBancoCardProps {
  lote: {
    id: string;
    titulo: string;
    proceso: 'Lavado' | 'Honey' | 'Natural';
    puntaje: number;
    notas: string[];
    reputacion: 'Alta' | 'Media' | 'Nueva';
    ueEstado: 'Verificado' | 'En revisión' | 'Pendiente';
    disponibilidad: number;
    cadena: 'Completa' | 'Parcial';
  };
  onClick: () => void;
}

const reputacionColors = {
  Alta: 'bg-primary text-primary-foreground',
  Media: 'bg-secondary text-secondary-foreground',
  Nueva: 'bg-gray-200 text-gray-700',
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer relative"
      onClick={onClick}
    >
      {/* Preview al hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-2 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-md"
        >
          Cadena: {lote.cadena}
        </motion.div>
      )}

      <div className="space-y-3">
        {/* Título y Proceso */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-base" style={{ fontFamily: 'var(--font-heading)' }}>
            {lote.titulo}
          </h4>
          <Badge variant="outline" className="shrink-0">
            {lote.proceso}
          </Badge>
        </div>

        {/* Puntaje */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {lote.puntaje}
          </span>
          <span className="text-sm text-muted-foreground">pts</span>
        </div>

        {/* Notas */}
        <div className="flex flex-wrap gap-1.5">
          {lote.notas.map((nota) => (
            <Badge key={nota} variant="secondary" className="text-xs">
              {nota}
            </Badge>
          ))}
        </div>

        {/* Badges de estado */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <Badge className={reputacionColors[lote.reputacion]}>{lote.reputacion}</Badge>
          <Badge className={ueColors[lote.ueEstado]}>UE: {lote.ueEstado}</Badge>
        </div>

        {/* Disponibilidad */}
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{lote.disponibilidad} sacos</span>{' '}
          disponibles
        </p>

        {/* Botones */}
        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Ver trazabilidad
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Reservar
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
