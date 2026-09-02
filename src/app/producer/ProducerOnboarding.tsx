import { useState } from 'react';
import {
    Sprout,
    MapPin,
    Wallet,
    Check,
    ChevronLeft,
    Navigation,
    Loader2,
    Plus,
    X,
    PartyPopper,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';
import { useGeolocation } from './hooks/useGeolocation';
import { REGIONES, DEPARTAMENTOS } from './data/regiones';
import { formatoNumero } from './utils/formato';
import { saveFincas, getFincas } from '../../services/fincasService';
import { getPeriodoActivo, sembrarSaldoInicial } from '../../services/finanzasService';
import { marcarOnboarding } from './utils/onboardingFlag';
import { useAuth } from '../context/AuthContext';
import type { Finca, LoteCafe } from '../../types/finca';

const inputBase =
    'w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold text-gray-800 outline-none focus:border-[#5f705f]';

function Label({ children }: { children: React.ReactNode }) {
    return <span className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1.5">{children}</span>;
}

export function ProducerOnboarding({ onListo }: { onListo: () => void }) {
    const { user } = useAuth();
    const geo = useGeolocation();
    const [paso, setPaso] = useState(0); // 0 finca · 1 parcela · 2 cuentas · 3 listo
    const [guardando, setGuardando] = useState(false);

    // Finca
    const [nombre, setNombre] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [area, setArea] = useState('');

    // Parcela
    const [pNombre, setPNombre] = useState('');
    const [pArea, setPArea] = useState('');
    const [variedades, setVariedades] = useState<string[]>([]);
    const [nuevaVar, setNuevaVar] = useState('');

    // Cuentas
    const [gc, setGc] = useState('');
    const [ic, setIc] = useState('');
    const [gh, setGh] = useState('');

    const addVar = () => {
        const v = nuevaVar.trim();
        if (v && !variedades.includes(v)) setVariedades([...variedades, v]);
        setNuevaVar('');
    };

    const finalizar = async () => {
        setGuardando(true);
        try {
            const fincaId = Date.now().toString();
            const parcelas: LoteCafe[] = [];
            if (pNombre.trim()) {
                const ubic = geo.posicion ? { ...geo.posicion, metodo: 'GPS' as const } : undefined;
                parcelas.push({
                    id: `${fincaId}-p1`,
                    nombre: pNombre.trim(),
                    area: pArea || '',
                    variedades,
                    ubicacion: ubic,
                    coordenadaCentral: ubic ? `Lat: ${ubic.lat}, Long: ${ubic.lng}` : '',
                    estadoEUDR: ubic ? 'En revisión' : 'Pendiente',
                });
            }
            const finca: Finca = {
                id: fincaId,
                nombre: nombre.trim(),
                departamento,
                municipio,
                areaAproximada: area,
                cedulaCafetera: '',
                tipoTenencia: 'Propiedad Titulada',
                esComunidadEtnica: false,
                lotesDeCafe: parcelas,
            };
            const actuales = await getFincas();
            await saveFincas([...actuales, finca]);

            if (Number(gc) || Number(ic) || Number(gh)) {
                const per = await getPeriodoActivo();
                await sembrarSaldoInicial(
                    per.id,
                    {
                        gastoCafe: Number(gc) || undefined,
                        ingresoCafe: Number(ic) || undefined,
                        gastoHogar: Number(gh) || undefined,
                    },
                    user?.name
                );
            }

            marcarOnboarding('completo');
            setPaso(3);
        } catch {
            toast.error('No se pudo guardar. Intenta otra vez.');
        } finally {
            setGuardando(false);
        }
    };

    const money = (label: string, v: string, set: (x: string) => void) => (
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
                    className={cn(inputBase, 'pl-9 text-lg font-black')}
                />
            </div>
        </label>
    );

    return (
        <div className="producer-shell min-h-screen bg-[#FDFDF8] text-[#2c362c] mx-auto w-full max-w-md flex flex-col">
            {/* Progreso */}
            {paso < 3 && (
                <div className="flex items-center gap-3 px-5 pt-6 pb-2">
                    {paso > 0 ? (
                        <button
                            onClick={() => setPaso((p) => p - 1)}
                            className="h-9 w-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500"
                            aria-label="Atrás"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    ) : (
                        <div className="h-9 w-9" />
                    )}
                    <div className="flex-1 flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={cn('h-1.5 flex-1 rounded-full', i <= paso ? 'bg-[#5f705f]' : 'bg-gray-200')}
                            />
                        ))}
                    </div>
                    <span className="text-[12px] font-black text-gray-400 w-9 text-right">{paso + 1}/3</span>
                </div>
            )}

            <div className="flex-1 px-5 py-4 overflow-y-auto">
                <div key={paso} className="pr-rise">
                    {/* ── Paso 1: Finca ── */}
                    {paso === 0 && (
                        <div className="space-y-5">
                            <div className="text-center pt-4">
                                <span className="inline-flex h-16 w-16 rounded-3xl bg-[#5f705f]/10 items-center justify-center text-[#5f705f] mb-3">
                                    <Sprout size={30} />
                                </span>
                                <h1 className="text-2xl font-black text-gray-900">Bienvenida a Odisea</h1>
                                <p className="text-[15px] text-gray-500 mt-1">
                                    Empecemos por registrar tu finca. Toma menos de un minuto.
                                </p>
                            </div>
                            <label className="block">
                                <Label>Nombre de la finca</Label>
                                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Finca La Esperanza" className={inputBase} autoFocus />
                            </label>
                            <label className="block">
                                <Label>Departamento</Label>
                                <select
                                    value={departamento}
                                    onChange={(e) => {
                                        setDepartamento(e.target.value);
                                        setMunicipio('');
                                    }}
                                    className={inputBase}
                                >
                                    <option value="">Elige…</option>
                                    {DEPARTAMENTOS.map((d) => (
                                        <option key={d}>{d}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <Label>Municipio</Label>
                                <select
                                    value={municipio}
                                    onChange={(e) => setMunicipio(e.target.value)}
                                    disabled={!departamento}
                                    className={cn(inputBase, !departamento && 'opacity-40')}
                                >
                                    <option value="">Elige…</option>
                                    {(REGIONES[departamento] || []).map((m) => (
                                        <option key={m}>{m}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <Label>Área total aproximada</Label>
                                <div className="relative">
                                    <input type="number" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ej: 3" className={inputBase} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300">ha</span>
                                </div>
                            </label>
                        </div>
                    )}

                    {/* ── Paso 2: Parcela ── */}
                    {paso === 1 && (
                        <div className="space-y-5">
                            <div className="text-center pt-4">
                                <span className="inline-flex h-16 w-16 rounded-3xl bg-[#5f705f]/10 items-center justify-center text-[#5f705f] mb-3">
                                    <MapPin size={30} />
                                </span>
                                <h1 className="text-2xl font-black text-gray-900">Tu primera parcela</h1>
                                <p className="text-[15px] text-gray-500 mt-1">
                                    Un pedazo de tierra donde tienes café. Puedes agregar más después.
                                </p>
                            </div>
                            <label className="block">
                                <Label>Nombre de la parcela</Label>
                                <input value={pNombre} onChange={(e) => setPNombre(e.target.value)} placeholder='Ej: "El Mirador"' className={inputBase} />
                            </label>
                            <label className="block">
                                <Label>Área</Label>
                                <div className="relative">
                                    <input type="number" inputMode="decimal" value={pArea} onChange={(e) => setPArea(e.target.value)} placeholder="Ej: 1.5" className={inputBase} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300">ha</span>
                                </div>
                            </label>
                            <label className="block">
                                <Label>Variedades</Label>
                                <div className="flex gap-2">
                                    <input
                                        value={nuevaVar}
                                        onChange={(e) => setNuevaVar(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVar())}
                                        placeholder="Ej: Caturra"
                                        className={cn(inputBase, 'flex-1')}
                                    />
                                    <button onClick={addVar} className="h-14 w-14 shrink-0 rounded-2xl bg-[#5f705f] text-white flex items-center justify-center">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                {variedades.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {variedades.map((v) => (
                                            <span key={v} className="flex items-center gap-1.5 bg-[#5f705f]/10 text-[#5f705f] text-[13px] font-bold px-3 py-1.5 rounded-xl">
                                                {v}
                                                <button onClick={() => setVariedades(variedades.filter((x) => x !== v))}>
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </label>
                            <div className="rounded-2xl border-2 border-gray-200 p-4 space-y-3">
                                <Label>Ubicación (opcional)</Label>
                                {geo.posicion ? (
                                    <p className="text-[13px] font-black text-emerald-700 flex items-center gap-1.5">
                                        <Check size={15} /> {geo.posicion.lat}, {geo.posicion.lng}
                                    </p>
                                ) : (
                                    <p className="text-[13px] text-gray-500">Párate en la parcela y toca el botón. Funciona sin señal.</p>
                                )}
                                {geo.error && <p className="text-[13px] text-rose-600">{geo.error}</p>}
                                <button
                                    onClick={geo.capturar}
                                    disabled={geo.capturando}
                                    className="pr-tap w-full rounded-xl bg-[#5f705f] text-white font-black text-[15px] gap-2"
                                >
                                    {geo.capturando ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />}
                                    {geo.posicion ? 'Capturar de nuevo' : 'Capturar mi ubicación'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Paso 3: Cuentas ── */}
                    {paso === 2 && (
                        <div className="space-y-5">
                            <div className="text-center pt-4">
                                <span className="inline-flex h-16 w-16 rounded-3xl bg-[#5f705f]/10 items-center justify-center text-[#5f705f] mb-3">
                                    <Wallet size={30} />
                                </span>
                                <h1 className="text-2xl font-black text-gray-900">Tus cuentas de la cosecha</h1>
                                <p className="text-[15px] text-gray-500 mt-1">
                                    ¿Más o menos cuánto llevas esta cosecha? Un aproximado sirve para arrancar con la realidad.
                                </p>
                            </div>
                            {money('He gastado en el café', gc, setGc)}
                            {money('He recibido por el café', ic, setIc)}
                            {money('He gastado en la casa', gh, setGh)}
                        </div>
                    )}

                    {/* ── Listo ── */}
                    {paso === 3 && (
                        <div className="flex flex-col items-center text-center gap-4 pt-24">
                            <span className="inline-flex h-20 w-20 rounded-[28px] bg-[#5f705f] items-center justify-center text-white">
                                <PartyPopper size={38} />
                            </span>
                            <h1 className="text-3xl font-black text-gray-900">¡Todo listo!</h1>
                            <p className="text-[16px] text-gray-500 max-w-xs">
                                Ya puedes registrar tus cosechas y llevar tus cuentas del café y de la casa.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Acciones */}
            <div
                className="px-5 pt-3 space-y-2 border-t border-gray-100 bg-[#FDFDF8]"
                style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
            >
                {paso === 0 && (
                    <button
                        onClick={() => {
                            if (!nombre.trim() || !departamento || !municipio) return toast.error('Completa nombre, departamento y municipio');
                            setPaso(1);
                        }}
                        className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg"
                    >
                        Siguiente
                    </button>
                )}
                {paso === 1 && (
                    <>
                        <button onClick={() => setPaso(2)} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg">
                            Siguiente
                        </button>
                        <button
                            onClick={() => {
                                setPNombre('');
                                setPArea('');
                                setVariedades([]);
                                setPaso(2);
                            }}
                            className="pr-tap w-full text-[14px] font-black text-gray-400"
                        >
                            Saltar por ahora
                        </button>
                    </>
                )}
                {paso === 2 && (
                    <>
                        <button
                            onClick={finalizar}
                            disabled={guardando}
                            className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg gap-2 disabled:opacity-60"
                        >
                            {guardando ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />} Terminar
                        </button>
                        <button
                            onClick={() => {
                                setGc('');
                                setIc('');
                                setGh('');
                                finalizar();
                            }}
                            disabled={guardando}
                            className="pr-tap w-full text-[14px] font-black text-gray-400"
                        >
                            Saltar por ahora
                        </button>
                    </>
                )}
                {paso === 3 && (
                    <button onClick={onListo} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg">
                        Entrar a mi finca
                    </button>
                )}
            </div>
        </div>
    );
}
