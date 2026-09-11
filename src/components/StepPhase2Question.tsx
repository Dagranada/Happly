import React, { useState, useRef, useEffect } from 'react';
import { Phase2Question } from '../data/phase2Questions';
import { FormData } from '../types';
import { Button } from './ui/Button';
import { BackButton } from './ui/BackButton';
import { NextButton } from './ui/NextButton';
import { RadioOption } from './ui/RadioOption';

interface StepPhase2QuestionProps {
  question: Phase2Question;
  formData: FormData;
  updateForm: (fields: Partial<FormData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

/** Tiempo que se muestra el "parpadeo" de selección antes de auto-avanzar. */
const AUTO_ADVANCE_MS = 520;

/* Keyframes del parpadeo entre brand-100 y brand-200. motion no interpola var(), por eso hex. */
const BRAND_100 = '#EDE9FE';
const BRAND_200 = '#D8CDFB';
const BLINK_BG = [BRAND_100, BRAND_200, BRAND_100, BRAND_200, BRAND_100];

export const StepPhase2Question: React.FC<StepPhase2QuestionProps> = ({
  question,
  formData,
  updateForm,
  onNext,
  onBack,
}) => {
  // Respuesta desde el mapa phase2Answers o desde los campos legacy de Q1/Q2
  const currentAnswer =
    formData.phase2Answers[question.id] ||
    (question.id === 1 ? formData.dailyEmotions : '') ||
    (question.id === 2 ? formData.skillsDevelopment : '');

  const [animatingOptionId, setAnimatingOptionId] = useState<string | null>(null);
  const nextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = () => {
    if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
  };

  useEffect(() => clearPending, [question.id]);

  const handleSelectOption = (optionId: string) => {
    clearPending();
    setAnimatingOptionId(optionId);

    const updates: Partial<FormData> = {
      phase2Answers: { ...formData.phase2Answers, [question.id]: optionId },
    };
    if (question.id === 1) updates.dailyEmotions = optionId;
    if (question.id === 2) updates.skillsDevelopment = optionId;
    updateForm(updates);

    nextTimeoutRef.current = setTimeout(onNext, AUTO_ADVANCE_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearPending();
    if (currentAnswer) onNext();
  };

  const isLastQuestion = question.id === 10;
  const submitText = question.submitLabel || (isLastQuestion ? 'Terminar' : 'Siguiente');

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between animate-in fade-in duration-300">
      <fieldset className="space-y-4">
        <legend className="text-[17px] sm:text-[19px] md:text-[20px] font-medium text-gray-800 tracking-tight">
          {question.prompt}
        </legend>

        <div className="space-y-3 sm:space-y-3.5 pt-1">
          {question.options.map((opt) => {
            const selected = currentAnswer === opt.id;
            const isBlinking = animatingOptionId === opt.id;

            return (
              <RadioOption
                key={opt.id}
                name={`phase2-question-${question.id}`}
                value={opt.id}
                checked={selected}
                onChange={() => handleSelectOption(opt.id)}
                label={opt.label}
                className="sm:py-4 sm:gap-4"
                whileTap={{ scale: 0.985 }}
                animate={
                  isBlinking
                    ? { scale: [1, 1.02, 0.99, 1.01, 1], backgroundColor: BLINK_BG }
                    : { scale: 1, backgroundColor: selected ? BLINK_BG[0] : '#ffffff' }
                }
                transition={{ duration: isBlinking ? 0.45 : 0.2, ease: 'easeInOut' }}
              />
            );
          })}
        </div>
      </fieldset>

      <div className="pt-6 sm:pt-8 pb-4 flex items-center gap-3.5">
        {onBack && (
          <BackButton
            onClick={() => {
              clearPending();
              onBack();
            }}
          />
        )}
        {submitText === 'Siguiente' ? (
          <NextButton disabled={!currentAnswer} />
        ) : (
          <Button type="submit" disabled={!currentAnswer}>
            {submitText}
          </Button>
        )}
      </div>
    </form>
  );
};
