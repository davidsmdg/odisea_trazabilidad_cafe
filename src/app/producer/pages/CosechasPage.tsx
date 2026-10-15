import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Plus,
    AlertTriangle,
    MoreHorizontal,
    Sun,
    Coffee,
    Sprout,
    BarChart3,
    Megaphone,
    Star,
    Settings2,
    Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';
import { BottomSheet } from '../components/BottomSheet';
import { TimelineCosecha } from '../components/TimelineCosecha';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { formatoNumero } from '../utils/formato';
import type { Cosecha } from '../../../types/cosecha';
import { getCosechas, saveCosechas } from '../../../services/cosechasService';
import {
    getValidationStageForLote,
    updateValidationStage,
    updateLote,
} from '../../../services/lotesService';
import { detectAnomaly } from '../../../services/anomaliesService';

type AccionTipo =
    | 'sumar_cereza'
    | 'avanzar_seco'
    | 'avanzar_verde'
    | 'anotar_proceso'
    | 'anotar_cata'
    | 'anotar_factor'
    | 'ver_rendimiento'
    | 'mas_acciones';

interface ModalAccion {
    tipo: AccionTipo;
    lote: any;
}

const PROCESOS = [
    'Lavado',
    'Natural',
    'Honey',
    'Fermentación anaeróbica',
    'Fermentación carbónica',
    'Fermentación con levadura',
    'Cofermentación',
];

const VARIEDADES = ['Bourbon Rosado', 'Geisha', 'Castillo', 'Caturra'];

const STAGE_STYLE: Record<string, string> = {
    Capturado: 'bg-slate-100 text-slate-600',
    'En validación': 'bg-amber-100 text-amber-700',
    Validado: 'bg-blue-100 text-blue-700',
    Rechazado: 'bg-rose-100 text-rose-700',
    Publicado: 'bg-emerald-100 text-emerald-700',
};

const FILTROS = [
    { id: 'Todos', label: 'Todas' },
    { id: 'Cereza', label: 'Cereza' },
    { id: 'Seco', label: 'Secado' },
    { id: 'Verde', label: 'Verde' },
];

function faseInfo(lote: any) {
    if (lote.fase === 0) return { emoji: '🎯', txt: 'Meta planeada', color: 'text-gray-500' };
    if (lote.fase === 1) return { emoji: '🍒', txt: 'Cereza fresca', color: 'text-red-600' };
    if (lote.fase === 2)
        return {
            emoji: '☀️',
            txt: lote.pesos?.pergamino > 0 ? 'Pergamino seco' : 'En secado',
            color: 'text-amber-600',
        };
    return { emoji: '☕', txt: 'Café verde', color: 'text-[#2D3E33]' };
}

function kilosActuales(lote: any) {
    if (lote.fase === 3) return Number(lote.pesos?.verde) || 0;
    if (lote.fase === 2) {
        const p = Number(lote.pesos?.pergamino);
        return p > 0 ? p : (Number(lote.pesos?.cereza) || 0);
    }
    return Number(lote.pesos?.cereza) || 0;
}

/** Input de número grande y centrado para las hojas de acción. */
function NumeroGrande({
    value,
    onChange,
    sufijo = 'kilos',
    color = 'text-[#5f705f]',
    autoFocus,
}: {
    value: string;
    onChange: (v: string) => void;
    sufijo?: string;
    color?: string;
    autoFocus?: boolean;
}) {
    return (
        <div className="relative">
            <input
                type="number"
                inputMode="decimal"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus={autoFocus}
                placeholder="0"
                className={cn(
                    'w-full h-20 rounded-2xl bg-white border-2 border-gray-200 text-center text-4xl font-black outline-none focus:border-[#5f705f] pr-24',
                    color
                )}
            />
            {sufijo && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#5f705f] bg-[#5f705f]/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {sufijo}
                </span>
            )}
        </div>
    );
}

