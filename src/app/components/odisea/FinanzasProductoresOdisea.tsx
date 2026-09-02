import { useEffect, useMemo, useState } from 'react';
import {
    Wallet,
    Lock,
    TrendingUp,
    TrendingDown,
    Users,
    Coffee,
    Home,
    ChevronDown,
    AlertTriangle,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { getMovimientos, getPeriodos } from '../../../services/finanzasService';
import type { MovimientoFinanciero, PeriodoCosecha } from '../../../types/finanzas';

const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Math.round(n || 0));

const fechaCorta = (iso: string) =>
    new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));

interface ResumenProductor {
    nombre: string;
    ingresosCafe: number;
    gastosCafe: number;
    gastosHogar: number;
    ingresosHogar: number;
    movimientos: MovimientoFinanciero[];
    ultima: string;
}

export function FinanzasProductoresOdisea() {
    const [movs, setMovs] = useState<MovimientoFinanciero[]>([]);
    const [periodos, setPeriodos] = useState<PeriodoCosecha[]>([]);
    const [periodoId, setPeriodoId] = useState<string>('todos');
    const [abierto, setAbierto] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([getMovimientos(), getPeriodos()])
            .then(([m, p]) => {
                setMovs(m);
                setPeriodos(p);
            })
            .catch(() => setError('No se pudieron cargar las finanzas de productores'))
            .finally(() => setIsLoading(false));
    }, []);

    const filtrados = useMemo(
        () => (periodoId === 'todos' ? movs : movs.filter((m) => m.periodoId === periodoId)),
        [movs, periodoId]
    );

    const productores = useMemo<ResumenProductor[]>(() => {
        const map = new Map<string, ResumenProductor>();
        for (const m of filtrados) {
            const nombre = m.productorNombre || 'Productor sin identificar';
            if (!map.has(nombre)) {
                map.set(nombre, {
                    nombre,
                    ingresosCafe: 0,
                    gastosCafe: 0,
                    gastosHogar: 0,
                    ingresosHogar: 0,
                    movimientos: [],
                    ultima: m.fechaISO,
                });
            }
            const r = map.get(nombre)!;
            r.movimientos.push(m);
            if (m.fechaISO > r.ultima) r.ultima = m.fechaISO;
            if (m.libro === 'cafe') m.tipo === 'ingreso' ? (r.ingresosCafe += m.monto) : (r.gastosCafe += m.monto);
            else m.tipo === 'ingreso' ? (r.ingresosHogar += m.monto) : (r.gastosHogar += m.monto);
        }
        return [...map.values()].sort((a, b) => b.ultima.localeCompare(a.ultima));
    }, [filtrados]);

    const total = productores.reduce(
        (acc, p) => ({
            ingresosCafe: acc.ingresosCafe + p.ingresosCafe,
            gastosCafe: acc.gastosCafe + p.gastosCafe,
            gastosHogar: acc.gastosHogar + p.gastosHogar,
        }),
        { ingresosCafe: 0, gastosCafe: 0, gastosHogar: 0 }
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 text-left font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <Wallet className="text-blue-600" size={40} /> Finanzas de Productores
                    </h1>
                    <p className="text-slate-400 font-medium text-sm uppercase tracking-[0.2em]">
                        Costos e ingresos que el productor registra desde su portal
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest">
                        <Lock size={12} /> Solo lectura
                    </span>
                    <select
                        value={periodoId}
                        onChange={(e) => setPeriodoId(e.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black uppercase tracking-wider text-slate-700 outline-none"
                    >
                        <option value="todos">Todos los periodos</option>
                        {periodos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center space-y-3">
                    <AlertTriangle className="mx-auto text-red-500" size={32} />
                    <p className="font-black text-red-900">{error}</p>
                </div>
            ) : productores.length === 0 ? (
                <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center">
                    <Wallet className="mx-auto text-slate-300 mb-3" size={40} />
                    <p className="font-black text-slate-700">Ningún productor ha registrado cuentas todavía</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Cuando un productor anote ventas o gastos en su portal, aparecerán aquí.
                    </p>
                </div>
            ) : (
                <>
                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Kpi
                            icon={<Users size={18} />}
                            label="Productores con cuentas"
                            value={String(productores.length)}
                        />
                        <Kpi
                            icon={<TrendingUp size={18} />}
                            label="Ingresos café"
                            value={fmt(total.ingresosCafe)}
                            tone="emerald"
                        />
                        <Kpi
                            icon={<TrendingDown size={18} />}
                            label="Gastos café"
                            value={fmt(total.gastosCafe)}
                            tone="rose"
                        />
                        <Kpi
                            icon={<Coffee size={18} />}
                            label="Margen café"
                            value={fmt(total.ingresosCafe - total.gastosCafe)}
                            tone={total.ingresosCafe - total.gastosCafe >= 0 ? 'emerald' : 'rose'}
                        />
                    </div>

                    {/* Por productor */}
                    <div className="space-y-4">
                        {productores.map((p) => {
                            const margen = p.ingresosCafe - p.gastosCafe;
                            const isOpen = abierto === p.nombre;
                            return (
                                <div key={p.nombre} className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                                    <button
                                        onClick={() => setAbierto(isOpen ? null : p.nombre)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors border-none bg-transparent"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="h-11 w-11 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-sm">
                                                {p.nombre
                                                    .split(' ')
                                                    .map((x) => x[0])
                                                    .slice(0, 2)
                                                    .join('')}
                                            </span>
                                            <div>
                                                <p className="font-black text-slate-900">{p.nombre}</p>
                                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                    {p.movimientos.length} movimientos · última act. {fechaCorta(p.ultima)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="hidden sm:flex items-center gap-6">
                                                <Cifra label="Café · entró" value={fmt(p.ingresosCafe)} tone="emerald" />
                                                <Cifra label="Café · salió" value={fmt(p.gastosCafe)} tone="rose" />
                                                <Cifra
                                                    label="Margen café"
                                                    value={fmt(margen)}
                                                    tone={margen >= 0 ? 'emerald' : 'rose'}
                                                />
                                            </div>
                                            <ChevronDown
                                                size={20}
                                                className={cn('text-slate-400 transition-transform', isOpen && 'rotate-180')}
                                            />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-slate-100 p-6 space-y-4 bg-slate-50/50">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <MiniBox icon={<Coffee size={14} />} label="Ingresos café" value={fmt(p.ingresosCafe)} />
                                                <MiniBox icon={<Coffee size={14} />} label="Gastos café" value={fmt(p.gastosCafe)} />
                                                <MiniBox icon={<Home size={14} />} label="Gastos hogar" value={fmt(p.gastosHogar)} />
                                                <MiniBox icon={<Home size={14} />} label="Ingresos hogar" value={fmt(p.ingresosHogar)} />
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                            <th className="text-left px-4 py-2.5">Fecha</th>
                                                            <th className="text-left px-4 py-2.5">Concepto</th>
                                                            <th className="text-left px-4 py-2.5 hidden md:table-cell">Libro</th>
                                                            <th className="text-left px-4 py-2.5 hidden md:table-cell">Cosecha</th>
                                                            <th className="text-right px-4 py-2.5">Monto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[...p.movimientos]
                                                            .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO))
                                                            .slice(0, 40)
                                                            .map((m) => (
                                                                <tr key={m.id} className="border-t border-slate-100">
                                                                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                                                                        {fechaCorta(m.fechaISO)}
                                                                    </td>
                                                                    <td className="px-4 py-2.5 font-bold text-slate-800">
                                                                        {m.categoriaLabel}
                                                                        {m.nota && (
                                                                            <span className="block text-[11px] font-medium text-slate-400">
                                                                                {m.nota}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-2.5 hidden md:table-cell">
                                                                        <span
                                                                            className={cn(
                                                                                'text-[10px] font-black uppercase px-2 py-0.5 rounded',
                                                                                m.libro === 'cafe'
                                                                                    ? 'bg-amber-100 text-amber-700'
                                                                                    : 'bg-slate-100 text-slate-600'
                                                                            )}
                                                                        >
                                                                            {m.libro === 'cafe' ? 'Café' : 'Hogar'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-2.5 hidden md:table-cell text-slate-500 font-mono text-xs">
                                                                        {m.cosechaCodigo || '—'}
                                                                    </td>
                                                                    <td
                                                                        className={cn(
                                                                            'px-4 py-2.5 text-right font-black whitespace-nowrap',
                                                                            m.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'
                                                                        )}
                                                                    >
                                                                        {m.tipo === 'ingreso' ? '+' : '−'}
                                                                        {fmt(m.monto)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="text-[11px] text-slate-400">
                                                Datos capturados por el productor. Odisea no puede editarlos desde aquí.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

function Kpi({
    icon,
    label,
    value,
    tone = 'slate',
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    tone?: 'slate' | 'emerald' | 'rose';
}) {
    const toneCls = {
        slate: 'text-slate-900',
        emerald: 'text-emerald-600',
        rose: 'text-rose-600',
    }[tone];
    return (
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-slate-400 mb-3">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className={cn('text-2xl font-black tracking-tight', toneCls)}>{value}</p>
        </div>
    );
}

function Cifra({ label, value, tone }: { label: string; value: string; tone: 'emerald' | 'rose' }) {
    return (
        <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <p className={cn('font-black text-sm', tone === 'emerald' ? 'text-emerald-600' : 'text-rose-600')}>{value}</p>
        </div>
    );
}

function MiniBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-xl bg-white border border-slate-200 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                {icon}
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="font-black text-slate-800 text-sm">{value}</p>
        </div>
    );
}
