import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
    User,
    Camera,
    Mic,
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
import {
    vibrarError,
    vibrarExito,
    enfocarCampoConError,
    analizarCelularOCorreo,
    MensajeErrorCampo,
    AsistenteCelular,
} from '../../utils/usabilidad';

const selectClass =
    'w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold text-gray-800 outline-none focus:border-[#5f705f] transition-colors';

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

    // Estados de usabilidad y validación
    const [errores, setErrores] = useState<{ nombre?: string; celular?: string }>({});
    const [shakeKey, setShakeKey] = useState(0);
    const [confirmarSalida, setConfirmarSalida] = useState(false);

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
        const nuevosErrores: { nombre?: string; celular?: string } = {};
        if (!nombre.trim()) {
            nuevosErrores.nombre = 'Escribe tu nombre completo para que aparezca en tu finca.';
        }

        if (celular.trim()) {
            const infoCel = analizarCelularOCorreo(celular);
            if (!infoCel.valido) {
                nuevosErrores.celular = infoCel.mensaje;
            }
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            setShakeKey((k) => k + 1);
            vibrarError();
            if (nuevosErrores.nombre) {
                enfocarCampoConError('campo-perfil-nombre');
            } else if (nuevosErrores.celular) {
                enfocarCampoConError('campo-perfil-celular');
            }
            return;
        }

        setErrores({});
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
        vibrarExito();
        toast.success('¡Listo! Tus datos quedaron guardados.');
    };

    const cerrarSesion = () => {
        logout();
        navigate('/auth/login');
    };

    const infoCelular = analizarCelularOCorreo(celular);

    return (
        <div className="space-y-5 pb-6">
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
                        className="absolute -bottom-1 -right-1 h-10 w-10 rounded-2xl bg-[#5f705f] text-white border-4 border-[#FDFDF8] flex items-center justify-center shadow"
                        aria-label="Cambiar foto"
                    >
                        <Camera size={16} />
                    </button>
                </div>
                <p className="text-center text-xl md:text-2xl font-black text-gray-900 pb-1">
                    {nombre || 'Mi Perfil'}
                </p>
            </div>

            {/* Grid responsivo de secciones: 1 columna en móvil, 2 columnas en PC */}
            <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 items-start">
                {/* ── COLUMNA IZQUIERDA (Datos personales y Mi historia) ── */}
                <div className="space-y-5">
                    <Seccion title="Datos personales">
                        <div id="campo-perfil-nombre" key={`nom-${shakeKey}`} className={cn(errores.nombre && 'odisea-shake')}>
                            <Campo label="Tu nombre completo *">
                                <input
                                    value={nombre}
                                    onChange={(e) => {
                                        setNombre(e.target.value);
                                        if (errores.nombre) setErrores((prev) => ({ ...prev, nombre: undefined }));
                                    }}
                                    placeholder="Ej. María Gómez"
                                    className={cn(selectClass, errores.nombre && 'odisea-field-error')}
                                />
                            </Campo>
                            <MensajeErrorCampo mensaje={errores.nombre} />
                        </div>

                        <div id="campo-perfil-celular" key={`cel-${shakeKey}`} className={cn(errores.celular && 'odisea-shake')}>
                            <Campo label="Número de celular (10 números)">
                                <input
                                    value={celular}
                                    onChange={(e) => {
                                        setCelular(e.target.value);
                                        if (errores.celular) setErrores((prev) => ({ ...prev, celular: undefined }));
                                    }}
                                    placeholder="Ej. 310 123 4567"
                                    className={cn(
                                        selectClass,
                                        errores.celular && 'odisea-field-error',
                                        !errores.celular && infoCelular.tipo === 'celular' && infoCelular.valido && 'odisea-field-ok'
                                    )}
                                    inputMode="tel"
                                />
                            </Campo>
                            <AsistenteCelular valor={celular} />
                            <MensajeErrorCampo mensaje={errores.celular} />
                        </div>

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
                                    placeholder="0"
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

                    <Seccion title="Mi historia como caficultor">
                        <div className="flex gap-2">
                            <button
                                onClick={dictar}
                                disabled={isRecording || transcribing}
                                className={cn(
                                    'pr-tap flex-1 rounded-2xl font-black text-[13px] gap-2 transition-all',
                                    isRecording
                                        ? 'bg-rose-500 text-white animate-pulse'
                                        : transcribing
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-[#5f705f]/10 text-[#5f705f]'
                                )}
                            >
                                <Mic size={18} />
                                {isRecording ? 'Escuchando...' : transcribing ? 'Transcribiendo...' : 'Grabar audio'}
                            </button>
                        </div>
                        <textarea
                            value={historia}
                            onChange={(e) => setHistoria(e.target.value)}
                            rows={4}
                            placeholder="Cuenta tu historia, cómo empezó tu finca y tu pasión por el café..."
                            className="w-full rounded-2xl bg-white border-2 border-gray-200 p-4 font-bold text-gray-800 outline-none focus:border-[#5f705f] text-sm resize-none"
                        />
                    </Seccion>
                </div>

                {/* ── COLUMNA DERECHA (Composición familiar, Fotos de Finca y Acciones) ── */}
                <div className="space-y-5">
                    <Seccion title="Mi hogar y familia">
                        <Campo label="¿Tienes hijos?">
                            <select
                                value={tieneHijos}
                                onChange={(e) => setTieneHijos(e.target.value)}
                                className={cn(selectClass, !tieneHijos && 'text-gray-400')}
                            >
                                <option value="">Sin datos</option>
                                <option value="Sí">Sí</option>
                                <option value="No">No</option>
                            </select>
                        </Campo>
                        {tieneHijos === 'Sí' && (
                            <div className="grid grid-cols-2 gap-3">
                                <Campo label="¿Cuántos hijos?">
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        value={cuantosHijos}
                                        onChange={(e) => setCuantosHijos(e.target.value)}
                                        placeholder="0"
                                        className={selectClass}
                                    />
                                </Campo>
                                <Campo label="¿Menores de edad?">
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        value={cuantosMenores}
                                        onChange={(e) => setCuantosMenores(e.target.value)}
                                        placeholder="0"
                                        className={selectClass}
                                    />
                                </Campo>
                            </div>
                        )}
                        <Campo label="Familiares que conviven en la finca">
                            <input
                                type="number"
                                inputMode="numeric"
                                value={familiaresConviven}
                                onChange={(e) => setFamiliaresConviven(e.target.value)}
                                placeholder="0"
                                className={selectClass}
                            />
                        </Campo>
                        <Campo label="¿Perteneces a una comunidad étnica?">
                            <select
                                value={perteneceEtno}
                                onChange={(e) => setPerteneceEtno(e.target.value)}
                                className={cn(selectClass, !perteneceEtno && 'text-gray-400')}
                            >
                                <option value="">Sin datos</option>
                                <option value="Indígena">Indígena</option>
                                <option value="Afrodescendiente / Palenquero / Raizal">
                                    Afrodescendiente / Palenquero / Raizal
                                </option>
                                <option value="Rrom (Gitano)">Rrom (Gitano)</option>
                                <option value="Ninguna">Ninguna</option>
                            </select>
                        </Campo>
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
                                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-[#5f705f] transition-colors"
                                >
                                    <Plus size={24} />
                                    <span className="text-[11px] font-black">Foto</span>
                                </button>
                            )}
                        </div>
                    </Seccion>
                </div>
            </div>

            {/* Acciones principales y WhatsApp de soporte */}
            <div className="pt-4 max-w-xl mx-auto space-y-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-16 rounded-full bg-[#BD4A1F] hover:bg-[#a53e19] text-[#F6F2EC] font-extrabold text-base uppercase tracking-wider gap-3 shadow-lg shadow-[#BD4A1F]/25 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={24} /> : <><Save size={22} /> Guardar mi perfil</>}
                </button>

                {/* Banner de soporte directo por WhatsApp */}
                <div className="bg-[#2D3E33]/5 rounded-2xl p-4 flex items-center justify-between gap-3 border border-[#2D3E33]/10">
                    <div>
                        <p className="text-xs font-extrabold text-[#2D3E33] uppercase tracking-wider">¿Dudas o necesitas ayuda?</p>
                        <p className="text-sm font-bold text-[#BD4A1F]">+57 301 530 3014</p>
                    </div>
                    <a
                        href="https://wa.me/573015303014?text=Hola,%20tengo%20una%20duda%20sobre%20mi%20perfil%20en%20Mi%20Finca%20Odisea"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#2D3E33] text-white text-xs font-extrabold uppercase tracking-wider rounded-full hover:bg-[#1B263B] transition-colors"
                    >
                        WhatsApp
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Link
                        to="/"
                        className="w-full h-12 rounded-full bg-white border-2 border-[#DAD6CF]/60 text-[#2D3E33] font-extrabold text-sm uppercase tracking-wider gap-2 hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm"
                    >
                        <Home size={18} /> Sitio público
                    </Link>
                    {!confirmarSalida ? (
                        <button
                            onClick={() => setConfirmarSalida(true)}
                            className="w-full h-12 rounded-full bg-white border-2 border-rose-200 text-rose-600 font-extrabold text-sm uppercase tracking-wider gap-2 hover:bg-rose-50 transition-colors flex items-center justify-center shadow-sm cursor-pointer"
                        >
                            <LogOut size={18} /> Cerrar sesión
                        </button>
                    ) : (
                        <div className="sm:col-span-2 rounded-2xl bg-rose-50 border-2 border-rose-300 p-4 space-y-3">
                            <p className="text-sm font-black text-rose-900 text-center">
                                ¿Seguro que quieres salir de tu cuenta?
                            </p>
                            <p className="text-xs font-bold text-rose-700 text-center">
                                Para volver a entrar necesitarás escribir tu celular y tu contraseña.
                            </p>
                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setConfirmarSalida(false)}
                                    className="h-12 rounded-xl bg-white border-2 border-gray-200 font-extrabold text-gray-700 text-sm cursor-pointer"
                                >
                                    No, quedarme
                                </button>
                                <button
                                    type="button"
                                    onClick={cerrarSesion}
                                    className="h-12 rounded-xl bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <LogOut size={16} /> Sí, salir
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
