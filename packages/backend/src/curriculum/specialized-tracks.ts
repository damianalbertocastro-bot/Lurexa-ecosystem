export interface SpecializedIndustryTrack {
  id: string;
  slug: string;
  title: string;
  titleEs: string;
  description: string;
  targetIndustry: string;
  minimumCefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  estimatedHours: number;
  modules: SpecializedModule[];
}

export interface SpecializedModule {
  id: string;
  order: number;
  title: string;
  mission: string;
  competencyIds: string[];
  vocabulary: string[];
  grammarStructures: string[];
  phoneticTargets: string[];
  spokenPrompts: string[];
  rolePlayScenarios: RolePlayScenario[];
  createApplyTask: {
    title: string;
    prompt: string;
    stage: 'CREATE_APPLY';
  };
}

export interface RolePlayScenario {
  id: string;
  title: string;
  setting: string;
  roles: string[];
  objectives: string[];
  evaluationCriteria: string[];
}

const BPO_CALL_CENTER_TRACK: SpecializedIndustryTrack = {
  id: 'track-bpo-call-center',
  slug: 'bpo-call-center-english-do',
  title: 'Dominican BPO / Call Center English',
  titleEs: 'Inglés para BPO y Call Centers en RD',
  description: 'Specialized track for customer service representatives in Dominican BPOs.',
  targetIndustry: 'BPO',
  minimumCefrLevel: 'A2',
  estimatedHours: 40,
  modules: [
    {
      id: 'bpo-mod-1',
      order: 1,
      title: 'Call Opening & Customer Greeting Protocol',
      mission: 'Master professional call openings that set a positive tone for the interaction.',
      competencyIds: ['EN.A2.SPEAK.CUSTOMER_GREETING', 'EN.A2.VOCAB.BPO_BASICS', 'EN.A2.PRAG.PROFESSIONAL_TONE'],
      vocabulary: ['hold time', 'escalation', 'billing cycle', 'service ticket', 'SLA', 'representative', 'assist', 'inquiry', 'connect', 'support'],
      grammarStructures: ['Thank you for calling [Company]', 'How may I assist you today?', 'Can I have your name, please?'],
      phoneticTargets: [
        'neutralizing Dominican aspiration of /s/ in final positions',
        'clear vowel production for account verification letters',
        'proper stress on company names'
      ],
      spokenPrompts: [
        'Record a professional greeting for a tech support line.',
        'Offer assistance to a customer clearly.',
        'Introduce yourself and your department.'
      ],
      rolePlayScenarios: [
        {
          id: 'bpo-rp-1',
          title: 'Standard Greeting',
          setting: 'Incoming call at a telecommunications BPO.',
          roles: ['Agent', 'Customer'],
          objectives: ['Deliver opening script', 'Acknowledge the customer'],
          evaluationCriteria: ['Clarity of speech', 'Professional warmth', 'Accuracy']
        }
      ],
      createApplyTask: {
        title: 'Custom Greeting',
        prompt: 'Record a personalized opening script for a fictional retail company.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'bpo-mod-2',
      order: 2,
      title: 'Account Verification & Security Scripts',
      mission: 'Securely verify customer identity following strict compliance protocols.',
      competencyIds: ['EN.A2.LISTEN.VERIFY_INFO', 'EN.A2.SPEAK.ASK_SECURITY_Q', 'EN.A2.VOCAB.SECURITY'],
      vocabulary: ['verification', 'security question', 'passcode', 'last four digits', 'social security', 'date of birth', 'zip code', "mother's maiden name", 'authorization', 'PIN'],
      grammarStructures: ['For security purposes, could you confirm...', 'May I have the last four digits of...', 'Could you please verify...'],
      phoneticTargets: [
        'distinct pronunciation of easily confused numbers (e.g., 13 vs 30)',
        'clear spelling of names using phonetic alphabet (Alpha, Bravo...)',
        'maintaining polite intonation while asking repetitive questions'
      ],
      spokenPrompts: [
        'Ask a customer to verify their date of birth and zip code.',
        'Explain why account verification is necessary.',
        'Politely inform a customer they failed the security check.'
      ],
      rolePlayScenarios: [
        {
          id: 'bpo-rp-2',
          title: 'Verifying a Fraud Alert Account',
          setting: 'Bank customer service line.',
          roles: ['Security Agent', 'Frustrated Customer'],
          objectives: ['Verify 3 security questions', 'Maintain a calm demeanor'],
          evaluationCriteria: ['Politeness under pressure', 'Clear enunciation of numbers', 'Protocol adherence']
        }
      ],
      createApplyTask: {
        title: 'Verification Roleplay',
        prompt: 'Record yourself guiding a user through a 3-step security verification process.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'bpo-mod-3',
      order: 3,
      title: 'Troubleshooting & Guided Problem Resolution',
      mission: 'Guide customers step-by-step to resolve technical or billing issues.',
      competencyIds: ['EN.A2.SPEAK.GIVE_INSTRUCTIONS', 'EN.A2.LISTEN.IDENTIFY_ISSUE', 'EN.A2.VOCAB.TROUBLESHOOTING'],
      vocabulary: ['troubleshoot', 'restart', 'unplug', 'error message', 'navigate to', 'refresh', 'billing statement', 'overcharge', 'refund', 'investigate'],
      grammarStructures: ['First, I need you to...', 'Have you tried [verb+ing]...', "Let's see if we can fix this by..."],
      phoneticTargets: [
        'clear production of sequence words (first, then, next)',
        'neutralizing /d/ vs /t/ confusion in past tense verbs (e.g., restarted, checked)',
        'pacing speech for customer comprehension'
      ],
      spokenPrompts: [
        'Guide a customer on how to reset their password.',
        'Explain a simple billing discrepancy clearly.',
        'Ask clarifying questions about an error code.'
      ],
      rolePlayScenarios: [
        {
          id: 'bpo-rp-3',
          title: 'Internet Connection Troubleshooting',
          setting: 'ISP Tech Support.',
          roles: ['Tech Support Agent', 'Customer'],
          objectives: ['Identify the router issue', 'Walk customer through a reboot'],
          evaluationCriteria: ['Clear step-by-step instructions', 'Patience', 'Accurate vocabulary']
        }
      ],
      createApplyTask: {
        title: 'Step-by-Step Guide',
        prompt: 'Record a 60-second audio explaining how to perform a simple troubleshooting step, like clearing browser cache.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'bpo-mod-4',
      order: 4,
      title: 'Escalation, Hold & Transfer Procedures',
      mission: 'Professionally place customers on hold and seamlessly transfer calls to other departments.',
      competencyIds: ['EN.A2.SPEAK.MANAGE_CALL_FLOW', 'EN.A2.PRAG.EMPATHY', 'EN.A2.VOCAB.CALL_ROUTING'],
      vocabulary: ['escalate', 'supervisor', 'transfer', 'brief hold', 'connect you with', 'specialist', 'tier 2', 'bear with me', 'look into this', 'appreciate your patience'],
      grammarStructures: ['May I place you on a brief hold while I...', 'I will transfer you to...', 'Thank you for holding.'],
      phoneticTargets: [
        'polite and empathetic intonation patterns',
        'clear articulation of department names',
        'smooth linking in phrases like "place you on hold"'
      ],
      spokenPrompts: [
        'Ask permission to place a customer on hold to research an issue.',
        'Return to the line and thank the customer for waiting.',
        'Explain that you are transferring the call to a specialist.'
      ],
      rolePlayScenarios: [
        {
          id: 'bpo-rp-4',
          title: 'Escalating an Angry Caller',
          setting: 'Retail customer service.',
          roles: ['Agent', 'Upset Customer'],
          objectives: ['De-escalate the situation', 'Transfer to a supervisor'],
          evaluationCriteria: ['Empathetic tone', 'Professional phrasing', 'Smooth transition']
        }
      ],
      createApplyTask: {
        title: 'The Hold and Transfer Routine',
        prompt: 'Record a sequence where you ask to put someone on hold, return, and then transfer them.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'bpo-mod-5',
      order: 5,
      title: 'Upselling, Cross-Selling & Retention',
      mission: 'Present offers and retain customers using persuasive and polite language.',
      competencyIds: ['EN.A2.SPEAK.PERSUASION', 'EN.A2.LISTEN.IDENTIFY_NEEDS', 'EN.A2.VOCAB.SALES'],
      vocabulary: ['promotion', 'upgrade', 'discount', 'eligible', 'limited time', 'premium', 'value', 'loyalty', 'bundle', 'cancel'],
      grammarStructures: ['Based on your usage, I recommend...', 'Would you be interested in...', 'If you stay with us, I can offer...'],
      phoneticTargets: [
        'enthusiastic pitch and tone for sales offers',
        'clear emphasis on key benefits (e.g., FREE, DISCOUNT)',
        'confident delivery without rushing'
      ],
      spokenPrompts: [
        'Offer a customer an upgrade to a premium plan.',
        'Explain the benefits of bundling internet and cable.',
        'Respond to a customer wanting to cancel their service.'
      ],
      rolePlayScenarios: [
        {
          id: 'bpo-rp-5',
          title: 'Retaining a Customer',
          setting: 'Subscription service retention department.',
          roles: ['Retention Agent', 'Canceling Customer'],
          objectives: ['Understand reason for canceling', 'Offer a compelling discount to stay'],
          evaluationCriteria: ['Persuasive language', 'Active listening', 'Clear value proposition']
        }
      ],
      createApplyTask: {
        title: 'Pitch an Offer',
        prompt: 'Record a 45-second pitch offering a special promotion to a loyal customer.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'bpo-mod-6',
      order: 6,
      title: 'Call Closing, Satisfaction Confirmation & Documentation',
      mission: 'Wrap up calls professionally, ensuring all needs are met and leaving a positive final impression.',
      competencyIds: ['EN.A2.SPEAK.CALL_CLOSING', 'EN.A2.PRAG.CUSTOMER_SATISFACTION', 'EN.A2.VOCAB.WRAP_UP'],
      vocabulary: ['recap', 'resolve', 'survey', 'feedback', 'anything else', 'reference number', 'confirmation', 'document', 'have a great day', 'pleasure'],
      grammarStructures: ['To recap what we did today...', 'Is there anything else I can assist you with?', 'Your confirmation number is...'],
      phoneticTargets: [
        'clear and deliberate pacing for confirmation numbers',
        'warm and conclusive intonation for farewells',
        'avoiding trailing off at the end of sentences'
      ],
      spokenPrompts: [
        'Provide a reference number to a customer clearly.',
        'Ask if the customer has any other questions before hanging up.',
        'Deliver a warm, professional closing statement.'
      ],
      rolePlayScenarios: [
        {
          id: 'bpo-rp-6',
          title: 'The Perfect Wrap-Up',
          setting: 'End of a successful tech support call.',
          roles: ['Agent', 'Satisfied Customer'],
          objectives: ['Recap the solution', 'Provide reference number', 'Close the call'],
          evaluationCriteria: ['Completeness of recap', 'Warm closing tone', 'Clear numbers']
        }
      ],
      createApplyTask: {
        title: 'Complete Call Wrap-Up',
        prompt: 'Record a final call closing, including a brief recap of a fixed issue, a reference number, and a polite farewell.',
        stage: 'CREATE_APPLY'
      }
    }
  ]
};

const TOURISM_HOSPITALITY_TRACK: SpecializedIndustryTrack = {
  id: 'track-tourism-hospitality',
  slug: 'tourism-hospitality-english-do',
  title: 'Tourism & Hospitality English',
  titleEs: 'Inglés para Turismo y Hostelería en RD',
  description: 'Designed for hospitality professionals working in Dominican resorts, hotels, and tourist zones.',
  targetIndustry: 'Tourism & Hospitality',
  minimumCefrLevel: 'A2',
  estimatedHours: 40,
  modules: [
    {
      id: 'tourism-mod-1',
      order: 1,
      title: 'Airport & Arrival Assistance',
      mission: 'Welcome tourists arriving in the Dominican Republic and assist with initial logistics.',
      competencyIds: ['EN.A2.SPEAK.WELCOME_GUESTS', 'EN.A2.LISTEN.TRAVEL_INFO', 'EN.A2.VOCAB.ARRIVAL'],
      vocabulary: ['customs', 'baggage claim', 'shuttle', 'transfer', 'currency exchange', 'welcome to Punta Cana', 'passport', 'driver', 'terminal', 'luggage'],
      grammarStructures: ['Welcome to the Dominican Republic.', 'Let me help you with your luggage.', 'The shuttle is waiting outside.'],
      phoneticTargets: [
        '/r/ vs /l/ distinction in words like "arrival" and "luggage"',
        'clear pronunciation of "welcome" without adding a "g" sound',
        'warm, hospitable intonation'
      ],
      spokenPrompts: [
        'Welcome a family arriving at PUJ airport.',
        'Direct a tourist to the currency exchange desk.',
        'Explain where the hotel shuttle is parked.'
      ],
      rolePlayScenarios: [
        {
          id: 'tour-rp-1',
          title: 'Meeting at the Airport',
          setting: 'Arrivals terminal at Punta Cana International Airport.',
          roles: ['Transfer Guide', 'Tired Tourist'],
          objectives: ['Greet warmly', 'Locate luggage', 'Guide to vehicle'],
          evaluationCriteria: ['Welcoming tone', 'Clear directions', 'Helpful vocabulary']
        }
      ],
      createApplyTask: {
        title: 'Arrival Welcome Speech',
        prompt: 'Record a short speech welcoming a group of tourists as they board your transfer bus from the airport.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'tourism-mod-2',
      order: 2,
      title: 'Hotel Front Desk & Reservations',
      mission: 'Manage check-ins, verify reservations, and explain hotel amenities smoothly.',
      competencyIds: ['EN.A2.SPEAK.CHECK_IN', 'EN.A2.LISTEN.RESERVATION_DETAILS', 'EN.A2.VOCAB.HOTEL_FRONT_DESK'],
      vocabulary: ['reservation', 'check-in', 'all-inclusive', 'wristband', 'room key', 'deposit', 'upgrade', 'ocean view', 'amenities', 'bellboy'],
      grammarStructures: ['May I have your passport and credit card?', 'Your room is located on the...', 'Breakfast is served from...'],
      phoneticTargets: [
        '/θ/ in "three nights" and "fourth floor"',
        'clear vowel sounds in "room" vs "rum"',
        'polite rising intonation for requests'
      ],
      spokenPrompts: [
        'Ask a guest for their reservation details and ID.',
        'Explain the benefits of an ocean view upgrade.',
        'Describe the location of the main buffet.'
      ],
      rolePlayScenarios: [
        {
          id: 'tour-rp-2',
          title: 'Resort Check-In',
          setting: 'Front desk of a Bávaro all-inclusive resort.',
          roles: ['Receptionist', 'Excited Guest'],
          objectives: ['Complete check-in process', 'Explain all-inclusive wristband', 'Direct to room'],
          evaluationCriteria: ['Professionalism', 'Clarity of instructions', 'Accurate hotel vocabulary']
        }
      ],
      createApplyTask: {
        title: 'Front Desk Walkthrough',
        prompt: 'Record yourself checking in a fictional guest for a 3-night stay, explaining at least two resort amenities.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'tourism-mod-3',
      order: 3,
      title: 'Restaurant Service & Menu Descriptions',
      mission: 'Take orders, explain Dominican and international dishes, and provide excellent table service.',
      competencyIds: ['EN.A2.SPEAK.DESCRIBE_FOOD', 'EN.A2.LISTEN.TAKE_ORDERS', 'EN.A2.VOCAB.FOOD_BEVERAGE'],
      vocabulary: ['appetizer', 'main course', 'dessert', 'beverage', 'allergic', 'spicy', 'traditional', 'plantains', 'seafood', 'recommendation'],
      grammarStructures: ['Would you like to start with some drinks?', "Today's special is...", 'Does anyone have any food allergies?'],
      phoneticTargets: [
        'final consonant clusters in "guest", "checked", "dessert"',
        'clear /v/ sound in "beverage" and "reservation"',
        'appetizing intonation when describing food'
      ],
      spokenPrompts: [
        'Recommend a traditional Dominican dish like Mangu or Sancocho in English.',
        'Ask a table if they are ready to order.',
        'Check back on a table to see if they are enjoying their meal.'
      ],
      rolePlayScenarios: [
        {
          id: 'tour-rp-3',
          title: 'Dinner Service at an À La Carte Restaurant',
          setting: 'Resort restaurant.',
          roles: ['Waiter/Waitress', 'Diner with allergies'],
          objectives: ['Take the order', 'Handle a dietary restriction request safely'],
          evaluationCriteria: ['Polite service language', 'Clear food descriptions', 'Attentive listening']
        }
      ],
      createApplyTask: {
        title: 'Menu Description',
        prompt: 'Record a 45-second audio describing two of your favorite local dishes to an international guest.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'tourism-mod-4',
      order: 4,
      title: 'Tour Guiding & Cultural Narration',
      mission: 'Lead excursions and explain local history and culture engagingly to tourists.',
      competencyIds: ['EN.A2.SPEAK.PRESENT_INFO', 'EN.A2.VOCAB.CULTURE_HISTORY', 'EN.A2.PRAG.ENGAGE_AUDIENCE'],
      vocabulary: ['excursion', 'historic', 'monument', 'cathedral', 'founded', 'traditional', 'cenote', 'mangroves', 'safari', 'souvenir'],
      grammarStructures: ['On your left, you will see...', 'This building was constructed in...', 'Please remember to...'],
      phoneticTargets: [
        'projecting voice clearly outdoors',
        'pacing and pausing for dramatic effect',
        'clear pronunciation of historical dates and numbers'
      ],
      spokenPrompts: [
        'Introduce a historical site in the Zona Colonial.',
        'Give safety instructions before a buggy excursion.',
        'Explain the process of making Dominican cigars or chocolate.'
      ],
      rolePlayScenarios: [
        {
          id: 'tour-rp-4',
          title: 'Zona Colonial Walking Tour',
          setting: 'Outside the Catedral Primada de América.',
          roles: ['Tour Guide', 'Curious Tourist'],
          objectives: ['Share a brief history of the cathedral', "Answer a tourist's question"],
          evaluationCriteria: ['Engaging delivery', 'Accurate historical phrasing', 'Clear volume']
        }
      ],
      createApplyTask: {
        title: 'Mini Excursion Pitch',
        prompt: 'Record a 1-minute audio pitching a popular local excursion (like Saona Island) and highlighting its best features.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'tourism-mod-5',
      order: 5,
      title: 'Emergency & Guest Complaint Resolution',
      mission: 'Handle guest complaints and minor emergencies calmly and effectively.',
      competencyIds: ['EN.A2.SPEAK.APOLOGIZE', 'EN.A2.LISTEN.COMPLAINT', 'EN.A2.VOCAB.PROBLEM_SOLVING'],
      vocabulary: ['apologize', 'inconvenience', 'maintenance', 'immediately', 'housekeeping', 'air conditioning', 'noise', 'solution', 'complimentary', 'assistance'],
      grammarStructures: ['I apologize for the inconvenience.', 'I will send someone up right away.', 'Let me see what I can do to fix this.'],
      phoneticTargets: [
        'empathetic and calm tone of voice',
        'clear pronunciation of "apologize" and "inconvenience"',
        'avoiding defensive intonation'
      ],
      spokenPrompts: [
        'Apologize to a guest whose room is not ready yet.',
        'Respond to a complaint about a broken AC unit.',
        'Offer a complimentary drink for a delayed service.'
      ],
      rolePlayScenarios: [
        {
          id: 'tour-rp-5',
          title: 'Handling a Noise Complaint',
          setting: 'Hotel front desk at night.',
          roles: ['Night Manager', 'Angry Guest'],
          objectives: ['Listen actively to the complaint', 'Apologize', 'Offer a prompt solution'],
          evaluationCriteria: ['Calm demeanor', 'Appropriate apology phrases', 'Action-oriented language']
        }
      ],
      createApplyTask: {
        title: 'Complaint Resolution',
        prompt: 'Record yourself responding to a guest who found their room unclean, detailing the steps you will take to resolve it.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'tourism-mod-6',
      order: 6,
      title: 'Checkout, Feedback & Farewell',
      mission: 'Process checkouts efficiently, gather guest feedback, and say a warm goodbye.',
      competencyIds: ['EN.A2.SPEAK.FAREWELL', 'EN.A2.LISTEN.GATHER_FEEDBACK', 'EN.A2.VOCAB.CHECKOUT'],
      vocabulary: ['checkout', 'bill', 'balance', 'minibar', 'review', 'feedback', 'transportation', 'safe travels', 'hope to see you again', 'receipt'],
      grammarStructures: ['How was your stay with us?', 'Here is your final bill.', 'Do you need a taxi to the airport?'],
      phoneticTargets: [
        'warm, appreciative intonation',
        'clear articulation of final balance amounts',
        'fluent linking in "hope to see you again"'
      ],
      spokenPrompts: [
        'Ask a guest how their vacation was during checkout.',
        'Explain a minibar charge on the final bill.',
        'Wish a guest safe travels back home.'
      ],
      rolePlayScenarios: [
        {
          id: 'tour-rp-6',
          title: 'The Final Farewell',
          setting: 'Resort front desk checkout.',
          roles: ['Receptionist', 'Departing Guest'],
          objectives: ['Process payment', 'Ask for a TripAdvisor review', 'Arrange taxi'],
          evaluationCriteria: ['Efficiency', 'Warmth', 'Clear financial communication']
        }
      ],
      createApplyTask: {
        title: 'Checkout Roleplay',
        prompt: 'Record a complete checkout interaction, including reviewing a bill and a warm farewell.',
        stage: 'CREATE_APPLY'
      }
    }
  ]
};

const SOFTWARE_ENGINEERING_TRACK: SpecializedIndustryTrack = {
  id: 'track-software-engineering',
  slug: 'software-engineering-english',
  title: 'Software Engineering English',
  titleEs: 'Inglés para Ingeniería de Software',
  description: 'Designed for Dominican developers working in global distributed teams.',
  targetIndustry: 'Technology & Software',
  minimumCefrLevel: 'B1',
  estimatedHours: 40,
  modules: [
    {
      id: 'se-mod-1',
      order: 1,
      title: 'Daily Standups & Sprint Ceremonies',
      mission: 'Effectively communicate progress, blockers, and plans in Agile meetings.',
      competencyIds: ['EN.B1.SPEAK.REPORT_PROGRESS', 'EN.B1.VOCAB.AGILE', 'EN.B1.GRAMMAR.TENSES'],
      vocabulary: ['standup', 'blocker', 'sprint', 'backlog', 'ticket', 'in progress', 'deployed', 'yesterday', 'today', 'commit'],
      grammarStructures: ['Yesterday I worked on...', 'Today I plan to...', 'I am blocked by...'],
      phoneticTargets: [
        'clear past tense -ed endings (worked, fixed, deployed)',
        'pacing for concise updates',
        'distinct pronunciation of technical acronyms (API, UI, PR)'
      ],
      spokenPrompts: [
        'Give a 30-second standup update for your current project.',
        'Explain a technical blocker to your Scrum Master.',
        'Discuss your capacity for the upcoming sprint.'
      ],
      rolePlayScenarios: [
        {
          id: 'se-rp-1',
          title: 'The Daily Standup',
          setting: 'Zoom meeting with a distributed engineering team.',
          roles: ['Developer', 'Scrum Master'],
          objectives: ['Share yesterday/today updates', 'Highlight a blocker with an API integration'],
          evaluationCriteria: ['Conciseness', 'Accurate verb tenses', 'Clear technical vocabulary']
        }
      ],
      createApplyTask: {
        title: 'My Standup Update',
        prompt: 'Record a realistic standup update mentioning one completed task, one current task, and one blocker.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'se-mod-2',
      order: 2,
      title: 'Code Review Comments & Pull Request Descriptions',
      mission: 'Write clear PR descriptions and discuss code feedback constructively in spoken meetings.',
      competencyIds: ['EN.B1.SPEAK.GIVE_FEEDBACK', 'EN.B1.VOCAB.CODE_REVIEW', 'EN.B1.PRAG.CONSTRUCTIVE_CRITICISM'],
      vocabulary: ['pull request', 'merge conflict', 'refactor', 'optimize', 'variable', 'function', 'test coverage', 'LGTM', 'approve', 'nitpick'],
      grammarStructures: ['Have you considered using...', 'I suggest we extract this into...', 'This looks good, but...'],
      phoneticTargets: [
        'polite intonation when suggesting changes',
        'clear articulation of programming syntax terms (brackets, parentheses, strings)',
        'stressing key technical words in a sentence'
      ],
      spokenPrompts: [
        'Explain why a piece of code needs to be refactored.',
        "Politely suggest adding unit tests to a colleague's PR.",
        'Describe what your recent pull request accomplishes.'
      ],
      rolePlayScenarios: [
        {
          id: 'se-rp-2',
          title: 'Pair Programming Code Review',
          setting: 'Screen-sharing session reviewing a PR.',
          roles: ['Reviewer', 'Author'],
          objectives: ['Suggest a performance optimization', 'Agree on changes'],
          evaluationCriteria: ['Constructive tone', 'Technical clarity', 'Collaborative language']
        }
      ],
      createApplyTask: {
        title: 'Explain Your PR',
        prompt: 'Record an audio walkthrough of a recent (or fictional) pull request, explaining the problem it solves and your approach.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'se-mod-3',
      order: 3,
      title: 'Technical Architecture Discussions',
      mission: 'Participate in high-level discussions about system design and architecture choices.',
      competencyIds: ['EN.B1.SPEAK.EXPLAIN_CONCEPTS', 'EN.B1.VOCAB.ARCHITECTURE', 'EN.B1.GRAMMAR.CONDITIONALS'],
      vocabulary: ['scalability', 'latency', 'database', 'microservices', 'frontend', 'backend', 'authentication', 'caching', 'bottleneck', 'infrastructure'],
      grammarStructures: ['If we use [Tech A], then we will have to...', 'The advantage of this approach is...', 'Compared to a monolith, microservices...'],
      phoneticTargets: [
        'multi-syllable word stress (ar-chi-TEC-ture, sca-la-BIL-i-ty)',
        'linking technical concepts smoothly',
        'confident volume for presenting ideas'
      ],
      spokenPrompts: [
        'Explain the difference between SQL and NoSQL databases briefly.',
        'Propose adding a caching layer to improve performance.',
        'Discuss the pros and cons of moving to microservices.'
      ],
      rolePlayScenarios: [
        {
          id: 'se-rp-3',
          title: 'System Design Debate',
          setting: 'Engineering planning meeting.',
          roles: ['Backend Engineer', 'Tech Lead'],
          objectives: ['Propose a new database solution', 'Defend the choice against latency concerns'],
          evaluationCriteria: ['Logical argument flow', 'Accurate terminology', 'Use of conditional grammar']
        }
      ],
      createApplyTask: {
        title: 'Architecture Pitch',
        prompt: 'Record a 1-minute audio proposing a technical architectural change for a project you are familiar with.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'se-mod-4',
      order: 4,
      title: 'Bug Reports & Incident Communication',
      mission: 'Clearly describe bugs, replication steps, and participate in incident resolution channels.',
      competencyIds: ['EN.B1.SPEAK.DESCRIBE_PROBLEM', 'EN.B1.VOCAB.DEBUGGING', 'EN.B1.LISTEN.INCIDENT_CALL'],
      vocabulary: ['reproduce', 'stack trace', 'exception', 'crash', 'hotfix', 'environment', 'production', 'staging', 'regression', 'root cause'],
      grammarStructures: ['When I click X, Y happens instead of Z.', 'The issue occurs intermittently...', 'We need to roll back the release.'],
      phoneticTargets: [
        'clear enunciation of error messages and codes (e.g., Error 500)',
        'urgency and clarity in tone during an incident',
        'accurate pronunciation of "environment" and "reproduce"'
      ],
      spokenPrompts: [
        'Describe the exact steps to reproduce a critical login bug.',
        'Report an outage in the production environment.',
        'Explain the root cause of a recently fixed issue.'
      ],
      rolePlayScenarios: [
        {
          id: 'se-rp-4',
          title: 'War Room Incident Call',
          setting: 'Emergency Zoom call for a production outage.',
          roles: ['On-call Engineer', 'Engineering Manager'],
          objectives: ['Report the current status of the outage', 'Outline the immediate fix plan'],
          evaluationCriteria: ['Clarity under pressure', 'Precise problem description', 'Professional tone']
        }
      ],
      createApplyTask: {
        title: 'Bug Report Audio',
        prompt: 'Record a spoken bug report detailing what the issue is, where it happens, and how to reproduce it.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'se-mod-5',
      order: 5,
      title: 'Client Demos & Feature Presentations',
      mission: 'Showcase new software features to non-technical stakeholders and clients.',
      competencyIds: ['EN.B1.SPEAK.PRESENT_FEATURE', 'EN.B1.VOCAB.UI_UX', 'EN.B1.PRAG.NON_TECHNICAL_COMMS'],
      vocabulary: ['dashboard', 'navigate', 'user-friendly', 'workflow', 'streamline', 'export', 'generate', 'click here', 'seamless', 'value'],
      grammarStructures: ['As you can see on this screen...', 'This feature allows users to...', 'Next, I will demonstrate...'],
      phoneticTargets: [
        'engaging and confident presentation voice',
        'translating technical jargon into clear sounds for non-technical ears',
        'strategic pausing during transitions'
      ],
      spokenPrompts: [
        'Introduce a new dashboard feature to a client.',
        'Explain how a complex background process benefits the end user simply.',
        'Guide a user through a new checkout flow.'
      ],
      rolePlayScenarios: [
        {
          id: 'se-rp-5',
          title: 'Sprint Demo Day',
          setting: 'End of sprint demo with product managers and stakeholders.',
          roles: ['Frontend Developer', 'Product Manager'],
          objectives: ['Demo the new user profile page', 'Answer a non-technical question'],
          evaluationCriteria: ['Audience-appropriate language', 'Smooth transitions', 'Presentation confidence']
        }
      ],
      createApplyTask: {
        title: 'Feature Demo Walkthrough',
        prompt: 'Record a 90-second audio narrating a demo of a new app feature as if you were screen-sharing with a client.',
        stage: 'CREATE_APPLY'
      }
    },
    {
      id: 'se-mod-6',
      order: 6,
      title: 'Technical Interviews & Career Communication',
      mission: 'Successfully communicate experience, past projects, and technical skills in job interviews.',
      competencyIds: ['EN.B1.SPEAK.DISCUSS_EXPERIENCE', 'EN.B1.VOCAB.CAREER', 'EN.B1.PRAG.INTERVIEW_SKILLS'],
      vocabulary: ['experience', 'responsibility', 'achieve', 'collaborate', 'lead', 'implement', 'overcome', 'framework', 'passion', 'growth'],
      grammarStructures: ['In my previous role, I was responsible for...', 'I have three years of experience with...', 'A challenge I overcame was...'],
      phoneticTargets: [
        'confident articulation of past achievements',
        'clear pronunciation of popular frameworks (React, Angular, Node.js)',
        'avoiding filler words (um, ah) in English'
      ],
      spokenPrompts: [
        'Introduce yourself and your technical background in 60 seconds.',
        'Describe a difficult technical challenge you solved.',
        'Explain why you want to work for a remote international company.'
      ],
      rolePlayScenarios: [
        {
          id: 'se-rp-6',
          title: 'The Technical HR Screen',
          setting: 'First-round interview with an international recruiter.',
          roles: ['Candidate', 'Recruiter'],
          objectives: ['Summarize tech stack experience', 'Answer a behavioral question'],
          evaluationCriteria: ['Fluency', 'Professional vocabulary', 'STAR method structure (Situation, Task, Action, Result)']
        }
      ],
      createApplyTask: {
        title: 'Elevator Pitch for Engineers',
        prompt: 'Record a 1-minute professional introduction highlighting your main skills and what you are looking for in your next role.',
        stage: 'CREATE_APPLY'
      }
    }
  ]
};

export const SPECIALIZED_INDUSTRY_TRACKS: SpecializedIndustryTrack[] = [
  BPO_CALL_CENTER_TRACK,
  TOURISM_HOSPITALITY_TRACK,
  SOFTWARE_ENGINEERING_TRACK,
];

export function getTrackBySlug(slug: string): SpecializedIndustryTrack | undefined {
  return SPECIALIZED_INDUSTRY_TRACKS.find(t => t.slug === slug);
}

export function getTracksForCefrLevel(level: string): SpecializedIndustryTrack[] {
  return SPECIALIZED_INDUSTRY_TRACKS.filter(t => t.minimumCefrLevel === level);
}
