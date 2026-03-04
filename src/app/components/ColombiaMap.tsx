import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface DepartmentData {
  id: string;
  name: string;
  cafes: number;
  ueVerificados: number;
  reputacion: 'Alta' | 'Media' | 'Nueva';
  path: string;
  bubblePosition: { x: number; y: number };
}

const departmentsData: DepartmentData[] = [
  {
    id: 'huila',
    name: 'Huila',
    cafes: 24,
    ueVerificados: 18,
    reputacion: 'Alta',
    bubblePosition: { x: 520, y: 420 },
    path: 'M 500 380 L 560 380 L 570 420 L 560 460 L 500 450 L 490 410 Z',
  },
  {
    id: 'narino',
    name: 'Nariño',
    cafes: 18,
    ueVerificados: 14,
    reputacion: 'Alta',
    bubblePosition: { x: 420, y: 520 },
    path: 'M 380 480 L 450 480 L 460 530 L 440 560 L 390 550 L 370 510 Z',
  },
  {
    id: 'antioquia',
    name: 'Antioquia',
    cafes: 12,
    ueVerificados: 8,
    reputacion: 'Media',
    bubblePosition: { x: 480, y: 260 },
    path: 'M 440 220 L 520 220 L 530 280 L 510 310 L 450 300 L 430 260 Z',
  },
  {
    id: 'cauca',
    name: 'Cauca',
    cafes: 9,
    ueVerificados: 7,
    reputacion: 'Alta',
    bubblePosition: { x: 460, y: 450 },
    path: 'M 420 410 L 490 410 L 500 460 L 480 490 L 430 480 L 410 440 Z',
  },
  {
    id: 'tolima',
    name: 'Tolima',
    cafes: 7,
    ueVerificados: 5,
    reputacion: 'Media',
    bubblePosition: { x: 540, y: 340 },
    path: 'M 500 300 L 570 300 L 580 350 L 560 380 L 510 370 L 490 330 Z',
  },
];

interface ColombiaMapProps {
  onDepartmentClick: (department: DepartmentData) => void;
  selectedDepartment: string | null;
}

export function ColombiaMap({ onDepartmentClick, selectedDepartment }: ColombiaMapProps) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8 relative overflow-hidden">
      <TooltipProvider delayDuration={100}>
        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto"
          style={{ minHeight: '500px', maxHeight: '650px' }}
        >
          {/* Fondo del mapa */}
          <rect x="0" y="0" width="800" height="600" fill="#FDFDF8" />

          {/* Departamentos */}
          {departmentsData.map((dept) => (
            <Tooltip key={dept.id}>
              <TooltipTrigger asChild>
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="cursor-pointer"
                  onClick={() => onDepartmentClick(dept)}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.path
                    d={dept.path}
                    fill={selectedDepartment === dept.id ? '#2C5F2D' : '#F5F5DC'}
                    stroke={selectedDepartment === dept.id ? '#2C5F2D' : '#D4D4C8'}
                    strokeWidth="2"
                    initial={{ fill: '#F5F5DC' }}
                    whileHover={{
                      fill: selectedDepartment === dept.id ? '#2C5F2D' : '#E8F5E9',
                    }}
                    transition={{ duration: 0.15 }}
                    style={{
                      filter:
                        selectedDepartment === dept.id
                          ? 'drop-shadow(0 0 8px rgba(44, 95, 45, 0.4))'
                          : 'none',
                    }}
                  />
                </motion.g>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.12 }}
                  className="space-y-1"
                >
                  <h4 className="font-semibold">{dept.name}</h4>
                  <p className="text-sm">Cafés disponibles: {dept.cafes}</p>
                  <p className="text-sm">UE verificados: {dept.ueVerificados}</p>
                  <p className="text-sm">Reputación promedio: {dept.reputacion}</p>
                </motion.div>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Burbujas con conteos */}
          {departmentsData.map((dept) => {
            const bubbleSize = Math.min(80, 40 + dept.cafes * 1.5);
            const isSelected = selectedDepartment === dept.id;

            return (
              <motion.g
                key={`bubble-${dept.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="pointer-events-none"
              >
                {/* Círculo de la burbuja */}
                <circle
                  cx={dept.bubblePosition.x}
                  cy={dept.bubblePosition.y}
                  r={bubbleSize / 2}
                  fill={isSelected ? '#2C5F2D' : 'rgba(44, 95, 45, 0.15)'}
                  stroke={isSelected ? '#2C5F2D' : 'rgba(44, 95, 45, 0.3)'}
                  strokeWidth="2"
                />

                {/* Número de cafés */}
                <text
                  x={dept.bubblePosition.x}
                  y={dept.bubblePosition.y - 8}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="700"
                  fill={isSelected ? '#fff' : '#2C5F2D'}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {dept.cafes}
                </text>

                {/* Etiqueta "cafés" */}
                <text
                  x={dept.bubblePosition.x}
                  y={dept.bubblePosition.y + 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isSelected ? '#fff' : '#5a6f5a'}
                >
                  cafés
                </text>

                {/* Icono de escudo si tiene UE verificados */}
                {dept.ueVerificados > 0 && (
                  <g transform={`translate(${dept.bubblePosition.x + bubbleSize / 2 - 8}, ${dept.bubblePosition.y - bubbleSize / 2 + 8})`}>
                    <circle cx="8" cy="8" r="10" fill="white" />
                    <circle cx="8" cy="8" r="9" fill="#2C5F2D" />
                  </g>
                )}
              </motion.g>
            );
          })}

          {/* Etiquetas de departamentos */}
          {departmentsData.map((dept) => (
            <text
              key={`label-${dept.id}`}
              x={dept.bubblePosition.x}
              y={dept.bubblePosition.y + 60}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#2C5F2D"
              className="pointer-events-none"
            >
              {dept.name}
            </text>
          ))}
        </svg>
      </TooltipProvider>

      {/* Leyenda */}
      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg border border-border p-4 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded-full bg-primary/15 border-2 border-primary/30" />
          <span className="text-muted-foreground">Cafés disponibles</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">UE verificado</span>
        </div>
      </div>
    </div>
  );
}

export type { DepartmentData };
