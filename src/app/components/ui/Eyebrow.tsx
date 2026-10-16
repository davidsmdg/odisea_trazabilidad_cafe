import React from 'react';
import { cn } from './utils';

interface EyebrowProps {
  children?: React.ReactNode;
  text?: string;
  variant?: 'terracota' | 'verde' | 'dorado' | string;
  theme?: 'dark' | 'light';
  className?: string;
}

export function Eyebrow({ children, text, variant, theme = 'dark', className }: EyebrowProps) {
  const isLight = theme === 'light';
  const isVerde = variant === 'verde';
  const contenido = children || text;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 font-sans font-extrabold text-[12.5px] tracking-[0.14em] uppercase mb-3',
        isVerde ? 'text-[#2D3E33]' : isLight ? 'text-[#E5A84B]' : 'text-[#BD4A1F]',
        className
      )}
    >
      <span
        className={cn(
          'w-6 h-[3px] rounded-full shrink-0',
          isVerde ? 'bg-[#2D3E33]' : isLight ? 'bg-[#E5A84B]' : 'bg-[#BD4A1F]'
        )}
      />
      <span>{contenido}</span>
    </div>
  );
}
