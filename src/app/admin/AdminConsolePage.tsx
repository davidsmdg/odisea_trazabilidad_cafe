import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Key, 
    CheckCircle2, 
    Clock, 
    TrendingUp, 
    Plus, 
    Copy, 
    Edit2, 
    Check, 
    Trash2, 
    Power, 
    AlertCircle, 
    Search, 
    Filter, 
    Phone, 
    RefreshCw,
    Activity,
    UserCheck,
    Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';
import { Eyebrow } from '../components/ui/Eyebrow';
import { 
    obtenerResumenMetricas, 
    type MetricSummary 
} from '../../services/telemetryService';
import { 
    getTodosLosCodigos, 
    crearCodigoInvitacion, 
    actualizarUsosMaximos, 
    alternarEstadoCodigo, 
    eliminarCodigoInvitacion, 
    type CodigoInvitacion 
} from '../../services/invitacionesService';
import type { UserRole } from '../../types/usuario';

export function AdminConsolePage() {
    const [pinUnlocked, setPinUnlocked] = useState(() => {
        return sessionStorage.getItem('odisea_admin_unlocked') === 'true';
    });
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState(false);

    const [activeTab, setActiveTab] = useState<'kpis' | 'codigos' | 'onboarding' | 'auditoria'>('kpis');
    const [metricas, setMetricas] = useState<MetricSummary | null>(null);
    const [codigos, setCodigos] = useState<CodigoInvitacion[]>([]);
    const [loading, setLoading] = useState(true);

    const [busquedaCodigo, setBusquedaCodigo] = useState('');
    const [filtroRol, setFiltroRol] = useState<string>('todos');

    const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
    const [nuevoCodigo, setNuevoCodigo] = useState('');
    const [nuevoRol, setNuevoRol] = useState<UserRole | ''>('');
    const [nuevosUsos, setNuevosUsos] = useState(25);

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [cupoTemp, setCupoTemp] = useState<number>(0);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [m, c] = await Promise.all([
                obtenerResumenMetricas(),
                getTodosLosCodigos()
            ]);
            setMetricas(m);
            setCodigos(c);
        } catch {
            toast.error('Error cargando métricas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pinUnlocked) {
            cargarDatos();
        }
    }, [pinUnlocked]);

    const handleUnlockPin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput.trim().toUpperCase() === 'ODISEA2026') {
            sessionStorage.setItem('odisea_admin_unlocked', 'true');
            setPinUnlocked(true);
            setPinError(false);
            toast.success('Acceso administrativo concedido');
        } else {
            setPinError(true);
            toast.error('Clave de administración incorrecta');
        }
    };

    const handleCrearCodigo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoCodigo.trim()) {
            toast.error('Ingresa un código');
            return;
        }

        try {
            await crearCodigoInvitacion({
                codigo: nuevoCodigo.trim().toUpperCase(),
                rolPermitido: nuevoRol ? (nuevoRol as UserRole) : null,
                usosMaximos: Number(nuevosUsos) || 10,
                activo: true
            });
            toast.success(`Código ${nuevoCodigo.toUpperCase()} creado con éxito`);
            setModalCrearAbierto(false);
            setNuevoCodigo('');
            setNuevoRol('');
            setNuevosUsos(25);
            cargarDatos();
        } catch {
            toast.error('No se pudo crear el código');
        }
    };

    const handleGuardarCupo = async (id: string) => {
        if (cupoTemp < 1) {
            toast.error('El cupo debe ser mayor a 0');
            return;
        }
        await actualizarUsosMaximos(id, cupoTemp);
        setEditandoId(null);
        toast.success('Cupos actualizados');
        cargarDatos();
    };

    const handleToggleEstado = async (id: string, activoActual: boolean) => {
        await alternarEstadoCodigo(id, !activoActual);
        toast.info(activoActual ? 'Código pausado' : 'Código activado');
        cargarDatos();
    };

    const handleEliminarCodigo = async (id: string, codigoNombre: string) => {
        if (window.confirm(`¿Seguro que deseas eliminar el código ${codigoNombre}?`)) {
            await eliminarCodigoInvitacion(id);
            toast.success('Código eliminado');
            cargarDatos();
        }
    };

    const handleCopiarEnlace = (codigo: string) => {
        const url = `${window.location.origin}/auth/register?code=${codigo}`;
        navigator.clipboard.writeText(url);
        toast.success(`Enlace copiado con código ${codigo}`);
    };

    if (!pinUnlocked) {
        return (
            <div className="min-h-screen bg-[#F6F2EC] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#2D3E33]/15 shadow-2xl text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#2D3E33] text-[#F6F2EC] flex items-center justify-center mx-auto shadow-md">
                        <Lock size={32} />
                    </div>
                    <div>
                        <Eyebrow text="CONSOLA RESTRINGIDA" variant="terracota" />
                        <h1 className="font-['Anton'] text-3xl text-[#2D3E33] uppercase tracking-wide mt-1">
                            ADMIN & TELEMETRÍA
                        </h1>
                        <p className="text-[#2D3E33]/70 text-sm mt-2 font-medium">
                            Ingresa la clave maestra para acceder al centro de control.
                        </p>
                    </div>

                    <form onSubmit={handleUnlockPin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#2D3E33]/70 mb-2">
                                Clave Maestra
                            </label>
                            <input 
                                type="password"
                                value={pinInput}
                                onChange={(e) => {
                                    setPinInput(e.target.value);
                                    setPinError(false);
                                }}
                                placeholder="••••••••"
                                autoFocus
                                className={cn(
                                    "w-full h-14 rounded-2xl bg-[#F6F2EC]/40 border-2 px-4 font-mono text-center text-xl tracking-widest outline-none transition-all",
                                    pinError ? "border-red-500 text-red-600" : "border-stone-300 focus:border-[#2D3E33] text-[#2D3E33]"
                                )}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-14 rounded-full bg-[#BD4A1F] hover:bg-[#a33f1a] text-white font-['Anton'] text-lg uppercase tracking-wider shadow-lg shadow-[#BD4A1F]/30 active:scale-[0.98] transition-all"
                        >
                            INGRESAR AL PANEL
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const codigosFiltrados = codigos.filter((c) => {
        const matchTxt = c.codigo.toLowerCase().includes(busquedaCodigo.toLowerCase());
        const matchRol = filtroRol === 'todos' || (filtroRol === 'sin_rol' ? !c.rolPermitido : c.rolPermitido === filtroRol);
        return matchTxt && matchRol;
    });

    return (
        <div className="min-h-screen bg-[#F6F2EC] text-[#2D3E33] flex flex-col">
            <header className="bg-[#2D3E33] text-[#F6F2EC] border-b border-[#2D3E33]/30 sticky top-0 z-30 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="font-['Anton'] text-2xl tracking-wider text-white">ODISEA</span>
                            <span className="text-[#BD4A1F] font-black text-2xl">/</span>
                            <span className="font-['Anton'] text-xl tracking-wide text-[#E5A84B] uppercase">ADMIN & ANALYTICS</span>
                        </div>
                        <span className="hidden md:inline-flex bg-white/10 text-xs font-mono uppercase px-3 py-1 rounded-full text-stone-200">
                            /admin-console
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={cargarDatos}
                            disabled={loading}
                            className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase flex items-center gap-2 transition-all"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            <span>Actualizar</span>
                        </button>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem('odisea_admin_unlocked');
                                setPinUnlocked(false);
                            }}
                            className="h-10 px-4 rounded-xl bg-[#BD4A1F] hover:bg-[#a33f1a] text-white font-bold text-xs uppercase transition-all"
                        >
                            Bloquear
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 overflow-x-auto pb-3 pt-1">
                    {[
                        { id: 'kpis', label: '📊 Resumen & Métricas' },
                        { id: 'codigos', label: '🔑 Gestión de Códigos' },
                        { id: 'onboarding', label: '🚀 Embudo Onboarding' },
                        { id: 'auditoria', label: '⚡ Bitácora en Vivo' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-[#E5A84B] text-[#1B263B] shadow-sm font-black"
                                    : "bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
                {activeTab === 'kpis' && (
                    <div className="space-y-8">
                        <div>
                            <Eyebrow text="TELEMETRÍA EN VIVO" variant="verde" />
                            <h2 className="font-['Anton'] text-3xl uppercase tracking-wide text-[#2D3E33]">
                                PANEL GENERAL DE ADOPCIÓN
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="rounded-3xl bg-white border border-[#2D3E33]/15 p-6 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Logins Totales</span>
                                <p className="font-['Anton'] text-5xl text-[#2D3E33] my-3">
                                    {metricas ? metricas.totalLogins : '…'}
                                </p>
                                <p className="text-xs text-stone-500">Sesiones iniciadas registradas</p>
                            </div>

                            <div className="rounded-3xl bg-white border border-[#2D3E33]/15 p-6 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Registros Nuevos</span>
                                <p className="font-['Anton'] text-5xl text-[#2D3E33] my-3">
                                    {metricas ? metricas.totalRegistros : '…'}
                                </p>
                                <p className="text-xs text-stone-500">Cuentas creadas vía código</p>
                            </div>

                            <div className="rounded-3xl bg-white border border-[#2D3E33]/15 p-6 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Tasa de Onboarding</span>
                                <p className="font-['Anton'] text-5xl text-[#BD4A1F] my-3">
                                    {metricas ? `${metricas.tasaOnboarding}%` : '…'}
                                </p>
                                <p className="text-xs text-stone-500">
                                    {metricas?.totalOnboardingCompletados || 0} de {metricas?.totalOnboardingIniciados || 0} completados
                                </p>
                            </div>

                            <div className="rounded-3xl bg-white border border-[#2D3E33]/15 p-6 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Códigos Activos</span>
                                <p className="font-['Anton'] text-5xl text-[#2D3E33] my-3">
                                    {codigos.filter(c => c.activo).length}
                                    <span className="text-xl text-stone-400 font-sans font-normal ml-1">/ {codigos.length}</span>
                                </p>
                                <p className="text-xs text-stone-500">
                                    {codigos.reduce((acc, c) => acc + c.usosActuales, 0)} accesos consumidos
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="rounded-3xl bg-white border border-[#2D3E33]/15 p-6 shadow-sm space-y-4">
                                <h3 className="font-['Anton'] text-xl text-[#2D3E33] tracking-wide uppercase border-b border-stone-200 pb-3">
                                    ACTIVIDAD POR ROL DE USUARIO
                                </h3>
                                <div className="space-y-3">
                                    {metricas && Object.entries(metricas.usuariosPorRol).length > 0 ? (
                                        Object.entries(metricas.usuariosPorRol).map(([rol, cantidad]) => (
                                            <div key={rol} className="flex items-center justify-between p-3 rounded-2xl bg-[#F6F2EC]/50 border border-stone-200">
                                                <span className="font-bold text-sm text-[#2D3E33]">
                                                    {rol === 'AGRICULTOR' ? '🌾 Caficultores' :
                                                     rol === 'TASTER' ? '☕ Catadores' :
                                                     rol === 'COMMUNITY_LEADER' ? '🤝 Líderes Comunitarios' :
                                                     rol === 'ROASTER' ? '🔥 Tostadores' :
                                                     rol === 'CERES' ? '🛡️ Administradores' : rol}
                                                </span>
                                                <span className="font-['Anton'] text-xl text-[#BD4A1F]">
                                                    {cantidad}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-stone-500 text-sm py-4 text-center">Sin registros aún.</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl bg-white border border-[#2D3E33]/15 p-6 shadow-sm space-y-4">
                                <h3 className="font-['Anton'] text-xl text-[#2D3E33] tracking-wide uppercase border-b border-stone-200 pb-3">
                                    ESTADO ONBOARDING FINCAS
                                </h3>
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between text-xs font-bold uppercase text-stone-500">
                                        <span>Fincas Registradas</span>
                                        <span className="text-[#2D3E33] font-black">{metricas?.totalOnboardingCompletados || 0} completas</span>
                                    </div>
                                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, metricas?.tasaOnboarding || 0)}%` }}
                                        />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#E5A84B]/15 border border-[#E5A84B]/30 flex items-start gap-3 mt-4">
                                        <AlertCircle className="text-[#BD4A1F] shrink-0 mt-0.5" size={18} />
                                        <p className="text-xs text-[#2D3E33] font-medium leading-relaxed">
                                            Revisa la pestaña "Embudo Onboarding" para apoyar a caficultores con registro pendiente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'codigos' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <Eyebrow text="ACCESOS Y SEGURIDAD" variant="terracota" />
                                <h2 className="font-['Anton'] text-3xl uppercase tracking-wide text-[#2D3E33]">
                                    CÓDIGOS DE INVITACIÓN & CUPOS
                                </h2>
                            </div>

                            <button
                                onClick={() => setModalCrearAbierto(true)}
                                className="h-14 px-6 rounded-full bg-[#BD4A1F] hover:bg-[#a33f1a] text-white font-['Anton'] text-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#BD4A1F]/30 active:scale-[0.98] transition-all"
                            >
                                <Plus size={22} /> CREAR CÓDIGO
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-[#2D3E33]/15 shadow-sm">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="text"
                                    value={busquedaCodigo}
                                    onChange={(e) => setBusquedaCodigo(e.target.value)}
                                    placeholder="Buscar código…"
                                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F6F2EC]/40 border border-stone-200 font-bold text-sm outline-none focus:border-[#2D3E33]"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Filter size={18} className="text-stone-400" />
                                <select
                                    value={filtroRol}
                                    onChange={(e) => setFiltroRol(e.target.value)}
                                    className="h-12 px-4 rounded-2xl bg-[#F6F2EC]/40 border border-stone-200 font-bold text-sm outline-none focus:border-[#2D3E33]"
                                >
                                    <option value="todos">Todos los roles</option>
                                    <option value="AGRICULTOR">Solo Agricultor</option>
                                    <option value="TASTER">Solo Catador</option>
                                    <option value="COMMUNITY_LEADER">Solo Líder</option>
                                    <option value="ROASTER">Solo Tostador</option>
                                    <option value="CERES">Solo Admin</option>
                                    <option value="sin_rol">Sin rol fijo (General)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {codigosFiltrados.map((item) => {
                                const porcentaje = Math.min(100, Math.round((item.usosActuales / item.usosMaximos) * 100));
                                const agotado = item.usosActuales >= item.usosMaximos;

                                return (
                                    <div 
                                        key={item.id}
                                        className={cn(
                                            "bg-white rounded-3xl p-6 border transition-all shadow-sm space-y-4",
                                            item.activo ? "border-[#2D3E33]/15" : "border-stone-200 opacity-60 bg-stone-50"
                                        )}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-[#2D3E33]/10 text-[#2D3E33] flex items-center justify-center font-bold">
                                                    <Key size={22} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-['Anton'] text-2xl tracking-wider text-[#2D3E33]">
                                                            {item.codigo}
                                                        </span>
                                                        <span className={cn(
                                                            "text-xs px-2.5 py-0.5 rounded-full font-bold uppercase",
                                                            item.activo ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                                        )}>
                                                            {item.activo ? 'Activo' : 'Pausado'}
                                                        </span>
                                                        {agotado && (
                                                            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-800">
                                                                Agotado
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                                                        Rol: <strong className="text-[#2D3E33]">{item.rolPermitido || 'Cualquier rol'}</strong>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <button
                                                    onClick={() => handleCopiarEnlace(item.codigo)}
                                                    className="h-10 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2D3E33] text-xs font-bold flex items-center gap-1.5 transition-all"
                                                >
                                                    <Copy size={14} /> Link
                                                </button>
                                                <button
                                                    onClick={() => handleToggleEstado(item.id, item.activo)}
                                                    className={cn(
                                                        "h-10 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all",
                                                        item.activo ? "bg-amber-100 hover:bg-amber-200 text-amber-900" : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
                                                    )}
                                                >
                                                    <Power size={14} /> {item.activo ? 'Pausar' : 'Activar'}
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarCodigo(item.id, item.codigo)}
                                                    className="h-10 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1.5 transition-all"
                                                >
                                                    <Trash2 size={14} /> Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1 space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold text-stone-600">
                                                    <span>Canjes</span>
                                                    <span>
                                                        <strong className="text-[#BD4A1F]">{item.usosActuales}</strong> de {item.usosMaximos} ({porcentaje}%)
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-300", agotado ? "bg-red-500" : "bg-[#2D3E33]")}
                                                        style={{ width: `${porcentaje}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {editandoId === item.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="number"
                                                            value={cupoTemp}
                                                            onChange={(e) => setCupoTemp(Number(e.target.value))}
                                                            className="w-20 h-10 rounded-xl border-2 border-[#2D3E33] px-2 text-center font-bold text-sm"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handleGuardarCupo(item.id)}
                                                            className="h-10 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                                                        >
                                                            <Check size={14} /> Ok
                                                        </button>
                                                        <button
                                                            onClick={() => setEditandoId(null)}
                                                            className="h-10 px-3 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditandoId(item.id);
                                                            setCupoTemp(item.usosMaximos);
                                                        }}
                                                        className="h-10 px-3.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 text-xs font-bold text-[#2D3E33] flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <Edit2 size={13} /> Modificar Cupos ({item.usosMaximos})
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'onboarding' && (
                    <div className="space-y-6">
                        <div>
                            <Eyebrow text="SEGUIMIENTO PRODUCTORES" variant="verde" />
                            <h2 className="font-['Anton'] text-3xl uppercase tracking-wide text-[#2D3E33]">
                                EMBUDO DE ADOPCIÓN (ONBOARDING)
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl border border-[#2D3E33]/15 p-6 shadow-sm space-y-4">
                            {metricas?.usuariosEnOnboarding && metricas.usuariosEnOnboarding.length > 0 ? (
                                <div className="divide-y divide-stone-100">
                                    {metricas.usuariosEnOnboarding.map((u, i) => (
                                        <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white",
                                                    u.estado === 'completado' ? "bg-emerald-600" : "bg-amber-500"
                                                )}>
                                                    {u.estado === 'completado' ? <CheckCircle2 size={22} /> : <Clock size={22} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base text-[#2D3E33]">{u.nombre}</p>
                                                    <p className="text-xs text-stone-500 font-medium">
                                                        {u.contacto || 'Sin contacto'} • {new Date(u.fecha).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-xs px-3 py-1 rounded-full font-bold uppercase",
                                                    u.estado === 'completado' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                                                )}>
                                                    {u.estado === 'completado' ? 'Finca Lista' : 'Incompleto'}
                                                </span>

                                                {u.contacto && (
                                                    <a
                                                        href={`https://wa.me/${u.contacto.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(u.nombre)},%20te%20escribimos%20de%20Odisea%20para%20ayudarte%20con%20el%20registro%20de%20tu%20finca.`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="h-10 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                                                    >
                                                        <Phone size={14} /> WhatsApp
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-stone-500 text-center py-8 text-sm">
                                    No hay caficultores registrados aún en el embudo.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'auditoria' && (
                    <div className="space-y-6">
                        <div>
                            <Eyebrow text="TELEMETRÍA EN DIRECTO" variant="terracota" />
                            <h2 className="font-['Anton'] text-3xl uppercase tracking-wide text-[#2D3E33]">
                                BITÁCORA DE EVENTOS
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl border border-[#2D3E33]/15 p-6 shadow-sm">
                            {metricas?.eventosRecientes && metricas.eventosRecientes.length > 0 ? (
                                <div className="space-y-3">
                                    {metricas.eventosRecientes.map((evt) => (
                                        <div 
                                            key={evt.id} 
                                            className="p-4 rounded-2xl bg-[#F6F2EC]/40 border border-stone-200 flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "w-3 h-3 rounded-full shrink-0",
                                                    evt.tipo === 'login' ? "bg-blue-500" :
                                                    evt.tipo === 'register' ? "bg-emerald-500" :
                                                    evt.tipo === 'codigo_canjeado' ? "bg-purple-500" :
                                                    evt.tipo === 'onboarding_completado' ? "bg-emerald-600" : "bg-amber-500"
                                                )} />
                                                <div>
                                                    <p className="font-bold text-sm text-[#2D3E33]">
                                                        {evt.tipo === 'login' && `Login: ${evt.nombre || evt.contacto || 'Usuario'}`}
                                                        {evt.tipo === 'register' && `Registro: ${evt.nombre} (${evt.rol})`}
                                                        {evt.tipo === 'codigo_canjeado' && `Código Canjeado: ${evt.detalles?.codigo || ''} (${evt.nombre})`}
                                                        {evt.tipo === 'onboarding_iniciado' && `Onboarding Iniciado: ${evt.nombre || 'Caficultor'}`}
                                                        {evt.tipo === 'onboarding_completado' && `Onboarding Completado: ${evt.nombre}`}
                                                    </p>
                                                    <p className="text-xs text-stone-500 font-mono">
                                                        {new Date(evt.timestamp).toLocaleString()} • {evt.rol || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-xs font-mono font-bold uppercase text-stone-400 shrink-0">
                                                {evt.tipo}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-stone-500 text-center py-8 text-sm">Sin eventos en la bitácora.</p>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {modalCrearAbierto && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#2D3E33]/15 shadow-2xl space-y-6">
                        <div>
                            <Eyebrow text="NUEVO ACCESO" variant="terracota" />
                            <h3 className="font-['Anton'] text-2xl uppercase tracking-wide text-[#2D3E33] mt-1">
                                CREAR CÓDIGO DE INVITACIÓN
                            </h3>
                        </div>

                        <form onSubmit={handleCrearCodigo} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D3E33]/70 mb-2">
                                    Texto del Código
                                </label>
                                <input
                                    type="text"
                                    value={nuevoCodigo}
                                    onChange={(e) => setNuevoCodigo(e.target.value.toUpperCase())}
                                    placeholder="EJ: PILOTO-HUILA-2026"
                                    className="w-full h-14 rounded-2xl bg-[#F6F2EC]/40 border-2 border-stone-200 px-4 font-mono font-bold text-lg text-[#2D3E33] outline-none focus:border-[#2D3E33]"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2D3E33]/70 mb-2">
                                        Rol Permitido
                                    </label>
                                    <select
                                        value={nuevoRol}
                                        onChange={(e) => setNuevoRol(e.target.value as any)}
                                        className="w-full h-14 rounded-2xl bg-[#F6F2EC]/40 border-2 border-stone-200 px-3 font-bold text-sm text-[#2D3E33] outline-none focus:border-[#2D3E33]"
                                    >
                                        <option value="">Cualquier rol (General)</option>
                                        <option value="AGRICULTOR">Solo Agricultor</option>
                                        <option value="TASTER">Solo Catador</option>
                                        <option value="COMMUNITY_LEADER">Solo Líder</option>
                                        <option value="ROASTER">Solo Tostador</option>
                                        <option value="CERES">Solo Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2D3E33]/70 mb-2">
                                        Cupos Máximos
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={nuevosUsos}
                                        onChange={(e) => setNuevosUsos(Number(e.target.value))}
                                        className="w-full h-14 rounded-2xl bg-[#F6F2EC]/40 border-2 border-stone-200 px-4 font-bold text-base text-[#2D3E33] outline-none focus:border-[#2D3E33]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalCrearAbierto(false)}
                                    className="flex-1 h-14 rounded-full border border-stone-300 text-stone-700 font-bold text-sm uppercase hover:bg-stone-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-14 rounded-full bg-[#BD4A1F] hover:bg-[#a33f1a] text-white font-['Anton'] text-lg uppercase tracking-wider shadow-lg shadow-[#BD4A1F]/30 active:scale-[0.98] transition-all"
                                >
                                    GUARDAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

