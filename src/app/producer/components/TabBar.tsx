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
        <nav className="pr-tabbar fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex items-stretch justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            {TABS.map(({ to, label, Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        cn(
                            'flex-1 flex flex-col items-center justify-center gap-1 pt-2 text-[11px] font-black uppercase tracking-wide transition-colors',
                            isActive ? 'text-[#5f705f]' : 'text-gray-400'
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span
                                className={cn(
                                    'flex items-center justify-center h-9 w-12 rounded-2xl transition-all',
                                    isActive ? 'bg-[#5f705f]/10' : 'bg-transparent'
                                )}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.6 : 2} />
                            </span>
                            {label}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
