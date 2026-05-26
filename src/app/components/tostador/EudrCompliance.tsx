import { useState } from 'react';
import {
    ShieldCheck,
    FileCheck,
    MapPin,
    Download,
    CheckCircle2,
    Satellite,
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const LOTES_EUDR = [
    {
        id: 'LOT-HUILA-084',
        finca: 'Finca La Esperanza',
        productor: 'Carlos Alberto Montero',
        coordenadas: '1.8843° N, 76.2931° W',
        areaPoligono: '12.04 Hectáreas (Polígono Cerrado)',
        riesgoDeforestacion: '0.0% (Riesgo Nulo)',
        fechaVerificacion: '12 Mayo 2026',
        ultimaImagenSat: 'Sentinel-2 (Resolución 10m)',
        certificados: ['Libre de Deforestación (Post 31-Dic-2020)', 'Legalidad: Legislación País Productor', 'Polígono Georreferenciado Validado'],
    },
    {
        id: 'LOT-ANT-112',
        finca: 'Manantial de Agua',
        productor: 'María Elena Restrepo',
        coordenadas: '5.6421° N, 75.6120° W',
        areaPoligono: '6.50 Hectáreas (Polígono Cerrado)',
        riesgoDeforestacion: '0.0% (Riesgo Nulo)',
        fechaVerificacion: '08 Mayo 2026',
        ultimaImagenSat: 'Landsat-8 / Copernicus',
        certificados: ['Libre de Deforestación (Post 31-Dic-2020)', 'Legalidad: Legislación País Productor', 'Polígono Georreferenciado Validado'],
    },
];

export function EudrCompliance() {
    const [selectedLote, setSelectedLote] = useState(LOTES_EUDR[0]);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            toast.success('Certificado EUDR Generado', {
                description: `El expediente de debida diligencia para ${selectedLote.id} ha sido descargado en PDF con firmas criptográficas.`,
                style: { borderRadius: '24px', background: '#5f705f', color: '#ffffff' }
            });
        }, 1500);
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in duration-500 font-sans space-y-10">
            {/* Header de Cumplimiento */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none" />
                
                <div className="space-y-3 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <ShieldCheck size={14} /> Regulación Europea (EUDR 2023/1115)
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Cumplimiento Cero Deforestación
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider max-w-xl leading-relaxed">
                        Sistema automatizado de debida diligencia georreferenciada para garantizar el acceso directo y libre de aranceles a puertos de la Unión Europea.
                    </p>
                </div>

                <div className="bg-emerald-500 text-white p-6 rounded-3xl shrink-0 space-y-1 shadow-md z-10">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-100 block">Estado de Auditoría</span>
                    <p className="text-2xl font-black flex items-center gap-2">
                        <CheckCircle2 size={24} className="fill-white text-emerald-500" /> APROBADO UE
                    </p>
                    <p className="text-[10px] text-emerald-50 font-bold pt-1">Firmado por Odisea Trace</p>
                </div>
            </div>

            {/* Selector de Lotes y Panel de Polígono */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Columna Izquierda: Listado de Lotes a Verificar */}
                <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#bb8d3b] block px-2">
                        Seleccione un Lote en Inventario
                    </span>

                    <div className="space-y-3">
                        {LOTES_EUDR.map((lote) => {
                            const isSelected = lote.id === selectedLote.id;
                            return (
                                <div
                                    key={lote.id}
                                    onClick={() => setSelectedLote(lote)}
                                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-3 ${
                                        isSelected
                                            ? 'bg-white border-[#5f705f] shadow-md ring-4 ring-[#5f705f]/5'
                                            : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-[#5f705f]/10 text-[#5f705f]">
                                                {lote.id}
                                            </span>
                                            <h3 className="text-base font-black text-gray-900 mt-1">{lote.finca}</h3>
                                        </div>
                                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                            {lote.riesgoDeforestacion}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 border-t border-gray-100 pt-2">
                                        <MapPin size={12} className="text-[#bb8d3b]" /> {lote.productor}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Columna Derecha: Detalles del Polígono Satelital y Certificados */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm p-8 space-y-8">
                        {/* Renderizado Simulado del Polígono */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                    <Satellite size={14} className="text-[#5f705f]" /> Telemetría Satelital de la Parcela
                                </span>
                                <span className="text-[10px] font-black text-[#bb8d3b]">{selectedLote.ultimaImagenSat}</span>
                            </div>

                            {/* Representación visual inmersiva de mapa/polígono */}
                            <div className="w-full h-64 bg-[#E5ECE9] rounded-3xl relative overflow-hidden border border-gray-200 flex items-center justify-center">
                                {/* Cuadricula de fondo simulando GIS */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#5f705f_1px,transparent_1px)] [background-size:16px_16px]" />
                                
                                {/* Polígono vectorial abstracto animado */}
                                <svg className="w-48 h-48 drop-shadow-md transition-all duration-500" viewBox="0 0 100 100">
                                    <polygon
                                        points="20,10 80,20 90,70 60,90 10,70"
                                        className="fill-[#5f705f]/20 stroke-[#5f705f] stroke-[2.5]"
                                    />
                                    <circle cx="20" cy="10" r="2.5" className="fill-[#bb8d3b]" />
                                    <circle cx="80" cy="20" r="2.5" className="fill-[#bb8d3b]" />
                                    <circle cx="90" cy="70" r="2.5" className="fill-[#bb8d3b]" />
                                    <circle cx="60" cy="90" r="2.5" className="fill-[#bb8d3b]" />
                                    <circle cx="10" cy="70" r="2.5" className="fill-[#bb8d3b]" />
                                </svg>

                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-100 space-y-0.5">
                                    <p className="text-[9px] font-black uppercase text-gray-400">Coordenadas del Centroide</p>
                                    <p className="text-xs font-black text-gray-800">{selectedLote.coordenadas}</p>
                                </div>

                                <div className="absolute bottom-4 right-4 bg-[#5f705f] text-white px-3 py-1.5 rounded-xl shadow-sm text-xs font-black">
                                    {selectedLote.areaPoligono}
                                </div>
                            </div>
                        </div>

                        {/* Listado de Puntos de Control Validados */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                                Puntos de Auditoría en la Debida Diligencia
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {selectedLote.certificados.map((cert, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                                        <FileCheck size={18} className="text-[#bb8d3b]" />
                                        <p className="text-[11px] font-black text-gray-800 leading-tight">{cert}</p>
                                        <span className="text-[9px] font-bold text-emerald-600 block">Validación Oficial</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Botón de Generación de Archivo XML / PDF Oficial EUDR y Número de Referencia */}
                        <div className="pt-4 space-y-4">
                            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">DDS Reference Number (EU IS)</span>
                                    <span className="text-sm font-black text-emerald-950 font-mono tracking-widest">EUDR-{selectedLote.id.split('-').pop()}-2026-X9A</span>
                                </div>
                                <div className="text-emerald-600 bg-white p-2 rounded-xl shadow-sm">
                                    <CheckCircle2 size={20} />
                                </div>
                            </div>

                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="w-full h-14 rounded-2xl bg-[#5f705f] hover:bg-[#4a574a] text-white font-black text-xs uppercase tracking-wider shadow-md gap-3"
                            >
                                <Download size={16} />
                                {isDownloading ? 'Empaquetando Evidencias y Polígonos...' : 'Descargar Expediente Oficial EUDR (PDF & XML)'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
