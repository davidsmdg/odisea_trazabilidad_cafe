import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
    User,
    Building2,
    Mail,
    MapPin,
    Calendar,
    Target,
    Coffee,
    TrendingUp,
    Save,
    CheckCircle2,
    Briefcase
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface PerfilTostadorForm {
    nombreTostador: string;
    nombreEmpresa: string;
    email: string;
    ciudad: string;
    pais: string;
    edad: number;
    volumenMensual: string;
    experiencia: string;
    perfilesPreferidos: string;
    filosofia: string;
}

export function PerfilTostador() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, reset } = useForm<PerfilTostadorForm>({
        defaultValues: {
            nombreTostador: '',
            nombreEmpresa: '',
            email: '',
            ciudad: '',
            pais: '',
            edad: 30,
            volumenMensual: '',
            experiencia: '',
            perfilesPreferidos: '',
            filosofia: ''
        }
    });

    useEffect(() => {
        const savedData = localStorage.getItem('perfil_tostador');
        if (savedData) {
            try {
                reset(JSON.parse(savedData));
            } catch (e) {}
        }
    }, [reset]);

    const onSubmit = (data: PerfilTostadorForm) => {
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem('perfil_tostador', JSON.stringify(data));
            setIsSaving(false);
            toast.success('Perfil actualizado', {
                description: 'Tus datos han sido guardados y serán compartidos con tus productores aliados.',
                style: { borderRadius: '24px', background: '#5f705f', color: '#ffffff' }
            });
            // Opcionalmente redirigir o mantener
            navigate('/tostador/explorar');
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-[#5f705f] rounded-[40px] p-10 md:p-14 text-white relative overflow-hidden mb-10 shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12 scale-150">
                    <User size={200} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#bb8d3b] bg-[#bb8d3b]/10 px-3 py-1.5 rounded-full border border-[#bb8d3b]/20 inline-block mb-4">
                        Configuración de Cuenta
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4">
                        Mi Perfil de Tostador
                    </h1>
                    <p className="text-white/80 font-medium text-lg leading-relaxed">
                        Completa tus datos para fortalecer tu relación directa con los caficultores. Esta información ayudará a Odisea a conectarte con los lotes y productores que mejor se adapten a la filosofía de tu tostaduría.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SECCIÓN 1: Datos Personales y de Contacto */}
                    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="bg-[#5f705f]/10 p-3 rounded-2xl text-[#5f705f]">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Información Básica</h2>
                                <p className="text-xs font-semibold text-gray-400">Datos públicos para el productor</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                                    <User size={14} className="text-[#bb8d3b]" /> Nombre del Tostador
                                </label>
                                <input
                                    {...register('nombreTostador', { required: true })}
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all"
                                    placeholder="Ej. Johan Svensson"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                                        <Building2 size={14} className="text-[#bb8d3b]" /> Tostaduría
                                    </label>
                                    <input
                                        {...register('nombreEmpresa', { required: true })}
                                        className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all"
                                        placeholder="Nombre de la empresa"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                                        <Calendar size={14} className="text-[#bb8d3b]" /> Edad
                                    </label>
                                    <input
                                        type="number"
                                        {...register('edad', { required: true, min: 18 })}
                                        className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all"
                                        placeholder="Años"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                                    <Mail size={14} className="text-[#bb8d3b]" /> Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { required: true })}
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all"
                                    placeholder="correo@tostaduria.com"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 font-medium">Usado para notificaciones logísticas y acceso a Odisea Trace.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                                        <MapPin size={14} className="text-[#bb8d3b]" /> Ciudad
                                    </label>
                                    <input
                                        {...register('ciudad', { required: true })}
                                        className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all"
                                        placeholder="Ej. Estocolmo"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                                        País
                                    </label>
                                    <input
                                        {...register('pais', { required: true })}
                                        className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all"
                                        placeholder="Ej. Suecia"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: Inteligencia Comercial (Odisea) */}
                    <div className="bg-amber-50/30 rounded-[32px] border border-amber-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
                            <div className="bg-[#bb8d3b]/10 p-3 rounded-2xl text-[#bb8d3b]">
                                <Target size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-amber-950">Inteligencia Operativa</h2>
                                <p className="text-xs font-semibold text-amber-800/60">Datos clave para Odisea Trace</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                                    <TrendingUp size={14} className="text-[#bb8d3b]" /> Volumen Mensual de Tueste
                                </label>
                                <select
                                    {...register('volumenMensual')}
                                    className="w-full h-12 rounded-xl border border-amber-200/60 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all text-gray-800"
                                >
                                    <option value="">Seleccione un rango...</option>
                                    <option value="Micro (0 - 50 kg/mes)">Micro (0 - 50 kg/mes)</option>
                                    <option value="Pequeño (50 - 250 kg/mes)">Pequeño (50 - 250 kg/mes)</option>
                                    <option value="Mediano (250 - 1000 kg/mes)">Mediano (250 - 1000 kg/mes)</option>
                                    <option value="Grande (+1000 kg/mes)">Grande (+1000 kg/mes)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                                    <Briefcase size={14} className="text-[#bb8d3b]" /> Experiencia en la Industria
                                </label>
                                <select
                                    {...register('experiencia')}
                                    className="w-full h-12 rounded-xl border border-amber-200/60 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all text-gray-800"
                                >
                                    <option value="">Seleccione experiencia...</option>
                                    <option value="Emprendedor (0-2 años)">Emprendedor (0-2 años)</option>
                                    <option value="Establecido (3-5 años)">Establecido (3-5 años)</option>
                                    <option value="Experimentado (6-10 años)">Experimentado (6-10 años)</option>
                                    <option value="Veterano (+10 años)">Veterano (+10 años)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                                    <Coffee size={14} className="text-[#bb8d3b]" /> Perfiles Sensoriales Buscados
                                </label>
                                <input
                                    {...register('perfilesPreferidos')}
                                    className="w-full h-12 rounded-xl border border-amber-200/60 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all text-gray-800"
                                    placeholder="Ej. Frutales, exóticos, procesos honey..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                                    <CheckCircle2 size={14} className="text-[#bb8d3b]" /> Filosofía de Compra
                                </label>
                                <textarea
                                    {...register('filosofia')}
                                    className="w-full h-24 rounded-xl border border-amber-200/60 bg-white p-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#bb8d3b]/20 focus:border-[#bb8d3b] transition-all resize-none text-gray-800"
                                    placeholder="¿Qué valores buscas en el café que compras? (Comercio justo, innovación, trazabilidad, impacto social...)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-14 px-10 rounded-xl bg-[#5f705f] hover:bg-[#4a574a] text-white font-black text-sm uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 border-none"
                    >
                        <Save size={18} />
                        {isSaving ? 'Guardando Perfil...' : 'Guardar y Continuar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
