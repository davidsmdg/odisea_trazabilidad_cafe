import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    Coffee,
    Beaker,
    Save,
    Quote,
    Flame,
    FlaskConical,
    Award,
    Scale,
    Droplets,
    Wind,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import { SensorRadar } from '../SensorRadar';

interface FormCataRoaster {
    acidez: number;
    cuerpo: number;
    dulzor: number;
    balance: number;
    limpieza: number;
    notasTueste: string;
}

const MOCK_ORIGINAL = [
    { attribute: 'Acidez', value: 8.5 },
    { attribute: 'Cuerpo', value: 8.0 },
    { attribute: 'Dulzor', value: 8.5 },
    { attribute: 'Balance', value: 8.25 },
    { attribute: 'Limpieza', value: 9.0 },
];

export function LaboratorioTostador() {
    const { loteId } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const { register, control, handleSubmit, setValue } = useForm<FormCataRoaster>({
        defaultValues: {
            acidez: 8.0,
            cuerpo: 8.0,
            dulzor: 8.0,
            balance: 8.0,
            limpieza: 8.5,
            notasTueste: '',
        }
    });

    const values = useWatch({ control });

    const totalScore = useMemo(() => {
        const sum = (values.acidez || 0) +
            (values.cuerpo || 0) +
            (values.dulzor || 0) +
            (values.balance || 0) +
            (values.limpieza || 0);
        return (60 + sum / 5 * 5).toFixed(2);
    }, [values]);

    const myRadarData = useMemo(() => [
        { attribute: 'Acidez', value: values.acidez || 0 },
        { attribute: 'Cuerpo', value: values.cuerpo || 0 },
        { attribute: 'Dulzor', value: values.dulzor || 0 },
        { attribute: 'Balance', value: values.balance || 0 },
        { attribute: 'Limpieza', value: values.limpieza || 0 },
    ], [values]);

    const onSubmit = (data: FormCataRoaster) => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Valoración registrada correctamente', {
                description: `Su perfil sensorial ha sido guardado para el lote ${loteId}.`,
                style: { borderRadius: '24px', background: '#2A1B12', color: '#E5D3B3' }
            });
            navigate('/tostador/lotes');
        }, 1500);
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 rounded-3xl border border-[#3E2C22] bg-white shadow-xl hover:bg-[#2A1B12] hover:text-white transition-all active:scale-95 group"
                        onClick={() => navigate(`/tostador/lote/${loteId || '084'}`)}
                    >
                        <ChevronLeft size={24} className="text-[#CD7F32]" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-serif font-black text-[#2A1B12] tracking-tight leading-none mb-1 uppercase">Validación Sensorial (Recibo)</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#CD7F32] bg-[#CD7F32]/10 px-3 py-1 rounded-full border border-[#CD7F32]/20">Muestra: {loteId || '084'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#2A1B12]/40 flex items-center gap-1.5"><FlaskConical size={10} /> Laboratorio de Tueste</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#2A1B12] text-[#E5D3B3] px-10 py-6 rounded-[40px] shadow-2xl flex items-center gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150"><Award size={100} /></div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#CD7F32] leading-none mb-2">Mi Puntaje Proyectado</p>
                        <p className="text-5xl font-serif font-black leading-none">{totalScore} <span className="text-xs font-sans font-black opacity-30 italic">PTS</span></p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT: Comparativa y Original (Read Only) */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-10">
                    <div className="bg-white rounded-[56px] border border-white shadow-2xl p-10 flex flex-col items-center gap-8 relative">
                        <div className="w-full h-[300px] opacity-40 group hover:opacity-100 transition-opacity">
                            <SensorRadar data={MOCK_ORIGINAL} />
                        </div>
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2A1B12]/5 rounded-full text-[#2A1B12] text-[9px] font-black uppercase tracking-widest leading-none">
                                <ShieldCheck size={12} className="text-[#CD7F32]" /> Perfil SCA Original (Laboratorio Ceres)
                            </div>
                            <p className="text-xs font-medium text-[#2A1B12]/40 leading-relaxed px-4">
                                Esta es la huella sensorial certificada por el Q-Grader asignado en origen. Úsela como base para calibrar su tueste.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full pt-8 border-t border-black/5">
                            <div className="p-6 rounded-[32px] bg-[#FAF9F6] border border-black/5 space-y-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#CD7F32]/60">Humedad Origen</span>
                                <p className="text-2xl font-serif font-black text-[#2A1B12]">11.2%</p>
                            </div>
                            <div className="p-6 rounded-[32px] bg-[#FAF9F6] border border-black/5 space-y-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#CD7F32]/60">Variedad</span>
                                <p className="text-2xl font-serif font-black text-[#2A1B12]">Bourbon Rosado</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Mi Formulario (D) */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-10">
                    <div className="bg-white rounded-[56px] border border-white shadow-2xl p-10 lg:p-14 space-y-12 h-full flex flex-col justify-between">
                        <div className="space-y-12">
                            <div className="flex flex-col md:flex-row gap-12">
                                {/* RADAR LIVE */}
                                <div className="md:w-1/2 flex flex-col items-center justify-center p-8 bg-[#2A1B12] rounded-[48px] shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#CD7F32] to-transparent opacity-40" />
                                    <div className="w-full h-[350px]">
                                        <SensorRadar data={myRadarData} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#CD7F32]/60 mt-4 leading-none">Mi Curva Sensorial</p>
                                </div>

                                {/* SLIDERS */}
                                <div className="md:w-1/2 space-y-8 h-full flex flex-col justify-center">
                                    {[
                                        { id: 'acidez', label: 'Acidez' },
                                        { id: 'cuerpo', label: 'Cuerpo' },
                                        { id: 'dulzor', label: 'Dulzor' },
                                        { id: 'balance', label: 'Balance' },
                                        { id: 'limpieza', label: 'Limpieza' },
                                    ].map((attr) => (
                                        <div key={attr.id} className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#2A1B12]">{attr.label}</Label>
                                                <span className="text-[#CD7F32] font-serif font-black italic text-xl">{(values as any)[attr.id]?.toFixed(2)}</span>
                                            </div>
                                            <Slider
                                                value={[(values as any)[attr.id] || 8.0]}
                                                min={6.0}
                                                max={10.0}
                                                step={0.25}
                                                onValueChange={([val]) => setValue(attr.id as any, val)}
                                                className="[&_[role=slider]]:bg-[#2A1B12] [&_[role=slider]]:border-[#CD7F32] [&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notas de Tueste */}
                            <div className="space-y-4 pt-10 border-t border-black/5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#2A1B12] mb-4 block">Bitácora de Tueste y Perfil Final</Label>
                                <textarea
                                    {...register('notasTueste')}
                                    placeholder="Defina el perfil de tueste (Ej: Tueste Medio, desarrollo 20%, primer crack a 192°). Notas encontradas..."
                                    className="w-full h-32 rounded-[32px] border-black/5 bg-[#FAF9F6] p-8 text-sm font-medium focus:ring-8 focus:ring-[#CD7F32]/5 focus:border-[#CD7F32] outline-none transition-all placeholder:text-[#2A1B12]/20 resize-none font-serif text-[#2A1B12]"
                                />
                            </div>
                        </div>

                        <div className="pt-12">
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="h-24 w-full rounded-[32px] bg-[#CD7F32] hover:bg-[#B87333] text-white font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-6 group overflow-hidden border-none"
                            >
                                <Save size={28} className="group-hover:rotate-12 transition-transform" />
                                {isSaving ? 'Sincronizando Mis Datos...' : 'Guardar Mi Valoración Sensorial'}
                            </Button>
                            <p className="text-center text-[10px] font-black text-[#2A1B12]/20 uppercase tracking-[0.4em] mt-8 font-sans">
                                ROASTMASTER B2B VALIDATION MODULE v2.0
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

// Missing icons
import { ShieldCheck } from 'lucide-react';
