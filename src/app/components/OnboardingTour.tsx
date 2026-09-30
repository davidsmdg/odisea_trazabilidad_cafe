import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    Smartphone,
    Laptop,
    HelpCircle,
    Info,
    TrendingUp,
    MapPin,
    ShieldCheck,
    Microscope,
    WifiOff,
    Check,
    Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface Step {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    imageHint?: string;
}

interface TourContent {
    roleName: string;
    subtitle: string;
    steps: Step[];
}

const TOUR_DATA: Record<string, TourContent> = {
    AGRICULTOR: {
        roleName: 'Productor',
        subtitle: 'Lleva tu café a compradores internacionales y certifica tu origen.',
        steps: [
            {
                title: 'Tu Inventario Digital',
                description: 'Aquí registras tus sacos cosechados. Se guardan en una base global para que los tostadores vean su origen y te contacten.',
                icon: ShieldCheck,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            },
            {
                title: 'Simulador de Precios',
                description: 'Usa el simulador en tu panel para ver cuánto sobreprecio ganas por georreferenciar tu lote y tener alta calidad.',
                icon: TrendingUp,
                color: 'text-amber-600 bg-amber-50 border-amber-100',
            },
            {
                title: 'Sello Verde (Cero Deforestación)',
                description: 'Mapeamos los linderos de tu finca con satélites para certificar que tu café cumple con la directiva europea EUDR sin dañar bosques.',
                icon: MapPin,
                color: 'text-blue-600 bg-blue-50 border-blue-100',
            }
        ]
    },
    COMMUNITY_LEADER: {
        roleName: 'Líder JAC Veredal',
        subtitle: 'Ayuda a tus vecinos a certificar sus predios para exportar café.',
        steps: [
            {
                title: 'Auditoría en Finca',
                description: 'Visita los predios de los caficultores de tu vereda, verifica que no deforesten y concédeles el aval digital de la JAC.',
                icon: ShieldCheck,
                color: 'text-blue-600 bg-blue-50 border-blue-100',
            },
            {
                title: 'Modo Sin Internet (Offline)',
                description: '¿No hay señal en la montaña? No te preocupes. Puedes guardar las auditorías y coordenadas GPS sin internet.',
                icon: WifiOff,
                color: 'text-amber-600 bg-amber-50 border-amber-100',
            },
            {
                title: 'Sincronización Fácil',
                description: 'Al regresar al pueblo o a un lugar con señal WiFi, toca el botón de "Sincronizar" y sube todos tus avales JAC al instante.',
                icon: CheckCircle2,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            }
        ]
    },
    TASTER: {
        roleName: 'Catador Q-Grader',
        subtitle: 'Calibra y evalúa la calidad sensorial de cada lote de café.',
        steps: [
            {
                title: 'Bandeja de Calidad',
                description: 'Consulta los lotes asignados. Realiza pruebas físicas rápidas de humedad, actividad de agua y pasillas de alistamiento.',
                icon: Microscope,
                color: 'text-amber-600 bg-amber-50 border-amber-100',
            },
            {
                title: 'Atributos Sensoriales SCA',
                description: 'Calibra acidez, cuerpo, dulzura y balance usando controles táctiles. El radar de sabor se dibuja en tiempo real.',
                icon: Sparkles,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            },
            {
                title: 'Notas y Retroalimentación',
                description: 'Elige los descriptores de sabor del café (chocolate, cítricos, frutos rojos) y lee las reseñas de los clientes finales.',
                icon: Info,
                color: 'text-blue-600 bg-blue-50 border-blue-100',
            }
        ]
    },
    ROASTER: {
        roleName: 'Tostador / Cliente B2B',
        subtitle: 'Adquiere micro-lotes exclusivos con trazabilidad verificada y debida diligencia.',
        steps: [
            {
                title: 'Explorador Inteligente',
                description: 'Filtra lotes por perfil de cata, notas organolépticas, productor veredal o estado de cumplimiento EUDR.',
                icon: Microscope,
                color: 'text-blue-600 bg-blue-50 border-blue-100',
            },
            {
                title: 'Trazabilidad Satelital y Social',
                description: 'Mira las coordenadas GPS de la finca, fotos del cultivo, el aval del Líder JAC y reportes de cero deforestación.',
                icon: MapPin,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            },
            {
                title: 'Reservas y Documentación',
                description: 'Reserva contratos directamente con el productor y descarga los archivos DDS requeridos en aduana europea.',
                icon: ShieldCheck,
                color: 'text-amber-600 bg-amber-50 border-amber-100',
            }
        ]
    },
    CERES: {
        roleName: 'Administrador Odisea',
        subtitle: 'Control total de la cadena de valor, auditorías y cumplimiento global.',
        steps: [
            {
                title: 'Expediente Global de Cumplimiento',
                description: 'Monitorea en vivo el avance de los linderos georreferenciados, auditorías JAC y alarmas de alerta satelital en origen.',
                icon: MapPin,
                color: 'text-blue-600 bg-blue-50 border-blue-100',
            },
            {
                title: 'Gestión de Calidad y Recatas',
                description: 'Supervisa el flujo de los catadores, aprueba lotes para exportación y consolida los comentarios de los tostadores.',
                icon: Microscope,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            },
            {
                title: 'Configuraciones de Precios',
                description: 'Ajusta dinámicamente los sobreprecios de cafés Regionales, Procesos y Exóticos para simular beneficios al productor.',
                icon: TrendingUp,
                color: 'text-amber-600 bg-amber-50 border-amber-100',
            }
        ]
    },
    ENV_VERIFIER: {
        roleName: 'Auditor Ambiental',
        subtitle: 'Audita coordenadas satelitales y valida riesgo de deforestación.',
        steps: [
            {
                title: 'Bandeja de Predios',
                description: 'Revisa las coordenadas y mapas de linderos cargados por productores y líderes de campo.',
                icon: MapPin,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            },
            {
                title: 'Análisis Satelital Multitemporal',
                description: 'Cruza linderos con imágenes de satélite para emitir alertas o certificar libre de deforestación EUDR.',
                icon: Microscope,
                color: 'text-blue-600 bg-blue-50 border-blue-100',
            },
            {
                title: 'Certificado de Debida Diligencia',
                description: 'Marca predios como verificados para habilitar su exportación automática al mercado internacional.',
                icon: ShieldCheck,
                color: 'text-amber-600 bg-amber-50 border-amber-100',
            }
        ]
    }
};

