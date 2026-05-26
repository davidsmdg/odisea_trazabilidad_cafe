import { useState } from 'react';
import {
    Calendar,
    TrendingUp,
    CheckCircle2,
    Lock,
    FileSignature,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { toast } from 'sonner';

const PRODUCTORES_FUTURO = [
    {
        id: 'PROD-01',
        nombre: 'Carlos Alberto Montero',
        finca: 'Finca La Esperanza',
        variedadEstrella: 'Bourbon Rosado',
        proximaCosecha: 'Octubre - Diciembre 2026',
        volumenEstimadoSacos: 45,
        precioBaseProyectadoUSD: 510.00,
        compromisoActualPorcentaje: 20,
    },
    {
        id: 'PROD-02',
        nombre: 'María Elena Restrepo',
        finca: 'Manantial de Agua',
        variedadEstrella: 'Geisha / Cenicafé 1',
        proximaCosecha: 'Septiembre - Noviembre 2026',
        volumenEstimadoSacos: 25,
        precioBaseProyectadoUSD: 750.00,
        compromisoActualPorcentaje: 0,
    },
];

export function ForwardBooking() {
    const [selectedProd, setSelectedProd] = useState(PRODUCTORES_FUTURO[0]);
    const [porcentajeReserva, setPorcentajeReserva] = useState(30);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [contratos, setContratos] = useState<Record<string, number>>({});

    const sacosAsegurados = Math.round((selectedProd.volumenEstimadoSacos * porcentajeReserva) / 100);
    const valorEstimadoUSD = sacosAsegurados * selectedProd.precioBaseProyectadoUSD;
    const valorEstimadoEUR = (valorEstimadoUSD * 0.92).toFixed(2);

    const firmarContrato = () => {
        if (sacosAsegurados === 0) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setContratos(prev => ({ ...prev, [selectedProd.id]: porcentajeReserva }));
            toast.success('Contrato a Futuro Firmado', {
                description: `Ha asegurado el ${porcentajeReserva}% de la próxima cosecha de ${selectedProd.nombre}.`,
                style: { background: '#bb8d3b', color: '#ffffff' }
            });
        }, 1500);
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in duration-500 font-sans space-y-10">
            {/* Encabezado */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
                <div className="space-y-3 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        <TrendingUp size={14} /> Estabilidad y Previsión Comercial
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Forward Booking (Cosechas a Futuro)
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider max-w-2xl leading-relaxed">
                        Asegure exclusividad y precios estables antes de la recolección. Garantice un flujo predecible para su tostaduría mientras respalda financieramente la pre-cosecha del caficultor.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Productores Aliados */}
                <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#bb8d3b] block px-2">
                        Productores Aliados Disponibles
                    </span>
                    <div className="space-y-3">
                        {PRODUCTORES_FUTURO.map((prod) => {
                            const contratado = contratos[prod.id];
                            return (
                                <div
                                    key={prod.id}
                                    onClick={() => {
                                        setSelectedProd(prod);
                                        setPorcentajeReserva(contratado || 30);
                                    }}
                                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-3 ${
                                        prod.id === selectedProd.id
                                            ? 'bg-white border-[#5f705f] shadow-md ring-4 ring-[#5f705f]/5'
                                            : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-black text-gray-900">{prod.nombre}</h3>
                                            <p className="text-xs font-bold text-gray-500">{prod.finca} • {prod.variedadEstrella}</p>
                                        </div>
                                        {contratado && (
                                            <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                                                {contratado}% Asegurado
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 border-t border-gray-100 pt-2">
                                        <Calendar size={12} className="text-[#bb8d3b]" />
                                        <span>Cosecha: <span className="text-gray-700">{prod.proximaCosecha}</span></span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Configuración del Contrato */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm p-8 space-y-8">
                        {/* Detalles Proyectados */}
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-3xl border border-gray-100/80">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase text-gray-400 block">Volumen Total Proyectado</span>
                                <p className="text-xl font-black text-gray-800">{selectedProd.volumenEstimadoSacos} Sacos <span className="text-xs font-medium text-gray-400">(35 kg)</span></p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase text-gray-400 block">Precio Base Estimado</span>
                                <p className="text-xl font-black text-[#bb8d3b]">${(selectedProd.precioBaseProyectadoUSD * 0.92).toFixed(0)} € <span className="text-xs font-medium text-gray-400">/ saco</span></p>
                            </div>
                        </div>

                        {/* Slider de Porcentaje de Reserva */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black uppercase tracking-wider text-[#5f705f]">
                                    Porcentaje de Cosecha a Asegurar
                                </label>
                                <span className="text-2xl font-black text-[#bb8d3b]">{porcentajeReserva}%</span>
                            </div>

                            <Slider
                                value={[porcentajeReserva]}
                                min={10}
                                max={100}
                                step={5}
                                onValueChange={([val]) => setPorcentajeReserva(val)}
                                className="[&_[role=slider]]:bg-[#5f705f] [&_[role=slider]]:border-[#bb8d3b] [&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
                            />

                            <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                                <span>10% (Min. Exclusividad)</span>
                                <span>50% (Sourcing Medio)</span>
                                <span>100% (Lote Exclusivo)</span>
                            </div>
                        </div>

                        {/* Resumen de Impacto y Compromiso */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-gray-500">Volumen Exclusivo para Ud:</span>
                                <span className="text-base font-black text-gray-900">{sacosAsegurados} Sacos en Verde</span>
                            </div>
                            <div className="flex justify-between items-baseline border-b border-gray-50 pb-3">
                                <span className="text-xs font-bold text-gray-500">Compromiso Estimado de Compra:</span>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-[#5f705f]">{valorEstimadoEUR} €</span>
                                    <span className="text-[9px] font-bold text-gray-400 block">Aprox. ${(valorEstimadoUSD).toFixed(2)} USD</span>
                                </div>
                            </div>

                            {/* Garantías del Contrato */}
                            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 space-y-2">
                                <p className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                                    <span>Garantía de Precio Base Protegido para el Productor.</span>
                                </p>
                                <p className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                                    <Lock size={14} className="text-emerald-600 shrink-0" />
                                    <span>Prioridad Absoluta de Despacho Poscosecha.</span>
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={firmarContrato}
                            disabled={isSubmitting || sacosAsegurados === 0}
                            className="w-full h-14 rounded-2xl bg-[#bb8d3b] hover:bg-[#a07830] text-white font-black text-xs uppercase tracking-wider shadow-md gap-2 border-none"
                        >
                            <FileSignature size={16} />
                            {isSubmitting ? 'Registrando Contrato Inteligente...' : 'Firmar Compromiso Forward Booking'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
