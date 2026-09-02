import { useEffect, useState } from 'react';
import { Check, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../../components/ui/utils';
import { BottomSheet } from '../BottomSheet';
import { iconoDe, ICONOS_ELEGIBLES } from '../../data/iconosFinanzas';
import { formatoNumero } from '../../utils/formato';
import type { CategoriaFinanciera, Libro, MovimientoFinanciero, TipoMovimiento } from '../../../../types/finanzas';

interface Props {
    open: boolean;
    onClose: () => void;
    libro: Libro;
    tipo: TipoMovimiento;
    /** Si viene, es edición. */
    movimiento?: MovimientoFinanciero | null;
    categorias: CategoriaFinanciera[];
    cosechas: { codigo: string }[];
    onGuardar: (data: {
        categoria: CategoriaFinanciera;
        monto: number;
        nota: string;
        fechaISO: string;
        cosechaCodigo?: string;
    }) => void;
    onCrearCategoria: (label: string, icono: string) => CategoriaFinanciera | Promise<CategoriaFinanciera>;
    onEliminar?: () => void;
}

const inputBase =
    'w-full h-14 rounded-2xl bg-white border-2 border-gray-200 px-4 font-bold text-gray-800 outline-none focus:border-[#5f705f]';

export function HojaMovimiento({
    open,
    onClose,
    libro,
    tipo,
    movimiento,
    categorias,
    cosechas,
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
    const [cosecha, setCosecha] = useState('');
    const [creando, setCreando] = useState(false);
    const [nuevaCat, setNuevaCat] = useState('');
    const [nuevoIcono, setNuevoIcono] = useState('otro');

    useEffect(() => {
        if (!open) return;
        setMonto(movimiento ? String(movimiento.monto) : '');
        setCatId(movimiento?.categoriaId || '');
        setNota(movimiento?.nota || '');
        setFecha((movimiento?.fechaISO || new Date().toISOString()).split('T')[0]);
        setCosecha(movimiento?.cosechaCodigo || '');
        setCreando(false);
        setNuevaCat('');
        setNuevoIcono('otro');
    }, [open, movimiento]);

    const opciones = categorias.filter((c) => c.libro === libro && c.tipo === tipo);

    const guardar = () => {
        const n = Number(monto);
        if (!n || n <= 0) return toast.error('Escribe cuánta plata fue');
        const cat = opciones.find((c) => c.id === catId);
        if (!cat) return toast.error('Elige en qué fue');
        onGuardar({
            categoria: cat,
            monto: n,
            nota: nota.trim(),
            fechaISO: new Date(fecha + 'T12:00:00').toISOString(),
            cosechaCodigo: libro === 'cafe' && cosecha ? cosecha : undefined,
        });
    };

    const crearCategoria = async () => {
        const label = nuevaCat.trim();
        if (!label) return;
        const cat = await onCrearCategoria(label, nuevoIcono);
        setCatId(cat.id);
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

    return (
        <BottomSheet open={open} onClose={onClose} title={titulo} tono={esIngreso ? 'verde' : 'rojo'}>
            <div className="space-y-5">
                {/* Monto */}
                <div>
                    <p className="text-center text-[12px] font-black uppercase tracking-wide text-gray-400 mb-2">
                        ¿Cuánta plata fue?
                    </p>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">$</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={monto ? formatoNumero(Number(monto)) : ''}
                            onChange={(e) => setMonto(e.target.value.replace(/\D/g, ''))}
                            placeholder="0"
                            autoFocus={!esEdicion}
                            className={cn(
                                'w-full h-20 rounded-2xl bg-white border-2 border-gray-200 text-center text-4xl font-black outline-none focus:border-[#5f705f]',
                                esIngreso ? 'text-emerald-600' : 'text-rose-600'
                            )}
                        />
                    </div>
                </div>

                {/* Categorías */}
                <div>
                    <p className="text-[12px] font-black uppercase tracking-wide text-gray-400 mb-2">¿En qué fue?</p>
                    <div className="grid grid-cols-2 gap-2">
                        {opciones.map((c) => {
                            const Icon = iconoDe(c.icono);
                            const activa = catId === c.id;
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => setCatId(c.id)}
                                    className={cn(
                                        'flex items-center gap-2 rounded-2xl border-2 p-3 text-left transition-all',
                                        activa ? 'border-[#5f705f] bg-[#5f705f]/5' : 'border-gray-200 bg-white'
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
                                    <span className={cn('text-[13px] font-bold leading-tight', activa ? 'text-gray-900' : 'text-gray-500')}>
                                        {c.label}
                                    </span>
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCreando((v) => !v)}
                            className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-3 text-gray-400"
                        >
                            <span className="h-9 w-9 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Plus size={17} />
                            </span>
                            <span className="text-[13px] font-bold">Otra categoría</span>
                        </button>
                    </div>

                    {creando && (
                        <div className="mt-3 rounded-2xl border-2 border-[#5f705f]/20 p-3 space-y-3">
                            <input
                                value={nuevaCat}
                                onChange={(e) => setNuevaCat(e.target.value)}
                                placeholder="Nombre de la categoría"
                                className={inputBase}
                                autoFocus
                            />
                            <div className="flex flex-wrap gap-1.5">
                                {ICONOS_ELEGIBLES.map((k) => {
                                    const Icon = iconoDe(k);
                                    return (
                                        <button
                                            key={k}
                                            onClick={() => setNuevoIcono(k)}
                                            className={cn(
                                                'h-9 w-9 rounded-xl flex items-center justify-center',
                                                nuevoIcono === k ? 'bg-[#5f705f] text-white' : 'bg-gray-100 text-gray-400'
                                            )}
                                        >
                                            <Icon size={16} />
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={crearCategoria}
                                className="pr-tap w-full rounded-xl bg-[#5f705f] text-white font-black text-[14px]"
                            >
                                Crear categoría
                            </button>
                        </div>
                    )}
                </div>

                {/* Cosecha asociada (solo café) */}
                {libro === 'cafe' && cosechas.length > 0 && (
                    <label className="block">
                        <span className="block text-[12px] font-black uppercase tracking-wide text-gray-400 mb-1.5">
                            Cosecha (opcional)
                        </span>
                        <select value={cosecha} onChange={(e) => setCosecha(e.target.value)} className={inputBase}>
                            <option value="">Sin cosecha específica</option>
                            {cosechas.map((c) => (
                                <option key={c.codigo} value={c.codigo}>
                                    {c.codigo}
                                </option>
                            ))}
                        </select>
                    </label>
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

                <button onClick={guardar} className="pr-tap w-full rounded-2xl bg-[#5f705f] text-white font-black text-lg gap-2">
                    <Check size={20} /> {esEdicion ? 'Guardar cambios' : 'Guardar'}
                </button>
                {esEdicion && onEliminar && (
                    <button
                        onClick={onEliminar}
                        className="pr-tap w-full rounded-2xl bg-white border border-rose-100 text-rose-600 font-bold text-[15px] gap-2"
                    >
                        <Trash2 size={18} /> Eliminar
                    </button>
                )}
            </div>
        </BottomSheet>
    );
}
