import React from 'react';

interface FooterProps {
  onOpenTerms: () => void;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms, className = '' }) => (
  <footer
    className={`py-6 px-5 text-center text-xs text-gray-500 border-t border-gray-100/80 mt-auto bg-transparent ${className}`}
  >
    <p>Copyright 2026 Happly - Todos los derechos reservados</p>
    <button
      type="button"
      onClick={onOpenTerms}
      className="text-brand hover:underline mt-1 inline-block cursor-pointer font-medium focus-ring rounded"
    >
      Términos y condiciones
    </button>
  </footer>
);
