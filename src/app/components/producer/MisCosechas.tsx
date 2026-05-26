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
    Scale
} from 'lucide-react';
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

// Data Mock inicial
const INITIAL_COSECHAS = [
    {
        id: 'lc1',
        codigo: 'LOTE-042',
        productor: 'María González',
        cosecha: 'Oct-Nov 2024',
        finca: 'Finca La Esperanza',
        parcelas: ['Lote El Mirador'],
        estado: 'Verde (Trillado)',
        pesos: { cereza: 1200, pergamino: 250, verde: 180, objetivo: 1500 },
        fase: 3,
        modalidad: 'objetivo',
        detallesObjetivo: { variedad: 'Bourbon Rosado', proceso: 'Lavado' },
        calificacion: 86.5,
        macroperfil: 'Frutal',
        clientes: []
    },
    {
        id: 'lc2',
        codigo: 'LOTE-043',
        productor: 'María González',
        cosecha: 'Nov 2024',
        finca: 'Finca La Esperanza',
        parcelas: ['Lote Central'],
        estado: 'Pergamino (Seco)',
        pesos: { cereza: 800, pergamino: 165, verde: 0 },
        fase: 2,
        modalidad: 'diario',
        calificacion: 0,
        macroperfil: '',
        clientes: []
    },
    {
        id: 'lc3',
        codigo: 'LOTE-101',
        productor: 'María González',
        cosecha: 'Dic 2024',
        finca: 'Finca Santa Helena',
        parcelas: ['Lote Las Piedras'],
        estado: 'Cereza (Fresco)',
        pesos: { cereza: 450, pergamino: 0, verde: 0, objetivo: 500 },
        fase: 1,
        modalidad: 'objetivo',
        detallesObjetivo: { variedad: 'Geisha', proceso: 'Natural' },
        calificacion: 0,
        macroperfil: '',
        clientes: []
    }
];

interface ModalAccionState {
    tipo: 'sumar_cereza' | 'avanzar_seco' | 'avanzar_verde' | 'anotar_proceso' | 'anotar_cata' | 'ver_rendimiento';
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

    useEffect(() => {
        const saved = localStorage.getItem('lotes_produccion');
        if (saved) {
            setCosechas(JSON.parse(saved));
        } else {
            setCosechas(INITIAL_COSECHAS);
            localStorage.setItem('lotes_produccion', JSON.stringify(INITIAL_COSECHAS));
        }
    }, []);

    const updateLotes = (newCosechas: any[]) => {
        setCosechas(newCosechas);
        localStorage.setItem('lotes_produccion', JSON.stringify(newCosechas));
    };

    // Al abrir un modal, limpiamos los inputs
    const handleOpenModal = (accion: ModalAccionState) => {
        setInputValue('');
        setSelectValue('');
        setModalAccion(accion);
    };

