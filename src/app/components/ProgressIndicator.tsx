"use client";

import { motion } from 'motion/react';

interface ProgressIndicatorProps {
  progress: number; // 0-100
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="fixed top-16 left-0 right-0 z-50 h-1 bg-secondary">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  );
}