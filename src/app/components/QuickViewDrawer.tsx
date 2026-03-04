import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { X, ExternalLink, Shield, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface QuickViewDrawerProps {
  lote: {
    id: string;
    titulo: string;
    finca: string;
    departamento: string;
    proceso: string;
    variedad: string;
    cosecha: string;
    puntaje: number;
    reputacion: string;
    ueEstado: string;
    evidencias: number;
    cadena: Array<{
      paso: string;
      estado: 'Verificado' | 'Documentado' | 'Pendiente';
    }>;
  } | null;
  onClose: () => void;
}

const estadoIcons = {
  Verificado: CheckCircle2,
  Documentado: FileText,
  Pendiente: Clock,
};

const estadoColors = {
  Verificado: 'text-primary',
  Documentado: 'text-blue-600',
  Pendiente: 'text-gray-400',
};

export function QuickViewDrawer({ lote, onClose }: QuickViewDrawerProps) {
  const navigate = useNavigate();
  
  if (!lote) return null;

  const handleVerTrazabilidad = () => {
    navigate(`/lote/${lote.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="quick-view-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        key="quick-view-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 350, duration: 0.26 }}
        className="fixed right-0 top-0 h-full w-full max-w-[560px] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {lote.titulo}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {lote.finca} • {lote.departamento}
                </p>
                <Button variant="link" className="p-0 h-auto text-sm gap-1">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ir al perfil de finca
                </Button>
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

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Resumen */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              Resumen
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Proceso</span>
                <Badge variant="outline">{lote.proceso}</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Variedad</span>
                <span className="font-medium">{lote.variedad}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Cosecha</span>
                <span className="font-medium">{lote.cosecha}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Puntaje de taza</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                    {lote.puntaje}
                  </span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Reputación</span>
                <Badge className="bg-primary text-primary-foreground">{lote.reputacion}</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Estado UE</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground">{lote.ueEstado}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Evidencias: {lote.evidencias} archivos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cadena de trazabilidad (resumen) */}
          <div>
            <h3 className="font-semibold mb-4">Cadena de trazabilidad (resumen)</h3>
            
            {/* Timeline horizontal */}
            <div className="relative">
              {/* Línea conectora */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />

              <div className="relative flex justify-between">
                {lote.cadena.map((paso, index) => {
                  const Icon = estadoIcons[paso.estado];
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      {/* Icono del paso */}
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 ${
                        paso.estado === 'Verificado' ? 'border-primary' : 
                        paso.estado === 'Documentado' ? 'border-blue-600' : 
                        'border-gray-300'
                      }`}>
                        <Icon className={`h-5 w-5 ${estadoColors[paso.estado]}`} />
                      </div>
                      {/* Nombre del paso */}
                      <p className="text-xs text-center font-medium max-w-[60px]">{paso.paso}</p>
                      {/* Estado */}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          paso.estado === 'Verificado' ? 'border-primary text-primary' :
                          paso.estado === 'Documentado' ? 'border-blue-600 text-blue-600' :
                          'border-gray-400 text-gray-600'
                        }`}
                      >
                        {paso.estado}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Info UE destacada */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Cumplimiento UE verificado</h4>
                <p className="text-sm text-muted-foreground">
                  Este lote cumple con todos los requisitos EUDR. Coordenadas geográficas
                  verificadas y documentación completa.
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base" onClick={handleVerTrazabilidad}>
              Abrir trazabilidad completa
            </Button>
            <Button variant="outline" className="w-full h-11">
              Reservar lote
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}