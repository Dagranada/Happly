import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { Trophy, ArrowRight, Star, Zap, Flame, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/Button';
import { LevelMedal } from './ui/LevelMedal';
import type { CompletionResult } from '../types/gamification';
import * as sfx from '../lib/sfx';

interface ActivityCelebrationFlowProps {
  result: CompletionResult;
  streakCount: number;
  onDone: () => void;
}

const METRIC_LABEL = 'text-[12px] font-semibold tracking-widest uppercase text-white/80';
const METRIC_VALUE =
  'tabular-nums text-[26px] font-extrabold text-warning-500 leading-none mt-1.5 tracking-tight [text-shadow:0_1px_0_rgb(52_36_117/0.45)]';

/* Destellos alrededor del anillo (posición en % del contenedor) */
const SPARKLES = [
  { x: 6, y: 14, size: 16, delay: 0, gold: true },
  { x: 90, y: 10, size: 12, delay: 0.6, gold: false },
  { x: 96, y: 52, size: 18, delay: 1.1, gold: true },
  { x: 3, y: 58, size: 11, delay: 1.6, gold: false },
  { x: 14, y: 90, size: 14, delay: 0.3, gold: true },
  { x: 84, y: 92, size: 12, delay: 0.9, gold: false },
  { x: 50, y: 0, size: 10, delay: 1.4, gold: true },
  { x: 28, y: 4, size: 9, delay: 2, gold: false },
  { x: 72, y: 98, size: 10, delay: 0.2, gold: true },
];

/** Cuenta de `from` a `to` con animación; arranca cuando `enabled` pasa a true. */
function useCountUp(
  from: number,
  to: number,
  { enabled = true, delay = 0, duration = 1, onComplete, onStep }: {
    enabled?: boolean;
    delay?: number;
    duration?: number;
    onComplete?: () => void;
    /** Se llama cada vez que cambia el valor entero mostrado. */
    onStep?: (value: number) => void;
  } = {}
) {
  const [value, setValue] = useState(from);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    if (!enabled) return;
    let last = Math.round(from);
    const controls = animate(from, to, {
      delay,
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        setValue(v);
        const r = Math.round(v);
        if (r !== last) {
          last = r;
          onStepRef.current?.(r);
        }
      },
      onComplete: () => onCompleteRef.current?.(),
    });
    return () => controls.stop();
  }, [enabled, from, to, delay, duration]);

  return value;
}

