"use client";

import { motion, AnimatePresence } from 'motion/react';
import { X, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface EslabonDrawerProps {
  eslabon: {
    id: string;
    titulo: string;
    descripcion: string;
    responsable: string;
    fecha: string;
    evidencias: Array<{
      nombre: string;
      tipo: string;
      estado: string;
    }>;
    calificaciones: Array<{
      dimension: string;
      estrellas: number;
      comentario: string;
    }>;
    observaciones: string[];
  } | null;
  onClose: () => void;
}

export function EslabonDrawer({ eslabon, onClose }: EslabonDrawerProps) {
  if (!eslabon) return null;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 350, duration: 0.26 }}
        className="fixed right-0 top-0 h-full w-full max-w-[620px] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  Eslabón: {eslabon.titulo}
                </h2>
                <p className="text-sm text-muted-foreground">{eslabon.descripcion}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido con Tabs */}
        <div className="p-6">
          <Tabs defaultValue="resumen" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="evidencias">Evidencias</TabsTrigger>
              <TabsTrigger value="calificaciones">Calificaciones</TabsTrigger>
              <TabsTrigger value="observaciones">Observaciones</TabsTrigger>
            </TabsList>

            {/* Tab Resumen */}
            <TabsContent value="resumen" className="space-y-4 mt-6">
              <div>
                <h3 className="font-semibold mb-3">Descripción del proceso</h3>
                <p className="text-sm text-muted-foreground">{eslabon.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Responsable</p>
                  <p className="font-medium">{eslabon.responsable}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                  <p className="font-medium">{eslabon.fecha}</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  Este eslabón cuenta con <strong>{eslabon.evidencias.length} evidencias</strong>{' '}
                  verificadas y <strong>{eslabon.calificaciones.length} calificaciones</strong> de
                  validadores.
                </p>
              </div>
            </TabsContent>

            {/* Tab Evidencias */}
            <TabsContent value="evidencias" className="space-y-3 mt-6">
              {eslabon.evidencias.map((evidencia, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{evidencia.nombre}</p>
                    <p className="text-xs text-muted-foreground">{evidencia.tipo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        evidencia.estado === 'Verificado'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }
                    >
                      {evidencia.estado}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Tab Calificaciones */}
            <TabsContent value="calificaciones" className="space-y-4 mt-6">
              {eslabon.calificaciones.map((calificacion, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{calificacion.dimension}</h4>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < calificacion.estrellas
                              ? 'text-primary fill-primary'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{calificacion.comentario}</p>
                </div>
              ))}
            </TabsContent>

            {/* Tab Observaciones */}
            <TabsContent value="observaciones" className="space-y-3 mt-6">
              {eslabon.observaciones.length > 0 ? (
                eslabon.observaciones.map((obs, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg border border-border">
                    <p className="text-sm">{obs}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay observaciones para este eslabón
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}