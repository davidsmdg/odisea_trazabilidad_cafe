import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Newspaper,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    Sun,
    Calendar,
    Award,
    Sparkles,
    X,
} from 'lucide-react';

interface NoticiaCafe {
    id: string;
    categoria: string;
    titulo: string;
    resumen: string;
    hora: string;
    icono: any;
    colorIcono: string;
}

const NOTICIAS_DEL_DIA: NoticiaCafe[] = [
    {
        id: 'noticia-1',
        categoria: 'Mercado de Café',
        titulo: 'Bolsa de Nueva York y carga nacional al alza',
        resumen: 'La demanda de cafés especiales colombianos impulsa el precio de la carga por encima de los $2.140.000 COP en las principales cooperativas de Huila y Antioquia.',
        hora: 'Hoy · 07:30 AM',
        icono: TrendingUp,
        colorIcono: 'text-emerald-400 bg-emerald-950/60',
    },
    {
        id: 'noticia-2',
        categoria: 'Clima y Cosecha',
        titulo: 'Pronóstico de clima favorable para el secado',
        resumen: 'Se esperan días mayormente soleados en la zona andina durante los próximos 4 días, ideal para secado en marquesinas y silos solares.',
        hora: 'Hoy · 06:15 AM',
        icono: Sun,
        colorIcono: 'text-amber-400 bg-amber-950/60',
    },
    {
        id: 'noticia-3',
        categoria: 'Calidad y Catación',
        titulo: 'Compradores internacionales buscan microlotes con trazabilidad EUDR',
        resumen: 'Lotes que certifiquen geolocalización y cero deforestación están recibiendo primas adicionales entre el 15% y el 25% por encima del precio base.',
        hora: 'Ayer · 04:45 PM',
        icono: Award,
        colorIcono: 'text-blue-400 bg-blue-950/60',
    },
    {
        id: 'noticia-4',
        categoria: 'FNC & Cooperativas',
        titulo: 'Jornada de entrega de fertilizantes y asistencia técnica',
        resumen: 'Las asociaciones cafeteras abren inscripciones para el subsidio de insumos orgánicos y renovación de cafetales en este semestre.',
        hora: 'Ayer · 02:00 PM',
        icono: Sparkles,
        colorIcono: 'text-purple-400 bg-purple-950/60',
    },
];

export function BarraPrecioTicker() {
    const [expandido, setExpandido] = useState<boolean>(false);

    return (
        <div className="w-full bg-[#1b2b1e] border-b border-[#2d4231] select-none">
            {/* ── Barra tocable de titulares de noticias ── */}
            <button
                type="button"
                onClick={() => setExpandido(!expandido)}
                className="w-full py-2.5 px-3 flex items-center justify-between text-left text-white active:bg-[#233827] transition-colors focus:outline-none"
                aria-label="Ver noticias del día"
            >
                {/* Insignia NOTICIAS */}
                <div className="shrink-0 flex items-center gap-1.5 bg-[#263e2a] px-3 py-1 rounded-full text-[#a4d4ab] uppercase tracking-wider text-[11px] font-black mr-2.5 z-10 shadow-sm border border-[#3b5b3f]/60">
                    <Newspaper size={13} className="text-[#64d87c]" />
                    <span>NOTICIAS</span>
                </div>

                {/* Texto marquesina lento y legible con los titulares de noticias */}
                <div className="flex-1 overflow-hidden relative mr-2">
                    <div className="producer-ticker-track flex items-center gap-10">
                        {[...NOTICIAS_DEL_DIA, ...NOTICIAS_DEL_DIA].map((n, idx) => (
                            <div key={`${n.id}-${idx}`} className="flex items-center gap-2.5 whitespace-nowrap text-[13px]">
                                <span className="text-emerald-400 font-black uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/40">
                                    {n.categoria}
                                </span>
                                <span className="text-white font-bold tracking-tight">{n.titulo}</span>
                                <span className="text-gray-500 font-medium text-[11px]">{n.hora}</span>
                                <span className="text-gray-600 ml-2">•</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botón de expandir / colapsar */}
                <div className="shrink-0 pl-1 text-[#a4d4ab] flex items-center">
                    {expandido ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </button>

            {/* ── Panel Expandido con las noticias del día ── */}
            <AnimatePresence>
                {expandido && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="overflow-hidden bg-[#162419] border-t border-[#2d4231] shadow-2xl"
                    >
                        <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
                            {/* Cabecera del panel */}
                            <div className="flex items-center justify-between pb-2 border-b border-[#2d4231]">
                                <div>
                                    <h3 className="text-white font-black text-[15px] flex items-center gap-2">
                                        <Newspaper size={16} className="text-[#64d87c]" />
                                        Noticias del Café y del Campo
                                    </h3>
                                    <p className="text-[12px] text-gray-400">Información clave y novedades para productores</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setExpandido(false)}
                                    className="h-8 w-8 rounded-full bg-[#263e2a] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                                    aria-label="Cerrar noticias"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Listado de noticias */}
                            <div className="space-y-2.5 pt-1">
                                {NOTICIAS_DEL_DIA.map((n) => {
                                    const Icono = n.icono;
                                    return (
                                        <div
                                            key={n.id}
                                            className="rounded-2xl bg-[#1b2b1e] border border-[#2b412f] p-3.5 hover:border-[#3d5a42] transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${n.colorIcono}`}>
                                                    <Icono size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                                                            {n.categoria}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400 font-medium shrink-0 flex items-center gap-1">
                                                            <Calendar size={11} /> {n.hora}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-[14px] font-black text-white leading-snug mb-1">
                                                        {n.titulo}
                                                    </h4>
                                                    <p className="text-[13px] text-gray-300 font-normal leading-relaxed">
                                                        {n.resumen}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
