import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChevronDown, SlidersHorizontal, MapPin, Filter, Layers } from 'lucide-react';
import { cn } from './ui/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type AgruparPor = 'Departamento' | 'Municipio';

const REGIONES_COLOMBIA = {
  'Antioquia': ['Dabeiba', 'Andes', 'Concordia', 'Jericó', 'Salgar'],
  'Huila': ['Palestina', 'Pitalito', 'San Agustín', 'Acevedo', 'Garzón'],
  'Cauca': ['Piendamó', 'Santander de Quilichao', 'Totoró', 'Inzá'],
  'Tolima': ['Planadas', 'Ibagué', 'Líbano', 'Chaparral'],
  'Caldas': ['Manizales', 'Chinchiná', 'Palestina', 'Anserma']
};

interface ControlBarProps {
  onAgruparChange: (tipo: AgruparPor) => void;
  onOrdenarChange: (orden: string) => void;
  onFiltroChange?: (filtros: any) => void;
}

export function ControlBar({ onAgruparChange, onOrdenarChange, onFiltroChange }: ControlBarProps) {
  const [agruparSeleccionado, setAgruparSeleccionado] = useState<AgruparPor>('Departamento');
  const [departamento, setDepartamento] = useState<string>('all');
  const [municipio, setMunicipio] = useState<string>('all');
  const [ueVerificado, setUeVerificado] = useState(false);
  const [jovenes, setJovenes] = useState(false);
  const [mujeres, setMujeres] = useState(false);
  const [indigenas, setIndigenas] = useState(false);
  const [procesosSeleccionados, setProcesosSeleccionados] = useState<string[]>([]);
  const [notasSeleccionadas, setNotasSeleccionadas] = useState<string[]>([]);

  const opcionesAgrupar: AgruparPor[] = ['Departamento', 'Municipio'];
  const procesos = ['Lavado', 'Honey', 'Natural'];
  const notas = ['Especiado', 'Floral', 'Frutal', 'Colombia'];

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

  useEffect(() => {
    if (onFiltroChange) {
      onFiltroChange({
        departamento,
        municipio,
        ueVerificado,
        impactos: { jovenes, mujeres, indigenas },
        procesosSeleccionados,
        notasSeleccionadas
      });
    }
  }, [departamento, municipio, ueVerificado, jovenes, mujeres, indigenas, procesosSeleccionados, notasSeleccionadas]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className="bg-white rounded-xl border border-border shadow-sm p-4 mb-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Col 1: Ubicación y Origen (4/12) */}
        <div className="lg:col-span-4 space-y-4 pr-6 border-r border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-[#bb8d3b] rounded-full" />
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#bb8d3b]">Ubicación y Origen</h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Departamento</Label>
              <Select value={departamento} onValueChange={(val) => { setDepartamento(val); setMunicipio('all'); }}>
                <SelectTrigger className="h-10 rounded-xl border-gray-100 bg-gray-50/50 text-xs font-bold">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.keys(REGIONES_COLOMBIA).map(dep => (
                    <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Municipio</Label>
              <Select value={municipio} onValueChange={setMunicipio} disabled={departamento === 'all'}>
                <SelectTrigger className="h-10 rounded-xl border-gray-100 bg-gray-50/50 text-xs font-bold disabled:opacity-30">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {departamento !== 'all' && REGIONES_COLOMBIA[departamento as keyof typeof REGIONES_COLOMBIA].map(mun => (
                    <SelectItem key={mun} value={mun}>{mun}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50/50 px-3 py-2 rounded-xl border border-gray-100 mt-2">
            <Switch id="ue-banco" checked={ueVerificado} onCheckedChange={setUeVerificado} />
            <Label htmlFor="ue-banco" className="text-[11px] font-bold text-gray-500 cursor-pointer uppercase">
              Solo UE verificado (EUDR)
            </Label>
          </div>
        </div>

        {/* Col 2: Perfil de Taza (4/12) */}
        <div className="lg:col-span-5 space-y-6 pr-6 border-r border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-[#8a9a8a] rounded-full" />
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#8a9a8a]">Perfil de Taza</h4>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] font-black uppercase text-gray-400 w-16">Proceso</span>
              <div className="flex gap-2">
                {procesos.map((proceso) => (
                  <Badge
                    key={proceso}
                    variant={procesosSeleccionados.includes(proceso) ? 'default' : 'outline'}
                    className={cn(
                      "cursor-pointer select-none text-[11px] px-3 py-1.5 rounded-lg transition-all",
                      procesosSeleccionados.includes(proceso) ? "bg-[#bb8d3b]" : "hover:border-[#bb8d3b]/30"
                    )}
                    onClick={() => toggleProceso(proceso)}
                  >
                    {proceso}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] font-black uppercase text-gray-400 w-16">Macroperfil</span>
              <div className="flex flex-wrap gap-2">
                {notas.map((nota) => (
                  <motion.div key={nota} whileTap={{ scale: 0.98 }}>
                    {nota === 'Colombia' ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={notasSeleccionadas.includes(nota) ? 'default' : 'outline'}
                              className={cn(
                                "cursor-pointer select-none text-[11px] px-3 py-1.5 rounded-lg",
                                notasSeleccionadas.includes(nota) ? "bg-[#e3d5b8] text-[#5f705f]" : "hover:border-[#e3d5b8]/30"
                              )}
                              onClick={() => toggleNota(nota)}
                            >
                              {nota}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-4 bg-white border-[#5f705f]/20 shadow-xl">
                            <p className="font-bold text-[#5f705f] mb-1">Perfil Colombia</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              Chocolate, cítrico, panela. Acidez baja, cuerpo medio bajo, posgusto ligero.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge
                        variant={notasSeleccionadas.includes(nota) ? 'default' : 'outline'}
                        className={cn(
                          "cursor-pointer select-none text-[11px] px-3 py-1.5 rounded-lg",
                          notasSeleccionadas.includes(nota) ? "bg-[#8a9a8a]" : "hover:border-[#8a9a8a]/30"
                        )}
                        onClick={() => toggleNota(nota)}
                      >
                        {nota}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Impacto Social y Vista (3/12) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Subsección: Impacto Social */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-3 bg-[#e3d5b8] rounded-full" />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#5f705f]">Impacto Social</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                {[
                  { id: 'jovenes', label: 'Jóvenes', icon: '🌱', state: jovenes, set: setJovenes },
                  { id: 'mujeres', label: 'Mujeres', icon: '💜', state: mujeres, set: setMujeres },
                  { id: 'indigenas', label: 'Indígena', icon: '🏺', state: indigenas, set: setIndigenas }
                ].map(item => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => item.set(!item.state)}
                        className={cn(
                          "flex-1 py-1.5 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 min-w-[60px]",
                          item.state ? "bg-[#5f705f] border-[#5f705f] text-white shadow-lg shadow-[#5f705f]/20" : "bg-white border-gray-100 text-gray-400 hover:border-[#5f705f]/20"
                        )}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p className="text-[10px]">Filtrar por origen de {item.label.toLowerCase()}</p></TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          {/* Subsección: Configuración de Vista */}
          <div className="pt-3 border-t border-gray-50 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-3 bg-[#bb8d3b]/30 rounded-full" />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Personalizar Vista</h4>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-gray-400">Agrupar por</span>
              <div className="flex bg-gray-100 p-0.5 rounded-lg ml-2">
                {opcionesAgrupar.map(op => (
                  <button
                    key={op}
                    onClick={() => handleAgruparClick(op)}
                    className={cn(
                      "px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all",
                      agruparSeleccionado === op ? "bg-white text-[#5f705f] shadow-sm" : "text-gray-400"
                    )}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-gray-400">Ordenar</span>
              <Select defaultValue="relevancia" onValueChange={onOrdenarChange}>
                <SelectTrigger className="h-7 w-24 bg-transparent border-none text-[10px] font-bold p-0 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Relevancia</SelectItem>
                  <SelectItem value="puntaje">Puntaje</SelectItem>
                  <SelectItem value="disponibilidad">Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
