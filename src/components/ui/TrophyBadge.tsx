import React, { useId } from 'react';
import cupImage from '../../assets/images/trophy-badge.png';

const SIZES: Record<'sm' | 'lg', string> = {
  sm: 'w-9 h-9',
  lg: 'w-14 h-14',
};

interface TrophyBadgeProps {
  earned: boolean;
  size?: 'sm' | 'lg';
  /** Color de la estrategia (valor CSS, p. ej. `var(--color-success-500)`): tiñe el círculo de la copa ganada. */
  color?: string;
}

/**
 * Prueba de diseño: copa ganada = imagen de la copa 3D sobre un círculo del color de la estrategia
 * en tono claro; bloqueada = círculo punteado gris con la copa en gris. Con `false` vuelve a la copa dorada.
 */
const SOLID_TROPHY_BADGE = true;

const GOLD = 'var(--color-warning-500)';
const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, white)`;

function starPoints(cx: number, cy: number, outer: number, inner: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}

const STAR = starPoints(32, 25, 10.5, 4.4);

/**
 * Copa de programa: copa dorada (reborde, asas en lazo, pie y pedestal) dentro
 * de un círculo gris claro; la estrella lleva el color de la estrategia.
 * Bloqueada = círculo punteado gris con la copa en gris, sin candado.
 */
const SolidCup: React.FC<{ className: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
    <path
      d="M18 14 H12 Q10 14 10 17 Q10 24 18 26 M46 14 H52 Q54 14 54 17 Q54 24 46 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18 9 H46 V24 C46 33 40 38 32 38 C24 38 18 33 18 24 Z" fill="currentColor" />
    <rect x="28" y="37" width="8" height="11" fill="currentColor" />
    <rect x="20" y="47" width="24" height="8" rx="3" fill="currentColor" />
  </svg>
);

export const TrophyBadge: React.FC<TrophyBadgeProps> = ({ earned, size = 'sm', color = 'var(--color-brand)' }) => {
  const goldId = useId();
  const baseId = useId();
  if (SOLID_TROPHY_BADGE) {
    return (
      <div
        className={`relative shrink-0 rounded-full flex items-center justify-center ${SIZES[size]} ${
          earned ? '' : 'border-[1.5px] border-dashed border-gray-300 bg-gray-100'
        }`}
        style={earned ? { backgroundColor: `color-mix(in srgb, ${color} 18%, white)` } : undefined}
        role="img"
        aria-label={earned ? 'Copa ganada' : 'Copa bloqueada'}
      >
        {earned ? (
          /* La misma copa 3D de la pantalla de progreso, inclinada y saliéndose un poco del círculo */
          <img
            src={cupImage}
            alt=""
            draggable={false}
            className="absolute max-w-none w-[112%] h-[112%] -top-[18%] left-[4%] object-contain pointer-events-none select-none"
          />
        ) : (
          <SolidCup className="w-[56%] h-[56%] text-gray-400" />
        )}
      </div>
    );
  }

  const fill = earned ? `url(#${goldId})` : 'var(--color-gray-200)';
  const stroke = earned ? tint(GOLD, 45) : 'var(--color-gray-300)';
  const sw = { stroke, strokeWidth: 2, strokeLinejoin: 'round' as const };

  return (
    <div
      className={`relative shrink-0 rounded-full flex items-center justify-center ${SIZES[size]} ${
        earned
          ? 'bg-gray-100'
          : 'border-[1.5px] border-dashed border-gray-300 bg-gray-100'
      }`}
      role="img"
      aria-label={earned ? 'Copa ganada' : 'Copa bloqueada'}
    >
      <svg viewBox="0 0 64 64" className="w-[70%] h-[70%]" aria-hidden="true">
        <defs>
          <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: tint(GOLD, 40) }} />
            <stop offset="100%" style={{ stopColor: GOLD }} />
          </linearGradient>
          <linearGradient id={baseId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d9dce1" />
          </linearGradient>
        </defs>

        {/* asas en lazo */}
        <path
          d="M17 17 H10.5 q-4.5 0 -4.5 4.5 q0 9.5 11 16 M47 17 H53.5 q4.5 0 4.5 4.5 q0 9.5 -11 16"
          fill="none"
          stroke={earned ? GOLD : stroke}
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* pedestal */}
        <rect
          x="13"
          y="54"
          width="38"
          height="8"
          rx="4"
          fill={earned ? `url(#${baseId})` : 'var(--color-gray-200)'}
          stroke={earned ? '#e5e7eb' : stroke}
          strokeWidth="1.5"
        />
        {/* pie acampanado y plato */}
        <path d="M28 42 H36 C36 47.5 38.5 49.5 43 51 H21 C25.5 49.5 28 47.5 28 42 Z" fill={fill} {...sw} />
        <rect x="18" y="50" width="28" height="5" rx="2.5" fill={fill} {...sw} />
        {/* copa y reborde */}
        <path d="M16 13 H48 C48 28 42.5 37.5 36 42 H28 C21.5 37.5 16 28 16 13 Z" fill={fill} {...sw} />
        <rect x="12" y="6" width="40" height="8" rx="4" fill={fill} {...sw} />

        {earned && (
          <polygon points={STAR} style={{ fill: color }} stroke="rgb(255 255 255 / 0.55)" strokeWidth="0.6" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
};
