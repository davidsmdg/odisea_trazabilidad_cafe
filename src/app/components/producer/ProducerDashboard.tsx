import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
    Sprout,
    TrendingUp,
    PlusCircle,
    MapPin,
    Building2,
    ShoppingBag,
    Star,
    Coffee,
    ArrowRight,
    CloudSun,
    Leaf,
    AlertTriangle,
    ShieldCheck,
    CloudRainWind,
    Droplets
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { getLotes } from '../../../services/lotesService';
import { getFincas } from '../../../services/fincasService';
import { useMemo } from 'react';

// Mock data para departamentos (precios y clima robustecido)
const DEPARTAMENTOS_DATA: Record<string, any> = {
    'Antioquia': {
        precioBase: 2185000,
        factorRendimiento: 89.5,
        climaActual: { temp: '24°C', lluvia: 'Probabilidad media', viento: '14 km/h' },
        escenarioFao: {
            alerta: 'Riesgo Climático: Alto',
            nivelAfectacion: 4, // Escala de 1 a 5
            textoNivel: 'Alto',
            plazoImpacto: 'Mediano Plazo (Dentro de 3 a 5 años)',
            impactoResumen: 'Las proyecciones indican un aumento agresivo de T (°C) y variaciones muy extremas en las lluvias (sequías largas seguidas de aguaceros).',
            buenasPracticas: [
                { id: 1, tipo: 'Suelo', texto: 'Sembrar coberturas nobles (malezas buenas) para proteger el suelo que se va a resecar.' },
                { id: 2, tipo: 'Ambiental', texto: 'Empezar a plantar árboles de sombrío nativos (Guamo, Nogal) desde ya.' },
                { id: 3, tipo: 'Agua', texto: 'Construir reservorios forrados para recolectar agua lluvia en el invierno.' }
            ],
            link: 'https://cambioclimatico.fao.org.co/antioquia/',
        }
    },
    'Huila': {
        precioBase: 2140000,
        factorRendimiento: 92.0,
        climaActual: { temp: '22°C', lluvia: 'Lluvia ligera', viento: '12 km/h' },
        escenarioFao: {
            alerta: 'Riesgo de Sequía: Moderado',
            nivelAfectacion: 3, // Escala de 1 a 5
            textoNivel: 'Medio',
            plazoImpacto: 'Corto Plazo (En los próximos 1 a 2 años)',
            impactoResumen: 'Se esperan veranos y sequías mucho más largas en ciertas zonas puntuales. El café se estresará por falta de agua.',
            buenasPracticas: [
                { id: 1, tipo: 'Suelo', texto: 'Evitar al máximo el uso de herbicidas pesados (glifosato) que desnudan la tierra.' },
                { id: 2, tipo: 'Agua', texto: 'Organizar riego por goteo con las fuentes de agua actuales y proteger nacimientos.' },
                { id: 3, tipo: 'Manejo', texto: 'No hacer podas drásticas o zoqueo justo antes de que se presenten las épocas secas.' }
            ],
            link: '#',
        }
    },
    'Cauca': {
        precioBase: 2155000,
        factorRendimiento: 90.0,
        climaActual: { temp: '19°C', lluvia: 'Nublado', viento: '10 km/h' },
        escenarioFao: {
            alerta: 'Riesgo Exceso de Lluvias: Medio/Alto',
            nivelAfectacion: 4,
            textoNivel: 'Alto',
            plazoImpacto: 'Inmediato (Tendencias actuales agudizándose)',
            impactoResumen: 'Aumento severo de humedad en cultivos por exceso de agua. Ideal para la propagación rápida de roya y otros hongos.',
            buenasPracticas: [
                { id: 1, tipo: 'Ambiental', texto: 'Mantener limpios los drenajes y zanjas en toda la finca.' },
                { id: 2, tipo: 'Manejo', texto: 'Manejar la sombra para que entre el viento e ilumine, para no encerrar la frescura y secar las hojas.' },
                { id: 3, tipo: 'Suelo', texto: 'Aplicar abonos bien balanceados (no exceder Nitrógeno) para que la planta levante defensas fuertes.' }
            ],
            link: '#',
        }
    }
};

const LOTES_VENDIDOS = [
    {
        id: 'L-042',
        nombre: 'HUI-ESP-042',
        finca: 'Finca La Esperanza',
        clientes: [{ nombre: 'Blue Bottle', pais: 'USA', bandera: '🇺🇸' }],
        puntos: { catador: 86.5, tostador: 87.0, final: 4.8 }
    },
    {
        id: 'L-045',
        nombre: 'HUI-ESP-045',
        finca: 'Finca La Esperanza',
        clientes: [{ nombre: 'Workshop Coffee', pais: 'UK', bandera: '🇬🇧' }],
        puntos: { catador: 84.5, tostador: 85.0, final: 4.5 }
    }
];

