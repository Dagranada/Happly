import React from 'react';

/* Metal plano según el puesto: borde de la moneda (tono más oscuro), cara y color del número. */
const METALS: Record<1 | 2 | 3, { rim: string; face: string; text: string; label: string }> = {
  1: { rim: '#F2B92E', face: 'var(--color-medal)', text: 'var(--color-warning-800)', label: 'oro' },
  2: { rim: '#B8BEC9', face: 'var(--color-silver)', text: 'var(--color-gray-700)', label: 'plata' },
  3: { rim: '#D18A55', face: 'var(--color-bronze)', text: '#8A4A1C', label: 'bronce' },
};

interface MedalIconProps {
  place: 1 | 2 | 3;
  className?: string;
}

/**
 * Medalla del ranking (1.º, 2.º y 3.º): cinta corta en V en morado oscuro y claro de la marca y
 * moneda plana de oro, plata o bronce (borde más oscuro y cara) con el puesto adentro.
 */
export const MedalIcon: React.FC<MedalIconProps> = ({ place, className = 'w-8 h-10' }) => {
  const metal = METALS[place];
  return (
    <svg viewBox="0 0 32 40" className={className} role="img" aria-label={`Medalla de ${metal.label}, puesto ${place}`}>
      {/* cinta corta en V: morado oscuro y morado claro de la marca */}
      <path d="M4.5 3h7.5l6 12h-7.5Z" style={{ fill: 'var(--color-brand)' }} />
      <path d="M27.5 3H20l-6 12h7.5Z" style={{ fill: 'var(--color-brand-200)' }} />
      {/* moneda: borde y cara (tapa la cinta: solo asoman dos "cachitos" arriba) */}
      <circle cx="16" cy="25" r="14" style={{ fill: metal.rim }} />
      <circle cx="16" cy="25" r="11" style={{ fill: metal.face }} />
      <text
        x="16"
        y="25.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="800"
        style={{ fill: metal.text }}
      >
        {place}
      </text>
    </svg>
  );
};
