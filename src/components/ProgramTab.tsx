import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Clock, CheckCircle2, XCircle, ArrowRight, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StatusBadge, type ActivityStatus } from './ui/Badge';

interface ProgramTabProps {
  onPerformActivity?: (dayTitle: string) => void;
}

interface Activity {
  id: string;
  title: string;
  status: ActivityStatus;
  dateLabel: string;
  /** Actividad del día: se puede realizar ahora. */
  actionable?: boolean;
}

interface Week {
  id: string;
  title: string;
  progress: string;
  activities: Activity[];
}

interface Program {
  id: string;
  title: string;
  weeks: Week[];
}

/* Datos de demostración */
const WEEK_ACTIVITIES: Activity[] = [
  { id: 'd5', title: 'Dia 5. Agradecer en una palabra', status: 'pendiente', dateLabel: 'Programada el: 18 de mayo 2026' },
  { id: 'd4', title: 'Dia 4. Agradecer en una palabra', status: 'pendiente', dateLabel: 'Programada el: 18 de mayo 2026', actionable: true },
  { id: 'd3', title: 'Dia 3. Amabilidad conmigo mismo', status: 'completada', dateLabel: 'Completada el: 18 de mayo 2026, 7:06 PM' },
  { id: 'd2', title: 'Dia 2. Amabilidad conmigo mismo', status: 'incompleta', dateLabel: 'Vencida el: 18 de mayo 2026' },
  { id: 'd1', title: 'Dia 1. Amabilidad conmigo mismo', status: 'completada', dateLabel: 'Completada el: 18 de mayo 2026, 7:06 PM' },
];

const makeWeek = (id: string, activities: Activity[] = []): Week => ({
  id,
  title: 'Atención a lo que suma',
  progress: '2/7',
  activities,
});

const PROGRAMS: Program[] = [
  { id: 'p1', title: 'Atención a lo que suma', weeks: [makeWeek('p1-w1', WEEK_ACTIVITIES), makeWeek('p1-w2'), makeWeek('p1-w3')] },
  { id: 'p2', title: 'Atención a lo que suma', weeks: [makeWeek('p2-w1'), makeWeek('p2-w2'), makeWeek('p2-w3'), makeWeek('p2-w4')] },
  { id: 'p3', title: 'Atención a lo que suma', weeks: [] },
];

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
  activity: Activity;
  done: boolean;
  onPerform: () => void;
}> = ({ activity, done, onPerform }) => {
  const status: ActivityStatus = done ? 'completada' : activity.status;
  const showPerform = activity.actionable && !done;

  return (
    <div className="px-5 py-3.5 flex items-start gap-3.5 hover:bg-gray-50/30 transition-colors">
      <div className="mt-0.5 shrink-0">{STATUS_ICON[status]}</div>
      <div className="flex-grow space-y-1.5">
        <p className="text-[14px] font-semibold text-gray-900 leading-snug">{activity.title}</p>

        {showPerform ? (
          <>
            <p className="text-xs text-gray-400">{activity.dateLabel}</p>
            <Button size="md" onClick={onPerform} className="px-5 py-2 text-xs font-bold active:scale-95">
              <span>Realizar actividad</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              {status === 'completada' && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-800">
                  <Smile className="w-4 h-4 stroke-[2]" />
                  Bien
                </span>
              )}
            </div>
            {!done && <p className="text-xs text-gray-400 pt-0.5">{activity.dateLabel}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export const ProgramTab: React.FC<ProgramTabProps> = ({ onPerformActivity }) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['p1', 'p1-w1', 'p2']));
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  const isOpen = (id: string) => openIds.has(id);
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handlePerform = (activity: Activity) => {
    setDoneIds((prev) => new Set(prev).add(activity.id));
    onPerformActivity?.(activity.title);
  };

  return (
    <div className="space-y-4 pt-1">
      {PROGRAMS.map((program) => (
        <Card key={program.id} flush>
          <button
            type="button"
            onClick={() => toggle(program.id)}
            aria-expanded={isOpen(program.id)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors cursor-pointer focus-ring"
          >
            <span className="text-[17px] font-bold text-gray-900 tracking-tight">{program.title}</span>
            <span className="text-gray-800 p-0.5">
              <Chevron open={isOpen(program.id)} />
            </span>
          </button>

          <Collapsible open={isOpen(program.id)} className="border-t border-gray-100">
            {program.weeks.map((week, idx) => (
              <div key={week.id} className={idx !== program.weeks.length - 1 ? 'border-b border-gray-100' : ''}>
                <button
                  type="button"
                  onClick={() => toggle(week.id)}
                  aria-expanded={isOpen(week.id)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors cursor-pointer focus-ring"
                >
                  <span className="text-[15px] font-medium text-gray-800">{week.title}</span>
                  <span className="flex items-center gap-2 text-gray-800">
                    <span className="text-[14px] font-medium text-gray-600">{week.progress}</span>
                    <Chevron open={isOpen(week.id)} className="w-4 h-4" />
                  </span>
                </button>

                {week.activities.length > 0 && (
                  <Collapsible open={isOpen(week.id)} className="divide-y divide-gray-100 bg-white">
                    {week.activities.map((activity) => (
                      <ActivityRow
                        key={activity.id}
                        activity={activity}
                        done={doneIds.has(activity.id)}
                        onPerform={() => handlePerform(activity)}
                      />
                    ))}
                  </Collapsible>
                )}
              </div>
            ))}
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};
