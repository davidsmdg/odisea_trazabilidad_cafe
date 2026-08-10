import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { updateLote, getLotePorId } from '../../../services/lotesService';
import { addCata } from '../../../services/catasService';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    Coffee,
    ClipboardCheck,
    Beaker,
    Save,
    Quote,
    Info,
    Droplets,
    Wind,
    Wheat,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import { SensorRadar } from '../SensorRadar';

interface FormCata {
    humedad: number;
    actividadAgua: number;
    defectosPrimarios: number;
    defectosSecundarios: number;
    acidez: number;
    cuerpo: number;
    dulzor: number;
    balance: number;
    limpieza: number;
    notas: string;
    macroperfil: string[];
}

const MOCK_LOTE = {
    id: 'LOT-HUILA-084',
    productor: 'María González',
    municipio: 'San Agustín, Huila',
    variedad: 'Bourbon Rosado & Geisha',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    descCosecha: 'Cosecha recolectada en el pico de madurez (grados Brix 24). Recolección manual selectiva grano a grano.',
    descBeneficio: 'Proceso Lavado con fermentación anaeróbica de 48 horas en tanques de acero inoxidable para resaltar acidez málica.',
    descSecado: 'Secado lento en marquesinas tipo túnel durante 15 días hasta alcanzar una humedad del 10.8%.',
};

