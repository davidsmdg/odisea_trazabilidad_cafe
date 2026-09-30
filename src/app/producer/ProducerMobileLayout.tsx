import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import { WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TabBar } from './components/TabBar';
import { BarraPrecioTicker } from './components/BarraPrecioTicker';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ProducerOnboarding } from './ProducerOnboarding';
import { debeVerOnboarding, marcarOnboarding } from './utils/onboardingFlag';
import { getFincas } from '../../services/fincasService';

export function ProducerMobileLayout() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const online = useOnlineStatus();
    const [estado, setEstado] = useState<'cargando' | 'onboarding' | 'app'>('cargando');

    useEffect(() => {
        if (!debeVerOnboarding()) {
            setEstado('app');
            return;
        }
        // Usuario de vuelta que ya tiene finca: no molestamos con el onboarding.
        getFincas()
            .then((fs) => {
                if (fs.length > 0) {
                    marcarOnboarding('completo');
                    setEstado('app');
                } else {
                    setEstado('onboarding');
                }
            })
            .catch(() => setEstado('onboarding'));
    }, []);

    if (estado === 'cargando') {
        return (
            <div className="producer-shell min-h-screen bg-[#FDFDF8] flex items-center justify-center">
                <div className="h-9 w-9 border-4 border-[#5f705f]/20 border-t-[#5f705f] rounded-full animate-spin" />
            </div>
        );
    }

    if (estado === 'onboarding') {
        return (
            <ProducerOnboarding
                onListo={() => {
                    setEstado('app');
                    navigate('/producer/inicio', { replace: true });
                }}
            />
        );
    }

    const primerNombre = user?.name?.split(' ')[0] || 'Productor';
    const hoy = new Date().toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <div className="producer-shell min-h-screen bg-[#FDFDF8] text-[#2c362c] flex flex-col mx-auto w-full max-w-md">
            {/* Barra de noticias y precio en movimiento arriba de todo */}
            <div className="sticky top-0 z-40">
                <BarraPrecioTicker />
            </div>

            {/* Encabezado compacto */}
            <header className="bg-[#FDFDF8]/90 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-gray-100">
                <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 capitalize truncate">
                        {hoy}
                    </p>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight truncate">
                        Hola, {primerNombre}
                    </h1>
                </div>
                <Link
                    to="/producer/perfil"
                    className="h-12 w-12 shrink-0 rounded-2xl bg-[#5f705f] text-white flex items-center justify-center font-black text-base shadow-md"
                    aria-label="Mi perfil"
                >
                    {user?.avatarInitials || (primerNombre ? primerNombre.slice(0, 2).toUpperCase() : 'PR')}
                </Link>
            </header>

            {/* Aviso de sin conexión */}
            {!online && (
                <div className="mx-5 mb-2 flex items-center gap-2 rounded-2xl bg-[#bb8d3b]/15 border border-[#bb8d3b]/30 px-4 py-2.5 text-[13px] font-bold text-[#8a6a26]">
                    <WifiOff size={16} className="shrink-0" />
                    Sin internet. Todo lo que anotes se guarda en tu celular.
                </div>
            )}

            {/* Contenido */}
            <main className="producer-scroll flex-1 px-5 pt-2">
                <Outlet />
            </main>

            <TabBar />
        </div>
    );
}
