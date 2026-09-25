import React from 'react';
import { Trophy } from 'lucide-react';

const SIZES: Record<'sm' | 'lg', { wrap: string; icon: string }> = {
  sm: { wrap: 'w-7 h-7', icon: 'w-4 h-4' },
  lg: { wrap: 'w-14 h-14', icon: 'w-6 h-6' },
};

interface TrophyBadgeProps {
  earned: boolean;
  size?: 'sm' | 'lg';
  /** Color de fondo cuando está ganada (p. ej. `bg-warning-500`), para diferenciar copas de distintos programas. */
  colorClass?: string;
}

/** Trofeo de programa: círculo perfecto, con color propio cuando se gana; fondo gris claro e ícono gris (bloqueado) mientras no. */
export const TrophyBadge: React.FC<TrophyBadgeProps> = ({ earned, size = 'sm', colorClass = 'bg-warning-500' }) => {
  const s = SIZES[size];
  return (
    <div
      className={`${s.wrap} rounded-full flex items-center justify-center shrink-0 ${
        earned ? `${colorClass} text-white shadow-xs` : 'bg-gray-100 text-gray-400'
      }`}
      aria-label={earned ? 'Trofeo obtenido' : 'Trofeo bloqueado'}
    >
      <Trophy className={`${s.icon} stroke-[1.8]`} aria-hidden="true" />
    </div>
  );
};