export function CosechasPage() {
    const navigate = useNavigate();
    const [cosechas, setCosechas] = useState<any[]>([]);
    const [filtro, setFiltro] = useState('Todos');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stages, setStages] = useState<Record<string, any>>({});

    const [modal, setModal] = useState<ModalAccion | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [factorValue, setFactorValue] = useState('');

    // Corrección de lote rechazado
    const [correccion, setCorreccion] = useState<any | null>(null);
    const [cPeso, setCPeso] = useState('');
    const [cProceso, setCProceso] = useState('Lavado');
    const [cVariedad, setCVariedad] = useState('Bourbon Rosado');
    const [cMotivo, setCMotivo] = useState('');

    useEffect(() => {
        setCargando(true);
        getCosechas()
            .then(async (data) => {
                setCosechas(data);
                const s: Record<string, any> = {};
                for (const item of data) s[item.codigo] = await getValidationStageForLote(item.codigo);
                setStages(s);
            })
            .catch(() => setError('No pudimos cargar tus cosechas'))
            .finally(() => setCargando(false));
    }, []);

    const guardar = async (next: any[]) => {
        setCosechas(next);
        try {
            await saveCosechas(next);
        } catch {
            toast.error('No se pudo guardar');
        }
    };

    const abrir = (tipo: AccionTipo, lote: any) => {
        setInputValue('');
        setSelectValue('');
        setFactorValue('');
        setModal({ tipo, lote });
    };

    const iniciarSecado = (lote: any) => {
        guardar(
            cosechas.map((l) =>
                l.id === lote.id ? { ...l, fase: 2, estado: 'En Secado', pesos: { ...l.pesos, pergamino: 0 } } : l
            )
        );
        toast.success(`Lote ${lote.codigo} pasó a secado ☀️`);
    };

    const toggleOfrecer = (loteId: string) => {
        const next = cosechas.map((l) => {
            if (l.id !== loteId) return l;
            const offered = !l.ofrecidoPorProductor;
            try {
                const raw = localStorage.getItem('odisea_lotes_master');
                if (raw) {
                    const master = JSON.parse(raw).map((ml: any) =>
                        ml.id === l.codigo || ml.id === l.id ? { ...ml, ofrecidoPorProductor: offered } : ml
                    );
                    localStorage.setItem('odisea_lotes_master', JSON.stringify(master));
                }
            } catch {}
            return { ...l, ofrecidoPorProductor: offered };
        });
        guardar(next);
        toast.success('Actualizamos el estado de tu oferta');
    };

    const confirmar = async () => {
        if (!modal) return;
        const { tipo, lote } = modal;
        const num = parseFloat(inputValue);

        if (tipo === 'sumar_cereza') {
            if (!num || num <= 0) return toast.error('Escribe cuántos kilos entraron');
            let total = 0;
            const next = cosechas.map((l) => {
                if (l.id !== lote.id) return l;
                const prevCherry = Number(l.pesos?.cereza) || 0;
                total = prevCherry + num;
                return {
                    ...l,
                    pesos: { ...l.pesos, cereza: total },
                    fase: l.fase === 0 ? 1 : l.fase,
                    estado: l.fase >= 2 ? l.estado : 'Cereza (Fresco)',
                };
            });
            await guardar(next);
            toast.success(`+${num} kilos de cereza en ${lote.codigo} (Total: ${total} kg)`);
            try {
                const a = await detectAnomaly(lote.codigo, 'peso_cereza', total, lote.finca || 'Finca La Esperanza', 'María González');
                if (a)
                    toast.warning('Peso poco usual', {
                        description: 'Se registró para que la Mesa de Control lo revise.',
                    });
            } catch {}
        } else if (tipo === 'avanzar_seco') {
            if (!num || num <= 0) return toast.error('Escribe los kilos de pergamino seco');
            const factor = parseFloat(factorValue);
            await guardar(
                cosechas.map((l) =>
                    l.id === lote.id
                        ? {
                              ...l,
                              pesos: { ...l.pesos, pergamino: num },
                              fase: 2,
                              estado: 'Pergamino Seco (Listo)',
                              factorRendimiento: !isNaN(factor) && factor > 0 ? factor : l.factorRendimiento || null,
                          }
                        : l
                )
            );
            toast.success(`${lote.codigo}: ${num} kilos de pergamino seco`);
            try {
                const a = await detectAnomaly(lote.codigo, 'peso_pergamino', num, lote.finca || 'Finca La Esperanza', 'María González');
                if (a) toast.warning('Peso poco usual', { description: 'Se registró para revisión.' });
            } catch {}
        } else if (tipo === 'avanzar_verde') {
            if (!num || num <= 0) return toast.error('Escribe los kilos de café verde');
            const factor = parseFloat(factorValue);
            await guardar(
                cosechas.map((l) =>
                    l.id === lote.id
                        ? {
                              ...l,
                              pesos: { ...l.pesos, verde: num },
                              fase: 3,
                              estado: 'Verde (Trillado)',
                              factorRendimiento: !isNaN(factor) && factor > 0 ? factor : l.factorRendimiento || null,
                          }
                        : l
                )
            );
            toast.success(`${lote.codigo} trillado: ${num} kilos de verde ☕`);
        } else if (tipo === 'anotar_proceso') {
            if (!selectValue) return toast.error('Elige un proceso');
            await guardar(
                cosechas.map((l) =>
                    l.id === lote.id
                        ? { ...l, detallesObjetivo: { variedad: 'Mezcla / Definida', proceso: selectValue } }
                        : l
                )
            );
            toast.success(`Proceso ${selectValue} asignado`);
        } else if (tipo === 'anotar_cata') {
            if (!num || num < 50 || num > 100) return toast.error('Escribe un puntaje entre 50 y 100');
            await guardar(cosechas.map((l) => (l.id === lote.id ? { ...l, calificacion: num } : l)));
            toast.success(`Puntaje ${num} guardado ⭐`);
        } else if (tipo === 'anotar_factor') {
            if (!num || num <= 0) return toast.error('Escribe el factor de rendimiento');
            await guardar(cosechas.map((l) => (l.id === lote.id ? { ...l, factorRendimiento: num } : l)));
            toast.success(`Factor ${num} guardado`);
            try {
                const a = await detectAnomaly(lote.codigo, 'factor_rendimiento', num, lote.finca || 'Finca La Esperanza', 'María González');
                if (a) toast.warning('Factor poco usual', { description: 'Se registró para revisión.' });
            } catch {}
        }
        setModal(null);
    };

    const abrirCorreccion = (lote: any, motivo: string) => {
        setCorreccion(lote);
        setCPeso(String(lote.pesos.cereza || lote.pesos.objetivo || '0'));
        setCProceso(lote.detallesObjetivo?.proceso || 'Lavado');
        setCVariedad(lote.detallesObjetivo?.variedad || 'Bourbon Rosado');
        setCMotivo(motivo);
    };

    const guardarCorreccion = async () => {
        if (!correccion) return;
        await guardar(
            cosechas.map((l) =>
                l.id === correccion.id
                    ? {
                          ...l,
                          pesos: { ...l.pesos, cereza: Number(cPeso) },
                          detallesObjetivo: { ...l.detallesObjetivo, proceso: cProceso, variedad: cVariedad },
                      }
                    : l
            )
        );
        await updateLote(correccion.codigo, {
            variedad: cVariedad,
            proceso: cProceso,
            pesos: { cereza: Number(cPeso), pergamino: 0, verde: 0 },
        });
        await updateValidationStage(
            correccion.codigo,
            'En validación',
            'Productor María González',
            'Registro corregido y reenviado.'
        );
        const s = await getValidationStageForLote(correccion.codigo);
        setStages((prev) => ({ ...prev, [correccion.codigo]: s }));
        setCorreccion(null);
        toast.success(`${correccion.codigo} reenviado a validación`);
    };

    const visibles = cosechas.filter((c) => {
        if (filtro === 'Todos') return true;
        if (filtro === 'Cereza') return c.fase <= 1;
        if (filtro === 'Seco') return c.fase === 2;
        if (filtro === 'Verde') return c.fase === 3;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="px-1">
                <Eyebrow theme="dark">Trazabilidad en campo</Eyebrow>
                <h1 className="text-3xl sm:text-4xl font-heading uppercase text-[#2D3E33] tracking-tight">Cosechas y Lotes</h1>
                <p className="text-base text-[#4A2E3D]/80 mt-1 font-medium">
                    El registro de tu café paso a paso: de cereza fresca a secado y café verde trillado.
                </p>
            </div>

            <button
                onClick={() => navigate('/producer/cosechas/nueva')}
                className="w-full h-16 rounded-full bg-[#BD4A1F] hover:bg-[#a53e19] text-[#F6F2EC] font-extrabold text-base uppercase tracking-wider gap-3 shadow-lg shadow-[#BD4A1F]/25 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
            >
                <Plus size={24} /> Registrar nueva cosecha
            </button>

            {/* Filtros estilo píldora de landing */}
            <div className="grid grid-cols-4 gap-2 bg-[#DAD6CF]/40 p-1.5 rounded-2xl border border-[#2D3E33]/10">
                {FILTROS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFiltro(f.id)}
                        className={cn(
                            'rounded-xl py-2.5 text-[13px] font-extrabold uppercase tracking-wide transition-all cursor-pointer',
                            filtro === f.id
                                ? 'bg-[#2D3E33] text-[#F6F2EC] shadow-md shadow-[#2D3E33]/20'
                                : 'text-[#2D3E33]/70 hover:text-[#2D3E33] hover:bg-white/60'
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista: En móvil apilada, en PC en cuadrícula */}
            {cargando ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-44 rounded-3xl bg-white border border-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-3xl bg-rose-50 border border-rose-100 p-6 text-center space-y-3">
                    <AlertTriangle className="mx-auto text-rose-500" size={32} />
                    <p className="font-black text-rose-900">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="pr-tap mx-auto rounded-xl bg-rose-600 text-white font-black px-6"
                    >
                        Reintentar
                    </button>
                </div>
            ) : visibles.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
                    <p className="font-black text-gray-700 text-base">No hay cosechas en este filtro</p>
                    <p className="text-[13px] text-gray-400 mt-1">Cambia el filtro o registra una nueva.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibles.map((lote) => {
                        const info = faseInfo(lote);
                        const stage = stages[lote.codigo]?.stage || 'Capturado';
                        const rechazado = stage === 'Rechazado';
                        const motivoRechazo = rechazado
                            ? [...(stages[lote.codigo]?.historial || [])]
                                  .reverse()
                                  .find((h: any) => h.estadoNuevo === 'Rechazado')?.motivo
                            : null;

                        const numPaso = `0${lote.fase || 1}`;

                        return (
                            <div key={lote.id} className="rounded-[2rem] bg-white border-2 border-[#DAD6CF]/60 shadow-md p-5 space-y-4">
                                {/* Cabecera */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-9 px-3 rounded-full bg-[#F6F2EC] border border-[#2D3E33]/15 flex items-center justify-center font-heading text-base text-[#BD4A1F]">
                                            {numPaso}
                                        </span>
                                        <span
                                            className={cn(
                                                'text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white',
                                                lote.modalidad === 'objetivo' ? 'bg-[#2D3E33]' : 'bg-[#E5A84B] text-[#1B263B]'
                                            )}
                                        >
                                            {lote.modalidad === 'objetivo' ? 'Con plan' : 'Recolección libre'}
                                        </span>
                                    </div>
                                    <span
                                        className={cn(
                                            'text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full',
                                            STAGE_STYLE[stage]
                                        )}
                                    >
                                        {stage}
                                    </span>
                                </div>

                                <div className="flex items-end justify-between pt-1">
                                    <div>
                                        <h3 className="text-3xl font-heading text-[#2D3E33] tracking-wide leading-none">{lote.codigo}</h3>
                                        <p className={cn('text-sm font-extrabold mt-1.5 flex items-center gap-1.5', info.color)}>
                                            <span className="text-base">{info.emoji}</span> {info.txt}
                                        </p>
                                    </div>
                                    <div className="text-right flex items-baseline gap-1.5">
                                        <p className="font-heading text-3xl text-[#2D3E33]">{formatoNumero(kilosActuales(lote))}</p>
                                        <span className="text-[11px] font-extrabold uppercase text-[#BD4A1F] bg-[#BD4A1F]/10 px-2 py-0.5 rounded-full">kilos</span>
                                    </div>
                                </div>

                                {lote.detallesObjetivo?.proceso && (
                                    <p className="text-[13px] font-bold text-gray-500">
                                        {lote.detallesObjetivo.proceso}
                                        {lote.detallesObjetivo.variedad && lote.detallesObjetivo.variedad !== 'Mezcla / Definida'
                                            ? ` · ${lote.detallesObjetivo.variedad}`
                                            : ''}
                                    </p>
                                )}

                                {/* Línea de Tiempo y Trazabilidad de la Cosecha */}
                                <TimelineCosecha lote={lote} />

                                {/* Progreso de meta */}
                                {lote.modalidad === 'objetivo' && lote.pesos.objetivo > 0 && (
                                    <div className="rounded-2xl bg-[#5f705f]/5 p-3">
                                        <div className="flex justify-between items-center text-[12px] font-black text-gray-600">
                                            <span>Recolección</span>
                                            <span className="font-extrabold text-[#5f705f]">
                                                {formatoNumero(lote.pesos.cereza || 0)} / {formatoNumero(lote.pesos.objetivo)} kilos
                                            </span>
                                        </div>
                                        <div className="h-2.5 bg-white rounded-full mt-2 overflow-hidden border border-gray-200">
                                            <div
                                                className="h-full bg-[#5f705f] rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min(100, ((lote.pesos.cereza || 0) / lote.pesos.objetivo) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Rechazo */}
                                {rechazado && (
                                    <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3 space-y-2">
                                        <p className="text-[12px] font-black text-rose-800 flex items-center gap-1.5">
                                            <AlertTriangle size={14} /> La Mesa de Control devolvió este registro
                                        </p>
                                        <p className="text-[13px] text-rose-700">"{motivoRechazo || 'Revisar datos.'}"</p>
                                        <button
                                            onClick={() => abrirCorreccion(lote, motivoRechazo || '')}
                                            className="pr-tap w-full rounded-xl bg-rose-600 text-white font-black text-[13px]"
                                        >
                                            Corregir y reenviar
                                        </button>
                                    </div>
                                )}

                                {/* Acciones */}
                                {!rechazado && <AccionesLote lote={lote} onAbrir={abrir} onSecado={iniciarSecado} onOfrecer={toggleOfrecer} />}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ───── Hojas de acción ───── */}
            <BottomSheet
                open={modal?.tipo === 'sumar_cereza'}
                onClose={() => setModal(null)}
                title="Sumar cereza de hoy"
                tono="dorado"
            >
                <p className="text-center text-[14px] text-gray-500 mb-4">
                    Lote <span className="font-black text-gray-800">{modal?.lote.codigo}</span>. ¿Cuántos kilos de cereza entraron hoy?
                </p>
                <NumeroGrande value={inputValue} onChange={setInputValue} color="text-[#bb8d3b]" autoFocus />
                <button onClick={confirmar} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg mt-5">
                    Guardar
                </button>
            </BottomSheet>

            <BottomSheet open={modal?.tipo === 'avanzar_seco'} onClose={() => setModal(null)} title="Registrar peso seco" tono="dorado">
                <p className="text-center text-[14px] text-gray-500 mb-4">
                    Pesa tu café seco y anota los kilos de <span className="font-black">pergamino</span> del lote{' '}
                    <span className="font-black text-gray-800">{modal?.lote.codigo}</span>.
                </p>
                <NumeroGrande value={inputValue} onChange={setInputValue} color="text-[#bb8d3b]" autoFocus />
                <label className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mt-4 mb-1">
                    Factor de rendimiento (opcional)
                </label>
                <input
                    type="number"
                    inputMode="decimal"
                    value={factorValue}
                    onChange={(e) => setFactorValue(e.target.value)}
                    placeholder="Ej: 91.5"
                    className="w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 text-center text-lg font-bold outline-none focus:border-[#5f705f]"
                />
                <button onClick={confirmar} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg mt-5">
                    Guardar
                </button>
            </BottomSheet>

            <BottomSheet open={modal?.tipo === 'avanzar_verde'} onClose={() => setModal(null)} title="Pasar a café verde">
                <p className="text-center text-[14px] text-gray-500 mb-4">
                    Anota los kilos de café verde (trillado) del lote{' '}
                    <span className="font-black text-gray-800">{modal?.lote.codigo}</span>.
                </p>
                <NumeroGrande value={inputValue} onChange={setInputValue} autoFocus />
                <label className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mt-4 mb-1">
                    Factor de rendimiento (opcional)
                </label>
                <input
                    type="number"
                    inputMode="decimal"
                    value={factorValue}
                    onChange={(e) => setFactorValue(e.target.value)}
                    placeholder="Ej: 91.5"
                    className="w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 text-center text-lg font-bold outline-none focus:border-[#5f705f]"
                />
                <button onClick={confirmar} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg mt-5">
                    Guardar
                </button>
            </BottomSheet>

            <BottomSheet open={modal?.tipo === 'anotar_proceso'} onClose={() => setModal(null)} title="Elegir proceso" tono="dorado">
                <p className="text-center text-[14px] text-gray-500 mb-4">
                    ¿Cómo vas a procesar la cereza del lote{' '}
                    <span className="font-black text-gray-800">{modal?.lote.codigo}</span>?
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {PROCESOS.map((p) => (
                        <button
                            key={p}
                            onClick={() => setSelectValue(p)}
                            className={cn(
                                'rounded-2xl border-2 p-3 text-[13px] font-bold text-left transition-all',
                                selectValue === p
                                    ? 'border-[#5f705f] bg-[#5f705f]/5 text-gray-900'
                                    : 'border-gray-200 bg-white text-gray-500'
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <button onClick={confirmar} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg mt-5">
                    Asignar proceso
                </button>
            </BottomSheet>

            <BottomSheet open={modal?.tipo === 'anotar_cata'} onClose={() => setModal(null)} title="Puntaje de cata">
                <p className="text-center text-[14px] text-gray-500 mb-4">
                    Puntaje SCA que le dio el catador al lote{' '}
                    <span className="font-black text-gray-800">{modal?.lote.codigo}</span>.
                </p>
                <NumeroGrande value={inputValue} onChange={setInputValue} sufijo="puntos" color="text-gray-900" autoFocus />
                <button onClick={confirmar} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg mt-5">
                    Guardar puntaje
                </button>
            </BottomSheet>

            <BottomSheet open={modal?.tipo === 'anotar_factor'} onClose={() => setModal(null)} title="Factor de rendimiento">
                <p className="text-center text-[14px] text-gray-500 mb-4">
                    Factor de rendimiento del lote{' '}
                    <span className="font-black text-gray-800">{modal?.lote.codigo}</span>.
                </p>
                <NumeroGrande value={inputValue} onChange={setInputValue} sufijo="" color="text-emerald-600" autoFocus />
                <button onClick={confirmar} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg mt-5">
                    Guardar factor
                </button>
            </BottomSheet>

            {/* Más acciones */}
            <BottomSheet open={modal?.tipo === 'mas_acciones'} onClose={() => setModal(null)} title={modal?.lote.codigo} tono="neutro">
                {modal?.tipo === 'mas_acciones' && (
                    <MasAcciones
                        lote={modal.lote}
                        onAbrir={(t) => abrir(t, modal.lote)}
                        onSecado={() => {
                            iniciarSecado(modal.lote);
                            setModal(null);
                        }}
                        onOfrecer={() => {
                            toggleOfrecer(modal.lote.id);
                            setModal(null);
                        }}
                    />
                )}
            </BottomSheet>

            {/* Historia y mermas */}
            <BottomSheet open={modal?.tipo === 'ver_rendimiento'} onClose={() => setModal(null)} title="Historia y mermas" tono="neutro">
                {modal?.tipo === 'ver_rendimiento' && <HistoriaMermas lote={modal.lote} />}
            </BottomSheet>

            {/* Corrección */}
            <BottomSheet open={!!correccion} onClose={() => setCorreccion(null)} title="Corregir lote" tono="rojo">
                {correccion && (
                    <div className="space-y-4">
                        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3">
                            <p className="text-[11px] font-black uppercase text-rose-900">Motivo</p>
                            <p className="text-[13px] text-rose-700 italic">"{cMotivo}"</p>
                        </div>
                        <div>
                            <label className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1">
                                Kilos de cereza
                            </label>
                            <input
                                type="number"
                                inputMode="decimal"
                                value={cPeso}
                                onChange={(e) => setCPeso(e.target.value)}
                                className="w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 text-lg font-bold outline-none focus:border-[#5f705f]"
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1">Proceso</label>
                            <select
                                value={cProceso}
                                onChange={(e) => setCProceso(e.target.value)}
                                className="w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold outline-none"
                            >
                                {PROCESOS.map((p) => (
                                    <option key={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1">Variedad</label>
                            <select
                                value={cVariedad}
                                onChange={(e) => setCVariedad(e.target.value)}
                                className="w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold outline-none"
                            >
                                {VARIEDADES.map((v) => (
                                    <option key={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={guardarCorreccion}
                            className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg"
                        >
                            Guardar y reenviar
                        </button>
                    </div>
                )}
            </BottomSheet>
        </div>
    );
}

/* ── Botonera contextual por fase ── */
function AccionesLote({
    lote,
    onAbrir,
    onSecado,
    onOfrecer,
}: {
    lote: any;
    onAbrir: (t: AccionTipo, l: any) => void;
    onSecado: (l: any) => void;
    onOfrecer: (id: string) => void;
}) {
    const btn = 'pr-tap flex-1 rounded-2xl font-black text-[14px] gap-2';

    let principal: React.ReactNode = null;
    if (lote.fase <= 1) {
        if (lote.pesos.cereza > 0) {
            principal = (
                <button onClick={() => onSecado(lote)} className={cn(btn, 'bg-amber-500 text-white')}>
                    <Sun size={18} /> Iniciar secado
                </button>
            );
        } else if (lote.modalidad === 'diario' && !lote.detallesObjetivo?.proceso) {
            principal = (
                <button onClick={() => onAbrir('anotar_proceso', lote)} className={cn(btn, 'bg-[#bb8d3b] text-white')}>
                    <Settings2 size={18} /> Elegir proceso
                </button>
            );
        } else {
            principal = (
                <button onClick={() => onAbrir('sumar_cereza', lote)} className={cn(btn, 'bg-[#5f705f] text-white')}>
                    <Plus size={18} /> Sumar cereza
                </button>
            );
        }
    } else if (lote.fase === 2) {
        principal = !(lote.pesos.pergamino > 0) ? (
            <button onClick={() => onAbrir('avanzar_seco', lote)} className={cn(btn, 'bg-amber-500 text-white')}>
                <Sun size={18} /> Registrar peso seco
            </button>
        ) : (
            <button onClick={() => onAbrir('avanzar_verde', lote)} className={cn(btn, 'bg-[#5f705f] text-white')}>
                <Coffee size={18} /> Pasar a verde
            </button>
        );
    } else {
        principal = (
            <button
                onClick={() => onOfrecer(lote.id)}
                className={cn(
                    btn,
                    lote.ofrecidoPorProductor
                        ? lote.aprobadoComercializacion
                            ? 'bg-emerald-600 text-white'
                            : 'bg-sky-600 text-white'
                        : 'bg-[#bb8d3b] text-white'
                )}
            >
                <Megaphone size={18} />
                {lote.ofrecidoPorProductor
                    ? lote.aprobadoComercializacion
                        ? 'En marketplace'
                        : 'Pendiente'
                    : 'Ofrecer a tostadores'}
            </button>
        );
    }

    return (
        <div className="flex gap-2 pt-1">
            {lote.fase <= 1 && lote.pesos.cereza > 0 && (
                <button onClick={() => onAbrir('sumar_cereza', lote)} className={cn(btn, 'bg-[#5f705f]/10 text-[#5f705f]')}>
                    <Plus size={18} /> Cereza
                </button>
            )}
            {principal}
            <button
                onClick={() => onAbrir('mas_acciones', lote)}
                className="pr-tap w-12 shrink-0 rounded-2xl bg-gray-100 text-gray-500"
                aria-label="Más acciones"
            >
                <MoreHorizontal size={20} />
            </button>
        </div>
    );
}

/* ── Hoja "más acciones" ── */
function MasAcciones({
    lote,
    onAbrir,
    onSecado,
    onOfrecer,
}: {
    lote: any;
    onAbrir: (t: AccionTipo) => void;
    onSecado: () => void;
    onOfrecer: () => void;
}) {
    const item = 'w-full flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 font-bold text-gray-800 text-[15px]';
    return (
        <div className="space-y-2.5">
            {lote.fase <= 1 && lote.pesos.cereza > 0 && (
                <button onClick={onSecado} className={item}>
                    <Sun size={20} className="text-amber-500" /> Iniciar secado
                </button>
            )}
            {lote.fase >= 2 && (
                <button onClick={() => onAbrir('anotar_factor')} className={item}>
                    <BarChart3 size={20} className="text-emerald-600" />
                    {lote.factorRendimiento ? 'Editar factor de rendimiento' : 'Anotar factor de rendimiento'}
                </button>
            )}
            {lote.fase === 3 && !(lote.calificacion > 0) && (
                <button onClick={() => onAbrir('anotar_cata')} className={item}>
                    <Star size={20} className="text-[#bb8d3b]" /> Anotar puntaje de cata
                </button>
            )}
            {lote.fase === 3 && (
                <button onClick={onOfrecer} className={item}>
                    <Megaphone size={20} className="text-[#bb8d3b]" />
                    {lote.ofrecidoPorProductor ? 'Quitar de la oferta' : 'Ofrecer a tostadores'}
                </button>
            )}
            <button onClick={() => onAbrir('ver_rendimiento')} className={item}>
                <BarChart3 size={20} className="text-gray-400" /> Ver historia y mermas
            </button>
        </div>
    );
}

/* ── Hoja historia y mermas ── */
function HistoriaMermas({ lote }: { lote: any }) {
    const { cereza = 0, pergamino = 0, verde = 0 } = lote.pesos || {};
    const rowStyle = 'flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0';
    return (
        <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-gray-100 px-4">
                <div className={rowStyle}>
                    <span className="text-[14px] font-bold text-gray-500">🍒 Cereza recolectada</span>
                    <span className="font-black text-gray-900">{formatoNumero(cereza)} kilos</span>
                </div>
                <div className={rowStyle}>
                    <span className="text-[14px] font-bold text-gray-500">☀️ Pergamino seco</span>
                    <span className="font-black text-gray-900">{pergamino > 0 ? `${formatoNumero(pergamino)} kilos` : 'Pendiente'}</span>
                </div>
                <div className={rowStyle}>
                    <span className="text-[14px] font-bold text-gray-500">☕ Café verde</span>
                    <span className="font-black text-[#5f705f]">{verde > 0 ? `${formatoNumero(verde)} kilos` : 'Pendiente'}</span>
                </div>
            </div>
            {cereza > 0 && pergamino > 0 && (
                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-center">
                    <p className="text-[12px] font-black uppercase text-amber-800">Rendimiento a pergamino</p>
                    <p className="text-2xl font-black text-amber-600">{((pergamino / cereza) * 100).toFixed(1)}%</p>
                </div>
            )}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                <p className="text-[12px] font-black uppercase text-emerald-800">Factor de rendimiento</p>
                <p className="text-2xl font-black text-emerald-700">
                    {lote.factorRendimiento || <span className="text-[14px] text-gray-400 italic">Sin registrar</span>}
                </p>
            </div>
        </div>
    );
}
