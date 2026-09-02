import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Target, ClipboardList, Loader2, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';
import { addLote } from '../../../services/lotesService';
import { detectAnomaly, detectHarvestDateAnomaly } from '../../../services/anomaliesService';

const FINCAS = ['Finca La Esperanza', 'Finca Santa Helena'];
const PARCELAS = ['Lote El Mirador', 'Lote Las Piedras'];
const VARIEDADES = ['Geisha', 'Bourbon Rosado', 'Castillo', 'Caturra'];
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
            <span className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1.5">{label}</span>
            {children}
        </label>
    );
}

const selectClass =
    'w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold text-gray-800 outline-none focus:border-[#5f705f]';

export function NuevaCosechaPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [finca, setFinca] = useState('');
    const [parcela, setParcela] = useState('');
    const [modalidad, setModalidad] = useState<'objetivo' | 'diario' | null>(null);

    // Camino "Tengo un plan"
    const [variedad, setVariedad] = useState('');
    const [proceso, setProceso] = useState('');
    const [kilosObjetivo, setKilosObjetivo] = useState('');

    // Camino "Solo anotar kilos"
    const [peso, setPeso] = useState('');
    const [madurez, setMadurez] = useState(4);
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

            let hasHistoricalAnomaly = false;
            if (modalidad === 'diario') {
                const checkPeso = await detectAnomaly(randomCode, 'peso_cereza', Number(peso), finca, 'María González');
                const checkFecha = await detectHarvestDateAnomaly(randomCode, fecha, finca, 'María González');
                if (checkPeso || checkFecha) hasHistoricalAnomaly = true;
            } else if (modalidad === 'objetivo' && kilosObjetivoCereza) {
                const checkPeso = await detectAnomaly(randomCode, 'peso_cereza', kilosObjetivoCereza, finca, 'María González');
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
            } else {
                currentLotes = [
                    {
                        id: 'lc1',
                        codigo: 'MG-ESP-042',
                        productor: 'María',
                        cosecha: 'Oct-Nov 2024',
                        finca: 'Finca La Esperanza',
                        parcelas: ['Lote El Mirador'],
                        estado: 'Verde (Trillado)',
                        pesos: { cereza: 1200, pergamino: 250, verde: 180, objetivo: 1500 },
                        fase: 3,
                        modalidad: 'objetivo',
                        detallesObjetivo: { variedad: 'Bourbon Rosado', proceso: 'Lavado' },
                        calificacion: 86.5,
                        macroperfil: 'Frutal',
                        clientes: [],
                    },
                ];
            }
            currentLotes.unshift(newLot);
            localStorage.setItem('lotes_produccion', JSON.stringify(currentLotes));

            await addLote({
                id: randomCode,
                productor: 'María González',
                finca,
                municipio: 'San Agustín, Huila',
                variedad: variedad || 'Bourbon Rosado',
                proceso: proceso || 'Lavado',
                estado: 'En Finca',
                almacenamiento: 'Pendiente Recibo',
                fecha: new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
                pesos: { cereza: modalidad === 'diario' ? Number(peso) : 0, pergamino: 0, verde: 0 },
            } as any);

            toast.success(
                modalidad === 'objetivo' ? '¡Plan de cosecha creado!' : `¡Registrado! ${peso} kg de cereza`
            );
            navigate('/producer/cosechas');
        } catch {
            toast.error('No se pudo guardar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-5 pb-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500"
                    aria-label="Volver"
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-black text-gray-900">Nueva cosecha</h2>
            </div>

            {/* 1. Origen */}
            <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
                <p className="text-[15px] font-black text-gray-800">1. ¿De dónde es el café?</p>
                <Campo label="Finca">
                    <select value={finca} onChange={(e) => setFinca(e.target.value)} className={selectClass}>
                        <option value="">Elige tu finca…</option>
                        {FINCAS.map((f) => (
                            <option key={f}>{f}</option>
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
                        {PARCELAS.map((p) => (
                            <option key={p}>{p}</option>
                        ))}
                    </select>
                </Campo>
            </div>

            {/* 2. Modalidad */}
            <AnimatePresence>
                {finca && parcela && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 space-y-3"
                    >
                        <p className="text-[15px] font-black text-gray-800">2. ¿Cómo lo quieres registrar?</p>
                        <button
                            onClick={() => setModalidad('objetivo')}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                                modalidad === 'objetivo' ? 'border-[#5f705f] bg-[#5f705f]/5' : 'border-gray-200'
                            )}
                        >
                            <span
                                className={cn(
                                    'h-12 w-12 shrink-0 rounded-xl flex items-center justify-center',
                                    modalidad === 'objetivo' ? 'bg-[#5f705f] text-white' : 'bg-gray-100 text-gray-400'
                                )}
                            >
                                <Target size={22} />
                            </span>
                            <span>
                                <span className="block font-black text-gray-900">Tengo un plan</span>
                                <span className="block text-[13px] text-gray-500 leading-tight">
                                    Ej: "quiero sacar 100 kg de lavado". Defines la meta y vas sumando.
                                </span>
                            </span>
                        </button>
                        <button
                            onClick={() => setModalidad('diario')}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                                modalidad === 'diario' ? 'border-[#bb8d3b] bg-[#bb8d3b]/5' : 'border-gray-200'
                            )}
                        >
                            <span
                                className={cn(
                                    'h-12 w-12 shrink-0 rounded-xl flex items-center justify-center',
                                    modalidad === 'diario' ? 'bg-[#bb8d3b] text-white' : 'bg-gray-100 text-gray-400'
                                )}
                            >
                                <ClipboardList size={22} />
                            </span>
                            <span>
                                <span className="block font-black text-gray-900">Solo anotar kilos</span>
                                <span className="block text-[13px] text-gray-500 leading-tight">
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
                        key="plan"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 space-y-4"
                    >
                        <p className="text-[15px] font-black text-gray-800">3. ¿Qué vas a procesar?</p>
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
                                    className="w-full h-16 rounded-2xl bg-white border-2 border-gray-200 text-center text-3xl font-black text-[#5f705f] outline-none focus:border-[#5f705f]"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-300">Kg</span>
                            </div>
                        </Campo>
                        {Number(kilosObjetivo) > 0 && (
                            <div className="rounded-2xl bg-[#5f705f]/5 p-3 text-[13px] font-bold text-[#5f705f] flex justify-between">
                                <span>Meta en cereza a recolectar</span>
                                <span>{Math.round(Number(kilosObjetivo) * 1.5625)} kg</span>
                            </div>
                        )}
                    </motion.div>
                )}

                {modalidad === 'diario' && (
                    <motion.div
                        key="diario"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 space-y-4"
                    >
                        <p className="text-[15px] font-black text-gray-800">3. Anota la recolección</p>
                        <Campo label="Kilos de cereza recolectados hoy">
                            <div className="relative">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={peso}
                                    onChange={(e) => setPeso(e.target.value)}
                                    placeholder="0"
                                    className="w-full h-16 rounded-2xl bg-white border-2 border-gray-200 text-center text-3xl font-black text-[#bb8d3b] outline-none focus:border-[#bb8d3b]"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-300">Kg</span>
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
                        <Campo label={`Madurez del grano · ${madurez * 20}%`}>
                            <input
                                type="range"
                                min={1}
                                max={5}
                                step={1}
                                value={madurez}
                                onChange={(e) => setMadurez(Number(e.target.value))}
                                className="w-full accent-[#5f705f] h-2"
                            />
                            <div className="flex justify-between text-[11px] font-black uppercase text-gray-300 mt-1">
                                <span>Verde</span>
                                <span>Maduro</span>
                                <span>Pasado</span>
                            </div>
                        </Campo>
                    </motion.div>
                )}
            </AnimatePresence>

            {modalidad && (
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="pr-tap w-full rounded-3xl bg-[#5f705f] text-white font-black text-lg gap-2 shadow-lg shadow-[#5f705f]/25 active:scale-[0.98] transition-transform disabled:opacity-60"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={22} />
                    ) : (
                        <>
                            <Check size={22} /> Guardar cosecha
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
