/**
 * Lurexa Mind Multi-L1 Spanish Linguistic Transfer Profiles
 * 
 * Defines phonological and syntactical interference profiles across major Latin American
 * Spanish dialects learning English, grounding targeted pronunciation remediation.
 */

export interface L1DialectTransferRule {
  ruleId: string;
  sourceFeature: string;
  englishTargetPhoneme: string;
  tendency: string;
  exampleTargetWord: string;
  remedialStrategy: string;
}

export interface L1DialectProfile {
  dialectCode: "DOM" | "PR" | "COL" | "MEX";
  regionName: string;
  primaryInterferencePillars: string[];
  rules: L1DialectTransferRule[];
  defaultPhoneticSensitivity: number; // 0.0 to 1.0
}

export const MULTI_L1_PROFILES: Record<string, L1DialectProfile> = {
  DOM: {
    dialectCode: "DOM",
    regionName: "Dominican Spanish (Santo Domingo / Cibao / Sur)",
    primaryInterferencePillars: [
      "Final consonant /s/, /d/, /t/ coda weakening & deletion",
      "Liquid neutralization (/l/ vs /r/ coda lambdacism/rotacism)",
      "Prosthetic vowel /e/ insertion before /s/-clusters ('estudent')",
      "Spanish 5-vowel system vs English 12+ tense/lax vowel pairs",
      "Third-person singular -s deletion in present simple verbs",
    ],
    defaultPhoneticSensitivity: 0.95,
    rules: [
      {
        ruleId: "DOM-CODA-01",
        sourceFeature: "Syllable-coda s-aspiration / deletion",
        englishTargetPhoneme: "/s/, /z/, /ts/, /dz/",
        tendency: "Dropping word-final consonants (e.g. 'these' -> 'thee')",
        exampleTargetWord: "students [ˈstjuːdnts]",
        remedialStrategy: "Focus on crisp alveolar contact and breath retention on word endings.",
      },
      {
        ruleId: "DOM-EPEN-02",
        sourceFeature: "Initial /s/-cluster epenthesis",
        englishTargetPhoneme: "/sp-/, /st-/, /sk-/, /sm-/",
        tendency: "Adding /e/ before consonant clusters ('espeak', 'eschool')",
        exampleTargetWord: "speak [spiːk]",
        remedialStrategy: "Continuous voicing onset starting directly on the sibilant hiss.",
      },
    ],
  },
  PR: {
    dialectCode: "PR",
    regionName: "Puerto Rican Spanish (San Juan / Ponce)",
    primaryInterferencePillars: [
      "Lambdacism: /r/ lateralization to /l/ before consonants (puerto -> puelto)",
      "Velarized /r/ (uvular [χ] or [ʁ] friction in word-initial /r/)",
      "Intervocalic /d/ elision (cansado -> cansao)",
      "English rhotic /ɹ/ articulation contrast with Spanish trill/tap",
    ],
    defaultPhoneticSensitivity: 0.9,
    rules: [
      {
        ruleId: "PR-LAMB-01",
        sourceFeature: "Preconsonantal /r/ lateralization to /l/",
        englishTargetPhoneme: "/r/ + Consonant (e.g., /rd/, /rt/, /rk/)",
        tendency: "Replacing rhotic coda with lateral [l] (e.g. 'party' -> 'palty')",
        exampleTargetWord: "important [ɪmˈpɔːrtnt]",
        remedialStrategy: "Curl tongue tip back towards palate for bunched American rhotic /ɹ/.",
      },
    ],
  },
  COL: {
    dialectCode: "COL",
    regionName: "Colombian Spanish (Bogotá / Medellín / Cali)",
    primaryInterferencePillars: [
      "Intervocalic voiced stop weakening (/b/, /d/, /ɡ/ -> [β], [ð], [ɣ])",
      "Syllable-timed cadence transfer into English stress-timed rhythm",
      "Tense /i/ substitution for English lax /ɪ/ (ship vs sheep confusion)",
    ],
    defaultPhoneticSensitivity: 0.88,
    rules: [
      {
        ruleId: "COL-VOX-01",
        sourceFeature: "Intervocalic stop lenition",
        englishTargetPhoneme: "/b/, /d/, /ɡ/ in intervocalic positions",
        tendency: "Incomplete closure producing fricative sounds (e.g. 'ladder' sounding like 'lather')",
        exampleTargetWord: "reading [ˈriːdɪŋ]",
        remedialStrategy: "Firm tongue tip stop on alveolar ridge with complete oral occlusion.",
      },
    ],
  },
  MEX: {
    dialectCode: "MEX",
    regionName: "Mexican Spanish (Central / Norte / Occidente)",
    primaryInterferencePillars: [
      "Unstressed vowel reduction & consonant preservation",
      "Affricate /tʃ/ vs fricative /ʃ/ merger ('chair' vs 'share')",
      "Voiceless bilabial aspiration gap in initial /p/, /t/, /k/",
    ],
    defaultPhoneticSensitivity: 0.9,
    rules: [
      {
        ruleId: "MEX-AFFR-01",
        sourceFeature: "Fricative /ʃ/ and affricate /tʃ/ contrast",
        englishTargetPhoneme: "/ʃ/ (as in 'shoe') vs /tʃ/ (as in 'chew')",
        tendency: "Pronouncing 'shoes' as 'choose' or vice-versa",
        exampleTargetWord: "special [ˈspɛʃl]",
        remedialStrategy: "Sustained palato-alveolar friction without initial plosive stop closure.",
};

export type PhonologicalTransfer = L1DialectTransferRule;

export function getProfileByL1Code(code?: string): L1DialectProfile {
  if (!code) return MULTI_L1_PROFILES.DOM;
  const normalized = code.toUpperCase().includes("PR")
    ? "PR"
    : code.toUpperCase().includes("COL")
    ? "COL"
    : code.toUpperCase().includes("MEX")
    ? "MEX"
    : "DOM";
  return MULTI_L1_PROFILES[normalized] || MULTI_L1_PROFILES.DOM;
}

export function getHighPriorityTransfers(code?: string): PhonologicalTransfer[] {
  const profile = getProfileByL1Code(code);
  return profile.rules;
}
