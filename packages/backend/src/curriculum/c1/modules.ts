export interface C1ModuleData {
  id: string;
  order: number;
  title: string;
  mission: string;
  competencyIds: string[];
  vocabulary: string[];
  grammarStructures: string[];
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
