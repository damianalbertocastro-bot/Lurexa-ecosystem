export interface L1ContrastiveProfile {
  id: string;
  l1Code: string; // ISO: 'es-DO', 'es-PR', 'es-MX', 'es-CO'
  l1Name: string;
  l1NameNative: string;
  region: string;
  phonologicalTransfers: PhonologicalTransfer[];
  prosodyProfile: ProsodyProfile;
  commonLexicalInterferences: LexicalInterference[];
  remediationStrategies: RemediationStrategy[];
}

export interface PhonologicalTransfer {
  id: string;
  sourcePhoneme: string; // IPA
  targetPhoneme: string; // IPA
  transferType: "substitution" | "deletion" | "insertion" | "reduction";
  l1Rule: string; // Linguistic rule in the L1 causing this transfer
  englishImpact: string; // How this affects English intelligibility
  exampleWords: PhonemeExample[];
  cefrRemediationLevel: "A1" | "A2" | "B1" | "B2";
  priority: "critical" | "high" | "medium" | "low";
}

export interface PhonemeExample {
  english: string;
  ipa: string;
  commonL1Error: string;
  correctTarget: string;
}

export interface ProsodyProfile {
  intonationPattern: string;
  stressTimingDifference: string;
  rhythmType: "syllable-timed" | "stress-timed" | "mora-timed";
  commonIntonationErrors: string[];
}

export interface LexicalInterference {
  l1Word: string;
  falseEquivalent: string;
  correctEnglish: string;
  context: string;
}

export interface RemediationStrategy {
  id: string;
  targetTransferIds: string[];
  technique: string;
  description: string;
  minimalPairDrills: MinimalPairDrill[];
  articulatoryInstructions: string;
}

export interface MinimalPairDrill {
  wordA: string;
  wordB: string;
  ipaA: string;
  ipaB: string;
  contrastFeature: string;
}

