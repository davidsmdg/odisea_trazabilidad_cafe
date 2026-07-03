import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    PackageOpen,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Truck,
    Warehouse,
    Ship,
    Calendar,
    Box,
    Heart,
    Check,
    X,
    MessageSquare,
    ShieldCheck,
    AlertTriangle,
    Settings,
    Scale,
    TrendingUp,
    HelpCircle,
    Activity,
    CheckCircle2,
    Layers,
    Lock,
    Globe,
    ShieldAlert,
    AlertOctagon
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

import { getLotesMaster, LoteUnificado, updateLote, getValidationStageForLote, updateValidationStage, ValidationStage } from '../../utils/loteStore';
import { getAnomalies, resolveAnomaly, getAnomalyConfig, updateAnomalyConfig, AnomalyRecord, AnomalyConfig } from '../../utils/anomalyStore';

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'En Finca': return { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Truck };
        case 'En Bodega': return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Warehouse };
        case 'Listo Exportación': return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Ship };
        default: return { color: 'text-slate-600 bg-slate-50 border-slate-100', icon: PackageOpen };
    }
};

export function GestionLotesOdisea() {
    const navigate = useNavigate();
    const [pendientes, setPendientes] = useState<any[]>([]);
    const [lotes, setLotes] = useState<LoteUnificado[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('Todos');

    // Anomaly States
    const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);
    const [anomalyConfig, setAnomalyConfig] = useState<AnomalyConfig>({ umbralDesviacionPorcentaje: 50, umbralDesviacionEstandar: 2.0 });
    const [isAnomalyResolveOpen, setIsAnomalyResolveOpen] = useState(false);
    const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);
    const [resolveEstado, setResolveEstado] = useState<'Confirmado Válido' | 'Confirmado Error'>('Confirmado Válido');
    const [resolveComentario, setResolveComentario] = useState('');

    const handleOpenAnomalyResolve = (anomaly: AnomalyRecord, estado: 'Confirmado Válido' | 'Confirmado Error') => {
        setSelectedAnomaly(anomaly);
        setResolveEstado(estado);
        setResolveComentario('');
        setIsAnomalyResolveOpen(true);
    };

    const handleSaveAnomalyResolve = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAnomaly) return;

        resolveAnomaly(selectedAnomaly.id, resolveEstado, resolveComentario);

        // Si se confirma como error (Rechazado), transicionar el Stage Gate
        if (resolveEstado === 'Confirmado Error') {
            updateValidationStage(selectedAnomaly.loteId, 'Rechazado', 'Mesa de Control (Anomalías)', `Dato anómalo confirmado como error: ${selectedAnomaly.tipoDato} (${selectedAnomaly.valorIngresado}). Observación: ${resolveComentario}`);
            updateLote(selectedAnomaly.loteId, { aprobadoComercializacion: false });
        }

        // Recargar listas
        setAnomalies(getAnomalies());
        setLotes(getLotesMaster());
        setIsAnomalyResolveOpen(false);
        toast.success(`Anomalía resuelta como ${resolveEstado}`, {
            description: `Se registró la resolución de la discrepancia para el lote ${selectedAnomaly.loteId}.`
        });
    };

    const handleConfigSliderChange = (key: keyof AnomalyConfig, val: number) => {
        const nextConf = { ...anomalyConfig, [key]: val };
        setAnomalyConfig(nextConf);
        updateAnomalyConfig(nextConf);
    };
    
    // Stage Gate Validation States
    const [isValidationOpen, setIsValidationOpen] = useState(false);
    const [selectedLoteForValidation, setSelectedLoteForValidation] = useState<LoteUnificado | null>(null);
    const [nextValidationStage, setNextValidationStage] = useState<ValidationStage>('En validación');
    const [validationMotivo, setValidationMotivo] = useState('');

    const handleOpenValidationModal = (lote: LoteUnificado) => {
        setSelectedLoteForValidation(lote);
        const currentStage = getValidationStageForLote(lote.id).stage;
        setNextValidationStage(currentStage);
        setValidationMotivo('');
        setIsValidationOpen(true);
    };

    const handleSaveValidation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLoteForValidation) return;
        
        updateValidationStage(selectedLoteForValidation.id, nextValidationStage, 'Administrador Odisea', validationMotivo);
        
        // Sincronizar campo aprobadoComercializacion si es publicado o rechazado
        if (nextValidationStage === 'Publicado') {
            updateLote(selectedLoteForValidation.id, { aprobadoComercializacion: true });
        } else if (nextValidationStage === 'Rechazado') {
            updateLote(selectedLoteForValidation.id, { aprobadoComercializacion: false });
        }
        
        setLotes(getLotesMaster());
        setIsValidationOpen(false);
        toast.success(`Estado Stage-Gate actualizado a ${nextValidationStage}`, {
            description: `Transición registrada para el lote ${selectedLoteForValidation.id}.`
        });
    };

    useEffect(() => {
        setLotes(getLotesMaster());
        setAnomalies(getAnomalies());
        setAnomalyConfig(getAnomalyConfig());
        
        // Cargar filtro inicial desde la URL si existe
        const queryParams = new URLSearchParams(window.location.search);
        const filterParam = queryParams.get('filter');
        if (filterParam === 'reservados') {
            setSelectedTab('Reservados');
        } else if (filterParam === 'disponibles') {
            setSelectedTab('Disponibles');
        }

        const loadComments = () => {
            const current = localStorage.getItem('comentarios_publicos_pendientes');
            if (current) {
                try {
                    setPendientes(JSON.parse(current));
                } catch (e) {}
            } else {
                const initial = [
                    {
                        id: 'm1',
                        loteId: 'LOT-HUILA-084',
                        rating: 5,
                        selectedNotes: ['chocolate', 'frutos_rojos'],
                        message: '¡Excelente café! El aroma es espectacular y las notas a chocolate se sienten muy claras. Felicitaciones al productor.',
                        fecha: '01/07/2026',
                        estado: 'Pendiente'
                    }
                ];
                localStorage.setItem('comentarios_publicos_pendientes', JSON.stringify(initial));
                setPendientes(initial);
            }
        };
        loadComments();
    }, []);

    const handleApprove = (commentId: string) => {
        const comment = pendientes.find(c => c.id === commentId);
        if (!comment) return;

        // Agregar a aprobados
        const aprobadosStr = localStorage.getItem('comentarios_publicos_aprobados');
        let aprobadosList = [];
        if (aprobadosStr) {
            try {
                aprobadosList = JSON.parse(aprobadosStr);
            } catch (e) {}
        }
        aprobadosList.push({ ...comment, estado: 'Aprobado' });
        localStorage.setItem('comentarios_publicos_aprobados', JSON.stringify(aprobadosList));

        // Remover de pendientes
        const filtrados = pendientes.filter(c => c.id !== commentId);
        localStorage.setItem('comentarios_publicos_pendientes', JSON.stringify(filtrados));
        setPendientes(filtrados);

        toast.success('Comentario aprobado', {
            description: 'El comentario ahora es visible en el panel del productor.',
            style: { borderRadius: '24px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#14532D' }
        });
    };

    const handleReject = (commentId: string) => {
        const filtrados = pendientes.filter(c => c.id !== commentId);
        localStorage.setItem('comentarios_publicos_pendientes', JSON.stringify(filtrados));
        setPendientes(filtrados);

        toast.warning('Comentario rechazado', {
            description: 'El comentario ha sido descartado del panel administrativo.'
        });
    };

    return (
        <div className="space-y-12 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4 text-left font-sans">
            {/* Header */}
            <div className="flex flex-col gap-6 text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                    <div className="h-16 w-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                        <Box size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-sans font-black text-slate-900 tracking-tight">Inventario de Lotes</h1>
                </div>
                <p className="text-lg text-slate-500 font-medium max-w-2xl">
                    Gestiona la ubicación y el estado logístico de cada lote desde su recepción en finca hasta el puerto de exportación.
                </p>
            </div>

            {/* Dashboard Mini-Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'En Finca', value: '45.2 Tn', icon: Truck, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                    { label: 'En Puntos Acopio', value: '128.5 Tn', icon: Warehouse, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                    { label: 'Listos Puerto', value: '12 Lotes', icon: Ship, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                    { label: 'Uso Bodega', value: '82%', icon: Box, color: 'text-slate-900 bg-slate-50 border-slate-100' },
                ].map((stat, i) => (
                    <div key={i} className={cn("p-8 rounded-[40px] border flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-all hover:shadow-xl", stat.color)}>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{stat.label}</p>
                        <p className="text-3xl font-sans font-black leading-none">{stat.value}</p>
                    </div>
                ))}
            </div>
              {/* Navegación por Pestañas Segmentadas */}
            <div className="bg-slate-100/60 p-2 rounded-[32px] border border-slate-200/50 flex flex-wrap gap-2 w-fit mb-4 text-left">
                {[
                    { key: 'Todos', label: 'Todos los Lotes', icon: Layers },
                    { key: 'Reservados', label: 'Pedidos B2B', icon: Lock },
                    { key: 'Disponibles', label: 'Disponibles', icon: Globe },
                    { key: 'StageGate', label: 'Auditoría Stage-Gate', icon: ShieldAlert },
                    { key: 'Anomalies', label: 'Alertas y Anomalías', icon: AlertOctagon }
                ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = selectedTab === tab.key;
                    
                    // Cuenta de anomalías para mostrar en la pestaña
                    let badgeCount = 0;
                    if (tab.key === 'Anomalies') {
                        badgeCount = anomalies.filter(a => a.estadoResolucion === 'Pendiente').length;
                    } else if (tab.key === 'StageGate') {
                        badgeCount = lotes.filter(l => getValidationStageForLote(l.id).stage !== 'Publicado').length;
                    }

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedTab(tab.key)}
                            className={cn(
                                "h-12 px-5 rounded-[24px] font-sans font-black text-xs uppercase tracking-wider cursor-pointer transition-all duration-300 flex items-center gap-2 border-none",
                                isActive
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-102"
                                    : "bg-transparent text-slate-450 hover:bg-slate-200/60 hover:text-slate-800"
                            )}
                        >
                            <TabIcon size={16} className={cn("transition-colors", isActive ? "text-amber-400" : "text-slate-400")} />
                            <span>{tab.label}</span>
                            {badgeCount > 0 && (
                                <span className={cn("text-[9px] font-black h-5 px-1.5 rounded-full flex items-center justify-center shrink-0 min-w-5 leading-none",
                                    isActive
                                        ? "bg-red-500 text-white"
                                        : "bg-red-100 text-red-750 animate-pulse"
                                )}>
                                    {badgeCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
            {selectedTab !== 'Anomalies' ? (
                <>
                    {/* Búsqueda */}
                    <div className="bg-white p-4 rounded-[32px] border border-slate-100 flex flex-col md:flex-row gap-4 shadow-sm">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-350" size={24} />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar ID Lote o Productor..."
                                className="h-16 pl-16 rounded-2xl border-none bg-slate-50 font-bold text-slate-900 placeholder:text-slate-350"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="h-16 rounded-2xl px-10 border-slate-200 font-black uppercase text-xs tracking-widest gap-3 hover:bg-slate-50">
                                <Filter size={20} /> Filtros
                            </Button>
                        </div>
                    </div>

                    {/* Listado de Lotes */}
                    <div className="space-y-6">
                        {(() => {
                            const filteredLotes = lotes.filter(l => {
                                if (selectedTab === 'Reservados') {
                                    return !!l.tostadorAsignado;
                                }
                                if (selectedTab === 'Disponibles') {
                                    return l.ofrecidoPorProductor && l.aprobadoComercializacion && !l.tostadorAsignado;
                                }
                                if (selectedTab === 'StageGate') {
                                    const vRecord = getValidationStageForLote(l.id);
                                    return vRecord.stage !== 'Publicado';
                                }
                                return true;
                            }).filter(l => {
                                const term = searchTerm.toLowerCase();
                                return (
                                    l.id.toLowerCase().includes(term) || 
                                    l.productor.toLowerCase().includes(term)
                                );
                            });

                            if (filteredLotes.length === 0) {
                                return (
                                    <div className="text-center py-20 bg-white border border-slate-100 rounded-[32px]">
                                        <PackageOpen size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="font-sans font-black text-slate-400 text-lg">No se encontraron lotes</p>
                                    </div>
                                );
                            }

                            return filteredLotes.map((item) => {
                                const styles = getStatusStyles(item.estado);
                                const StatusIcon = styles.icon;
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden text-left"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 grow w-full lg:w-auto">
                                            <div className="space-y-2">
                                                <div className="flex flex-col md:flex-row items-center gap-3">
                                                    <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] font-black px-2 uppercase tracking-widest">{item.id}</Badge>
                                                    <span className="text-[10px] font-black text-slate-350 uppercase tracking-widest">TRACE-ID ODISEA SYNC</span>
                                                    {(() => {
                                                        const vRecord = getValidationStageForLote(item.id);
                                                        const badgeColors = {
                                                            'Capturado': 'bg-slate-100 text-slate-700',
                                                            'En validación': 'bg-amber-100 text-amber-700',
                                                            'Validado': 'bg-blue-100 text-blue-700',
                                                            'Rechazado': 'bg-rose-100 text-rose-700',
                                                            'Publicado': 'bg-emerald-100 text-emerald-700'
                                                        };
                                                        return (
                                                            <Badge className={cn("border-none text-[8.5px] font-sans font-black px-2.5 py-1 uppercase tracking-wider rounded-md", badgeColors[vRecord.stage])}>
                                                                Stage: {vRecord.stage}
                                                            </Badge>
                                                        );
                                                    })()}
                                                </div>
                                                <h3 className="text-4xl font-sans font-black text-slate-900 leading-tight">{item.productor}</h3>
                                                <div className="flex items-center gap-4 pt-1 justify-center md:justify-start">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-[#bb8d3b]" /> {item.finca} · {item.municipio}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                        <Calendar size={14} className="text-[#5f705f]" /> {item.fecha}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                                                      <div className="flex flex-col lg:flex-row items-center gap-6 w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-none">
                                            {getValidationStageForLote(item.id).stage !== 'Publicado' && (
                                                <Button
                                                    onClick={() => handleOpenValidationModal(item)}
                                                    className="h-16 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest gap-2 cursor-pointer border-none shrink-0"
                                                >
                                                    <ShieldCheck size={16} /> Validar Stage-Gate
                                                </Button>
                                            )}
        
                                            <div className="text-center md:text-right shrink-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-2">Estado Logístico</p>
                                                <div className={cn(
                                                    "flex items-center gap-2 font-black text-xl px-4 py-2 rounded-2xl border",
                                                    styles.color
                                                )}>
                                                    <StatusIcon size={20} />
                                                    {item.estado}
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{item.almacenamiento}</p>
                                            </div>
                                            <Button
                                                onClick={() => navigate(`/odisea/lote/${item.id}`)}
                                                className="h-16 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest gap-2 cursor-pointer border-none shrink-0"
                                            >
                                                Abrir Detalle <ArrowRight size={16} />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            });
                        })()}
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Panel Izquierdo: Configuración de Umbrales */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 h-fit text-left">
                        <div className="space-y-2">
                            <h3 className="text-lg font-sans font-black text-slate-905 flex items-center gap-2">
                                <Settings className="text-[#5f705f]" size={20} />
                                Calibración de Umbrales
                            </h3>
                            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                Calibra la sensibilidad de los algoritmos de detección para alertar discrepancias estadísticas.
                            </p>
                        </div>
                        
                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            {/* Sliders */}
                            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div className="flex justify-between text-xs font-black uppercase text-slate-550">
                                    <span>Variación Límite</span>
                                    <span className="text-[#5f705f] font-black">±{anomalyConfig.umbralDesviacionPorcentaje}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="150"
                                    step="5"
                                    value={anomalyConfig.umbralDesviacionPorcentaje}
                                    onChange={e => handleConfigSliderChange('umbralDesviacionPorcentaje', Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5f705f]"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[9px] text-slate-400 font-bold">Desviación sobre promedio histórico</span>
                                    <Badge className={cn("border-none text-[8px] font-black px-2 py-0.5 rounded-md",
                                        anomalyConfig.umbralDesviacionPorcentaje < 40 ? 'bg-amber-100 text-amber-700' :
                                        anomalyConfig.umbralDesviacionPorcentaje <= 80 ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-blue-100 text-blue-700'
                                    )}>
                                        {anomalyConfig.umbralDesviacionPorcentaje < 40 ? 'Alta Sensibilidad' :
                                         anomalyConfig.umbralDesviacionPorcentaje <= 80 ? 'Tolerancia Estándar' :
                                         'Permisivo'
                                        }
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div className="flex justify-between text-xs font-black uppercase text-slate-550">
                                    <span>Sensibilidad Sigma (σ)</span>
                                    <span className="text-[#5f705f] font-black">±{anomalyConfig.umbralDesviacionEstandar.toFixed(1)} σ</span>
                                </div>
                                <input
                                    type="range"
                                    min="1.0"
                                    max="5.0"
                                    step="0.1"
                                    value={anomalyConfig.umbralDesviacionEstandar}
                                    onChange={e => handleConfigSliderChange('umbralDesviacionEstandar', Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5f705f]"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[9px] text-slate-400 font-bold">Límite de Desviación Estándar</span>
                                    <Badge className={cn("border-none text-[8px] font-black px-2 py-0.5 rounded-md",
                                        anomalyConfig.umbralDesviacionEstandar < 1.8 ? 'bg-amber-100 text-amber-700' :
                                        anomalyConfig.umbralDesviacionEstandar <= 2.5 ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-blue-100 text-blue-700'
                                    )}>
                                        {anomalyConfig.umbralDesviacionEstandar < 1.8 ? 'Estricto' :
                                         anomalyConfig.umbralDesviacionEstandar <= 2.5 ? 'Recomendado' :
                                         'Tolerante (Pocas Alertas)'
                                        }
                                    </Badge>
                                </div>
                            </div>

                            {/* Ayuda visual amigable */}
                            <div className="p-4 bg-blue-50/50 border border-blue-100/60 rounded-2xl text-[10px] text-blue-950 font-medium flex gap-2.5 leading-relaxed">
                                <HelpCircle className="shrink-0 text-blue-600" size={16} />
                                <div>
                                    <p className="font-sans font-black text-blue-900">¿Cómo funciona la Mesa de Control?</p>
                                    <p className="mt-1 opacity-90">
                                        Las entradas que exceden la desviación porcentual o el límite Sigma de la finca se marcan temporalmente como discrepancias y se notifican aquí. Las discrepancias deben validarse manualmente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel Derecho: Lista de Anomalías */}
                    <div className="lg:col-span-2 space-y-6 text-left">
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
                            <h3 className="font-sans font-black text-slate-800 text-xs uppercase tracking-widest">Log de Auditoría de Anomalías</h3>
                            <Badge className="bg-amber-100 text-amber-800 border-none font-bold text-xs">
                                {anomalies.filter(a => a.estadoResolucion === 'Pendiente').length} Pendientes
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {anomalies.map((anom) => {
                                const borderColors = {
                                    'Pendiente': 'border-l-4 border-l-amber-500 border-slate-100 shadow-sm',
                                    'Confirmado Válido': 'border-l-4 border-l-emerald-500 border-slate-100 opacity-60 bg-slate-50/50',
                                    'Confirmado Error': 'border-l-4 border-l-rose-500 border-slate-100 opacity-60 bg-slate-50/50'
                                };
                                
                                const labelsDato = {
                                    'peso_cereza': { label: 'Kilos de Cereza', icon: Scale, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                                    'peso_pergamino': { label: 'Kilos de Pergamino', icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                                    'factor_rendimiento': { label: 'Factor de Rendimiento', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                                    'fecha_cosecha': { label: 'Fecha Fuera de Época', icon: Calendar, color: 'text-purple-600 bg-purple-50 border-purple-100' }
                                };
                                
                                const configDato = labelsDato[anom.tipoDato] || { label: anom.tipoDato, icon: HelpCircle, color: 'text-slate-650 bg-slate-50 border-slate-100' };
                                const DatoIcon = configDato.icon;

                                return (
                                    <div key={anom.id} className={cn("bg-white p-6 rounded-[32px] border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-md", borderColors[anom.estadoResolucion])}>
                                        <div className="space-y-3 grow text-left w-full md:w-auto">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge className="bg-slate-900 text-white border-none font-sans font-black text-[9px] uppercase tracking-wider px-2 py-0.5">{anom.loteId}</Badge>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{anom.finca} · {anom.productor}</span>
                                            </div>
                                            
                                            <div className="flex gap-4 items-start pt-1">
                                                <div className={cn("p-3.5 rounded-2xl shrink-0 border", configDato.color)}>
                                                    <DatoIcon size={24} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-base font-black text-slate-800">
                                                        {configDato.label}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        Valor reportado: <span className="font-black text-slate-800">{anom.valorIngresado}</span> (Media histórica: {anom.valorEsperado})
                                                    </p>
                                                    <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 mt-1">
                                                        Desviación: {anom.desviacionCalculada}
                                                    </span>
                                                </div>
                                            </div>

                                            {anom.comentarioResolucion && (
                                                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 mt-2 text-xs">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Justificación del Cierre</p>
                                                    <p className="text-xs font-semibold text-slate-650 italic mt-1">"{anom.comentarioResolucion}"</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {anom.estadoResolucion === 'Pendiente' ? (
                                            <div className="flex gap-2 shrink-0 w-full md:w-auto">
                                                <Button
                                                    onClick={() => handleOpenAnomalyResolve(anom, 'Confirmado Válido')}
                                                    className="h-10 px-4 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-sans font-black text-[9px] uppercase tracking-wider border-none cursor-pointer flex-1 md:flex-none"
                                                >
                                                    Aprobar Valor
                                                </Button>
                                                <Button
                                                    onClick={() => handleOpenAnomalyResolve(anom, 'Confirmado Error')}
                                                    className="h-10 px-4 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 font-sans font-black text-[9px] uppercase tracking-wider border-none cursor-pointer flex-1 md:flex-none"
                                                >
                                                    Marcar Error
                                                </Button>
                                            </div>
                                        ) : (
                                            <Badge className={cn("border-none text-[8.5px] font-black uppercase tracking-wider px-2.5 py-1 shrink-0 rounded-md", 
                                                anom.estadoResolucion === 'Confirmado Válido' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                            )}>
                                                {anom.estadoResolucion === 'Confirmado Válido' ? 'Válido' : 'Corregido / Error'}
                                            </Badge>
                                        )}
                                    </div>
                                );
                            })}

                            {anomalies.length === 0 && (
                                <div className="text-center py-20 bg-white border border-slate-100 rounded-[32px] w-full">
                                    <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 animate-bounce" />
                                    <p className="font-sans font-black text-slate-400 text-lg">No se detectaron anomalías históricas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Moderación de Valoraciones de Clientes Finales */}
            {pendientes.length > 0 && (
                <div className="bg-slate-50 border border-slate-200/60 rounded-[40px] p-8 md:p-10 space-y-6 text-left mt-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-900/10 p-3 rounded-2xl text-blue-950">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-sans font-black text-slate-800">Valoraciones del Consumidor Final</h2>
                            <p className="text-xs font-semibold text-slate-400">Mensajes enviados desde el código QR público que requieren aprobación antes de mostrarse al productor</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {pendientes.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-3xl border border-slate-200/60 p-6 flex flex-col justify-between gap-4 shadow-sm"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-blue-50 text-blue-800 border-none font-bold text-[9px] uppercase tracking-wider">{comment.loteCode}</Badge>
                                            <span className="text-[10px] text-slate-400 font-bold">{comment.fecha}</span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500 italic">"{comment.texto}"</p>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                        <Button
                                            onClick={() => handleRechazarValoracion(comment.id)}
                                            className="h-9 px-4 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 border-none font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                                        >
                                            Descartar
                                        </Button>
                                        <Button
                                            onClick={() => handleAprobarValoracion(comment)}
                                            className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-black text-white border-none font-black text-[10px] uppercase tracking-widest cursor-pointer"
                                        >
                                            Aprobar y Mostrar
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Modales */}
            <AnimatePresence>
                {isValidationOpen && selectedLoteForValidation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsValidationOpen(false)}
                            className="fixed inset-0 bg-black"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-8 max-w-2xl w-full relative z-10 space-y-6 text-left"
                        >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-3">
                                        <ShieldCheck size={24} className="text-amber-500" />
                                        Validación Stage-Gate
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Lote: {selectedLoteForValidation.id} — {selectedLoteForValidation.productor}</p>
                                </div>
                                <button onClick={() => setIsValidationOpen(false)} className="h-8 w-8 rounded-full bg-slate-50 border-none text-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Historial Logístico / Validación */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-440">Historial de Transiciones</h4>
                                <div className="max-h-48 overflow-y-auto space-y-3 pr-2 border border-slate-50 p-4 rounded-2xl bg-slate-50/50">
                                    {getValidationStageForLote(selectedLoteForValidation.id).historial.map((log, idx) => (
                                        <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs space-y-1.5 text-xs">
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-slate-100 text-slate-700 border-none font-sans font-black text-[8px] uppercase tracking-wider px-2 py-0.5">
                                                    {log.estadoNuevo}
                                                </Badge>
                                                <span className="text-[9px] font-bold text-slate-400">{log.timestamp}</span>
                                            </div>
                                            <p className="font-semibold text-slate-700">Por: <span className="font-black">{log.responsable}</span></p>
                                            {log.motivo && (
                                                <p className="text-slate-500 font-medium italic">"{log.motivo}"</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSaveValidation} className="space-y-5">
                                {/* Next Stage selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-440">Siguiente Estado de Validación</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {(['Capturado', 'En validación', 'Validado', 'Rechazado', 'Publicado'] as ValidationStage[]).map((stage) => {
                                            const activeColors = {
                                                'Capturado': 'border-slate-400 bg-slate-50 text-slate-800',
                                                'En validación': 'border-amber-500 bg-amber-50/50 text-amber-800',
                                                'Validado': 'border-blue-500 bg-blue-50/50 text-blue-800',
                                                'Rechazado': 'border-rose-500 bg-rose-50/50 text-rose-800',
                                                'Publicado': 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
                                            };
                                            const isSelected = nextValidationStage === stage;
                                            return (
                                                <button
                                                    key={stage}
                                                    type="button"
                                                    onClick={() => setNextValidationStage(stage)}
                                                    className={cn(
                                                        "p-3 rounded-xl border-2 text-center font-sans font-black text-[9px] uppercase tracking-wider cursor-pointer transition-all hover:scale-102",
                                                        isSelected ? activeColors[stage] : "border-slate-100 bg-white text-slate-400"
                                                    )}
                                                >
                                                    {stage}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Observations */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-440">Observaciones y Justificación *</label>
                                    <textarea
                                        required
                                        value={validationMotivo}
                                        onChange={e => setValidationMotivo(e.target.value)}
                                        placeholder="Escribe el motivo del cambio, observaciones de los linderos, peso o calidad..."
                                        rows={3}
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold text-slate-700 outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <Button type="button" onClick={() => setIsValidationOpen(false)} variant="outline" className="h-12 px-6 rounded-xl text-slate-500 font-bold border-slate-200">Cancelar</Button>
                                    <Button type="submit" className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer">
                                        Registrar Transición
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {isAnomalyResolveOpen && selectedAnomaly && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAnomalyResolveOpen(false)}
                            className="fixed inset-0 bg-black"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-8 max-w-lg w-full relative z-10 space-y-6 text-left"
                        >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-3">
                                        <AlertTriangle size={24} className="text-amber-500" />
                                        Resolver Anomalía
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Lote: {selectedAnomaly.loteId} — {selectedAnomaly.tipoDato.replace('_', ' ')}</p>
                                </div>
                                <button onClick={() => setIsAnomalyResolveOpen(false)} className="h-8 w-8 rounded-full bg-slate-50 border-none text-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-450">Valor Ingresado:</span>
                                    <span className="font-black text-slate-850">{selectedAnomaly.valorIngresado}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-450">Esperado (Media):</span>
                                    <span className="font-black text-slate-800">{selectedAnomaly.valorEsperado}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-450">Desviación:</span>
                                    <span className="font-black text-amber-700">{selectedAnomaly.desviacionCalculada}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSaveAnomalyResolve} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-455">Dictamen del Validador</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setResolveEstado('Confirmado Válido')}
                                            className={cn(
                                                "p-3 rounded-xl border-2 text-center font-sans font-black text-[10px] uppercase tracking-wider cursor-pointer transition-all",
                                                resolveEstado === 'Confirmado Válido' ? "border-emerald-500 bg-emerald-50/50 text-emerald-800" : "border-slate-100 bg-white text-slate-400"
                                            )}
                                        >
                                            Confirmar Válido
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setResolveEstado('Confirmado Error')}
                                            className={cn(
                                                "p-3 rounded-xl border-2 text-center font-sans font-black text-[10px] uppercase tracking-wider cursor-pointer transition-all",
                                                resolveEstado === 'Confirmado Error' ? "border-rose-500 bg-rose-50/50 text-rose-800" : "border-slate-100 bg-white text-slate-400"
                                            )}
                                        >
                                            Marcar como Error
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-455">Respuestas Rápidas</Label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(resolveEstado === 'Confirmado Válido' ? [
                                            'Confirmado por productor (excepción climática legítima)',
                                            'Revisado y validado en campo por Mesa de Control',
                                            'Variación típica de fin de cosecha'
                                        ] : [
                                            'Error de digitación (exceso de ceros detectado)',
                                            'Fecha inconsistente con el periodo de cosecha del lote',
                                            'Kilos de cereza irrealistas para el área de cultivo'
                                        ]).map((quickMsg) => (
                                            <button
                                                key={quickMsg}
                                                type="button"
                                                onClick={() => setResolveComentario(quickMsg)}
                                                className="text-[9px] font-bold text-slate-650 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-lg border-none cursor-pointer text-left"
                                            >
                                                {quickMsg}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-455">Justificación u Observaciones *</Label>
                                    <textarea
                                        required
                                        value={resolveComentario}
                                        onChange={e => setResolveComentario(e.target.value)}
                                        placeholder="Escriba el motivo de la resolución..."
                                        rows={3}
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <Button type="button" onClick={() => setIsAnomalyResolveOpen(false)} variant="outline" className="h-12 px-6 rounded-xl text-slate-500 font-bold border-slate-200">Cancelar</Button>
                                    <Button type="submit" className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer">
                                        Registrar Resolución
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
