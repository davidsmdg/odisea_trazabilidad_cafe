import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    Map as MapIcon,
    Calendar,
    ArrowRight,
    Search,
    Satellite,
    Filter,
} from 'lucide-react';
import { cn } from '../ui/utils';

const REVISIONES_MOCK = [
    {
        id: 'FL-2024-001A',
        fechaSolicitud: '02 Mar 2024',
        estado: 'Pendiente',
        prioridad: 'Alta',
        tipo: 'Predio Nuevo',
    },
    {
        id: 'FL-2024-002B',
        fechaSolicitud: '01 Mar 2024',
        estado: 'Pendiente',
        prioridad: 'Media',
        tipo: 'Recertificación',
    },
    {
        id: 'FL-2024-005C',
        fechaSolicitud: '28 Feb 2024',
        estado: 'Pendiente',
        prioridad: 'Baja',
        tipo: 'Ampliación Lote',
    },
    {
        id: 'FL-2024-009D',
        fechaSolicitud: '27 Feb 2024',
        estado: 'En Proceso',
        prioridad: 'Alta',
        tipo: 'Predio Nuevo',
    },
];

export function BandejaRevision() {
    const navigate = useNavigate();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-black text-[#064E3B] tracking-tight">Bandeja de Revisión</h1>
                    <p className="text-emerald-900/60 font-medium max-w-2xl text-sm uppercase tracking-widest pl-1">
                        Monitor de cumplimiento ambiental para la normativa europea (EUDR).
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar ID de Finca o Lote..."
                            className="h-14 w-80 rounded-[20px] border-gray-100 bg-white pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-600 outline-none transition-all shadow-md group-hover:border-emerald-200"
                        />
                    </div>
                </div>
            </div>

            {/* Matrix Stats (Bento Minimal) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Pendientes', value: '12', color: 'text-amber-600', icon: Satellite },
                    { label: 'En Análisis', value: '04', color: 'text-blue-600', icon: MapIcon },
                    { label: 'Aprobados hoy', value: '08', color: 'text-emerald-600', icon: Calendar },
                    { label: 'Alertas EUDR', value: '02', color: 'text-red-600', icon: Filter },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all h-[120px]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                            <p className={cn("text-3xl font-serif font-black", stat.color)}>{stat.value}</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden p-2">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-gray-100">
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#064E3B]/40">ID Finca / Lote</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#064E3B]/40">Solicitado</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#064E3B]/40">Categoría</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#064E3B]/40">Prioridad</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#064E3B]/40 text-right">Análisis</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {REVISIONES_MOCK.map((item, idx) => (
                            <TableRow
                                key={item.id}
                                className="group hover:bg-emerald-50/30 border-gray-50 transition-colors"
                            >
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-800 font-black text-[10px] shadow-sm uppercase">
                                            {item.id.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="text-sm font-serif font-black text-[#064E3B] leading-none mb-1 block tracking-tight">{item.id}</span>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">TRACE-ID-VALIDATOR</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <span className="text-sm font-bold text-gray-600">{item.fechaSolicitud}</span>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#064E3B]/60 bg-emerald-50 px-3 py-1 rounded-full">{item.tipo}</span>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        item.prioridad === 'Alta' ? "bg-red-50 text-red-700 border-red-100" :
                                            item.prioridad === 'Media' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-sky-700 border-sky-100"
                                    )}>
                                        <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse",
                                            item.prioridad === 'Alta' ? "bg-red-500" :
                                                item.prioridad === 'Media' ? "bg-amber-500" : "bg-sky-500"
                                        )} />
                                        {item.prioridad}
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8 text-right">
                                    <Button
                                        onClick={() => navigate(`/ambiental/analizar/${item.id}`)}
                                        variant="ghost"
                                        className="rounded-[18px] h-12 px-6 group/btn hover:bg-[#064E3B] hover:text-white transition-all gap-3 border border-transparent hover:border-[#064E3B] active:scale-95 shadow-none"
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-widest">Analizar en Mapa</span>
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
