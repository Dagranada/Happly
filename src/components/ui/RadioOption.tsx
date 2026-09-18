import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

interface RadioOptionProps
  extends Omit<HTMLMotionProps<'label'>, 'onChange' | 'children'> {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  /** Centra el contenido en móvil (para grids de opciones cortas). */
  centerOnMobile?: boolean;
}

/**
 * Tarjeta seleccionable con radio personalizado (DESIGN.md §5.1).
 * Renderiza un <label> para que toda la tarjeta sea clicable y accesible.
 */
export const RadioOption: React.FC<RadioOptionProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  centerOnMobile = false,
  className = '',
  ...motionProps
}) => {
  return (
    <motion.label
      className={`min-h-[56px] rounded-2xl px-4 py-3.5 flex items-center gap-3.5 cursor-pointer transition-colors select-none touch-manipulation ${
        centerOnMobile ? 'justify-center sm:justify-start' : ''
      } ${checked ? 'bg-brand-100' : 'bg-gray-50 hover:bg-gray-100'} ${className}`}
      {...motionProps}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="custom-radio shrink-0"
      />
      <span
        className={`text-[15px] sm:text-[16px] leading-snug font-medium transition-colors ${
          checked ? 'text-brand' : 'text-gray-800'
        }`}
      >
        {label}
      </span>
    </motion.label>
  );
};
