import type { GrammarSectionData } from "@lurexa/types";

export interface B1ModuleData {
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

export const B1_MODULES_1_TO_8: B1ModuleData[] = [
  {
    id: "english-b1-module-1",
    order: 1,
    title: "Experiences That Shape Us: Connected Narration",
    mission: "Narrate connected personal experiences, distinguish background context from main actions using past continuous and past simple, and describe why events mattered.",
    competencyIds: [
      "EN.B1.SPEAK.NARRATE_EXPERIENCES",
      "EN.B1.GRAMMAR.PAST_CONTINUOUS_SIMPLE",
      "EN.B1.VOCAB.EMOTION_REACTION",
      "EN.B1.PHON.INTONATION_NARRATIVE",
      "EN.B1.LISTEN.EXTENDED_NARRATIVE",
    ],
    vocabulary: ["meanwhile", "suddenly", "significant", "unexpected", "memorable", "turning point", "gratitude", "overwhelmed", "in the long run", "reflect"],
    grammarStructures: [
      "I was working on the project when suddenly...",
      "While we were discussing the proposal, the manager arrived.",
      "The experience taught me that persistence is essential.",
      "Not only was it challenging, but it also helped me grow.",
    ],
    grammarSection: {
      conceptTitle: "Past Continuous & Past Simple with 'While' and 'When' for Interrupted Narratives",
      formula: "[Subject] + [was/were + Verb-ing] (Background) + [when / while] + [Subject] + [Past Simple] (Punctual Event)",
      explanation: "Use the Past Continuous (was/were + verb-ing) to establish the ongoing background atmosphere or action in progress. Use the Past Simple to introduce the sudden, decisive event that interrupted or intersected the ongoing activity. 'While' typically precedes the continuous action, whereas 'when' precedes the interrupting event.",
      forms: {
        affirmative: "While we were preparing the presentation, the power suddenly went out in the building.",
        negative: "I wasn't expecting any interruptions while I was finishing the quarterly report.",
        question: "What were you doing when you first heard the unexpected announcement?",
      },
      l1TransferTip: "Spanish speakers often use the preterite for both actions (*'Yo trabajaba cuando él llegó'* vs. *'Yo trabajé cuando él llegó'*). In English, always distinguish the ongoing background action ('was working') from the punctual event ('arrived').",
      examples: [
        "I was driving home from Santiago when the storm began.",
        "While they were discussing the budget, we noticed an error in the calculation.",
        "She was studying in her room when her brother knocked on the door.",
      ],
    },
    phoneticTargets: ["Narrative pitch contours (rise-fall for completed thoughts, rise for continuation)", "Weak forms of auxiliary 'was' /wəz/ and 'were' /wə/"],
    spokenPrompts: [
      "Describe a pivotal moment in your life or career that changed your perspective.",
      "Narrate a challenging situation you handled while multitasking or under pressure.",
    ],
    createApplyTask: {
      title: "My Transformative Experience Podcast",
      prompt: "Record a 90-second personal narrative detailing a meaningful challenge you faced, how you responded, and why it shaped who you are today.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b1-module-2",
    order: 2,
    title: "Relationships, Nuance & Conversational Repair",
    mission: "Clarify misunderstandings, paraphrase complex ideas, give constructive advice without taking over, and negotiate sensitive communication choices.",
    competencyIds: [
      "EN.B1.SPEAK.CLARIFY_PARAPHRASE",
      "EN.B1.SPEAK.GIVE_TACTFUL_ADVICE",
      "EN.B1.VOCAB.RELATIONSHIPS_COMMUNICATION",
      "EN.B1.GRAMMAR.MODALS_DEDUCTION",
      "EN.B1.PRAG.POLITE_DISAGREEMENT",
    ],
    vocabulary: ["misunderstanding", "perspective", "constructive", "empathy", "compromise", "clarification", "diplomatic", "standpoint", "rephrase", "mutual respect"],
    grammarStructures: [
      "If I understand you correctly, what you're saying is...",
      "Have you considered approaching it from another angle?",
      "You might want to check the details before making a final decision.",
      "I see your point; however, we also need to consider...",
    ],
    grammarSection: {
      conceptTitle: "Modals of Deduction in the Present ('must be', 'can't be', 'might/could be')",
      formula: "Certainty: [Subject] + [must be / have] | Impossibility: [Subject] + [can't be] | Possibility: [Subject] + [might / could be]",
      explanation: "Use present modals of deduction to make logical evaluations based on available clues: 'must' indicates 95%+ certainty ('She has been in meetings all morning; she must be exhausted'); 'can't' indicates logical impossibility ('That can't be Carlos because he is currently in Madrid'); 'might / could' indicates 50% possibility.",
      forms: {
        affirmative: "They haven't answered our emails yet; they must be traveling.",
        negative: "That price can't be right; it is far too low for a brand-new model.",
        question: "Could it be a technical glitch in the system, or is it user error?",
      },
      l1TransferTip: "Spanish uses 'debe de ser' or 'no puede ser'. In English, never say *'it no can be'* ❌. Always use 'it can't be' for negative deductions.",
      examples: [
        "You've been preparing for this interview for three weeks; you must feel confident.",
        "He can't be the manager; he only joined the company yesterday.",
        "We might want to double-check the client's schedule before booking the room.",
      ],
    },
    phoneticTargets: ["Softening intonation in polite suggestions", "Stress on content words in clarification checks ('Did you mean Tuesday or Wednesday?')"],
    spokenPrompts: [
      "Roleplay tactfully de-escalating a scheduling misunderstanding between team members.",
      "Offer empathetic, actionable advice to a peer facing interpersonal friction at work or school.",
    ],
    createApplyTask: {
      title: "Diplomatic Communication Simulation",
      prompt: "Record a 2-minute dialogue simulation where you clarify an ambiguous request, state your perspective with polite justification, and propose a mutually beneficial compromise.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b1-module-3",
    order: 3,
    title: "Work, Professional Aspirations & Negotiation",
    mission: "Communicate professional accomplishments, discuss career trajectories, use conditionals to evaluate hypothetical workplace scenarios, and negotiate project terms.",
    competencyIds: [
      "EN.B1.SPEAK.PROFESSIONAL_PROFILE",
      "EN.B1.GRAMMAR.CONDITIONALS_FIRST_SECOND",
      "EN.B1.VOCAB.CAREER_LEADERSHIP",
      "EN.B1.LISTEN.WORKPLACE_DISCUSSIONS",
      "EN.B1.WRIT.PROPOSAL_UPDATE",
    ],
    vocabulary: ["accomplishment", "milestone", "strategic", "initiative", "stakeholder", "feasibility", "bandwidth", "benchmark", "professional growth", "contingency"],
    grammarStructures: [
      "If we allocate more resources, we will finish ahead of schedule.",
      "If I had the opportunity to lead the initiative, I would focus on...",
      "Over the past three years, I have successfully managed...",
      "Would it be feasible to extend the review window by two days?",
    ],
    grammarSection: {
      conceptTitle: "Second Conditional for Hypothetical Scenarios & Present Perfect for Accomplishments",
      formula: "Hypothetical: If + [Subject] + [Past Simple], [Subject] + [would / could] + [Base Verb] | Accomplishments: [Subject] + [have/has + Past Participle]",
      explanation: "Use the Second Conditional to pitch hypothetical ideas, explore what-if scenarios, and negotiate politely without sounding aggressive ('If we increased our bandwidth, we could double output'). Use the Present Perfect with 'for', 'since', and 'over the past' to highlight ongoing professional accomplishments connected to your current career.",
      forms: {
        affirmative: "If I were in charge of the department, I would modernize our digital workflows.",
        negative: "We wouldn't consider expanding our team if client demand weren't increasing so rapidly.",
        question: "What would you prioritize if you were assigned to lead this new initiative?",
      },
      l1TransferTip: "In the 'if' clause, English requires the Past Simple ('If I had time...'), where Spanish uses the Subjunctive ('Si tuviera tiempo...'). Do not put 'would' inside the 'if' clause (*'If I would have'* ❌ → 'If I had' ✅).",
      examples: [
        "Over the past two years, I have led three major software deployment cycles.",
        "If we had a larger budget, we could hire two additional data analysts.",
        "Would it be possible to schedule a preliminary negotiation meeting on Thursday?",
      ],
    },
    phoneticTargets: ["Contractions in conditionals ('If we'd', 'I'd rather')", "Sentence rhythm in professional presentations"],
    spokenPrompts: [
      "Deliver a 2-minute elevator pitch explaining your top career achievement and your vision for the next two years.",
      "Negotiate project timelines with a client or team manager providing reasoned justifications.",
    ],
    createApplyTask: {
      title: "Strategic Career & Project Pitch",
      prompt: "Record a comprehensive professional overview highlighting your background, key problem-solving strengths, and a conditional scenario plan for an upcoming goal.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b1-module-4",
    order: 4,
    title: "Media Literacy, Claims & Evidence-Based Discourse",
    mission: "Summarize complex accessible articles and audio reports, distinguish factual evidence from subjective opinion, and present a reasoned stance in discussions.",
    competencyIds: [
      "EN.B1.SPEAK.PRESENT_ARGUMENT",
      "EN.B1.LISTEN.MEDIA_SUMMARIES",
      "EN.B1.VOCAB.MEDIA_EVALUATION",
      "EN.B1.GRAMMAR.REPORTING_VERBS",
      "EN.B1.READ.DISTINGUISH_FACT_OPINION",
    ],
    vocabulary: ["credible source", "statistical evidence", "bias", "verify", "subjective", "objective", "according to", "claim", "correlation", "inconclusive"],
    grammarStructures: [
      "The report claims that [statement], but evidence suggests...",
      "According to recent findings, there is a clear correlation between...",
      "While some argue that [view], others emphasize that...",
      "In summary, the data clearly supports the conclusion that...",
    ],
    grammarSection: {
      conceptTitle: "Reporting Verbs (claim, argue, suggest, confirm) & Attributive Clauses",
      formula: "[Author / Source] + [claims / argues / suggests / confirms that] + [Noun Clause] | According to + [Source], + [Statement]",
      explanation: "To present evidence objectively without stating everything as personal opinion, deploy nuanced reporting verbs: 'claim' distances you from unverified assertions; 'suggest' introduces tentative findings; 'argue' frames an intellectual position; and 'confirm' denotes empirical verification.",
      forms: {
        affirmative: "The researchers suggest that continuous language immersion accelerates fluency.",
        negative: "The study does not claim that technology replaces human classroom instruction.",
        question: "Does the latest statistical report confirm the correlation between reading habits and vocabulary growth?",
      },
      l1TransferTip: "Avoid overusing 'said that' for every citation. Choose descriptive reporting verbs to signal whether the author is proving a fact ('demonstrated that') or merely voicing a claim ('claimed that').",
      examples: [
        "According to recent educational data, daily interactive practice improves spoken confidence.",
        "While several commentators argue for rapid deregulation, economists advise caution.",
        "The journalist confirmed that the source had verified the documentary evidence.",
      ],
    },
    phoneticTargets: ["Contrastive stress in argumentation ('The issue isn't the cost, it's the quality')", "Falling tone for authoritative factual conclusions"],
    spokenPrompts: [
      "Analyze a controversial public policy or technology trend, citing pros, cons, and verified facts.",
      "Summarize the key takeaway of an informative article and defend your personal opinion.",
    ],
    createApplyTask: {
      title: "Critical Fact-Check & Opinion Brief",
      prompt: "Record a 90-second audio brief summarizing a trending topic, distinguishing between verified evidence and unsupported claims, and concluding with your reasoned evaluation.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b1-module-5",
    order: 5,
    title: "Travel, Culture & Intercultural Perspectives",
    mission: "Reflect on cultural norms, describe intercultural encounters, compare international customs respectfully, and navigate unexpected travel complexities.",
    competencyIds: [
      "EN.B1.SPEAK.INTERCULTURAL_EXCHANGE",
      "EN.B1.VOCAB.CULTURAL_TRADITIONS",
      "EN.B1.GRAMMAR.COMPARATIVE_STRUCTURES",
      "EN.B1.LISTEN.INTERNATIONAL_ACCENTS",
      "EN.B1.PRAG.CULTURAL_SENSITIVITY",
    ],
    vocabulary: ["hospitality", "customary", "tradition", "etiquette", "perception", "heritage", "intercultural", "adaptation", "festivity", "diversity"],
    grammarStructures: [
      "In contrast to Dominican traditions, in other countries people tend to...",
      "What surprised me most about the local customs was...",
      "It is considered polite to [action] when visiting someone's home.",
      "The longer I spent in that environment, the more I appreciated...",
    ],
    grammarSection: {
      conceptTitle: "Proportional Comparatives ('The more..., the more...') & Impersonal Passive Structures",
      formula: "The + [Comparative Adj/Adv], the + [Comparative Adj/Adv] | It is considered + [Adjective (polite/customary)] + to [Base Verb]",
      explanation: "Use double comparative structures to express proportional relationships ('The more you travel, the broader your perspective becomes'). Use impersonal evaluative structures ('It is considered polite to greet everyone') to discuss etiquette without sounding overly personal.",
      forms: {
        affirmative: "The more I interacted with local residents, the more comfortable I felt communicating in English.",
        negative: "It is not considered customary to arrive unannounced in certain formal cultures.",
        question: "Is it considered acceptable to ask direct questions about personal plans during a first meeting?",
      },
      l1TransferTip: "Spanish uses 'mientras más... más...'. In English, construct parallel balanced clauses with 'The + comparative... the + comparative...' ('The earlier we leave, the better the traffic will be').",
      examples: [
        "The more diverse the team is, the more creative their problem-solving approaches become.",
        "In many countries, it is considered essential to confirm meeting times at least 24 hours in advance.",
        "What struck me most was how warmly the community welcomed foreign visitors.",
      ],
    },
    phoneticTargets: ["Rhythm adaptation to international English varieties", "Clear vowel length distinctions in descriptive travel vocabulary"],
    spokenPrompts: [
      "Compare a Dominican cultural tradition with an international celebration you have experienced or researched.",
      "Describe how you adapted your behavior during an unexpected intercultural encounter.",
    ],
    createApplyTask: {
      title: "Intercultural Exchange & Travel Guide",
      prompt: "Record an intercultural cultural guide highlighting 3 key cultural insights every international visitor should understand before traveling to your region.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b1-module-6",
    order: 6,
    title: "Health, Wellness, Lifestyle & Personal Balance",
    mission: "Discuss mental and physical well-being, evaluate modern lifestyle habits, formulate balanced advice using modals of necessity and obligation, and explain recovery protocols.",
    competencyIds: [
      "EN.B1.SPEAK.LIFESTYLE_WELLNESS",
      "EN.B1.GRAMMAR.MODALS_OBLIGATION_ADVICE",
      "EN.B1.VOCAB.WELLBEING_NUTRITION",
      "EN.B1.LISTEN.HEALTH_DISCUSSIONS",
      "EN.B1.WRIT.WELLNESS_PLAN",
    ],
    vocabulary: ["burnout", "mindfulness", "endurance", "nutrition", "preventative care", "rehabilitation", "work-life balance", "sedentary", "holistic", "sustainability"],
    grammarStructures: [
      "You ought to prioritize adequate sleep if you want to avoid burnout.",
      "It is advisable to incorporate moderate physical activity daily.",
      "I have managed to reduce stress by implementing...",
      "Unless we take preventative measures, long-term health risks increase.",
    ],
    grammarSection: {
      conceptTitle: "Advanced Modals of Advice ('ought to', 'had better', 'be supposed to') & Conditional 'Unless'",
      formula: "[Subject] + [ought to / had better ('d better) / be supposed to] + [Base Verb] | Unless + [Present Simple], [Subject] + [will / can + Verb]",
      explanation: "'Ought to' expresses moral or strong logical advice; 'had better' conveys an urgent warning with potential negative consequences ('You'd better sleep early or you will be exhausted tomorrow'); 'unless' functions as 'if not' (e.g. 'Unless you rest, your recovery will take twice as long').",
      forms: {
        affirmative: "You ought to schedule regular mental breaks throughout the workday.",
        negative: "You had better not skip meals when training for an endurance race.",
        question: "Are we supposed to complete the health assessment before or after our workout?",
      },
      l1TransferTip: "Remember that 'had better' looks like past tense, but always refers to immediate or future actions. 'Unless' already means 'if... not', so do not use a double negative after it (*'Unless you don't rest'* ❌ → 'Unless you rest' ✅).",
      examples: [
        "You had better consult a nutritionist before starting an extreme fasting diet.",
        "Unless companies actively protect employee work-life balance, burnout rates will climb.",
        "Employees are supposed to log their ergonomics requests through the internal portal.",
      ],
    },
    phoneticTargets: ["Intelligible reduction of 'ought to' -> /ɔːtə/, 'supposed to' -> /səˈpoʊstə/", "Breath grouping and pausing in informative health explanations"],
    spokenPrompts: [
      "Explain your daily philosophy for maintaining physical vitality and mental focus.",
      "Provide a structured wellness roadmap for someone dealing with chronic work-related fatigue.",
    ],
    createApplyTask: {
      title: "Holistic Health & Routine Blueprint",
      prompt: "Record a comprehensive wellness reflection detailing your current lifestyle habits, areas for improvement, and a concrete action plan for sustainable well-being.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b1-module-7",
    order: 7,
    title: "Community, Civic Engagement & Problem Solving",
    mission: "Identify local community challenges, propose collaborative solutions, participate in civic discussions, and advocate for positive social initiatives.",
    competencyIds: [
      "EN.B1.SPEAK.COMMUNITY_ADVOCACY",
      "EN.B1.GRAMMAR.PASSIVE_VOICE_PRESENT_PAST",
      "EN.B1.VOCAB.CIVIC_ENVIRONMENTAL",
      "EN.B1.LISTEN.COMMUNITY_FORUMS",
      "EN.B1.WRIT.COMMUNITY_PROPOSAL",
    ],
    vocabulary: ["infrastructure", "sustainable development", "civic duty", "advocate", "community initiative", "renewable energy", "collaborative effort", "urban renewal", "volunteer", "empowerment"],
    grammarStructures: [
      "The public transit system was recently upgraded to reduce congestion.",
      "New environmental policies are being implemented across the municipality.",
      "If community members collaborate, significant progress can be achieved.",
      "We propose that the local authorities invest in...",
    ],
    grammarSection: {
      conceptTitle: "The Passive Voice in Policy & Urban Development (Present Simple, Past Simple & Continuous)",
      formula: "[Patient / Object as Subject] + [Verb 'to be' (is/are/was/were/is being)] + [Past Participle] + (by [Agent])",
      explanation: "The Passive Voice places emphasis on the action, recipient, or policy result rather than the specific individual performing it. It is standard in news reporting, civic proposals, and institutional planning (e.g. 'A new recycling center was opened last month').",
      forms: {
        affirmative: "Solar lighting is being installed along major municipal avenues.",
        negative: "The proposed rezoning plan was not approved by the neighborhood council.",
        question: "Has the public transit infrastructure been upgraded in your district recently?",
      },
      l1TransferTip: "Spanish often uses reflexive passive forms (*'Se construyó un puente'*). In English, construct true passive sentences with 'was/were + past participle' ('A bridge was constructed').",
      examples: [
        "Over five thousand trees were planted during the community reforestation campaign.",
        "Crucial environmental regulations are being reviewed by local government representatives.",
        "Significant civic improvements can be accomplished when citizens participate actively.",
      ],
    },
    phoneticTargets: ["Clear distinction between active and passive verb phrasing", "Emphasis and rhetorical pauses in persuasive advocacy speech"],
    spokenPrompts: [
      "Advocate for a community initiative that would improve local education, environmental sustainability, or public safety.",
      "Analyze a recent civic improvement in your municipality and explain its benefits.",
    ],
    createApplyTask: {
      title: "Community Action Initiative Proposal",
      prompt: "Record a 2-minute persuasive civic proposal identifying a specific community issue, presenting two evidence-backed solutions, and calling your peers to collective action.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-b1-module-8",
    order: 8,
    title: "B1 Capstone: Autonomous Independent Communication",
    mission: "Demonstrate fully autonomous B1 communicative command across complex personal narratives, professional negotiations, media critique, and civic collaboration.",
    competencyIds: [
      "EN.B1.CAPSTONE.INDEPENDENT_DISCOURSE",
      "EN.B1.SPEAK.SUSTAINED_DISCOURSE",
      "EN.B1.PHON.CONNECTED_SPEECH_FLUENCY",
      "EN.B1.PRAG.NUANCED_INTERACTION",
      "EN.B1.SYNTHESIS.INTEGRATED_COMMUNICATION",
    ],
    vocabulary: [
      "autonomously",
      "comprehensive synthesis",
      "persuasive discourse",
      "articulate",
      "nuanced perspective",
      "strategic resolution",
      "unprecedented",
      "in retrospect",
    ],
    grammarStructures: [
      "Having navigated both personal and professional challenges, I can now express...",
      "Although unexpected obstacles arose, we adapted our strategy accordingly.",
      "The synthesis of these experiences demonstrates my readiness for advanced communication.",
      "I am confident in my capacity to engage in sustained, fluent discussions in English.",
    ],
    grammarSection: {
      conceptTitle: "Discourse Connectors & Complex Subordination for Sustained Argumentation",
      formula: "[Concession: Although / Despite the fact that] + [Clause 1], [Main Proposition] + [Consequence: as a result / consequently] + [Clause 2]",
      explanation: "Autonomous B1 communication relies on multi-clausal subordination: pairing concession markers ('Although we faced initial delays...'), causal connectors ('Due to thorough preparation...'), and transition signals ('Furthermore', 'In retrospect') to sustain organized, multi-paragraph spoken discourse.",
      forms: {
        affirmative: "Although unexpected obstacles arose during the rollout, our team adapted our strategy and completed all deliverables.",
        negative: "Despite facing language barriers in the beginning, I never avoided participating in international meetings.",
        question: "How have your communicative strategies evolved as a result of overcoming unexpected conversational breakdowns?",
      },
      l1TransferTip: "Do not string simple sentences together with only 'and' or 'so'. Use sophisticated contrastive connectors like 'Whereas', 'On the other hand', and 'Consequently' to demonstrate independent B1 spoken maturity.",
      examples: [
        "In retrospect, learning to negotiate complex agreements in English was the turning point in my professional career.",
        "Although the project timeline was compressed, we delivered a comprehensive synthesis to all stakeholders.",
        "I am fully prepared to engage in spontaneous, nuanced discussions across diverse cultural and business environments.",
      ],
    },
    phoneticTargets: ["Mastery of connected speech, smooth transitions, sentence focus, and natural conversational cadence"],
    spokenPrompts: [
      "Deliver a 3-minute comprehensive capstone defense synthesizing your learning journey and demonstrating B1 spoken fluency.",
      "Participate in a 5-turn AI simulation balancing complex conflict resolution, professional negotiation, and factual reporting.",
    ],
    createApplyTask: {
      title: "B1 Capstone Defense: My Independent English Portfolio",
      prompt: "Record your complete B1 capstone spoken presentation demonstrating your independent ability to narrate, reason, persuade, and collaborate in English.",
      stage: "CREATE_APPLY",
    },
  },
];
