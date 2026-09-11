import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { FormData } from '../types';
import { PHASE_2_QUESTIONS } from '../data/phase2Questions';
import { getLevel } from '../lib/levels';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LevelBadge } from './ui/Badge';
import { Modal } from './ui/Modal';

interface ResultsSummaryProps {
  formData: FormData;
  onEditStep?: (step: number) => void;
  onReset: () => void;
  onGoToHome?: () => void;
}

const MAX_SCORE = '4.0';
const FALLBACK_SCORE = 3.4;

/* Preguntas que componen cada dimensión (DESIGN.md §11.7) */
const DIMENSIONS = [
  {
    key: 'gratificacion',
    title: <>Gratificación<br />en el trabajo</>,
    questionIds: [2, 5, 8],
    short: '🙂🏆 ¡Excelente! Tu trabajo te reta, te estimula y te permite...',
    full: '🙂🏆 ¡Excelente! Tu trabajo te reta, te estimula y te permite desplegar todo tu potencial. Estás en un punto en el que puedes crecer, brillar y dejar huella. 🌟 Ese nivel de gratificación no solo te beneficia a ti: te posiciona como una persona que lidera con su ejemplo, que inspira a otros y que transforma su entorno con lo que sabe hacer.',
  },
  {
    key: 'disfrute',
    title: <>Disfrute<br />del trabajo</>,
    questionIds: [1, 4, 7, 9, 10],
    short: '🎉 ¡Tu nivel de disfrute en el trabajo es muy alto!...',
    full: '🎉 ¡Tu nivel de disfrute en el trabajo es muy alto! Vives tu jornada con entusiasmo y emociones positivas que impactan profundamente tu bienestar y el ambiente que compartes con otras personas. 🌟 Eres un faro de energía positiva.',
  },
  {
    key: 'sentido',
    title: <>Sentido en<br />el trabajo</>,
    questionIds: [3, 6],
    short: '🏆 ¡Felicitaciones! Lo que haces tiene un propósito...',
    full: '🏆 ¡Felicitaciones! Lo que haces tiene un propósito claro para ti. Sientes que tu trabajo impacta de forma positiva y que estás aportando a algo más grande que tú. 💡 Esa claridad de propósito es poderosa: te convierte en alguien que no solo hace, sino que mueve, transforma y guía.',
  },
] as const;

const GENERAL_TEXT = {
  short:
    'Vives una experiencia laboral muy positiva que te llena y te da propósito, lo que te convierte en una inspiración natural para otras personas...',
  full:
    '🎉 ¡Genial! Estás viviendo una experiencia laboral positiva, con disfrute, reto y propósito. Estás en un punto donde lo que haces te llena y eso te convierte en una inspiración natural para otras personas. 🌟 Tu energía, actitud y motivación son contagiosas. No subestimes el impacto que tiene una persona feliz en el trabajo: mejora la comunicación, eleva la productividad y construye ambientes laborales más sanos.',
};

const EXPAND_EASE = [0.04, 0.62, 0.23, 0.98] as const;

/* Texto con "Leer más / Leer menos": la altura se anima entre ambas versiones
   mientras los textos se funden (crossfade). Sin saltos ni parpadeo. */
