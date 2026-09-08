import { useState } from 'react';
import {
    Ship,
    Search,
    Filter,
    Download,
    FileText,
    Calendar,
    MapPin,
    Building2,
    DollarSign
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

interface ExportLog {
    id: string;
    loteId: string;
    tostador: string;
    destino: string;
    precioFob: string;
    billOfLading: string;
    fechaDespacho: string;
    estadoTránsito: 'En Puerto' | 'En Tránsito' | 'Entregado';
}

const EXPORTS_MOCK: ExportLog[] = [
    {
        id: 'EXP-042',
        loteId: 'LOT-HUILA-084',
        tostador: 'Blue Bottle Coffee (USA)',
        destino: 'Puerto de Oakland, California',
        precioFob: 'USD 2.85 / lb',
        billOfLading: 'MSC-HUI-8842',
        fechaDespacho: '22 May 2026',
        estadoTránsito: 'En Tránsito'
    },
    {
        id: 'EXP-045',
        loteId: 'LOT-ANT-112',
        tostador: 'Workshop Coffee (UK)',
        destino: 'Puerto de Londres, Inglaterra',
        precioFob: 'USD 3.10 / lb',
        billOfLading: 'OOL-ANT-9912',
        fechaDespacho: '15 May 2026',
        estadoTránsito: 'Entregado'
    },
    {
        id: 'EXP-048',
        loteId: 'LOT-NAR-225',
        tostador: 'The Barn (Alemania)',
        destino: 'Puerto de Hamburgo, Alemania',
        precioFob: 'USD 2.95 / lb',
        billOfLading: 'HLC-NAR-7721',
        fechaDespacho: 'Hace 2 días',
        estadoTránsito: 'En Puerto'
    }
];

export function ExportacionesOdisea() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDownloadDDS = (loteId: string) => {
        toast.info(`Generando DDS (Declaración de Debida Diligencia) para ${loteId}`, {
            icon: <FileText className="animate-pulse" />
        });
        setTimeout(() => {
            toast.success("Documento DDS EUDR descargado", {
                description: "El archivo contiene firmas digitales y coordenadas validadas del origen."
            });
        }, 1500);
    };

    const filtered = EXPORTS_MOCK.filter(exp =>
        exp.loteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.tostador.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4 text-left font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-sans font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <Ship className="text-blue-600" size={40} /> Gestión de Exportaciones
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl text-sm uppercase tracking-[0.2em]">
                        Seguimiento y Registro de Despachos Internacionales con Normativa EUDR
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-[40px] border border-slate-100 shadow-xl">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por lote o tostador..."
                            className="h-12 w-64 rounded-2xl border-slate-50 pl-12 pr-4 bg-slate-50 focus:bg-white transition-all font-bold text-slate-700"
                        />
                    </div>
                </div>
            </div>

            {/* Listado de Exportaciones */}
            <div className="space-y-6">
                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-8 flex flex-col lg:flex-row items-center justify-between gap-8 hover:border-blue-200 transition-all group"
                    >
                        {/* Info Principal */}
                        <div className="flex items-center gap-6 w-full lg:w-auto flex-col md:flex-row text-center md:text-left">
                            <div className="w-20 h-20 rounded-[28px] bg-slate-900 flex flex-col items-center justify-center text-white shadow-lg shrink-0">
                                <Ship size={32} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">{item.loteId}</Badge>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Bill of Lading: {item.billOfLading}</span>
                                </div>
                                <h3 className="text-2xl font-sans font-black text-slate-900 leading-tight flex items-center gap-2 justify-center md:justify-start">
                                    <Building2 size={16} className="text-slate-400" /> {item.tostador}
                                </h3>
                                <div className="flex items-center gap-4 pt-1 justify-center md:justify-start text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {item.destino}</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> Despacho: {item.fechaDespacho}</span>
                                </div>
                            </div>
                        </div>

                        {/* Estado Logístico, Valor FOB y Acción */}
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-none justify-between lg:justify-end">
                            <div className="text-center md:text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Precio FOB Pactado</p>
                                <p className="text-base font-sans font-black text-slate-800 flex items-center justify-center md:justify-end gap-1"><DollarSign size={14} className="text-emerald-500" />{item.precioFob}</p>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Estado de Tránsito</p>
                                <Badge className={cn(
                                    "border-none text-[9px] font-black px-3 py-1.5 uppercase tracking-wider rounded-md",
                                    item.estadoTránsito === 'Entregado' ? 'bg-emerald-50 text-emerald-700' :
                                    item.estadoTránsito === 'En Puerto' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                                )}>
                                    {item.estadoTránsito}
                                </Badge>
                            </div>
                            <Button
                                onClick={() => handleDownloadDDS(item.loteId)}
                                className="h-16 px-6 rounded-2xl bg-[#0F172A] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 border-none shrink-0"
                            >
                                <Download size={14} /> Descargar DDS
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
