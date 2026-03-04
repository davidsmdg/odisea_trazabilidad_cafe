import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Compass,
    PackageCheck,
    FlaskConical,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronLeft,
    ChevronRight,
    Coffee,
    Flame,
    Search,
    Home,
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
    { label: 'Explorar Cafés', path: '/tostador/explorar', icon: Compass },
    { label: 'Mis Lotes', path: '/tostador/lotes', icon: PackageCheck },
    { label: 'Laboratorio Cata', path: '/tostador/laboratorio', icon: FlaskConical },
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
        <div className="flex flex-col h-full bg-[#2A1B12] text-[#E5D3B3] border-r border-[#3E2C22]"> {/* Dark roast coffee & parchment tones */}
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-8 border-b border-white/5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#CD7F32] to-[#B87333] flex items-center justify-center shadow-lg">
                    <Flame className="h-6 w-6 text-white" />
                </div>
                {(!collapsed || mobileMenuOpen) && (
                    <div className="flex flex-col">
                        <span className="text-xl font-serif font-black tracking-tighter text-white leading-none uppercase">
                            ROAST<span className="text-[#CD7F32]">MASTER</span>
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#CD7F32]/60 mt-1">Specialty Selection</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-10 px-3 space-y-4 overflow-y-auto">
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
                                    ? 'bg-[#CD7F32] text-white font-bold shadow-xl shadow-[#CD7F32]/20'
                                    : 'text-[#E5D3B3]/60 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-[#CD7F32] group-hover:text-white')} />
                            {(!collapsed || mobileMenuOpen) && (
                                <span className="text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Session Info & Exit */}
            <div className="p-6 border-t border-white/5 space-y-6">
                {(!collapsed || mobileMenuOpen) && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#CD7F32] mb-1">Perfil de Comprador</p>
                        <p className="text-sm font-serif font-black text-white">Tostador Artesanal</p>
                        <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-[#CD7F32]" />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Link
                        to="/"
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#CD7F32]/40 hover:bg-white/5 hover:text-white transition-all cursor-pointer group"
                    >
                        <Home className="h-5 w-5 shrink-0" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-[10px] font-black uppercase tracking-widest leading-none">Sitio Público</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#E5D3B3]/40 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer group"
                    >
                        <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-xs font-black uppercase tracking-widest leading-none">Cerrar Sesión</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-6 h-16 bg-[#2A1B12] text-white border-b border-white/5 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-[#CD7F32]" />
                    <span className="text-lg font-serif font-black">ROASTMASTER</span>
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
                className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden shrink-0 z-30 shadow-2xl"
            >
                <div className="h-full relative overflow-hidden">
                    <SidebarContent />
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute bottom-10 -right-4 w-8 h-8 bg-[#CD7F32] rounded-full border border-white/10 shadow-xl flex items-center justify-center hover:bg-[#B87333] transition-colors z-10 cursor-pointer text-white"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="hidden md:flex h-20 items-center justify-between px-12 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-[#E5D3B3]/20">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-[#CD7F32] animate-pulse" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2A1B12]/40">
                                B2B <span className="text-[#2A1B12] ml-4 font-serif italic border-l border-black/10 pl-4">Exclusive Roaster Platform</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 bg-[#2A1B12]/5 px-4 py-2 rounded-2xl border border-[#2A1B12]/5">
                            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                                <AvatarFallback className="bg-[#2A1B12] text-[#E5D3B3] font-black text-[10px]">
                                    {user?.avatarInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden xl:block text-right">
                                <p className="text-xs font-serif font-black text-[#2A1B12] leading-none">{user?.name}</p>
                                <p className="text-[10px] text-[#CD7F32] font-black uppercase tracking-widest mt-1">Roast Architect</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-[#2A1B12]/20 hover:text-[#2A1B12] relative h-10 w-10">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
