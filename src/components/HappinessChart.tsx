import React from 'react';
import { motion } from 'motion/react';
import { getLevel, type Level } from '../lib/levels';

export interface ChartPoint {
  /** Etiqueta del eje X, p. ej. "30 May" */
  label: string;
  /** Puntuación 1.0–4.0 */
  value: number;
}

interface HappinessChartProps {
  points: ChartPoint[];
  /** Identificador de la serie (para reanimar al cambiar de filtro) */
  seriesKey: string;
}

const Y_LEVELS = ['Alto', 'Medio', 'Bajo', 'Muy bajo'];
const COL_W = 140; // ancho de cada mes → obliga a deslizar en móvil
const H = 192;
const PAD_TOP = 8;
const PAD_BOTTOM = 4;
const ROW = (H - PAD_TOP - PAD_BOTTOM) / 3;

/* Color del punto según nivel, sobre los tokens del sistema */
const LEVEL_VAR: Record<Level, string> = {
  Alto: 'var(--color-accent-teal)',
  Medio: 'var(--color-warning-500)',
  Bajo: 'var(--color-danger-500)',
};

const yFor = (value: number) => PAD_TOP + (4 - Math.min(4, Math.max(1, value))) * ROW;

/**
 * Evolución mes a mes: puntos unidos por una línea, guías
 * punteadas y desplazamiento horizontal con snap para navegar entre meses.
 */
export const HappinessChart: React.FC<HappinessChartProps> = ({ points, seriesKey }) => {
  const width = COL_W * points.length;
  const coords = points.map((p, i) => ({ x: COL_W * i + COL_W / 2, y: yFor(p.value), ...p }));
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

  return (
    <div className="flex select-none">
      {/* Eje Y fijo */}
      <div
        className="flex flex-col justify-between text-[12.5px] text-gray-500 pr-3 w-16 shrink-0 text-left"
        style={{ height: H }}
        aria-hidden="true"
      >
        {Y_LEVELS.map((l) => (
          <span key={l} className="leading-none">
            {l}
          </span>
        ))}
      </div>

      {/* Área desplazable: swipe horizontal con snap por mes */}
      <div
        className="flex-grow overflow-x-auto custom-hide-native-scroll snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
        role="img"
        aria-label={`Evolución: ${points.map((p) => `${p.label} ${p.value.toFixed(1)} (${getLevel(p.value)})`).join(', ')}`}
      >
        <div style={{ width }}>
          <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} className="block overflow-visible">
            {/* Guías punteadas por nivel */}
            {[0, 1, 2, 3].map((row) => {
              const y = PAD_TOP + row * ROW;
              return (
                <line
                  key={row}
                  x1={0}
                  x2={width}
                  y1={y}
                  y2={y}
                  style={{ stroke: 'var(--color-gray-200)' }}
                  strokeWidth={1}
                  strokeDasharray="6 6"
                />
              );
            })}

            {/* Línea */}
            <motion.path
              key={`line-${seriesKey}`}
              d={linePath}
              fill="none"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ stroke: 'var(--color-brand)' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />

            {/* Puntos */}
            {coords.map((c, i) => {
              const level = getLevel(c.value);
              return (
                <motion.g
                  key={`${seriesKey}-${c.label}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 280, delay: 0.12 * i }}
                  style={{ originX: `${c.x}px`, originY: `${c.y}px` }}
                  className="cursor-pointer"
                >
                  <title>{`${c.label}: ${c.value.toFixed(1)} (${level})`}</title>
                  <circle cx={c.x} cy={c.y} r={14} style={{ fill: LEVEL_VAR[level], opacity: 0.18 }} />
                  <circle cx={c.x} cy={c.y} r={7} style={{ fill: LEVEL_VAR[level] }} />
                </motion.g>
              );
            })}
          </svg>

          {/* Eje X: cada mes es un destino del snap */}
          <div className="flex pt-3 text-[12px] text-gray-500">
            {points.map((p) => (
              <span key={p.label} className="snap-center text-center shrink-0" style={{ width: COL_W }}>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