interface OnboardingTourProps {
    role: string;
    forceShow?: boolean;
    onClose?: () => void;
}

export function OnboardingTour({ role, forceShow = false, onClose }: OnboardingTourProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [deviceType, setDeviceType] = useState<'mobile' | 'web'>('web');

    const tour = TOUR_DATA[role] || TOUR_DATA.AGRICULTOR;
    const steps = tour.steps;

    useEffect(() => {
        // Detect screen width to set default device simulation styling
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setDeviceType('mobile');
            } else {
                setDeviceType('web');
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Check if user has already completed tour
        const completed = localStorage.getItem(`onboarding_completed_${role}`);
        if (!completed || forceShow) {
            setIsOpen(true);
            setCurrentStep(0);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [role, forceShow]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        localStorage.setItem(`onboarding_completed_${role}`, 'true');
        setIsOpen(false);
        if (onClose) onClose();
        toast.success('¡Tutorial completado!', {
            description: 'Ya puedes empezar a usar tu panel de Odisea Trace.',
            icon: <CheckCircle2 className="text-emerald-500" />
        });
    };

    if (!isOpen) return null;

    const ActiveStepIcon = steps[currentStep].icon;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop with Blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    onClick={handleComplete}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
                />

                {/* Main Tour Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: deviceType === 'mobile' ? 100 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: deviceType === 'mobile' ? 100 : 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                    className={cn(
                        "bg-white shadow-2xl relative z-10 flex flex-col justify-between overflow-hidden",
                        deviceType === 'mobile'
                            ? "w-full max-w-[380px] h-[520px] rounded-[36px] border-4 border-slate-900"
                            : "w-full max-w-[580px] h-[500px] rounded-[48px] border border-slate-100 p-10"
                    )}
                >
                    {/* Switch Simulation Header (Web vs App Celular simulator for training non-digitals) */}
                    <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-150 flex items-center justify-between shrink-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Sparkles size={10} className="text-amber-500 animate-pulse" /> Modo de Guía Odisea Trace
                        </span>
                        
                        <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-xl">
                            <button
                                onClick={() => setDeviceType('web')}
                                className={cn(
                                    "p-1.5 rounded-lg border-none cursor-pointer flex items-center gap-1 transition-all",
                                    deviceType === 'web' ? "bg-white text-slate-950 shadow-xs" : "bg-transparent text-slate-400"
                                )}
                                title="Vista Computador"
                            >
                                <Laptop size={12} />
                                <span className="text-[8px] font-black uppercase">Web</span>
                            </button>
                            <button
                                onClick={() => setDeviceType('mobile')}
                                className={cn(
                                    "p-1.5 rounded-lg border-none cursor-pointer flex items-center gap-1 transition-all",
                                    deviceType === 'mobile' ? "bg-slate-900 text-white shadow-xs" : "bg-transparent text-slate-400"
                                )}
                                title="Vista Celular"
                            >
                                <Smartphone size={12} />
                                <span className="text-[8px] font-black uppercase">Celular</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 p-6 md:p-0 flex flex-col justify-center space-y-3">
                        {/* Welcome header of the role */}
                        <div className="space-y-1.5">
                            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-sans font-black text-[9px] px-2.5 py-1 uppercase tracking-wider">
                                Rol: {tour.roleName}
                            </Badge>
                            <h2 className="text-2xl font-sans font-black text-slate-900 tracking-tight leading-none">
                                ¡Te damos la bienvenida a Odisea Trace!
                            </h2>
                            <p className="text-xs text-slate-450 font-bold leading-normal">
                                {tour.subtitle}
                            </p>
                        </div>

                        {/* Interactive spotlight step widget */}
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] flex gap-5 items-start">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border", steps[currentStep].color)}>
                                <ActiveStepIcon size={26} />
                            </div>
                            <div className="space-y-1 text-left">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Paso {currentStep + 1} de {steps.length}</span>
                                <h4 className="text-base font-black text-slate-800 leading-none pb-0.5">{steps[currentStep].title}</h4>
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    {steps[currentStep].description}
                                </p>
                            </div>
                        </div>

                        {/* Easy Visual Step Dots */}
                        <div className="flex justify-center gap-2">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-300",
                                        idx === currentStep ? "w-8 bg-slate-900" : "w-2 bg-slate-200"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className={cn(
                        "border-t border-slate-100 flex items-center justify-between shrink-0 bg-white",
                        deviceType === 'mobile' ? "px-6 pt-3 pb-8" : "p-0 pt-6"
                    )}>
                        <button
                            onClick={handleComplete}
                            className="text-xs font-black text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer uppercase tracking-wider"
                        >
                            Saltar Guía
                        </button>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <Button
                                    onClick={handleBack}
                                    variant="outline"
                                    className="h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 text-slate-650 border-slate-200"
                                >
                                    <ArrowLeft size={12} /> Atrás
                                </Button>
                            )}

                            <Button
                                onClick={handleNext}
                                className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest gap-2 border-none cursor-pointer shadow-md"
                            >
                                {currentStep < steps.length - 1 ? (
                                    <>Siguiente <ArrowRight size={12} /></>
                                ) : (
                                    <>Empezar <Check size={12} /></>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

// Reusable Tour Trigger Button component that can be added to any header
export function OnboardingTourTrigger({ role, label = "Guía Rápida" }: { role: string; label?: string }) {
    const [show, setShow] = useState(false);

    return (
        <>
            <Button
                onClick={() => setShow(true)}
                className="bg-[#5f705f]/15 hover:bg-[#5f705f]/25 text-[#5f705f] hover:text-[#5f705f] font-sans font-black text-[10px] uppercase tracking-widest gap-2 rounded-xl h-10 px-4 border-none cursor-pointer"
            >
                <HelpCircle size={14} />
                <span>{label}</span>
            </Button>

            {show && (
                <OnboardingTour role={role} forceShow={true} onClose={() => setShow(false)} />
            )}
        </>
    );
}
