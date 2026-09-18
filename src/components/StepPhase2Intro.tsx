import React from 'react';
import portraitImg from '../assets/images/happy_thoughtful_woman_1787882139463.jpg';
import { Button } from './ui/Button';
import { ButtonRow } from './ui/ButtonRow';

interface StepPhase2IntroProps {
  onStartPhase2: () => void;
}

const INSTRUCTIONS: React.ReactNode[] = [
  <>
    En cada bloque, elige <strong className="font-semibold text-gray-800">la opción que más concuerde</strong>{' '}
    con lo que normalmente sientes y{' '}
    <strong className="font-semibold text-gray-800">con la que más te identifiques.</strong>
  </>,
  <>
    Responde pensando específicamente en <strong className="font-semibold text-gray-800">tu trabajo.</strong>
  </>,
  <>
    <strong className="font-semibold text-gray-800">Lee todas las afirmaciones</strong> de cada grupo antes de
    elegir una.
  </>,
];

export const StepPhase2Intro: React.FC<StepPhase2IntroProps> = ({ onStartPhase2 }) => (
  <div className="pb-6 animate-in fade-in duration-300">
    <div className="space-y-6">
    {/* En desktop: ilustración a la izquierda, título e instrucciones a la derecha */}
    <div className="md:flex md:items-start md:gap-8 space-y-6 md:space-y-0">
      {/* Ilustración: blob lavanda + acento amarillo + retrato circular */}
      <div className="flex justify-center my-2 sm:my-4 md:my-0 relative md:shrink-0">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          <div
            className="absolute top-2 left-6 w-14 h-16 sm:w-16 sm:h-20 bg-accent-yellow rounded-[50%_50%_45%_55%] -rotate-12 transform -z-0 opacity-90 shadow-xs"
            aria-hidden="true"
          />
          <div
            className="absolute inset-2 bg-brand-200 rounded-[48%_52%_45%_55%/52%_48%_55%_45%] -z-0 shadow-inner"
            aria-hidden="true"
          />
          <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden flex items-end justify-center">
            <img
              src={portraitImg}
              alt="Persona reflexionando sobre su trabajo"
              className="w-full h-full object-cover object-top scale-105"
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 md:pt-2">
        <h2 className="text-[20px] sm:text-[23px] md:text-[22px] font-bold text-brand leading-snug tracking-tight">
          A continuación, verás varios bloques de afirmaciones.
        </h2>

        <ul className="space-y-3.5 text-[14.5px] sm:text-[15px] text-gray-700 leading-relaxed">
          {INSTRUCTIONS.map((content, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0" aria-hidden="true" />
              <span>{content}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <p className="text-gray-500 text-[14.5px] sm:text-[15px] leading-relaxed pt-1">
      Ten presente que no existen respuestas buenas o malas. Todas serán útiles si reflejan de forma sincera
      lo que sientes y piensas.
    </p>

    </div>

    <ButtonRow>
      <Button onClick={onStartPhase2}>Empezar</Button>
    </ButtonRow>
  </div>
);