const SummaryScreen: React.FC<{
  result: CompletionResult;
  streakCount: number;
  onContinue: () => void;
}> = ({ result, streakCount, onContinue }) => {
  const [showTrophy, setShowTrophy] = useState(false);
  /* 0 cargando porcentaje y barras · 1 aparece tarjeta de puntos · 2 cuentan los puntos
     3 aparece tarjeta de racha · 4 cuentan los días · 5 listo */
  const [phase, setPhase] = useState(0);
  const [filled, setFilled] = useState<Set<string>>(new Set());
  const [muted, setMutedState] = useState(sfx.isMuted());
  const medalsEarned = result.weeks.filter((w) => w.medalEarned).length;

  const progress = useCountUp(0, result.newProgress, {
    delay: 0.15,
    duration: 0.9,
    onStep: (v) => sfx.tick(v / Math.max(result.newProgress, 1)),
    onComplete: () => {
      if (result.trophyNewlyEarned) setTimeout(() => setShowTrophy(true), 200);
      setPhase(1);
    },
  });

  useEffect(() => {
    const t1 = setTimeout(() => sfx.fanfare(), 30);
    const t2 = setTimeout(() => sfx.sweep(0.9), 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase === 1 || phase === 3 || phase === 5) sfx.pop();
  }, [phase]);

  useEffect(() => {
    if (showTrophy) sfx.success();
  }, [showTrophy]);

  useEffect(() => {
    if (phase !== 1 && phase !== 3) return;
    const t = setTimeout(() => setPhase((p) => p + 1), 220);
    return () => clearTimeout(t);
  }, [phase]);

  const points = useCountUp(0, result.pointsEarned, {
    enabled: phase >= 2,
    duration: 0.6,
    onStep: (v) => sfx.tick(v / Math.max(result.pointsEarned, 1)),
    onComplete: () => setPhase(3),
  });
  const streak = useCountUp(0, streakCount, {
    enabled: phase >= 4,
    duration: 0.7,
    onStep: (v) => sfx.tick(v / Math.max(streakCount, 1)),
    onComplete: () => setPhase(5),
  });

  const shown = Math.round(progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-celebration text-white overflow-x-hidden overflow-y-auto"
    >
      <button
        type="button"
        aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
        aria-pressed={muted}
        onClick={() => {
          const next = !muted;
          sfx.setMuted(next);
          setMutedState(next);
          if (!next) sfx.click();
        }}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white/90 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer focus-ring"
      >
        {muted ? <VolumeX className="w-5 h-5" aria-hidden="true" /> : <Volume2 className="w-5 h-5" aria-hidden="true" />}
      </button>
      <div className="min-h-full max-w-md mx-auto w-full px-6 pt-10 pb-6 flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center gap-7 py-4">
          <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-[32px] font-extrabold tracking-tight leading-tight drop-shadow-sm">
              ¡Estás imparable!
            </h1>
            <p className="text-brand-200 text-[14px] font-medium mt-0.5">
              {medalsEarned} de {result.weeks.length} niveles completados
            </p>
          </motion.header>

          <section className="relative flex flex-col items-center justify-center py-2" aria-live="polite">
            <motion.div
              className="absolute w-[620px] h-[620px] hero-glow rounded-full pointer-events-none"
              animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            {SPARKLES.map((sp, i) => (
              <motion.span
                key={i}
                className="absolute pointer-events-none"
                style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
                animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.25, 1, 0.25], rotate: [0, 40, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: sp.delay, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <Star
                  className={sp.gold ? 'text-warning-200 fill-warning-200' : 'text-white fill-white'}
                  style={{ width: sp.size, height: sp.size }}
                />
              </motion.span>
            ))}

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 240, delay: 0.05 }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={shown}
              aria-label="Progreso general"
              className="relative z-10 w-[280px] h-[130px] flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {!showTrophy ? (
                  <motion.div
                    key="percent"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center leading-none select-none tabular-nums"
                  >
                    <div className="flex items-baseline font-extrabold hero-number">
                      <span className="text-[104px] tracking-tight">{shown}</span>
                      <span className="text-[50px] ml-1">%</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="trophy"
                    initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 160 }}
                    className="w-24 h-24 rounded-full gold-medal flex items-center justify-center shadow-lg"
                  >
                    <Trophy className="w-12 h-12 text-warning-800 stroke-[1.8]" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {showTrophy && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center mt-4"
              >
                <p className="text-[18px] font-bold">{result.programTitle}</p>
                <p className="text-[13.5px] text-white/85 leading-relaxed max-w-xs mt-1">
                  ¡Felicitaciones! Aprendiste a {result.skillLearned.replace(/\.$/, '')}.
                </p>
              </motion.div>
            )}
          </section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative z-10 w-full px-1"
            aria-label="Progreso por nivel"
          >
            <ol className="grid grid-cols-4 gap-2.5 items-end">
              {result.weeks.map((week, i) => {
                const newFill = Math.min(week.done / week.required, 1) * 100;
                const unlocked = week.medalEarned && filled.has(week.title);
                return (
                  <li key={week.title} className="flex flex-col items-center">
                    <div className="mb-2">
                      <LevelMedal earned={unlocked} size="md" tone="dark" pulse={unlocked} />
                    </div>
                    <div
                      className={`w-full h-3 rounded-full relative flex items-center justify-center ${
                        unlocked ? '' : 'dashed-locked'
                      }`}
                    >
                      {newFill > 0 ? (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${newFill}%` }}
                          transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          onAnimationComplete={() => {
                            setFilled((prev) => new Set(prev).add(week.title));
                            if (week.medalEarned) sfx.chime();
                          }}
                          className="absolute left-0 inset-y-0 rounded-full gold-capsule"
                        />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 relative" />
                      )}
                    </div>
                    <span
                      className={`font-semibold text-[12.5px] mt-2 ${unlocked ? 'text-warning-500' : 'text-white/80'}`}
                    >
                      {week.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </motion.section>

          <section className="relative z-10 grid grid-cols-2 gap-3" aria-label="Resumen">
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', damping: 13, stiffness: 300 }}
              className="bg-white/10 rounded-2xl py-4 px-3.5 flex flex-col items-center justify-center border border-white/10 backdrop-blur-xs shadow-2xs"
            >
              <Zap className="w-5 h-5 text-warning-500 fill-warning-500 mb-1.5" aria-hidden="true" />
              <span className={METRIC_LABEL}>Puntos</span>
              <motion.span
                animate={{ scale: phase >= 3 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className={METRIC_VALUE}
              >
                +{Math.round(points)} pts
              </motion.span>
            </motion.div>
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={phase >= 3 ? { scale: 1, opacity: 1 } : { scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', damping: 13, stiffness: 300 }}
              className="bg-white/10 rounded-2xl py-4 px-3.5 flex flex-col items-center justify-center border border-white/10 backdrop-blur-xs shadow-2xs"
            >
              <Flame className="w-5 h-5 text-warning-500 fill-warning-500 mb-1.5" aria-hidden="true" />
              <span className={METRIC_LABEL}>Racha</span>
              <motion.span
                animate={{ scale: phase >= 5 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className={METRIC_VALUE}
              >
                {Math.round(streak)} {streakCount === 1 ? 'día' : 'días'}
              </motion.span>
            </motion.div>
          </section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative z-10"
        >
          <Button
            variant="gold"
            className="w-full mt-4"
            onClick={() => {
              sfx.click();
              onContinue();
            }}
          >
            Continuar
            <ArrowRight className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

/** Pantalla posterior a una actividad: resumen animado de progreso, niveles (medallas), puntos y racha. */
export const ActivityCelebrationFlow: React.FC<ActivityCelebrationFlowProps> = ({ result, streakCount, onDone }) => (
  <SummaryScreen result={result} streakCount={streakCount} onContinue={onDone} />
);
