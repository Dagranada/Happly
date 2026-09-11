/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormData, INITIAL_FORM_DATA, ActivityAnswer } from './types';
import { PHASE_2_QUESTIONS } from './data/phase2Questions';
import { ACTIVITIES } from './data/activities';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StepRules } from './components/StepRules';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { StepPhase2Intro } from './components/StepPhase2Intro';
import { StepPhase2Question } from './components/StepPhase2Question';
import { ResultsSummary } from './components/ResultsSummary';
import { ActivityStep } from './components/ActivityStep';
import { HomeScreen } from './components/HomeScreen';
import { TermsModal } from './components/TermsModal';
import { FloatingNav, type NavTarget } from './components/FloatingNav';
import { Toast } from './components/ui/Toast';

/* Mapa de pasos (DESIGN.md §6) */
const STEP = {
  RULES: 0,
  PHASE1_FIRST: 1,
  PHASE1_LAST: 3,
  PHASE2_INTRO: 4,
  PHASE2_FIRST: 5,
  PHASE2_LAST: 14,
  RESULTS: 15,
  ACTIVITY_FIRST: 16,
  ACTIVITY_LAST: 19,
} as const;

const SNACKBAR_MS = 4500;

/* Transición entre pasos: avanzar entra desde la derecha y sale por la izquierda;
   retroceder hace lo contrario. `custom` recibe la dirección (1 | -1). */
const SLIDE_PX = 40;
const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? SLIDE_PX : -SLIDE_PX }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -SLIDE_PX : SLIDE_PX }),
};
const stepTransition = { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const };

