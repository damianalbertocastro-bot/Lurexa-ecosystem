export interface L1ContrastiveProfile {
  id: string;
  l1Code: string;  // ISO: 'es-DO', 'es-PR', 'es-MX', 'es-CO'
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
  sourcePhoneme: string;  // IPA
  targetPhoneme: string;  // IPA
  transferType: 'substitution' | 'deletion' | 'insertion' | 'reduction';
  l1Rule: string;  // Linguistic rule in the L1 causing this transfer
  englishImpact: string;  // How this affects English intelligibility
  exampleWords: PhonemeExample[];
  cefrRemediationLevel: 'A1' | 'A2' | 'B1' | 'B2';
  priority: 'critical' | 'high' | 'medium' | 'low';
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
  rhythmType: 'syllable-timed' | 'stress-timed' | 'mora-timed';
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
  id: 'profile-es-DO',
  l1Code: 'es-DO',
  l1Name: 'Dominican Spanish',
  l1NameNative: 'Español dominicano',
  region: 'Caribbean',
  phonologicalTransfers: [
    {
      id: 'do-s-aspiration',
      sourcePhoneme: 's',
      targetPhoneme: 's',
      transferType: 'deletion',
      l1Rule: '/s/ aspiration or deletion in syllable coda position',
      englishImpact: 'Loss of plural markers, 3rd person singular present tense, and possessives. Confusion between "past" and "pat".',
      exampleWords: [
        { english: 'most', ipa: '/moʊst/', commonL1Error: '[moʊ]', correctTarget: '[moʊst]' },
        { english: 'costs', ipa: '/kɔsts/', commonL1Error: '[kɔ]', correctTarget: '[kɔsts]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'critical'
    },
    {
      id: 'do-r-confusion',
      sourcePhoneme: 'ɾ',
      targetPhoneme: 'ɹ',
      transferType: 'substitution',
      l1Rule: 'English postalveolar approximant /ɹ/ realized as alveolar tap [ɾ]',
      englishImpact: 'Creates confusion between minimal pairs, sounds accented or harsh to native listeners.',
      exampleWords: [
        { english: 'red', ipa: '/ɹɛd/', commonL1Error: '[ɾɛd]', correctTarget: '[ɹɛd]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'high'
    },
    {
      id: 'do-l-r-neutralization',
      sourcePhoneme: 'l',
      targetPhoneme: 'l/ɾ',
      transferType: 'substitution',
      l1Rule: 'Lambdacism /ɾ/ -> [l] or rhotacism /l/ -> [ɾ] in coda',
      englishImpact: 'Confusion in words ending in l/r, leading to unintelligible roots.',
      exampleWords: [
        { english: 'tall', ipa: '/tɔl/', commonL1Error: '[tɔɾ]', correctTarget: '[tɔl]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'high'
    },
    {
      id: 'do-cluster-reduction',
      sourcePhoneme: 'CC',
      targetPhoneme: 'C',
      transferType: 'reduction',
      l1Rule: 'Final consonant clusters are extremely rare in Spanish and usually simplified.',
      englishImpact: 'Deletion of past tense markers (-ed) and morphological features.',
      exampleWords: [
        { english: 'worked', ipa: '/wɜɹkt/', commonL1Error: '[wɛk]', correctTarget: '[wɜɹkt]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'critical'
    },
    {
      id: 'do-v-b-merger',
      sourcePhoneme: 'b/β',
      targetPhoneme: 'v',
      transferType: 'substitution',
      l1Rule: 'Spanish lacks labiodental fricative /v/, realizing it as bilabial stop [b] or approximant [β].',
      englishImpact: 'Confusion between base/vase, boat/vote.',
      exampleWords: [
        { english: 'very', ipa: '/vɛɹi/', commonL1Error: '[bɛɾi]', correctTarget: '[vɛɹi]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'medium'
    },
    {
      id: 'do-th-substitution',
      sourcePhoneme: 't/s',
      targetPhoneme: 'θ',
      transferType: 'substitution',
      l1Rule: 'Spanish lacking /θ/ (seseo) substitutes it with /s/ or /t/.',
      englishImpact: 'Confusion in think/sink, thought/taught.',
      exampleWords: [
        { english: 'think', ipa: '/θɪŋk/', commonL1Error: '[sɪŋk]', correctTarget: '[θɪŋk]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'high'
    },
    {
      id: 'do-schwa-difficulty',
      sourcePhoneme: 'a/e/i/o/u',
      targetPhoneme: 'ə',
      transferType: 'substitution',
      l1Rule: 'Spanish has exactly 5 pure vowels, leading to spelling-pronunciation of English unstressed vowels.',
      englishImpact: 'Incorrect stress and rhythmic distortion of words.',
      exampleWords: [
        { english: 'about', ipa: '/əbaʊt/', commonL1Error: '[abaʊt]', correctTarget: '[əbaʊt]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'high'
    },
    {
      id: 'do-dj-substitution',
      sourcePhoneme: 'ʝ/y',
      targetPhoneme: 'dʒ',
      transferType: 'substitution',
      l1Rule: 'English /dʒ/ mapped to Spanish /ʝ/ or /y/.',
      englishImpact: 'Confusion between job/yob, major/mayor.',
      exampleWords: [
        { english: 'job', ipa: '/dʒɒb/', commonL1Error: '[ʝob]', correctTarget: '[dʒɒb]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'medium'
    }
  ],
  prosodyProfile: {
    intonationPattern: 'Sharper pitch contours with high rising terminals.',
    stressTimingDifference: 'Strong syllable-timing transfers heavily to English, eliminating unstressed reductions.',
    rhythmType: 'syllable-timed',
    commonIntonationErrors: [
      'Applying rising intonation to Wh- questions',
      'Failure to de-stress function words',
      'Placing equal duration on every syllable',
      'Higher baseline pitch than American English'
    ]
  },
  commonLexicalInterferences: [
    { l1Word: 'actualmente', falseEquivalent: 'actually', correctEnglish: 'currently', context: 'Time markers' },
    { l1Word: 'colegio', falseEquivalent: 'college', correctEnglish: 'school / high school', context: 'Education' },
    { l1Word: 'éxito', falseEquivalent: 'exit', correctEnglish: 'success', context: 'General' },
    { l1Word: 'soportar', falseEquivalent: 'support', correctEnglish: 'tolerate / put up with', context: 'Interpersonal' }
  ],
  remediationStrategies: [
    {
      id: 'do-strat-s-coda',
      targetTransferIds: ['do-s-aspiration'],
      technique: 'Continuous Frication linking',
      description: 'Practice holding the /s/ sound and linking it directly to the next word, starting with vowels.',
      articulatoryInstructions: 'Keep teeth lightly touching and push air out like a snake hiss, don\'t stop the air before the next sound.',
      minimalPairDrills: [
        { wordA: 'pat', wordB: 'past', ipaA: '/pæt/', ipaB: '/pæst/', contrastFeature: 'Coda /s/' }
      ]
    },
    {
      id: 'do-strat-cluster',
      targetTransferIds: ['do-cluster-reduction'],
      technique: 'Syllable addition and reduction',
      description: 'First over-pronounce the final consonant as a new syllable, then whisper it, then integrate it.',
      articulatoryInstructions: 'Make a distinct clicking sound for /t/ or /k/ at the end of the word, over-enunciating it.',
      minimalPairDrills: [
        { wordA: 'walk', wordB: 'walked', ipaA: '/wɔk/', ipaB: '/wɔkt/', contrastFeature: 'Final /t/ cluster' }
      ]
    },
    {
      id: 'do-strat-r',
      targetTransferIds: ['do-r-confusion'],
      technique: 'Tongue curling technique',
      description: 'Retracting the tongue without touching the alveolar ridge.',
      articulatoryInstructions: 'Pull tongue back into the center of the mouth, do not let it touch the roof of the mouth anywhere.',
      minimalPairDrills: [
        { wordA: 'dead', wordB: 'red', ipaA: '/dɛd/', ipaB: '/ɹɛd/', contrastFeature: 'Alveolar stop vs approximant' }
      ]
    }
  ]
};

const PUERTO_RICAN_SPANISH_PROFILE: L1ContrastiveProfile = {
  id: 'profile-es-PR',
  l1Code: 'es-PR',
  l1Name: 'Puerto Rican Spanish',
  l1NameNative: 'Español boricua',
  region: 'Caribbean',
  phonologicalTransfers: [
    {
      id: 'pr-r-lateralization',
      sourcePhoneme: 'l',
      targetPhoneme: 'ɹ',
      transferType: 'substitution',
      l1Rule: 'Lateralization of /ɾ/ to [l] in syllable coda.',
      englishImpact: 'Creates confusion in words with post-vocalic R: car -> cal, hard -> hald.',
      exampleWords: [
        { english: 'car', ipa: '/kɑɹ/', commonL1Error: '[kal]', correctTarget: '[kɑɹ]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'high'
    },
    {
      id: 'pr-s-aspiration',
      sourcePhoneme: 'h',
      targetPhoneme: 's',
      transferType: 'deletion',
      l1Rule: 'Extensive /s/ aspiration [h] or deletion in coda positions.',
      englishImpact: 'Grammatical markers (plurals, verbs) are frequently dropped in connected speech.',
      exampleWords: [
        { english: 'cats', ipa: '/kæts/', commonL1Error: '[kæh]', correctTarget: '[kæts]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'critical'
    },
    {
      id: 'pr-ch-sh-merger',
      sourcePhoneme: 'ʃ',
      targetPhoneme: 'tʃ',
      transferType: 'substitution',
      l1Rule: 'Deaffrication of /tʃ/ to [ʃ] in some dialects, leading to hypercorrection or confusion in English.',
      englishImpact: 'Merging of sheep/cheap, wash/watch.',
      exampleWords: [
        { english: 'ship', ipa: '/ʃɪp/', commonL1Error: '[tʃɪp]', correctTarget: '[ʃɪp]' },
        { english: 'chair', ipa: '/tʃɛɹ/', commonL1Error: '[ʃɛɹ]', correctTarget: '[tʃɛɹ]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'medium'
    },
    {
      id: 'pr-velar-n',
      sourcePhoneme: 'ŋ',
      targetPhoneme: 'n',
      transferType: 'substitution',
      l1Rule: 'Alveolar nasal /n/ velarizes to [ŋ] word-finally in PR Spanish.',
      englishImpact: 'English final /n/ sounds like /ŋ/ (sin -> sing), changing meanings.',
      exampleWords: [
        { english: 'sun', ipa: '/sʌn/', commonL1Error: '[sʌŋ]', correctTarget: '[sʌn]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'high'
    },
    {
      id: 'pr-dj-affrication',
      sourcePhoneme: 'tʃ/dʒ',
      targetPhoneme: 'dʒ',
      transferType: 'substitution',
      l1Rule: '/dʒ/ maps unreliably, sometimes devoiced or mapped to fricatives.',
      englishImpact: 'Confusion around J and Y sounds.',
      exampleWords: [
        { english: 'jump', ipa: '/dʒʌmp/', commonL1Error: '[tʃʌmp]', correctTarget: '[dʒʌmp]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'medium'
    },
    {
      id: 'pr-v-b-merger',
      sourcePhoneme: 'b/β',
      targetPhoneme: 'v',
      transferType: 'substitution',
      l1Rule: '/v/ does not exist, uses bilabial [b].',
      englishImpact: 'Vow/bow confusion.',
      exampleWords: [
        { english: 'vote', ipa: '/voʊt/', commonL1Error: '[boʊt]', correctTarget: '[voʊt]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'medium'
    },
    {
      id: 'pr-th-stopping',
      sourcePhoneme: 't/d',
      targetPhoneme: 'θ/ð',
      transferType: 'substitution',
      l1Rule: 'Dental fricatives mapped to dental stops.',
      englishImpact: 'They/day, those/doze confusion.',
      exampleWords: [
        { english: 'they', ipa: '/ðeɪ/', commonL1Error: '[deɪ]', correctTarget: '[ðeɪ]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'high'
    },
    {
      id: 'pr-r-velar',
      sourcePhoneme: 'x/ʁ',
      targetPhoneme: 'ɹ',
      transferType: 'substitution',
      l1Rule: 'Multiple /rr/ often pronounced as a velar or uvular fricative in PR, transferring to English word-initial R.',
      englishImpact: 'Rat sounds like hat or kh-at.',
      exampleWords: [
        { english: 'red', ipa: '/ɹɛd/', commonL1Error: '[xɛd]', correctTarget: '[ɹɛd]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'critical'
    }
  ],
  prosodyProfile: {
    intonationPattern: 'Distinctive Caribbean melodic cadence, frequent downstepping.',
    stressTimingDifference: 'Syllable-timed but with heavy lengthening of stressed vowels in emphatic speech.',
    rhythmType: 'syllable-timed',
    commonIntonationErrors: [
      'Lack of stress-timing rhythm',
      'Over-stressing pronouns',
      'Syllable equalization in multi-syllabic words',
      'Final syllable prolongation'
    ]
  },
  commonLexicalInterferences: [
    { l1Word: 'carpeta', falseEquivalent: 'carpet', correctEnglish: 'folder', context: 'Office/School' },
    { l1Word: 'guagua', falseEquivalent: 'none', correctEnglish: 'bus / SUV', context: 'Transport (concept mismatch)' },
    { l1Word: 'compromiso', falseEquivalent: 'compromise', correctEnglish: 'commitment / appointment', context: 'Scheduling' },
    { l1Word: 'asistir', falseEquivalent: 'assist', correctEnglish: 'attend', context: 'Events' }
  ],
  remediationStrategies: [
    {
      id: 'pr-strat-final-n',
      targetTransferIds: ['pr-velar-n'],
      technique: 'Fronting the nasal',
      description: 'Practice feeling the tongue tip touch behind the upper teeth for /n/ instead of the back of the throat.',
      articulatoryInstructions: 'Bite the tip of your tongue slightly when saying final N to prevent the back of the tongue from rising.',
      minimalPairDrills: [
        { wordA: 'sin', wordB: 'sing', ipaA: '/sɪn/', ipaB: '/sɪŋ/', contrastFeature: 'Alveolar vs Velar Nasal' }
      ]
    },
    {
      id: 'pr-strat-sh-ch',
      targetTransferIds: ['pr-ch-sh-merger'],
      technique: 'Continuous vs stopped airflow',
      description: 'Demonstrate how /ʃ/ can be held infinitely while /tʃ/ is a sudden burst.',
      articulatoryInstructions: 'For CH, put tongue on the roof of mouth and push hard. For SH, let air flow smoothly.',
      minimalPairDrills: [
        { wordA: 'share', wordB: 'chair', ipaA: '/ʃɛɹ/', ipaB: '/tʃɛɹ/', contrastFeature: 'Fricative vs Affricate' }
      ]
    },
    {
      id: 'pr-strat-coda-r',
      targetTransferIds: ['pr-r-lateralization'],
      technique: 'R-coloring vowels',
      description: 'Teach vocalic R /ɚ/ as a vowel quality rather than a consonant to avoid lateralization.',
      articulatoryInstructions: 'Curl tongue back and pull the lips slightly into a tight circle at the end of the word.',
      minimalPairDrills: [
        { wordA: 'coal', wordB: 'core', ipaA: '/koʊl/', ipaB: '/kɔɹ/', contrastFeature: 'Lateral vs Rhotic' }
      ]
    }
  ]
};

const MEXICAN_SPANISH_PROFILE: L1ContrastiveProfile = {
  id: 'profile-es-MX',
  l1Code: 'es-MX',
  l1Name: 'Mexican Spanish',
  l1NameNative: 'Español mexicano',
  region: 'North America',
  phonologicalTransfers: [
    {
      id: 'mx-v-b-merger',
      sourcePhoneme: 'b/β',
      targetPhoneme: 'v',
      transferType: 'substitution',
      l1Rule: 'Absence of /v/, pronounced as bilabial /b/ or /β/.',
      englishImpact: 'Vest/best, vowel/bowel confusion.',
      exampleWords: [
        { english: 'van', ipa: '/væn/', commonL1Error: '[bæn]', correctTarget: '[væn]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'high'
    },
    {
      id: 'mx-sh-ch-confusion',
      sourcePhoneme: 'tʃ',
      targetPhoneme: 'ʃ',
      transferType: 'substitution',
      l1Rule: 'Native /tʃ/ is very strong; /ʃ/ is foreign, so /ʃ/ often maps to /tʃ/.',
      englishImpact: 'Shoe -> chew, wash -> watch.',
      exampleWords: [
        { english: 'sheep', ipa: '/ʃi:p/', commonL1Error: '[tʃi:p]', correctTarget: '[ʃi:p]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'critical'
    },
    {
      id: 'mx-z-devoicing',
      sourcePhoneme: 's',
      targetPhoneme: 'z',
      transferType: 'substitution',
      l1Rule: 'Spanish lacks a phonemic /z/; English /z/ is devoiced to /s/.',
      englishImpact: 'Confuses plurals (eyes -> ice), verbs (lies -> lice).',
      exampleWords: [
        { english: 'zip', ipa: '/zɪp/', commonL1Error: '[sɪp]', correctTarget: '[zɪp]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'high'
    },
    {
      id: 'mx-th-stopping',
      sourcePhoneme: 't/d',
      targetPhoneme: 'θ/ð',
      transferType: 'substitution',
      l1Rule: 'Dental fricatives substitute to dental stops or alveolar fricatives.',
      englishImpact: 'Think -> tink or sink.',
      exampleWords: [
        { english: 'this', ipa: '/ðɪs/', commonL1Error: '[dɪs]', correctTarget: '[ðɪs]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'high'
    },
    {
      id: 'mx-schwa-difficulty',
      sourcePhoneme: 'a/e/i/o/u',
      targetPhoneme: 'ə',
      transferType: 'substitution',
      l1Rule: 'Vowel reduction does not occur in Mexican Spanish.',
      englishImpact: 'Every vowel gets full quality, reducing stress-timing.',
      exampleWords: [
        { english: 'contain', ipa: '/kənˈteɪn/', commonL1Error: '[kɔnˈteɪn]', correctTarget: '/kənˈteɪn/' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'critical'
    },
    {
      id: 'mx-ng-difficulty',
      sourcePhoneme: 'n',
      targetPhoneme: 'ŋ',
      transferType: 'substitution',
      l1Rule: 'Velar nasal only exists as an allophone before velar consonants, not word-finally.',
      englishImpact: 'Adding /g/ or /k/ to -ing words (singing -> sing-ging).',
      exampleWords: [
        { english: 'thing', ipa: '/θɪŋ/', commonL1Error: '[tɪŋg]', correctTarget: '[θɪŋ]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'medium'
    },
    {
      id: 'mx-dj-weakening',
      sourcePhoneme: 'ʝ',
      targetPhoneme: 'dʒ',
      transferType: 'substitution',
      l1Rule: 'Initial /dʒ/ weakened to palatal fricative /ʝ/ or approximant /j/.',
      englishImpact: 'Joke -> yoke, gel -> yell.',
      exampleWords: [
        { english: 'jeep', ipa: '/dʒi:p/', commonL1Error: '[ʝi:p]', correctTarget: '[dʒi:p]' }
      ],
      cefrRemediationLevel: 'B2',
      priority: 'medium'
    },
    {
      id: 'mx-cluster-e-epenthesis',
      sourcePhoneme: 'es',
      targetPhoneme: 's',
      transferType: 'insertion',
      l1Rule: 'Spanish words never start with s+consonant; inserts prothetic /e/.',
      englishImpact: 'Spain -> Espain, student -> estudent.',
      exampleWords: [
        { english: 'school', ipa: '/skul/', commonL1Error: '[ɛskul]', correctTarget: '[skul]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'critical'
    }
  ],
  prosodyProfile: {
    intonationPattern: 'Noticeable pitch rises at the end of prosodic phrases even in statements.',
    stressTimingDifference: 'Less extreme syllable-timing than Caribbean, but lacks English rhythm.',
    rhythmType: 'syllable-timed',
    commonIntonationErrors: [
      'Overly melodic sentence intonation',
      'Pitch upstep at the end of declarative sentences',
      'Stress misplacement in compound nouns',
      'Failure to reduce function words'
    ]
  },
  commonLexicalInterferences: [
    { l1Word: 'grosería', falseEquivalent: 'grocery', correctEnglish: 'rudeness / swear word', context: 'Behavior' },
    { l1Word: 'recordar', falseEquivalent: 'record', correctEnglish: 'remember', context: 'Memory' },
    { l1Word: 'sano', falseEquivalent: 'sane', correctEnglish: 'healthy', context: 'Health' },
    { l1Word: 'parientes', falseEquivalent: 'parents', correctEnglish: 'relatives', context: 'Family' }
  ],
  remediationStrategies: [
    {
      id: 'mx-strat-z-voicing',
      targetTransferIds: ['mx-z-devoicing'],
      technique: 'Vocal fold vibration awareness',
      description: 'Tactile feedback by placing fingers on throat to feel buzzing for /z/ vs /s/.',
      articulatoryInstructions: 'Turn your voice box on, feel the buzz in your throat and teeth.',
      minimalPairDrills: [
        { wordA: 'ice', wordB: 'eyes', ipaA: '/aɪs/', ipaB: '/aɪz/', contrastFeature: 'Voicing of alveolar fricative' }
      ]
    },
    {
      id: 'mx-strat-prothetic-e',
      targetTransferIds: ['mx-cluster-e-epenthesis'],
      technique: 'Snake sound start',
      description: 'Start with a prolonged /s/ hiss before attempting the rest of the word.',
      articulatoryInstructions: 'Hiss like a snake first (sssss), then add the rest of the word without stopping the hiss. ssss-cool.',
      minimalPairDrills: [
        { wordA: 'estate', wordB: 'state', ipaA: '/ɪsˈteɪt/', ipaB: '/steɪt/', contrastFeature: 'No initial vowel' }
      ]
    },
    {
      id: 'mx-strat-v-b',
      targetTransferIds: ['mx-v-b-merger'],
      technique: 'Lip-teeth isolation',
      description: 'Exaggerated biting of lower lip to prevent bilabial closure.',
      articulatoryInstructions: 'Rest your top teeth on your bottom lip and blow air, letting your voice buzz. Never let your top lip touch your bottom lip.',
      minimalPairDrills: [
        { wordA: 'berry', wordB: 'very', ipaA: '/bɛɹi/', ipaB: '/vɛɹi/', contrastFeature: 'Bilabial stop vs Labiodental fricative' }
      ]
    }
  ]
};

const COLOMBIAN_SPANISH_PROFILE: L1ContrastiveProfile = {
  id: 'profile-es-CO',
  l1Code: 'es-CO',
  l1Name: 'Colombian Spanish',
  l1NameNative: 'Español colombiano',
  region: 'South America',
  phonologicalTransfers: [
    {
      id: 'co-v-b-merger',
      sourcePhoneme: 'b',
      targetPhoneme: 'v',
      transferType: 'substitution',
      l1Rule: 'Standard Spanish merging of /v/ and /b/.',
      englishImpact: 'Vote/boat confusion.',
      exampleWords: [
        { english: 'vine', ipa: '/vaɪn/', commonL1Error: '[baɪn]', correctTarget: '[vaɪn]' }
      ],
      cefrRemediationLevel: 'A1',
      priority: 'high'
    },
    {
      id: 'co-z-devoicing',
      sourcePhoneme: 's',
      targetPhoneme: 'z',
      transferType: 'substitution',
      l1Rule: 'Devoicing of English /z/ to /s/.',
      englishImpact: 'Lose -> loose, price -> prize.',
      exampleWords: [
        { english: 'zoo', ipa: '/zu:/', commonL1Error: '[su:]', correctTarget: '[zu:]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'high'
    },
    {
      id: 'co-th-substitution',
      sourcePhoneme: 'd/t',
      targetPhoneme: 'θ/ð',
      transferType: 'substitution',
      l1Rule: 'Dental stops replace dental fricatives.',
      englishImpact: 'There -> dare, through -> true.',
      exampleWords: [
        { english: 'then', ipa: '/ðɛn/', commonL1Error: '[dɛn]', correctTarget: '[ðɛn]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'high'
    },
    {
      id: 'co-schwa-difficulty',
      sourcePhoneme: 'V',
      targetPhoneme: 'ə',
      transferType: 'substitution',
      l1Rule: 'Clear vowel pronunciation in unstressed syllables.',
      englishImpact: 'Reduces English rhythm and can shift word stress.',
      exampleWords: [
        { english: 'lemon', ipa: '/lɛmən/', commonL1Error: '[lɛmɒn]', correctTarget: '[lɛmən]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'critical'
    },
    {
      id: 'co-r-articulation',
      sourcePhoneme: 'ɾ',
      targetPhoneme: 'ɹ',
      transferType: 'substitution',
      l1Rule: 'Use of alveolar tap instead of postalveolar approximant.',
      englishImpact: 'Can sound harsh or be confused with /d/.',
      exampleWords: [
        { english: 'rain', ipa: '/ɹeɪn/', commonL1Error: '[ɾeɪn]', correctTarget: '[ɹeɪn]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'medium'
    },
    {
      id: 'co-final-d-deletion',
      sourcePhoneme: '∅',
      targetPhoneme: 'd',
      transferType: 'deletion',
      l1Rule: 'Final /d/ often softened or deleted in colloquial speech (e.g., verdad -> verdá).',
      englishImpact: 'Loss of past tense markers or confusion (bad -> ba).',
      exampleWords: [
        { english: 'had', ipa: '/hæd/', commonL1Error: '[hæ]', correctTarget: '[hæd]' }
      ],
      cefrRemediationLevel: 'B1',
      priority: 'medium'
    },
    {
      id: 'co-yeismo-l-cluster',
      sourcePhoneme: 'ʝ',
      targetPhoneme: 'lj',
      transferType: 'substitution',
      l1Rule: 'Yeísmo maps /ll/ to /ʝ/ or /dʒ/; affects English words like million.',
      englishImpact: 'Million -> mi-jon.',
      exampleWords: [
        { english: 'million', ipa: '/mɪljən/', commonL1Error: '[mɪʝən]', correctTarget: '[mɪljən]' }
      ],
      cefrRemediationLevel: 'B2',
      priority: 'low'
    },
    {
      id: 'co-i-ɪ-merger',
      sourcePhoneme: 'i',
      targetPhoneme: 'ɪ',
      transferType: 'substitution',
      l1Rule: 'Spanish has only tense /i/, merging English tense /i:/ and lax /ɪ/.',
      englishImpact: 'Sheet -> shit, peach -> pitch.',
      exampleWords: [
        { english: 'bit', ipa: '/bɪt/', commonL1Error: '[bi:t]', correctTarget: '[bɪt]' }
      ],
      cefrRemediationLevel: 'A2',
      priority: 'critical'
    }
  ],
  prosodyProfile: {
    intonationPattern: 'Clear articulation, often retaining strong rhythmic boundaries.',
    stressTimingDifference: 'Strongly syllable-timed. Every syllable receives almost equal length.',
    rhythmType: 'syllable-timed',
    commonIntonationErrors: [
      'Inability to reduce vowels in unstressed syllables',
      'Over-pronunciation of function words',
      'Rhythmic stiffness',
      'Incorrect stress on compound words'
    ]
  },
  commonLexicalInterferences: [
    { l1Word: 'atender', falseEquivalent: 'attend', correctEnglish: 'assist / take care of', context: 'Service' },
    { l1Word: 'sensible', falseEquivalent: 'sensible', correctEnglish: 'sensitive', context: 'Emotions' },
    { l1Word: 'realizar', falseEquivalent: 'realize', correctEnglish: 'carry out / make', context: 'Actions' },
    { l1Word: 'soportar', falseEquivalent: 'support', correctEnglish: 'tolerate / stand', context: 'Interpersonal' }
  ],
  remediationStrategies: [
    {
      id: 'co-strat-i-i',
      targetTransferIds: ['co-i-ɪ-merger'],
      technique: 'Relaxed jaw drop',
      description: 'Teach lax /ɪ/ by relaxing the jaw and tongue compared to tight /i:/.',
      articulatoryInstructions: 'Drop your jaw slightly and relax your lips completely, as if you are too tired to say /i/.',
      minimalPairDrills: [
        { wordA: 'seat', wordB: 'sit', ipaA: '/si:t/', ipaB: '/sɪt/', contrastFeature: 'Tense vs Lax Vowel' }
      ]
    },
    {
      id: 'co-strat-th',
      targetTransferIds: ['co-th-substitution'],
      technique: 'Tongue sandwich',
      description: 'Ensure tongue is visibly between teeth and air is constantly flowing.',
      articulatoryInstructions: 'Stick your tongue out slightly past your teeth and blow air. Don\'t let the tongue trap the air.',
      minimalPairDrills: [
        { wordA: 'dare', wordB: 'there', ipaA: '/dɛɹ/', ipaB: '/ðɛɹ/', contrastFeature: 'Stop vs Fricative' }
      ]
    },
    {
      id: 'co-strat-schwa',
      targetTransferIds: ['co-schwa-difficulty'],
      technique: 'Rhythm and de-stressing',
      description: 'Exaggerate the stressed syllable and completely mumble the unstressed ones.',
      articulatoryInstructions: 'Make the unstressed vowel sound like a caveman grunt /uh/, totally relaxed mouth.',
      minimalPairDrills: [
        { wordA: 'can', wordB: 'can (unstressed)', ipaA: '/kæn/', ipaB: '/kən/', contrastFeature: 'Full vowel vs Schwa' }
      ]
    }
  ]
};

export const L1_CONTRASTIVE_PROFILES: L1ContrastiveProfile[] = [
  DOMINICAN_SPANISH_PROFILE,
  PUERTO_RICAN_SPANISH_PROFILE,
  MEXICAN_SPANISH_PROFILE,
  COLOMBIAN_SPANISH_PROFILE,
];

export function getProfileByL1Code(code: string): L1ContrastiveProfile | undefined {
  return L1_CONTRASTIVE_PROFILES.find(profile => profile.l1Code === code);
}

export function getRemediationForTransfer(profileCode: string, transferId: string): RemediationStrategy[] {
  const profile = getProfileByL1Code(profileCode);
  if (!profile) return [];
  return profile.remediationStrategies.filter(strat => strat.targetTransferIds.includes(transferId));
}

export function getHighPriorityTransfers(profileCode: string): PhonologicalTransfer[] {
  const profile = getProfileByL1Code(profileCode);
  if (!profile) return [];
  return profile.phonologicalTransfers.filter(t => t.priority === 'critical' || t.priority === 'high');
}
