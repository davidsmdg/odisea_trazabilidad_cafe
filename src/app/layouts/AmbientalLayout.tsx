import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Coffee,
    Map,
    CheckCircle,
    LogOut,
    Menu,
    X,
    Bell,
    Shield,
    ChevronLeft,
    ChevronRight,
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
    { label: 'Bandeja de Revisión', path: '/ambiental/revisiones', icon: Map },
    { label: 'Historial de Aprobaciones', path: '/ambiental/historial', icon: CheckCircle },
];

export function AmbientalLayout() {
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
        <div className="flex flex-col h-full bg-[#064E3B] text-white"> {/* Deep Emerald Green for nature/environment */}
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-8 border-b border-white/5">
                <Shield className="h-8 w-8 text-emerald-400 shrink-0" />
                {(!collapsed || mobileMenuOpen) && (
                    <span className="text-xl font-serif font-black tracking-tight text-white leading-none">
                        ECO<span className="text-emerald-400">CHECK</span>
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
                                    ? 'bg-emerald-400 text-[#064E3B] font-bold shadow-xl shadow-emerald-900/40'
                                    : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-[#064E3B]' : 'text-emerald-100/40 group-hover:text-white')} />
                            {(!collapsed || mobileMenuOpen) && (
                                <span className="text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Role / Session Info & Exit */}
            <div className="p-6 border-t border-white/5 space-y-4">
                {(!collapsed || mobileMenuOpen) && (
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">Perfil Autorizado</p>
                        <p className="text-sm font-serif font-black text-white">Verificador Ambiental</p>
                        <div className="mt-3 h-1 w-full bg-black/20 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Link
                        to="/"
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-emerald-100/30 hover:bg-white/5 hover:text-white transition-all cursor-pointer group"
                    >
                        <Home className="h-5 w-5 shrink-0" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-[10px] font-black uppercase tracking-widest">Sitio Público</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-emerald-100/40 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer group"
                    >
                        <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-xs font-black uppercase tracking-widest">Desconectar</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFB] flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-[#064E3B]" />
                    <span className="text-lg font-serif font-black text-[#064E3B]">ECOCHECK</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-[#064E3B]"
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
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
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
                animate={{ width: collapsed ? 100 : 300 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden shrink-0 z-30 shadow-2xl"
            >
                <div className="h-full relative overflow-hidden">
                    <SidebarContent />
                    {/* Minimal Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute bottom-10 -right-4 w-8 h-8 bg-white rounded-full border border-gray-100 shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors z-10 cursor-pointer"
                    >
                        {collapsed ? <ChevronRight size={14} className="text-[#064E3B]" /> : <ChevronLeft size={14} className="text-[#064E3B]" />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Slim Header */}
                <header className="hidden md:flex h-20 items-center justify-between px-12 bg-white/60 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
                            Monitor Ambiental <span className="text-emerald-900 mx-2 ml-4">TraceCafé Hub</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                                <AvatarFallback className="bg-emerald-100 text-[#064E3B] font-black text-[10px]">
                                    {user?.avatarInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden xl:block">
                                <p className="text-xs font-bold text-emerald-900 leading-none">{user?.name}</p>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Autorizado EUDR</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 relative h-10 w-10">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
