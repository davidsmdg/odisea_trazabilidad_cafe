import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'motion/react';
import { Loader2, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [identificador, setIdentificador] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const from = (location.state as any)?.from?.pathname || '/producer/inicio';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identificador || !password) {
            setError('Por favor completa todos los campos.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await login(identificador, password);
            if ((location.state as any)?.from?.pathname) {
                navigate(from, { replace: true });
            } else {
                // Redirección inteligente por rol
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
        } catch {
            setError('Credenciales inválidas. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-[600px] max-w-4xl mx-auto w-full rounded-3xl overflow-hidden shadow-2xl border border-black/5">
            {/* Panel izquierdo — decorativo */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#5f705f] flex-col justify-between p-12 relative overflow-hidden">
                {/* Círculos decorativos */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/5" />
                <div className="absolute top-1/3 right-8 w-24 h-24 rounded-full bg-white/10" />

                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 mb-10">
                        <div className="w-2 h-2 rounded-full bg-[#8a9a8a] animate-pulse" />
                        <span className="text-white text-xs font-medium tracking-widest uppercase">
                            Red Activa
                        </span>
                    </div>
                    <h2 className="text-3xl font-sans text-white leading-snug">
                        Trazabilidad que<br />
                        <span className="italic text-[#e3d5b8]">genera confianza.</span>
                    </h2>
                    <p className="mt-4 text-white/60 text-sm leading-relaxed">
                        Conecta tu finca, gestiona tus lotes y cumple con el estándar EUDR desde un solo lugar.
                    </p>
                </div>

                {/* Stats */}
                <div className="relative grid grid-cols-2 gap-4">
                    {[
                        { label: 'Productores', value: '1.240+' },
                        { label: 'Lotes trazados', value: '8.700+' },
                        { label: 'Conformidad EUDR', value: '84%' },
                        { label: 'Departamentos', value: '32' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                            <div className="text-2xl font-sans font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Panel derecho — formulario */}
            <div className="flex-1 bg-white flex flex-col justify-center px-8 sm:px-12 py-12">
                <div className="max-w-sm mx-auto w-full">
                    <div className="mb-8 relative">
                        {/* Option to return to Home, particularly useful after logging out */}
                        <Link
                            to="/"
                            className="inline-flex items-center text-sm font-semibold text-[#5f705f] hover:text-[#bb8d3b] mb-6 group transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Volver al Inicio
                        </Link>

                        <h1 className="text-3xl font-sans text-[#5f705f] font-bold mt-2">
                            Bienvenido de vuelta
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Ingresa tus credenciales para acceder al portal.
                        </p>
                    </div>

                    {/* Demo hint */}
                    <div className="mb-6 rounded-xl bg-[#5f705f]/5 border border-[#5f705f]/10 p-4">
                        <p className="text-xs text-[#5f705f] font-medium mb-1">🧪 Demo rápido</p>
                        <p className="text-xs text-gray-500">
                            Productor: <strong>3124559876</strong> · Institucional: <strong>maria@finca.co</strong>. Cualquier contraseña.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Correo o celular */}
                        <div className="space-y-1.5">
                            <label htmlFor="identificador" className="text-sm font-semibold text-gray-700">
                                Correo o número de celular
                            </label>
                            <Input
                                id="identificador"
                                type="text"
                                placeholder="tu@correo.co  ·  300 123 4567"
                                value={identificador}
                                onChange={(e) => setIdentificador(e.target.value)}
                                autoComplete="username"
                                className="h-11 rounded-xl"
                            />
                            <p className="text-xs text-gray-400">
                                Si eres productor, entra con el celular que registraste.
                            </p>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Contraseña
                                </label>
                                <button
                                    type="button"
                                    className="text-xs text-[#5f705f] hover:underline cursor-pointer"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="h-11 rounded-xl pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-[#a35c5c] bg-[#a35c5c]/5 px-4 py-2 rounded-lg"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                'w-full h-11 rounded-xl text-sm font-bold gap-2',
                                'bg-[#5f705f] hover:bg-[#bb8d3b] text-white'
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Ingresar
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        ¿No tienes cuenta?{' '}
                        <Link
                            to="/auth/register"
                            className="text-[#5f705f] font-semibold hover:underline"
                        >
                            Regístrate gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
