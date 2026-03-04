import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
    ChevronLeft,
    Share2,
    Download,
    Coffee,
    MapPin,
    Mountain,
    Building2,
    Ship,
    Leaf,
    ShieldCheck,
    Quote,
    ArrowRight,
    Star,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CapituloTrazabilidad } from '../CapituloTrazabilidad';
import { cn } from '../ui/utils';

const MOCK_TRAZABILIDAD = [
    {
        id: 'orig',
        titulo: 'Capítulo 1: El Origen',
        resumen: 'Cultivado en las altas montañas del Huila por una familia caficultora de tercera generación.',
        calificacion: 4.8,
        confiabilidad: 'Alta' as const,
        quepaso: [
            'Geolocalización del predio verificada',
            'Plan de manejo ambiental aprobado',
            'Cero deforestación reportada desde 2020',
        ],
        evidencias: [
            { id: 'ev1', tipo: 'Geo' as const, nombre: 'Coordenadas del Lote', estado: 'Verificado' as const },
            { id: 'ev2', tipo: 'Certificado' as const, nombre: 'Cumplimiento EUDR', estado: 'Verificado' as const },
        ],
        datosClaves: [
            { label: 'Finca', valor: 'La Esperanza' },
            { label: 'Altura', valor: '1.750 msnm' },
            { label: 'Región', valor: 'San Agustín, Huila' },
            { label: 'Agricultor', valor: 'Productor (42 años, Masculino)' },
        ],
        tags: ['Orgánico', 'Direct Trade', 'Biodiversidad'],
    },
    {
        id: 'proc',
        titulo: 'Capítulo 2: El Proceso',
        resumen: 'De la cereza al pergamino seco: Beneficio controlado para resaltar notas frutales.',
        calificacion: 5.0,
        confiabilidad: 'Alta' as const,
        quepaso: [
            'Cosecha manual selectiva',
            'Fermentación anaeróbica 48h',
            'Secado lento en marquesina',
        ],
        evidencias: [
            { id: 'ev3', tipo: 'Foto' as const, nombre: 'Grado de madurez (Brix)', estado: 'Verificado' as const },
            { id: 'ev4', tipo: 'Registro' as const, nombre: 'Bitácora de Secado', estado: 'Verificado' as const },
        ],
        datosClaves: [
            { label: 'Variedad', valor: 'Bourbon Rosado' },
            { label: 'Proceso', valor: 'Lavado Especial' },
            { label: 'Secado', valor: '15 días (Marquesina)' },
            { label: 'Lote ID', valor: 'LOT-HUILA-084' },
        ],
        tags: ['Especialidad', 'Micro-lote'],
    },
    {
        id: 'logi',
        titulo: 'Capítulo 3: Logística & Exportación',
        resumen: 'Control de frescura desde la bodega hasta el puerto de embarque.',
        calificacion: 4.5,
        confiabilidad: 'Alta' as const,
        quepaso: [
            'Humedad de recibo controlada (11.2%)',
            'Logística Ceres sincronizada',
            'Embarcado en Puerto de B/quilla',
        ],
        evidencias: [
            { id: 'ev5', tipo: 'PDF' as const, nombre: 'Bill of Lading (B/L)', estado: 'Verificado' as const },
            { id: 'ev6', tipo: 'Foto' as const, nombre: 'Certificado de Pesaje', estado: 'Verificado' as const },
        ],
        datosClaves: [
            { label: 'Ingreso Bodega', valor: '20 Mayo 2024' },
            { label: 'Puerto Salida', valor: 'Barranquilla, COL' },
            { label: 'Naviera', valor: 'MSC Logistics' },
            { label: 'Precio FOB', valor: 'USD 2.85 / Lb' },
        ],
        tags: ['Logística Segura', 'Ready for Export'],
    }
];

