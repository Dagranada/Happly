import type { DashboardActivity, DashboardProgram, DashboardWeek } from '../types/gamification';

const GRATITUDE_DESCRIPTION =
  'Piensa en alguien de tu entorno y algo que quieras agradecerle. Reconocer a los demás es un acto poderoso que puede influir positivamente en su motivación y bienestar.';
const KINDNESS_DESCRIPTION =
  'La amabilidad hacia uno mismo reduce la autocrítica y mejora la resiliencia. Puede ser algo pequeño: una pausa, una palabra de ánimo, un límite que pusiste.';
const STRENGTH_DESCRIPTION =
  'Identificar y nombrar tus fortalezas te ayuda a usarlas de forma más consciente y a sentir mayor sentido en lo que haces.';
const CELEBRATION_DESCRIPTION =
  'Celebrar los avances, aunque sean pequeños, refuerza la motivación y te ayuda a mantener una mirada positiva sobre tu día.';

interface ActivitySeed {
  dayLabel: string;
  title: string;
  description: string;
}

interface WeekSeed {
  id: string;
  title: string;
  activities: ActivitySeed[];
  dateLabel: string;
}

const WEEK_SEEDS: WeekSeed[] = [
  {
    id: 'w1',
    title: 'Semana 1',
    dateLabel: '18 de mayo de 2026',
    activities: [
      { dayLabel: 'Día 1', title: 'Amabilidad conmigo mismo', description: KINDNESS_DESCRIPTION },
      { dayLabel: 'Día 2', title: 'Amabilidad conmigo mismo', description: KINDNESS_DESCRIPTION },
      { dayLabel: 'Día 3', title: 'Amabilidad conmigo mismo', description: KINDNESS_DESCRIPTION },
      { dayLabel: 'Día 4', title: 'Agradecer en una palabra', description: GRATITUDE_DESCRIPTION },
      { dayLabel: 'Día 5', title: 'Agradecer en una palabra', description: GRATITUDE_DESCRIPTION },
    ],
  },
  {
    id: 'w2',
    title: 'Semana 2',
    dateLabel: '25 de mayo de 2026',
    activities: [
      { dayLabel: 'Día 6', title: 'Reconocer una fortaleza propia', description: STRENGTH_DESCRIPTION },
      { dayLabel: 'Día 7', title: 'Reconocer una fortaleza propia', description: STRENGTH_DESCRIPTION },
      { dayLabel: 'Día 8', title: 'Celebrar un pequeño logro', description: CELEBRATION_DESCRIPTION },
      { dayLabel: 'Día 9', title: 'Agradecer en una palabra', description: GRATITUDE_DESCRIPTION },
      { dayLabel: 'Día 10', title: 'Amabilidad conmigo mismo', description: KINDNESS_DESCRIPTION },
    ],
  },
  {
    id: 'w3',
    title: 'Semana 3',
    dateLabel: '1 de junio de 2026',
    activities: [
      { dayLabel: 'Día 11', title: 'Reconocer una fortaleza propia', description: STRENGTH_DESCRIPTION },
      { dayLabel: 'Día 12', title: 'Celebrar un pequeño logro', description: CELEBRATION_DESCRIPTION },
      { dayLabel: 'Día 13', title: 'Agradecer en una palabra', description: GRATITUDE_DESCRIPTION },
      { dayLabel: 'Día 14', title: 'Amabilidad conmigo mismo', description: KINDNESS_DESCRIPTION },
      { dayLabel: 'Día 15', title: 'Celebrar un pequeño logro', description: CELEBRATION_DESCRIPTION },
    ],
  },
  {
    id: 'w4',
    title: 'Semana 4',
    dateLabel: '8 de junio de 2026',
    activities: [
      { dayLabel: 'Día 16', title: 'Reconocer una fortaleza propia', description: STRENGTH_DESCRIPTION },
      { dayLabel: 'Día 17', title: 'Agradecer en una palabra', description: GRATITUDE_DESCRIPTION },
      { dayLabel: 'Día 18', title: 'Amabilidad conmigo mismo', description: KINDNESS_DESCRIPTION },
      { dayLabel: 'Día 19', title: 'Celebrar un pequeño logro', description: CELEBRATION_DESCRIPTION },
      { dayLabel: 'Día 20', title: 'Agradecer en una palabra', description: GRATITUDE_DESCRIPTION },
    ],
  },
];

/* Semana 1 arranca con el mismo estado demo que ya existía: día 1 y 3
   completados, día 2 vencido, día 4 pendiente y día 5 como única actividad
   accionable ("de hoy"), igual al texto que ya mostraba Inicio. */
