import { useState } from 'react';
import {
    Sparkles,
    Download,
    QrCode,
    FileText,
    Image as ImageIcon,
    Video,
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const ACTIVOS_MARKETING = [
    {
        id: 'LOT-HUILA-084',
        finca: 'Finca La Esperanza',
        productor: 'Carlos Alberto Montero',
        variedad: 'Bourbon Rosado',
        perfil: 'Pomelo rosado, panela y flor de jamaica.',
        qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://odiseatrace.com/trazabilidad/publica/LOT-HUILA-084&color=5f705f',
        fotos: [
            'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
        ],
        reels: ['Cosecha Selectiva en San Agustín (9:16 HD)', 'Proceso de Fermentación Controlada (9:16 HD)'],
    },
    {
        id: 'LOT-ANT-112',
        finca: 'Manantial de Agua',
        productor: 'María Elena Restrepo',
        variedad: 'Geisha Honey',
        perfil: 'Jazmín intenso, bergamota y miel.',
        qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://odiseatrace.com/trazabilidad/publica/LOT-ANT-112&color=bb8d3b',
        fotos: [
            'https://images.unsplash.com/photo-1516026672302-bc52d61a55ac?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1550928431-ee0ecb00c653?auto=format&fit=crop&w=400&q=80',
        ],
        reels: ['Manantial de Agua: Sombra Nativa (9:16 HD)', 'Secado en Camas Africanas (9:16 HD)'],
    }
];

export function RoasterToolkit() {
    const [selectedActivo, setSelectedActivo] = useState(ACTIVOS_MARKETING[0]);
    const [descargados, setDescargados] = useState<Record<string, boolean>>({});

    const triggerDownload = (recurso: string) => {
        setDescargados(prev => ({ ...prev, [recurso]: true }));
        toast.success('Descarga Iniciada', {
            description: `El recurso "${recurso}" se ha empaquetado en alta resolución.`,
            style: { background: '#5f705f', color: '#ffffff' }
        });
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in duration-500 font-sans space-y-10">
            {/* Encabezado */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent pointer-events-none" />
                <div className="space-y-3 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-widest border border-purple-100">
                        <Sparkles size={14} /> Centro de Activos Co-Brandeadas
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Roaster Marketing Toolkit
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider max-w-xl leading-relaxed">
                        Conecte a sus consumidores finales con el origen. Descargue fotografías, videos verticales y códigos QR dinámicos optimizados para sus empaques y redes sociales.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Selector de Lotes */}
                <div className="lg:col-span-4 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#bb8d3b] block px-2">
                        Lote para Extraer Materiales
                    </span>
                    <div className="space-y-3">
                        {ACTIVOS_MARKETING.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedActivo(item)}
                                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-2 ${
                                    item.id === selectedActivo.id
                                        ? 'bg-white border-[#bb8d3b] shadow-md ring-4 ring-[#bb8d3b]/5'
                                        : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-200'
                                }`}
                            >
                                <span className="text-[10px] font-black uppercase bg-[#bb8d3b]/10 text-[#bb8d3b] px-2 py-0.5 rounded">
                                    {item.id}
                                </span>
                                <h3 className="text-sm font-black text-gray-900">{item.finca}</h3>
                                <p className="text-xs font-bold text-gray-500">{item.variedad}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Previsualización y Descargas */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm p-8 space-y-8">
                        {/* QR Code para Empaques */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100/80">
                            <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0 border border-gray-100">
                                <img src={selectedActivo.qrUrl} alt="QR Trazabilidad" className="w-28 h-28" />
                            </div>
                            <div className="space-y-3 text-center sm:text-left grow">
                                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-[#5f705f]">
                                    <QrCode size={13} /> QR de Trazabilidad Pública
                                </div>
                                <h4 className="text-base font-black text-gray-900">Listo para Imprimir en Bolsa</h4>
                                <p className="text-xs font-medium text-gray-500">
                                    El consumidor final escanea este código para acceder a la historia inmersiva de {selectedActivo.productor} y el perfil de taza.
                                </p>
                                <Button
                                    onClick={() => triggerDownload(`Código QR - ${selectedActivo.id}`)}
                                    variant="outline"
                                    className="h-9 rounded-xl text-xs font-black text-[#bb8d3b] border-[#bb8d3b]/30 hover:bg-[#bb8d3b]/10 gap-2"
                                >
                                    <Download size={13} /> Descargar Vector (SVG/PNG)
                                </Button>
                            </div>
                        </div>

                        {/* Ficha Técnica Co-Brandeada */}
                        <div className="space-y-3">
                            <span className="text-xs font-black uppercase tracking-wider text-[#5f705f] block">
                                Ficha Técnica de Tostaduría (PDF)
                            </span>
                            <div className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-gray-900">Data Sheet Co-Brandeada</h5>
                                        <p className="text-[11px] font-medium text-gray-400">Incluye logo del origen, curva sugerida y notas: "{selectedActivo.perfil}"</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => triggerDownload(`Ficha PDF - ${selectedActivo.id}`)}
                                    className="h-9 rounded-xl bg-[#5f705f] hover:bg-[#4a574a] text-white font-black text-xs gap-1.5"
                                >
                                    <Download size={13} /> PDF
                                </Button>
                            </div>
                        </div>

                        {/* Galería Fotográfica y Reels */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <span className="text-xs font-black uppercase tracking-wider text-[#5f705f] block">
                                Activos para Redes Sociales (Instagram / TikTok)
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Fotos */}
                                {selectedActivo.fotos.map((url, idx) => (
                                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-100 group h-40 bg-gray-50">
                                        <img src={url} alt="Origen" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-3">
                                            <span className="text-[10px] font-black text-white uppercase flex items-center gap-1">
                                                <ImageIcon size={12} /> Foto Origen HD
                                            </span>
                                            <button
                                                onClick={() => triggerDownload(`Foto ${idx+1} - ${selectedActivo.id}`)}
                                                className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-800 hover:bg-white transition-all shadow-sm"
                                            >
                                                <Download size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reels */}
                            <div className="space-y-2 pt-2">
                                {selectedActivo.reels.map((reel, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100/80 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <Video size={15} className="text-[#bb8d3b]" />
                                            <span className="text-xs font-bold text-gray-700">{reel}</span>
                                        </div>
                                        <Button
                                            onClick={() => triggerDownload(reel)}
                                            variant="ghost"
                                            className="h-8 px-3 hover:bg-white text-xs font-black text-[#5f705f] gap-1"
                                        >
                                            <Download size={12} /> MP4
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
