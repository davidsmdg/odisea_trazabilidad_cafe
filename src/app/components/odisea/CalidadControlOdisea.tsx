import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Microscope,
    Search,
    Beaker,
    Save,
    Coffee,
    Award,
    ShieldCheck,
    Heart,
    MessageSquare,
    ClipboardCheck,
    Sparkles,
    Scale,
    Calendar,
    Droplets,
    Package,
    ArrowRight,
    ChevronLeft,
    Filter,
    X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { SensorRadar } from '../SensorRadar';
import { cn } from '../ui/utils';
import type { LoteUnificado } from '../../types/lote';
import { getLotes, updateLote } from '../../../services/lotesService';
import { AlertTriangle } from 'lucide-react';

export function CalidadControlOdisea() {
    const navigate = useNavigate();
    const [lotes, setLotes] = useState<LoteUnificado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reloadData = async () => {
        setIsLoading(true);
        try {
            const master = await getLotes();
            setLotes(Array.isArray(master) ? master : []);
        } catch (err) {
            setError('Error al obtener los lotes');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        reloadData();
    }, []);

    // Query param detection on load
    const queryParams = new URLSearchParams(window.location.search);
    const initialLoteId = queryParams.get('loteId') || '';
    const initialCatador = queryParams.get('catador') || '';

    const [selectedLoteId, setSelectedLoteId] = useState<string | null>(initialLoteId || null);
    const [catadorFilter, setCatadorFilter] = useState<string>(initialCatador || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'recata' | 'prep' | 'customer'>('recata');

    const selectedLote = useMemo(() => {
        if (!selectedLoteId) return null;
        return lotes.find(l => l.id === selectedLoteId) || null;
    }, [lotes, selectedLoteId]);

    // Recata States
    const [recata, setRecata] = useState({
        acidez: 8.0,
        cuerpo: 7.75,
        dulzor: 8.25,
        balance: 7.5,
        limpieza: 8.0,
    });

    // Alistamiento / Prep States
    const [humedad, setHumedad] = useState<number>(11.2);
    const [actividadAgua, setActividadAgua] = useState<number>(0.58);
    const [pasilla, setPasilla] = useState<number>(1.1);
    const [empaque, setEmpaque] = useState<string>('GrainPro');
    const [fechaPrueba, setFechaPrueba] = useState<string>(new Date().toISOString().split('T')[0]);

    // Synchronize states when selectedLote changes
    useEffect(() => {
        if (selectedLote) {
            setHumedad(selectedLote.pruebasAlistamiento?.humedad || 11.2);
            setActividadAgua(selectedLote.pruebasAlistamiento?.actividadAgua || 0.58);
            setPasilla(selectedLote.pruebasAlistamiento?.pasilla || 1.1);
            setEmpaque(selectedLote.pruebasAlistamiento?.empaque || 'GrainPro');
            setFechaPrueba(selectedLote.pruebasAlistamiento?.fecha || new Date().toISOString().split('T')[0]);

            // Approximate slider values from original score if no custom sliders
            const defaultAttr = selectedLote.calificacion ? (selectedLote.calificacion - 60) / 5 : 8.0;
            setRecata({
                acidez: defaultAttr,
                cuerpo: defaultAttr,
                dulzor: defaultAttr,
                balance: defaultAttr,
                limpieza: defaultAttr,
            });
        }
    }, [selectedLote]);

    // Read approved customer reviews for the selected lot
    const customerComments = useMemo(() => {
        if (!selectedLote) return [];
        const raw = localStorage.getItem('comentarios_publicos_aprobados');
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.filter((c: any) => c.loteId === selectedLote.id) : [];
        } catch (e) {
            return [];
        }
    }, [selectedLote]);

    // Aggregated notes count from customer reviews
    const noteCloud = useMemo(() => {
        const counts: Record<string, number> = {};
        customerComments.forEach((c: any) => {
            if (c.selectedNotes) {
                c.selectedNotes.forEach((n: string) => {
                    const cleaned = n.replace('_', ' ').toUpperCase();
                    counts[cleaned] = (counts[cleaned] || 0) + 1;
                });
            }
        });
        return Object.entries(counts).map(([note, count]) => ({ note, count }));
    }, [customerComments]);

    // List filtration logic for the intermediate overview
    const filteredLotes = useMemo(() => {
        let result = lotes;
        if (catadorFilter) {
            result = result.filter(l => l.catadorAsignado === catadorFilter);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(l => 
                l.id.toLowerCase().includes(term) ||
                l.productor.toLowerCase().includes(term) ||
                l.finca.toLowerCase().includes(term) ||
                l.municipio.toLowerCase().includes(term)
            );
        }
        return result;
    }, [lotes, catadorFilter, searchTerm]);

    // KPI Metrics calculations
    const stats = useMemo(() => {
        const total = filteredLotes.length;
        const evaluated = filteredLotes.filter(l => (l.calificacion ?? 0) > 0).length;
        const pending = total - evaluated;
        
        const sumEvaluated = filteredLotes.reduce((acc, curr) => acc + (curr.calificacion || 0), 0);
        const avg = evaluated > 0 ? (sumEvaluated / evaluated).toFixed(2) : '—';

        return { total, evaluated, pending, avg };
    }, [filteredLotes]);

    const handleSaveRecata = async () => {
        if (!selectedLote) return;
        setIsSaving(true);
        try {
            await updateLote(selectedLote.id, {
                calificacion: parseFloat(totalScore)
            });
            await reloadData();
            toast.success('Puntaje de Recata Guardado', {
                description: `ID: ${selectedLote.id} - Calificación recalibrada a ${totalScore} PTS.`,
                style: { borderRadius: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }
            });
        } catch (err) {
            toast.error('Error al guardar la recata');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePrep = async () => {
        if (!selectedLote) return;
        setIsSaving(true);
        try {
            await updateLote(selectedLote.id, {
                pruebasAlistamiento: {
                    humedad,
                    actividadAgua,
                    pasilla,
                    empaque,
                    fecha: fechaPrueba
                }
            });
            await reloadData();
            toast.success('Pruebas de Alistamiento Guardadas', {
                description: `ID: ${selectedLote.id} - Mediciones de humedad y empaque de exportación sincronizadas con éxito.`,
                style: { borderRadius: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }
            });
        } catch (err) {
            toast.error('Error al guardar las pruebas de alistamiento');
        } finally {
            setIsSaving(false);
        }
    };

    const radarData = useMemo(() => [
        { attribute: 'Acidez', value: recata.acidez },
        { attribute: 'Cuerpo', value: recata.cuerpo },
        { attribute: 'Dulzor', value: recata.dulzor },
        { attribute: 'Balance', value: recata.balance },
        { attribute: 'Limpieza', value: recata.limpieza },
    ], [recata]);

    const totalScore = useMemo(() => {
        return (60 + (recata.acidez + recata.cuerpo + recata.dulzor + recata.balance + recata.limpieza) / 5 * 5).toFixed(2);
    }, [recata]);

    if (isLoading) {
        return (
            <div className="max-w-[1400px] mx-auto pb-24 animate-pulse font-sans space-y-10 text-left">
                <div className="bg-white rounded-[40px] border border-slate-200 p-12 h-48 flex flex-col justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[1400px] mx-auto pb-24 font-sans text-center py-20 bg-white border border-slate-200 rounded-[40px] p-10 space-y-4 text-left">
                <AlertTriangle className="text-red-500 mx-auto" size={48} />
                <h2 className="text-2xl font-black text-red-900">Algo salió mal</h2>
                <p className="text-red-700/80 font-bold">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-slate-900 text-white font-black px-6 py-2 rounded-xl border-none">Reintentar</Button>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 text-left font-sans">
            <AnimatePresence mode="wait">
                {!selectedLote ? (
                    /* INTERMEDIATE INTERFACE: Bandeja de Monitoreo de Calidad */
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-10"
                    >
                        {/* Header & Catador Filter Status */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-sans font-black text-slate-900 tracking-tight flex items-center gap-4">
                                    <Microscope className="text-blue-600" size={40} /> Monitoreo y Aseguramiento de Calidad
                                </h1>
                                <p className="text-slate-400 font-medium max-w-2xl text-sm uppercase tracking-[0.2em]">
                                    Control Operativo de Calibración Sensorial y Alistamiento Físico
                                </p>
                            </div>

                            {/* Search Box */}
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-350" size={18} />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar Lote, Productor o Finca..."
                                    className="h-12 w-full rounded-2xl border-slate-200 pl-12 bg-white focus:ring-4 focus:ring-blue-500/5 font-semibold text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Catador Filter Active Warning Banner */}
                        {catadorFilter && (
                            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                                        <Filter size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-blue-950">Filtrando por Catador asignado</p>
                                        <p className="text-xs font-bold text-blue-700 mt-0.5">Mostrando únicamente lotes a cargo del Q-Grader: <span className="font-black underline">{catadorFilter}</span></p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => setCatadorFilter('')}
                                    variant="outline" 
                                    className="h-10 rounded-xl px-4 border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white cursor-pointer"
                                >
                                    <X size={14} /> Quitar Filtro
                                </Button>
                            </div>
                        )}

                        {/* Summary Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Lotes Registrados', value: stats.total, color: 'text-slate-900 bg-slate-50 border-slate-100' },
                                { label: 'Evaluados (SCA OK)', value: stats.evaluated, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                                { label: 'Pendientes de Cata', value: stats.pending, color: stats.pending > 0 ? 'text-amber-700 bg-amber-50 border-amber-100 animate-pulse' : 'text-slate-400 bg-slate-50 border-slate-100' },
                                { label: 'Puntaje Promedio taza', value: stats.avg, color: 'text-blue-700 bg-blue-50 border-blue-100' }
                            ].map((stat, idx) => (
                                <div key={idx} className={cn("p-6 rounded-[32px] border flex flex-col items-center justify-center text-center gap-2 shadow-xs", stat.color)}>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                                    <p className="text-2xl font-sans font-black leading-none">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Lotes QA Table/List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Listado de Monitoreo de Lotes</h3>
                            {filteredLotes.length === 0 ? (
                                <div className="p-20 text-center bg-white border border-slate-200 rounded-[48px] shadow-xs">
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">No se encontraron lotes para cata con este filtro.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredLotes.map((l) => {
                                        // Count customer reviews for this specific lot
                                        const rawComments = localStorage.getItem('comentarios_publicos_aprobados');
                                        let reviewCount = 0;
                                        try {
                                            if (rawComments) {
                                                const parsed = JSON.parse(rawComments);
                                                reviewCount = Array.isArray(parsed) ? parsed.filter((c: any) => c.loteId === l.id).length : 0;
                                            }
                                        } catch (e) {}

                                        return (
                                            <div 
                                                key={l.id}
                                                className="bg-white border border-slate-200/60 rounded-[32px] p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md hover:border-blue-200 transition-all text-left"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge className="bg-slate-100 text-slate-700 border-none font-black text-[9px] px-2 py-0.5 rounded uppercase">{l.id}</Badge>
                                                        <span className="text-[10px] font-black text-slate-350 uppercase tracking-wider">Catador: {l.catadorAsignado || 'Sin Asignar'}</span>
                                                    </div>
                                                    <h4 className="text-lg font-sans font-black text-slate-800 leading-none">Finca {l.finca}</h4>
                                                    <p className="text-xs font-bold text-slate-500">{l.productor} — {l.municipio} • <span className="text-slate-400">{l.variedad} ({l.proceso})</span></p>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-none border-slate-50">
                                                    {/* Cata Status */}
                                                    <div className="text-left lg:text-right">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Evaluación Sensorial</span>
                                                        {l.calificacion ? (
                                                            <Badge className="bg-amber-100/60 text-[#bb8d3b] border-none font-black text-[10px] px-2.5 py-1 rounded flex items-center gap-0.5">
                                                                ★ {l.calificacion.toFixed(2)} PTS
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-amber-50 text-amber-700 border-none font-black text-[10px] px-2.5 py-1 rounded">
                                                                Pendiente cata
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Prep Status */}
                                                    <div className="text-left lg:text-right">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Alistamiento Físico</span>
                                                        {l.pruebasAlistamiento ? (
                                                            <div className="text-[11px] font-black text-slate-700 uppercase">
                                                                💧 H: {l.pruebasAlistamiento.humedad}% | {l.pruebasAlistamiento.empaque}
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-slate-400 italic">Sin Medir</span>
                                                        )}
                                                    </div>

                                                    {/* Consumer Status */}
                                                    <div className="text-left lg:text-right">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Feedback Clientes</span>
                                                        <Badge className={cn("border-none text-[10px] font-black px-2.5 py-1 rounded", reviewCount > 0 ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-400")}>
                                                            {reviewCount} Opiniones
                                                        </Badge>
                                                    </div>

                                                    {/* Action button */}
                                                    <Button
                                                        onClick={() => setSelectedLoteId(l.id)}
                                                        className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 border-none cursor-pointer self-stretch"
                                                    >
                                                        Auditar <ArrowRight size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    /* DETAILED EDIT VIEW: Formulario y Calibrador del Lote Seleccionado */
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-10"
                    >
                        {/* Detail Header & Return button */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
                            <div className="flex items-center gap-6">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-14 w-14 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all active:scale-95 group cursor-pointer"
                                    onClick={() => setSelectedLoteId(null)}
                                >
                                    <ChevronLeft size={24} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                </Button>
                                <div>
                                    <h1 className="text-3xl font-sans font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Control de Calidad Lote</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5D4037] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">ID Lote: {selectedLote.id}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 font-sans"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sincronización QA Lista</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dropdown switch shortcut */}
                            <div className="flex items-center gap-4 bg-white p-4 rounded-[32px] border border-slate-200/60 shadow-md">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-2">Cambiar Lote:</Label>
                                <select
                                    value={selectedLoteId}
                                    onChange={(e) => setSelectedLoteId(e.target.value)}
                                    className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 font-black text-xs text-slate-700 outline-none cursor-pointer"
                                >
                                    {lotes.map(l => (
                                        <option key={l.id} value={l.id}>{l.id} - Finca {l.finca}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* LEFT COLUMN: Ficha del Lote y Radar */}
                            <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                                {/* Ficha Sensorial */}
                                <div className="bg-white rounded-[48px] border border-slate-200 p-8 space-y-6 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 pointer-events-none"><Award size={140} className="text-blue-600" /></div>
                                    
                                    <div className="space-y-1 relative">
                                        <Badge className="bg-blue-600 text-white rounded-full px-4 mb-3 uppercase text-[8px] font-black tracking-widest border-none">Ficha del Lote</Badge>
                                        <h3 className="text-2xl font-sans font-black text-slate-900 leading-tight">Origen y Varietal</h3>
                                    </div>

                                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-400">Productor</span>
                                            <span className="font-black text-slate-700">{selectedLote.productor}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-400">Finca</span>
                                            <span className="font-black text-slate-700">{selectedLote.finca}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-400">Variedad</span>
                                            <span className="font-black text-slate-700">{selectedLote.variedad}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-400">Proceso</span>
                                            <span className="font-black text-slate-700">{selectedLote.proceso}</span>
                                        </div>
                                    </div>

                                    <div className="h-44 w-full bg-slate-900 rounded-[36px] flex items-center justify-center relative">
                                        <div className="text-center">
                                            <p className="text-6xl font-sans font-black text-white leading-none">
                                                {selectedLote.calificacion ? selectedLote.calificacion.toFixed(2) : '85.00'}
                                            </p>
                                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-2">Puntos SCA Oficial</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sensor Radar */}
                                <div className="bg-slate-900 rounded-[48px] p-8 text-center space-y-6 shadow-xl border border-white/5">
                                    <div className="w-full h-[280px] flex items-center justify-center">
                                        <SensorRadar data={radarData} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-sans font-black text-white leading-none">{totalScore}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mt-1">Calibración Recata Proyectada</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Interactive QA Tabs */}
                            <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                                {/* Navigation Tabs */}
                                <div className="flex flex-wrap gap-3 pb-2 border-b border-slate-100">
                                    {[
                                        { id: 'recata', label: 'Recata & Calibración SCA', icon: Coffee },
                                        { id: 'prep', label: 'Alistamiento & Export QC', icon: ClipboardCheck },
                                        { id: 'customer', label: 'Opinión del Consumidor (' + customerComments.length + ')', icon: MessageSquare },
                                    ].map((t) => {
                                        const TabIcon = t.icon;
                                        return (
                                            <button
                                                key={t.id}
                                                onClick={() => setActiveTab(t.id as any)}
                                                className={cn(
                                                    "h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border-none transition-all cursor-pointer",
                                                    activeTab === t.id
                                                        ? "bg-slate-900 text-white shadow-md"
                                                        : "bg-slate-50 text-slate-455 hover:bg-slate-100 hover:text-slate-700"
                                                )}
                                            >
                                                <TabIcon size={14} /> {t.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <AnimatePresence mode="wait">
                                    {/* TAB 1: Recata */}
                                    {activeTab === 'recata' && (
                                        <motion.div
                                            key="recata-tab"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white border border-slate-200 shadow-xl rounded-[48px] p-10 space-y-8"
                                        >
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-sans font-black text-slate-800 flex items-center gap-3">
                                                    <Coffee size={24} className="text-blue-600" /> Protocolo de Control de Recata
                                                </h3>
                                                <p className="text-xs font-semibold text-slate-450">Ajuste los atributos sensoriales para realizar pruebas de calibración física o sensorial en origen.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                                {[
                                                    { id: 'acidez', label: 'Acidez' },
                                                    { id: 'cuerpo', label: 'Cuerpo' },
                                                    { id: 'dulzor', label: 'Dulzor' },
                                                    { id: 'balance', label: 'Balance' },
                                                    { id: 'limpieza', label: 'Limpieza' },
                                                ].map((attr) => (
                                                    <div key={attr.id} className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                        <div className="flex justify-between items-center">
                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-455">{attr.label}</Label>
                                                            <span className="text-blue-600 font-sans font-black text-base">{(recata as any)[attr.id]?.toFixed(2)}</span>
                                                        </div>
                                                        <Slider
                                                            value={[(recata as any)[attr.id]]}
                                                            min={6.0}
                                                            max={10.0}
                                                            step={0.25}
                                                            onValueChange={([val]) => setRecata(prev => ({ ...prev, [attr.id]: val }))}
                                                            className="[&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-none [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-slate-100">
                                                <Button
                                                    onClick={handleSaveRecata}
                                                    disabled={isSaving}
                                                    className="h-16 w-full rounded-2xl bg-slate-900 hover:bg-black text-white border-none font-black text-xs uppercase tracking-widest gap-3 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-md"
                                                >
                                                    <Save size={16} className="text-blue-400" />
                                                    {isSaving ? 'Guardando Calibración...' : 'Fijar y Guardar Recata de Control'}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* TAB 2: Prep Logístico QC */}
                                    {activeTab === 'prep' && (
                                        <motion.div
                                            key="prep-tab"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white border border-slate-200 shadow-xl rounded-[48px] p-10 space-y-8"
                                        >
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-sans font-black text-slate-800 flex items-center gap-3">
                                                    <ClipboardCheck size={24} className="text-emerald-600" /> Pruebas de Alistamiento & Alistamiento Físico
                                                </h3>
                                                <p className="text-xs font-semibold text-slate-455">Registre las métricas físicas y ambientales obligatorias del café verde antes del ensacado y exportación.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                                {/* Humedad */}
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Humedad Final (%)</Label>
                                                    <div className="relative">
                                                        <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            value={humedad}
                                                            onChange={(e) => setHumedad(parseFloat(e.target.value) || 0)}
                                                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-bold text-slate-700"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Actividad de Agua */}
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Actividad de Agua (aW)</Label>
                                                    <div className="relative">
                                                        <Beaker className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={actividadAgua}
                                                            onChange={(e) => setActividadAgua(parseFloat(e.target.value) || 0)}
                                                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-bold text-slate-700"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Defectos / Pasilla */}
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Porcentaje de Pasilla / Defectos (%)</Label>
                                                    <div className="relative">
                                                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            value={pasilla}
                                                            onChange={(e) => setPasilla(parseFloat(e.target.value) || 0)}
                                                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-bold text-slate-700"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Empaque */}
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Tipo de Empaque de Exportación</Label>
                                                    <div className="relative">
                                                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                        <select
                                                            value={empaque}
                                                            onChange={(e) => setEmpaque(e.target.value)}
                                                            className="h-14 w-full pl-12 pr-6 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none"
                                                        >
                                                            <option value="GrainPro">GrainPro + Saco de Yute</option>
                                                            <option value="Ecotact">Ecotact + Saco de Yute</option>
                                                            <option value="Saco Yute Estándar">Saco de Yute Estándar (Sin barrera)</option>
                                                            <option value="Cajas Especiales">Cajas al Vacío (24.5 kg)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Fecha Prueba */}
                                                <div className="space-y-3 md:col-span-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Fecha de Medición de Control</Label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                        <Input
                                                            type="date"
                                                            value={fechaPrueba}
                                                            onChange={(e) => setFechaPrueba(e.target.value)}
                                                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-bold text-slate-700"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-100">
                                                <Button
                                                    onClick={handleSavePrep}
                                                    disabled={isSaving}
                                                    className="h-16 w-full rounded-2xl bg-emerald-600 hover:bg-[#1b4332] text-white border-none font-black text-xs uppercase tracking-widest gap-3 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-md shadow-emerald-600/10"
                                                >
                                                    <Save size={16} />
                                                    {isSaving ? 'Guardando Mediciones...' : 'Fijar Pruebas de Alistamiento Físico'}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* TAB 3: Opinión del Consumidor */}
                                    {activeTab === 'customer' && (
                                        <motion.div
                                            key="customer-tab"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white border border-slate-200 shadow-xl rounded-[48px] p-10 space-y-8"
                                        >
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-sans font-black text-slate-800 flex items-center gap-3">
                                                    <MessageSquare size={24} className="text-purple-600" /> Valoración del Consumidor Final
                                                </h3>
                                                <p className="text-xs font-semibold text-slate-455">Análisis organoléptico e impacto social percibido por los clientes tras el escaneo del código QR.</p>
                                            </div>

                                            {/* Flavor Notes Cloud */}
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Notas de Perfil Percibidas por Clientes</Label>
                                                {noteCloud.length === 0 ? (
                                                    <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-xs font-bold text-slate-400">
                                                        No hay notas sensoriales registradas aún por consumidores.
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {noteCloud.map((n, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-2xl font-black text-xs border border-purple-100">
                                                                <span>{n.note}</span>
                                                                <Badge className="bg-purple-600 text-white font-black text-[9px] h-5 min-w-5 rounded-full flex items-center justify-center p-0">{n.count}</Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Reviews List */}
                                            <div className="space-y-6">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Comentarios Aprobados</Label>
                                                {customerComments.length === 0 ? (
                                                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                                        <p className="text-xs font-bold text-slate-400">No hay valoraciones aprobadas para mostrar en este lote.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {customerComments.map((c: any) => (
                                                            <div key={c.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex gap-1">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Heart
                                                                                key={star}
                                                                                size={14}
                                                                                className={cn(
                                                                                    star <= c.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"
                                                                                )}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-[9px] font-black text-slate-350 uppercase">{c.fecha}</span>
                                                                </div>
                                                                <p className="text-xs font-medium text-slate-600 italic">"{c.message}"</p>
                                                             </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
