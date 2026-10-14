import { Outlet, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BrandLogo } from '../components/ui/BrandLogo';

export function AuthLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F6F2EC] flex flex-col overflow-x-hidden w-full max-w-full">
            {/* Header mínimo con logotipo oficial */}
            <header className="w-full px-6 sm:px-10 py-6">
                <BrandLogo to="/" subtitle="Mi Finca" theme="dark" size="md" />
            </header>

            {/* Contenido centrado */}
            <main className="flex-1 flex flex-col items-center justify-center w-full max-w-full sm:px-4 sm:py-12 overflow-x-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full max-w-full flex-1 flex flex-col"
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Footer mínimo */}
            <footer className="py-6 text-center text-xs text-gray-400 hidden sm:block">
                © 2025 Odisea Trace · Trazabilidad con propósito
            </footer>
        </div>
    );
}
