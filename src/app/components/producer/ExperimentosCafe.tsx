import { useState, useEffect } from 'react';
import { Plus, TestTube2, Droplets, ThermometerSun, Star, BookOpen, Sparkles, Check, Trophy, XCircle, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

import type { Experimento } from '../../types/experimento';
import { getExperimentos, saveExperimentos } from '../../../services/experimentosService';

export function ExperimentosCafe() {
    const [experimentos, setExperimentos] = useState<Experimento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal de Creación Inicial
    const [openCrear, setOpenCrear] = useState(false);
    // Acordeón visual de recetas
    const [openRecetaId, setOpenRecetaId] = useState<string | null>(null);

    // Estados para Modales de Acción Enfocados (Bitácora Progresiva)
    const [modalAccion, setModalAccion] = useState<{
        tipo: 'anotar_paso' | 'anotar_parametros' | 'evaluar_resultado';
        exp: Experimento;
    } | null>(null);

    // Inputs temporales para modales
    const [inputPaso, setInputPaso] = useState('');
    const [inputTemp, setInputTemp] = useState('');
    const [inputHum, setInputHum] = useState('');
    const [inputPuntajeFinal, setInputPuntajeFinal] = useState('');
    const [decisionFinal, setDecisionFinal] = useState<'Replicar Maestra' | 'Descartar'>('Replicar Maestra');

    // Campos de Creación Inicial
    const [lote, setLote] = useState('');
    const [tipoProceso, setTipoProceso] = useState('');
    const [puntajeObjetivo, setPuntajeObjetivo] = useState('');
    const [insumos, setInsumos] = useState('');

    // Cargar lotes de producción activos
    const [lotesDisponibles, setLotesDisponibles] = useState<any[]>([]);
    useEffect(() => {
        const savedLotes = localStorage.getItem('lotes_produccion');
        if (savedLotes) {
            try { setLotesDisponibles(JSON.parse(savedLotes)); } catch (e) {}
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        getExperimentos()
            .then((data) => {
                setExperimentos(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Error al cargar los experimentos');
                setIsLoading(false);
            });
    }, []);

    const saveExperimentosStorage = async (updated: Experimento[]) => {
        setExperimentos(updated);
        try {
            await saveExperimentos(updated);
        } catch (err) {
            toast.error('Error al guardar los experimentos');
        }
    };

    // 1. Guardar Intención / Nuevo Experimento
    const handleCrearExperimento = () => {
        if (!lote || !tipoProceso) {
            toast.error('Por favor selecciona el lote y el tipo de proceso');
            return;
        }

        const newExp: Experimento = {
            id: `EXP-00${experimentos.length + 1}`,
            lote,
            fechaRegistro: new Date().toISOString().split('T')[0],
            tipoProceso,
            humedad: '--%',
            temperatura: '--°C',
            notas: insumos ? `Insumos: ${insumos}` : 'Inicio de prueba',
            estado: 'En Proceso',
            puntajeObjetivo: puntajeObjetivo ? parseFloat(puntajeObjetivo) : undefined,
            insumos: insumos || 'Ninguno',
            pasosReplicacion: [`Inicio del proceso: ${tipoProceso}`]
        };

        saveExperimentosStorage([newExp, ...experimentos]);
        toast.success('Experimento iniciado. Podrás añadir pasos a medida que avance.');
        
        setLote('');
        setTipoProceso('');
        setPuntajeObjetivo('');
        setInsumos('');
        setOpenCrear(false);
    };

    // 2. Confirmar Acciones Progresivas
    const handleConfirmarAccion = () => {
        if (!modalAccion) return;
        const { tipo, exp } = modalAccion;

        const updated = experimentos.map(item => {
            if (item.id === exp.id) {
                if (tipo === 'anotar_paso') {
                    if (!inputPaso.trim()) return item;
                    return {
                        ...item,
                        pasosReplicacion: [...item.pasosReplicacion, inputPaso.trim()]
                    };
                }
                else if (tipo === 'anotar_parametros') {
                    return {
                        ...item,
                        temperatura: inputTemp ? `${inputTemp}°C` : item.temperatura,
                        humedad: inputHum ? `${inputHum}%` : item.humedad
                    };
                }
                else if (tipo === 'evaluar_resultado') {
                    const ptos = parseFloat(inputPuntajeFinal);
                    return {
                        ...item,
                        estado: decisionFinal === 'Replicar Maestra' ? 'Evaluado' : 'Descartado',
                        resultadoFinal: decisionFinal,
                        puntajeObtenido: ptos || item.puntajeObjetivo || 85.0
                    };
                }
            }
            return item;
        });

        saveExperimentosStorage(updated);

        if (tipo === 'anotar_paso') toast.success('Paso añadido a la receta del experimento');
        if (tipo === 'anotar_parametros') toast.success('Parámetros actualizados exitosamente');
        if (tipo === 'evaluar_resultado') {
            toast.success(decisionFinal === 'Replicar Maestra' ? '¡Guardado como Receta Maestra Exitoso!' : 'Experimento documentado y cerrado');
        }

        // Limpiar
        setModalAccion(null);
        setInputPaso('');
        setInputTemp('');
        setInputHum('');
        setInputPuntajeFinal('');
    };

    const openActionModal = (tipo: 'anotar_paso' | 'anotar_parametros' | 'evaluar_resultado', exp: Experimento) => {
        setModalAccion({ tipo, exp });
        setInputPaso('');
        setInputTemp(exp.temperatura.replace('°C', '').replace('--', ''));
        setInputHum(exp.humedad.replace('%', '').replace('--', ''));
        setInputPuntajeFinal(exp.puntajeObtenido?.toString() || exp.puntajeObjetivo?.toString() || '');
        setDecisionFinal(exp.resultadoFinal || 'Replicar Maestra');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1100px] mx-auto px-4">
            {/* Encabezado Superior */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#bb8d3b] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">I+D Finca</span>
                    </div>
                    <h1 className="text-3xl font-black font-sans text-gray-900 flex items-center gap-2">
                        <TestTube2 className="h-8 w-8 text-[#5f705f]" />
                        Laboratorio y Experimentos
                    </h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">
                        Inicia pruebas, registra los pasos progresivamente a medida que ocurren, y decide al final cuáles convertir en Recetas Maestras para tu finca.
                    </p>
                </div>
                
                <Button 
                    onClick={() => setOpenCrear(true)} 
                    className="bg-[#5f705f] hover:bg-[#4a584a] text-white h-14 px-6 rounded-2xl font-black text-sm shadow-md flex items-center gap-2 shrink-0 w-full sm:w-auto"
                >
                    <Plus size={20} />
                    <span>Iniciar Experimento</span>
                </Button>
            </div>

            {/* Modal de Inicio Rápido de Experimento */}
            <Dialog open={openCrear} onOpenChange={setOpenCrear}>
                <DialogContent className="sm:max-w-[500px] rounded-[32px] p-6 sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-gray-900">Iniciar Prueba Experimental</DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium">
                            Define la idea base. Podrás añadir los pasos específicos de temperatura, remoción y tiempos a medida que vayan ocurriendo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        {/* Lote / Variedad */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-gray-500">Lote de Producción Base</Label>
                            {lotesDisponibles.length > 0 ? (
                                <Select value={lote} onValueChange={setLote}>
                                    <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold text-gray-900">
                                        <SelectValue placeholder="Selecciona un lote activo..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {lotesDisponibles.map(l => (
                                            <SelectItem key={l.id} value={`${l.codigo} - ${l.detallesObjetivo?.variedad || 'Mezcla'}`}>
                                                {l.codigo} ({l.detallesObjetivo?.variedad || 'Mezcla'})
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="Lote Experimental Nuevo">Otro Lote / Variedad Externa</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input 
                                    placeholder="Ej. Lote El Mirador - Bourbon" 
                                    className="h-14 rounded-xl bg-gray-50 border-none font-bold"
                                    value={lote}
                                    onChange={e => setLote(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Proceso Propuesto */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-gray-500">Tipo de Proceso a Probar</Label>
                            <Select value={tipoProceso} onValueChange={setTipoProceso}>
                                <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold text-gray-900">
                                    <SelectValue placeholder="Lavado Térmico, Honey, Anaeróbico..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Fermentación Anaeróbica">Fermentación Anaeróbica</SelectItem>
                                    <SelectItem value="Honey Amarillo">Honey Amarillo</SelectItem>
                                    <SelectItem value="Honey Rojo / Negro">Honey Rojo / Negro</SelectItem>
                                    <SelectItem value="Natural Prolongado">Natural Prolongado</SelectItem>
                                    <SelectItem value="Maceración Carbónica">Maceración Carbónica</SelectItem>
                                    <SelectItem value="Choque Térmico">Choque Térmico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Idea o Insumo */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-gray-500">¿Vas a usar algún insumo o idea especial?</Label>
                            <Input 
                                placeholder="Ej. Levaduras de frutas, mosto, canela, sombra estricta..." 
                                className="h-14 rounded-xl bg-gray-50 border-none font-bold"
                                value={insumos}
                                onChange={e => setInsumos(e.target.value)}
                            />
                        </div>

                        {/* Puntaje Objetivo (Opcional) */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-[#bb8d3b] flex items-center gap-1">
                                <Star size={14} className="fill-[#bb8d3b]" /> Puntaje Meta Esperado (Opcional)
                            </Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    step="0.1"
                                    placeholder="Ej. 86.5" 
                                    className="h-14 rounded-xl bg-amber-50/50 border-none font-black text-lg text-[#bb8d3b] pl-4"
                                    value={puntajeObjetivo}
                                    onChange={e => setPuntajeObjetivo(e.target.value)}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#bb8d3b]/60 uppercase">Ptos</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <Button onClick={() => setOpenCrear(false)} variant="ghost" className="h-12 rounded-xl font-bold text-gray-500">Cancelar</Button>
                        <Button onClick={handleCrearExperimento} className="bg-[#5f705f] hover:bg-[#4a584a] text-white h-12 px-6 rounded-xl font-black text-sm">
                            Iniciar Prueba
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* MODAL DE ACCIONES PROGRESIVAS (Añadir Paso, Parámetros, Evaluar) */}
            <Dialog open={!!modalAccion} onOpenChange={(open) => !open && setModalAccion(null)}>
                <DialogContent className="sm:max-w-[450px] rounded-[32px] p-6 sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-gray-900">
                            {modalAccion?.tipo === 'anotar_paso' && 'Añadir Paso a la Bitácora'}
                            {modalAccion?.tipo === 'anotar_parametros' && 'Registrar Parámetros'}
                            {modalAccion?.tipo === 'evaluar_resultado' && 'Evaluación y Decisión Final'}
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium text-xs">
                            {modalAccion?.tipo === 'anotar_paso' && 'Anota qué tarea o ajuste realizaste hoy en este lote.'}
                            {modalAccion?.tipo === 'anotar_parametros' && 'Ingresa las lecturas actuales de temperatura o humedad.'}
                            {modalAccion?.tipo === 'evaluar_resultado' && 'Ingresa el puntaje final obtenido y decide si este experimento se convertirá en una Receta Maestra a replicar.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2 space-y-4">
                        {modalAccion?.tipo === 'anotar_paso' && (
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-gray-500">Descripción del Paso / Tarea</Label>
                                <Textarea 
                                    placeholder="Ej. Remoción a las 48h, bajó la temperatura a 18°C. Movido a secado solar."
                                    className="h-28 rounded-xl bg-gray-50 border-none p-3 text-xs font-medium"
                                    value={inputPaso}
                                    onChange={e => setInputPaso(e.target.value)}
                                />
                            </div>
                        )}

                        {modalAccion?.tipo === 'anotar_parametros' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-gray-500">Temperatura</Label>
                                    <Input placeholder="Ej. 18" className="h-14 rounded-xl bg-gray-50 border-none font-black text-center text-xl" value={inputTemp} onChange={e => setInputTemp(e.target.value)} />
                                    <span className="text-[10px] text-gray-400 block text-center font-bold">°C</span>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-gray-500">Humedad</Label>
                                    <Input placeholder="Ej. 11.5" className="h-14 rounded-xl bg-gray-50 border-none font-black text-center text-xl" value={inputHum} onChange={e => setInputHum(e.target.value)} />
                                    <span className="text-[10px] text-gray-400 block text-center font-bold">%</span>
                                </div>
                            </div>
                        )}

                        {modalAccion?.tipo === 'evaluar_resultado' && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-[#bb8d3b] flex items-center gap-1">
                                        <Star size={14} className="fill-[#bb8d3b]" /> Puntaje de Cata Obtenido
                                    </Label>
                                    <Input 
                                        type="number" step="0.1" placeholder="Ej. 87.5"
                                        className="h-14 rounded-xl bg-amber-50/50 border-none font-black text-xl text-center text-[#bb8d3b]"
                                        value={inputPuntajeFinal}
                                        onChange={e => setInputPuntajeFinal(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Label className="text-xs font-black uppercase text-gray-500">Decisión sobre el Experimento</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div 
                                            onClick={() => setDecisionFinal('Replicar Maestra')}
                                            className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                                                decisionFinal === 'Replicar Maestra' ? 'border-[#bb8d3b] bg-[#bb8d3b]/5' : 'border-gray-100 bg-white'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${decisionFinal === 'Replicar Maestra' ? 'bg-[#bb8d3b] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <Trophy size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900">Aprobar como Receta Maestra</p>
                                                <p className="text-[10px] text-gray-500 font-medium">Dio excelente taza. Replicar en futuras cosechas.</p>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => setDecisionFinal('Descartar')}
                                            className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                                                decisionFinal === 'Descartar' ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-white'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${decisionFinal === 'Descartar' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <XCircle size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900">Descartar Proceso</p>
                                                <p className="text-[10px] text-gray-500 font-medium">No se logró el perfil o tuvo defectos.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={() => setModalAccion(null)} variant="ghost" className="h-12 rounded-xl font-bold text-gray-500">Cancelar</Button>
                        <Button onClick={handleConfirmarAccion} className="bg-[#5f705f] hover:bg-[#4a584a] text-white h-12 px-6 rounded-xl font-black text-sm">
                            Guardar Registro
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Listado de Experimentos Activos y Bitácoras */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Bitácoras y Recetas Maestras</h2>
                
                <div className="grid grid-cols-1 gap-6">
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
                            <h3 className="text-xl font-sans font-black text-red-900">Algo salió mal</h3>
                            <p className="text-red-700/80 font-medium">{error}</p>
                        </div>
                    ) : (
                        <>
                            {experimentos.length === 0 && (
                                <div className="p-6 md:p-16 text-center rounded-[32px] border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold text-lg">No hay experimentos en curso.</p>
                                    <p className="text-gray-400 text-sm mt-1">Usa el botón superior para crear tu primer experimento.</p>
                                </div>
                            )}
                            {experimentos.map((exp) => {
                        const isExpanded = openRecetaId === exp.id;
                        const isMaestra = exp.resultadoFinal === 'Replicar Maestra';
                        const isDescartado = exp.estado === 'Descartado' || exp.resultadoFinal === 'Descartar';

                        return (
                            <div 
                                key={exp.id} 
                                className={`bg-white rounded-[32px] border-2 p-6 sm:p-8 shadow-sm flex flex-col justify-between transition-all ${
                                    isMaestra ? 'border-[#bb8d3b]/40 bg-gradient-to-br from-white to-amber-50/20' : 
                                    isDescartado ? 'border-gray-200/60 opacity-80' : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <div className="space-y-4">
                                    {/* Cabecera de Tarjeta */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md tracking-wider">
                                                    {exp.id}
                                                </span>
                                                {isMaestra && (
                                                    <span className="bg-[#bb8d3b] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                        <Trophy size={12} /> RECETA MAESTRA APROBADA
                                                    </span>
                                                )}
                                                {isDescartado && (
                                                    <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                                                        Descartado
                                                    </span>
                                                )}
                                                {exp.estado === 'En Proceso' && (
                                                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md animate-pulse">
                                                        ● En Proceso (Prueba)
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{exp.tipoProceso}</h3>
                                            <p className="text-xs font-bold text-gray-500 mt-1">Lote Base: <span className="text-gray-700">{exp.lote}</span></p>
                                        </div>

                                        {/* Bloque de Puntajes (Objetivo vs Obtenido) */}
                                        <div className="flex items-center gap-3 shrink-0 bg-gray-50 p-3 rounded-2xl border border-gray-100/80">
                                            {exp.puntajeObjetivo && (
                                                <div className="text-center px-2">
                                                    <span className="text-[8px] font-black uppercase text-gray-400 block tracking-wider">Meta</span>
                                                    <span className="text-sm font-black text-gray-600">⭐ {exp.puntajeObjetivo}</span>
                                                </div>
                                            )}
                                            {exp.puntajeObtenido && (
                                                <div className="text-center px-2 border-l border-gray-200 pl-3">
                                                    <span className="text-[8px] font-black uppercase text-[#bb8d3b] block tracking-wider">Obtenido</span>
                                                    <span className="text-base font-black text-[#bb8d3b]">⭐ {exp.puntajeObtenido}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Insignias de Insumos y Parámetros */}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-100 flex items-center gap-1.5">
                                            <Droplets size={14} className="text-blue-500" /> {exp.humedad} Humedad
                                        </span>
                                        <span className="bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-100 flex items-center gap-1.5">
                                            <ThermometerSun size={14} className="text-amber-500" /> {exp.temperatura} Temp.
                                        </span>
                                        {exp.insumos && exp.insumos !== 'Ninguno' && (
                                            <span className="bg-[#5f705f]/5 text-[#5f705f] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#5f705f]/10 flex items-center gap-1.5">
                                                <Sparkles size={14} /> Insumo: {exp.insumos}
                                            </span>
                                        )}
                                    </div>

                                    {/* Bitácora / Pasos para Replicar (Crecimiento Progresivo) */}
                                    <div className="pt-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                                <BookOpen size={14} className="text-[#5f705f]" /> Bitácora / Receta Paso a Paso ({exp.pasosReplicacion.length})
                                            </span>
                                            {exp.pasosReplicacion.length > 3 && (
                                                <button 
                                                    onClick={() => setOpenRecetaId(isExpanded ? null : exp.id)} 
                                                    className="text-[10px] font-bold text-[#5f705f] underline hover:text-gray-900 cursor-pointer"
                                                >
                                                    {isExpanded ? 'Ocultar bitácora' : 'Ver bitácora completa'}
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-2 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                                            {(isExpanded ? exp.pasosReplicacion : exp.pasosReplicacion.slice(0, 3)).map((paso, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-gray-700">
                                                    <span className="w-4 h-4 rounded-full bg-white border border-gray-200 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5 text-[#5f705f]">
                                                        {idx + 1}
                                                    </span>
                                                    <p className="leading-tight pt-0.5">{paso}</p>
                                                </div>
                                            ))}
                                            {!isExpanded && exp.pasosReplicacion.length > 3 && (
                                                <p className="text-[10px] font-bold text-gray-400 pl-6 pt-1">
                                                    + {exp.pasosReplicacion.length - 3} registros adicionales en la bitácora...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones Progresivas Inferiores */}
                                <div className="mt-6 pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                    {exp.estado === 'En Proceso' ? (
                                        <div className="flex flex-wrap gap-2 grow">
                                            <Button 
                                                onClick={() => openActionModal('anotar_paso', exp)}
                                                variant="outline" 
                                                size="sm"
                                                className="h-10 rounded-xl font-bold text-xs text-gray-700 border-gray-200 hover:bg-gray-50"
                                            >
                                                <PlusCircle size={14} className="mr-1.5 text-[#5f705f]" /> Añadir Paso
                                            </Button>
                                            <Button 
                                                onClick={() => openActionModal('anotar_parametros', exp)}
                                                variant="outline" 
                                                size="sm"
                                                className="h-10 rounded-xl font-bold text-xs text-gray-700 border-gray-200 hover:bg-gray-50"
                                            >
                                                <ThermometerSun size={14} className="mr-1.5 text-amber-500" /> Parámetros
                                            </Button>
                                            <Button 
                                                onClick={() => openActionModal('evaluar_resultado', exp)}
                                                size="sm"
                                                className="h-10 rounded-xl bg-[#bb8d3b] hover:bg-[#a07830] text-white font-black text-xs ml-auto"
                                            >
                                                <Star size={14} className="mr-1.5 fill-white" /> Evaluar Resultado
                                            </Button>
                                        </div>
                                    ) : isMaestra ? (
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                                                ✓ Lista para replicar en finca
                                            </span>
                                            <Button 
                                                onClick={() => toast.success(`Receta maestra cargada para replicar en el próximo lote.`)}
                                                className="h-10 rounded-xl bg-[#5f705f] hover:bg-[#4a584a] text-white font-black text-xs uppercase tracking-wider"
                                            >
                                                <Check size={14} className="mr-1.5" /> Replicar en Lote
                                            </Button>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-400 normal-case block text-right w-full">
                                            Bitácora archivada como referencia
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
