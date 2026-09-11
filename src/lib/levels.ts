export type Level = 'Alto' | 'Medio' | 'Bajo';

/** Umbrales de la escala 1.0–4.0 (DESIGN.md §11.7). */
export const getLevel = (value: number): Level => {
  if (value >= 3.5) return 'Alto';
  if (value >= 2.5) return 'Medio';
  return 'Bajo';
};
