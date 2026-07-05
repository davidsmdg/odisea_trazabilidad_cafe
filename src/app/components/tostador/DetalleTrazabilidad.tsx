import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
    ChevronLeft,
    Share2,
    Download,
    Coffee,
    Mountain,
    Building2,
    Ship,
    Leaf,
    ShieldCheck,
    ArrowRight,
    Star,
    Coins,
    HeartHandshake,
    Info,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CapituloTrazabilidad } from '../CapituloTrazabilidad';
import { cn } from '../ui/utils';

const MOCK_TRAZABILIDAD = [
    {
        id: 'orig',
        titulo: 'Capítulo 1: El Origen',
        resumen: 'Cultivado en las altas montañas del Huila por una familia caficultora integrada a Odisea Trace.',
        calificacion: 4.8,
        confiabilidad: 'Alta' as const,
        quepaso: [
            'Geolocalización del predio verificada',
            'Plan de manejo ambiental aprobado',
            'Cero deforestación reportada (EUDR)',
        ],
        evidencias: [
            { id: 'ev1', tipo: 'Geo' as const, nombre: 'Coordenadas del Lote', estado: 'Verificado' as const },
            { id: 'ev2', tipo: 'Certificado' as const, nombre: 'Cumplimiento EUDR', estado: 'Verificado' as const },
        ],
        datosClaves: [
            { label: 'Finca', valor: 'La Esperanza' },
            { label: 'Altura', valor: '1.750 msnm' },
            { label: 'Región', valor: 'San Agustín, Huila' },
            { label: 'Ecosistema', valor: 'Socio Odisea Trace' },
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
            'Logística Odisea sincronizada',
            'Embarcado en Puerto marítimo',
        ],
        evidencias: [
            { id: 'ev5', tipo: 'PDF' as const, nombre: 'Bill of Lading (B/L)', estado: 'Verificado' as const },
            { id: 'ev6', tipo: 'Foto' as const, nombre: 'Certificado de Pesaje', estado: 'Verificado' as const },
        ],
        datosClaves: [
            { label: 'Ingreso Bodega', valor: '20 Mayo 2026' },
            { label: 'Puerto Salida', valor: 'Cartagena, COL' },
            { label: 'Trazabilidad', valor: 'Odisea Hub' },
            { label: 'Precio FOB', valor: 'USD 2.85 / Lb' },
        ],
        tags: ['Logística Segura', 'Ready for Export'],
    }
];

import { getLotePorId } from '../../../services/lotesService';
import { AlertTriangle } from 'lucide-react';

