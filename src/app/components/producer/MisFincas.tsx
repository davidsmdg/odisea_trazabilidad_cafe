import { useState } from 'react';
import { motion } from 'motion/react';
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
    CloudRainWind,
    AlertTriangle,
    Leaf,
    Droplets,
    Sprout,
    Navigation
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

interface LoteCafe {
    id: string;
    nombre: string;
    area: string;
    variedades: string[];
    coordenadaCentral: string; // Un solo punto
    estadoEUDR: 'Verificado' | 'En revisión' | 'Pendiente';
}

interface Finca {
    id: string;
    nombre: string;
    departamento: string;
    municipio: string;
    cedulaCafetera: string;
    tipoTenencia: string;
    esComunidadEtnica: boolean;
    lotesDeCafe: LoteCafe[];
}

const REGIONES_COLOMBIA = {
    'Antioquia': ['Dabeiba', 'Andes', 'Concordia', 'Jericó', 'Salgar'],
    'Huila': ['Palestina', 'Pitalito', 'San Agustín', 'Acevedo', 'Garzón'],
    'Cauca': ['Piendamó', 'Santander de Quilichao', 'Totoró', 'Inzá'],
    'Tolima': ['Planadas', 'Ibagué', 'Líbano', 'Chaparral'],
    'Caldas': ['Manizales', 'Chinchiná', 'Palestina', 'Anserma']
};

const DEPARTAMENTOS_DATA: Record<string, any> = {
    'Antioquia': {
        escenarioFao: {
            alerta: 'Riesgo Climático: Alto',
            nivelAfectacion: 4,
            textoNivel: 'Alto',
            plazoImpacto: 'Mediano Plazo (Dentro de 3 a 5 años)',
            impactoResumen: 'Las proyecciones indican un aumento agresivo de T (°C) y variaciones muy extremas en las lluvias (sequías largas seguidas de aguaceros fuertes).',
            buenasPracticas: [
                { id: 1, tipo: 'Suelo', texto: 'Sembrar coberturas nobles (malezas buenas) para proteger el suelo que se va a resecar.' },
                { id: 2, tipo: 'Ambiental', texto: 'Empezar a plantar árboles de sombrío nativos (Guamo, Nogal) desde ya.' },
                { id: 3, tipo: 'Agua', texto: 'Construir reservorios forrados para recolectar agua lluvia en el invierno.' }
            ],
            link: 'https://cambioclimatico.fao.org.co/antioquia/',
        }
    },
    'Huila': {
        escenarioFao: {
            alerta: 'Riesgo de Sequía: Moderado',
            nivelAfectacion: 3,
            textoNivel: 'Medio',
            plazoImpacto: 'Corto Plazo (En los próximos 1 a 2 años)',
            impactoResumen: 'Se esperan veranos y sequías mucho más largas en ciertas zonas. El cultivo se estresará por falta de agua.',
            buenasPracticas: [
                { id: 1, tipo: 'Suelo', texto: 'Evitar al máximo el uso de herbicidas pesados (glifosato) que desnudan la tierra.' },
                { id: 2, tipo: 'Agua', texto: 'Organizar riego por goteo con las fuentes de agua actuales y proteger nacimientos.' },
                { id: 3, tipo: 'Manejo', texto: 'No hacer podas drásticas o zoqueo justo antes de que se presenten las épocas secas.' }
            ],
            link: '#',
        }
    },
    'Cauca': {
        escenarioFao: {
            alerta: 'Riesgo Exceso de Lluvias: Medio/Alto',
            nivelAfectacion: 4,
            textoNivel: 'Alto',
            plazoImpacto: 'Inmediato (Tendencias actuales agudizándose)',
            impactoResumen: 'Aumento severo de humedad en cultivos por exceso de precipitación. Ideal para la propagación rápida de roya.',
            buenasPracticas: [
                { id: 1, tipo: 'Ambiental', texto: 'Mantener limpios los drenajes y zanjas en toda la finca.' },
                { id: 2, tipo: 'Manejo', texto: 'Manejar la sombra para que circule el viento y no encerrar la frescura.' },
                { id: 3, tipo: 'Suelo', texto: 'Aplicar abonos bien balanceados (no exceder Nitrógeno) para fortalecer defensas.' }
            ],
            link: '#',
        }
    }
};

