"use client";

import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, Users, PlusCircle } from 'lucide-react';
import { SensorRadar } from './SensorRadar';

interface CapituloCataProps {
  capitulo: {
    id: string;
    titulo: string;
    resumen: string;
    calificacion: number;
    confiabilidad: 'Alta' | 'Media' | 'Baja';
    validadores: number;
    radarSensorial: {
      acidez: number;
      cuerpo: number;
      dulzor: number;
      balance: number;
      limpieza: number;
    };
    tags: string[];
  };
  onPublicarCata: () => void;
  onVerDetalle: () => void;
}

export function CapituloCata({ capitulo, onPublicarCata, onVerDetalle }: CapituloCataProps) {
  const radarData = [
    { label: 'Acidez', value: capitulo.radarSensorial.acidez },
    { label: 'Cuerpo', value: capitulo.radarSensorial.cuerpo },
    { label: 'Dulzor', value: capitulo.radarSensorial.dulzor },
    { label: 'Balance', value: capitulo.radarSensorial.balance },
    { label: 'Limpieza', value: capitulo.radarSensorial.limpieza },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.3 }}
      id={capitulo.id}
      className="scroll-mt-32"
    >
      <Card className="bg-white border-border shadow-sm p-8 mb-6">
        {/* Header del capítulo */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 pb-6 border-b border-border">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {capitulo.titulo}
            </h2>
            <p className="text-muted-foreground">{capitulo.resumen}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {capitulo.calificacion}
                </span>
                <span className="text-sm text-muted-foreground">/5</span>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                Confiabilidad: {capitulo.confiabilidad}
              </Badge>
            </div>
            <Button variant="outline" onClick={onVerDetalle}>
              Ver detalle del eslabón
            </Button>
          </div>
        </div>

        {/* Cuerpo del capítulo - Destacado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Radar sensorial (placeholder visual) */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
              Perfil sensorial
            </h3>
            <div className="bg-white rounded-xl p-4 border border-border/50">
              <SensorRadar 
                data={[
                  { attribute: 'Acidez', value: capitulo.radarSensorial.acidez },
                  { attribute: 'Cuerpo', value: capitulo.radarSensorial.cuerpo },
                  { attribute: 'Dulzor', value: capitulo.radarSensorial.dulzor },
                  { attribute: 'Balance', value: capitulo.radarSensorial.balance },
                  { attribute: 'Limpieza', value: capitulo.radarSensorial.limpieza },
                ]} 
              />
            </div>
          </div>

          {/* Validaciones */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
              Validaciones
            </h3>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {capitulo.validadores}
                  </p>
                  <p className="text-sm text-muted-foreground">tostadores validaron este lote</p>
                </div>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                onClick={onPublicarCata}
              >
                <PlusCircle className="h-4 w-4" />
                Publicar validación (cata)
              </Button>
            </div>
          </div>
        </div>

        {/* Footer del capítulo */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {capitulo.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Button variant="link" className="text-sm">
            Ver registro completo
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}