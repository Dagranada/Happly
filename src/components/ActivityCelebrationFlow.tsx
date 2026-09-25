import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Check, ArrowRight, Award } from 'lucide-react';
import { Button } from './ui/Button';
import { MedalIcon } from './ui/MedalIcon';
import type { CompletionResult } from '../types/gamification';

const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

type Stage = 'progress' | 'streak' | 'medal';

interface ActivityCelebrationFlowProps {
  result: CompletionResult;
  streakCount: number;
  completedDays: Set<number>;
  simDay: number;
  onDone: () => void;
}

const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-form flex flex-col items-center justify-center px-6 py-10 text-center"
  >
    {children}
  </motion.div>
);

const ProgressCelebrationScreen: React.FC<{ result: CompletionResult; onContinue: () => void }> = ({
  result,
  onContinue,
}) => {
  const [showTrophy, setShowTrophy] = useState(false);

  return (
    <Screen>
      <div className="w-full max-w-sm bg-brand text-white rounded-3xl p-7 sm:p-8 shadow-lg shadow-brand/20 relative overflow-hidden">
        <div
          className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"
          aria-hidden="true"
        />
        <AnimatePresence mode="wait">
          {!showTrophy ? (
            <motion.div key="progress" exit={{ opacity: 0 }} className="space-y-5">
              <p className="text-[15px] font-medium text-white/90">¡Actividad completada!</p>
              <p className="text-[40px] font-extrabold tracking-tight">+{result.pointsEarned} pts</p>
              <div className="space-y-1.5 pt-1 text-left">
                <div className="flex items-center justify-between text-[15px] font-bold">
                  <span>Progreso general</span>
                  <span>{result.newProgress}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={result.newProgress}
                  className="w-full h-2 bg-white/30 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: `${result.prevProgress}%` }}
                    animate={{ width: `${result.newProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                    onAnimationComplete={() => {
                      if (result.trophyNewlyEarned) setTimeout(() => setShowTrophy(true), 300);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="trophy"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-warning-500 flex items-center justify-center shadow-lg shadow-warning-500/30">
                <Trophy className="w-10 h-10 text-white stroke-[1.8]" />
              </div>
              <p className="text-[20px] font-bold">{result.programTitle}</p>
              <p className="text-[14px] text-white/90 leading-relaxed">
                ¡Felicitaciones! Completaste "{result.programTitle}". Aprendiste a {result.skillLearned.replace(/\.$/, '')}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button className="mt-8" onClick={onContinue}>
        Continuar
        <ArrowRight className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
      </Button>
    </Screen>
  );
};

const StreakCelebrationScreen: React.FC<{
  streakCount: number;
  completedDays: Set<number>;
  simDay: number;
  onContinue: () => void;
}> = ({ streakCount, completedDays, simDay, onContinue }) => {
  /* No hay calendario real (sin persistencia): la tira solo ubica el
     contador `simDay` dentro de una semana de 7 casillas de demo. */
  const todayIndex = simDay % 7;

  return (
    <Screen>
      <div className="w-16 h-16 rounded-full bg-warning-100 flex items-center justify-center mb-2">
        <Flame className="w-9 h-9 text-warning-500 stroke-[1.8]" />
      </div>
      <p className="text-[48px] font-extrabold text-gray-900 leading-none tabular-nums">{streakCount}</p>
      <p className="text-[16px] font-semibold text-gray-800 mb-6">días de racha</p>
      <div className="flex items-center gap-2.5" role="group" aria-label="Días de la semana">
        {DAY_LABELS.map((label, i) => {
          const dayNumber = simDay - todayIndex + i;
          const done = completedDays.has(dayNumber);
          const isToday = i === todayIndex;
          return (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  done ? 'bg-success-500 text-white' : isToday ? 'border-2 border-brand' : 'bg-gray-100'
                }`}
              >
                {done && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <span className="text-[11px] text-gray-500">{label}</span>
            </div>
          );
        })}
      </div>
      <Button className="mt-8" onClick={onContinue}>
        Continuar
      </Button>
    </Screen>
  );
};

const WeeklyMedalCelebrationScreen: React.FC<{ weekTitle: string; onContinue: () => void }> = ({
  weekTitle,
  onContinue,
}) => (
  <Screen>
    <MedalIcon size="lg" earned label={<Award className="w-7 h-7" />} />
    <p className="text-[20px] font-bold text-gray-900 mt-5">¡Ganaste la medalla semanal!</p>
    <p className="text-[14px] text-gray-600 mt-1.5 max-w-xs">
      Completaste suficientes actividades de "{weekTitle}" para llevarte esta medalla.
    </p>
    <Button className="mt-8" onClick={onContinue}>
      Continuar
    </Button>
  </Screen>
);

/** Secuencia de celebración disparada al enviar una actividad: puntos y
 *  progreso (con transformación a trofeo si corresponde) → racha → medalla
 *  semanal (solo si se ganó justo ahora). */
export const ActivityCelebrationFlow: React.FC<ActivityCelebrationFlowProps> = ({
  result,
  streakCount,
  completedDays,
  simDay,
  onDone,
}) => {
  const [stage, setStage] = useState<Stage>('progress');

  if (stage === 'progress') {
    return <ProgressCelebrationScreen result={result} onContinue={() => setStage('streak')} />;
  }

  if (stage === 'streak') {
    return (
      <StreakCelebrationScreen
        streakCount={streakCount}
        completedDays={completedDays}
        simDay={simDay}
        onContinue={() => (result.medalNewlyEarned ? setStage('medal') : onDone())}
      />
    );
  }

  return <WeeklyMedalCelebrationScreen weekTitle={result.weekTitle} onContinue={onDone} />;
};
