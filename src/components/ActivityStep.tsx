import React from 'react';
import { Frown, Annoyed, Meh, Smile, Laugh, Send, type LucideIcon } from 'lucide-react';
import { Activity } from '../data/activities';
import { ActivityAnswer, Mood } from '../types';
import { Button } from './ui/Button';
import { BackButton } from './ui/BackButton';

interface ActivityStepProps {
  activity: Activity;
  index: number;
  total: number;
  answer: ActivityAnswer;
  onChange: (answer: ActivityAnswer) => void;
  onNext: () => void;
  onBack?: () => void;
}

const MOODS: { value: Mood; label: string; Icon: LucideIcon }[] = [
  { value: 1, label: 'Muy mal', Icon: Frown },
  { value: 2, label: 'Mal', Icon: Annoyed },
  { value: 3, label: 'Neutral', Icon: Meh },
  { value: 4, label: 'Bien', Icon: Smile },
  { value: 5, label: 'Muy bien', Icon: Laugh },
];

export const ActivityStep: React.FC<ActivityStepProps> = ({
  activity,
  index,
  total,
  answer,
  onChange,
  onNext,
  onBack,
}) => {
  const canContinue = answer.text.trim().length > 0 && answer.mood !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canContinue) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div>
        <p className="text-[16px] sm:text-[17px] font-semibold text-gray-900">
          Actividad {index + 1} de {total}
        </p>
        <p className="text-[13px] text-gray-500 mt-0.5">{activity.deadline}</p>
      </div>

      <h2 className="text-[26px] sm:text-[28px] md:text-[32px] font-bold text-brand leading-tight tracking-tight">
        {activity.title}
      </h2>

      <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-relaxed">{activity.description}</p>

      <div>
        <label htmlFor={`activity-${activity.id}`} className="sr-only">
          Tu respuesta
        </label>
        <textarea
          id={`activity-${activity.id}`}
          value={answer.text}
          onChange={(e) => onChange({ ...answer, text: e.target.value })}
          placeholder={activity.placeholder ?? 'Escribe aquí'}
          rows={1}
          className="w-full min-h-[112px] md:min-h-[56px] bg-white/70 border-none rounded-2xl px-5 py-4 text-[15px] sm:text-[16px] text-gray-800 placeholder-gray-400 resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-[15px] sm:text-[16px] text-gray-800 font-medium">
          ¿Cómo te sentiste realizando esta actividad?
        </legend>
        <div className="flex items-start justify-between md:justify-start md:gap-8 max-w-sm">
          {MOODS.map(({ value, label, Icon }) => {
            const selected = answer.mood === value;
            const showLabel = value === 1 || value === 5;
            return (
              <label key={value} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <input
                  type="radio"
                  name={`mood-${activity.id}`}
                  value={value}
                  checked={selected}
                  onChange={() => onChange({ ...answer, mood: value })}
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

      <div className="flex items-center gap-3.5 pt-2">
        {onBack && <BackButton onClick={onBack} />}
        <Button type="submit" disabled={!canContinue}>
          Enviar
          <Send className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
};
