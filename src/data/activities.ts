export interface Activity {
  id: number;
  title: string;
  description: string;
  /** Fecha límite tal como se muestra al usuario. */
  deadline: string;
  placeholder?: string;
}

/* Única actividad de muestra al cierre del cuestionario: al enviarla se
   completa la actividad real "de hoy" del programa y se muestra el flujo
   de progreso (puntos, racha y medalla) antes de entrar a Inicio. */
export const ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Escribe una palabra que resuma aquello por lo que estás agradecido/a.',
    description:
      ' Piensa en alguien de tu trabajo actual y algo que quieras agradecerle. Reconocer a los demás es un acto poderoso que puede influir positivamente en su motivación y bienestar.',
    deadline: 'Hasta 6/marzo/25 - 12:00 a. m.',
  },
];
