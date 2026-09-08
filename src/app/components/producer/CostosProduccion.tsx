import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
    PiggyBank,
    Plus,
    Minus,
    ArrowUpRight,
    ArrowDownRight,
    Coffee,
    Tractor,
    Leaf,
    Truck,
    Wrench,
    Wallet,
    Calendar,
    X,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import { getLotes } from '../../../services/lotesService';

// --- Tipos Simples ---
type TipoMovimiento = 'ingreso' | 'gasto';

interface Movimiento {
    id: string;
    tipo: TipoMovimiento;
    categoria: string;
    monto: number;
    fecha: string;
    nota: string;
    icono: React.ElementType;
    loteAsociado?: string;
}

// --- Categorías Amigables ---
const CATEGORIAS_GASTO = [
    { id: 'mano_obra', label: 'Jornales y Recolección', Icon: Tractor, color: 'bg-orange-100 text-orange-700' },
    { id: 'insumos', label: 'Abonos y Venenos', Icon: Leaf, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'transporte', label: 'Fletes y Transporte', Icon: Truck, color: 'bg-blue-100 text-blue-700' },
    { id: 'herramientas', label: 'Herramientas o Arreglos', Icon: Wrench, color: 'bg-purple-100 text-purple-700' },
    { id: 'otros_gastos', label: 'Otros Gastos', Icon: Wallet, color: 'bg-gray-100 text-gray-700' },
];

const CATEGORIAS_INGRESO = [
    { id: 'pergamino', label: 'Venta Café Pergamino', Icon: Coffee, color: 'bg-[#bb8d3b]/20 text-[#bb8d3b]' },
    { id: 'cereza', label: 'Venta Café Cereza', Icon: Coffee, color: 'bg-red-100 text-red-700' },
    { id: 'pasilla', label: 'Venta de Pasilla', Icon: Coffee, color: 'bg-stone-200 text-stone-700' },
    { id: 'otros_ingresos', label: 'Otros Ingresos', Icon: Wallet, color: 'bg-emerald-100 text-emerald-700' },
];

