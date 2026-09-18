import React from 'react';
import { AlarmClock } from 'lucide-react';
import { HapplyLogo } from './HapplyLogo';
import { Footer } from './Footer';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ButtonRow } from './ui/ButtonRow';

interface SuspendedActivityScreenProps {
  /** Acción del botón "Cerrar" (p. ej. volver a Inicio). */
  onClose: () => void;
  onOpenTerms?: () => void;
}

/**
 * Pantalla de error independiente: la actividad quedó suspendida por
 * alcanzar el máximo de intentos. No está conectada a la navegación;
 * se renderiza donde el flujo lo necesite: <SuspendedActivityScreen onClose={…} />
 */
export const SuspendedActivityScreen: React.FC<SuspendedActivityScreenProps> = ({ onClose, onOpenTerms }) => (
  <div className="min-h-screen w-full bg-form text-gray-800 antialiased flex flex-col justify-between">
    <main className="flex-grow px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-12 max-w-lg md:max-w-2xl mx-auto w-full flex flex-col">
      <div className="pt-12 mb-8 flex justify-center md:justify-start">
        <HapplyLogo />
      </div>

      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full p-8 sm:p-10 flex flex-col items-center text-center" role="alert">
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-brand-100 flex items-center justify-center mb-7"
            aria-hidden="true"
          >
            <AlarmClock className="w-14 h-14 sm:w-16 sm:h-16 text-brand stroke-[1.6]" />
          </div>

          <h1 className="text-[24px] sm:text-[28px] font-bold text-brand-900 tracking-tight leading-tight">
            Actividad suspendida
          </h1>

          <p className="mt-4 max-w-md text-[15px] sm:text-[16px] text-gray-700 leading-relaxed">
            Alcanzaste el número máximo de intentos permitidos para completarla, contacta al
            administrador para revisarlo
          </p>

          <ButtonRow align="center">
            <Button size="md" onClick={onClose} className="px-9">
              Cerrar
            </Button>
          </ButtonRow>
        </Card>
      </div>
    </main>

    {onOpenTerms && <Footer onOpenTerms={onOpenTerms} />}
  </div>
);
