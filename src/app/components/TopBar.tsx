import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { Coffee, Search, HelpCircle, LogIn, LayoutDashboard, User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './ui/BrandLogo';

interface TopBarProps {
  activeItem?: string;
}

export function TopBar({ activeItem }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Portafolio de Cafés', path: '/banco-cafes' },
    { label: 'Sobre Nosotros', path: '/sobre-nosotros' },
  ];

  const getCurrentItem = () => {
    if (activeItem) return activeItem;
    if (location.pathname === '/') return 'Inicio';
    if (location.pathname.startsWith('/banco-cafes')) return 'Portafolio de Cafés';
    if (location.pathname.startsWith('/sobre-nosotros')) return 'Sobre Nosotros';
    return '';
  };

  const currentItem = getCurrentItem();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-50 w-full bg-[#FDFDF8]/90 backdrop-blur-md border-b border-black/5 h-20"
    >
      <div className="max-w-[1400px] mx-auto px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Oficial */}
          <BrandLogo to="/" subtitle="Trace" theme="dark" size="md" />

          {/* Navegación Central */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`text-sm uppercase tracking-widest font-bold transition-all cursor-pointer ${item.label === currentItem
                  ? 'text-[#5f705f] border-b-2 border-[#5f705f] pb-1'
                  : 'text-gray-500 hover:text-[#5f705f]'
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
                className="pl-11 pr-4 py-2 w-64 bg-black/5 border-none rounded-full text-sm focus:ring-2 focus:ring-[#5f705f]/20 outline-none transition-all"
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
                          if (user.role === 'AGRICULTOR') navigate('/producer/inicio');
                          else if (user.role === 'COMMUNITY_LEADER') navigate('/lider/validaciones');
                          else if (user.role === 'ENV_VERIFIER') navigate('/odisea/ambiental/revisiones');
                          else if (user.role === 'TASTER') navigate('/catador/muestras');
                          else if (user.role === 'CERES') navigate('/odisea/lotes');
                          else if (user.role === 'ROASTER') navigate('/tostador/explorar');
                          else navigate('/');
                        }}
                        className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-[#5f705f]/20 hover:border-[#5f705f]/50 hover:bg-[#5f705f]/5 transition-all cursor-pointer"
                      >
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-[#5f705f] text-white text-xs font-bold">
                            {user.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-[#5f705f] hidden md:block">
                          Mi Portal
                        </span>
                        <LayoutDashboard className="h-3.5 w-3.5 text-[#5f705f] hidden md:block" />
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
                  {/* Vista Desktop */}
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="hidden md:block px-5 py-2 border border-[#5f705f] text-[#5f705f] rounded-full text-sm font-bold hover:bg-[#5f705f]/5 transition-all cursor-pointer"
                  >
                    Regístrate
                  </button>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="hidden md:flex items-center gap-2 px-5 py-2 bg-[#5f705f] text-white rounded-full text-sm font-bold hover:bg-[#bb8d3b] transition-all cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Ingresar</span>
                  </button>

                  {/* Vista Móvil (Dropdown) */}
                  <div className="relative md:hidden">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-2.5 hover:bg-black/5 rounded-full border border-black/10 transition-all cursor-pointer flex items-center justify-center bg-[#5f705f]/5 text-[#5f705f]"
                    >
                      <User className="h-5 w-5" />
                    </button>
                    {isMobileMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-3 w-44 bg-[#FDFDF8] rounded-2xl shadow-xl border border-black/5 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate('/auth/login');
                            }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-[#5f705f] hover:bg-[#5f705f]/5 transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <LogIn className="h-4 w-4" />
                            Ingresar
                          </button>
                          <div className="h-px bg-black/5 mx-2" />
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate('/auth/register');
                            }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-[#5f705f]/5 transition-colors cursor-pointer flex items-center gap-2"
                          >
                            Regístrate
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
