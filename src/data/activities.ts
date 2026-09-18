export interface Activity {
  id: number;
  title: string;
  description: string;
  /** Fecha límite tal como se muestra al usuario. */
  deadline: string;
  placeholder?: string;
}

/* Actividades de demostración del programa "Atención a lo que suma" */
export const ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Escribe una palabra que resuma aquello por lo que estás agradecido/a.',
    description:
      'Piensa en alguien de tu trabajo actual y algo que quieras agradecerle. Reconocer a los demás es un acto poderoso que puede influir positivamente en su motivación y bienestar.',
    deadline: 'Hasta 6/marzo/25 - 12:00 a. m.',
  },
  {
    id: 2,
    title: 'Anota un momento del día en el que fuiste amable contigo mismo/a.',
    description:
      'La amabilidad hacia uno mismo reduce la autocrítica y mejora la resiliencia. Puede ser algo pequeño: una pausa, una palabra de ánimo, un límite que pusiste.',
    deadline: 'Hasta 7/marzo/25 - 12:00 a. m.',
  },
  {
    id: 3,
    title: 'Describe una fortaleza tuya que usaste hoy en el trabajo.',
    description:
      'Identificar y nombrar tus fortalezas te ayuda a usarlas de forma más consciente y a sentir mayor sentido en lo que haces.',
    deadline: 'Hasta 8/marzo/25 - 12:00 a. m.',
  },
  {
    id: 4,
    title: '¿Qué pequeño logro de esta semana quieres celebrar?',
    description:
      'Celebrar los avances, aunque sean pequeños, refuerza la motivación y te ayuda a mantener una mirada positiva sobre tu trabajo.',
    deadline: 'Hasta 9/marzo/25 - 12:00 a. m.',
  },
];
