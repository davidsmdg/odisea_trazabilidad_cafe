import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ChevronLeft,
    UserCircle,
    Calendar,
    MapPin,
    Mountain,
    Maximize2,
    Coffee,
    Sparkles,
    Package,
    Check,
    FlaskConical,
    ShoppingBag,
    Image as ImageIcon,
    Compass,
    Heart,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import { LOTES_MARKET_DEFAULT } from './ExplorarCafes';

// Mock de historias completas de productores por código de lote
const HISTORIAS_PRODUCTORES: Record<string, any> = {
    'LOT-HUILA-084': {
        productor: 'Carlos Alberto Montero',
        edad: 48,
        finca: 'Finca La Esperanza',
        municipio: 'San Agustín',
        departamento: 'Huila',
        altitud: '1.750 msnm',
        hectareas: '12 Hectáreas (8 dedicadas a microlotes)',
        variedadesDisponibles: 'Bourbon Rosado, Caturra, Castillo',
        fechasCosecha: 'Principal: Octubre - Diciembre | Mitaca: Mayo - Julio',
        biografia: 'Carlos Alberto representa la tercera generación de caficultores en las faldas del Macizo Colombiano. Desde hace 15 años decidió transformar la finca familiar enfocándose 100% en cafés de especialidad. Su obsesión por la recolección en el punto exacto de madurez (grados Brix óptimos) y los procesos de fermentación controlada le han valido reconocimientos locales. Al aliarse con Odisea Trace, busca establecer relaciones directas y estables con tostadores que valoren la sostenibilidad ambiental y el pago justo.',
        fotos: [
            'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=800&q=80', // Cerezas
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', // Planta / manos
            'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=800&q=80', // Paisaje
        ],
        lotesAsociados: [
            {
                id: 'LOT-HUILA-084',
                codigo: 'LOT-HUILA-084',
                variedad: 'Bourbon Rosado',
                proceso: 'Lavado Especial',
                empaque: '7 Sacos (35 kg verde) o 10 Cajas (24.5 kg)',
                perfilTaza: 'Pomelo rosado, panela, flor de jamaica y acidez málica brillante.',
                precioBaseKgUSD: 14.50,
                macroperfil: 'Frutal',
                impacto: 'Mujeres Caficultoras',
            }
        ]
    },
    'LOT-ANT-112': {
        productor: 'María Elena Restrepo',
        edad: 52,
        finca: 'Manantial de Agua',
        municipio: 'Acevedo',
        departamento: 'Antioquia',
        altitud: '1.820 msnm',
        hectareas: '6.5 Hectáreas integrales',
        variedadesDisponibles: 'Geisha, Colombia, Cenicafé 1',
        fechasCosecha: 'Principal: Septiembre - Noviembre | Mitaca: Abril - Junio',
        biografia: 'Líder comunitaria y madre cabeza de familia, María Elena ha convertido "Manantial de Agua" en un referente de empoderamiento femenino en la región. Su cultivo se desarrolla bajo un dosel de sombra nativa que protege los nacimientos de agua locales. Apasionada por la experimentación con levaduras y procesos Honey, cada microlote que produce lleva impreso el cuidado meticuloso y la dulzura característica de las tierras antioqueñas.',
        fotos: [
            'https://images.unsplash.com/photo-1516026672302-bc52d61a55ac?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550928431-ee0ecb00c653?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1568051243851-f9b18dc74f6c?auto=format&fit=crop&w=800&q=80',
        ],
        lotesAsociados: [
            {
                id: 'LOT-ANT-112',
                codigo: 'LOT-ANT-112',
                variedad: 'Geisha',
                proceso: 'Honey Amarillo',
                empaque: '3 Sacos (35 kg verde) o 5 Cajas (24.5 kg)',
                perfilTaza: 'Jazmín intenso, bergamota, té negro y dulzor prolongado a miel de abejas.',
                precioBaseKgUSD: 22.00,
                macroperfil: 'Floral',
                impacto: 'Jóvenes Productores',
            }
        ]
    },
    'LOT-QUI-301': {
        productor: 'Felipe Arango Vargas',
        edad: 39,
        finca: 'Lote El Diamante',
        municipio: 'Pitalito',
        departamento: 'Quindío',
        altitud: '1.900 msnm',
        hectareas: '15 Hectáreas tecnificadas',
        variedadesDisponibles: 'Tabi, Pacamara, Bourbon',
        fechasCosecha: 'Principal: Noviembre - Enero | Mitaca: Junio - Agosto',
        biografia: 'Felipe es un agrónomo joven que decidió regresar al campo para aplicar ciencia y tecnología en el beneficio del café. Su enfoque combina la tradición campesina con perfiles de fermentación prolongada en tanques sellados, logrando tazas sumamente complejas y especiadas. A través de Odisea Trace, garantiza el cumplimiento estricto de cero deforestación y trazabilidad absoluta desde la semilla hasta la entrega.',
        fotos: [
            'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1516026672302-bc52d61a55ac?auto=format&fit=crop&w=800&q=80',
        ],
        lotesAsociados: [
            {
                id: 'LOT-QUI-301',
                codigo: 'LOT-QUI-301',
                variedad: 'Tabi',
                proceso: 'Natural Prolongado',
                empaque: '11 Sacos (35 kg verde) o 16 Cajas (24.5 kg)',
                perfilTaza: 'Cereza madura, nibs de cacao, licor de mora y cuerpo cremoso envolvente.',
                precioBaseKgUSD: 16.80,
                macroperfil: 'Especiado',
                impacto: 'Comunidades Indígenas',
            }
        ]
    }
};

