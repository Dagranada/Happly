import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Smile, ClipboardCheck, Sun, Send, Check, Pencil } from 'lucide-react';
import { HapplyLogo } from './HapplyLogo';
import { Footer } from './Footer';
import { FormData } from '../types';
import { ProgramTab } from './ProgramTab';
import { LeaderboardTab } from './LeaderboardTab';
import { AchievementsTab } from './AchievementsTab';
import { ActivityDetailScreen } from './ActivityDetailScreen';
import { getLevel } from '../lib/levels';
import type { Gamification } from '../lib/useGamification';
import type { DashboardActivity, CompletionResult } from '../types/gamification';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LevelBadge } from './ui/Badge';
import { Toast } from './ui/Toast';
import { Avatar } from './ui/Avatar';
import { HappinessChart } from './HappinessChart';

// Icono oficial de WhatsApp
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.217 8.217 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.06 0 1.21.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
  </svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

type NotificationChannel = 'Mail' | 'WhatsApp';
const NOTIFICATION_OPTIONS: { id: NotificationChannel; label: string }[] = [
  { id: 'Mail', label: 'Mail' },
  { id: 'WhatsApp', label: 'WhatsApp' },
];

type TabType = 'Home' | 'Program' | 'Achievements' | 'Leaderboard';
const TABS: { id: TabType; label: string }[] = [
  { id: 'Home', label: 'Inicio' },
  { id: 'Program', label: 'Programa' },
  { id: 'Achievements', label: 'Logros' },
  { id: 'Leaderboard', label: 'Ranking' },
];

type FilterType = 'general' | 'gratificacion' | 'disfrute' | 'sentido';
const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'general', label: 'Felicidad general' },
  { id: 'gratificacion', label: 'Gratificación en el trabajo' },
  { id: 'disfrute', label: 'Disfrute del trabajo' },
  { id: 'sentido', label: 'Sentido en el trabajo' },
];

/* Datos de demostración */
const DEMO = {
  generalScore: 3.4,
  subScores: [
    { label: 'Gratificación', value: 3.4 },
    { label: 'Disfrute', value: 3.4 },
    { label: 'Sentido', value: 3.4 },
  ],
  /* Evolución mensual (1.0–4.0) por dimensión */
  history: {
    general: [3.0, 2.7, 3.8, 3.4],
    gratificacion: [2.8, 2.6, 3.6, 3.4],
    disfrute: [3.2, 2.9, 3.7, 3.4],
    sentido: [3.0, 2.6, 3.9, 3.3],
  } as Record<FilterType, number[]>,
};

const CHART_MONTHS = ['30 May', '30 Jun', '30 Jul', '30 Ago'];

const SECTION_TITLE = 'text-[18px] sm:text-[19px] font-bold text-gray-900 mb-3 tracking-tight';
const CARD_TITLE = 'flex items-center gap-2.5 text-[15px] font-semibold text-gray-800';

