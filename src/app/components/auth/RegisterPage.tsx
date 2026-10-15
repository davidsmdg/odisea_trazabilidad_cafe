import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Users, Leaf, Coffee, Building, PackageOpen, Check, ArrowRight, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { validarCodigoInvitacion, consumirCodigoInvitacion } from '../../../services/invitacionesService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';
import { Eyebrow } from '../ui/Eyebrow';
import { registrarEvento } from '../../../services/telemetryService';

interface RoleCard {
    role: UserRole;
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    disabled?: boolean;
}

const ROLES: RoleCard[] = [
    {
        role: 'AGRICULTOR',
        icon: Sprout,
        title: 'Agricultor',
        description: 'Diligencio información de mi finca y lotes.',
        color: 'text-[#5f705f]',
        bgColor: 'bg-[#5f705f]',
        borderColor: 'border-[#5f705f]',
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
        role: 'TASTER',
        icon: Coffee,
        title: 'Catador',
        description: 'Diligencio datos de cata y calidad.',
        color: 'text-[#a35c5c]',
        bgColor: 'bg-[#a35c5c]',
        borderColor: 'border-[#a35c5c]',
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
        role: 'CERES',
        icon: Building,
        title: 'Odisea Trace',
        description: 'Gestiono almacenamiento, exportación y auditoría ambiental.',
        color: 'text-[#4A5568]',
        bgColor: 'bg-[#4A5568]',
        borderColor: 'border-[#4A5568]',
        disabled: true,
    },
    {
        role: 'ENV_VERIFIER',
        icon: Leaf,
        title: 'Verificador ambiental',
        description: 'Reviso cumplimiento EUDR y linderos.',
        color: 'text-[#3f7d3f]',
        bgColor: 'bg-[#3f7d3f]',
        borderColor: 'border-[#3f7d3f]',
        disabled: true,
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
    const [contacto, setContacto] = useState('');
    const [codigoInvitacion, setCodigoInvitacion] = useState('');
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
        if (!name.trim() || !contacto.trim() || !password || !confirmPassword || !codigoInvitacion.trim()) {
            setError('Por favor completa todos los campos, incluyendo el código de invitación.');
            return;
        }

        const rawContacto = contacto.trim();
        const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawContacto);
        const esCelular = rawContacto.replace(/\D/g, '').length >= 10;

        if (!esEmail && !esCelular) {
            setError('Ingresa un correo electrónico válido o un número de celular de al menos 10 dígitos.');
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
            // Validar código de invitación
            const resCodigo = await validarCodigoInvitacion(codigoInvitacion, selectedRole!);
            if (!resCodigo.valido) {
                setError(resCodigo.mensaje || 'El código de invitación no es válido.');
                setIsLoading(false);
                return;
            }

            await register(name.trim(), rawContacto, password, selectedRole!);
            await consumirCodigoInvitacion(codigoInvitacion);
            registrarEvento('codigo_canjeado', {
                nombre: name.trim(),
                contacto: rawContacto,
                rol: selectedRole!,
                detalles: { codigo: codigoInvitacion.trim().toUpperCase() }
            });

            // Redirige según rol
            if (selectedRole === 'AGRICULTOR') {
                // Productor nuevo: arranca con la finca vacía y ve el onboarding guiado.
                [
                    'odisea_fincas',
                    'odisea_onboarding_productor',
                    'odisea_finanzas_movimientos',
                    'odisea_finanzas_periodos',
                    'odisea_finanzas_categorias_custom',
                    'lotes_produccion',
                    'perfil_productor',
                ].forEach((k) => localStorage.removeItem(k));
                localStorage.setItem('odisea_fincas', '[]');
                navigate('/producer/inicio', { replace: true });
            } else if (selectedRole === 'COMMUNITY_LEADER') {
                navigate('/lider/validaciones', { replace: true });
            } else if (selectedRole === 'ENV_VERIFIER') {
                navigate('/odisea/ambiental/revisiones', { replace: true });
            } else if (selectedRole === 'TASTER') {
                navigate('/catador/muestras', { replace: true });
            } else if (selectedRole === 'CERES') {
                navigate('/odisea/lotes', { replace: true });
            } else if (selectedRole === 'ROASTER') { // Changed from 'ROAST_CLIENT' to 'ROASTER' based on ROLES array
                navigate('/tostador/explorar', { replace: true });
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
        <div className={cn("mx-auto w-full px-6 sm:px-0 transition-all duration-500 flex flex-col flex-1 h-full sm:h-auto", step === 'role-select' ? "max-w-6xl" : "max-w-md")}>
            <AnimatePresence mode="wait">
                {step === 'role-select' && (
                    <motion.div
                        key="role-select"
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-[calc(100vh-85px)] sm:h-auto"
                    >
                        {/* Scrollable middle container (Header + Cards) */}
                        <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-6 sm:overflow-visible">
                            {/* Header con estilo Landing */}
                            <div className="text-left relative space-y-3">
                                <div>
                                    <Link
                                        to="/"
                                        className="inline-flex items-center text-sm font-bold text-[#2D3E33] hover:text-[#BD4A1F] group transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                        Volver al Inicio
                                    </Link>
                                </div>

                                <div>
                                    <Eyebrow theme="dark">Paso 1 de 2 · Tu actividad</Eyebrow>
                                    <h1 className="text-3xl sm:text-4xl font-heading text-[#2D3E33] uppercase tracking-tight leading-tight">
                                        ¿Cuál es tu rol en la cadena de café?
                                    </h1>
                                    <p className="mt-1.5 text-[#4A2E3D]/80 text-base font-medium">
                                        Selecciona la actividad principal que desempeñas.
                                    </p>
                                </div>
                            </div>

                            {/* Role Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                                {ROLES.map((roleCard) => {
                                    const Icon = roleCard.icon;
                                    const isSelected = selectedRole === roleCard.role;
                                    const isDisabled = !!roleCard.disabled;

                                    return (
                                        <div key={roleCard.role} className="flex flex-col gap-2">
                                            <motion.button
                                                type="button"
                                                disabled={isDisabled}
                                                onClick={() => !isDisabled && handleRoleSelect(roleCard.role)}
                                                whileHover={isDisabled ? {} : { scale: 1.02 }}
                                                whileTap={isDisabled ? {} : { scale: 0.98 }}
                                                className={cn(
                                                    'relative w-full flex-1 flex flex-col text-left p-6 rounded-2xl border-2 transition-all bg-white',
                                                    isDisabled
                                                        ? 'opacity-60 bg-gray-50 border-gray-200 cursor-not-allowed filter grayscale'
                                                        : isSelected
                                                        ? `${roleCard.borderColor} shadow-lg cursor-pointer`
                                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer'
                                                )}
                                            >
                                                {/* Badge si está deshabilitado */}
                                                {isDisabled && (
                                                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                                                        Próximamente
                                                    </span>
                                                )}

                                                {/* Check badge */}
                                                <AnimatePresence>
                                                    {isSelected && !isDisabled && (
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
                                                        isDisabled
                                                            ? 'bg-gray-200 text-gray-400'
                                                            : isSelected
                                                            ? roleCard.bgColor
                                                            : 'bg-gray-100'
                                                    )}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            'h-6 w-6 transition-colors',
                                                            isDisabled
                                                                ? 'text-gray-400'
                                                                : isSelected
                                                                ? 'text-white'
                                                                : 'text-gray-400'
                                                        )}
                                                    />
                                                </div>

                                                {/* Text */}
                                                <h3
                                                    className={cn(
                                                        'font-bold text-base mb-1 transition-colors',
                                                        isDisabled
                                                            ? 'text-gray-500'
                                                            : isSelected
                                                            ? roleCard.color
                                                            : 'text-gray-800'
                                                    )}
                                                >
                                                    {roleCard.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 leading-relaxed">
                                                    {roleCard.description}
                                                </p>
                                            </motion.button>

                                            {/* Warning notice directly below this card if selected and not Agricultor */}
                                            <AnimatePresence>
                                                {isSelected && !isDisabled && roleCard.role !== 'AGRICULTOR' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                                                            🚧 El portal para <strong>{roleCard.title}</strong> está en construcción.
                                                            Podrás completar el registro pero el acceso avanzado llegará pronto.
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Fixed actions at the bottom (never scrolls) */}
                        <div className="shrink-0 -mx-6 px-6 pt-5 pb-8 bg-[#e8efe8] border-t border-[#ccdccd] rounded-t-[28px] mt-auto shadow-[0_-8px_24px_rgba(95,112,95,0.08)]">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    onClick={handleContinue}
                                    disabled={!selectedRole}
                                    className={cn(
                                        'w-full sm:flex-1 h-12 rounded-xl font-bold gap-2 text-sm transition-all cursor-pointer',
                                        selectedRole
                                            ? 'bg-[#5f705f] hover:bg-[#234d24] text-white shadow-md'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    )}
                                >
                                    Continuar con{' '}
                                    {selectedRoleData ? selectedRoleData.title : 'selección'}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <p className="mt-4 text-center text-sm text-[#415341] font-semibold">
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/auth/login" className="text-[#2a562a] font-bold hover:underline">
                                    Iniciar sesión
                                </Link>
                            </p>
                        </div>
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
                        <div className="mb-6">
                            <button
                                onClick={() => setStep('role-select')}
                                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#5f705f] transition-colors mb-4 cursor-pointer font-medium"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Cambiar rol
                            </button>

                            <div className="flex items-center justify-between gap-3 mb-3">
                                {selectedRoleData && (
                                    <div
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-full px-4 py-1.5',
                                            `${selectedRoleData.bgColor}/15`
                                        )}
                                    >
                                        <selectedRoleData.icon className={cn('h-5 w-5', selectedRoleData.color)} />
                                        <span className={cn('text-xs font-extrabold uppercase tracking-wider', selectedRoleData.color)}>
                                            {selectedRoleData.title}
                                        </span>
                                    </div>
                                )}
                                <Eyebrow theme="dark">Paso 2 de 2</Eyebrow>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-heading text-[#2D3E33] uppercase tracking-tight">
                                Crea tu cuenta
                            </h1>
                            <p className="text-[#4A2E3D]/80 text-base font-medium mt-1.5">
                                Ingresa tus datos básicos y tu código de invitación para comenzar.
                            </p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-5 bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl border border-[#2D3E33]/10">
                            <div className="space-y-2">
                                <label htmlFor="reg-name" className="block text-sm sm:text-base font-extrabold text-[#2D3E33]">
                                    Tu nombre completo
                                </label>
                                <Input
                                    id="reg-name"
                                    type="text"
                                    placeholder="Ej: María González"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    className="h-14 rounded-2xl text-base font-bold bg-[#F6F2EC]/40 border-2 border-[#DAD6CF] text-[#2D3E33] px-4 shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="reg-contacto" className="block text-sm sm:text-base font-extrabold text-[#2D3E33]">
                                    Número de celular o correo
                                </label>
                                <Input
                                    id="reg-contacto"
                                    type="text"
                                    placeholder="Ej: 301 530 3014 ó tu@correo.com"
                                    value={contacto}
                                    onChange={(e) => setContacto(e.target.value)}
                                    autoComplete="username"
                                    className="h-14 rounded-2xl text-base font-bold bg-[#F6F2EC]/40 border-2 border-[#DAD6CF] text-[#2D3E33] px-4 shadow-sm"
                                />
                                <p className="text-xs text-[#4A2E3D]/70 font-semibold">
                                    Si eres productor, te recomendamos usar tu celular para entrar más fácil.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="reg-codigo" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                                    <span>Código de invitación</span>
                                    <span className="text-xs font-normal text-gray-400">Requerido</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        id="reg-codigo"
                                        type="text"
                                        placeholder="Ej: CAFE-PILOTO o ODISEA-VIP"
                                        value={codigoInvitacion}
                                        onChange={(e) => setCodigoInvitacion(e.target.value.toUpperCase())}
                                        className="h-11 rounded-xl font-mono uppercase tracking-wider pl-10"
                                    />
                                    <KeyRound className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <p className="text-xs text-gray-400">
                                    Ingresa el código proporcionado por el administrador de Odisea.
                                </p>
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
                                    className="text-sm text-[#a35c5c] bg-[#a35c5c]/5 px-4 py-2 rounded-lg"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 rounded-xl font-bold gap-2 bg-[#5f705f] hover:bg-[#234d24] text-white mt-2"
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
                                Al registrarte, aceptas los Términos de Servicio y la Política de Privacidad de Odisea Trace.
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
