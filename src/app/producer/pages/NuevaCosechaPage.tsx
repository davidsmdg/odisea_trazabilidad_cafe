import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Target, ClipboardList, Loader2, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';
import { addLote } from '../../../services/lotesService';
import { getFincas } from '../../../services/fincasService';
import type { Finca } from '../../../types/finca';
import { detectAnomaly, detectHarvestDateAnomaly } from '../../../services/anomaliesService';
import { registrarEvento } from '../../../services/telemetryService';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { useAuth } from '../../context/AuthContext';

const VARIEDADES = [
    'Castillo',
    'Colombia',
    'Cenicafé 1',
    'Caturra',
    'Bourbon Rosado',
    'Bourbon Rojo',
    'Geisha',
    'Tabi',
    'Típica',
    'Maragogipe',
    'Pacamara',
    'Catuaí',
    'San Bernardo',
    'Otra',
];
const PROCESOS = [
    'Lavado',
    'Natural',
    'Honey',
    'Fermentación anaeróbica',
    'Fermentación carbónica',
    'Fermentación con levadura',
    'Cofermentación',
];

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="block text-[13px] font-bold uppercase tracking-wider text-[#2D3E33]/70 mb-2">{label}</span>
            {children}
        </label>
    );
}

const selectClass =
    'w-full h-14 rounded-2xl bg-white border-2 border-stone-200 px-4 font-bold text-[16px] text-[#2D3E33] outline-none focus:border-[#2D3E33] transition-colors';

