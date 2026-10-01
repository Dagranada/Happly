/** Colores del círculo de cada copa (sin dorado: ese es el color de la copa interior). */
export const TROPHY_COLORS = [
  'var(--color-accent-teal)',
  'var(--color-success-500)',
  'var(--color-brand)',
  'var(--color-danger-500)',
  'var(--color-brand-900)',
];

export function trophyColor(allProgramIds: string[], programId: string): string {
  const idx = allProgramIds.indexOf(programId);
  return TROPHY_COLORS[(idx < 0 ? 0 : idx) % TROPHY_COLORS.length];
}

/** Pills en tono claro a juego con cada copa (mismo orden que TROPHY_COLORS). */
export const TROPHY_PILLS = [
  'bg-accent-teal/20 text-gray-800',
  'bg-success-500/15 text-success-700',
  'bg-brand/15 text-brand-900',
  'bg-danger-500/15 text-danger-700',
  'bg-brand-900/10 text-brand-900',
];

export function trophyPillClass(allProgramIds: string[], programId: string): string {
  const idx = allProgramIds.indexOf(programId);
  return TROPHY_PILLS[(idx < 0 ? 0 : idx) % TROPHY_PILLS.length];
}
