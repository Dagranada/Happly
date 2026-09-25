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

export interface CompletionResult {
  pointsEarned: number;
  prevProgress: number;
  newProgress: number;
  medalNewlyEarned: boolean;
  trophyNewlyEarned: boolean;
  weekTitle: string;
  programTitle: string;
  skillLearned: string;
}