export function NuevaCosechaPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [fincasUsuario, setFincasUsuario] = useState<Finca[]>([]);

    const [finca, setFinca] = useState('');
    const [parcela, setParcela] = useState('');
    const [modalidad, setModalidad] = useState<'objetivo' | 'diario' | null>(null);

    const paso2Ref = useRef<HTMLDivElement>(null);
    const paso3Ref = useRef<HTMLDivElement>(null);

    // Scroll automático al Paso 2 cuando finca y parcela están seleccionadas
    useEffect(() => {
        if (finca && parcela) {
            const timer = setTimeout(() => {
                paso2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [finca, parcela]);

    // Scroll automático al Paso 3 cuando se selecciona modalidad
    useEffect(() => {
        if (modalidad) {
            const timer = setTimeout(() => {
                paso3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [modalidad]);

    useEffect(() => {
        getFincas().then((fs) => {
            setFincasUsuario(fs);
            if (fs.length === 1) {
                setFinca(fs[0].nombre);
                if (fs[0].lotesDeCafe && fs[0].lotesDeCafe.length === 1) {
                    setParcela(fs[0].lotesDeCafe[0].nombre);
                }
            }
        });
    }, []);

    // Camino "Tengo un plan"
    const [variedad, setVariedad] = useState('');
    const [proceso, setProceso] = useState('');
    const [kilosObjetivo, setKilosObjetivo] = useState('');

    // Camino "Solo anotar kilos"
    const [peso, setPeso] = useState('');
    const [madurez, setMadurez] = useState(2);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

    const handleSave = async () => {
        if (!finca || !parcela) {
            toast.error('Elige la finca y la parcela');
            return;
        }
        if (modalidad === 'objetivo') {
            if (!variedad || !proceso || !kilosObjetivo) {
                toast.error('Completa los datos del plan');
                return;
            }
        } else if (modalidad === 'diario') {
            if (!peso) {
                toast.error('Escribe cuántos kilos recolectaste');
                return;
            }
        } else {
            toast.error('Elige cómo quieres registrar el café');
            return;
        }

        setIsLoading(true);
        try {
            const randomCode = `LOT-HUI-${Math.floor(100 + Math.random() * 900)}`;
            const factor = 1.5625;
            const kilosObjetivoCereza =
                modalidad === 'objetivo' ? Math.round(Number(kilosObjetivo) * factor) : null;

            const newLot = {
                id: `lc-new-${Date.now()}`,
                codigo: randomCode,
                productor: 'Tú',
                cosecha: fecha,
                finca,
                parcelas: [parcela],
                estado: modalidad === 'objetivo' ? 'Planeado' : 'Cereza (Fresco)',
                fase: modalidad === 'objetivo' ? 0 : 1,
                modalidad,
                detallesObjetivo: modalidad === 'objetivo' ? { variedad, proceso } : null,
                pesos: {
                    cereza: modalidad === 'diario' ? Number(peso) : 0,
                    pergamino: 0,
                    verde: 0,
                    objetivo: kilosObjetivoCereza,
                    objetivoFinal: modalidad === 'objetivo' ? Number(kilosObjetivo) : null,
                },
                calificacion: 0,
                macroperfil: '',
                clientes: [],
            };

            const nombreProductor = user?.name || (user?.celular ? `Productor ${user.celular}` : 'Productor');

            let hasHistoricalAnomaly = false;
            if (modalidad === 'diario') {
                const checkPeso = await detectAnomaly(randomCode, 'peso_cereza', Number(peso), finca, nombreProductor);
                const checkFecha = await detectHarvestDateAnomaly(randomCode, fecha, finca, nombreProductor);
                if (checkPeso || checkFecha) hasHistoricalAnomaly = true;
            } else if (modalidad === 'objetivo' && kilosObjetivoCereza) {
                const checkPeso = await detectAnomaly(randomCode, 'peso_cereza', kilosObjetivoCereza, finca, nombreProductor);
                if (checkPeso) hasHistoricalAnomaly = true;
            }

            if (hasHistoricalAnomaly) {
                toast.warning('Dato poco usual', {
                    description: 'El registro se guardó, pero se envió a auditoría por diferir del historial.',
                    duration: 6000,
                });
            }

            const saved = localStorage.getItem('lotes_produccion');
            let currentLotes: any[] = [];
            if (saved) {
                try {
                    currentLotes = JSON.parse(saved);
                } catch {}
            }
            currentLotes.unshift(newLot);
            localStorage.setItem('lotes_produccion', JSON.stringify(currentLotes));

            await addLote({
                id: randomCode,
                productor: nombreProductor,
                finca,
                municipio: fincasUsuario.find(f => f.nombre === finca)?.municipio || 'San Agustín, Huila',
                variedad: variedad || 'Bourbon Rosado',
                proceso: proceso || 'Lavado',
                estado: 'En Finca',
                almacenamiento: 'Pendiente Recibo',
                fecha: new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
                pesos: { cereza: modalidad === 'diario' ? Number(peso) : 0, pergamino: 0, verde: 0 },
            } as any);

            await registrarEvento('cosecha_creada', {
                nombre: nombreProductor,
                rol: 'AGRICULTOR',
                detalles: {
                    codigo: randomCode,
                    modalidad,
                    variedad: variedad || 'Bourbon Rosado',
                    proceso: proceso || 'Lavado',
                    kilosCereza: modalidad === 'diario' ? Number(peso) : 0,
                    finca,
                },
            });

            toast.success(
                modalidad === 'objetivo' ? '¡Plan de cosecha creado!' : `¡Registrado! ${peso} kilos de cereza`
            );
            navigate('/producer/cosechas');
        } catch {
            toast.error('No se pudo guardar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="h-12 w-12 rounded-2xl bg-white border border-[#2D3E33]/15 flex items-center justify-center text-[#2D3E33] shadow-sm hover:bg-[#F6F2EC] transition-colors"
                    aria-label="Volver"
                >
                    <ChevronLeft size={26} />
                </button>
                <div>
                    <Eyebrow text="PLANILLAS & LOTES" variant="terracota" />
                    <h1 className="font-['Anton'] text-2xl uppercase tracking-wide text-[#2D3E33]">
                        NUEVA COSECHA
                    </h1>
                </div>
            </div>

            {/* 1. Origen */}
            <div className="rounded-3xl bg-white border border-[#2D3E33]/10 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <span className="bg-[#2D3E33] text-[#F6F2EC] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">01</span>
                    <p className="text-[17px] font-bold text-[#2D3E33]">¿De dónde es el café?</p>
                </div>
                <Campo label="Finca">
                    <select
                        value={finca}
                        onChange={(e) => {
                            setFinca(e.target.value);
                            const found = fincasUsuario.find((f) => f.nombre === e.target.value);
                            if (found?.lotesDeCafe && found.lotesDeCafe.length === 1) {
                                setParcela(found.lotesDeCafe[0].nombre);
                            } else {
                                setParcela('');
                            }
                        }}
                        className={selectClass}
                    >
                        <option value="">{fincasUsuario.length === 0 ? 'Cargando fincas…' : 'Elige tu finca…'}</option>
                        {fincasUsuario.map((f) => (
                            <option key={f.id} value={f.nombre}>{f.nombre}</option>
                        ))}
                    </select>
                </Campo>
                <Campo label="Parcela">
                    <select
                        value={parcela}
                        onChange={(e) => setParcela(e.target.value)}
                        disabled={!finca}
                        className={cn(selectClass, !finca && 'opacity-40')}
                    >
                        <option value="">Elige la parcela…</option>
                        {fincasUsuario
                            .find((f) => f.nombre === finca)
                            ?.lotesDeCafe?.map((p) => (
                                <option key={p.id} value={p.nombre}>{p.nombre}</option>
                            ))}
                    </select>
                </Campo>
            </div>

            {/* 2. Modalidad */}
            <AnimatePresence>
                {finca && parcela && (
                    <motion.div
                        ref={paso2Ref}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-3xl bg-white border border-[#2D3E33]/10 shadow-sm p-6 space-y-4 scroll-mt-6"
                    >
                        <div className="flex items-center gap-2">
                            <span className="bg-[#2D3E33] text-[#F6F2EC] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">02</span>
                            <p className="text-[17px] font-bold text-[#2D3E33]">¿Cómo lo quieres registrar?</p>
                        </div>
                        <button
                            onClick={() => setModalidad('objetivo')}
                            className={cn(
                                'w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all',
                                modalidad === 'objetivo' ? 'border-[#2D3E33] bg-[#2D3E33]/5 ring-2 ring-[#2D3E33]/15' : 'border-stone-200 hover:border-stone-300'
                            )}
                        >
                            <span
                                className={cn(
                                    'h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-bold',
                                    modalidad === 'objetivo' ? 'bg-[#2D3E33] text-white' : 'bg-stone-100 text-stone-500'
                                )}
                            >
                                <Target size={22} />
                            </span>
                            <span>
                                <span className="block font-bold text-[17px] text-[#2D3E33]">Tengo un plan</span>
                                <span className="block text-[14px] text-[#2D3E33]/70 leading-tight">
                                    Ej: "quiero sacar 100 kilos de café lavado". Defines la meta y vas sumando.
                                </span>
                            </span>
                        </button>
                        <button
                            onClick={() => setModalidad('diario')}
                            className={cn(
                                'w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all',
                                modalidad === 'diario' ? 'border-[#BD4A1F] bg-[#BD4A1F]/5 ring-2 ring-[#BD4A1F]/15' : 'border-stone-200 hover:border-stone-300'
                            )}
                        >
                            <span
                                className={cn(
                                    'h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-bold',
                                    modalidad === 'diario' ? 'bg-[#BD4A1F] text-white' : 'bg-stone-100 text-stone-500'
                                )}
                            >
                                <ClipboardList size={22} />
                            </span>
                            <span>
                                <span className="block font-bold text-[17px] text-[#2D3E33]">Solo anotar kilos</span>
                                <span className="block text-[14px] text-[#2D3E33]/70 leading-tight">
                                    Registra la recolección de hoy. Después decides el proceso.
                                </span>
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3a. Plan */}
            <AnimatePresence mode="wait">
                {modalidad === 'objetivo' && (
                    <motion.div
                        ref={paso3Ref}
                        key="plan"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-3xl bg-white border border-[#2D3E33]/10 shadow-sm p-6 space-y-4 scroll-mt-6"
                    >
                        <div className="flex items-center gap-2">
                            <span className="bg-[#2D3E33] text-[#F6F2EC] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">03</span>
                            <p className="text-[17px] font-bold text-[#2D3E33]">¿Qué vas a procesar?</p>
                        </div>
                        <Campo label="Variedad">
                            <select value={variedad} onChange={(e) => setVariedad(e.target.value)} className={selectClass}>
                                <option value="">Elige…</option>
                                {VARIEDADES.map((v) => (
                                    <option key={v}>{v}</option>
                                ))}
                            </select>
                        </Campo>
                        <Campo label="Proceso">
                            <select value={proceso} onChange={(e) => setProceso(e.target.value)} className={selectClass}>
                                <option value="">Elige…</option>
                                {PROCESOS.map((p) => (
                                    <option key={p}>{p}</option>
                                ))}
                            </select>
                        </Campo>
                        <Campo label="Kilos de café verde que esperas sacar">
                            <div className="relative">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={kilosObjetivo}
                                    onChange={(e) => setKilosObjetivo(e.target.value)}
                                    placeholder="100"
                                    className="w-full h-16 rounded-2xl bg-[#F6F2EC]/40 border-2 border-stone-200 text-center font-['Anton'] text-3xl text-[#2D3E33] outline-none focus:border-[#2D3E33] pr-24"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-[#2D3E33] bg-[#2D3E33]/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">kilos</span>
                            </div>
                        </Campo>
                        {Number(kilosObjetivo) > 0 && (
                            <div className="rounded-2xl bg-[#2D3E33]/5 border border-[#2D3E33]/10 p-3.5 text-[14px] font-bold text-[#2D3E33] flex justify-between items-center">
                                <span>Meta en cereza a recolectar</span>
                                <span className="font-['Anton'] text-lg">{Math.round(Number(kilosObjetivo) * 1.5625)} KG</span>
                            </div>
                        )}
                    </motion.div>
                )}

                {modalidad === 'diario' && (
                    <motion.div
                        ref={paso3Ref}
                        key="diario"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-3xl bg-white border border-[#2D3E33]/10 shadow-sm p-6 space-y-4 scroll-mt-6"
                    >
                        <div className="flex items-center gap-2">
                            <span className="bg-[#2D3E33] text-[#F6F2EC] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">03</span>
                            <p className="text-[17px] font-bold text-[#2D3E33]">Anota la recolección</p>
                        </div>
                        <Campo label="Kilos de cereza recolectados hoy">
                            <div className="relative">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={peso}
                                    onChange={(e) => setPeso(e.target.value)}
                                    placeholder="0"
                                    className="w-full h-16 rounded-2xl bg-[#F6F2EC]/40 border-2 border-stone-200 text-center font-['Anton'] text-3xl text-[#BD4A1F] outline-none focus:border-[#BD4A1F] pr-24"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-[#BD4A1F] bg-[#BD4A1F]/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">kilos</span>
                            </div>
                        </Campo>
                        <Campo label="Fecha">
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className={selectClass}
                            />
                        </Campo>
                        {/* Madurez del grano con cereza de café interactiva */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="block text-[12px] font-black uppercase tracking-wide text-gray-500">
                                    Madurez del grano
                                </span>
                                {(() => {
                                    const estados = {
                                        1: { txt: 'Verde', color: 'text-emerald-700 bg-emerald-50' },
                                        2: { txt: 'Maduro', color: 'text-red-700 bg-red-50' },
                                        3: { txt: 'Pasado', color: 'text-[#4a101d] bg-purple-50' },
                                    };
                                    const estado = estados[madurez as 1 | 2 | 3] || estados[2];
                                    return (
                                        <span className={cn('text-[11px] font-black px-2.5 py-0.5 rounded-full', estado.color)}>
                                            {estado.txt}
                                        </span>
                                    );
                                })()}
                            </div>

                            {/* Contenedor visual con la cereza de café y el slider */}
                            <div className="rounded-2xl border-2 border-gray-100 bg-[#FDFDF8] p-4 flex items-center gap-4 shadow-sm">
                                {/* Cereza de café SVG dinámica */}
                                <div className="shrink-0 flex flex-col items-center">
                                    {(() => {
                                        // 1: Verde | 2: Maduro | 3: Pasado
                                        const paletas: Record<number, { c1: string; c2: string; brillo: string; navel: string }> = {
                                            1: { c1: '#6ee7b7', c2: '#15803d', brillo: '#a7f3d0', navel: '#052e16' },
                                            2: { c1: '#f87171', c2: '#b91c1c', brillo: '#fca5a5', navel: '#450a0a' },
                                            3: { c1: '#9f1239', c2: '#4c0519', brillo: '#f43f5e', navel: '#1e0208' },
                                        };
                                        const p = paletas[madurez] || paletas[2];

                                        return (
                                            <div className="relative group">
                                                <svg
                                                    width="64"
                                                    height="64"
                                                    viewBox="0 0 64 64"
                                                    className="transition-transform duration-300 transform group-hover:scale-105 filter drop-shadow-md"
                                                >
                                                    <defs>
                                                        {/* Gradiente del cuerpo de la cereza */}
                                                        <radialGradient id={`cerezaGrad-${madurez}`} cx="35%" cy="35%" r="65%">
                                                            <stop offset="0%" stopColor={p.c1} />
                                                            <stop offset="60%" stopColor={p.c2} />
                                                            <stop offset="100%" stopColor={p.navel} />
                                                        </radialGradient>
                                                        {/* Gradiente de brillo especular */}
                                                        <linearGradient id={`brilloGrad-${madurez}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                                                            <stop offset="100%" stopColor={p.c1} stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>

                                                    {/* Pedúnculo / ramita verde */}
                                                    <path
                                                        d="M32 14 C32 8, 38 6, 44 4 C40 8, 36 10, 33 14"
                                                        fill="none"
                                                        stroke="#4d7c0f"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                    />

                                                    {/* Cuerpo de la cereza de café */}
                                                    <ellipse
                                                        cx="32"
                                                        cy="36"
                                                        rx="21"
                                                        ry="23"
                                                        fill={`url(#cerezaGrad-${madurez})`}
                                                        className="transition-colors duration-300"
                                                    />

                                                    {/* Ombligo de la cereza */}
                                                    <ellipse
                                                        cx="32"
                                                        cy="56"
                                                        rx="4"
                                                        ry="2"
                                                        fill={p.navel}
                                                        opacity="0.8"
                                                    />
                                                    <circle
                                                        cx="32"
                                                        cy="56"
                                                        r="1.5"
                                                        fill="#000000"
                                                        opacity="0.6"
                                                    />

                                                    {/* Reflejo / brillo de la cereza */}
                                                    <ellipse
                                                        cx="25"
                                                        cy="26"
                                                        rx="7"
                                                        ry="4"
                                                        transform="rotate(-28 25 26)"
                                                        fill={`url(#brilloGrad-${madurez})`}
                                                    />
                                                    <ellipse
                                                        cx="23"
                                                        cy="32"
                                                        rx="2.5"
                                                        ry="1.5"
                                                        transform="rotate(-28 23 32)"
                                                        fill="#ffffff"
                                                        opacity="0.5"
                                                    />
                                                </svg>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Slider y marcas de escala: Verde, Maduro, Pasado */}
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={1}
                                        value={madurez}
                                        onChange={(e) => setMadurez(Number(e.target.value))}
                                        className={cn(
                                            'w-full h-2.5 rounded-lg appearance-none cursor-pointer transition-all duration-300',
                                            madurez === 1 && 'accent-emerald-600 bg-emerald-100',
                                            madurez === 2 && 'accent-red-600 bg-red-100',
                                            madurez === 3 && 'accent-[#4a101d] bg-purple-100'
                                        )}
                                    />
                                    <div className="flex justify-between text-[11px] font-black uppercase text-gray-400">
                                        <span className={cn(madurez === 1 && 'text-emerald-700 font-extrabold')}>Verde</span>
                                        <span className={cn(madurez === 2 && 'text-red-700 font-extrabold')}>Maduro</span>
                                        <span className={cn(madurez === 3 && 'text-[#4a101d] font-extrabold')}>Pasado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {modalidad && (
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full h-16 rounded-full bg-[#BD4A1F] hover:bg-[#a33f1a] text-white font-['Anton'] text-xl uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-[#BD4A1F]/30 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <>
                            <Check size={24} /> GUARDAR COSECHA
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
