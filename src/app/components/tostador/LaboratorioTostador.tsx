import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import {
    ChevronLeft,
    Save,
    FlaskConical,
    Award,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { SensorRadar } from '../SensorRadar';

interface FormCataRoaster {
    aroma: number;
    sabor: number;
    saborResidual: number;
    acidez: number;
    cuerpo: number;
    balance: number;
    puntajeCatador: number;
    notasTueste: string;
}

const MOCK_ORIGINAL = [
    { attribute: 'Aroma', value: 8.25 },
    { attribute: 'Sabor', value: 8.5 },
    { attribute: 'S. Residual', value: 8.0 },
    { attribute: 'Acidez', value: 8.5 },
    { attribute: 'Cuerpo', value: 8.25 },
    { attribute: 'Balance', value: 8.5 },
    { attribute: 'Global', value: 8.5 },
];

export function LaboratorioTostador() {
    const { loteId } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const { register, control, handleSubmit, setValue } = useForm<FormCataRoaster>({
        defaultValues: {
            aroma: 8.0,
            sabor: 8.0,
            saborResidual: 8.0,
            acidez: 8.0,
            cuerpo: 8.0,
            balance: 8.0,
            puntajeCatador: 8.0,
            notasTueste: '',
        }
    });

    const values = useWatch({ control });

    const totalScore = useMemo(() => {
        const sum = (values.aroma || 0) +
            (values.sabor || 0) +
            (values.saborResidual || 0) +
            (values.acidez || 0) +
            (values.cuerpo || 0) +
            (values.balance || 0) +
            (values.puntajeCatador || 0);
        // +30 puntos asumiendo 10/10 en Taza Limpia, Dulzor y Uniformidad (Estándar SCA Specialty)
        return (sum + 30).toFixed(2);
    }, [values]);

    const myRadarData = useMemo(() => [
        { attribute: 'Aroma', value: values.aroma || 0 },
        { attribute: 'Sabor', value: values.sabor || 0 },
        { attribute: 'S. Residual', value: values.saborResidual || 0 },
        { attribute: 'Acidez', value: values.acidez || 0 },
        { attribute: 'Cuerpo', value: values.cuerpo || 0 },
        { attribute: 'Balance', value: values.balance || 0 },
        { attribute: 'Global', value: values.puntajeCatador || 0 },
    ], [values]);

    const onSubmit = (data: FormCataRoaster) => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Calibración registrada exitosamente', {
                description: `Su curva sensorial ha sido guardada en Odisea Trace para el lote ${loteId}.`,
                style: { borderRadius: '24px', background: '#5f705f', color: '#ffffff' }
            });
            navigate('/tostador/laboratorio');
        }, 1500);
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 rounded-3xl border border-gray-200 bg-white shadow-sm hover:bg-[#5f705f] hover:text-white transition-all active:scale-95 group shrink-0"
                        onClick={() => navigate(`/tostador/lote/${loteId || '084'}`)}
                    >
                        <ChevronLeft size={24} className="text-[#bb8d3b] group-hover:text-white" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1.5 uppercase">
                            Calibración Sensorial (Recibo)
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#bb8d3b] bg-[#bb8d3b]/10 px-3 py-1 rounded-full border border-[#bb8d3b]/20">
                                Muestra: {loteId || '084'}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                <FlaskConical size={10} /> Laboratorio Tostador Odisea
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#5f705f] text-white px-10 py-6 rounded-[32px] shadow-md flex items-center gap-8 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150"><Award size={100} /></div>
                    <div className="text-right z-10">
                        <p className="text-[9px] font-black uppercase tracking-wider text-[#bb8d3b] leading-none mb-1.5">Mi Puntaje de Tueste</p>
                        <p className="text-5xl font-black leading-none">{totalScore} <span className="text-xs font-black opacity-40 italic">PTS</span></p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: Comparativa y Original (Read Only) */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-8 relative">
                        <div className="w-full h-[300px] opacity-60 hover:opacity-100 transition-opacity">
                            <SensorRadar data={MOCK_ORIGINAL} />
                        </div>
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full text-gray-800 text-[9px] font-black uppercase tracking-wider leading-none border border-gray-100">
                                <ShieldCheck size={12} className="text-[#bb8d3b]" /> Perfil SCA Certificado (Origen Odisea)
                            </div>
                            <p className="text-xs font-medium text-gray-400 leading-relaxed px-2">
                                Esta es la huella sensorial validada por el Q-Grader asignado en origen. Úsela como referencia para desarrollar su propia curva de tueste.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-gray-100">
                            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
                                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">Humedad Origen</span>
                                <p className="text-xl font-black text-gray-800">11.2%</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
                                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">Variedad</span>
                                <p className="text-xl font-black text-gray-800 truncate">Bourbon Rosado</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Mi Formulario */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 lg:p-12 space-y-10 h-full flex flex-col justify-between">
                        <div className="space-y-10">
                            <div className="flex flex-col md:flex-row gap-10">
                                {/* RADAR LIVE */}
                                <div className="md:w-1/2 flex flex-col items-center justify-center p-6 bg-[#5f705f] rounded-[32px] shadow-md relative overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#bb8d3b] to-transparent opacity-60" />
                                    <div className="w-full h-[320px]">
                                        <SensorRadar data={myRadarData} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#bb8d3b] mt-2 leading-none">Mi Curva de Tueste</p>
                                </div>

                                {/* SLIDERS */}
                                <div className="md:w-1/2 space-y-6 h-full flex flex-col justify-center">
                                    {[
                                        { id: 'aroma', label: 'Fragancia/Aroma' },
                                        { id: 'sabor', label: 'Sabor' },
                                        { id: 'saborResidual', label: 'Sabor Residual' },
                                        { id: 'acidez', label: 'Acidez' },
                                        { id: 'cuerpo', label: 'Cuerpo' },
                                        { id: 'balance', label: 'Balance' },
                                        { id: 'puntajeCatador', label: 'Puntaje Catador' },
                                    ].map((attr) => (
                                        <div key={attr.id} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-700">{attr.label}</Label>
                                                <span className="text-[#bb8d3b] font-black text-lg">{(values as any)[attr.id]?.toFixed(2)}</span>
                                            </div>
                                            <Slider
                                                value={[(values as any)[attr.id] || 8.0]}
                                                min={6.0}
                                                max={10.0}
                                                step={0.25}
                                                onValueChange={([val]) => setValue(attr.id as any, val)}
                                                className="[&_[role=slider]]:bg-[#5f705f] [&_[role=slider]]:border-[#bb8d3b] [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notas de Tueste y Feedback al Productor */}
                            <div className="space-y-3 pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-gray-700 block">
                                        Feedback Sensorial y Notas de Tueste
                                    </Label>
                                    <span className="text-[9px] font-black uppercase text-[#5f705f] bg-[#5f705f]/10 px-2 py-0.5 rounded">
                                        Visible para el Productor
                                    </span>
                                </div>
                                <textarea
                                    {...register('notasTueste')}
                                    placeholder="Comparta sus notas de cata, curva sugerida y recomendaciones directas para el caficultor..."
                                    className="w-full h-28 rounded-2xl border border-gray-200 bg-gray-50/50 p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all placeholder:text-gray-400 resize-none text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="pt-6 space-y-4">
                            <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-xs text-amber-900 leading-relaxed">
                                🤝 <strong>Conexión Directa en Origen:</strong> Al guardar, este protocolo de calibración y su feedback se reflejarán instantáneamente en el panel de control del caficultor, estrechando los lazos de colaboración y fomentando la mejora continua en poscosecha.
                            </div>

                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="h-16 w-full rounded-2xl bg-[#bb8d3b] hover:bg-[#a07830] text-white font-black text-sm uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 group border-none"
                            >
                                <Save size={18} className="group-hover:scale-110 transition-transform" />
                                {isSaving ? 'Sincronizando con Origen...' : 'Guardar y Compartir Feedback con el Productor'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
