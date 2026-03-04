import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
    Sprout,
    TrendingUp,
    TrendingDown,
    PlusCircle,
    PackageCheck,
    CloudRain,
    Thermometer,
    CheckCircle2,
    Clock,
    ArrowRight,
    MapPin,
    AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface StatusCardProps {
    label: string;
    value: string;
    description: string;
    icon: React.ElementType;
    trend?: { value: string; positive: boolean };
    className?: string;
}

const StatusCard = ({ label, value, description, icon: Icon, trend, className }: StatusCardProps) => (
    <motion.div
        whileHover={{ y: -4 }}
        className={cn('bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group', className)}
    >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
            <Icon size={80} />
        </div>
        <div className="relative">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#2C5F2D]/10 flex items-center justify-center text-[#2C5F2D]">
                    <Icon size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2C5F2D]/60">{label}</span>
            </div>
            <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-serif font-black text-gray-900 tracking-tight">{value}</span>
                {trend && (
                    <div className={cn('flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1 border',
                        trend.positive ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-500 bg-red-50 border-red-100')}>
                        {trend.positive ? <TrendingUp size={10} className="mr-0.5" /> : <TrendingDown size={10} className="mr-0.5" />}
                        {trend.value}
                    </div>
                )}
            </div>
            <p className="text-sm text-gray-500 font-medium">{description}</p>
        </div>
    </motion.div>
);

export function ProducerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const ENTREGAS_RECIENTES = [
        { fecha: '28 Feb 2024', kilos: '240', estado: 'Validado' },
        { fecha: '24 Feb 2024', kilos: '185', estado: 'Pendiente' },
        { fecha: '20 Feb 2024', kilos: '210', estado: 'Validado' },
    ];

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Bento Grid Header / Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 lg:col-span-9">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                        <StatusCard
                            label="Café en Proceso"
                            value="450 kg"
                            description="Cereza recolectada esta semana"
                            icon={Sprout}
                            trend={{ value: '12%', positive: true }}
                        />
                        <StatusCard
                            label="Lotes Entregados"
                            value="2"
                            description="Certificados este mes"
                            icon={PackageCheck}
                        />
                        <StatusCard
                            label="Precio del Día"
                            value="$2.45"
                            description="USD/lb (Tasa de café)"
                            icon={TrendingUp}
                            trend={{ value: '0.04%', positive: true }}
                        />
                    </div>
                </div>

                {/* Weather Widget (Mock) */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="md:col-span-4 lg:col-span-3 bg-[#2C5F2D] p-8 rounded-[40px] text-white flex flex-col justify-between shadow-xl relative overflow-hidden"
                >
                    <div className="absolute -top-10 -right-10 opacity-10 animate-pulse">
                        <CloudRain size={200} />
                    </div>
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-8 bg-white/10 w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                            <MapPin size={12} /> San Agustín, Huila
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <CloudRain size={48} className="text-blue-300 drop-shadow-md" />
                            <div className="flex flex-col">
                                <span className="text-5xl font-serif font-black tracking-tight leading-none">22°C</span>
                                <span className="text-sm font-medium opacity-80 mt-1">Lluvia por la tarde</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative pt-6 border-t border-white/10 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold opacity-60">Humedad:</span>
                            <span className="text-xs font-bold">78%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Thermometer size={14} className="opacity-60" />
                            <span className="text-xs font-bold">Min 16° / Max 24°</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Recent Deliveries table */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm flex-1 overflow-hidden p-2">
                        <div className="flex items-center justify-between px-8 py-8">
                            <h3 className="text-2xl font-serif font-black text-gray-900 tracking-tight">Últimas Entregas</h3>
                            <Button variant="ghost" size="sm" className="text-[#2C5F2D] font-bold gap-2 hover:bg-[#2C5F2D]/5 px-4 h-10 rounded-full">
                                Ver todo <ArrowRight size={14} />
                            </Button>
                        </div>

                        <div className="px-4 pb-4">
                            <div className="overflow-hidden bg-[#FDFDF8]/50 rounded-[32px] border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/50">Fecha</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/50 text-center">Kilos</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#2C5F2D]/50 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ENTREGAS_RECIENTES.map((entrega, idx) => (
                                            <tr key={idx} className="group hover:bg-white transition-colors">
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-bold text-gray-800">{entrega.fecha}</span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="text-sm font-serif font-black text-[#2C5F2D]">{entrega.kilos} kg</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className={cn('inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm',
                                                        entrega.estado === 'Validado' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100')}>
                                                        {entrega.estado === 'Validado' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                        {entrega.estado}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Quick Actions & Alerts */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Quick Action Bento Pieces */}
                    <div className="grid grid-cols-1 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/producer/cosechas/nueva')}
                            className="bg-[#2C5F2D] hover:bg-[#234d24] text-white p-8 rounded-[40px] flex flex-col justify-between items-start text-left shadow-xl shadow-[#2C5F2D]/20 transition-all duration-300 h-[220px] cursor-pointer"
                        >
                            <PlusCircle size={32} className="mb-4" />
                            <div>
                                <h4 className="text-2xl font-serif font-black mb-2 leading-tight">Registrar Nueva Recolección</h4>
                                <p className="text-sm font-medium opacity-70">Ingresa los kilos cosechados hoy por tus recolectores.</p>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white border border-gray-100 hover:border-[#2C5F2D] p-8 rounded-[40px] flex flex-col justify-between items-start text-left shadow-sm group transition-all h-[220px] cursor-pointer"
                        >
                            <AlertCircle size={32} className="mb-4 text-[#2C5F2D]" />
                            <div>
                                <h4 className="text-2xl font-serif font-black mb-2 leading-tight text-gray-900 group-hover:text-[#2C5F2D]">Agregar Insumo o Fertilizante</h4>
                                <p className="text-sm font-medium text-gray-400">Verifica el historial de aplicaciones en tus predios.</p>
                            </div>
                        </motion.button>
                    </div>

                    {/* Notice Card */}
                    <div className="bg-[#973333] p-8 rounded-[40px] text-white text-sm font-medium leading-relaxed relative overflow-hidden shadow-xl shadow-[#973333]/10">
                        <div className="absolute -top-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-xl animate-pulse" />
                        <span className="block font-black uppercase text-[10px] tracking-widest opacity-60 mb-4">Aviso de Auditoría</span>
                        Tu certificación de predio forestal expira en <span className="font-black underline underline-offset-4 cursor-pointer">12 días</span>. Asegúrate de cargar la documentación actualizada.
                    </div>
                </div>
            </div>
        </div>
    );
}
