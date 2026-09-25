import React from 'react';
import { Award } from 'lucide-react';
import { Card } from './ui/Card';
import { MedalIcon } from './ui/MedalIcon';
import { TrophyBadge } from './ui/TrophyBadge';
import { trophyColorClass } from '../lib/trophyColors';
import type { DashboardProgram } from '../types/gamification';

interface AchievementsTabProps {
  program: DashboardProgram;
  otherPrograms: DashboardProgram[];
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ program, otherPrograms }) => {
  const allPrograms = [program, ...otherPrograms];
  const allProgramIds = allPrograms.map((p) => p.id);
  const medalsEarned = program.weeks.filter((w) => w.medalEarned).length;
  const medalsToGo = Math.max(0, 3 - medalsEarned);
  const trophyHistory = allPrograms.filter((p) => p.trophyEarned);

  return (
    <div className="space-y-4 pt-1">
      {/* Medallas de la semana */}
      <Card className="space-y-4">
        <h3 className="text-[16px] font-bold text-gray-900">Medallas de la semana</h3>

        <div className="flex items-start justify-between">
          {program.weeks.map((week, i) => (
            <div key={week.id} className="flex flex-col items-center gap-1.5 text-center">
              <MedalIcon size="lg" earned={week.medalEarned} label={<Award className="w-6 h-6" />} />
              <span className={`text-[11px] ${week.medalEarned ? 'text-brand font-medium' : 'text-gray-400'}`}>
                Semana {i + 1}
              </span>
            </div>
          ))}
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
            {trophyHistory.map((p) => (
              <li key={p.id} className="flex items-center gap-3.5 py-4 first:pt-0 last:pb-0">
                <TrophyBadge earned size="lg" colorClass={trophyColorClass(allProgramIds, p.id)} />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 leading-snug">{p.title}</p>
                  <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">Aprendiste: {p.skillLearned}</p>
                  {p.trophyWonOn && <p className="text-[11px] text-gray-400 mt-2">{p.trophyWonOn}</p>}
                </div>
              </li>
            ))}
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