export function DetalleTrazabilidadRoaster() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lote, setLote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const targetId = id || 'LOT-HUILA-084';
        getLotePorId(targetId)
            .then(found => {
                if (found) {
                    setLote(found);
                } else {
                    getLotePorId('LOT-HUILA-084').then(fallback => {
                        setLote(fallback);
                    });
                }
                setIsLoading(false);
            })
            .catch(err => {
                setError('Error al cargar detalle de trazabilidad');
                setIsLoading(false);
            });
    }, [id]);

    const variedad = lote?.variedad || 'Bourbon Rosado';
    const proceso = lote?.proceso || 'Lavado Especial';
    const codigoLote = lote?.id || id || 'LOT-HUILA-084';
    const factor = lote?.factorRendimiento || '90.5';

    const dynamicTrazabilidad = [
        {
            id: 'orig',
            titulo: 'Capítulo 1: El Origen',
            resumen: 'Cultivado en las altas montañas del Huila por una familia caficultora integrada a Odisea Trace.',
            calificacion: 4.8,
            confiabilidad: 'Alta' as const,
            quepaso: [
                'Geolocalización del predio verificada',
                'Plan de manejo ambiental aprobado',
                'Cero deforestación reportada (EUDR)',
            ],
            evidencias: [
                { id: 'ev1', tipo: 'Geo' as const, nombre: 'Coordenadas del Lote', estado: 'Verificado' as const },
                { id: 'ev2', tipo: 'Certificado' as const, nombre: 'Cumplimiento EUDR', estado: 'Verificado' as const },
            ],
            datosClaves: [
                { label: 'Finca', valor: lote?.finca || 'La Esperanza' },
                { label: 'Altura', valor: '1.750 msnm' },
                { label: 'Región', valor: 'San Agustín, Huila' },
                { label: 'Ecosistema', valor: 'Socio Odisea Trace' },
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
                { label: 'Variedad', valor: variedad },
                { label: 'Proceso', valor: proceso },
                { label: 'Factor Rendimiento', valor: factor.toString() },
                { label: 'Lote ID', valor: codigoLote },
            ],
            tags: ['Especialidad', 'Micro-lote'],
        },
        {
            id: 'logi',
            titulo: 'Capítulo 3: Logística & Exportación',
            resumen: 'Control de frescura desde la bodega hasta el puerto de embarque.',
            calificacion: 4.5,
            confiabilidad: 'Alta' as const,
            quepaso: lote?.historialMovimientos && lote.historialMovimientos.length > 0
                ? lote.historialMovimientos.map((m: any) => `${m.fecha} - ${m.estado}: ${m.descripcion} (${m.ubicacion})`)
                : [
                    'Humedad de recibo controlada (11.2%)',
                    'Logística Odisea sincronizada',
                    'Embarcado en Puerto marítimo',
                ],
            evidencias: [
                { id: 'ev5', tipo: 'PDF' as const, nombre: 'Bill of Lading (B/L)', estado: 'Verificado' as const },
                { id: 'ev6', tipo: 'Foto' as const, nombre: 'Certificado de Pesaje', estado: 'Verificado' as const },
            ],
            datosClaves: [
                { label: 'Ingreso Bodega', valor: lote?.historialMovimientos?.[0]?.fecha || '20 Mayo 2026' },
                { label: 'Destinos Habilitados', valor: lote?.regionesDisponibles?.join(', ') || 'USA, EU' },
                { label: 'Trazabilidad', valor: 'Odisea Hub' },
                { label: 'Estado Logístico', valor: lote?.estado || 'En Bodega' },
            ],
            tags: ['Logística Segura', 'Ready for Export'],
        }
    ];

    // Estructura transparente solicitada:
    // Precio Final de Ejemplo: $14.50 USD/Kg
    // Odisea Trace Fee: $0.80 USD/Kg fijos (~5.5%)
    // Costos de Consolidación y Procesos Asociados (~10% por fase, asumimos 2 fases = 20%): $2.90 USD/Kg
    // Retorno Directo al Productor: Remanente mayoritario ($10.80 USD/Kg = ~74.5%)
    const distribucion = {
        productor: { pct: 74.5, usd: '10.80', label: 'Retorno Directo Finca / Productor' },
        costos: { pct: 20.0, usd: '2.90', label: 'Consolidación, Trilla y Logística Asociada' },
        odisea: { pct: 5.5, usd: '0.80', label: 'Gestión Logística y Trazabilidad Odisea Trace' }
    };

    if (isLoading) {
        return (
            <div className="max-w-[1200px] mx-auto pb-24 animate-pulse font-sans space-y-10">
                <div className="bg-white rounded-[40px] border border-gray-100 p-12 h-48 flex flex-col justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[1200px] mx-auto pb-24 font-sans text-center py-20 bg-white border border-gray-100 rounded-[40px] p-10 space-y-4">
                <AlertTriangle className="text-red-500 mx-auto" size={48} />
                <h2 className="text-2xl font-black text-red-900">Algo salió mal</h2>
                <p className="text-red-700/80 font-bold">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-[#5f705f] text-white font-black px-6 py-2 rounded-xl border-none">Reintentar</Button>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in duration-500 font-sans">
            {/* Nav & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/tostador/lotes')}
                    className="group h-12 rounded-full border border-black/5 bg-white shadow-sm hover:bg-[#5f705f] hover:text-white transition-all px-6 gap-2"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform text-[#bb8d3b] group-hover:text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider">Volver a Mis Lotes</span>
                </Button>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-full h-12 px-6 border-[#bb8d3b]/30 text-[#bb8d3b] hover:bg-[#bb8d3b]/10 transition-all gap-3 text-xs font-bold uppercase tracking-wider">
                        <Download size={16} /> Bajar Storytelling (PDF)
                    </Button>
                    <Button className="rounded-full h-12 px-8 bg-[#5f705f] hover:bg-[#4a574a] text-white shadow-md gap-3 text-xs font-bold uppercase tracking-wider border-none">
                        <Share2 size={16} /> Compartir Lote
                    </Button>
                </div>
            </div>

            {/* Storytelling Header */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 md:p-16 relative overflow-hidden mb-10 flex flex-col items-center text-center">
                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-transparent via-[#bb8d3b] to-transparent opacity-40" />
                <div className="absolute top-10 right-10 opacity-5 rotate-12 scale-150 pointer-events-none"><Leaf size={200} /></div>

                <Badge className="bg-[#bb8d3b]/10 text-[#bb8d3b] border-none px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                    Trazabilidad Odisea Trace — Actualización en Vivo
                </Badge>

                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">Finca La Esperanza</h1>
                <p className="text-gray-500 font-bold max-w-2xl text-sm uppercase tracking-wider mb-10">
                    Huila, Colombia — Bourbon Rosado — Lavado Especial
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-gray-100 w-full max-w-3xl">
                    <div className="space-y-2">
                        <div className="h-12 w-12 rounded-full bg-[#5f705f]/10 flex items-center justify-center text-[#5f705f] mx-auto"><Mountain size={20} /></div>
                        <p className="text-[10px] font-black text-[#bb8d3b] uppercase tracking-wider">Altitud Promedio</p>
                        <p className="text-xl font-black text-gray-800">1.750 msnm</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto"><ShieldCheck size={20} /></div>
                        <p className="text-[10px] font-black text-[#bb8d3b] uppercase tracking-wider">Validación EUDR</p>
                        <p className="text-xl font-black text-gray-800">Aprobado</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-12 w-12 rounded-full bg-[#5f705f]/10 flex items-center justify-center text-[#5f705f] mx-auto"><Building2 size={20} /></div>
                        <p className="text-[10px] font-black text-[#bb8d3b] uppercase tracking-wider">Logística Odisea</p>
                        <p className="text-xl font-black text-gray-800">Exportación OK</p>
                    </div>
                </div>
            </div>

            {/* ÍNDICE DE TRANSPARENCIA Y DISTRIBUCIÓN DE VALOR (FAIRSOURCING) */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-[40px] border-2 border-[#5f705f]/10 p-8 md:p-12 shadow-sm mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#bb8d3b]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-[#5f705f]/10 text-[#5f705f] text-[10px] font-black uppercase tracking-wider">
                                FairSourcing Index
                            </span>
                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                <Info size={13} className="text-[#bb8d3b]" /> Auditado en Origen
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-2 flex items-center gap-2">
                            <Coins className="text-[#bb8d3b]" size={24} />
                            Distribución Transparente del Precio Comercializado
                        </h2>
                    </div>

                    <div className="text-left md:text-right">
                        <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wider">Precio de Referencia</span>
                        <span className="text-3xl font-black text-[#5f705f]">$14.50 <span className="text-xs font-bold text-gray-500">USD / Kg</span></span>
                    </div>
                </div>

                {/* Barra Apilada de Progreso Visual */}
                <div className="my-8 space-y-2">
                    <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner p-0.5 gap-0.5">
                        {/* Productor */}
                        <div 
                            style={{ width: `${distribucion.productor.pct}%` }} 
                            className="bg-[#5f705f] h-full rounded-l-full relative group transition-all duration-500 flex items-center justify-center"
                        >
                            <span className="text-[10px] font-black text-white px-2 truncate">
                                {distribucion.productor.pct}% Finca
                            </span>
                        </div>
                        {/* Costos Asociados */}
                        <div 
                            style={{ width: `${distribucion.costos.pct}%` }} 
                            className="bg-[#bb8d3b] h-full relative group transition-all duration-500 flex items-center justify-center"
                        >
                            <span className="text-[10px] font-black text-white px-2 truncate">
                                {distribucion.costos.pct}% Fases
                            </span>
                        </div>
                        {/* Odisea Fee */}
                        <div 
                            style={{ width: `${distribucion.odisea.pct}%` }} 
                            className="bg-gray-700 h-full rounded-r-full relative group transition-all duration-500 flex items-center justify-center"
                        >
                            <span className="text-[9px] font-black text-white px-1 truncate">
                                Odisea
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desglose de Eslabones sin revelar márgenes brutos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {/* Eslabón Productor */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100/80 shadow-sm relative">
                        <div className="absolute top-4 right-4 text-[#5f705f] bg-[#5f705f]/10 p-1.5 rounded-xl">
                            <HeartHandshake size={16} />
                        </div>
                        <span className="text-2xl font-black text-[#5f705f] block">
                            {distribucion.productor.pct}%
                        </span>
                        <span className="text-xs font-black text-gray-900 block mt-1">
                            {distribucion.productor.label}
                        </span>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                            Equivalente a <strong className="text-gray-700">${distribucion.productor.usd} USD/Kg</strong>. Refleja la prima directa por alta especialidad y prácticas sostenibles.
                        </p>
                    </div>

                    {/* Eslabón Costos de Fases */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100/80 shadow-sm relative">
                        <span className="text-2xl font-black text-[#bb8d3b] block">
                            ~{distribucion.costos.pct}%
                        </span>
                        <span className="text-xs font-black text-gray-900 block mt-1">
                            {distribucion.costos.label}
                        </span>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                            Aprox. <strong className="text-gray-700">10% adicional por fase</strong> desde el punto de consolidación hasta trilla y empaque para exportación.
                        </p>
                    </div>

                    {/* Eslabón Odisea Fee */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100/80 shadow-sm relative">
                        <span className="text-2xl font-black text-gray-700 block">
                            {distribucion.odisea.pct}%
                        </span>
                        <span className="text-xs font-black text-gray-900 block mt-1">
                            {distribucion.odisea.label}
                        </span>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                            Tarifa fija transparente de <strong className="text-gray-700">${distribucion.odisea.usd} USD/Kg</strong> por el aseguramiento tecnológico, auditoría y soporte logístico.
                        </p>
                    </div>
                </div>

                <div className="mt-6 bg-[#bb8d3b]/5 border border-[#bb8d3b]/20 rounded-2xl p-3 text-[11px] text-gray-600 italic">
                    💡 <strong>Nota de Sourcing Transparente:</strong> Presentamos la distribución porcentual para garantizar el pago justo en origen sin divulgar acuerdos confidenciales de fletes aduaneros, demostrando un retorno económico al caficultor sustancialmente superior a los esquemas tradicionales de bolsa.
                </div>
            </div>

            {/* The Timeline / Chapters */}
            <div className="space-y-12 relative">
                {/* Visual Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-[#bb8d3b]/40 to-transparent hidden lg:block" />

                {dynamicTrazabilidad.map((cap, i) => (
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
            <div className="mt-16 bg-[#5f705f] text-white rounded-[40px] p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12"><Ship size={160} /></div>

                <div className="md:w-3/5 space-y-6 z-10">
                    <div className="h-16 w-16 rounded-2xl bg-[#bb8d3b] flex items-center justify-center text-white shadow-md mb-4"><Coffee size={32} /></div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">¿Listo para su laboratorio?</h3>
                    <p className="text-white/80 font-medium leading-relaxed text-sm">
                        Este lote ha sido verificado en origen por Odisea Trace. Al recibir su muestra, podrá registrar su propio protocolo de calibración y curva de tueste.
                    </p>
                    <Button
                        onClick={() => navigate(`/tostador/cata/${id || '084'}`)}
                        className="h-14 rounded-xl px-8 bg-[#bb8d3b] hover:bg-[#a07830] text-white font-black text-sm gap-4 shadow-md transition-all group/btn border-none"
                    >
                        <span className="uppercase tracking-wider">Calibrar en Mi Laboratorio</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <div className="md:w-2/5 flex flex-col items-center z-10 w-full">
                    <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 text-center space-y-3 w-full max-w-xs shadow-md">
                        <p className="text-[10px] font-black uppercase text-[#bb8d3b] tracking-wider">SCA Score Final Origen</p>
                        <p className="text-6xl font-black text-white tracking-tight">86.25</p>
                        <div className="flex justify-center gap-1 py-2">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-[#bb8d3b] text-[#bb8d3b]" />)}
                        </div>
                        <p className="text-[9px] font-bold uppercase text-white/60 tracking-widest">Specialty Grade</p>
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8 px-4">
                Odisea Trace Compliance — Información protegida bajo estándares globales de trazabilidad B2B.
            </p>
        </div>
    );
}
