import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Sun,
    Wheat,
    CheckCircle2,
    Calendar,
    ChevronDown,
    ChevronUp,
    Scale,
    TrendingDown,
    Award,
    Clock,
    Sparkles,
} from 'lucide-react';
import { cn } from '../../components/ui/utils';
import type { Cosecha } from '../../../types/cosecha';

interface Props {
    lote: Cosecha;
}

interface EtapaConfig {
    key: number;
    nombre: string;
    subtitulo: string;
    icono: any;
    colorActivo: string;
    bgActivo: string;
    borderActivo: string;
}

const ETAPAS: EtapaConfig[] = [
    {
        key: 1,
        nombre: 'Cereza',
        subtitulo: 'Recolección',
        icono: Sparkles,
        colorActivo: 'text-red-700',
        bgActivo: 'bg-red-500',
        borderActivo: 'border-red-500',
    },
    {
        key: 2,
        nombre: 'Secado',
        subtitulo: 'Marquesina / Silo',
        icono: Sun,
        colorActivo: 'text-amber-800',
        bgActivo: 'bg-amber-500',
        borderActivo: 'border-amber-500',
    },
    {
        key: 3,
        nombre: 'Pergamino',
        subtitulo: 'Seco al 11%',
        icono: Wheat,
        colorActivo: 'text-emerald-800',
        bgActivo: 'bg-emerald-600',
        borderActivo: 'border-emerald-600',
    },
    {
        key: 4,
        nombre: 'Verde',
        subtitulo: 'Trilla & Venta',
        icono: Award,
        colorActivo: 'text-[#1d3d24]',
        bgActivo: 'bg-[#2d5a37]',
        borderActivo: 'border-[#2d5a37]',
    },
];

