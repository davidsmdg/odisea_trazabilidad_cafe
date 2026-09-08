import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Save,
    Award,
    Home,
    Shield,
    Users
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface PerfilLiderForm {
    nombre: string;
    email: string;
    celular: string;
    departamento: string;
    municipio: string;
    veredaEncargo: string;
    registroJAC: string;
    aniosServicio: number;
    detallesComunidad: string;
}

export function PerfilLider() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, reset } = useForm<PerfilLiderForm>({
        defaultValues: {
            nombre: '',
            email: '',
            celular: '',
            departamento: 'Huila',
            municipio: 'San Agustín',
            veredaEncargo: '',
            registroJAC: '',
            aniosServicio: 4,
            detallesComunidad: ''
        }
    });

    useEffect(() => {
        const savedData = localStorage.getItem('perfil_lider');
        if (savedData) {
            try {
                reset(JSON.parse(savedData));
            } catch (e) {}
        }
    }, [reset]);

    const onSubmit = (data: PerfilLiderForm) => {
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem('perfil_lider', JSON.stringify(data));
            setIsSaving(false);
            toast.success('Perfil actualizado con éxito', {
                description: 'Tus credenciales de líder veredal han sido actualizadas.',
                style: { borderRadius: '24px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1A365D' }
            });
            navigate('/lider/validaciones');
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto pb-24 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1A365D] to-[#0F172A] rounded-[48px] p-10 md:p-14 text-white relative overflow-hidden mb-10 shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-12 scale-150">
                    <Shield size={200} />
                </div>
                <div className="relative z-10 max-w-2xl text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 inline-block mb-4">
                        Credenciales de Representante Comunitario
                    </span>
                    <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tight leading-none mb-4">
                        Mi Perfil de Líder
                    </h1>
                    <p className="text-slate-300 font-medium text-lg leading-relaxed">
                        Completa tu ficha de líder de la Junta de Acción Comunal (JAC) para dar transparencia a las pre-validaciones veredales que realizas sobre los predios de tus vecinos.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SECCIÓN 1: Datos Personales */}
                    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="bg-[#1A365D]/10 p-3 rounded-2xl text-[#1A365D]">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-sans font-black text-[#1A365D]">Información Básica</h2>
                                <p className="text-xs font-semibold text-gray-400">Tus datos personales y de contacto directo</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                    <User size={14} className="text-[#1A365D]" /> Nombre Completo
                                </label>
                                <input
                                    {...register('nombre', { required: true })}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all"
                                    placeholder="Ej. Carlos Augusto Restrepo"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                    <Mail size={14} className="text-[#1A365D]" /> Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { required: true })}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all"
                                    placeholder="carlos.lider@jac.org"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                        <Phone size={14} className="text-[#1A365D]" /> Teléfono Celular
                                    </label>
                                    <input
                                        {...register('celular', { required: true })}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all"
                                        placeholder="Ej. 315 789 4562"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                        <Award size={14} className="text-[#1A365D]" /> Años de Servicio
                                    </label>
                                    <input
                                        type="number"
                                        {...register('aniosServicio', { required: true, min: 0 })}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all"
                                        placeholder="Ej. 5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: Detalles de Comunidad y JAC */}
                    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="bg-[#1A365D]/10 p-3 rounded-2xl text-[#1A365D]">
                                <Users size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-sans font-black text-[#1A365D]">Rol Comunitario y JAC</h2>
                                <p className="text-xs font-semibold text-gray-400">Jurisdicción veredal bajo tu supervisión</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                        <MapPin size={14} className="text-[#1A365D]" /> Municipio
                                    </label>
                                    <input
                                        {...register('municipio', { required: true })}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all"
                                        placeholder="Ej. San Agustín"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                        Departamento
                                    </label>
                                    <input
                                        {...register('departamento', { required: true })}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all"
                                        placeholder="Ej. Huila"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                        <Home size={14} className="text-[#1A365D]" /> Vereda Representada
                                    </label>
                                    <input
                                        {...register('veredaEncargo', { required: true })}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all"
                                        placeholder="Ej. Vereda La Estrella"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                        <Shield size={14} className="text-[#1A365D]" /> Registro Personería JAC
                                    </label>
                                    <input
                                        {...register('registroJAC', { required: true })}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all"
                                        placeholder="Ej. Res. 034-2015-HUI"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                                    <Briefcase size={14} className="text-[#1A365D]" /> Detalle de Productores a Cargo
                                </label>
                                <textarea
                                    {...register('detallesComunidad')}
                                    className="w-full h-24 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#1A365D] transition-all resize-none"
                                    placeholder="Detalla qué sectores o familias cubres dentro de tu jurisdicción (Ej. 25 pequeños caficultores de la ladera oriental...)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-16 px-12 rounded-2xl bg-[#1A365D] hover:bg-[#11243e] text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 border-none"
                    >
                        <Save size={18} />
                        {isSaving ? 'Guardando Perfil...' : 'Establecer Perfil de Líder'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
