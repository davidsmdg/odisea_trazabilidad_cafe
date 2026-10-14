import React from 'react';
import { Link } from 'react-router';
import { cn } from './utils';

interface BrandLogoProps {
  to?: string;
  subtitle?: string;
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({
  to = '/',
  subtitle = 'Mi Finca',
  className,
  theme = 'dark',
  size = 'md',
}: BrandLogoProps) {
  const isLight = theme === 'light';

  const imgHeight = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6',
  }[size];

  const fontSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  const dividerHeight = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6',
  }[size];

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <img
        src="/landing-images/logo-odisea.png"
        alt="Odisea Café"
        className={cn('w-auto object-contain shrink-0', imgHeight, isLight ? 'brightness-0 invert' : 'opacity-90')}
      />
      <span
        className={cn(
          'w-px shrink-0 transition-colors',
          dividerHeight,
          isLight ? 'bg-white/30' : 'bg-[#2D3E33]/30'
        )}
      />
      <span
        className={cn(
          'font-heading tracking-wide uppercase leading-none whitespace-nowrap',
          fontSize,
          isLight ? 'text-[#F6F2EC]' : 'text-[#2D3E33]'
        )}
      >
        {subtitle}
      </span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block hover:opacity-85 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
