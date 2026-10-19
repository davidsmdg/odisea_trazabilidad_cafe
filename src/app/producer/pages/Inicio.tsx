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
import { Eyebrow } from '../../components/ui/Eyebrow';
import type { Cosecha } from '../../../types/cosecha';

const FASE_LABEL: Record<number, { txt: string; emoji: string; color: string }> = {
    0: { txt: 'Meta planeada', emoji: '🎯', color: 'text-gray-500' },
    1: { txt: 'Cereza fresca', emoji: '🍒', color: 'text-red-600' },
    2: { txt: 'En secado', emoji: '☀️', color: 'text-amber-600' },
    3: { txt: 'Café verde', emoji: '☕', color: 'text-[#2D3E33]' },
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
        <div className="space-y-5 md:space-y-6">
            {/* Título de sección en PC */}
            <div className="hidden md:flex items-center justify-between pb-2 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
                    <p className="text-sm font-medium text-gray-500">Resumen operativo, financiero y cosechas activas</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/producer/cuentas')}
                        className="px-4 py-2.5 rounded-2xl bg-[#bb8d3b] hover:bg-[#a67b30] text-white font-black text-sm flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Plus size={18} /> Anotar movimiento
                    </button>
                    <Link
                        to="/producer/cosechas/nueva"
                        className="px-4 py-2.5 rounded-2xl bg-[#5f705f] hover:bg-[#4a584a] text-white font-black text-sm flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Coffee size={18} /> Nueva Cosecha
                    </Link>
                </div>
            </div>

            {/* Grid principal: 1 columna en móvil, 12 columnas en PC */}
            <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-12 md:gap-6 items-start">
                {/* ── COLUMNA IZQUIERDA EN PC (Finanzas y Finca) ── */}
                <div className="space-y-5 md:col-span-5 lg:col-span-5">
                    {/* Cuentas de la cosecha con diseño fiel a la landing */}
                    <Link
                        to="/producer/cuentas"
                        className="pr-rise block rounded-[2rem] bg-[#2D3E33] hover:bg-[#25342a] transition-colors text-[#F6F2EC] p-6 shadow-xl shadow-[#2D3E33]/25 relative overflow-hidden border border-white/10"
                    >
                        <Wallet className="absolute -right-4 -top-4 h-32 w-32 text-white/5 pointer-events-none" />
                        <div className="flex items-center justify-between relative">
                            <span className="inline-block px-3 py-1 rounded-full bg-[#E5A84B] text-[#1B263B] text-[11px] font-extrabold uppercase tracking-widest">
                                Cosecha · {periodoNombre}
                            </span>
                            <ChevronRight size={20} className="text-[#CCD1C7] shrink-0" />
                        </div>
                        <p className="text-[13px] font-bold uppercase tracking-wider text-[#CCD1C7] mt-3">Ganancia del café</p>
                        <p className="text-4xl sm:text-5xl font-heading text-[#F6F2EC] mt-1 relative tracking-wide">
                            {formatoPlata(cafe.saldo)}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/15 relative">
                            <div>
                                <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#CCD1C7] flex items-center gap-1.5">
                                    <TrendingUp size={15} className="text-[#E5A84B]" /> Ha entrado
                                </p>
                                <p className="text-xl sm:text-2xl font-heading text-[#F6F2EC] mt-0.5">{formatoPlata(cafe.ingresos)}</p>
                            </div>
                            <div>
                                <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#CCD1C7] flex items-center gap-1.5">
                                    <TrendingDown size={15} className="text-red-300" /> Ha salido
                                </p>
                                <p className="text-xl sm:text-2xl font-heading text-[#F6F2EC] mt-0.5">{formatoPlata(cafe.gastos)}</p>
                            </div>
                        </div>
                        {cafe.ingresos === 0 && cafe.gastos === 0 && (
                            <p className="text-[13px] text-[#CCD1C7] mt-4 relative font-medium">
                                Anota tus primeras ventas o gastos para ver tu balance en tiempo real.
                            </p>
                        )}
                    </Link>

                    {/* Botón principal: Anotar (altura generosa y color terracota) */}
                    <button
                        onClick={() => navigate('/producer/cuentas')}
                        className="pr-tap w-full h-16 rounded-full bg-[#BD4A1F] hover:bg-[#a53e19] text-[#F6F2EC] font-extrabold text-base uppercase tracking-wider gap-3 shadow-lg shadow-[#BD4A1F]/25 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
                    >
                        <span className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Plus size={24} />
                        </span>
                        Anotar venta o gasto
                    </button>

                    {/* Acceso a la finca */}
                    <Link
                        to="/producer/finca"
                        className="flex items-center gap-4 rounded-3xl bg-white hover:border-[#2D3E33]/40 border-2 border-[#DAD6CF]/60 p-4 shadow-sm transition-all"
                    >
                        <span className="h-12 w-12 rounded-2xl bg-[#2D3E33]/10 flex items-center justify-center text-[#2D3E33]">
                            <Sprout size={24} />
                        </span>
                        <div className="flex-1">
                            <p className="font-extrabold text-base text-[#2D3E33]">Mi finca y parcelas</p>
                            <p className="text-sm text-[#4A2E3D]/80 font-medium">Revisa o marca tus lotes en el mapa.</p>
                        </div>
                        <ChevronRight size={20} className="text-[#2D3E33]/40" />
                    </Link>

                    {/* Tarjeta de instalación en celular / PWA */}
                    <div className="rounded-3xl bg-white border-2 border-[#DAD6CF]/60 p-4 flex items-center gap-3.5 shadow-sm">
                        <div className="h-11 w-11 rounded-2xl bg-[#2D3E33] flex items-center justify-center text-[#E5A84B] shrink-0 shadow-sm">
                            <ArrowUpRight size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-[14px] text-[#2D3E33] leading-tight">Instalar en la pantalla de tu celular</p>
                            <p className="text-[12px] text-[#4A2E3D]/80 font-medium mt-0.5">Entra más rápido y úsala en el campo sin datos ni señal.</p>
                        </div>
                    </div>
                </div>

                {/* ── COLUMNA DERECHA EN PC (Mis Cosechas) ── */}
                <div className="space-y-5 md:col-span-7 lg:col-span-7">
                    <section className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <Eyebrow theme="dark">En curso</Eyebrow>
                                <h2 className="text-2xl font-heading uppercase text-[#2D3E33]">Mis cosechas activas</h2>
                            </div>
                            <Link
                                to="/producer/cosechas"
                                className="text-[13px] font-extrabold uppercase tracking-wider text-[#BD4A1F] hover:underline flex items-center gap-1"
                            >
                                Ver todas <ChevronRight size={16} />
                            </Link>
                        </div>

                        {cargando ? (
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-24 rounded-[1.8rem] bg-white border border-[#DAD6CF]/60 animate-pulse" />
                                ))}
                            </div>
                        ) : cosechasActivas.length === 0 ? (
                            <Link
                                to="/producer/cosechas/nueva"
                                className="flex flex-col items-center text-center gap-3.5 rounded-[2rem] border-2 border-dashed border-[#DAD6CF] bg-white py-12 px-6 hover:border-[#2D3E33]/40 transition-colors shadow-sm"
                            >
                                <span className="h-16 w-16 rounded-full bg-[#2D3E33]/10 flex items-center justify-center text-[#2D3E33]">
                                    <Coffee size={32} />
                                </span>
                                <div>
                                    <p className="font-heading text-2xl uppercase text-[#2D3E33]">Aún no tienes cosechas</p>
                                    <p className="text-base text-[#4A2E3D]/80 mt-1 font-medium">Toca aquí para registrar tu primer lote de café recolectado.</p>
                                </div>
                                <span className="px-6 py-3 rounded-full bg-[#BD4A1F] text-[#F6F2EC] text-sm font-extrabold uppercase tracking-wider shadow-md">
                                    Registrar primer lote →
                                </span>
                            </Link>
                        ) : (
                            <div className="space-y-3">
                                {cosechasActivas.map((c, index) => {
                                    const fase = FASE_LABEL[c.fase] ?? FASE_LABEL[1];
                                    const kg =
                                        c.fase <= 1
                                            ? Number(c.pesos?.cereza) || 0
                                            : c.fase === 2
                                            ? (Number(c.pesos?.pergamino) > 0 ? Number(c.pesos?.pergamino) : (Number(c.pesos?.cereza) || 0))
                                            : Number(c.pesos?.verde) || 0;
                                    const numPaso = `0${c.fase || 1}`;
                                    return (
                                        <Link
                                            key={c.id}
                                            to="/producer/cosechas"
                                            className="flex items-center gap-4 rounded-[1.8rem] bg-white hover:border-[#2D3E33]/40 hover:shadow-md border-2 border-[#DAD6CF]/60 p-4 sm:p-5 shadow-sm transition-all"
                                        >
                                            <div className="h-14 w-14 rounded-2xl bg-[#F6F2EC] flex flex-col items-center justify-center shrink-0 border border-[#2D3E33]/10">
                                                <span className="font-heading text-xl text-[#BD4A1F] leading-none">{numPaso}</span>
                                                <span className="text-xs">{fase.emoji}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-heading text-xl text-[#2D3E33] tracking-wide truncate">{c.codigo}</p>
                                                </div>
                                                <p className="text-[13px] font-bold text-[#4A2E3D] flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[#2D3E33]">{fase.txt}</span>
                                                    <span>·</span>
                                                    <span className="font-heading text-lg text-[#2D3E33]">{kg}</span>
                                                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#4A2E3D]/80">kilos</span>
                                                </p>
                                            </div>
                                            <ChevronRight size={22} className="text-[#2D3E33]/30 shrink-0" />
                                        </Link>
                                    );
                                })}
                                <Link
                                    to="/producer/cosechas/nueva"
                                    className="w-full h-14 rounded-full border-2 border-[#2D3E33]/20 hover:border-[#2D3E33] text-[#2D3E33] font-extrabold text-sm uppercase tracking-wider gap-2 bg-white transition-colors flex items-center justify-center shadow-sm"
                                >
                                    <Plus size={20} /> Registrar nueva cosecha
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
