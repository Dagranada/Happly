import React from 'react';
import { Medal, MEDAL_METALS, type Metal } from './Medal';

const PLACE_METAL: Record<1 | 2 | 3, Metal> = { 1: 'gold', 2: 'silver', 3: 'bronze' };

interface MedalIconProps {
  place: 1 | 2 | 3;
  className?: string;
}

/** Medalla del ranking (1.º, 2.º y 3.º): moneda con cinta y el puesto en el centro. */
export const MedalIcon: React.FC<MedalIconProps> = ({ place, className = 'w-8 h-10' }) => {
  const metal = PLACE_METAL[place];
  return (
    <Medal
      metal={metal}
      ribbon
      className={className}
      role="img"
      aria-label={`Medalla de ${MEDAL_METALS[metal].label}, puesto ${place}`}
    >
      <text
        x="16"
        y="16.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
        fontWeight="800"
        style={{ fill: MEDAL_METALS[metal].ink }}
      >
        {place}
      </text>
    </Medal>
  );
};
