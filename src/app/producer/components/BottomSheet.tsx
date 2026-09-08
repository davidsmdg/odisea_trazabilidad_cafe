import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BottomSheetProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    /** Color del encabezado: verde (por defecto) o dorado */
    tono?: 'verde' | 'dorado' | 'rojo' | 'neutro';
    children: ReactNode;
}

const TONOS: Record<NonNullable<BottomSheetProps['tono']>, string> = {
    verde: 'bg-[#5f705f] text-white',
    dorado: 'bg-[#bb8d3b] text-white',
    rojo: 'bg-[#a35c5c] text-white',
    neutro: 'bg-white text-gray-900 border-b border-gray-100',
};

/** Hoja que sube desde abajo. Reemplaza a los diálogos de escritorio en el portal del productor. */
export function BottomSheet({ open, onClose, title, tono = 'verde', children }: BottomSheetProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                        className="relative w-full max-w-md bg-[#FDFDF8] rounded-t-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className={`flex items-center justify-between px-5 py-4 ${TONOS[tono]}`}>
                            <h2 className="text-lg font-black">{title}</h2>
                            <button
                                onClick={onClose}
                                className="h-9 w-9 rounded-full bg-black/10 flex items-center justify-center"
                                aria-label="Cerrar"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div
                            className="p-5 overflow-y-auto"
                            style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
                        >
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
