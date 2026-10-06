import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'dark' | 'light';

const SIZES: Record<
  Size,
  { body: string; star: string; lock: string; tail: string; ghost: string; top: string }
> = {
  sm: { body: 'w-7 h-7', star: 'w-3 h-3', lock: 'w-4 h-4', tail: 'w-[4px] h-[9px]', ghost: 'w-[3px] h-[7px]', top: '-top-1.5' },
  md: { body: 'w-8 h-8', star: 'w-3.5 h-3.5', lock: 'w-[18px] h-[18px]', tail: 'w-[4px] h-[10px]', ghost: 'w-[3px] h-[8px]', top: '-top-1.5' },
  lg: { body: 'w-14 h-14', star: 'w-6 h-6', lock: 'w-8 h-8', tail: 'w-[7px] h-[17px]', ghost: 'w-[5px] h-[13px]', top: '-top-3' },
};

/** Candado con cerradura visible (ojo de cerradura recortado en el cuerpo). */
export const KeyholeLock: React.FC<{ className?: string; cutout?: string }> = ({
  className,
  cutout = 'var(--color-brand-900)',
}) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <rect x="4.5" y="10" width="15" height="11" rx="3" fill="currentColor" />
    <circle cx="12" cy="14.6" r="1.9" style={{ fill: cutout }} />
    <rect x="11.1" y="15.4" width="1.8" height="3.2" rx="0.9" style={{ fill: cutout }} />
  </svg>
);

interface LevelMedalProps {
  earned: boolean;
  size?: Size;
  /** `dark` para fondos morados oscuros (pantalla de progreso), `light` para tarjetas claras. */
  tone?: Tone;
  /** Rebote al desbloquearse (solo se anima cuando pasa a true). */
  pulse?: boolean;
}

/**
 * Medalla de nivel con el estilo de la pantalla de progreso: ganada = medalla
 * dorada con estrella y cinta; por ganar = círculo punteado con candado.
 */
export const LevelMedal: React.FC<LevelMedalProps> = ({ earned, size = 'md', tone = 'light', pulse = false }) => {
  const s = SIZES[size];
  const dark = tone === 'dark';

  return (
    <div
      className="relative flex flex-col items-center"
      role="img"
      aria-label={earned ? 'Medalla ganada' : 'Medalla bloqueada'}
    >
      <div className={`flex gap-1 absolute ${s.top} z-0 ${earned ? '' : 'opacity-75'}`} aria-hidden="true">
        {earned ? (
          <>
            <span className={`${s.tail} ${dark ? 'bg-white' : 'bg-brand'} rounded-t-sm`} />
            <span className={`${s.tail} bg-danger-500 rounded-t-sm`} />
          </>
        ) : (
          <>
            <span
              className={`${s.ghost} border-t border-l border-r border-dashed ${dark ? 'border-white/60' : 'border-gray-300'}`}
            />
            <span
              className={`${s.ghost} border-t border-l border-r border-dashed ${dark ? 'border-white/60' : 'border-gray-300'}`}
            />
          </>
        )}
      </div>
      <motion.div
        animate={{ scale: pulse ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 0.35 }}
        className={`${s.body} rounded-full flex items-center justify-center relative z-10 ${
          earned
            ? 'gold-medal shadow-md'
            : dark
              ? 'dashed-locked'
              : 'border-[1.5px] border-dashed border-gray-300 bg-gray-100'
        }`}
      >
        {earned ? (
          <Star className={`${s.star} text-warning-800 fill-current`} aria-hidden="true" />
        ) : (
          <KeyholeLock
            className={`${s.lock} ${dark ? 'text-brand-100' : 'text-gray-400'}`}
            cutout={dark ? 'var(--color-locked)' : 'var(--color-gray-100)'}
          />
        )}
      </motion.div>
    </div>
  );
};
