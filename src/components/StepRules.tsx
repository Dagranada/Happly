import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, BadgeCheck, ArrowRight } from 'lucide-react';
import { FormData } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { RadioOption } from './ui/RadioOption';

interface StepRulesProps {
  formData: FormData;
  updateForm: (fields: Partial<FormData>) => void;
  onStart: () => void;
  onOpenFullPolicy: () => void;
}

const RULE_CARDS = [
  {
    id: 'card-precautions',
    Icon: Eye,
    title: 'Precauciones importantes:',
    body: 'Las respuestas que nos compartas no representan ningún riesgo para tu salud física o mental. Sin embargo, en algunas personas pueden surgir emociones o sensaciones de incomodidad relacionadas con tu trabajo. Esto es normal y suele desaparecer rápido. Si llegas a sentirte abrumado(a), no dudes en buscar apoyo.',
  },
  {
    id: 'card-confidentiality',
    Icon: BadgeCheck,
    title: 'Confidencialidad garantizada:',
    body: 'Tu participación es voluntaria y confidencial. Tu organización no podrá ver tus resultados individuales, solo los datos agrupados por equipos de trabajo. Además, tratamos tus respuestas de nuestra política de manejo de datos.',
  },
];

export const StepRules: React.FC<StepRulesProps> = ({ formData, updateForm, onStart, onOpenFullPolicy }) => {
  const [showDeclinedNotice, setShowDeclinedNotice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const hasSelected = formData.acceptedTerms === 'si' || formData.acceptedTerms === 'no';

  const [scrollProgress, setScrollProgress] = useState({
    thumbHeight: 40,
    thumbTop: 0,
    canScroll: true,
  });

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const trackHeight = track.clientHeight;

    if (scrollHeight <= clientHeight) {
      setScrollProgress({
        thumbHeight: trackHeight,
        thumbTop: 0,
        canScroll: false,
      });
      return;
    }

    const calculatedHeight = Math.max(32, (clientHeight / scrollHeight) * trackHeight);
    const maxScroll = scrollHeight - clientHeight;
    const maxThumbTop = trackHeight - calculatedHeight;
    const calculatedTop = (scrollTop / maxScroll) * maxThumbTop;

    setScrollProgress({
      thumbHeight: calculatedHeight,
      thumbTop: calculatedTop,
      canScroll: true,
    });
  }, []);

  useEffect(() => {
    updateThumb();
    window.addEventListener('resize', updateThumb);
    return () => window.removeEventListener('resize', updateThumb);
  }, [updateThumb]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSelected) return;

    if (formData.acceptedTerms === 'si') {
      onStart();
    } else {
      setShowDeclinedNotice(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {RULE_CARDS.map(({ id, Icon, title, body }) => (
          <Card key={id} id={id} className="p-5 sm:p-6 md:p-7">
            <div className="mb-2.5 sm:mb-3 text-gray-700">
              <Icon className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="text-[17px] sm:text-[18px] md:text-[19px] font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-[14.5px] sm:text-[15px] leading-relaxed">{body}</p>
          </Card>
        ))}
      </div>

      <section id="data-policy-section" className="pt-1">
        <h3 className="text-[17px] sm:text-[18px] md:text-[19px] font-bold text-gray-900 mb-1">
          Política de manejo de datos
        </h3>
        <button
          type="button"
          onClick={onOpenFullPolicy}
          className="inline-flex items-center text-brand hover:text-brand-600 text-[14px] sm:text-[14.5px] font-medium hover:underline mb-3.5 transition-colors cursor-pointer focus-ring rounded"
        >
          Ver toda la política de manejo de datos
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </button>

        {/* Caja legal con scrollbar personalizado siempre visible */}
        <Card className="relative p-4 sm:p-5 md:p-6 h-44 sm:h-52 md:h-56">
          <div
            id="legal-text-scrollable"
            ref={scrollRef}
            onScroll={updateThumb}
            tabIndex={0}
            className="h-full overflow-y-scroll pr-4 text-gray-500 text-[13px] sm:text-[13.5px] leading-[1.65] space-y-3.5 custom-hide-native-scroll focus-ring rounded-xl"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <p>
              Por medio del presente, como titular de mis datos personales, autorizo a SIETE GESTIÓN HUMANA Y
              ORGANIZACIONAL SAS conforme a lo dispuesto en la Ley colombiana 1581 de 2012, el Decreto 1377 de
              2013 y demás normas aplicables, al tratamiento de mis datos personales única y exclusivamente
              para el cumplimiento de las siguientes finalidades: (i) Comunicarse eficazmente en relación con
              servicios, productos y promociones; (ii) Evaluar y mejorar la calidad de los productos y
              servicios; (iii) Personalizar la experiencia del usuario, ofreciendo sugerencias y
              recomendaciones relevantes basadas en las respuestas a las encuestas y las actividades
              registradas, así como reportar resultados; (iv) Ofrecer asistencia técnica y soporte, además de
              procesar y atender peticiones, quejas y reclamos; (v) Cumplir obligaciones con afiliados,
              usuarios, proveedores y demás relacionados; (vi) Controlar y prevenir el fraude en todas sus
              modalidades; (vii) Analizar los datos de manera agregada y anónima para mejorar los algoritmos y
              métodos de medición y para hacer investigación científica.
            </p>
            <p>
              Dejo constancia expresa que, (i) conozco mi derecho a acceder en cualquier momento a los datos
              suministrados, a solicitar su corrección, actualización o supresión en los términos establecidos
              en la ley, y (ii) que puedo acceder en cualquier momento a la Política de Tratamiento de Datos
              Personales se encuentra publicada en la página web para conocimiento de todos los titulares de
              la información.
            </p>
          </div>

          {scrollProgress.canScroll && (
            <div
              ref={trackRef}
              aria-hidden="true"
              className="absolute right-2.5 top-3.5 bottom-3.5 w-1.5 bg-brand-100 rounded-full pointer-events-none"
            >
              <div
                className="w-full bg-brand rounded-full transition-all duration-75 shadow-xs"
                style={{
                  height: `${scrollProgress.thumbHeight}px`,
                  transform: `translateY(${scrollProgress.thumbTop}px)`,
                }}
              />
            </div>
          )}
        </Card>
      </section>

      <div className="pt-2 space-y-4">
        <div className="md:flex md:items-end md:justify-between md:gap-6">
          <fieldset>
            <legend className="text-[17px] text-gray-800 mb-3 font-medium">¿Aceptas los términos?</legend>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              <RadioOption
                name="acceptTerms"
                value="si"
                checked={formData.acceptedTerms === 'si'}
                onChange={() => {
                  setShowDeclinedNotice(false);
                  updateForm({ acceptedTerms: 'si' });
                }}
                label="Si"
                className="gap-2 pr-5"
              />
              <RadioOption
                name="acceptTerms"
                value="no"
                checked={formData.acceptedTerms === 'no'}
                onChange={() => updateForm({ acceptedTerms: 'no' })}
                label="No"
                className="gap-2 pr-5"
              />
            </div>
          </fieldset>

          <div className="pt-2 md:pt-0">
            <Button type="submit" disabled={!hasSelected}>
              Continuar
            </Button>
          </div>
        </div>

        {showDeclinedNotice && formData.acceptedTerms === 'no' && (
          <div
            role="alert"
            className="p-3.5 bg-warning-100/90 border border-warning-200/70 rounded-2xl text-[13.5px] text-warning-700 flex items-start gap-2 animate-in fade-in"
          >
            <span className="font-semibold shrink-0">Nota:</span>
            <span>
              Para poder realizar el cuestionario y guardar tus resultados, es indispensable aceptar la
              política de tratamiento de datos.
            </span>
          </div>
        )}
      </div>
    </form>
  );
};
