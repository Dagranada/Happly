import React from 'react';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';

/* Oro / plata / bronce sobre las escalas warning y gray */
const MEDALS: Record<1 | 2 | 3, { circle: string; ribbon: string }> = {
  1: { circle: 'bg-warning-500', ribbon: 'fill-warning-600' },
  2: { circle: 'bg-gray-400', ribbon: 'fill-gray-700' },
  3: { circle: 'bg-warning-600', ribbon: 'fill-warning-800' },
};

const MedalBadge: React.FC<{ place: 1 | 2 | 3 }> = ({ place }) => {
  const { circle, ribbon } = MEDALS[place];
  return (
    <div className="relative flex flex-col items-center justify-center w-7 h-9 shrink-0" aria-label={`Puesto ${place}`}>
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[13px] text-white z-10 shadow-xs leading-none ${circle}`}
      >
        {place}
      </div>
      <svg viewBox="0 0 16 9" className={`w-3.5 h-2.5 -mt-1 z-0 opacity-80 ${ribbon}`} aria-hidden="true">
        <path d="M1 0 L4 9 L8 5.5 L12 9 L15 0 Z" />
      </svg>
    </div>
  );
};

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  points: number;
  avatarUrl?: string;
}

const LEADERBOARD_DATA: LeaderboardUser[] = Array.from({ length: 6 }, (_, i) => ({
  id: `lb-${i + 1}`,
  rank: i + 1,
  name: 'Nombre',
  points: 200,
}));

export const LeaderboardTab: React.FC = () => (
  <div id="leaderboard-container" className="pt-1">
    <ol className="space-y-3" aria-label="Ranking">
      {LEADERBOARD_DATA.map((item) => (
        <li key={item.id}>
          <Card flush className="px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-8 flex justify-center items-center shrink-0">
                {item.rank <= 3 ? (
                  <MedalBadge place={item.rank as 1 | 2 | 3} />
                ) : (
                  <span className="text-[16px] font-semibold text-gray-800 pl-1">{item.rank}</span>
                )}
              </div>
              <Avatar src={item.avatarUrl} />
              <span className="text-[15px] font-semibold text-gray-800">{item.name}</span>
            </div>
            <span className="text-[14px] font-bold text-gray-900 tracking-tight pr-1">{item.points} PTS</span>
          </Card>
        </li>
      ))}
    </ol>
  </div>
);

export default LeaderboardTab;
