import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Compass,
    PackageCheck,
    ShieldCheck,
    Anchor,
    Sparkles,
    TrendingUp,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronLeft,
    ChevronRight,
    Coffee,
    Home,
    User,
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
    { label: 'Mi Perfil', path: '/tostador/perfil', icon: User },
    { label: 'Explorar Cafés', path: '/tostador/explorar', icon: Compass },
    { label: 'Mis Lotes', path: '/tostador/lotes', icon: PackageCheck },
    { label: 'EUDR / Deforestación', path: '/tostador/eudr', icon: ShieldCheck },
    { label: 'Marketing Hub', path: '/tostador/toolkit', icon: Sparkles },
    { label: 'Forward Booking', path: '/tostador/futuro', icon: TrendingUp },
];

export function TostadorLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#5f705f] text-white border-r border-[#5f705f]/20">
            {/* Logo Odisea Trace */}
            <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
                <div className="h-10 w-10 rounded-xl bg-[#bb8d3b] flex items-center justify-center shadow-md">
                    <Coffee className="h-6 w-6 text-white" />
                </div>
                {(!collapsed || mobileMenuOpen) && (
                    <div className="flex flex-col">
                        <span className="text-xl font-sans font-black tracking-tight text-white leading-none uppercase">
                            ODISEA <span className="text-[#bb8d3b]">TRACE</span>
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#bb8d3b] mt-1">Portal Tostador B2B</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-10 px-3 space-y-3 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group',
                                active
                                    ? 'bg-[#bb8d3b] text-white font-black shadow-md'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white font-bold'
                            )}
                        >
                            <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-[#bb8d3b] group-hover:text-white')} />
                            {(!collapsed || mobileMenuOpen) && (
                                <span className="text-xs uppercase tracking-wider leading-none">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Session Info & Exit */}
            <div className="p-6 border-t border-white/10 space-y-5">
                {(!collapsed || mobileMenuOpen) && (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-[#bb8d3b] mb-0.5">Perfil de Comprador</p>
                        <p className="text-xs font-black text-white">Tostador de Especialidad</p>
                    </div>
                )}

                <div className="space-y-2">
                    <Link
                        to="/"
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer group"
                    >
                        <Home className="h-5 w-5 shrink-0" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-[10px] font-black uppercase tracking-wider leading-none">Sitio Público</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-white/60 hover:bg-red-500/20 hover:text-red-200 transition-all cursor-pointer group"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-xs font-black uppercase tracking-wider leading-none">Cerrar Sesión</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-6 h-16 bg-[#5f705f] text-white border-b border-white/10 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-[#bb8d3b]" />
                    <span className="text-base font-black tracking-tight">ODISEA TRACE</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-72 z-50 md:hidden"
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
                className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden shrink-0 z-30 shadow-xl"
            >
                <div className="h-full relative overflow-hidden">
                    <SidebarContent />
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute bottom-10 -right-4 w-8 h-8 bg-[#bb8d3b] rounded-full shadow-md flex items-center justify-center hover:bg-[#a07830] transition-colors z-10 cursor-pointer text-white"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="hidden md:flex h-20 items-center justify-between px-12 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-[#bb8d3b] animate-pulse" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-[#5f705f]">
                            Cliente B2B <span className="text-gray-400 ml-3 normal-case italic border-l border-gray-200 pl-3 font-medium">Plataforma Exclusiva de Sourcing Directo</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                            <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-[#5f705f] text-white font-black text-[10px]">
                                    {user?.avatarInitials || 'TB'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-900 leading-none">{user?.name || 'Comprador'}</p>
                                <p className="text-[9px] text-[#bb8d3b] font-black uppercase tracking-wider mt-0.5">Roaster Partner</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-gray-900 relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#bb8d3b] rounded-full" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