const INITIAL_FINCAS: Finca[] = [
    {
        id: '1',
        nombre: 'Finca La Esperanza',
        departamento: 'Huila',
        municipio: 'Palestina',
        cedulaCafetera: 'CC-108345',
        tipoTenencia: 'Propiedad Titulada',
        esComunidadEtnica: false,
        lotesDeCafe: [
            {
                id: 'p1',
                nombre: 'Lote El Mirador',
                area: '2.5',
                variedades: ['Caturra'],
                coordenadaCentral: 'Lat: 1.884, Long: -76.297',
                estadoEUDR: 'Verificado'
            },
            {
                id: 'p2',
                nombre: 'Lote La Quebrada',
                area: '1.8',
                variedades: ['Castillo'],
                coordenadaCentral: '',
                estadoEUDR: 'Pendiente'
            }
        ]
    }
];

export function MisFincas() {
    const [fincas, setFincas] = useState<Finca[]>(INITIAL_FINCAS);
    const [isFincaDialogOpen, setIsFincaDialogOpen] = useState(false);
    const [isLoteDialogOpen, setIsLoteDialogOpen] = useState(false);
    const [selectedFincaId, setSelectedFincaId] = useState<string | null>(null);
    const [editingFincaId, setEditingFincaId] = useState<string | null>(null);
    const [editingLoteId, setEditingLoteId] = useState<string | null>(null);

    // Finca Form State
    const [fincaNombre, setFincaNombre] = useState('');
    const [fincaDepartamento, setFincaDepartamento] = useState('');
    const [fincaMunicipio, setFincaMunicipio] = useState('');
    const [cedulaCafetera, setCedulaCafetera] = useState('');
    const [tipoTenencia, setTipoTenencia] = useState('Propiedad Titulada');
    const [esComunidadEtnica, setEsComunidadEtnica] = useState(false);

    // Lote Form State
    const [loteNombre, setLoteNombre] = useState('');
    const [loteArea, setLoteArea] = useState('');
    const [loteVariedades, setLoteVariedades] = useState<string[]>([]);
    const [currentVariedad, setCurrentVariedad] = useState('');
    const [coordenadas, setCoordenadas] = useState('');
    const [autodeclaracionAmbiental, setAutodeclaracionAmbiental] = useState(false);

    const openAddFinca = () => {
        setEditingFincaId(null);
        setFincaNombre('');
        setFincaDepartamento('');
        setFincaMunicipio('');
        setCedulaCafetera('');
        setTipoTenencia('Propiedad Titulada');
        setEsComunidadEtnica(false);
        setIsFincaDialogOpen(true);
    };

    const openEditFinca = (finca: Finca) => {
        setEditingFincaId(finca.id);
        setFincaNombre(finca.nombre);
        setFincaDepartamento(finca.departamento);
        setFincaMunicipio(finca.municipio);
        setCedulaCafetera(finca.cedulaCafetera);
        setTipoTenencia(finca.tipoTenencia);
        setEsComunidadEtnica(finca.esComunidadEtnica);
        setIsFincaDialogOpen(true);
    };

    const openAddLote = (fincaId: string) => {
        setSelectedFincaId(fincaId);
        setEditingLoteId(null);
        setLoteNombre('');
        setLoteArea('');
        setLoteVariedades([]);
        setCoordenadas('');
        setAutodeclaracionAmbiental(false);
        setIsLoteDialogOpen(true);
    };

    const openEditLote = (fincaId: string, lote: LoteCafe) => {
        setSelectedFincaId(fincaId);
        setEditingLoteId(lote.id);
        setLoteNombre(lote.nombre);
        setLoteArea(lote.area);
        setLoteVariedades(lote.variedades);
        setCoordenadas(lote.coordenadaCentral);
        setIsLoteDialogOpen(true);
    };

    const handleSaveFinca = () => {
        if (!fincaNombre || !fincaDepartamento || !fincaMunicipio || !cedulaCafetera) {
            toast.error('Por favor completa los campos obligatorios');
            return;
        }

        const fincaData: Partial<Finca> = {
            nombre: fincaNombre,
            departamento: fincaDepartamento,
            municipio: fincaMunicipio,
            cedulaCafetera,
            tipoTenencia,
            esComunidadEtnica,
        };

        if (editingFincaId) {
            setFincas(fincas.map(f => f.id === editingFincaId ? { ...f, ...fincaData } as Finca : f));
            toast.success('Finca actualizada');
        } else {
            const newFinca: Finca = {
                id: Date.now().toString(),
                lotesDeCafe: [],
                ...fincaData,
            } as Finca;
            setFincas([...fincas, newFinca]);
            toast.success('Finca registrada con éxito');
        }
        setIsFincaDialogOpen(false);
    };

    const handleSaveLote = () => {
        if (!loteNombre || !loteArea) {
            toast.error('Completa el nombre y área del lote de café');
            return;
        }

        const loteData: LoteCafe = {
            id: editingLoteId || Date.now().toString(),
            nombre: loteNombre,
            area: loteArea,
            variedades: loteVariedades,
            coordenadaCentral: coordenadas,
            estadoEUDR: coordenadas ? 'En revisión' : 'Pendiente',
        };

        setFincas(fincas.map(f => {
            if (f.id === selectedFincaId) {
                const newLotes = editingLoteId
                    ? f.lotesDeCafe.map(l => l.id === editingLoteId ? loteData : l)
                    : [...f.lotesDeCafe, loteData];
                return { ...f, lotesDeCafe: newLotes };
            }
            return f;
        }));

        toast.success(editingLoteId ? 'Lote actualizado' : 'Lote de café añadido');
        setIsLoteDialogOpen(false);
    };

    const handleGetLocation = () => {
        // Simulamos obtener coordenada GPS exacta
        setTimeout(() => {
            setCoordenadas(`Lat: 4.${Math.floor(100 + Math.random() * 800)}, Long: -75.${Math.floor(100 + Math.random() * 800)}`);
            toast.success('Punto GPS capturado exitosamente');
        }, 800);
    };

    const handleAddVariedad = () => {
        if (currentVariedad && !loteVariedades.includes(currentVariedad)) {
            setLoteVariedades([...loteVariedades, currentVariedad]);
            setCurrentVariedad('');
        }
    };

    const handleRemoveVariedad = (v: string) => {
        setLoteVariedades(loteVariedades.filter((item) => item !== v));
    };

    const renderScale = (nivel: number) => {
        return (
            <div className="flex items-center gap-1 w-full mt-2">
                {[1, 2, 3, 4, 5].map((i) => {
                    let bgColor = 'bg-gray-200';
                    if (i <= nivel) {
                        if (nivel <= 2) bgColor = 'bg-emerald-400';
                        else if (nivel === 3) bgColor = 'bg-amber-400';
                        else bgColor = 'bg-red-500';
                    }
                    return (
                        <div key={i} className={`h-2 flex-1 rounded-full ${bgColor} transition-colors duration-500`}></div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-sans font-black text-gray-900 tracking-tight">Mis Fincas</h1>
                    <p className="text-gray-500 font-medium">Gestiona tus predios y lotes de café para exportación EUDR.</p>
                </div>
            </div>

            {/* List of Fincas */}
            <div className="space-y-12">
                {fincas.map((finca) => {
                    const dData = DEPARTAMENTOS_DATA[finca.departamento] || DEPARTAMENTOS_DATA['Antioquia'];
                    const fao = dData.escenarioFao;

                    return (
                        <div key={finca.id} className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Finca Header */}
                            <div className="bg-[#5f705f] p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
                                <div className="absolute top-0 right-0 p-10 opacity-10"><Tractor size={120} /></div>
                                <div className="relative">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Badge className="bg-white/20 text-white border-white/30 text-[10px] uppercase font-black tracking-widest">Finca Productora</Badge>
                                        <span className="text-white/60 text-xs font-bold">{finca.municipio}, {finca.departamento}</span>
                                    </div>
                                    <h2 className="text-4xl font-sans font-black">{finca.nombre}</h2>
                                    <div className="flex items-center gap-6 mt-4 opacity-80">
                                        <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle size={14} className="text-[#e3d5b8]" /> CC: {finca.cedulaCafetera}
                                        </p>
                                        <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <MapIcon size={14} className="text-[#e3d5b8]" /> {finca.lotesDeCafe.length} Lotes de Café
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 relative z-10">
                                    <Button
                                        onClick={() => openEditFinca(finca)}
                                        variant="outline"
                                        className="border-white/40 bg-white/10 hover:bg-white/20 text-white h-12 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer"
                                    >
                                        Editar Finca
                                    </Button>
                                    <Button
                                        onClick={() => openAddLote(finca.id)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-400 h-12 rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-lg cursor-pointer"
                                    >
                                        <Plus size={16} /> Añadir Lote de Café
                                    </Button>
                                </div>
                            </div>

                            {/* LOTES DE CAFE */}
                            <div className="p-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 pl-1">Lotes de Café (Monitoreo)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {finca.lotesDeCafe.map((lote) => (
                                        <div
                                            key={lote.id}
                                            className="group bg-[#FDFDF8] rounded-[32px] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-[#5f705f]/10 transition-all border-b-4 border-b-[#5f705f]/20 cursor-pointer"
                                            onClick={() => openEditLote(finca.id, lote)}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#5f705f] shadow-sm transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                                    <MapPin size={20} />
                                                </div>
                                                <Badge className={cn('text-[10px] font-black uppercase px-3 py-1 rounded-full border-none shadow-sm',
                                                    lote.estadoEUDR === 'Verificado' ? 'bg-[#8a9a8a] text-white' :
                                                        lote.estadoEUDR === 'En revisión' ? 'bg-amber-400 text-white' : 'bg-gray-200 text-gray-600')}>
                                                    {lote.estadoEUDR}
                                                </Badge>
                                            </div>
                                            <h4 className="text-xl font-sans font-black text-gray-900 mb-2">{lote.nombre}</h4>
                                            <div className="space-y-3 mb-6">
                                                <p className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                                    <Mountain size={14} className="opacity-40" /> {lote.area} Hectáreas
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {lote.variedades.map(v => (
                                                        <span key={v} className="bg-gray-100 text-gray-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">{v}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#5f705f] flex items-center gap-2">
                                                    {lote.coordenadaCentral ? <><ShieldCheck size={14} /> GPS Registrado</> : <><Navigation size={14} /> GPS Pendiente</>}
                                                </span>
                                                <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    ))}

                                    {finca.lotesDeCafe.length === 0 && (
                                        <div className="col-span-full py-20 border-4 border-dashed border-gray-50 rounded-[40px] flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4"><MapIcon size={40} /></div>
                                            <p className="font-sans font-black text-gray-300 text-xl">Sin Lotes Registrados</p>
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">Añade lotes de café para iniciar el registro</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ESCENARIO CLIMÁTICO DE LA FINCA */}
                            <div className="bg-[#5f705f]/5 p-10 border-t border-gray-100">
                                <Card className="bg-white border-2 border-[#5f705f]/10 rounded-3xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
                                    <div className="p-8 lg:w-1/3 bg-gray-50 border-r border-[#5f705f]/10 flex flex-col justify-center">
                                        <h3 className="text-xl font-black text-gray-800 mb-3 flex items-center gap-2">
                                            <CloudRainWind className="text-[#5f705f]" />
                                            Cambio Climático
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                                            Nota: Te entregamos esta información crucial para que puedas anticiparte. Este análisis y nivel de afectación están basados directamente en proyecciones oficiales de la <strong>FAO</strong> y las Naciones Unidas para la zona agrícola de <strong>{finca.departamento}</strong>.
                                        </p>
                                        <div>
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-[11px] font-black uppercase tracking-wider text-gray-600">Impacto en su Finca</span>
                                                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${fao.nivelAfectacion <= 2 ? 'bg-emerald-100 text-emerald-800' :
                                                    fao.nivelAfectacion === 3 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    Riesgo {fao.textoNivel}
                                                </span>
                                            </div>
                                            {renderScale(fao.nivelAfectacion)}
                                        </div>
                                    </div>
                                    <div className="p-8 lg:w-2/3">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6">
                                            <div className="flex items-center gap-2 mb-2 text-[#5f705f]">
                                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                <span className="text-xs font-black uppercase tracking-widest text-amber-700">{fao.plazoImpacto}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                                {fao.impactoResumen}
                                            </p>
                                        </div>

                                        <div>
                                            <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4" /> Mitigación y Buenas Prácticas
                                            </h5>
                                            <div className="space-y-3">
                                                {fao.buenasPracticas.map((bp: any) => (
                                                    <div key={bp.id} className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                                        <div className="mt-0.5 text-[#5f705f]">
                                                            {bp.tipo === 'Suelo' ? <Leaf size={16} /> :
                                                                bp.tipo === 'Agua' ? <Droplets size={16} /> : <Sprout size={16} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#5f705f] uppercase tracking-widest mb-0.5">{bp.tipo}</p>
                                                            <p className="text-xs text-gray-700 font-medium">{bp.texto}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                        </div>
                    )
                })}

                {/* New Finca Dialog / Trigger */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#FDFDF8] border-4 border-dashed border-gray-100 rounded-[40px] p-20 flex flex-col items-center justify-center text-center gap-6 group hover:border-[#5f705f]/20 transition-all cursor-pointer"
                    onClick={openAddFinca}
                >
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-emerald-600 group-hover:text-emerald-700 group-hover:bg-emerald-50 group-hover:scale-110 shadow-sm transition-all border border-emerald-100">
                        <Plus size={48} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-sans font-black text-gray-500 group-hover:text-[#5f705f] transition-colors mb-2">Registrar Nueva Finca</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Gestiona múltiples predios y lotes de café</p>
                    </div>
                </motion.div>
            </div>

            {/* Finca Form Dialog */}
            <Dialog open={isFincaDialogOpen} onOpenChange={setIsFincaDialogOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-[40px] p-0 overflow-hidden bg-[#FDFDF8]">
                    <div className="bg-[#5f705f] p-8 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-sans font-black">
                                {editingFincaId ? 'Editar Finca' : 'Nueva Finca'}
                            </DialogTitle>
                            <DialogDescription className="text-white/70 font-medium">Información general de la propiedad.</DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-[10px] font-black uppercase mb-1 block opacity-40">Nombre de la Finca / Predio</Label>
                                <Input value={fincaNombre} onChange={e => setFincaNombre(e.target.value)} className="h-12 rounded-xl" placeholder="Ej: Finca La Esperanza" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-[10px] font-black uppercase mb-1 block opacity-40">Departamento</Label>
                                    <select
                                        value={fincaDepartamento}
                                        onChange={e => {
                                            setFincaDepartamento(e.target.value);
                                            setFincaMunicipio('');
                                        }}
                                        className="w-full h-12 rounded-xl border border-gray-100 px-4 text-sm font-medium"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {Object.keys(REGIONES_COLOMBIA).map(dep => (
                                            <option key={dep} value={dep}>{dep}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-black uppercase mb-1 block opacity-40">Municipio</Label>
                                    <select
                                        value={fincaMunicipio}
                                        onChange={e => setFincaMunicipio(e.target.value)}
                                        disabled={!fincaDepartamento}
                                        className="w-full h-12 rounded-xl border border-gray-100 px-4 text-sm font-medium disabled:opacity-30"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {fincaDepartamento && REGIONES_COLOMBIA[fincaDepartamento as keyof typeof REGIONES_COLOMBIA].map(mun => (
                                            <option key={mun} value={mun}>{mun}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-[10px] font-black uppercase mb-1 block opacity-40">Cédula Cafetera</Label>
                                    <Input value={cedulaCafetera} onChange={e => setCedulaCafetera(e.target.value)} className="h-12 rounded-xl" />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-black uppercase mb-1 block opacity-40">Tenencia</Label>
                                    <select value={tipoTenencia} onChange={e => setTipoTenencia(e.target.value)} className="w-full h-12 rounded-xl border border-gray-100 px-4 text-sm font-medium">
                                        <option>Propiedad Titulada</option>
                                        <option>Contrato</option>
                                        <option>Posesión</option>
                                        <option>Tierra Colectiva</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 border-t bg-gray-50">
                        <Button variant="ghost" onClick={() => setIsFincaDialogOpen(false)}>Cancelar</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-xl font-black" onClick={handleSaveFinca}>Guardar Finca</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Lote Dialog */}
            <Dialog open={isLoteDialogOpen} onOpenChange={setIsLoteDialogOpen}>
                <DialogContent className="sm:max-w-[700px] rounded-[40px] p-0 overflow-hidden bg-[#FDFDF8]">
                    <div className="bg-emerald-950 p-8 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-sans font-black flex items-center gap-3">
                                <Sprout className="text-emerald-400" /> {editingLoteId ? 'Editar Lote de Café' : 'Nuevo Lote de Café'}
                            </DialogTitle>
                            <DialogDescription className="text-white/50">Crea un lote y captura sus datos para el cumplimiento.</DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-[10px] font-black uppercase mb-1 block opacity-40">Nombre del Lote</Label>
                                    <Input value={loteNombre} onChange={e => setLoteNombre(e.target.value)} className="h-12 rounded-xl" placeholder="Ej: Lote Oriental" />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-black uppercase mb-1 block opacity-40">Área Geográfica (Hectáreas)</Label>
                                    <div className="relative">
                                        <Input type="number" value={loteArea} onChange={e => setLoteArea(e.target.value)} className="h-12 rounded-xl pr-12" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">Ha</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase opacity-40">Variedades Sembradas</Label>
                                    <div className="flex gap-2">
                                        <Input value={currentVariedad} onChange={e => setCurrentVariedad(e.target.value)} placeholder="Ej: Geisha" className="h-10 rounded-lg" onKeyDown={e => e.key === 'Enter' && handleAddVariedad()} />
                                        <Button onClick={handleAddVariedad} size="sm" variant="outline" className="h-10 w-10"><Plus size={16} /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {loteVariedades.map(v => (
                                            <Badge key={v} className="bg-emerald-50 text-emerald-700 border-none px-2 rounded-md">{v} <X size={10} onClick={() => handleRemoveVariedad(v)} className="ml-2 cursor-pointer" /></Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase opacity-40 block">Ubicación GPS (Punto Único)</Label>
                                <div className="aspect-square bg-gray-100 rounded-3xl border-4 border-white shadow-xl overflow-hidden relative flex flex-col items-center justify-center p-6 text-center">
                                    <Navigation size={48} className={coordenadas ? "text-[#5f705f] mb-4" : "text-gray-300 mb-4"} />
                                    <Button
                                        onClick={handleGetLocation}
                                        className={cn("bg-emerald-600 text-white font-black rounded-xl gap-2 shadow-xl hover:bg-emerald-700 transition-all cursor-pointer h-12 w-full", coordenadas && "bg-[#5f705f]")}
                                    >
                                        <MapPin size={20} /> {coordenadas ? 'Actualizar Coordenada' : 'Capturar Mi Ubicación Actual'}
                                    </Button>
                                    {coordenadas && <p className="text-xs font-black text-[#5f705f] bg-white px-4 py-2 border border-[#5f705f]/20 rounded-xl mt-4 shadow-sm w-full">{coordenadas}</p>}
                                    {!coordenadas && <p className="text-[10px] text-gray-400 mt-4 leading-tight">Opcionalmente párate en medio del lote y presiona capturar.</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 border-t bg-gray-50 flex justify-between items-center sm:justify-end">
                        <Button variant="ghost" onClick={() => setIsLoteDialogOpen(false)}>Cancelar</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-10 rounded-xl font-black cursor-pointer" onClick={handleSaveLote}>Guardar Lote</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
