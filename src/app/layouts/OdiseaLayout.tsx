import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard,
    Contact,
    PackageOpen,
    Ship,
    Microscope,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronLeft,
    ChevronRight,
    Building2,
    BarChart3,
    Home,
    UserCheck,
    Leaf,
    History,
    Users,
    Wallet
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
    { label: 'Dashboard Logístico', path: '/odisea/dashboard', icon: BarChart3 },
    { label: 'Directorio General', path: '/odisea/productores', icon: Contact },
    { label: 'Finanzas de Productores', path: '/odisea/finanzas', icon: Wallet },
    { label: 'Gestión de Lotes', path: '/odisea/lotes', icon: PackageOpen },
    { label: 'Control de Enlaces', path: '/odisea/conexiones', icon: UserCheck },
    { label: 'Gestión de Usuarios', path: '/odisea/usuarios', icon: Users },
    { label: 'Auditoría Odisea (EUDR)', path: '/odisea/ambiental/revisiones', icon: Leaf },
    { label: 'Historial Ambiental', path: '/odisea/ambiental/historial', icon: History },
    { label: 'Exportaciones', path: '/odisea/exportaciones', icon: Ship },
    { label: 'Control de Calidad', path: '/odisea/calidad', icon: Microscope },
];

export function OdiseaLayout() {
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
        <div className="flex flex-col h-full bg-[#0F172A] text-white">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-8 border-b border-white/5">
                <Building2 className="h-8 w-8 text-blue-400 shrink-0" />
                {(!collapsed || mobileMenuOpen) && (
                    <span className="text-sm font-sans font-black tracking-widest text-white leading-none uppercase">
                        ODISEA <span className="text-blue-400 font-normal">COFFEE TRACE</span>
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-10 px-3 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    let anomalyCount = 0;
                    if (item.path === '/odisea/lotes') {
                        try {
                            const raw = localStorage.getItem('odisea_anomalias');
                            if (raw) {
                                const list = JSON.parse(raw);
                                anomalyCount = list.filter((a: any) => a.estadoResolucion === 'Pendiente').length;
                            }
                        } catch (e) {}
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group',
                                active
                                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-slate-500 group-hover:text-white')} />
                            {(!collapsed || mobileMenuOpen) && (
                                <span className="text-xs font-black uppercase tracking-widest leading-none flex items-center justify-between grow">
                                    <span>{item.label}</span>
                                    {anomalyCount > 0 && (
                                        <span className="bg-red-500 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center animate-pulse shrink-0">
                                            {anomalyCount}
                                        </span>
                                    )}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Role Info & Exit */}
            <div className="p-6 border-t border-white/5 space-y-4">
                {(!collapsed || mobileMenuOpen) && (
                    <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Central Admin</p>
                        <p className="text-sm font-sans font-black text-white">Odisea Trace Manager</p>
                        <div className="mt-3 flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="h-1 flex-1 bg-blue-500/20 rounded-full" />)}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Link
                        to="/"
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-white/5 hover:text-white transition-all cursor-pointer group"
                    >
                        <Home className="h-5 w-5 shrink-0" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-[10px] font-black uppercase tracking-widest">Sitio Público</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer group border-none bg-transparent"
                    >
                        <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-xs font-black uppercase tracking-widest">Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            {/* Desktop Sidebar */}
            <div className={cn("hidden lg:block transition-all duration-300 flex-shrink-0 border-r border-slate-200", collapsed ? "w-20" : "w-80")}>
                <SidebarContent />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-30">
                    <div className="flex items-center gap-4">
                        {/* Collapse Sidebar Button (Desktop) */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer text-slate-400 border-none bg-transparent"
                        >
                            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>

                        {/* Open Mobile Menu Button (Mobile) */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer text-slate-400 border-none bg-transparent"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Breadcrumbs / Logo Text for Mobile */}
                        <div className="flex items-center gap-3 lg:hidden">
                            <Building2 className="h-6 w-6 text-blue-600" />
                            <span className="text-sm font-sans font-black text-slate-800 tracking-wider">ODISEA TRACE</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <OnboardingTourTrigger role="CERES" />
                        {(() => {
                            let totalAnomalies = 0;
                            try {
                                const raw = localStorage.getItem('odisea_anomalias');
                                if (raw) {
                                    totalAnomalies = JSON.parse(raw).filter((a: any) => a.estadoResolucion === 'Pendiente').length;
                                }
                            } catch (e) {}

                            return (
                                <button className="relative p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors cursor-pointer border-none bg-transparent">
                                    <Bell size={20} />
                                    {totalAnomalies > 0 ? (
                                        <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[8px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center">
                                            {totalAnomalies}
                                        </span>
                                    ) : (
                                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
                                    )}
                                </button>
                            );
                        })()}

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-black uppercase text-slate-900 tracking-wider leading-none mb-1">{user?.name || 'Administrador'}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none">Odisea Trace Admin</p>
                            </div>
                            <Avatar className="h-9 w-9 ring-2 ring-slate-100">
                                <AvatarFallback className="bg-[#0F172A] text-white text-xs font-bold font-sans">
                                    {user?.avatarInitials || 'AD'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable View */}
                <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                    <Outlet />
                </main>
                <OnboardingTour role="CERES" />
            </div>

            {/* Mobile Drawer Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Overlay backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black z-40 lg:hidden"
                        />
                        {/* Drawer body */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 bottom-0 left-0 w-80 bg-[#0F172A] z-50 lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-6 w-6 text-blue-400" />
                                    <span className="text-sm font-sans font-black text-white uppercase tracking-widest">ODISEA TRACE</span>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors border-none bg-transparent"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <SidebarContent />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
