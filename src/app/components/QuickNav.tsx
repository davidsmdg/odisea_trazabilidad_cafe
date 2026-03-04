"use client";

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Map, Database, FileText, Home } from 'lucide-react';

export function QuickNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Inicio / Mapa', path: '/', icon: Map },
    { label: 'Banco de Cafés', path: '/banco-cafes', icon: Database },
    { label: 'Trazabilidad Ejemplo', path: '/lote/HUI-001', icon: FileText },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#2C5F2D] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.button>

      {/* Panel de navegación */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            >
              <div className="p-6 bg-gradient-to-br from-[#2C5F2D] to-[#234d24] text-white">
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  Navegación Rápida
                </h3>
                <p className="text-sm text-white/80">
                  Accede a todas las pantallas de TraceCafé
                </p>
              </div>

              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.button
                      key={item.path}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigate(item.path)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#2C5F2D] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-white/20' : 'bg-white'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isActive ? 'text-white' : 'text-[#2C5F2D]'
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{item.label}</p>
                        {isActive && (
                          <p className="text-xs opacity-80">Página actual</p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  Usa este menú para navegar entre las diferentes pantallas
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
