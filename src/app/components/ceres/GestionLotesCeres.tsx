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
    PackageOpen,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Truck,
    Warehouse,
    Ship,
} from 'lucide-react';
import { cn } from '../ui/utils';

const LOTES_MOCK = [
    {
        id: 'LOT-HUILA-084',
        productor: 'María González',
        municipio: 'San Agustín',
        estado: 'En Bodega',
        almacenamiento: 'Estiba A-12',
    },
    {
        id: 'LOT-ANT-112',
        productor: 'Carlos Martínez',
        municipio: 'Acevedo',
        estado: 'En Finca',
        almacenamiento: 'Pendiente Recibo',
    },
    {
        id: 'LOT-NAR-225',
        productor: 'Jorge Torres',
        municipio: 'Garzón',
        estado: 'Listo Exportación',
        almacenamiento: 'Silo Secado 2',
    },
    {
        id: 'LOT-QUI-301',
        productor: 'Elena Ruiz',
        municipio: 'Pitalito',
        estado: 'Exportado',
        almacenamiento: 'Puerto B/quilla',
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'En Finca': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'En Bodega': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Listo Exportación': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Exportado': return 'bg-slate-50 text-slate-700 border-slate-100';
        default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'En Finca': return Truck;
        case 'En Bodega': return Warehouse;
        case 'Listo Exportación': return Ship;
        case 'Exportado': return PackageOpen;
        default: return PackageOpen;
    }
};

export function GestionLotesCeres() {
    const navigate = useNavigate();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header / Filter Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <PackageOpen className="text-blue-600" size={40} /> Gestión de Lotes y Almacén
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl text-sm uppercase tracking-[0.2em] font-sans">
                        Control Centralizado de Inventarios y Logística de Exportación
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar ID Lote, Productor..."
                            className="h-14 w-80 rounded-2xl border-slate-200 bg-white pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <Button variant="outline" className="h-14 rounded-2xl border-slate-200 gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
                        <Filter size={18} /> Filtros Avanzados
                    </Button>
                </div>
            </div>

            {/* Logistics Status Board */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Stock en Finca', value: '45.2 Tn', icon: Truck, color: 'text-amber-600' },
                    { label: 'Stock en Bodega', value: '128.5 Tn', icon: Warehouse, color: 'text-blue-600' },
                    { label: 'Lotes para Exportar', value: '12', icon: Ship, color: 'text-emerald-600' },
                    { label: 'Capacidad Bodega', value: '82%', icon: PackageOpen, color: 'text-slate-900' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-2xl transition-all border-b-4 border-b-slate-100 border-r-4 border-r-slate-50">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform mb-6">
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                            <p className={cn("text-3xl font-serif font-black", stat.color)}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden p-2">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">ID Lote</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Productor / Municipio</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado Logístico</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ubicación Bodega</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Detalle</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {LOTES_MOCK.map((item) => {
                            const Icon = getStatusIcon(item.estado);
                            return (
                                <TableRow
                                    key={item.id}
                                    className="group hover:bg-blue-50/30 border-slate-50 transition-colors"
                                >
                                    <TableCell className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-serif font-black text-xs shadow-sm uppercase">
                                                {item.id.split('-').pop()?.substring(0, 2)}
                                            </div>
                                            <div>
                                                <span className="text-sm font-serif font-black text-slate-900 leading-none mb-1 block tracking-tight uppercase">{item.id}</span>
                                                <Badge variant="outline" className="text-[8px] font-black py-0 h-4 border-slate-200 text-slate-400">ERP-SYNC OK</Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-10 py-8">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-slate-700">{item.productor}</p>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MapPin size={12} className="text-slate-300" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{item.municipio}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-10 py-8">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            getStatusColor(item.estado)
                                        )}>
                                            <Icon size={12} />
                                            {item.estado}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-10 py-8">
                                        <span className="text-xs font-bold text-slate-500 font-mono tracking-tighter">{item.almacenamiento}</span>
                                    </TableCell>
                                    <TableCell className="px-10 py-8 text-right">
                                        <Button
                                            onClick={() => navigate(`/ceres/lote/${item.id}`)}
                                            variant="ghost"
                                            className="rounded-2xl h-12 px-6 group/btn hover:bg-slate-900 hover:text-white transition-all gap-4 border-none shadow-none active:scale-95"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">Abrir Expediente</span>
                                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Action Footer */}
            <div className="flex justify-between items-center bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl">
                <div className="flex gap-4 items-center">
                    <div className="h-4 w-4 rounded-full bg-blue-600 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mostrando 4 de 128 lotes registrados en el periodo fiscal activo</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl px-8 border-slate-200">Exportar Reporte (CSV)</Button>
                    <Button className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700">Imprimir Etiquetas QR</Button>
                </div>
            </div>
        </div>
    );
}
