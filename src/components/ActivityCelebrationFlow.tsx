import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { ArrowRight, Star, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/Button';
import { LevelMedal } from './ui/LevelMedal';
import type { CompletionResult } from '../types/gamification';
import * as sfx from '../lib/sfx';

/* Three.js solo se descarga cuando se llega a la copa. */
const loadTrophy3D = () => import('./ui/Trophy3D');
const Trophy3D = lazy(loadTrophy3D);

interface ActivityCelebrationFlowProps {
  result: CompletionResult;
  streakCount: number;
  onDone: () => void;
}

const METRIC_LABEL = 'text-[12px] font-semibold tracking-widest uppercase text-white/90';
const METRIC_VALUE =
  'tabular-nums text-[26px] font-extrabold text-cream leading-none mt-1.5 tracking-tight';

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
  /* La atención va de a una cosa: porcentaje → barra del nivel → medalla (si aplica)
     → puntos → racha → (con copa) el 100% se vuelve copa. */
  const isTrophy = result.trophyNewlyEarned;
  const [barsStarted, setBarsStarted] = useState(false);
  /* Con copa, la animación espera a que el modelo 3D esté listo para que no haya tirones a mitad. */
  const [ready, setReady] = useState(!isTrophy);
  const [medalsShown, setMedalsShown] = useState<Set<string>>(new Set());
  /* Cada nivel muestra sin animar lo que ya tenía; solo se anima el avance de esta actividad. */
  const fillOf = (done: number, required: number) => Math.min(done / required, 1) * 100;
  const barCount = result.weeks.filter((w) => fillOf(w.done, w.required) > fillOf(w.prevDone ?? w.done, w.required)).length;
  const isMedalNew = (w: CompletionResult['weeks'][number]) => w.medalEarned && (w.prevDone ?? w.done) < w.required;
  const medalCount = result.weeks.filter(isMedalNew).length;
  /* Niveles ya desbloqueados en pantalla (la medalla nueva cuenta cuando aparece). */
  const unlockedCount = result.weeks.filter((w) => w.medalEarned && (!isMedalNew(w) || medalsShown.has(w.title))).length;
  const [muted, setMutedState] = useState(sfx.isMuted());

  const progress = useCountUp(0, result.newProgress, {
    enabled: ready,
    delay: 0.15,
    duration: 0.9,
    onStep: (v) => sfx.tick(v / Math.max(result.newProgress, 1)),
    onComplete: () => setBarsStarted(true),
  });

  /* Cuando termina de llenarse la barra, la medalla se desbloquea como un momento aparte. */
  useEffect(() => {
    const timers = result.weeks
      .filter((w) => isMedalNew(w) && filled.has(w.title) && !medalsShown.has(w.title))
      .map((w) =>
        setTimeout(() => {
          setMedalsShown((prev) => new Set(prev).add(w.title));
          sfx.chime();
        }, 350)
      );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled, medalsShown]);

  /* Recién entonces aparecen los puntos. */
  useEffect(() => {
    if (phase !== 0 || !barsStarted || filled.size < barCount || medalsShown.size < medalCount) return;
    const t = setTimeout(() => setPhase(1), 300);
    return () => clearTimeout(t);
  }, [phase, barsStarted, filled, medalsShown, barCount, medalCount]);

  useEffect(() => {
    if (isTrophy) void loadTrophy3D();
  }, [isTrophy]);

  useEffect(() => {
    if (!isTrophy || phase !== 5) return;
    const t = setTimeout(() => setShowTrophy(true), 500);
    return () => clearTimeout(t);
  }, [isTrophy, phase]);

  useEffect(() => {
    if (!ready) return;
    const t1 = setTimeout(() => sfx.fanfare(), 30);
    const t2 = setTimeout(() => sfx.sweep(0.9), 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready]);

  useEffect(() => {
    if (phase === 1 || phase === 3 || phase === 5) sfx.pop();
  }, [phase]);

  useEffect(() => {
    if (showTrophy) sfx.trophy();
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
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-brand-900/40 text-white flex items-center justify-center hover:bg-brand-900/55 transition-colors cursor-pointer focus-ring"
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={showTrophy ? 'won' : 'going'}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
              >
                <h1 className="text-[32px] font-extrabold tracking-tight leading-tight drop-shadow-sm">
                  {showTrophy ? '¡Felicitaciones!' : '¡Estás imparable!'}
                </h1>
                <p className="text-white/90 text-[14px] font-medium mt-0.5">
                  {showTrophy
                    ? `Ganaste la copa de ${result.programTitle.charAt(0).toLowerCase()}${result.programTitle.slice(1)}`
                    : `${unlockedCount} de ${result.weeks.length} niveles completados`}
                </p>
              </motion.div>
            </AnimatePresence>
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
                  className={sp.gold ? 'text-cream fill-cream' : 'text-white fill-white'}
                  style={{ width: sp.size, height: sp.size }}
                />
              </motion.span>
            ))}

            <motion.div
              initial={{ scale: 0.85, opacity: 0, height: 130 }}
              animate={{ scale: 1, opacity: 1, height: showTrophy ? 210 : 130 }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 240,
                delay: 0.05,
                height: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={shown}
              aria-label="Progreso general"
              className="relative z-10 w-[280px] flex items-center justify-center"
            >
              {showTrophy && (
                <motion.div
                  className="absolute left-1/2 top-1/2 -ml-[280px] -mt-[280px] pointer-events-none"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                >
                  <motion.div
                    className="sunburst w-[560px] h-[560px] rounded-full will-change-transform"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              )}
              <AnimatePresence>
                {!showTrophy && (
                  <motion.div
                    key="percent"
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex flex-col items-center justify-center leading-none select-none tabular-nums"
                  >
                    <div className="flex items-baseline font-extrabold hero-number">
                      <span className="text-[104px] tracking-tight">{shown}</span>
                      <span className="text-[50px] ml-1">%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {isTrophy && (
                /* La copa se monta (y se compila) desde el inicio, oculta; así no hay tirón al aparecer. */
                <motion.div
                  initial={false}
                  animate={showTrophy ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
                  transition={{ type: 'spring', damping: 11, stiffness: 150, delay: showTrophy ? 0.1 : 0 }}
                  className="absolute left-1/2 top-1/2 -ml-[130px] -mt-[130px] w-[260px] h-[260px]"
                  aria-hidden={!showTrophy}
                >
                  <Suspense fallback={null}>
                    <Trophy3D className="w-full h-full" active={showTrophy} onReady={() => setReady(true)} />
                  </Suspense>
                </motion.div>
              )}
            </motion.div>

          </section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative z-10 w-full px-1"
            aria-label="Progreso por nivel"
          >
            <ol className="grid grid-cols-4 gap-2.5 items-end">
              {result.weeks.map((week) => {
                const newFill = fillOf(week.done, week.required);
                const prevFill = fillOf(week.prevDone ?? week.done, week.required);
                const animates = newFill > prevFill;
                const medalNew = isMedalNew(week);
                const unlocked = week.medalEarned && (!medalNew || medalsShown.has(week.title));
                return (
                  <li key={week.title} className="flex flex-col items-center">
                    <div className="mb-2">
                      <LevelMedal earned={unlocked} size="md" tone="dark" pulse={medalNew && unlocked} />
                    </div>
                    <div
                      className={`w-full h-3 rounded-full relative flex items-center justify-center ${
                        unlocked ? '' : 'track-locked'
                      }`}
                    >
                      {newFill > 0 && (
                        <motion.div
                          initial={{ width: `${prevFill}%` }}
                          animate={{ width: `${animates && barsStarted ? newFill : prevFill}%` }}
                          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                          onAnimationComplete={() => {
                            if (!animates || !barsStarted) return;
                            setFilled((prev) => new Set(prev).add(week.title));
                          }}
                          className="absolute left-0 inset-y-0 rounded-full cream-capsule"
                        />
                      )}
                    </div>
                    <span
                      className={`font-semibold text-[12.5px] mt-2 ${unlocked ? 'text-cream' : 'text-white/70'}`}
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
              className="bg-white/15 rounded-2xl py-4 px-3.5 flex flex-col items-center justify-center border border-white/20"
            >
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
              className="bg-white/15 rounded-2xl py-4 px-3.5 flex flex-col items-center justify-center border border-white/20"
            >
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

/** Caso 100%: el mismo resultado con todos los niveles ganados y la copa recién obtenida. */
function trophyCase(result: CompletionResult): CompletionResult {
  return {
    ...result,
    prevProgress: 80,
    newProgress: 100,
    trophyNewlyEarned: true,
    /* Los niveles 1 a 3 ya estaban ganados; el 4 solo completa su última actividad. */
    weeks: result.weeks.map((w, i, all) => ({
      ...w,
      done: w.required,
      prevDone: i === all.length - 1 ? w.required - 1 : w.required,
      medalEarned: true,
    })),
  };
}

/**
 * Pantalla posterior a una actividad: resumen animado de progreso, niveles (medallas), puntos y racha.
 * Si aún no se gana la copa, a continuación se muestra el caso 100% (el número se vuelve copa 3D).
 */
export const ActivityCelebrationFlow: React.FC<ActivityCelebrationFlowProps> = ({ result, streakCount, onDone }) => {
  const [stage, setStage] = useState<0 | 1>(0);
  const showTrophyCase = !result.trophyNewlyEarned;

  /* Mientras se ve la primera pantalla, se descarga la copa 3D para la siguiente. */
  useEffect(() => {
    if (showTrophyCase) void loadTrophy3D();
  }, [showTrophyCase]);

  if (stage === 1) {
    return <SummaryScreen key="trophy" result={trophyCase(result)} streakCount={streakCount} onContinue={onDone} />;
  }
  return (
    <SummaryScreen
      key="progress"
      result={result}
      streakCount={streakCount}
      onContinue={showTrophyCase ? () => setStage(1) : onDone}
    />
  );
};
