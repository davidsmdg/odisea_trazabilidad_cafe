import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Award,
    Coffee,
    Star,
    Beaker,
    ShieldCheck,
    Calendar,
    TrendingUp,
    CheckCircle2,
    Medal,
    Search
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Badge } from '../ui/badge';
import { SensorRadar } from '../SensorRadar';

// MOCK DATA para el Historial
const HISTORIAL_MOCK = [
    {
        id: 'LOT-HUILA-084',
        productor: 'María González',
        bache: 'Bache #3',
        fecha: '09 Mar 2024',
        puntaje: 86.5,
        nivel: 'Especialidad',
        perfil: [
            { attribute: 'Acidez', value: 8.0 },
            { attribute: 'Cuerpo', value: 7.5 },
            { attribute: 'Dulzor', value: 8.5 },
            { attribute: 'Balance', value: 8.0 },
            { attribute: 'Limpieza', value: 8.5 }
        ]
    },
    {
        id: 'LOT-HUILA-084',
        productor: 'María González',
        bache: 'Bache #2',
        fecha: '15 Feb 2024',
        puntaje: 86.0,
        nivel: 'Especialidad',
        perfil: [
            { attribute: 'Acidez', value: 7.5 },
            { attribute: 'Cuerpo', value: 8.0 },
            { attribute: 'Dulzor', value: 8.0 },
            { attribute: 'Balance', value: 8.0 },
            { attribute: 'Limpieza', value: 8.5 }
        ]
    },
    {
        id: 'LOT-ANT-112',
        productor: 'Carlos Martínez',
        bache: 'Bache #1',
        fecha: '05 Mar 2024',
        puntaje: 83.0,
        nivel: 'Premium',
        perfil: [
            { attribute: 'Acidez', value: 7.5 },
            { attribute: 'Cuerpo', value: 7.5 },
            { attribute: 'Dulzor', value: 7.5 },
            { attribute: 'Balance', value: 7.0 },
            { attribute: 'Limpieza', value: 8.0 }
        ]
    },
    {
        id: 'LOT-NAR-225',
        productor: 'Jorge Torres',
        bache: 'Bache #1',
        fecha: '01 Mar 2024',
        puntaje: 88.2,
        nivel: 'Especialidad',
        perfil: [
            { attribute: 'Acidez', value: 8.5 },
            { attribute: 'Cuerpo', value: 8.0 },
            { attribute: 'Dulzor', value: 8.5 },
            { attribute: 'Balance', value: 8.5 },
            { attribute: 'Limpieza', value: 9.0 }
        ]
    }
];

import { getLotesMaster, LoteUnificado } from '../../utils/loteStore';

