import React from 'react';
import { Frown, Annoyed, Meh, Smile, Laugh, type LucideIcon } from 'lucide-react';
import type { Mood } from '../../types';

const MOODS: { value: Mood; label: string; Icon: LucideIcon }[] = [
  { value: 1, label: 'Muy mal', Icon: Frown },
  { value: 2, label: 'Mal', Icon: Annoyed },
  { value: 3, label: 'Neutral', Icon: Meh },
  { value: 4, label: 'Bien', Icon: Smile },
  { value: 5, label: 'Muy bien', Icon: Laugh },
];

interface MoodPickerProps {
  /** Prefijo único para el `name` de los radios (agrupa la selección). */
  name: string;
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

/** Selector de 5 caras reutilizado por el onboarding y por la actividad del dashboard. */
export const MoodPicker: React.FC<MoodPickerProps> = ({ name, value, onChange }) => (
  <fieldset className="space-y-3">
    <legend className="text-[15px] sm:text-[16px] text-gray-800 font-medium">
      ¿Cómo te sentiste realizando esta actividad?
    </legend>
    <div className="flex items-start justify-between md:justify-start md:gap-8 max-w-sm">
      {MOODS.map(({ value: moodValue, label, Icon }) => {
        const selected = value === moodValue;
        const showLabel = moodValue === 1 || moodValue === 5;
        return (
          <label
            key={moodValue}
            className="relative flex flex-col items-center gap-1.5 cursor-pointer group touch-manipulation"
          >
            <input
              type="radio"
              name={name}
              value={moodValue}
              checked={selected}
              onChange={() => onChange(moodValue)}
              className="sr-only peer"
              aria-label={label}
            />
            <Icon
              className={`w-9 h-9 stroke-[1.8] transition-all rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 ${
                selected ? 'text-brand scale-110' : 'text-gray-800 group-hover:text-brand'
              }`}
              aria-hidden="true"
            />
            <span
              className={`text-[12px] leading-none h-3 ${showLabel ? 'text-gray-500' : 'invisible'}`}
              aria-hidden={!showLabel}
            >
              {label}
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);