/* La pantalla de resultados escala en vez de deslizar */
const resultsVariants = {
  enter: { opacity: 0, scale: 0.96 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

export default function App() {
  const [viewMode, setViewMode] = useState<'home' | 'survey'>('home');
  const [currentStep, setCurrentStep] = useState<number>(STEP.RULES);
  const [direction, setDirection] = useState<1 | -1>(1);

  /** Cambia de paso registrando la dirección para la animación. */
  const goToStep = useCallback(
    (step: number) => {
      setDirection(step >= currentStep ? 1 : -1);
      setCurrentStep(step);
    },
    [currentStep]
  );
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const openTerms = useCallback(() => setIsTermsOpen(true), []);

  const NAV_STEP: Record<Exclude<NavTarget, 'home'>, number> = {
    terms: STEP.RULES,
    personal: STEP.PHASE1_FIRST,
    test: STEP.PHASE2_INTRO,
    results: STEP.RESULTS,
    activities: STEP.ACTIVITY_FIRST,
  };

  const activeNav: NavTarget =
    viewMode === 'home'
      ? 'home'
      : currentStep === STEP.RULES
        ? 'terms'
        : currentStep <= STEP.PHASE1_LAST
          ? 'personal'
          : currentStep <= STEP.PHASE2_LAST
            ? 'test'
            : currentStep === STEP.RESULTS
              ? 'results'
              : 'activities';

  const handleNavigate = (target: NavTarget) => {
    if (target === 'home') {
      setViewMode('home');
      return;
    }
    goToStep(NAV_STEP[target]);
    setViewMode('survey');
  };
  const closeTerms = useCallback(() => setIsTermsOpen(false), []);

  // Scroll arriba en cada cambio de paso; snackbar al cerrar la Fase 1
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (viewMode === 'survey' && currentStep === STEP.PHASE2_INTRO) {
      setSnackbar('Información básica completada');
      const timer = setTimeout(() => setSnackbar(null), SNACKBAR_MS);
      return () => clearTimeout(timer);
    }
    setSnackbar(null);
  }, [currentStep, viewMode]);

  const updateForm = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    goToStep(STEP.RULES);
  };

  if (viewMode === 'home') {
    return (
      <>
        <HomeScreen formData={formData} initialTab="Home" onOpenTerms={openTerms} />
        <FloatingNav active={activeNav} onNavigate={handleNavigate} />
        <TermsModal isOpen={isTermsOpen} onClose={closeTerms} />
      </>
    );
  }

  const isResultsScreen = currentStep === STEP.RESULTS;
  const isPhase2Question = currentStep >= STEP.PHASE2_FIRST && currentStep <= STEP.PHASE2_LAST;
  const isActivity = currentStep >= STEP.ACTIVITY_FIRST && currentStep <= STEP.ACTIVITY_LAST;

  const EMPTY_ANSWER: ActivityAnswer = { text: '', mood: null };
  const setActivityAnswer = (id: number, answer: ActivityAnswer) =>
    updateForm({ activityAnswers: { ...formData.activityAnswers, [id]: answer } });

  const stepMotion = {
    custom: direction,
    variants: stepVariants,
    initial: 'enter',
    animate: 'center',
    exit: 'exit',
    transition: stepTransition,
  } as const;

  const renderStep = () => {
    switch (currentStep) {
      case STEP.RULES:
        return (
          <motion.div key="step0" {...stepMotion}>
            <StepRules
              formData={formData}
              updateForm={updateForm}
              onStart={() => goToStep(1)}
              onOpenFullPolicy={openTerms}
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div key="step1" {...stepMotion}>
            <Step1 formData={formData} updateForm={updateForm} onNext={() => goToStep(2)} onBack={() => goToStep(0)} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" {...stepMotion}>
            <Step2 formData={formData} updateForm={updateForm} onNext={() => goToStep(3)} onBack={() => goToStep(1)} />
          </motion.div>
        );
      case STEP.PHASE1_LAST:
        return (
          <motion.div key="step3" {...stepMotion} className="flex-grow flex flex-col">
            <Step3 formData={formData} updateForm={updateForm} onFinish={() => goToStep(STEP.PHASE2_INTRO)} onBack={() => goToStep(2)} />
          </motion.div>
        );
      case STEP.PHASE2_INTRO:
        return (
          <motion.div key="stepPhase2Intro" {...stepMotion}>
            <StepPhase2Intro onStartPhase2={() => goToStep(STEP.PHASE2_FIRST)} />
          </motion.div>
        );
      case STEP.RESULTS:
        return (
          <motion.div key="results" variants={resultsVariants} initial="enter" animate="center" exit="exit" transition={stepTransition}>
            <ResultsSummary
              formData={formData}
              onEditStep={goToStep}
              onReset={handleReset}
              onGoToHome={() => setViewMode('home')}
            />
          </motion.div>
        );
      default:
        if (isActivity) {
          const idx = currentStep - STEP.ACTIVITY_FIRST;
          const activity = ACTIVITIES[idx];
          const isLast = currentStep === STEP.ACTIVITY_LAST;
          return (
            <motion.div key={`activity${idx}`} {...stepMotion}>
              <ActivityStep
                activity={activity}
                index={idx}
                total={ACTIVITIES.length}
                answer={formData.activityAnswers[activity.id] ?? EMPTY_ANSWER}
                onChange={(a) => setActivityAnswer(activity.id, a)}
                onNext={() => (isLast ? setViewMode('home') : goToStep(currentStep + 1))}
                onBack={idx > 0 ? () => goToStep(currentStep - 1) : undefined}
              />
            </motion.div>
          );
        }
        if (!isPhase2Question) return null;
        return (
          <motion.div key={`stepPhase2Q${currentStep - 4}`} {...stepMotion} className="flex-grow flex flex-col">
            <StepPhase2Question
              question={PHASE_2_QUESTIONS[currentStep - STEP.PHASE2_FIRST]}
              formData={formData}
              updateForm={updateForm}
              onNext={() => goToStep(currentStep + 1)}
              onBack={() => goToStep(currentStep - 1)}
            />
          </motion.div>
        );
    }
  };

  return (
    <div
      className={`min-h-screen text-gray-800 antialiased flex flex-col justify-between selection:bg-brand/20 selection:text-brand transition-colors duration-300 relative overflow-x-hidden ${
        isResultsScreen ? 'bg-white' : ''
      }`}
    >
      {/* Brillo lavanda ambiental (desktop) */}
      <div
        className="hidden md:block absolute top-0 right-0 w-[40vw] h-[70vh] bg-gradient-to-bl from-brand-100/70 via-brand-50/40 to-transparent pointer-events-none rounded-full blur-3xl"
        aria-hidden="true"
      />

      <main className="flex-grow px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-28 max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto w-full flex flex-col justify-start relative z-10">
        <Header currentStep={currentStep} userName={formData.userName} />

        <div className="flex-grow flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            {renderStep()}
          </AnimatePresence>
        </div>
      </main>

      <Footer onOpenTerms={openTerms} className="pb-24" />

      <FloatingNav active={activeNav} onNavigate={handleNavigate} />

      <Toast message={snackbar} variant="success" onClose={() => setSnackbar(null)} />

      <TermsModal isOpen={isTermsOpen} onClose={closeTerms} />
    </div>
  );
}