const ExpandableText: React.FC<{
  short: string;
  full: string;
  expanded: boolean;
  onToggle: () => void;
  buttonClassName?: string;
}> = ({ short, full, expanded, onToggle, buttonClassName = '' }) => {
  const shortRef = useRef<HTMLParagraphElement>(null);
  const fullRef = useRef<HTMLParagraphElement>(null);
  const [heights, setHeights] = useState<{ short: number; full: number } | null>(null);

  // Medimos ambas versiones (antes del primer paint y en cada resize)
  useLayoutEffect(() => {
    const measure = () => {
      if (!shortRef.current || !fullRef.current) return;
      setHeights({
        short: shortRef.current.offsetHeight,
        full: fullRef.current.offsetHeight,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (shortRef.current) observer.observe(shortRef.current);
    if (fullRef.current) observer.observe(fullRef.current);
    return () => observer.disconnect();
  }, [short, full]);

  const targetHeight = heights ? (expanded ? heights.full : heights.short) : 'auto';

  return (
    <>
      <motion.div
        className="relative overflow-hidden"
        initial={false}
        animate={{ height: targetHeight }}
        transition={{ duration: 0.45, ease: EXPAND_EASE }}
      >
        <motion.p
          ref={shortRef}
          aria-hidden={expanded}
          initial={false}
          animate={{ opacity: expanded ? 0 : 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute inset-x-0 top-0"
        >
          {short}
        </motion.p>
        <motion.p
          ref={fullRef}
          aria-hidden={!expanded}
          initial={false}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: expanded ? 0.1 : 0 }}
          className="absolute inset-x-0 top-0"
        >
          {full}
        </motion.p>
      </motion.div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={`inline-flex items-center gap-1 text-[13px] sm:text-[14px] font-medium text-brand hover:text-brand-600 transition-colors cursor-pointer select-none focus-ring rounded ${buttonClassName}`}
      >
        <span>{expanded ? 'Leer menos' : 'Leer más'}</span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.35, ease: EXPAND_EASE }}
          className="flex items-center"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
    </>
  );
};

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ formData, onReset, onGoToHome }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const { generalScore, dimensionScores, ratio } = useMemo(() => {
    const getQScore = (qId: number): number | null => {
      const q = PHASE_2_QUESTIONS.find((item) => item.id === qId);
      if (!q) return null;
      const answerId =
        formData.phase2Answers[qId] ||
        (qId === 1 ? formData.dailyEmotions : '') ||
        (qId === 2 ? formData.skillsDevelopment : '');
      if (!answerId) return null;
      const optIndex = q.options.findIndex((opt) => opt.id === answerId);
      if (optIndex === -1) return null;
      return 4 - optIndex; // 0 → 4, 1 → 3, 2 → 2, 3 → 1
    };

    const average = (ids: number[]): number => {
      const scores = ids.map(getQScore).filter((s): s is number => s !== null);
      if (scores.length === 0) return FALLBACK_SCORE;
      return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    };

    const general = average(Array.from({ length: 10 }, (_, i) => i + 1));

    return {
      generalScore: general,
      dimensionScores: Object.fromEntries(
        DIMENSIONS.map((d) => [d.key, average([...d.questionIds])])
      ) as Record<(typeof DIMENSIONS)[number]['key'], number>,
      // Escala 1.0–4.0 normalizada a 0–1 para el gauge
      ratio: Math.max(0, Math.min(1, (general - 1.0) / 3.0)),
    };
  }, [formData]);

  // Animación de entrada del gauge (easeOutCubic, 1.3 s)
  const [animatedRatio, setAnimatedRatio] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1300;
    let frame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedRatio(eased * ratio);
      setAnimatedScore(eased * generalScore);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [ratio, generalScore]);

  // Arco de 260° desde 140° (abajo-izquierda) hasta 400° (abajo-derecha)
  const cx = 120;
  const cy = 110;
  const r = 85;
  const angleRad = ((140 + animatedRatio * 260) * Math.PI) / 180;
  const knobX = cx + r * Math.cos(angleRad);
  const knobY = cy + r * Math.sin(angleRad);

  const generalLevel = getLevel(generalScore);

  return (
    <div className="flex-grow flex flex-col justify-between animate-in fade-in duration-300 pb-2">
      <div className="space-y-4">
        {/* Gauge */}
        <div className="relative w-[240px] h-[240px] mx-auto flex flex-col items-center justify-start">
          <svg viewBox="0 0 240 190" className="w-full h-[190px] overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="100%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--color-danger-500)' }} />
                <stop offset="50%" style={{ stopColor: 'var(--color-warning-500)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-success-500)' }} />
              </linearGradient>
              <filter id="knobShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.18" />
              </filter>
            </defs>
            <path d="M 54.9 164.6 A 85 85 0 1 1 185.1 164.6" fill="none" style={{ stroke: 'var(--color-gray-100)' }} strokeWidth="8" strokeLinecap="round" />
            <path d="M 54.9 164.6 A 85 85 0 1 1 185.1 164.6" fill="none" stroke="url(#arcGradient)" strokeWidth="8" strokeLinecap="round" />
            <circle cx={knobX} cy={knobY} r="10.5" fill="#FFFFFF" style={{ stroke: 'var(--color-gray-200)' }} strokeWidth="1.5" filter="url(#knobShadow)" />
          </svg>

          <div className="absolute top-[82px] inset-x-0 flex flex-col items-center text-center pointer-events-none">
            <div className="flex items-baseline justify-center">
              <span className="text-[44px] font-extrabold text-gray-900 tracking-tight leading-none tabular-nums">
                {animatedScore.toFixed(1)}
              </span>
              <span className="text-[19px] font-medium text-gray-700 ml-1">/{MAX_SCORE}</span>
            </div>
            <LevelBadge level={generalLevel} className="mt-2 px-4 text-[12.5px] shadow-2xs" />
            <p className="text-[15.5px] font-medium text-gray-800 leading-[1.25] mt-2.5">
              Felicidad<br />general en el<br />trabajo
            </p>
          </div>
        </div>

        <div className="pt-2 text-center sm:text-left max-w-xl mx-auto text-[13.5px] sm:text-[14px] leading-relaxed text-gray-700">
          <ExpandableText
            short={GENERAL_TEXT.short}
            full={GENERAL_TEXT.full}
            expanded={!!expanded.general}
            onToggle={() => toggle('general')}
            buttonClassName="mt-2.5 w-full justify-center"
          />
        </div>

        <h3 className="pt-2 sm:pt-3 text-[16px] sm:text-[18px] font-bold text-gray-900 text-center tracking-tight">
          Conformado por:
        </h3>

        <div className="pt-0.5 grid gap-3 sm:gap-4 md:grid-cols-3">
          {DIMENSIONS.map((dim) => {
            const score = dimensionScores[dim.key];
            return (
              <div key={dim.key}>
                <Card className="p-4 sm:p-5">
                  <div className="flex items-start justify-between">
                    <h4 className="text-[15px] sm:text-[16px] font-medium text-gray-800 leading-tight max-w-[200px]">
                      {dim.title}
                    </h4>
                    <div className="flex flex-col items-end">
                      <div className="flex items-baseline">
                        <span className="text-[20px] sm:text-[22px] font-extrabold text-gray-900 leading-none">
                          {score.toFixed(1)}
                        </span>
                        <span className="text-[13px] sm:text-[14px] font-semibold text-gray-700 ml-0.5">
                          /{MAX_SCORE}
                        </span>
                      </div>
                      <LevelBadge level={getLevel(score)} className="mt-1" />
                    </div>
                  </div>

                  <div className="mt-3 text-[13px] sm:text-[14px] leading-relaxed text-gray-700">
                    <ExpandableText
                      short={dim.short}
                      full={dim.full}
                      expanded={!!expanded[dim.key]}
                      onToggle={() => toggle(dim.key)}
                      buttonClassName="mt-2.5 w-full justify-center"
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <p className="text-[11.5px] leading-tight text-gray-400 text-center max-w-[280px] mx-auto pt-2">
          Recuerda que para mejorar tus niveles debes desarrollar un hábito, y para eso está este programa.
        </p>

        <div className="pt-2 pb-4 flex justify-center">
          <Button onClick={() => setShowConfirmModal(true)}>Entendido</Button>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        labelledBy="results-confirm-title"
        size="sm"
      >
        <div className="text-center space-y-4">
          <h3 id="results-confirm-title" className="text-lg font-bold text-gray-900">
            ¡Evaluación Finalizada!
          </h3>
          <p className="text-sm text-gray-600">
            Has revisado tus resultados de felicidad en el trabajo con éxito.
          </p>
          <div className="space-y-2 pt-2">
            {onGoToHome && (
              <Button
                size="md"
                className="w-full"
                onClick={() => {
                  setShowConfirmModal(false);
                  onGoToHome();
                }}
              >
                Ir a mi pantalla de inicio
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => setShowConfirmModal(false)}
            >
              Permanecer aquí
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => {
                setShowConfirmModal(false);
                onReset();
              }}
            >
              Reiniciar evaluación
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