interface HomeScreenProps {
  formData?: FormData;
  onOpenTerms: () => void;
  initialTab?: TabType;
  gamification: Gamification;
  onCelebrate: (result: CompletionResult) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  formData,
  onOpenTerms,
  initialTab = 'Home',
  gamification,
  onCelebrate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [activeFilter, setActiveFilter] = useState<FilterType>('general');
  const [intentionText, setIntentionText] = useState('');
  const [savedIntention, setSavedIntention] = useState<string | null>(null);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationChannel>('Mail');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [activeActivity, setActiveActivity] = useState<DashboardActivity | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarUrl(reader.result);
      showToast('Foto de perfil actualizada');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    if (!showNotificationMenu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest('#notification-menu-wrapper')) {
        setShowNotificationMenu(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showNotificationMenu]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentionText.trim()) return;
    setSavedIntention(intentionText.trim());
    setIntentionText('');
    gamification.addPoints(10);
    showToast('¡Intención guardada con éxito! +10 pts 🎉');
  };

  const userName = formData?.userName?.trim() || 'Alejandro Gómez';

  const stats = [
    { label: 'Racha', value: <>{gamification.streakCount}</> },
    { label: 'Puntos', value: <>{gamification.pointsCount}</> },
    { label: 'Ánimo', value: <Smile className="w-7 h-7 text-white stroke-[1.8] mb-1" aria-label="Ánimo" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased flex flex-col justify-between selection:bg-brand/20 selection:text-brand relative">
      {/* Brillo lavanda ambiental en la esquina superior derecha */}
      <div
        className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-bl from-brand-100/60 via-brand-50/30 to-transparent pointer-events-none rounded-full blur-3xl -z-0"
        aria-hidden="true"
      />

      <main className="flex-grow px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-28 max-w-md sm:max-w-lg lg:max-w-5xl xl:max-w-6xl mx-auto w-full flex flex-col justify-start relative z-10">
        <div className="py-2.5 mb-2 lg:pt-8 lg:mb-10 flex justify-center lg:justify-start items-center">
          <HapplyLogo />
        </div>

        {/* Desktop (lg+): perfil fijo a la izquierda, tabs y contenido a la derecha */}
        <div className="lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8 lg:items-start">
          <aside className="lg:sticky lg:top-6">
            {/* Tarjeta de perfil y progreso */}
            <div className="bg-brand text-white rounded-3xl p-5 sm:p-6 shadow-lg shadow-brand/20 space-y-4 relative overflow-hidden">
              <div
                className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="flex items-center gap-3">
                {/* Avatar con lápiz para cambiar la foto */}
                <div className="relative shrink-0">
                  <Avatar src={avatarUrl} className="w-10 h-10 border-2 border-white/60 shadow-xs" />
                  <button
                    type="button"
                    aria-label="Cambiar foto de perfil"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-white text-brand border border-brand-100 shadow-xs flex items-center justify-center hover:bg-brand-50 active:scale-95 transition-all cursor-pointer focus-ring"
                  >
                    <Pencil className="w-2.5 h-2.5 stroke-[2.5]" />
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                    tabIndex={-1}
                  />
                </div>
                <h2 className="text-[17px] font-semibold text-white tracking-tight">{userName}</h2>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[17px] font-bold text-white tracking-tight">
                  <span>Progreso general</span>
                  <span>{gamification.progressPercent}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={gamification.progressPercent}
                  className="w-full h-2 bg-white/30 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gamification.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>

              {/* Selector de canal de notificaciones */}
              <div className="flex items-center gap-2 pt-0.5 relative">
                <span className="text-[13.5px] text-white/90 font-medium">Notificaciones:</span>
                <div id="notification-menu-wrapper" className="relative">
                  <button
                    id="notification-trigger-btn"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={showNotificationMenu}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotificationMenu((prev) => !prev);
                    }}
                    className="bg-white/20 hover:bg-white/25 active:scale-95 transition-all text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer backdrop-blur-xs shadow-2xs select-none focus-ring"
                  >
                    {selectedNotification === 'WhatsApp' ? (
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                    ) : (
                      <MailIcon className="w-3.5 h-3.5 text-white" />
                    )}
                    <span className="font-semibold">{selectedNotification}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 ${
                        showNotificationMenu ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showNotificationMenu && (
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        id="notification-dropdown-menu"
                        className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-2xl shadow-xl border border-gray-100 py-1.5 z-30 min-w-[140px] overflow-hidden"
                      >
                        {NOTIFICATION_OPTIONS.map((opt) => {
                          const isSelected = selectedNotification === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              role="menuitemradio"
                              aria-checked={isSelected}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNotification(opt.id);
                                setShowNotificationMenu(false);
                                showToast(`Notificaciones cambiadas a ${opt.label}`);
                              }}
                              id={`notif-opt-${opt.id.toLowerCase()}`}
                              className={`w-full text-left px-3.5 py-2.5 text-xs font-medium hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer focus-ring ${
                                isSelected ? 'text-brand font-semibold bg-brand/10' : 'text-gray-700'
                              }`}
                            >
                              {opt.id === 'WhatsApp' ? (
                                <WhatsAppIcon
                                  className={`w-4 h-4 ${isSelected ? 'text-success-500' : 'text-gray-500'}`}
                                />
                              ) : (
                                <MailIcon
                                  className={`w-4 h-4 ${isSelected ? 'text-brand' : 'text-gray-500'}`}
                                />
                              )}
                              <span className="flex-grow">{opt.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-brand shrink-0 ml-1" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center backdrop-blur-xs border border-white/10 hover:bg-white/25 transition-all shadow-2xs"
                  >
                    <span className="text-[28px] font-extrabold text-white leading-none mb-1 tabular-nums">
                      {stat.value}
                    </span>
                    <span className="text-[12px] text-white/90 font-medium tracking-tight">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            {/* Tabs */}
            <div className="border-b border-gray-200/90 mt-5 lg:mt-0 mb-5">
              <nav
                className="flex items-center justify-between lg:justify-start lg:gap-10 text-[14px] sm:text-[15px]"
                role="tablist"
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-2.5 font-medium transition-colors relative cursor-pointer px-1 focus-ring rounded-t ${
                        isActive ? 'text-brand font-semibold' : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute bottom-0 inset-x-0 h-[2.5px] bg-brand rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {activeTab === 'Program' && (
              <ProgramTab
                program={gamification.program}
                otherPrograms={gamification.otherPrograms}
                onOpenActivity={setActiveActivity}
              />
            )}

            {activeTab === 'Leaderboard' && (
              <LeaderboardTab currentUser={{ name: userName, points: gamification.pointsCount, avatarUrl }} />
            )}

            {activeTab === 'Achievements' && (
              <AchievementsTab program={gamification.program} otherPrograms={gamification.otherPrograms} />
            )}

            {activeTab === 'Home' && (
              <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
                {/* Actividad de hoy */}
                <Card className="space-y-3">
                  <h3 className={CARD_TITLE}>
                    <ClipboardCheck className="w-5 h-5 text-gray-600 stroke-[1.8]" />
                    Tu actividad de hoy
                  </h3>
                  {gamification.todayActivity ? (
                    <>
                      <div>
                        <h4 className="text-[16px] font-bold text-gray-900 leading-snug">
                          {gamification.todayActivity.dayLabel}. {gamification.todayActivity.title}
                        </h4>
                        <p className="text-[12.5px] text-gray-400 font-normal mt-0.5">
                          {gamification.todayActivity.dateLabel}
                        </p>
                      </div>
                      <div className="pt-1">
                        <Button
                          size="md"
                          onClick={() => setActiveActivity(gamification.todayActivity)}
                          className="text-[14px] shadow-sm shadow-brand/25"
                        >
                          Realizar actividad
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-[14px] text-gray-600">
                      ¡Completaste todas las actividades de este programa! 🎉
                    </p>
                  )}
                </Card>

                {/* Intención semanal */}
                <Card className="space-y-2.5">
                  <h3 className={CARD_TITLE}>
                    <Sun className="w-5 h-5 text-gray-600 stroke-[2]" />
                    Mi intención para esta semana
                  </h3>
                  <p className="text-[13.5px] text-gray-500 leading-snug">
                    ¿Con qué te comprometes esta semana para tu bienestar?
                  </p>

                  {savedIntention ? (
                    <div className="bg-brand-50 border border-brand/20 rounded-2xl p-3.5 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-semibold text-brand uppercase tracking-wider">
                          Tu compromiso guardado:
                        </span>
                        <p className="text-sm font-medium text-gray-800 italic">"{savedIntention}"</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSavedIntention(null)}
                        className="text-xs text-gray-400 hover:text-gray-600 p-1 focus-ring rounded"
                      >
                        Editar
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveIntention} className="flex items-center gap-2.5 pt-1">
                      <label htmlFor="intention-input" className="sr-only">
                        Tu intención para esta semana
                      </label>
                      <input
                        id="intention-input"
                        type="text"
                        value={intentionText}
                        onChange={(e) => setIntentionText(e.target.value)}
                        placeholder="Escribe aquí"
                        className="flex-grow bg-gray-50 text-gray-800 placeholder-gray-400 text-[16px] px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand/30 transition-all"
                      />
                      <button
                        type="submit"
                        aria-label="Guardar intención"
                        disabled={!intentionText.trim()}
                        className="w-12 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white transition-all shadow-xs focus-ring bg-brand hover:bg-brand-600 active:scale-95 cursor-pointer disabled:bg-brand-200 disabled:hover:bg-brand-200 disabled:active:scale-100 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5 text-white stroke-[2.2] translate-x-[-1px] translate-y-[1px]" />
                      </button>
                    </form>
                  )}
                </Card>

                {/* Mi felicidad actual */}
                <section className="pt-2 space-y-4 lg:col-span-2">
                  <h2 className={`${SECTION_TITLE} mb-0`}>Mi felicidad actual</h2>

                  {/* Felicidad general: título, badge + score y barra */}
                  <Card className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[18px] sm:text-[19px] font-bold text-brand-900 leading-tight">
                        Felicidad general
                      </h3>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <LevelBadge
                          level={getLevel(DEMO.generalScore)}
                          className="px-3 py-1 text-[12px] font-bold"
                        />
                        <div className="flex items-baseline">
                          <span className="text-[30px] sm:text-[32px] font-extrabold text-brand leading-none tabular-nums">
                            {DEMO.generalScore.toFixed(1)}
                          </span>
                          <span className="text-[14px] font-semibold text-gray-400 ml-0.5">/4.0</span>
                        </div>
                      </div>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={4}
                      aria-valuenow={DEMO.generalScore}
                      aria-label="Felicidad general"
                      className="w-full h-2 bg-brand-100 rounded-full overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(DEMO.generalScore / 4) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-brand rounded-full"
                      />
                    </div>

                    {/* Sub-dimensiones dentro de la misma tarjeta, separadas por divisores */}
                    <div className="border-t border-gray-100" />
                    <div className="grid grid-cols-3 divide-x divide-gray-100">
                      {DEMO.subScores.map((sub) => (
                        <div key={sub.label} className="flex flex-col items-center text-center gap-2.5 px-2">
                          <p className="text-[14px] sm:text-[15px] font-medium text-gray-800 leading-tight">
                            {sub.label}
                          </p>
                          <div className="flex items-baseline">
                            <span className="text-[24px] font-extrabold text-gray-900 leading-none tabular-nums">
                              {sub.value.toFixed(1)}
                            </span>
                            <span className="text-[12px] font-semibold text-gray-400 ml-0.5">/4.0</span>
                          </div>
                          <LevelBadge level={getLevel(sub.value)} className="text-[12px] font-bold" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </section>

                {/* Evolución */}
                <section className="pt-2 lg:col-span-2">
                  <h2 className={SECTION_TITLE}>Evolución de mi felicidad</h2>

                  <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filtrar dimensión">
                    {FILTERS.map((f) => {
                      const active = activeFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setActiveFilter(f.id)}
                          className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer focus-ring ${
                            active
                              ? 'border border-brand text-brand bg-brand/5 font-semibold shadow-2xs'
                              : 'border border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>

                  <HappinessChart
                    seriesKey={activeFilter}
                    points={CHART_MONTHS.map((label, i) => ({ label, value: DEMO.history[activeFilter][i] }))}
                  />
                </section>
              </div>
            )}
          </div>
        </div>

        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </main>

      <Footer onOpenTerms={onOpenTerms} className="relative z-10 pb-24" />

      <AnimatePresence>
        {activeActivity && (
          <ActivityDetailScreen
            key="activity-detail"
            activity={activeActivity}
            onClose={() => setActiveActivity(null)}
            onSubmit={(answer) => {
              const result = gamification.completeActivity(activeActivity.id, answer);
              setActiveActivity(null);
              if (result) onCelebrate(result);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
