import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { FormData } from '../types';
import { BackButton } from './ui/BackButton';
import { NextButton } from './ui/NextButton';
import { RadioOption } from './ui/RadioOption';

interface Step1Props {
  formData: FormData;
  updateForm: (fields: Partial<FormData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

const GENDER_OPTIONS: { value: FormData['gender']; label: string }[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
];

const LABEL = 'block text-[16px] sm:text-[17px] md:text-[18px] text-gray-800 mb-3 font-medium';
const INPUT =
  'min-h-[56px] bg-white border-none rounded-2xl px-5 text-[15px] sm:text-[16px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors';

export const Step1: React.FC<Step1Props> = ({ formData, updateForm, onNext, onBack }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    try {
      dateInputRef.current?.showPicker?.();
    } catch {
      dateInputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <fieldset>
        <legend className={LABEL}>¿Con cual género te identificas?</legend>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {GENDER_OPTIONS.map((opt) => (
            <RadioOption
              key={opt.value}
              name="gender"
              value={opt.value}
              checked={formData.gender === opt.value}
              onChange={() => updateForm({ gender: opt.value })}
              label={opt.label}
              className="gap-2 pr-5"
            />
          ))}
        </div>
      </fieldset>

      <div>
        <label className={LABEL} htmlFor="dob">
          Fecha de nacimiento
        </label>
        <div className="relative">
          <input
            id="dob"
            ref={dateInputRef}
            type="date"
            value={formData.birthDate}
            onChange={(e) => updateForm({ birthDate: e.target.value })}
            onClick={openPicker}
            onFocus={openPicker}
            className={`w-full ${INPUT} cursor-pointer appearance-none`}
          />
          <button
            type="button"
            aria-label="Abrir calendario"
            onClick={openPicker}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors cursor-pointer focus-ring rounded"
          >
            <Calendar className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>
      </div>

      <fieldset>
        <legend className={LABEL}>¿Tienes pareja?</legend>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          <RadioOption
            name="relationship"
            value="si"
            checked={formData.hasPartner === 'si'}
            onChange={() => updateForm({ hasPartner: 'si' })}
            label="Si"
                        className="gap-2 pr-5"
          />
          <RadioOption
            name="relationship"
            value="no"
            checked={formData.hasPartner === 'no'}
            onChange={() => updateForm({ hasPartner: 'no' })}
            label="No"
                        className="gap-2 pr-5"
          />
        </div>
      </fieldset>

      <div>
        <label className={LABEL} htmlFor="profession">
          ¿Cuál es tu profesión/ocupación?
        </label>
        <input
          id="profession"
          type="text"
          placeholder="Escribe aquí"
          value={formData.profession}
          onChange={(e) => updateForm({ profession: e.target.value })}
          className={`w-full ${INPUT}`}
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="children">
          ¿Cuántos hijos tienes?
        </label>
        <input
          id="children"
          type="number"
          min="0"
          max="20"
          placeholder="0"
          value={formData.childrenCount}
          onChange={(e) => updateForm({ childrenCount: e.target.value })}
          className={`w-24 sm:w-28 ${INPUT}`}
        />
      </div>

      <div className="flex items-center gap-3.5 pt-4 sm:pt-6">
        {onBack && (
          <BackButton onClick={onBack} />
        )}
        <NextButton />
      </div>
    </form>
  );
};
