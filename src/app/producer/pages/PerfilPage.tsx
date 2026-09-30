import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    User,
    Camera,
    Mic,
    Type,
    Save,
    Home,
    LogOut,
    Plus,
    X,
    Star,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const selectClass =
    'w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold text-gray-800 outline-none focus:border-[#5f705f]';

function Seccion({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-400">{title}</h3>
            {children}
        </section>
    );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1.5">{label}</span>
            {children}
        </label>
    );
}

export function PerfilPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const [nombre, setNombre] = useState(user?.name || '');
    const [genero, setGenero] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [celular, setCelular] = useState(user?.celular || '');
    const [aniosCafe, setAniosCafe] = useState('');

    const [tieneHijos, setTieneHijos] = useState('');
    const [cuantosHijos, setCuantosHijos] = useState('');
    const [cuantosMenores, setCuantosMenores] = useState('');
    const [familiaresConviven, setFamiliaresConviven] = useState('');
    const [perteneceEtno, setPerteneceEtno] = useState('');

    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [fotosFinca, setFotosFinca] = useState<string[]>([]);
    const [portadaIndex, setPortadaIndex] = useState(0);

    const [historia, setHistoria] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);

    useEffect(() => {
        const cargarPerfil = async () => {
            if (user?.id) {
                try {
                    const { data, error } = await supabase
                        .from('perfiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                    if (!error && data) {
                        if (data.nombre) setNombre(data.nombre);
                        if (data.genero) setGenero(data.genero);
                        if (data.fecha_nacimiento) setFechaNacimiento(data.fecha_nacimiento);
                        if (data.celular) setCelular(data.celular);
                        if (data.anios_cafe) setAniosCafe(data.anios_cafe);
                        if (data.tiene_hijos) setTieneHijos(data.tiene_hijos);
                        if (data.cuantos_hijos) setCuantosHijos(data.cuantos_hijos);
                        if (data.cuantos_menores) setCuantosMenores(data.cuantos_menores);
                        if (data.familiares_conviven) setFamiliaresConviven(data.familiares_conviven);
                        if (data.pertenece_etno) setPerteneceEtno(data.pertenece_etno);
                        if (data.historia) setHistoria(data.historia);
                        if (data.profile_photo) setProfilePhoto(data.profile_photo);
                        if (Array.isArray(data.fotos_finca)) setFotosFinca(data.fotos_finca);
                        return;
                    }
                } catch (e) {
                    console.warn('Error cargando perfil de Supabase, usando local:', e);
                }
            }

            const saved = localStorage.getItem('perfil_productor');
            if (!saved) return;
            try {
                const d = JSON.parse(saved);
                if (d.nombre) setNombre(d.nombre);
                if (d.genero) setGenero(d.genero);
                if (d.fechaNacimiento) setFechaNacimiento(d.fechaNacimiento);
                if (d.celular) setCelular(d.celular);
                if (d.aniosCafe) setAniosCafe(d.aniosCafe);
                if (d.tieneHijos) setTieneHijos(d.tieneHijos);
                if (d.cuantosHijos) setCuantosHijos(d.cuantosHijos);
                if (d.cuantosMenores) setCuantosMenores(d.cuantosMenores);
                if (d.familiaresConviven) setFamiliaresConviven(d.familiaresConviven);
                if (d.perteneceEtno) setPerteneceEtno(d.perteneceEtno);
                if (d.historia) setHistoria(d.historia);
                if (d.profilePhoto) setProfilePhoto(d.profilePhoto);
                if (Array.isArray(d.fotosFinca)) setFotosFinca(d.fotosFinca);
            } catch {}
        };
        cargarPerfil();
    }, [user?.id]);

    const dictar = () => {
        setIsRecording(true);
        setTimeout(() => {
            setIsRecording(false);
            setTranscribing(true);
            setTimeout(() => {
                setTranscribing(false);
                setHistoria(
                    'Mi nombre es María y llevo más de 20 años cultivando café con amor en las montañas del Huila. El café es la vida de mi familia y el legado de mis padres.'
                );
                toast.success('Audio transcrito 🎙️');
            }, 1800);
        }, 2500);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const payload = {
            nombre,
            genero,
            fechaNacimiento,
            celular,
            aniosCafe,
            tieneHijos,
            cuantosHijos,
            cuantosMenores,
            familiaresConviven,
            perteneceEtno,
            historia,
            profilePhoto,
            fotosFinca,
        };
        localStorage.setItem('perfil_productor', JSON.stringify(payload));

        if (user?.id) {
            try {
                const { error } = await supabase
                    .from('perfiles')
                    .update({
                        nombre,
                        genero,
                        fecha_nacimiento: fechaNacimiento || null,
                        celular,
                        anios_cafe: aniosCafe,
                        tiene_hijos: tieneHijos,
                        cuantos_hijos: cuantosHijos,
                        cuantos_menores: cuantosMenores,
                        familiares_conviven: familiaresConviven,
                        pertenece_etno: perteneceEtno,
                        historia,
                        profile_photo: profilePhoto,
                        fotos_finca: fotosFinca,
                    })
                    .eq('id', user.id);

                if (error) {
                    console.error('Error guardando en Supabase:', error);
                }
            } catch (err) {
                console.error('Error en llamada a Supabase:', err);
            }
        }

        setIsSaving(false);
        toast.success('Perfil guardado');
    };

    const cerrarSesion = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <div className="space-y-5 pb-4">
            {/* Foto + nombre */}
            <div className="flex flex-col items-center gap-3 pt-2">
                <div className="relative">
                    <div className="h-28 w-28 rounded-[32px] bg-[#5f705f]/10 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-[#5f705f]">
                        {profilePhoto ? (
                            <img src={profilePhoto} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <User size={48} className="opacity-30" />
                        )}
                    </div>
                    <button
                        onClick={() =>
                            setProfilePhoto(
                                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                            )
                        }
                        className="absolute -bottom-1 -right-1 h-10 w-10 rounded-2xl bg-[#5f705f] text-white border-4 border-[#FDFDF8] flex items-center justify-center"
                        aria-label="Cambiar foto"
                    >
                        <Camera size={16} />
                    </button>
                </div>
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="text-center text-xl font-black text-gray-900 bg-transparent outline-none border-b-2 border-transparent focus:border-gray-200 pb-1"
                />
            </div>

            <Seccion title="Datos personales">
                <Campo label="Número de celular">
                    <input
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}
                        placeholder="Sin datos"
                        className={selectClass}
                        inputMode="tel"
                    />
                </Campo>
                <div className="grid grid-cols-2 gap-3">
                    <Campo label="Género">
                        <select
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                            className={cn(selectClass, !genero && 'text-gray-400')}
                        >
                            <option value="">Sin datos</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Otro / Prefiero no decir">Otro / Prefiero no decir</option>
                        </select>
                    </Campo>
                    <Campo label="Años en el café">
                        <input
                            type="number"
                            inputMode="numeric"
                            value={aniosCafe}
                            onChange={(e) => setAniosCafe(e.target.value)}
                            placeholder="Sin datos"
                            className={selectClass}
                        />
                    </Campo>
                </div>
                <Campo label="Fecha de nacimiento">
                    <input
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        className={cn(selectClass, !fechaNacimiento && 'text-gray-400')}
                    />
                </Campo>
            </Seccion>

            <Seccion title="Mi familia">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 text-[15px]">¿Tienes hijos?</span>
                    <div className="flex gap-2">
                        {['Si', 'No'].map((op) => (
                            <button
                                key={op}
                                type="button"
                                onClick={() => setTieneHijos(op)}
                                className={cn(
                                    'h-10 w-16 rounded-xl font-black text-[14px] transition-colors',
                                    tieneHijos === op ? 'bg-[#5f705f] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                )}
                            >
                                {op}
                            </button>
                        ))}
                    </div>
                </div>
                <AnimatePresence>
                    {tieneHijos === 'Si' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-2 gap-3 overflow-hidden"
                        >
                            <Campo label="Cuántos hijos">
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={cuantosHijos}
                                    onChange={(e) => setCuantosHijos(e.target.value)}
                                    placeholder="Sin datos"
                                    className={selectClass}
                                />
                            </Campo>
                            <Campo label="Menores de edad">
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={cuantosMenores}
                                    onChange={(e) => setCuantosMenores(e.target.value)}
                                    placeholder="Sin datos"
                                    className={selectClass}
                                />
                            </Campo>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Campo label="Personas que viven contigo">
                    <input
                        type="number"
                        inputMode="numeric"
                        value={familiaresConviven}
                        onChange={(e) => setFamiliaresConviven(e.target.value)}
                        placeholder="Sin datos"
                        className={selectClass}
                    />
                </Campo>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 text-[15px] pr-3">¿Perteneces a una comunidad étnica o indígena?</span>
                    <div className="flex gap-2 shrink-0">
                        {['No', 'Si'].map((op) => (
                            <button
                                key={op}
                                type="button"
                                onClick={() => setPerteneceEtno(op)}
                                className={cn(
                                    'h-10 w-16 rounded-xl font-black text-[14px] transition-colors',
                                    perteneceEtno === op ? 'bg-[#5f705f] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                )}
                            >
                                {op}
                            </button>
                        ))}
                    </div>
                </div>
            </Seccion>

            <Seccion title="Mi historia">
                <p className="text-[13px] text-gray-500 -mt-1">
                    Aparece en el portal público cuando alguien escanea el QR de tu café.
                </p>
                <textarea
                    value={historia}
                    onChange={(e) => setHistoria(e.target.value)}
                    placeholder="Escribe tu historia o tócala por voz…"
                    className="w-full min-h-[120px] rounded-2xl bg-white border-2 border-gray-200 p-4 font-medium text-gray-700 leading-relaxed outline-none focus:border-[#5f705f] resize-none"
                />
                <button
                    onClick={dictar}
                    disabled={isRecording || transcribing}
                    className={cn(
                        'pr-tap w-full rounded-2xl font-black text-[15px] gap-2',
                        isRecording
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-[#5f705f]/10 text-[#5f705f]'
                    )}
                >
                    {isRecording ? (
                        <>Grabando…</>
                    ) : transcribing ? (
                        <>
                            <Type size={18} className="animate-bounce" /> Transcribiendo…
                        </>
                    ) : (
                        <>
                            <Mic size={18} /> Contar por voz
                        </>
                    )}
                </button>
            </Seccion>

            <Seccion title="Fotos de mi finca">
                <div className="grid grid-cols-3 gap-2.5">
                    {fotosFinca.map((foto, i) => (
                        <div
                            key={i}
                            className={cn(
                                'relative aspect-square rounded-2xl overflow-hidden border-2',
                                portadaIndex === i ? 'border-[#5f705f]' : 'border-white'
                            )}
                        >
                            <img src={foto} className="w-full h-full object-cover" alt="" />
                            <button
                                onClick={() => setPortadaIndex(i)}
                                className={cn(
                                    'absolute top-1 left-1 h-6 w-6 rounded-lg flex items-center justify-center',
                                    portadaIndex === i ? 'bg-[#5f705f] text-white' : 'bg-black/40 text-white'
                                )}
                                aria-label="Elegir como portada"
                            >
                                <Star size={12} className={portadaIndex === i ? 'fill-current' : ''} />
                            </button>
                            <button
                                onClick={() => setFotosFinca(fotosFinca.filter((_, x) => x !== i))}
                                className="absolute top-1 right-1 h-6 w-6 rounded-lg bg-black/40 text-white flex items-center justify-center"
                                aria-label="Quitar foto"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {fotosFinca.length < 6 && (
                        <button
                            onClick={() =>
                                setFotosFinca([
                                    ...fotosFinca,
                                    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
                                ])
                            }
                            className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300"
                        >
                            <Plus size={24} />
                            <span className="text-[11px] font-black">Foto</span>
                        </button>
                    )}
                </div>
            </Seccion>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="pr-tap w-full rounded-3xl bg-[#5f705f] text-white font-black text-lg gap-2 shadow-lg shadow-[#5f705f]/25 active:scale-[0.98] transition-transform disabled:opacity-60"
            >
                {isSaving ? <Loader2 className="animate-spin" size={22} /> : <><Save size={20} /> Guardar perfil</>}
            </button>

            <div className="space-y-2 pt-2">
                <Link
                    to="/"
                    className="pr-tap w-full rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold text-[15px] gap-2"
                >
                    <Home size={18} /> Ver el sitio público
                </Link>
                <button
                    onClick={cerrarSesion}
                    className="pr-tap w-full rounded-2xl bg-white border border-rose-100 text-rose-600 font-bold text-[15px] gap-2"
                >
                    <LogOut size={18} /> Cerrar sesión
                </button>
            </div>
        </div>
    );
}
