import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Send,
    AlertTriangle,
    ShieldAlert,
    MessageSquare,
    CheckCircle2,
    Lock,
    ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

export function CanalReporte() {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [riskType, setRiskType] = useState('social');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setMessage('');
            toast.success("Reporte enviado de forma encriptada", {
                description: "Ceres Corp ha recibido tu alerta. Un oficial de cumplimiento revisará el caso en menos de 24h.",
                style: { borderRadius: '24px', padding: '20px' }
            });
        }, 1500);
    };

    return (
        <div className="max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row gap-10">

                {/* Lateral: Información de Seguridad */}
                <div className="md:w-1/3 space-y-6">
                    <div className="bg-[#1A365D] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={120} /></div>
                        <div className="relative">
                            <Badge className="bg-blue-500 text-white border-none font-black text-[10px] px-3 py-1 mb-4 uppercase">Canal Seguro</Badge>
                            <h2 className="text-3xl font-sans font-black mb-4 uppercase tracking-tighter leading-none">Reporte de Riesgos</h2>
                            <p className="text-blue-100/70 text-sm font-medium leading-relaxed mb-6">
                                Este es un canal cifrado de punto a punto para reportar anomalías que pongan en riesgo la integridad de la comunidad o el proyecto.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Lock size={16} className="text-blue-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Identidad Protegida</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <ShieldAlert size={16} className="text-amber-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Alerta Directa a Ceres</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-[40px] p-8 border border-amber-100">
                        <h4 className="text-amber-800 font-sans font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertTriangle size={18} /> Tipos de Alerta
                        </h4>
                        <ul className="space-y-3">
                            {['Despojo de tierras', 'Daño ambiental crítico', 'Trabajo infantil forzado', 'Invasión de poligonales'].map((t, i) => (
                                <li key={i} className="text-xs font-bold text-amber-700/70 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Principal: Canal de Comunicación */}
                <div className="flex-1 space-y-8">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
                        <h3 className="text-2xl font-sans font-black text-slate-900 mb-8 uppercase tracking-tighter">Nueva Notificación</h3>

                        <form onSubmit={handleSend} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría del Riesgo</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setRiskType('social')}
                                        className={cn(
                                            "h-16 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all px-4 flex items-center justify-center gap-2",
                                            riskType === 'social' ? "bg-blue-50 border-blue-600 text-blue-600 shadow-md" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                        )}
                                    >
                                        Social / Tierras
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRiskType('ambiental')}
                                        className={cn(
                                            "h-16 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all px-4 flex items-center justify-center gap-2",
                                            riskType === 'ambiental' ? "bg-emerald-50 border-emerald-600 text-emerald-600 shadow-md" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                        )}
                                    >
                                        Ambiental
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción Detallada</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe la situación, ubicación y cualquier detalle relevante para la seguridad pública..."
                                    className="w-full min-h-[200px] bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm font-medium text-slate-700 focus:border-blue-600 focus:ring-0 transition-all outline-none"
                                />
                            </div>

                            <Button
                                disabled={isSending || !message.trim()}
                                type="submit"
                                className="h-20 w-full rounded-[28px] bg-[#1A365D] hover:bg-black text-white font-black text-lg gap-4 shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                            >
                                {isSending ? (
                                    <span className="animate-pulse">Encriptando y Enviando...</span>
                                ) : (
                                    <>
                                        Enviar Reporte Prioritario <Send size={20} />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="flex items-center gap-4 bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Reportes Recientes</h4>
                            <p className="text-xs text-emerald-700/70 font-medium">No hay reportes activos en las últimas 48 horas. Tu zona se encuentra estable.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
