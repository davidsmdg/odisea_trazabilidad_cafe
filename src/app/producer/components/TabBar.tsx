import { NavLink } from 'react-router';
import { Home, Sprout, Coffee, Wallet, User } from 'lucide-react';
import { cn } from '../../components/ui/utils';

const TABS = [
    { to: '/producer/inicio', label: 'Inicio', Icon: Home },
    { to: '/producer/finca', label: 'Finca', Icon: Sprout },
    { to: '/producer/cosechas', label: 'Cosechas', Icon: Coffee },
    { to: '/producer/cuentas', label: 'Cuentas', Icon: Wallet },
    { to: '/producer/perfil', label: 'Perfil', Icon: User },
];

export function TabBar() {
    return (
        <nav className="pr-tabbar md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-gray-100 flex items-stretch justify-around shadow-[0_-6px_25px_rgba(0,0,0,0.08)] py-1.5">
            {TABS.map(({ to, label, Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        cn(
                            'flex-1 flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-black uppercase tracking-wider transition-all duration-200 select-none',
                            isActive ? 'text-[#1d3d24] scale-[1.03]' : 'text-gray-400 hover:text-gray-600'
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span
                                className={cn(
                                    'relative flex items-center justify-center h-10 w-14 rounded-2xl transition-all duration-200',
                                    isActive
                                        ? 'bg-[#2d5a37] text-white shadow-md shadow-[#2d5a37]/30'
                                        : 'bg-transparent text-gray-400'
                                )}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </span>
                            <span className={cn('transition-colors', isActive ? 'text-[#1d3d24] font-black' : 'text-gray-400 font-bold')}>
                                {label}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
