import React from 'react';

interface ButtonRowProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center';
}

/**
 * Fila de acciones de una pantalla. Fija una única separación vertical
 * (32 px) respecto al contenido anterior en todas las pantallas con botones.
 * Debe ir como hermano del bloque de contenido, no dentro de un `space-y-*`.
 */
export const ButtonRow: React.FC<ButtonRowProps> = ({ align = 'start', className = '', children, ...rest }) => (
  <div
    className={`mt-8 flex flex-wrap items-center gap-3.5 ${align === 'center' ? 'justify-center' : ''} ${className}`}
    {...rest}
  >
    {children}
  </div>
);
