import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Microscope,
    Search,
    Filter,
    ArrowRight,
    SearchCheck,
    Beaker,
    Save,
    Coffee,
    Award,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { SensorRadar } from '../SensorRadar';
import { cn } from '../ui/utils';

export function CalidadControlCeres() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [foundLote, setFoundLote] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);

    // Recata (Control) Form States
    const [recata, setRecata] = useState({
        acidez: 8.0,
        cuerpo: 7.75,
        dulzor: 8.25,
        balance: 7.5,
        limpieza: 8.0,
    });

    const handleSearch = () => {
        if (!searchTerm) return;
        setFoundLote(true);
        toast.info('Lote encontrado en el sistema', {
            description: `Recuperando protocolo sensorial del Catador asignado.`,
            style: { borderRadius: '20px', background: '#f8fafc' }
        });
    };

    const handleSaveRecata = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Puntaje de Recata Guardado', {
                description: 'Este valor no podrá ser modificado (Permiso DC).',
                style: { borderRadius: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }
            });
            // Stay on page to see result
        }, 1500);
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

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Search Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <Microscope className="text-blue-600" size={40} /> Control de Calidad Master
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl text-sm uppercase tracking-[0.2em]">
                        Auditoría Sensorial y Verificación de Perfiles SCA
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-[32px] border border-slate-100 shadow-xl">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ingrese ID Lote (ej: 084)"
                            className="h-12 w-64 rounded-2xl border-slate-50 pl-12 pr-4 bg-slate-50 focus:bg-white transition-all font-bold text-slate-700"
                        />
                    </div>
                    <Button onClick={handleSearch} className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-black transition-all gap-2 font-black uppercase text-[10px] tracking-widest">
                        <SearchCheck size={18} /> Buscar Lote
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {foundLote ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        {/* LEFT: Sensory Result (Read Only C) */}
                        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                            <div className="bg-white rounded-[48px] border border-slate-200 p-10 space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Award size={140} className="text-blue-600" /></div>

                                <div className="space-y-1 relative">
                                    <Badge className="bg-blue-600 text-white rounded-full px-4 mb-4 uppercase text-[9px] font-black tracking-widest border-none">Oficial: Q-Grader Report</Badge>
                                    <h3 className="text-3xl font-serif font-black text-slate-900 leading-tight">Puntaje Oficial</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Avalado por LabSensory Labs v4</p>
                                </div>

                                <div className="h-48 w-full bg-slate-900 rounded-[40px] flex items-center justify-center relative group">
                                    <div className="text-center">
                                        <p className="text-6xl font-serif font-black text-white leading-none">86.25</p>
                                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-2">Puntos SCA</p>
                                    </div>
                                    <div className="absolute top-4 right-4"><Beaker size={20} className="text-slate-700" /></div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-50 pb-3">
                                        <span className="text-slate-400 uppercase tracking-widest text-[9px]">Fecha de Cata</span>
                                        <span>22 May 2024</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                        <span className="text-slate-400 uppercase tracking-widest text-[9px]">Catador Asignado</span>
                                        <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500" /> Q-Grader #1224</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-900 gap-2">
                                    Ver Protocolo Completo <ArrowRight size={14} />
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT: Recata Form (Write DC) */}
                        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                            <div className="bg-slate-900 rounded-[48px] p-10 space-y-12 shadow-2xl relative border border-white/5">
                                <div className="flex flex-col md:flex-row gap-12">
                                    {/* RADAR CHART (Control) */}
                                    <div className="md:w-1/2 flex flex-col items-center justify-center p-8 bg-slate-800 rounded-[40px] border border-white/5 group shadow-inner">
                                        <div className="w-full h-[350px]">
                                            <SensorRadar data={radarData} />
                                        </div>
                                        <div className="mt-8 text-center space-y-1">
                                            <p className="text-4xl font-serif font-black text-white leading-none">{totalScore}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Recata de Control Proyectada</p>
                                        </div>
                                    </div>

                                    {/* CONTROL SLIDERS */}
                                    <div className="md:w-1/2 space-y-10">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-blue-400 flex items-center gap-3">
                                                <Coffee size={18} /> Protocolo de Control (Recata)
                                            </h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Permisos: DC — Auditoría Sensorial</p>
                                        </div>

                                        <div className="space-y-8">
                                            {[
                                                { id: 'acidez', label: 'Acidez' },
                                                { id: 'cuerpo', label: 'Cuerpo' },
                                                { id: 'dulzor', label: 'Dulzor' },
                                                { id: 'balance', label: 'Balance' },
                                                { id: 'limpieza', label: 'Limpieza' },
                                            ].map((attr) => (
                                                <div key={attr.id} className="space-y-4">
                                                    <div className="flex justify-between items-center px-1">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white">{attr.label}</Label>
                                                        <span className="text-blue-400 font-serif font-black italic text-lg">{(recata as any)[attr.id]?.toFixed(2)}</span>
                                                    </div>
                                                    <Slider
                                                        value={[(recata as any)[attr.id]]}
                                                        min={6.0}
                                                        max={10.0}
                                                        step={0.25}
                                                        onValueChange={([val]) => setRecata(prev => ({ ...prev, [attr.id]: val }))}
                                                        className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-blue-500 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <Button
                                        onClick={handleSaveRecata}
                                        disabled={isSaving}
                                        className="h-24 w-full rounded-[32px] bg-blue-600 hover:bg-black text-white font-black text-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-6 group overflow-hidden border-none"
                                    >
                                        <Save size={28} className="group-hover:scale-125 transition-transform" />
                                        {isSaving ? 'Guardando Calibración...' : 'Fijar Resultado de Recata'}
                                    </Button>
                                    <div className="flex items-center justify-center gap-3 text-[9px] font-black text-slate-600 uppercase tracking-widest mt-8">
                                        <ShieldCheck size={14} className="text-blue-500/40" /> Auditoría de Calidad Blindada v2.0
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-[48px] border border-dashed border-slate-200 p-32 text-center space-y-6"
                    >
                        <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200 border-2 border-slate-50">
                            <Search size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-serif font-black text-slate-400">Sin Lote Seleccionado</h3>
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Ingrese un ID de lote arriba para iniciar el control de calidad</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
