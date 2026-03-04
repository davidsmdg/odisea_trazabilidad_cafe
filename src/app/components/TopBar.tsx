import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { Coffee, Search, HelpCircle, LogIn, LayoutDashboard } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  activeItem?: string;
}

export function TopBar({ activeItem }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: 'Explorar', path: '/' },
    { label: 'Banco de Cafés', path: '/banco-cafes' },
    { label: 'Sobre Nosotros', path: '#' },
  ];

  const getCurrentItem = () => {
    if (activeItem) return activeItem;
    if (location.pathname === '/') return 'Explorar';
    if (location.pathname.startsWith('/banco-cafes')) return 'Banco de Cafés';
    return '';
  };

  const currentItem = getCurrentItem();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-50 w-full bg-[#F5F5DC]/90 backdrop-blur-md border-b border-black/5 h-20"
    >
      <div className="max-w-[1400px] mx-auto px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Coffee className="h-7 w-7 text-[#2C5F2D]" />
            <span className="text-2xl font-serif font-bold text-[#2C5F2D] tracking-tight">
              TraceCafé
            </span>
          </button>

          {/* Navegación Central */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`text-sm uppercase tracking-widest font-bold transition-all cursor-pointer ${item.label === currentItem
                  ? 'text-[#2C5F2D] border-b-2 border-[#2C5F2D] pb-1'
                  : 'text-gray-500 hover:text-[#2C5F2D]'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Acciones Derecha */}
          <div className="flex items-center gap-6">
            <div className="relative hidden xl:block">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar origen..."
                className="pl-11 pr-4 py-2 w-64 bg-black/5 border-none rounded-full text-sm focus:ring-2 focus:ring-[#2C5F2D]/20 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer">
                      <HelpCircle className="h-5 w-5 text-gray-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Centro de Ayuda</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {user ? (
                // Usuario autenticado
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (user.role === 'AGRICULTOR') navigate('/producer/dashboard');
                          else if (user.role === 'COMMUNITY_LEADER') navigate('/lider/validaciones');
                          else if (user.role === 'ENV_VERIFIER') navigate('/ambiental/revisiones');
                          else if (user.role === 'TASTER') navigate('/catador/muestras');
                          else if (user.role === 'CERES') navigate('/ceres/lotes');
                          else if (user.role === 'ROASTER') navigate('/tostador/explorar');
                          else if (user.role === 'FINAL_CLIENT') navigate('/trazabilidad/publica/084');
                          else navigate('/');
                        }}
                        className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-[#2C5F2D]/20 hover:border-[#2C5F2D]/50 hover:bg-[#2C5F2D]/5 transition-all cursor-pointer"
                      >
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-[#2C5F2D] text-white text-xs font-bold">
                            {user.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-[#2C5F2D] hidden md:block">
                          Mi Portal
                        </span>
                        <LayoutDashboard className="h-3.5 w-3.5 text-[#2C5F2D] hidden md:block" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{user.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                // Sin sesión
                <>
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="hidden md:block px-5 py-2 border border-[#2C5F2D] text-[#2C5F2D] rounded-full text-sm font-bold hover:bg-[#2C5F2D]/5 transition-all cursor-pointer"
                  >
                    Regístrate
                  </button>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="flex items-center gap-2 px-5 py-2 bg-[#2C5F2D] text-white rounded-full text-sm font-bold hover:bg-[#234d24] transition-all cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Ingresar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
