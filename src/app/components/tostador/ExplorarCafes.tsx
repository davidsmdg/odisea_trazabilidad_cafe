import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
    Compass,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Star,
    Coffee,
    Leaf,
    Mountain,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

const LOTES_MARKET = [
    {
        id: 'LOT-HUILA-084',
        productorInfo: 'Productor de San Agustín, 42 años',
        municipio: 'San Agustín, Huila',
        finca: 'Finca La Esperanza',
        variedad: 'Bourbon Rosado',
        puntaje: '86.25',
        altura: '1.750 msnm',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: 'LOT-ANT-112',
        productorInfo: 'Productor de Acevedo, 38 años',
        municipio: 'Acevedo, Antioquia',
        finca: 'Manantial de Agua',
        variedad: 'Geisha / Honey',
        puntaje: '88.50',
        altura: '1.920 msnm',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: 'LOT-NAR-225',
        productorInfo: 'Productor de Garzón, 55 años',
        municipio: 'Garzón, Huila',
        finca: 'Cumbres de Oro',
        variedad: 'Castillo / Lavado',
        puntaje: '84.10',
        altura: '1.680 msnm',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: 'LOT-QUI-301',
        productorInfo: 'Productor de Pitalito, 29 años',
        municipio: 'Pitalito, Huila',
        finca: 'Lote El Diamante',
        variedad: 'Tabi / Natural',
        puntaje: '87.75',
        altura: '1.850 msnm',
        avatar: 'https://images.unsplash.com/photo-1544723083-3f112bb99eef?auto=format&fit=crop&q=80&w=200',
    },
];

export function ExplorarCafes() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CD7F32]/10 border border-[#CD7F32]/20 text-[#CD7F32] text-[10px] font-black uppercase tracking-widest">
                        <Compass size={14} className="animate-spin-slow" /> Marketplace B2B Exclusivo
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-serif font-black text-[#2A1B12] tracking-tighter">Explorar Cosechas Especiales</h1>
                    <p className="text-[#2A1B12]/60 font-medium max-w-2xl text-sm uppercase tracking-widest font-sans">
                        Sourcing directo desde el origen con trazabilidad completa
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#CD7F32]/40" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar Perfil, Variedad, Origen..."
                            className="h-16 w-80 rounded-[32px] border-none bg-white pl-14 pr-6 text-sm font-bold focus:ring-8 focus:ring-[#CD7F32]/5 shadow-xl transition-all"
                        />
                    </div>
                    <Button variant="outline" className="h-16 w-16 rounded-full border-white bg-white shadow-xl hover:bg-[#CD7F32] hover:text-white transition-all text-[#2A1B12]/40">
                        <Filter size={24} />
                    </Button>
                </div>
            </div>

            {/* Marketplace Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
                {LOTES_MARKET.map((lote, idx) => (
                    <motion.div
                        key={lote.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white rounded-[48px] overflow-hidden shadow-2xl hover:shadow-shadow-gold/20 flex flex-col md:flex-row border border-white relative transition-all duration-700"
                    >
                        {/* Image / Stats Section */}
                        <div className="md:w-[45%] h-64 md:h-auto relative overflow-hidden bg-slate-100">
                            <img
                                src={lote.avatar}
                                alt="Cosecha"
                                className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                <div>
                                    <p className="text-white font-serif font-black text-4xl leading-none">{lote.puntaje}</p>
                                    <p className="text-[#CD7F32] text-[9px] font-black uppercase tracking-widest mt-1">SCA CUPPING SCORE</p>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-[#CD7F32] border-4 border-white/20 flex items-center justify-center text-white shadow-2xl rotate-3 group-hover:rotate-12 transition-transform">
                                    <Star size={20} className="fill-white" />
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-[55%] p-10 flex flex-col justify-between space-y-8 bg-white relative">
                            {/* Privacy-Compliant Producer Info */}
                            <div className="space-y-4">
                                <p className="text-[#CD7F32] text-[10px] font-black uppercase tracking-[0.2em] mb-2">{lote.productorInfo}</p>
                                <h3 className="text-3xl font-serif font-black text-[#2A1B12] tracking-tighter leading-tight group-hover:text-[#CD7F32] transition-colors">{lote.finca}</h3>

                                <div className="space-y-4 pt-4 border-t border-[#CD7F32]/10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-[#CD7F32]/10 flex items-center justify-center text-[#CD7F32]"><MapPin size={14} /></div>
                                        <p className="text-xs font-black text-[#2A1B12]/60 uppercase tracking-widest">{lote.municipio}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-[#CD7F32]/10 flex items-center justify-center text-[#CD7F32]"><Mountain size={14} /></div>
                                        <p className="text-xs font-black text-[#2A1B12]/60 uppercase tracking-widest">{lote.altura}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-[#2A1B12]/5 hover:bg-[#2A1B12]/10 text-[#2A1B12] rounded-full px-4 py-1.5 border-none font-bold text-[10px] uppercase">
                                    <Coffee size={12} className="mr-2" /> {lote.variedad}
                                </Badge>
                                <Badge className="bg-[#CD7F32]/5 hover:bg-[#CD7F32]/10 text-[#CD7F32] rounded-full px-4 py-1.5 border-none font-bold text-[10px] uppercase">
                                    <Leaf size={12} className="mr-2" /> Certificado EUDR
                                </Badge>
                            </div>

                            <Button
                                onClick={() => navigate(`/tostador/lote/${lote.id}`)}
                                className="h-16 w-full rounded-[24px] bg-[#2A1B12] hover:bg-[#3E2C22] text-white font-black text-sm shadow-xl transition-all active:scale-95 group/btn gap-4"
                            >
                                <span className="uppercase tracking-[0.2em]">Ver Trazabilidad Completa</span>
                                <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-12 rounded-[56px] bg-white shadow-2xl flex flex-col items-center text-center gap-6 border-b-8 border-b-[#CD7F32]">
                <div className="h-20 w-20 rounded-[32px] bg-[#CD7F32]/10 flex items-center justify-center"><Coffee size={40} className="text-[#CD7F32] animate-bounce" /></div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-black text-[#2A1B12]">¿Buscas un perfil específico?</h3>
                    <p className="text-sm text-[#2A1B12]/40 font-bold uppercase tracking-widest leading-relaxed">Mostrando Lotes Premium validados hoy por el Laboratorio Central Ceres.</p>
                </div>
                <Button className="h-14 rounded-full px-10 bg-transparent border-2 border-[#CD7F32] text-[#CD7F32] font-black hover:bg-[#CD7F32] hover:text-white transition-all uppercase tracking-widest text-[10px]">Ver más orígenes</Button>
            </div>
        </div>
    );
}
