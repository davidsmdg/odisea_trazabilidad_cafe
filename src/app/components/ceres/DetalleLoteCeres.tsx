import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    Box,
    Truck,
    Ship,
    Save,
    MapPin,
    Contact,
    Building2,
    FileText,
    ExternalLink,
    Droplets,
    Scale,
    Navigation,
    ShieldCheck,
    Calendar,
    ArrowUpRight,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

const MOCK_DETAIL = {
    id: 'LOT-HUILA-084',
    productor: {
        nombre: 'María González',
        cedula: '1.092.344.XXX',
        celular: '+57 312 455 XXXX',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    },
    finca: {
        nombre: 'Finca La Esperanza',
        altura: '1.750 msnm',
        coordenada: '1.88452, -76.29712',
        municipio: 'San Agustín, Huila',
    },
    lote: {
        variedad: 'Bourbon Rosado',
        cosecha: '05 Mayo 2024',
        beneficio: 'Lavado / Fermentación 48h',
        secado: 'Marquesina 15 días',
    }
};

export function DetalleLoteCeres() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Logística actualizada', {
                description: `ID: ${id} - Información de almacén y salida sincronizada con éxito.`,
                style: { borderRadius: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }
            });
            navigate('/ceres/lotes');
        }, 1500);
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header / Meta */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all active:scale-95 group"
                        onClick={() => navigate('/ceres/lotes')}
                    >
                        <ChevronLeft size={24} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-sans font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Control de Lote Logístico</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#5D4037] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">ID Lote: {id || '084'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 font-sans"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Trazabilidad Completa OK</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-600 text-white px-10 py-4 rounded-[40px] shadow-2xl flex items-center gap-6 group hover:translate-y-[-4px] transition-transform duration-500">
                    <div className="h-12 w-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
                        <ShieldCheck size={24} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 leading-none mb-1">Puntaje Calidad SCA</p>
                        <p className="text-4xl font-sans font-black leading-none">86.25 <span className="text-xs font-sans font-black opacity-30">PTS</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* SECTION 1: Contexto Completo (Solo Lectura C) */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-[48px] border border-slate-800 p-10 space-y-10 shadow-2xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Building2 size={180} /></div>

                        {/* Productor */}
                        <div className="space-y-6 relative">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-[32px] border-2 border-slate-700 p-1 bg-slate-800 overflow-hidden shrink-0">
                                    <img src={MOCK_DETAIL.productor.avatar} className="h-full w-full object-cover rounded-[24px]" alt="Productor" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-sans font-black text-white">{MOCK_DETAIL.productor.nombre}</h3>
                                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">Agricultor Senior</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-slate-800/40 border border-slate-800">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Cédula</span>
                                    <p className="text-xs font-bold">{MOCK_DETAIL.productor.cedula}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-slate-800/40 border border-slate-800">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Celular</span>
                                    <p className="text-xs font-bold">{MOCK_DETAIL.productor.celular}</p>
                                </div>
                            </div>
                        </div>

                        {/* Finca & Lote Context */}
                        <div className="space-y-4 pt-4 relative">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60 pb-2 border-b border-white/5">Origen del Café</h4>
                            <Accordion type="single" collapsible className="w-full space-y-3">
                                <AccordionItem value="finca" className="border border-slate-800 bg-slate-800/20 rounded-[28px] overflow-hidden px-4 hover:bg-slate-800/40 transition-all">
                                    <AccordionTrigger className="hover:no-underline py-4 text-white font-bold text-xs">
                                        <div className="flex items-center gap-3 uppercase tracking-widest"><MapPin size={16} className="text-blue-400" /> {MOCK_DETAIL.finca.nombre}</div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-xs px-2 space-y-4 py-4">
                                        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                                            <span className="text-[9px] font-black">Coordenadas</span>
                                            <span className="font-mono text-blue-400">{MOCK_DETAIL.finca.coordenada}</span>
                                        </div>
                                        <p className="font-medium">{MOCK_DETAIL.finca.municipio} — {MOCK_DETAIL.finca.altura}</p>
                                        <Button variant="outline" className="w-full text-[9px] font-black uppercase tracking-widest h-10 border-slate-700 bg-slate-800 hover:bg-slate-700 rounded-2xl gap-2">
                                            <FileText size={12} /> Ver Certificado de Libertad
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="lote" className="border border-slate-800 bg-slate-800/20 rounded-[28px] overflow-hidden px-4 hover:bg-slate-800/40 transition-all">
                                    <AccordionTrigger className="hover:no-underline py-4 text-white font-bold text-xs uppercase tracking-widest">
                                        <div className="flex items-center gap-3"><Box size={16} className="text-blue-400" /> Detalles Técnicos Lote</div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-xs px-2 space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-tighter">Variedad</p>
                                                <p className="font-bold text-slate-200">{MOCK_DETAIL.lote.variedad}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-tighter">Cosecha</p>
                                                <p className="font-bold text-slate-200">{MOCK_DETAIL.lote.cosecha}</p>
                                            </div>
                                            <div className="col-span-2 pt-2 border-t border-white/5">
                                                <p className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-tighter">Manejo Post-Cosecha</p>
                                                <p className="font-medium text-slate-400">{MOCK_DETAIL.lote.beneficio} / {MOCK_DETAIL.lote.secado}</p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <p className="text-[9px] font-black text-slate-600 text-center uppercase tracking-widest">TRACE-CERTIFIED SOURCE — ERP REF #772</p>
                    </div>
                </div>

                {/* SECTION 2 & 3: Portales de Escritura (DCA) */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-10">
                    {/* Almacenamiento Form */}
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-xl overflow-hidden group">
                        <div className="bg-slate-50 px-10 py-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-4">
                                <Truck size={24} className="text-blue-600" /> Gestión de Almacenamiento (Bodega)
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Permiso: DCA-LOG</Badge>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Fecha Ingreso a Bodega</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <Input defaultValue="2024-05-20" type="date" className="h-14 pl-12 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 font-bold text-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Ubicación en Bodega (Estiba/Silo)</Label>
                                <Input defaultValue="Estiba A-12 Sector Norte" placeholder="Ej: Silo 4, Estiba B" className="h-14 px-6 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Humedad de Recibo (%)</Label>
                                <div className="relative">
                                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                    <Input defaultValue="11.2" type="number" step="0.1" className="h-14 pl-12 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 font-bold text-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Peso Neto Ingreso (Kg)</Label>
                                <div className="relative">
                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                    <Input defaultValue="580" type="number" className="h-14 pl-12 rounded-2xl border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 font-bold text-slate-700" />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Observaciones de Almacenamiento</Label>
                                <textarea className="w-full h-24 rounded-2xl border-slate-100 bg-[#f8fafc] p-6 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300 resize-none" placeholder="Estado de los sacos, rotulados, etc..." />
                            </div>
                        </div>
                    </div>

                    {/* Exportación Form */}
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-xl overflow-hidden group">
                        <div className="bg-slate-900/5 px-10 py-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-sans font-black text-slate-900 flex items-center gap-4">
                                <Ship size={24} className="text-emerald-600" /> Despacho Logístico & Exportación
                            </h3>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Permiso: DCA-EXP</Badge>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Nro Registro DEX / Bill of Lading</Label>
                                <Input placeholder="BOL-HUI-2024-XXX" className="h-14 px-6 rounded-2xl border-slate-100 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-600 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Destino Internacional / Puerto</Label>
                                <Input placeholder="Hamburgo, Alemania" className="h-14 px-6 rounded-2xl border-slate-100 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-600 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Precio FOB (USD/Lb)</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-300">$</span>
                                    <Input defaultValue="2.85" type="number" step="0.01" className="h-14 pl-10 rounded-2xl border-slate-100 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-600 font-bold text-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Contrato de Venta (PDF)</Label>
                                <div className="h-14 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-between px-6 bg-slate-50 cursor-pointer hover:border-emerald-200 transition-all group/file">
                                    <span className="text-xs font-bold text-slate-400 group-hover/file:text-emerald-600">Subir Documento Digital</span>
                                    <ArrowUpRight size={16} className="text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Action */}
                    <div className="pt-6">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-24 w-full rounded-[32px] bg-slate-900 border-none hover:bg-black text-white font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-6 group overflow-hidden"
                        >
                            <Save size={28} className="text-blue-400 group-hover:scale-125 transition-transform" />
                            {isSaving ? 'Sincronizando ERP...' : 'Sincronizar y Actualizar Expediente'}
                        </Button>
                        <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-8">Ceres Logistics Control — Secure Ledger Write OK</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
