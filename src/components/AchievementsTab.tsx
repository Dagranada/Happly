import React from 'react';
import { Flame, Star, Award, Trophy, Heart, Zap, Crown, type LucideIcon } from 'lucide-react';
import { Card } from './ui/Card';

export interface AchievementStats {
  streak: number;
  bestStreak: number;
  points: number;
  activitiesDone: number;
  intentionSaved: boolean;
}

interface Achievement {
  id: string;
  label: string;
  Icon: LucideIcon;
  unlockedWhen: (s: AchievementStats) => boolean;
}

const never = () => false;

/* Catálogo de insignias (orden = orden visual, 4 por fila) */
const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-activity', label: 'Primera actividad', Icon: Star, unlockedWhen: (s) => s.activitiesDone >= 1 },
  { id: 'streak-7', label: 'Racha de 7', Icon: Flame, unlockedWhen: (s) => s.bestStreak >= 7 },
  { id: 'streak-14', label: 'Racha de 14', Icon: Flame, unlockedWhen: (s) => s.bestStreak >= 14 },
  { id: 'streak-30', label: 'Racha de 30', Icon: Flame, unlockedWhen: (s) => s.bestStreak >= 30 },
  { id: 'activities-10', label: '10 actividades', Icon: Award, unlockedWhen: (s) => s.activitiesDone >= 10 },
  { id: 'activities-25', label: '25 actividades', Icon: Award, unlockedWhen: (s) => s.activitiesDone >= 25 },
  { id: 'activities-50', label: '50 actividades', Icon: Award, unlockedWhen: (s) => s.activitiesDone >= 50 },
  { id: 'level-1', label: 'Primer nivel', Icon: Trophy, unlockedWhen: never },
  { id: 'level-3', label: '3 niveles completados', Icon: Trophy, unlockedWhen: never },
  { id: 'level-5', label: '5 niveles completados', Icon: Trophy, unlockedWhen: never },
  // Desbloqueado de ejemplo (demo), como en el diseño de referencia
  { id: 'active-voice', label: 'Voz activa', Icon: Heart, unlockedWhen: () => true },
  { id: 'points-100', label: '100 puntos', Icon: Zap, unlockedWhen: (s) => s.points >= 100 },
  { id: 'points-500', label: '500 puntos', Icon: Zap, unlockedWhen: (s) => s.points >= 500 },
  { id: 'profile-pioneer', label: 'Perfil pionero', Icon: Crown, unlockedWhen: never },
  { id: 'profile-featured', label: 'Perfil destacado', Icon: Trophy, unlockedWhen: never },
  { id: 'profile-fit', label: 'Perfil en forma', Icon: Award, unlockedWhen: never },
  { id: 'voice-pioneer', label: 'Voz pionera', Icon: Crown, unlockedWhen: never },
  { id: 'voice-featured', label: 'Voz destacada', Icon: Trophy, unlockedWhen: never },
  { id: 'voice-constant', label: 'Voz constante', Icon: Award, unlockedWhen: never },
  { id: 'rise', label: 'Ascenso laboral', Icon: Crown, unlockedWhen: never },
  { id: 'tracker', label: 'Rastreador', Icon: Trophy, unlockedWhen: never },
  { id: 'climber', label: 'Escalador', Icon: Award, unlockedWhen: never },
  { id: 'strategist', label: 'Estratega', Icon: Crown, unlockedWhen: never },
  { id: 'pursuer', label: 'Perseguidor', Icon: Trophy, unlockedWhen: never },
  { id: 'competitor', label: 'Competidor', Icon: Award, unlockedWhen: never },
];

const STAT_NUMBER = 'text-[28px] font-extrabold leading-none tabular-nums';
const STAT_LABEL = 'text-[13px] font-medium text-gray-600 mt-1.5';

export const AchievementsTab: React.FC<{ stats: AchievementStats }> = ({ stats }) => {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlockedWhen(stats)).length;

  return (
    <div className="space-y-4 pt-1">
      {/* Racha de actividad */}
      <Card>
        <dl className="grid grid-cols-3 divide-x divide-gray-100 text-center" aria-label="Racha de actividad">
          <div className="px-2">
            <dd className={`${STAT_NUMBER} text-gray-900`}>{stats.streak}</dd>
            <dt className={STAT_LABEL}>Racha actual</dt>
          </div>
          <div className="px-2">
            <dd className={`${STAT_NUMBER} text-gray-900`}>{stats.bestStreak}</dd>
            <dt className={STAT_LABEL}>Mejor racha</dt>
          </div>
          <div className="px-2">
            <dd className={`${STAT_NUMBER} text-gray-900`}>{stats.points}</dd>
            <dt className={STAT_LABEL}>Puntos</dt>
          </div>
        </dl>
      </Card>

      {/* Insignias */}
      <Card className="space-y-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[16px] font-bold text-gray-900">Logros</h3>
          <span className="text-[13px] font-medium text-brand">
            {unlockedCount} {unlockedCount === 1 ? 'logro desbloqueado' : 'logros desbloqueados'}
          </span>
        </div>

        <ul className="grid grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-5" aria-label="Insignias">
          {ACHIEVEMENTS.map(({ id, label, Icon, unlockedWhen }) => {
            const unlocked = unlockedWhen(stats);
            return (
              <li key={id} className="flex flex-col items-center text-center min-w-0">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                    unlocked
                      ? 'bg-warning-500 text-white shadow-lg shadow-warning-500/30'
                      : 'border-2 border-gray-100 text-gray-400'
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
                </div>
                <span
                  className={`mt-2 w-full text-[12px] leading-tight truncate ${
                    unlocked ? 'text-brand font-medium' : 'text-gray-400'
                  }`}
                  title={label}
                >
                  {label}
                </span>
                <span className="sr-only">{unlocked ? 'desbloqueado' : 'bloqueado'}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};
