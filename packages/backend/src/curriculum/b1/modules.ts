export interface B1ModuleData {
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
