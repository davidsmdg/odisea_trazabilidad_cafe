import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    Box,
    Truck,
    Ship,
    Save,
    MapPin,
    Contact,
    Building2,
    FileText,
    ExternalLink,
    Droplets,
    Scale,
    Navigation,
    ShieldCheck,
    Calendar,
    ArrowUpRight,
    Trash2,
    Globe,
    Eye,
    Plus,
    Coins
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

import type { LoteUnificado, MovimientoHistorial } from '../../types/lote';
import { getLotePorId, updateLote } from '../../../services/lotesService';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export function DetalleLoteOdisea() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [lote, setLote] = useState<LoteUnificado | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Local states initialized from lote
    const [localEstado, setLocalEstado] = useState<'En Finca' | 'En Bodega' | 'Listo Exportación' | 'En Tránsito' | 'Entregado'>('En Finca');
    const [localRegiones, setLocalRegiones] = useState<('USA' | 'EU')[]>(['USA', 'EU']);
    const [localAprobado, setLocalAprobado] = useState<boolean>(false);
    const [localMovimientos, setLocalMovimientos] = useState<MovimientoHistorial[]>([]);
    
    // Almacenamiento fields
    const [localAlmacenamiento, setLocalAlmacenamiento] = useState('');

    // Pricing configuration states (expanded)
    const [localPrecioProductorCOP, setLocalPrecioProductorCOP] = useState<number>(40000);
    const [localCostoTransporteCOP, setLocalCostoTransporteCOP] = useState<number>(4000);
    const [localTarifaOdiseaUSD, setLocalTarifaOdiseaUSD] = useState<number>(0.8);
    const [localCostoLogisticaUSD, setLocalCostoLogisticaUSD] = useState<number>(3.3);
    const [localTasaUSD_COP, setLocalTasaUSD_COP] = useState<number>(4000);
    const [localTasaEUR_USD, setLocalTasaEUR_USD] = useState<number>(0.92);
    const [localMoneda, setLocalMoneda] = useState<'COP' | 'USD' | 'EUR'>('USD');

    useEffect(() => {
        setIsLoading(true);
        const targetId = id || '';
        getLotePorId(targetId)
            .then(found => {
                if (found) {
                    setLote(found);
                    setLocalEstado(found.estado);
                    setLocalRegiones(found.regionesDisponibles || ['USA', 'EU']);
                    setLocalAprobado(found.aprobadoComercializacion || false);
                    setLocalMovimientos(found.historialMovimientos || []);
                    setLocalAlmacenamiento(found.almacenamiento || '');
                    setLocalPrecioProductorCOP(found.precioProductorCOP !== undefined ? found.precioProductorCOP : 40000);
                    setLocalCostoTransporteCOP(found.costoTransporteNacionalCOP !== undefined ? found.costoTransporteNacionalCOP : 4000);
                    setLocalTarifaOdiseaUSD(found.tarifaOdiseaUSD !== undefined ? found.tarifaOdiseaUSD : 0.8);
                    setLocalCostoLogisticaUSD(found.costoLogisticaExportImportUSD !== undefined ? found.costoLogisticaExportImportUSD : 3.3);
                    setLocalTasaUSD_COP(found.tasaCambioUSD_COP !== undefined ? found.tasaCambioUSD_COP : 4000);
                    setLocalTasaEUR_USD(found.tasaCambioEUR_USD !== undefined ? found.tasaCambioEUR_USD : 0.92);
                    setLocalMoneda(found.monedaVisualizacion || 'USD');
                } else {
                    setError('Lote no encontrado');
                }
                setIsLoading(false);
            })
            .catch(err => {
                setError('Error al obtener el lote');
                setIsLoading(false);
            });
    }, [id]);
    
    // New movement fields
    const [newMovEstado, setNewMovEstado] = useState<'En Finca' | 'En Bodega' | 'Listo Exportación' | 'En Tránsito' | 'Entregado'>('En Bodega');
    const [newMovUbicacion, setNewMovUbicacion] = useState('');
    const [newMovFecha, setNewMovFecha] = useState(new Date().toISOString().split('T')[0]);
    const [newMovDesc, setNewMovDesc] = useState('');
    
    const handleAddMovement = () => {
        if (!newMovUbicacion || !newMovDesc) {
            toast.error('Por favor complete la ubicación y descripción del movimiento.');
            return;
        }
        const newMov: MovimientoHistorial = {
            id: 'mov-' + Date.now(),
            estado: newMovEstado,
            ubicacion: newMovUbicacion,
            fecha: newMovFecha,
            descripcion: newMovDesc,
            operador: 'Odisea Trace Admin'
        };
        setLocalMovimientos([...localMovimientos, newMov]);
        setNewMovUbicacion('');
        setNewMovDesc('');
        toast.success('Movimiento agregado localmente. Guarde el expediente para confirmar.');
    };

    const handleRemoveMovement = (movId: string) => {
        setLocalMovimientos(localMovimientos.filter(m => m.id !== movId));
        toast.info('Movimiento removido localmente.');
    };

    if (isLoading) {
        return (
            <div className="max-w-[1400px] mx-auto pb-24 animate-pulse font-sans space-y-10 text-left">
                <div className="bg-white rounded-[40px] border border-slate-200 p-12 h-48 flex flex-col justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error || !lote) {
        return (
            <div className="max-w-[1400px] mx-auto pb-24 font-sans text-center py-20 bg-white border border-slate-200 rounded-[40px] p-10 space-y-4 text-left">
                <AlertTriangle className="text-red-500 mx-auto" size={48} />
                <h2 className="text-2xl font-black text-red-950">Algo salió mal</h2>
                <p className="text-red-700/80 font-bold">{error || 'Lote no encontrado'}</p>
                <Button onClick={() => navigate('/odisea/lotes')} className="bg-slate-900 text-white font-black px-6 py-2 rounded-xl border-none">Volver a lotes</Button>
            </div>
        );
    }

    const displayProductor = {
        nombre: lote.productor,
        cedula: '1.092.344.XXX',
        celular: '+57 312 455 9876',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    };

    const displayFinca = {
        nombre: lote.finca,
        altura: '1.750 msnm',
        coordenada: '1.88452, -76.29712',
        municipio: lote.municipio,
    };

    const displayLote = {
        variedad: lote.variedad,
        cosecha: lote.fecha,
        beneficio: lote.proceso,
        secado: 'Marquesina 15 días',
    };

    const handleSave = async () => {
        if (!lote) return;
        setIsSaving(true);
        try {
            await updateLote(lote.id, {
                estado: localEstado,
                regionesDisponibles: localRegiones,
                aprobadoComercializacion: localAprobado,
                historialMovimientos: localMovimientos,
                almacenamiento: localAlmacenamiento,
                precioProductorCOP: localPrecioProductorCOP,
                costoTransporteNacionalCOP: localCostoTransporteCOP,
                tarifaOdiseaUSD: localTarifaOdiseaUSD,
                costoLogisticaExportImportUSD: localCostoLogisticaUSD,
                tasaCambioUSD_COP: localTasaUSD_COP,
                tasaCambioEUR_USD: localTasaEUR_USD,
                monedaVisualizacion: localMoneda,

                // Campos legacy/compatibilidad
                precioBaseKgUSD: localPrecioProductorCOP / localTasaUSD_COP,
                tarifaOdisea: localTarifaOdiseaUSD,
                porcentajeLogistica: Math.round((localCostoLogisticaUSD / (localPrecioProductorCOP / localTasaUSD_COP + localCostoTransporteCOP / localTasaUSD_COP)) * 100)
            });
            toast.success('Expediente actualizado', {
                description: `ID: ${id} - Información logítica, destinos y bitácora de movimientos sincronizados.`,
                style: { borderRadius: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }
            });
            navigate('/odisea/lotes');
        } catch (err) {
            toast.error('Error al actualizar el expediente');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-left font-sans">
            {/* Header / Meta */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all active:scale-95 group cursor-pointer"
                        onClick={() => navigate('/odisea/lotes')}
                    >
                        <ChevronLeft size={24} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-sans font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Control de Lote Logístico</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#5D4037] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">ID Lote: {id || '084'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 font-sans"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Trazabilidad Completa OK</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-600 text-white px-10 py-4 rounded-[40px] shadow-2xl flex items-center gap-6 group hover:translate-y-[-4px] transition-transform duration-500">
                    <div className="h-12 w-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
                        <ShieldCheck size={24} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 leading-none mb-1">Puntaje Calidad SCA</p>
                        <p className="text-4xl font-sans font-black leading-none">{lote.calificacion || 'Sin evaluar'} {lote.calificacion ? <span className="text-xs font-sans font-black opacity-30">PTS</span> : ''}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* SECTION 1: Contexto Completo */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-[48px] border border-slate-800 p-10 space-y-10 shadow-2xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Building2 size={180} /></div>

                        {/* Productor */}
                        <div className="space-y-6 relative">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-[32px] border-2 border-slate-700 p-1 bg-slate-800 overflow-hidden shrink-0">
                                    <img src={displayProductor.avatar} className="h-full w-full object-cover rounded-[24px]" alt="Productor" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-sans font-black text-white">{displayProductor.nombre}</h3>
                                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">Agricultor Senior</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-slate-800/40 border border-slate-800">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Cédula</span>
                                    <p className="text-xs font-bold">{displayProductor.cedula}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-slate-800/40 border border-slate-800">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Celular</span>
                                    <p className="text-xs font-bold">{displayProductor.celular}</p>
                                </div>
                            </div>
                        </div>

                        {/* Finca & Lote Context */}
                        <div className="space-y-4 pt-4 relative">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60 pb-2 border-b border-white/5">Origen del Café</h4>
                            <Accordion type="single" collapsible className="w-full space-y-3">
                                <AccordionItem value="finca" className="border border-slate-800 bg-slate-800/20 rounded-[28px] overflow-hidden px-4 hover:bg-slate-800/40 transition-all">
                                    <AccordionTrigger className="hover:no-underline py-4 text-white font-bold text-xs">
                                        <div className="flex items-center gap-3 uppercase tracking-widest"><MapPin size={16} className="text-blue-400" /> {displayFinca.nombre}</div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-xs px-2 space-y-4 py-4">
                                        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                                            <span className="text-[9px] font-black">Coordenadas</span>
                                            <span className="font-mono text-blue-400">{displayFinca.coordenada}</span>
                                        </div>
                                        <p className="font-medium">{displayFinca.municipio} — {displayFinca.altura}</p>
                                        <Button variant="outline" className="w-full text-[9px] font-black uppercase tracking-widest h-10 border-slate-700 bg-slate-800 hover:bg-slate-700 rounded-2xl gap-2">
                                            <FileText size={12} /> Ver Certificado de Libertad
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="lote" className="border border-slate-800 bg-slate-800/20 rounded-[28px] overflow-hidden px-4 hover:bg-slate-800/40 transition-all">
                                    <AccordionTrigger className="hover:no-underline py-4 text-white font-bold text-xs uppercase tracking-widest">
                                        <div className="flex items-center gap-3"><Box size={16} className="text-blue-400" /> Detalles Técnicos Lote</div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-xs px-2 space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-tighter">Variedad</p>
                                                <p className="font-bold text-slate-200">{displayLote.variedad}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-tighter">Cosecha</p>
                                                <p className="font-bold text-slate-200">{displayLote.cosecha}</p>
                                            </div>
                                            <div className="col-span-2 pt-2 border-t border-white/5">
                                                <p className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-tighter">Manejo Post-Cosecha</p>
                                                <p className="font-medium text-slate-400">{displayLote.beneficio} / {displayLote.secado}</p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <p className="text-[9px] font-black text-slate-600 text-center uppercase tracking-widest">TRACE-CERTIFIED SOURCE — ERP REF #772</p>
                    </div>
                </div>

                {/* SECTION 2 & 3: Portales de Escritura */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-10">
                    {/* Almacenamiento Form */}
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-xl overflow-hidden group">
                        <div className="bg-slate-50 px-10 py-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-4">
                                <Truck size={24} className="text-blue-600" /> Gestión de Almacenamiento (Bodega)
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Permiso: DCA-LOG</Badge>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Fecha Ingreso a Bodega</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-350" size={16} />
                                    <Input defaultValue="2026-05-20" type="date" className="h-14 pl-12 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 font-bold text-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Ubicación en Bodega (Estiba/Silo)</Label>
                                <Input value={localAlmacenamiento} onChange={(e) => setLocalAlmacenamiento(e.target.value)} placeholder="Ej: Silo 4, Estiba B" className="h-14 px-6 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Humedad de Recibo (%)</Label>
                                <div className="relative">
                                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                    <Input defaultValue="11.2" type="number" step="0.1" className="h-14 pl-12 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 font-bold text-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Peso Neto Ingreso (Kg)</Label>
                                <div className="relative">
                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                    <Input defaultValue="580" type="number" className="h-14 pl-12 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 font-bold text-slate-700" />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Observaciones de Almacenamiento</Label>
                                <textarea className="w-full h-24 rounded-2xl border-slate-100 bg-[#f8fafc] p-6 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300 resize-none" placeholder="Estado de los sacos, rotulados, etc..." />
                            </div>
                        </div>
                    </div>

                    {/* Habilitación Comercial y Destinos */}
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-xl overflow-hidden group">
                        <div className="bg-slate-50 px-10 py-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-4">
                                <Globe size={24} className="text-blue-600" /> Comercialización y Destinos B2B
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Permiso: DCA-MKT</Badge>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Estado Logístico */}
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Estado Logístico del Lote</Label>
                                    <select
                                        value={localEstado}
                                        onChange={(e) => setLocalEstado(e.target.value as any)}
                                        className="h-14 w-full px-6 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600"
                                    >
                                        <option value="En Finca">En Finca (Cosecha/Secado)</option>
                                        <option value="En Bodega">En Bodega (Almacenamiento/Trilla)</option>
                                        <option value="Listo Exportación">Listo Exportación (Puerto/Embarque)</option>
                                        <option value="En Tránsito">En Tránsito Internacional</option>
                                        <option value="Entregado">Entregado al Tostador</option>
                                    </select>
                                </div>

                                {/* Visibilidad en el Marketplace */}
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Visibilidad en Marketplace</Label>
                                    <div className="flex items-center gap-4 h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6">
                                        <input
                                            type="checkbox"
                                            id="aprobadoMkt"
                                            checked={localAprobado}
                                            onChange={(e) => setLocalAprobado(e.target.checked)}
                                            className="h-5 w-5 rounded text-blue-650 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor="aprobadoMkt" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                                            {localAprobado ? '📢 Habilitado (Visible para Tostadores)' : '🔒 Oculto (Sólo Gestión Interna)'}
                                        </label>
                                    </div>
                                </div>

                                {/* Regiones Autorizadas */}
                                <div className="md:col-span-2 space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Regiones de Exportación Autorizadas</Label>
                                    <div className="flex gap-6">
                                        {[
                                            { val: 'USA' as const, desc: 'Estados Unidos (FDA)' },
                                            { val: 'EU' as const, desc: 'Unión Europea (EUDR)' }
                                        ].map(reg => {
                                            const active = localRegiones.includes(reg.val);
                                            return (
                                                <button
                                                    key={reg.val}
                                                    type="button"
                                                    onClick={() => {
                                                        if (active) {
                                                            setLocalRegiones(localRegiones.filter(r => r !== reg.val));
                                                        } else {
                                                            setLocalRegiones([...localRegiones, reg.val]);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "h-14 px-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border cursor-pointer transition-all select-none",
                                                        active 
                                                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                                    )}
                                                >
                                                    {reg.desc}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuración de Costos y Distribución de Precio */}
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-xl overflow-hidden group">
                        <div className="bg-slate-50 px-10 py-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-4">
                                <Coins className="text-blue-600" size={24} /> Configuración de Costos y Distribución de Precio
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">ERP: COST-GATE</Badge>
                        </div>
                        <div className="p-10 space-y-8">
                            {/* Tasas de Cambio */}
                            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">1. Tasas de Cambio Ajustables</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Tasa Cambio USD ➔ COP</Label>
                                        <Input
                                            type="number"
                                            value={localTasaUSD_COP}
                                            onChange={(e) => setLocalTasaUSD_COP(parseFloat(e.target.value) || 4000)}
                                            className="h-12 rounded-xl border-slate-100 font-bold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Tasa Cambio EUR ➔ USD (Euros por Dólar)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={localTasaEUR_USD}
                                            onChange={(e) => setLocalTasaEUR_USD(parseFloat(e.target.value) || 0.92)}
                                            className="h-12 rounded-xl border-slate-100 font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Entradas de Costos */}
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">2. Componentes de Costos y Sourcing</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Precio Finca COP */}
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Compra Productor (COP/Kg)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                                            <Input
                                                type="number"
                                                value={localPrecioProductorCOP}
                                                onChange={(e) => setLocalPrecioProductorCOP(parseFloat(e.target.value) || 0)}
                                                className="h-12 pl-10 rounded-xl border-slate-100 font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Transporte Nacional COP */}
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Transporte Nacional (COP/Kg)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                                            <Input
                                                type="number"
                                                value={localCostoTransporteCOP}
                                                onChange={(e) => setLocalCostoTransporteCOP(parseFloat(e.target.value) || 0)}
                                                className="h-12 pl-10 rounded-xl border-slate-100 font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Tarifa Odisea USD */}
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Tarifa Odisea (USD/Kg)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">USD</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={localTarifaOdiseaUSD}
                                                onChange={(e) => setLocalTarifaOdiseaUSD(parseFloat(e.target.value) || 0)}
                                                className="h-12 pl-12 rounded-xl border-slate-100 font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Logística Internacional USD */}
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Logística Exp/Imp (USD/Kg)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">USD</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={localCostoLogisticaUSD}
                                                onChange={(e) => setLocalCostoLogisticaUSD(parseFloat(e.target.value) || 0)}
                                                className="h-12 pl-12 rounded-xl border-slate-100 font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selector de Moneda de Visualización */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">3. Moneda de Visualización Predeterminada</Label>
                                <div className="flex gap-4">
                                    {(['COP', 'USD', 'EUR'] as const).map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setLocalMoneda(m)}
                                            className={cn(
                                                "px-6 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer",
                                                localMoneda === m
                                                    ? "bg-[#5f705f] text-white border-[#5f705f] shadow-md"
                                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conversor Financiero Dinámico */}
                            {(() => {
                                const prodUSD = localPrecioProductorCOP / localTasaUSD_COP;
                                const transUSD = localCostoTransporteCOP / localTasaUSD_COP;
                                const totalUSD = prodUSD + transUSD + localTarifaOdiseaUSD + localCostoLogisticaUSD;

                                const getConverted = (usdVal: number) => {
                                    if (localMoneda === 'COP') return { symbol: '$', value: usdVal * localTasaUSD_COP, suffix: 'COP' };
                                    if (localMoneda === 'EUR') return { symbol: '€', value: usdVal * localTasaEUR_USD, suffix: 'EUR' };
                                    return { symbol: '$', value: usdVal, suffix: 'USD' };
                                };

                                const formattedProd = getConverted(prodUSD);
                                const formattedTrans = getConverted(transUSD);
                                const formattedOdisea = getConverted(localTarifaOdiseaUSD);
                                const formattedLogistics = getConverted(localCostoLogisticaUSD);
                                const formattedTotal = getConverted(totalUSD);

                                return (
                                    <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-3xl space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5f705f] block">Desglose Final (Moneda Seleccionada: {localMoneda})</h4>
                                            <span className="text-[9px] font-bold text-slate-400">Conversión en Tiempo Real</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-bold text-slate-700">
                                            <div className="bg-white p-4 rounded-2xl border border-slate-200/50">
                                                <span className="text-[8px] font-black text-slate-400 block uppercase mb-1">Precio Productor (Finca)</span>
                                                <p className="text-base font-black text-slate-900">{formattedProd.symbol}{formattedProd.value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[8px] font-bold text-slate-400">{formattedProd.suffix}</span></p>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-200/50">
                                                <span className="text-[8px] font-black text-slate-400 block uppercase mb-1">Transporte Nacional</span>
                                                <p className="text-base font-black text-slate-900">{formattedTrans.symbol}{formattedTrans.value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[8px] font-bold text-slate-400">{formattedTrans.suffix}</span></p>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-200/50">
                                                <span className="text-[8px] font-black text-slate-400 block uppercase mb-1">Tarifa Odisea Trace</span>
                                                <p className="text-base font-black text-slate-900">{formattedOdisea.symbol}{formattedOdisea.value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[8px] font-bold text-slate-400">{formattedOdisea.suffix}</span></p>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-200/50">
                                                <span className="text-[8px] font-black text-slate-400 block uppercase mb-1">Logística Internacional</span>
                                                <p className="text-base font-black text-slate-900">{formattedLogistics.symbol}{formattedLogistics.value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[8px] font-bold text-slate-400">{formattedLogistics.suffix}</span></p>
                                            </div>
                                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 col-span-2 sm:col-span-1">
                                                <span className="text-[8px] font-black text-emerald-600 block uppercase mb-1">Precio Total FOB</span>
                                                <p className="text-base font-black text-emerald-950">{formattedTotal.symbol}{formattedTotal.value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[8px] font-bold text-emerald-600">{formattedTotal.suffix}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Historial de Movimientos de Trazabilidad */}
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-xl overflow-hidden group">
                        <div className="bg-slate-50 px-10 py-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-4">
                                <Navigation size={24} className="text-blue-650 text-blue-650" /> Bitácora Historial de Movimientos
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Trazabilidad en Vivo</Badge>
                        </div>
                        <div className="p-10 space-y-10">
                            {/* Formulario para nuevo movimiento */}
                            <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-3xl space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 block">Registrar Nuevo Movimiento Logístico</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block ml-1">Estado</Label>
                                        <select
                                            value={newMovEstado}
                                            onChange={(e) => setNewMovEstado(e.target.value as any)}
                                            className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-700 outline-none"
                                        >
                                            <option value="En Finca">En Finca</option>
                                            <option value="En Bodega">En Bodega</option>
                                            <option value="Listo Exportación">Listo Exportación</option>
                                            <option value="En Tránsito">En Tránsito</option>
                                            <option value="Entregado">Entregado</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block ml-1">Ubicación</Label>
                                        <Input
                                            value={newMovUbicacion}
                                            onChange={(e) => setNewMovUbicacion(e.target.value)}
                                            placeholder="Ej: Finca, Bodega Acopio, Puerto"
                                            className="h-12 px-4 rounded-xl border-slate-200 bg-white font-bold text-xs"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block ml-1">Fecha</Label>
                                        <Input
                                            type="date"
                                            value={newMovFecha}
                                            onChange={(e) => setNewMovFecha(e.target.value)}
                                            className="h-12 px-4 rounded-xl border-slate-200 bg-white font-bold text-xs"
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block ml-1">Descripción del Movimiento</Label>
                                        <Input
                                            value={newMovDesc}
                                            onChange={(e) => setNewMovDesc(e.target.value)}
                                            placeholder="Ej: Ingreso a bodega central, secado completado, etc."
                                            className="h-12 px-4 rounded-xl border-slate-200 bg-white font-bold text-xs"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddMovement}
                                    className="h-12 w-full rounded-xl bg-blue-600 hover:bg-black text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer"
                                >
                                    <Plus size={14} className="mr-1.5" /> Añadir Movimiento a la Bitácora
                                </Button>
                            </div>

                            {/* Línea de tiempo visual */}
                            <div className="space-y-6">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-450 block ml-1">Hitos de Trazabilidad Registrados</Label>
                                {localMovimientos.length === 0 ? (
                                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                        <p className="text-xs font-bold text-slate-400">No hay movimientos registrados para este lote.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {localMovimientos.map((m, idx) => (
                                            <div key={m.id || idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4 hover:border-slate-300 transition-colors">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono font-black text-slate-800">{m.fecha}</span>
                                                        <Badge className="bg-slate-200 text-slate-700 border-none font-black text-[8px] px-2 py-0.5 rounded uppercase">{m.estado}</Badge>
                                                        <span className="text-[9px] font-black text-slate-350 uppercase tracking-widest">• Ubicación: {m.ubicacion}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 font-medium">{m.descripcion}</p>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Registrado por: {m.operador}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMovement(m.id)}
                                                    className="h-8 w-8 rounded-lg bg-red-50 text-red-650 hover:bg-red-100 transition-all flex items-center justify-center border-none text-red-650 cursor-pointer"
                                                    title="Eliminar movimiento"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Exportación Form */}
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-xl overflow-hidden group">
                        <div className="bg-slate-900/5 px-10 py-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-4">
                                <Ship size={24} className="text-emerald-600" /> Despacho Logístico & Exportación
                            </h3>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Permiso: DCA-EXP</Badge>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Nro Registro DEX / Bill of Lading</Label>
                                <Input placeholder="BOL-HUI-2026-XXX" className="h-14 px-6 rounded-2xl border-slate-100 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-600 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Destino Internacional / Puerto</Label>
                                <Input placeholder="Hamburgo, Alemania" className="h-14 px-6 rounded-2xl border-slate-100 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-600 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Precio FOB (USD/Lb)</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-300">$</span>
                                    <Input defaultValue="2.85" type="number" step="0.01" className="h-14 pl-10 rounded-2xl border-slate-100 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-600 font-bold text-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Contrato de Venta (PDF)</Label>
                                <div className="h-14 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-between px-6 bg-slate-50 cursor-pointer hover:border-emerald-200 transition-all group/file">
                                    <span className="text-xs font-bold text-slate-400 group-hover/file:text-emerald-600">Subir Documento Digital</span>
                                    <ArrowUpRight size={16} className="text-slate-350" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Action */}
                    <div className="pt-6">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-16 sm:h-24 w-full rounded-2xl sm:rounded-[32px] bg-slate-900 border-none hover:bg-black text-white font-black text-lg sm:text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 sm:gap-6 group overflow-hidden cursor-pointer"
                        >
                            <Save size={20} className="text-blue-400 group-hover:scale-125 transition-transform shrink-0 sm:h-7 sm:w-7" />
                            {isSaving ? 'Sincronizando ERP...' : 'Sincronizar y Actualizar Expediente'}
                        </Button>
                        <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-8">Odisea Logistics Control — Secure Ledger Write OK</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
