import { useState } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Star,
    Send,
    MessageCircle,
    MapPin,
    Calendar,
    Users,
    Sparkles,
    Mountain,
    Home,
    Smile,
    Package,
    Coffee,
    Ship,
    Store,
    Flame,
    Share2,
    CheckCircle2,
    Heart,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import { isLotePublicado } from '../../../services/lotesService';
import { useEffect } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Destino = 'exportacion' | 'local';

interface PasoChain {
    id: string;
    label: string;
    Icon: React.ElementType;
    detalle: string;
}

// ─── Datos mock ───────────────────────────────────────────────────────────────

const MOCK = {
    loteId: 'LOT-HUILA-084',
    municipio: 'San Agustín, Huila',
    edad: 42,
    genero: 'Masculino',
    variedad: 'Bourbon Rosado',
    proceso: 'Lavado especial',
    altitud: '1.750 msnm',
    temporada: 'Oct 2025',
    puntajeSCA: 86.25,
    heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200',
    producerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    notasCata: ['🍫 Chocolate', '🍓 Frutos rojos', '🌸 Floral', '🍋 Cítrico'],
};

const CADENA_EXPORTACION: PasoChain[] = [
    {
        id: 'finca',
        label: 'Finca',
        Icon: Home,
        detalle: 'Finca La Esperanza · San Agustín, Huila · 1.750 msnm · GPS verificado · Cumplimiento ambiental certificado.',
    },
    {
        id: 'cosecha',
        label: 'Cosecha',
        Icon: Smile,
        detalle: 'Cosecha manual selectiva · Grado de madurez óptimo · Brix: 22° · Registrado por María García, 15 oct. 2025.',
    },
    {
        id: 'beneficio',
        label: 'Beneficio',
        Icon: Sparkles,
        detalle: 'Fermentación anaeróbica 48h · Lavado especial · Secado en marquesina 15 días · Humedad final: 11.2%.',
    },
    {
        id: 'bodega',
        label: 'Bodega',
        Icon: Package,
        detalle: 'Bodega Odisea · Bucaramanga · Ingreso 20 mayo 2025 · Humedad controlada · Peso recibido: 800 kg pergamino.',
    },
    {
        id: 'cata',
        label: 'Cata',
        Icon: Coffee,
        detalle: 'Catado por 3 Q-Graders certificados · Puntaje: 86.25 pts · Notas: chocolate, frutos rojos, floral, cítrico.',
    },
    {
        id: 'exportacion',
        label: 'Exportación',
        Icon: Ship,
        detalle: 'Puerto de Barranquilla · Naviera MSC · Bill of Lading verificado · FOB USD 2.85/lb · Destino: Europa.',
    },
];

const CADENA_LOCAL: PasoChain[] = [
    {
        id: 'finca',
        label: 'Finca',
        Icon: Home,
        detalle: 'Finca La Esperanza · San Agustín, Huila · 1.750 msnm · GPS verificado · Cosecha manual selectiva oct. 2025.',
    },
    {
        id: 'cosecha',
        label: 'Cosecha',
        Icon: Smile,
        detalle: 'Cosecha manual selectiva · Grado de madurez óptimo · Brix: 22° · Registrado por María García, 15 oct. 2025.',
    },
    {
        id: 'beneficio',
        label: 'Beneficio',
        Icon: Sparkles,
        detalle: 'Fermentación anaeróbica 48h · Lavado especial · Secado en marquesina 15 días · Humedad final: 11.2%.',
    },
    {
        id: 'cata',
        label: 'Cata',
        Icon: Coffee,
        detalle: 'Catado por 3 Q-Graders certificados · Puntaje: 86.25 pts · Notas: chocolate, frutos rojos, floral, cítrico.',
    },
    {
        id: 'tostion',
        label: 'Tostión',
        Icon: Flame,
        detalle: 'Tostado por Tostadora El Origen · Bogotá, Colombia · Perfil de tueste medio · Fecha: 10 nov. 2025.',
    },
    {
        id: 'tienda',
        label: 'Tienda',
        Icon: Store,
        detalle: 'Disponible en Café El Origen · Carrera 13 #85‑32, Bogotá · También en tienda online odiseacoffee.co.',
    },
];

const FLAVOR_NOTES = [
    { label: '🍫 Chocolate', value: 'chocolate' },
    { label: '🍓 Frutos rojos', value: 'frutos_rojos' },
    { label: '🌸 Floral', value: 'floral' },
    { label: '🍋 Cítrico', value: 'citrico' },
    { label: '🥜 Nueces', value: 'nueces' },
];

