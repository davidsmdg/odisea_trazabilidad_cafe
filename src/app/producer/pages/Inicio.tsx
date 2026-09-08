import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
    Plus,
    Wallet,
    Coffee,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Sprout,
    ArrowUpRight,
} from 'lucide-react';
import { getCosechas } from '../../../services/cosechasService';
import { getFincas } from '../../../services/fincasService';
import { getMovimientos, getPeriodoActivo } from '../../../services/finanzasService';
import { getPrecioReferencia } from '../data/preciosReferencia';
import { formatoPlata } from '../utils/formato';
import type { Cosecha } from '../../../types/cosecha';

const FASE_LABEL: Record<number, { txt: string; emoji: string; color: string }> = {
    0: { txt: 'Meta planeada', emoji: '🎯', color: 'text-gray-500' },
    1: { txt: 'Cereza fresca', emoji: '🍒', color: 'text-red-600' },
    2: { txt: 'En secado', emoji: '☀️', color: 'text-amber-600' },
    3: { txt: 'Café verde', emoji: '🌾', color: 'text-[#5f705f]' },
};

export function Inicio() {
    const navigate = useNavigate();
    const [cosechas, setCosechas] = useState<Cosecha[]>([]);
    const [departamento, setDepartamento] = useState<string | undefined>(undefined);
    const [cafe, setCafe] = useState({ ingresos: 0, gastos: 0, saldo: 0 });
    const [periodoNombre, setPeriodoNombre] = useState('esta cosecha');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        Promise.all([getCosechas(), getFincas(), getMovimientos(), getPeriodoActivo()])
            .then(([cs, fs, movs, per]) => {
                setCosechas(cs);
                if (fs[0]?.departamento) setDepartamento(fs[0].departamento);
                setPeriodoNombre(per?.nombre || 'esta cosecha');
                const delCafe = movs.filter((m) => m.libro === 'cafe' && (!per || m.periodoId === per.id));
                const ingresos = delCafe.filter((m) => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0);
                const gastos = delCafe.filter((m) => m.tipo === 'gasto').reduce((s, m) => s + m.monto, 0);
                setCafe({ ingresos, gastos, saldo: ingresos - gastos });
            })
            .catch(() => {})
            .finally(() => setCargando(false));
    }, []);

    const precio = getPrecioReferencia(departamento);
    const cosechasActivas = cosechas.filter((c) => c.fase < 3 || (c.calificacion ?? 0) === 0).slice(0, 3);

    return (
        <div className="space-y-5">
            {/* ── Cuentas de la cosecha (teaser; se conecta en la siguiente fase) ── */}
            <Link
                to="/producer/cuentas"
                className="pr-rise block rounded-3xl bg-[#5f705f] text-white p-5 shadow-lg shadow-[#5f705f]/20 relative overflow-hidden"
            >
                <Wallet className="absolute -right-4 -top-4 h-28 w-28 text-white/10" />
                <div className="flex items-center justify-between relative">
                    <p className="text-[12px] font-black uppercase tracking-widest text-emerald-100 truncate pr-2">
                        Ganancia del café · {periodoNombre}
                    </p>
                    <ChevronRight size={18} className="text-white/60 shrink-0" />
                </div>
                <p className="pr-amount text-4xl mt-3 relative">{formatoPlata(cafe.saldo)}</p>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/15 relative">
                    <div>
                        <p className="text-[11px] font-bold uppercase text-white/60 flex items-center gap-1">
                            <TrendingUp size={13} className="text-emerald-300" /> Ha entrado
                        </p>
                        <p className="text-lg font-black">{formatoPlata(cafe.ingresos)}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase text-white/60 flex items-center gap-1">
                            <TrendingDown size={13} className="text-red-300" /> Ha salido
                        </p>
                        <p className="text-lg font-black">{formatoPlata(cafe.gastos)}</p>
                    </div>
                </div>
                {cafe.ingresos === 0 && cafe.gastos === 0 && (
                    <p className="text-[12px] text-white/70 mt-3 relative">
                        Empieza a anotar tus ventas y gastos para ver cómo va la cosecha.
                    </p>
                )}
            </Link>

            {/* ── Botón principal: Anotar ── */}
            <button
                onClick={() => navigate('/producer/cuentas')}
                className="pr-tap w-full rounded-3xl bg-[#bb8d3b] text-white font-black text-lg gap-3 shadow-lg shadow-[#bb8d3b]/25 active:scale-[0.98] transition-transform"
            >
                <span className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Plus size={24} />
                </span>
                Anotar un movimiento
            </button>

            {/* ── Mis cosechas ── */}
            <section className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-black text-gray-900">Mis cosechas</h2>
                    <Link
                        to="/producer/cosechas"
                        className="text-[12px] font-black uppercase tracking-wide text-[#5f705f] flex items-center gap-1"
                    >
                        Ver todas <ChevronRight size={14} />
                    </Link>
                </div>

                {cargando ? (
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-24 rounded-3xl bg-white border border-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : cosechasActivas.length === 0 ? (
                    <Link
                        to="/producer/cosechas/nueva"
                        className="flex flex-col items-center text-center gap-2 rounded-3xl border-2 border-dashed border-gray-200 bg-white py-8 px-4"
                    >
                        <span className="h-12 w-12 rounded-2xl bg-[#5f705f]/10 flex items-center justify-center text-[#5f705f]">
                            <Coffee size={24} />
                        </span>
                        <p className="font-black text-gray-800">Aún no tienes cosechas</p>
                        <p className="text-[13px] text-gray-500">Toca aquí para registrar tu primer lote de café.</p>
                    </Link>
                ) : (
                    <div className="space-y-3">
                        {cosechasActivas.map((c) => {
                            const fase = FASE_LABEL[c.fase] ?? FASE_LABEL[1];
                            const kg =
                                c.fase <= 1
                                    ? c.pesos?.cereza || 0
                                    : c.fase === 2
                                    ? c.pesos?.pergamino || 0
                                    : c.pesos?.verde || 0;
                            return (
                                <Link
                                    key={c.id}
                                    to="/producer/cosechas"
                                    className="flex items-center gap-4 rounded-3xl bg-white border border-gray-100 p-4 shadow-sm"
                                >
                                    <span className="text-2xl">{fase.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-gray-900 truncate">{c.codigo}</p>
                                        <p className={`text-[13px] font-bold ${fase.color}`}>
                                            {fase.txt} · {kg} kg
                                        </p>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300" />
                                </Link>
                            );
                        })}
                        <Link
                            to="/producer/cosechas/nueva"
                            className="pr-tap w-full rounded-3xl border-2 border-[#5f705f]/20 text-[#5f705f] font-black gap-2 bg-white"
                        >
                            <Plus size={20} /> Registrar cosecha
                        </Link>
                    </div>
                )}
            </section>

            {/* ── Precio del día ── */}
            <section className="rounded-3xl bg-white border border-gray-100 p-5 shadow-sm">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-400">
                    Precio de hoy · {precio.departamento}
                </p>
                <div className="flex items-end justify-between mt-2">
                    <div>
                        <p className="pr-amount text-3xl text-gray-900">{formatoPlata(precio.precioCarga)}</p>
                        <p className="text-[12px] font-bold text-gray-400">por carga (125 kg pergamino)</p>
                    </div>
                    <span
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-black ${
                            precio.variacionPct >= 0
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-600'
                        }`}
                    >
                        <ArrowUpRight
                            size={14}
                            className={precio.variacionPct >= 0 ? '' : 'rotate-90'}
                        />
                        {precio.variacionPct >= 0 ? '+' : ''}
                        {precio.variacionPct}%
                    </span>
                </div>
            </section>

            {/* ── Acceso a la finca ── */}
            <Link
                to="/producer/finca"
                className="flex items-center gap-4 rounded-3xl bg-white border border-gray-100 p-4 shadow-sm"
            >
                <span className="h-11 w-11 rounded-2xl bg-[#5f705f]/10 flex items-center justify-center text-[#5f705f]">
                    <Sprout size={22} />
                </span>
                <div className="flex-1">
                    <p className="font-black text-gray-900">Mi finca y parcelas</p>
                    <p className="text-[13px] text-gray-500">Revisa o completa los datos de tu finca.</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </Link>
        </div>
    );
}