export function CostosProduccion() {
    const { user } = useAuth();
    // --- Estado Principal (La Realidad) ---
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

    const [lotesActivos, setLotesActivos] = useState<{ id: string; nombre: string }[]>([]);

    useEffect(() => {
        if (!user) return;
        
        // Fetch lotes from Supabase (filtered by productor_id for AGRICULTOR)
        getLotes().then(fetched => {
            const mapped = fetched.map(l => ({
                id: l.id,
                nombre: `${l.id} (${l.finca})`
            }));
            
            if (mapped.length > 0) {
                setLotesActivos(mapped);
            } else if (user.email === 'maria@finca.co') {
                setLotesActivos([
                    { id: 'MG-ESP-042', nombre: 'MG-ESP-042 (La Esperanza)' },
                    { id: 'MG-ESP-043', nombre: 'MG-ESP-043 (La Esperanza)' },
                    { id: 'MG-SH-101', nombre: 'MG-SH-101 (Santa Helena)' }
                ]);
            } else {
                setLotesActivos([]);
            }
        }).catch(err => {
            console.error('Error fetching lotes in CostosProduccion:', err);
        });

        const key = `movimientos_produccion_${user.email}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Map icons from category type
                const withIcons = parsed.map((m: any) => {
                    let iconComponent = Coffee;
                    if (m.categoria === 'Jornales y Recolección') iconComponent = Tractor;
                    else if (m.categoria === 'Abonos y Venenos') iconComponent = Leaf;
                    else if (m.categoria === 'Fletes y Transporte') iconComponent = Truck;
                    else if (m.categoria === 'Herramientas o Arreglos') iconComponent = Wrench;
                    else if (m.categoria === 'Otros Gastos' || m.categoria === 'Otros Ingresos') iconComponent = Wallet;
                    return { ...m, icono: iconComponent };
                });
                setMovimientos(withIcons);
            } catch (e) {}
        } else if (user.email === 'maria@finca.co') {
            const mock = [
                { id: '1', tipo: 'ingreso' as const, categoria: 'Venta Café Pergamino', monto: 2500000, fecha: new Date(Date.now() - 86400000 * 2).toISOString(), nota: 'Venta a la cooperativa', icono: Coffee, loteAsociado: 'MG-ESP-042' },
                { id: '2', tipo: 'gasto' as const, categoria: 'Jornales y Recolección', monto: 450000, fecha: new Date(Date.now() - 86400000 * 5).toISOString(), nota: 'Pago de semana', icono: Tractor, loteAsociado: 'MG-ESP-042' },
                { id: '3', tipo: 'gasto' as const, categoria: 'Abonos y Venenos', monto: 800000, fecha: new Date(Date.now() - 86400000 * 10).toISOString(), nota: '3 bultos de abono', icono: Leaf },
            ];
            localStorage.setItem(key, JSON.stringify(mock));
            setMovimientos(mock);
        } else {
            setMovimientos([]);
        }
    }, [user]);

    // --- Estados para Formularios ---
    const [modalActivo, setModalActivo] = useState<TipoMovimiento | null>(null);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<any>(null);
    const [montoIngresado, setMontoIngresado] = useState('');
    const [notaIngresada, setNotaIngresada] = useState('');
    const [loteSeleccionado, setLoteSeleccionado] = useState<string>('general');

    // --- Cálculos ---
    const totalIngresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0);
    const totalGastos = movimientos.filter(m => m.tipo === 'gasto').reduce((sum, m) => sum + m.monto, 0);
    const saldoLibre = totalIngresos - totalGastos;

    const formatoDinero = (valor: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(valor);
    };

    const formatearFechaAmigable = (isoString: string) => {
        const fecha = new Date(isoString);
        return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(fecha);
    };

    // --- Acciones ---
    const abrirModal = (tipo: TipoMovimiento) => {
        setModalActivo(tipo);
        setCategoriaSeleccionada(null);
        setMontoIngresado('');
        setNotaIngresada('');
        setLoteSeleccionado('general');
    };

    const cerrarModal = () => {
        setModalActivo(null);
    };

    const guardarMovimiento = () => {
        if (!categoriaSeleccionada || !montoIngresado) {
            toast.error('Por favor ingresa la plata y selecciona en qué fue.');
            return;
        }

        const nuevoMovimiento: Movimiento = {
            id: Date.now().toString(),
            tipo: modalActivo!,
            categoria: categoriaSeleccionada.label,
            monto: Number(montoIngresado),
            fecha: new Date().toISOString(),
            nota: notaIngresada || 'Sin detalle',
            icono: categoriaSeleccionada.Icon,
            loteAsociado: loteSeleccionado === 'general' ? undefined : loteSeleccionado
        };

        const updated = [nuevoMovimiento, ...movimientos];
        setMovimientos(updated);
        if (user) {
            // strip react elements before stringifying
            const rawToSave = updated.map(({ icono, ...rest }) => rest);
            localStorage.setItem(`movimientos_produccion_${user.email}`, JSON.stringify(rawToSave));
        }
        toast.success(modalActivo === 'ingreso' ? '¡Venta registrada con éxito!' : 'Gasto anotado correctamente.');
        cerrarModal();
    };

    const categoriasMostrar = modalActivo === 'ingreso' ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            
            {/* --- CABECERA --- */}
            <div className="text-center space-y-2 mt-4 mb-8">
                <h1 className="text-3xl font-black text-[#5f705f]">Mis Cuentas Claras</h1>
                <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Anota lo que vendes y lo que gastas. Conocer la realidad es el primer paso para ganar más.
                </p>
            </div>

            {/* --- LOS 3 NÚMEROS GRANDES --- */}
            <div className="bg-[#5f705f] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] opacity-10">
                    <PiggyBank className="h-48 w-48 text-white" />
                </div>
                
                <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">
                    Plata Libre (Ganancia)
                </p>
                <h2 className="text-5xl font-black mb-6 relative z-10 tracking-tight">
                    {formatoDinero(saldoLibre)}
                </h2>

                <div className="grid grid-cols-2 gap-4 relative z-10 border-t border-white/20 pt-6">
                    <div>
                        <p className="text-white/60 text-xs font-bold uppercase flex items-center gap-1 mb-1">
                            <ArrowUpRight size={14} className="text-emerald-300" /> Ha Entrado
                        </p>
                        <p className="text-xl font-bold">{formatoDinero(totalIngresos)}</p>
                    </div>
                    <div>
                        <p className="text-white/60 text-xs font-bold uppercase flex items-center gap-1 mb-1">
                            <ArrowDownRight size={14} className="text-red-300" /> Ha Salido
                        </p>
                        <p className="text-xl font-bold">{formatoDinero(totalGastos)}</p>
                    </div>
                </div>
            </div>

            {/* --- LOS 2 BOTONES DE ACCIÓN --- */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                    onClick={() => abrirModal('ingreso')}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-emerald-200/50"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Plus size={24} className="text-emerald-600" />
                    </div>
                    <span className="font-black text-sm text-center leading-tight">Anotar una<br/>Venta</span>
                </button>
                <button 
                    onClick={() => abrirModal('gasto')}
                    className="bg-red-50 hover:bg-red-100 text-red-700 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-red-200/50"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Minus size={24} className="text-red-600" />
                    </div>
                    <span className="font-black text-sm text-center leading-tight">Anotar un<br/>Gasto</span>
                </button>
            </div>

            {/* --- HISTORIAL SIMPLE --- */}
            <div className="mt-8">
                <h3 className="text-gray-900 font-black text-lg mb-4 flex items-center gap-2">
                    <Calendar className="text-gray-400" size={20} /> Historial de Movimientos
                </h3>
                
                {movimientos.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                        <PiggyBank size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">Aún no has anotado cuentas.</p>
                        <p className="text-gray-400 text-sm">Todo lo que anotes aparecerá aquí.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {movimientos.map((mov) => {
                            const esIngreso = mov.tipo === 'ingreso';
                            return (
                                <div key={mov.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100">
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", esIngreso ? 'bg-emerald-50' : 'bg-red-50')}>
                                        <mov.icono size={20} className={esIngreso ? 'text-emerald-600' : 'text-red-500'} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 font-bold text-sm truncate">{mov.categoria}</p>
                                        <p className="text-gray-500 text-xs truncate">
                                            {mov.nota} {mov.loteAsociado ? `• Lote: ${mov.loteAsociado}` : ''} • {formatearFechaAmigable(mov.fecha)}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className={cn("font-black text-base", esIngreso ? 'text-emerald-600' : 'text-gray-900')}>
                                            {esIngreso ? '+' : '-'}{formatoDinero(mov.monto)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* --- MODAL DE REGISTRO (OVERLAY) --- */}
            <AnimatePresence>
                {modalActivo && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
                    >
                        <motion.div 
                            initial={{ y: '100%' }} 
                            animate={{ y: 0 }} 
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-[#FDFCFB] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className={cn("px-6 py-5 flex items-center justify-between text-white", modalActivo === 'ingreso' ? 'bg-emerald-600' : 'bg-red-600')}>
                                <h2 className="text-xl font-black flex items-center gap-2">
                                    {modalActivo === 'ingreso' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                                    {modalActivo === 'ingreso' ? 'Anotar una Venta' : 'Anotar un Gasto'}
                                </h2>
                                <button onClick={cerrarModal} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-6">
                                {/* Monto */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block text-center">¿Cuánta plata fue?</label>
                                    <div className="relative max-w-xs mx-auto">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">$</span>
                                        <Input 
                                            type="number" 
                                            value={montoIngresado}
                                            onChange={(e) => setMontoIngresado(e.target.value)}
                                            className="w-full pl-10 pr-4 h-16 text-3xl font-black text-center border-2 border-gray-200 rounded-2xl bg-white focus:border-[#5f705f] focus:ring-0 shadow-sm"
                                            placeholder="0"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Categorías */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">¿En qué fue?</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categoriasMostrar.map((cat) => {
                                            const isSelected = categoriaSeleccionada?.id === cat.id;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setCategoriaSeleccionada(cat)}
                                                    className={cn(
                                                        "p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer",
                                                        isSelected 
                                                            ? (modalActivo === 'ingreso' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-red-500 bg-red-50 ring-2 ring-red-200')
                                                            : "border-gray-100 bg-white hover:border-gray-200"
                                                    )}
                                                >
                                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isSelected ? cat.color : 'bg-gray-50 text-gray-400')}>
                                                        <cat.Icon size={20} />
                                                    </div>
                                                    <span className={cn("text-xs font-bold leading-tight", isSelected ? 'text-gray-900' : 'text-gray-500')}>
                                                        {cat.label}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Selección de Lote */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Lote Asociado (Opcional)</label>
                                    <Select value={loteSeleccionado} onValueChange={setLoteSeleccionado}>
                                        <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl font-bold text-gray-700">
                                            <SelectValue placeholder="Selecciona un lote..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100">
                                            <SelectItem value="general" className="font-bold">Gasto/Ingreso General (Finca)</SelectItem>
                                            {lotesActivos.map((lote) => (
                                                <SelectItem key={lote.id} value={lote.id}>{lote.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Nota */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Detalle corto (Opcional)</label>
                                    <Input 
                                        value={notaIngresada}
                                        onChange={(e) => setNotaIngresada(e.target.value)}
                                        placeholder="Ej: Pago a don José, Venta de pasilla..."
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl"
                                    />
                                </div>

                                {/* Botón Guardar */}
                                <button 
                                    onClick={guardarMovimiento}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95",
                                        modalActivo === 'ingreso' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                                    )}
                                >
                                    <CheckCircle2 size={24} /> Guardar Registro
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
