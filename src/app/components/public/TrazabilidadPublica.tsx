import { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Star,
    Coffee,
    Heart,
    Send,
    MessageCircle,
    ChevronDown,
    MapPin,
    Calendar,
    Users,
    CheckCircle2,
    Leaf,
    Sparkles,
    Mountain,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

const MOCK_PUBLIC_DATA = {
    id: 'LOT-HUILA-084',
    municipio: 'San Agustín, Huila',
    edad: 42,
    genero: 'Masculino',
    variedad: 'Bourbon Rosado',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200',
};

const FLAVOR_NOTES = [
    { label: '🍫 Chocolate', value: 'chocolate' },
    { label: '🍓 Frutos Rojos', value: 'frutos_rojos' },
    { label: '🌸 Floral', value: 'floral' },
    { label: '🍋 Cítrico', value: 'citrico' },
    { label: '🥜 Nueces', value: 'nueces' },
];

export function TrazabilidadPublica() {
    const { loteId } = useParams();
    const [rating, setRating] = useState(0);
    const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleNote = (val: string) => {
        if (selectedNotes.includes(val)) {
            setSelectedNotes(prev => prev.filter(n => n !== val));
        } else {
            setSelectedNotes(prev => [...prev, val]);
        }
    };

    const handleSendFeedback = () => {
        if (rating === 0) {
            toast.error('Por favor selecciona una calificación de estrellas.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            toast.success('¡Gracias por tu valoración!');
        }, 1500);
    };

    return (
        <div className="flex flex-col animate-in fade-in duration-1000">
            {/* HERO SECTION - Producer Visual */}
            <section className="h-screen relative overflow-hidden flex items-center justify-center">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0"
                >
                    <img src={MOCK_PUBLIC_DATA.avatar} className="w-full h-full object-cover grayscale-[20%] sepia-[10%] group-hover:scale-105" alt="Origen" />
                    <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </motion.div>

                <div className="relative z-10 text-center space-y-8 px-8 max-w-4xl">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/80 text-[10px] uppercase font-black tracking-[0.4em]"
                    >
                        <Leaf size={14} className="text-[#2C5F2D]" /> Origen Sostenible Certificado
                    </motion.div>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-6xl md:text-8xl font-serif font-black text-white leading-none tracking-tighter"
                    >
                        El Corazón <br /> del Campo
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="flex flex-col items-center gap-4 text-white/40"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] mt-12 mb-4">Deslizar para descubrir</span>
                        <div className="h-12 w-px bg-gradient-to-b from-white to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* STORYTELLING SECTION - Emotional Data (Restricted C) */}
            <section className="bg-white px-8 py-32 md:py-48 flex flex-col items-center text-center space-y-24">
                <div className="max-w-2xl space-y-12">
                    <Quote className="h-16 w-16 text-[#2C5F2D]/10 mx-auto" />
                    <h2 className="text-4xl md:text-5xl font-serif font-black text-[#1A1A1A] leading-tight tracking-tight">
                        Este café no es solo una bebida, es la historia de una vida dedicada a la montaña.
                    </h2>
                    <div className="h-1 w-12 bg-[#2C5F2D] mx-auto opacity-30" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-6xl">
                    {[
                        { icon: MapPin, label: 'Cultivado en', value: MOCK_PUBLIC_DATA.municipio },
                        { icon: Calendar, label: 'Edad del Caficultor', value: `${MOCK_PUBLIC_DATA.edad} Años` },
                        { icon: Users, label: 'Género', value: MOCK_PUBLIC_DATA.genero },
                        { icon: Sparkles, label: 'Variedad', value: MOCK_PUBLIC_DATA.variedad },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 20 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="space-y-4 group"
                        >
                            <div className="h-16 w-16 rounded-[24px] bg-[#2C5F2D]/5 border border-[#2C5F2D]/10 flex items-center justify-center text-[#2C5F2D] mx-auto group-hover:scale-110 transition-transform">
                                <item.icon size={28} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2C5F2D]/60">{item.label}</p>
                                <p className="text-2xl font-serif font-black text-[#1A1A1A]">{item.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="w-full max-w-5xl rounded-[64px] overflow-hidden aspect-video shadow-2xl relative group">
                    <img src={MOCK_PUBLIC_DATA.heroImage} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000" alt="Plantación" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-12 left-12 flex items-center gap-4 bg-white/10 backdrop-blur-md px-10 py-4 rounded-[32px] border border-white/20">
                        <Mountain size={20} className="text-[#2C5F2D]" />
                        <span className="text-white text-xs font-black uppercase tracking-widest leading-none">Cuidado artesanal — 1.750 msnm</span>
                    </div>
                </div>
            </section>

            {/* FEEDBACK SECTION - Interaction (D) */}
            <section className="bg-[#FAF9F6] px-8 py-32 flex justify-center">
                <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: true }}
                    className="max-w-xl w-full bg-white rounded-[64px] shadow-2xl p-12 md:p-16 border border-black/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 inset-x-0 h-2 bg-[#2C5F2D] opacity-20" />

                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                <div className="text-center space-y-4">
                                    <div className="h-14 w-14 rounded-full bg-[#2C5F2D]/5 flex items-center justify-center text-[#2C5F2D] mx-auto mb-6"><Heart size={24} className="fill-[#2C5F2D]/20 animate-pulse" /></div>
                                    <h3 className="text-3xl font-serif font-black text-[#1A1A1A]">¿Qué te pareció <br /> esta taza?</h3>
                                    <p className="text-xs font-bold text-[#1A1A1A]/30 uppercase tracking-widest">Tu opinión crea mejores mañanas</p>
                                </div>

                                {/* Stars */}
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setRating(s)}
                                            className="group relative h-12 w-12 flex items-center justify-center transition-all cursor-pointer"
                                        >
                                            <Star
                                                size={32}
                                                className={cn(
                                                    "transition-all",
                                                    s <= rating ? "fill-[#CD7F32] text-[#CD7F32] scale-110" : "text-black/5 hover:text-black/10"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Flavor Notes */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-center uppercase tracking-widest text-[#2C5F2D]">Notas de sabor encontradas</p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {FLAVOR_NOTES.map((note) => (
                                            <button
                                                key={note.value}
                                                onClick={() => toggleNote(note.value)}
                                                className={cn(
                                                    "px-6 py-3 rounded-full text-xs font-bold transition-all border",
                                                    selectedNotes.includes(note.value)
                                                        ? "bg-[#2C5F2D] text-white border-[#2C5F2D] shadow-lg shadow-[#2C5F2D]/20 scale-105"
                                                        : "bg-[#FAF9F6] text-[#1A1A1A]/60 border-black/5 hover:border-black/10"
                                                )}
                                            >
                                                {note.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#1A1A1A]/40 uppercase tracking-widest ml-4 block flex items-center gap-2 italic">
                                        <MessageCircle size={14} /> Déjale un mensaje al caficultor
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tu mensaje será traducido y enviado digitalmente al productor..."
                                        className="w-full h-32 rounded-[32px] bg-[#FAF9F6] border-none p-8 text-sm font-serif italic text-[#1A1A1A] outline-none focus:ring-8 focus:ring-[#2C5F2D]/5 transition-all resize-none"
                                    />
                                </div>

                                <Button
                                    onClick={handleSendFeedback}
                                    disabled={isSubmitting}
                                    className="h-20 w-full rounded-[28px] bg-[#2C5F2D] hover:bg-black text-white font-black text-lg gap-4 shadow-xl active:scale-95 transition-all border-none"
                                >
                                    {isSubmitting ? (
                                        <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={24} /> Enviar Valoración
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center space-y-8 py-12"
                            >
                                <div className="h-24 w-24 rounded-full bg-[#2C5F2D]/10 text-[#2C5F2D] flex items-center justify-center mx-auto ring-8 ring-[#2C5F2D]/5 shadow-xl">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-serif font-black text-[#1A1A1A]">¡Muchas Gracias!</h3>
                                    <p className="text-[#1A1A1A]/60 font-medium leading-[200%] uppercase tracking-widest text-sm font-sans px-8">
                                        Tu valoración ayuda a mejorar la calidad de vida en el origen y fortalece nuestra comunidad de trazabilidad.
                                    </p>
                                </div>
                                <div className="h-1 w-12 bg-[#2C5F2D] mx-auto" />
                                <p className="text-[10px] font-black uppercase text-[#2C5F2D] tracking-widest">Connect with TraceCafé ®</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </section>
        </div>
    );
}

// Re-import missing icons if any
import { Quote } from 'lucide-react';
