import React from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/Card';
import { LevelMedal } from './ui/LevelMedal';
import { TrophyBadge } from './ui/TrophyBadge';
import { trophyColor, trophyPillClass } from '../lib/trophyColors';
import type { DashboardProgram } from '../types/gamification';

interface AchievementsTabProps {
  program: DashboardProgram;
  otherPrograms: DashboardProgram[];
}

/**
 * Solo para el ejemplo visual: cuántos niveles del programa actual se muestran como alcanzados en
 * Logros aunque el estado real no los tenga. Poner en 0 para mostrar únicamente el estado real.
 */
const EXAMPLE_LEVELS_REACHED = 1;
/** Solo para el ejemplo visual: avance (0–1) a mostrar en niveles concretos (índice 1 = nivel 2). Vacío = avance real. */
const EXAMPLE_LEVEL_PROGRESS: Record<number, number> = { 1: 0.3 };

/**
 * Anillo de avance del nivel: se llena en amarillo (color de la medalla) según las actividades hechas
 * sobre las que pide la medalla, igual que la barra de la pantalla de progreso. Arranca arriba y gira
 * en el sentido del reloj; cubre el borde del círculo sin achicar el ícono.
 */
const LevelProgressRing: React.FC<{ progress: number; delay?: number; children: React.ReactNode }> = ({
  progress,
  delay = 0,
  children,
}) => (
  <div className="relative w-[62px] h-[62px] flex items-center justify-center">
    {children}
    {progress > 0 && (
      <svg viewBox="0 0 62 62" className="absolute inset-0 -rotate-90 pointer-events-none" aria-hidden="true">
        <motion.circle
          cx="31"
          cy="31"
          r="28"
          fill="none"
          stroke="var(--color-medal)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    )}
  </div>
);

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ program, otherPrograms }) => {
  const allPrograms = [program, ...otherPrograms];
  const allProgramIds = allPrograms.map((p) => p.id);
  const levelReached = (earned: boolean, index: number) => earned || index < EXAMPLE_LEVELS_REACHED;
  const medalsEarned = program.weeks.filter((w, i) => levelReached(w.medalEarned, i)).length;
  const medalsToGo = Math.max(0, 3 - medalsEarned);
  const trophyHistory = allPrograms.filter((p) => p.trophyEarned);

  return (
    <div className="space-y-4 pt-1">
      {/* Medallas por nivel */}
      <Card className="space-y-4">
        <h3 className="text-[16px] font-bold text-gray-900">Programa actual</h3>

        <div className="flex items-start justify-between pt-3">
          {program.weeks.map((week, i) => {
            const reached = levelReached(week.medalEarned, i);
            const done = week.activities.filter((a) => a.status === 'completada').length;
            const progress = reached ? 1 : (EXAMPLE_LEVEL_PROGRESS[i] ?? Math.min(done / week.medalMin, 1));
            return (
              <div key={week.id} className="flex flex-col items-center gap-1 text-center">
                <LevelProgressRing progress={progress} delay={0.15 + i * 0.1}>
                  <LevelMedal size="lg" tone="light" earned={reached} />
                </LevelProgressRing>
                <span className={`text-[11px] ${reached ? 'text-brand font-semibold' : 'text-gray-400'}`}>
                  Nivel {i + 1}
                </span>
              </div>
            );
          })}
        </div>

        {!program.trophyEarned && (
          <div className="flex items-center gap-3.5 border-t border-gray-100 pt-4">
            <TrophyBadge earned={false} size="lg" />
            <div>
              <p className="text-[14px] font-semibold text-gray-900">{program.title}</p>
              <p className="text-[12.5px] text-gray-500">
                {medalsToGo} medalla{medalsToGo === 1 ? '' : 's'} para ganar esta copa
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Historial de copas ganadas */}
      <Card className="space-y-4">
        <h3 className="text-[16px] font-bold text-gray-900">Historial de copas ganadas</h3>

        {trophyHistory.length > 0 ? (
          <ul className="divide-y divide-gray-100" aria-label="Copas ganadas">
            {trophyHistory.map((p) => {
              const wonMedals = p.weeks.filter((w) => w.medalEarned);
              return (
                <li key={p.id} className="flex items-start gap-3.5 py-4 first:pt-3 last:pb-0">
                  <TrophyBadge earned size="lg" color={trophyColor(allProgramIds, p.id)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-gray-900 leading-snug">{p.title}</p>
                    <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">Aprendiste: {p.skillLearned}</p>
                    {wonMedals.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Lo que aprendiste">
                        {wonMedals.map((w) => (
                          <li
                            key={w.id}
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${trophyPillClass(allProgramIds, p.id)}`}
                          >
                            {w.skillWord}
                          </li>
                        ))}
                      </ul>
                    )}

                    {p.trophyWonOn && <p className="text-[11px] text-gray-400 mt-3">{p.trophyWonOn}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[13.5px] text-gray-500 leading-relaxed">
            Aún no has ganado ninguna copa. Por ejemplo, al completar "{program.title}" aprenderás a{' '}
            {program.skillLearned.replace(/\.$/, '')}.
          </p>
        )}
      </Card>
    </div>
  );
};
