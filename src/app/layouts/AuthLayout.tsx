import { Outlet } from 'react-router';
import { useNavigate } from 'react-router';
import { Coffee } from 'lucide-react';
import { motion } from 'motion/react';

export function AuthLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFDF8] flex flex-col overflow-x-hidden w-full max-w-full">
            {/* Header mínimo */}
            <header className="w-full px-8 py-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity cursor-pointer"
                >
                    <Coffee className="h-6 w-6 text-[#5f705f]" />
                    <span className="text-xl font-sans font-bold text-[#5f705f] tracking-tight">
                        Odisea Trace
                    </span>
                </button>
            </header>

            {/* Contenido centrado */}
            <main className="flex-1 flex flex-col items-center justify-center w-full max-w-full px-4 py-12 overflow-x-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full max-w-full"
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Footer mínimo */}
            <footer className="py-6 text-center text-xs text-gray-400">
                © 2025 Odisea Trace · Trazabilidad con propósito
            </footer>
        </div>
    );
}
