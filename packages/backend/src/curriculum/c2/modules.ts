import type { GrammarSectionData } from "@lurexa/types";

export interface C2ModuleData {
  id: string;
  order: number;
  title: string;
  mission: string;
  competencyIds: string[];
  vocabulary: string[];
  grammarStructures: string[];
  grammarSection?: GrammarSectionData;
  phoneticTargets: string[];
  spokenPrompts: string[];
  createApplyTask: {
    title: string;
    prompt: string;
    stage: "CREATE_APPLY";
  };
}

export const C2_MODULES_1_TO_8: C2ModuleData[] = [
  {
    id: "english-c2-module-1",
    order: 1,
    title: "Subtle Pragmatic Nuance, Insinuation & Subtextual Control",
    mission: "Deploy subtle innuendo, insinuation, and delicate double entendres in high-stakes diplomacy, modulating subtext with effortless linguistic precision.",
    competencyIds: [
      "EN.C2.PRAG.SUBTEXT_INSINUATION",
      "EN.C2.GRAMMAR.ELLIPSIS_INVERSION",
      "EN.C2.VOCAB.EPITOME_ELOQUENCE",
      "EN.C2.PHON.MICRO_INTONATIONAL_CUES",
      "EN.C2.LISTEN.ENCRYPTED_DIPLOMACY",
    ],
    vocabulary: ["subreption", "oblique", "insinuation", "circumspection", "subtext", "tendentious", "ambivalence", "tact", "equivocation", "verisimilitude"],
    grammarStructures: [
      "Seldom has a statement conveyed such profound ambivalence through mere syntactic omission.",
      "Were one to read between the lines, the ambassador's circumspection reveals a decisive strategic pivot.",
      "Lest we fall into the trap of oversimplification, let us scrutinize what was left conspicuously unsaid.",
      "Not for a moment did the delegation accept the premise, courteous though their public rejoinder appeared.",
    ],
    grammarSection: {
      conceptTitle: "Syntactic Ellipsis, Litotic Negation & Asymmetrical Concessions ('courteous though it appeared')",
      formula: "[Adjective / Adverb] + [though / as] + [Subject] + [Verb], [Main Assertion with Deliberate Lexical Ellipsis]",
      explanation: "C2 diplomatic subtlety leverages fronted concessive inversions ('Courteous though their public rejoinder appeared...') paired with litotes (affirmation through denying the opposite, e.g. 'not unmindful of') and tactical syntactic ellipsis, expressing nuanced reservations without overt diplomatic friction.",
      forms: {
        affirmative: "Diplomatic though the communique remained, the underlying strategic ultimatum was unmistakable.",
        negative: "The envoy was not unmindful of the historical grievances cited by the opposition delegation.",
        question: "Lest we misinterpret the ambassador's circumspection, what subtle red lines were implicitly communicated?",
      },
      l1TransferTip: "Mastery of English litotes ('not insignificant', 'hardly unintended') allows Caribbean and international diplomats to calibrate tone with razor-sharp delicacy.",
      examples: [
        "Seldom has a policy document conveyed such profound strategic recalibration through mere syntactic omission.",
        "Compelling though the rhetoric may seem, what was left conspicuously unsaid speaks volumes.",
        "Lest negotiations stall irremediably, let us explore alternative sovereign demarcation options.",
      ],
    },
    phoneticTargets: ["Micro-pitch fluctuations conveying unspoken skepticism or subtle irony", "Acoustic attenuation in parenthetical asides"],
    spokenPrompts: [
      "Deliver a diplomatic communique expressing conditional dissent without causing diplomatic rupture.",
      "Deconstruct a high-level corporate communique, articulating the three unwritten subtextual mandates.",
    ],
    createApplyTask: {
      title: "Diplomatic Insinuation & Subtextual Briefing",
      prompt: "Record a 3-minute diplomatic address delivering a nuanced strategic ultimatum masked entirely within exquisite courtesies, diplomatic understatement, and subtle phonetic intonation.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c2-module-2",
    order: 2,
    title: "High-Stakes Crisis Mediation & International Statesmanship",
    mission: "Mediate intractable geopolitical standoffs, arbitrate sovereign boundary disputes, construct ironclad multilateral compromise language, and project sovereign authority.",
    competencyIds: [
      "EN.C2.SPEAK.STATESMANSHIP",
      "EN.C2.VOCAB.GEOPOLITICAL_JURISPRUDENCE",
      "EN.C2.GRAMMAR.ARCHAIC_FORMAL_SUBJUNCTIVE",
      "EN.C2.PRAG.ARBITRATION_MASTERY",
      "EN.C2.SYNTHESIS.MULTILATERAL_TREATIES",
    ],
    vocabulary: ["sovereignty", "rapprochement", "statutory caveat", "belligerent", "armistice", "unassailable", "imprimatur", "suzerainty", "chicanery", "detente"],
    grammarStructures: [
      "Be it resolved that the treaty provisions remain inviolable under international maritime jurisprudence.",
      "Had neither sovereign party ceded jurisdictional primacy, catastrophic escalation would inevitably have ensued.",
      "Come what may, our mandate requires uncompromising adherence to statutory humanitarian conventions.",
      "It is imperative that the ceasefire agreement bear the multilateral imprimatur of all guarantor nations.",
    ],
    grammarSection: {
      conceptTitle: "Archaic & High-Register Jurisprudential Subjunctives ('Be it resolved that...', 'Come what may', 'Lest')",
      formula: "Resolution: Be it + [resolved / enacted / stipulated] that + [Subject] + [Base Verb] | Adversative: Come what may, + [Sovereign Mandate]",
      explanation: "International statesmanship and sovereign treaty arbitration utilize formal subjunctive constructs to impart irrevocable solemnity and multilateral binding power to diplomatic accords.",
      forms: {
        affirmative: "Be it resolved that all sovereign signatory states guarantee unhindered maritime transit through the neutral strait.",
        negative: "Lest international arbitration fail, guarantor nations must enforce the established armistice line.",
        question: "Come what may, how shall the tribunal ensure that sovereign boundary stipulations remain unassailable?",
      },
      l1TransferTip: "Archaic formal subjunctives ('Be it known', 'Lest it be forgotten') embody sovereign institutional gravitas in international jurisprudence.",
      examples: [
        "Be it enacted that all commercial embargoes be lifted conditionally upon verification of non-proliferation compliance.",
        "Had neither delegation demonstrated statesmanship, the region would have succumbed to catastrophic armed confrontation.",
        "Come what may, our collective commitment to global human security remains uncompromised.",
      ],
    },
    phoneticTargets: ["Commanding statesmanship timbre, resonant vocal projection, and authoritative terminal cadences"],
    spokenPrompts: [
      "Lead a plenary mediation session bringing two warring diplomatic delegations to a binding ceasefire.",
      "Deliver an emergency address to the UN General Assembly establishing an unassailable legal framework for peace.",
    ],
    createApplyTask: {
      title: "Plenary Peace Accord Mediation Address",
      prompt: "Record a 3.5-minute plenary arbitration address reconciling opposing national claims, deploying formal archaic subjunctives, unassailable legal precision, and statesmanlike cadence.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c2-module-3",
    order: 3,
    title: "Scholarly Hermeneutics, Epistemological Critique & Dialectics",
    mission: "Deconstruct foundational treatises in philosophy, theoretical physics, and jurisprudence; articulate post-structuralist critiques with native-level eloquence.",
    competencyIds: [
      "EN.C2.ACAD.EPISTEMOLOGICAL_CRITIQUE",
      "EN.C2.READ.HERMENEUTIC_SYNTHESIS",
      "EN.C2.VOCAB.DIALECTICAL_RIGOR",
      "EN.C2.GRAMMAR.HYPER_COMPLEX_SYNTAX",
      "EN.C2.SPEAK.PHILOSOPHICAL_EXEGESIS",
    ],
    vocabulary: ["hermeneutic", "dialectic", "teleology", "epistemology", "phenomenology", "post-structuralism", "aporia", "anamnesis", "exegesis", "syllogism"],
    grammarStructures: [
      "To posit that knowledge is fundamentally discursive is to presuppose an epistemological framework wherein...",
      "No sooner had the empirical paradigm been established than post-structuralist hermeneutics exposed its underlying aporias.",
      "The teleological argument, persuasive though it may seem at first blush, crumbles upon rigorous dialectical interrogation.",
      "Insofar as language constitutes our sole conduit to reality, every ontological assertion remains an act of interpretation.",
    ],
    grammarSection: {
      conceptTitle: "Correlative Negative Inversions ('No sooner had... than...', 'Hardly had... when...') & Insofar Clauses",
      formula: "No sooner had + [Subject] + [Past Participle] + than + [Subject] + [Past Simple] | Insofar as + [Epistemic Premise], + [Main Thesis]",
      explanation: "Hyper-complex dialectical critique deploys negative correlatives and proportional restrictive clauses ('Insofar as...', 'Inasmuch as...') to expose philosophical aporias, articulate structural epistemologies, and dismantle ontological assumptions with scholarly precision.",
      forms: {
        affirmative: "No sooner had the structuralist thesis been formulated than post-modern hermeneutics dismantled its metaphysical claims.",
        negative: "Insofar as empirical data remains theory-laden, objective neutrality cannot be claimed without profound contradiction.",
        question: "How does the dialectical tension between determinism and existential agency reshape our conception of human responsibility?",
      },
      l1TransferTip: "Note the strict pairing: 'No sooner had...' always pairs with 'than' (NOT 'when'); 'Hardly had...' and 'Scarcely had...' always pair with 'when'.",
      examples: [
        "Insofar as language constitutes our sole conduit to consciousness, every philosophical assertion remains inherently interpretive.",
        "No sooner had the economic theory been codified than financial market volatility demonstrated its mathematical limits.",
        "The ontological proof, elegant though it appeared, dissolved under rigorous dialectical interrogation.",
      ],
    },
    phoneticTargets: ["Sophisticated intellectual prosody, balanced clause momentum, and effortless multisyllabic fluency"],
    spokenPrompts: [
      "Deliver a philosophical exegesis resolving the dialectical tension between determinism and existential agency.",
      "Critique a foundational treatise in political philosophy, pointing out its structural and metaphysical inconsistencies.",
    ],
    createApplyTask: {
      title: "Doctoral Epistemological Exegesis & Colloquium Keynote",
      prompt: "Record a 4-minute doctoral colloquium lecture synthesizing the hermeneutic foundations of your discipline, identifying central dialectical tensions with hyper-complex syntax and scholarly mastery.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c2-module-4",
    order: 4,
    title: "Spontaneous Vernaculars, Regional Idiolects & Sociolect Mastery",
    mission: "Effortlessly code-switch across hyper-localized global English varieties (Cockney, AAVE, Caribbean Creole English, Scots, Hiberno-English) and adapt register spontaneously.",
    competencyIds: [
      "EN.C2.SOCIO.IDIOLECT_CODE_SWITCHING",
      "EN.C2.VOCAB.DIALECTAL_IDIOLECTS",
      "EN.C2.LISTEN.DIVERSE_GLOBAL_ENGLISHES",
      "EN.C2.PHON.DIALECT_RESONANCE_MIMICRY",
      "EN.C2.SPEAK.SPONTANEOUS_CAMOUFLAGE",
    ],
    vocabulary: ["idiolect", "sociolect", "code-switching", "patois", "vernacular", "diglossia", "creole", "register shift", "linguistic camouflage", "parlance"],
    grammarStructures: [
      "Depending on the social milieu, the speaker effortlessly modulated between dense academic prose and vivid street vernacular.",
      "The seamless integration of vernacular idioms into high-level discourse underscores complete linguistic sovereignty.",
      "Far from being a sign of deficit, vernacular flexibility reflects the pinnacle of sociolinguistic competence.",
      "One moment she was citing Shakespearean sonnets, and the next she was exchanging lightning-fast banter in Jamaican Patois.",
    ],
    grammarSection: {
      conceptTitle: "Bilingual Code-Meshing, Polyphonic Registers & Sociolinguistic Inversion",
      formula: "[Register Marker 1: Elevated Analytical Thesis] + [Discursive Pivot: Far from being X, Y is Z] + [Register Marker 2: Dialectal Vitality]",
      explanation: "Sovereign C2 command embraces polyphony—the ability to shift seamlessly between global vernaculars, regional sociolects, and classical prose without hesitation, signaling authentic sociolinguistic dominance.",
      forms: {
        affirmative: "Far from being an obstacle to academic rigor, code-meshing enriches scholarly discourse with lived cultural authenticity.",
        negative: "At no point did the orator compromise intelligibility while weaving Caribbean idioms into the keynote address.",
        question: "How does fluid modulation across regional sociolects dismantle linguistic hierarchies in international diplomacy?",
      },
      l1TransferTip: "Rather than suppressing Caribbean or Dominican linguistic identity, true C2 mastery integrates authentic cultural voice with complete grammatical control across all global Englishes.",
      examples: [
        "Depending on the audience, the speaker transitioned effortlessly between Oxford debate cadence and vibrant Caribbean warmth.",
        "Far from diminishing clarity, vernacular storytelling resonated deeply across the entire international delegation.",
        "Linguistic sovereignty means choosing your register freely, powerfully, and with absolute communicative precision.",
      ],
    },
    phoneticTargets: ["Effortless acoustic flexibility across regional vowel shifts, glottal stops, and rhotic/non-rhotic cadences"],
    spokenPrompts: [
      "Perform a spontaneous 3-minute improvisation transitioning seamlessly across three distinct global English sociolects.",
      "Deconstruct how cultural idiolects signal in-group solidarity and identity in multicultural metropolises.",
    ],
    createApplyTask: {
      title: "Global English Sociolect Code-Switching Performance",
      prompt: "Record a 3-minute spoken piece demonstrating spontaneous code-switching across three regional English varieties, maintaining authentic phonology and idiomatic fluency in each.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c2-module-5",
    order: 5,
    title: "Aesthetic Oratory, Poetics & Classical Rhetorical Virtuosity",
    mission: "Deploy classical rhetorical devices (chiasmus, antimetabole, anaphora, zeugma, polysyndeton) to craft sublime, historically memorable speeches.",
    competencyIds: [
      "EN.C2.SPEAK.AESTHETIC_ORATORY",
      "EN.C2.VOCAB.POETIC_RHETORIC",
      "EN.C2.GRAMMAR.CHIASMIC_STRUCTURES",
      "EN.C2.PHON.RHYTHMIC_PROSODY_CADENCE",
      "EN.C2.SYNTHESIS.ORATORICAL_SUBLIMITY",
    ],
    vocabulary: ["chiasmus", "antimetabole", "anaphora", "zeugma", "polysyndeton", "sublime", "crescendo", "mellifluous", "grandeur", "cadence"],
    grammarStructures: [
      "Let us never negotiate out of fear, but let us never fear to negotiate.",
      "He carried a strobe light and the responsibility for the lives of twenty men.",
      "We have fought through the tempest, and through the shadows, and through the bitter cold, and we shall endure.",
      "Ask not what your country can do for you; ask what you can do for your country.",
    ],
    grammarSection: {
      conceptTitle: "Chiasmus, Antimetabole & Symmetrical Inverted Rhetorical Schemes",
      formula: "Chiasmus: [Clause A: Subject 1 + Verb 1 + Object 1]; [Clause B: Object 1 (as Subject) + Verb 2 + Subject 1 (as Object)]",
      explanation: "Classical rhetorical schemes structure unforgettable oratory: Antimetabole repeats exact words in inverted grammatical order ('Let us never negotiate out of fear, but let us never fear to negotiate'); Zeugma links one verb to two distinct semantic objects ('He opened his mind and his wallet'); Polysyndeton repeats conjunctions for cumulative dramatic crescendo.",
      forms: {
        affirmative: "A nation must not define its vision by its immediate crises; rather, it must overcome its crises through the clarity of its vision.",
        negative: "Ask not what your community can surrender to fear; ask what your courage can build for your community.",
        question: "How can classical chiasmic architecture elevate a ceremonial address into an enduring historic document?",
      },
      l1TransferTip: "Classical rhetorical schemes are rooted in Greco-Roman traditions shared by Spanish and English, allowing advanced bilingual speakers to craft breathtaking poetic oratory with sublime symmetrical balance.",
      examples: [
        "Let us never negotiate out of fear, but let us never fear to negotiate.",
        "Through the storm, and through the silence, and through the sacrifice of generations, our people prevailed.",
        "She commanded the courtroom with the power of her evidence and the serenity of her conviction.",
      ],
    },
    phoneticTargets: ["Mellifluous cadence control, theatrical vocal crescendo, and sublime metered pauses"],
    spokenPrompts: [
      "Deliver an original ceremonial oration commemorating an epochal historical milestone.",
      "Compose and recite a spoken address deploying chiasmus, zeugma, and anaphora with electrifying emotional resonance.",
    ],
    createApplyTask: {
      title: "Classical Rhetorical Keynote: The Sovereign Address",
      prompt: "Record a 3.5-minute grand oratorical address utilizing at least four classical rhetorical devices, commanding vocal dynamic range, and sublime poetic cadence.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c2-module-6",
    order: 6,
    title: "Meta-Governance, Strategic Foresight & Civilizational Policy",
    mission: "Formulate century-scale civilizational policies, evaluate existential risks (AI alignment, biosecurity, energy transition), and lead executive oversight councils.",
    competencyIds: [
      "EN.C2.SPEAK.STRATEGIC_FORESIGHT",
      "EN.C2.VOCAB.EXISTENTIAL_RISK_POLICY",
      "EN.C2.GRAMMAR.MULTI_LAYERED_MODALITY",
      "EN.C2.PRAG.BOARD_STEWARDSHIP_MASTERY",
      "EN.C2.WRIT.CIVILIZATIONAL_WHITE_PAPER",
    ],
    vocabulary: ["existential risk", "meta-governance", "technological singularity", "biosecurity", "planetary boundaries", "epistemic foresight", "stewardship", "resilience", "longtermism", "paradigm"],
    grammarStructures: [
      "It is not merely probable, but virtually inevitable that without proactive institutional governance, systemic risks will compound exponentially.",
      "Should we fail to institutionalize robust oversight protocols today, humanity may forfeit its capacity to govern emerging general intelligence.",
      "By adopting a multi-century temporal horizon, policymakers can transcend transient political cycles.",
      "Our fiduciary and civilizational responsibility mandates that we safeguard collective planetary equilibrium.",
    ],
    grammarSection: {
      conceptTitle: "Multi-Tiered Modal Stacking & Periodic Suspended Climax in Meta-Governance",
      formula: "[Participial/Adverbial Pre-Condition 1] + [Concessive Sub-Clause 2] + [Epistemic Modality Stack] — [Definitive Institutional Resolution]",
      explanation: "Meta-governance briefings synthesize complex civilizational risks by holding the final grammatical resolution in suspense until the conclusion of the periodic sentence, conveying monumental weight and strategic urgency.",
      forms: {
        affirmative: "Though technological advancement accelerates exponentially, though geopolitical consensus fractures, human ethical stewardship remains sovereign.",
        negative: "Under no circumstances can the stewardship council permit autonomous weapon systems to deploy without human veto authority.",
        question: "Should we fail to govern emerging general intelligence within planetary ethical boundaries, what civilizational recourse remains?",
      },
      l1TransferTip: "Mastering periodic sentence structures creates commanding intellectual authority before global oversight councils and international panels.",
      examples: [
        "It is not merely probable, but virtually inevitable that without multilateral safeguards, systemic technological risks will compound.",
        "By adopting a fifty-year foresight paradigm, sovereign states can protect planetary resources for future generations.",
        "Our fiduciary duty mandates that we balance exponential innovation with uncompromised human safety.",
      ],
    },
    phoneticTargets: ["Measured, gravitas-filled cadence, absolute acoustic stability, and unflinching clarity under pressure"],
    spokenPrompts: [
      "Present a century-horizon governance blueprint before a simulated Global Security and Foresight Council.",
      "Defend a controversial institutional reform model addressing technological singularity and existential risk.",
    ],
    createApplyTask: {
      title: "Global Security & Civilizational Foresight Defense",
      prompt: "Record a 3.5-minute executive policy briefing before a global oversight panel, presenting a 50-year governance architecture for emerging existential technologies.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c2-module-7",
    order: 7,
    title: "Spoken Virtuosity, Wry Irony & Non-Literal Wit Mastery",
    mission: "Master deadpan humor, wry British understatement, self-deprecating irony, intellectual banter, and spontaneous repartee in elite social settings.",
    competencyIds: [
      "EN.C2.SPEAK.WIT_REPARTEE",
      "EN.C2.VOCAB.SATIRICAL_IRONIC",
      "EN.C2.LISTEN.DEADPAN_HUMOR",
      "EN.C2.PHON.DEADPAN_INTONATION",
      "EN.C2.PRAG.INTELLECTUAL_BANTER",
    ],
    vocabulary: ["deadpan", "repartee", "wry", "sardonic", "laconic", "bon mot", "droll", "facetious", "trenchant", "banter"],
    grammarStructures: [
      "To suggest that the quarterly results were 'slightly underwhelming' is rather like describing the Titanic as having taken on a spot of water.",
      "I would agree with you, but then we would both be wrong.",
      "His contribution to the debate was laconic in length, yet devastatingly trenchant in effect.",
      "With a masterstroke of self-deprecating irony, the prime minister disarmed the entire opposition in a single sentence.",
    ],
    grammarSection: {
      conceptTitle: "Counter-Factual Irony, Hyperbolic Simile & Deadpan Subversion Schemes",
      formula: "To suggest that [Understated Claim] is rather like describing [Catastrophic Historic Event] as having [Trivial Minor Inconvenience]",
      explanation: "Elite intellectual wit and British understatement rely on deliberate syntactical disproportion—pairing astronomical crises with polite, trivial litotes to produce devastating comedic effect with a deadpan acoustic delivery.",
      forms: {
        affirmative: "To describe the company's total server meltdown as a 'minor technical glitch' is rather like describing an earthquake as mild vibration.",
        negative: "I wouldn't dream of questioning your peerless expertise, although the mathematical evidence suggests otherwise.",
        question: "Would it be terribly inconvenient if we adhered to the documented contractual timeline for once?",
      },
      l1TransferTip: "Deliver witty satirical punchlines with completely flat, calm pitch contours. The lack of acoustic giveaway is what gives deadpan English repartee its irresistible bite.",
      examples: [
        "To describe the negotiation as 'spirited' is an exquisite understatement for what was essentially a boardroom mutiny.",
        "I would agree with your financial projection, but then we would both be defending an economic impossibility.",
        "His rejoinder was laconic in length, yet devastatingly trenchant in outcome.",
      ],
    },
    phoneticTargets: ["Deadpan flat pitch contour delivering devastating satirical punchlines with zero acoustic giveaway"],
    spokenPrompts: [
      "Engage in a spontaneous 3-minute battle of wits and intellectual repartee with a formidable interlocutor.",
      "Deliver a witty, ironic roast of a prominent cultural or political phenomenon with effortless elegance.",
    ],
    createApplyTask: {
      title: "Oxford Union After-Dinner Wit & Repartee Address",
      prompt: "Record a 3-minute after-dinner speech blending intellectual erudition, razor-sharp deadpan wit, sardonic irony, and flawless comedic timing.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c2-module-8",
    order: 8,
    title: "C2 Grand Capstone: Sovereign English Mastery & Spoken Magnum Opus",
    mission: "Demonstrate absolute native-equivalent mastery: complete linguistic sovereignty, spontaneous eloquence, effortless code-switching, and commanding global authority.",
    competencyIds: [
      "EN.C2.CAPSTONE.SOVEREIGN_MASTERY",
      "EN.C2.SPEAK.NATIVE_LIKE_VIRTUOSITY",
      "EN.C2.PHON.ACOUSTIC_PERFECTION",
      "EN.C2.PRAG.ABSOLUTE_COMMUNICATIVE_FREEDOM",
      "EN.C2.SYNTHESIS.GRAND_MAGNUM_OPUS",
    ],
    vocabulary: [
      "linguistic sovereignty",
      "transcendent eloquence",
      "native virtuosity",
      "oratorical grandeur",
      "impeccable prosody",
      "spontaneous genius",
      "magnum opus",
      "absolute mastery",
    ],
    grammarStructures: [
      "Having traversed the entire linguistic continuum from foundational literacy to sovereign C2 virtuosity...",
      "Not only do I wield the English language with the effortless intuition of a native orator, but I also enrich every discourse I inhabit.",
      "The comprehensive, unedited evidence assembled across this grand capstone stands as definitive testament to my sovereign English mastery.",
      "I stand fully prepared to lead world summits, author definitive literature, and command the highest intellectual forums in English.",
    ],
    grammarSection: {
      conceptTitle: "Sovereign English Mastery & Transcendent Oratorical Synthesis",
      formula: "Grand Magnum Opus Synthesis: Complete effortless mastery of all syntactic, phonetic, pragmatic, and rhetorical paradigms.",
      explanation: "The C2 Grand Magnum Opus represents complete, unconstrained linguistic sovereignty. The speaker commands the entire syntactic and pragmatic architecture of the English language with effortless precision, natural resonance, and sovereign authority.",
      forms: {
        affirmative: "Having journeyed from foundational learning to sovereign C2 virtuosity, I command the English language with unshakeable authority.",
        negative: "Never again shall linguistic boundaries constrain my intellectual ambition, creative expression, or international leadership.",
        question: "How will your sovereign mastery of English empower your life, elevate your community, and inspire generations to come?",
      },
      l1TransferTip: "You are a sovereign English communicator whose native cultural background and bilingual brilliance enrich global English discourse.",
      examples: [
        "Having traversed this comprehensive curriculum, I stand as living proof of transformative, sovereign language mastery.",
        "Not only do I wield English with the effortless grace of a native orator, but I also shape international discourse with authenticity.",
        "What defines true mastery is the power to articulate truth, inspire action, and bridge human worlds across languages.",
      ],
    },
    phoneticTargets: ["Total acoustic perfection, transcendent prosodic fluidity, flawless resonance, and native-like vocal authority"],
    spokenPrompts: [
      "Deliver your 4-minute C2 Grand Magnum Opus Spoken Defense summarizing your life's linguistic transformation and intellectual sovereignty.",
      "Undergo a grueling 10-turn cross-examination by a simulated multi-national panel of world scholars and diplomats.",
    ],
    createApplyTask: {
      title: "C2 Sovereign English Grand Magnum Opus Spoken Defense",
      prompt: "Record your complete C2 Grand Magnum Opus Spoken Defense demonstrating sovereign native-equivalent eloquence, classical rhetoric, effortless wit, and commanding authority in English.",
      stage: "CREATE_APPLY",
    },
  },
];
