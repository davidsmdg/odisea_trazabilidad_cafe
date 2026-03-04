import { Outlet } from 'react-router';
import { useNavigate } from 'react-router';
import { Coffee } from 'lucide-react';
import { motion } from 'motion/react';

export function AuthLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F5DC] flex flex-col">
            {/* Header mínimo */}
            <header className="w-full px-8 py-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity cursor-pointer"
                >
                    <Coffee className="h-6 w-6 text-[#2C5F2D]" />
                    <span className="text-xl font-serif font-bold text-[#2C5F2D] tracking-tight">
                        TraceCafé
                    </span>
                </button>
            </header>

            {/* Contenido centrado */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full"
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Footer mínimo */}
            <footer className="py-6 text-center text-xs text-gray-400">
                © 2025 TraceCafé · Trazabilidad con propósito
            </footer>
        </div>
    );
}
