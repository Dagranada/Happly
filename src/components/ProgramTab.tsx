import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Clock, CheckCircle2, XCircle, ArrowRight, Smile, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StatusBadge, type ActivityStatus } from './ui/Badge';
import { MedalIcon } from './ui/MedalIcon';
import { TrophyBadge } from './ui/TrophyBadge';
import { trophyColorClass } from '../lib/trophyColors';
import type { DashboardActivity, DashboardProgram } from '../types/gamification';

interface ProgramTabProps {
  program: DashboardProgram;
  otherPrograms: DashboardProgram[];
  onOpenActivity: (activity: DashboardActivity) => void;
}

const STATUS_ICON: Record<ActivityStatus, React.ReactNode> = {
  pendiente: <Clock className="w-5 h-5 stroke-[1.8] text-gray-400" />,
  completada: <CheckCircle2 className="w-5 h-5 stroke-[2] text-success-500" />,
  incompleta: <XCircle className="w-5 h-5 stroke-[2] text-danger-500" />,
};

const Chevron: React.FC<{ open: boolean; className?: string }> = ({ open, className = 'w-5 h-5' }) =>
  open ? <ChevronUp className={`${className} stroke-[2.5]`} /> : <ChevronDown className={`${className} stroke-[2.5]`} />;

const Collapsible: React.FC<{ open: boolean; className?: string; children: React.ReactNode }> = ({
  open,
  className = '',
  children,
}) => (
  <AnimatePresence initial={false}>
    {open && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const ActivityRow: React.FC<{
  activity: DashboardActivity;
  onOpen: () => void;
}> = ({ activity, onOpen }) => {
  const showPerform = activity.actionable && activity.status === 'pendiente';

  return (
    <div className="px-5 py-3.5 flex items-start gap-3.5 hover:bg-gray-50/30 transition-colors">
      <div className="mt-0.5 shrink-0">{STATUS_ICON[activity.status]}</div>
      <div className="flex-grow space-y-1.5">
        <p className="text-[14px] font-semibold text-gray-900 leading-snug">
          {activity.dayLabel}. {activity.title}
        </p>

        {showPerform ? (
          <>
            <p className="text-xs text-gray-400">{activity.dateLabel}</p>
            <Button size="md" onClick={onOpen} className="px-5 py-2 text-xs font-bold active:scale-95">
              <span>Realizar actividad</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <StatusBadge status={activity.status} />
              {activity.status === 'completada' && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-800">
                  <Smile className="w-4 h-4 stroke-[2]" />
                  Bien
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 pt-0.5">{activity.dateLabel}</p>
          </>
        )}
      </div>
    </div>
  );
};

export const ProgramTab: React.FC<ProgramTabProps> = ({ program, otherPrograms, onOpenActivity }) => {
  const programs = [program, ...otherPrograms];
  const programIds = programs.map((p) => p.id);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([program.id, program.weeks[0]?.id]));

  const isOpen = (id: string) => openIds.has(id);
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="space-y-4 pt-1">
      {programs.map((prog) => (
        <Card key={prog.id} flush>
          <button
            type="button"
            onClick={() => toggle(prog.id)}
            aria-expanded={isOpen(prog.id)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors cursor-pointer focus-ring"
          >
            <span className="text-[17px] font-bold text-gray-900 tracking-tight">{prog.title}</span>
            <span className="flex items-center gap-3 text-gray-800">
              <TrophyBadge earned={prog.trophyEarned} colorClass={trophyColorClass(programIds, prog.id)} />
              <Chevron open={isOpen(prog.id)} />
            </span>
          </button>

          <Collapsible open={isOpen(prog.id)} className="border-t border-gray-100">
            {prog.weeks.map((week, idx) => {
              const doneCount = week.activities.filter((a) => a.status === 'completada').length;
              return (
                <div key={week.id} className={idx !== prog.weeks.length - 1 ? 'border-b border-gray-100' : ''}>
                  <button
                    type="button"
                    onClick={() => toggle(week.id)}
                    aria-expanded={isOpen(week.id)}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors cursor-pointer focus-ring"
                  >
                    <span className="flex flex-col items-start gap-0.5 min-w-0">
                      <span className="text-[15px] font-medium text-gray-800">{week.title}</span>
                      <span className="text-[13px] font-medium text-gray-500">
                        {week.activities.length > 0 ? `${doneCount}/${week.activities.length}` : 'Próximamente'}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 text-gray-800 shrink-0">
                      <MedalIcon size="sm" earned={week.medalEarned} label={<Award className="w-3.5 h-3.5" />} />
                      <Chevron open={isOpen(week.id)} className="w-4 h-4" />
                    </span>
                  </button>

                  {week.activities.length > 0 && (
                    <Collapsible open={isOpen(week.id)} className="divide-y divide-gray-100 bg-white">
                      {/* Se muestran de la más reciente (arriba) a la más antigua (abajo). */}
                      {[...week.activities].reverse().map((activity) => (
                        <ActivityRow key={activity.id} activity={activity} onOpen={() => onOpenActivity(activity)} />
                      ))}
                    </Collapsible>
                  )}
                </div>
              );
            })}
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};