const DOMINICAN_SPANISH_PROFILE: L1ContrastiveProfile = {
  id: "profile-es-DO",
  l1Code: "es-DO",
  l1Name: "Dominican Spanish",
  l1NameNative: "Español dominicano",
  region: "Caribbean",
  phonologicalTransfers: [
    {
      id: "do-s-aspiration",
      sourcePhoneme: "s",
      targetPhoneme: "s",
      transferType: "deletion",
      l1Rule: "/s/ aspiration or deletion in syllable coda position",
      englishImpact: "Loss of plural markers, 3rd person singular present tense, and possessives.",
      exampleWords: [
        { english: "most", ipa: "/moʊst/", commonL1Error: "[moʊ]", correctTarget: "[moʊst]" },
        { english: "costs", ipa: "/kɔsts/", commonL1Error: "[kɔ]", correctTarget: "[kɔsts]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "critical",
    },
    {
      id: "do-r-tap-confusion",
      sourcePhoneme: "ɾ",
      targetPhoneme: "ɹ",
      transferType: "substitution",
      l1Rule: "Alveolar tap [ɾ] replaces postalveolar approximant [ɹ]",
      englishImpact: "Harsh or indistinct pronunciation of rhotic consonants.",
      exampleWords: [
        { english: "right", ipa: "/ɹaɪt/", commonL1Error: "[ɾaɪt]", correctTarget: "[ɹaɪt]" },
        { english: "room", ipa: "/ɹuːm/", commonL1Error: "[ɾuːm]", correctTarget: "[ɹuːm]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "critical",
    },
    {
      id: "do-lambdacism",
      sourcePhoneme: "ɾ",
      targetPhoneme: "l",
      transferType: "substitution",
      l1Rule: "Coda /ɾ/ lateralization to [l] (e.g. 'cuerpo' -> 'cuelpo')",
      englishImpact: "Neutralization between 'card' and 'called', or 'part' and 'palt'.",
      exampleWords: [
        { english: "party", ipa: "/ˈpɑːrti/", commonL1Error: "[ˈpɑːlti]", correctTarget: "[ˈpɑːrti]" },
        { english: "short", ipa: "/ʃɔːrt/", commonL1Error: "[ʃɔːlt]", correctTarget: "[ʃɔːrt]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "do-vowel-epenthesis",
      sourcePhoneme: "e",
      targetPhoneme: "s",
      transferType: "insertion",
      l1Rule: "Prosthetic vowel /e/ inserted before initial /s/ + consonant clusters",
      englishImpact: "Saying 'espeak' instead of 'speak' or 'estudent' instead of 'student'.",
      exampleWords: [
        { english: "speak", ipa: "/spiːk/", commonL1Error: "[ɛsˈpiːk]", correctTarget: "[spiːk]" },
        { english: "student", ipa: "/ˈstjuːdnt/", commonL1Error: "[ɛsˈtjuːdnt]", correctTarget: "[ˈstjuːdnt]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "critical",
    },
    {
      id: "do-v-b-merger",
      sourcePhoneme: "b",
      targetPhoneme: "v",
      transferType: "substitution",
      l1Rule: "Lack of phonemic /v/ vs /b/ distinction in Spanish",
      englishImpact: "Confusion between 'very' and 'berry', 'vote' and 'boat'.",
      exampleWords: [
        { english: "very", ipa: "/ˈvɛri/", commonL1Error: "[ˈbɛri]", correctTarget: "[ˈvɛri]" },
        { english: "visit", ipa: "/ˈvɪzɪt/", commonL1Error: "[ˈbɪsɪt]", correctTarget: "[ˈvɪzɪt]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "high",
    },
    {
      id: "do-th-stopping",
      sourcePhoneme: "t",
      targetPhoneme: "θ",
      transferType: "substitution",
      l1Rule: "Interdental voiceless fricative /θ/ substituted with alveolar plosive [t]",
      englishImpact: "Confusion between 'three' and 'tree', 'think' and 'tink'.",
      exampleWords: [
        { english: "three", ipa: "/θriː/", commonL1Error: "[triː]", correctTarget: "[θriː]" },
        { english: "think", ipa: "/θɪŋk/", commonL1Error: "[tɪŋk]", correctTarget: "[θɪŋk]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "do-cluster-reduction",
      sourcePhoneme: "t",
      targetPhoneme: "st",
      transferType: "reduction",
      l1Rule: "Final consonant cluster reduction (e.g. /-st/, /-kt/, /-pt/)",
      englishImpact: "Dropping endings like 'past' -> 'pass', 'fact' -> 'fac'.",
      exampleWords: [
        { english: "first", ipa: "/fɜːrst/", commonL1Error: "[fɜːs]", correctTarget: "[fɜːrst]" },
        { english: "worked", ipa: "/wɜːrkt/", commonL1Error: "[wɜːk]", correctTarget: "[wɜːrkt]" },
      ],
      cefrRemediationLevel: "B1",
      priority: "medium",
    },
    {
      id: "do-schwa-difficulty",
      sourcePhoneme: "a",
      targetPhoneme: "ə",
      transferType: "substitution",
      l1Rule: "Full vowel articulation in unstressed syllables instead of central schwa /ə/",
      englishImpact: "Syllable-timed cadence overriding natural English stress timing.",
      exampleWords: [
        { english: "banana", ipa: "/bəˈnænə/", commonL1Error: "[baˈnana]", correctTarget: "[bəˈnænə]" },
        { english: "support", ipa: "/səˈpɔːrt/", commonL1Error: "[suˈpɔːrt]", correctTarget: "[səˈpɔːrt]" },
      ],
      cefrRemediationLevel: "B1",
      priority: "medium",
    },
  ],
  prosodyProfile: {
    intonationPattern: "High-pitch syllable rises with fast terminal drops",
    stressTimingDifference: "Syllable-timed rhythm transfer into stress-timed English",
    rhythmType: "syllable-timed",
    commonIntonationErrors: [
      "Rising tone at end of declarative statements",
      "Equal duration on unstressed grammatical function words",
      "Truncated pitch resets across clause boundaries",
    ],
  },
  commonLexicalInterferences: [
    { l1Word: "actualmente", falseEquivalent: "actually", correctEnglish: "currently / at present", context: "Time expression" },
    { l1Word: "asistir", falseEquivalent: "assist", correctEnglish: "attend", context: "Academic & event attendance" },
    { l1Word: "colegio", falseEquivalent: "college", correctEnglish: "school / high school", context: "Educational institutions" },
    { l1Word: "carpeta", falseEquivalent: "carpet", correctEnglish: "folder / binder", context: "Office & school supplies" },
  ],
  remediationStrategies: [
    {
      id: "do-strat-s-aspiration",
      targetTransferIds: ["do-s-aspiration", "do-cluster-reduction"],
      technique: "Coda anchor tactile drills",
      description: "Hold fingertips on throat to feel final consonant frication closure before pausing.",
      articulatoryInstructions: "Touch teeth lightly together and hiss softly on final -s before stopping airflow.",
      minimalPairDrills: [
        { wordA: "pat", wordB: "past", ipaA: "/pæt/", ipaB: "/pæst/", contrastFeature: "Single stop vs cluster" },
        { wordA: "cost", wordB: "cot", ipaA: "/kɔst/", ipaB: "/kɑt/", contrastFeature: "Coda cluster retention" },
      ],
    },
    {
      id: "do-strat-rhotic",
      targetTransferIds: ["do-r-tap-confusion", "do-lambdacism"],
      technique: "Bunched tongue rhotic gliding",
      description: "Retract tongue body without touching alveolar ridge for pure American /ɹ/.",
      articulatoryInstructions: "Pull the back of your tongue toward upper molars, lips slightly rounded.",
      minimalPairDrills: [
        { wordA: "call", wordB: "car", ipaA: "/kɔːl/", ipaB: "/kɑːr/", contrastFeature: "Lateral /l/ vs Rhotic /ɹ/" },
        { wordA: "party", wordB: "palty", ipaA: "/ˈpɑːrti/", ipaB: "/ˈpɑːlti/", contrastFeature: "Coda /r/ vs /l/" },
      ],
    },
    {
      id: "do-strat-epenthesis",
      targetTransferIds: ["do-vowel-epenthesis"],
      technique: "Snake hiss voicing delay",
      description: "Start air friction before engaging vocal folds to avoid initial /e/ insertion.",
      articulatoryInstructions: "Begin breathing out through teeth in a long 'ssss' before saying the rest of the word.",
      minimalPairDrills: [
        { wordA: "estate", wordB: "state", ipaA: "/ɪˈsteɪt/", ipaB: "/steɪt/", contrastFeature: "Epenthetic /e/ vs clean cluster" },
        { wordA: "escape", wordB: "scape", ipaA: "/ɪˈskeɪp/", ipaB: "/skeɪp/", contrastFeature: "Vowel prefix avoidance" },
      ],
    },
  ],
};

const PUERTO_RICAN_SPANISH_PROFILE: L1ContrastiveProfile = {
  id: "profile-es-PR",
  l1Code: "es-PR",
  l1Name: "Puerto Rican Spanish",
  l1NameNative: "Español puertorriqueño",
  region: "Caribbean",
  phonologicalTransfers: [
    {
      id: "pr-lambdacism",
      sourcePhoneme: "ɾ",
      targetPhoneme: "l",
      transferType: "substitution",
      l1Rule: "Preconsonantal /ɾ/ lateralization to [l] (puerto -> puelto)",
      englishImpact: "Neutralization between 'card' and 'called', or 'part' and 'palt'.",
      exampleWords: [
        { english: "hard", ipa: "/hɑːrd/", commonL1Error: "[hɑːld]", correctTarget: "[hɑːrd]" },
        { english: "portal", ipa: "/ˈpɔːrtl/", commonL1Error: "[ˈpɔːltl]", correctTarget: "[ˈpɔːrtl]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "critical",
    },
    {
      id: "pr-velarized-r",
      sourcePhoneme: "χ",
      targetPhoneme: "ɹ",
      transferType: "substitution",
      l1Rule: "Velarized or uvular friction on initial /r/ (arrastre -> [aˈχastɾe])",
      englishImpact: "Guttural friction sound instead of smooth English approximant /ɹ/.",
      exampleWords: [
        { english: "red", ipa: "/ɹɛd/", commonL1Error: "[χɛd]", correctTarget: "[ɹɛd]" },
        { english: "run", ipa: "/ɹʌn/", commonL1Error: "[χʌn]", correctTarget: "[ɹʌn]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "pr-nasal-velarization",
      sourcePhoneme: "ŋ",
      targetPhoneme: "n",
      transferType: "substitution",
      l1Rule: "Word-final /n/ realized as velar nasal [ŋ] (pan -> [paŋ])",
      englishImpact: "Confusion between 'sin' and 'sing', 'ran' and 'rang'.",
      exampleWords: [
        { english: "sun", ipa: "/sʌn/", commonL1Error: "[sʌŋ]", correctTarget: "[sʌn]" },
        { english: "man", ipa: "/mæn/", commonL1Error: "[mæŋ]", correctTarget: "[mæn]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "pr-s-aspiration",
      sourcePhoneme: "h",
      targetPhoneme: "s",
      transferType: "deletion",
      l1Rule: "Coda /s/ weakening and aspiration to [h]",
      englishImpact: "Missing plural and 3rd-person inflections in fast speech.",
      exampleWords: [
        { english: "books", ipa: "/bʊks/", commonL1Error: "[bʊkh]", correctTarget: "[bʊks]" },
        { english: "desk", ipa: "/dɛsk/", commonL1Error: "[dɛh]", correctTarget: "[dɛsk]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "critical",
    },
    {
      id: "pr-v-b-merger",
      sourcePhoneme: "b",
      targetPhoneme: "v",
      transferType: "substitution",
      l1Rule: "Bilabial stop/fricative [b]/[β] replaces labiodental /v/",
      englishImpact: "Inability to distinguish 'vote' from 'boat'.",
      exampleWords: [
        { english: "voice", ipa: "/vɔɪs/", commonL1Error: "[bɔɪs]", correctTarget: "[vɔɪs]" },
        { english: "leave", ipa: "/liːv/", commonL1Error: "[liːb]", correctTarget: "[liːv]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "high",
    },
    {
      id: "pr-affricate-sh",
      sourcePhoneme: "tʃ",
      targetPhoneme: "ʃ",
      transferType: "substitution",
      l1Rule: "Affricate /tʃ/ and fricative /ʃ/ interchange",
      englishImpact: "Confusion between 'share' and 'chair', 'sheep' and 'cheap'.",
      exampleWords: [
        { english: "ship", ipa: "/ʃɪp/", commonL1Error: "[tʃɪp]", correctTarget: "[ʃɪp]" },
        { english: "cash", ipa: "/kæʃ/", commonL1Error: "[kætʃ]", correctTarget: "[kæʃ]" },
      ],
      cefrRemediationLevel: "B1",
      priority: "medium",
    },
    {
      id: "pr-intervocalic-d-loss",
      sourcePhoneme: "",
      targetPhoneme: "d",
      transferType: "deletion",
      l1Rule: "Intervocalic /d/ deletion (cansado -> cansao)",
      englishImpact: "Dropping medial /d/ in past participles (e.g. 'loaded' -> 'loa-ed').",
      exampleWords: [
        { english: "needed", ipa: "/ˈniːdɪd/", commonL1Error: "[ˈniːɪd]", correctTarget: "[ˈniːdɪd]" },
        { english: "started", ipa: "/ˈstɑːrtɪd/", commonL1Error: "[ˈstɑːtɪd]", correctTarget: "[ˈstɑːrtɪd]" },
      ],
      cefrRemediationLevel: "B1",
      priority: "medium",
    },
    {
      id: "pr-lax-vowel-raising",
      sourcePhoneme: "i",
      targetPhoneme: "ɪ",
      transferType: "substitution",
      l1Rule: "Tense Spanish /i/ used in place of English lax /ɪ/",
      englishImpact: "Confusion between 'live' and 'leave', 'fill' and 'feel'.",
      exampleWords: [
        { english: "sit", ipa: "/sɪt/", commonL1Error: "[siːt]", correctTarget: "[sɪt]" },
        { english: "hit", ipa: "/hɪt/", commonL1Error: "[hiːt]", correctTarget: "[hɪt]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
  ],
  prosodyProfile: {
    intonationPattern: "Musical cadence with penultimate syllable lengthening",
    stressTimingDifference: "Retention of syllable duration constancy across unstressed words",
    rhythmType: "syllable-timed",
    commonIntonationErrors: [
      "Melodic rise on unstressed pronouns",
      "Absence of weak vowel reduction in auxiliary verbs",
    ],
  },
  commonLexicalInterferences: [
    { l1Word: "librería", falseEquivalent: "library", correctEnglish: "bookstore", context: "Retail vs public lending" },
    { l1Word: "embarazada", falseEquivalent: "embarrassed", correctEnglish: "pregnant", context: "Medical condition" },
    { l1Word: "éxito", falseEquivalent: "exit", correctEnglish: "success", context: "Accomplishment" },
    { l1Word: "recordar", falseEquivalent: "record", correctEnglish: "remember", context: "Memory retrieval" },
  ],
  remediationStrategies: [
    {
      id: "pr-strat-rhotic-lateral",
      targetTransferIds: ["pr-lambdacism", "pr-velarized-r"],
      technique: "Dental-ridge disengagement",
      description: "Prevent tongue tip from touching front palate when pronouncing English rhotic codas.",
      articulatoryInstructions: "Keep tongue tip floating in center of mouth, cup side edges against upper molars.",
      minimalPairDrills: [
        { wordA: "court", wordB: "colt", ipaA: "/kɔːrt/", ipaB: "/koʊlt/", contrastFeature: "Coda /r/ vs /l/" },
        { wordA: "fort", wordB: "fault", ipaA: "/fɔːrt/", ipaB: "/fɔːlt/", contrastFeature: "Rhotic vowel vs Lateral" },
      ],
    },
    {
      id: "pr-strat-nasals",
      targetTransferIds: ["pr-nasal-velarization"],
      technique: "Alveolar contact holding",
      description: "Press tongue tip firmly against alveolar ridge on final /n/ to stop velar nasal air escape.",
      articulatoryInstructions: "Seal front of mouth with tongue tip, feeling vibration at tooth ridge.",
      minimalPairDrills: [
        { wordA: "thin", wordB: "thing", ipaA: "/θɪn/", ipaB: "/θɪŋ/", contrastFeature: "Alveolar /n/ vs Velar /ŋ/" },
        { wordA: "pan", wordB: "pang", ipaA: "/pæn/", ipaB: "/pæŋ/", contrastFeature: "Final /n/ vs /ŋ/" },
      ],
    },
  ],
};

const MEXICAN_SPANISH_PROFILE: L1ContrastiveProfile = {
  id: "profile-es-MX",
  l1Code: "es-MX",
  l1Name: "Mexican Spanish",
  l1NameNative: "Español mexicano",
  region: "Central/North America",
  phonologicalTransfers: [
    {
      id: "mx-affricate-fricative",
      sourcePhoneme: "tʃ",
      targetPhoneme: "ʃ",
      transferType: "substitution",
      l1Rule: "Lack of phonemic /ʃ/ causing substitution with affricate /tʃ/",
      englishImpact: "Saying 'choose' instead of 'shoes' or 'cheap' instead of 'sheep'.",
      exampleWords: [
        { english: "shoe", ipa: "/ʃuː/", commonL1Error: "[tʃuː]", correctTarget: "[ʃuː]" },
        { english: "share", ipa: "/ʃɛər/", commonL1Error: "[tʃɛər]", correctTarget: "[ʃɛər]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "critical",
    },
    {
      id: "mx-z-devoicing",
      sourcePhoneme: "s",
      targetPhoneme: "z",
      transferType: "substitution",
      l1Rule: "Spanish seseo devoid of voiced alveolar fricative /z/",
      englishImpact: "Devoicing plural /z/ (e.g. 'dogs' -> 'docks') and verb 'is' -> 'iss'.",
      exampleWords: [
        { english: "zoo", ipa: "/zuː/", commonL1Error: "[suː]", correctTarget: "[zuː]" },
        { english: "buzz", ipa: "/bʌz/", commonL1Error: "[bʌs]", correctTarget: "[bʌz]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "mx-v-b-merger",
      sourcePhoneme: "b",
      targetPhoneme: "v",
      transferType: "substitution",
      l1Rule: "Bilabial merger of /v/ and /b/",
      englishImpact: "Confusion between 'vote' and 'boat', 'van' and 'ban'.",
      exampleWords: [
        { english: "vase", ipa: "/veɪs/", commonL1Error: "[beɪs]", correctTarget: "[veɪs]" },
        { english: "river", ipa: "/ˈrɪvər/", commonL1Error: "[ˈrɪbər]", correctTarget: "[ˈrɪvər]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "high",
    },
    {
      id: "mx-th-stopping",
      sourcePhoneme: "d",
      targetPhoneme: "ð",
      transferType: "substitution",
      l1Rule: "Voiced interdental /ð/ replaced by dental stop [d]",
      englishImpact: "Pronouncing 'they' as 'day', 'this' as 'dis'.",
      exampleWords: [
        { english: "this", ipa: "/ðɪs/", commonL1Error: "[dɪs]", correctTarget: "[ðɪs]" },
        { english: "other", ipa: "/ˈʌðər/", commonL1Error: "[ˈʌdər]", correctTarget: "[ˈʌðər]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "mx-consonant-aspiration-gap",
      sourcePhoneme: "p",
      targetPhoneme: "pʰ",
      transferType: "reduction",
      l1Rule: "Unaspirated initial voiceless plosives /p/, /t/, /k/",
      englishImpact: "Initial voiceless stops sounding like voiced stops ('pin' sounds like 'bin').",
      exampleWords: [
        { english: "park", ipa: "/pʰɑːrk/", commonL1Error: "[pɑːrk]", correctTarget: "[pʰɑːrk]" },
        { english: "time", ipa: "/tʰaɪm/", commonL1Error: "[taɪm]", correctTarget: "[tʰaɪm]" },
      ],
      cefrRemediationLevel: "B1",
      priority: "medium",
    },
    {
      id: "mx-schwa-full-vowel",
      sourcePhoneme: "o",
      targetPhoneme: "ə",
      transferType: "substitution",
      l1Rule: "Preservation of full unstressed vowels in Mexican phonology",
      englishImpact: "Staccato rhythm on function words ('to', 'of', 'for').",
      exampleWords: [
        { english: "today", ipa: "/təˈdeɪ/", commonL1Error: "[toˈdeɪ]", correctTarget: "[təˈdeɪ]" },
        { english: "police", ipa: "/pəˈliːs/", commonL1Error: "[poˈliːs]", correctTarget: "[pəˈliːs]" },
      ],
      cefrRemediationLevel: "B1",
      priority: "medium",
    },
    {
      id: "mx-final-cluster-holding",
      sourcePhoneme: "t",
      targetPhoneme: "kt",
      transferType: "reduction",
      l1Rule: "Simplification of final double plosive clusters (e.g. /-kt/ -> /-t/)",
      englishImpact: "Dropping /k/ in words like 'act', 'fact', 'product'.",
      exampleWords: [
        { english: "fact", ipa: "/fækt/", commonL1Error: "[fæt]", correctTarget: "[fækt]" },
        { english: "direct", ipa: "/dɪˈrɛkt/", commonL1Error: "[dɪˈrɛt]", correctTarget: "[dɪˈrɛkt]" },
      ],
      cefrRemediationLevel: "B2",
      priority: "low",
    },
    {
      id: "mx-lax-vowel-ae",
      sourcePhoneme: "a",
      targetPhoneme: "æ",
      transferType: "substitution",
      l1Rule: "Spanish open central /a/ substituted for English low-front /æ/",
      englishImpact: "Confusion between 'cat' and 'cut', 'bat' and 'bot'.",
      exampleWords: [
        { english: "cat", ipa: "/kæt/", commonL1Error: "[kat]", correctTarget: "[kæt]" },
        { english: "apple", ipa: "/ˈæpl/", commonL1Error: "[ˈapl]", correctTarget: "[ˈæpl]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
  ],
  prosodyProfile: {
    intonationPattern: "Circumflex melodic contour with strong consonant articulation",
    stressTimingDifference: "Consonant duration preservation with resistance to vowel reduction",
    rhythmType: "syllable-timed",
    commonIntonationErrors: [
      "Prolonged penultimate vowel in phrase endings",
      "Over-articulation of unstressed prepositions",
    ],
  },
  commonLexicalInterferences: [
    { l1Word: "pretender", falseEquivalent: "pretend", correctEnglish: "intend / expect", context: "Goal and intention" },
    { l1Word: "sensible", falseEquivalent: "sensible", correctEnglish: "sensitive", context: "Emotional response" },
    { l1Word: "eventual", falseEquivalent: "eventual", correctEnglish: "temporary / occasional", context: "Frequency" },
    { l1Word: "atender", falseEquivalent: "attend", correctEnglish: "serve / assist", context: "Customer support" },
  ],
  remediationStrategies: [
    {
      id: "mx-strat-fricatives",
      targetTransferIds: ["mx-affricate-fricative"],
      technique: "Continuous airflow friction",
      description: "Hold continuous sound without explosive stop buildup.",
      articulatoryInstructions: "Purse lips slightly and let air stream continuously over tongue blade for /ʃ/.",
      minimalPairDrills: [
        { wordA: "share", wordB: "chair", ipaA: "/ʃɛər/", ipaB: "/tʃɛər/", contrastFeature: "Fricative /ʃ/ vs Affricate /tʃ/" },
        { wordA: "sheep", wordB: "cheap", ipaA: "/ʃiːp/", ipaB: "/tʃiːp/", contrastFeature: "Continuous air vs Plosive stop" },
      ],
    },
    {
      id: "mx-strat-voicing-z",
      targetTransferIds: ["mx-z-devoicing"],
      technique: "Buzzy bee vocal fold vibration",
      description: "Feel buzzing in Adam's apple during entire duration of /z/ articulation.",
      articulatoryInstructions: "Produce a soft 's' and turn on voice motor to make a vibrating 'zzz' sound.",
      minimalPairDrills: [
        { wordA: "sip", wordB: "zip", ipaA: "/sɪp/", ipaB: "/zɪp/", contrastFeature: "Voiceless /s/ vs Voiced /z/" },
        { wordA: "price", wordB: "prize", ipaA: "/praɪs/", ipaB: "/praɪz/", contrastFeature: "Voiced coda distinction" },
      ],
    },
  ],
};

const COLOMBIAN_SPANISH_PROFILE: L1ContrastiveProfile = {
  id: "profile-es-CO",
  l1Code: "es-CO",
  l1Name: "Colombian Spanish",
  l1NameNative: "Español colombiano",
  region: "Andean / Northern South America",
  phonologicalTransfers: [
    {
      id: "co-intervocalic-lenition",
      sourcePhoneme: "β",
      targetPhoneme: "b",
      transferType: "reduction",
      l1Rule: "Intervocalic lenition where voiced stops /b/, /d/, /ɡ/ soften into approximants",
      englishImpact: "Sounds like 'ladder' becoming 'lather' or 'rubber' losing bilabial seal.",
      exampleWords: [
        { english: "rubber", ipa: "/ˈrʌbər/", commonL1Error: "[ˈrʌβər]", correctTarget: "[ˈrʌbər]" },
        { english: "ready", ipa: "/ˈrɛdi/", commonL1Error: "[ˈrɛði]", correctTarget: "[ˈrɛdi]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "co-z-devoicing",
      sourcePhoneme: "s",
      targetPhoneme: "z",
      transferType: "substitution",
      l1Rule: "Seseo without phonemic voiced /z/",
      englishImpact: "Devoicing plural markers and possessives.",
      exampleWords: [
        { english: "rise", ipa: "/raɪz/", commonL1Error: "[raɪs]", correctTarget: "[raɪz]" },
        { english: "easy", ipa: "/ˈiːzi/", commonL1Error: "[ˈiːsi]", correctTarget: "[ˈiːzi]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "critical",
    },
    {
      id: "co-th-stopping",
      sourcePhoneme: "d",
      targetPhoneme: "ð",
      transferType: "substitution",
      l1Rule: "Dental plosive [d] replacing interdental fricative /ð/",
      englishImpact: "Pronouncing 'brother' as 'broder', 'father' as 'fader'.",
      exampleWords: [
        { english: "brother", ipa: "/ˈbrʌðər/", commonL1Error: "[ˈbrʌdər]", correctTarget: "[ˈbrʌðər]" },
        { english: "there", ipa: "/ðɛər/", commonL1Error: "[dɛər]", correctTarget: "[ðɛər]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "co-v-b-merger",
      sourcePhoneme: "b",
      targetPhoneme: "v",
      transferType: "substitution",
      l1Rule: "Labiodental /v/ merger into bilabial /b/",
      englishImpact: "Merging 'invite' into 'inbite'.",
      exampleWords: [
        { english: "invite", ipa: "/ɪnˈvaɪt/", commonL1Error: "[ɪnˈbaɪt]", correctTarget: "[ɪnˈvaɪt]" },
        { english: "travel", ipa: "/ˈtrævl/", commonL1Error: "[ˈtræbl]", correctTarget: "[ˈtrævl]" },
      ],
      cefrRemediationLevel: "A1",
      priority: "high",
    },
    {
      id: "co-tense-lax-vowels",
      sourcePhoneme: "i",
      targetPhoneme: "ɪ",
      transferType: "substitution",
      l1Rule: "5-vowel Spanish inventory substituting tense vowels for English lax vowels",
      englishImpact: "Inability to distinguish 'fit' and 'feet', 'pull' and 'pool'.",
      exampleWords: [
        { english: "slip", ipa: "/slɪp/", commonL1Error: "[sliːp]", correctTarget: "[slɪp]" },
        { english: "look", ipa: "/lʊk/", commonL1Error: "[luːk]", correctTarget: "[lʊk]" },
      ],
      cefrRemediationLevel: "A2",
      priority: "high",
    },
    {
      id: "co-schwa-difficulty",
      sourcePhoneme: "a",
      targetPhoneme: "ə",
      transferType: "substitution",
      l1Rule: "Full vowel articulation in unstressed syllables",
      englishImpact: "Cadence sounds overly deliberate and rigid.",
      exampleWords: [
        { english: "problem", ipa: "/ˈprɑːbləm/", commonL1Error: "[ˈprɑːblɛm]", correctTarget: "[ˈprɑːbləm]" },
        { english: "sofa", ipa: "/ˈsoʊfə/", commonL1Error: "[ˈsoʊfa]", correctTarget: "[ˈsoʊfə]" },
      ],
      cefrRemediationLevel: "B1",
      priority: "medium",
    },
    {
      id: "co-rhotic-approximation",
      sourcePhoneme: "ɾ",
      targetPhoneme: "ɹ",
      transferType: "substitution",
      l1Rule: "Alveolar tap [ɾ] used instead of bunched/retroflex /ɹ/",
      englishImpact: "Indistinct American rhotic quality in connected speech.",
      exampleWords: [
        { english: "tree", ipa: "/triː/", commonL1Error: "[tɾiː]", correctTarget: "[tɹiː]" },
        { english: "grow", ipa: "/ɡroʊ/", commonL1Error: "[ɡɾoʊ]", correctTarget: "[ɡɹoʊ]" },
      ],
      cefrRemediationLevel: "B1",
      priority: "medium",
    },
    {
      id: "co-final-d-deletion",
      sourcePhoneme: "",
      targetPhoneme: "d",
      transferType: "deletion",
      l1Rule: "Coda /d/ weakening and loss in word endings",
      englishImpact: "Loss of regular past tense markers (e.g. 'played' -> 'play').",
      exampleWords: [
        { english: "card", ipa: "/kɑːrd/", commonL1Error: "[kɑːr]", correctTarget: "[kɑːrd]" },
        { english: "said", ipa: "/sɛd/", commonL1Error: "[sɛ]", correctTarget: "[sɛd]" },
      ],
      cefrRemediationLevel: "B2",
      priority: "low",
    },
  ],
  prosodyProfile: {
    intonationPattern: "Smooth polite intonational contours with measured syllable rhythm",
    stressTimingDifference: "Even spacing of syllables regardless of lexical stress prominence",
    rhythmType: "syllable-timed",
    commonIntonationErrors: [
      "Overly gentle stress contrasts in polysyllabic words",
      "Equal duration on auxiliary and main verbs",
    ],
  },
  commonLexicalInterferences: [
    { l1Word: "discutir", falseEquivalent: "discuss", correctEnglish: "argue", context: "Interpersonal conflict" },
    { l1Word: "comprometerse", falseEquivalent: "compromise", correctEnglish: "commit / engage", context: "Agreements" },
    { l1Word: "decepción", falseEquivalent: "deception", correctEnglish: "disappointment", context: "Emotional letdown" },
    { l1Word: "ignorar", falseEquivalent: "ignore", correctEnglish: "not know / be unaware", context: "Knowledge state" },
  ],
  remediationStrategies: [
    {
      id: "co-strat-stops",
      targetTransferIds: ["co-intervocalic-lenition"],
      technique: "Crisp oral occlusion drills",
      description: "Ensure complete closure of lips (/b/) or tongue-to-ridge (/d/) between vowels.",
      articulatoryInstructions: "Press lips together firmly on medial /b/ so air stops completely before release.",
      minimalPairDrills: [
        { wordA: "rubber", wordB: "runner", ipaA: "/ˈrʌbər/", ipaB: "/ˈrʌnər/", contrastFeature: "Complete stop closure" },
      ],
    },
    {
      id: "co-strat-interdental",
      targetTransferIds: ["co-th-stopping"],
      technique: "Feather tongue-tip friction",
      description: "Place tongue tip between teeth and breathe gently without creating a hard stop.",
      articulatoryInstructions: "Keep tongue relaxed between upper and lower teeth, feeling continuous air stream.",
      minimalPairDrills: [
        { wordA: "dare", wordB: "there", ipaA: "/dɛər/", ipaB: "/ðɛər/", contrastFeature: "Stop vs Fricative" },
      ],
    },
    {
      id: "co-strat-schwa",
      targetTransferIds: ["co-schwa-difficulty"],
      technique: "Rhythm and de-stressing",
      description: "Exaggerate stressed syllable and completely relax mouth on unstressed vowels.",
      articulatoryInstructions: "Make unstressed vowel sound like a quick, neutral grunt /ə/.",
      minimalPairDrills: [
        { wordA: "can (stressed)", wordB: "can (unstressed)", ipaA: "/kæn/", ipaB: "/kən/", contrastFeature: "Full vowel vs Schwa" },
      ],
    },
  ],
};

export const L1_CONTRASTIVE_PROFILES: L1ContrastiveProfile[] = [
  DOMINICAN_SPANISH_PROFILE,
  PUERTO_RICAN_SPANISH_PROFILE,
  MEXICAN_SPANISH_PROFILE,
  COLOMBIAN_SPANISH_PROFILE,
];

export function getProfileByL1Code(code?: string): L1ContrastiveProfile | undefined {
  if (!code) return DOMINICAN_SPANISH_PROFILE;
  const normalized = code.toLowerCase();
  if (normalized.includes("pr")) return PUERTO_RICAN_SPANISH_PROFILE;
  if (normalized.includes("mx")) return MEXICAN_SPANISH_PROFILE;
  if (normalized.includes("co")) return COLOMBIAN_SPANISH_PROFILE;
  return DOMINICAN_SPANISH_PROFILE;
}

export function getRemediationForTransfer(profileCode: string, transferId: string): RemediationStrategy[] {
  const profile = getProfileByL1Code(profileCode);
  if (!profile) return [];
  return profile.remediationStrategies.filter((strat) => strat.targetTransferIds.includes(transferId));
}

export function getHighPriorityTransfers(profileCode?: string): PhonologicalTransfer[] {
  const profile = getProfileByL1Code(profileCode);
  if (!profile) return [];
  return profile.phonologicalTransfers.filter((t) => t.priority === "critical" || t.priority === "high");
}
