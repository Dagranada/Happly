import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

/** Botón secundario "Volver" con flecha, usado en la botonera de cada paso. */
export const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button variant="secondary" onClick={onClick}>
    <ArrowLeft className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
    Volver
  </Button>
);
