import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Users, Leaf, Coffee, Building, PackageOpen, Star, Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';

interface RoleCard {
    role: UserRole;
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

const ROLES: RoleCard[] = [
    {
        role: 'AGRICULTOR',
        icon: Sprout,
        title: 'Agricultor',
        description: 'Diligencio información de mi finca y lotes.',
        color: 'text-[#2C5F2D]',
        bgColor: 'bg-[#2C5F2D]',
        borderColor: 'border-[#2C5F2D]',
    },
    {
        role: 'COMMUNITY_LEADER',
        icon: Users,
        title: 'Líder comunitario',
        description: 'Valido información en campo y coordenadas.',
        color: 'text-[#5a8f5b]',
        bgColor: 'bg-[#5a8f5b]',
        borderColor: 'border-[#5a8f5b]',
    },
    {
        role: 'ENV_VERIFIER',
        icon: Leaf,
        title: 'Verificador Ambiental',
        description: 'Reviso planes de manejo y mapas.',
        color: 'text-[#8b7355]',
        bgColor: 'bg-[#8b7355]',
        borderColor: 'border-[#8b7355]',
    },
    {
        role: 'TASTER',
        icon: Coffee,
        title: 'Catador',
        description: 'Diligencio datos de cata y calidad.',
        color: 'text-[#973333]',
        bgColor: 'bg-[#973333]',
        borderColor: 'border-[#973333]',
    },
    {
        role: 'CERES',
        icon: Building,
        title: 'Ceres',
        description: 'Gestiono almacenamiento y exportación.',
        color: 'text-[#4A5568]',
        bgColor: 'bg-[#4A5568]',
        borderColor: 'border-[#4A5568]',
    },
    {
        role: 'ROASTER',
        icon: PackageOpen,
        title: 'Tostador / Cliente',
        description: 'Consulto trazabilidad y cata.',
        color: 'text-[#D97706]',
        bgColor: 'bg-[#D97706]',
        borderColor: 'border-[#D97706]',
    },
    {
        role: 'FINAL_CLIENT',
        icon: Star,
        title: 'Cliente final',
        description: 'Valoro el café que consumo.',
        color: 'text-[#DC2626]',
        bgColor: 'bg-[#DC2626]',
        borderColor: 'border-[#DC2626]',
    },
];

type Step = 'role-select' | 'register-form';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [step, setStep] = useState<Step>('role-select');
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const selectedRoleData = ROLES.find((r) => r.role === selectedRole);

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        if (!selectedRole) return;
        setStep('register-form');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword) {
            setError('Por favor completa todos los campos.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await register(name, email, password, selectedRole!);
            // Redirige según rol
            if (selectedRole === 'AGRICULTOR') {
                navigate('/producer/dashboard', { replace: true });
            } else if (selectedRole === 'COMMUNITY_LEADER') {
                navigate('/lider/validaciones', { replace: true });
            } else if (selectedRole === 'ENV_VERIFIER') {
                navigate('/ambiental/revisiones', { replace: true });
            } else if (selectedRole === 'TASTER') {
                navigate('/catador/muestras', { replace: true });
            } else if (selectedRole === 'CERES') {
                navigate('/ceres/lotes', { replace: true });
            } else if (selectedRole === 'ROASTER') { // Changed from 'ROAST_CLIENT' to 'ROASTER' based on ROLES array
                navigate('/tostador/explorar', { replace: true });
            } else if (selectedRole === 'FINAL_CLIENT') {
                navigate('/trazabilidad/publica/084', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch {
            setError('No se pudo completar el registro. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full">
            <AnimatePresence mode="wait">
                {step === 'role-select' && (
                    <motion.div
                        key="role-select"
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-10">
                            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#973333] mb-4">
                                Paso 1 de 2
                            </span>
                            <h1 className="text-4xl font-serif text-[#2C5F2D] font-bold leading-tight">
                                ¿Cuál es tu rol en la<br />cadena de valor?
                            </h1>
                            <p className="mt-3 text-gray-500 text-sm">
                                Elige el que mejor describe tu actividad principal.
                            </p>
                        </div>

                        {/* Role Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                            {ROLES.map((roleCard) => {
                                const Icon = roleCard.icon;
                                const isSelected = selectedRole === roleCard.role;
                                return (
                                    <motion.button
                                        key={roleCard.role}
                                        onClick={() => handleRoleSelect(roleCard.role)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            'relative text-left p-6 rounded-2xl border-2 transition-all cursor-pointer bg-white',
                                            isSelected
                                                ? `${roleCard.borderColor} shadow-lg`
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                        )}
                                    >
                                        {/* Check badge */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    className={cn(
                                                        'absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center',
                                                        roleCard.bgColor
                                                    )}
                                                >
                                                    <Check className="h-3.5 w-3.5 text-white" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Icon */}
                                        <div
                                            className={cn(
                                                'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors',
                                                isSelected ? roleCard.bgColor : 'bg-gray-100'
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    'h-6 w-6 transition-colors',
                                                    isSelected ? 'text-white' : 'text-gray-400'
                                                )}
                                            />
                                        </div>

                                        {/* Text */}
                                        <h3
                                            className={cn(
                                                'font-bold text-base mb-1 transition-colors',
                                                isSelected ? roleCard.color : 'text-gray-800'
                                            )}
                                        >
                                            {roleCard.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {roleCard.description}
                                        </p>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Non-producer notice */}
                        <AnimatePresence>
                            {selectedRole && selectedRole !== 'AGRICULTOR' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700"
                                >
                                    🚧 El portal para <strong>{selectedRoleData?.title}</strong> está en construcción.
                                    Podrás completar el registro pero el acceso avanzado llegará pronto.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                onClick={handleContinue}
                                disabled={!selectedRole}
                                className={cn(
                                    'w-full sm:flex-1 h-12 rounded-xl font-bold gap-2 text-sm transition-all',
                                    selectedRole
                                        ? 'bg-[#2C5F2D] hover:bg-[#234d24] text-white'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                )}
                            >
                                Continuar con{' '}
                                {selectedRoleData ? selectedRoleData.title : 'selección'}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/auth/login" className="text-[#2C5F2D] font-semibold hover:underline">
                                Iniciar sesión
                            </Link>
                        </p>
                    </motion.div>
                )}

                {step === 'register-form' && (
                    <motion.div
                        key="register-form"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-md mx-auto"
                    >
                        {/* Header */}
                        <div className="mb-8">
                            <button
                                onClick={() => setStep('role-select')}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#2C5F2D] transition-colors mb-6 cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Cambiar rol
                            </button>

                            {/* Role badge */}
                            {selectedRoleData && (
                                <div
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4',
                                        `${selectedRoleData.bgColor}/10`
                                    )}
                                >
                                    <selectedRoleData.icon className={cn('h-4 w-4', selectedRoleData.color)} />
                                    <span className={cn('text-sm font-bold', selectedRoleData.color)}>
                                        {selectedRoleData.title}
                                    </span>
                                </div>
                            )}

                            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#973333] mb-2 block">
                                Paso 2 de 2
                            </span>
                            <h1 className="text-3xl font-serif text-[#2C5F2D] font-bold">
                                Crea tu cuenta
                            </h1>
                            <p className="text-gray-500 text-sm mt-2">
                                Solo necesitamos unos datos básicos para comenzar.
                            </p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-5 bg-white p-8 rounded-2xl shadow-xl border border-black/5">
                            <div className="space-y-1.5">
                                <label htmlFor="reg-name" className="text-sm font-semibold text-gray-700">
                                    Nombre completo
                                </label>
                                <Input
                                    id="reg-name"
                                    type="text"
                                    placeholder="María González"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="reg-email" className="text-sm font-semibold text-gray-700">
                                    Correo electrónico
                                </label>
                                <Input
                                    id="reg-email"
                                    type="email"
                                    placeholder="tu@correo.co"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="reg-password" className="text-sm font-semibold text-gray-700">
                                    Contraseña
                                </label>
                                <Input
                                    id="reg-password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="reg-confirm" className="text-sm font-semibold text-gray-700">
                                    Confirmar contraseña
                                </label>
                                <Input
                                    id="reg-confirm"
                                    type="password"
                                    placeholder="Repite tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-[#973333] bg-[#973333]/5 px-4 py-2 rounded-lg"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 rounded-xl font-bold gap-2 bg-[#2C5F2D] hover:bg-[#234d24] text-white mt-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        Crear cuenta
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-gray-400 mt-2">
                                Al registrarte, aceptas los Términos de Servicio y la Política de Privacidad de TraceCafé.
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
