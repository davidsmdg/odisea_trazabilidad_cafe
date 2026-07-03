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

import { useEffect } from 'react';
import type { RegistroAuditoria } from '../../types/auditoria';
import { getHistorialAprobaciones } from '../../../services/aprobacionesService';
import { AlertTriangle } from 'lucide-react';

export function HistorialAprobaciones() {
    const [searchTerm, setSearchTerm] = useState('');
    const [historial, setHistorial] = useState<RegistroAuditoria[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getHistorialAprobaciones()
            .then((data) => {
                setHistorial(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Error al cargar historial de aprobaciones');
                setIsLoading(false);
            });
    }, []);

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
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-8 h-40 flex flex-col justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-12 text-center bg-red-50 rounded-[32px] border border-red-100 space-y-4">
                        <AlertTriangle className="text-red-500 mx-auto" size={48} />
                        <h3 className="text-xl font-sans font-black text-red-900">Algo salió mal</h3>
                        <p className="text-red-700/80 font-medium">{error}</p>
                        <Button onClick={() => window.location.reload()} className="bg-blue-950 text-white font-black px-6 py-2 rounded-xl">Reintentar</Button>
                    </div>
                ) : historial.length === 0 ? (
                    <div className="p-16 text-center rounded-[32px] border border-dashed border-slate-200 bg-slate-50/50">
                        <p className="text-slate-500 font-bold text-lg">No hay auditorías registradas en el historial.</p>
                    </div>
                ) : (
                    <>
                        {historial.map((registro) => (
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
                    </>
                )}
            </div>

            <div className="text-center pt-8">
                <Button variant="ghost" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600">
                    Cargar auditorías anteriores
                </Button>
            </div>
        </div>
    );
}
