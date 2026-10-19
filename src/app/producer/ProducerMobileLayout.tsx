import { useEffect, useState } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router';
import {
    WifiOff,
    Home,
    Sprout,
    Coffee,
    Wallet,
    User,
    LogOut,
    Plus,
    ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TabBar } from './components/TabBar';
import { BarraPrecioTicker } from './components/BarraPrecioTicker';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ProducerOnboarding } from './ProducerOnboarding';
import { debeVerOnboarding, marcarOnboarding } from './utils/onboardingFlag';
import { getFincas } from '../../services/fincasService';
import { cn } from '../components/ui/utils';
import { BrandLogo } from '../components/ui/BrandLogo';
import { registrarEvento } from '../../services/telemetryService';

const NAV_ITEMS = [
    { to: '/producer/inicio', label: 'Inicio', icon: Home },
    { to: '/producer/finca', label: 'Mi Finca & Parcelas', icon: Sprout },
    { to: '/producer/cosechas', label: 'Cosechas & Lotes', icon: Coffee },
    { to: '/producer/cuentas', label: 'Mis Cuentas', icon: Wallet },
    { to: '/producer/perfil', label: 'Mi Perfil', icon: User },
];

export function ProducerMobileLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const online = useOnlineStatus();
    const [estado, setEstado] = useState<'cargando' | 'onboarding' | 'app'>('cargando');

    useEffect(() => {
        if (!debeVerOnboarding()) {
            setEstado('app');
            return;
        }
        setEstado('onboarding');
        registrarEvento('onboarding_iniciado', {
            usuarioId: user?.id,
            nombre: user?.name,
            contacto: user?.celular || user?.email,
            rol: user?.role || 'AGRICULTOR',
        });
    }, []);

    if (estado === 'cargando') {
        return (
            <div className="producer-shell min-h-screen bg-[#FDFDF8] flex items-center justify-center">
                <div className="h-9 w-9 border-4 border-[#5f705f]/20 border-t-[#5f705f] rounded-full animate-spin" />
            </div>
        );
    }

    if (estado === 'onboarding') {
        return (
            <ProducerOnboarding
                onListo={() => {
                    setEstado('app');
                    navigate('/producer/inicio', { replace: true });
                }}
            />
        );
    }

    const primerNombre = user?.name?.split(' ')[0] || 'Productor';
    const hoy = new Date().toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <div className="producer-shell min-h-screen bg-[#F6F2EC] text-[#2D3E33] flex flex-col md:flex-row">
            {/* ── SIDEBAR LATERAL (Solo para Tablet y PC: md en adelante) ── */}
            <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#2D3E33] text-[#F6F2EC] shrink-0 sticky top-0 h-screen z-30 shadow-xl border-r border-white/10">
                {/* Logo & Marca Oficial */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <BrandLogo to="/producer/inicio" subtitle="Mi Finca" theme="light" size="md" />
                </div>

                {/* Perfil resumido en sidebar */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-black/15">
                    <div className="h-11 w-11 rounded-full bg-[#BD4A1F] text-[#F6F2EC] flex items-center justify-center font-heading text-base shadow">
                        {user?.avatarInitials || (primerNombre ? primerNombre.slice(0, 2).toUpperCase() : 'PR')}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-base font-extrabold text-[#F6F2EC] truncate">{user?.name || 'Productor'}</p>
                        <p className="text-[12px] text-[#CCD1C7] font-semibold capitalize truncate">{hoy}</p>
                    </div>
                </div>

                {/* Navegación de escritorio */}
                <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-extrabold transition-all duration-150',
                                    isActive
                                        ? 'bg-[#BD4A1F] text-[#F6F2EC] shadow-md shadow-[#BD4A1F]/30 translate-x-1'
                                        : 'text-[#CCD1C7] hover:bg-white/10 hover:text-white'
                                )
                            }
                        >
                            <Icon size={22} className="shrink-0" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Botón rápido y Cierre de sesión */}
                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        to="/producer/cosechas/nueva"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#E5A84B] hover:bg-[#d4973a] text-[#1B263B] font-extrabold text-sm uppercase tracking-wider shadow-md transition-colors"
                    >
                        <Plus size={18} />
                        <span>Nueva Cosecha</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-white/70 hover:text-rose-300 hover:bg-white/5 text-[14px] font-bold transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>

            {/* ── CONTENIDO PRINCIPAL (Responsivo: max-w-md en móvil, fluido en PC) ── */}
            <div className="flex-1 flex flex-col min-w-0 mx-auto w-full md:max-w-none">
                {/* Barra de noticias y precio en movimiento arriba de todo */}
                <div className="sticky top-0 z-40 bg-[#2D3E33]">
                    <BarraPrecioTicker />
                </div>

                {/* Encabezado compacto (solo móvil) con BrandLogo oficial */}
                <header className="md:hidden bg-[#F6F2EC]/95 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-[#2D3E33]/10">
                    <div className="flex items-center gap-3 min-w-0">
                        <BrandLogo to="/producer/inicio" subtitle="Mi Finca" theme="dark" size="sm" />
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Link
                            to="/producer/perfil"
                            className="h-11 w-11 shrink-0 rounded-full bg-[#2D3E33] text-[#F6F2EC] flex items-center justify-center font-heading text-sm shadow-md border border-[#2D3E33]/20"
                            aria-label="Mi perfil"
                        >
                            {user?.avatarInitials || (primerNombre ? primerNombre.slice(0, 2).toUpperCase() : 'PR')}
                        </Link>
                    </div>
                </header>

                {/* Aviso de sin conexión */}
                {!online && (
                    <div className="mx-4 md:mx-8 mt-3 flex items-center gap-2 rounded-2xl bg-[#bb8d3b]/15 border border-[#bb8d3b]/30 px-4 py-2.5 text-[13px] font-bold text-[#8a6a26]">
                        <WifiOff size={16} className="shrink-0" />
                        Sin internet. Todo lo que anotes se guarda en tu dispositivo.
                    </div>
                )}

                {/* Contenedor de páginas: En móvil es el max-w-md original, en PC se expande limpiamente */}
                <main className="producer-scroll flex-1 w-full max-w-md md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-6">
                    <Outlet />
                </main>

                {/* TabBar móvil (oculto en md con md:hidden) */}
                <TabBar />
            </div>
        </div>
    );
}
