import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Sprout,
    MapPin,
    Plus,
    Pencil,
    ChevronDown,
    Navigation,
    Check,
    Loader2,
    Trash2,
    FileText,
    Trees,
    X,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';
import { BottomSheet } from '../components/BottomSheet';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { useGeolocation } from '../hooks/useGeolocation';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { REGIONES, DEPARTAMENTOS } from '../data/regiones';
import { getFincas, saveFincas } from '../../../services/fincasService';
import type { Finca, LoteCafe } from '../../../types/finca';

const selectClass =
    'w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold text-gray-800 outline-none focus:border-[#5f705f]';

function Campo({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1.5">{label}</span>
            {children}
            {hint && <span className="block text-[12px] text-gray-400 mt-1">{hint}</span>}
        </label>
    );
}

const SOMBRIOS: LoteCafe['tipoSombrio'][] = ['Sol', 'Semisombra', 'Sombra'];
const FUENTES: LoteCafe['fuenteAgua'][] = [
    'Nacimiento propio',
    'Quebrada',
    'Acueducto veredal',
    'Aljibe',
    'Agua lluvia',
];

export function FincaPage() {
    const online = useOnlineStatus();
    const [fincas, setFincas] = useState<Finca[]>([]);
    const [cargando, setCargando] = useState(true);
    const [eudrAbierto, setEudrAbierto] = useState(false);

    const [fincaSheet, setFincaSheet] = useState<Finca | 'nueva' | null>(null);
    const [parcelaSheet, setParcelaSheet] = useState<{ fincaId: string; parcela: LoteCafe | 'nueva' } | null>(null);

    useEffect(() => {
        getFincas()
            .then(setFincas)
            .catch(() => toast.error('No pudimos cargar tu finca'))
            .finally(() => setCargando(false));
    }, []);

    const persistir = async (next: Finca[]) => {
        setFincas(next);
        try {
            await saveFincas(next);
        } catch {
            toast.error('No se pudo guardar');
        }
    };

    const guardarFinca = (data: Partial<Finca>) => {
        if (fincaSheet === 'nueva') {
            const nuevaId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0;
                return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
            });
            const nueva: Finca = {
                id: nuevaId,
                nombre: data.nombre!,
                departamento: data.departamento!,
                municipio: data.municipio!,
                areaAproximada: data.areaAproximada,
                cedulaCafetera: '',
                tipoTenencia: 'Propiedad Titulada',
                esComunidadEtnica: false,
                lotesDeCafe: [],
            };
            persistir([...fincas, nueva]);
            toast.success('¡Finca registrada!');
        } else if (fincaSheet) {
            persistir(fincas.map((f) => (f.id === fincaSheet.id ? { ...f, ...data } : f)));
            toast.success('Finca actualizada');
        }
        setFincaSheet(null);
    };

    const guardarParcela = (data: LoteCafe) => {
        if (!parcelaSheet) return;
        const { fincaId, parcela } = parcelaSheet;
        persistir(
            fincas.map((f) => {
                if (f.id !== fincaId) return f;
                const lotes =
                    parcela === 'nueva'
                        ? [...f.lotesDeCafe, data]
                        : f.lotesDeCafe.map((l) => (l.id === data.id ? data : l));
                return { ...f, lotesDeCafe: lotes };
            })
        );
        toast.success(parcela === 'nueva' ? 'Parcela agregada' : 'Parcela actualizada');
        setParcelaSheet(null);
    };

    const borrarParcela = (fincaId: string, parcelaId: string) => {
        persistir(
            fincas.map((f) =>
                f.id === fincaId ? { ...f, lotesDeCafe: f.lotesDeCafe.filter((l) => l.id !== parcelaId) } : f
            )
        );
        toast.success('Parcela eliminada');
        setParcelaSheet(null);
    };

    if (cargando) {
        return (
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="h-32 rounded-3xl bg-white border border-gray-100 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-gray-900 px-1">Mi finca</h2>

            {fincas.length === 0 ? (
                <div className="flex flex-col items-center text-center gap-3 rounded-3xl border-2 border-dashed border-gray-200 bg-white py-10 px-5">
                    <span className="h-14 w-14 rounded-2xl bg-[#5f705f]/10 flex items-center justify-center text-[#5f705f]">
                        <Sprout size={28} />
                    </span>
                    <p className="font-black text-gray-800 text-lg">Registra tu finca</p>
                    <p className="text-[14px] text-gray-500">
                        Con el nombre, el municipio y el área aproximada ya queda lista. Lo demás lo completas cuando puedas.
                    </p>
                    <button
                        onClick={() => setFincaSheet('nueva')}
                        className="pr-tap mt-1 w-full rounded-2xl bg-[#5f705f] text-white font-black gap-2"
                    >
                        <Plus size={20} /> Registrar mi finca
                    </button>
                </div>
            ) : (
                fincas.map((finca) => (
                    <div
                        key={finca.id}
                        className="rounded-3xl bg-white border-2 border-[#5f705f]/20 shadow-md overflow-hidden"
                    >
                        {/* Cabecera principal de la FINCA con estilo landing */}
                        <div className="bg-[#2D3E33] text-[#F6F2EC] p-6 rounded-t-[2rem] border-b border-white/10">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest mb-2.5 text-[#E5A84B]">
                                        <Sprout size={14} className="text-[#E5A84B]" />
                                        <span>Tu Finca Cafetera</span>
                                    </div>
                                    <h3 className="text-3xl sm:text-4xl font-heading tracking-wide uppercase leading-tight">{finca.nombre}</h3>
                                    <p className="text-sm sm:text-base font-bold text-[#CCD1C7] mt-1.5 flex items-center gap-2">
                                        <span>{finca.municipio}, {finca.departamento}</span>
                                        {finca.areaAproximada && (
                                            <>
                                                <span>•</span>
                                                <span className="bg-black/25 px-2.5 py-0.5 rounded-full text-xs font-heading tracking-wider text-[#E5A84B]">
                                                    {finca.areaAproximada} Hectáreas
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFincaSheet(finca)}
                                    className="h-11 w-11 shrink-0 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F6F2EC] flex items-center justify-center transition-colors cursor-pointer border border-white/15"
                                    aria-label="Editar datos de la finca"
                                    title="Editar datos de la finca"
                                >
                                    <Pencil size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Subsección: Parcelas que pertenecen a esta finca */}
                        <div className="p-4 sm:p-5 bg-[#FDFDF8]/70 space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-1 rounded-full bg-[#5f705f]" />
                                    <div>
                                        <p className="text-[12px] font-black uppercase tracking-wider text-gray-500">
                                            Parcelas de {finca.nombre}
                                        </p>
                                        <p className="text-[11px] text-gray-400 font-bold">
                                            Lotes o tablones sembrados dentro de esta finca
                                        </p>
                                    </div>
                                </div>
                                <span className="bg-[#5f705f]/15 text-[#3b553e] font-black text-xs px-2.5 py-1 rounded-xl">
                                    {finca.lotesDeCafe.length} {finca.lotesDeCafe.length === 1 ? 'parcela' : 'parcelas'}
                                </span>
                            </div>

                            {/* Lista de parcelas: En móvil apilada, en PC en cuadrícula de 2 o 3 columnas */}
                            {finca.lotesDeCafe.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
                                    <p className="text-sm font-bold text-gray-600">Aún no has agregado parcelas a esta finca.</p>
                                    <p className="text-xs text-gray-400 mt-1">Agrega tu primer lote o lote de café sembrado.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {finca.lotesDeCafe.map((parcela, idx) => (
                                        <button
                                            key={parcela.id}
                                            onClick={() => setParcelaSheet({ fincaId: finca.id, parcela })}
                                            className="w-full flex items-center gap-3 rounded-2xl bg-white border border-gray-200/90 p-4 shadow-sm text-left hover:border-[#5f705f] hover:shadow transition-all duration-150"
                                        >
                                            <span className="h-10 w-10 shrink-0 rounded-xl bg-[#5f705f]/10 text-[#3b553e] flex items-center justify-center font-black text-sm">
                                                {idx + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-gray-900 text-[15px] truncate">{parcela.nombre}</p>
                                                    <span className="text-[10px] font-extrabold text-[#3b553e] bg-[#eef5ef] px-2 py-0.5 rounded-md">
                                                        Parcela
                                                    </span>
                                                </div>
                                                <p className="text-[13px] font-bold text-gray-600 truncate flex items-center gap-1.5 mt-0.5">
                                                    <span>{parcela.area || '—'}</span>
                                                    <span className="text-[#3b553e] font-extrabold bg-[#5f705f]/10 px-2 py-0.2 rounded-md text-xs">hectáreas</span>
                                                    {parcela.variedades.length > 0 && <span className="text-gray-400 truncate">· {parcela.variedades.join(', ')}</span>}
                                                </p>
                                                {(() => {
                                                    const tiene = parcela.ubicacion || parcela.coordenadaCentral;
                                                    return (
                                                        <span
                                                            className={cn(
                                                                'inline-flex items-center gap-1 text-[11px] font-black uppercase mt-1',
                                                                tiene ? 'text-emerald-700' : 'text-gray-400'
                                                            )}
                                                        >
                                                            <MapPin size={11} />
                                                            {tiene ? 'Coordenadas GPS listas' : 'Sin ubicar por GPS'}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                            <ChevronDown size={18} className="text-gray-400 -rotate-90 shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setParcelaSheet({ fincaId: finca.id, parcela: 'nueva' })}
                                className="pr-tap w-full rounded-2xl border-2 border-dashed border-[#5f705f]/30 hover:border-[#5f705f] text-[#3b553e] font-black gap-2 bg-white transition-colors"
                            >
                                <Plus size={18} /> Añadir otra parcela a {finca.nombre}
                            </button>
                        </div>

                        {/* EUDR opcional */}
                        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setEudrAbierto((v) => !v)}
                                className="w-full flex items-center justify-between p-4"
                            >
                                <span className="text-left">
                                    <span className="block font-black text-gray-800">Datos para exportación</span>
                                    <span className="block text-[13px] text-gray-400">
                                        Cédula cafetera, tenencia, documentos. Puedes completarlo después.
                                    </span>
                                </span>
                                <ChevronDown
                                    size={20}
                                    className={cn('text-gray-400 transition-transform shrink-0', eudrAbierto && 'rotate-180')}
                                />
                            </button>
                            <AnimatePresence>
                                {eudrAbierto && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <EudrForm finca={finca} onSave={(d) => persistir(fincas.map((f) => (f.id === finca.id ? { ...f, ...d } : f)))} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))
            )}

            {fincas.length > 0 && (
                <button
                    type="button"
                    onClick={() => setFincaSheet('nueva')}
                    className="pr-tap w-full rounded-3xl bg-white border-2 border-[#5f705f]/40 hover:border-[#5f705f] text-[#2c3d2e] font-black text-[15px] gap-2 shadow-sm py-4 transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                    <Plus size={20} className="text-[#3b553e]" /> Registrar otra finca
                </button>
            )}

            {!online && (
                <p className="text-center text-[13px] text-gray-400">
                    Sin internet: todo se guarda en tu celular y se sincroniza después.
                </p>
            )}

            {/* ── Hoja: finca ── */}
            <BottomSheet
                open={!!fincaSheet}
                onClose={() => setFincaSheet(null)}
                title={fincaSheet === 'nueva' ? 'Registrar finca' : 'Editar finca'}
            >
                {fincaSheet && (
                    <FincaForm finca={fincaSheet === 'nueva' ? null : fincaSheet} onSave={guardarFinca} />
                )}
            </BottomSheet>

            {/* ── Hoja: parcela ── */}
            <BottomSheet
                open={!!parcelaSheet}
                onClose={() => setParcelaSheet(null)}
                title={parcelaSheet?.parcela === 'nueva' ? 'Nueva parcela' : 'Editar parcela'}
                tono="dorado"
            >
                {parcelaSheet && (
                    <ParcelaForm
                        parcela={parcelaSheet.parcela === 'nueva' ? null : parcelaSheet.parcela}
                        onSave={guardarParcela}
                        onDelete={
                            parcelaSheet.parcela === 'nueva'
                                ? undefined
                                : () => borrarParcela(parcelaSheet.fincaId, (parcelaSheet.parcela as LoteCafe).id)
                        }
                    />
                )}
            </BottomSheet>
        </div>
    );
}

/* ───────── Formulario de finca ───────── */
function FincaForm({ finca, onSave }: { finca: Finca | null; onSave: (d: Partial<Finca>) => void }) {
    const [nombre, setNombre] = useState(finca?.nombre || '');
    const [departamento, setDepartamento] = useState(finca?.departamento || '');
    const [municipio, setMunicipio] = useState(finca?.municipio || '');
    const [area, setArea] = useState(finca?.areaAproximada || '');

    const submit = () => {
        if (!nombre.trim() || !departamento || !municipio) {
            toast.error('Completa nombre, departamento y municipio');
            return;
        }
        onSave({ nombre: nombre.trim(), departamento, municipio, areaAproximada: area });
    };

    return (
        <div className="space-y-4">
            <Campo label="Nombre de la finca">
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Finca La Esperanza"
                    className={selectClass}
                    autoFocus
                />
            </Campo>
            <Campo label="Departamento">
                <select
                    value={departamento}
                    onChange={(e) => {
                        setDepartamento(e.target.value);
                        setMunicipio('');
                    }}
                    className={selectClass}
                >
                    <option value="">Elige…</option>
                    {DEPARTAMENTOS.map((d) => (
                        <option key={d}>{d}</option>
                    ))}
                </select>
            </Campo>
            <Campo label="Municipio">
                <select
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    disabled={!departamento}
                    className={cn(selectClass, !departamento && 'opacity-40')}
                >
                    <option value="">Elige…</option>
                    {(REGIONES[departamento] || []).map((m) => (
                        <option key={m}>{m}</option>
                    ))}
                </select>
            </Campo>
            <Campo label="Área total aproximada" hint="Un estimado está bien. Después lo ajustas.">
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Ej: 3"
                        className={cn(selectClass, 'pr-28')}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#5f705f] bg-[#5f705f]/10 px-2.5 py-1 rounded-lg">hectáreas</span>
                </div>
            </Campo>
            <button onClick={submit} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg gap-2">
                <Check size={20} /> Guardar
            </button>
        </div>
    );
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

/* ───────── Formulario de parcela ───────── */
function ParcelaForm({
    parcela,
    onSave,
    onDelete,
}: {
    parcela: LoteCafe | null;
    onSave: (d: LoteCafe) => void;
    onDelete?: () => void;
}) {
    const online = useOnlineStatus();
    const geo = useGeolocation();
    const [nombre, setNombre] = useState(parcela?.nombre || '');
    const [area, setArea] = useState(parcela?.area || '');
    const [variedades, setVariedades] = useState<string[]>(parcela?.variedades || []);
    const [nuevaVar, setNuevaVar] = useState('');
    const [mostrarOtro, setMostrarOtro] = useState(false);
    const [masDatos, setMasDatos] = useState(false);
    const [arboles, setArboles] = useState(parcela?.numeroArboles?.toString() || '');
    const [edad, setEdad] = useState(parcela?.edadCultivoAnios?.toString() || '');
    const [altitud, setAltitud] = useState(parcela?.altitudMsnm?.toString() || '');
    const [sombrio, setSombrio] = useState<LoteCafe['tipoSombrio'] | ''>(parcela?.tipoSombrio || '');
    const [fuente, setFuente] = useState<LoteCafe['fuenteAgua'] | ''>(parcela?.fuenteAgua || '');

    const ubic = geo.posicion
        ? { ...geo.posicion, metodo: 'GPS' as const }
        : parcela?.ubicacion;

    const toggleVariedad = (v: string) => {
        if (variedades.includes(v)) {
            setVariedades(variedades.filter((item) => item !== v));
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

    const submit = () => {
        if (!nombre.trim()) {
            toast.error('Ponle un nombre a la parcela');
            return;
        }
        const data: LoteCafe = {
            id: parcela?.id || Date.now().toString(),
            nombre: nombre.trim(),
            area: area || '',
            variedades,
            ubicacion: ubic,
            coordenadaCentral: ubic ? `Lat: ${ubic.lat}, Long: ${ubic.lng}` : parcela?.coordenadaCentral || '',
            estadoEUDR: ubic ? 'En revisión' : parcela?.estadoEUDR || 'Pendiente',
            numeroArboles: arboles ? Number(arboles) : undefined,
            edadCultivoAnios: edad ? Number(edad) : undefined,
            altitudMsnm: altitud ? Number(altitud) : undefined,
            tipoSombrio: sombrio || undefined,
            fuenteAgua: fuente || undefined,
            poligonoCoordenadas: parcela?.poligonoCoordenadas,
            poligonoMetodo: parcela?.poligonoMetodo,
            poligonoFechaCaptura: parcela?.poligonoFechaCaptura,
            poligonoPrecision: parcela?.poligonoPrecision,
            poligonoAreaCalculada: parcela?.poligonoAreaCalculada,
        };
        onSave(data);
    };

    return (
        <div className="space-y-4">
            <Campo label="Nombre de la parcela" hint='Como la conoces: "El Mirador", "Lote de abajo"…'>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={selectClass} autoFocus />
            </Campo>
            <Campo label="Área">
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Ej: 1.5"
                        className={cn(selectClass, 'pr-28')}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#5f705f] bg-[#5f705f]/10 px-2.5 py-1 rounded-lg">hectáreas</span>
                </div>
            </Campo>

            <div>
                <Campo label="Variedades sembradas" hint="Toca las variedades que tengas en esta parcela:">
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

                    {/* Variedades añadidas que no están en la lista común */}
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

                    {/* Botón o input para otra variedad */}
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
                                    className={cn(selectClass, 'h-12 text-sm flex-1')}
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
                </Campo>
            </div>

            {/* Ubicación GPS */}
            <div className="rounded-2xl border-2 border-gray-200 p-4 space-y-3 bg-white">
                <p className="text-[12px] font-black uppercase tracking-wide text-gray-400">Ubicación de la parcela</p>
                {ubic ? (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                        <p className="text-[13px] font-black text-emerald-800 flex items-center gap-1.5">
                            <Check size={15} /> Ubicación guardada
                        </p>
                        <p className="text-[13px] text-emerald-700 mt-0.5">
                            {ubic.lat}, {ubic.lng}
                            {ubic.precisionMetros > 0 && ` · ±${ubic.precisionMetros} m`}
                        </p>
                    </div>
                ) : parcela?.coordenadaCentral ? (
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                        <p className="text-[13px] font-bold text-gray-600">{parcela.coordenadaCentral}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5">Vuelve a capturar para actualizarla.</p>
                    </div>
                ) : (
                    <p className="text-[13px] text-gray-500">
                        Párate en el centro de la parcela y toca el botón. Funciona sin señal de internet.
                    </p>
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
                    onClick={geo.capturar}
                    disabled={geo.capturando}
                    className="pr-tap w-full rounded-xl bg-[#5f705f] text-white font-black text-[15px] gap-2"
                >
                    {geo.capturando ? (
                        <>
                            <Loader2 className="animate-spin" size={18} /> Buscando…
                        </>
                    ) : (
                        <>
                            <Navigation size={18} /> {ubic ? 'Capturar de nuevo' : 'Capturar mi ubicación'}
                        </>
                    )}
                </button>
            </div>

            {/* Más datos opcionales */}
            <button
                onClick={() => setMasDatos((v) => !v)}
                className="w-full flex items-center justify-between text-[14px] font-black text-[#5f705f]"
            >
                Más datos de la parcela (opcional)
                <ChevronDown size={18} className={cn('transition-transform', masDatos && 'rotate-180')} />
            </button>
            <AnimatePresence>
                {masDatos && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <Campo label="Nº de árboles">
                                <input type="number" inputMode="numeric" value={arboles} onChange={(e) => setArboles(e.target.value)} className={selectClass} />
                            </Campo>
                            <Campo label="Edad del cultivo">
                                <div className="relative">
                                    <input type="number" inputMode="numeric" value={edad} onChange={(e) => setEdad(e.target.value)} className={selectClass} />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-black text-gray-300">años</span>
                                </div>
                            </Campo>
                        </div>
                        <Campo label="Altitud">
                            <div className="relative">
                                <input type="number" inputMode="numeric" value={altitud} onChange={(e) => setAltitud(e.target.value)} placeholder="Ej: 1800" className={selectClass} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300">msnm</span>
                            </div>
                        </Campo>
                        <Campo label="Sombrío">
                            <div className="grid grid-cols-3 gap-2">
                                {SOMBRIOS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSombrio(sombrio === s ? '' : s!)}
                                        className={cn(
                                            'h-12 rounded-xl font-bold text-[13px]',
                                            sombrio === s ? 'bg-[#5f705f] text-white' : 'bg-gray-100 text-gray-500'
                                        )}
                                    >
                                        <Trees size={14} className="inline mr-1" />
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </Campo>
                        <Campo label="Fuente de agua">
                            <select value={fuente} onChange={(e) => setFuente(e.target.value as any)} className={selectClass}>
                                <option value="">Elige…</option>
                                {FUENTES.map((f) => (
                                    <option key={f}>{f}</option>
                                ))}
                            </select>
                        </Campo>
                    </motion.div>
                )}
            </AnimatePresence>

            <button onClick={submit} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg gap-2">
                <Check size={20} /> Guardar parcela
            </button>
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="pr-tap w-full rounded-2xl bg-white border border-rose-100 text-rose-600 font-bold text-[15px] gap-2"
                >
                    <Trash2 size={18} /> Eliminar parcela
                </button>
            )}
        </div>
    );
}

/* ───────── Formulario EUDR (dentro del acordeón) ───────── */
function EudrForm({ finca, onSave }: { finca: Finca; onSave: (d: Partial<Finca>) => void }) {
    const [cedula, setCedula] = useState(finca.cedulaCafetera || '');
    const [tenencia, setTenencia] = useState(finca.tipoTenencia || 'Propiedad Titulada');
    const [etnica, setEtnica] = useState(finca.esComunidadEtnica);
    const [doc, setDoc] = useState(finca.docTenenciaNombre || '');

    return (
        <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
            <Campo label="Cédula cafetera">
                <input value={cedula} onChange={(e) => setCedula(e.target.value)} className={selectClass} />
            </Campo>
            <Campo label="Tipo de tenencia">
                <select value={tenencia} onChange={(e) => setTenencia(e.target.value)} className={selectClass}>
                    <option>Propiedad Titulada</option>
                    <option>Contrato de arriendo</option>
                    <option>Posesión</option>
                    <option>Tierra colectiva</option>
                </select>
            </Campo>
            <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700 text-[15px] pr-3">¿Tierra de comunidad étnica o indígena?</span>
                <div className="flex gap-2 shrink-0">
                    {[
                        { k: false, l: 'No' },
                        { k: true, l: 'Sí' },
                    ].map((o) => (
                        <button
                            key={o.l}
                            onClick={() => setEtnica(o.k)}
                            className={cn(
                                'h-10 w-14 rounded-xl font-black text-[14px]',
                                etnica === o.k ? 'bg-[#5f705f] text-white' : 'bg-gray-100 text-gray-400'
                            )}
                        >
                            {o.l}
                        </button>
                    ))}
                </div>
            </div>
            <button
                onClick={() => {
                    setDoc('documento_tenencia.pdf');
                    toast.info('Aquí abrirías la cámara o los archivos del celular');
                }}
                className="w-full flex items-center gap-3 rounded-2xl border-2 border-dashed border-[#5f705f]/25 p-4 text-left"
            >
                <FileText size={20} className="text-[#5f705f] shrink-0" />
                <span className="text-[13px] font-bold text-gray-600">
                    {doc || 'Subir escritura, carta-venta o acta de la JAC'}
                </span>
            </button>
            <button
                onClick={() =>
                    onSave({
                        cedulaCafetera: cedula,
                        tipoTenencia: tenencia,
                        esComunidadEtnica: etnica,
                        docTenenciaNombre: doc || undefined,
                    })
                }
                className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black gap-2"
            >
                <Check size={18} /> Guardar datos de exportación
            </button>
        </div>
    );
}
