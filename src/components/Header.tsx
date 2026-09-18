import React from 'react';
import { HapplyLogo } from './HapplyLogo';

interface HeaderProps {
  currentStep: number;
  userName: string;
}

const PHASE1_PROGRESS: Record<number, number> = { 1: 33, 2: 66, 3: 100 };

const getProgress = (step: number): number | null => {
  if (step >= 1 && step <= 3) return PHASE1_PROGRESS[step];
  if (step === 4) return 0;
  if (step >= 5 && step <= 14) return Math.round(((step - 4) / 10) * 100);
  return null;
};

const getTitleSuffix = (step: number) => {
  if (step === 0) return ', conoce las reglas';
  if (step >= 4 && step <= 14) return ', cuéntanos más de ti';
  return ', conozcámonos';
};

export const Header: React.FC<HeaderProps> = ({ currentStep, userName }) => {
  if (currentStep === 15) {
    return (
      <header className="mb-6 sm:mb-8 text-center">
        <div className="pt-12 mb-3 sm:mb-4 flex justify-center">
          <HapplyLogo />
        </div>
        <h1 className="text-[26px] sm:text-[30px] md:text-[32px] font-extrabold text-gray-900 tracking-tight">
          Tus resultados
        </h1>
      </header>
    );
  }

  if (currentStep >= 16) {
    return (
      <header className="mb-6 sm:mb-8">
        <div className="pt-12">
          <HapplyLogo />
        </div>
      </header>
    );
  }

  const progress = getProgress(currentStep);

  return (
    <header className="mb-6 sm:mb-8">
      <div className="pt-12 mb-4 sm:mb-6">
        <HapplyLogo />
      </div>

      <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-gray-900 tracking-tight leading-tight mb-3 sm:mb-4">
        {userName}
        {getTitleSuffix(currentStep)}
      </h1>

      {progress !== null && (
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="w-full bg-gray-200 h-2 rounded-full overflow-hidden"
        >
          <div
            className="bg-brand h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
};