const WEEK1_SEED_STATUS: Array<Pick<DashboardActivity, 'status' | 'dateLabel' | 'actionable'>> = [
  { status: 'completada', dateLabel: 'Completada el 18 de mayo de 2026, 7:06 p. m.', actionable: false },
  { status: 'incompleta', dateLabel: 'Vencida el 18 de mayo de 2026', actionable: false },
  { status: 'completada', dateLabel: 'Completada el 18 de mayo de 2026, 7:06 p. m.', actionable: false },
  { status: 'pendiente', dateLabel: 'Programada el: 18 de mayo de 2026', actionable: false },
  { status: 'pendiente', dateLabel: 'Programada el 22 de mayo de 2026, 12:00 a. m.', actionable: true },
];

function buildWeek(seed: WeekSeed, weekIndex: number): DashboardWeek {
  const activities: DashboardActivity[] = seed.activities.map((a, i) => {
    const seedStatus =
      weekIndex === 0
        ? WEEK1_SEED_STATUS[i]
        : { status: 'pendiente' as const, dateLabel: `Programada el: ${seed.dateLabel}`, actionable: false };

    return {
      id: `${seed.id}-a${i + 1}`,
      weekId: seed.id,
      dayLabel: a.dayLabel,
      title: a.title,
      description: a.description,
      points: 25,
      ...seedStatus,
    };
  });

  const medalEarned = activities.filter((a) => a.status === 'completada').length >= 3;

  return {
    id: seed.id,
    title: seed.title,
    activities,
    medalEarned,
    medalCelebrated: medalEarned,
  };
}

export const CURRENT_PROGRAM: DashboardProgram = {
  id: 'current',
  title: 'Atención a lo que suma',
  skillLearned: 'practicar la gratitud diaria y ser más amable contigo mismo.',
  weeks: WEEK_SEEDS.map(buildWeek),
  trophyEarned: false,
  trophyCelebrated: false,
};

/* Actividades de relleno para los programas de ejemplo: no son accionables
   (son solo maqueta visual), pero su cantidad de "completada" determina si
   la semana muestra su medalla ganada o bloqueada, igual que en el programa real. */
function mockWeekActivities(weekId: string, doneCount: number): DashboardActivity[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${weekId}-a${i + 1}`,
    weekId,
    dayLabel: `Día ${i + 1}`,
    title: 'Actividad de ejemplo',
    description: 'Actividad de ejemplo de este programa.',
    points: 25,
    status: i < doneCount ? 'completada' : 'pendiente',
    dateLabel: i < doneCount ? 'Completada' : 'Pendiente',
    actionable: false,
  }));
}

function mockWeek(id: string, title: string, doneCount: number): DashboardWeek {
  const medalEarned = doneCount >= 3;
  return {
    id,
    title,
    activities: mockWeekActivities(id, doneCount),
    medalEarned,
    medalCelebrated: medalEarned,
  };
}

/* Otros programas del usuario: maqueta visual en el acordeón de Programa y
   en el historial de Logros, con ejemplos de medallas/copas ya ganadas y de
   una copa aún bloqueada que está por ganarse. No participan de la racha ni
   los puntos reales (esos solo vienen del programa activo). */
export const OTHER_PROGRAMS: DashboardProgram[] = [
  {
    id: 'p2',
    title: 'Bienestar en el trabajo',
    skillLearned: 'gestionar mejor el estrés laboral y pedir ayuda cuando la necesitas.',
    weeks: [
      mockWeek('p2-w1', 'Semana 1', 5),
      mockWeek('p2-w2', 'Semana 2', 5),
      mockWeek('p2-w3', 'Semana 3', 5),
      mockWeek('p2-w4', 'Semana 4', 5),
    ],
    trophyEarned: true,
    trophyCelebrated: true,
    trophyWonOn: 'Completado el 30 de abril de 2026',
  },
  {
    id: 'p3',
    title: 'Conexión con los demás',
    skillLearned: 'fortalecer tus relaciones cercanas mostrando aprecio genuino.',
    weeks: [
      mockWeek('p3-w1', 'Semana 1', 5),
      mockWeek('p3-w2', 'Semana 2', 5),
      mockWeek('p3-w3', 'Semana 3', 5),
      mockWeek('p3-w4', 'Semana 4', 5),
    ],
    trophyEarned: true,
    trophyCelebrated: true,
    trophyWonOn: 'Completado el 31 de marzo de 2026',
  },
  {
    id: 'p4',
    title: 'Fortalezas personales',
    skillLearned: 'reconocer y usar tus fortalezas todos los días.',
    weeks: [
      mockWeek('p4-w1', 'Semana 1', 4),
      mockWeek('p4-w2', 'Semana 2', 3),
      mockWeek('p4-w3', 'Semana 3', 1),
      mockWeek('p4-w4', 'Semana 4', 0),
    ],
    trophyEarned: false,
    trophyCelebrated: false,
  },
];
