import { useEffect, useState } from 'react';
import { Check, Trash2, Plus } from 'lucide-react';
import { cn } from '../../../components/ui/utils';
import { BottomSheet } from '../BottomSheet';
import { iconoDe, ICONOS_ELEGIBLES } from '../../data/iconosFinanzas';
import { formatoNumero } from '../../utils/formato';
import type { CategoriaFinanciera, Libro, MovimientoFinanciero, TipoMovimiento } from '../../../../types/finanzas';
import {
    MensajeErrorCampo,
    vibrarError,
    describirMontoEnPalabras,
} from '../../../utils/usabilidad';

interface Props {
    open: boolean;
    onClose: () => void;
    libro: Libro;
    tipo: TipoMovimiento;
    /** Si viene, es edición. */
    movimiento?: MovimientoFinanciero | null;
    categorias: CategoriaFinanciera[];
    cosechas: { codigo: string }[];
    parcelas?: string[];
    onGuardar: (data: {
        categoria: CategoriaFinanciera;
        monto: number;
        nota: string;
        fechaISO: string;
        cosechaCodigo?: string;
        asociacionTipo?: 'finca' | 'parcela' | 'cosecha';
        asociacionValor?: string;
    }) => void;
    onCrearCategoria: (label: string, icono: string) => CategoriaFinanciera | Promise<CategoriaFinanciera>;
    onEliminar?: () => void;
}

const inputBase =
    'w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold text-gray-800 outline-none focus:border-[#5f705f] transition-all';

