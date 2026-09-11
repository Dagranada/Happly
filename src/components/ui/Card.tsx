import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sin padding interno (para acordeones o listas con divisores). */
  flush?: boolean;
}

/** Superficie única de la app: blanca, radio 24 px, borde gray-100 y sombra `shadow-card`. */
export const CARD_SURFACE = 'bg-white rounded-3xl border border-gray-100 shadow-card';

export const Card: React.FC<CardProps> = ({ flush = false, className = '', children, ...rest }) => (
  <div className={`${CARD_SURFACE} ${flush ? 'overflow-hidden' : 'p-5'} ${className}`} {...rest}>
    {children}
  </div>
);
