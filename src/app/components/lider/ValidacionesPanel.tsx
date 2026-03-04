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
    CheckCircle2,
    Clock,
    ArrowRight,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '../ui/utils';

const VALIDACIONES_MOCK = [
    {
        id: '1',
        agricultor: 'María González',
        finca: 'Finca La Esperanza',
        municipio: 'San Agustín',
        estado: 'Pendiente',
        fecha: 'Hace 2 horas',
    },
    {
        id: '2',
        agricultor: 'Carlos Martínez',
        finca: 'Lote El Naranjo',
        municipio: 'Acevedo',
        estado: 'Pendiente',
        fecha: 'Hace 1 día',
    },
    {
        id: '3',
        agricultor: 'Elena Ruiz',
        finca: 'Finca Santa Helena',
        municipio: 'Pitalito',
        estado: 'Revisado',
        fecha: 'Hace 3 días',
    },
    {
        id: '4',
        agricultor: 'Jorge Torres',
        finca: 'Predio El Paraíso',
        municipio: 'Garzón',
        estado: 'Pendiente',
        fecha: 'Hace 4 días',
    },
];

export function ValidacionesPanel() {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight">Panel de Validaciones</h1>
                    <p className="text-slate-500 font-medium max-w-2xl">
                        Revisa y valida la información técnica cargada por los agricultores para asegurar el cumplimiento EUDR.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar agricultor o finca..."
                            className="h-12 w-64 rounded-xl border-slate-200 bg-white pl-10 pr-4 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <Button variant="outline" className="h-12 border-slate-200 rounded-xl gap-2 font-bold px-5 hover:bg-slate-50">
                        <Filter size={18} /> Filtros
                    </Button>
                </div>
            </div>

            {/* Summary Tabs (Mock) */}
            <div className="flex gap-4 border-b border-slate-200">
                <button className="pb-4 px-2 border-b-2 border-blue-600 text-blue-600 font-black text-sm uppercase tracking-widest">Pendientes (3)</button>
                <button className="pb-4 px-2 border-b-2 border-transparent text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-600 transition-colors">Revisados</button>
                <button className="pb-4 px-2 border-b-2 border-transparent text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-600 transition-colors">Todos</button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Agricultor</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Finca / Predio</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Municipio</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {VALIDACIONES_MOCK.map((item, idx) => (
                            <TableRow
                                key={item.id}
                                className="group hover:bg-slate-50/50 border-slate-50 transition-colors"
                            >
                                <TableCell className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs uppercase">
                                            {item.agricultor.charAt(0)}
                                        </div>
                                        <span className="text-sm font-black text-slate-900 leading-tight">{item.agricultor}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 py-6">
                                    <span className="text-sm font-bold text-slate-600">{item.finca}</span>
                                </TableCell>
                                <TableCell className="px-8 py-6">
                                    <span className="text-sm font-medium text-slate-500">{item.municipio}</span>
                                </TableCell>
                                <TableCell className="px-8 py-6">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        item.estado === 'Pendiente'
                                            ? "bg-amber-50 text-amber-700 border-amber-100"
                                            : "bg-green-50 text-green-700 border-green-100"
                                    )}>
                                        {item.estado === 'Pendiente' ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                                        {item.estado}
                                    </div>
                                    <p className="text-[10px] text-slate-300 font-bold mt-1 ml-4.5">{item.fecha}</p>
                                </TableCell>
                                <TableCell className="px-8 py-6 text-right">
                                    <Button
                                        onClick={() => navigate(`/lider/validar/${item.id}`)}
                                        variant="ghost"
                                        className="rounded-xl h-10 px-4 group/btn hover:bg-blue-600 hover:text-white transition-all gap-2"
                                    >
                                        <span className="text-xs font-black uppercase tracking-widest">Revisar</span>
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Mock */}
            <div className="flex items-center justify-between pb-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mostrando 4 de 24 tareas</p>
                <div className="flex gap-2">
                    <Button variant="outline" disabled className="h-10 w-10 p-0 rounded-lg border-slate-200">
                        <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" className="h-10 w-10 p-0 rounded-lg border-slate-200 bg-white">
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
