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
import { Button } from '../ui/button';
import {
    Beaker,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Sprout,
    Droplets,
} from 'lucide-react';
import { cn } from '../ui/utils';

const MUESTRAS_MOCK = [
    {
        id: 'LOT-HUILA-084',
        productor: 'María González',
        municipio: 'San Agustín',
        variedad: 'Caturra / Castillo',
        proceso: 'Lavado',
        fechaIngreso: 'Hoy, 08:30 AM',
    },
    {
        id: 'LOT-ANT-112',
        productor: 'Carlos Martínez',
        municipio: 'Acevedo',
        variedad: 'Geisha',
        proceso: 'Natural',
        fechaIngreso: 'Hace 3 horas',
    },
    {
        id: 'LOT-NAR-225',
        productor: 'Jorge Torres',
        municipio: 'Garzón',
        variedad: 'Bourbon Rosado',
        proceso: 'Honey',
        fechaIngreso: 'Ayer',
    },
];

export function MuestrasPendientes() {
    const navigate = useNavigate();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-black text-[#5D4037] tracking-tight">Muestras Pendientes</h1>
                    <p className="text-[#8D6E63] font-medium max-w-2xl text-sm uppercase tracking-[0.2em] pl-1 font-sans">
                        Control de Calidad Físico y Sensorial (Protocolo SCA)
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D7CCC8] group-focus-within:text-[#5D4037] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por Lote o Productor..."
                            className="h-14 w-80 rounded-[20px] border-[#D7CCC8] bg-white pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-[#EADDCA]/30 focus:border-[#5D4037] outline-none transition-all shadow-sm group-hover:border-[#8D6E63]"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats / Laboratory Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'En Espera', value: '18', icon: Beaker, color: 'text-amber-600' },
                    { label: 'En Análisis', value: '12', icon: Microscope, color: 'text-blue-600' },
                    { label: 'Completado (Hoy)', value: '08', icon: ClipboardCheck, color: 'text-emerald-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-[#EADDCA] shadow-sm flex items-center justify-between group hover:shadow-xl transition-all border-b-4 border-b-[#EADDCA]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] mb-2">{stat.label}</p>
                            <p className={cn("text-3xl font-serif font-black", stat.color)}>{stat.value}</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-[#FDFBF9] border border-[#EADDCA] flex items-center justify-center text-[#D7CCC8] group-hover:scale-110 transition-transform">
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[40px] border border-[#EADDCA] shadow-2xl overflow-hidden p-2">
                <Table>
                    <TableHeader className="bg-[#FDFBF9]">
                        <TableRow className="hover:bg-transparent border-[#EADDCA]">
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#8D6E63]">Identificación Lote</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#8D6E63]">Productor / Contexto</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#8D6E63]">Atributos Técnicos</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#8D6E63]">Fecha Ingreso</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#8D6E63] text-right">Laboratorio</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MUESTRAS_MOCK.map((item) => (
                            <TableRow
                                key={item.id}
                                className="group hover:bg-[#EADDCA]/10 border-[#EADDCA] transition-colors"
                            >
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#EADDCA]/30 flex items-center justify-center text-[#5D4037] font-serif font-black text-xs shadow-sm shadow-inner uppercase">
                                            {item.id.split('-').pop()?.substring(0, 2)}
                                        </div>
                                        <div>
                                            <span className="text-sm font-serif font-black text-[#5D4037] leading-none mb-1 block tracking-tight uppercase">{item.id}</span>
                                            <span className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest">Muestra de Pergamino Seco</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-[#5D4037]">{item.productor}</p>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MapPin size={12} className="text-[#8D6E63]" />
                                            <span className="text-[10px] font-bold uppercase">{item.municipio}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className="flex flex-wrap gap-2">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EADDCA] text-[9px] font-black uppercase tracking-widest text-[#8D6E63]">
                                            <Sprout size={10} /> {item.variedad}
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5D4037]/5 border border-[#5D4037]/10 text-[9px] font-black uppercase tracking-widest text-[#5D4037]">
                                            <Droplets size={10} /> {item.proceso}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <span className="text-xs font-bold text-gray-500">{item.fechaIngreso}</span>
                                </TableCell>
                                <TableCell className="px-10 py-8 text-right">
                                    <Button
                                        onClick={() => navigate(`/catador/evaluar/${item.id}`)}
                                        className="rounded-2xl h-12 px-6 bg-[#5D4037] hover:bg-[#3E2723] text-white transition-all gap-3 border-none active:scale-95 shadow-lg shadow-[#5D4037]/20 group/btn"
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-widest">Iniciar Cata</span>
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Legend / Safety Notice */}
            <div className="p-8 rounded-[32px] bg-[#5D4037]/5 border border-[#EADDCA] text-[#5D4037]/60 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-4">
                <Beaker size={18} /> Protocolos de bioseguridad y calibración de laboratorio activos
            </div>
        </div>
    );
}

// Missing icons for the summary
import { Microscope, ClipboardCheck } from 'lucide-react';