export function TimelineCosecha({ lote }: Props) {
    const [expandido, setExpandido] = useState(false);

    // Mapeo de fase actual: 0=planeado, 1=cereza, 2=seco (en secado o pergamino), 3=verde
    const faseActual = Math.max(1, lote.fase || 1);
    const pergaminoListo = (lote.pesos?.pergamino || 0) > 0;
    const etapaIndice = faseActual === 3 ? 4 : pergaminoListo ? 3 : faseActual === 2 ? 2 : 1;

    // Métricas de conversión y merma
    const kgCereza = lote.pesos?.cereza || 0;
    const kgPergamino = lote.pesos?.pergamino || 0;
    const kgVerde = lote.pesos?.verde || 0;

    const tieneMermaPergamino = kgCereza > 0 && kgPergamino > 0;
    const factorRendimiento = tieneMermaPergamino ? (kgCereza / kgPergamino).toFixed(1) : null;
    const mermaHumedad = tieneMermaPergamino ? Math.round(((kgCereza - kgPergamino) / kgCereza) * 100) : null;

    // Estimación amigable de fechas si no están grabadas explícitamente
    const fechaBase = lote.cosecha ? new Date(lote.cosecha) : new Date();
    const fechaCerezaTxt = fechaBase.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });

    const fechaSecado = new Date(fechaBase);
    fechaSecado.setDate(fechaSecado.getDate() + 2);
    const fechaSecadoTxt = fechaSecado.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });

    return (
        <div className="rounded-2xl bg-gradient-to-b from-gray-50/90 to-white border border-gray-200/90 p-3.5 space-y-3 shadow-inner">
            {/* Cabecera de la línea de tiempo */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#5f705f]" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-600">
                        Ruta de Trazabilidad
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setExpandido(!expandido)}
                    className="inline-flex items-center gap-1 text-[11px] font-black text-[#5f705f] hover:text-[#455245] transition-colors"
                >
                    <span>{expandido ? 'Ocultar bitácora' : 'Ver bitácora'}</span>
                    {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            {/* Stepper visual horizontal */}
            <div className="relative pt-1 pb-2">
                {/* Línea conectora base */}
                <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full -z-0" />
                {/* Línea conectora activa */}
                <div
                    className="absolute top-5 left-5 h-1 bg-[#2d5a37] rounded-full transition-all duration-500 -z-0"
                    style={{
                        width: `${Math.min(100, Math.max(0, ((etapaIndice - 1) / (ETAPAS.length - 1)) * 100))}%`,
                    }}
                />

                <div className="grid grid-cols-4 relative z-10">
                    {ETAPAS.map((etapa) => {
                        const completado = etapa.key < etapaIndice;
                        const actual = etapa.key === etapaIndice;
                        const futuro = etapa.key > etapaIndice;
                        const Icon = etapa.icono;

                        return (
                            <div key={etapa.key} className="flex flex-col items-center text-center">
                                <div
                                    className={cn(
                                        'h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 font-black text-xs shadow-sm',
                                        completado
                                            ? 'bg-[#2d5a37] text-white ring-4 ring-white'
                                            : actual
                                            ? `${etapa.bgActivo} text-white ring-4 ring-amber-100 animate-pulse`
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                    )}
                                >
                                    {completado ? <CheckCircle2 size={16} /> : <Icon size={14} />}
                                </div>
                                <span
                                    className={cn(
                                        'text-[11px] font-black mt-1.5 leading-tight truncate px-1',
                                        actual
                                            ? etapa.colorActivo
                                            : completado
                                            ? 'text-gray-800'
                                            : 'text-gray-400'
                                    )}
                                >
                                    {etapa.nombre}
                                </span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                                    {actual ? 'En curso' : completado ? 'Listo' : 'Próximo'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Días en secado si está en etapa 2 */}
            {etapaIndice === 2 && (
                <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-amber-900">
                    <div className="flex items-center gap-2">
                        <Sun size={16} className="text-amber-600 animate-spin-slow" />
                        <div>
                            <p className="text-[12px] font-black leading-none">Café en marquesina solar</p>
                            <p className="text-[11px] text-amber-700/80 font-medium mt-0.5">Control de secado hacia 10%-12% de humedad</p>
                        </div>
                    </div>
                    <span className="text-[11px] font-black bg-amber-500/20 px-2 py-0.5 rounded-md text-amber-800">
                        ☀️ Día 5
                    </span>
                </div>
            )}

            {/* Panel desplegable con Bitácora y Conversión de Kilos */}
            <AnimatePresence>
                {expandido && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2 border-t border-gray-200/80 overflow-hidden"
                    >
                        {/* Rendimiento & Merma */}
                        {tieneMermaPergamino ? (
                            <div className="rounded-xl bg-white border border-gray-200 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase text-gray-400 flex items-center gap-1">
                                        <Scale size={13} className="text-[#5f705f]" /> Rendimiento Grano a Grano
                                    </span>
                                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        Factor: {factorRendimiento} a 1
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Cereza ingresada</span>
                                        <span className="font-black text-gray-900 text-sm">{kgCereza} kg</span>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Pergamino seco obtenido</span>
                                        <span className="font-black text-[#2d5a37] text-sm">{kgPergamino} kg</span>
                                    </div>
                                </div>
                                {mermaHumedad && (
                                    <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                                        <TrendingDown size={13} className="text-amber-600" />
                                        <span>Pérdida por secado y evaporación de agua: <strong>~{mermaHumedad}%</strong></span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-2.5 text-center">
                                <p className="text-[11px] font-bold text-gray-500">
                                    Anota los kilos de pergamino seco cuando termine de secar para calcular el factor de rendimiento exacto.
                                </p>
                            </div>
                        )}

                        {/* Hitos cronológicos del lote */}
                        <div className="space-y-2 pt-1">
                            <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                                Eventos registrados
                            </p>

                            <div className="space-y-2 relative pl-4 border-l-2 border-[#5f705f]/30">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#5f705f]" />
                                    <div className="text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-black text-gray-900">Recolección de cereza</span>
                                            <span className="text-[10px] font-bold text-gray-400">{fechaCerezaTxt}</span>
                                        </div>
                                        <p className="text-gray-500 text-[11px]">
                                            {kgCereza > 0 ? `${kgCereza} kilos recolectados` : 'Lote iniciado'} en {lote.finca}
                                        </p>
                                    </div>
                                </div>

                                {etapaIndice >= 2 && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                                        <div className="text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="font-black text-gray-900">Ingreso a secadero solar</span>
                                                <span className="text-[10px] font-bold text-gray-400">{fechaSecadoTxt}</span>
                                            </div>
                                            <p className="text-gray-500 text-[11px]">
                                                Proceso {lote.detallesObjetivo?.proceso || 'Lavado'} bajo sombra controlada
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {etapaIndice >= 3 && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                                        <div className="text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="font-black text-gray-900">Pergamino seco estabilizado</span>
                                                <span className="text-[10px] font-bold text-emerald-700">Listo para reposo</span>
                                            </div>
                                            <p className="text-gray-500 text-[11px]">{kgPergamino} kg de pergamino seco listo para muestra o trilla</p>
                                        </div>
                                    </div>
                                )}

                                {etapaIndice >= 4 && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#1d3d24]" />
                                        <div className="text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="font-black text-gray-900">Café verde / Trillado</span>
                                                <span className="text-[10px] font-bold text-[#1d3d24]">Oferta lista</span>
                                            </div>
                                            <p className="text-gray-500 text-[11px]">{kgVerde} kg café verde trillado listo para exportación o tostador</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}