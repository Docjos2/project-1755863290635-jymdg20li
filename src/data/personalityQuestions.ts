import { Question } from '../types';

// Personality assessment questions to help prepare for tools like Pymetrics, DISC, etc.
export const personalityQuestions: Question[] = [
  {
    id: 'pers-001',
    type: 'personality',
    difficulty: 'mid',
    question: 'In personality assessments for marketing roles, which traits are typically most valued?',
    options: [
      'Introversion, risk-aversion, routine-focused',
      'Analytical thinking, creativity, collaboration, results-driven',
      'Aggressive, competitive, independent',
      'Perfectionism, detail-obsession, process-oriented'
    ],
    correctAnswer: 'Analytical thinking, creativity, collaboration, results-driven',
    explanation: 'Senior marketing roles typically seek a balance of: Analytical skills (data-driven decision making), Creativity (innovative thinking), Collaboration (cross-functional work), Results-orientation (business impact), Adaptability (changing market conditions), Communication (stakeholder management). Red flags in assessments: Extreme rigidity or inability to adapt, Poor collaboration indicators, Complete lack of structure/process, Inability to handle feedback. Most assessments look for balanced profiles, not extremes. Being too agreeable or too aggressive both raise flags.',
    detailedExplanation: 'Personality assessments (Pymetrics, DISC, Predictive Index) measure: Work style preferences, Decision-making approach, Interpersonal dynamics, Risk tolerance, Motivation drivers. For marketing roles: Balance matters more than extremes, Emotional intelligence is critical, Adaptability and learning orientation valued, Results-focus expected but not at expense of ethics. Answer authentically - trying to game assessments often backfires as they have consistency checks.',
    timeLimit: 120,
    tags: ['personality', 'assessment-prep', 'traits'],
    points: 8,
  },
  {
    id: 'pers-002',
    type: 'personality',
    difficulty: 'mid',
    question: 'When taking a Pymetrics-style game-based assessment, what is the platform primarily measuring?',
    options: [
      'Your marketing knowledge and skills',
      'Cognitive abilities, risk tolerance, attention, emotional intelligence, and decision-making patterns',
      'Your typing speed and accuracy',
      'Whether you can follow instructions'
    ],
    correctAnswer: 'Cognitive abilities, risk tolerance, attention, emotional intelligence, and decision-making patterns',
    explanation: 'Pymetrics uses neuroscience-based games to measure: Attention and focus (sustained concentration), Risk tolerance (balloon game: when do you stop?), Fairness and generosity (money allocation), Emotional intelligence (reading facial expressions), Decision making (speed vs accuracy trade-offs), Learning and adaptability (pattern recognition). There are no "right" answers - it\'s measuring your natural cognitive and emotional patterns. Authenticity matters because: They establish baseline patterns, Inconsistency flags you, Role fit matters more than perfect scores.',
    detailedExplanation: 'Preparation tips for game-based assessments: 1) Get good sleep - cognitive performance matters, 2) Find quiet environment with no distractions, 3) Read instructions carefully for each game, 4) Don\'t try to game it - consistency checks will catch you, 5) Be yourself - they\'re matching your profile to role requirements, not judging you as "good" or "bad", 6) Practice similar games online to get comfortable with format (but your natural patterns will show through). Common games: Balloon pump (risk), Money exchange (fairness), Keypressing (attention), Digits memory (working memory), Emotion reading (EQ).',
    timeLimit: 180,
    tags: ['personality', 'pymetrics', 'game-assessments'],
    points: 10,
  },
  {
    id: 'pers-003',
    type: 'personality',
    difficulty: 'entry',
    question: 'What is the best approach when taking personality assessments?',
    options: [
      'Answer how you think the company wants you to answer',
      'Answer authentically about your actual preferences and behaviors',
      'Always choose the most "positive" sounding option',
      'Answer randomly since there are no right answers'
    ],
    correctAnswer: 'Answer authentically about your actual preferences and behaviors',
    explanation: 'Option B is correct because: 1) Assessments have consistency checks that detect inauthentic responses, 2) Getting hired for a role that doesn\'t fit your natural style leads to job dissatisfaction, 3) Companies are looking for fit, not perfection, 4) Authentic responses help both you and employer make right decision. While it\'s tempting to present an idealized version, modern assessments are designed to catch this. Plus, if you fake your way in, you\'ll be miserable in a mismatched role.',
    timeLimit: 90,
    tags: ['personality', 'assessment-strategy', 'authenticity'],
    points: 6,
  },
  {
    id: 'pers-004',
    type: 'personality',
    difficulty: 'mid',
    question: 'In a DISC assessment, what does each letter represent?',
    options: [
      'Data, Insight, Strategy, Communication',
      'Dominance, Influence, Steadiness, Conscientiousness',
      'Decisive, Innovative, Strategic, Collaborative',
      'Direct, Intuitive, Social, Careful'
    ],
    correctAnswer: 'Dominance, Influence, Steadiness, Conscientiousness',
    explanation: 'DISC measures four behavioral styles: D (Dominance): Results-focused, direct, competitive, likes challenge and control, I (Influence): People-focused, enthusiastic, persuasive, likes social recognition, S (Steadiness): Supportive, patient, reliable, likes stability and cooperation, C (Conscientiousness): Quality-focused, analytical, systematic, likes accuracy and standards. Most people are a blend. For marketing roles: High I common (persuasion, communication), Moderate D (drive results), Mix of S and C (collaboration vs analysis). All profiles can succeed - it\'s about fit with role and team.',
    detailedExplanation: 'Understanding your DISC profile helps: Know your natural communication style, Understand potential blind spots (High D might overlook people issues, High S might avoid necessary conflict), Adapt to others\' styles (communicate in their language), Build balanced teams. In interviews discussing DISC: Show self-awareness of your style, Demonstrate ability to adapt and flex, Share how you work with different styles, Avoid claiming extremes - balanced profiles often strongest.',
    timeLimit: 150,
    tags: ['personality', 'disc', 'behavioral-styles'],
    points: 8,
  },
  {
    id: 'pers-005',
    type: 'personality',
    difficulty: 'senior',
    question: 'You\'re taking a situational judgment personality assessment that presents this scenario:\n\n"Your team disagrees with your proposed strategy. Do you: A) Push forward with your plan, B) Seek to understand their concerns, C) Put it to a vote, D) Defer to team consensus"\n\nWhich response pattern do assessments typically prefer for senior marketing roles?',
    options: [
      'Always choose authoritative options (A)',
      'Always choose collaborative options (D)',
      'Context-dependent balance: typically B, showing you seek input while maintaining leadership',
      'Options like C to show democratic approach'
    ],
    correctAnswer: 'Context-dependent balance: typically B, showing you seek input while maintaining leadership',
    explanation: 'Senior roles require balancing: Confidence in your expertise (not overly deferential), Openness to input (not dictatorial), Decisiveness (not paralyzed by consensus), Emotional intelligence (understanding team concerns). Option B ("seek to understand concerns") demonstrates: Leadership without arrogance, Emotional intelligence, Open-mindedness, Ability to make informed decisions. Pure authoritarianism (A) raises red flags. Pure deference (D) suggests lack of leadership. Vote-taking (C) can seem like abdicating responsibility. Context matters: sometimes you need to be more directive, but as a default, seeking understanding while maintaining leadership is valued.',
    detailedExplanation: 'Red flags in personality assessments: Extremes in any direction (too agreeable, too dominant, etc.), Inconsistency in responses (suggests gaming the system), Lack of self-awareness, Poor response to feedback scenarios, Inability to adapt style. Green flags: Balance and flexibility, Self-awareness with growth mindset, Collaboration without being a pushover, Decisiveness with thoughtfulness, Results-focus with ethics. For senior roles specifically: Strategic thinking indicators, Ability to influence without authority, Comfort with ambiguity, Resilience in setbacks.',
    timeLimit: 180,
    tags: ['personality', 'situational-judgment', 'leadership-style'],
    points: 12,
  },
];