export function HistorialCatas() {
    const [historial, setHistorial] = useState<any[]>([]);
    const [filtroProductor, setFiltroProductor] = useState('');

    useEffect(() => {
        const loaded = getLotesMaster();
        // lotes catados
        const realizadas = loaded.filter(l => l.calificacion && l.calificacion > 0);
        const items = realizadas.map(l => {
            const det = {
                acidez: 8.0,
                cuerpo: 7.5,
                dulzor: 8.0,
                balance: 8.0,
                limpieza: 8.5
            };
            return {
                id: l.id,
                productor: l.productor,
                bache: 'Bache #1',
                fecha: l.fecha || 'Reciente',
                puntaje: l.calificacion,
                nivel: l.calificacion && l.calificacion >= 85 ? 'Especialidad' : 'Premium',
                perfil: [
                    { attribute: 'Acidez', value: det.acidez },
                    { attribute: 'Cuerpo', value: det.cuerpo },
                    { attribute: 'Dulzor', value: det.dulzor },
                    { attribute: 'Balance', value: det.balance },
                    { attribute: 'Limpieza', value: det.limpieza }
                ]
            };
        });
        setHistorial(items);
    }, []);

    const historialFiltrado = historial.filter(cata => 
        cata.productor.toLowerCase().includes(filtroProductor.toLowerCase())
    );

    return (
        <div className="space-y-12 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4">

            {/* GAMIFICATION HEADER */}
            <div className="bg-gradient-to-br from-[#5D4037] to-[#3E2723] rounded-[48px] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                {/* Visual Background Effects */}
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
                    <Medal size={300} />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start justify-between">

                    {/* Catador Info & Nivel */}
                    <div className="flex items-center gap-8 flex-col md:flex-row text-center md:text-left">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-[#EADDCA] shadow-[0_0_30px_rgba(234,221,202,0.3)] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1594834749740-74b3f696ce73?auto=format&fit=crop&q=80&w=250" alt="Catador" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-2 border-[#5D4037] flex items-center gap-1 shadow-xl">
                                <Star size={12} className="fill-amber-950" /> Q-Grader Plata
                            </div>
                        </div>

                        <div>
                            <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tight mb-2">Andrés Valbuena</h1>
                            <p className="text-[#D7CCC8] text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                                <ShieldCheck size={16} className="text-emerald-400" /> Analista Sensorial Certificado SCA
                            </p>

                            <div className="flex gap-4 mt-6 justify-center md:justify-start">
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Muestras Totales</p>
                                    <p className="text-xl font-mono font-black text-white">1,245</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* XP & Progress */}
                    <div className="w-full md:w-[350px] bg-black/20 backdrop-blur-md border border-white/10 p-8 rounded-[32px]">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Siguiente Nivel</p>
                                <p className="text-lg font-black text-amber-400 flex items-center gap-2"><Award size={18} /> Q-Grader ORO</p>
                            </div>
                            <p className="text-sm font-mono font-bold text-white/40">Nivel 42</p>
                        </div>

                        <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 relative"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </motion.div>
                        </div>
                        <p className="text-right text-[10px] font-black uppercase tracking-widest text-white/40 mt-3 pt-3 border-t border-white/10">35 Catas restantes para ascender</p>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT TITLE & FILTER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-2 bg-[#5D4037] rounded-full" />
                    <h2 className="text-3xl font-sans font-black text-[#5D4037] tracking-tight">Registro Histórico de Auditorías Sensoriales</h2>
                </div>
                
                {/* Buscador de Productor */}
                <div className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        placeholder="Buscar por productor..."
                        value={filtroProductor}
                        onChange={(e) => setFiltroProductor(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#EADDCA] bg-[#FDFBF9] font-bold text-xs text-[#5D4037] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 outline-none"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D6E63]" size={16} />
                </div>
            </div>

            {/* HISTORY LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {historialFiltrado.map((cata) => (
                    <motion.div
                        key={cata.id + '-' + cata.bache}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[40px] border border-[#EADDCA] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                    >
                        <div className="flex justify-between items-start gap-4 mb-6">
                            <div className="space-y-2">
                                <div className="flex gap-2 items-center">
                                    <Badge className="bg-[#5D4037]/5 text-[#5D4037] font-black text-[10px] uppercase tracking-widest border-none px-3">
                                        {cata.id}
                                    </Badge>
                                    <Badge className="bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest border border-emerald-200 px-2">
                                        {cata.bache}
                                    </Badge>
                                </div>
                                <p className="text-sm font-bold text-gray-400 flex items-center gap-1"><Calendar size={12} /> {cata.fecha}</p>
                            </div>

                            <div className="text-center bg-[#FDFBF9] border border-[#EADDCA] p-3 rounded-2xl min-w-[100px] shadow-inner shrink-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] mb-1">SCA Score</p>
                                <p className={cn(
                                    "text-3xl font-sans font-black leading-none",
                                    cata.puntaje >= 85 ? "text-emerald-600" : "text-amber-600"
                                )}>{cata.puntaje}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-sans font-black text-[#5D4037]">{cata.productor}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 mt-1">
                                <CheckCircle2 size={12} /> {cata.nivel}
                            </p>
                        </div>

                        {/* Mini Radar Chart */}
                        <div className="mt-auto pt-6 border-t border-[#EADDCA] relative">
                            <div className="w-full h-[180px] bg-[#FDFBF9] rounded-[24px] border border-[#EADDCA]/50 p-4 group-hover:bg-white transition-colors">
                                <SensorRadar data={cata.perfil} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Notice */}
            <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
                <TrendingUp size={24} className="text-amber-600 shrink-0 mt-1" />
                <div>
                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Validación de Experticia B2B</h4>
                    <p className="text-xs text-amber-800/70 font-medium leading-relaxed mt-1">
                        Tu nivel de <strong className="font-bold">Q-Grader</strong> es visible públicamente para los Tostadores en el certificado de trazabilidad. Esto aumenta la confianza del comprador sobre la muestra garantizada en origen.
                    </p>
                </div>
            </div>

        </div>
    );
}
