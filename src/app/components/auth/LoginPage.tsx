import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'motion/react';
import { Loader2, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';
import {
    analizarCelularOCorreo,
    AsistenteCelular,
    MensajeErrorCampo,
    vibrarError,
    enfocarCampoConError,
} from '../../utils/usabilidad';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [identificador, setIdentificador] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [erroresCampo, setErroresCampo] = useState<{ identificador?: string; password?: string }>({});
    const [shakeKey, setShakeKey] = useState(0);

    const from = (location.state as any)?.from?.pathname || '/producer/inicio';
    const estadoContacto = analizarCelularOCorreo(identificador);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nuevosErrores: { identificador?: string; password?: string } = {};

        if (!identificador.trim()) {
            nuevosErrores.identificador = 'Escribe aquí tu número de celular (10 números) o tu correo.';
        } else if (!estadoContacto.valido) {
            nuevosErrores.identificador =
                estadoContacto.modo === 'celular'
                    ? estadoContacto.mensaje
                    : 'Revisa que tu correo electrónico esté completo.';
        }

        if (!password) {
            nuevosErrores.password = 'Escribe aquí tu contraseña para poder entrar.';
        }

        if (nuevosErrores.identificador || nuevosErrores.password) {
            setErroresCampo(nuevosErrores);
            setShakeKey((k) => k + 1);
            vibrarError();
            if (nuevosErrores.identificador) {
                enfocarCampoConError('identificador');
            } else if (nuevosErrores.password) {
                enfocarCampoConError('password');
            }
            return;
        }

        setErroresCampo({});
        setError('');
        setIsLoading(true);
        try {
            await login(identificador, password);
            if ((location.state as any)?.from?.pathname) {
                navigate(from, { replace: true });
            } else {
                const id = identificador.trim().toLowerCase();
                if (id.includes('admin') || id.includes('carlos@beneficio.co')) {
                    navigate('/odisea/dashboard', { replace: true });
                } else if (id.includes('calidad') || id.includes('taster')) {
                    navigate('/catador/muestras', { replace: true });
                } else if (id.includes('lider')) {
                    navigate('/lider/validaciones', { replace: true });
                } else if (id.includes('tostador') || id.includes('roaster')) {
                    navigate('/tostador/explorar', { replace: true });
                } else {
                    navigate('/producer/inicio', { replace: true });
                }
            }
        } catch (err: any) {
            vibrarError();
            setShakeKey((k) => k + 1);
            setError(err?.message || 'El número o la contraseña no coinciden. Revisa e intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-[640px] max-w-4xl mx-auto w-full rounded-[2rem] overflow-hidden shadow-2xl border border-[#2D3E33]/10 bg-white">
            {/* Panel izquierdo — decorativo e identidad */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#2D3E33] flex-col justify-between p-12 relative overflow-hidden text-[#F6F2EC]">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#E5A84B]/10" />

                <div className="relative">
                    <div className="inline-flex items-center gap-2.5 bg-white/10 rounded-full px-4 py-1.5 mb-8 border border-white/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E5A84B] animate-pulse" />
                        <span className="text-[#F6F2EC] text-[12px] font-extrabold tracking-widest uppercase">
                            Portal del Productor
                        </span>
                    </div>
                    <h2 className="text-4xl font-heading text-[#F6F2EC] uppercase tracking-wide leading-[1.08]">
                        Tu finca,<br />
                        <span className="text-[#E5A84B]">en tu celular.</span>
                    </h2>
                    <p className="mt-5 text-[#CCD1C7] text-base leading-relaxed">
                        Entra para registrar tu cosecha, revisar tus números y separar lo del café de lo de la casa.
                    </p>
                </div>

                {/* Stats estilo Landing */}
                <div className="relative grid grid-cols-2 gap-3.5 pt-8 border-t border-white/15">
                    {[
                        { label: 'Familias cafeteras', value: '+20' },
                        { label: 'Departamentos', value: '3' },
                        { label: 'Liderado por mujeres', value: '60%' },
                        { label: 'Uso sin señal', value: '100%' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
                            <div className="text-2xl font-heading text-[#E5A84B]">{stat.value}</div>
                            <div className="text-[12px] font-bold text-[#CCD1C7] uppercase tracking-wider mt-0.5 leading-snug">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Panel derecho — formulario accesible */}
            <div className="flex-1 bg-[#F6F2EC] flex flex-col justify-center px-6 sm:px-12 py-10 sm:py-12">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-8">
                        <Link
                            to="/"
                            className="inline-flex items-center text-sm font-bold text-[#2D3E33] hover:text-[#BD4A1F] mb-4 group transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Volver a la página principal
                        </Link>

                        <h1 className="text-3xl sm:text-4xl font-heading uppercase text-[#2D3E33] tracking-tight">
                            Entrar a Mi Finca
                        </h1>
                        <p className="text-[#4A2E3D] mt-1.5 text-base font-medium">
                            Usa tu número de celular (10 números) o correo para ingresar.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Correo o celular */}
                        <div
                            key={`id-${shakeKey}-${!!erroresCampo.identificador}`}
                            className={cn('space-y-1.5', erroresCampo.identificador && 'odisea-shake')}
                        >
                            <label htmlFor="identificador" className="block text-sm sm:text-base font-extrabold text-[#2D3E33]">
                                1. Tu número de celular o correo
                            </label>
                            <Input
                                id="identificador"
                                type="text"
                                placeholder="Ej: 301 530 3014"
                                value={identificador}
                                onChange={(e) => {
                                    setIdentificador(e.target.value);
                                    if (erroresCampo.identificador) {
                                        setErroresCampo((prev) => ({ ...prev, identificador: undefined }));
                                    }
                                }}
                                autoComplete="username"
                                className={cn(
                                    'h-14 rounded-2xl text-base sm:text-lg font-bold bg-white border-2 border-[#DAD6CF] focus:border-[#2D3E33] focus:ring-0 text-[#2D3E33] px-4 shadow-sm transition-all',
                                    erroresCampo.identificador && 'odisea-field-error',
                                    !erroresCampo.identificador && estadoContacto.valido && 'odisea-field-ok'
                                )}
                            />
                            <AsistenteCelular valor={identificador} />
                            <MensajeErrorCampo mensaje={erroresCampo.identificador} />
                        </div>

                        {/* Password */}
                        <div
                            key={`pw-${shakeKey}-${!!erroresCampo.password}`}
                            className={cn('space-y-1.5', erroresCampo.password && 'odisea-shake')}
                        >
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm sm:text-base font-extrabold text-[#2D3E33]">
                                    2. Tu contraseña
                                </label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Escribe tu contraseña aquí"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (erroresCampo.password) {
                                            setErroresCampo((prev) => ({ ...prev, password: undefined }));
                                        }
                                    }}
                                    autoComplete="current-password"
                                    className={cn(
                                        'h-14 rounded-2xl text-base sm:text-lg font-bold bg-white border-2 border-[#DAD6CF] focus:border-[#2D3E33] focus:ring-0 text-[#2D3E33] pr-28 px-4 shadow-sm transition-all',
                                        erroresCampo.password && 'odisea-field-error'
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#2D3E33]/10 hover:bg-[#2D3E33]/20 text-[#2D3E33] px-3 py-2 cursor-pointer rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors"
                                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                                >
                                    {showPassword ? (
                                        <>
                                            <EyeOff className="h-4 w-4 shrink-0" />
                                            <span>Ocultar</span>
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4 shrink-0" />
                                            <span>Ver</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <MensajeErrorCampo mensaje={erroresCampo.password} />
                        </div>

                        {/* Error de servidor / credenciales */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-base font-bold text-red-800 bg-red-50 border-2 border-red-300 px-4 py-3.5 rounded-2xl flex items-start gap-2.5"
                            >
                                <span className="text-lg leading-none">⚠️</span>
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                'w-full h-14 rounded-full text-base font-extrabold tracking-wide uppercase gap-2 transition-transform active:scale-[0.99] cursor-pointer',
                                'bg-[#BD4A1F] hover:bg-[#a53e19] text-[#F6F2EC] shadow-md shadow-[#BD4A1F]/20'
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Ingresar a mi cuenta
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Ayuda y WhatsApp */}
                    <div className="mt-8 pt-6 border-t border-[#DAD6CF] space-y-4">
                        <p className="text-center text-base text-[#2D3E33]">
                            ¿Primera vez aquí?{' '}
                            <Link
                                to="/auth/register"
                                className="text-[#BD4A1F] font-extrabold hover:underline"
                            >
                                Registrar mi finca →
                            </Link>
                        </p>

                        <div className="bg-[#2D3E33]/5 rounded-2xl p-4 flex items-center justify-between gap-3 border border-[#2D3E33]/10">
                            <div>
                                <p className="text-xs font-extrabold text-[#2D3E33] uppercase tracking-wider">¿Necesitas ayuda para entrar?</p>
                                <p className="text-sm font-bold text-[#BD4A1F]">+57 301 530 3014</p>
                            </div>
                            <a
                                href="https://wa.me/573015303014?text=Hola,%20necesito%20ayuda%20para%20entrar%20a%20Mi%20Finca%20Odisea"
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-[#2D3E33] text-white text-xs font-extrabold uppercase rounded-full hover:bg-[#1B263B] transition-colors"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
