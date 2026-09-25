import React from 'react';

/* Oro / plata / bronce sobre las escalas warning y gray (ver DESIGN.md §3.1) */
const MEDALS: Record<1 | 2 | 3, string> = {
  1: 'bg-warning-500',
  2: 'bg-gray-400',
  3: 'bg-warning-600',
};

const SIZES: Record<'sm' | 'lg', { wrap: string; text: string }> = {
  sm: { wrap: 'w-7 h-7', text: 'text-[13px]' },
  lg: { wrap: 'w-14 h-14', text: 'text-[24px]' },
};

interface MedalIconProps {
  place?: 1 | 2 | 3;
  size?: 'sm' | 'lg';
  /** Contenido del círculo; por defecto muestra `place`. */
  label?: React.ReactNode;
  /** Cuando es false, se muestra un círculo gris vacío (bloqueado). */
  earned?: boolean;
}

/** Medalla: círculo perfecto. Bloqueada = fondo gris claro e ícono gris (invita a completarla). */
export const MedalIcon: React.FC<MedalIconProps> = ({ place = 1, size = 'sm', label, earned = true }) => {
  const s = SIZES[size];
  return (
    <div
      className={`${s.wrap} ${s.text} rounded-full flex items-center justify-center font-bold shrink-0 ${
        earned ? `${MEDALS[place]} text-white shadow-xs` : 'bg-gray-100 text-gray-400'
      }`}
      aria-label={earned ? `Medalla puesto ${place}` : 'Medalla bloqueada'}
    >
      {label ?? place}
    </div>
  );
};
