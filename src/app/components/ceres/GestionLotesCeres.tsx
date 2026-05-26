import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    PackageOpen,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Truck,
    Warehouse,
    Ship,
    Calendar,
    Box,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Input } from '../ui/input';

const LOTES_MOCK = [
    {
        id: 'LOT-HUILA-084',
        productor: 'María González',
        municipio: 'San Agustín, Huila',
        estado: 'En Bodega',
        almacenamiento: 'Estiba A-12',
        fecha: 'Hace 2 horas',
    },
    {
        id: 'LOT-ANT-112',
        productor: 'Carlos Martínez',
        municipio: 'Acevedo, Huila',
        estado: 'En Finca',
        almacenamiento: 'Pendiente Recibo',
        fecha: 'Hace 5 horas',
    },
    {
        id: 'LOT-NAR-225',
        productor: 'Jorge Torres',
        municipio: 'Garzón, Huila',
        estado: 'Listo Exportación',
        almacenamiento: 'Silo Secado 2',
        fecha: 'Ayer',
    }
];

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'En Finca': return { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Truck };
        case 'En Bodega': return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Warehouse };
        case 'Listo Exportación': return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Ship };
        default: return { color: 'text-slate-600 bg-slate-50 border-slate-100', icon: PackageOpen };
    }
};

export function GestionLotesCeres() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4">

            {/* 1. HEADER CENTRADO EN ACCIÓN */}
            <div className="flex flex-col gap-6 text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                    <div className="h-16 w-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                        <Box size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-sans font-black text-slate-900 tracking-tight">Inventario de Lotes</h1>
                </div>
                <p className="text-lg text-slate-500 font-medium max-w-2xl">
                    Gestiona la ubicación y el estado logístico de cada lote desde su recepción en finca hasta el puerto de exportación.
                </p>
            </div>

            {/* 2. DASHBOARD LOGÍSTICO (RESUMEN) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'En Finca', value: '45.2 Tn', icon: Truck, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                    { label: 'En Puntos Acopio', value: '128.5 Tn', icon: Warehouse, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                    { label: 'Listos Puerto', value: '12 Lotes', icon: Ship, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                    { label: 'Uso Bodega', value: '82%', icon: Box, color: 'text-slate-900 bg-slate-50 border-slate-100' },
                ].map((stat, i) => (
                    <div key={i} className={cn("p-8 rounded-[40px] border flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-all hover:shadow-xl", stat.color)}>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{stat.label}</p>
                        <p className="text-3xl font-sans font-black leading-none">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* 3. BÚSQUEDA Y CONTROL */}
            <div className="bg-white p-4 rounded-[32px] border border-slate-100 flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                    <Input
                        placeholder="Buscar ID Lote o Productor..."
                        className="h-16 pl-16 rounded-2xl border-none bg-slate-50 font-bold text-slate-900 placeholder:text-slate-300"
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-16 rounded-2xl px-10 border-slate-200 font-black uppercase text-xs tracking-widest gap-3 hover:bg-slate-50">
                        <Filter size={20} /> Filtros
                    </Button>
                    <Button className="h-16 rounded-2xl px-10 bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest shadow-xl">
                        Nuevo Ingreso
                    </Button>
                </div>
            </div>

            {/* 4. LISTADO DE LOTES (ONE IDEA PER ROW) */}
            <div className="space-y-6">
                {LOTES_MOCK.map((item) => {
                    const styles = getStatusStyles(item.estado);
                    const StatusIcon = styles.icon;
                    return (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-10 flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-blue-200 transition-all group"
                        >
                            {/* Identificación */}
                            <div className="flex items-center gap-8 w-full lg:w-auto flex-col md:flex-row text-center md:text-left">
                                <div className="w-24 h-24 rounded-[36px] bg-slate-900 flex flex-col items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <span className="text-[10px] font-black uppercase opacity-50 -mb-1">LOTE</span>
                                    <span className="text-3xl font-sans font-black">{item.id.split('-').pop()?.substring(0, 2)}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] font-black px-2 uppercase tracking-widest">{item.id}</Badge>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">TRACE-ID CERES SYNC</span>
                                    </div>
                                    <h3 className="text-4xl font-sans font-black text-slate-900 leading-tight">{item.productor}</h3>
                                    <div className="flex items-center gap-4 pt-1 justify-center md:justify-start">
                                        <p className="text-sm font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
                                            <MapPin size={14} /> {item.municipio}
                                        </p>
                                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none flex items-center gap-2">
                                            <Calendar size={12} /> {item.fecha}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Detalle Bodega y Acción */}
                            <div className="flex flex-col md:flex-row items-center gap-10 w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-none">
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estado Logístico</p>
                                    <div className={cn(
                                        "flex items-center gap-2 font-black text-xl px-4 py-2 rounded-2xl border",
                                        styles.color
                                    )}>
                                        <StatusIcon size={20} />
                                        {item.estado}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{item.almacenamiento}</p>
                                </div>
                                <Button
                                    onClick={() => navigate(`/ceres/lote/${item.id}`)}
                                    className="h-24 px-12 rounded-[32px] bg-slate-900 hover:bg-black text-white font-black text-xl shadow-2xl transition-all active:scale-95 group/btn flex items-center gap-4"
                                >
                                    Abrir Detalle <ArrowRight className="group-hover/btn:translate-x-3 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-center pt-10">
                <Button variant="ghost" className="h-14 rounded-2xl px-8 border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2">
                    <Box size={18} /> Ver Mapa de Almacén
                </Button>
                <Button variant="ghost" className="h-14 rounded-2xl px-8 border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2">
                    <Calendar size={18} /> Historial de Movimientos
                </Button>
            </div>
        </div>
    );
}
