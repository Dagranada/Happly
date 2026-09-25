import React from 'react';
import { Send } from 'lucide-react';
import { Activity } from '../data/activities';
import { ActivityAnswer } from '../types';
import { Button } from './ui/Button';
import { BackButton } from './ui/BackButton';
import { ButtonRow } from './ui/ButtonRow';
import { MoodPicker } from './ui/MoodPicker';

interface ActivityStepProps {
  activity: Activity;
  index: number;
  total: number;
  answer: ActivityAnswer;
  onChange: (answer: ActivityAnswer) => void;
  onNext: () => void;
  onBack?: () => void;
}

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
    <form onSubmit={handleSubmit}>
      <div className="space-y-5 sm:space-y-6">
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
          className="w-full min-h-[112px] md:min-h-[56px] bg-gray-50 border-none rounded-2xl px-5 py-4 text-[16px] text-gray-800 placeholder-gray-400 resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors"
        />
      </div>

      <MoodPicker
        name={`mood-${activity.id}`}
        value={answer.mood}
        onChange={(mood) => onChange({ ...answer, mood })}
      />

      </div>

      <ButtonRow>
        {onBack && <BackButton onClick={onBack} />}
        <Button type="submit" disabled={!canContinue}>
          Enviar
          <Send className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
        </Button>
      </ButtonRow>
    </form>
  );
};
