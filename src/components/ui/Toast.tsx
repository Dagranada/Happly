import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, TriangleAlert } from 'lucide-react';

type Variant = 'dark' | 'success' | 'danger';

interface ToastProps {
  message: string | null;
  variant?: Variant;
  onClose?: () => void;
}

/* Banners de estado (success/danger) comparten forma; el dark es el toast compacto */
const BANNER = 'text-white px-5 py-3.5 text-[15px] max-w-sm sm:max-w-md w-[90%] sm:w-auto';
const VARIANTS: Record<Variant, string> = {
  dark: 'bg-gray-900/95 text-white px-5 py-3 text-xs sm:text-sm backdrop-blur-md',
  success: `bg-success-500 shadow-success-700/15 ${BANNER}`,
  danger: `bg-danger-500 shadow-danger-700/15 ${BANNER}`,
};

/** Aviso flotante inferior (DESIGN.md §5.1). Se muestra mientras `message` no sea null. */
export const Toast: React.FC<ToastProps> = ({ message, variant = 'dark', onClose }) => {
  const isBanner = variant !== 'dark';
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role={variant === 'danger' ? 'alert' : 'status'}
          aria-live={variant === 'danger' ? 'assertive' : 'polite'}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={onClose}
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl shadow-xl font-medium ${VARIANTS[variant]}`}
        >
          {isBanner ? (
            <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center shrink-0">
              {variant === 'danger' ? (
                <TriangleAlert className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              ) : (
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
              )}
            </div>
          ) : (
            <Check className="w-4 h-4 text-success-500 stroke-[2.5]" />
          )}
          <span className="leading-snug">{message}</span>
          {onClose && isBanner && (
            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="ml-auto pl-2 text-white/80 hover:text-white text-xs font-semibold focus-ring rounded"
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
