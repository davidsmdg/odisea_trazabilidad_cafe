import { useState } from 'react';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

type AgruparPor = 'Municipio' | 'Finca' | 'Cooperativa' | 'Variedad';

interface ControlBarProps {
  onAgruparChange: (tipo: AgruparPor) => void;
  onOrdenarChange: (orden: string) => void;
}

export function ControlBar({ onAgruparChange, onOrdenarChange }: ControlBarProps) {
  const [agruparSeleccionado, setAgruparSeleccionado] = useState<AgruparPor>('Finca');
  const [ueVerificado, setUeVerificado] = useState(false);
  const [impactoAlto, setImpactoAlto] = useState(false);
  const [procesosSeleccionados, setProcesosSeleccionados] = useState<string[]>([]);
  const [notasSeleccionadas, setNotasSeleccionadas] = useState<string[]>([]);

  const opcionesAgrupar: AgruparPor[] = ['Municipio', 'Finca', 'Cooperativa', 'Variedad'];
  const procesos = ['Lavado', 'Honey', 'Natural'];
  const notas = ['Chocolate', 'Floral', 'Cítrico', 'Caramelo', 'Frutos rojos', 'Especias'];

  const handleAgruparClick = (opcion: AgruparPor) => {
    setAgruparSeleccionado(opcion);
    onAgruparChange(opcion);
  };

  const toggleProceso = (proceso: string) => {
    setProcesosSeleccionados((prev) =>
      prev.includes(proceso) ? prev.filter((p) => p !== proceso) : [...prev, proceso]
    );
  };

  const toggleNota = (nota: string) => {
    setNotasSeleccionadas((prev) =>
      prev.includes(nota) ? prev.filter((n) => n !== nota) : [...prev, nota]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className="bg-white rounded-xl border border-border shadow-sm p-4 mb-6"
    >
      <div className="space-y-4">
        {/* Segmented Control - Agrupar por */}
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">Agrupar por</Label>
          <div className="inline-flex bg-secondary rounded-lg p-1 gap-1">
            {opcionesAgrupar.map((opcion) => (
              <motion.button
                key={opcion}
                onClick={() => handleAgruparClick(opcion)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  agruparSeleccionado === opcion
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {opcion}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filtros rápidos y Ordenar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Toggles */}
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
            <Switch id="ue-banco" checked={ueVerificado} onCheckedChange={setUeVerificado} />
            <Label htmlFor="ue-banco" className="text-sm cursor-pointer whitespace-nowrap">
              Solo UE verificado
            </Label>
          </div>

          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
            <Switch id="impacto-banco" checked={impactoAlto} onCheckedChange={setImpactoAlto} />
            <Label htmlFor="impacto-banco" className="text-sm cursor-pointer whitespace-nowrap">
              Impacto social alto
            </Label>
          </div>

          {/* Chips de proceso */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Proceso:</span>
            {procesos.map((proceso) => (
              <motion.div key={proceso} whileTap={{ scale: 0.98 }}>
                <Badge
                  variant={procesosSeleccionados.includes(proceso) ? 'default' : 'outline'}
                  className="cursor-pointer select-none"
                  onClick={() => toggleProceso(proceso)}
                >
                  {proceso}
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* Chips de notas (primeros 4 visibles) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Notas:</span>
            {notas.slice(0, 4).map((nota) => (
              <motion.div key={nota} whileTap={{ scale: 0.98 }}>
                <Badge
                  variant={notasSeleccionadas.includes(nota) ? 'default' : 'outline'}
                  className="cursor-pointer select-none"
                  onClick={() => toggleNota(nota)}
                >
                  {nota}
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* Más filtros (Popover) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Más filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Notas adicionales</h4>
                  <div className="flex flex-wrap gap-2">
                    {notas.slice(4).map((nota) => (
                      <Badge
                        key={nota}
                        variant={notasSeleccionadas.includes(nota) ? 'default' : 'outline'}
                        className="cursor-pointer select-none"
                        onClick={() => toggleNota(nota)}
                      >
                        {nota}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Ordenar */}
          <div className="ml-auto flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap">Ordenar:</Label>
            <Select defaultValue="relevancia" onValueChange={onOrdenarChange}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevancia</SelectItem>
                <SelectItem value="puntaje">Puntaje de taza</SelectItem>
                <SelectItem value="reputacion">Reputación</SelectItem>
                <SelectItem value="disponibilidad">Disponibilidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
