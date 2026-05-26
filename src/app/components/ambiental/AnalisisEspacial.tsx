import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    ShieldAlert,
    ShieldCheck,
    Navigation,
    Save,
    Satellite,
    TreePine,
    Landmark,
    Droplets,
    FlaskConical,
    Bug,
    Info,
    XCircle,
    CheckCircle2,
    Map as MapIcon,
    Camera,
    FileText,
    FileUp,
    MapPin,
    Calendar,
    User
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

type Tab = 'mapa' | 'visita' | 'auditoria';

const ValidationSection = ({
    title, icon: Icon, description, isActive, onToggle, children
}: {
    title: string; icon: any; description: string; isActive: boolean; onToggle: (val: boolean) => void; children: React.ReactNode
}) => (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden group">
        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500", isActive ? "bg-emerald-500" : "bg-rose-500")} />
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-sans font-black text-slate-800 uppercase tracking-tight">{title}</h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{description}</p>
                    </div>
                </div>
                <div className="pl-4 border-l-2 border-slate-100 py-2 space-y-4">
                    {children}
                </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50/80 p-1.5 rounded-full border border-slate-100 shadow-inner h-fit shrink-0">
                <button onClick={() => onToggle(false)} className={cn("h-10 px-4 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer", !isActive ? "bg-rose-500 text-white shadow-lg" : "text-slate-400 hover:text-rose-500")}><XCircle size={14} /> Incumple</button>
                <button onClick={() => onToggle(true)} className={cn("h-10 px-4 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer", isActive ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600")}><CheckCircle2 size={14} /> Cumple</button>
            </div>
        </div>
    </div>
);

export function AnalisisEspacial() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('mapa');

    // Layers (Map Tab)
    const [layerIdeam, setLayerIdeam] = useState(true);
    const [layerUpra, setLayerUpra] = useState(true);
    const [layerParques, setLayerParques] = useState(false);
    const [layerAgua, setLayerAgua] = useState(false);

    // Validation (Auditoria Tab)
    const [valDeforestacion, setValDeforestacion] = useState(false);
    const [valEstatusJuridico, setValEstatusJuridico] = useState(false);
    const [valAgua, setValAgua] = useState(false);
    const [valInsumos, setValInsumos] = useState(false);
    const [valBiodiversidad, setValBiodiversidad] = useState(false);

    // Visita de Campo
    const [observacion, setObservacion] = useState('');

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Auditoría Ambiental Guardada', {
                description: `Expediente ${id} validado y emitido correctamente.`,
                style: { borderRadius: '24px', background: '#ecfdf5', border: '1px solid #4A5B4A20', color: '#4A5B4A' }
            });
            navigate('/ambiental/historial');
        }, 1500);
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Minimalist Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4 px-4">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all active:scale-95 group shrink-0 cursor-pointer"
                        onClick={() => navigate('/ambiental/revisiones')}
                    >
                        <ChevronLeft size={24} className="text-gray-400 group-hover:text-[#4A5B4A] transition-colors" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#4A5B4A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Expediente {id || 'FL-001'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><MapPin size={10} /> Finca La Esperanza, Huila</span>
                        </div>
                        <h1 className="text-3xl font-sans font-black text-slate-900 tracking-tight leading-none">
                            Consola de Auditoría EUDR
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-xs font-bold text-slate-600">
                    <User size={14} className="text-[#4A5B4A]" /> Productor: María González
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex bg-slate-100 p-1.5 rounded-full w-max mx-4 mb-10 overflow-hidden shadow-inner">
                <button
                    onClick={() => setActiveTab('mapa')}
                    className={cn("px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2", activeTab === 'mapa' ? "bg-white text-[#4A5B4A] shadow-sm" : "text-slate-500 hover:text-slate-800")}
                >
                    <MapIcon size={16} /> Mapa de Análisis
                </button>
                <button
                    onClick={() => setActiveTab('visita')}
                    className={cn("px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2", activeTab === 'visita' ? "bg-white text-[#4A5B4A] shadow-sm" : "text-slate-500 hover:text-slate-800")}
                >
                    <Navigation size={16} /> Visita de Campo
                </button>
                <button
                    onClick={() => setActiveTab('auditoria')}
                    className={cn("px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2", activeTab === 'auditoria' ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800")}
                >
                    <ShieldCheck size={16} /> Dictamen Final
                </button>
            </div>

            <div className="px-4">
                <AnimatePresence mode="wait">
                    {/* ===== TAB 1: MAPA DE ANÁLISIS ===== */}
                    {activeTab === 'mapa' && (
                        <motion.div
                            key="mapa"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden flex flex-col lg:flex-row h-[700px]"
                        >
                            {/* Layer Sidebar */}
                            <div className="lg:w-[350px] bg-slate-50 border-r border-slate-100 p-8 flex flex-col h-full overflow-y-auto">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Satellite size={16} className="text-[#4A5B4A]" /> Capas Base (Multitemporal)
                                </h3>

                                <div className="space-y-4 flex-1">
                                    <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm cursor-pointer hover:border-emerald-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><TreePine size={14} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Capa IDEAM 2021</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Deforestación</p>
                                            </div>
                                        </div>
                                        <Switch checked={layerIdeam} onCheckedChange={setLayerIdeam} className="data-[state=checked]:bg-emerald-500" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Landmark size={14} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Frontera Agrícola</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">UPRA Oficial</p>
                                            </div>
                                        </div>
                                        <Switch checked={layerUpra} onCheckedChange={setLayerUpra} className="data-[state=checked]:bg-blue-500" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600"><ShieldAlert size={14} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Parques Nacionales</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">PNN y Páramos</p>
                                            </div>
                                        </div>
                                        <Switch checked={layerParques} onCheckedChange={setLayerParques} className="data-[state=checked]:bg-amber-500" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600"><Droplets size={14} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Rondas Hídricas</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Buffer 30m</p>
                                            </div>
                                        </div>
                                        <Switch checked={layerAgua} onCheckedChange={setLayerAgua} className="data-[state=checked]:bg-cyan-500" />
                                    </label>
                                </div>

                                <div className="mt-6 bg-[#4A5B4A] p-4 rounded-2xl text-white">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">Coordenadas del Lote</p>
                                    <p className="text-xl font-mono font-black">1.8845, -76.2971</p>
                                </div>
                            </div>

                            {/* Map Viewer */}
                            <div className="flex-1 bg-slate-900 relative group overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200"
                                    alt="Map View"
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[15s] ease-linear"
                                />

                                {/* Simulated Layers */}
                                {layerIdeam && <div className="absolute inset-0 border-[30px] border-emerald-500/10 pointer-events-none mix-blend-overlay" />}
                                {layerUpra && <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-3xl blur-md border-2 border-blue-400/30" />}
                                {layerParques && <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-2xl" />}
                                {layerAgua && <div className="absolute top-[40%] left-0 right-0 h-4 bg-cyan-400/40 blur-sm transform -rotate-12" />}

                                {/* Center Marker */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,1)] border-2 border-white animate-pulse" />
                                    <div className="mt-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-[10px] font-black tracking-widest uppercase">
                                        Polígono 001
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white flex items-center gap-3">
                                        <Info size={16} className="text-emerald-400" />
                                        <p className="text-xs font-bold">Análisis Espacial Coherente (0 Alertas Rojas)</p>
                                    </div>
                                    <Button onClick={() => setActiveTab('visita')} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest px-6 cursor-pointer">
                                        Siguiente Paso <ChevronLeft className="rotate-180 ml-2" size={14} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ===== TAB 2: VISITA DE CAMPO ===== */}
                    {activeTab === 'visita' && (
                        <motion.div
                            key="visita"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-10 flex flex-col md:flex-row gap-12"
                        >
                            <div className="md:w-1/2 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-sans font-black text-slate-800 mb-2">Resultados de Visita Técnica</h2>
                                    <p className="text-slate-500 font-medium">Documente los hallazgos en terreno. Esta información respalda el dictamen final EUDR y la debida diligencia de la finca.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#4A5B4A]">Fecha de la Visita</label>
                                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                            <Calendar size={18} className="text-slate-400" />
                                            <Input type="date" className="border-none bg-transparent shadow-none p-0 h-auto font-bold text-slate-700" defaultValue="2024-03-08" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#4A5B4A]">Observaciones Generales (Hallazgos)</label>
                                        <textarea
                                            value={observacion}
                                            onChange={(e) => setObservacion(e.target.value)}
                                            placeholder="Describa el estado de linderos, rondas hídricas, manejo de insumos observados..."
                                            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4A5B4A]/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-1/2 space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Archivos y Evidencia Fotográfica</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl h-32 flex flex-col items-center justify-center text-slate-400 hover:text-[#4A5B4A] hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer">
                                        <Camera size={24} className="mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Foto Linderos</span>
                                    </div>
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl h-32 flex flex-col items-center justify-center text-slate-400 hover:text-[#4A5B4A] hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer">
                                        <Droplets size={24} className="mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Foto Vertimientos</span>
                                    </div>
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl h-32 flex flex-col items-center justify-center text-slate-400 hover:text-[#4A5B4A] hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer">
                                        <FlaskConical size={24} className="mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Acopio Insumos</span>
                                    </div>
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl h-32 flex flex-col items-center justify-center text-slate-400 hover:text-[#4A5B4A] hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer">
                                        <FileUp size={24} className="mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Soporte/Permiso</span>
                                    </div>
                                </div>
                                <div className="pt-8 text-right flex justify-end">
                                    <Button onClick={() => setActiveTab('auditoria')} className="bg-[#4A5B4A] hover:bg-emerald-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest px-8 cursor-pointer h-14">
                                        Ir al Dictamen Final <ChevronLeft className="rotate-180 ml-2" size={16} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ===== TAB 3: DICTAMEN FINAL (Checklist) ===== */}
                    {activeTab === 'auditoria' && (
                        <motion.div
                            key="auditoria"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Protocolo de Verificación Estricta</p>

                            <ValidationSection
                                title="1. Garantía de 'No Deforestación'"
                                description="Criterio Técnico (Corte: 29/07/2021)"
                                icon={TreePine}
                                isActive={valDeforestacion}
                                onToggle={setValDeforestacion}
                            >
                                <ul className="space-y-3">
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Análisis Multitemporal:</strong> Los polígonos de la parcela coinciden con capas del IDEAM, descartando deforestación post-2021.
                                    </li>
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Áreas Críticas:</strong> Inspección técnica descarta asociación de la finca con núcleos de tala cercanos.
                                    </li>
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Sistemas Agroforestales:</strong> Transformaciones forestales cumplen con aprovechamiento legal.
                                    </li>
                                </ul>
                            </ValidationSection>

                            <ValidationSection
                                title="2. Estatus Jurídico de la Zona"
                                description="Zonificación y Legislación Agrícola"
                                icon={Landmark}
                                isActive={valEstatusJuridico}
                                onToggle={setValEstatusJuridico}
                            >
                                <ul className="space-y-3">
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Frontera Agrícola:</strong> El predio está dentro de la Frontera Agrícola Nacional de la UPRA.
                                    </li>
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Áreas Protegidas:</strong> Cero traslape con Parques Nacionales, Páramos o Reservas Forestales.
                                    </li>
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Rondas Hídricas:</strong> Se respetan fajas de protección (mínimo 30m).
                                    </li>
                                </ul>
                            </ValidationSection>

                            <ValidationSection
                                title="3. Gestión de Vertimientos y Agua"
                                description="Protección del Recurso Hídrico"
                                icon={Droplets}
                                isActive={valAgua}
                                onToggle={setValAgua}
                            >
                                <ul className="space-y-3">
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Permisos Legales:</strong> Predios {'>'}5ha con concesión. Subsistencia con sistemas sépticos.
                                    </li>
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Tecnologías Limpias:</strong> Uso de Ecomill® o tratamientos de aguas mieles válidos.
                                    </li>
                                </ul>
                            </ValidationSection>

                            <ValidationSection
                                title="4. Manejo de Insumos y Residuos"
                                description="Sanidad y Conservación del Suelo"
                                icon={FlaskConical}
                                isActive={valInsumos}
                                onToggle={setValInsumos}
                            >
                                <ul className="space-y-3">
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Insumos Autorizados:</strong> Listados por ICA. No se usan etiquetas rojas.
                                    </li>
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Manejo de Envases:</strong> Implementado sistema de triple lavado certificado.
                                    </li>
                                </ul>
                            </ValidationSection>

                            <ValidationSection
                                title="5. Protección de Biodiversidad"
                                description="Equilibrio Ecológico"
                                icon={Bug}
                                isActive={valBiodiversidad}
                                onToggle={setValBiodiversidad}
                            >
                                <ul className="space-y-3">
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Cero Quemas:</strong> No hay quema de residuos, se evidencia compostaje.
                                    </li>
                                    <li className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <strong>Especies Amenazadas:</strong> Conservación de hábitats y corredores garantizada.
                                    </li>
                                </ul>
                            </ValidationSection>

                            {/* ACTION FOOTER */}
                            <div className="pt-8 flex justify-end">
                                <Button
                                    disabled={isSaving || !(valDeforestacion && valEstatusJuridico && valAgua && valInsumos && valBiodiversidad)}
                                    onClick={handleSave}
                                    className="h-20 px-12 rounded-[24px] bg-[#4A5B4A] hover:bg-emerald-950 text-white font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={24} className={isSaving ? "animate-pulse" : "text-emerald-400"} />
                                    {isSaving ? "Guardando Datos..." : "Firmar y Emitir Aprobación"}
                                </Button>
                            </div>

                            {!(valDeforestacion && valEstatusJuridico && valAgua && valInsumos && valBiodiversidad) && (
                                <p className="text-right text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-4">Debes marcar como "Cumple" todas las condiciones normativas EUDR para aprobar el expediente.</p>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
