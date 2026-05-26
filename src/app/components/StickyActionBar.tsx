"use client";

import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';

interface StickyActionBarProps {
  visible: boolean;
}

export function StickyActionBar({ visible }: StickyActionBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div className="bg-white/95 backdrop-blur-sm border-t border-border shadow-lg">
            <div className="max-w-[1200px] mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">¿Listo para reservar este lote?</p>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Ver cadena resumida
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    Reservar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}