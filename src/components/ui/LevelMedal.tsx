import React from 'react';
import { motion } from 'motion/react';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'dark' | 'light';

const SIZES: Record<Size, string> = {
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-14 h-14',
};

/** Todos los íconos de medallas y copas ocupan la misma proporción de su círculo. */
export const BADGE_ICON = 'w-1/2 h-1/2';

/** Medalla sólida (iconsax "medal"). */
const MedalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 15c3.728 0 6.75-2.91 6.75-6.5S15.728 2 12 2 5.25 4.91 5.25 8.5 8.272 15 12 15Z" />
    <path d="M15.79 15.609c.33-.17.71.08.71.45v4.85c0 .9-.63 1.34-1.41.97l-2.68-1.27c-.23-.1-.59-.1-.82 0l-2.68 1.27c-.78.36-1.41-.08-1.41-.98l.02-4.84c0-.37.39-.61.71-.45 1.13.57 2.41.89 3.77.89 1.36 0 2.65-.32 3.79-.89Z" />
  </svg>
);

/** Candado sólido simple. */
export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <rect x="4.5" y="10" width="15" height="11.5" rx="3" fill="currentColor" />
  </svg>
);

interface LevelMedalProps {
  earned: boolean;
  size?: Size;
  /** `dark` para el fondo lavanda de la pantalla de progreso, `light` para tarjetas blancas. */
  tone?: Tone;
  /** Rebote al desbloquearse (solo se anima cuando pasa a true). */
  pulse?: boolean;
}

/**
 * Medalla de nivel: ganada = círculo amarillo con medalla; por ganar = círculo punteado con candado.
 */
export const LevelMedal: React.FC<LevelMedalProps> = ({ earned, size = 'md', tone = 'light', pulse = false }) => {
  const dark = tone === 'dark';

  return (
    <motion.div
      role="img"
      aria-label={earned ? 'Medalla ganada' : 'Medalla bloqueada'}
      animate={{ scale: pulse ? [1, 1.35, 1] : 1 }}
      transition={{ duration: 0.35 }}
      className={`${SIZES[size]} shrink-0 rounded-full flex items-center justify-center ${
        earned
          ? 'bg-medal text-warning-800'
          : dark
            ? 'dashed-locked text-brand-100'
            : 'border-[1.5px] border-dashed border-gray-300 bg-gray-50 text-gray-400'
      }`}
    >
      {earned ? <MedalIcon className={BADGE_ICON} /> : <LockIcon className={BADGE_ICON} />}
    </motion.div>
  );
};