export function HojaMovimiento({
    open,
    onClose,
    libro,
    tipo,
    movimiento,
    categorias,
    cosechas,
    parcelas = [],
    onGuardar,
    onCrearCategoria,
    onEliminar,
}: Props) {
    const esEdicion = !!movimiento;
    const esIngreso = tipo === 'ingreso';

    const [monto, setMonto] = useState('');
    const [catId, setCatId] = useState('');
    const [nota, setNota] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [asociacionTipo, setAsociacionTipo] = useState<'finca' | 'parcela' | 'cosecha'>('finca');
    const [asociacionValor, setAsociacionValor] = useState('');
    const [creando, setCreando] = useState(false);
    const [nuevaCat, setNuevaCat] = useState('');
    const [nuevoIcono, setNuevoIcono] = useState('otro');

    const [errores, setErrores] = useState<{ monto?: string; cat?: string }>({});
    const [shakeKey, setShakeKey] = useState(0);
    const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

    useEffect(() => {
        if (!open) return;
        setMonto(movimiento ? String(movimiento.monto) : '');
        setCatId(movimiento?.categoriaId || '');
        setNota(movimiento?.nota || '');
        setFecha((movimiento?.fechaISO || new Date().toISOString()).split('T')[0]);
        setErrores({});
        setConfirmandoBorrado(false);

        if (movimiento?.asociacionTipo) {
            setAsociacionTipo(movimiento.asociacionTipo);
            setAsociacionValor(movimiento.asociacionValor || '');
        } else if (movimiento?.cosechaCodigo) {
            setAsociacionTipo('cosecha');
            setAsociacionValor(movimiento.cosechaCodigo);
        } else {
            setAsociacionTipo('finca');
            setAsociacionValor('');
        }

        setCreando(false);
        setNuevaCat('');
        setNuevoIcono('otro');
    }, [open, movimiento]);

    const opciones = categorias.filter((c) => c.libro === libro && c.tipo === tipo);

    const guardar = async () => {
        const n = Number(monto);
        const err: { monto?: string; cat?: string } = {};

        if (!n || n <= 0) {
            err.monto = 'Escribe aquí cuánta plata fue.';
        }

        let cat = opciones.find((c) => c.id === catId);
        // Si estaba escribiendo una nueva categoría y olvidó darle a "Crear categoría", la creamos automáticamente
        if (!cat && creando && nuevaCat.trim()) {
            cat = await onCrearCategoria(nuevaCat.trim(), nuevoIcono);
            setCatId(cat.id);
            setCreando(false);
            setNuevaCat('');
        }
        if (!cat && movimiento) {
            cat = {
                id: movimiento.categoriaId,
                label: movimiento.categoriaLabel,
                icono: movimiento.icono,
                libro,
                tipo,
                esPropia: false,
            };
        }

        if (!cat) {
            err.cat = 'Toca uno de los cuadros de arriba para indicar en qué fue la plata.';
        }

        if (err.monto || err.cat) {
            setErrores(err);
            setShakeKey((k) => k + 1);
            vibrarError();
            return;
        }

        setErrores({});
        const cosechaCod = asociacionTipo === 'cosecha' && asociacionValor ? asociacionValor : undefined;

        onGuardar({
            categoria: cat!,
            monto: n,
            nota: nota.trim(),
            fechaISO: new Date(fecha + 'T12:00:00').toISOString(),
            cosechaCodigo: cosechaCod,
            asociacionTipo,
            asociacionValor: asociacionTipo !== 'finca' ? asociacionValor : undefined,
        });
    };

    const crearCategoria = async () => {
        const label = nuevaCat.trim();
        if (!label) {
            vibrarError();
            return;
        }
        const cat = await onCrearCategoria(label, nuevoIcono);
        setCatId(cat.id);
        setErrores((p) => ({ ...p, cat: undefined }));
        setCreando(false);
        setNuevaCat('');
    };

    const titulo = esEdicion
        ? 'Editar movimiento'
        : esIngreso
        ? libro === 'cafe'
            ? 'Anotar venta de café'
            : 'Anotar ingreso de la casa'
        : libro === 'cafe'
        ? 'Anotar gasto del café'
        : 'Anotar gasto de la casa';

    const enPalabras = describirMontoEnPalabras(monto);

    return (
        <BottomSheet open={open} onClose={onClose} title={titulo} tono={esIngreso ? 'verde' : 'rojo'}>
            <div className="space-y-5">
                {/* Monto */}
                <div key={`m-${shakeKey}-${!!errores.monto}`} className={cn(errores.monto && 'odisea-shake')}>
                    <p className="text-center text-[13px] font-black uppercase tracking-wide text-gray-500 mb-2">
                        1. ¿Cuánta plata fue? *
                    </p>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">$</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={monto ? formatoNumero(Number(monto)) : ''}
                            onChange={(e) => {
                                setMonto(e.target.value.replace(/\D/g, ''));
                                if (errores.monto) setErrores((p) => ({ ...p, monto: undefined }));
                            }}
                            placeholder="0"
                            autoFocus={!esEdicion}
                            className={cn(
                                'w-full h-20 rounded-2xl bg-white border-2 border-gray-200 text-center text-4xl font-black outline-none focus:border-[#5f705f] transition-all',
                                esIngreso ? 'text-emerald-600' : 'text-rose-600',
                                errores.monto && 'odisea-field-error',
                                !errores.monto && Number(monto) > 0 && 'odisea-field-ok'
                            )}
                        />
                    </div>
                    {enPalabras && !errores.monto && (
                        <p className="mt-1.5 text-center text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                            ✓ {enPalabras}
                        </p>
                    )}
                    <MensajeErrorCampo mensaje={errores.monto} />
                </div>

                {/* Categorías */}
                <div key={`c-${shakeKey}-${!!errores.cat}`} className={cn(errores.cat && 'odisea-shake')}>
                    <p className="text-[13px] font-black uppercase tracking-wide text-gray-500 mb-2">2. ¿En qué fue? (Toca una opción) *</p>
                    <div
                        className={cn(
                            'grid grid-cols-2 gap-2 p-1.5 rounded-2xl transition-all',
                            errores.cat && 'bg-red-50 border-2 border-red-300'
                        )}
                    >
                        {opciones.map((c) => {
                            const Icon = iconoDe(c.icono);
                            const activa = catId === c.id;
                            return (
                                <button
                                    type="button"
                                    key={c.id}
                                    onClick={() => {
                                        setCatId(c.id);
                                        if (errores.cat) setErrores((p) => ({ ...p, cat: undefined }));
                                    }}
                                    className={cn(
                                        'flex items-center gap-2 rounded-2xl border-2 p-3 text-left transition-all cursor-pointer',
                                        activa ? 'border-[#5f705f] bg-[#5f705f]/10 ring-2 ring-[#5f705f]/20' : 'border-gray-200 bg-white'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'h-9 w-9 shrink-0 rounded-xl flex items-center justify-center',
                                            activa ? 'bg-[#5f705f] text-white' : 'bg-gray-100 text-gray-400'
                                        )}
                                    >
                                        <Icon size={17} />
                                    </span>
                                    <span className={cn('text-[13px] font-bold leading-tight', activa ? 'text-gray-900' : 'text-gray-600')}>
                                        {c.label}
                                    </span>
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => setCreando((v) => !v)}
                            className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-3 text-gray-500 cursor-pointer bg-white"
                        >
                            <span className="h-9 w-9 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Plus size={17} />
                            </span>
                            <span className="text-[13px] font-bold">Otra categoría</span>
                        </button>
                    </div>
                    <MensajeErrorCampo mensaje={errores.cat} />

                    {creando && (
                        <div className="mt-3 rounded-2xl border-2 border-[#5f705f]/20 p-3 space-y-3 bg-white">
                            <input
                                value={nuevaCat}
                                onChange={(e) => setNuevaCat(e.target.value)}
                                placeholder="Escribe el nombre de la categoría"
                                className={inputBase}
                                autoFocus
                            />
                            <div className="flex flex-wrap gap-1.5">
                                {ICONOS_ELEGIBLES.map((k) => {
                                    const Icon = iconoDe(k);
                                    return (
                                        <button
                                            type="button"
                                            key={k}
                                            onClick={() => setNuevoIcono(k)}
                                            className={cn(
                                                'h-9 w-9 rounded-xl flex items-center justify-center cursor-pointer',
                                                nuevoIcono === k ? 'bg-[#5f705f] text-white' : 'bg-gray-100 text-gray-400'
                                            )}
                                        >
                                            <Icon size={16} />
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                onClick={crearCategoria}
                                className="pr-tap w-full rounded-xl bg-[#5f705f] text-white font-black text-[14px] cursor-pointer"
                            >
                                Crear categoría
                            </button>
                        </div>
                    )}
                </div>

                {/* Asignación del movimiento: Finca total, Por Parcela o Por Cosecha */}
                {libro === 'cafe' && (
                    <div className="space-y-2">
                        <span className="block text-[12px] font-black uppercase tracking-wide text-gray-400">
                            ¿A qué corresponde este movimiento?
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setAsociacionTipo('finca');
                                    setAsociacionValor('');
                                }}
                                className={cn(
                                    'py-2.5 px-2 rounded-xl text-[13px] font-black border-2 transition-all text-center cursor-pointer',
                                    asociacionTipo === 'finca'
                                        ? 'bg-[#5f705f] text-white border-[#5f705f] shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                )}
                            >
                                Toda la finca
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAsociacionTipo('parcela');
                                    if (!asociacionValor && parcelas.length > 0) {
                                        setAsociacionValor(parcelas[0]);
                                    }
                                }}
                                className={cn(
                                    'py-2.5 px-2 rounded-xl text-[13px] font-black border-2 transition-all text-center cursor-pointer',
                                    asociacionTipo === 'parcela'
                                        ? 'bg-[#5f705f] text-white border-[#5f705f] shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                )}
                            >
                                Por parcela
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAsociacionTipo('cosecha');
                                    if (!asociacionValor && cosechas.length > 0) {
                                        setAsociacionValor(cosechas[0].codigo);
                                    }
                                }}
                                className={cn(
                                    'py-2.5 px-2 rounded-xl text-[13px] font-black border-2 transition-all text-center cursor-pointer',
                                    asociacionTipo === 'cosecha'
                                        ? 'bg-[#5f705f] text-white border-[#5f705f] shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                )}
                            >
                                Por cosecha
                            </button>
                        </div>

                        {asociacionTipo === 'parcela' && (
                            <div className="pt-1 animate-in fade-in duration-200">
                                <label className="block">
                                    <span className="block text-[11px] font-black uppercase tracking-wide text-gray-400 mb-1">
                                        Selecciona la parcela
                                    </span>
                                    {parcelas.length > 0 ? (
                                        <select
                                            value={asociacionValor}
                                            onChange={(e) => setAsociacionValor(e.target.value)}
                                            className={inputBase}
                                        >
                                            <option value="">Selecciona una parcela...</option>
                                            {parcelas.map((p) => (
                                                <option key={p} value={p}>
                                                    Parcela: {p}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-xl text-[13px] text-gray-500 font-medium border border-gray-200">
                                            No tienes parcelas registradas aún. Se asignará a la finca general.
                                        </div>
                                    )}
                                </label>
                            </div>
                        )}

                        {asociacionTipo === 'cosecha' && (
                            <div className="pt-1 animate-in fade-in duration-200">
                                <label className="block">
                                    <span className="block text-[11px] font-black uppercase tracking-wide text-gray-400 mb-1">
                                        Selecciona la cosecha o lote
                                    </span>
                                    {cosechas.length > 0 ? (
                                        <select
                                            value={asociacionValor}
                                            onChange={(e) => setAsociacionValor(e.target.value)}
                                            className={inputBase}
                                        >
                                            <option value="">Selecciona una cosecha...</option>
                                            {cosechas.map((c) => (
                                                <option key={c.codigo} value={c.codigo}>
                                                    Lote / Cosecha {c.codigo}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-xl text-[13px] text-gray-500 font-medium border border-gray-200">
                                            No tienes cosechas registradas aún.
                                        </div>
                                    )}
                                </label>
                            </div>
                        )}
                    </div>
                )}

                {/* Nota */}
                <label className="block">
                    <span className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1.5">Nota (opcional)</span>
                    <input
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        placeholder="Ej: pago a don José"
                        className={inputBase}
                    />
                </label>

                {/* Fecha */}
                <label className="block">
                    <span className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1.5">Fecha</span>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputBase} />
                </label>

                <button onClick={guardar} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg gap-2 cursor-pointer">
                    <Check size={20} /> {esEdicion ? 'Guardar cambios' : 'Guardar'}
                </button>
                {esEdicion && onEliminar && (
                    !confirmandoBorrado ? (
                        <button
                            type="button"
                            onClick={() => setConfirmandoBorrado(true)}
                            className="pr-tap w-full rounded-2xl bg-white border border-rose-200 text-rose-600 font-bold text-[15px] gap-2 cursor-pointer"
                        >
                            <Trash2 size={18} /> Eliminar movimiento
                        </button>
                    ) : (
                        <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-3 space-y-2 animate-fade-in">
                            <p className="text-center text-xs font-extrabold text-red-800">
                                ¿Seguro que quieres borrar este movimiento?
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmandoBorrado(false)}
                                    className="h-11 rounded-xl bg-white border border-gray-300 font-bold text-xs text-gray-700 cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={onEliminar}
                                    className="h-11 rounded-xl bg-red-600 text-white font-extrabold text-xs cursor-pointer"
                                >
                                    Sí, borrarlo
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </BottomSheet>
    );
}
