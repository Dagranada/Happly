export interface FormData {
  userName: string;
  // Step 0: Reglas y términos
  acceptedTerms: 'si' | 'no' | '';

  // Step 1
  gender: 'masculino' | 'femenino' | 'otro' | '';
  birthDate: string;
  hasPartner: 'si' | 'no' | '';
  profession: string;
  childrenCount: number | string;

  // Step 2
  incomeCoversNeeds: 'si' | 'no' | '';
  hasSupportNetwork: 'si' | 'no' | '';
  hasSpiritualPsychSupport: 'si' | 'no' | '';
  hasTeamInCharge: 'si' | 'no' | '';
  workPreferenceText: string;

  // Step 3
  workPreferenceChoice: 'goals' | 'leadership' | 'relationships' | '';

  // Phase 2 - Questions 1 to 10
  dailyEmotions: string;
  skillsDevelopment: string;
  phase2Answers: Record<number, string>;

  // Actividades del programa (id → respuesta)
  activityAnswers: Record<number, ActivityAnswer>;
}

export type Mood = 1 | 2 | 3 | 4 | 5;

export interface ActivityAnswer {
  text: string;
  mood: Mood | null;
}

export const INITIAL_FORM_DATA: FormData = {
  userName: 'Daniel',
  acceptedTerms: '',
  gender: '',
  birthDate: '',
  hasPartner: '',
  profession: '',
  childrenCount: '',

  incomeCoversNeeds: '',
  hasSupportNetwork: '',
  hasSpiritualPsychSupport: '',
  hasTeamInCharge: '',
  workPreferenceText: '',

  workPreferenceChoice: '',
  dailyEmotions: '',
  skillsDevelopment: '',
  phase2Answers: {},
  activityAnswers: {},
};
