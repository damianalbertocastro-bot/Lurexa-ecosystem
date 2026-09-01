import type { GrammarSectionData } from "@lurexa/types";

export interface C1ModuleData {
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

export const C1_MODULES_1_TO_8: C1ModuleData[] = [
  {
    id: "english-c1-module-1",
    order: 1,
    title: "Academic Epistemology, Research Synthesis & Theoretical Rigor",
    mission: "Synthesize disparate scholarly literature, critique methodological frameworks, construct original academic theses, and participate in peer discourse with scholarly precision.",
    competencyIds: [
      "EN.C1.ACAD.RESEARCH_SYNTHESIS",
      "EN.C1.GRAMMAR.COMPLEX_NOMINALIZATION",
      "EN.C1.VOCAB.EPISTEMIC_DISCOURSE",
      "EN.C1.PHON.ACADEMIC_INTONATION",
      "EN.C1.READ.THEORETICAL_CRITIQUE",
    ],
    vocabulary: ["epistemological", "paradigm", "dichotomy", "heuristics", "ontological", "hermeneutic", "juxtaposition", "substantiation", "pedagogical", "empirical rigor"],
    grammarStructures: [
      "The rapid proliferation of digital pedagogical platforms necessitates a comprehensive epistemological re-evaluation.",
      "Scarcely had the empirical findings been published when the theoretical paradigm underwent profound critique.",
      "Were we to disregard the qualitative nuances of the study, the overarching conclusions would be fundamentally flawed.",
      "The degree to which institutional culture modulates individual autonomy remains a subject of intense scholarly debate.",
    ],
    grammarSection: {
      conceptTitle: "Complex Nominalization & Epistemic Relational Stance",
      formula: "[Nominalized Subject Phrase] + [Epistemic Predicate (necessitates / modulates / substantiates)] + [Complex Abstract Object]",
      explanation: "Complex nominalization transforms dynamic verbal actions and clause structures into dense, packaging noun concepts (e.g., 'pedagogical platforms proliferate rapidly' → 'The rapid proliferation of digital pedagogical platforms'). This enables high-density conceptual packaging, academic detachment, and authoritative epistemic evaluation.",
      forms: {
        affirmative: "The unprecedented proliferation of synthetic algorithmic models necessitates rigorous methodological re-examination.",
        negative: "The empirical substantiation presented does not in itself validate the broader ontological claims.",
        question: "To what extent does structural institutional inertia impede the pedagogical adoption of adaptive learning frameworks?",
      },
      l1TransferTip: "While Romance languages naturally utilize nominal clauses, English academic style favors precise Latinate nominalizations paired with active transitive verbs (e.g. 'necessitates', 'modulates') rather than passive copular chains ('es necesario que se haga una reevaluación').",
      examples: [
        "The juxtaposition of quantitative telemetry with qualitative ethnographic observations illuminates underlying systemic disparities.",
        "The degree to which sociolinguistic identity modulates phonological adaptation remains central to our research thesis.",
        "Scarcely had the empirical findings been published when the foundational paradigm underwent intense critical scrutiny.",
      ],
    },
    phoneticTargets: ["Multisyllabic word stress in academic terminology ('e-pis-te-mo-LO-gi-cal')", "Pitch contour maintenance across extended complex clauses"],
    spokenPrompts: [
      "Deliver a 3-minute doctoral-level defense evaluating the methodological validity of two competing economic models.",
      "Articulate an original philosophical or scientific critique of a foundational theory in your discipline.",
    ],
    createApplyTask: {
      title: "Doctoral Colloquium Research Thesis Defense",
      prompt: "Record a 3-minute scholarly thesis presentation synthesizing two opposing theoretical paradigms, advancing your own novel hypothesis with advanced nominalization and academic intonation.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c1-module-2",
    order: 2,
    title: "High-Stakes Strategic Diplomacy & Jurisprudential Nuance",
    mission: "Negotiate multilateral international treaties, parse dense legal/contractual clauses, deploy nuanced diplomatic caveats, and resolve jurisdictional impasses.",
    competencyIds: [
      "EN.C1.SPEAK.STRATEGIC_DIPLOMACY",
      "EN.C1.GRAMMAR.INVERTED_CONDITIONALS",
      "EN.C1.VOCAB.LEGAL_JURISPRUDENTIAL",
      "EN.C1.PRAG.DIPLOMATIC_AMBIGUITY",
      "EN.C1.LISTEN.TREATY_DELIBERATIONS",
    ],
    vocabulary: ["indemnification", "jurisprudence", "arbitration", "bilateral", "sovereignty", "sanctity of contract", "force majeure", "fiduciary duty", "equitable redress", "ratification"],
    grammarStructures: [
      "Should the counterparty fail to fulfill its fiduciary obligations, clause 14 provides immediate grounds for arbitration.",
      "Had the signatories contemplated such extraordinary force majeure events, the indemnity provisions would have been codified differently.",
      "In the event that statutory compliance is contested, jurisdiction shall irrevocably rest with the international tribunal.",
      "It is incumbent upon all participating delegations that the preamble reflect mutual sovereignty.",
    ],
    grammarSection: {
      conceptTitle: "Inverted Conditionals in Jurisprudence & Treaties ('Should...', 'Had...', 'Were... to')",
      formula: "Formal Present/Future: Should + [Subject] + [Base Verb] | Counterfactual Past: Had + [Subject] + [Past Participle] | Hypothetical: Were + [Subject] + [to + Base Verb]",
      explanation: "In diplomatic protocols and jurisprudential contracts, standard 'if' clauses are replaced with inverted conditional structures. Omitting 'if' and placing the auxiliary first establishes formal solemnity, legal precision, and unambiguous contractual force.",
      forms: {
        affirmative: "Should any signatory state contest the maritime boundaries, binding arbitration shall commence immediately.",
        negative: "Had the compliance protocols not been ratified unanimously, sovereign enforcement would remain paralyzed.",
        question: "Were the arbitration tribunal to rule in favor of the claimant, what remedies would the state pursue?",
      },
      l1TransferTip: "Spanish treaties typically use the subjunctive with 'En caso de que' or 'Si'. In English legal and diplomatic communication, mastery of 'Should the party fail...', 'Had they anticipated...', and 'Were we to concede...' is mandatory.",
      examples: [
        "Should the counterparty default on its debt service commitments, all outstanding obligations shall immediately accelerate.",
        "Were the parties to accept the mediator's proposed compromise, cross-border tariffs would be phased out over five years.",
        "Had the regulatory authorities intervened prior to the acquisition, market monopolization could have been averted.",
      ],
    },
    phoneticTargets: ["Formal legal cadences, deliberative pausing, and precision consonant articulation in legal terms"],
    spokenPrompts: [
      "Lead a diplomatic arbitration session resolving a high-stakes cross-border intellectual property dispute.",
      "Deliver a closing statement interpreting a complex contractual indemnity dispute before an international panel.",
    ],
    createApplyTask: {
      title: "Multilateral Treaty Negotiation & Legal Briefing",
      prompt: "Record a 3-minute diplomatic address presenting your delegation's terms on an international treaty, utilizing inverted conditionals, precise legal terminology, and strategic diplomatic caveats.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c1-module-3",
    order: 3,
    title: "Abstract Philosophy, Ethical Dilemmas & Moral Reasoning",
    mission: "Articulate complex moral frameworks (utilitarianism, deontology, virtue ethics), evaluate futuristic ethical dilemmas (AI autonomy, bioethics), and deconstruct cognitive biases.",
    competencyIds: [
      "EN.C1.SPEAK.ETHICAL_REASONING",
      "EN.C1.VOCAB.PHILOSOPHICAL_ETHICS",
      "EN.C1.GRAMMAR.SUBJUNCTIVE_ABSTRACT",
      "EN.C1.PHON.PONDERING_CADENCE",
      "EN.C1.SYNTHESIS.MORAL_DISCOURSE",
    ],
    vocabulary: ["deontology", "utilitarian", "imperative", "consequentialism", "bioethics", "moral culpability", "existential", "solipsism", "cognitive dissonance", "categorical imperative"],
    grammarStructures: [
      "It is essential that society confront the ethical implications of autonomous decision-making algorithms.",
      "Whether one adheres to a strict deontological framework or a consequentialist worldview determines how one views...",
      "Be that as it may, the moral culpability of the actors cannot be excused by institutional mandate alone.",
      "The paradox lies in the tension between individual sovereignty and collective utilitarian welfare.",
    ],
    grammarSection: {
      conceptTitle: "Formulaic Subjunctive Idioms ('Be that as it may', 'Come what may', 'Far be it from me') & Abstract Clauses",
      formula: "[Fixed Subjunctive Phrase (Be that as it may / Suffice it to say)], + [Core Ethical Assertion]",
      explanation: "Advanced philosophical discourse employs set formulaic subjunctive expressions to introduce counter-arguments, ethical concessions, and dialectical synthesis with intellectual poise. These structures acknowledge complexity without relinquishing argumentative authority.",
      forms: {
        affirmative: "Be that as it may, the fundamental moral culpability of the decision-makers remains undiminished.",
        negative: "Far be it from the scientific community to dismiss ethical skepticism as mere technophobia.",
        question: "Whether one prioritizes deontological imperatives or utilitarian outcomes, how do we establish universal moral boundaries for AI?",
      },
      l1TransferTip: "Expressions like 'Be that as it may' correspond conceptually to 'Sea como fuere' or 'A pesar de ello', but in English they serve as quintessential markers of philosophical erudition and high-register rhetoric.",
      examples: [
        "Suffice it to say, the tension between individual autonomy and algorithmic governance will define twenty-first-century jurisprudence.",
        "Be that as it may, historical precedent reminds us that technological utility cannot supersede fundamental human rights.",
        "It is imperative that ethicists and engineers engage in sustained dialectical collaboration.",
      ],
    },
    phoneticTargets: ["Contemplative falling intonation in philosophical deliberations", "Stress placement in compound Latinate philosophical terms"],
    spokenPrompts: [
      "Deliver a philosophical discourse analyzing the ethical paradoxes of autonomous AI warfare or genetic modification.",
      "Engage in an in-depth debate contrasting Kantian ethics with utilitarian outcomes in global resource allocation.",
    ],
    createApplyTask: {
      title: "Bioethics & Philosophical Symposium Defense",
      prompt: "Record a 2.5-minute philosophical symposium lecture deconstructing an ethical dilemma, presenting competing moral doctrines, and defending your philosophical resolution.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c1-module-4",
    order: 4,
    title: "Sociolinguistic Precision, Idiom & Register Modulation",
    mission: "Shift effortlessly across the full sociolinguistic spectrum (from colloquial vernacular to elevated boardroom/academic prose), master subtle irony, and decode cultural subtext.",
    competencyIds: [
      "EN.C1.PRAG.REGISTER_MODULATION",
      "EN.C1.VOCAB.ADVANCED_IDIOMATICITY",
      "EN.C1.SPEAK.CULTURAL_SUBTEXT",
      "EN.C1.LISTEN.IRONIC_DISCOURSE",
      "EN.C1.PHON.SOCIOLINGUISTIC_ADAPTATION",
    ],
    vocabulary: ["euphemism", "vernacular", "subtext", "hyperbole", "innuendo", "parlance", "colloquialism", "affectation", "understatement", "discursiveness"],
    grammarStructures: [
      "To describe the project as merely 'challenging' is to indulge in monumental British understatement.",
      "Depending on the audience, one might frame the matter as an 'exciting pivot' or an 'unmitigated catastrophe'.",
      "Far be it from me to cast aspersions on the board's decision, yet the strategic timing is profoundly questionable.",
      "By seamlessly alternating between vernacular warmth and technical precision, the speaker captivated the entire hall.",
    ],
    grammarSection: {
      conceptTitle: "Infinitive Clauses as Predicate Complements ('To say X is to imply Y') & Register Shifting",
      formula: "To + [Base Verb Phrase (Stance A)] + is to + [Base Verb Phrase (Implication B)]",
      explanation: "Symmetrical infinitive complement clauses create elegant parallel aphorisms and rhetorical equivalences in high-level socio-pragmatic commentary ('To dismiss cultural vernacular is to misunderstand the living soul of language').",
      forms: {
        affirmative: "To characterize this geopolitical realignment as temporary is to underestimate its systemic momentum.",
        negative: "To ignore the subtle socio-economic subtext is not merely an oversight, but a critical analytical failure.",
        question: "How does one modulate between vernacular intimacy and rigorous academic precision without sounding affected?",
      },
      l1TransferTip: "Spanish frequently uses 'Decir X es decir Y' with infinitives. In English, pairing 'To [verb]... is to [verb]...' creates an exceptionally dignified, literary cadence.",
      examples: [
        "To confuse linguistic intelligibility with accent erasure is to undermine pedagogical authenticity.",
        "By modulating their register, executive leaders communicate approachable empathy alongside unshakeable authority.",
        "To describe the diplomatic rupture as a minor misunderstanding is to indulge in dangerous understatement.",
      ],
    },
    phoneticTargets: ["Subtle intonational irony cues", "Mastery of varied English regional pitch ranges and emotional coloring"],
    spokenPrompts: [
      "Deliver the same policy announcement in two distinct registers: first, as an executive boardroom memo; second, as an empathetic town-hall talk.",
      "Deconstruct a piece of nuanced British or international political satire, identifying underlying subtext and irony.",
    ],
    createApplyTask: {
      title: "Sociolinguistic Register Shift Performance",
      prompt: "Record a 3-minute spoken performance delivering an identical critical update across two sharply distinct registers—formal institutional governance vs. candid leadership coaching.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c1-module-5",
    order: 5,
    title: "Complex Systems, Public Policy & Institutional Reform",
    mission: "Analyze macroeconomic trends, critique legislative frameworks, formulate multidimensional public policies, and present reform blueprints to legislative committees.",
    competencyIds: [
      "EN.C1.SPEAK.POLICY_FORMULATION",
      "EN.C1.GRAMMAR.ADVANCED_PARTICIPIAL_CLAUSES",
      "EN.C1.VOCAB.MACROECONOMICS_POLICY",
      "EN.C1.LISTEN.PARLIAMENTARY_HEARINGS",
      "EN.C1.WRIT.POLICY_WHITE_PAPER",
    ],
    vocabulary: ["fiscal austerity", "macroeconomic", "statutory", "infrastructure deficit", "sovereign debt", "monetary policy", "deregulation", "social safety net", "systemic inertia", "paradigm shift"],
    grammarStructures: [
      "Having examined the fiscal constraints imposed by the deficit, the commission proposed comprehensive structural reforms.",
      "Recognizing the systemic inertia embedded within municipal governance, the legislature enacted sweeping oversight measures.",
      "Not only does the current taxation structure stifle innovation, but it also exacerbates wealth inequality.",
      "Implemented judiciously, targeted subsidies can catalyze renewable energy adoption without destabilizing consumer prices.",
    ],
    grammarSection: {
      conceptTitle: "Advanced Participial Clauses (Past, Present & Perfect Participles as Clause Reducers)",
      formula: "Condition: [Past Participle], [Main Clause] | Cause/Time: [Having + Past Participle], [Main Clause] | Simultaneous: [Present Participle (Verb-ing)], [Main Clause]",
      explanation: "Participial clauses streamline dense institutional discourse by condensing adverbial clauses into crisp introductory or trailing phrases ('Implemented judiciously, regulatory subsidies catalyze market growth'; 'Having audited public expenditures, the oversight panel recommended restructuring').",
      forms: {
        affirmative: "Having analyzed the macroeconomic volatility across emerging markets, the central bank adjusted interest rate guidance.",
        negative: "Failing to account for demographic shifts, the initial social security reform failed to achieve bipartisan consensus.",
        question: "Confronted with systemic inflationary pressures, how can fiscal authorities stimulate employment without escalating debt?",
      },
      l1TransferTip: "Ensure the subject of the participial phrase matches the grammatical subject of the main clause to avoid dangling participles (*'Having analyzed the budget, the taxes were increased'* ❌ → 'Having analyzed the budget, the committee increased taxes' ✅).",
      examples: [
        "Implemented across metropolitan transit systems, electric bus fleets significantly diminish urban carbon footprints.",
        "Recognizing the urgent need for pedagogical modernization, the ministry restructured the national curriculum.",
        "Having stabilized the sovereign currency, economic planners turned their focus toward industrial diversification.",
      ],
    },
    phoneticTargets: ["Extended rhetorical momentum across multi-tiered participial clauses", "Legislative cadence and assertive closing emphasis"],
    spokenPrompts: [
      "Present a comprehensive legislative policy proposal reforming national renewable energy infrastructure or higher education funding.",
      "Testify before a simulated congressional committee defending an institutional tax reform model.",
    ],
    createApplyTask: {
      title: "Congressional Committee Policy Defense",
      prompt: "Record a 3-minute legislative testimony outlining a bold public policy reform, detailing macroeconomic justifications, anticipating legislative counter-proposals, and advocating for statutory adoption.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c1-module-6",
    order: 6,
    title: "Executive Leadership, Boardroom Rhetoric & Stakeholder Stewardship",
    mission: "Deliver authoritative shareholder addresses, articulate long-term corporate governance visions, manage hostile investor inquiries, and inspire executive alignment.",
    competencyIds: [
      "EN.C1.SPEAK.EXECUTIVE_LEADERSHIP",
      "EN.C1.PRAG.BOARDROOM_STEWARDSHIP",
      "EN.C1.VOCAB.CORPORATE_GOVERNANCE",
      "EN.C1.LISTEN.INVESTOR_EARNINGS_CALL",
      "EN.C1.SYNTHESIS.STRATEGIC_VISION",
    ],
    vocabulary: ["stewardship", "fiduciary governance", "shareholder equity", "acquisitive growth", "organic expansion", "value creation", "transparency", "strategic pivot", "capital allocation", "visionary"],
    grammarStructures: [
      "Our fiduciary duty demands that we allocate capital with uncompromising discipline and long-term foresight.",
      "While market volatility has created near-term headwinds, our foundational fundamentals remain resilient and unmatched.",
      "It is our unwavering conviction that ethical stewardship and superior enterprise value creation are inextricably linked.",
      "Let me be unequivocally clear: we are committed to delivering sustainable profitability across all global divisions.",
    ],
    grammarSection: {
      conceptTitle: "Syntactic Parallelism & Balanced Periodic Cadence in Executive Keynotes",
      formula: "Parallel Antithesis: It is not merely [Noun Phrase A], but [Noun Phrase B] that [Main Assertive Predicate]",
      explanation: "Executive authority is projected through rhythmic syntactic parallelism—repeating matching grammatical structures across clauses to reinforce vision, inspire stakeholder confidence, and establish unshakeable institutional ethos.",
      forms: {
        affirmative: "It is our unwavering conviction that sustainable value creation and ethical stewardship are inextricably linked.",
        negative: "Our strategic objective is not merely to withstand macroeconomic turbulence, but to redefine industry standards.",
        question: "How can enterprise leadership balance short-term shareholder expectations with transformative, ten-year innovation roadmaps?",
      },
      l1TransferTip: "Maintain exact grammatical symmetry across parallel elements: if the first element begins with a gerund phrase, the contrasting element must also use a gerund phrase (*'not by reacting... but to innovate'* ❌ → 'not by reacting... but by innovating' ✅).",
      examples: [
        "We measure our legacy not by quarterly profit margins alone, but by the enduring societal impact of our technologies.",
        "Let me be unequivocally clear: our commitment to research and human development remains absolute and non-negotiable.",
        "Through discipline in capital allocation and agility in operational execution, our enterprise has established industry leadership.",
      ],
    },
    phoneticTargets: ["Authoritative resonance, deliberate measured tempo, and commanding executive timbre"],
    spokenPrompts: [
      "Deliver an annual shareholder keynote speech presenting transformative strategic growth.",
      "Field rigorous, hostile questions from financial analysts during an earnings conference simulation.",
    ],
    createApplyTask: {
      title: "Annual Shareholder Address & Strategic Roadmap",
      prompt: "Record a 3-minute executive address to institutional investors, outlining corporate governance priorities, financial performance drivers, and a compelling ten-year strategic vision.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c1-module-7",
    order: 7,
    title: "Literary Discourse, Cultural Semiotics & Rhetorical Irony",
    mission: "Analyze classical and contemporary literary works, deconstruct cultural semiotics and symbolism, evaluate narrative craft, and deliver literary critiques with aesthetic refinement.",
    competencyIds: [
      "EN.C1.LIT.CRITICAL_ANALYSIS",
      "EN.C1.VOCAB.AESTHETIC_SEMIOTICS",
      "EN.C1.READ.LITERARY_HERMENEUTICS",
      "EN.C1.SPEAK.CULTURAL_COMMENTARY",
      "EN.C1.PHON.LITERARY_RECITATION",
    ],
    vocabulary: ["allegory", "semiotics", "catharsis", "bildungsroman", "dissonance", "verisimilitude", "motif", "epiphany", "poignant", "sublime"],
    grammarStructures: [
      "The protagonist's inner turmoil serves as an enduring allegory for the moral disillusionment of the post-war generation.",
      "Through a masterclass in narrative dissonance, the author juxtaposes pastoral tranquility with industrial decay.",
      "Rarely in modern literature does one encounter such an exquisite fusion of poetic prose and psychological realism.",
      "The motif of the recurring mirage functions not merely as ornamentation, but as the thematic crux of the novel.",
    ],
    grammarSection: {
      conceptTitle: "Fronting & Stylistic Transposition ('Rarely in modern literature...', 'Through X, the author achieves Y')",
      formula: "[Prepositional / Adverbial Modifier Fronted], + [Inverted Verb / Transposed Subject] + [Elaborated Literary Thesis]",
      explanation: "Stylistic fronting shifts adverbial prepositional phrases or evaluative modifiers to sentence-initial position. In literary critique and cultural semiotics, this frames the aesthetic perspective before delivering the interpretive conclusion.",
      forms: {
        affirmative: "Central to the protagonist's tragic arc is the irreconcilable conflict between individual ambition and societal duty.",
        negative: "At no point in the narrative does the author offer simplistic moral resolution or didactic sentimentality.",
        question: "To what extent does the recurring motif of linguistic fragmentation mirror the socio-political collapse of the era?",
      },
      l1TransferTip: "In literary analysis, fronting with inversion ('Central to the narrative is...') prevents repetitive Subject-Verb-Object monotony and mirrors high-order academic prose.",
      examples: [
        "Through an exquisite juxtaposition of baroque imagery and stark minimalism, the poet captures the sublime.",
        "Nowhere is the tension between ancestral memory and urban modernity more acutely articulated than in the closing chapter.",
        "The recurring metaphor of the mirror functions not merely as ornamentation, but as the epistemic foundation of the novel.",
      ],
    },
    phoneticTargets: ["Nuanced prosody in literary recitation, expressive cadence, and heightened aesthetic emphasis"],
    spokenPrompts: [
      "Deliver a 3-minute literary critique deconstructing the symbolism and narrative architecture of a major work of world literature.",
      "Analyze the cultural semiotics of a contemporary film or theatrical masterpiece.",
    ],
    createApplyTask: {
      title: "Literary & Cultural Hermeneutics Critique",
      prompt: "Record a 2.5-minute literary essay presentation exploring the thematic motifs, symbolic architecture, and sociopolitical commentary of a masterpiece of literature or art.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-c1-module-8",
    order: 8,
    title: "C1 Capstone: Executive English Thesis & Spoken Master Defense",
    mission: "Demonstrate supreme C1 mastery: effortless fluency, spontaneous intellectual agility, nuanced register control, and persuasive authority across all discourse domains.",
    competencyIds: [
      "EN.C1.CAPSTONE.SUPREME_MASTERY",
      "EN.C1.SPEAK.SPONTANEOUS_FLUENCY",
      "EN.C1.PHON.NATIVE_LIKE_PROSODY",
      "EN.C1.PRAG.PRAGMATIC_PRECISION",
      "EN.C1.SYNTHESIS.SCHOLARLY_EXECUTIVE",
    ],
    vocabulary: [
      "intellectual agility",
      "epistemic authority",
      "supreme fluency",
      "pragmatic precision",
      "aesthetic refinement",
      "masterful eloquence",
      "multidimensional synthesis",
      "unrivaled command",
    ],
    grammarStructures: [
      "Having synthesized theoretical frameworks, executive stewardship, and sociolinguistic nuance throughout this doctoral-level track...",
      "Not only do I command the full expressive repertoire of the English language, but I also shape discourse with effortless precision.",
      "The comprehensive body of evidence assembled across this capstone stands as definitive proof of my C1 advanced mastery.",
      "I am fully prepared to lead academic institutions, global enterprises, and international diplomatic bodies in English.",
    ],
    grammarSection: {
      conceptTitle: "Supreme Syntactic Orchestration & Multidimensional Spoken Synthesis",
      formula: "[Participial Inception], [Inverted Conditional Concession], [Syntactic Parallel Main Assertion], [Subordinate Epistemic Climax]",
      explanation: "C1 Master Defense synthesis represents the pinnacle of communicative agility: seamlessly fusing participial compression, inverted conditionals, epistemic modal stances, and rhythmic parallelism into spontaneous, flawless, authoritative oral presentations.",
      forms: {
        affirmative: "Having integrated scholarly research, executive diplomacy, and sociolinguistic precision, I command English with native-like eloquence.",
        negative: "Never has my communicative resolve faltered when defending complex, controversial theses before expert panels.",
        question: "How will you continue to leverage this supreme linguistic agility to shape international discourse and global leadership?",
      },
      l1TransferTip: "Celebrate your Dominican and Caribbean linguistic heritage while demonstrating total, unrestricted mastery over international English grammar, phonetics, and pragmatic cadence.",
      examples: [
        "Having defended this thesis across multidisciplinary domains, I stand fully equipped for global scholarly and institutional leadership.",
        "Were the global academic community to embrace multi-dialectal linguistic paradigms, educational equity would advance exponentially.",
        "What defines supreme communicative mastery is not accent erasure, but the uncompromised power to persuade, inspire, and create.",
      ],
    },
    phoneticTargets: ["Impeccable prosody, natural native-like rhythm, complex stress assignment, and effortless acoustic clarity"],
    spokenPrompts: [
      "Deliver your 3.5-minute C1 Master Spoken Defense synthesizing your scholarly, executive, and linguistic achievements.",
      "Defend your thesis against a multi-round panel of cross-examining expert AI interlocutors.",
    ],
    createApplyTask: {
      title: "C1 Master Thesis Spoken Defense & Epistemic Portfolio",
      prompt: "Record your complete C1 Master Thesis Spoken Defense demonstrating supreme intellectual agility, academic rigor, executive presence, and near-native fluency in English.",
      stage: "CREATE_APPLY",
    },
  },
];
