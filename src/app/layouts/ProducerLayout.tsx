import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Coffee,
    LayoutDashboard,
    MapPin,
    ClipboardList,
    Wallet,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronLeft,
    ChevronRight,
    Home,
    User,
    TestTube2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { cn } from '../components/ui/utils';
import { Button } from '../components/ui/button';

interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Inicio', path: '/producer/dashboard', icon: LayoutDashboard },
    { label: 'Mis Fincas', path: '/producer/fincas', icon: MapPin },
    { label: 'Lotes de Producción', path: '/producer/cosechas', icon: ClipboardList },
    { label: 'Costos', path: '/producer/costos', icon: Wallet },
    { label: 'Laboratorio', path: '/producer/laboratorio', icon: TestTube2 }, // Added Laboratorio
    { label: 'Mi Perfil', path: '/producer/perfil', icon: User },
];

export function ProducerLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#bb8d3b] text-white">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
                <Coffee className="h-8 w-8 text-white shrink-0" />
                {(!collapsed || mobileMenuOpen) && (
                    <span className="text-2xl font-sans font-bold tracking-tight">Odisea Trace</span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                                active
                                    ? 'bg-white text-[#bb8d3b] shadow-lg'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            )}
                        >
                            <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-[#bb8d3b]' : 'text-white/70 group-hover:text-white')} />
                            {(!collapsed || mobileMenuOpen) && (
                                <span className="font-semibold text-sm">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout & Exit */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all cursor-pointer group"
                >
                    <Home className="h-5 w-5 shrink-0" />
                    {(!collapsed || mobileMenuOpen) && <span className="font-semibold text-xs uppercase tracking-widest">Sitio Público</span>}
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all cursor-pointer group"
                >
                    <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                    {(!collapsed || mobileMenuOpen) && <span className="font-semibold text-sm">Cerrar sesión</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDF8] flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 sticky top-0 z-40">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-[#5f705f]"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
                <div className="flex items-center gap-2">
                    <Coffee className="h-6 w-6 text-[#5f705f]" />
                    <span className="text-xl font-sans font-bold text-[#5f705f]">Odisea Trace</span>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-64 z-50 md:hidden"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 80 : 280 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden shrink-0 z-30"
            >
                <div className="h-full relative shadow-2xl">
                    <SidebarContent />
                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute bottom-6 -right-3 w-7 h-7 bg-white rounded-full border border-gray-200 shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors z-10 cursor-pointer"
                    >
                        {collapsed ? <ChevronRight size={14} className="text-[#5f705f]" /> : <ChevronLeft size={14} className="text-[#5f705f]" />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Desktop Header */}
                <header className="hidden md:flex h-20 items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-sans font-bold text-gray-800">
                            Hola, <span className="text-[#5f705f]">{user?.name?.split(' ')[0] || 'Agricultor'}</span>
                        </h2>
                        <p className="text-xs text-gray-400 capitalize">
                            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:bg-gray-100 relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-[#a35c5c] rounded-full border-2 border-white" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden xl:block">
                                <p className="text-sm font-bold text-gray-800 leading-none mb-1">{user?.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Agricultor Senior</p>
                            </div>
                            <Avatar className="h-11 w-11 border-2 border-[#5f705f]/10 ring-2 ring-white cursor-pointer hover:scale-105 transition-transform">
                                <AvatarFallback className="bg-[#5f705f] text-white font-bold">
                                    {user?.avatarInitials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
