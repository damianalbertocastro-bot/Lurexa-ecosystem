export interface LinguisticInterferenceRule {
  ruleId: string;
  sourceL1Feature: string;
  targetEnglishInterference: string;
  phonemeOrStructureTarget: string;
  pedagogicalStrategy: string;
  exampleInterference: string;
  targetCorrection: string;
}

export interface LinguisticTransferProfile {
  locale: string;
  languageName: string;
  regionalVariety: string;
  description: string;
  interferenceRules: LinguisticInterferenceRule[];
  defaultInterventionThreshold: number;
}

export const REGIONAL_LINGUISTIC_PROFILES: Record<string, LinguisticTransferProfile> = {
  "es-DO": {
    locale: "es-DO",
    languageName: "Spanish",
    regionalVariety: "Dominican Spanish",
    description: "Deep linguistic profile modeling Dominican Spanish phonology, /s/ aspiration/deletion, vowel epenthesis on initial /s/ clusters, and final consonant reduction.",
    defaultInterventionThreshold: 0.7,
    interferenceRules: [
      {
        ruleId: "DO-ENG-PRO-001",
        sourceL1Feature: "Vowel epenthesis before initial /s/ + consonant clusters",
        targetEnglishInterference: "Prefixing an [e] before English words starting with /s/ + consonant (e.g. 'eschool', 'espeak').",
        phonemeOrStructureTarget: "/s/ + C cluster onset",
        pedagogicalStrategy: "Hiss-and-slide drill isolating pure initial /s/ without antecedent glottal onset.",
        exampleInterference: "I go to eschool.",
        targetCorrection: "I go to school.",
      },
      {
        ruleId: "DO-ENG-PRO-002",
        sourceL1Feature: "Syllable-final /s/ aspiration or total deletion",
        targetEnglishInterference: "Omitting plural -s, third-person singular -s, or possessive 's.",
        phonemeOrStructureTarget: "Coda /s/ and morphological suffixes (-s, -es)",
        pedagogicalStrategy: "Tactile anchor technique tapping fingers on every morphological terminal sibilant.",
        exampleInterference: "He like_ apple_.",
        targetCorrection: "He likes apples.",
      },
      {
        ruleId: "DO-ENG-PRO-003",
        sourceL1Feature: "Intervocalic and syllable-final /d/ lenition/elision",
        targetEnglishInterference: "Dropping final /d/ in past-tense -ed endings or pronouncing voiced /ð/ as unreleased stop.",
        phonemeOrStructureTarget: "Dental fricative /ð/ and final stop /d/",
        pedagogicalStrategy: "Tongue-tip placement visual cue contrasting /d/ vs /ð/.",
        exampleInterference: "I play_ soccer yesterday.",
        targetCorrection: "I played soccer yesterday.",
      },
    ],
  },
  "es-PR": {
    locale: "es-PR",
    languageName: "Spanish",
    regionalVariety: "Puerto Rican Spanish",
    description: "Linguistic profile modeling Puerto Rican Spanish phonology, including pre-consonantal /r/ lateralization to [l] (lambdacism) and velarized /r/ variants.",
    defaultInterventionThreshold: 0.72,
    interferenceRules: [
      {
        ruleId: "PR-ENG-PRO-001",
        sourceL1Feature: "Pre-consonantal /r/ lateralization (lambdacism)",
        targetEnglishInterference: "Pronouncing English syllable-coda /r/ as [l] before consonants (e.g. 'palt' instead of 'part', 'wald' instead of 'ward').",
        phonemeOrStructureTarget: "Rhotic approximant /ɹ/ in syllable coda",
        pedagogicalStrategy: "Curled-tongue retroactive rhotic anchor drills avoiding lateral airflow.",
        exampleInterference: "Take a palt of it.",
        targetCorrection: "Take a part of it.",
      },
      {
        ruleId: "PR-ENG-PRO-002",
        sourceL1Feature: "Syllable-coda /s/ aspiration before consonants",
        targetEnglishInterference: "Aspirating [h] instead of crisp sibilant /s/ (e.g. 'mih-take' for 'mistake').",
        phonemeOrStructureTarget: "Medial /s/ consonant cluster",
        pedagogicalStrategy: "Continuous airflow friction drills maintaining alveolar contact.",
        exampleInterference: "It was a mihtake.",
        targetCorrection: "It was a mistake.",
      },
    ],
  },
  "es-MX": {
    locale: "es-MX",
    languageName: "Spanish",
    regionalVariety: "Mexican Spanish",
    description: "Linguistic profile modeling Mexican Spanish phonology, including unstressed vowel reduction, /v/ vs /b/ bilabial fricative merger, and dental stop release.",
    defaultInterventionThreshold: 0.75,
    interferenceRules: [
      {
        ruleId: "MX-ENG-PRO-001",
        sourceL1Feature: "Bilabial merger of /b/ and /v/ (lack of labiodental contrast)",
        targetEnglishInterference: "Pronouncing English labiodental /v/ as bilabial [β] or [b] (e.g. 'berry' for 'very').",
        phonemeOrStructureTarget: "Labiodental fricative /v/ vs bilabial stop /b/",
        pedagogicalStrategy: "Top-teeth-on-lower-lip tactile feedback contrast drills.",
        exampleInterference: "It is bery good.",
        targetCorrection: "It is very good.",
      },
      {
        ruleId: "MX-ENG-PRO-002",
        sourceL1Feature: "Vowel duration equality (syllable-timed rhythm transfer)",
        targetEnglishInterference: "Giving equal length to unstressed English vowels instead of reducing to schwa /ə/.",
        phonemeOrStructureTarget: "Reduced vowel schwa /ə/ in unstressed syllables",
        pedagogicalStrategy: "Stress-timed clapping rhythm drills compressing unstressed structural words.",
        exampleInterference: "pho-TO-gra-pher (equal beats)",
        targetCorrection: "phə-TOG-rə-fər (stress-timed rhythm)",
      },
    ],
  },
  "es-CO": {
    locale: "es-CO",
    languageName: "Spanish",
    regionalVariety: "Colombian Spanish",
    description: "Linguistic profile modeling Colombian Spanish phonology, characterized by clear vowel articulation, seseo, and musical intonational cadence transfer.",
    defaultInterventionThreshold: 0.75,
    interferenceRules: [
      {
        ruleId: "CO-ENG-PRO-001",
        sourceL1Feature: "Pure vowel clarity transfer (lack of vowel reduction / lax vowels)",
        targetEnglishInterference: "Substituting tense /i/ for English lax /ɪ/ (e.g. 'sheep' for 'ship', 'feet' for 'fit').",
        phonemeOrStructureTarget: "Lax front vowel /ɪ/ vs tense /iː/",
        pedagogicalStrategy: "Jaw drop and relaxation drill contrasting minimal pairs (fit/feet, sit/seat).",
        exampleInterference: "I need to feex the car.",
        targetCorrection: "I need to fix the car.",
      },
      {
        ruleId: "CO-ENG-PRO-002",
        sourceL1Feature: "Intonational circumflex pitch transfer",
        targetEnglishInterference: "Applying rising-falling circumflex melody across declarative English statements.",
        phonemeOrStructureTarget: "English standard falling declarative terminal contour",
        pedagogicalStrategy: "Downward pitch glide gestures on sentence-final focus words.",
        exampleInterference: "I am ready to start (rising pitch on start).",
        targetCorrection: "I am ready to start (clear falling cadence).",
      },
    ],
  },
};

export class LinguisticProfileService {
  /**
   * Retrieves the linguistic transfer profile for a given regional locale code.
   * Defaults gracefully to 'es-DO' if the specific sub-regional code is unlisted.
   */
  public static getProfile(locale: string = "es-DO"): LinguisticTransferProfile {
    return REGIONAL_LINGUISTIC_PROFILES[locale] ?? REGIONAL_LINGUISTIC_PROFILES["es-DO"]!;
  }

  /**
   * Lists all currently supported regional L1 profiles across the ecosystem.
   */
  public static listAvailableProfiles(): LinguisticTransferProfile[] {
    return Object.values(REGIONAL_LINGUISTIC_PROFILES);
  }
}
