export interface Phase2Question {
  id: number;
  prompt: string;
  options: {
    id: string;
    label: string;
  }[];
  submitLabel?: string;
}

export const PHASE_2_QUESTIONS: Phase2Question[] = [
  {
    id: 1,
    prompt: 'En mi cotidianidad...',
    options: [
      {
        id: 'predominar_positivas',
        label: 'Tienden a predominar las emociones positivas',
      },
      {
        id: 'positivas_pocas_negativas',
        label: 'Hay emociones positivas y pocas emociones negativas',
      },
      {
        id: 'negativas_pocas_positivas',
        label: 'Hay emociones negativas y pocas emociones positivas',
      },
      {
        id: 'predominar_negativas',
        label: 'Tienden a predominar las emociones negativas',
      },
    ],
  },
  {
    id: 2,
    prompt: 'Las cosas que hago...',
    options: [
      {
        id: 'desarrollar_mucho',
        label: 'Me permiten desarrollar mucho mis habilidades',
      },
      {
        id: 'desarrollar_poco',
        label: 'Me permiten desarrollar un poco mis habilidades',
      },
      {
        id: 'no_aportan',
        label: 'No me aportan en el desarrollo de mis habilidades',
      },
      {
        id: 'obstaculizan',
        label: 'Obstaculizan el desarrollo de mis habilidades',
      },
    ],
  },
  {
    id: 3,
    prompt: 'Lo que hago...',
    options: [
      {
        id: 'proposito_muy_claro',
        label: 'Tiene un propósito muy claro',
      },
      {
        id: 'proposito_en_parte_definido',
        label: 'Tiene un propósito en parte definido',
      },
      {
        id: 'proposito_confuso',
        label: 'Tiene un propósito confuso',
      },
      {
        id: 'carece_de_proposito',
        label: 'Carece de propósito',
      },
    ],
  },
  {
    id: 4,
    prompt: 'Generalmente me siento...',
    options: [
      {
        id: 'muy_feliz',
        label: 'Muy feliz',
      },
      {
        id: 'feliz',
        label: 'Feliz',
      },
      {
        id: 'infeliz',
        label: 'Infeliz',
      },
      {
        id: 'muy_infeliz',
        label: 'Muy infeliz',
      },
    ],
  },
  {
    id: 5,
    prompt: 'Lo que hago...',
    options: [
      {
        id: 'mostrar_todas_fortalezas',
        label: 'Me permite mostrar todas mis fortalezas',
      },
      {
        id: 'algunas_fortalezas',
        label: 'Requiere algunas de mis fortalezas pero no todas',
      },
      {
        id: 'pocas_fortalezas',
        label: 'Requiere que utilice pocas de mis fortalezas',
      },
      {
        id: 'ninguna_fortaleza',
        label: 'No requiere que utilice ninguna de mis fortalezas',
      },
    ],
  },
  {
    id: 6,
    prompt: 'Lo que hago...',
    options: [
      {
        id: 'mucho_sentido',
        label: 'Tiene mucho sentido',
      },
      {
        id: 'algo_de_sentido',
        label: 'Tiene algo de sentido',
      },
      {
        id: 'poco_sentido',
        label: 'Tiene poco sentido',
      },
      {
        id: 'carece_de_sentido',
        label: 'Carece de sentido',
      },
    ],
  },
  {
    id: 7,
    prompt: 'Suelo experimentar...',
    options: [
      {
        id: 'alegria_mayor_tiempo',
        label: 'Alegría la mayor parte del tiempo',
      },
      {
        id: 'alegria_algo_tristeza',
        label: 'Alegría y algo de tristeza',
      },
      {
        id: 'tristeza_algo_alegria',
        label: 'Tristeza y algo de alegría',
      },
      {
        id: 'tristeza_mayor_tiempo',
        label: 'Tristeza la mayor parte del tiempo',
      },
    ],
  },
  {
    id: 8,
    prompt: 'Las actividades que realizo implican retos que...',
    options: [
      {
        id: 'ajustan_muy_bien',
        label: 'Se ajustan muy bien a mis capacidades',
      },
      {
        id: 'ajustan_algo',
        label: 'Se ajustan algo a mis capacidades',
      },
      {
        id: 'ajustan_muy_poco',
        label: 'Se ajustan muy poco a mis capacidades',
      },
      {
        id: 'no_se_ajustan',
        label: 'No se ajustan a mis capacidades',
      },
    ],
  },
  {
    id: 9,
    prompt: 'En mi cotidianidad...',
    options: [
      {
        id: 'contento_mayor_tiempo',
        label: 'La mayor parte del tiempo me siento contento',
      },
      {
        id: 'contento_algunas_aburrido',
        label: 'Suelo estar contento y algunas veces estoy aburrido',
      },
      {
        id: 'aburrido_algunas_contento',
        label: 'Suelo estar aburrido y algunas veces estoy contento',
      },
      {
        id: 'aburrido_mayor_tiempo',
        label: 'La mayor parte del tiempo me siento aburrido',
      },
    ],
  },
  {
    id: 10,
    prompt: 'Soy...',
    options: [
      {
        id: 'muy_feliz',
        label: 'Muy feliz',
      },
      {
        id: 'feliz',
        label: 'Feliz',
      },
      {
        id: 'infeliz',
        label: 'Infeliz',
      },
      {
        id: 'muy_infeliz',
        label: 'Muy infeliz',
      },
    ],
    submitLabel: 'Terminar',
  },
];
