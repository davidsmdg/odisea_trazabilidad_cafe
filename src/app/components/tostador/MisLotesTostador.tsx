import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PackageCheck, Truck, FlaskConical, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { getLotesMaster, isLotePublicado } from '../../utils/loteStore';

export function MisLotesTostador() {
    const navigate = useNavigate();
    const [lotesComprados, setLotesComprados] = useState<any[]>([]);

    useEffect(() => {
        const master = getLotesMaster();
        
        // Cargar enlaces activos
        const rawLinks = localStorage.getItem('links_tostador');
        let links: any[] = [];
        if (rawLinks) {
            try { links = JSON.parse(rawLinks); } catch (e) {}
        } else {
            links = [
                { id: '1', loteId: 'LOT-HUILA-084', tostador: 'Blue Bottle Coffee (USA)' },
                { id: '2', loteId: 'LOT-ANT-112', tostador: 'Workshop Coffee (UK)' }
            ];
        }

        // Filtrar lotes master que están asociados en los vínculos de tostadores y publicados
        const linkedLotes = master.filter(l => links.some(link => link.loteId === l.id) && isLotePublicado(l.id));
        
        // Mapear al esquema de visualización
        const items = linkedLotes.map(l => {
            const linkObj = links.find(link => link.loteId === l.id);
            return {
                id: l.id,
                codigo: l.id,
                finca: l.finca,
                origen: l.municipio,
                variedad: l.variedad,
                proceso: l.proceso,
                volumen: `${l.pesos?.verde || 250} Kg Verde`,
                estado: l.estado === 'Listo Exportación' ? 'Listo Puerto / Exportación' : (l.estado === 'En Bodega' ? 'Recibido en Bodega' : 'En Finca (Origen)'),
                fechaReserva: l.fecha || '2026-05-10',
                eta: l.estado === 'Listo Exportación' ? 'Entregado en Puerto' : 'En Tránsito',
                contrato: `CTR-2026-${l.id.split('-').pop() || '8841'}`
            };
        });
        setLotesComprados(items);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase text-[#bb8d3b] bg-[#bb8d3b]/10 px-2.5 py-1 rounded-md tracking-wider">
                        Gestión de Compras B2B
                    </span>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 mt-2">
                        <PackageCheck className="h-8 w-8 text-[#5f705f]" />
                        Mis Lotes Reservados y Contratos
                    </h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">
                        Seguimiento logístico y documental de los micro-lotes adquiridos o en proceso de muestreo con Odisea Trace.
                    </p>
                </div>
                <Button 
                    onClick={() => navigate('/tostador/explorar')}
                    className="bg-[#5f705f] hover:bg-[#4a574a] text-white h-12 px-6 rounded-xl font-black text-xs uppercase tracking-wider shrink-0"
                >
                    Explorar Nuevos Lotes
                </Button>
            </div>

            {/* Listado */}
            <div className="grid grid-cols-1 gap-6">
                {lotesComprados.map(lote => (
                    <div key={lote.id} className="bg-white rounded-[32px] border-2 border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-3 grow">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-[#5f705f] text-white text-xs font-black px-3 py-1 rounded-lg">
                                    {lote.codigo}
                                </span>
                                <span className="text-xs font-bold text-gray-400">• Contrato {lote.contrato}</span>
                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded ml-auto md:ml-0 ${
                                    lote.estado.includes('Tránsito') ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                    ● {lote.estado}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{lote.finca}</h3>
                                <p className="text-xs font-bold text-gray-500">{lote.origen}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-gray-600">
                                <div><span className="text-gray-400 font-normal">Variedad:</span> {lote.variedad}</div>
                                <div><span className="text-gray-400 font-normal">Proceso:</span> {lote.proceso}</div>
                                <div><span className="text-gray-400 font-normal">Volumen FOB:</span> <span className="text-[#bb8d3b]">{lote.volumen}</span></div>
                            </div>
                        </div>

                        {/* Status & Delivery info */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/80 shrink-0 w-full md:w-72 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 border-b border-gray-200/60 pb-2">
                                <Truck size={14} className="text-[#bb8d3b]" />
                                <span>Entrega Estimada</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-medium">ETA Bodega:</span>
                                <span className="font-black text-gray-900">{lote.eta}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-medium">Booking:</span>
                                <span className="font-bold text-gray-600">{lote.fechaReserva}</span>
                            </div>
                            
                            <div className="pt-2 flex flex-col gap-2.5">
                                <Button 
                                    onClick={() => navigate(`/tostador/lote/${lote.id}`)}
                                    variant="outline" 
                                    className="w-full h-10 rounded-xl font-black text-xs text-gray-700 hover:bg-white uppercase tracking-wider shadow-sm"
                                >
                                    <FileText size={14} className="mr-1.5 text-[#5f705f]" /> Trazabilidad
                                </Button>
                                <Button 
                                    onClick={() => navigate(`/tostador/cata/${lote.id}`)}
                                    className="w-full h-10 rounded-xl bg-[#bb8d3b] hover:bg-[#a07830] text-white font-black text-xs uppercase tracking-wider shadow-sm"
                                >
                                    <FlaskConical size={14} className="mr-1.5" /> Catación / Feedback
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
