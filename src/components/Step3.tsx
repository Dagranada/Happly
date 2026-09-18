import React from 'react';
import { FormData } from '../types';
import { Button } from './ui/Button';
import { BackButton } from './ui/BackButton';
import { ButtonRow } from './ui/ButtonRow';
import { RadioOption } from './ui/RadioOption';

interface Step3Props {
  formData: FormData;
  updateForm: (fields: Partial<FormData>) => void;
  onFinish: () => void;
  onBack: () => void;
}

const PREFERENCE_OPTIONS: { id: Exclude<FormData['workPreferenceChoice'], ''>; label: string }[] = [
  { id: 'goals', label: 'Tener la oportunidad de alcanzar metas desafiantes.' },
  { id: 'leadership', label: 'Influir en las decisiones y asumir roles de liderazgo' },
  { id: 'relationships', label: 'Mantener relaciones cercanas y positivas con los demás' },
];

export const Step3: React.FC<Step3Props> = ({ formData, updateForm, onFinish, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend className="text-[18px] sm:text-[20px] md:text-[21px] font-semibold text-gray-800 mb-6">
          Yo prefiero un trabajo en donde
        </legend>
        <div className="space-y-3.5 sm:space-y-4">
          {PREFERENCE_OPTIONS.map((opt) => (
            <RadioOption
              key={opt.id}
              name="workPreferenceChoice"
              value={opt.id}
              checked={formData.workPreferenceChoice === opt.id}
              onChange={() => updateForm({ workPreferenceChoice: opt.id })}
              label={opt.label}
              className="sm:py-4 sm:gap-4"
            />
          ))}
        </div>
      </fieldset>

      <ButtonRow>
        <BackButton onClick={onBack} />
        <Button type="submit">Terminar</Button>
      </ButtonRow>
    </form>
  );
};
