import React from 'react';

export type Metal = 'gold' | 'silver' | 'bronze';

/* Cada metal en tres tonos: cinta y aro (el más oscuro), cara de la moneda y contenido. */
export const MEDAL_METALS: Record<Metal, { rim: string; face: string; ink: string; label: string }> = {
  gold: { rim: '#FBC808', face: 'var(--color-gold)', ink: '#FA9706', label: 'oro' },
  silver: { rim: '#AABFD0', face: 'var(--color-silver)', ink: '#96A9B8', label: 'plata' },
  bronze: { rim: '#E58D4C', face: 'var(--color-bronze)', ink: '#ED751D', label: 'bronce' },
};

interface MedalProps {
  metal: Metal;
  /** Cinta corta bajo la moneda (solo cuando la medalla va suelta, no dentro de un anillo). */
  ribbon?: boolean;
  className?: string;
  /** Contenido centrado en la moneda, en coordenadas del SVG (cx 16, cy 16). */
  children?: React.ReactNode;
  'aria-label'?: string;
  role?: string;
}

/**
 * Moneda plana de oro, plata o bronce: aro en el tono oscuro, cara en el claro y, si se pide,
 * cinta corta rematada en V con puntas redondeadas. Base de las medallas de toda la app.
 */
export const Medal: React.FC<MedalProps> = ({ metal, ribbon = false, className, children, ...rest }) => {
  const tones = MEDAL_METALS[metal];
  return (
    <svg viewBox={ribbon ? '0 0 32 40' : '0 0 32 32'} className={className} {...rest}>
      {ribbon && (
        <path
          d="M10.5 22h11v12l-5.5-3.5-5.5 3.5Z"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ fill: tones.rim, stroke: tones.rim }}
        />
      )}
      <circle cx="16" cy="16" r="14" style={{ fill: tones.rim }} />
      <circle cx="16" cy="16" r="12" style={{ fill: tones.face }} />
      {children}
    </svg>
  );
};
