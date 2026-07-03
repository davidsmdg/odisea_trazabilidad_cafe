import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    Beaker,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Sprout,
    Droplets,
    Microscope,
    ClipboardCheck,
    Coffee,
    Calendar,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Input } from '../ui/input';

const MUESTRAS_MOCK = [
    {
        id: 'LOT-HUILA-084',
        bache: 'Bache #3',
        productor: 'María González',
        finca: 'Finca La Esperanza',
        municipio: 'San Agustín',
        variedad: 'Caturra / Castillo',
        proceso: 'Lavado',
        fechaIngreso: 'Hoy, 08:30 AM',
    },
    {
        id: 'LOT-ANT-112',
        bache: 'Bache #1',
        productor: 'Carlos Martínez',
        finca: 'El Mirador',
        municipio: 'Acevedo',
        variedad: 'Geisha',
        proceso: 'Natural',
        fechaIngreso: 'Hace 3 horas',
    },
    {
        id: 'LOT-NAR-225',
        bache: 'Bache #1',
        productor: 'Jorge Torres',
        finca: 'Santa Helena',
        municipio: 'Garzón',
        variedad: 'Bourbon Rosado',
        proceso: 'Honey',
        fechaIngreso: 'Ayer',
    },
];

import { getLotesMaster, LoteUnificado } from '../../utils/loteStore';

export function MuestrasPendientes() {
    const navigate = useNavigate();
    const [muestras, setMuestras] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loaded = getLotesMaster();
        // Muestras pendientes: lotes que no tengan calificación (o con calificacion <= 0)
        const pendientes = loaded.filter(l => !(l.calificacion && l.calificacion > 0));
        const items = pendientes.map(l => ({
            id: l.id,
            bache: 'Bache #1',
            productor: l.productor,
            finca: l.finca,
            municipio: l.municipio,
            variedad: l.variedad,
            proceso: l.proceso,
            fechaIngreso: l.fecha || 'Reciente',
        }));
        setMuestras(items);
    }, []);

    const muestrasFiltradas = muestras.filter(item => {
        const term = searchTerm.toLowerCase();
        return item.id.toLowerCase().includes(term) ||
               item.productor.toLowerCase().includes(term) ||
               item.finca.toLowerCase().includes(term) ||
               item.municipio.toLowerCase().includes(term) ||
               item.variedad.toLowerCase().includes(term) ||
               item.proceso.toLowerCase().includes(term);
    });

    return (
        <div className="space-y-12 max-w-[1100px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4">

            {/* 1. SECCIÓN DE BIENVENIDA */}
            <div className="flex flex-col gap-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-sans font-black text-[#5D4037] tracking-tight">Laboratorio de Cata</h1>
                <p className="text-lg text-[#8D6E63] font-medium max-w-2xl">
                    Inicia la evaluación sensorial de las muestras recibidas. Sigue el protocolo SCA para garantizar la mejor puntuación.
                </p>
            </div>

            {/* 2. RESUMEN DEL LABORATORIO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'En Espera', value: muestrasFiltradas.length.toString(), icon: Beaker, color: 'bg-amber-50 text-amber-900 border-amber-100' },
                    { label: 'En Proceso', value: '0', icon: Microscope, color: 'bg-blue-50 text-blue-900 border-blue-100' },
                    { label: 'Hoy Cerradas', value: '08', icon: ClipboardCheck, color: 'bg-emerald-50 text-emerald-900 border-emerald-100' },
                ].map((stat, i) => (
                    <div key={i} className={cn("p-8 rounded-[40px] border flex items-center justify-between shadow-sm", stat.color)}>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">{stat.label}</p>
                            <p className="text-4xl font-sans font-black leading-none">{stat.value}</p>
                        </div>
                        <div className="h-16 w-16 rounded-[28px] bg-white/50 flex items-center justify-center">
                            <stat.icon size={28} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. BÚSQUEDA Y FILTRO */}
            <div className="bg-white p-4 rounded-[32px] border border-[#EADDCA] flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D7CCC8]" size={24} />
                    <Input
                        placeholder="Buscar por lote o productor..."
                        className="h-16 pl-16 rounded-2xl border-none bg-[#FDFBF9] font-bold text-[#5D4037] placeholder:text-[#D7CCC8]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button className="h-16 rounded-2xl px-10 bg-[#5D4037] hover:bg-[#3E2723] text-white font-black uppercase text-xs tracking-widest gap-3 shadow-xl shadow-[#5D4037]/20">
                    <Filter size={20} /> Filtrar Muestras
                </Button>
            </div>

            {/* 4. LISTA DE MUESTRAS (GRANDES BLOQUES) */}
            <div className="space-y-6">
                {muestrasFiltradas.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-[48px] border border-[#EADDCA]/50 shadow-sm p-10 flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-[#5D4037]/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-[#5D4037] pointer-events-none group-hover:scale-125 transition-transform">
                            <Coffee size={100} />
                        </div>

                        {/* Info Lote */}
                        <div className="flex items-center gap-8 w-full lg:w-auto flex-col md:flex-row text-center md:text-left relative z-10">
                            <div className="w-24 h-24 rounded-[36px] bg-[#5D4037]/5 flex items-center justify-center text-[#5D4037] shadow-sm group-hover:rotate-6 transition-transform">
                                <Beaker size={40} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <span className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.3em] font-sans">Lote de Especialidad</span>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-[#5D4037]/10 text-[#5D4037] border-none text-[8px] font-black px-2 uppercase">{item.id}</Badge>
                                        <Badge className="bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest border border-emerald-200 px-2">{item.bache}</Badge>
                                    </div>
                                </div>
                                <h3 className="text-4xl font-sans font-black text-[#5D4037] leading-tight">{item.productor}</h3>
                                <div className="flex flex-wrap items-center gap-4 pt-1 justify-center md:justify-start">
                                    <p className="text-sm font-bold text-[#8D6E63] flex items-center gap-1.5 grayscale shrink-0">
                                        <MapPin size={14} /> {item.finca}, {item.municipio}
                                    </p>
                                    <div className="h-1 w-1 rounded-full bg-gray-200" />
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none flex items-center gap-2">
                                        <Calendar size={12} /> {item.fechaIngreso}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Atributos y Acción */}
                        <div className="flex flex-col md:flex-row items-center gap-10 w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-none relative z-10">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Variedad</p>
                                    <div className="px-4 py-2 bg-[#FDFBF9] rounded-2xl border border-[#EADDCA] text-[10px] font-black text-[#5D4037] flex items-center gap-1.5 uppercase">
                                        <Sprout size={12} /> {item.variedad.split(' / ')[0]}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Proceso</p>
                                    <div className="px-4 py-2 bg-[#FDFBF9] rounded-2xl border border-[#EADDCA] text-[10px] font-black text-[#5D4037] flex items-center gap-1.5 uppercase">
                                        <Droplets size={12} /> {item.proceso}
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(`/catador/evaluar/${item.id}`)}
                                className="h-24 px-12 rounded-[32px] bg-[#5D4037] hover:bg-[#3E2723] text-white font-black text-xl shadow-2xl shadow-[#5D4037]/20 transition-all active:scale-95 group/btn flex items-center gap-4"
                            >
                                Iniciar Cata <ArrowRight className="group-hover/btn:translate-x-3 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Notice */}
            <div className="flex flex-col items-center gap-4 pt-14 opacity-40">
                <Coffee size={32} className="text-[#5D4037]" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5D4037]">Laboratorio Certificado Odisea Trace</p>
            </div>
        </div>
    );
}
