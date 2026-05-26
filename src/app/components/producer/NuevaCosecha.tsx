import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Calendar,
    Clock,
    Scale,
    Star,
    Camera,
    Check,
    ChevronLeft,
    CheckCircle,
    ArrowRight,
    Loader2,
    Sprout,
    MapPin,
    Target,
    ClipboardList,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Slider } from '../ui/slider';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

export function NuevaCosecha() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Common states
    const [finca, setFinca] = useState('');
    const [parcela, setParcela] = useState('');
    
    // Path selection: 'objetivo' | 'diario' | null
    const [modalidad, setModalidad] = useState<'objetivo' | 'diario' | null>(null);

    // Path A states (Objetivo Final)
    const [variedad, setVariedad] = useState('');
    const [proceso, setProceso] = useState('');
    const [kilosObjetivo, setKilosObjetivo] = useState('');

    // Path B states (Registro Diario)
    const [peso, setPeso] = useState('');
    const [madurez, setMadurez] = useState([4]);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

    const handleSave = () => {
        if (!finca || !parcela) {
            toast.error('Selecciona el Origen', { description: 'Finca y lote son obligatorios.' });
            return;
        }

        if (modalidad === 'objetivo') {
            if (!variedad || !proceso || !kilosObjetivo) {
                toast.error('Completa los datos del objetivo', { description: 'Faltan campos por llenar.' });
                return;
            }
        } else if (modalidad === 'diario') {
            if (!peso) {
                toast.error('Completa los datos de recolección', { description: 'El peso es necesario.' });
                return;
            }
        } else {
            toast.error('Selecciona una modalidad', { description: 'Elige cómo quieres crear este lote.' });
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            
            // Create the new Lot Object
            // Merma del 20% en cada etapa: Seco = Cereza * 0.80, Verde = Seco * 0.80 = Cereza * 0.64
            // Por lo tanto, Cereza = Verde / 0.64 = Verde * 1.5625
            const factor = 1.5625;
            const kilosObjetivoCereza = modalidad === 'objetivo' ? Math.round(Number(kilosObjetivo) * factor) : null;

            const newLot = {
                id: `lc-new-${Date.now()}`,
                codigo: `LOTE-${Math.floor(Math.random()*1000)}`,
                productor: 'Tú',
                cosecha: fecha,
                finca,
                parcelas: [parcela],
                estado: modalidad === 'objetivo' ? 'Planeado' : 'Cereza (Fresco)',
                fase: modalidad === 'objetivo' ? 0 : 1,
                modalidad,
                detallesObjetivo: modalidad === 'objetivo' ? { variedad, proceso } : null,
                pesos: { 
                    cereza: modalidad === 'diario' ? Number(peso) : 0, 
                    pergamino: 0, 
                    verde: 0, 
                    objetivo: kilosObjetivoCereza,
                    objetivoFinal: modalidad === 'objetivo' ? Number(kilosObjetivo) : null
                },
                calificacion: 0,
                macroperfil: '',
                clientes: []
            };

            // Save to localStorage
            const saved = localStorage.getItem('lotes_produccion');
            let currentLotes = [];
            if (saved) {
                try { currentLotes = JSON.parse(saved); } catch (e) {}
            } else {
                // To avoid missing the mock list
                currentLotes = [
                    {
                        id: 'lc1', codigo: 'MG-ESP-042', productor: 'María', cosecha: 'Oct-Nov 2024',
                        finca: 'Finca La Esperanza', parcelas: ['Lote El Mirador'],
                        estado: 'Verde (Trillado)', pesos: { cereza: 1200, pergamino: 250, verde: 180, objetivo: 1500 },
                        fase: 3, modalidad: 'objetivo', detallesObjetivo: { variedad: 'Bourbon Rosado', proceso: 'Lavado' },
                        calificacion: 86.5, macroperfil: 'Frutal', clientes: []
                    }
                ];
            }
            
            currentLotes.unshift(newLot); // add to top
            localStorage.setItem('lotes_produccion', JSON.stringify(currentLotes));

            if (modalidad === 'objetivo') {
                toast.success('¡Objetivo de Lote Creado!', {
                    description: `Lote de ${variedad} ${proceso} planeado con éxito.`,
                    icon: <Target className="text-[#5f705f]" />
                });
            } else {
                toast.success('¡Registro Diario Creado!', {
                    description: `${peso}kg de cereza registrados.`,
                    icon: <CheckCircle className="text-[#5f705f]" />
                });
            }
            navigate('/producer/cosechas');
        }, 1000);
    };

    return (
        <div className="max-w-[800px] mx-auto min-h-screen flex flex-col pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4">

            {/* Header */}
            <div className="flex items-center gap-6 mb-12 pt-8">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-14 w-14 hover:bg-white active:scale-90 transition-all text-gray-400 border border-gray-100"
                    onClick={() => navigate('/producer/dashboard')}
                >
                    <ChevronLeft size={28} />
                </Button>
                <div>
                    <h1 className="text-4xl font-sans font-black text-gray-900 leading-none mb-1 tracking-tight">Nuevo Lote de Producción</h1>
                    <p className="text-[12px] font-black uppercase tracking-widest text-[#5f705f]/50 pl-0.5">Definición de Lote</p>
                </div>
            </div>

            <div className="space-y-12">

                {/* 1. SELECCIÓN DE ORIGEN */}
                <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <MapPin size={24} className="text-[#5f705f]" />
                        <div>
                            <h2 className="text-2xl font-sans font-black text-gray-800">1. Origen del Café</h2>
                            <p className="text-sm text-gray-500 font-medium">La finca y el lote de donde proviene la cereza.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Finca</Label>
                            <Select value={finca} onValueChange={setFinca}>
                                <SelectTrigger className="h-16 rounded-3xl bg-gray-50 border-none shadow-sm font-black text-gray-800 focus:ring-4 focus:ring-[#5f705f]/5 px-6">
                                    <SelectValue placeholder="Selecciona tu finca..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl border-gray-100">
                                    <SelectItem value="Finca La Esperanza">Finca La Esperanza</SelectItem>
                                    <SelectItem value="Finca Santa Helena">Finca Santa Helena</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Lote / Parcela de Café</Label>
                            <Select value={parcela} onValueChange={setParcela} disabled={!finca}>
                                <SelectTrigger className="h-16 rounded-3xl bg-gray-50 border-none shadow-sm font-black text-gray-800 focus:ring-4 focus:ring-[#5f705f]/5 px-6">
                                    <SelectValue placeholder="Selecciona la parcela..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl border-gray-100">
                                    <SelectItem value="Lote El Mirador">Lote El Mirador</SelectItem>
                                    <SelectItem value="Lote Las Piedras">Lote Las Piedras</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* 2. MODALIDAD DEL LOTE (Solo visible si hay parcela seleccionada) */}
                <AnimatePresence>
                    {finca && parcela && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: 20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-8 overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Sprout size={32} className="text-[#5f705f]" />
                                <div>
                                    <h2 className="text-2xl font-sans font-black text-gray-800">2. ¿Qué vas a hacer?</h2>
                                    <p className="text-gray-500 font-medium leading-tight">Elige cómo quieres registrar este café.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Option A */}
                                <div 
                                    onClick={() => setModalidad('objetivo')}
                                    className={cn(
                                        "p-6 rounded-[32px] border-4 transition-all cursor-pointer flex flex-col items-center text-center gap-4 hover:shadow-md",
                                        modalidad === 'objetivo' ? "border-[#5f705f] bg-[#5f705f]/5" : "border-gray-50 hover:border-gray-100 bg-white"
                                    )}
                                >
                                    <div className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-colors shadow-sm", modalidad === 'objetivo' ? "bg-[#5f705f] text-white" : "bg-gray-100 text-gray-400")}>
                                        <Target size={40} />
                                    </div>
                                    <div>
                                        <h3 className={cn("text-2xl font-sans font-black mb-2 transition-colors", modalidad === 'objetivo' ? "text-[#5f705f]" : "text-gray-900")}>Tengo un Plan</h3>
                                        <p className="text-gray-500 font-medium leading-tight">Ej: "Quiero sacar 100Kg de Lavado". Defines qué vas a hacer y luego vas sumando recolección.</p>
                                    </div>
                                </div>

                                {/* Option B */}
                                <div 
                                    onClick={() => setModalidad('diario')}
                                    className={cn(
                                        "p-6 rounded-[32px] border-4 transition-all cursor-pointer flex flex-col items-center text-center gap-4 hover:shadow-md",
                                        modalidad === 'diario' ? "border-[#bb8d3b] bg-[#bb8d3b]/5" : "border-gray-50 hover:border-gray-100 bg-white"
                                    )}
                                >
                                    <div className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-colors shadow-sm", modalidad === 'diario' ? "bg-[#bb8d3b] text-white" : "bg-gray-100 text-gray-400")}>
                                        <ClipboardList size={40} />
                                    </div>
                                    <div>
                                        <h3 className={cn("text-2xl font-sans font-black mb-2 transition-colors", modalidad === 'diario' ? "text-[#bb8d3b]" : "text-gray-900")}>Solo Anotar Kilos</h3>
                                        <p className="text-gray-500 font-medium leading-tight">Registra la recolección de hoy sin complicarte. Después decides cómo lo procesas.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. DETALLES (Depende de Modalidad) */}
                <AnimatePresence mode="wait">
                    {modalidad === 'objetivo' && (
                        <motion.div
                            key="objetivo"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Star size={32} className="text-[#5f705f]" />
                                <div>
                                    <h2 className="text-2xl font-sans font-black text-gray-800">3. ¿Qué vas a procesar?</h2>
                                    <p className="text-gray-500 font-medium">Define cómo quieres que termine este café.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Variedad</Label>
                                    <Select value={variedad} onValueChange={setVariedad}>
                                        <SelectTrigger className="h-16 rounded-3xl bg-gray-50 border-none shadow-sm font-black text-gray-800 px-6 focus:ring-4 focus:ring-[#5f705f]/5">
                                            <SelectValue placeholder="Ej. Geisha, Bourbon..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-3xl border-gray-100">
                                            <SelectItem value="Geisha">Geisha</SelectItem>
                                            <SelectItem value="Bourbon Rosado">Bourbon Rosado</SelectItem>
                                            <SelectItem value="Castillo">Castillo</SelectItem>
                                            <SelectItem value="Caturra">Caturra</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">¿Qué Proceso le harás?</Label>
                                    <Select value={proceso} onValueChange={setProceso}>
                                        <SelectTrigger className="h-16 rounded-3xl bg-gray-50 border-none shadow-sm font-black text-gray-800 px-6 focus:ring-4 focus:ring-[#5f705f]/5">
                                            <SelectValue placeholder="Lavado, Natural..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-3xl border-gray-100">
                                            <SelectItem value="Lavado">Lavado (Tradicional)</SelectItem>
                                            <SelectItem value="Natural">Natural</SelectItem>
                                            <SelectItem value="Honey">Honey</SelectItem>
                                            <SelectItem value="Experimento">Otro Experimento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4 md:col-span-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">¿Cuántos Kilos de Café Final (Verde Trillado) esperas obtener?</Label>
                                    <div className="relative group">
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            className="h-20 rounded-3xl bg-gray-50 border-none text-center text-4xl font-sans font-black text-[#5f705f] placeholder:text-gray-200 shadow-sm focus:ring-4 focus:ring-[#5f705f]/5 transition-all"
                                            value={kilosObjetivo}
                                            onChange={(e) => setKilosObjetivo(e.target.value)}
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-lg font-sans font-black text-[#5f705f]/30 select-none">Kg</div>
                                    </div>
                                    {kilosObjetivo && Number(kilosObjetivo) > 0 ? (
                                        <div className="bg-[#5f705f]/5 p-4 rounded-2xl border border-[#5f705f]/10 flex flex-col sm:flex-row justify-between items-center gap-2 mt-2 animate-in fade-in">
                                            <span className="text-xs font-bold text-gray-500">
                                                💡 Meta estimada a recolectar en Cereza:
                                            </span>
                                            <span className="text-lg font-black text-[#5f705f]">
                                                {Math.round(Number(kilosObjetivo) * 1.5625)} Kg
                                            </span>
                                            <span className="text-[10px] text-gray-400 block sm:inline">
                                                (Calculado con merma promedio del 20% por etapa)
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {modalidad === 'diario' && (
                        <motion.div
                            key="diario"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Scale size={32} className="text-[#bb8d3b]" />
                                <div>
                                    <h2 className="text-2xl font-sans font-black text-gray-800">3. Anotar Recolección</h2>
                                    <p className="text-gray-500 font-medium">¿Cuánta cereza entró hoy?</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Kilos de Cereza (Hoy)</Label>
                                    <div className="relative group">
                                        <Input
                                            type="number"
                                            placeholder="00"
                                            className="h-20 rounded-[32px] bg-gray-50 border-none shadow-sm focus:ring-4 focus:ring-[#bb8d3b]/10 text-center text-4xl font-sans font-black text-[#bb8d3b]"
                                            value={peso}
                                            onChange={(e) => setPeso(e.target.value)}
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-lg font-sans font-black text-[#bb8d3b]/30">Kg</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Fecha</Label>
                                    <div className="relative h-20 group">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                                        <Input
                                            type="date"
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                            className="h-full rounded-3xl bg-gray-50 border-none shadow-sm pl-16 font-black text-gray-800 text-lg focus:ring-4 focus:ring-[#5f705f]/5"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-4 md:col-span-2 mt-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Calidad de Vistazo</Label>
                                        <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                            <Check size={12} className="text-emerald-600" />
                                            <span className="text-[10px] font-black text-emerald-800 uppercase">Óptimo: {madurez[0] * 20}%</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-4">
                                        <Slider
                                            value={madurez}
                                            onValueChange={setMadurez}
                                            max={5}
                                            min={1}
                                            step={1}
                                            className="[&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:bg-[#5f705f] [&_[role=slider]]:shadow-lg [&_.relative]:h-3 [&_.bg-primary]:bg-[#5f705f]"
                                        />
                                        <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                                            <span>Verde</span>
                                            <span>Maduro</span>
                                            <span>Pasado</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* BOTÓN FINAL */}
                <AnimatePresence>
                    {modalidad && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="w-full h-24 rounded-[32px] bg-[#5f705f] hover:bg-[#234d24] text-white font-black text-2xl shadow-2xl shadow-[#5f705f]/40 transition-all active:scale-95 mt-4 flex items-center justify-center gap-6 group cursor-pointer"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={32} />
                                ) : (
                                    <>
                                        <span>Guardar Lote de Producción</span>
                                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
