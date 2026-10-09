import React from 'react';
import { BADGE_ICON } from './LevelMedal';

const SIZES: Record<'sm' | 'lg', string> = {
  sm: 'w-9 h-9',
  lg: 'w-14 h-14',
};

/** Copa sólida simple. */
const CupIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
    <path
      d="M7 5H4.8a.8.8 0 0 0-.8.8V7a3.5 3.5 0 0 0 3.6 3.5M17 5h2.2a.8.8 0 0 1 .8.8V7a3.5 3.5 0 0 1-3.6 3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M6.5 3h11v6a5.5 5.5 0 0 1-11 0V3Z" />
    <rect x="10.8" y="14" width="2.4" height="4" />
    <rect x="7.5" y="17.5" width="9" height="3" rx="1.2" />
  </svg>
);

interface TrophyBadgeProps {
  earned: boolean;
  size?: 'sm' | 'lg';
  /** Color de la estrategia (valor CSS, p. ej. `var(--color-success-500)`): copa sólida sobre ese color en tono claro. */
  color?: string;
}

/**
 * Copa de programa: ganada = copa del color de la estrategia sobre un círculo del mismo color muy claro;
 * por ganar = círculo punteado gris con la copa en gris (mismo estilo que las medallas por ganar).
 */
export const TrophyBadge: React.FC<TrophyBadgeProps> = ({ earned, size = 'sm', color = 'var(--color-brand)' }) => (
  <div
    className={`shrink-0 rounded-full flex items-center justify-center ${SIZES[size]} ${
      earned ? '' : 'border-[1.5px] border-dashed border-gray-300 bg-gray-50 text-gray-400'
    }`}
    style={earned ? { backgroundColor: `color-mix(in srgb, ${color} 12%, white)` } : undefined}
    role="img"
    aria-label={earned ? 'Copa ganada' : 'Copa bloqueada'}
  >
    <CupIcon className={BADGE_ICON} style={earned ? { color } : undefined} />
  </div>
);
