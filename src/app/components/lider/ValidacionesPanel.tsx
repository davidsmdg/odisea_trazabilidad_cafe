import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    CheckCircle2,
    Clock,
    ArrowRight,
    Search,
    Filter,
    MapPin,
    User,
    Calendar,
    Trophy,
    Star,
    Award
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Input } from '../ui/input';

const VALIDACIONES_MOCK = [
    {
        id: '1',
        agricultor: 'María González',
        finca: 'Finca La Esperanza',
        municipio: 'San Agustín, Huila',
        estado: 'Pendiente',
        fecha: 'Hoy, 2:30 PM',
        tipo: 'Validación Técnica EUDR'
    },
    {
        id: '2',
        agricultor: 'Carlos Martínez',
        finca: 'Lote El Naranjo',
        municipio: 'Acevedo, Huila',
        estado: 'Pendiente',
        fecha: 'Ayer',
        tipo: 'Actualización de Perfil'
    },
    {
        id: '3',
        agricultor: 'Elena Ruiz',
        finca: 'Finca Santa Helena',
        municipio: 'Pitalito, Huila',
        estado: 'Revisado',
        fecha: 'Hace 3 días',
        tipo: 'Validación Técnica EUDR'
    }
];

export function ValidacionesPanel() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">

            {/* 1. HEADER SIMPLE Y SISTEMA DE RECOMPENSAS */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                <div className="flex flex-col gap-4 text-center md:text-left flex-1">
                    <h1 className="text-4xl md:text-5xl font-sans font-black text-slate-900 tracking-tight">Tareas Pendientes</h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl">
                        Revisa y aprueba la información que envían los agricultores para que su café pueda ser exportado.
                    </p>
                </div>

                {/* Gamification Widget */}
                <div className="bg-gradient-to-br from-[#1A365D] to-blue-900 rounded-[32px] p-6 lg:w-[400px] shadow-xl relative overflow-hidden shrink-0 w-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={100} /></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <Badge className="bg-amber-400 text-amber-900 font-black text-[10px] uppercase border-none">
                                Nivel: Líder ORO
                            </Badge>
                            <span className="text-blue-200 font-bold text-sm tracking-widest flex items-center gap-1">
                                <Star size={14} className="text-amber-400 fill-amber-400" /> 1,250 Ptos
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="text-white font-sans font-black text-xl leading-tight">45 Agricultores</p>
                            <p className="text-blue-200/70 text-xs font-medium">validados en tu comunidad</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                                <span>Progreso a Nivel Platino</span>
                                <span>80%</span>
                            </div>
                            <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '80%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"
                                />
                            </div>
                            <p className="text-[10px] text-blue-300 font-medium text-right">Faltan 5 validaciones más</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BÚSQUEDA Y FILTRO */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                        placeholder="Buscar por nombre o finca..."
                        className="h-14 pl-14 rounded-2xl border-none bg-slate-50 font-bold text-slate-700"
                    />
                </div>
                <Button variant="outline" className="h-14 rounded-2xl px-8 border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2">
                    <Filter size={18} /> Filtrar Tareas
                </Button>
            </div>

            {/* 3. LISTA DE TAREAS EN BLOQUES (GRANDES) */}
            <div className="space-y-6">
                {VALIDACIONES_MOCK.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-blue-600/20 transition-all border-l-8 border-l-transparent data-[status=Pendiente]:border-l-amber-500"
                        data-status={item.estado}
                    >
                        {/* Info Principal */}
                        <div className="flex items-center gap-8 w-full md:w-auto text-center md:text-left flex-col md:flex-row">
                            <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                <User size={32} />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">{item.tipo}</span>
                                <h3 className="text-3xl font-sans font-black text-slate-900 leading-none">{item.agricultor}</h3>
                                <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
                                    <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                        <MapPin size={14} /> {item.finca}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={12} /> {item.fecha}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Estado y Acción */}
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto pt-6 md:pt-0 border-t md:border-none">
                            <div className={cn(
                                "flex flex-col items-center px-4",
                                item.estado === 'Pendiente' ? "text-amber-600" : "text-emerald-600"
                            )}>
                                <span className="text-[10px] font-black uppercase tracking-widest mb-1">Estado</span>
                                <div className="flex items-center gap-2 font-black text-lg">
                                    {item.estado === 'Pendiente' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                                    {item.estado}
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(`/lider/validar/${item.id}`)}
                                className="h-20 px-10 rounded-[28px] bg-slate-900 hover:bg-black text-white font-black text-lg shadow-xl transition-all group/btn"
                            >
                                Revisar Ahora <ArrowRight className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination / More */}
            <div className="text-center pt-10">
                <Button variant="ghost" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600">
                    Cargar más tareas realizadas
                </Button>
            </div>
        </div>
    );
}