    const handleConfirmarAccion = () => {
        if (!modalAccion) return;
        const { tipo, lote } = modalAccion;

        if (tipo === 'sumar_cereza') {
            const kilos = parseFloat(inputValue);
            if (!kilos || isNaN(kilos) || kilos <= 0) {
                toast.error('Ingresa una cantidad válida');
                return;
            }
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    const newCereza = (l.pesos.cereza || 0) + kilos;
                    return { ...l, pesos: { ...l.pesos, cereza: newCereza }, fase: Math.max(1, l.fase), estado: 'Cereza (Fresco)' };
                }
                return l;
            });
            updateLotes(updated);
            toast.success(`Sumados ${kilos} Kg de cereza al ${lote.codigo}`);
        } 
        else if (tipo === 'avanzar_seco') {
            const kilos = parseFloat(inputValue);
            if (!kilos || isNaN(kilos) || kilos <= 0) {
                toast.error('Ingresa los kilos de pergamino seco obtenidos');
                return;
            }
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    return { ...l, pesos: { ...l.pesos, pergamino: kilos }, fase: 2, estado: 'Pergamino (Seco)' };
                }
                return l;
            });
            updateLotes(updated);
            toast.success(`Lote ${lote.codigo} avanzado a Secado con ${kilos} Kg`);
        }
        else if (tipo === 'avanzar_verde') {
            const kilos = parseFloat(inputValue);
            if (!kilos || isNaN(kilos) || kilos <= 0) {
                toast.error('Ingresa los kilos de café verde obtenidos');
                return;
            }
            const updated = cosechas.map(l => {
                if (l.id === lote.id) {
                    return { ...l, pesos: { ...l.pesos, verde: kilos }, fase: 3, estado: 'Verde (Trillado)' };
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

        setModalAccion(null);
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
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{lote.finca}</span>
                                    {lote.parcelas?.[0] && <span className="text-xs font-bold text-gray-400">• {lote.parcelas[0]}</span>}
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight">{lote.codigo}</h3>
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
                                            {lote.fase === 0 ? 'Meta Planeada' : lote.fase === 1 ? 'Cereza Fresca' : lote.fase === 2 ? 'Pergamino Seco' : 'Café Verde'}
                                        </span>
                                    </div>
                               </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest hidden sm:block">Volumen</p>
                                    <p className="text-2xl font-black text-gray-900">
                                        {lote.fase <= 1 ? `${lote.pesos.cereza || 0} Kg` :
                                         lote.fase === 2 ? `${lote.pesos.pergamino || 0} Kg` :
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
                                                onClick={() => handleOpenModal({ tipo: 'avanzar_seco', lote })}
                                                className="h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider grow sm:grow-0"
                                            >
                                                ☀️ Pasar a Secado
                                            </Button>
                                        )}
                                    </>
                                )}

                                {lote.fase === 2 && (
                                    <Button
                                        onClick={() => handleOpenModal({ tipo: 'avanzar_verde', lote })}
                                        className="h-12 rounded-xl bg-[#5f705f] hover:bg-[#4a584a] text-white font-black text-xs uppercase tracking-wider w-full sm:w-auto"
                                    >
                                        🌾 Pasar a Trillado (Verde)
                                    </Button>
                                )}

                                {lote.fase === 3 && (
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

                    </div>
                ))}

                {filteredCosechas.length === 0 && (
                    <div className="p-16 text-center rounded-[32px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold text-lg">No se encontraron lotes activos.</p>
                        <p className="text-gray-400 text-sm mt-1">Usa el botón superior para empezar a rastrear tu café.</p>
                    </div>
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
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                    ¿Cuántos kilos de cereza fresca ingresaron hoy para el lote <strong className="text-gray-800">{modalAccion.lote.codigo}</strong>?
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
                                <DialogTitle className="text-2xl font-black text-gray-900">Finalizar Secado</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                    Al secar el café se pierde agua. Pesa tu café seco y anota cuántos kilos de <strong className="text-gray-800">Pergamino Seco</strong> te quedaron en total:
                                </DialogDescription>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="h-20 rounded-2xl bg-gray-50 border-none text-center text-4xl font-black text-amber-600 focus:ring-4 focus:ring-amber-100"
                                    autoFocus
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">Kg</span>
                            </div>
                            <Button
                                onClick={handleConfirmarAccion}
                                className="w-full h-14 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-wider"
                            >
                                Guardar Peso Seco
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
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                    Al remover la cascarilla (trilla) queda el café verde de exportación. Anota el peso final resultante:
                                </DialogDescription>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="h-20 rounded-2xl bg-gray-50 border-none text-center text-4xl font-black text-[#5f705f] focus:ring-4 focus:ring-[#5f705f]/10"
                                    autoFocus
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">Kg</span>
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
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                    Define cómo procesarás la cereza acumulada en este lote:
                                </DialogDescription>
                            </div>
                            <Select value={selectValue} onValueChange={setSelectValue}>
                                <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none text-center font-black text-gray-800">
                                    <SelectValue placeholder="Selecciona el proceso..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100">
                                    <SelectItem value="Lavado">Lavado (Tradicional)</SelectItem>
                                    <SelectItem value="Natural">Natural</SelectItem>
                                    <SelectItem value="Honey">Honey</SelectItem>
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
                                <DialogDescription className="text-sm text-gray-500 mt-1">
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

                    {modalAccion?.tipo === 'ver_rendimiento' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <DialogTitle className="text-2xl font-black text-gray-900">Historia y Mermas</DialogTitle>
                                <DialogDescription className="text-xs text-gray-500 mt-1">
                                    Evolución del peso de tu café para el lote <strong className="text-gray-800">{modalAccion.lote.codigo}</strong>
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
        </div>
    );
}
