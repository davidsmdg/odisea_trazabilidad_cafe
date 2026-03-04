"use client";

import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Star, Shield, CheckCircle2, Share2, Download, MapPin, Wind, Layers } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroLoteProps {
  lote: {
    titulo: string;
    finca: string;
    departamento: string;
    altitud: string;
    proceso: string;
    variedad: string;
    cosecha: string;
    reputacion: number;
    cumplimientoUE: 'Verificado' | 'En revisión' | 'Pendiente';
    cadena: 'Completa' | 'Parcial';
  };
}

export function HeroLote({ lote }: HeroLoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 overflow-hidden rounded-3xl border border-border bg-white shadow-xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Imagen del lote */}
        <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1762195657410-112fbc6f2d17?q=80&w=1080"
            alt="Coffee lot"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute top-6 left-6">
            <Badge className="bg-[#973333] text-white border-none px-4 py-1 text-sm font-serif italic">
              Edición Limitada
            </Badge>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-7 p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#973333] font-medium text-sm mb-4 tracking-widest uppercase">
              <MapPin className="h-4 w-4" />
              <span>{lote.departamento}, Colombia</span>
            </div>
            
            <h1 className="text-5xl font-serif text-[#2C5F2D] mb-4 leading-tight">
              {lote.titulo}
            </h1>
            
            <p className="text-xl text-gray-600 font-serif italic mb-8">
              "{lote.finca} — Una joya del Huila a {lote.altitud}."
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">Proceso</span>
                <div className="flex items-center gap-2 text-[#2C5F2D]">
                  <Wind className="h-4 w-4" />
                  <span className="font-bold">{lote.proceso}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">Variedad</span>
                <div className="flex items-center gap-2 text-[#2C5F2D]">
                  <Layers className="h-4 w-4" />
                  <span className="font-bold">{lote.variedad}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">Cosecha</span>
                <div className="flex items-center gap-2 text-[#2C5F2D]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-bold">{lote.cosecha}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">Puntaje SCA</span>
                <div className="flex items-center gap-2 text-[#973333]">
                  <Star className="h-4 w-4 fill-[#973333]" />
                  <span className="font-bold">87.5 pts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-border">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 font-bold leading-none mb-1">Status EUDR</span>
                  <Badge className={lote.cumplimientoUE === 'Verificado' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}>
                    {lote.cumplimientoUE}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-3 rounded-full border border-border text-gray-400 hover:text-[#2C5F2D] transition-colors cursor-pointer">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-3 rounded-full border border-border text-gray-400 hover:text-[#2C5F2D] transition-colors cursor-pointer">
                <Download className="h-5 w-5" />
              </button>
              <button className="px-8 py-3 bg-[#2C5F2D] text-white rounded-full font-bold shadow-lg hover:shadow-2xl hover:bg-[#234d24] transition-all cursor-pointer">
                Solicitar Muestra
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
