import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Coffee,
    Beaker,
    ClipboardList,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronLeft,
    ChevronRight,
    Home,
    Microscope,
    User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { cn } from '../components/ui/utils';
import { Button } from '../components/ui/button';
import { OnboardingTour, OnboardingTourTrigger } from '../components/OnboardingTour';

interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Mi Perfil', path: '/catador/perfil', icon: User },
    { label: 'Muestras Pendientes', path: '/catador/muestras', icon: Beaker },
    { label: 'Historial de Catas', path: '/catador/historial', icon: ClipboardList },
];

export function CatadorLayout() {
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
        <div className="flex flex-col h-full bg-[#EADDCA] text-[#5D4037] border-r border-[#D7CCC8]"> {/* Warm Cream & Wood Tones */}
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-8 border-b border-[#D7CCC8]">
                <Microscope className="h-8 w-8 text-[#5D4037] shrink-0" />
                {(!collapsed || mobileMenuOpen) && (
                    <span className="text-xl font-sans font-black tracking-tighter text-[#5D4037] leading-none uppercase">
                        ODISEA <span className="text-[#8D6E63] font-normal">COFFEE TRACE</span>
                    </span>
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
                                    ? 'bg-[#5D4037] text-white font-bold shadow-xl'
                                    : 'text-[#5D4037]/60 hover:bg-[#5D4037]/5 hover:text-[#5D4037]'
                            )}
                        >
                            <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-[#8D6E63] group-hover:text-[#5D4037]')} />
                            {(!collapsed || mobileMenuOpen) && (
                                <span className="text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Role / Session Info & Exit */}
            <div className="p-6 border-t border-[#D7CCC8] space-y-4">
                {(!collapsed || mobileMenuOpen) && (
                    <div className="p-4 rounded-2xl bg-white/40 border border-[#D7CCC8]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#8D6E63] mb-1">Laboratorio Q-Grader</p>
                        <p className="text-sm font-sans font-black text-[#5D4037]">Catador Certificado</p>
                    </div>
                )}

                <div className="space-y-2">
                    <Link
                        to="/"
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#8D6E63]/50 hover:bg-[#5D4037]/5 hover:text-[#5D4037] transition-all cursor-pointer group"
                    >
                        <Home className="h-5 w-5 shrink-0" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-[10px] font-black uppercase tracking-widest">Sitio Público</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#8D6E63] hover:bg-white hover:text-red-600 transition-all cursor-pointer group"
                    >
                        <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-xs font-black uppercase tracking-widest text-inherit">Cerrar Sesión</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF9] flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-6 h-16 bg-[#EADDCA] border-b border-[#D7CCC8] sticky top-0 z-40">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-[#5D4037]"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
                <div className="flex items-center gap-2">
                    <Microscope className="h-6 w-6 text-[#5D4037]" />
                    <span className="text-lg font-sans font-black text-[#5D4037]">ODISEA COFFEE TRACE</span>
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
                            className="fixed inset-0 bg-[#5D4037]/60 backdrop-blur-sm z-40 md:hidden"
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
                className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden shrink-0 z-30 shadow-sm"
            >
                <div className="h-full relative overflow-hidden">
                    <SidebarContent />
                    {/* Minimal Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute bottom-10 -right-4 w-8 h-8 bg-white rounded-full border border-[#D7CCC8] shadow-xl flex items-center justify-center hover:bg-[#FDFBF9] transition-colors z-10 cursor-pointer"
                    >
                        {collapsed ? <ChevronRight size={14} className="text-[#5D4037]" /> : <ChevronLeft size={14} className="text-[#5D4037]" />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Slim Header */}
                <header className="hidden md:flex h-20 items-center justify-between px-12 bg-white/60 backdrop-blur-xl sticky top-0 z-20 border-b border-[#EADDCA]">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-[#8D6E63] animate-pulse shadow-lg" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#5D4037]/40 font-sans">
                            Laboratory <span className="text-[#5D4037] mx-2 ml-4">Sensory Evaluation Portal</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-8">
                        <OnboardingTourTrigger role="TASTER" />
                        <div className="flex items-center gap-4 bg-[#FDFBF9] px-4 py-2 rounded-2xl border border-[#EADDCA]">
                            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm border border-[#D7CCC8]">
                                <AvatarFallback className="bg-[#EADDCA] text-[#5D4037] font-black text-[10px]">
                                    {user?.avatarInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden xl:block">
                                <p className="text-xs font-bold text-[#5D4037] leading-none">{user?.name}</p>
                                <p className="text-[10px] text-[#8D6E63] font-black uppercase tracking-widest mt-0.5">SCA Q-Grader</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-[#D7CCC8] hover:text-[#5D4037] hover:bg-[#EADDCA]/50 relative h-10 w-10">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#a35c5c] rounded-full border-2 border-white" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <Outlet />
                </main>
                <OnboardingTour role="TASTER" />
            </div>
        </div>
    );
}
