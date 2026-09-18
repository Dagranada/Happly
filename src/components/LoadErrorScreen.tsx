import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toast } from './ui/Toast';

interface LoadErrorScreenProps {
  userName: string;
  /** Acción al cerrar el banner. */
  onRetry: () => void;
  onOpenTerms?: () => void;
}

/* Filas fantasma que ocupan el sitio de las preguntas que no cargaron */
const SKELETON_ROWS = [
  { label: 'w-2/3', fields: ['w-32', 'w-32', 'w-20'] },
  { label: 'w-1/2', fields: ['w-full'] },
  { label: 'w-1/3', fields: ['w-20', 'w-20'] },
  { label: 'w-3/5', fields: ['w-full'] },
];

/**
 * Pantalla de error: no se pudo cargar la primera parte del cuestionario
 * "Conozcámonos". Muestra la cabecera real, el formulario sin contenido
 * y el banner rojo. Pertenece a la secuencia de pantallas de error.
 */
export const LoadErrorScreen: React.FC<LoadErrorScreenProps> = ({ userName, onRetry, onOpenTerms }) => (
  <div className="min-h-screen w-full bg-form text-gray-800 antialiased flex flex-col justify-between">
    <main className="flex-grow px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-28 max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto w-full flex flex-col">
      <Header currentStep={1} userName={userName} />

      <div className="space-y-7" aria-hidden="true">
        {SKELETON_ROWS.map((row, i) => (
          <div key={i} className="space-y-3">
            <div className={`h-4 rounded-full bg-gray-100 ${row.label}`} />
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {row.fields.map((w, j) => (
                <div key={j} className={`h-14 rounded-2xl bg-gray-50 ${w}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only">No se pudieron cargar las preguntas.</p>
    </main>

    {onOpenTerms && <Footer onOpenTerms={onOpenTerms} />}

    <Toast message="Algo salió mal. Intenta de nuevo por favor" variant="danger" onClose={onRetry} />
  </div>
);
