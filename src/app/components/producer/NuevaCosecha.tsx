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

    // Form states
    const [finca, setFinca] = useState('');
    const [tipo, setTipo] = useState<'Cereza' | 'Pergamino'>('Cereza');
    const [peso, setPeso] = useState('');
    const [madurez, setMadurez] = useState([4]);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [hora, setHora] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));

    const handleSave = () => {
        if (!finca || !peso) {
            toast.error('Por favor completa todos los campos requeridos', {
                description: 'Finca y peso de recolección son necesarios.',
                style: { borderRadius: '20px', background: '#FDFDF8', border: '1px solid #97333330', color: '#973333' }
            });
            return;
        }

        setIsLoading(true);

        // Simulate API save
        setTimeout(() => {
            setIsLoading(false);
            toast.success('¡Recolección Guardada!', {
                description: `${peso}kg de ${tipo} registrados en ${finca}.`,
                icon: <CheckCircle className="text-green-600" />,
                style: { borderRadius: '24px', background: '#FDFDF8', padding: '20px' }
            });
            navigate('/producer/dashboard');
        }, 1500);
    };

    return (
        <div className="max-w-[600px] mx-auto min-h-screen flex flex-col pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 mb-10 pt-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-12 w-12 hover:bg-white active:scale-90 transition-all text-gray-400"
                    onClick={() => navigate('/producer/dashboard')}
                >
                    <ChevronLeft size={24} />
                </Button>
                <div>
                    <h1 className="text-3xl font-serif font-black text-gray-900 leading-none mb-1 tracking-tight">Cosecha de Hoy</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/50 pl-0.5">Registro Diario de Finca</p>
                </div>
            </div>

            <div className="space-y-10">
                {/* Finca Selection */}
                <div className="space-y-4">
                    <Label className="text-sm font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Seleccionar Finca / Predio</Label>
                    <Select value={finca} onValueChange={setFinca}>
                        <SelectTrigger className="h-[72px] rounded-[24px] bg-white border-2 border-transparent shadow-sm hover:border-[#2C5F2D]/20 transition-all font-bold text-lg text-gray-800 focus:ring-4 focus:ring-[#2C5F2D]/5 px-6">
                            <SelectValue placeholder="Busca tu finca..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-3xl border-gray-100 p-2">
                            <SelectItem value="Finca La Esperanza" className="rounded-2xl h-12 font-bold focus:bg-[#2C5F2D]/5 focus:text-[#2C5F2D]">Finca La Esperanza</SelectItem>
                            <SelectItem value="Lote El Naranjo" className="rounded-2xl h-12 font-bold focus:bg-[#2C5F2D]/5 focus:text-[#2C5F2D]">Lote El Naranjo</SelectItem>
                            <SelectItem value="Finca Santa Helena" className="rounded-2xl h-12 font-bold focus:bg-[#2C5F2D]/5 focus:text-[#2C5F2D]">Finca Santa Helena</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Fecha</Label>
                        <div className="relative h-16 group">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2C5F2D] transition-colors" size={20} />
                            <Input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="h-full rounded-3xl bg-white border-none shadow-sm pl-14 font-black text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Hora</Label>
                        <div className="relative h-16 group">
                            <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2C5F2D] transition-colors" size={20} />
                            <Input
                                type="time"
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                                className="h-full rounded-3xl bg-white border-none shadow-sm pl-14 font-black text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                {/* Harvesting Types (Radio Cards) */}
                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Punto de la Cadena</Label>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: 'Cereza', emoji: '🍒', label: 'Cereza', sub: 'Grano Maduro', color: 'bg-red-50 text-red-700' },
                            { id: 'Pergamino', emoji: '🟤', label: 'Pergamino', sub: 'Grano Seco', color: 'bg-amber-50 text-amber-700' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setTipo(item.id as any)}
                                className={cn(
                                    'h-32 rounded-[32px] border-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer relative overflow-hidden group',
                                    tipo === item.id
                                        ? 'border-[#2C5F2D] bg-[#2C5F2D] text-white shadow-xl shadow-[#2C5F2D]/20'
                                        : 'border-white bg-white text-gray-500 shadow-sm'
                                )}
                            >
                                <span className="text-4xl filter saturate-150 group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                                <div className="text-center">
                                    <p className="text-sm font-black uppercase tracking-widest">{item.label}</p>
                                    <p className={cn('text-[10px] font-bold opacity-60', tipo === item.id ? 'text-white' : 'text-gray-400')}>{item.sub}</p>
                                </div>
                                {tipo === item.id && (
                                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center animate-in zoom-in-0 duration-300">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Weight Input (Huge) */}
                <div className="space-y-4 pt-4">
                    <Label className="text-sm font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Peso Colectado</Label>
                    <div className="relative group">
                        <Input
                            type="number"
                            placeholder="00.0"
                            className="h-32 rounded-[40px] bg-white border-4 border-transparent focus:border-[#2C5F2D] shadow-xl text-center text-7xl font-serif font-black text-[#2C5F2D] placeholder:text-gray-100 transition-all"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                        />
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-2xl font-serif font-black text-[#2C5F2D]/30 select-none">Kg</div>
                    </div>
                </div>

                {/* Quality Slider / Ripeness */}
                <div className="space-y-6 pt-6">
                    <div className="flex items-center justify-between px-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/60">Nivel de Madurez (SCAA)</Label>
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={14}
                                    className={cn('transition-colors', s <= madurez[0] ? 'text-amber-400 fill-amber-400' : 'text-gray-100')}
                                />
                            ))}
                            <span className="text-xs font-black text-[#2C5F2D] ml-1">{madurez[0]}/5</span>
                        </div>
                    </div>
                    <div className="bg-white p-10 rounded-[40px] shadow-sm relative overflow-hidden">
                        <div className="flex justify-between mb-4 text-[10px] font-black uppercase tracking-widest text-gray-300">
                            <span>Bajo</span>
                            <span>Óptimo para Especialidad</span>
                            <span>Sobre-maduro</span>
                        </div>
                        <Slider
                            value={madurez}
                            onValueChange={setMadurez}
                            max={5}
                            min={1}
                            step={1}
                            className="[&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:bg-[#2C5F2D] [&_[role=slider]]:shadow-xl [&_.relative]:h-3 [&_.bg-primary]:bg-[#2C5F2D]"
                        />
                        <div className="mt-6 flex justify-between gap-1 h-3 opacity-20">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-r from-green-500 via-red-500 to-amber-900 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Camera / Photo Evidence */}
                <div className="space-y-4 pt-6">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Evidencia Fotográfica (Auditables)</Label>
                    <div
                        className="bg-white border-4 border-dashed border-gray-100 rounded-[40px] p-12 flex flex-col items-center justify-center gap-4 group hover:border-[#2C5F2D]/20 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50" />
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-[#FDFDF8] flex items-center justify-center text-[#2C5F2D] group-hover:scale-110 shadow-sm transition-all border border-gray-50">
                                <Camera size={36} />
                            </div>
                            <div className="text-center mt-4">
                                <p className="font-serif font-black text-gray-900 leading-none mb-2">Tomar Foto del Pesaje</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Escanea el lote o sube una imagen</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Submit Button */}
                <div className="pt-10 sticky bottom-6 z-10 px-2">
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full h-20 rounded-[32px] bg-[#2C5F2D] hover:bg-[#234d24] text-white font-black text-xl shadow-2xl shadow-[#2C5F2D]/40 transition-all active:scale-95 mt-auto flex items-center justify-center gap-4 group"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <span className="tracking-tight">Guardar Recolección</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
