import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: '1. Propósito del Cuestionario',
    body:
      'El módulo "Conozcámonos" tiene como finalidad entender tus preferencias laborales, entorno de apoyo y metas personales para ofrecerte herramientas y recomendaciones adaptadas a tu perfil.',
  },
  {
    title: '2. Protección de Datos Personales',
    body:
      'Happly no vende ni comparte tus datos individuales con terceros sin tu consentimiento explícito. Los datos agregados pueden usarse para métricas de bienestar organizacional.',
  },
  {
    title: '3. Consentimiento',
    body:
      'Al completar las respuestas y hacer clic en "Terminar", aceptas los lineamientos de privacidad y el procesamiento seguro de tu información.',
  },
];

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} labelledBy="terms-modal-title">
    <button
      onClick={onClose}
      className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus-ring"
      aria-label="Cerrar"
    >
      <X className="w-5 h-5" />
    </button>

    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <div>
        <h3 id="terms-modal-title" className="text-xl font-bold text-gray-900">
          Términos y Condiciones
        </h3>
        <p className="text-xs text-gray-500">Happly Platform • 2026</p>
      </div>
    </div>

    <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
      <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
        <Lock className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600">
          Tus respuestas son estrictamente confidenciales y se procesan para personalizar tu experiencia de bienestar y desarrollo personal.
        </p>
      </div>

      {SECTIONS.map(({ title, body }) => (
        <section key={title}>
          <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand" /> {title}
          </h4>
          <p>{body}</p>
        </section>
      ))}
    </div>

    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
      <Button size="md" onClick={onClose} className="w-full sm:w-auto font-medium">
        Entendido
      </Button>
    </div>
  </Modal>
);
