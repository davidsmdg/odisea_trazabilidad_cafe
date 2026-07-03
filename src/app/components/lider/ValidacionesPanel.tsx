import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    CheckCircle2,
    Clock,
    ArrowRight,
    Search,
    Filter,
    MapPin,
    User,
    Calendar,
    Trophy,
    Star,
    Wifi,
    WifiOff,
    RefreshCw,
    AlertTriangle,
    Check
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { getLotesMaster, updateLote } from '../../utils/loteStore';
import { useMemo } from 'react';

interface ValidacionItem {
    id: string;
    loteId: string;
    agricultor: string;
    finca: string;
    vereda: string;
    municipio: string;
    estado: 'Pendiente' | 'Revisado';
    fecha: string;
    tipo: string;
    alistamiento: 'Apto' | 'Subsanable' | 'No Apto';
}

const VALIDACIONES_MOCK: ValidacionItem[] = [
    {
        id: '1',
        loteId: 'LOT-HUILA-084',
        agricultor: 'María González',
        finca: 'Finca La Esperanza',
        vereda: 'Vereda La Estrella',
        municipio: 'San Agustín, Huila',
        estado: 'Pendiente',
        fecha: 'Hoy, 2:30 PM',
        tipo: 'Validación Técnica EUDR',
        alistamiento: 'Apto'
    },
    {
        id: '2',
        loteId: 'LOT-ANT-112',
        agricultor: 'Carlos Martínez',
        finca: 'Lote El Naranjo',
        vereda: 'Vereda El Playón',
        municipio: 'Acevedo, Huila',
        estado: 'Pendiente',
        fecha: 'Ayer',
        tipo: 'Actualización de Perfil',
        alistamiento: 'Subsanable'
    },
    {
        id: '3',
        loteId: 'LOT-NAR-225',
        agricultor: 'Elena Ruiz',
        finca: 'Finca Santa Helena',
        vereda: 'Vereda El Diviso',
        municipio: 'Pitalito, Huila',
        estado: 'Revisado',
        fecha: 'Hace 3 días',
        tipo: 'Validación Técnica EUDR',
        alistamiento: 'No Apto'
    }
];

