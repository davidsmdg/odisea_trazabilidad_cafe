import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    Map as MapIcon,
    Calendar,
    ArrowRight,
    Search,
    Satellite,
    AlertTriangle,
    CheckCircle,
    Clock,
    ShieldAlert,
    RefreshCw,
    Filter
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Input } from '../ui/input';

const REVISIONES_MOCK = [
    {
        id: 'FL-2024-001A',
        finca: 'Finca La Secreta',
        municipio: 'Pitalito',
        fechaSolicitud: '02 Mar 2024',
        estado: 'Pendiente',
        prioridad: 'Alta',
        tipo: 'Predio Nuevo (EUDR)',
    },
    {
        id: 'FL-2024-002B',
        finca: 'Mirador del Valle',
        municipio: 'Acevedo',
        fechaSolicitud: '01 Mar 2024',
        estado: 'Alerta EUDR',
        prioridad: 'Alta',
        tipo: 'Recertificación Anual',
    },
    {
        id: 'FL-2024-005C',
        finca: 'Lote Las Rocas',
        municipio: 'Garzón',
        fechaSolicitud: '28 Feb 2024',
        estado: 'En Proceso',
        prioridad: 'Media',
        tipo: 'Ampliación Lote',
    }
];

export function BandejaRevision() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 max-w-[1100px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4">

            {/* 1. SECCIÓN DE BIENVENIDA */}
            <div className="flex flex-col gap-6 text-center md:text-left pt-6">
                <h1 className="text-4xl md:text-5xl font-sans font-black text-emerald-900 tracking-tight">Revisiones Ambientales</h1>
                <p className="text-lg text-emerald-800/60 font-medium max-w-2xl">
                    Verifica que las fincas no estén en zonas protegidas. Presta especial atención a las <strong className="text-rose-600">Alertas EUDR</strong>.
                </p>
            </div>

            {/* 2. RESUMEN RÁPIDO (ONE PER BOX) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Pendientes Hoy', value: '12', color: 'bg-amber-50 text-amber-700', icon: Satellite },
                    { label: 'En Proceso', value: '04', color: 'bg-blue-50 text-blue-700', icon: MapIcon },
                    { label: 'Alertas EUDR', value: '02', color: 'bg-red-50 text-red-700', icon: AlertTriangle },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] border border-emerald-100 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-2">{stat.label}</p>
                            <p className={cn("text-4xl font-sans font-black leading-none", stat.color)}>{stat.value}</p>
                        </div>
                        <div className={cn("h-16 w-16 rounded-[28px] flex items-center justify-center", stat.color.split(' ')[0])}>
                            <stat.icon size={28} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. BÚSQUEDA SIMPLIFICADA */}
            <div className="bg-white p-4 rounded-[32px] border border-emerald-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200" size={24} />
                    <Input
                        placeholder="Buscar finca por nombre o ID..."
                        className="h-16 pl-16 rounded-2xl border-none bg-emerald-50/30 font-bold text-emerald-900 placeholder:text-emerald-200"
                    />
                </div>
                <Button className="h-16 rounded-2xl px-10 bg-emerald-900 hover:bg-emerald-950 text-white font-black uppercase text-xs tracking-widest gap-3">
                    <Filter size={20} /> Filtrar Lista
                </Button>
            </div>

            {/* 4. LISTA DE REVISIONES (GRANDES BLOQUES) */}
            <div className="space-y-6">
                {REVISIONES_MOCK.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-[48px] border border-emerald-50 shadow-sm p-10 flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-emerald-200 transition-all group"
                    >
                        {/* Info Finca */}
                        <div className="flex items-center gap-8 w-full lg:w-auto flex-col md:flex-row text-center md:text-left">
                            <div className="w-24 h-24 rounded-[36px] bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-sm group-hover:scale-110 transition-transform">
                                <Satellite size={40} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{item.tipo}</span>
                                    <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black px-2 uppercase">{item.id}</Badge>
                                </div>
                                <h3 className="text-4xl font-sans font-black text-emerald-900 leading-tight">{item.finca}</h3>
                                <div className="flex items-center gap-4 pt-1 justify-center md:justify-start">
                                    <p className="text-sm font-bold text-gray-400 flex items-center gap-1.5 grayscale shrink-0">
                                        <MapIcon size={14} /> {item.municipio}
                                    </p>
                                    <div className="h-1 w-1 rounded-full bg-gray-200" />
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">
                                        Solicitado el {item.fechaSolicitud}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Estado y Acción */}
                        <div className="flex flex-col md:flex-row items-center gap-10 w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-none">
                            {/* Indicador de Estado */}
                            <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Estado de Revisión</p>

                                <div className={cn(
                                    "flex items-center gap-2 font-black text-sm px-4 py-2 rounded-2xl border-2 uppercase tracking-tight",
                                    item.estado === 'Pendiente' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                        item.estado === 'En Proceso' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                            "bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-200"
                                )}>
                                    {item.estado === 'Pendiente' && <Clock size={16} />}
                                    {item.estado === 'En Proceso' && <RefreshCw size={16} className="animate-spin-slow" />}
                                    {item.estado === 'Alerta EUDR' && <ShieldAlert size={16} className="animate-pulse" />}
                                    {item.estado}
                                </div>
                            </div>

                            <Button
                                onClick={() => navigate(`/ambiental/analizar/${item.id}`)}
                                className={cn(
                                    "h-24 px-10 rounded-[32px] font-black text-lg shadow-2xl transition-all active:scale-95 group/btn flex items-center gap-4 cursor-pointer",
                                    item.estado === 'Alerta EUDR' ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20" : "bg-emerald-900 hover:bg-emerald-950 text-white shadow-emerald-900/20"
                                )}
                            >
                                {item.estado === 'Alerta EUDR' ? 'Revisar Alerta Prioritaria' : 'Iniciar Análisis'}
                                <ArrowRight className="group-hover/btn:translate-x-3 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination / Footer Info */}
            <div className="flex flex-col items-center gap-4 pt-14 opacity-40">
                <CheckCircle size={32} className="text-emerald-900" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-900">Cumplimiento Satelital Odisea Trace</p>
            </div>
        </div>
    );
}
