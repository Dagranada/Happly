import React from 'react';
import { FileText, UserRound, HeartPulse, ChartColumn, ClipboardList, TriangleAlert, House, type LucideIcon } from 'lucide-react';

export type NavTarget = 'terms' | 'personal' | 'test' | 'results' | 'activities' | 'errors' | 'home';

interface FloatingNavProps {
  active: NavTarget;
  onNavigate: (target: NavTarget) => void;
}

const ITEMS: { id: NavTarget; label: string; Icon: LucideIcon }[] = [
  { id: 'terms', label: 'Términos y condiciones', Icon: FileText },
  { id: 'personal', label: 'Datos personales', Icon: UserRound },
  { id: 'test', label: 'Test de felicidad', Icon: HeartPulse },
  { id: 'results', label: 'Resultados', Icon: ChartColumn },
  { id: 'activities', label: 'Actividades', Icon: ClipboardList },
  { id: 'errors', label: 'Pantallas de error', Icon: TriangleAlert },
  { id: 'home', label: 'Inicio', Icon: House },
];

/** Botonera flotante para saltar entre las pantallas principales (7 destinos). */
export const FloatingNav: React.FC<FloatingNavProps> = ({ active, onNavigate }) => (
  <nav
    aria-label="Navegación entre pantallas"
    className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 sm:gap-1 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl shadow-brand/10"
  >
    {ITEMS.map(({ id, label, Icon }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate(id)}
          aria-label={label}
          aria-current={isActive ? 'page' : undefined}
          title={label}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer focus-ring touch-manipulation ${
            isActive
              ? 'bg-brand text-white shadow-cta'
              : 'text-gray-500 hover:text-brand hover:bg-brand-50 active:scale-95'
          }`}
        >
          <Icon className="w-5 h-5 stroke-[2]" />
        </button>
      );
    })}
  </nav>
);
