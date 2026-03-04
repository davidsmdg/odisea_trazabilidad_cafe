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
    { label: 'Dashboard Logístico', path: '/ceres/dashboard', icon: BarChart3 },
    { label: 'Directorio Productores', path: '/ceres/productores', icon: Contact },
    { label: 'Gestión de Lotes', path: '/ceres/lotes', icon: PackageOpen },
    { label: 'Exportaciones', path: '/ceres/exportaciones', icon: Ship },
    { label: 'Control de Calidad', path: '/ceres/calidad', icon: Microscope },
];

export function CeresLayout() {
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
        <div className="flex flex-col h-full bg-[#1e293b] text-white"> {/* Slate/Dark Steel for Corporate/Admin */}
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-8 border-b border-white/5">
                <Building2 className="h-8 w-8 text-blue-400 shrink-0" />
                {(!collapsed || mobileMenuOpen) && (
                    <span className="text-xl font-serif font-black tracking-tight text-white leading-none uppercase">
                        CERES<span className="text-blue-400 font-normal">ADMIN</span>
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-10 px-3 space-y-2 overflow-y-auto">
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
                                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-slate-500 group-hover:text-white')} />
                            {(!collapsed || mobileMenuOpen) && (
                                <span className="text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Role Info & Exit */}
            <div className="p-6 border-t border-white/5 space-y-4">
                {(!collapsed || mobileMenuOpen) && (
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Central Admin</p>
                        <p className="text-sm font-serif font-black text-white">Ceres Hub Manager</p>
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
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer group"
                    >
                        <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                        {(!collapsed || mobileMenuOpen) && <span className="text-xs font-black uppercase tracking-widest">Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-6 h-16 bg-[#1e293b] text-white border-b border-slate-700 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-400" />
                    <span className="text-lg font-serif font-black">CERES ADMIN</span>
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
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
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
                    {/* Minimal Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute bottom-10 -right-4 w-8 h-8 bg-white rounded-full border border-slate-200 shadow-xl flex items-center justify-center hover:bg-slate-50 transition-colors z-10 cursor-pointer"
                    >
                        {collapsed ? <ChevronRight size={14} className="text-slate-600" /> : <ChevronLeft size={14} className="text-slate-600" />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Slim Header */}
                <header className="hidden md:flex h-20 items-center justify-between px-12 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-lg" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                ERP <span className="text-slate-900 border-l border-slate-200 ml-4 pl-4 font-serif italic">Global Logistics Control</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm border border-slate-200">
                                <AvatarFallback className="bg-slate-800 text-white font-black text-[10px]">
                                    {user?.avatarInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden xl:block text-right">
                                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
                                <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest mt-1">Super Admin</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-slate-900 relative h-10 w-10">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
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
