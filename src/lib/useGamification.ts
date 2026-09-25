import { useCallback, useState } from 'react';
import type { ActivityAnswer } from '../types';
import type { CompletionResult, DashboardActivity, DashboardProgram } from '../types/gamification';
import { CURRENT_PROGRAM, OTHER_PROGRAMS } from '../data/program';

/** Medalla semanal: completar al menos 3 de las 5 actividades de la semana. */
const WEEKLY_MEDAL_MIN = 3;
/** Trofeo mensual: ganar al menos 3 de las 4 medallas semanales del programa. */
const MONTHLY_TROPHY_MIN_MEDALS = 3;

function cloneProgram(program: DashboardProgram): DashboardProgram {
  return {
    ...program,
    weeks: program.weeks.map((week) => ({
      ...week,
      activities: week.activities.map((activity) => ({ ...activity })),
    })),
  };
}

function flatten(program: DashboardProgram): DashboardActivity[] {
  return program.weeks.flatMap((week) => week.activities);
}

/**
 * El trofeo "completa" el mes para efectos de la barra: una vez se gana,
 * la barra general marca 100% aunque falten actividades sueltas por hacer,
 * igual que la medalla semanal no exige el 5/5 sino un mínimo (3/5).
 */
function progressPercentOf(program: DashboardProgram): number {
  if (program.trophyEarned) return 100;
  const all = flatten(program);
  if (all.length === 0) return 0;
  const done = all.filter((a) => a.status === 'completada').length;
  return Math.round((done / all.length) * 100);
}

export function useGamification(seedProgram: DashboardProgram = CURRENT_PROGRAM) {
  const [program, setProgram] = useState<DashboardProgram>(() => cloneProgram(seedProgram));
  const [pointsCount, setPointsCount] = useState(50);
  const [streakCount, setStreakCount] = useState(4);
  const [bestStreak, setBestStreak] = useState(4);
  /* No hay persistencia ni backend: los "días" se simulan con un contador
     en memoria para poder probar la regla de racha dentro de una sesión. */
  const [simDay, setSimDay] = useState(10);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set([7, 8, 9, 10]));
  const [lastActivityDay, setLastActivityDay] = useState<number | null>(10);

  const addPoints = useCallback((amount: number) => setPointsCount((p) => p + amount), []);

  const todayActivity = flatten(program).find((a) => a.actionable) ?? null;
  const progressPercent = progressPercentOf(program);
  const activitiesDone = flatten(program).filter((a) => a.status === 'completada').length;

  const registerActivityDay = useCallback(
    (day: number) => {
      setCompletedDays((prev) => new Set(prev).add(day));
      setStreakCount((prevStreak) => {
        const next = lastActivityDay === null || day - lastActivityDay >= 3 ? 1 : prevStreak + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
      setLastActivityDay(day);
    },
    [lastActivityDay]
  );

  /** Afordancia de demo: avanza un día sin completar actividad, para poder
   *  probar en la misma sesión que 2 días consecutivos sin actividad
   *  reinician la racha. */
  const advanceSimDay = useCallback(() => {
    setSimDay((prev) => {
      const next = prev + 1;
      if (lastActivityDay !== null && next - lastActivityDay >= 3) {
        setStreakCount(0);
      }
      return next;
    });
  }, [lastActivityDay]);

  const completeActivity = useCallback(
    (activityId: string, answer: ActivityAnswer): CompletionResult | null => {
      const flat = flatten(program);
      const idx = flat.findIndex((a) => a.id === activityId);
      if (idx === -1) return null;

      const prevProgress = progressPercentOf(program);

      const next = cloneProgram(program);
      const nextFlat = flatten(next);
      const activity = nextFlat[idx];
      const week = next.weeks.find((w) => w.id === activity.weekId)!;

      activity.status = 'completada';
      activity.answer = answer;
      activity.actionable = false;

      const followingActivity = nextFlat[idx + 1];
      if (followingActivity && followingActivity.status === 'pendiente') {
        followingActivity.actionable = true;
      }

      const doneInWeek = week.activities.filter((a) => a.status === 'completada').length;
      const prevMedal = week.medalEarned;
      week.medalEarned = doneInWeek >= WEEKLY_MEDAL_MIN;
      const medalNewlyEarned = week.medalEarned && !prevMedal && !week.medalCelebrated;
      if (medalNewlyEarned) week.medalCelebrated = true;

      const medalsEarned = next.weeks.filter((w) => w.medalEarned).length;
      const prevTrophy = next.trophyEarned;
      next.trophyEarned = medalsEarned >= MONTHLY_TROPHY_MIN_MEDALS;
      const trophyNewlyEarned = next.trophyEarned && !prevTrophy;
      if (trophyNewlyEarned) {
        next.trophyCelebrated = true;
        next.trophyWonOn = `Completado el ${new Date().toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`;
      }

      const newProgress = progressPercentOf(next);

      setProgram(next);
      setPointsCount((p) => p + activity.points);
      registerActivityDay(simDay);

      return {
        pointsEarned: activity.points,
        prevProgress,
        newProgress,
        medalNewlyEarned,
        trophyNewlyEarned,
        weekTitle: week.title,
        programTitle: next.title,
        skillLearned: next.skillLearned,
      };
    },
    [program, registerActivityDay, simDay]
  );

  return {
    program,
    otherPrograms: OTHER_PROGRAMS,
    pointsCount,
    streakCount,
    bestStreak,
    simDay,
    completedDays,
    todayActivity,
    progressPercent,
    activitiesDone,
    completeActivity,
    advanceSimDay,
    addPoints,
  };
}

export type Gamification = ReturnType<typeof useGamification>;
