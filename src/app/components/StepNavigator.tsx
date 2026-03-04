"use client";

import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import {
  Sprout,
  ScissorsSquare,
  Droplets,
  Sun,
  Warehouse,
  Ship,
  Coffee,
  ShoppingCart,
} from 'lucide-react';

export interface Step {
  id: string;
  nombre: string;
  estado: 'Verificado' | 'Documentado' | 'Pendiente' | 'Riesgo';
  icon: any;
}

const estadoColors = {
  Verificado: 'bg-primary text-primary-foreground border-primary',
  Documentado: 'bg-gray-200 text-gray-700 border-gray-300',
  Pendiente: 'bg-orange-100 text-orange-700 border-orange-300',
  Riesgo: 'bg-[#973333] text-white border-[#973333]',
};

interface StepNavigatorProps {
  steps: Step[];
  activeStep: string;
  onStepClick: (stepId: string) => void;
}

export function StepNavigator({ steps, activeStep, onStepClick }: StepNavigatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm mb-8"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;

            return (
              <motion.button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'bg-white border-border hover:border-primary/30'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                  {step.nombre}
                </span>
                <Badge
                  className={`text-xs ${estadoColors[step.estado]}`}
                  style={{ fontSize: '10px', padding: '2px 6px' }}
                >
                  {step.estado}
                </Badge>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export const stepIcons = {
  Finca: Sprout,
  Cosecha: ScissorsSquare,
  Beneficio: Droplets,
  Secado: Sun,
  Almacenamiento: Warehouse,
  Exportación: Ship,
  Cata: Coffee,
  Venta: ShoppingCart,
};