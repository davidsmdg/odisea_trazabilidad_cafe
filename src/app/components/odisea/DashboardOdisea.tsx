import { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    Box,
    CheckCircle2,
    Clock,
    ShoppingBag,
    Coffee,
    Check,
    X,
    ArrowUpRight,
    MapPin,
    Star,
    Globe,
    ArrowRight,
    Award
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { useNavigate } from 'react-router';
import { getLotesMaster, updateLote, LoteUnificado } from '../../utils/loteStore';
import { toast } from 'sonner';

interface ProducerDetail {
    nombre: string;
    municipio: string;
    completo: boolean;
    celular: string;
    fincas: number;
}

const MOCK_PRODUCERS: ProducerDetail[] = [
    { nombre: 'María González', municipio: 'San Agustín, Huila', completo: true, celular: '+57 312 455 XXXX', fincas: 1 },
    { nombre: 'Carlos Martínez', municipio: 'Acevedo, Huila', completo: true, celular: '+57 310 988 XXXX', fincas: 1 },
    { nombre: 'Jorge Torres', municipio: 'Garzón, Huila', completo: false, celular: '', fincas: 1 },
    { nombre: 'Elena Ruiz', municipio: 'Pitalito, Huila', completo: true, celular: '+57 314 556 XXXX', fincas: 1 }
];

export function DashboardOdisea() {
    const navigate = useNavigate();
    const [lotes, setLotes] = useState<LoteUnificado[]>([]);
    const [tostadorLinks, setTostadorLinks] = useState<any[]>([]);
    const [recentLogs, setRecentLogs] = useState<any[]>([]);

    useEffect(() => {
        // Cargar lotes unificados con fallback de seguridad
        const master = getLotesMaster();
        setLotes(Array.isArray(master) ? master : []);

        // Cargar reservas/compras de tostadores con fallback de seguridad
        const rawLinks = localStorage.getItem('links_tostador');
        if (rawLinks) {
            try {
                const parsed = JSON.parse(rawLinks);
                setTostadorLinks(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                setTostadorLinks([]);
            }
        } else {
            const defaults = [
                { id: '1', loteId: 'LOT-HUILA-084', tostador: 'Blue Bottle Coffee (USA)' },
                { id: '2', loteId: 'LOT-ANT-112', tostador: 'Workshop Coffee (UK)' }
            ];
            setTostadorLinks(defaults);
        }

        setRecentLogs([
            { id: 1, text: "Líder Carlos Restrepo pre-validó Finca La Esperanza offline.", type: "leader", time: "Hace 10 min" },
            { id: 2, text: "Catador Pedro Nel inició evaluación organoléptica del Bourbon Rosado.", type: "taster", time: "Hace 1 hora" },
            { id: 3, text: "Embarque FOB de 800kg con destino Hamburgo verificado en puerto.", type: "shipping", time: "Hace 4 horas" }
        ]);
    }, []);

    const [prefRegional, setPrefRegional] = useState(5);
    const [prefDiferenciado, setPrefDiferenciado] = useState(10);
    const [prefExotico, setPrefExotico] = useState(30);
    const [isSavingPref, setIsSavingPref] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('odisea_sobreprecios_config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.regional !== undefined) setPrefRegional(parsed.regional);
                if (parsed.diferenciado !== undefined) setPrefDiferenciado(parsed.diferenciado);
                if (parsed.exotico !== undefined) setPrefExotico(parsed.exotico);
            } catch (e) {}
        }
    }, []);

    const handleSavePref = () => {
        setIsSavingPref(true);
        setTimeout(() => {
            localStorage.setItem('odisea_sobreprecios_config', JSON.stringify({
                regional: prefRegional,
                diferenciado: prefDiferenciado,
                exotico: prefExotico
            }));
            setIsSavingPref(false);
            toast.success('Políticas de Sobreprecio Guardadas', {
                description: 'Los nuevos porcentajes se aplicarán automáticamente en el simulador del productor.',
                style: { borderRadius: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }
            });
        }, 1000);
    };

    const reloadData = () => {
        const master = getLotesMaster();
        setLotes(Array.isArray(master) ? master : []);
    };

    // Acciones de aprobación de comercialización
    const handleApproveComercializacion = (loteId: string) => {
        updateLote(loteId, { aprobadoComercializacion: true });
        toast.success('Lote Aprobado', {
            description: `El lote ${loteId} ahora es visible en el marketplace de tostadores.`,
            style: { borderRadius: '24px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#14532D' }
        });
        reloadData();
    };

    const handleRejectComercializacion = (loteId: string) => {
        updateLote(loteId, { ofrecidoPorProductor: false });
        toast.warning('Lote Ocultado', {
            description: `El lote ${loteId} ha sido devuelto a gestión interna del agricultor.`,
            style: { borderRadius: '24px' }
        });
        reloadData();
    };

    // Asegurar arrays seguros para evitar cualquier crash de renderizado
    const lotesSafe = Array.isArray(lotes) ? lotes : [];
    const linksSafe = Array.isArray(tostadorLinks) ? tostadorLinks : [];

    // Estadísticas
    const totalProductores = MOCK_PRODUCERS.length;
    const productoresCompletos = MOCK_PRODUCERS.filter(p => p.completo).length;
    const totalLotes = lotesSafe.length;
    const lotesOfrecidos = lotesSafe.filter(l => l.ofrecidoPorProductor).length;
    const lotesAprobados = lotesSafe.filter(l => l.ofrecidoPorProductor && l.aprobadoComercializacion).length;
    const lotesPendientesAprobacion = lotesSafe.filter(l => l.ofrecidoPorProductor && !l.aprobadoComercializacion);

    // Cumplimiento EUDR Dinámico
    const georeferencedCount = lotesSafe.filter(l => l.coordenadas).length;
    const jacCount = lotesSafe.filter(l => l.estadoJAC && l.estadoJAC !== 'Pendiente').length;
    const activeAlertsCount = lotesSafe.filter(l => l.riesgoDeforestacion && l.riesgoDeforestacion.includes('Alerta')).length;

    // Estadísticas de catadores
    const catadoresList = [
        {
            nombre: 'Pedro Nel Giraldo',
            evaluados: lotesSafe.filter(l => l.catadorAsignado === 'Pedro Nel Giraldo' && (l.calificacion ?? 0) > 0),
            pendientes: lotesSafe.filter(l => l.catadorAsignado === 'Pedro Nel Giraldo' && !(l.calificacion && l.calificacion > 0))
        },
        {
            nombre: 'Sofía Andrade',
            evaluados: lotesSafe.filter(l => l.catadorAsignado === 'Sofía Andrade' && (l.calificacion ?? 0) > 0),
            pendientes: lotesSafe.filter(l => l.catadorAsignado === 'Sofía Andrade' && !(l.calificacion && l.calificacion > 0))
        }
    ];

    return (
        <div className="space-y-12 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4 text-left font-sans">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 justify-start">
                    <div className="h-16 w-16 rounded-[24px] bg-slate-900 flex items-center justify-center text-white shadow-sm shadow-blue-100">
                        <BarChart3 size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-sans font-black text-slate-900 tracking-tight leading-none mb-1">Tablero de Control Operativo</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Odisea Trace Central Admin</p>
                    </div>
                </div>
            </div>

            {/* Fila de Estadísticas Operativas (Tarjetas Resumen con Links a Secciones) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Productores */}
                <div 
                    onClick={() => navigate('/odisea/directorio')}
                    className="p-8 rounded-[40px] border border-slate-100 bg-white flex flex-col justify-between gap-4 shadow-xs transition-all hover:shadow-lg hover:border-blue-200 cursor-pointer group"
                >
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <p className="text-[10px] font-black uppercase tracking-widest">Productores Aliados</p>
                            <Users size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-4xl font-sans font-black leading-none">{totalProductores}</p>
                        <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider leading-tight">
                            {productoresCompletos} con perfil completo (CC/Celular)
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-blue-600 tracking-widest pt-2 border-t border-slate-50">
                        Ver Directorio <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Total Lotes */}
                <div 
                    onClick={() => navigate('/odisea/lotes')}
                    className="p-8 rounded-[40px] border border-slate-100 bg-white flex flex-col justify-between gap-4 shadow-xs transition-all hover:shadow-lg hover:border-amber-200 cursor-pointer group"
                >
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <p className="text-[10px] font-black uppercase tracking-widest">Lotes Creados</p>
                            <Box size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-4xl font-sans font-black leading-none">{totalLotes}</p>
                        <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider leading-tight">
                            Total de cosechas registradas en el mapa
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-[#bb8d3b] tracking-widest pt-2 border-t border-slate-50">
                        Ver Inventario Lotes <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Listo Comercializar */}
                <div 
                    onClick={() => navigate('/odisea/conexiones')}
                    className="p-8 rounded-[40px] border border-slate-100 bg-white flex flex-col justify-between gap-4 shadow-xs transition-all hover:shadow-lg hover:border-emerald-200 cursor-pointer group"
                >
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <p className="text-[10px] font-black uppercase tracking-widest">Listo Comercializar</p>
                            <ShoppingBag size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-4xl font-sans font-black leading-none">{lotesOfrecidos}</p>
                        <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider leading-tight">
                            {lotesAprobados} Aprobados • {lotesOfrecidos - lotesAprobados} Pendientes
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 tracking-widest pt-2 border-t border-slate-50">
                        Ir a Aprobaciones <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Reservas Activas */}
                <div 
                    onClick={() => navigate('/odisea/lotes?filter=reservados')}
                    className="p-8 rounded-[40px] border border-slate-100 bg-white flex flex-col justify-between gap-4 shadow-xs transition-all hover:shadow-lg hover:border-slate-350 cursor-pointer group"
                >
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <p className="text-[10px] font-black uppercase tracking-widest">Reservas B2B</p>
                            <CheckCircle2 size={20} className="text-slate-800 group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-4xl font-sans font-black leading-none">{linksSafe.length}</p>
                        <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider leading-tight">
                            Contratos de compras internacionales activos
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-800 tracking-widest pt-2 border-t border-slate-50">
                        Ver Pedidos Reservados <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

            {/* Checklist de Verificaciones Generales (Summary redirecciona a Ambiental) */}
            <div 
                onClick={() => navigate('/odisea/ambiental/revisiones')}
                className="bg-white border border-slate-200/60 rounded-[48px] p-8 shadow-xs space-y-6 text-left cursor-pointer group hover:border-emerald-200 transition-colors"
            >
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Expediente de Cumplimiento Global</h3>
                    <span className="text-[10px] font-black uppercase text-emerald-650 tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Auditar Ambiental <ArrowRight size={12} />
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { 
                            label: 'Polígonos Georreferenciados', 
                            state: `${georeferencedCount} de ${totalLotes} Lotes OK`, 
                            color: 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        },
                        { 
                            label: 'Cartas de Aval JAC (Líderes)', 
                            state: `${jacCount} de ${totalLotes} Auditados`, 
                            color: 'bg-blue-50 text-blue-700 border-blue-100' 
                        },
                        { 
                            label: 'Alertas Deforestación Satelital', 
                            state: activeAlertsCount > 0 ? `${activeAlertsCount} Alertas Activas` : '0 Riesgo Detectado', 
                            color: activeAlertsCount > 0 ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        },
                    ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">{item.label}</span>
                            <Badge className={cn("border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-md", item.color)}>
                                {item.state}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bandeja de Aprobación de Comercialización (Inbox de Ofertas de Productores) */}
            <div className="bg-white border border-slate-200/60 rounded-[48px] p-8 md:p-10 shadow-xs space-y-6 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#bb8d3b]/10 p-3 rounded-2xl text-[#bb8d3b]">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-sans font-black text-slate-800 tracking-tight">Inbox de Ofertas Comerciales</h2>
                            <p className="text-xs font-semibold text-slate-450">Verifica y autoriza qué lotes de los agricultores se hacen visibles para los tostadores en el Marketplace</p>
                        </div>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1.5 shrink-0 self-start md:self-center">
                        {lotesPendientesAprobacion.length} por validar
                    </Badge>
                </div>

                {lotesPendientesAprobacion.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400">No hay lotes propuestos por agricultores en este momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {lotesPendientesAprobacion.map((item) => (
                            <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 flex flex-col justify-between gap-6 hover:shadow-md transition-all">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Badge className="bg-[#bb8d3b]/10 text-[#bb8d3b] border-none text-[9px] font-black px-2.5 py-1 uppercase tracking-widest">{item.id}</Badge>
                                        <span className="text-[10px] font-black text-slate-350 uppercase tracking-widest leading-none flex items-center gap-1.5"><Clock size={12} /> Esperando Aprobación</span>
                                    </div>
                                    <h4 className="text-xl font-sans font-black text-slate-800 leading-none">{item.finca}</h4>
                                    <p className="text-xs font-bold text-slate-500">Productor: {item.productor}</p>
                                    <div className="flex flex-wrap gap-4 pt-1 text-xs font-bold text-slate-600">
                                        <div><span className="text-slate-400 font-normal">Variedad:</span> {item.variedad}</div>
                                        <div><span className="text-slate-400 font-normal">Proceso:</span> {item.proceso}</div>
                                        {item.calificacion && <div><span className="text-slate-400 font-normal">Taza:</span> ⭐ {item.calificacion} Ptos</div>}
                                    </div>
                                    {/* Link a Detalle Expediente Lote */}
                                    <button
                                        onClick={() => navigate(`/odisea/lotes`)}
                                        className="text-[10px] font-black uppercase text-blue-600 tracking-wider hover:underline flex items-center gap-1 border-none bg-transparent p-0 cursor-pointer pt-2"
                                    >
                                        Ver Expediente Satelital & Coordenadas <ArrowRight size={10} />
                                    </button>
                                </div>
                                <div className="flex gap-3 border-t border-slate-200/50 pt-4">
                                    <button
                                        onClick={() => handleRejectComercializacion(item.id)}
                                        className="flex-1 h-11 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all border-none cursor-pointer font-bold"
                                    >
                                        <X size={12} /> Ocultar
                                    </button>
                                    <button
                                        onClick={() => handleApproveComercializacion(item.id)}
                                        className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all border-none cursor-pointer font-bold"
                                    >
                                        <Check size={12} /> Habilitar Marketplace
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dos Columnas: Catadores Analíticas & Reservas Activas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Análisis por Catador (Summary redirecciona a Calidad) */}
                <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-[48px] p-8 md:p-10 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <Coffee className="text-blue-600" size={24} />
                            <h3 className="text-xl font-sans font-black text-slate-800">Desempeño y Asignación de Catadores</h3>
                        </div>
                        <span className="text-[9px] font-black text-slate-350 uppercase tracking-wider">Laboratorio SCA</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">Catador / Q-Grader</th>
                                    <th className="pb-3 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Evaluados</th>
                                    <th className="pb-3 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Pendientes</th>
                                    <th className="pb-3 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center font-bold">Promedio SCA</th>
                                    <th className="pb-3 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {catadoresList.map((catador, idx) => {
                                    // Calcular puntaje promedio evaluado
                                    const totalScore = catador.evaluados.reduce((acc, curr) => acc + (curr.calificacion ?? 0), 0);
                                    const avgScore = catador.evaluados.length > 0 ? (totalScore / catador.evaluados.length).toFixed(1) : '—';
                                    
                                    return (
                                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs font-mono uppercase">
                                                        {catador.nombre.substring(0, 1)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-800 leading-none">{catador.nombre}</p>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Calibrado Lab</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center text-xs font-black text-slate-700">{catador.evaluados.length} lotes</td>
                                            <td className="py-4 text-center">
                                                <Badge className={cn(
                                                    "border-none text-[8px] font-black px-2 py-0.5 rounded-md",
                                                    catador.pendientes.length > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    {catador.pendientes.length} por catar
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-center">
                                                {avgScore !== '—' ? (
                                                    <Badge className="bg-amber-100/60 text-[#bb8d3b] border-none font-black text-[9px] px-2.5 py-0.5 rounded-md flex items-center gap-0.5 justify-center w-fit mx-auto">
                                                        ★ {avgScore}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-slate-450">—</span>
                                                )}
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/odisea/calidad?catador=${encodeURIComponent(catador.nombre)}`)}
                                                    className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-[8px] font-black uppercase text-slate-600 tracking-wider shadow-2xs hover:bg-slate-50 transition-all flex items-center gap-1 ml-auto cursor-pointer font-bold"
                                                >
                                                    Auditar <ArrowUpRight size={10} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button
                            onClick={() => navigate('/odisea/calidad')}
                            className="bg-transparent hover:bg-slate-50 text-blue-600 font-black text-[10px] uppercase tracking-widest border border-slate-200 h-10 px-4 rounded-xl cursor-pointer"
                        >
                            Ir a Consola de Calidad (Recatas SCA)
                        </Button>
                    </div>
                </div>

                {/* Reservas de Tostadores (Summary redirecciona a Conexiones) */}
                <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-[48px] p-8 shadow-xs space-y-6 text-left flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Reservas de Tostadores</h3>
                            <ShoppingBag size={16} className="text-slate-400" />
                        </div>

                        <div className="space-y-4">
                            {linksSafe.slice(0, 3).map((link) => (
                                <div key={link.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1 hover:border-blue-200 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{link.loteId}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Vínculo Activo</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 pt-1">{link.tostador}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider pt-0.5">Estado: Contrato Firmado</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={() => navigate('/odisea/lotes?filter=reservados')}
                        className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer mt-6"
                    >
                        Ver Pedidos / Reservas Pendientes
                    </Button>
                </div>
            </div>

            {/* Configuración de Sobreprecios Sostenibles */}
            <div className="bg-white border border-slate-200/60 rounded-[48px] p-8 md:p-10 shadow-xs space-y-8 text-left">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                        <Award size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-sans font-black text-slate-800 tracking-tight">Políticas de Sobreprecio Sostenible</h2>
                        <p className="text-xs font-semibold text-slate-455">Defina los incentivos financieros por calidad y trazabilidad que recibirán los productores en sus simuladores.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Regional */}
                    <div className="space-y-3 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-455">Cafés Regionales</span>
                            <span className="text-blue-600 font-sans font-black text-lg">{prefRegional}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={prefRegional}
                            onChange={(e) => setPrefRegional(Number(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-[9px] text-slate-400 font-medium">Incentivo base por georreferenciación y cumplimiento EUDR.</p>
                    </div>

                    {/* Proceso Diferenciado */}
                    <div className="space-y-3 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-455">Proceso Diferenciado</span>
                            <span className="text-blue-600 font-sans font-black text-lg">{prefDiferenciado}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={prefDiferenciado}
                            onChange={(e) => setPrefDiferenciado(Number(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-[9px] text-slate-400 font-medium">Micro-lotes con fermentaciones especiales o secados alternativos.</p>
                    </div>

                    {/* Exótico Especialidad */}
                    <div className="space-y-3 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-455">Cafés Exóticos (SCA &gt; 88)</span>
                            <span className="text-blue-600 font-sans font-black text-lg">{prefExotico}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={prefExotico}
                            onChange={(e) => setPrefExotico(Number(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-[9px] text-slate-400 font-medium">Variedades exóticas (Geisha, Bourbon Rosado) de alta puntuación.</p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        onClick={handleSavePref}
                        disabled={isSavingPref}
                        className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer"
                    >
                        {isSavingPref ? 'Guardando...' : 'Actualizar Políticas de Sobreprecio'}
                    </Button>
                </div>
            </div>

            {/* Fila Inferior: Cumplimiento Ambiental y Auditorías satelitales */}
            <div className="bg-slate-900 rounded-[48px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl text-left">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12 scale-150">
                    <Globe size={180} />
                </div>
                <div className="relative space-y-6">
                    <div>
                        <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] px-3 py-1 mb-3 uppercase">Directiva UE 2026</Badge>
                        <h3 className="text-3xl font-sans font-black tracking-tight leading-none">Control y Garantía de Cero Deforestación (EUDR)</h3>
                        <p className="text-slate-300 font-medium text-sm mt-3 max-w-lg leading-relaxed">
                            Odisea Coffee Trace vincula de forma cruzada los mapas de la finca capturados en campo con imágenes satelitales multitemporales e informes veredales JAC. Esto provee la Debida Diligencia (DDS) necesaria para ingresar café a la Unión Europea.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                        <Button
                            onClick={() => navigate('/odisea/ambiental/revisiones')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-14 border-none transition-all active:scale-95 cursor-pointer"
                        >
                            Auditar Predios Pendientes
                        </Button>
                        <Button
                            onClick={() => navigate('/odisea/conexiones')}
                            className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-14 border-none transition-all active:scale-95 cursor-pointer"
                        >
                            Gestionar Conexiones B2B
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
