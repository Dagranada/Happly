import React from 'react';

type Variant = 'primary' | 'secondary' | 'pill' | 'ghost';
type Size = 'lg' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all cursor-pointer focus-ring disabled:cursor-not-allowed';

const SIZES: Record<Size, string> = {
  lg: 'py-3.5 sm:py-4 px-9 text-[17px] sm:text-[18px]',
  md: 'py-2.5 px-6 text-sm',
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-cta hover:bg-brand-600 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:active:scale-100',
  secondary:
    'border border-brand-200 bg-white text-brand hover:bg-brand-100/50 active:scale-[0.98]',
  pill:
    'text-xs font-medium text-brand bg-brand-100/70 hover:bg-brand-100 px-3.5 py-1.5 shadow-2xs',
  ghost:
    'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  className = '',
  type = 'button',
  children,
  ...rest
}) => {
  const sizeClass = variant === 'pill' ? '' : SIZES[size];
  return (
    <button
      type={type}
      className={`${BASE} ${sizeClass} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