export function HistoriaProductor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [historia, setHistoria] = useState<any>(null);
    const [accionesRealizadas, setAccionesRealizadas] = useState<Record<string, { muestra?: boolean; reserva?: boolean }>>({});

    useEffect(() => {
        // Buscar si existe en el mock predeterminado
        if (id && HISTORIAS_PRODUCTORES[id]) {
            setHistoria(HISTORIAS_PRODUCTORES[id]);
            return;
        }

        // Si no, intentar construir a partir de localStorage para lotes dinámicos
        const savedLotes = localStorage.getItem('lotes_produccion');
        if (savedLotes) {
            try {
                const parsed = JSON.parse(savedLotes);
                const loteEncontrado = parsed.find((l: any) => l.id === id || l.codigo === id);
                if (loteEncontrado) {
                    let pesoKgVerde = 100;
                    if (loteEncontrado.pesos?.verde) pesoKgVerde = Number(loteEncontrado.pesos.verde);
                    else if (loteEncontrado.pesos?.pergamino) pesoKgVerde = Number(loteEncontrado.pesos.pergamino) * 0.8;
                    else if (loteEncontrado.pesos?.cereza) pesoKgVerde = Number(loteEncontrado.pesos.cereza) * 0.512;

                    const sacos = Math.max(1, Math.ceil(pesoKgVerde / 35));
                    const cajas = Math.max(1, Math.ceil(pesoKgVerde / 24.5));

                    const variedadDetectada = loteEncontrado.detallesObjetivo?.variedad || 'Castillo / Selección';
                    const procesoDetectado = loteEncontrado.detallesObjetivo?.proceso || 'Lavado Estándar';

                    const dynHistoria = {
                        productor: loteEncontrado.productorNombre || 'Productor Aliado Odisea',
                        edad: 45,
                        finca: loteEncontrado.finca || 'Finca de Origen Local',
                        municipio: loteEncontrado.municipio || 'Origen Premium',
                        departamento: loteEncontrado.departamento || 'Huila',
                        altitud: '1.780 msnm',
                        hectareas: '10 Hectáreas certificadas',
                        variedadesDisponibles: `${variedadDetectada}, Caturra, Colombia`,
                        fechasCosecha: 'Principal: Octubre - Diciembre | Mitaca: Abril - Junio',
                        biografia: `Con una arraigada vocación agrícola, ${loteEncontrado.productorNombre || 'nuestro productor aliado'} cultiva este café con prácticas respetuosas del entorno natural. La integración tecnológica con Odisea Trace asegura el monitoreo estricto de cada fase de poscosecha, promoviendo la consistencia en taza y el desarrollo sostenible de la comunidad cafetera local.`,
                        fotos: [
                            'https://images.unsplash.com/photo-1568051243851-f9b18dc74f6c?auto=format&fit=crop&w=800&q=80',
                            'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=800&q=80',
                            'https://images.unsplash.com/photo-1516026672302-bc52d61a55ac?auto=format&fit=crop&w=800&q=80',
                        ],
                        lotesAsociados: [
                            {
                                id: loteEncontrado.id,
                                codigo: loteEncontrado.codigo || id,
                                variedad: variedadDetectada,
                                proceso: procesoDetectado,
                                empaque: `${sacos} Sacos (35 kg verde) o ${cajas} Cajas (24.5 kg)`,
                                perfilTaza: loteEncontrado.perfilTaza || 'Notas dulces a panela, caña de azúcar, cítrico suave y postgusto balanceado e impecable.',
                                precioBaseKgUSD: loteEncontrado.pesos?.verde ? 12.50 : 10.00,
                                macroperfil: 'Regional Colombia',
                                impacto: 'Mujeres Caficultoras',
                            }
                        ]
                    };
                    setHistoria(dynHistoria);
                    return;
                }
            } catch (e) {}
        }

        // Buscar en LOTES_MARKET_DEFAULT
        const loteMarket = LOTES_MARKET_DEFAULT.find(l => l.id === id || l.codigo === id);
        if (loteMarket) {
            const dynMarketHistoria = {
                productor: loteMarket.productor,
                edad: '', // Espacio vacío para completar por admin
                finca: loteMarket.finca,
                municipio: loteMarket.municipio,
                departamento: loteMarket.departamento,
                altitud: '', // Espacio vacío para completar
                hectareas: '', // Espacio vacío para completar
                variedadesDisponibles: loteMarket.variedad,
                fechasCosecha: '', // Espacio vacío para completar
                biografia: `Productor aliado de la plataforma Ceres. Perfil en proceso de validación y enriquecimiento de datos por el equipo de Odisea Trace.`,
                fotos: [
                    loteMarket.avatar,
                    'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1516026672302-bc52d61a55ac?auto=format&fit=crop&w=800&q=80'
                ],
                lotesAsociados: [
                    loteMarket
                ]
            };
            setHistoria(dynMarketHistoria);
            return;
        }

        // Respaldo genérico si no se encuentra nada
        setHistoria(HISTORIAS_PRODUCTORES['LOT-HUILA-084']);
    }, [id]);

    const solicitarMuestra = (codigo: string) => {
        setAccionesRealizadas(prev => ({
            ...prev,
            [codigo]: { ...prev[codigo], muestra: true }
        }));
        toast.success(`Muestra solicitada para el lote ${codigo}`, {
            description: 'El laboratorio de Odisea Trace gestionará el envío directo a su tostaduría.'
        });
    };

    const reservarLote = (codigo: string) => {
        setAccionesRealizadas(prev => ({
            ...prev,
            [codigo]: { ...prev[codigo], reserva: true }
        }));
        toast.success(`Booking confirmado para el lote ${codigo}`, {
            description: 'El lote ha sido reservado exitosamente. Podrá ver su trazabilidad en "Mis Lotes".'
        });
    };

    if (!historia) return null;

    return (
        <div className="max-w-[1200px] mx-auto pb-24 animate-in fade-in duration-500 font-sans space-y-10">
            {/* Botón de regreso */}
            <div>
                <Button
                    variant="ghost"
                    onClick={() => navigate('/tostador/explorar')}
                    className="group h-11 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-[#5f705f] hover:text-white transition-all px-5 gap-2 text-xs font-bold uppercase tracking-wider"
                >
                    <ChevronLeft size={18} className="text-[#bb8d3b] group-hover:text-white transition-colors" />
                    <span>Volver a Explorar Cafés</span>
                </Button>
            </div>

            {/* Cabecera / Presentación del Productor */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#5f705f]/5 to-transparent pointer-events-none" />
                
                <div className="space-y-3 z-10 grow">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bb8d3b]/10 text-[#bb8d3b] text-[10px] font-black uppercase tracking-widest">
                        <Compass size={12} /> Historia de Origen Directo
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        {historia.productor}
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <UserCircle size={14} className="text-[#5f705f]" /> Caficultor Aliado • {historia.edad} años
                    </p>
                </div>

                <div className="bg-[#5f705f] text-white p-6 rounded-3xl shrink-0 w-full md:w-auto z-10 space-y-1 shadow-md">
                    <span className="text-[9px] font-black uppercase text-[#bb8d3b] tracking-wider block">Ubicación de la Finca</span>
                    <p className="text-xl font-black">{historia.finca}</p>
                    <p className="text-xs font-medium text-white/80 flex items-center gap-1 pt-1">
                        <MapPin size={12} className="text-[#bb8d3b]" /> {historia.municipio}, {historia.departamento}
                    </p>
                </div>
            </div>

            {/* Grid de Biografía e Información Detallada de la Finca */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Biografía / Resumen de la persona */}
                <div className="md:col-span-2 bg-gradient-to-br from-[#5f705f]/5 to-transparent p-8 rounded-[36px] border border-[#5f705f]/10 space-y-4 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-black uppercase tracking-wider text-[#5f705f] flex items-center gap-1.5">
                            <Heart size={14} className="text-[#bb8d3b]" /> Sobre el Caficultor
                        </span>
                        <h3 className="text-xl font-black text-gray-800 tracking-tight mt-1">
                            Un Legado de Dedicación y Calidad
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium mt-3 whitespace-pre-line">
                            {historia.biografia}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200/60 flex items-center gap-2 text-xs font-bold text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 block animate-pulse" />
                        <span>Productor verificado bajo estándares de pago justo Odisea Trace</span>
                    </div>
                </div>

                {/* Detalles Técnicos de la Finca */}
                <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-sm space-y-5">
                    <span className="text-xs font-black uppercase tracking-wider text-[#bb8d3b] block border-b border-gray-50 pb-2">
                        Ficha Técnica del Cultivo
                    </span>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Mountain size={18} className="text-[#5f705f] shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] font-black uppercase text-gray-400 block">Altitud Promedio</span>
                                <span className="text-xs font-black text-gray-800">{historia.altitud}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Maximize2 size={18} className="text-[#bb8d3b] shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] font-black uppercase text-gray-400 block">Extensión</span>
                                <span className="text-xs font-bold text-gray-700">{historia.hectareas}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Coffee size={18} className="text-[#5f705f] shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] font-black uppercase text-gray-400 block">Variedades Disponibles</span>
                                <span className="text-xs font-bold text-gray-700">{historia.variedadesDisponibles}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar size={18} className="text-[#bb8d3b] shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] font-black uppercase text-gray-400 block">Ciclos de Cosecha</span>
                                <span className="text-xs font-bold text-gray-700 block leading-tight mt-0.5">{historia.fechasCosecha}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE FOTOS DEL PRODUCTOR Y FINCA */}
            <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#5f705f] flex items-center gap-1.5 px-2">
                    <ImageIcon size={15} /> Galería Visual del Origen
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {historia.fotos.map((fotoUrl: string, idx: number) => (
                        <div key={idx} className="h-64 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group bg-gray-50">
                            <img
                                src={fotoUrl}
                                alt={`Vista de finca y caficultura colombiana ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <span className="text-white font-bold text-[10px] tracking-wider uppercase">
                                    {idx === 0 ? 'Cosecha Selectiva' : idx === 1 ? 'Cuidado del Grano' : 'Entorno Natural'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* LOTES ASOCIADOS A ESTE AGRICULTOR */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
                <div>
                    <span className="text-[10px] font-black uppercase text-[#bb8d3b] tracking-wider block">
                        Disponibilidad para Sourcing
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-2">
                        <Package className="text-[#5f705f]" size={22} />
                        Lotes en Verde Disponibles de {historia.productor}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {historia.lotesAsociados.map((lote: any) => {
                        const accion = accionesRealizadas[lote.codigo] || {};
                        const eurKg = (lote.precioBaseKgUSD * 0.92).toFixed(2);

                        return (
                            <div key={lote.id} className="bg-white rounded-[36px] border-2 border-gray-100 p-6 sm:p-8 shadow-sm space-y-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                                    <div>
                                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                                            <span className="bg-[#5f705f] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                                                {lote.codigo}
                                            </span>
                                            {lote.macroperfil && (
                                                <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-md">
                                                    {lote.macroperfil}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900">
                                            {lote.variedad} • {lote.proceso}
                                        </h3>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xl font-black text-[#bb8d3b] block">{eurKg} €</span>
                                        <span className="text-[10px] font-bold text-gray-400 block leading-none">por Kg (EU est.)</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Perfil Sensorial */}
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/80">
                                        <span className="text-[9px] font-black uppercase text-[#5f705f] flex items-center gap-1 block mb-0.5">
                                            <Sparkles size={10} className="text-[#bb8d3b]" /> Notas de Cata
                                        </span>
                                        <p className="text-xs font-medium text-gray-700 italic">
                                            "{lote.perfilTaza}"
                                        </p>
                                    </div>

                                    {/* Disponibilidad en verde estandarizada */}
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                        <Package size={14} className="text-[#bb8d3b]" />
                                        <span>Empaque: <span className="text-[#5f705f]">{lote.empaque}</span></span>
                                    </div>
                                </div>

                                {/* Botones de acción directos */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    {accion.muestra ? (
                                        <div className="h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-xs flex items-center justify-center gap-1.5">
                                            <Check size={14} className="stroke-[3]" /> Muestra Pedida
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => solicitarMuestra(lote.codigo)}
                                            variant="outline"
                                            className="h-10 rounded-xl border-gray-200 text-gray-700 font-bold text-xs hover:bg-[#bb8d3b]/10 hover:text-[#bb8d3b]"
                                        >
                                            <FlaskConical size={13} className="mr-1.5 text-[#bb8d3b]" /> Pedir Muestra
                                        </Button>
                                    )}

                                    {accion.reserva ? (
                                        <Button
                                            onClick={() => navigate('/tostador/lotes')}
                                            className="h-10 rounded-xl bg-[#5f705f] hover:bg-[#4a574a] text-white font-black text-xs flex items-center justify-center gap-1.5"
                                        >
                                            Ver en Mis Lotes
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => reservarLote(lote.codigo)}
                                            className="h-10 rounded-xl bg-[#bb8d3b] hover:bg-[#a07830] text-white font-black text-xs tracking-wider"
                                        >
                                            <ShoppingBag size={13} className="mr-1.5" /> Reservar Lote
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
