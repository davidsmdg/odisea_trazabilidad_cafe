import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Leaf,
    TreePine,
    Droplets,
    UploadCloud,
    CheckCircle2,
    ShieldCheck,
    Image as ImageIcon,
    Save,
    Camera,
    User,
    MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

export function BuenasPracticas() {
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'fertilizantes' | 'sombra' | 'agua'>('fertilizantes');
    const [uploadedImages, setUploadedImages] = useState<Record<string, string[]>>({
        fertilizantes: [],
        sombra: [],
        agua: []
    });

    const handleUploadMock = () => {
        // Simular que se sube una foto al hacer click
        const newImages = { ...uploadedImages };
        newImages[activeTab].push('https://images.unsplash.com/photo-1592982537447-66c5d18c3af5?auto=format&fit=crop&q=80&w=400');
        setUploadedImages(newImages);
        toast.success('Evidencia fotográfica cargada correctamente.', {
            style: { borderRadius: '24px', background: '#ecfdf5', border: '1px solid #10b981', color: '#4A5B4A' }
        });
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Registro de Buenas Prácticas Guardado', {
                description: `Las evidencias han sido vinculadas al perfil del productor.`,
                style: { borderRadius: '24px', background: '#ecfdf5', border: '1px solid #10b981', color: '#4A5B4A' }
            });
            // Opcional reset o redirigir
        }, 1500);
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4">
            {/* Minimalist Header */}
            <div className="flex flex-col gap-4 mb-10 mt-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm">
                        <Leaf size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-sans font-black text-emerald-950 tracking-tight leading-none">
                            Repositorio de Buenas Prácticas
                        </h1>
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-600/70 mt-1">
                            Anexo Fotográfico de Sostenibilidad Agrícola
                        </p>
                    </div>
                </div>
                <p className="text-sm font-medium text-emerald-800/60 max-w-2xl leading-relaxed">
                    Documenta en terreno o recibe las evidencias del productor sobre el uso correcto de fertilizantes, la implementación de sistemas agroforestales (sombra) y el manejo responsable del agua. Estas evidencias suman puntos en la confianza de la Trazabilidad EUDR.
                </p>
            </div>

            {/* SELECCIÓN DE PRODUCTOR Y PARCELA */}
            <div className="bg-white p-6 rounded-[32px] border border-emerald-100 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-center z-10 relative">
                <div className="flex-1 w-full space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1.5"><User size={12} /> Productor Asociado</Label>
                    <select className="flex h-14 w-full rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none">
                        <option value="">Seleccione un Productor...</option>
                        <option value="maria">María González - ID: 1029384</option>
                        <option value="carlos">Carlos Martínez - ID: 3948572</option>
                        <option value="jorge">Jorge Torres - ID: 9283746</option>
                    </select>
                </div>
                <div className="flex-1 w-full space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1.5"><MapPin size={12} /> Finca o Parcela Destino</Label>
                    <select className="flex h-14 w-full rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none">
                        <option value="">Seleccione la Finca...</option>
                        <option value="esperanza">Finca La Esperanza (San Agustín)</option>
                        <option value="mirador">El Mirador (Acevedo)</option>
                        <option value="helena">Santa Helena (Garzón)</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-emerald-100 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

                {/* Sidemenu Categories */}
                <div className="lg:w-[320px] bg-slate-50 border-r border-emerald-50 p-8 flex flex-col gap-4 shrink-0">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Categorías de Evidencia</h3>

                    <button
                        onClick={() => setActiveTab('fertilizantes')}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-sm cursor-pointer group text-left",
                            activeTab === 'fertilizantes'
                                ? "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-200"
                                : "text-slate-500 hover:bg-white hover:text-emerald-700"
                        )}
                    >
                        <Leaf size={20} className={activeTab === 'fertilizantes' ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"} />
                        Uso de Fertilizantes
                    </button>

                    <button
                        onClick={() => setActiveTab('sombra')}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-sm cursor-pointer group text-left",
                            activeTab === 'sombra'
                                ? "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-200"
                                : "text-slate-500 hover:bg-white hover:text-emerald-700"
                        )}
                    >
                        <TreePine size={20} className={activeTab === 'sombra' ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"} />
                        Árboles y Sombra
                    </button>

                    <button
                        onClick={() => setActiveTab('agua')}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-sm cursor-pointer group text-left",
                            activeTab === 'agua'
                                ? "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-200"
                                : "text-slate-500 hover:bg-white hover:text-emerald-700"
                        )}
                    >
                        <Droplets size={20} className={activeTab === 'agua' ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"} />
                        Gestión Hídrica
                    </button>

                    <div className="mt-auto pt-8 border-t border-slate-200">
                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3 text-amber-800">
                            <ShieldCheck size={20} className="shrink-0 text-amber-600" />
                            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Estas fotos se asocian al pasaporte digital del café para demostrar cumplimiento ambiental.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area para Cargar Fotos */}
                <div className="flex-1 p-8 lg:p-12 flex flex-col relative bg-[#FDFDFB]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="flex-1 flex flex-col"
                        >
                            <div className="mb-8">
                                <h2 className="text-2xl font-sans font-black text-slate-800 mb-2">
                                    {activeTab === 'fertilizantes' && "Evidencia: Aplicación de Insumos"}
                                    {activeTab === 'sombra' && "Evidencia: Sistemas Agroforestales"}
                                    {activeTab === 'agua' && "Evidencia: Tratamiento de Agua"}
                                </h2>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                    Sube imágenes que demuestren las prácticas agronómicas en finca.
                                </p>

                                {activeTab === 'fertilizantes' && (
                                    <div className="bg-emerald-50/50 p-6 rounded-[24px] border border-emerald-100/50 mb-6 text-left space-y-3">
                                        <p className="text-[10px] font-black uppercase text-emerald-800 tracking-widest">Chequeo Técnico de Insumos (Auditoría Odisea)</p>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 text-xs font-semibold text-[#4A5B4A] cursor-pointer">
                                                <input type="checkbox" defaultChecked className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                                                <span>Bodega de Insumos con ventilación adecuada y rotulación de seguridad</span>
                                            </label>
                                            <label className="flex items-center gap-3 text-xs font-semibold text-[#4A5B4A] cursor-pointer">
                                                <input type="checkbox" defaultChecked className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                                                <span>Práctica obligatoria de triple lavado para recipientes vacíos</span>
                                            </label>
                                            <label className="flex items-center gap-3 text-xs font-semibold text-[#4A5B4A] cursor-pointer">
                                                <input type="checkbox" defaultChecked className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                                                <span>Ausencia absoluta de quemas de rastrojos o suelos</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dropzone Area */}
                            <div
                                onClick={handleUploadMock}
                                className="border-2 border-dashed border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-400 rounded-[32px] h-[200px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <UploadCloud size={28} className="text-emerald-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-emerald-800">Haz clic para buscar fotos o arrástralas aquí</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/60 mt-1">Soporta JPG, PNG con metadatos GPS</p>
                                </div>
                            </div>

                            {/* Galería de Subidas */}
                            <div className="mt-10">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <ImageIcon size={14} /> Archivos Subidos ({uploadedImages[activeTab].length})
                                </h4>

                                {uploadedImages[activeTab].length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-[24px]">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No hay evidencias en esta categoría</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {uploadedImages[activeTab].map((url, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-[24px] overflow-hidden border-4 border-white shadow-md group">
                                                <img src={`${url}&sig=${idx}`} alt="Evidencia" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <CheckCircle2 size={32} className="text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    </AnimatePresence>

                    {/* Submit Button */}
                    <div className="mt-auto pt-10 flex justify-end">
                        <Button
                            disabled={isSaving}
                            onClick={handleSave}
                            className="h-16 px-10 rounded-2xl bg-[#4A5B4A] hover:bg-emerald-950 text-white font-black text-lg shadow-xl transition-all active:scale-95 flex items-center gap-3 cursor-pointer"
                        >
                            <Save size={20} className={isSaving ? "animate-pulse" : "text-emerald-400"} />
                            {isSaving ? "Guardando Registro..." : "Vincular al Perfil del Productor"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
