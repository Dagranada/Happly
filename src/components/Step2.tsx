import React from 'react';
import { FormData } from '../types';
import { BackButton } from './ui/BackButton';
import { NextButton } from './ui/NextButton';
import { ButtonRow } from './ui/ButtonRow';
import { RadioOption } from './ui/RadioOption';

interface Step2Props {
  formData: FormData;
  updateForm: (fields: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

type YesNoField = keyof Pick<
  FormData,
  'incomeCoversNeeds' | 'hasSupportNetwork' | 'hasSpiritualPsychSupport' | 'hasTeamInCharge'
>;

const YES_NO_QUESTIONS: { field: YesNoField; title: string }[] = [
  { field: 'incomeCoversNeeds', title: 'Tus ingresos actuales, ¿alcanzan a cubrir tus necesidades?' },
  { field: 'hasSupportNetwork', title: '¿Cuentas con amigos o familiares cercanos que te apoyen?' },
  { field: 'hasSpiritualPsychSupport', title: '¿Cuentas con algún tipo de acompañamiento psicológico/espiritual?' },
  { field: 'hasTeamInCharge', title: 'Actualmente, ¿tienes personas a cargo en tu empleo?' },
];

const WORK_PREFERENCE_OPTIONS = [
  'Tener la oportunidad de alcanzar metas desafiantes.',
  'Influir en las decisiones y asumir roles de liderazgo.',
  'Mantener relaciones cercanas y positivas con los demás.',
];

const QUESTION = 'text-[16px] text-gray-800 font-medium leading-snug';

export const Step2: React.FC<Step2Props> = ({ formData, updateForm, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-7">
      {YES_NO_QUESTIONS.map(({ field, title }) => (
        <fieldset key={field} className="space-y-3">
          <legend className={QUESTION}>{title}</legend>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {(['si', 'no'] as const).map((v) => (
              <RadioOption
                key={v}
                name={field}
                value={v}
                checked={formData[field] === v}
                onChange={() => updateForm({ [field]: v })}
                label={v === 'si' ? 'Sí' : 'No'}
                                className="gap-2 pr-5"
              />
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset className="space-y-3">
        <legend className={QUESTION}>Yo prefiero un trabajo en donde</legend>
        <div className="space-y-3.5 sm:space-y-4">
          {WORK_PREFERENCE_OPTIONS.map((option) => (
            <RadioOption
              key={option}
              name="workPreferenceText"
              value={option}
              checked={formData.workPreferenceText === option}
              onChange={() => updateForm({ workPreferenceText: option })}
              label={option}
              className="sm:py-4 sm:gap-4"
            />
          ))}
        </div>
      </fieldset>

      </div>

      <ButtonRow>
        <BackButton onClick={onBack} />
        <NextButton />
      </ButtonRow>
    </form>
  );
};