export function ValidacionesPanel() {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [isOffline, setIsOffline] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [draftCount, setDraftCount] = useState(0);

    const lotesMaster = getLotesMaster();

    const validacionesList = useMemo(() => {
        return lotesMaster.map((l, index) => {
            const idMap: Record<string, string> = {
                'LOT-HUILA-084': '1',
                'LOT-ANT-112': '2',
                'LOT-NAR-225': '3'
            };
            const id = idMap[l.id] || String(index + 1);
            return {
                id,
                loteId: l.id,
                agricultor: l.productor,
                finca: l.finca,
                vereda: l.id === 'LOT-HUILA-084' ? 'Vereda La Estrella' : l.id === 'LOT-ANT-112' ? 'Vereda El Playón' : 'Vereda El Diviso',
                municipio: l.municipio,
                estado: l.estadoJAC ? 'Revisado' : ('Pendiente' as const),
                fecha: l.fecha || 'Hoy',
                tipo: 'Validación Técnica EUDR',
                alistamiento: l.estadoJAC || ('Apto' as const)
            };
        });
    }, [lotesMaster]);

    // Cargar cantidad de borradores offline reales del localStorage
    useEffect(() => {
        const savedDrafts = localStorage.getItem('borradores_offline_lider');
        if (savedDrafts) {
            try {
                const list = JSON.parse(savedDrafts);
                setDraftCount(Array.isArray(list) ? list.length : 0);
            } catch (e) {
                setDraftCount(0);
            }
        } else {
            setDraftCount(1);
        }
    }, []);

    const handleSync = () => {
        if (draftCount === 0) {
            toast.info('No hay borradores locales pendientes por sincronizar.');
            return;
        }
        setIsSyncing(true);
        toast.info('Sincronizando borradores de campo con el servidor de Odisea...', {
            icon: <RefreshCw className="animate-spin text-blue-600" />
        });

        setTimeout(() => {
            setIsSyncing(false);
            setDraftCount(0);
            
            const savedDrafts = localStorage.getItem('borradores_offline_lider');
            if (savedDrafts) {
                try {
                    const list = JSON.parse(savedDrafts);
                    if (Array.isArray(list)) {
                        list.forEach((draft: any) => {
                            const draftLoteId = typeof draft === 'object' ? draft.loteId : null;
                            const draftStatus = typeof draft === 'object' ? draft.alistamiento : 'Apto';
                            const draftGps = typeof draft === 'object' ? draft.gpsCapturado : false;
                            
                            if (draftLoteId) {
                                updateLote(draftLoteId, {
                                    estadoJAC: draftStatus,
                                    coordenadas: draftGps ? '1.88452° N, 76.29712° W' : undefined
                                });
                            }
                        });
                    }
                } catch (e) {}
            }
            
            localStorage.removeItem('borradores_offline_lider');
            toast.success('Sincronización finalizada con éxito', {
                description: 'Todos los borradores offline han sido cargados al panel global de Odisea.',
                style: { borderRadius: '24px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#14532D' }
            });
        }, 2000);
    };

    const toggleOfflineMode = () => {
        setIsOffline(!isOffline);
        if (!isOffline) {
            toast.warning('Modo Sin Conexión Activado', {
                description: 'Los cambios se guardarán localmente en la memoria del celular y podrás sincronizarlos al volver al pueblo.',
                style: { borderRadius: '24px', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#78350F' }
            });
        } else {
            toast.success('Modo En Línea Restaurado', {
                description: 'Se ha restablecido la comunicación con el servidor central.'
            });
        }
    };

    const filtradas = validacionesList.filter(item => 
        item.agricultor.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.finca.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.vereda.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="space-y-10 max-w-[1100px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 text-left font-sans">
            
            {/* 1. CABECERA CON OFFLINE SYNC WIDGET */}
            <div className="flex flex-col lg:flex-row items-stretch gap-6">
                {/* Intro */}
                <div className="flex-1 space-y-3 flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-sans font-black text-slate-900 tracking-tight leading-none">Tareas Comunitarias</h1>
                    <p className="text-base text-slate-500 font-medium max-w-xl">
                        Revisa el alistamiento de los productores de tu vereda. Esta pre-validación social garantiza que los predios estén listos antes de la auditoría física oficial de Odisea.
                    </p>
                </div>

                {/* Sincronizador Offline */}
                <div className="bg-slate-900 rounded-[32px] p-6 lg:w-[450px] shadow-xl text-white flex flex-col justify-between gap-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12 scale-150">
                        <Wifi size={150} />
                    </div>

                    <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                isOffline ? "bg-amber-500 text-slate-950" : "bg-blue-600 text-white"
                             )}>
                                {isOffline ? <WifiOff size={20} /> : <Wifi size={20} />}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Canal de Red</p>
                                <p className="text-sm font-bold">{isOffline ? 'Modo Rural (Offline)' : 'Señal del Municipio (Online)'}</p>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={toggleOfflineMode}
                            className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl text-[10px] font-black uppercase tracking-wider h-9"
                        >
                            {isOffline ? 'Ir Online' : 'Ir Offline'}
                        </Button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Borradores en Celular</p>
                            <p className="text-2xl font-mono font-black text-amber-400">{draftCount} listos</p>
                        </div>
                        <Button
                            onClick={handleSync}
                            disabled={draftCount === 0 || isSyncing}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest px-5 h-12 rounded-xl flex items-center gap-2 border-none transition-transform active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
                        >
                            <RefreshCw size={14} className={cn(isSyncing && "animate-spin")} />
                            {isSyncing ? 'Sincronizando...' : 'Enviar a Odisea'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. RECOMPENSAS COMUNITARIAS */}
            <div className="bg-[#1A365D] rounded-[36px] p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shadow-inner">
                        <Trophy size={32} />
                    </div>
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <Badge className="bg-amber-400 text-amber-950 font-black text-[9px] uppercase border-none tracking-widest">Líder Oro</Badge>
                            <span className="text-xs font-bold text-blue-200">ID Veredal: LC-2026-HUI</span>
                        </div>
                        <h3 className="text-2xl font-sans font-black">45 Predios Asegurados</h3>
                        <p className="text-xs text-blue-200/70 font-semibold">Has facilitado el acceso de tu vereda al mercado europeo (EUDR).</p>
                    </div>
                </div>

                <div className="w-full md:w-72 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-blue-300 tracking-wider">
                        <span>Alistamiento Veredal</span>
                        <span>80% completado</span>
                    </div>
                    <div className="h-2.5 bg-blue-950 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-amber-400 rounded-full w-[80%]" />
                    </div>
                </div>
            </div>

            {/* 3. BÚSQUEDA Y FILTRO */}
            <div className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por productor, finca o vereda asociada..."
                        className="h-12 pl-12 rounded-xl border-none bg-slate-50 font-semibold text-sm text-slate-700 placeholder:text-slate-400"
                    />
                </div>
                <Button variant="outline" className="h-12 rounded-xl px-6 border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2">
                    <Filter size={14} /> Filtrar Tareas
                </Button>
            </div>

            {/* 4. LISTA DE TAREAS CON SEMÁFORO DE ALISTAMIENTO */}
            <div className="space-y-4">
                {filtradas.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100">
                        <AlertTriangle className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-sm font-black uppercase text-slate-400 tracking-widest">No se encontraron tareas pendientes</p>
                    </div>
                ) : (
                    filtradas.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -2 }}
                            className="bg-white rounded-[36px] border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group"
                        >
                            {/* Productor & Ubicación */}
                            <div className="flex items-center gap-6 w-full lg:w-auto text-center md:text-left flex-col md:flex-row">
                                <div className="w-16 h-16 rounded-[24px] bg-[#1A365D]/5 flex items-center justify-center text-[#1A365D] shrink-0">
                                    <User size={28} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">{item.tipo}</span>
                                    <h3 className="text-2xl font-sans font-black text-slate-800 leading-none">{item.agricultor}</h3>
                                    <div className="flex flex-col md:flex-row items-center gap-4 pt-1.5">
                                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                            <MapPin size={12} /> {item.finca} • <span className="text-slate-500 font-semibold">{item.vereda}</span>
                                        </p>
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar size={11} /> {item.fecha}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Semáforo y Estado */}
                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-none">
                                {/* Semáforo */}
                                <div className="text-center bg-[#F8FAFC] border border-slate-100 px-4 py-2.5 rounded-2xl shrink-0 flex items-center gap-3">
                                    <div className="text-left">
                                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Alistamiento</p>
                                        <p className="text-xs font-black text-slate-700">
                                            {item.alistamiento === 'Apto' && 'Apto para Odisea'}
                                            {item.alistamiento === 'Subsanable' && 'Por Subsanar'}
                                            {item.alistamiento === 'No Apto' && 'Riesgo Crítico'}
                                        </p>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <span className={cn("w-3 h-3 rounded-full border border-black/10", item.alistamiento === 'Apto' ? "bg-green-500 shadow-md shadow-green-400/50" : "bg-green-200 opacity-30")} />
                                        <span className={cn("w-3 h-3 rounded-full border border-black/10", item.alistamiento === 'Subsanable' ? "bg-amber-400 shadow-md shadow-amber-400/50" : "bg-amber-200 opacity-30")} />
                                        <span className={cn("w-3 h-3 rounded-full border border-black/10", item.alistamiento === 'No Apto' ? "bg-red-500 shadow-md shadow-red-400/50" : "bg-red-200 opacity-30")} />
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="text-center min-w-[90px] shrink-0">
                                    <p className="text-[8px] font-black uppercase tracking-wider text-slate-400 mb-1">Revisión JAC</p>
                                    <Badge className={cn(
                                        "font-black text-[10px] tracking-wider border px-3 py-1 uppercase rounded-full",
                                        item.estado === 'Pendiente' 
                                            ? "bg-amber-50 text-amber-700 border-amber-200" 
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    )}>
                                        {item.estado === 'Pendiente' ? 'Pendiente' : 'Revisado'}
                                    </Badge>
                                </div>

                                {/* Acción */}
                                <Button
                                    onClick={() => navigate(`/lider/validar/${item.id}`)}
                                    className="h-14 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest shadow-md transition-all active:scale-95 group/btn"
                                >
                                    Revisar <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
