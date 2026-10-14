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
        <nav className="pr-tabbar md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#F6F2EC]/95 backdrop-blur-md border-t-2 border-[#2D3E33]/15 flex items-stretch justify-around shadow-[0_-6px_25px_rgba(27,38,59,0.12)] py-2">
            {TABS.map(({ to, label, Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        cn(
                            'flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 select-none min-h-[58px]',
                            isActive ? 'text-[#2D3E33] scale-[1.04]' : 'text-[#2D3E33]/60 hover:text-[#2D3E33]'
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span
                                className={cn(
                                    'relative flex items-center justify-center h-10 w-14 rounded-full transition-all duration-200',
                                    isActive
                                        ? 'bg-[#2D3E33] text-[#F6F2EC] shadow-md shadow-[#2D3E33]/30'
                                        : 'bg-transparent text-[#2D3E33]/60'
                                )}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </span>
                            <span className={cn('text-[12px] uppercase tracking-wide transition-colors', isActive ? 'text-[#2D3E33] font-black' : 'text-[#2D3E33]/70 font-bold')}>
                                {label}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
