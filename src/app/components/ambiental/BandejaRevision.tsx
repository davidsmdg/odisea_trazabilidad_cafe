import { useState, useEffect } from 'react';
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

import { getRevisiones } from '../../../services/revisionesService';
import type { RevisionMockItem } from '../../../data/revisiones.mock';

export function BandejaRevision() {
    const navigate = useNavigate();
    const [revisiones, setRevisiones] = useState<RevisionMockItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getRevisiones()
            .then((data) => {
                setRevisiones(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Error al cargar revisiones');
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="space-y-12 max-w-[1100px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4">

            {/* 1. SECCIÓN DE BIENVENIDA */}
            <div className="flex flex-col gap-6 text-center md:text-left pt-6">
                <h1 className="text-4xl md:text-5xl font-sans font-black text-emerald-900 tracking-tight">Auditoría Odisea (EUDR)</h1>
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
                {isLoading ? (
                    <div className="space-y-6 animate-pulse">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-[48px] border border-emerald-50 p-10 h-48 flex flex-col justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-12 text-center bg-red-50 rounded-[48px] border border-red-100 space-y-4">
                        <AlertTriangle className="text-red-500 mx-auto" size={48} />
                        <h3 className="text-xl font-sans font-black text-red-900">Algo salió mal</h3>
                        <p className="text-red-700/80 font-medium">{error}</p>
                        <Button onClick={() => window.location.reload()} className="bg-emerald-950 text-white font-black px-6 py-2 rounded-xl">Reintentar</Button>
                    </div>
                ) : revisiones.length === 0 ? (
                    <div className="p-16 text-center rounded-[48px] border border-dashed border-emerald-250 bg-emerald-50/10">
                        <p className="text-emerald-800/60 font-bold text-lg">No hay revisiones de cumplimiento EUDR asignadas.</p>
                    </div>
                ) : (
                    <>
                        {revisiones.map((item) => (
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
                                onClick={() => navigate(`/odisea/ambiental/analizar/${item.id}`)}
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
                    </>
                )}
            </div>

            {/* Pagination / Footer Info */}
            <div className="flex flex-col items-center gap-4 pt-14 opacity-40">
                <CheckCircle size={32} className="text-emerald-900" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-900">Cumplimiento Satelital Odisea Trace</p>
            </div>
        </div>
    );
}
