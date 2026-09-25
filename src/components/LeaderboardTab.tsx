import React from 'react';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { MedalIcon } from './ui/MedalIcon';

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  avatarUrl?: string | null;
  isCurrentUser?: boolean;
}

const BASE_LEADERBOARD: LeaderboardUser[] = Array.from({ length: 6 }, (_, i) => ({
  id: `lb-${i + 1}`,
  name: 'Nombre',
  points: 200,
}));

interface LeaderboardTabProps {
  currentUser: { name: string; points: number; avatarUrl?: string | null };
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ currentUser }) => {
  const sorted = [
    ...BASE_LEADERBOARD,
    { id: 'current-user', name: currentUser.name, points: currentUser.points, avatarUrl: currentUser.avatarUrl, isCurrentUser: true },
  ].sort((a, b) => b.points - a.points);

  return (
    <div id="leaderboard-container" className="pt-1">
      <ol className="space-y-3" aria-label="Ranking">
        {sorted.map((item, i) => {
          const rank = i + 1;
          return (
            <li key={item.id}>
              <Card
                flush
                className={`px-4 py-3.5 flex items-center justify-between ${
                  item.isCurrentUser ? 'ring-2 ring-brand/40' : ''
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 flex justify-center items-center shrink-0">
                    {rank <= 3 ? (
                      <MedalIcon place={rank as 1 | 2 | 3} size="sm" />
                    ) : (
                      <span className="text-[16px] font-semibold text-gray-800 pl-1">{rank}</span>
                    )}
                  </div>
                  <Avatar src={item.avatarUrl} />
                  <span className={`text-[15px] font-semibold ${item.isCurrentUser ? 'text-brand' : 'text-gray-800'}`}>
                    {item.isCurrentUser ? `${item.name} (Tú)` : item.name}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-gray-900 tracking-tight pr-1">{item.points} PTS</span>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default LeaderboardTab;
