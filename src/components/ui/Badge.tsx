import React from 'react';
import type { Level } from '../../lib/levels';

const BASE = 'inline-flex items-center rounded-full font-semibold leading-tight transition-colors duration-300';

const LEVEL_STYLES: Record<Level, string> = {
  Alto: 'bg-success-100 text-success-700',
  Medio: 'bg-warning-100 text-warning-700',
  Bajo: 'bg-danger-100 text-danger-700',
};

interface LevelBadgeProps {
  level: Level;
  size?: 'sm' | 'md';
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'md', className = '' }) => (
  <span
    className={`${BASE} ${LEVEL_STYLES[level]} ${
      size === 'sm' ? 'px-2 py-0.5 text-[10px] font-bold' : 'px-2.5 py-0.5 text-[11px] sm:text-[12px]'
    } ${className}`}
  >
    {level}
  </span>
);

export type ActivityStatus = 'pendiente' | 'completada' | 'incompleta';

const STATUS_STYLES: Record<ActivityStatus, { label: string; className: string }> = {
  pendiente: { label: 'Pendiente', className: 'bg-gray-200 text-gray-600 font-medium' },
  completada: { label: 'Completada', className: 'bg-success-100 text-success-700' },
  incompleta: { label: 'Incompleta', className: 'bg-danger-100 text-danger-700' },
};

export const StatusBadge: React.FC<{ status: ActivityStatus }> = ({ status }) => {
  const { label, className } = STATUS_STYLES[status];
  return <span className={`${BASE} px-3 py-0.5 text-xs ${className}`}>{label}</span>;
};
