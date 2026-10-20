import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    Sprout,
    Users,
    Leaf,
    Coffee,
    Building,
    PackageOpen,
    Check,
    ArrowRight,
    ArrowLeft,
    Loader2,
    KeyRound,
    Eye,
    EyeOff,
    CheckCircle2,
} from 'lucide-react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { validarCodigoInvitacion, consumirCodigoInvitacion } from '../../../services/invitacionesService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';
import { Eyebrow } from '../ui/Eyebrow';
import { registrarEvento } from '../../../services/telemetryService';
import {
    analizarCelularOCorreo,
    AsistenteCelular,
    MensajeErrorCampo,
    vibrarError,
    enfocarCampoConError,
} from '../../utils/usabilidad';

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

interface ErroresRegistro {
    name?: string;
    contacto?: string;
    codigoInvitacion?: string;
    password?: string;
    confirmPassword?: string;
}

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [step, setStep] = useState<Step>('role-select');
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [errorRol, setErrorRol] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [contacto, setContacto] = useState('');
    const [codigoInvitacion, setCodigoInvitacion] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [erroresCampo, setErroresCampo] = useState<ErroresRegistro>({});
    const [shakeKey, setShakeKey] = useState(0);

    const selectedRoleData = ROLES.find((r) => r.role === selectedRole);
    const estadoContacto = analizarCelularOCorreo(contacto);

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setErrorRol(false);
    };

    const handleContinue = () => {
        if (!selectedRole) {
            setErrorRol(true);
            setShakeKey((k) => k + 1);
            vibrarError();
            return;
        }
        setStep('register-form');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const nuevosErrores: ErroresRegistro = {};

        if (!name.trim()) {
            nuevosErrores.name = 'Escribe aquí tu nombre y apellido.';
        }

        if (!contacto.trim()) {
            nuevosErrores.contacto = 'Escribe tu número de celular (10 números) o correo.';
        } else if (!estadoContacto.valido) {
            nuevosErrores.contacto =
                estadoContacto.modo === 'celular'
                    ? estadoContacto.mensaje
                    : 'Escribe un correo electrónico completo (ej: nombre@gmail.com).';
        }

        if (!codigoInvitacion.trim()) {
            nuevosErrores.codigoInvitacion = 'Escribe el código de invitación que te dieron.';
        }

        if (!password) {
            nuevosErrores.password = 'Crea una contraseña de al menos 6 letras o números.';
        } else if (password.length < 6) {
            nuevosErrores.password = `Te faltan ${6 - password.length} caracteres (mínimo 6).`;
        }

        if (!confirmPassword) {
            nuevosErrores.confirmPassword = 'Vuelve a escribir aquí la misma contraseña.';
        } else if (password !== confirmPassword) {
            nuevosErrores.confirmPassword = 'Las dos contraseñas no son iguales. Usa el botón "VER" para compararlas.';
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresCampo(nuevosErrores);
            setShakeKey((k) => k + 1);
            vibrarError();
            if (nuevosErrores.name) enfocarCampoConError('reg-name');
            else if (nuevosErrores.contacto) enfocarCampoConError('reg-contacto');
            else if (nuevosErrores.codigoInvitacion) enfocarCampoConError('reg-codigo');
            else if (nuevosErrores.password) enfocarCampoConError('reg-password');
            else if (nuevosErrores.confirmPassword) enfocarCampoConError('reg-confirm');
            return;
        }

        setErroresCampo({});
        setError('');
        setIsLoading(true);

        const rawContacto = contacto.trim();

        try {
            const resCodigo = await validarCodigoInvitacion(codigoInvitacion, selectedRole!);
            if (!resCodigo.valido) {
                setErroresCampo({
                    codigoInvitacion: resCodigo.mensaje || 'Este código de invitación no es válido o ya venció.',
                });
                setShakeKey((k) => k + 1);
                vibrarError();
                enfocarCampoConError('reg-codigo');
                setIsLoading(false);
                return;
            }

            await register(name.trim(), rawContacto, password, selectedRole!);
            await consumirCodigoInvitacion(codigoInvitacion, {
                nombre: name.trim(),
                contacto: rawContacto,
                rol: selectedRole!,
            });
            registrarEvento('codigo_canjeado', {
                nombre: name.trim(),
                contacto: rawContacto,
                rol: selectedRole!,
                detalles: { codigo: codigoInvitacion.trim().toUpperCase() },
            });

            if (selectedRole === 'AGRICULTOR') {
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
            } else if (selectedRole === 'ROASTER') {
                navigate('/tostador/explorar', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (err: any) {
            vibrarError();
            setShakeKey((k) => k + 1);
            setError(err?.message || 'No se pudo completar el registro. Verifica tus datos e intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('mx-auto w-full px-6 sm:px-0 transition-all duration-500 flex flex-col flex-1 h-full sm:h-auto', step === 'role-select' ? 'max-w-6xl' : 'max-w-md')}>
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
                        <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-6 sm:overflow-visible">
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
                                        Toca uno de los cuadros de abajo (si tienes finca cafetera, toca <strong>Agricultor</strong>).
                                    </p>
                                </div>
                            </div>

                            {errorRol && (
                                <div key={shakeKey} className="odisea-shake rounded-2xl bg-red-50 border-2 border-red-300 p-4 text-red-800 font-extrabold text-sm flex items-center gap-2.5">
                                    <span className="text-lg">👆</span>
                                    <span>Primero toca una de las opciones de abajo (por ejemplo: <strong>Agricultor</strong>) para poder continuar.</span>
                                </div>
                            )}

                            {/* Role Cards */}
                            <div
                                key={`roles-${shakeKey}-${errorRol}`}
                                className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2', errorRol && 'odisea-shake')}
                            >
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
                                                        ? `${roleCard.borderColor} shadow-lg cursor-pointer ring-2 ring-[#5f705f]/20`
                                                        : errorRol
                                                        ? 'border-red-300 bg-red-50/30 cursor-pointer'
                                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer'
                                                )}
                                            >
                                                {isDisabled && (
                                                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                                                        Próximamente
                                                    </span>
                                                )}

                                                <AnimatePresence>
                                                    {isSelected && !isDisabled && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0, opacity: 0 }}
                                                            className={cn(
                                                                'absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center shadow',
                                                                roleCard.bgColor
                                                            )}
                                                        >
                                                            <Check className="h-4 w-4 text-white stroke-[3]" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

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

                                                <h3
                                                    className={cn(
                                                        'font-extrabold text-lg mb-1 transition-colors',
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

                        <div className="shrink-0 -mx-6 px-6 pt-5 pb-8 bg-[#e8efe8] border-t border-[#ccdccd] rounded-t-[28px] mt-auto shadow-[0_-8px_24px_rgba(95,112,95,0.08)]">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    type="button"
                                    onClick={handleContinue}
                                    className={cn(
                                        'w-full sm:flex-1 h-14 rounded-2xl font-extrabold gap-2 text-base uppercase tracking-wide transition-all cursor-pointer',
                                        selectedRole
                                            ? 'bg-[#BD4A1F] hover:bg-[#a53e19] text-white shadow-lg shadow-[#BD4A1F]/25'
                                            : 'bg-[#5f705f] text-white opacity-90'
                                    )}
                                >
                                    {selectedRoleData ? `Continuar como ${selectedRoleData.title}` : 'Toca tu rol arriba y continúa'}
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>

                            <p className="mt-4 text-center text-sm text-[#415341] font-semibold">
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/auth/login" className="text-[#BD4A1F] font-extrabold hover:underline">
                                    Iniciar sesión →
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
                        className="max-w-md mx-auto pb-8"
                    >
                        <div className="mb-6">
                            <button
                                onClick={() => setStep('role-select')}
                                className="inline-flex items-center gap-2 text-sm text-[#2D3E33] hover:text-[#BD4A1F] transition-colors mb-4 cursor-pointer font-extrabold"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Cambiar actividad / rol
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
                                Llena estos 5 datos para registrar tu cuenta.
                            </p>
                        </div>

                        <form onSubmit={handleRegister} noValidate className="space-y-5 bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl border border-[#2D3E33]/10">
                            {/* 1. Nombre */}
                            <div
                                key={`name-${shakeKey}-${!!erroresCampo.name}`}
                                className={cn('space-y-1.5', erroresCampo.name && 'odisea-shake')}
                            >
                                <label htmlFor="reg-name" className="block text-sm sm:text-base font-extrabold text-[#2D3E33]">
                                    1. Tu nombre y apellido
                                </label>
                                <Input
                                    id="reg-name"
                                    type="text"
                                    placeholder="Ej: María González"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (erroresCampo.name) setErroresCampo((p) => ({ ...p, name: undefined }));
                                    }}
                                    autoComplete="name"
                                    className={cn(
                                        'h-14 rounded-2xl text-base font-bold bg-[#F6F2EC]/40 border-2 border-[#DAD6CF] text-[#2D3E33] px-4 shadow-sm',
                                        erroresCampo.name && 'odisea-field-error',
                                        !erroresCampo.name && name.trim().length >= 3 && 'odisea-field-ok'
                                    )}
                                />
                                <MensajeErrorCampo mensaje={erroresCampo.name} />
                            </div>

                            {/* 2. Celular o Correo */}
                            <div
                                key={`cont-${shakeKey}-${!!erroresCampo.contacto}`}
                                className={cn('space-y-1.5', erroresCampo.contacto && 'odisea-shake')}
                            >
                                <label htmlFor="reg-contacto" className="block text-sm sm:text-base font-extrabold text-[#2D3E33]">
                                    2. Tu número de celular (10 números) o correo
                                </label>
                                <Input
                                    id="reg-contacto"
                                    type="text"
                                    placeholder="Ej: 301 530 3014"
                                    value={contacto}
                                    onChange={(e) => {
                                        setContacto(e.target.value);
                                        if (erroresCampo.contacto) setErroresCampo((p) => ({ ...p, contacto: undefined }));
                                    }}
                                    autoComplete="username"
                                    className={cn(
                                        'h-14 rounded-2xl text-base font-bold bg-[#F6F2EC]/40 border-2 border-[#DAD6CF] text-[#2D3E33] px-4 shadow-sm',
                                        erroresCampo.contacto && 'odisea-field-error',
                                        !erroresCampo.contacto && estadoContacto.valido && 'odisea-field-ok'
                                    )}
                                />
                                <AsistenteCelular valor={contacto} />
                                <MensajeErrorCampo mensaje={erroresCampo.contacto} />
                            </div>

                            {/* 3. Código de invitación */}
                            <div
                                key={`cod-${shakeKey}-${!!erroresCampo.codigoInvitacion}`}
                                className={cn('space-y-1.5', erroresCampo.codigoInvitacion && 'odisea-shake')}
                            >
                                <label htmlFor="reg-codigo" className="text-sm sm:text-base font-extrabold text-[#2D3E33] flex items-center justify-between">
                                    <span>3. Código de invitación</span>
                                    <span className="text-xs font-bold text-[#BD4A1F] bg-[#BD4A1F]/10 px-2.5 py-0.5 rounded-full">Obligatorio</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        id="reg-codigo"
                                        type="text"
                                        placeholder="Ej: EXPO2026"
                                        value={codigoInvitacion}
                                        onChange={(e) => {
                                            setCodigoInvitacion(e.target.value.toUpperCase());
                                            if (erroresCampo.codigoInvitacion) setErroresCampo((p) => ({ ...p, codigoInvitacion: undefined }));
                                        }}
                                        className={cn(
                                            'h-14 rounded-2xl font-mono text-base font-extrabold uppercase tracking-wider pl-11 bg-[#F6F2EC]/40 border-2 border-[#DAD6CF] text-[#2D3E33]',
                                            erroresCampo.codigoInvitacion && 'odisea-field-error',
                                            !erroresCampo.codigoInvitacion && codigoInvitacion.trim().length >= 4 && 'odisea-field-ok'
                                        )}
                                    />
                                    <KeyRound className="h-5 w-5 text-[#2D3E33]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <MensajeErrorCampo mensaje={erroresCampo.codigoInvitacion} />
                            </div>

                            {/* 4. Contraseña con Ojito */}
                            <div
                                key={`pw-${shakeKey}-${!!erroresCampo.password}`}
                                className={cn('space-y-1.5', erroresCampo.password && 'odisea-shake')}
                            >
                                <label htmlFor="reg-password" className="block text-sm sm:text-base font-extrabold text-[#2D3E33]">
                                    4. Crea una contraseña (mínimo 6 letras o números)
                                </label>
                                <div className="relative">
                                    <Input
                                        id="reg-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Mínimo 6 caracteres"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (erroresCampo.password) setErroresCampo((p) => ({ ...p, password: undefined }));
                                        }}
                                        autoComplete="new-password"
                                        className={cn(
                                            'h-14 rounded-2xl text-base font-bold bg-[#F6F2EC]/40 border-2 border-[#DAD6CF] text-[#2D3E33] pr-28 px-4',
                                            erroresCampo.password && 'odisea-field-error',
                                            !erroresCampo.password && password.length >= 6 && 'odisea-field-ok'
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#2D3E33]/10 hover:bg-[#2D3E33]/20 text-[#2D3E33] px-3 py-2 cursor-pointer rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors"
                                    >
                                        {showPassword ? <><EyeOff className="h-4 w-4" /><span>Ocultar</span></> : <><Eye className="h-4 w-4" /><span>Ver</span></>}
                                    </button>
                                </div>
                                {password.length > 0 && password.length < 6 && !erroresCampo.password && (
                                    <p className="text-xs font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                                        Llevas {password.length} de 6 caracteres (te faltan {6 - password.length}).
                                    </p>
                                )}
                                {password.length >= 6 && !erroresCampo.password && (
                                    <p className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-emerald-600" /> ¡Contraseña de buen tamaño!
                                    </p>
                                )}
                                <MensajeErrorCampo mensaje={erroresCampo.password} />
                            </div>

                            {/* 5. Confirmar Contraseña con Ojito */}
                            <div
                                key={`conf-${shakeKey}-${!!erroresCampo.confirmPassword}`}
                                className={cn('space-y-1.5', erroresCampo.confirmPassword && 'odisea-shake')}
                            >
                                <label htmlFor="reg-confirm" className="block text-sm sm:text-base font-extrabold text-[#2D3E33]">
                                    5. Repite la misma contraseña
                                </label>
                                <div className="relative">
                                    <Input
                                        id="reg-confirm"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Escribe otra vez la contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (erroresCampo.confirmPassword) setErroresCampo((p) => ({ ...p, confirmPassword: undefined }));
                                        }}
                                        autoComplete="new-password"
                                        className={cn(
                                            'h-14 rounded-2xl text-base font-bold bg-[#F6F2EC]/40 border-2 border-[#DAD6CF] text-[#2D3E33] pr-28 px-4',
                                            erroresCampo.confirmPassword && 'odisea-field-error',
                                            !erroresCampo.confirmPassword && confirmPassword.length >= 6 && confirmPassword === password && 'odisea-field-ok'
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#2D3E33]/10 hover:bg-[#2D3E33]/20 text-[#2D3E33] px-3 py-2 cursor-pointer rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors"
                                    >
                                        {showConfirmPassword ? <><EyeOff className="h-4 w-4" /><span>Ocultar</span></> : <><Eye className="h-4 w-4" /><span>Ver</span></>}
                                    </button>
                                </div>
                                {confirmPassword.length > 0 && confirmPassword === password && (
                                    <p className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-emerald-600" /> ¡Las dos contraseñas coinciden!
                                    </p>
                                )}
                                {confirmPassword.length > 0 && confirmPassword !== password && !erroresCampo.confirmPassword && (
                                    <p className="text-xs font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                                        Todavía no es igual a la contraseña de arriba.
                                    </p>
                                )}
                                <MensajeErrorCampo mensaje={erroresCampo.confirmPassword} />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm font-bold text-red-800 bg-red-50 border-2 border-red-300 px-4 py-3 rounded-2xl flex items-start gap-2"
                                >
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 rounded-full font-extrabold text-base uppercase tracking-wider gap-2 bg-[#BD4A1F] hover:bg-[#a53e19] text-white mt-2 shadow-lg shadow-[#BD4A1F]/25 cursor-pointer"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Crear mi cuenta
                                        <ArrowRight className="h-5 w-5" />
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
