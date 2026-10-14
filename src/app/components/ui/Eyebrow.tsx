import React from 'react';
import { cn } from './utils';

interface EyebrowProps {
  children: React.ReactNode;
  theme?: 'dark' | 'light';
  className?: string;
}

export function Eyebrow({ children, theme = 'dark', className }: EyebrowProps) {
  const isLight = theme === 'light';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 font-sans font-extrabold text-[12.5px] tracking-[0.14em] uppercase mb-3',
        isLight ? 'text-[#E5A84B]' : 'text-[#BD4A1F]',
        className
      )}
    >
      <span
        className={cn(
          'w-6 h-[3px] rounded-full shrink-0',
          isLight ? 'bg-[#E5A84B]' : 'bg-[#BD4A1F]'
        )}
      />
      <span>{children}</span>
    </div>
  );
}
