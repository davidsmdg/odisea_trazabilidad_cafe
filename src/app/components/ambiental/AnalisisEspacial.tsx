import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    ShieldAlert,
    ShieldCheck,
    Navigation,
    FileText,
    ExternalLink,
    Map as MapIcon,
    AlertTriangle,
    CheckCircle2,
    Save,
    Satellite,
    TreePine,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

export function AnalisisEspacial() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    // Validation states
    const [valCoordinate, setValCoordinate] = useState(true);
    const [valPlanManejo, setValPlanManejo] = useState(true);
    const [isDeforestationAlert, setIsDeforestationAlert] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Concepto Ambiental Emitido', {
                description: `Predio ${id} validado correctamente.`,
                style: { borderRadius: '24px', background: '#ecfdf5', border: '1px solid #064E3B20', color: '#064E3B' }
            });
            navigate('/ambiental/revisiones');
        }, 1500);
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Minimalist Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all active:scale-95 group"
                        onClick={() => navigate('/ambiental/revisiones')}
                    >
                        <ChevronLeft size={24} className="text-gray-400 group-hover:text-[#064E3B] transition-colors" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-serif font-black text-[#064E3B] tracking-tight leading-none mb-1">Análisis de Cumplimiento</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Expediente {id || 'FL-001'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse flex items-center gap-1.5"><Satellite size={10} /> Escaneo Satelital Activo</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-[28px] border border-gray-100 shadow-sm">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-emerald-800">U{i}</div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900 border-l border-emerald-100 pl-4">3 Usuarios en línea</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* COLUMN 1: Análisis Espacial (Left) */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-10">
                    <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl p-10 space-y-8 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-serif font-black text-emerald-950 flex items-center gap-3 group-hover:scale-105 transition-transform origin-left">
                                    <MapIcon size={24} className="text-emerald-500" /> Coordenadas y Poligonal
                                </h3>
                                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Verificación Espacial EUDR / GPS</p>
                            </div>
                            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <ShieldCheck size={14} className="text-emerald-600" />
                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Capas Activas: Global Forest Watch</span>
                            </div>
                        </div>

                        {/* Coordinate Data Cards */}
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="bg-emerald-50/30 p-6 rounded-[32px] border border-emerald-100/50 space-y-2 group/coord hover:bg-emerald-50 transition-colors">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#064E3B]/40 block">Latitud</span>
                                <p className="text-2xl font-serif font-black text-[#064E3B]">1.88452</p>
                            </div>
                            <div className="bg-emerald-50/30 p-6 rounded-[32px] border border-emerald-100/50 space-y-2 group/coord hover:bg-emerald-50 transition-colors">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#064E3B]/40 block">Longitud</span>
                                <p className="text-2xl font-serif font-black text-[#064E3B]">-76.29712</p>
                            </div>
                        </div>

                        {/* MOCK MAP VISUALIZER */}
                        <div className="relative rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-slate-900 group/map h-[450px]">
                            {/* Satellite Image Mock (from generate_image) */}
                            <img
                                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1400"
                                alt="Satellite View"
                                className="w-full h-full object-cover opacity-80 group-hover/map:scale-110 transition-transform duration-[20s] ease-linear"
                            />

                            {/* Overlay UI elements */}
                            <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay" />
                            <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-white text-[10px] font-mono leading-relaxed">
                                        [SCANNING_AREA_BETA] <br />
                                        SIGNAL_STRENGTH: 98% <br />
                                        REF: EU-HULA-001
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-emerald-400 group-hover/map:scale-125 transition-transform shadow-[0_0_40px_rgba(52,211,153,0.8)] border-4 border-white flex items-center justify-center">
                                        <Navigation size={14} className="text-[#064E3B] animate-pulse" />
                                    </div>
                                </div>
                                <div className="bg-black/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/5 text-white flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center"><TreePine size={20} className="text-emerald-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Análisis Geoespacial</p>
                                            <p className="text-sm font-bold">Sin alertas de deforestación detectadas desde 2020</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[#064E3B] font-black py-1.5 px-4 rounded-full border-none shadow-lg">CALIFICADO</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Alert Info for verifying EUDR */}
                        <div className="p-8 rounded-[40px] bg-emerald-900 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><AlertTriangle size={120} /></div>
                            <div className="h-20 w-20 rounded-[32px] bg-emerald-400/20 flex items-center justify-center shrink-0 border border-emerald-400/20 shadow-inner">
                                <ShieldAlert size={32} className="text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-serif font-black tracking-tight">Cruce EUDR Deforestación</h4>
                                <p className="text-sm font-medium text-emerald-100 opacity-70 leading-relaxed">Punto verificado contra el historial satelital del Amazonas/Andes. Cumple la fecha de corte 31 Dic 2020.</p>
                            </div>
                        </div>

                        {/* SWITCH VALIDATION 1 */}
                        <div className="pt-8 flex items-center justify-between border-t border-emerald-50">
                            <div>
                                <h5 className="text-sm font-black uppercase tracking-widest text-[#064E3B]">Concepto Espacial</h5>
                                <p className="text-xs text-gray-400 font-medium">Confirma que la coordenada es válida y libre de degradación forestal.</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label htmlFor="coord-val" className={cn("text-xs font-black uppercase tracking-widest", valCoordinate ? "text-emerald-600" : "text-gray-300")}>
                                    {valCoordinate ? 'Validado y Limpio' : 'Rechazar por Poligonal'}
                                </Label>
                                <Switch
                                    id="coord-val"
                                    checked={valCoordinate}
                                    onCheckedChange={setValCoordinate}
                                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-200 border-2 border-transparent transition-all shadow-sm h-7 w-12 [&_[role=switch]]:h-5 [&_[role=switch]]:w-5"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: Análisis Documental (Right) */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-10">
                    <div className="bg-white rounded-[48px] border border-gray-100 shadow-xl p-10 space-y-8 h-full flex flex-col justify-between">
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-serif font-black text-emerald-950 flex items-center gap-3">
                                    <FileText size={24} className="text-emerald-500" /> Plan de Manejo Ambiental
                                </h3>
                                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Verificación de cumplimiento normativo</p>
                            </div>

                            {/* PDF MOCK VISUALIZER */}
                            <div className="bg-[#F8FBFA] border-4 border-dashed border-emerald-100 rounded-[40px] p-12 flex flex-col items-center justify-center text-center gap-6 group hover:border-emerald-300 transition-all active:scale-95 cursor-pointer flex-1 h-[400px]">
                                <div className="w-24 h-24 rounded-[32px] bg-white shadow-xl flex items-center justify-center text-emerald-100 group-hover:text-emerald-500 transition-colors border border-gray-50 scale-110 group-hover:scale-125 duration-500">
                                    <FileText size={48} />
                                </div>
                                <div>
                                    <p className="text-lg font-serif font-black text-emerald-950 leading-tight mb-2 uppercase tracking-tighter">Plan_Manejo_PMA_001.pdf</p>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Soporta: Reforestación y Manejo de Aguas</p>
                                    <Button variant="outline" className="h-12 px-8 rounded-2xl border-emerald-100 text-emerald-700 font-black text-xs uppercase tracking-widest gap-2 bg-white hover:bg-emerald-50 shadow-sm transition-all">
                                        <ExternalLink size={14} /> Abrir visor PDF
                                    </Button>
                                </div>
                            </div>

                            {/* DOCUMENT INFO CARD */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-5 group hover:shadow-lg transition-all border-l-4 border-l-emerald-400">
                                    <div className="h-10 w-10 flex items-center justify-center bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 size={18} /></div>
                                    <p className="text-xs font-bold text-gray-700">Contiene plan de fertilización orgánica detallado.</p>
                                </div>
                                <div className="p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-5 group hover:shadow-lg transition-all border-l-4 border-l-emerald-400">
                                    <div className="h-10 w-10 flex items-center justify-center bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 size={18} /></div>
                                    <p className="text-xs font-bold text-gray-700">Firma técnica autorizada por CDA / Corporación.</p>
                                </div>
                            </div>
                        </div>

                        {/* SWITCH VALIDATION 2 */}
                        <div className="pt-8 flex items-center justify-between border-t border-emerald-50">
                            <div>
                                <h5 className="text-sm font-black uppercase tracking-widest text-[#064E3B]">Concepto Documental</h5>
                                <p className="text-xs text-gray-400 font-medium">El PMA cumple los estándares mínimos EUDR.</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label htmlFor="doc-val" className={cn("text-xs font-black uppercase tracking-widest", valPlanManejo ? "text-emerald-600" : "text-gray-300")}>
                                    {valPlanManejo ? 'Aprobado' : 'Rechazar'}
                                </Label>
                                <Switch
                                    id="doc-val"
                                    checked={valPlanManejo}
                                    onCheckedChange={setValPlanManejo}
                                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-200 border-2 border-transparent transition-all shadow-sm h-7 w-12 [&_[role=switch]]:h-5 [&_[role=switch]]:w-5"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="mt-12 flex justify-center">
                <Button
                    disabled={isSaving}
                    onClick={handleSave}
                    className="h-24 px-12 rounded-[32px] bg-[#064E3B] hover:bg-emerald-900 text-white font-black text-2xl shadow-[0_20px_50px_rgba(6,78,59,0.3)] transition-all active:scale-95 flex items-center justify-center gap-6 group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
                    <Save size={28} className="text-emerald-400 group-hover:scale-125 transition-transform" />
                    Emitir Concepto Ambiental Final
                </Button>
            </div>
            <p className="text-center text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.3em] mt-8">tracecafé automated environmental analysis hub v1.0.4</p>
        </div>
    );
}
