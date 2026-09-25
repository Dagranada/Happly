import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send } from 'lucide-react';
import { HapplyLogo } from './HapplyLogo';
import { Button } from './ui/Button';
import { ButtonRow } from './ui/ButtonRow';
import { MoodPicker } from './ui/MoodPicker';
import type { DashboardActivity } from '../types/gamification';
import type { ActivityAnswer, Mood } from '../types';

interface ActivityDetailScreenProps {
  activity: DashboardActivity;
  onClose: () => void;
  onSubmit: (answer: ActivityAnswer) => void;
}

/**
 * Pantalla única de actividad (reemplaza los dos botones "Realizar
 * actividad" desconectados de Inicio y Programa). El botón "Enviar" es el
 * único punto que finaliza la actividad y dispara la celebración.
 */
export const ActivityDetailScreen: React.FC<ActivityDetailScreenProps> = ({ activity, onClose, onSubmit }) => {
  const [text, setText] = useState(activity.answer?.text ?? '');
  const [mood, setMood] = useState<Mood | null>(activity.answer?.mood ?? null);

  const canSubmit = text.trim().length > 0 && mood !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || mood === null) return;
    onSubmit({ text: text.trim(), mood });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-form overflow-y-auto"
    >
      <div className="max-w-lg mx-auto w-full px-4 sm:px-6 pt-5 sm:pt-6 pb-10">
        <div className="flex items-center justify-between py-2.5 mb-4">
          <HapplyLogo />
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer focus-ring"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 sm:space-y-6">
            <div>
              <p className="text-[16px] sm:text-[17px] font-semibold text-gray-900">{activity.dayLabel}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{activity.dateLabel}</p>
            </div>

            <h2 className="text-[26px] sm:text-[28px] md:text-[32px] font-bold text-brand leading-tight tracking-tight">
              {activity.title}
            </h2>

            <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-relaxed">{activity.description}</p>

            <div>
              <label htmlFor={`activity-detail-${activity.id}`} className="sr-only">
                Tu respuesta
              </label>
              <textarea
                id={`activity-detail-${activity.id}`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe aquí"
                rows={1}
                className="w-full min-h-[112px] md:min-h-[56px] bg-gray-50 border-none rounded-2xl px-5 py-4 text-[16px] text-gray-800 placeholder-gray-400 resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors"
              />
            </div>

            <MoodPicker name={`mood-${activity.id}`} value={mood} onChange={setMood} />
          </div>

          <ButtonRow>
            <Button type="submit" disabled={!canSubmit}>
              Enviar
              <Send className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            </Button>
          </ButtonRow>
        </form>
      </div>
    </motion.div>
  );
};