export function DetalleTrazabilidadRoaster() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Nav & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/tostador/explorar')}
                    className="group h-12 rounded-full border border-black/5 bg-white shadow-xl hover:bg-[#2A1B12] hover:text-white transition-all px-6 gap-2"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest font-sans">Volver al Marketplace</span>
                </Button>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-full h-12 px-6 border-[#CD7F32]/20 text-[#CD7F32] hover:bg-[#CD7F32]/5 transition-all gap-3 text-[10px] font-black uppercase tracking-widest">
                        <Download size={16} /> Bajar Storytelling (PDF)
                    </Button>
                    <Button className="rounded-full h-12 px-8 bg-[#2A1B12] hover:bg-black text-white shadow-xl gap-3 text-[10px] font-black uppercase tracking-widest border-none">
                        <Share2 size={16} /> Compartir Lote
                    </Button>
                </div>
            </div>

            {/* Storytelling Header */}
            <div className="bg-white rounded-[56px] border border-white shadow-2xl p-12 md:p-20 relative overflow-hidden mb-12 flex flex-col items-center text-center">
                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-transparent via-[#CD7F32] to-transparent opacity-30" />
                <div className="absolute top-10 right-10 opacity-5 rotate-12 scale-150 pointer-events-none"><Leaf size={200} /></div>

                <Badge className="bg-[#CD7F32]/10 text-[#CD7F32] border-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">Expediente de Calidad Premium</Badge>

                <h1 className="text-5xl md:text-7xl font-serif font-black text-[#2A1B12] tracking-tighter leading-none mb-6">Finca La Esperanza</h1>
                <p className="text-[#2A1B12]/60 font-medium max-w-2xl text-lg uppercase tracking-widest leading-relaxed mb-12 font-sans px-4">
                    Huila, Colombia — Bourbon Rosado — Lavado Especial
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-12 border-t border-black/5 w-full max-w-3xl">
                    <div className="space-y-4">
                        <div className="h-14 w-14 rounded-full bg-[#2A1B12]/5 flex items-center justify-center text-[#2A1B12] mx-auto shadow-inner"><Mountain size={24} /></div>
                        <p className="text-[10px] font-black text-[#CD7F32] uppercase tracking-[0.2em]">Altitud Promedio</p>
                        <p className="text-2xl font-serif font-black text-[#2A1B12]">1.750 msnm</p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-14 w-14 rounded-full bg-[#2A1B12]/5 flex items-center justify-center text-[#2A1B12] mx-auto shadow-inner"><ShieldCheck size={24} className="text-emerald-600" /></div>
                        <p className="text-[10px] font-black text-[#CD7F32] uppercase tracking-[0.2em]">Validación EUDR</p>
                        <p className="text-2xl font-serif font-black text-[#2A1B12]">Aprobado</p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-14 w-14 rounded-full bg-[#2A1B12]/5 flex items-center justify-center text-[#2A1B12] mx-auto shadow-inner"><Building2 size={24} /></div>
                        <p className="text-[10px] font-black text-[#CD7F32] uppercase tracking-[0.2em]">Logística Ceres</p>
                        <p className="text-2xl font-serif font-black text-[#2A1B12]">Exportación OK</p>
                    </div>
                </div>
            </div>

            {/* The Timeline / Chapters */}
            <div className="space-y-12 relative">
                {/* Visual Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-[#CD7F32]/40 to-transparent hidden lg:block" />

                {MOCK_TRAZABILIDAD.map((cap, i) => (
                    <div key={cap.id} className={cn("relative z-10", i % 2 !== 0 ? "lg:flex lg:justify-end" : "")}>
                        <div className="lg:w-[95%]">
                            <CapituloTrazabilidad
                                capitulo={cap}
                                onVerDetalle={() => { }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quality Recap (Final Call) */}
            <div className="mt-20 bg-[#2A1B12] text-[#E5D3B3] rounded-[56px] p-20 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl shadow-[#2A1B12]/40">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none rotate-12"><Ship size={180} /></div>

                <div className="md:w-3/5 space-y-8">
                    <div className="h-20 w-20 rounded-[32px] bg-white/10 flex items-center justify-center text-[#CD7F32] shadow-inner mb-6 border border-white/5"><Coffee size={40} /></div>
                    <h3 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tighter">¿Listo para su laboratorio?</h3>
                    <p className="text-[#E5D3B3]/60 font-medium leading-[200%] uppercase tracking-widest text-sm font-sans mb-8">
                        Este lote ha pasado por 4 niveles de validación externa. Al recibir su muestra, podrá registrar su propio protocolo sensorial en nuestro Laboratorio B2B.
                    </p>
                    <Button
                        onClick={() => navigate(`/tostador/cata/${id || '084'}`)}
                        className="h-20 rounded-[28px] px-12 bg-[#CD7F32] hover:bg-[#B87333] text-white font-black text-lg gap-6 shadow-2xl transition-all group/btn border-none"
                    >
                        <span className="uppercase tracking-[0.2em]">Validar en Mi Laboratorio</span>
                        <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                </div>

                <div className="md:w-2/5 flex flex-col items-center">
                    <div className="p-12 bg-white/5 backdrop-blur-3xl rounded-[48px] border border-white/5 text-center space-y-4 shadow-2xl">
                        <p className="text-[10px] font-black uppercase text-[#CD7F32] tracking-widest">SCA Score Final (Ceres)</p>
                        <p className="text-8xl font-serif font-black text-white italic">86.25</p>
                        <div className="flex justify-center gap-1 py-4">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-[#CD7F32] text-[#CD7F32]" />)}
                        </div>
                        <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.3em]">Specialty Grade - Direct Trade</p>
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] font-black text-[#2A1B12]/20 uppercase tracking-[0.4em] mt-12 font-sans px-8">
                Transparencia Pro activa — Esta vista ha sido anonimizada para proteger los datos directos del productor (RGPD/EUDR Compliance).
            </p>
        </div>
    );
}
