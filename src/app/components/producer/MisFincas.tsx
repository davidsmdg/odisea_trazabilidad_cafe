import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    MapPin,
    Plus,
    Tractor,
    Mountain,
    ShieldCheck,
    ChevronRight,
    Map as MapIcon,
    UploadCloud,
    X,
    CheckCircle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

interface Finca {
    id: string;
    nombre: string;
    ubicacion: string;
    altura: string;
    variedades: string[];
    estadoEUDR: 'Verificado' | 'En revisión' | 'Pendiente';
}

const INITIAL_FINCAS: Finca[] = [
    {
        id: '1',
        nombre: 'Finca La Esperanza',
        ubicacion: 'San Agustín, Huila',
        altura: '1.850 msnm',
        variedades: ['Caturra', 'Castillo'],
        estadoEUDR: 'Verificado',
    },
    {
        id: '2',
        nombre: 'Lote El Naranjo',
        ubicacion: 'Acevedo, Huila',
        altura: '1.920 msnm',
        variedades: ['Geisha', 'Borbón Rosado'],
        estadoEUDR: 'En revisión',
    },
];

export function MisFincas() {
    const [fincas, setFincas] = useState<Finca[]>(INITIAL_FINCAS);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [nombre, setNombre] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [altura, setAltura] = useState('');
    const [variedades, setVariedades] = useState<string[]>([]);
    const [currentVariedad, setCurrentVariedad] = useState('');

    const handleAddVariedad = () => {
        if (currentVariedad && !variedades.includes(currentVariedad)) {
            setVariedades([...variedades, currentVariedad]);
            setCurrentVariedad('');
        }
    };

    const handleRemoveVariedad = (v: string) => {
        setVariedades(variedades.filter((item) => item !== v));
    };

    const handleSave = () => {
        if (!nombre || !ubicacion) {
            toast.error('Por favor completa los campos obligatorios');
            return;
        }

        const newFinca: Finca = {
            id: Date.now().toString(),
            nombre,
            ubicacion,
            altura: altura ? `${altura} msnm` : 'No definida',
            variedades,
            estadoEUDR: 'Pendiente',
        };

        setFincas([...fincas, newFinca]);
        setIsAdding(false);
        toast.success('Finca registrada con éxito', {
            description: 'La geolocalización ha sido enviada para verificación EUDR.',
        });

        // Reset form
        setNombre('');
        setUbicacion('');
        setAltura('');
        setVariedades([]);
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tight">Mis Fincas</h1>
                    <p className="text-gray-500 font-medium">Gestiona tus predios y asegura el cumplimiento EUDR para exportación.</p>
                </div>

                <Dialog open={isAdding} onOpenChange={setIsAdding}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#2C5F2D] hover:bg-[#234d24] text-white h-14 px-8 rounded-2xl gap-3 font-black shadow-xl shadow-[#2C5F2D]/20 transition-all active:scale-95">
                            <Plus size={20} />
                            Nueva Finca / Lote
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-[#FDFDF8]">
                        <div className="bg-[#2C5F2D] p-8 text-white relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 opacity-10 bg-white w-40 h-40 rounded-full blur-3xl" />
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-serif font-black">Registrar Predio</DialogTitle>
                                <DialogDescription className="text-white/70 font-medium pt-2">
                                    Completa la información técnica y geográfica de tu finca.
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre" className="text-xs font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Nombre de la Finca</Label>
                                    <Input
                                        id="nombre"
                                        placeholder="Ej: Finca La Esperanza"
                                        className="h-12 rounded-xl bg-white border-gray-100 focus:ring-[#2C5F2D]/20"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ubicacion" className="text-xs font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Vereda / Municipio</Label>
                                        <Input
                                            id="ubicacion"
                                            placeholder="San Agustín, Huila"
                                            className="h-12 rounded-xl bg-white border-gray-100"
                                            value={ubicacion}
                                            onChange={(e) => setUbicacion(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="altura" className="text-xs font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Altura (msnm)</Label>
                                        <div className="relative">
                                            <Input
                                                id="altura"
                                                type="number"
                                                placeholder="1850"
                                                className="h-12 rounded-xl bg-white border-gray-100 pr-12"
                                                value={altura}
                                                onChange={(e) => setAltura(e.target.value)}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">msnm</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Variedades de Café</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Añadir variedad (Caturra, Geisha...)"
                                            className="h-12 rounded-xl bg-white border-gray-100"
                                            value={currentVariedad}
                                            onChange={(e) => setCurrentVariedad(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddVariedad()}
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddVariedad}
                                            variant="outline"
                                            className="h-12 w-12 rounded-xl border-gray-200 text-[#2C5F2D]"
                                        >
                                            <Plus size={18} />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {variedades.map((v) => (
                                            <Badge key={v} className="bg-[#2C5F2D]/10 text-[#2C5F2D] hover:bg-[#2C5F2D]/20 border-none px-3 py-1 rounded-full gap-2 font-bold transition-all">
                                                {v} <X size={12} className="cursor-pointer" onClick={() => handleRemoveVariedad(v)} />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Geolocalización del Predio</Label>
                                        <span className="text-[10px] font-black text-[#973333] uppercase animate-pulse">Requerido para Europa (EUDR)</span>
                                    </div>
                                    <div className="relative rounded-[32px] overflow-hidden border-4 border-white shadow-lg h-48 bg-gray-100 group">
                                        <img
                                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                                            alt="Map Mockup"
                                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Button
                                                variant="secondary"
                                                className="bg-white/90 backdrop-blur-md text-[#2C5F2D] font-black rounded-2xl gap-2 hover:bg-white shadow-xl transition-all h-12"
                                                onClick={() => toast.info('Geolocalización capturada', { description: 'Lat: 1.884, Long: -76.297' })}
                                            >
                                                <MapPin size={18} /> Usar mi ubicación actual
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-[#2C5F2D]/60 pl-1">Documentación Legal</Label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 bg-white hover:border-[#2C5F2D]/30 transition-all cursor-pointer group">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#2C5F2D] group-hover:bg-[#2C5F2D]/5 transition-all">
                                            <UploadCloud size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-700">Subir Certificado de Libertad</p>
                                            <p className="text-xs text-gray-400 mt-1">Soporta PDF, JPG hasta 5MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-8 bg-white border-t border-gray-50 flex-col sm:flex-row gap-3">
                            <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-2xl h-14 font-bold order-2 sm:order-1 text-gray-400">Cancelar</Button>
                            <Button className="bg-[#2C5F2D] hover:bg-[#234d24] text-white h-14 px-10 rounded-2xl font-black order-1 sm:order-2 flex-1" onClick={handleSave}>Guardar Predio</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fincas.map((finca, idx) => (
                    <motion.div
                        key={finca.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-[#2C5F2D]/5 transition-all group overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-500">
                            <Tractor size={120} />
                        </div>

                        <div className="relative">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-[#2C5F2D] flex items-center justify-center text-white shadow-lg shadow-[#2C5F2D]/20">
                                    <MapPin size={24} />
                                </div>
                                <div className={cn('px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
                                    finca.estadoEUDR === 'Verificado' ? 'bg-green-50 text-green-700 border-green-100' :
                                        finca.estadoEUDR === 'En revisión' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-gray-50 text-gray-400 border-gray-100')}>
                                    {finca.estadoEUDR}
                                </div>
                            </div>

                            <h3 className="text-2xl font-serif font-black text-gray-900 mb-2 leading-tight">{finca.nombre}</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <MapIcon size={16} className="text-[#2C5F2D] opacity-40" />
                                    <span className="text-sm font-bold text-gray-600">{finca.ubicacion}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mountain size={16} className="text-[#2C5F2D] opacity-40" />
                                    <span className="text-sm font-bold text-gray-600">{finca.altura}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {finca.variedades.map(v => (
                                        <span key={v} className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{v}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="relative pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck size={16} className={cn(finca.estadoEUDR === 'Verificado' ? 'text-green-600' : 'text-gray-300')} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">EUDR Compliance</span>
                            </div>
                            <Button variant="ghost" size="icon" className="group/btn rounded-full text-[#2C5F2D] hover:bg-[#2C5F2D] hover:text-white transition-all shadow-none">
                                <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State / Add more hint */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: fincas.length * 0.1 }}
                    className="bg-[#FDFDF8] border-4 border-dashed border-gray-100 rounded-[40px] p-8 flex flex-col items-center justify-center text-center gap-4 group hover:border-[#2C5F2D]/20 transition-all cursor-pointer"
                    onClick={() => setIsAdding(true)}
                >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-[#2C5F2D] group-hover:scale-110 shadow-sm transition-all">
                        <Plus size={32} />
                    </div>
                    <div>
                        <p className="font-serif font-black text-gray-400 group-hover:text-[#2C5F2D] transition-colors leading-none mb-2">Registrar Nuevo Lote</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Expande tu operación</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
