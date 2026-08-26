export interface B2ModuleData {
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