// ─── Componente principal ─────────────────────────────────────────────────────

export function TrazabilidadPublica() {
    const { loteId } = useParams();

    const idToQuery = loteId || MOCK.loteId;
    const [isPublic, setIsPublic] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        isLotePublicado(idToQuery)
            .then(res => {
                setIsPublic(res);
                setIsLoading(false);
            })
            .catch(() => {
                setIsPublic(false);
                setIsLoading(false);
            });
    }, [idToQuery]);

    // Destino
    const [destino, setDestino] = useState<Destino>('exportacion');
    const cadena = destino === 'exportacion' ? CADENA_EXPORTACION : CADENA_LOCAL;
    const [pasoActivo, setPasoActivo] = useState(0);

    // Feedback
    const [rating, setRating] = useState(0);
    const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleNote = (val: string) =>
        setSelectedNotes(prev =>
            prev.includes(val) ? prev.filter(n => n !== val) : [...prev, val]
        );

    const handleSendFeedback = () => {
        if (rating === 0) {
            toast.error('Por favor selecciona una calificación de estrellas.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            const newFeedback = {
                id: Date.now().toString(),
                loteId: loteId || MOCK.loteId,
                rating,
                selectedNotes,
                message,
                fecha: new Date().toLocaleDateString('es-CO'),
                estado: 'Pendiente'
            };

            const current = localStorage.getItem('comentarios_publicos_pendientes');
            let list: any[] = [];
            if (current) {
                try {
                    list = JSON.parse(current);
                } catch (e) {}
            }
            list.push(newFeedback);
            localStorage.setItem('comentarios_publicos_pendientes', JSON.stringify(list));

            setIsSubmitting(false);
            setIsSubmitted(true);
            toast.success('¡Gracias por tu valoración!');
        }, 1200);
    };

    const handleDestinoChange = (d: Destino) => {
        setDestino(d);
        setPasoActivo(0);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[85vh] p-8 bg-[#FDFCFB] text-center font-sans max-w-md mx-auto animate-pulse">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-150 rounded w-1/2"></div>
            </div>
        );
    }

    if (!isPublic) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[85vh] p-8 bg-[#FDFCFB] text-center font-sans max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 shadow-xs">
                    <AlertTriangle size={36} />
                </div>
                <h1 className="text-3xl font-sans font-black text-slate-800 tracking-tight leading-tight mb-4">Registro en Validación</h1>
                <p className="text-sm font-semibold text-slate-500 leading-normal mb-6">
                    Los datos de trazabilidad del lote <span className="font-bold text-[#5f705f]">{idToQuery}</span> están en etapa de auditoría en origen y no han sido publicados de forma oficial todavía.
                </p>
                <div className="w-12 h-0.5 bg-slate-200 rounded-full mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#5f705f]">
                    Odisea Trace ®
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col animate-in fade-in duration-700 bg-[#FDFCFB]">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative h-[92vh] min-h-[560px] max-h-[760px] overflow-hidden">
                <motion.img
                    src={MOCK.heroImage}
                    alt="Finca de café"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.08, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                {/* Tag de origen */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="absolute top-5 left-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8a9a8a] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                        Origen verificado ·{' '}
                        {destino === 'exportacion' ? 'Exportación' : 'Venta en Colombia'}
                    </span>
                </motion.div>

                {/* Botón compartir */}
                <button className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 transition-all">
                    <Share2 size={15} />
                </button>

                {/* Contenido inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2">
                            Lote · {loteId || MOCK.loteId}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-sans font-black text-white leading-none tracking-tight mb-4">
                            {MOCK.variedad}
                            <br />
                            <span className="italic font-light text-[#e3d5b8]">{MOCK.municipio}</span>
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#5f705f]/60 border border-[#5f705f]/70 text-white">
                                {MOCK.proceso}
                            </span>
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90">
                                {MOCK.altitud}
                            </span>
                            <span className={cn(
                                'text-[11px] font-bold px-3 py-1 rounded-full border text-white',
                                destino === 'exportacion'
                                    ? 'bg-[#bb8d3b]/50 border-[#bb8d3b]/60'
                                    : 'bg-[#5f705f]/50 border-[#5f705f]/60'
                            )}>
                                {destino === 'exportacion' ? 'Exportación' : 'Venta local'}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── DATOS CLAVE ──────────────────────────────────────────────── */}
            <section className="bg-white px-6 py-8 border-b border-black/5">
                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                    {[
                        { Icon: MapPin, label: 'Cultivado en', value: 'San Agustín', sub: 'Huila, Colombia' },
                        { Icon: Users, label: 'Caficultor', value: `${MOCK.edad} años`, sub: 'Productor independiente' },
                        { Icon: Sparkles, label: 'Variedad', value: MOCK.variedad, sub: `Proceso: ${MOCK.proceso}` },
                        { Icon: Mountain, label: 'Puntaje SCA', value: `${MOCK.puntajeSCA} pts`, sub: 'Certificado Q-Grader', highlight: true },
                    ].map(({ Icon, label, value, sub, highlight }) => (
                        <div
                            key={label}
                            className="bg-[#FDFDF8] rounded-2xl p-4 border border-black/5"
                        >
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1">{label}</p>
                            <p className={cn('text-base font-sans font-black leading-tight', highlight ? 'text-[#5f705f]' : 'text-gray-900')}>
                                {value}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── QUOTE ────────────────────────────────────────────────────── */}
            <section className="bg-white px-8 py-12 text-center border-b border-black/5">
                <div className="max-w-sm mx-auto">
                    <p className="text-4xl font-serif text-[#5f705f]/15 leading-none mb-[-8px]">"</p>
                    <p className="text-lg font-sans text-gray-800 leading-relaxed italic">
                        Este café no es solo una bebida, es la historia de una vida dedicada a la montaña.
                    </p>
                    <div className="w-8 h-0.5 bg-[#5f705f]/30 mx-auto mt-5 rounded-full" />
                </div>
            </section>

            {/* ── CADENA DE TRAZABILIDAD ───────────────────────────────────── */}
            <section className="bg-[#FDFDF8] px-5 py-8 border-b border-black/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">
                    Recorrido del lote
                </p>

                {/* Selector de destino */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                    {(
                        [
                            { key: 'exportacion', label: 'Exportación', sub: 'Finca → Puerto → Tostador' },
                            { key: 'local', label: 'Venta en Colombia', sub: 'Finca → Tostión → Tienda' },
                        ] as { key: Destino; label: string; sub: string }[]
                    ).map(({ key, label, sub }) => (
                        <button
                            key={key}
                            onClick={() => handleDestinoChange(key)}
                            className={cn(
                                'px-3 py-2.5 rounded-xl border text-left transition-all',
                                destino === key
                                    ? 'bg-[#5f705f] border-[#5f705f] text-white'
                                    : 'bg-white border-black/8 text-gray-500 hover:border-[#5f705f]/30'
                            )}
                        >
                            <p className="text-[12px] font-black leading-none">{label}</p>
                            <p className={cn('text-[9px] mt-1 font-medium', destino === key ? 'text-white/65' : 'text-gray-400')}>
                                {sub}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Pasos */}
                <div className="bg-white rounded-2xl border border-black/5 p-4">
                    <div className="flex items-center overflow-x-auto pb-1 gap-0">
                        {cadena.map((paso, i) => {
                            const isLast = i === cadena.length - 1;
                            const isActive = i === pasoActivo;
                            const isLastStep = isLast && destino === 'exportacion';
                            return (
                                <div key={paso.id} className="flex items-center">
                                    <button
                                        onClick={() => setPasoActivo(i)}
                                        className="flex flex-col items-center gap-1.5 w-12 flex-shrink-0"
                                    >
                                        <div className={cn(
                                            'w-9 h-9 rounded-full flex items-center justify-center border transition-all',
                                            isActive && isLastStep
                                                ? 'bg-[#bb8d3b] border-[#bb8d3b]'
                                                : isActive
                                                ? 'bg-[#5f705f] border-[#5f705f]'
                                                : 'bg-white border-black/10'
                                        )}>
                                            <paso.Icon
                                                size={14}
                                                className={cn(
                                                    'transition-colors',
                                                    isActive ? 'text-white' : 'text-gray-300'
                                                )}
                                            />
                                        </div>
                                        <span className={cn(
                                            'text-[8px] text-center leading-tight font-bold transition-colors',
                                            isActive && isLastStep
                                                ? 'text-[#bb8d3b]'
                                                : isActive
                                                ? 'text-[#5f705f]'
                                                : 'text-gray-300'
                                        )}>
                                            {paso.label}
                                        </span>
                                    </button>
                                    {!isLast && (
                                        <div className={cn(
                                            'h-px flex-1 min-w-[6px] mx-0.5 transition-colors',
                                            i < pasoActivo ? 'bg-[#5f705f]/40' : 'bg-black/8'
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Detalle del paso */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${destino}-${pasoActivo}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 bg-[#FDFDF8] rounded-xl px-4 py-3 border border-black/5"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {(() => {
                                    const paso = cadena[pasoActivo];
                                    return <paso.Icon size={13} className="text-[#5f705f] flex-shrink-0" />;
                                })()}
                                <p className="text-[10px] font-black uppercase tracking-wider text-[#5f705f]">
                                    {cadena[pasoActivo].label}
                                </p>
                            </div>
                            <p className="text-[12px] text-gray-600 leading-relaxed">
                                {cadena[pasoActivo].detalle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* ── PERFIL SENSORIAL ─────────────────────────────────────────── */}
            <section className="bg-white px-5 py-8 border-b border-black/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">
                    Perfil sensorial
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-sans font-black text-[#5f705f]">{MOCK.puntajeSCA}</span>
                    <span className="text-xl text-gray-300">/100</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold ml-1">puntos SCA</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {MOCK.notasCata.map(nota => (
                        <span
                            key={nota}
                            className="text-[12px] px-3 py-1.5 rounded-full bg-[#FDFDF8] border border-black/8 text-gray-600"
                        >
                            {nota}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── FEEDBACK ─────────────────────────────────────────────────── */}
            <section className="bg-[#FDFCFB] px-5 py-10">
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -16 }}
                            className="max-w-sm mx-auto bg-white rounded-[32px] border border-black/5 p-8 shadow-sm"
                        >
                            {/* Icono y título */}
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#5f705f]/8 flex items-center justify-center mx-auto mb-4">
                                    <Heart size={22} className="text-[#5f705f] fill-[#5f705f]/20" />
                                </div>
                                <h3 className="text-2xl font-sans font-black text-gray-900">¿Qué te pareció esta taza?</h3>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                                    Tu opinión crea mejores mañanas
                                </p>
                            </div>

                            {/* Estrellas */}
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setRating(s)}
                                        className="w-11 h-11 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            size={30}
                                            className={cn(
                                                'transition-all',
                                                s <= rating
                                                    ? 'fill-[#CD7F32] text-[#CD7F32]'
                                                    : 'text-black/8'
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Notas de sabor */}
                            <div className="mb-6">
                                <p className="text-[9px] font-black text-center uppercase tracking-[0.2em] text-[#5f705f] mb-3">
                                    Notas de sabor encontradas
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {FLAVOR_NOTES.map(note => (
                                        <button
                                            key={note.value}
                                            onClick={() => toggleNote(note.value)}
                                            className={cn(
                                                'px-4 py-2 rounded-full text-[12px] font-bold transition-all border',
                                                selectedNotes.includes(note.value)
                                                    ? 'bg-[#5f705f] text-white border-[#5f705f] scale-105'
                                                    : 'bg-[#FDFDF8] text-gray-500 border-black/8 hover:border-black/15'
                                            )}
                                        >
                                            {note.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mensaje */}
                            <div className="mb-6">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                                    <MessageCircle size={12} />
                                    Déjale un mensaje al caficultor
                                </label>
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Tu mensaje será enviado al productor..."
                                    className="w-full h-24 rounded-2xl bg-[#FDFDF8] border border-black/8 p-4 text-[13px] text-gray-700 outline-none focus:ring-2 focus:ring-[#5f705f]/20 resize-none transition-all font-sans"
                                />
                            </div>

                            {/* Botón enviar */}
                            <button
                                onClick={handleSendFeedback}
                                disabled={isSubmitting}
                                className="w-full h-14 rounded-2xl bg-[#5f705f] hover:bg-[#bb8d3b] text-white font-black text-[15px] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Enviar valoración
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-sm mx-auto text-center py-8"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#5f705f]/10 flex items-center justify-center mx-auto mb-5 ring-8 ring-[#5f705f]/5">
                                <CheckCircle2 size={32} className="text-[#5f705f]" />
                            </div>
                            <h3 className="text-3xl font-sans font-black text-gray-900 mb-3">¡Muchas gracias!</h3>
                            <p className="text-gray-500 leading-relaxed text-[14px] max-w-xs mx-auto">
                                Tu valoración ayuda a mejorar la calidad de vida en el origen y fortalece nuestra comunidad de trazabilidad.
                            </p>
                            <div className="w-8 h-0.5 bg-[#5f705f] mx-auto mt-6 mb-4 rounded-full" />
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5f705f]">
                                Odisea Trace ®
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

        </div>
    );
}
