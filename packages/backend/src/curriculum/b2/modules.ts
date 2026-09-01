import type { GrammarSectionData } from "@lurexa/types";

export interface B2ModuleData {
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

export const B2_MODULES_1_TO_8: B2ModuleData[] = [
  {
    id: "english-b2-module-1",
    order: 1,
    title: "High-Stakes Workplace Negotiations & Strategic Pitching",
    mission: "Lead complex commercial negotiations, evaluate concession strategies, express nuanced counter-proposals with diplomatic conditionals, and secure stakeholder alignment.",
    competencyIds: [
      "EN.B2.SPEAK.STRATEGIC_NEGOTIATION",
      "EN.B2.GRAMMAR.MIXED_CONDITIONALS",
      "EN.B2.VOCAB.COMMERCIAL_STRATEGY",
      "EN.B2.PHON.PRAGMATIC_INTONATION",
      "EN.B2.LISTEN.BOARDROOM_DELIBERATION",
    ],
    vocabulary: ["concession", "leverage", "counter-proposal", "alignment", "mitigate", "compromise", "value proposition", "feasibility", "bottom line", "non-negotiable"],
    grammarStructures: [
      "If we hadn't secured the preliminary contract, we wouldn't be in this strong negotiating position today.",
      "Provided that your team guarantees delivery by Q3, we would be prepared to adjust our pricing structure.",
      "Should any unexpected supply chain friction arise, we have established robust contingency protocols.",
      "Under no circumstances can we compromise on our foundational data privacy standards.",
    ],
    grammarSection: {
      conceptTitle: "Mixed Conditionals (Past Cause → Present Result) & Concession Clauses",
      formula: "If + [had + Past Participle] (Past Unreal), [Subject] + [would / could + Base Verb] (Present Result)",
      explanation: "Mixed Conditionals link a counterfactual past event or decision with an ongoing present reality or capability. In strategic negotiation, they demonstrate how past milestones directly create current commercial leverage or how an avoided error protects present operations.",
      forms: {
        affirmative: "If we had not diversified our supplier network last year, we would not be capable of fulfilling this contract today.",
        negative: "If the legal team had not reviewed the compliance clauses, we wouldn't be in such a secure position right now.",
        question: "Where would our market share stand today if we hadn't made that strategic acquisition in 2023?",
      },
      l1TransferTip: "Spanish speakers often use identical subjunctive forms across both clauses (*'Si hubiéramos ganado, estuviéramos bien'*). In English, strictly distinguish the past condition ('had + past participle') from the present result ('would + base verb').",
      examples: [
        "If our team hadn't secured the preliminary agreement, we wouldn't be in this strong negotiating position today.",
        "Provided that your firm guarantees delivery by Q3, we would be prepared to adjust our tier-pricing terms.",
        "Should any unforeseen supply-chain bottlenecks occur, our backup protocols will maintain continuous delivery.",
      ],
    },
    phoneticTargets: ["Inversion emphasis ('Under no circumstances...')", "Nuanced fall-rise tone in diplomatically softened objections"],
    spokenPrompts: [
      "Lead a 2-minute strategic negotiation responding to an aggressive pricing counter-offer.",
      "Deliver an executive project pitch detailing value propositions and risk mitigation frameworks.",
    ],
    createApplyTask: {
      title: "Executive Venture Pitch & Term Sheet Defense",
      prompt: "Record a 2.5-minute executive pitch presenting a strategic commercial agreement, outlining terms, addressing potential client objections, and proposing mutually beneficial concessions.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b2-module-2",
    order: 2,
    title: "Discourse Structuring, Rhetoric & Nuanced Debate",
    mission: "Structure sophisticated arguments with advanced discourse markers, counter opposing views with rhetorical precision, and articulate balanced perspectives.",
    competencyIds: [
      "EN.B2.SPEAK.NUANCED_DEBATE",
      "EN.B2.GRAMMAR.DISCOURSE_MARKERS",
      "EN.B2.VOCAB.RHETORICAL_ARGUMENTATION",
      "EN.B2.PHON.CONTRASTIVE_ACCENTUATION",
      "EN.B2.READ.ACADEMIC_CRITIQUE",
    ],
    vocabulary: ["furthermore", "nonetheless", "notwithstanding", "compelling", "premise", "substantiate", "counter-argument", "fallacy", "paradoxically", "cogent"],
    grammarStructures: [
      "Notwithstanding the initial data, several critical variables have been overlooked.",
      "It is widely contended that [view]; however, closer scrutiny reveals a contrasting reality.",
      "Not only does this approach optimize operational efficiency, but it also fosters sustainable growth.",
      "To put it another way, the fundamental premise of the argument requires reassessment.",
    ],
    grammarSection: {
      conceptTitle: "Negative Inversion for Rhetorical Emphasis ('Not only... but also', 'Under no circumstances', 'Seldom')",
      formula: "[Negative / Restrictive Adverbial] + [Auxiliary Verb (do/does/did/can/have)] + [Subject] + [Main Verb]",
      explanation: "Negative Inversion transposes the auxiliary verb before the subject when a sentence begins with restrictive or negative adverbs ('Not only', 'Rarely', 'Seldom', 'Under no circumstances'). This syntactic device injects high rhetorical authority and dramatic emphasis into executive speeches and formal debates.",
      forms: {
        affirmative: "Not only does this policy optimize capital efficiency, but it also elevates workforce retention.",
        negative: "Under no circumstances can the executive committee authorize unbudgeted capital expenditures.",
        question: "Rarely have we encountered a regulatory proposal that so directly impacts regional supply chains.",
      },
      l1TransferTip: "Spanish expresses emphasis through voice inflection or terminal placement. In English, you must invert the grammatical auxiliary (*'Not only this policy optimizes'* ❌ → 'Not only does this policy optimize' ✅).",
      examples: [
        "Seldom has a technological shift transformed consumer habits so rapidly.",
        "Not only did the pilot project exceed our benchmark targets, but it also reduced onboarding costs by 30%.",
        "Under no circumstances should confidential client telemetry be shared across unencrypted channels.",
      ],
    },
    phoneticTargets: ["Contrastive accentuation across multi-clause sentences", "Cadence control in formal debates"],
    spokenPrompts: [
      "Defend a controversial technological or economic policy against three strong counter-arguments.",
      "Analyze a complex public debate, contrasting both perspectives with objective nuance.",
    ],
    createApplyTask: {
      title: "Oxford-Style Keynote Debate Speech",
      prompt: "Record a 2-minute formal debate address defending your thesis on a modern societal issue, actively refuting opposing claims with verified evidence and persuasive discourse markers.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b2-module-3",
    order: 3,
    title: "Technical, Financial & Analytical Data Synthesis",
    mission: "Synthesize complex quantitative findings, interpret financial trends, deliver clear analytical briefings, and draw actionable strategic conclusions.",
    competencyIds: [
      "EN.B2.SPEAK.DATA_PRESENTATION",
      "EN.B2.GRAMMAR.PASSIVE_REPORTING",
      "EN.B2.VOCAB.QUANTITATIVE_ANALYTICS",
      "EN.B2.LISTEN.FINANCIAL_EARNINGS",
      "EN.B2.WRIT.EXECUTIVE_SUMMARY",
    ],
    vocabulary: ["volatility", "trajectory", "plateau", "correlation", "divergence", "exponential", "profitability margin", "aggregate", "extrapolate", "variance"],
    grammarStructures: [
      "The quarterly earnings are projected to exceed initial forecasts by 14%.",
      "Having analyzed the revenue variance, it is evident that digital channels drove the recovery.",
      "The data suggests a substantial correlation between customer retention and user onboarding speed.",
      "It was widely reported that market conditions had softened prior to the stimulus.",
    ],
    grammarSection: {
      conceptTitle: "Passive Reporting Verbs ('It is estimated that...', 'X is projected to...') & Participle Clauses",
      formula: "Impersonal: It is + [reported / estimated / believed that] + [Clause] | Personal: [Subject] + [is/are projected / expected to] + [Infinitive]",
      explanation: "Passive reporting structures provide epistemic distance when presenting financial projections, statistical market forecasts, and analytical syntheses. Participle clauses ('Having analyzed the dataset, the board concluded...') compress subordinate temporal and causal information into concise executive language.",
      forms: {
        affirmative: "Digital revenue streams are projected to expand by eighteen percent over the coming fiscal cycle.",
        negative: "It cannot be assumed that current macroeconomic headwinds will dissipate within the next quarter.",
        question: "To what extent is consumer demand expected to plateau following the proposed interest rate hike?",
      },
      l1TransferTip: "Spanish uses 'se proyecta que' or 'se estima que'. In English, while 'It is projected that...' is valid, personal passive structures ('Revenue is projected to expand') sound significantly more idiomatic in professional business presentations.",
      examples: [
        "Having evaluated the regional sales variance, the analytics team identified key drivers of churn.",
        "The renewable energy sector is widely reported to be outperforming traditional utilities.",
        "Customer acquisition costs are estimated to decline by twelve percent after system integration.",
      ],
    },
    phoneticTargets: ["Clear rhythmic delivery of complex numeric sequences and percentages", "Downward terminal cadence on analytical conclusions"],
    spokenPrompts: [
      "Present a 2-minute analytical breakdown of a quarterly performance report.",
      "Explain the strategic implications of an unexpected shift in market consumer behavior.",
    ],
    createApplyTask: {
      title: "Quarterly Analytics & Strategy Briefing",
      prompt: "Record a comprehensive analytical briefing interpreting a dataset, explaining key performance drivers, and recommending two data-backed strategic initiatives.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b2-module-4",
    order: 4,
    title: "Intercultural Leadership & Cross-Border Collaboration",
    mission: "Navigate subtle cultural communication styles, manage international matrix teams, foster inclusive leadership, and align cross-border working norms.",
    competencyIds: [
      "EN.B2.SPEAK.CROSS_CULTURAL_LEADERSHIP",
      "EN.B2.VOCAB.ORGANIZATIONAL_DYNAMICS",
      "EN.B2.PRAG.DIPLOMATIC_INCLUSION",
      "EN.B2.LISTEN.GLOBAL_ENGLISH_VARIANTS",
      "EN.B2.WRIT.GLOBAL_POLICY",
    ],
    vocabulary: ["egalitarian", "hierarchical", "high-context", "consensus", "synergy", "multilateral", "psychological safety", "cross-functional", "decentralized", "inclusive"],
    grammarStructures: [
      "In order to foster psychological safety across global teams, leaders must encourage...",
      "Whereas high-context cultures tend to rely on implicit cues, low-context teams prioritize directness.",
      "By establishing shared norms early on, we can avoid cross-cultural friction.",
      "It is imperative that every regional branch feels represented in the decision-making process.",
    ],
    grammarSection: {
      conceptTitle: "Complex Concessive Contrast ('Whereas', 'While', 'Much as') & Prepositional Gerund Clauses",
      formula: "Whereas + [Clause A (Culture/Team 1)], [Clause B (Culture/Team 2)] | By + [Verb-ing], [Subject] + [can + Verb]",
      explanation: "To lead and mediate across international teams without stereotyping or offending, deploy contrastive subordinators ('Whereas high-context environments favor indirect feedback, low-context cultures expect explicit directives'). Use prepositional gerunds ('By establishing clear charters early...') to frame collaborative management actions.",
      forms: {
        affirmative: "Whereas distributed teams rely on asynchronous documentation, collocated teams often prioritize informal huddles.",
        negative: "Leaders cannot cultivate psychological safety without actively validating minority dissenting perspectives.",
        question: "How can cross-functional managers reconcile competing regional priorities while preserving operational speed?",
      },
      l1TransferTip: "Do not confuse 'Whereas' with 'While' as a time marker. 'Whereas' strictly marks structural, balanced contrast between two independent realities.",
      examples: [
        "Whereas some regional hubs operate under hierarchical structures, others maintain decentralized decision-making.",
        "By aligning core performance indicators across continents, our division achieved unprecedented synergy.",
        "It is essential that all team leads communicate quarterly roadmap adjustments with total transparency.",
      ],
    },
    phoneticTargets: ["Accommodating speech rate when collaborating across international teams", "Natural intonation in active listening and confirmation checks"],
    spokenPrompts: [
      "Facilitate an international alignment meeting resolving divergent regional priorities.",
      "Explain your leadership philosophy on building high-trust global teams.",
    ],
    createApplyTask: {
      title: "Global Team Charter & Leadership Address",
      prompt: "Record a 2-minute leadership address establishing communication norms for a distributed international team, reconciling cultural differences with clarity and respect.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b2-module-5",
    order: 5,
    title: "Crisis Management, Risk Mitigation & Incident Response",
    mission: "Communicate calmly and decisively during institutional emergencies, provide transparent risk assessments, and coordinate cross-functional incident mitigation.",
    competencyIds: [
      "EN.B2.SPEAK.CRISIS_COMMUNICATION",
      "EN.B2.GRAMMAR.SUBJUNCTIVE_FORMAL",
      "EN.B2.VOCAB.RISK_MITIGATION",
      "EN.B2.LISTEN.INCIDENT_DEBRIEFS",
      "EN.B2.PRAG.TRANSPARENT_ASSURANCE",
    ],
    vocabulary: ["containment", "vulnerability", "remediation", "transparency", "unforeseen", "escalation protocol", "resilience", "root cause", "liability", "post-mortem"],
    grammarStructures: [
      "We recommend that the emergency response protocol be initiated immediately.",
      "Had our redundancy systems not kicked in, the service disruption would have been widespread.",
      "We are taking immediate, decisive action to ensure that all customer records remain secure.",
      "Our team is conducting a rigorous root cause analysis to prevent any recurrence.",
    ],
    grammarSection: {
      conceptTitle: "The Formal Mandative Subjunctive in Crisis Directives & Inverted Third Conditionals",
      formula: "Mandative: [Subject] + [demand / insist / recommend / require] + that + [Subject] + [Base Verb] | Inverted: Had + [Subject] + [Past Participle], [Subject] + [would have...]",
      explanation: "In institutional crisis management and governance, the mandative subjunctive expresses binding recommendations without modal auxiliaries ('We recommend that the incident commander issue a status bulletin'). Inverted third conditionals ('Had we not established server redundancy...') articulate retrospective risk realities with executive gravitas.",
      forms: {
        affirmative: "The steering committee requires that all security audits be finalized within forty-eight hours.",
        negative: "We insist that no sensitive customer telemetry be transmitted across unencrypted lines.",
        question: "Had the engineering team delayed the patch, how severely would data integrity have been compromised?",
      },
      l1TransferTip: "In English mandative subjunctive, the verb remains strictly in the bare infinitive for all persons, including third-person singular (*'recommends that he is'* ❌ → 'recommends that he be' ✅; *'requires that she signs'* ❌ → 'requires that she sign' ✅).",
      examples: [
        "Management requests that every department head submit an updated risk assessment by noon.",
        "Had our incident response team not reacted instantly, data recovery would have taken days.",
        "It is imperative that all operational logs be preserved for forensic analysis.",
      ],
    },
    phoneticTargets: ["Steady pacing, deliberate pausing, and measured pitch control during crisis communication"],
    spokenPrompts: [
      "Deliver a live press statement addressing an unexpected service outage or product recall.",
      "Conduct an internal post-mortem debrief outlining remediation milestones.",
    ],
    createApplyTask: {
      title: "Executive Emergency Press Briefing",
      prompt: "Record a 90-second emergency press conference briefing addressing an institutional incident, articulating the facts transparently, and reassuring stakeholders with concrete solutions.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b2-module-6",
    order: 6,
    title: "Public Speaking, Rhetorical Framing & Keynote Delivery",
    mission: "Deliver captivating keynote presentations, deploy rhetorical framing techniques (triads, antithesis, storytelling arcs), and inspire professional audiences.",
    competencyIds: [
      "EN.B2.SPEAK.KEYNOTE_PRESENTATION",
      "EN.B2.GRAMMAR.CLEFT_SENTENCES",
      "EN.B2.VOCAB.INSPIRATIONAL_RHETORIC",
      "EN.B2.PHON.VOCAL_DYNAMICS_PROJECTION",
      "EN.B2.SYNTHESIS.ORATORY_PERSUASION",
    ],
    vocabulary: ["visionary", "paradigm shift", "catalyst", "transformation", "enduring", "unprecedented", "imperative", "reimagine", "empower", "legacy"],
    grammarStructures: [
      "What we need today is not merely incremental progress, but a complete reimagining of...",
      "It was through perseverance and collective commitment that our team achieved...",
      "Never before in our industry have we witnessed such a rapid convergence of...",
      "The true measure of our success lies not in our profits, but in the enduring impact we create.",
    ],
    grammarSection: {
      conceptTitle: "Cleft Sentences for Thematic Focus ('What... is...', 'It is... that...') & Rhetorical Antithesis",
      formula: "Wh-Cleft: What + [Clause] + is/was + [Focal Point] | It-Cleft: It is/was + [Focal Element] + that/who + [Clause]",
      explanation: "Cleft sentences split a single clause into two parts to highlight and dramatize the most crucial message in public keynote speaking. Paired with rhetorical antithesis ('not merely X, but transformative Y'), cleft structures command audience attention.",
      forms: {
        affirmative: "What separates visionary organizations from stagnant ones is their relentless willingness to innovate.",
        negative: "It was not the lack of technical resources that stalled the rollout, but the absence of cross-team alignment.",
        question: "What is it about decentralized architecture that inspires such fierce debate among engineers?",
      },
      l1TransferTip: "Spanish speakers often use 'Lo que necesitamos es...' which translates directly to 'What we need is...'. Ensure the verb 'to be' matches the grammatical number of the highlighted complement ('What we require are clear guidelines').",
      examples: [
        "What inspired this entire community was the young founders' unyielding dedication to education.",
        "It was through daily deliberate practice on Lurexa that Maria unlocked her international career.",
        "What we must cultivate above all else is an institutional culture of intellectual curiosity.",
      ],
    },
    phoneticTargets: ["Dynamic vocal projection, pitch range variation, and dramatic rhetorical pauses"],
    spokenPrompts: [
      "Deliver the opening 2 minutes of an industry keynote address inspiring innovation.",
      "Present a compelling personal story illustrating resilience and professional transformation.",
    ],
    createApplyTask: {
      title: "Industry Conference Keynote Address",
      prompt: "Record a 2.5-minute inspirational keynote speech introducing a transformative vision, using cleft sentences, rhetorical triads, and dynamic vocal inflection.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b2-module-7",
    order: 7,
    title: "Media Critique, Scientific Literacy & Fact Defense",
    mission: "Evaluate peer-reviewed articles and journalism, identify logical fallacies and statistical misrepresentations, and defend scientific or policy conclusions.",
    competencyIds: [
      "EN.B2.SPEAK.CRITICAL_DISCOURSE",
      "EN.B2.READ.ACADEMIC_EVALUATION",
      "EN.B2.VOCAB.SCIENTIFIC_METHODOLOGY",
      "EN.B2.GRAMMAR.HEDGING_PROBABILITY",
      "EN.B2.LISTEN.DOCUMENTARY_ANALYSIS",
    ],
    vocabulary: ["peer-reviewed", "methodology", "statistical significance", "reproducibility", "confounding variable", "p-value", "skepticism", "consensus", "empirical", "fallacious"],
    grammarStructures: [
      "The findings strongly indicate that [variable] plays a central role, though further research is warranted.",
      "It could be argued that the sample size was insufficiently representative to justify such broad claims.",
      "To conclude that correlation implies causation in this context is fundamentally fallacious.",
      "All empirical evidence gathered across multiple cohorts supports the established consensus.",
    ],
    grammarSection: {
      conceptTitle: "Academic Hedging & Epistemic Modifiers ('arguably', 'tends to indicate', 'it would appear that')",
      formula: "[Subject] + [tends to indicate / arguably suggests / appears to correlate with] + [Finding] | It could be postulated that + [Clause]",
      explanation: "In scientific literacy and evidence-based critiques, assertions must never be overstated. Epistemic hedging devices ('The data arguably suggests', 'It would appear that', 'tends to indicate') allow researchers and speakers to communicate precision without overclaiming certainty.",
      forms: {
        affirmative: "The longitudinal clinical data arguably demonstrates a statistically significant correlation.",
        negative: "These initial trials do not conclusively establish a causal link between the two variables.",
        question: "To what extent can these preliminary laboratory findings be extrapolated to broader populations?",
      },
      l1TransferTip: "Dominican Spanish often uses categorical statements in casual discussions. In scientific and academic English, avoid stating assumptions as absolute facts; always deploy epistemic hedging to maintain scholarly credibility.",
      examples: [
        "The empirical evidence tends to support the hypothesis, although confounding variables cannot be entirely ruled out.",
        "It would appear that the methodology employed in the secondary study failed to account for sampling bias.",
        "Arguably, the most compelling breakthrough lies in the algorithm's high degree of reproducibility.",
      ],
    },
    phoneticTargets: ["Academic hedging intonation ('This arguably suggests...')", "Clarity in dense technical terminology"],
    spokenPrompts: [
      "Critique a misleading media headline by contrasting it with the actual scientific paper methodology.",
      "Defend the validity of a research paper's conclusions against skepticism.",
    ],
    createApplyTask: {
      title: "Scientific Fact-Check & Methodological Review",
      prompt: "Record a 2-minute critical analysis of a controversial public health or environmental study, evaluating sample methodology, statistical significance, and potential bias.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b2-module-8",
    order: 8,
    title: "B2 Capstone: Autonomous Professional Fluency Defense",
    mission: "Demonstrate complete B2 communicative autonomy across executive negotiation, analytical synthesis, keynote rhetoric, and critical scientific reasoning.",
    competencyIds: [
      "EN.B2.CAPSTONE.PROFESSIONAL_MASTERY",
      "EN.B2.SPEAK.EXTENDED_FLUENCY",
      "EN.B2.PHON.CONNECTED_SPEECH_MASTERY",
      "EN.B2.PRAG.EXECUTIVE_PRESENCE",
      "EN.B2.SYNTHESIS.MULTI_DOMAIN_INTEGRATION",
    ],
    vocabulary: [
      "executive presence",
      "strategic alignment",
      "uncompromised fluency",
      "intellectual rigor",
      "dynamic adaptation",
      "persuasive resonance",
      "holistic synthesis",
      "articulate authority",
    ],
    grammarStructures: [
      "Having navigated multifaceted negotiations and technical analyses throughout this program...",
      "Not only have I developed command over complex syntactical structures, but I also communicate with genuine authority.",
      "The culmination of this evidence proves my readiness for international professional leadership in English.",
      "I am fully prepared to defend complex strategic initiatives before global executive panels.",
    ],
    grammarSection: {
      conceptTitle: "Mastery of Syntactic Integration & Polyphonic Executive Rhetoric",
      formula: "[Participial Phase: Having + Past Participle], [Inversion: Not only + Auxiliary + Subject], [Main Executive Claim]",
      explanation: "B2 Capstone fluency requires the spontaneous orchestration of complex syntactic forms: fronted participial framing, negative inversion, cleft emphasis, and nuanced hedging combined seamlessly into commanding, professional oral defense presentations.",
      forms: {
        affirmative: "Having analyzed international case studies and refined my spoken precision, I communicate with articulate authority.",
        negative: "Under no circumstances should linguistic hesitation prevent leaders from championing transformative ideas.",
        question: "How has your mastery of syntactic nuance enhanced your ability to persuade and lead in global environments?",
      },
      l1TransferTip: "Integrate varied structural registers rather than relying on a single favorite sentence pattern. Moving effortlessly between analytical passives, rhetorical clefts, and persuasive conditionals signals complete B2 readiness.",
      examples: [
        "Having demonstrated mastery across commercial, analytical, and keynote domains, I am prepared for global executive leadership.",
        "What distinguishes this capstone portfolio is the seamless synthesis of quantitative evidence and rhetorical power.",
        "Not only has my fluency expanded, but my confidence in high-stakes English discourse is fully solidified.",
      ],
    },
    phoneticTargets: ["Flawless mastery of connected speech, conversational rhythm, emphatic stress, and executive presence"],
    spokenPrompts: [
      "Deliver your comprehensive 3-minute B2 capstone defense summarizing your professional and communicative mastery.",
      "Engage in an intensive 5-turn multi-stakeholder executive AI simulation.",
    ],
    createApplyTask: {
      title: "B2 Professional Fluency Portfolio & Executive Defense",
      prompt: "Record your complete B2 Capstone Spoken Defense demonstrating your command of advanced professional negotiation, data synthesis, and keynote rhetoric in English.",
      stage: "CREATE_APPLY",
    },
  },
];
