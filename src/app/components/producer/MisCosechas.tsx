"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus,
    Search,
    Tractor,
    ChevronRight,
    Calendar,
    BadgeCheck,
    Loader2,
    Sprout,
    CheckCircle,
    ArrowRight,
    FlaskConical,
    Settings,
    Target,
    ClipboardList,
    Sun,
    Coffee,
    TrendingUp,
    X,
    Scale,
    AlertTriangle
} from 'lucide-react';
import { getValidationStageForLote, updateValidationStage, updateLote } from '../../../services/lotesService';
import { detectAnomaly } from '../../../services/anomaliesService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { cn } from '../ui/utils';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import type { Cosecha } from '../../types/cosecha';
import { getCosechas, saveCosechas } from '../../../services/cosechasService';

interface ModalAccionState {
    tipo: 'sumar_cereza' | 'avanzar_seco' | 'avanzar_verde' | 'anotar_proceso' | 'anotar_cata' | 'ver_rendimiento' | 'anotar_factor';
    lote: any;
}

export function MisCosechas() {
    const navigate = useNavigate();
    const [cosechas, setCosechas] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    
    // Estado unificado para modales enfocados y limpios
    const [modalAccion, setModalAccion] = useState<ModalAccionState | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [factorValue, setFactorValue] = useState('');

    // Correction Flow States
    const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
    const [correctionLote, setCorrectionLote] = useState<any | null>(null);
    const [correctionPeso, setCorrectionPeso] = useState('');
    const [correctionProceso, setCorrectionProceso] = useState('');
    const [correctionVariedad, setCorrectionVariedad] = useState('');
    const [correctionMotivoReject, setCorrectionMotivoReject] = useState('');

    const handleOpenCorrectionModal = (lote: any, motivo: string) => {
        setCorrectionLote(lote);
        setCorrectionPeso(lote.pesos.cereza || lote.pesos.objetivo || '0');
        setCorrectionProceso(lote.detallesObjetivo?.proceso || 'Lavado');
        setCorrectionVariedad(lote.detallesObjetivo?.variedad || 'Bourbon Rosado');
        setCorrectionMotivoReject(motivo);
        setIsCorrectionOpen(true);
    };

    const handleSaveCorrection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!correctionLote) return;
        
        // Actualizar en lotes_produccion
        const updated = cosechas.map(l => {
            if (l.id === correctionLote.id) {
                return {
                    ...l,
                    pesos: { ...l.pesos, cereza: Number(correctionPeso) },
                    detallesObjetivo: {
                        ...l.detallesObjetivo,
                        proceso: correctionProceso,
                        variedad: correctionVariedad
                    }
                };
            }
            return l;
        });
        await updateLotes(updated);
        
        // Actualizar en odisea_lotes_master
        await updateLote(correctionLote.codigo, {
            variedad: correctionVariedad,
            proceso: correctionProceso,
            pesos: {
                cereza: Number(correctionPeso),
                pergamino: 0,
                verde: 0
            }
        });
        
        // Cambiar Stage Gate a 'En validación'
        await updateValidationStage(correctionLote.codigo, 'En validación', 'Productor María González', 'Registro corregido y enviado para re-evaluación.');
        const newStage = await getValidationStageForLote(correctionLote.codigo);
        setValidationStages(prev => ({
            ...prev,
            [correctionLote.codigo]: newStage
        }));
        
        setIsCorrectionOpen(false);
        toast.success(`Lote ${correctionLote.codigo} re-sometido con éxito`, {
            description: 'El lote ha vuelto a la cola de validación de la Mesa de Control.'
        });
    };

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationStages, setValidationStages] = useState<Record<string, any>>({});

    useEffect(() => {
        setIsLoading(true);
        getCosechas()
            .then(async (data) => {
                setCosechas(data);
                // Pre-load validation stages
                const stages: Record<string, any> = {};
                for (const item of data) {
                    stages[item.codigo] = await getValidationStageForLote(item.codigo);
                }
                setValidationStages(stages);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Error al cargar las cosechas');
                setIsLoading(false);
            });
    }, []);

    const updateLotes = async (newCosechas: any[]) => {
        setCosechas(newCosechas);
        try {
            await saveCosechas(newCosechas);
        } catch (err) {
            toast.error('Error al guardar las cosechas');
        }
    };

    // Al abrir un modal, limpiamos los inputs
    const handleOpenModal = (accion: ModalAccionState) => {
        setInputValue('');
        setSelectValue('');
        setFactorValue('');
        setModalAccion(accion);
    };

    const handleIniciarSecado = (lote: any) => {
        const updated = cosechas.map(l => {
            if (l.id === lote.id) {
                return { ...l, fase: 2, estado: 'En Secado', pesos: { ...l.pesos, pergamino: 0 } };
            }
            return l;
        });
        updateLotes(updated);
        toast.success(`Lote ${lote.codigo} trasladado a marquesinas de secado.`);
    };

    const handleConfirmarAccion = async () => {
        if (!modalAccion) return;
        const { tipo, lote } = modalAccion;

        if (tipo === 'sumar_cereza') {
            const kilos = parseFloat(inputValue);
            if (!kilos || isNaN(kilos) || kilos <= 0) {
                toast.error('Ingresa una cantidad válida');
                return;
            }
            // Prepare updated array
            let finalNewCereza = 0;
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    const newCereza = (l.pesos.cereza || 0) + kilos;
                    finalNewCereza = newCereza;
                    return { ...l, pesos: { ...l.pesos, cereza: newCereza }, fase: Math.max(1, l.fase), estado: 'Cereza (Fresco)' };
                }
                return l;
            });
            await updateLotes(updated);
            toast.success(`Sumados ${kilos} Kg de cereza al ${lote.codigo}`);

            // Verificar anomalía histórica de cereza asíncronamente
            try {
                const check = await detectAnomaly(lote.codigo, 'peso_cereza', finalNewCereza, lote.finca || 'Finca La Esperanza', 'María González');
                if (check) {
                    toast.warning('Discrepancia Histórica de Peso', {
                        description: `Los ${finalNewCereza} Kg acumulados difieren significativamente de la media de esta finca. Registrado para revisión.`
                    });
                }
            } catch (e) {
                console.error(e);
            }
        } 
        else if (tipo === 'avanzar_seco') {
            const kilos = parseFloat(inputValue);
            if (!kilos || isNaN(kilos) || kilos <= 0) {
                toast.error('Ingresa los kilos de pergamino seco obtenidos');
                return;
            }
            const factor = parseFloat(factorValue);
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    return { 
                        ...l, 
                        pesos: { ...l.pesos, pergamino: kilos }, 
                        fase: 2, 
                        estado: 'Pergamino Seco (Listo)',
                        factorRendimiento: (!isNaN(factor) && factor > 0) ? factor : l.factorRendimiento || null
                    };
                }
                return l;
            });
            await updateLotes(updated);
            toast.success(`Lote ${lote.codigo} actualizado con ${kilos} Kg de pergamino seco.`);

            // Verificar anomalía de pergamino y factor asíncronamente
            try {
                const checkPeso = await detectAnomaly(lote.codigo, 'peso_pergamino', kilos, lote.finca || 'Finca La Esperanza', 'María González');
                let checkFactor = null;
                if (!isNaN(factor) && factor > 0) {
                    checkFactor = await detectAnomaly(lote.codigo, 'factor_rendimiento', factor, lote.finca || 'Finca La Esperanza', 'María González');
                }
                if (checkPeso || checkFactor) {
                    toast.warning('Discrepancia Histórica Detectada', {
                        description: 'Los valores de pergamino o factor de rendimiento se desvían de los históricos de la finca. Registrado para revisión.'
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
        else if (tipo === 'avanzar_verde') {
            const kilos = parseFloat(inputValue);
            if (!kilos || isNaN(kilos) || kilos <= 0) {
                toast.error('Ingresa los kilos de café verde obtenidos');
                return;
            }
            const factor = parseFloat(factorValue);
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    return { 
                        ...l, 
                        pesos: { ...l.pesos, verde: kilos }, 
                        fase: 3, 
                        estado: 'Verde (Trillado)',
                        factorRendimiento: (!isNaN(factor) && factor > 0) ? factor : l.factorRendimiento || null
                    };
                }
                return l;
            });
            updateLotes(updated);
            toast.success(`Lote ${lote.codigo} trillado con éxito: ${kilos} Kg de Verde`);
        }
        else if (tipo === 'anotar_proceso') {
            if (!selectValue) {
                toast.error('Selecciona un proceso');
                return;
            }
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    return { ...l, detallesObjetivo: { variedad: 'Mezcla / Definida', proceso: selectValue } };
                }
                return l;
            });
            updateLotes(updated);
            toast.success(`Proceso ${selectValue} asignado al lote`);
        }
        else if (tipo === 'anotar_cata') {
            const ptos = parseFloat(inputValue);
            if (!ptos || isNaN(ptos) || ptos < 50 || ptos > 100) {
                toast.error('Ingresa un puntaje válido (ej. 85.5)');
                return;
            }
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    return { ...l, calificacion: ptos };
                }
                return l;
            });
            updateLotes(updated);
            toast.success(`Puntaje de ${ptos} registrado exitosamente`);
        }
        else if (tipo === 'anotar_factor') {
            const factor = parseFloat(inputValue);
            if (!factor || isNaN(factor) || factor <= 0) {
                toast.error('Ingresa un factor de rendimiento válido (ej. 90.5)');
                return;
            }
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    return { ...l, factorRendimiento: factor };
                }
                return l;
            });
            await updateLotes(updated);
            toast.success(`Factor de Rendimiento de ${factor} registrado para el lote ${lote.codigo}`);

            // Verificar anomalía de factor de rendimiento asíncronamente
            try {
                const check = await detectAnomaly(lote.codigo, 'factor_rendimiento', factor, lote.finca || 'Finca La Esperanza', 'María González');
                if (check) {
                    toast.warning('Factor de Rendimiento Atípico', {
                        description: `El factor de rendimiento (${factor}) se desvía del historial de la finca. Registrado para revisión.`
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }

        setModalAccion(null);
    };

    const handleOfrecerLote = (loteId: string) => {
        const updated = cosechas.map(l => {
            if (l.id === loteId) {
                const offered = !l.ofrecidoPorProductor;
                try {
                    const rawMaster = localStorage.getItem('odisea_lotes_master');
                    if (rawMaster) {
                        const masterLotes = JSON.parse(rawMaster);
                        const updatedMaster = masterLotes.map((ml: any) => {
                            if (ml.id === l.codigo || ml.id === l.id) {
                                return { ...ml, ofrecidoPorProductor: offered };
                            }
                            return ml;
                        });
                        localStorage.setItem('odisea_lotes_master', JSON.stringify(updatedMaster));
                    }
                } catch (e) {}

                return { ...l, ofrecidoPorProductor: offered };
            }
            return l;
        });
        updateLotes(updated);
        toast.success('Estado de oferta actualizado', {
            description: 'El lote ha sido propuesto para comercialización y espera aprobación de Odisea.'
        });
    };

    const filteredCosechas = cosechas.filter(c => {
        const matchesSearch =
            c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.finca.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Todos' || 
            (statusFilter === 'Cereza' && c.fase === 1) ||
            (statusFilter === 'Seco' && c.fase === 2) ||
            (statusFilter === 'Verde' && c.fase === 3);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pb-20">
            {/* Encabezado Superior */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                <div>
                    <h1 className="text-4xl font-sans font-black text-gray-900 tracking-tight">Gestión de Lotes</h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">
                        Lleva el control visual de tu café desde que se recolecta hasta que está listo para vender.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/producer/cosechas/nueva')}
                    className="bg-[#5f705f] text-white h-16 px-8 rounded-full font-black text-lg shadow-xl shadow-[#5f705f]/20 hover:bg-[#4a584a] active:scale-95 w-full sm:w-auto"
                >
                    <Plus size={24} className="mr-2" /> Crear Nuevo Lote
                </Button>
            </div>

            {/* Barra de Búsqueda y Filtros Rápidos */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="Buscar por código o finca..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-12 rounded-2xl border-none bg-gray-50 font-bold text-gray-800"
                    />
                </div>
                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                    {['Todos', 'Cereza', 'Seco', 'Verde'].map((f) => (
                        <Button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            variant={statusFilter === f ? 'default' : 'ghost'}
                            className={cn(
                                "h-12 rounded-xl font-black text-xs uppercase px-4",
                                statusFilter === f ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Listado de Lotes (Tarjetas Limpias y Enfocadas) */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-6 animate-pulse">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-[32px] border-2 border-gray-100 p-8 h-48 flex flex-col justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-12 text-center bg-red-50 rounded-[32px] border border-red-100 space-y-4">
                        <AlertTriangle className="text-red-500 mx-auto" size={48} />
                        <h3 className="text-xl font-sans font-black text-red-900">Algo salió mal</h3>
                        <p className="text-red-700/80 font-medium">{error}</p>
                        <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2 rounded-xl">Reintentar</Button>
                    </div>
                ) : (
                    <>
                        {filteredCosechas.map((lote) => (
                    <div key={lote.id} className="bg-white rounded-[32px] border-2 border-gray-100 p-6 sm:p-8 shadow-sm space-y-6 hover:border-gray-200 transition-all">
                        
                        {/* Fila Superior: Identificación y Estado */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap gap-2 items-center mb-2">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase px-2.5 py-1 rounded-lg text-white tracking-wider",
                                        lote.modalidad === 'objetivo' ? "bg-[#5f705f]" : "bg-[#bb8d3b]"
                                    )}>
                                        {lote.modalidad === 'objetivo' ? 'Meta Planeada' : 'Recolección Libre'}
                                    </span>
                                    {lote.factorRendimiento && (
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider">
                                            Factor: {lote.factorRendimiento}
                                        </span>
                                    )}
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{lote.finca}</span>
                                    {lote.parcelas?.[0] && <span className="text-xs font-bold text-gray-400">• {lote.parcelas[0]}</span>}
                                    
                                    {/* Stage Gate Validation Status Badge */}
                                    {(() => {
                                        const vRecord = validationStages[lote.codigo] || { stage: 'Capturado', historial: [] };
                                        const badgeColors = {
                                            'Capturado': 'bg-slate-100 text-slate-700 border border-slate-200',
                                            'En validación': 'bg-amber-100 text-amber-700 border border-amber-200',
                                            'Validado': 'bg-blue-100 text-blue-700 border border-blue-200',
                                            'Rechazado': 'bg-rose-100 text-rose-700 border border-rose-250 animate-pulse',
                                            'Publicado': 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                        };
                                        return (
                                            <Badge className={cn("border-none text-[9px] font-sans font-black px-2.5 py-1 uppercase tracking-wider rounded-lg", badgeColors[vRecord.stage])}>
                                                Validación: {vRecord.stage}
                                            </Badge>
                                        );
                                    })()}
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight">{lote.codigo}</h3>
                                
                                {/* Alerta de rechazo con botón de corrección */}
                                {(() => {
                                    const vRecord = validationStages[lote.codigo] || { stage: 'Capturado', historial: [] };
                                    if (vRecord.stage === 'Rechazado') {
                                        const lastLog = [...vRecord.historial].reverse().find(h => h.estadoNuevo === 'Rechazado');
                                        return (
                                            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl space-y-2 mt-3 text-left">
                                                <div className="flex items-center gap-2 text-rose-800 font-sans font-black text-xs uppercase tracking-wider">
                                                    <AlertTriangle size={16} /> Registro Rechazado por Mesa de Control
                                                </div>
                                                <p className="text-xs font-semibold text-rose-750">
                                                    Observación: <span className="font-bold text-rose-900">"{lastLog?.motivo || 'Revisar linderos y pesos.'}"</span>
                                                </p>
                                                <div className="pt-2">
                                                    <Button
                                                        onClick={() => handleOpenCorrectionModal(lote, lastLog?.motivo || '')}
                                                        className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-sans font-black text-[10px] uppercase tracking-widest border-none cursor-pointer"
                                                    >
                                                        Corregir y Re-someter
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                                {lote.detallesObjetivo?.proceso && (
                                    <p className="text-sm font-bold text-gray-600 mt-1 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#5f705f]"></span>
                                        Proceso: <span className="text-[#5f705f]">{lote.detallesObjetivo.proceso}</span> 
                                        {lote.detallesObjetivo.variedad && <span>({lote.detallesObjetivo.variedad})</span>}
                                    </p>
                                )}
                                {lote.modalidad === 'objetivo' && lote.pesos.objetivoFinal && (
                                    <div className="mt-3 flex flex-wrap gap-2 items-center bg-gray-50/80 p-2.5 rounded-xl border border-gray-100/80">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-md border border-gray-100 shadow-2xs">
                                            <span className="text-[10px] font-black uppercase text-[#5f705f]">Meta Final:</span>
                                            <span className="text-xs font-black text-gray-900">{lote.pesos.objetivoFinal} Kg Verde</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-md border border-gray-100 shadow-2xs">
                                            <span className="text-[10px] font-black uppercase text-red-500">A Recolectar:</span>
                                            <span className="text-xs font-black text-gray-900">{lote.pesos.objetivo} Kg Cereza</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Estado y Volumen Actual Gigante */}
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                               <div>
                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest sm:text-right">Etapa Actual</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        {lote.fase === 0 && <span className="text-lg">🎯</span>}
                                        {lote.fase === 1 && <span className="text-lg">🍒</span>}
                                        {lote.fase === 2 && <span className="text-lg">☀️</span>}
                                        {lote.fase === 3 && <span className="text-lg">🌾</span>}
                                        <span className={cn(
                                            "font-black text-sm uppercase tracking-wide",
                                            lote.fase === 0 ? "text-gray-500" :
                                            lote.fase === 1 ? "text-red-600" :
                                            lote.fase === 2 ? "text-amber-600" : "text-[#5f705f]"
                                        )}>
                                            {lote.fase === 0 ? 'Meta Planeada' : lote.fase === 1 ? 'Cereza Fresca' : lote.fase === 2 ? (lote.pesos.pergamino > 0 ? 'Pergamino Seco' : 'En Secado') : 'Café Verde'}
                                        </span>
                                    </div>
                               </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest hidden sm:block">Volumen</p>
                                    <p className="text-2xl font-black text-gray-900">
                                        {lote.fase <= 1 ? `${lote.pesos.cereza || 0} Kg` :
                                         lote.fase === 2 ? (lote.pesos.pergamino > 0 ? `${lote.pesos.pergamino} Kg` : 'En proceso...') :
                                         `${lote.pesos.verde || 0} Kg`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Barra de Progreso de la Meta (Si aplica) */}
                        {lote.modalidad === 'objetivo' && lote.pesos.objetivo > 0 && (
                            <div className="bg-[#5f705f]/5 p-4 rounded-2xl border border-[#5f705f]/10 space-y-2 mt-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs font-black">
                                    <div className="flex items-center gap-1.5">
                                        <span className="uppercase tracking-wider text-[#5f705f]">Progreso Recolección</span>
                                        {lote.pesos.objetivoFinal && (
                                            <span className="text-[10px] bg-white px-2 py-0.5 rounded border text-gray-500 font-bold">
                                                Meta Final: {lote.pesos.objetivoFinal} Kg Verde
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-gray-900 font-sans font-black text-sm">
                                        {lote.pesos.cereza || 0} <span className="text-gray-400 font-bold text-xs">/ {lote.pesos.objetivo} Kg Cereza</span>
                                    </span>
                                </div>
                                <div className="h-3 bg-white rounded-full overflow-hidden p-0.5 border border-gray-200/60 shadow-inner">
                                    <div 
                                        className="h-full bg-[#5f705f] rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min(100, ((lote.pesos.cereza || 0) / lote.pesos.objetivo) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-[#5f705f]/80 font-bold text-right">
                                    {(((lote.pesos.cereza || 0) / lote.pesos.objetivo) * 100).toFixed(0)}% de la cereza requerida
                                </p>
                            </div>
                        )}

                        {/* Fila Inferior: Botones de Acción Claros */}
                        <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="flex flex-col sm:flex-row gap-2 grow">
                                {lote.fase <= 1 && (
                                    <>
                                        <Button
                                            onClick={() => handleOpenModal({ tipo: 'sumar_cereza', lote })}
                                            variant="outline"
                                            className="h-12 rounded-xl border-2 font-black text-xs text-gray-700 hover:bg-gray-50 uppercase tracking-wider"
                                        >
                                            + Sumar Cereza Hoy
                                        </Button>
                                        {lote.modalidad === 'diario' && !lote.detallesObjetivo?.proceso && (
                                            <Button
                                                onClick={() => handleOpenModal({ tipo: 'anotar_proceso', lote })}
                                                className="h-12 rounded-xl bg-[#bb8d3b] hover:bg-[#a07830] text-white font-black text-xs uppercase tracking-wider"
                                            >
                                                Elegir Proceso
                                            </Button>
                                        )}
                                        {lote.pesos.cereza > 0 && (
                                            <Button
                                                onClick={() => handleIniciarSecado(lote)}
                                                className="h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider grow sm:grow-0"
                                            >
                                                ☀️ Iniciar Secado
                                            </Button>
                                        )}
                                    </>
                                )}

                                {lote.fase === 2 && (
                                    <>
                                        {!(lote.pesos.pergamino > 0) ? (
                                            <Button
                                                onClick={() => handleOpenModal({ tipo: 'avanzar_seco', lote })}
                                                className="h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider w-full sm:w-auto"
                                            >
                                                ⚖️ Registrar Peso Seco
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={() => handleOpenModal({ tipo: 'avanzar_verde', lote })}
                                                    className="h-12 rounded-xl bg-[#5f705f] hover:bg-[#4a584a] text-white font-black text-xs uppercase tracking-wider w-full sm:w-auto"
                                                >
                                                    🌾 Pasar a Trillado (Verde)
                                                </Button>
                                                <Button
                                                    onClick={() => handleOpenModal({ tipo: 'anotar_factor', lote })}
                                                    className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider w-full sm:w-auto"
                                                >
                                                    📊 Anotar Factor
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}

                                {lote.fase === 3 && (
                                    <>
                                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-full sm:w-auto justify-between">
                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Calidad en Taza:</span>
                                            {lote.calificacion > 0 ? (
                                                <span className="text-lg font-black text-[#bb8d3b]">⭐ {lote.calificacion} Ptos</span>
                                            ) : (
                                                <Button
                                                    onClick={() => handleOpenModal({ tipo: 'anotar_cata', lote })}
                                                    size="sm"
                                                    className="h-8 bg-white text-gray-900 border font-black text-[10px] uppercase rounded-lg shadow-sm hover:bg-gray-50"
                                                >
                                                    Anotar Puntaje
                                                </Button>
                                            )}
                                        </div>
                                        <Button
                                            onClick={() => handleOpenModal({ tipo: 'anotar_factor', lote })}
                                            className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider w-full sm:w-auto"
                                        >
                                            📊 Anotar/Editar Factor
                                        </Button>
                                        <Button
                                            onClick={() => handleOfrecerLote(lote.id)}
                                            className={cn(
                                                "h-12 rounded-xl font-black text-xs uppercase tracking-wider w-full sm:w-auto border-none text-white",
                                                lote.ofrecidoPorProductor
                                                    ? (lote.aprobadoComercializacion ? "bg-emerald-600 hover:bg-emerald-700" : "bg-sky-600 hover:bg-sky-700")
                                                    : "bg-[#bb8d3b] hover:bg-[#a07830]"
                                            )}
                                        >
                                            {lote.ofrecidoPorProductor
                                                ? (lote.aprobadoComercializacion ? "✓ En Marketplace" : "⏱️ Pendiente Aprobación")
                                                : "📢 Ofrecer a Tostadores"
                                            }
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Botón para ver Rendimientos/Mermas */}
                            <Button
                                onClick={() => handleOpenModal({ tipo: 'ver_rendimiento', lote })}
                                variant="ghost"
                                className="h-12 rounded-xl font-black text-xs text-gray-400 hover:text-gray-600 shrink-0"
                            >
                                📊 Ver Historia y Mermas
                            </Button>
                    </div>
                ))}

                {filteredCosechas.length === 0 && (
                    <div className="p-16 text-center rounded-[32px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold text-lg">No se encontraron lotes activos.</p>
                        <p className="text-gray-400 text-sm mt-1">Usa el botón superior para empezar a rastrear tu café.</p>
                    </div>
                )}
                    </>
                )}
            </div>

            {/* MODALES UNIFICADOS DE ACCIÓN */}
            <Dialog open={!!modalAccion} onOpenChange={(open) => !open && setModalAccion(null)}>
                <DialogContent className="rounded-[32px] p-8 max-w-[420px] border-none shadow-2xl">
                    {modalAccion?.tipo === 'sumar_cereza' && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                <Scale size={32} />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-gray-900">Sumar Recolección</DialogTitle>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 mx-auto">
                                    Código Lote: <span className="font-black text-gray-900">{modalAccion.lote.codigo}</span>
                                </div>
                                <DialogDescription className="text-sm text-gray-500 mt-3">
                                    ¿Cuántos kilos de cereza fresca ingresaron hoy?
                                </DialogDescription>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="h-20 rounded-2xl bg-gray-50 border-none text-center text-4xl font-black text-red-600 focus:ring-4 focus:ring-red-100"
                                    autoFocus
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">Kg</span>
                            </div>
                            <Button
                                onClick={handleConfirmarAccion}
                                className="w-full h-14 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-wider"
                            >
                                Confirmar Kilos
                            </Button>
                        </div>
                    )}

                    {modalAccion?.tipo === 'avanzar_seco' && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                                <Sun size={32} />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-gray-900">Registrar Peso Seco</DialogTitle>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 mx-auto">
                                    Código Lote: <span className="font-black text-gray-900">{modalAccion.lote.codigo}</span>
                                </div>
                                <DialogDescription className="text-sm text-gray-500 mt-3">
                                    Pesa tu café seco y anota cuántos kilos de **Pergamino Seco** te quedaron en total:
                                </DialogDescription>
                            </div>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="Kilos Pergamino"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="h-16 rounded-2xl bg-gray-50 border-none text-center text-2xl font-black text-amber-600 focus:ring-4 focus:ring-amber-100"
                                        autoFocus
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">Kg</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="Factor de Rendimiento (Opcional - ej: 91.5)"
                                        value={factorValue}
                                        onChange={(e) => setFactorValue(e.target.value)}
                                        className="h-16 rounded-2xl bg-gray-50 border-none text-center text-lg font-bold text-gray-700 focus:ring-4 focus:ring-emerald-100"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleConfirmarAccion}
                                className="w-full h-14 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-wider"
                            >
                                Guardar Datos de Secado
                            </Button>
                        </div>
                    )}

                    {modalAccion?.tipo === 'avanzar_verde' && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-[#5f705f]/10 text-[#5f705f] rounded-full flex items-center justify-center mx-auto">
                                <Coffee size={32} />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-gray-900">Trillar Café (Verde)</DialogTitle>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 mx-auto">
                                    Código Lote: <span className="font-black text-gray-900">{modalAccion.lote.codigo}</span>
                                </div>
                                <DialogDescription className="text-sm text-gray-500 mt-3">
                                    Anota el peso final resultante y el factor de rendimiento obtenido:
                                </DialogDescription>
                            </div>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="Kilos Verde"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="h-16 rounded-2xl bg-gray-50 border-none text-center text-2xl font-black text-[#5f705f] focus:ring-4 focus:ring-[#5f705f]/10"
                                        autoFocus
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">Kg</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="Factor de Rendimiento (Opcional - ej: 91.5)"
                                        value={factorValue}
                                        onChange={(e) => setFactorValue(e.target.value)}
                                        className="h-16 rounded-2xl bg-gray-50 border-none text-center text-lg font-bold text-gray-700 focus:ring-4 focus:ring-emerald-100"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleConfirmarAccion}
                                className="w-full h-14 rounded-xl bg-[#5f705f] hover:bg-[#4a584a] text-white font-black text-sm uppercase tracking-wider"
                            >
                                Confirmar Peso Verde
                            </Button>
                        </div>
                    )}

                    {modalAccion?.tipo === 'anotar_proceso' && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-[#bb8d3b]/10 text-[#bb8d3b] rounded-full flex items-center justify-center mx-auto">
                                <Settings size={32} />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-gray-900">Elegir Proceso</DialogTitle>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 mx-auto">
                                    Código Lote: <span className="font-black text-gray-900">{modalAccion.lote.codigo}</span>
                                </div>
                                <DialogDescription className="text-sm text-gray-500 mt-3">
                                    Define cómo procesarás la cereza acumulada en este lote:
                                </DialogDescription>
                            </div>
                            <Select value={selectValue} onValueChange={setSelectValue}>
                                <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none text-center font-black text-gray-800">
                                    <SelectValue placeholder="Selecciona el proceso..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100">
                                    <SelectItem value="Lavado">Lavado</SelectItem>
                                    <SelectItem value="Natural">Natural</SelectItem>
                                    <SelectItem value="Honey">Honey</SelectItem>
                                    <SelectItem value="Fermentación anaeróbica">Fermentación anaeróbica</SelectItem>
                                    <SelectItem value="Fermentación carbónica">Fermentación carbónica</SelectItem>
                                    <SelectItem value="Fermentación con levadura">Fermentación con levadura</SelectItem>
                                    <SelectItem value="Cofermentación">Cofermentación</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleConfirmarAccion}
                                className="w-full h-14 rounded-xl bg-[#bb8d3b] hover:bg-[#a07830] text-white font-black text-sm uppercase tracking-wider"
                            >
                                Asignar Proceso
                            </Button>
                        </div>
                    )}

                    {modalAccion?.tipo === 'anotar_cata' && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                                <BadgeCheck size={32} />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-gray-900">Puntaje de Cata</DialogTitle>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 mx-auto">
                                    Código Lote: <span className="font-black text-gray-900">{modalAccion.lote.codigo}</span>
                                </div>
                                <DialogDescription className="text-sm text-gray-500 mt-3">
                                    Anota la calificación final que le dio el catador a este lote (escala SCA):
                                </DialogDescription>
                            </div>
                            <Input
                                type="number"
                                placeholder="85.5"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="h-20 rounded-2xl bg-gray-50 border-none text-center text-4xl font-black text-gray-900 focus:ring-4 focus:ring-amber-100"
                                autoFocus
                            />
                            <Button
                                onClick={handleConfirmarAccion}
                                className="w-full h-14 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-wider"
                            >
                                Guardar Calificación
                            </Button>
                        </div>
                    )}

                    {modalAccion?.tipo === 'anotar_factor' && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                <Scale size={32} />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-gray-900">Factor de Rendimiento</DialogTitle>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 mx-auto">
                                    Código Lote: <span className="font-black text-gray-900">{modalAccion.lote.codigo}</span>
                                </div>
                                <DialogDescription className="text-sm text-gray-500 mt-3">
                                    Anota el Factor de Rendimiento calculado para este lote:
                                </DialogDescription>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="Ej. 92.5"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="h-20 rounded-2xl bg-gray-50 border-none text-center text-4xl font-black text-emerald-600 focus:ring-4 focus:ring-emerald-100"
                                    autoFocus
                                />
                            </div>
                            <Button
                                onClick={handleConfirmarAccion}
                                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider"
                            >
                                Guardar Factor
                            </Button>
                        </div>
                    )}

                    {modalAccion?.tipo === 'ver_rendimiento' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <DialogTitle className="text-2xl font-black text-gray-900">Historia y Mermas</DialogTitle>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 mx-auto">
                                    Código Lote: <span className="font-black text-gray-900">{modalAccion.lote.codigo}</span>
                                </div>
                                <DialogDescription className="text-xs text-gray-500 mt-3">
                                    Evolución del peso de tu café.
                                </DialogDescription>
                            </div>

                            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                    <span className="text-xs font-bold text-gray-500">🍒 Cereza Recolectada</span>
                                    <span className="font-black text-sm text-gray-900">{modalAccion.lote.pesos.cereza || 0} Kg</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                    <span className="text-xs font-bold text-gray-500">☀️ Secado (Pergamino)</span>
                                    <span className="font-black text-sm text-gray-900">
                                        {modalAccion.lote.pesos.pergamino > 0 ? `${modalAccion.lote.pesos.pergamino} Kg` : 'Pendiente'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500">🌾 Trillado (Verde)</span>
                                    <span className="font-black text-sm text-[#5f705f]">
                                        {modalAccion.lote.pesos.verde > 0 ? `${modalAccion.lote.pesos.verde} Kg` : 'Pendiente'}
                                    </span>
                                </div>
                            </div>

                            {modalAccion.lote.pesos.cereza > 0 && modalAccion.lote.pesos.pergamino > 0 && (
                                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
                                    <p className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Rendimiento a Pergamino</p>
                                    <p className="text-lg font-black text-amber-600">
                                        {((modalAccion.lote.pesos.pergamino / modalAccion.lote.pesos.cereza) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            )}

                            {/* Mostrar Factor de Rendimiento */}
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center space-y-2">
                                <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Factor de Rendimiento</p>
                                {modalAccion.lote.factorRendimiento ? (
                                    <p className="text-2xl font-black text-emerald-700">{modalAccion.lote.factorRendimiento}</p>
                                ) : (
                                    <p className="text-xs font-bold text-gray-500 italic">No registrado aún</p>
                                )}
                                <Button
                                    onClick={() => handleOpenModal({ tipo: 'anotar_factor', lote: modalAccion.lote })}
                                    size="sm"
                                    className="bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-black uppercase rounded-lg w-full h-8 shadow-xs"
                                >
                                    {modalAccion.lote.factorRendimiento ? 'Modificar Factor' : 'Anotar Factor'}
                                </Button>
                            </div>

                            <Button
                                onClick={() => setModalAccion(null)}
                                className="w-full h-12 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-xs uppercase tracking-wider"
                            >
                                Cerrar
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL: Corrección de Lote Rechazado por Productor */}
            <AnimatePresence>
                {isCorrectionOpen && correctionLote && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCorrectionOpen(false)}
                            className="fixed inset-0 bg-black"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 max-w-lg w-full relative z-10 space-y-6 text-left"
                        >
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-sans font-black text-gray-900 flex items-center gap-3">
                                        <AlertTriangle size={24} className="text-rose-500" />
                                        Corregir Lote Rechazado
                                    </h3>
                                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Lote: {correctionLote.codigo}</p>
                                </div>
                                <button onClick={() => setIsCorrectionOpen(false)} className="h-8 w-8 rounded-full bg-gray-50 border-none text-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-1">
                                <p className="text-[10px] font-black text-rose-950 uppercase leading-none">Motivo de Rechazo reportado:</p>
                                <p className="text-xs text-rose-700 italic font-semibold">"{correctionMotivoReject}"</p>
                            </div>

                            <form onSubmit={handleSaveCorrection} className="space-y-5">
                                {/* Kilos */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-450">Kilos de Cereza (Recolección)</label>
                                    <div className="relative group">
                                        <Input
                                            type="number"
                                            required
                                            value={correctionPeso}
                                            onChange={e => setCorrectionPeso(e.target.value)}
                                            className="h-12 rounded-xl border-gray-200"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">Kg</div>
                                    </div>
                                </div>

                                {/* Proceso */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-455">Proceso Beneficio</label>
                                    <select
                                        value={correctionProceso}
                                        onChange={e => setCorrectionProceso(e.target.value)}
                                        className="h-12 w-full px-4 rounded-xl border border-gray-250 bg-gray-50 font-bold text-gray-700 outline-none"
                                    >
                                        <option value="Lavado">Lavado</option>
                                        <option value="Natural">Natural</option>
                                        <option value="Honey">Honey</option>
                                        <option value="Fermentación anaeróbica">Fermentación anaeróbica</option>
                                    </select>
                                </div>

                                {/* Variedad */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-455">Variedad de Café</label>
                                    <select
                                        value={correctionVariedad}
                                        onChange={e => setCorrectionVariedad(e.target.value)}
                                        className="h-12 w-full px-4 rounded-xl border border-gray-255 bg-gray-50 font-bold text-gray-700 outline-none"
                                    >
                                        <option value="Bourbon Rosado">Bourbon Rosado</option>
                                        <option value="Geisha">Geisha</option>
                                        <option value="Castillo">Castillo</option>
                                        <option value="Caturra">Caturra</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <Button type="button" onClick={() => setIsCorrectionOpen(false)} variant="outline" className="h-12 px-6 rounded-xl text-slate-500 font-bold border-slate-200">Cancelar</Button>
                                    <Button type="submit" className="h-12 px-8 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer">
                                        Guardar y Re-someter
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
