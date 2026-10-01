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
        // Usuario de vuelta que ya tiene finca: no molestamos con el onboarding.
        getFincas()
            .then((fs) => {
                if (fs.length > 0) {
                    marcarOnboarding('completo');
                    setEstado('app');
                } else {
                    setEstado('onboarding');
                }
            })
            .catch(() => setEstado('onboarding'));
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
        <div className="producer-shell min-h-screen bg-[#FDFDF8] text-[#2c362c] flex flex-col md:flex-row">
            {/* ── SIDEBAR LATERAL (Solo para Tablet y PC: md en adelante) ── */}
            <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#1d3d24] text-white shrink-0 sticky top-0 h-screen z-30 shadow-xl border-r border-[#2d5a37]/50">
                {/* Logo & Marca */}
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-[#bb8d3b] flex items-center justify-center text-white shadow-md font-black">
                        <Coffee size={22} />
                    </div>
                    <div>
                        <span className="text-lg font-black tracking-tight text-white block leading-none">
                            ODISEA
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#a4d4ab]">
                            Portal Productor
                        </span>
                    </div>
                </div>

                {/* Perfil resumido en sidebar */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-black/10">
                    <div className="h-11 w-11 rounded-2xl bg-[#5f705f] text-white flex items-center justify-center font-black text-sm shadow">
                        {user?.avatarInitials || (primerNombre ? primerNombre.slice(0, 2).toUpperCase() : 'PR')}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-white truncate">{user?.name || 'Productor'}</p>
                        <p className="text-[11px] text-[#a4d4ab] font-medium capitalize truncate">{hoy}</p>
                    </div>
                </div>

                {/* Navegación de escritorio */}
                <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-black transition-all duration-150',
                                    isActive
                                        ? 'bg-[#2d5a37] text-white shadow-md shadow-[#2d5a37]/40 translate-x-1'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                )
                            }
                        >
                            <Icon size={20} className="shrink-0" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Botón rápido y Cierre de sesión */}
                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        to="/producer/cosechas/nueva"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#bb8d3b] hover:bg-[#a67b30] text-white font-black text-sm shadow-md transition-colors"
                    >
                        <Plus size={18} />
                        <span>Nueva Cosecha</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-white/60 hover:text-rose-300 hover:bg-white/5 text-[13px] font-bold transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>

            {/* ── CONTENIDO PRINCIPAL (Responsivo: max-w-md en móvil, fluido en PC) ── */}
            <div className="flex-1 flex flex-col min-w-0 mx-auto w-full md:max-w-none">
                {/* Barra de noticias y precio en movimiento arriba de todo */}
                <div className="sticky top-0 z-40 bg-[#1d3d24]">
                    <BarraPrecioTicker />
                </div>

                {/* Encabezado compacto (solo móvil) */}
                <header className="md:hidden bg-[#FDFDF8]/90 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-gray-100">
                    <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 capitalize truncate">
                            {hoy}
                        </p>
                        <h1 className="text-2xl font-black text-gray-900 leading-tight truncate">
                            Hola, {primerNombre}
                        </h1>
                    </div>
                    <Link
                        to="/producer/perfil"
                        className="h-12 w-12 shrink-0 rounded-2xl bg-[#5f705f] text-white flex items-center justify-center font-black text-base shadow-md"
                        aria-label="Mi perfil"
                    >
                        {user?.avatarInitials || (primerNombre ? primerNombre.slice(0, 2).toUpperCase() : 'PR')}
                    </Link>
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
