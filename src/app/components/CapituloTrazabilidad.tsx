"use client";

import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, FileText, Image as ImageIcon, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Evidencia {
  id: string;
  tipo: 'PDF' | 'Foto' | 'Geo' | 'Certificado' | 'Registro';
  nombre: string;
  estado: 'Subido' | 'Verificado' | 'En revisión';
}

interface DatoClave {
  label: string;
  valor: string;
}

interface CapituloTrazabilidadProps {
  capitulo: {
    id: string;
    titulo: string;
    resumen: string;
    calificacion: number;
    confiabilidad: 'Alta' | 'Media' | 'Baja';
    quepaso: string[];
    evidencias: Evidencia[];
    datosClaves: DatoClave[];
    tags: string[];
  };
  onVerDetalle: () => void;
}

const iconosPorTipo: Record<string, React.ComponentType<{ className?: string }>> = {
  PDF: FileText,
  Foto: ImageIcon,
  Geo: MapPin,
  Certificado: CheckCircle,
  Registro: FileText,
};

const estadoEvidenciaColors: Record<string, string> = {
  'Subido': 'text-gray-500',
  'Verificado': 'text-primary',
  'En revisión': 'text-orange-500',
};

const estadoEvidenciaIcons: Record<string, React.ComponentType<{ className?: string; title?: string }>> = {
  'Subido': Clock,
  'Verificado': CheckCircle,
  'En revisión': AlertCircle,
};

export function CapituloTrazabilidad({ capitulo, onVerDetalle }: CapituloTrazabilidadProps) {
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
              <Badge
                variant={capitulo.confiabilidad === 'Alta' ? 'default' : 'secondary'}
              >
                Confiabilidad: {capitulo.confiabilidad}
              </Badge>
            </div>
            <Button variant="outline" onClick={onVerDetalle}>
              Ver detalle del eslabón
            </Button>
          </div>
        </div>

        {/* Cuerpo del capítulo - 3 bloques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* A) Qué pasó aquí */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Qué pasó aquí
            </h3>
            <ul className="space-y-2">
              {capitulo.quepaso.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* B) Evidencia */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Evidencia
            </h3>
            <div className="space-y-2">
              {capitulo.evidencias.map((evidencia) => {
                const IconoTipo = iconosPorTipo[evidencia.tipo];
                const IconoEstado = estadoEvidenciaIcons[evidencia.estado];

                if (!IconoTipo || !IconoEstado) {
                  return null;
                }

                return (
                  <motion.div
                    key={evidencia.id}
                    whileHover={{ x: 2 }}
                    className="flex items-center justify-between p-2 rounded-lg border border-border hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <IconoTipo className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{evidencia.nombre}</span>
                    </div>
                    <IconoEstado
                      className={`h-4 w-4 ${estadoEvidenciaColors[evidencia.estado]}`}
                      title={evidencia.estado}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* C) Datos clave */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Datos clave
            </h3>
            <div className="space-y-2">
              {capitulo.datosClaves.map((dato, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{dato.label}</span>
                  <span className="text-sm font-medium">{dato.valor}</span>
                </div>
              ))}
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
