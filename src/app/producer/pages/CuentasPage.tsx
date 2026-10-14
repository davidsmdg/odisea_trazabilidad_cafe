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
import { getFincas } from '../../../services/fincasService';

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
    const [parcelas, setParcelas] = useState<string[]>([]);
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
        Promise.all([getMovimientos(), getCategorias(), getPeriodoActivo(), getCosechas(), getFincas()])
            .then(([m, c, p, cos, fincas]) => {
                setMovs(m);
                setCats(c);
                setPeriodo(p);
                setCosechas(cos.map((x: any) => ({ codigo: x.codigo })));
                
                // Extraer los nombres de las parcelas de las fincas del productor
                const listaParcelas: string[] = [];
                for (const f of fincas) {
                    if (f.lotesDeCafe && Array.isArray(f.lotesDeCafe)) {
                        for (const lote of f.lotesDeCafe) {
                            if (lote.nombre && !listaParcelas.includes(lote.nombre)) {
                                listaParcelas.push(lote.nombre);
                            }
                        }
                    }
                }
                setParcelas(listaParcelas);
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
        asociacionTipo?: 'finca' | 'parcela' | 'cosecha';
        asociacionValor?: string;
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
                asociacionTipo: data.asociacionTipo,
                asociacionValor: data.asociacionValor,
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
                asociacionTipo: data.asociacionTipo,
                asociacionValor: data.asociacionValor,
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
        <div className="space-y-4 md:space-y-6">
            {/* Encabezado en PC */}
            <div className="hidden md:flex items-center justify-between pb-2 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Finanzas & Cuentas</h1>
                    <p className="text-sm font-medium text-gray-500">
                        {vista === 'cosecha' ? `Libro contable de ${periodo?.nombre || 'la cosecha'}` : `Movimientos del mes de ${mesLabel(mesRef)}`}
                    </p>
                </div>
                {tab !== 'todo' && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAnotar({ libro: tab, tipo: 'ingreso' })}
                            className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus size={18} /> {tab === 'cafe' ? 'Anotar venta' : 'Anotar ingreso'}
                        </button>
                        <button
                            onClick={() => setAnotar({ libro: tab, tipo: 'gasto' })}
                            className="px-4 py-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-sm flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus size={18} /> Anotar gasto
                        </button>
                    </div>
                )}
            </div>

            <div className="md:hidden">
                <h2 className="text-xl font-black text-gray-900 px-1">Mis cuentas</h2>
            </div>

            {/* Layout responsivo: 1 columna en móvil, 12 columnas en PC */}
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-6 items-start">
                {/* ── PANEL IZQUIERDO (Control de Filtros, Tarjeta de Saldo y Acciones) ── */}
                <div className="space-y-4 md:col-span-5 lg:col-span-5">
                    {/* Selector de vista */}
                    <div className="flex items-center gap-2">
                        <div className="grid grid-cols-2 flex-1 gap-1 rounded-2xl bg-gray-100 p-1">
                            {(['cosecha', 'mes'] as const).map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setVista(v)}
                                    className={cn(
                                        'rounded-xl py-2 text-[13px] font-black transition-all',
                                        vista === v ? 'bg-white text-[#5f705f] shadow-sm' : 'text-gray-400 hover:text-gray-600'
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
                                className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-[14px] font-black text-gray-700 capitalize">{mesLabel(mesRef)}</span>
                            <button
                                onClick={() => setMesRef(new Date(mesRef.getFullYear(), mesRef.getMonth() + 1, 1))}
                                className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* Pestañas de libro ("Dos bolsillos") */}
                    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#DAD6CF]/40 p-2 border border-[#2D3E33]/10">
                        {tabs.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={cn(
                                    'flex flex-col items-center gap-1.5 rounded-xl py-3 text-[13px] font-extrabold uppercase tracking-wide transition-all cursor-pointer',
                                    tab === id
                                        ? 'bg-[#2D3E33] text-[#F6F2EC] shadow-md shadow-[#2D3E33]/20 scale-[1.02]'
                                        : 'text-[#2D3E33]/70 hover:text-[#2D3E33] hover:bg-white/60'
                                )}
                            >
                                <Icon size={20} />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Tarjeta de saldo */}
                    <div
                        className={cn(
                            'rounded-[2rem] p-6 text-[#F6F2EC] shadow-xl relative overflow-hidden transition-all border border-white/10',
                            tab === 'hogar' ? 'bg-[#4A2E3D]' : tab === 'cafe' ? 'bg-[#2D3E33]' : 'bg-[#1B263B]'
                        )}
                    >
                        <PiggyBank className="absolute -right-4 -top-4 h-28 w-28 text-white/5 pointer-events-none" />
                        <div className="flex items-center justify-between relative">
                            <span className="inline-block px-3 py-1 rounded-full bg-[#E5A84B] text-[#1B263B] text-[11px] font-extrabold uppercase tracking-widest">
                                {tab === 'cafe'
                                    ? 'Bolsillo del café'
                                    : tab === 'hogar'
                                    ? 'Bolsillo de la casa'
                                    : 'Balance Total'}
                            </span>
                        </div>
                        <p className="text-[13px] font-bold uppercase tracking-wider text-[#CCD1C7] mt-3">
                            {tab === 'cafe' ? 'Ganancia neta' : tab === 'hogar' ? 'Gastos del hogar' : 'Lo que te queda'}
                        </p>
                        <p className="text-4xl sm:text-5xl font-heading text-[#F6F2EC] mt-1 relative tracking-wide">
                            {formatoPlata(r.saldo)}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/15 relative">
                            <div>
                                <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#CCD1C7] flex items-center gap-1.5">
                                    <TrendingUp size={15} className="text-[#E5A84B]" /> Entró
                                </p>
                                <p className="text-xl sm:text-2xl font-heading text-[#F6F2EC] mt-0.5">{formatoPlata(r.ingresos)}</p>
                            </div>
                            <div>
                                <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#CCD1C7] flex items-center gap-1.5">
                                    <TrendingDown size={15} className="text-red-300" /> Salió
                                </p>
                                <p className="text-xl sm:text-2xl font-heading text-[#F6F2EC] mt-0.5">{formatoPlata(r.gastos)}</p>
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

                    {/* Botones anotar (en móvil siempre visibles, en desktop como atajo) */}
                    {tab !== 'todo' && (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setAnotar({ libro: tab, tipo: 'ingreso' })}
                                className="pr-tap flex-col gap-1 rounded-3xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-black transition-colors"
                            >
                                <Plus size={22} /> {tab === 'cafe' ? 'Anotar venta' : 'Anotar ingreso'}
                            </button>
                            <button
                                onClick={() => setAnotar({ libro: tab, tipo: 'gasto' })}
                                className="pr-tap flex-col gap-1 rounded-3xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-black transition-colors"
                            >
                                <Plus size={22} /> Anotar gasto
                            </button>
                        </div>
                    )}

                    {/* Semilla de saldo inicial */}
                    {vista === 'cosecha' && !hayManuales && (
                        <button
                            onClick={() => setSemilla(true)}
                            className="w-full rounded-3xl border-2 border-dashed border-[#5f705f]/25 bg-white p-4 text-left flex gap-3 hover:border-[#5f705f] transition-colors"
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
                </div>

                {/* ── PANEL DERECHO (Lista Cronológica de Movimientos) ── */}
                <div className="space-y-4 md:col-span-7 lg:col-span-7">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-base font-black text-gray-900">Historial de movimientos</h3>
                        <span className="text-xs font-bold text-gray-400">{movsLibro.length} registros</span>
                    </div>

                    {movsLibro.length === 0 ? (
                        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
                            <p className="font-black text-gray-700 text-base">Nada anotado todavía</p>
                            <p className="text-[13px] text-gray-400 mt-1 max-w-xs mx-auto">
                                {tab === 'todo' ? 'Anota desde las pestañas Café o Casa.' : 'Usa los botones de anotar para registrar entradas o salidas.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {grupos.map(([dia, items]) => (
                                <div key={dia} className="space-y-2">
                                    <p className="text-[12px] font-black uppercase tracking-wide text-gray-400 capitalize px-1">
                                        {dia}
                                    </p>
                                    <div className="space-y-2">
                                        {items.map((m) => {
                                            const Icon = iconoDe(m.icono);
                                            const esIngreso = m.tipo === 'ingreso';
                                            const esSaldoInicial = m.origen === 'saldo-inicial';
                                            return (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setEditar(m)}
                                                    className={cn(
                                                        'w-full flex items-center gap-3.5 rounded-2xl border p-3.5 shadow-sm text-left transition-all',
                                                        esSaldoInicial
                                                            ? 'bg-amber-50/40 hover:bg-amber-50/70 border-amber-200/70'
                                                            : 'bg-white hover:bg-gray-50/80 border-gray-100'
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center shadow-sm',
                                                            esSaldoInicial
                                                                ? 'bg-amber-100/80 text-amber-800'
                                                                : esIngreso
                                                                ? 'bg-emerald-50 text-emerald-600'
                                                                : 'bg-rose-50 text-rose-500'
                                                        )}
                                                    >
                                                        <Icon size={19} />
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="font-black text-gray-900 truncate text-[14px]">{m.categoriaLabel}</p>
                                                            {esSaldoInicial && (
                                                                <span className="inline-flex items-center text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900">
                                                                    Saldo Inicial
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[13px] text-gray-400 truncate mt-0.5">
                                                            {tab === 'todo' && (m.libro === 'cafe' ? '☕ ' : '🏠 ')}
                                                            {m.nota || (
                                                                m.asociacionTipo === 'parcela' && m.asociacionValor
                                                                    ? `Parcela: ${m.asociacionValor}`
                                                                    : m.asociacionTipo === 'cosecha' && m.asociacionValor
                                                                    ? `Cosecha: ${m.asociacionValor}`
                                                                    : m.asociacionTipo === 'finca'
                                                                    ? 'Toda la finca'
                                                                    : m.cosechaCodigo
                                                                    ? m.cosechaCodigo
                                                                    : esSaldoInicial
                                                                    ? 'Estimado al iniciar'
                                                                    : 'Sin detalle'
                                                            )}
                                                        </p>
                                                    </div>
                                                    <span className={cn('font-black text-base shrink-0', esIngreso ? 'text-emerald-600' : 'text-gray-900')}>
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
                </div>
            </div>

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
                parcelas={parcelas}
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
