import { Outlet, Link, useNavigate } from 'react-router';
import { Coffee, Share2, Info, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

export function PublicLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans selection:bg-[#2C5F2D]/10 selection:text-[#2C5F2D]">
            {/* Minimal Public Header */}
            <header className="h-20 flex items-center justify-between px-6 md:px-12 bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-2xl bg-[#2C5F2D] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                        <Coffee className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-serif font-black tracking-tight text-[#1A1A1A] leading-none">
                            TRACE<span className="text-[#2C5F2D]">CAFÉ</span>
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#2C5F2D]/60 mt-0.5">Origin Connect</span>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full text-[#1A1A1A]/40 hover:text-[#2C5F2D] hover:bg-[#2C5F2D]/5 h-12 w-12 hidden md:flex">
                        <Share2 size={20} />
                    </Button>
                    {user && (
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-[#DC2626]/60 hover:text-[#DC2626] hover:bg-red-50 h-12 w-12"
                            title="Cerrar sesión"
                        >
                            <LogOut size={20} />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="rounded-full text-[#1A1A1A]/40 hover:text-[#2C5F2D] hover:bg-[#2C5F2D]/5 h-12 w-12">
                        <Info size={20} />
                    </Button>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-x-hidden">
                <Outlet />
            </main>

            {/* Minimal Public Footer */}
            <footer className="py-12 px-8 bg-[#1A1A1A] text-white/40 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center"><Coffee size={16} /></div>
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center"><Share2 size={16} /></div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
                        TraceCafé Blockchain Origins — Uniendo la taza con el corazón del campo.
                    </p>
                    <div className="h-px w-12 bg-[#2C5F2D] mx-auto opacity-30" />
                    <p className="text-[8px] font-bold opacity-30">© 2024 Innovación Cafetera S.A.S. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
