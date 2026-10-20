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
    AlertCircle,
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
import { registrarEvento } from '../../services/telemetryService';
import type { Finca, LoteCafe } from '../../types/finca';
import {
    MensajeErrorCampo,
    vibrarError,
    enfocarCampoConError,
    describirMontoEnPalabras,
} from '../utils/usabilidad';

const inputBase =
    'w-full h-14 rounded-2xl bg-white border-2 border-[#DAD6CF] px-4 font-extrabold text-base text-[#2D3E33] outline-none focus:border-[#2D3E33] shadow-sm transition-all';

function Label({ children }: { children: React.ReactNode }) {
    return <span className="block text-[15px] font-extrabold uppercase tracking-wide text-[#2D3E33] mb-2">{children}</span>;
}

const VARIEDADES_COMUNES = [
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
];

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
    const [erroresPaso0, setErroresPaso0] = useState<{ nombre?: string; departamento?: string; municipio?: string }>({});
    const [shakeKey, setShakeKey] = useState(0);

    // Parcela
    const [pNombre, setPNombre] = useState('');
    const [pArea, setPArea] = useState('');
    const [variedades, setVariedades] = useState<string[]>([]);
    const [nuevaVar, setNuevaVar] = useState('');
    const [mostrarOtro, setMostrarOtro] = useState(false);

    // Cuentas
    const [gc, setGc] = useState('');
    const [ic, setIc] = useState('');
    const [gh, setGh] = useState('');

    const toggleVariedad = (v: string) => {
        if (variedades.includes(v)) {
            setVariedades(variedades.filter((x) => x !== v));
        } else {
            setVariedades([...variedades, v]);
        }
    };

    const addVar = () => {
        const v = nuevaVar.trim();
        if (v && !variedades.includes(v)) setVariedades([...variedades, v]);
        setNuevaVar('');
        setMostrarOtro(false);
    };

    const avanzarPaso0 = () => {
        const err: { nombre?: string; departamento?: string; municipio?: string } = {};
        if (!nombre.trim()) err.nombre = 'Escribe cómo se llama tu finca.';
        if (!departamento) err.departamento = 'Toca aquí y elige tu departamento.';
        if (!municipio) err.municipio = departamento ? 'Toca aquí y elige tu municipio.' : 'Primero elige el departamento arriba.';

        if (err.nombre || err.departamento || err.municipio) {
            setErroresPaso0(err);
            setShakeKey((k) => k + 1);
            vibrarError();
            if (err.nombre) enfocarCampoConError('onb-finca-nombre');
            else if (err.departamento) enfocarCampoConError('onb-finca-depto');
            else if (err.municipio) enfocarCampoConError('onb-finca-mpio');
            return;
        }
        setErroresPaso0({});
        setPaso(1);
    };

    const finalizar = async () => {
        setGuardando(true);
        try {
            const fincaId =
                typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                          const r = (Math.random() * 16) | 0;
                          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                      });

            const variedadesFinales =
                nuevaVar.trim() && !variedades.includes(nuevaVar.trim())
                    ? [...variedades, nuevaVar.trim()]
                    : variedades;

            const parcelas: LoteCafe[] = [];
            if (pNombre.trim()) {
                const parcelaId =
                    typeof crypto !== 'undefined' && crypto.randomUUID
                        ? crypto.randomUUID()
                        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                              const r = (Math.random() * 16) | 0;
                              return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                          });
                const ubic = geo.posicion ? { ...geo.posicion, metodo: 'GPS' as const } : undefined;
                parcelas.push({
                    id: parcelaId,
                    nombre: pNombre.trim(),
                    area: pArea || '',
                    variedades: variedadesFinales,
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
            registrarEvento('onboarding_completado', {
                usuarioId: user?.id,
                nombre: user?.name,
                contacto: user?.celular || user?.email,
                rol: user?.role || 'AGRICULTOR',
                detalles: { finca: nombre.trim(), municipio, departamento },
            });
            setPaso(3);
        } catch {
            toast.error('No se pudo guardar. Intenta otra vez.');
        } finally {
            setGuardando(false);
        }
    };

    const money = (label: string, v: string, set: (x: string) => void) => {
        const enPalabras = describirMontoEnPalabras(v);
        return (
            <label className="block space-y-1.5">
                <span className="block text-[15px] font-bold text-gray-800">{label}</span>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-gray-400">$</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={v ? formatoNumero(Number(v)) : ''}
                        onChange={(e) => set(e.target.value.replace(/\D/g, ''))}
                        placeholder="0"
                        className={cn(inputBase, 'pl-10 text-xl font-black text-gray-900', Number(v) > 0 && 'odisea-field-ok')}
                    />
                </div>
                {enPalabras && (
                    <p className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        ✓ {enPalabras}
                    </p>
                )}
            </label>
        );
    };

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
                    <div className="flex-1 flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={cn('h-2.5 flex-1 rounded-full transition-colors', i <= paso ? 'bg-[#BD4A1F]' : 'bg-[#DAD6CF]/60')}
                            />
                        ))}
                    </div>
                    <span className="text-base font-heading text-[#2D3E33] w-12 text-right">{paso + 1}/3</span>
                </div>
            )}

            <div className="flex-1 px-5 py-4 overflow-y-auto">
                <div key={paso} className="pr-rise">
                    {/* ── Paso 1: Finca ── */}
                    {paso === 0 && (
                        <div className="space-y-5">
                            <div className="text-center pt-4">
                                <span className="inline-flex h-16 w-16 rounded-3xl bg-[#2D3E33]/10 items-center justify-center text-[#2D3E33] mb-3">
                                    <Sprout size={32} />
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-heading uppercase text-[#2D3E33] tracking-tight">Bienvenido a Mi Finca</h1>
                                <p className="text-base text-[#4A2E3D] mt-2 font-medium leading-relaxed">
                                    Empecemos por registrar tu finca. Toma menos de un minuto.
                                </p>
                            </div>

                            <div
                                key={`nom-${shakeKey}-${!!erroresPaso0.nombre}`}
                                className={cn(erroresPaso0.nombre && 'odisea-shake')}
                            >
                                <label className="block">
                                    <Label>1. Nombre de la finca *</Label>
                                    <input
                                        id="onb-finca-nombre"
                                        value={nombre}
                                        onChange={(e) => {
                                            setNombre(e.target.value);
                                            if (erroresPaso0.nombre) setErroresPaso0((p) => ({ ...p, nombre: undefined }));
                                        }}
                                        placeholder="Ej: Finca La Esperanza"
                                        className={cn(
                                            inputBase,
                                            erroresPaso0.nombre && 'odisea-field-error',
                                            !erroresPaso0.nombre && nombre.trim().length >= 2 && 'odisea-field-ok'
                                        )}
                                        autoFocus
                                    />
                                </label>
                                <MensajeErrorCampo mensaje={erroresPaso0.nombre} />
                            </div>

                            <div
                                key={`dep-${shakeKey}-${!!erroresPaso0.departamento}`}
                                className={cn(erroresPaso0.departamento && 'odisea-shake')}
                            >
                                <label className="block">
                                    <Label>2. Departamento *</Label>
                                    <select
                                        id="onb-finca-depto"
                                        value={departamento}
                                        onChange={(e) => {
                                            setDepartamento(e.target.value);
                                            setMunicipio('');
                                            if (erroresPaso0.departamento) setErroresPaso0((p) => ({ ...p, departamento: undefined }));
                                        }}
                                        className={cn(
                                            inputBase,
                                            erroresPaso0.departamento && 'odisea-field-error',
                                            !erroresPaso0.departamento && departamento && 'odisea-field-ok'
                                        )}
                                    >
                                        <option value="">Toca aquí para elegir…</option>
                                        {DEPARTAMENTOS.map((d) => (
                                            <option key={d}>{d}</option>
                                        ))}
                                    </select>
                                </label>
                                <MensajeErrorCampo mensaje={erroresPaso0.departamento} />
                            </div>

                            <div
                                key={`mun-${shakeKey}-${!!erroresPaso0.municipio}`}
                                className={cn(erroresPaso0.municipio && 'odisea-shake')}
                                onClick={() => {
                                    if (!departamento) {
                                        setErroresPaso0((p) => ({ ...p, departamento: 'Primero elige el departamento aquí arriba.' }));
                                        setShakeKey((k) => k + 1);
                                        vibrarError();
                                        enfocarCampoConError('onb-finca-depto');
                                    }
                                }}
                            >
                                <label className="block">
                                    <Label>3. Municipio *</Label>
                                    <select
                                        id="onb-finca-mpio"
                                        value={municipio}
                                        onChange={(e) => {
                                            setMunicipio(e.target.value);
                                            if (erroresPaso0.municipio) setErroresPaso0((p) => ({ ...p, municipio: undefined }));
                                        }}
                                        disabled={!departamento}
                                        className={cn(
                                            inputBase,
                                            !departamento && 'opacity-50 pointer-events-none',
                                            erroresPaso0.municipio && 'odisea-field-error',
                                            !erroresPaso0.municipio && municipio && 'odisea-field-ok'
                                        )}
                                    >
                                        <option value="">{departamento ? 'Toca aquí para elegir…' : 'Primero elige el departamento arriba…'}</option>
                                        {(REGIONES[departamento] || []).map((m) => (
                                            <option key={m}>{m}</option>
                                        ))}
                                    </select>
                                </label>
                                <MensajeErrorCampo mensaje={erroresPaso0.municipio} />
                            </div>

                            <label className="block">
                                <Label>4. Área total aproximada (opcional)</Label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        placeholder="Ej: 3"
                                        className={cn(inputBase, 'pr-28')}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#5f705f] bg-[#5f705f]/10 px-2.5 py-1 rounded-lg">
                                        hectáreas
                                    </span>
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
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Tu primera parcela</h1>
                                <p className="text-[16px] text-gray-600 mt-2 leading-relaxed">
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
                                    <input type="number" inputMode="decimal" value={pArea} onChange={(e) => setPArea(e.target.value)} placeholder="Ej: 1.5" className={cn(inputBase, 'pr-28')} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#5f705f] bg-[#5f705f]/10 px-2.5 py-1 rounded-lg">hectáreas</span>
                                </div>
                            </label>
                            <div>
                                <Label>Variedades de café sembradas</Label>
                                <p className="text-[13px] text-gray-500 mb-2.5">
                                    Toca las variedades que tengas en esta parcela:
                                </p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {VARIEDADES_COMUNES.map((v) => {
                                        const seleccionada = variedades.includes(v);
                                        return (
                                            <button
                                                type="button"
                                                key={v}
                                                onClick={() => toggleVariedad(v)}
                                                className={cn(
                                                    'px-3.5 py-2 rounded-xl text-[14px] font-bold transition-all border flex items-center gap-1.5 cursor-pointer',
                                                    seleccionada
                                                        ? 'bg-[#5f705f] text-white border-[#5f705f] shadow-sm scale-[1.02]'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#5f705f]/40'
                                                )}
                                            >
                                                {seleccionada && <Check size={14} className="stroke-[3]" />}
                                                {v}
                                            </button>
                                        );
                                    })}
                                </div>

                                {variedades.filter((v) => !VARIEDADES_COMUNES.includes(v)).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3 pt-1 border-t border-gray-100">
                                        {variedades
                                            .filter((v) => !VARIEDADES_COMUNES.includes(v))
                                            .map((v) => (
                                                <span
                                                    key={v}
                                                    className="flex items-center gap-1.5 bg-[#5f705f] text-white text-[13px] font-bold px-3 py-1.5 rounded-xl shadow-sm"
                                                >
                                                    <Check size={14} className="stroke-[3]" />
                                                    {v}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleVariedad(v)}
                                                        className="ml-1 hover:opacity-80"
                                                        aria-label={`Quitar ${v}`}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                    </div>
                                )}

                                {!mostrarOtro ? (
                                    <button
                                        type="button"
                                        onClick={() => setMostrarOtro(true)}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-[#5f705f] bg-[#5f705f]/10 hover:bg-[#5f705f]/20 px-4 py-2.5 rounded-xl transition-colors cursor-pointer mt-1"
                                    >
                                        <Plus size={18} /> Añadir otra variedad
                                    </button>
                                ) : (
                                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                                        <span className="block text-xs font-bold text-gray-600">Nombre de la otra variedad:</span>
                                        <div className="flex gap-2">
                                            <input
                                                value={nuevaVar}
                                                onChange={(e) => setNuevaVar(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVar())}
                                                placeholder="Ej: San Bernardo, Borbón Amarillo…"
                                                autoFocus
                                                className={cn(inputBase, 'h-12 text-sm flex-1')}
                                            />
                                            <button
                                                type="button"
                                                onClick={addVar}
                                                className="px-4 h-12 shrink-0 rounded-xl bg-[#5f705f] text-white font-bold text-sm flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <Plus size={16} /> Añadir
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMostrarOtro(false);
                                                    setNuevaVar('');
                                                }}
                                                className="h-12 w-12 shrink-0 rounded-xl bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300"
                                                aria-label="Cancelar"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border-2 border-gray-200 p-4 space-y-3 bg-white">
                                <Label>Ubicación (opcional)</Label>
                                {geo.posicion ? (
                                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                                        <p className="text-[13px] font-black text-emerald-800 flex items-center gap-1.5">
                                            <Check size={16} className="text-emerald-600 stroke-[3]" /> Coordenadas guardadas
                                        </p>
                                        <p className="text-xs text-emerald-700 font-mono mt-0.5">
                                            Lat: {geo.posicion.lat} · Long: {geo.posicion.lng} (precisión: ±{geo.posicion.precisionMetros}m)
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-[13px] text-gray-500">Párate en la parcela y toca el botón. Funciona sin señal de internet.</p>
                                )}

                                {geo.error && (
                                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 space-y-1.5">
                                        <div className="flex items-start gap-2 text-amber-900">
                                            <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold">{geo.error}</p>
                                                <p className="text-[11px] text-amber-700 mt-1">
                                                    Para activarlo: Abre la barra de notificaciones o Ajustes de tu teléfono, enciende la <strong>Ubicación / GPS</strong> y dale permiso al navegador.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={geo.capturar}
                                    disabled={geo.capturando}
                                    className="pr-tap w-full rounded-xl bg-[#5f705f] hover:bg-[#4d5c4d] text-white font-black text-[15px] gap-2 py-3.5 transition-colors cursor-pointer"
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
                                    <Wallet size={32} />
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Tus cuentas del año</h1>
                                <p className="text-[16px] text-gray-600 mt-2 leading-relaxed">
                                    ¿Más o menos cuánto llevas este año? Un estimado sirve para que tus finanzas arranquen al día.
                                </p>
                            </div>

                            {money('He gastado en el café este año', gc, setGc)}
                            {money('He recibido por ventas de café este año', ic, setIc)}
                            {money('He gastado en los gastos de la casa este año', gh, setGh)}
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
                        onClick={avanzarPaso0}
                        className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg cursor-pointer"
                    >
                        Siguiente
                    </button>
                )}
                {paso === 1 && (
                    <>
                        <button
                            onClick={() => {
                                if (nuevaVar.trim() && !variedades.includes(nuevaVar.trim())) {
                                    setVariedades([...variedades, nuevaVar.trim()]);
                                    setNuevaVar('');
                                    setMostrarOtro(false);
                                }
                                setPaso(2);
                            }}
                            className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg cursor-pointer"
                        >
                            Siguiente
                        </button>
                        <button
                            onClick={() => {
                                setPNombre('');
                                setPArea('');
                                setVariedades([]);
                                setPaso(2);
                            }}
                            className="pr-tap w-full text-[16px] font-bold text-gray-500 hover:text-gray-700 py-2.5 transition-colors cursor-pointer"
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
                            className="pr-tap w-full rounded-2xl bg-[#5f705f] hover:bg-[#4d5c4d] text-white font-black text-xl py-4 gap-2 disabled:opacity-60 transition-colors shadow-md cursor-pointer"
                        >
                            {guardando ? <Loader2 className="animate-spin" size={22} /> : <Check size={22} />} Terminar
                        </button>
                        <button
                            onClick={() => {
                                setGc('');
                                setIc('');
                                setGh('');
                                finalizar();
                            }}
                            disabled={guardando}
                            className="pr-tap w-full text-[16px] font-bold text-gray-500 hover:text-gray-700 py-2.5 transition-colors cursor-pointer"
                        >
                            Saltar por ahora
                        </button>
                    </>
                )}
                {paso === 3 && (
                    <button onClick={onListo} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg cursor-pointer">
                        Entrar a mi finca
                    </button>
                )}
            </div>
        </div>
    );
}
