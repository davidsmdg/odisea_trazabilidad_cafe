import { useState, useMemo, useEffect } from 'react';
import {
    Anchor,
    Plus,
    Minus,
    Calculator,
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { getLotes } from '../../../services/lotesService';

const PUERTOS_DESTINO: Record<string, { eta: string; fleteBasePalletUSD: number }> = {
    hamburgo: { eta: '18 Días', fleteBasePalletUSD: 450 },
    roterdam: { eta: '16 Días', fleteBasePalletUSD: 420 },
    barcelona: { eta: '21 Días', fleteBasePalletUSD: 480 },
};

export function SimuladorLogistico() {
    const [pallet, setPallet] = useState<Record<string, number>>({});
    const [puerto, setPuerto] = useState('roterdam');
    const [incoterm, setIncoterm] = useState<'FOB' | 'DDP'>('DDP');
    const [lotesDisponibles, setLotesDisponibles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getLotes()
            .then((master) => {
                const mapped = master.map(l => ({
                    id: l.id,
                    variedad: l.variedad,
                    origen: l.municipio.split(',')[0],
                    sacosDisponibles: l.id === 'LOT-HUILA-084' ? 7 : (l.id === 'LOT-ANT-112' ? 3 : 5),
                    precioSacoUSD: l.id === 'LOT-HUILA-084' ? 507.50 : (l.id === 'LOT-ANT-112' ? 770.00 : 588.00)
                }));
                setLotesDisponibles(mapped);
                
                const initialPallet: Record<string, number> = {};
                mapped.forEach(l => {
                    initialPallet[l.id] = l.id === 'LOT-HUILA-084' ? 2 : (l.id === 'LOT-ANT-112' ? 1 : 0);
                });
                setPallet(initialPallet);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Error al cargar simulador logístico');
                setIsLoading(false);
            });
    }, []);

    const totalSacos = useMemo(() => {
        return Object.values(pallet).reduce((a, b) => a + b, 0);
    }, [pallet]);

    const costoCaféUSD = useMemo(() => {
        return lotesDisponibles.reduce((sum, lote) => {
            return sum + (pallet[lote.id] || 0) * lote.precioSacoUSD;
        }, 0);
    }, [pallet, lotesDisponibles]);

    const fleteUSD = useMemo(() => {
        // Flete consolidado base por pallet completo o parcial
        const base = PUERTOS_DESTINO[puerto]?.fleteBasePalletUSD || 450;
        // Si eligen DDP agregamos costos fijos aduaneros y entrega local en Europa
        return incoterm === 'DDP' ? base + 350 : base;
    }, [puerto, incoterm]);

    const totalGeneralUSD = costoCaféUSD + (totalSacos > 0 ? fleteUSD : 0);
    const totalGeneralEUR = (totalGeneralUSD * 0.92).toFixed(2);

    const addSaco = (id: string, max: number) => {
        if (totalSacos >= 10) {
            toast.error('Capacidad Máxima del Pallet', {
                description: 'Un pallet consolidado estándar admite un máximo de 10 sacos de 35 kg verde.'
            });
            return;
        }
        const actual = pallet[id] || 0;
        if (actual >= max) return;
        setPallet(prev => ({ ...prev, [id]: actual + 1 }));
    };

    const removeSaco = (id: string) => {
        const actual = pallet[id] || 0;
        if (actual <= 0) return;
        setPallet(prev => ({ ...prev, [id]: actual - 1 }));
    };

    const confirmarConsolidacion = () => {
        if (totalSacos === 0) return;
        toast.success('Simulación Logística Guardada', {
            description: `Se ha generado el presupuesto bajo Incoterm ${incoterm} hacia el puerto seleccionado.`,
            style: { background: '#bb8d3b', color: '#ffffff', border: 'none' }
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-[1200px] mx-auto pb-24 animate-pulse font-sans space-y-10">
                <div className="bg-white rounded-[40px] border border-gray-100 p-12 h-48 flex flex-col justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[1200px] mx-auto pb-24 font-sans space-y-10 text-center py-20 bg-white border border-gray-100 rounded-[40px] p-10">
                <h2 className="text-2xl font-black text-red-900">Algo salió mal</h2>
                <p className="text-red-700/80 font-bold">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-[#5f705f] text-white font-black px-6 py-2 rounded-xl border-none mt-4">Reintentar</Button>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in duration-500 font-sans space-y-10">
            {/* Encabezado */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-50 to-transparent pointer-events-none" />
                <div className="space-y-3 z-10 relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                        <Anchor size={14} className="text-[#bb8d3b]" /> Consolidación Inteligente en Origen
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Simulador Logístico y Pallet Virtual
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider max-w-2xl leading-relaxed">
                        Combine sacos de microlotes de distintos productores aliados en un único envío marítimo consolidado para diluir drásticamente el costo de flete internacional por kilo.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Columna Izquierda: Constructor del Pallet */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <span className="text-xs font-black uppercase tracking-wider text-[#5f705f]">
                                Microlotes Disponibles para Combinar
                            </span>
                            <span className="text-xs font-black text-gray-400">
                                Sacos de 35 kg Verde
                            </span>
                        </div>

                        <div className="space-y-4">
                            {lotesDisponibles.map((lote) => {
                                const cantidad = pallet[lote.id] || 0;
                                return (
                                    <div key={lote.id} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#5f705f] text-white">
                                                {lote.id}
                                            </span>
                                            <h4 className="text-sm font-black text-gray-900">{lote.variedad}</h4>
                                            <p className="text-[11px] font-bold text-gray-400">{lote.origen} • ${(lote.precioSacoUSD * 0.92).toFixed(0)} € / saco</p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                                            <button
                                                onClick={() => removeSaco(lote.id)}
                                                disabled={cantidad === 0}
                                                className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all font-bold"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center font-black text-sm text-[#bb8d3b]">
                                                {cantidad}
                                            </span>
                                            <button
                                                onClick={() => addSaco(lote.id, lote.sacosDisponibles)}
                                                disabled={cantidad >= lote.sacosDisponibles || totalSacos >= 10}
                                                className="w-7 h-7 rounded-lg bg-[#5f705f] flex items-center justify-center text-white hover:bg-[#4a574a] disabled:opacity-30 transition-all font-bold"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Medidor visual de llenado del Pallet */}
                        <div className="space-y-2 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-black uppercase tracking-wider text-gray-400">Capacidad del Pallet Consolidado</span>
                                <span className="font-black text-[#bb8d3b]">{totalSacos} / 10 Sacos</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                                {Array.from({ length: 10 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-full flex-1 transition-all duration-300 rounded-sm ${
                                            idx < totalSacos ? 'bg-[#5f705f]' : 'bg-transparent'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 text-right">
                                {10 - totalSacos} espacios restantes para optimizar flete
                            </p>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Opciones Logísticas y Presupuesto */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm p-8 space-y-6">
                        <span className="text-xs font-black uppercase tracking-wider text-[#bb8d3b] block border-b border-gray-50 pb-3">
                            Configuración de Envío a Europa
                        </span>

                        {/* Puerto de Destino */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                                Puerto de Entrada en la UE
                            </label>
                            <select
                                value={puerto}
                                onChange={(e) => setPuerto(e.target.value)}
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-xs font-bold text-gray-800 outline-none focus:border-[#bb8d3b]"
                            >
                                <option value="roterdam">Róterdam (Países Bajos) — ETA 16 Días</option>
                                <option value="hamburgo">Hamburgo (Alemania) — ETA 18 Días</option>
                                <option value="barcelona">Barcelona (España) — ETA 21 Días</option>
                            </select>
                        </div>

                        {/* Incoterm */}
                        <div className="space-y-2 pt-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                                Modalidad de Entrega (Incoterm)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setIncoterm('FOB')}
                                    className={`h-11 rounded-xl font-black text-xs transition-all border ${
                                        incoterm === 'FOB'
                                            ? 'bg-[#5f705f] text-white border-transparent shadow-sm'
                                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-700'
                                    }`}
                                >
                                    FOB Puerto Col.
                                </button>
                                <button
                                    onClick={() => setIncoterm('DDP')}
                                    className={`h-11 rounded-xl font-black text-xs transition-all border ${
                                        incoterm === 'DDP'
                                            ? 'bg-[#bb8d3b] text-white border-transparent shadow-sm'
                                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-700'
                                    }`}
                                >
                                    DDP Puerta a Puerta
                                </button>
                            </div>
                        </div>

                        {/* Resumen Financiero */}
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3 pt-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500 font-bold">Costo Total de Café Verde:</span>
                                <span className="font-black text-gray-800">${(costoCaféUSD * 0.92).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-xs border-b border-gray-200/60 pb-2">
                                <span className="text-gray-500 font-bold">Flete Consolidado ({incoterm}):</span>
                                <span className="font-black text-[#bb8d3b]">${(totalSacos > 0 ? fleteUSD * 0.92 : 0).toFixed(2)} €</span>
                            </div>
                            
                            <div className="flex justify-between items-baseline pt-1">
                                <span className="text-xs font-black uppercase tracking-wider text-gray-900">Total Presupuesto</span>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-[#5f705f]">{totalGeneralEUR} €</span>
                                    <span className="text-[9px] font-bold text-gray-400 block">Aprox. ${(totalGeneralUSD).toFixed(2)} USD</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={confirmarConsolidacion}
                            disabled={totalSacos === 0}
                            className="w-full h-14 rounded-2xl bg-[#5f705f] hover:bg-[#4a574a] text-white font-black text-xs uppercase tracking-wider shadow-md gap-2 border-none"
                        >
                            <Calculator size={15} /> Confirmar Presupuesto Logístico
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