export function ProducerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [departamento, setDepartamento] = useState('Antioquia');
    const [valoracionesAprobadas, setValoracionesAprobadas] = useState<any[]>([]);
    const [lotes, setLotes] = useState<any[]>([]);
    const [fincas, setFincas] = useState<any[]>([]);

    useEffect(() => {
        getLotes()
            .then(fetched => {
                setLotes(fetched);
            })
            .catch(err => {
                console.error(err);
            });
        getFincas()
            .then(fetched => {
                setFincas(fetched);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const lotesVendidos = useMemo(() => {
        const prodName = user?.name || 'María González';
        const filtered = lotes.filter(l => 
            l.productor.toLowerCase().includes(prodName.toLowerCase().split(' ')[0]) &&
            l.tostadorAsignado
        );
        if (filtered.length === 0) return [];
        return filtered.map(l => ({
            id: l.id,
            nombre: l.id,
            finca: l.finca,
            clientes: [{ 
                nombre: l.tostadorAsignado || 'Tostador Especializado', 
                pais: l.tostadorPais || 'USA', 
                bandera: l.tostadorPais === 'UK' ? '🇬🇧' : '🇺🇸' 
            }],
            puntos: { 
                catador: l.calificacion || 85.0, 
                tostador: (l.calificacion || 85.0) + 0.5, 
                final: 4.8 
            }
        }));
    }, [lotes, user]);

    const [categoriaSimulacion, setCategoriaSimulacion] = useState<'regional' | 'diferenciado' | 'exotico'>('regional');
    const [sobrepreciosConfig, setSobrepreciosConfig] = useState({ regional: 5, diferenciado: 10, exotico: 30 });

    useEffect(() => {
        const saved = localStorage.getItem('odisea_sobreprecios_config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSobrepreciosConfig({
                    regional: parsed.regional ?? 5,
                    diferenciado: parsed.diferenciado ?? 10,
                    exotico: parsed.exotico ?? 30
                });
            } catch (e) {}
        }
    }, []);

    useEffect(() => {
        const loadAprobados = () => {
            const current = localStorage.getItem('comentarios_publicos_aprobados');
            if (current) {
                try {
                    setValoracionesAprobadas(JSON.parse(current));
                } catch (e) {}
            } else {
                // Mock inicial
                const initial = [
                    {
                        id: 'a1',
                        loteId: 'HUI-ESP-042',
                        rating: 5,
                        selectedNotes: ['chocolate', 'nueces'],
                        message: '¡El mejor Bourbon Rosado que he probado en mi vida! Lo compramos en Bogotá y nos voló la cabeza.',
                        fecha: '28/06/2026',
                        estado: 'Aprobado'
                    }
                ];
                localStorage.setItem('comentarios_publicos_aprobados', JSON.stringify(initial));
                setValoracionesAprobadas(initial);
            }
        };
        loadAprobados();
    }, []);

    const formatoDinero = (valor: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(valor);
    };

    const dData = DEPARTAMENTOS_DATA[departamento];
    const fao = dData.escenarioFao;

    // Colores basados en el nivel de afectación (1 a 5)
    // 1-2 bajo (verde), 3 medio (amarillo), 4-5 alto (rojo)
    const renderScale = (nivel: number) => {
        return (
            <div className="flex items-center gap-1 w-full mt-2">
                {[1, 2, 3, 4, 5].map((i) => {
                    let bgColor = 'bg-gray-200'; // inactivo
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
        <div className="space-y-12 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 px-4">

            {/* 1. SECCIÓN DE BIENVENIDA Y ACCIÓN PRINCIPAL */}
            <section className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Sprout size={300} />
                </div>
                <div className="relative z-10 text-center md:text-left flex-1">
                    <h1 className="text-4xl md:text-5xl font-sans font-black text-gray-900 mb-4">
                        ¡Hola, {user?.name || 'Productor'}!
                    </h1>
                    <p className="text-lg text-gray-500 font-medium max-w-md">
                        Bienvenido a Odisea Trace. Aquí puedes ver cómo va tu café y registrar tu trabajo de hoy.
                    </p>
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex flex-col gap-1 items-center md:items-end w-full">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ubicación Actual</span>
                        <Select value={departamento} onValueChange={setDepartamento}>
                            <SelectTrigger className="w-[180px] bg-white border-2 border-[#5f705f]/20 font-bold text-[#5f705f] rounded-xl h-12 shadow-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Antioquia">Antioquia</SelectItem>
                                <SelectItem value="Huila">Huila</SelectItem>
                                <SelectItem value="Cauca">Cauca</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={() => navigate(fincas.length === 0 ? '/producer/fincas' : '/producer/cosechas/nueva')}
                        className="h-16 px-8 rounded-2xl bg-[#5f705f] hover:bg-[#234d24] text-white font-black text-lg shadow-xl shadow-[#5f705f]/30 transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <PlusCircle size={24} />
                        {fincas.length === 0 ? 'Registrar Mi Primera Finca' : 'Registrar Lote de Producción'}
                    </Button>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* COLUMNA IZQUIERDA (Infraestructura y Lotes) */}
                <div className="lg:col-span-7 space-y-12">
                    {/* INFRAESTRUCTURA */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-sans font-black text-gray-800 tracking-tight">Mi Patrimonio Cafetero</h2>
                            <Button variant="ghost" className="text-[#5f705f] font-black uppercase text-xs tracking-widest gap-2 cursor-pointer" onClick={() => navigate('/producer/fincas')}>
                                Ver fincas <ArrowRight size={14} />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-[#e3d5b8]/20 flex items-center justify-center text-[#9a983b] mb-2">
                                    <Building2 size={24} />
                                </div>
                                <p className="text-3xl font-sans font-black text-gray-900">{fincas.length}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fincas Activas</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-[#8a9a8a]/20 flex items-center justify-center text-[#8a9a8a] mb-2">
                                    <MapPin size={24} />
                                </div>
                                <p className="text-3xl font-sans font-black text-gray-900">{lotes.length}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Parcelas/Lotes</p>
                            </div>
                            <div className="bg-[#5f705f] p-6 rounded-3xl text-white flex flex-col items-center sm:items-start text-center sm:text-left gap-2 shadow-lg shadow-[#5f705f]/20">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                                    <ShoppingBag size={24} />
                                </div>
                                <p className="text-3xl font-sans font-black">{lotes.length > 0 ? '3.2t' : '0.0t'}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Vendido 2026</p>
                            </div>
                        </div>
                    </section>

                    {/* LOTES VENDIDOS */}
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-sans font-black text-gray-800 tracking-tight">Lotes Vendidos</h2>
                            <p className="text-gray-500 text-sm font-medium mt-1">Mira quién disfruta tu café y qué dicen de él.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {lotesVendidos.length === 0 ? (
                                <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-8 text-center text-gray-500 py-12 shadow-sm">
                                    <ShoppingBag className="text-gray-400/40 mx-auto mb-3" size={32} />
                                    <p className="text-xs font-bold text-gray-700">Aún no tienes lotes comercializados</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Conéctate con tostadores para vender tu café directamente.</p>
                                </div>
                            ) : (
                                lotesVendidos.map((lote) => (
                                    <div key={lote.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-[#5f705f]/20 transition-all">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                            <Coffee size={28} />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-2xl font-sans font-black text-gray-900">{lote.nombre}</h3>
                                            <p className="text-sm font-bold text-gray-400">{lote.finca}</p>
                                        </div>
                                        <div className="flex flex-col items-center sm:items-end gap-2">
                                            {lote.clientes.map((cli, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <span className="text-lg">{cli.bandera}</span>
                                                    <span className="text-xs font-bold text-gray-700">{cli.nombre}</span>
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="bg-[#5f705f]/10 text-[#5f705f] px-2 py-1 rounded text-xs font-bold">Cata: {lote.puntos.catador}</div>
                                                <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Star size={10} fill="currentColor" /> {lote.puntos.final}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* VALORACIONES DE CONSUMIDORES QR */}
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-sans font-black text-gray-800 tracking-tight">Mensajes de Consumidores (Código QR)</h2>
                            <p className="text-gray-500 text-sm font-medium mt-1">Opiniones de compradores finales aprobadas por el equipo de trazabilidad.</p>
                        </div>
                        
                        {valoracionesAprobadas.length === 0 ? (
                            <div className="bg-white rounded-[32px] border border-dashed border-gray-250 p-8 text-center text-gray-400">
                                <p className="text-xs font-bold">Aún no hay opiniones de consumidores finales aprobadas para tus lotes.</p>
                                <p className="text-[9px] uppercase tracking-widest mt-1">Los comentarios escaneados por código QR se mostrarán aquí tras ser validados.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {valoracionesAprobadas.map((val) => (
                                    <div key={val.id} className="bg-white rounded-[32px] border border-gray-150 shadow-sm p-6 space-y-4 text-left">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-[#5f705f]/10 text-[#5f705f] border-none text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                                                Lote: {val.loteId}
                                            </Badge>
                                            <span className="text-[9px] font-bold text-gray-400">{val.fecha}</span>
                                        </div>
                                        
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={12}
                                                    className={cn(
                                                        star <= val.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"
                                                    )}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-xs font-medium text-gray-600 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 italic">
                                            "{val.message}"
                                        </p>

                                        {val.selectedNotes && val.selectedNotes.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {val.selectedNotes.map((note: string) => (
                                                    <span key={note} className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                                                        {note.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* COLUMNA DERECHA (Panel Mercado, Clima y Escenarios) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* PRECIO MERCADO REGIONAL */}
                    <Card className="bg-white border border-gray-100 shadow-sm rounded-3xl">
                        <CardHeader className="pb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block">Precio Ref. Diario • {departamento}</span>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-3xl font-sans font-black text-gray-900">{formatoDinero(dData.precioBase)}</h4>
                                <TrendingUp size={32} className="text-emerald-500" />
                            </div>
                            <div className="p-3 bg-[#8a9a8a]/10 rounded-2xl border border-[#8a9a8a]/20 flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-[#8a9a8a]">Variación: <span className="font-black">+2.4%</span></p>
                                <Badge className="bg-[#8a9a8a] text-white border-none text-[9px] font-black uppercase">Factor {dData.factorRendimiento}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SIMULADOR DE SOBREPRECIO ODICEA */}
                    <Card className="bg-white border border-gray-150 shadow-sm rounded-3xl p-6 space-y-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5f705f] block">Mesa de Ayuda Financiera</span>
                            <h3 className="text-xl font-sans font-black text-gray-800">Simulador de Sobreprecios</h3>
                            <p className="text-[11px] text-gray-400 font-bold leading-relaxed">Descubre cuánto valor gana tu café al cumplir con trazabilidad y calidad verificada.</p>
                        </div>

                        {/* Selector de Categoria */}
                        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-150">
                            {[
                                { id: 'regional', label: 'Regional', pct: sobrepreciosConfig.regional },
                                { id: 'diferenciado', label: 'Proceso', pct: sobrepreciosConfig.diferenciado },
                                { id: 'exotico', label: 'Exótico', pct: sobrepreciosConfig.exotico }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategoriaSimulacion(cat.id as any)}
                                    className={cn(
                                        "py-2 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider border-none cursor-pointer transition-all",
                                        categoriaSimulacion === cat.id
                                            ? "bg-[#5f705f] text-white shadow-xs"
                                            : "bg-transparent text-gray-400 hover:text-gray-700"
                                    )}
                                >
                                    {cat.label} (+{cat.pct}%)
                                </button>
                            ))}
                        </div>

                        {/* Resultados de la Simulación */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center text-xs border-b border-gray-50 pb-2">
                                <span className="font-bold text-gray-400">Precio Base Referencial</span>
                                <span className="font-bold text-gray-700">{formatoDinero(dData.precioBase)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-gray-50 pb-2">
                                <span className="font-bold text-emerald-600">Premio por Trazabilidad ({(categoriaSimulacion === 'regional' ? sobrepreciosConfig.regional : categoriaSimulacion === 'diferenciado' ? sobrepreciosConfig.diferenciado : sobrepreciosConfig.exotico)}%)</span>
                                <span className="font-black text-emerald-600">+{formatoDinero(dData.precioBase * ((categoriaSimulacion === 'regional' ? sobrepreciosConfig.regional : categoriaSimulacion === 'diferenciado' ? sobrepreciosConfig.diferenciado : sobrepreciosConfig.exotico) / 100))}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs font-black uppercase tracking-wider text-gray-450">Pago Final Estimado</span>
                                <span className="text-2xl font-sans font-black text-gray-900">{formatoDinero(dData.precioBase + (dData.precioBase * ((categoriaSimulacion === 'regional' ? sobrepreciosConfig.regional : categoriaSimulacion === 'diferenciado' ? sobrepreciosConfig.diferenciado : sobrepreciosConfig.exotico) / 100)))}</span>
                            </div>
                        </div>

                        <div className="p-3 bg-[#e3d5b8]/10 rounded-2xl border border-[#e3d5b8]/30 text-[9px] font-bold text-[#5f705f]/70 leading-relaxed">
                            💡 **Nota**: Los porcentajes de sobreprecio son fijados dinámicamente por la junta de administración de Odisea.
                        </div>
                    </Card>

                    {/* ESTADO DEL CLIMA PUNTUAL */}
                    <Card className="bg-[#bb8d3b] text-white rounded-3xl border-none shadow-lg overflow-hidden relative">
                        <CloudSun size={150} className="absolute -top-10 -right-10 opacity-10" />
                        <CardHeader className="pb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 block">Estado Actual</span>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-center gap-6 mb-4">
                                <h4 className="text-5xl font-sans font-black">{dData.climaActual.temp}</h4>
                                <div className="space-y-0.5 border-l border-white/20 pl-4">
                                    <p className="text-xs font-black uppercase text-white/90">{dData.climaActual.lluvia}</p>
                                    <p className="text-[10px] font-medium text-white/60">Viento a {dData.climaActual.viento}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* El escenario FAO fue movido a MisFincas */}
                </div>
            </div>
        </div>
    );
}
