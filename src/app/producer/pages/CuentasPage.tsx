import { useEffect, useMemo, useState } from 'react';
import {
    Coffee,
    Home,
    Layers,
    Plus,
    TrendingUp,
    TrendingDown,
    ChevronLeft,
    ChevronRight,
    PiggyBank,
    Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';
import { useAuth } from '../../context/AuthContext';
import { BottomSheet } from '../components/BottomSheet';
import { HojaMovimiento } from '../components/finanzas/HojaMovimiento';
import { iconoDe } from '../data/iconosFinanzas';
import { formatoPlata, formatoNumero, etiquetaDia, mesLabel } from '../utils/formato';
import type {
    CategoriaFinanciera,
    Libro,
    MovimientoFinanciero,
    PeriodoCosecha,
    TipoMovimiento,
} from '../../../types/finanzas';
import {
    getMovimientos,
    addMovimiento,
    updateMovimiento,
    deleteMovimiento,
    getCategorias,
    addCategoria,
    getPeriodoActivo,
    sembrarSaldoInicial,
} from '../../../services/finanzasService';
import { getCosechas } from '../../../services/cosechasService';

type Tab = Libro | 'todo';

function resumen(movs: MovimientoFinanciero[]) {
    const ingresos = movs.filter((m) => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0);
    const gastos = movs.filter((m) => m.tipo === 'gasto').reduce((s, m) => s + m.monto, 0);
    return { ingresos, gastos, saldo: ingresos - gastos };
}

export function CuentasPage() {
    const { user } = useAuth();
    const [movs, setMovs] = useState<MovimientoFinanciero[]>([]);
    const [cats, setCats] = useState<CategoriaFinanciera[]>([]);
    const [periodo, setPeriodo] = useState<PeriodoCosecha | null>(null);
    const [cosechas, setCosechas] = useState<{ codigo: string }[]>([]);
    const [cargando, setCargando] = useState(true);

    const [tab, setTab] = useState<Tab>('cafe');
    const [vista, setVista] = useState<'cosecha' | 'mes'>('cosecha');
    const [mesRef, setMesRef] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });

    const [anotar, setAnotar] = useState<{ libro: Libro; tipo: TipoMovimiento } | null>(null);
    const [editar, setEditar] = useState<MovimientoFinanciero | null>(null);
    const [semilla, setSemilla] = useState(false);

    useEffect(() => {
        Promise.all([getMovimientos(), getCategorias(), getPeriodoActivo(), getCosechas()])
            .then(([m, c, p, cos]) => {
                setMovs(m);
                setCats(c);
                setPeriodo(p);
                setCosechas(cos.map((x: any) => ({ codigo: x.codigo })));
            })
            .catch(() => toast.error('No pudimos cargar tus cuentas'))
            .finally(() => setCargando(false));
    }, []);

    const recargar = async () => {
        setMovs(await getMovimientos());
        setCats(await getCategorias());
    };

    /* Movimientos en la vista actual (por cosecha o por mes) */
    const movsVista = useMemo(() => {
        if (vista === 'cosecha') {
            return periodo ? movs.filter((m) => m.periodoId === periodo.id) : movs;
        }
        const ini = mesRef.getTime();
        const fin = new Date(mesRef.getFullYear(), mesRef.getMonth() + 1, 1).getTime();
        return movs.filter((m) => {
            const t = new Date(m.fechaISO).getTime();
            return t >= ini && t < fin;
        });
    }, [movs, vista, periodo, mesRef]);

    const movsLibro = tab === 'todo' ? movsVista : movsVista.filter((m) => m.libro === tab);
    const r = resumen(movsLibro);
    const rCafe = resumen(movsVista.filter((m) => m.libro === 'cafe'));
    const rHogar = resumen(movsVista.filter((m) => m.libro === 'hogar'));

    const hayManuales = movs.some((m) => m.origen === 'manual' && (tab === 'todo' || m.libro === tab));

    /* Agrupar por día */
    const grupos = useMemo(() => {
        const orden = [...movsLibro].sort((a, b) => +new Date(b.fechaISO) - +new Date(a.fechaISO));
        const map = new Map<string, MovimientoFinanciero[]>();
        for (const m of orden) {
            const dia = etiquetaDia(m.fechaISO);
            if (!map.has(dia)) map.set(dia, []);
            map.get(dia)!.push(m);
        }
        return [...map.entries()];
    }, [movsLibro]);

    const tabs: { id: Tab; label: string; Icon: typeof Coffee }[] = [
        { id: 'cafe', label: 'Del café', Icon: Coffee },
        { id: 'hogar', label: 'De la casa', Icon: Home },
        { id: 'todo', label: 'Todo', Icon: Layers },
    ];

    const guardarMovimiento = async (data: {
        categoria: CategoriaFinanciera;
        monto: number;
        nota: string;
        fechaISO: string;
        cosechaCodigo?: string;
    }) => {
        if (editar) {
            await updateMovimiento(editar.id, {
                categoriaId: data.categoria.id,
                categoriaLabel: data.categoria.label,
                icono: data.categoria.icono,
                monto: data.monto,
                nota: data.nota || undefined,
                fechaISO: data.fechaISO,
                cosechaCodigo: data.cosechaCodigo,
            });
            toast.success('Movimiento actualizado');
        } else if (anotar) {
            await addMovimiento({
                libro: anotar.libro,
                tipo: anotar.tipo,
                categoriaId: data.categoria.id,
                categoriaLabel: data.categoria.label,
                icono: data.categoria.icono,
                monto: data.monto,
                nota: data.nota || undefined,
                fechaISO: data.fechaISO,
                cosechaCodigo: data.cosechaCodigo,
                periodoId: periodo?.id || 'sin-periodo',
                productorNombre: user?.name,
                origen: 'manual',
            });
            toast.success(anotar.tipo === 'ingreso' ? '¡Venta anotada!' : 'Gasto anotado');
        }
        setAnotar(null);
        setEditar(null);
        recargar();
    };

    const eliminarMovimiento = async () => {
        if (!editar) return;
        await deleteMovimiento(editar.id);
        toast.success('Movimiento eliminado');
        setEditar(null);
        recargar();
    };

    const crearCategoria = async (label: string, icono: string) => {
        const libro = editar?.libro || anotar?.libro || 'cafe';
        const tipo = editar?.tipo || anotar?.tipo || 'gasto';
        const cat = await addCategoria({ libro, tipo, label, icono });
        setCats(await getCategorias());
        return cat;
    };

    const anotarSheetTipo = editar?.tipo ?? anotar?.tipo ?? 'gasto';
    const anotarSheetLibro = editar?.libro ?? anotar?.libro ?? 'cafe';

    if (cargando) {
        return (
            <div className="space-y-4">
                <div className="h-11 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                <div className="h-40 rounded-3xl bg-white border border-gray-100 animate-pulse" />
                <div className="h-24 rounded-3xl bg-white border border-gray-100 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900 px-1">Mis cuentas</h2>

            {/* Selector de vista */}
            <div className="flex items-center gap-2">
                <div className="grid grid-cols-2 flex-1 gap-1 rounded-2xl bg-gray-100 p-1">
                    {(['cosecha', 'mes'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setVista(v)}
                            className={cn(
                                'rounded-xl py-2 text-[13px] font-black',
                                vista === v ? 'bg-white text-[#5f705f] shadow-sm' : 'text-gray-400'
                            )}
                        >
                            {v === 'cosecha' ? 'Por cosecha' : 'Por mes'}
                        </button>
                    ))}
                </div>
            </div>

            {vista === 'cosecha' ? (
                <p className="text-[13px] font-black text-gray-500 px-1">{periodo?.nombre}</p>
            ) : (
                <div className="flex items-center justify-between px-1">
                    <button
                        onClick={() => setMesRef(new Date(mesRef.getFullYear(), mesRef.getMonth() - 1, 1))}
                        className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-[14px] font-black text-gray-700 capitalize">{mesLabel(mesRef)}</span>
                    <button
                        onClick={() => setMesRef(new Date(mesRef.getFullYear(), mesRef.getMonth() + 1, 1))}
                        className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Pestañas de libro */}
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-gray-100 p-1.5">
                {tabs.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={cn(
                            'flex flex-col items-center gap-1 rounded-xl py-2.5 text-[12px] font-black transition-all',
                            tab === id ? 'bg-white text-[#5f705f] shadow-sm' : 'text-gray-400'
                        )}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tarjeta de saldo */}
            <div
                className={cn(
                    'rounded-3xl p-5 text-white shadow-lg relative overflow-hidden',
                    tab === 'hogar' ? 'bg-[#bb8d3b]' : 'bg-[#5f705f]'
                )}
            >
                <PiggyBank className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
                <p className="text-[12px] font-black uppercase tracking-widest text-white/70 relative">
                    {tab === 'cafe'
                        ? 'Ganancia del café'
                        : tab === 'hogar'
                        ? 'Movimiento de la casa'
                        : 'Lo que te queda'}
                </p>
                <p className="pr-amount text-4xl mt-2 relative">{formatoPlata(r.saldo)}</p>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/15 relative">
                    <div>
                        <p className="text-[11px] font-bold uppercase text-white/60 flex items-center gap-1">
                            <TrendingUp size={13} /> Entró
                        </p>
                        <p className="text-lg font-black">{formatoPlata(r.ingresos)}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase text-white/60 flex items-center gap-1">
                            <TrendingDown size={13} /> Salió
                        </p>
                        <p className="text-lg font-black">{formatoPlata(r.gastos)}</p>
                    </div>
                </div>
                {tab === 'todo' && (
                    <div className="grid grid-cols-2 gap-2 mt-3 relative">
                        <div className="rounded-xl bg-white/10 p-2.5">
                            <p className="text-[10px] font-black uppercase text-white/60">Café</p>
                            <p className="font-black">{formatoPlata(rCafe.saldo)}</p>
                        </div>
                        <div className="rounded-xl bg-white/10 p-2.5">
                            <p className="text-[10px] font-black uppercase text-white/60">Casa</p>
                            <p className="font-black">{formatoPlata(rHogar.saldo)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Botones anotar */}
            {tab !== 'todo' && (
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setAnotar({ libro: tab, tipo: 'ingreso' })}
                        className="pr-tap flex-col gap-1 rounded-3xl bg-emerald-100 text-emerald-800 font-black"
                    >
                        <Plus size={22} /> {tab === 'cafe' ? 'Anotar venta' : 'Anotar ingreso'}
                    </button>
                    <button
                        onClick={() => setAnotar({ libro: tab, tipo: 'gasto' })}
                        className="pr-tap flex-col gap-1 rounded-3xl bg-rose-100 text-rose-700 font-black"
                    >
                        <Plus size={22} /> Anotar gasto
                    </button>
                </div>
            )}

            {/* Semilla de saldo inicial */}
            {vista === 'cosecha' && !hayManuales && (
                <button
                    onClick={() => setSemilla(true)}
                    className="w-full rounded-3xl border-2 border-dashed border-[#5f705f]/25 bg-white p-4 text-left flex gap-3"
                >
                    <Sparkles size={20} className="text-[#5f705f] shrink-0 mt-0.5" />
                    <span>
                        <span className="block font-black text-gray-800">¿Ya llevas gastos de esta cosecha?</span>
                        <span className="block text-[13px] text-gray-500">
                            Pon un aproximado de lo que llevas gastado y recibido para arrancar con datos reales.
                        </span>
                    </span>
                </button>
            )}

            {/* Lista de movimientos */}
            {movsLibro.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-10 text-center">
                    <p className="font-black text-gray-700">Nada anotado todavía</p>
                    <p className="text-[13px] text-gray-400 mt-1">
                        {tab === 'todo' ? 'Anota desde las pestañas Café o Casa.' : 'Usa los botones de arriba.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {grupos.map(([dia, items]) => (
                        <div key={dia}>
                            <p className="text-[12px] font-black uppercase tracking-wide text-gray-400 mb-2 capitalize px-1">
                                {dia}
                            </p>
                            <div className="space-y-2">
                                {items.map((m) => {
                                    const Icon = iconoDe(m.icono);
                                    const esIngreso = m.tipo === 'ingreso';
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => m.origen === 'manual' && setEditar(m)}
                                            className={cn(
                                                'w-full flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-3.5 shadow-sm text-left',
                                                m.origen !== 'manual' && 'opacity-80'
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center',
                                                    esIngreso ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                                                )}
                                            >
                                                <Icon size={19} />
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-gray-900 truncate">{m.categoriaLabel}</p>
                                                <p className="text-[13px] text-gray-400 truncate">
                                                    {tab === 'todo' && (m.libro === 'cafe' ? '☕ ' : '🏠 ')}
                                                    {m.nota || (m.cosechaCodigo ? m.cosechaCodigo : m.origen === 'saldo-inicial' ? 'Aproximado inicial' : 'Sin detalle')}
                                                </p>
                                            </div>
                                            <span className={cn('font-black shrink-0', esIngreso ? 'text-emerald-600' : 'text-gray-900')}>
                                                {esIngreso ? '+' : '−'}
                                                {formatoPlata(m.monto)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Hojas ── */}
            <HojaMovimiento
                open={!!anotar || !!editar}
                onClose={() => {
                    setAnotar(null);
                    setEditar(null);
                }}
                libro={anotarSheetLibro}
                tipo={anotarSheetTipo}
                movimiento={editar}
                categorias={cats}
                cosechas={cosechas}
                onGuardar={guardarMovimiento}
                onEliminar={eliminarMovimiento}
                onCrearCategoria={crearCategoria}
            />

            <BottomSheet open={semilla} onClose={() => setSemilla(false)} title="Saldo al empezar" tono="verde">
                <SemillaForm
                    onGuardar={async (s) => {
                        await sembrarSaldoInicial(periodo?.id || 'sin-periodo', s);
                        toast.success('Listo, ya tienes un punto de partida');
                        setSemilla(false);
                        recargar();
                    }}
                />
            </BottomSheet>
        </div>
    );
}

function SemillaForm({
    onGuardar,
}: {
    onGuardar: (s: { gastoCafe?: number; ingresoCafe?: number; gastoHogar?: number; ingresoHogar?: number }) => void;
}) {
    const [gc, setGc] = useState('');
    const [ic, setIc] = useState('');
    const [gh, setGh] = useState('');
    const input =
        'w-full h-14 rounded-2xl bg-white border-2 border-gray-200 pl-9 pr-4 text-lg font-black text-gray-800 outline-none focus:border-[#5f705f]';

    const campo = (label: string, v: string, set: (x: string) => void) => (
        <label className="block">
            <span className="block text-[13px] font-bold text-gray-600 mb-1.5">{label}</span>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-gray-300">$</span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={v ? formatoNumero(Number(v)) : ''}
                    onChange={(e) => set(e.target.value.replace(/\D/g, ''))}
                    placeholder="0"
                    className={input}
                />
            </div>
        </label>
    );

    return (
        <div className="space-y-4">
            <p className="text-[14px] text-gray-500">
                No tiene que ser exacto. Un aproximado sirve para que las cuentas de esta cosecha empiecen con la realidad.
            </p>
            {campo('Más o menos he gastado en el café', gc, setGc)}
            {campo('Más o menos he recibido por el café', ic, setIc)}
            {campo('Más o menos he gastado en la casa', gh, setGh)}
            <button
                onClick={() =>
                    onGuardar({
                        gastoCafe: Number(gc) || undefined,
                        ingresoCafe: Number(ic) || undefined,
                        gastoHogar: Number(gh) || undefined,
                    })
                }
                className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg"
            >
                Guardar punto de partida
            </button>
        </div>
    );
}
