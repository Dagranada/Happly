import React from 'react';

interface ButtonRowProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center';
}

/**
 * Fila de acciones de una pantalla. Fija una única separación vertical
 * (32 px) respecto al contenido anterior en todas las pantallas con botones.
 * Debe ir como hermano del bloque de contenido, no dentro de un `space-y-*`.
 *
 * En móvil los botones nunca se apilan: cuando hay más de uno, comparten la
 * fila a partes iguales (`flex-1`); desde `sm` recuperan su ancho natural.
 */
export const ButtonRow: React.FC<ButtonRowProps> = ({ align = 'start', className = '', children, ...rest }) => (
  <div
    className={`mt-8 flex flex-nowrap items-center gap-3 sm:gap-3.5 [&>:not(:only-child)]:flex-1 sm:[&>:not(:only-child)]:flex-none [&>:not(:only-child)]:min-w-0 ${align === 'center' ? 'justify-center' : ''} ${className}`}
    {...rest}
  >
    {children}
  </div>
);
