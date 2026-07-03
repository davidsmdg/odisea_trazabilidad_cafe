import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    CheckCircle2,
    XCircle,
    MapPin,
    FileText,
    Image as ImageIcon,
    ShieldCheck,
    Navigation,
    Save,
    AlertCircle,
    ExternalLink,
    Landmark,
    UploadCloud,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import { FormularioAutodeclaracion } from './FormularioAutodeclaracion';

interface ValidationData {
    id: string;
    agricultor: string;
    municipio: string;
    cordenadas: { lat: string; long: string };
    archivos: { label: string; date: string; type: 'doc' | 'img' }[];
}

const MOCK_DETAIL: ValidationData = {
    id: '1',
    agricultor: 'María González',
    municipio: 'San Agustín, Huila',
    cordenadas: { lat: '1.88452', long: '-76.29712' },
    archivos: [
        { label: 'Certificado de Libertad y Tradición', date: '28 Feb 2024', type: 'doc' },
        { label: 'Mapa de zonificación forestal', date: '27 Feb 2024', type: 'doc' },
        { label: 'Foto Lote El Naranjo - Pesaje', date: '28 Feb 2024', type: 'img' },
    ],
};

const ValidationItem = ({ label, children, status, onToggle }: { label: string; children: React.ReactNode; status: boolean; onToggle: (s: boolean) => void }) => (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-blue-200 transition-all group overflow-hidden relative">
        <div className="relative">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">{label}</span>
            <div className="flex items-center gap-4">{children}</div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-10 relative">
            <div className="flex items-center gap-4 bg-slate-50/80 p-1.5 rounded-full border border-slate-100 shadow-inner">
                <button
                    onClick={() => onToggle(false)}
                    className={cn(
                        "h-10 px-4 rounded-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all",
                        !status ? "bg-red-500 text-white shadow-lg" : "text-slate-400 hover:text-red-500"
                    )}
                >
                    <XCircle size={14} /> Rechazar
                </button>
                <button
                    onClick={() => onToggle(true)}
                    className={cn(
                        "h-10 px-4 rounded-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all",
                        status ? "bg-green-600 text-white shadow-lg" : "text-slate-400 hover:text-green-600"
                    )}
                >
                    <CheckCircle2 size={14} /> Aprobar
                </button>
            </div>
        </div>

        {/* Status indicator line */}
        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500", status ? "bg-green-500" : "bg-red-500")} />
    </div>
);

