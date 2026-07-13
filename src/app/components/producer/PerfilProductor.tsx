"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
    User,
    Phone,
    Calendar,
    Users,
    Briefcase,
    Save,
    Heart,
    Baby,
    Home,
    Smartphone,
    CheckCircle2,
    Camera,
    ImagePlus,
    X,
    Plus,
    Mic,
    Volume2,
    Type,
    ArrowRightCircle,
    Quote,
    Trash2,
    Settings,
    Edit2,
    Star,
    Globe
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

export function PerfilProductor() {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [nombre, setNombre] = useState('');
    const [genero, setGenero] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [celular, setCelular] = useState('');
    const [aniosCafe, setAniosCafe] = useState('');

    // Family & Identity State
    const [tieneHijos, setTieneHijos] = useState('No');
    const [cuantosHijos, setCuantosHijos] = useState('0');
    const [cuantosMenores, setCuantosMenores] = useState('0');
    const [familiaresConviven, setFamiliaresConviven] = useState('0');
    const [perteneceEtno, setPerteneceEtno] = useState('No');

    // Photos State
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [marketingPhotos, setMarketingPhotos] = useState([
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1559056191-7417f24523fe?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1629910543669-7c462319f074?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800'
    ]);
    const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);

    // Story / Audio State
    const [historia, setHistoria] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);

    // Cargar perfil guardado en localStorage
    useEffect(() => {
        if (!user) return;
        const key = `perfil_productor_${user.email}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.nombre) setNombre(data.nombre);
                if (data.genero) setGenero(data.genero);
                if (data.fechaNacimiento) setFechaNacimiento(data.fechaNacimiento);
                if (data.celular) setCelular(data.celular);
                if (data.aniosCafe) setAniosCafe(data.aniosCafe);
                if (data.tieneHijos) setTieneHijos(data.tieneHijos);
                if (data.cuantosHijos) setCuantosHijos(data.cuantosHijos);
                if (data.cuantosMenores) setCuantosMenores(data.cuantosMenores);
                if (data.perteneceEtno) setPerteneceEtno(data.perteneceEtno);
                if (data.historia) setHistoria(data.historia);
                if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
            } catch (e) {}
        } else {
            // No saved profile yet, check if it's Maria's demo
            if (user.email === 'maria@finca.co') {
                setNombre('María González');
                setGenero('Femenino');
                setFechaNacimiento('1980-05-15');
                setCelular('312 455 9876');
                setAniosCafe('25');
                setTieneHijos('Si');
                setCuantosHijos('2');
                setCuantosMenores('1');
                setFamiliaresConviven('3');
                setPerteneceEtno('No');
                setHistoria('');
                setProfilePhoto(null);
            } else {
                // Initialize empty for other users
                setNombre(user.name || '');
                setGenero('');
                setFechaNacimiento('');
                setCelular('');
                setAniosCafe('');
                setTieneHijos('No');
                setCuantosHijos('0');
                setCuantosMenores('0');
                setFamiliaresConviven('0');
                setPerteneceEtno('No');
                setHistoria('');
                setProfilePhoto(null);
            }
        }
    }, [user]);

    const handleSimulateAudio = () => {
        setIsRecording(true);
        setTimeout(() => {
            setIsRecording(false);
            setTranscribing(true);
            setTimeout(() => {
                setTranscribing(false);
                setHistoria("Mi nombre es María y llevo más de 20 años cultivando café con amor en las montañas de Huila. Para mí, el café no es solo un producto, es la vida de mi familia y el legado de mis padres. Espero que disfruten cada sorbo, sabiendo que detrás hay manos honestas y un compromiso real con la naturaleza.");
                toast.success('Audio transcrito con éxito 🎙️');
            }, 2000);
        }, 3000);
    };

    const handleSave = () => {
        if (!user) return;
        setIsSaving(true);
        setTimeout(() => {
            const profileData = {
                nombre, genero, fechaNacimiento, celular, aniosCafe,
                tieneHijos, cuantosHijos, cuantosMenores, perteneceEtno,
                historia, profilePhoto
            };
            localStorage.setItem(`perfil_productor_${user.email}`, JSON.stringify(profileData));
            setIsSaving(false);
            toast.success('Perfil actualizado correctamente', {
                description: 'La información social ha sido guardada para cumplimiento de trazabilidad.',
                icon: <CheckCircle2 className="text-emerald-500" />,
                style: { borderRadius: '24px', background: '#FDFDF8', padding: '20px' }
            });
        }, 1200);
    };

    return (
        <div className="max-w-[800px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Profile Photo Upload */}
                    <div className="relative group">
                        <div className="h-36 w-36 bg-[#5f705f]/5 rounded-[48px] flex items-center justify-center text-[#5f705f] border-4 border-white shadow-2xl relative overflow-hidden transition-all group-hover:shadow-[#5f705f]/20">
                            {profilePhoto ? (
                                <img src={profilePhoto} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                                <User size={64} className="group-hover:scale-110 transition-transform opacity-30" />
                            )}
                        </div>
                        <button
                            onClick={() => setProfilePhoto('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200')}
                            className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#5f705f] text-white rounded-2xl border-4 border-[#FDFDF8] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                        >
                            <Camera size={18} />
                        </button>
                    </div>

                    <div>
                        <h1 className="text-4xl md:text-5xl font-sans font-black text-gray-900 tracking-tight">Mi Perfil Profesional</h1>
                        <p className="text-lg text-gray-500 font-medium mt-2">Gestiona tu identidad digital y social para conectar con compradores globales.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Personal Information */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#bb8d3b] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#bb8d3b]/20"><User size={20} /></div>
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Datos Personales</h3>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-[#5f705f]/50 ml-1">Nombre Completo</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5f705f] transition-colors" size={20} />
                                <Input value={nombre} onChange={e => setNombre(e.target.value)} className="h-14 pl-12 rounded-2xl border-none bg-white shadow-sm font-bold text-gray-800" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-[#5f705f]/50 ml-1">Género</Label>
                                <Select value={genero} onValueChange={setGenero}>
                                    <SelectTrigger className="h-14 rounded-2xl border-none bg-white shadow-sm font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="Masculino">Masculino</SelectItem>
                                        <SelectItem value="Femenino">Femenino</SelectItem>
                                        <SelectItem value="Otro">Otro / Prefiero no decir</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-[#5f705f]/50 ml-1">Fecha de Nacimiento</Label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5f705f] transition-colors" size={20} />
                                    <Input
                                        type="date"
                                        value={fechaNacimiento}
                                        onChange={e => setFechaNacimiento(e.target.value)}
                                        className="h-14 pl-12 pr-4 rounded-2xl border-none bg-white shadow-sm font-bold text-gray-800 appearance-none flex items-center"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-[#5f705f]/50 ml-1">Número de Celular</Label>
                            <div className="relative group">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5f705f] transition-colors" size={20} />
                                <Input value={celular} onChange={e => setCelular(e.target.value)} className="h-14 pl-12 rounded-2xl border-none bg-white shadow-sm font-bold text-gray-800" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experience & Family */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#8a9a8a] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#8a9a8a]/20"><Briefcase size={20} /></div>
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Experiencia y Familia</h3>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-[#5f705f]/50 ml-1">Años de Trabajo en Café</Label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5f705f] transition-colors" size={20} />
                                <Input type="number" value={aniosCafe} onChange={e => setAniosCafe(e.target.value)} className="h-14 pl-12 rounded-2xl border-none bg-white shadow-sm font-bold text-gray-800" />
                            </div>
                        </div>

                        <div className="bg-[#8a9a8a]/10 p-8 rounded-[40px] border border-[#8a9a8a]/20 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Users size={20} className="text-[#5f705f]" />
                                <h4 className="text-sm font-black text-[#5f705f] uppercase tracking-widest">Información Social</h4>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600"><Baby size={18} /></div>
                                        <Label className="text-xs font-bold text-gray-600">¿Tienes hijos?</Label>
                                    </div>
                                    <Select value={tieneHijos} onValueChange={setTieneHijos}>
                                        <SelectTrigger className="w-24 h-10 rounded-xl bg-white border-none shadow-sm font-black text-center pr-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Si">Si</SelectItem>
                                            <SelectItem value="No">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <AnimatePresence>
                                    {tieneHijos === 'Si' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4 pt-2 border-t border-emerald-100/30 overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[10px] font-black uppercase text-emerald-800/60 ml-13">¿Cuantos hijos tienes?</Label>
                                                <Input
                                                    type="number"
                                                    value={cuantosHijos}
                                                    onChange={e => setCuantosHijos(e.target.value)}
                                                    className="w-20 h-9 rounded-lg bg-white/50 border-none shadow-sm font-black text-center"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[10px] font-black uppercase text-emerald-800/60 ml-13">¿Cuantos menores de edad?</Label>
                                                <Input
                                                    type="number"
                                                    value={cuantosMenores}
                                                    onChange={e => setCuantosMenores(e.target.value)}
                                                    className="w-20 h-9 rounded-lg bg-white/50 border-none shadow-sm font-black text-center"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center justify-between pt-2 border-t border-[#8a9a8a]/20">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#8a9a8a]"><Globe size={18} /></div>
                                        <Label className="text-xs font-bold text-gray-600">¿Perteneces a comunidad étnica / indígena?</Label>
                                    </div>
                                    <Select value={perteneceEtno} onValueChange={setPerteneceEtno}>
                                        <SelectTrigger className="w-24 h-10 rounded-xl bg-white border-none shadow-sm font-black text-center pr-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="No">No</SelectItem>
                                            <SelectItem value="Si">Si</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Storytelling / Connection Section */}
            <div className="space-y-8 pt-10 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#5f705f] rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-emerald-900/20"><Quote size={20} /></div>
                        <div>
                            <h3 className="text-xl font-sans font-black text-gray-900 tracking-tight">Cúentanos tu historia para que el mundo sepa de ti</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Mensaje directo para tus compradores internacionales</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative group">
                            <label className="absolute -top-3 left-6 bg-[#FDFDF8] px-2 text-[10px] font-black uppercase text-[#5f705f] z-10">Tu mensaje o historia</label>
                            <textarea
                                value={historia}
                                onChange={e => setHistoria(e.target.value)}
                                placeholder="Escribe aquí tu historia o usa el botón de voz para dictarla..."
                                className="w-full min-h-[180px] p-8 rounded-[32px] bg-white border-2 border-transparent focus:border-[#5f705f]/20 shadow-xl shadow-gray-100 outline-none font-medium text-gray-700 leading-relaxed transition-all resize-none"
                            />

                            <div className="absolute right-6 bottom-6 flex items-center gap-2">
                                <Button
                                    onClick={handleSimulateAudio}
                                    disabled={isRecording || transcribing}
                                    className={cn(
                                        "h-16 px-8 rounded-2xl font-black text-sm uppercase tracking-widest gap-3 transition-all",
                                        isRecording ? "bg-red-500 animate-pulse text-white shadow-lg shadow-red-200" : "bg-[#8a9a8a]/10 text-[#5f705f] border border-[#8a9a8a]/20 hover:bg-[#8a9a8a]/20 shadow-sm"
                                    )}
                                >
                                    {isRecording ? (
                                        <><div className="h-2 w-2 bg-white rounded-full animate-bounce" /> Grabando Audio...</>
                                    ) : transcribing ? (
                                        <><Type className="animate-bounce" /> Transcribiendo...</>
                                    ) : (
                                        <><Mic size={18} /> Dictar mi Historia</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#e3d5b8]/10 p-8 rounded-[32px] border border-[#e3d5b8]/30 relative overflow-hidden group shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Volume2 size={80} /></div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#5f705f] mb-2">Consejos de Impacto</h4>
                            <p className="text-xs text-[#5f705f]/70 leading-relaxed font-bold">
                                Los tostadores en Europa valoran la honestidad. Cuéntales cuántas generaciones lleva tu familia en el café o cómo esta finca protege el agua local.
                            </p>
                        </div>
                        <div className="bg-[#bb8d3b]/5 p-8 rounded-[32px] border border-[#bb8d3b]/10 relative overflow-hidden group shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Globe size={80} /></div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#bb8d3b] mb-2">Visibilidad Global</h4>
                            <p className="text-xs text-[#bb8d3b]/70 leading-relaxed font-bold">
                                Esta historia aparecerá en el portal público de trazabilidad al escanear el QR de tus sacos de café.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Gallery Photos Section */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-black rounded-xl flex items-center justify-center text-white"><ImagePlus size={16} /></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 font-black">Fotos de tu Labor y Finca (Conexión Visual)</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {marketingPhotos.map((photo, index) => (
                            <div key={index} className={cn(
                                "aspect-[4/5] rounded-[32px] overflow-hidden border-4 bg-white shadow-xl relative group transition-all duration-500",
                                coverPhotoIndex === index ? "border-[#5f705f]" : "border-white"
                            )}>
                                <img src={photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                                {coverPhotoIndex === index && (
                                    <div className="absolute top-4 left-4 bg-[#5f705f] text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-in fade-in zoom-in duration-500">
                                        <Star size={12} className="fill-current" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Portada Principal</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                    <Button
                                        onClick={() => setCoverPhotoIndex(index)}
                                        className={cn(
                                            "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                            coverPhotoIndex === index ? "bg-[#8a9a8a] text-white" : "bg-white text-[#5f705f] hover:bg-gray-100"
                                        )}
                                    >
                                        {coverPhotoIndex === index ? 'Elegida como Portada' : 'Elegir como Portada'}
                                    </Button>

                                    <button
                                        onClick={() => setMarketingPhotos(marketingPhotos.filter((_, i) => i !== index))}
                                        className="h-10 w-10 bg-white/10 hover:bg-red-500/80 backdrop-blur-md text-white rounded-xl flex items-center justify-center transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {marketingPhotos.length < 3 && (
                            <button
                                onClick={() => setMarketingPhotos([...marketingPhotos, 'https://images.unsplash.com/photo-1501333190102-14300329ae57?auto=format&fit=crop&q=80&w=400'])}
                                className="aspect-[4/5] rounded-[32px] border-4 border-dashed border-gray-100 bg-white hover:border-[#5f705f]/20 transition-all flex flex-col items-center justify-center gap-4 group cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-[#5f705f] group-hover:scale-110 transition-all">
                                    <Plus size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black uppercase tracking-widest text-[#5f705f]/50 group-hover:text-[#5f705f]">Añadir Foto</p>
                                    <p className="text-[9px] font-bold text-[#5f705f]/30">Evidencia de impacto</p>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-100 flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-16 px-12 rounded-[24px] bg-[#5f705f] hover:bg-[#bb8d3b] text-white font-black text-lg shadow-xl shadow-[#5f705f]/20 transition-all flex items-center gap-3 group"
                >
                    {isSaving ? (
                        <>Guardando...</>
                    ) : (
                        <>
                            <Save size={20} className="group-hover:scale-110 transition-transform" />
                            <span>Guardar Perfil</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