export function EvaluacionSensorial() {
    const { loteId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [lote, setLote] = useState<any>(null);

    useEffect(() => {
        if (!loteId) return;
        if (user?.email === 'andres@finca.co') {
            setLote(MOCK_LOTE);
            return;
        }

        getLotePorId(loteId).then(loaded => {
            if (loaded) {
                setLote({
                    id: loaded.id,
                    productor: loaded.productor,
                    municipio: loaded.municipio || 'Huila, Colombia',
                    variedad: loaded.variedad || 'Variedad Desconocida',
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
                    descCosecha: 'Cosecha registrada en el sistema de trazabilidad de Odisea.',
                    descBeneficio: `Proceso registrado: ${loaded.proceso || 'Tradicional'}.`,
                    descSecado: 'Secado tradicional controlado en origen.'
                });
            } else {
                setLote(MOCK_LOTE); // fallback
            }
        }).catch(err => {
            console.error(err);
            setLote(MOCK_LOTE);
        });
    }, [loteId, user]);

    const { register, control, handleSubmit, setValue } = useForm<FormCata>({
        defaultValues: {
            humedad: 11.2,
            actividadAgua: 0.58,
            defectosPrimarios: 0,
            defectosSecundarios: 1,
            acidez: 7.5,
            cuerpo: 7.5,
            dulzor: 7.5,
            balance: 7.5,
            limpieza: 8.0,
            notas: '',
            macroperfil: ['Floral'],
        }
    });

    const values = useWatch({ control });

    const totalScore = useMemo(() => {
        const sum = (values.acidez || 0) +
            (values.cuerpo || 0) +
            (values.dulzor || 0) +
            (values.balance || 0) +
            (values.limpieza || 0);
        // SCA math: base 50 + attributes * (multiplier logic if simplified, here we sum directly + base 10 per cup etc, 
        // but let's keep it simple: Base 60 + sum of 5 attributes to reach 90s)
        return (60 + sum / 5 * 5).toFixed(2); // Simplified: Sum of 5 attributes + 60 base
    }, [values]);

    const radarData = useMemo(() => [
        { attribute: 'Acidez', value: values.acidez || 0 },
        { attribute: 'Cuerpo', value: values.cuerpo || 0 },
        { attribute: 'Dulzor', value: values.dulzor || 0 },
        { attribute: 'Balance', value: values.balance || 0 },
        { attribute: 'Limpieza', value: values.limpieza || 0 },
    ], [values]);

    const onSubmit = async (data: FormCata) => {
        setIsSaving(true);
        try {
            const selectedProfiles = data.macroperfil || [];
            const macroperfilString = selectedProfiles.join(', ');

            // Persistir los resultados en localStorage para propagar al resto de la app
            const savedLotes = localStorage.getItem('lotes_produccion');
            if (savedLotes) {
                try {
                    const lotes = JSON.parse(savedLotes);
                    const updated = lotes.map((l: any) => {
                        if (l.id === loteId || l.codigo === loteId) {
                            return {
                                ...l,
                                calificacion: parseFloat(totalScore),
                                macroperfil: macroperfilString,
                                perfilTaza: data.notes || data.notas,
                                fase: 3, // Asegurar que pasa a verde/trillado tras cata si aplica
                                cataDetalle: {
                                    acidez: data.acidez,
                                    cuerpo: data.cuerpo,
                                    dulzor: data.dulzor,
                                    balance: data.balance,
                                    limpieza: data.limpieza
                                }
                            };
                        }
                        return l;
                    });
                    localStorage.setItem('lotes_produccion', JSON.stringify(updated));
                } catch (e) {}
            }

            // Sincronizar en el almacén master de Odisea
            if (loteId) {
                await updateLote(loteId, {
                    calificacion: parseFloat(totalScore),
                    macroperfil: macroperfilString
                });

                if (user && user.email !== 'andres@finca.co') {
                    await addCata({
                        lote_id: loteId,
                        catador_id: user.id,
                        acidez: Number(data.acidez),
                        cuerpo: Number(data.cuerpo),
                        dulzor: Number(data.dulzor),
                        balance: Number(data.balance),
                        limpieza: Number(data.limpieza),
                        fragancia: 8.0,
                        sabor: 8.0,
                        puntaje_total: Number(totalScore),
                        comentarios: data.notas || data.notas,
                        desglose_notas: data.macroperfil || []
                    });
                }
            }

            toast.success('Cata registrada exitosamente', {
                description: `Puntaje Final: ${totalScore} Puntos SCA | Perfiles: ${macroperfilString}`,
                style: { borderRadius: '24px', background: '#FDFBF9', border: '1px solid #D7CCC8' }
            });
            navigate('/catador/muestras');
        } catch (err) {
            toast.error('Error al registrar la cata');
        } finally {
            setIsSaving(false);
        }
    };

    if (!lote) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FDFBF9]">
                <Coffee className="animate-spin text-[#5D4037]" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 rounded-3xl border border-[#D7CCC8] bg-white shadow-sm hover:shadow-xl transition-all active:scale-95 group"
                        onClick={() => navigate('/catador/muestras')}
                    >
                        <ChevronLeft size={24} className="text-[#8D6E63] group-hover:text-[#5D4037] transition-colors" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-sans font-black text-[#5D4037] tracking-tight leading-none mb-1 uppercase">Diligenciar Protocolo Sensorial</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] bg-[#EADDCA]/30 px-3 py-1 rounded-full border border-[#D7CCC8]">Lote: {loteId || 'LOT-HUILA-084'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Bache #3</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]/40 flex items-center gap-1.5 font-sans ml-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Laboratorio en Vivo</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#5D4037] text-white px-8 py-4 rounded-[40px] shadow-2xl flex items-center gap-6 group hover:translate-y-[-4px] transition-transform duration-500">
                    <div className="h-12 w-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
                        <Coffee size={24} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/50 leading-none mb-1">Puntaje Total Proyectado</p>
                        <p className="text-4xl font-sans font-black leading-none">{totalScore} <span className="text-xs font-sans font-black opacity-30">SCA</span></p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT COLUMN: Contexto del Lote (READ ONLY) */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <div className="bg-[#EADDCA]/20 rounded-[48px] border border-[#D7CCC8] p-10 space-y-10 shadow-sm">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="relative group/avatar">
                                <div className="absolute inset-0 bg-[#5D4037]/10 rounded-full blur-2xl group-hover:bg-[#5D4037]/20 transition-all" />
                                <div className="h-32 w-32 rounded-full border-4 border-white shadow-2xl overflow-hidden relative mb-6">
                                    <img src={lote.avatar} alt={lote.productor} className="h-full w-full object-cover" />
                                </div>
                                <div className="absolute bottom-6 right-0 bg-[#5D4037] text-white p-2 rounded-full border-4 border-white shadow-xl">
                                    <Quote size={12} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-sans font-black text-[#5D4037] tracking-tight">{lote.productor}</h3>
                            <p className="text-[#8D6E63] text-xs font-black uppercase tracking-[0.2em] mt-2 mb-6">{lote.municipio}</p>

                            <Badge className="bg-white hover:bg-white text-[#5D4037] border-2 border-[#EADDCA] rounded-full py-1.5 px-6 text-xs font-black uppercase tracking-widest shadow-sm">
                                Variedad: {lote.variedad}
                            </Badge>
                        </div>

                        {/* Accordions for Descriptions */}
                        <div className="space-y-4 pt-6">
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                <AccordionItem value="cosecha" className="border border-[#D7CCC8] bg-white rounded-[24px] overflow-hidden px-4 py-2 hover:border-[#8D6E63] transition-colors">
                                    <AccordionTrigger className="hover:no-underline py-4 text-[#5D4037] font-black uppercase tracking-widest text-[10px]">
                                        <div className="flex items-center gap-3"><Wheat size={16} className="text-[#8D6E63]" /> Cosecha</div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[#5D4037]/70 text-sm leading-relaxed px-2 font-medium bg-[#FDFBF9] rounded-xl p-4 mt-2">
                                        {lote.descCosecha}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="beneficio" className="border border-[#D7CCC8] bg-white rounded-[24px] overflow-hidden px-4 py-2 hover:border-[#8D6E63] transition-colors">
                                    <AccordionTrigger className="hover:no-underline py-4 text-[#5D4037] font-black uppercase tracking-widest text-[10px]">
                                        <div className="flex items-center gap-3"><Droplets size={16} className="text-[#8D6E63]" /> Beneficio</div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[#5D4037]/70 text-sm leading-relaxed px-2 font-medium bg-[#FDFBF9] rounded-xl p-4 mt-2">
                                        {lote.descBeneficio}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="secado" className="border border-[#D7CCC8] bg-white rounded-[24px] overflow-hidden px-4 py-2 hover:border-[#8D6E63] transition-colors">
                                    <AccordionTrigger className="hover:no-underline py-4 text-[#5D4037] font-black uppercase tracking-widest text-[10px]">
                                        <div className="flex items-center gap-3"><Wind size={16} className="text-[#8D6E63]" /> Secado</div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[#5D4037]/70 text-sm leading-relaxed px-2 font-medium bg-[#FDFBF9] rounded-xl p-4 mt-2">
                                        {lote.descSecado}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <div className="bg-[#5D4037]/5 p-6 rounded-[32px] border border-dashed border-[#D7CCC8] flex items-start gap-4">
                            <Info size={18} className="text-[#8D6E63] shrink-0 mt-1" />
                            <p className="text-[10px] text-[#5D4037]/60 font-medium leading-relaxed italic">
                                La información de contacto y ubicación exacta del agricultor está protegida para mantener la integridad del análisis sensorial ciego.
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Formulario de Cata (Diligenciar - Permiso D) */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-10">
                    <div className="bg-white rounded-[48px] border border-[#D7CCC8] shadow-2xl p-10 flex flex-col gap-12">
                        <div className="flex flex-col md:flex-row gap-12">
                            {/* RADAR CHART (Real-time) */}
                            <div className="md:w-1/2 flex flex-col items-center justify-center p-6 bg-[#FDFBF9] rounded-[40px] border border-[#EADDCA] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-full h-[350px]">
                                    <SensorRadar data={radarData} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] mt-4">Perfil Sensorial Proyectado</p>
                            </div>

                            {/* SLIDERS SECTION */}
                            <div className="md:w-1/2 space-y-10">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-[#5D4037] flex items-center gap-3">
                                        <ClipboardCheck size={18} className="text-[#8D6E63]" /> Atributos Críticos SCA
                                    </h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Rango Profesional: 6.00 — 10.00 pts</p>
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
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs font-black uppercase tracking-widest text-[#5D4037]">{attr.label}</Label>
                                                <Badge className="bg-[#EADDCA] text-[#5D4037] font-sans font-black text-xl hover:bg-[#EADDCA] h-10 px-4 rounded-xl shadow-inner tabular-nums">
                                                    {(values as any)[attr.id]?.toFixed(2)}
                                                </Badge>
                                            </div>
                                            <Slider
                                                value={[(values as any)[attr.id] || 7.5]}
                                                min={6.0}
                                                max={10.0}
                                                step={0.25}
                                                onValueChange={([val]) => setValue(attr.id as any, val)}
                                                className="[&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:bg-[#5D4037] [&_[role=slider]]:shadow-xl [&_[role=slider]]:transition-all hover:[&_[role=slider]]:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ANÁLISIS FÍSICO */}
                        <div className="space-y-6 pt-10 border-t border-[#EADDCA]">
                            <div className="space-y-2">
                                <h4 className="text-sm font-black uppercase tracking-widest text-[#5D4037] flex items-center gap-3">
                                    <Beaker size={18} className="text-[#8D6E63]" /> Análisis Físico en Verde
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Humedad, Actividad de Agua y Defectos Muestra 350g</p>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]">Humedad (%)</Label>
                                    <Input type="number" step="0.1" {...register('humedad')} className="h-12 rounded-xl text-lg font-bold text-[#5D4037] bg-[#FDFBF9] border-[#D7CCC8]" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]">Actividad Agua (aW)</Label>
                                    <Input type="number" step="0.01" {...register('actividadAgua')} className="h-12 rounded-xl text-lg font-bold text-[#5D4037] bg-[#FDFBF9] border-[#D7CCC8]" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]">Def. Primarios</Label>
                                    <Input type="number" {...register('defectosPrimarios')} className="h-12 rounded-xl text-lg font-bold text-[#5D4037] bg-[#FDFBF9] border-[#D7CCC8]" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]">Def. Secundarios</Label>
                                    <Input type="number" {...register('defectosSecundarios')} className="h-12 rounded-xl text-lg font-bold text-[#5D4037] bg-[#FDFBF9] border-[#D7CCC8]" />
                                </div>
                            </div>
                        </div>

                        {/* NOTAS Y GUARDADO */}
                        <div className="space-y-8 pt-10 border-t border-[#EADDCA]">
                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-[#5D4037] block">Clasificación de Macroperfiles (Selecciona uno o más)</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FDFBF9] p-6 rounded-[24px] border border-[#D7CCC8]">
                                    {[
                                        'Floral', 'Frutal bayas', 'Frutal cítrico', 'Vinoso', 'Nueces', 'Cacao', 'Especiado', 'Dulce Vainilla', 'Dulce Azúcar morena'
                                    ].map(option => {
                                        const isChecked = (values.macroperfil || []).includes(option);
                                        return (
                                            <label
                                                key={option}
                                                className={cn(
                                                    "flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all select-none text-[11px] font-black uppercase tracking-wider justify-center text-center",
                                                    isChecked 
                                                        ? "bg-[#5D4037] border-[#5D4037] text-white shadow-lg" 
                                                        : "bg-white border-gray-100 text-[#5D4037] hover:border-[#5D4037]/20"
                                                )}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        const current = values.macroperfil || [];
                                                        const updated = e.target.checked 
                                                            ? [...current, option] 
                                                            : current.filter(o => o !== option);
                                                        setValue('macroperfil', updated);
                                                    }}
                                                    className="hidden"
                                                />
                                                <span>{isChecked ? '✓' : '+'}</span>
                                                <span>{option}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-[#5D4037] mb-4 block">Descripción de Perfil (Notas de Cata)</Label>
                                <textarea
                                    {...register('notas')}
                                    placeholder="Ej: Fragancia a chocolate negro, aroma cítrico a naranja, sabor residual persistente..."
                                    className="w-full h-32 rounded-[24px] border-[#D7CCC8] bg-[#FDFBF9] p-6 text-sm font-medium focus:ring-4 focus:ring-[#EADDCA]/30 focus:border-[#5D4037] outline-none transition-all placeholder:text-gray-300 resize-none font-sans text-[#5D4037]"
                                />
                            </div>

                             <Button
                                type="submit"
                                disabled={isSaving}
                                className="h-16 sm:h-24 w-full rounded-2xl sm:rounded-[32px] bg-[#5D4037] hover:bg-[#3E2723] text-white font-black text-lg sm:text-2xl shadow-[0_20px_50px_rgba(93,64,55,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 sm:gap-6 group overflow-hidden relative border-none"
                            >
                                <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
                                <Save size={20} className="text-[#D7CCC8] group-hover:scale-125 transition-transform shrink-0 sm:h-7 sm:w-7" />
                                {isSaving ? 'Registrando Protocolo...' : 'Guardar Resultados de Cata'}
                            </Button>

                            <p className="text-center text-[10px] font-black text-[#8D6E63]/40 uppercase tracking-[0.3em] font-sans">
                                LABSENSORY TECHNICAL PROTOCOL v4.0 — ISO 17025 COMPLIANT
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
