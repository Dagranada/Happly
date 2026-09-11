import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

/** Botón primario "Siguiente" con flecha, contraparte de `BackButton`. */
export const NextButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <Button type="submit" disabled={disabled}>
    Siguiente
    <ArrowRight className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
  </Button>
);
