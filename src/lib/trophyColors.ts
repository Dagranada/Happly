/** Paleta de fondos para diferenciar copas de distintos programas a simple vista. */
export const TROPHY_COLORS = ['bg-warning-500', 'bg-success-500', 'bg-brand', 'bg-accent-teal', 'bg-danger-500'];

export function trophyColorClass(allProgramIds: string[], programId: string): string {
  const idx = allProgramIds.indexOf(programId);
  return TROPHY_COLORS[(idx < 0 ? 0 : idx) % TROPHY_COLORS.length];
}
