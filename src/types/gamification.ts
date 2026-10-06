import type { ActivityStatus } from '../components/ui/Badge';
import type { ActivityAnswer } from '../types';

export interface DashboardActivity {
  id: string;
  weekId: string;
  /** "Día 5" */
  dayLabel: string;
  title: string;
  description: string;
  points: number;
  status: ActivityStatus;
  dateLabel: string;
  /** Única actividad "de hoy": la siguiente pendiente en el orden del programa. */
  actionable: boolean;
  answer?: ActivityAnswer;
}

export interface DashboardWeek {
  id: string;
  title: string;
  activities: DashboardActivity[];
  /** Actividades que hay que completar para ganar la medalla del nivel (varía entre 2 y 5). */
  medalMin: number;
  /** Habilidad que se gana en este nivel, en una palabra (pill junto a la medalla en el historial). */
  skillWord: string;
  medalEarned: boolean;
  /** Evita repetir la pantalla de medalla una vez ya mostrada. */
  medalCelebrated: boolean;
}

export interface DashboardProgram {
  id: string;
  title: string;
  /** Lo que el usuario aprendió al completar el programa (mostrado en el trofeo y el historial). */
  skillLearned: string;
  weeks: DashboardWeek[];
  trophyEarned: boolean;
  trophyCelebrated: boolean;
  /** Texto ya formateado (p. ej. "Completado el 30 de abril de 2026") — solo presente si `trophyEarned`. */
  trophyWonOn?: string;
}

export interface CompletionWeekSummary {
  title: string;
  done: number;
  /** Actividades requeridas para la medalla de este nivel. */
  required: number;
  medalEarned: boolean;
  /** Actividades hechas antes de la recién completada: ese avance se muestra sin animar. */
  prevDone?: number;
}

export interface CompletionResult {
  pointsEarned: number;
  /** Estado de cada semana del programa tras completar la actividad. */
  weeks: CompletionWeekSummary[];
  prevProgress: number;
  newProgress: number;
  trophyNewlyEarned: boolean;
  programTitle: string;
  skillLearned: string;
}