export function DetalleValidacion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isDraftSaving, setIsDraftSaving] = useState(false);

    // Validation states
    const [valNombre, setValNombre] = useState(true);
    const [valUbicacion, setValUbicacion] = useState(true);
    const [valCoordenadas, setValCoordenadas] = useState(true);
    const [valArchivos, setValArchivos] = useState(true);
    const [gpsCapturado, setGpsCapturado] = useState(false);

    // Tenure and JAC settings
    const [tipoTenencia, setTipoTenencia] = useState<'escritura' | 'posesion' | 'cartaventa'>('escritura');
    const [hasJacLetter, setHasJacLetter] = useState(true);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            
            const idMap: Record<string, string> = {
                '1': 'LOT-HUILA-084',
                '2': 'LOT-ANT-112',
                '3': 'LOT-NAR-225'
            };
            const targetLoteId = idMap[id || '1'] || id || '1';
            
            let alistamientoStatus: 'Apto' | 'Subsanable' | 'No Apto' = 'Apto';
            if (!valNombre || !valUbicacion) {
                alistamientoStatus = 'No Apto';
            } else if (!valCoordenadas || !valArchivos) {
                alistamientoStatus = 'Subsanable';
            }
            
            const rawMaster = localStorage.getItem('odisea_lotes_master');
            if (rawMaster) {
                try {
                    const masterLotes = JSON.parse(rawMaster);
                    const updatedMaster = masterLotes.map((ml: any) => {
                        if (ml.id === targetLoteId) {
                            return { 
                                ...ml, 
                                estadoJAC: alistamientoStatus,
                                coordenadas: gpsCapturado ? '1.88452° N, 76.29712° W' : ml.coordenadas
                            };
                        }
                        return ml;
                    });
                    localStorage.setItem('odisea_lotes_master', JSON.stringify(updatedMaster));
                } catch(e) {}
            }
            
            toast.success('Validación guardada con éxito', {
                description: 'La información del agricultor ha sido actualizada.',
                style: { borderRadius: '24px', background: '#FDFDF8', padding: '20px' }
            });
            navigate('/lider/validaciones');
        }, 1500);
    };

    const handleSaveDraft = () => {
        setIsDraftSaving(true);
        setTimeout(() => {
            setIsDraftSaving(false);
            
            const savedDrafts = localStorage.getItem('borradores_offline_lider');
            let list = [];
            if (savedDrafts) {
                try {
                    list = JSON.parse(savedDrafts);
                } catch (e) {}
            }
            
            let alistamientoStatus: 'Apto' | 'Subsanable' | 'No Apto' = 'Apto';
            if (!valNombre || !valUbicacion) {
                alistamientoStatus = 'No Apto';
            } else if (!valCoordenadas || !valArchivos) {
                alistamientoStatus = 'Subsanable';
            }
            
            const idMap: Record<string, string> = {
                '1': 'LOT-HUILA-084',
                '2': 'LOT-ANT-112',
                '3': 'LOT-NAR-225'
            };
            const targetLoteId = idMap[id || '1'] || id || '1';
            
            const newDraft = {
                id: id || '1',
                loteId: targetLoteId,
                alistamiento: alistamientoStatus,
                gpsCapturado
            };
            
            // Remove previous draft for this id if exists
            list = list.filter((item: any) => (typeof item === 'string' ? item !== id : item.id !== id));
            list.push(newDraft);
            
            localStorage.setItem('borradores_offline_lider', JSON.stringify(list));

            toast.success('Borrador offline guardado localmente', {
                description: 'Los cambios han sido guardados en el almacenamiento local del celular.',
                style: { borderRadius: '24px', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#78350F' }
            });
            navigate('/lider/validaciones');
        }, 1000);
    };

    const handleCaptureGps = () => {
        toast.info('Capturando GPS...', { icon: <Navigation className="animate-pulse" /> });
        setTimeout(() => {
            setGpsCapturado(true);
            toast.success('GPS Capturado con éxito', { description: 'Lat: 1.88448, Long: -76.29715' });
        }, 800);
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header nav */}
            <div className="flex items-center gap-6 mb-12">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full border-2 border-slate-100 bg-white shadow-sm hover:shadow-md transition-all active:scale-90"
                    onClick={() => navigate('/lider/validaciones')}
                >
                    <ChevronLeft size={24} className="text-slate-500" />
                </Button>
                <div>
                    <h1 className="text-3xl font-sans font-black text-slate-900 tracking-tight leading-none mb-1">Revisión de Predio</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">ID: {id || '001'}</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expediente Digital TraceCafé</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Summary / Producer Info (READ ONLY) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

                        <div className="relative space-y-8">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="h-24 w-24 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center text-4xl mb-4 text-slate-400 font-sans font-black">
                                    {MOCK_DETAIL.agricultor.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-sans font-black">{MOCK_DETAIL.agricultor}</h3>
                                <p className="text-blue-400 text-xs font-black uppercase tracking-widest mt-2">Agricultor Senior</p>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-slate-800">
                                <div className="group">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Ubicación</span>
                                    <p className="font-bold flex items-center gap-2"><MapPin size={16} className="text-slate-600" /> {MOCK_DETAIL.municipio}</p>
                                </div>
                                <div className="group">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Geo-Coordenadas (GPS)</span>
                                    <p className="font-mono text-xs font-bold bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 flex justify-between items-center group-hover:border-blue-400/30 transition-all">
                                        Lat: {MOCK_DETAIL.cordenadas.lat} / Long: {MOCK_DETAIL.cordenadas.long}
                                        <Navigation size={12} className="text-blue-500 opacity-50" />
                                    </p>
                                </div>
                            </div>

                            {/* Alert / Notice for EUDR */}
                            <div className="bg-amber-900/40 rounded-3xl p-6 border border-amber-500/20">
                                <AlertCircle size={20} className="text-amber-400 mb-2" />
                                <p className="text-[10px] uppercase font-black tracking-widest text-amber-200/50 mb-1">Nota Crítica EUDR</p>
                                <p className="text-xs text-amber-100/70 leading-relaxed font-medium">Este predio se encuentra en zona de alta montaña. Verifica que la poligonal no solape con reservas naturales.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Validation Controls (PERMISO V) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-sans font-black text-slate-900 tracking-tight">Criterios de Verificación</h2>
                        <p className="text-sm text-slate-400 font-medium">Revisa cada item y valida contra evidencia física en campo o documental.</p>
                    </div>

                    <ValidationItem label="Cédula Cafetera" status={valNombre} onToggle={setValNombre}>
                        <div className="flex flex-col">
                            <span className="text-xl font-sans font-black text-slate-700">CC-10834526-9</span>
                            <span className="text-[10px] font-bold text-blue-500 uppercase">Validado con base de datos gremial</span>
                        </div>
                    </ValidationItem>

                    <ValidationItem label="Tipo de Tenencia" status={valUbicacion} onToggle={setValUbicacion}>
                        <div className="flex flex-col gap-3 w-full">
                            <select 
                                value={tipoTenencia} 
                                onChange={(e) => setTipoTenencia(e.target.value as any)}
                                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="escritura">Propiedad Titulada (Escritura Pública)</option>
                                <option value="posesion">Posesión de Buena Fe (Endoso de JAC)</option>
                                <option value="cartaventa">Carta-Venta Veredal / Compraventa Informal</option>
                            </select>

                            {tipoTenencia === 'escritura' && (
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Folio de Matrícula: 210-48293</span>
                            )}

                            {tipoTenencia !== 'escritura' && (
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/50 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-amber-900 uppercase">¿Posee Carta de Aval JAC Firmada?</span>
                                        <Switch 
                                            checked={hasJacLetter} 
                                            onCheckedChange={setHasJacLetter}
                                            className="data-[state=checked]:bg-amber-600 scale-75"
                                        />
                                    </div>
                                    <p className="text-[9px] text-amber-800/80 font-semibold leading-relaxed">
                                        Para productores sin títulos formales, el aval de la Junta de Acción Comunal certifica posesión pacífica veredal de buena fe.
                                    </p>
                                    {hasJacLetter && (
                                        <span className="text-[9px] font-black text-[#5D4037] uppercase flex items-center gap-1">
                                            <FileText size={10} /> Adjunto: Carta_Aval_JAC.pdf
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </ValidationItem>

                    <div className="bg-blue-900 rounded-[32px] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform"><Landmark size={120} /></div>
                        <div className="relative">
                            <Badge className="bg-blue-500 text-white border-none font-black text-[10px] px-3 py-1 mb-4">REQUERIMIENTO ÉTNICO (EUDR)</Badge>
                            <h3 className="text-2xl font-sans font-black mb-2">Validación de Territorio Colectivo</h3>
                            <p className="text-blue-100/70 text-sm font-medium mb-6">Como líder comunitario, debes certificar si este predio traslapa con territorios de cabildos o consejos comunitarios.</p>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-blue-300">¿Requiere Certificado de Pertenencia?</p>
                                        <p className="text-[10px] text-white/50">Emite este concepto basado en el mapa del consejo/cabildo</p>
                                    </div>
                                    <Switch
                                        className="data-[state=checked]:bg-blue-500"
                                        checked={valCoordenadas}
                                        onCheckedChange={setValCoordenadas}
                                    />
                                </div>

                                {valCoordenadas && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="pt-4 border-t border-white/10"
                                    >
                                        <div className="flex items-center gap-4 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
                                            <FileText className="text-blue-300" />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase text-blue-100">Certificado_Cabildo_Vereda.pdf</p>
                                                <p className="text-[8px] text-blue-300">Emitido por: Cabildo Indígena Yanacona</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20"><ExternalLink size={14} /></Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Coordinate Validation with GPS CAPTURE */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col gap-6 shadow-sm hover:border-blue-600 transition-all group overflow-hidden relative">
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500", valCoordenadas ? "bg-green-500" : "bg-red-500")} />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="relative flex-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Validación en Terreno (GPS)</span>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-10">
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm"><Navigation size={14} /></div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-slate-400">Capturado por Agricultor</p>
                                                <p className="text-xs font-mono font-bold text-slate-800">{MOCK_DETAIL.cordenadas.lat}, {MOCK_DETAIL.cordenadas.long}</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200 hidden md:block" />
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm", gpsCapturado ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400")}>
                                                <ShieldCheck size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-slate-400">Contrapeso Líder (GPS)</p>
                                                <p className="text-xs font-mono font-bold text-slate-800">{gpsCapturado ? "1.88448, -76.29715" : "---"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleCaptureGps}
                                        variant="secondary"
                                        className="h-12 w-full sm:w-auto rounded-xl bg-blue-600 text-white hover:bg-blue-700 gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
                                    >
                                        <MapPin size={16} /> Capturar mi coordenada actual
                                    </Button>
                                    <p className="text-[10px] font-medium text-slate-400 italic">Captura automática del sensor del celular (Simulada para demo).</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-50/80 p-1.5 rounded-full border border-slate-100 shadow-inner h-fit">
                                <button onClick={() => setValCoordenadas(false)} className={cn("h-10 px-4 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest", !valCoordenadas ? "bg-red-500 text-white shadow-lg" : "text-slate-400")}><XCircle size={14} /> Rechazar</button>
                                <button onClick={() => setValCoordenadas(true)} className={cn("h-10 px-4 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest", valCoordenadas ? "bg-green-600 text-white shadow-lg" : "text-slate-400")}><CheckCircle2 size={14} /> Aprobar</button>
                            </div>
                        </div>
                    </div>

                    {/* Files Validation */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col gap-8 shadow-sm group overflow-hidden relative">
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500", valArchivos ? "bg-green-500" : "bg-red-500")} />

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                            <div className="flex-1 space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Archivos Adjuntos (Digitalizados)</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {MOCK_DETAIL.archivos.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-[#F8FAFC] hover:border-slate-200 transition-all cursor-pointer group/file">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover/file:text-blue-600 shadow-sm transition-colors">
                                                {file.type === 'doc' ? <FileText size={20} /> : <ImageIcon size={20} />}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter">{file.label}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{file.date}</p>
                                            </div>
                                            <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover/file:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4">
                                    <Button
                                        variant="outline"
                                        className="h-11 border-dashed border-[#1A365D]/30 bg-slate-50 hover:bg-[#1A365D]/5 text-[#1A365D] font-black text-[10px] uppercase tracking-widest rounded-xl w-full sm:w-auto gap-2"
                                        onClick={() => {
                                            toast.info("Iniciando escáner de cámara para digitalizar documento físico del productor...", {
                                                description: "La metadata de georreferenciación y fecha de captura serán inyectadas en el PDF."
                                            });
                                        }}
                                    >
                                        <UploadCloud size={14} /> Cargar/Digitalizar Soporte en Campo
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-50/80 p-1.5 rounded-full border border-slate-100 shadow-inner h-fit">
                                <button onClick={() => setValArchivos(false)} className={cn("h-10 px-4 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest", !valArchivos ? "bg-red-500 text-white shadow-lg" : "text-slate-400")}><XCircle size={14} /> Rechazar</button>
                                <button onClick={() => setValArchivos(true)} className={cn("h-10 px-4 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest", valArchivos ? "bg-green-600 text-white shadow-lg" : "text-slate-400")}><CheckCircle2 size={14} /> Aprobar</button>
                            </div>
                        </div>
                    </div>

                    <div className="py-12">
                        <div className="h-px bg-slate-100 w-full mb-12" />
                        <FormularioAutodeclaracion />
                    </div>

                    {/* Final Action Button */}
                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                        <Button
                            disabled={isSaving || isDraftSaving}
                            onClick={handleSaveDraft}
                            variant="secondary"
                            className="h-16 sm:h-20 flex-1 rounded-2xl sm:rounded-[32px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-base shadow-sm border border-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Save size={18} className="shrink-0" /> Guardar Borrador (Offline)
                        </Button>
                        
                        <Button
                            disabled={isSaving || isDraftSaving}
                            onClick={handleSave}
                            className="h-16 sm:h-20 flex-[2] rounded-2xl sm:rounded-[32px] bg-[#1A365D] hover:bg-[#11243e] text-white font-black text-base sm:text-lg shadow-2xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <CheckCircle2 size={18} className="shrink-0" /> Enviar Validación Final
                        </Button>
                    </div>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">Certifico que la información revisada es veraz y cumple la política de TraceCafé.</p>
                </div>
            </div>
        </div>
    );
}
