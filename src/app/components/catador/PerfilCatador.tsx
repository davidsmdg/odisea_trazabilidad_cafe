import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Save,
    Award,
    Coffee,
    ShieldAlert
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface PerfilCatadorForm {
    nombre: string;
    email: string;
    celular: string;
    ubicacion: string;
    experienciaAnios: number;
    nivelFormacion: string;
    descripcionCata: string;
}

export function PerfilCatador() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, reset } = useForm<PerfilCatadorForm>({
        defaultValues: {
            nombre: '',
            email: '',
            celular: '',
            ubicacion: '',
            experienciaAnios: 2,
            nivelFormacion: 'Experimental / Empírico',
            descripcionCata: ''
        }
    });

    useEffect(() => {
        const savedData = localStorage.getItem('perfil_catador');
        if (savedData) {
            try {
                reset(JSON.parse(savedData));
            } catch (e) {}
        }
    }, [reset]);

    const onSubmit = (data: PerfilCatadorForm) => {
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem('perfil_catador', JSON.stringify(data));
            setIsSaving(false);
            toast.success('Perfil actualizado con éxito', {
                description: 'Tus credenciales y datos de catador han sido actualizados en Odisea Coffee Trace.',
                style: { borderRadius: '24px', background: '#FDFBF9', border: '1px solid #D7CCC8', color: '#5D4037' }
            });
            navigate('/catador/muestras');
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto pb-24 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#5D4037] to-[#3E2723] rounded-[48px] p-10 md:p-14 text-white relative overflow-hidden mb-10 shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-12 scale-150">
                    <User size={200} />
                </div>
                <div className="relative z-10 max-w-2xl text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#EADDCA] bg-white/10 px-3 py-1.5 rounded-full border border-white/20 inline-block mb-4">
                        Perfil Profesional de Cata
                    </span>
                    <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tight leading-none mb-4">
                        Ficha del Catador
                    </h1>
                    <p className="text-[#D7CCC8] font-medium text-lg leading-relaxed">
                        Administra tu información básica y tu nivel de formación para certificar la veracidad técnica de las muestras que evalúas. Tu ficha avala la transparencia comercial en origen.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SECCIÓN 1: Información Básica */}
                    <div className="bg-white rounded-[40px] border border-[#EADDCA]/50 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="bg-[#5D4037]/10 p-3 rounded-2xl text-[#5D4037]">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-sans font-black text-[#5D4037]">Información de Contacto</h2>
                                <p className="text-xs font-semibold text-gray-400">Tus datos básicos de contacto en la red</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-[#5D4037] mb-2 flex items-center gap-1.5">
                                    <User size={14} className="text-[#8D6E63]" /> Nombre Completo
                                </label>
                                <input
                                    {...register('nombre', { required: true })}
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-[#FDFBF9] px-4 text-sm font-semibold text-[#5D4037] outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all"
                                    placeholder="Ej. Andrés Valbuena"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-[#5D4037] mb-2 flex items-center gap-1.5">
                                    <Mail size={14} className="text-[#8D6E63]" /> Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { required: true })}
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-[#FDFBF9] px-4 text-sm font-semibold text-[#5D4037] outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all"
                                    placeholder="andres@odiseacoffee.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-[#5D4037] mb-2 flex items-center gap-1.5">
                                        <Phone size={14} className="text-[#8D6E63]" /> Teléfono Celular
                                    </label>
                                    <input
                                        {...register('celular', { required: true })}
                                        className="w-full h-12 rounded-xl border border-gray-200 bg-[#FDFBF9] px-4 text-sm font-semibold text-[#5D4037] outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all"
                                        placeholder="Ej. +57 312 456 7890"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-[#5D4037] mb-2 flex items-center gap-1.5">
                                        <MapPin size={14} className="text-[#8D6E63]" /> Ubicación (Ciudad / Depto)
                                    </label>
                                    <input
                                        {...register('ubicacion', { required: true })}
                                        className="w-full h-12 rounded-xl border border-gray-200 bg-[#FDFBF9] px-4 text-sm font-semibold text-[#5D4037] outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all"
                                        placeholder="Ej. Pitalito, Huila"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: Formación y Experiencia */}
                    <div className="bg-white rounded-[40px] border border-[#EADDCA]/50 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="bg-[#5D4037]/10 p-3 rounded-2xl text-[#5D4037]">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-sans font-black text-[#5D4037]">Formación y Experiencia</h2>
                                <p className="text-xs font-semibold text-gray-400">Credenciales del catador en taza</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-[#5D4037] mb-2 flex items-center gap-1.5">
                                        <Briefcase size={14} className="text-[#8D6E63]" /> Años de Experiencia
                                    </label>
                                    <input
                                        type="number"
                                        {...register('experienciaAnios', { required: true, min: 0 })}
                                        className="w-full h-12 rounded-xl border border-gray-200 bg-[#FDFBF9] px-4 text-sm font-semibold text-[#5D4037] outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all"
                                        placeholder="Ej. 5"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-[#5D4037] mb-2 flex items-center gap-1.5">
                                        <Award size={14} className="text-[#8D6E63]" /> Nivel de Formación
                                    </label>
                                    <select
                                        {...register('nivelFormacion', { required: true })}
                                        className="w-full h-12 rounded-xl border border-gray-200 bg-[#FDFBF9] px-4 text-sm font-semibold text-[#5D4037] outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all"
                                    >
                                        <option value="Catador Certificado Q-Grader (SCA)">Q-Grader Certificado (SCA)</option>
                                        <option value="Catador con Formación Técnica (SENA / SCA)">Formación Técnica (SENA / SCA)</option>
                                        <option value="Catador Experimental / Empírico">Experimental / Empírico</option>
                                        <option value="Productor / Catador Experimental (Origen)">Productor / Catador Experimental</option>
                                        <option value="Barista / Catador en Aprendizaje">Barista / Catador en Formación</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-[#5D4037] mb-2 flex items-center gap-1.5">
                                    <Coffee size={14} className="text-[#8D6E63]" /> Especialidades o Enfoque Sensorial
                                </label>
                                <textarea
                                    {...register('descripcionCata')}
                                    className="w-full h-24 rounded-xl border border-gray-200 bg-[#FDFBF9] p-4 text-sm font-semibold text-[#5D4037] outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all resize-none"
                                    placeholder="¿En qué perfiles te especializas? (Ej. Cafés de proceso exótico, varietales raros, perfiles limpios y lavados tradicionales...)"
                                />
                            </div>

                            <div className="flex gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-200/50 text-[11px] text-[#5D4037]/80 leading-relaxed items-start">
                                <ShieldAlert size={20} className="text-[#8D6E63] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="font-bold">Veracidad de datos:</strong> Estos datos se imprimen en los reportes de calidad sensorial de los lotes auditados para dar fe y confianza al comprador final del microlote.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-16 px-12 rounded-2xl bg-[#5D4037] hover:bg-[#3E2723] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#5D4037]/20 transition-all active:scale-95 flex items-center justify-center gap-3 border-none animate-bounce-subtle"
                    >
                        <Save size={18} />
                        {isSaving ? 'Guardando Perfil...' : 'Fijar Datos de Catador'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
