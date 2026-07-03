import { useState } from 'react';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    MapPin,
    User,
    ShieldCheck,
    FileText,
    Calendar,
    Hash
} from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

interface RegistroAuditoria {
    id: string; // Report ID
    productor: string;
    finca: string;
    ubicacion: string;
    fecha: string; // ISO or readable
    verificador: string;
    verificadorID: string;
    estado: 'Aprobado' | 'Rechazado' | 'Condicionado';
    area: string;
    hashDocumento: string; // To simulate immutable blockchain/timestamp proof
}

const HISTORIAL_MOCK: RegistroAuditoria[] = [
    {
        id: 'DD-EUDR-2024-8842',
        productor: 'María González',
        finca: 'Finca La Esperanza',
        ubicacion: 'San Agustín, Huila',
        fecha: '2024-03-08 14:30:00 (UTC-5)',
        verificador: 'Laura Hernández',
        verificadorID: 'VA-092-COL',
        estado: 'Aprobado',
        area: '4.5 Ha',
        hashDocumento: '8f4c28b9e6db31e7...e5a2b',
    },
    {
        id: 'DD-EUDR-2024-8841',
        productor: 'Carlos Martínez',
        finca: 'Lote El Naranjo',
        ubicacion: 'Acevedo, Huila',
        fecha: '2024-03-07 09:15:22 (UTC-5)',
        verificador: 'Laura Hernández',
        verificadorID: 'VA-092-COL',
        estado: 'Rechazado',
        area: '12.0 Ha',
        hashDocumento: '3a1d9c49f8b2e10c...9f1b4',
    },
    {
        id: 'DD-EUDR-2024-8839',
        productor: 'Elena Ruiz',
        finca: 'Finca Santa Helena',
        ubicacion: 'Pitalito, Huila',
        fecha: '2024-03-05 16:45:10 (UTC-5)',
        verificador: 'Andrés Silva',
        verificadorID: 'VA-045-COL',
        estado: 'Condicionado',
        area: '8.2 Ha',
        hashDocumento: '5b8e1f7c3d9a2b4e...0c7d2',
    }
];

export function HistorialAprobaciones() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDownloadPDF = (id: string) => {
        toast.info(`Generando Certificado de Debida Diligencia para ${id}`, {
            icon: <FileText className="animate-pulse" />
        });
        setTimeout(() => {
            toast.success("Certificado EUDR descargado correctamente", {
                description: "El documento incluye firmas digitales y sellos de tiempo.",
                style: { borderRadius: '24px', padding: '20px' }
            });
        }, 1500);
    };

    return (
        <div className="space-y-10 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-4">

            {/* 1. HEADER Y RESUMEN DEL SISTEMA */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                        <ShieldCheck size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-800">Odisea Compliance Suite</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-sans font-black text-slate-900 tracking-tight leading-tight">
                        Registro Maestro de<br />Auditoría y Certificación
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        Historial inmutable de análisis de polígonos, deforestación y debida diligencia. Garantizamos la trazabilidad completa del auditor según directivas europeas (EUDR).
                    </p>
                </div>

                <div className="flex flex-col gap-4 bg-[#1A365D] rounded-[32px] p-6 text-white min-w-[300px] shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-300">Resumen Oficial (Últimos 30 días)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-3xl font-sans font-black">142</p>
                            <p className="text-[10px] font-bold uppercase text-blue-200">Aprobados</p>
                        </div>
                        <div>
                            <p className="text-3xl font-sans font-black text-rose-400">12</p>
                            <p className="text-[10px] font-bold uppercase text-blue-200">Rechazos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BARRA DE BÚSQUEDA Y FILTROS */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por ID de reporte, productor, finca o código de verificador..."
                        className="h-14 pl-14 rounded-2xl border-none bg-slate-50 font-bold text-slate-700 w-full focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 rounded-2xl px-6 border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-slate-50">
                        <Calendar size={18} /> Fecha
                    </Button>
                    <Button variant="outline" className="h-14 rounded-2xl px-6 border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-slate-50">
                        <Filter size={18} /> Filtrar
                    </Button>
                </div>
            </div>

            {/* 3. TABLA / LISTA DE AUDITORÍAS CON PROTOCOLO STRICTO */}
            <div className="space-y-4">
                {HISTORIAL_MOCK.map((registro) => (
                    <motion.div
                        key={registro.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                    >
                        {/* Status color bar */}
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-2 transition-colors",
                            registro.estado === 'Aprobado' ? 'bg-emerald-500' :
                                registro.estado === 'Rechazado' ? 'bg-rose-500' : 'bg-amber-400'
                        )} />

                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pl-4">

                            {/* Metadata principal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">

                                {/* Info Finca y Productor */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entidad Evaluada</p>
                                    <p className="text-sm font-sans font-black text-slate-900 leading-tight">{registro.finca}</p>
                                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1"><User size={12} /> {registro.productor}</p>
                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1"><MapPin size={10} /> {registro.ubicacion}</p>
                                </div>

                                {/* Info Verificación */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ejecución Auditoría</p>
                                    <p className="text-sm font-sans font-black text-slate-800 flex items-center gap-2"><Clock size={14} /> {registro.fecha}</p>
                                    <p className="text-xs font-bold text-slate-500">Área: {registro.area}</p>
                                </div>

                                {/* Datos Auditor */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditor / Verificador</p>
                                    <p className="text-sm font-sans font-black text-slate-800">{registro.verificador}</p>
                                    <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[9px] mt-1 shadow-none">ID: {registro.verificadorID}</Badge>
                                </div>

                                {/* ID Documento (Hash) */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporte / Checksum</p>
                                    <p className="text-xs font-mono font-bold text-blue-600">{registro.id}</p>
                                    <p className="text-[10px] font-mono font-medium text-slate-400 flex items-center gap-1 mt-1"><Hash size={10} /> {registro.hashDocumento}</p>
                                </div>

                            </div>

                            {/* Separator */}
                            <div className="h-px xl:h-20 xl:w-px bg-slate-100 hidden xl:block" />

                            {/* Acciones y Estado */}
                            <div className="flex flex-col sm:flex-row xl:flex-col items-center sm:items-end justify-between xl:justify-center gap-6 min-w-[200px]">
                                <div className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-xs uppercase tracking-widest w-full sm:w-auto justify-center",
                                    registro.estado === 'Aprobado' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                        registro.estado === 'Rechazado' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                                )}>
                                    {registro.estado === 'Aprobado' && <CheckCircle2 size={16} />}
                                    {registro.estado === 'Rechazado' && <XCircle size={16} />}
                                    {registro.estado === 'Condicionado' && <Clock size={16} />}
                                    {registro.estado}
                                </div>

                                <Button
                                    onClick={() => handleDownloadPDF(registro.id)}
                                    variant="outline"
                                    className="h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest gap-2 w-full sm:w-auto"
                                >
                                    <Download size={14} />
                                    <span className="hidden sm:inline">Descargar Certificado</span>
                                    <span className="sm:hidden">Certificado</span>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="text-center pt-8">
                <Button variant="ghost" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600">
                    Cargar auditorías anteriores
                </Button>
            </div>
        </div>
    );
}
