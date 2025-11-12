import { Question } from '../types';

export const logicalQuestions: Question[] = [
  {
    id: 'logic-001',
    type: 'logical',
    difficulty: 'mid',
    question: 'If all successful marketing campaigns have clear objectives, and Campaign X has clear objectives, can we conclude Campaign X will be successful?',
    options: [
      'Yes, it will definitely be successful',
      'No, having clear objectives is necessary but not sufficient for success',
      'Yes, if it has clear objectives it meets all requirements',
      'Cannot determine without more information'
    ],
    correctAnswer: 'No, having clear objectives is necessary but not sufficient for success',
    explanation: 'This tests logical reasoning. The statement "all successful campaigns have clear objectives" means: If successful → then clear objectives. But this doesn\'t mean: If clear objectives → then successful. Clear objectives are necessary (must-have) but not sufficient (not the only thing needed). Many campaigns have clear objectives but fail due to poor execution, wrong audience, bad timing, etc. This is a common logical fallacy to avoid.',
    timeLimit: 90,
    tags: ['logical-reasoning', 'necessary-sufficient', 'critical-thinking'],
    points: 8,
  },
  {
    id: 'logic-002',
    type: 'logical',
    difficulty: 'mid',
    question: 'A marketing team tests three email subject lines:\n- Subject A: 22% open rate, 4% click rate\n- Subject B: 28% open rate, 2.5% click rate\n- Subject C: 19% open rate, 5% click rate\n\nIf the goal is to maximize total clicks (not just click rate), which subject line should they use?',
    options: [
      'Subject A',
      'Subject B',
      'Subject C',
      'Need to know total send volume'
    ],
    correctAnswer: 'Need to know total send volume',
    explanation: 'This tests logical reasoning about metrics. Total clicks = Open rate × Click rate × Send volume. Subject A: 22% × 4% = 0.88% of sends. Subject B: 28% × 2.5% = 0.70% of sends. Subject C: 19% × 5% = 0.95% of sends. If send volume is equal, choose C (0.95% > 0.88% > 0.70%). But the question asks which to "use" - if they\'re using it for different sends with different volumes, the answer changes. However, assuming equal send volume, C generates most clicks. The best answer is D because we need to calculate total clicks, not just rates.',
    timeLimit: 120,
    tags: ['logical-reasoning', 'metrics', 'optimization'],
    points: 10,
  },
  {
    id: 'logic-003',
    type: 'logical',
    difficulty: 'senior',
    question: 'Statement: "Companies that invest in brand marketing grow faster than those that don\'t."\n\nWhich of the following would most weaken this argument?',
    options: [
      'Fast-growing companies have more budget to invest in brand marketing',
      'Some companies invest in brand marketing and grow slowly',
      'Brand marketing is expensive',
      'Not all companies can afford brand marketing'
    ],
    correctAnswer: 'Fast-growing companies have more budget to invest in brand marketing',
    explanation: 'This tests causal reasoning. Option A points out the causality could be reversed: maybe it\'s not "brand marketing causes growth" but rather "growth enables brand investment." This is a confounding variable - correlation doesn\'t prove causation. The original statement assumes: Brand marketing → Growth. But Option A suggests: Growth → More budget → Brand marketing. Both could be happening. Option B just shows exceptions (doesn\'t disprove the trend). Options C and D are about feasibility, not causation. Understanding causation vs correlation is critical for strategic thinking.',
    timeLimit: 150,
    tags: ['logical-reasoning', 'causation', 'critical-thinking'],
    points: 15,
  },
  {
    id: 'logic-004',
    type: 'logical',
    difficulty: 'mid',
    question: 'If Campaign A costs €10K and generates €50K revenue, and Campaign B costs €20K and generates €90K revenue, which has better ROI?',
    options: [
      'Campaign A (5x ROI vs 4.5x)',
      'Campaign B (€90K revenue is higher)',
      'They are equal',
      'Cannot compare - different scales'
    ],
    correctAnswer: 'Campaign A (5x ROI vs 4.5x)',
    explanation: 'ROI = (Revenue - Cost) / Cost. Campaign A: (€50K - €10K) / €10K = 4x or 400% ROI. Campaign B: (€90K - €20K) / €20K = 3.5x or 350% ROI. Campaign A has better ROI efficiency. However, Campaign B generates more absolute profit (€70K vs €40K). This highlights the difference between efficiency (ROI) and scale (absolute profit). In real decisions, you\'d consider: If you have €20K budget, would you rather do Campaign A twice (2 × €40K = €80K profit) or Campaign B once (€70K profit)? Campaign A twice wins. ROI matters for capital allocation.',
    timeLimit: 120,
    tags: ['logical-reasoning', 'roi-calculation', 'comparative-analysis'],
    points: 8,
  },
  {
    id: 'logic-005',
    type: 'logical',
    difficulty: 'entry',
    question: 'If "all digital campaigns require landing pages" is true, which of the following must also be true?',
    options: [
      'All landing pages are for digital campaigns',
      'If it doesn\'t have a landing page, it\'s not a digital campaign',
      'Landing pages guarantee campaign success',
      'Only digital campaigns use landing pages'
    ],
    correctAnswer: 'If it doesn\'t have a landing page, it\'s not a digital campaign',
    explanation: 'This tests logical contrapositive. If "all A require B" is true, then "if not B, then not A" must be true. Original: Digital campaign → Landing page required. Contrapositive: No landing page → Not a digital campaign. Option A reverses the logic incorrectly. Option C introduces a new concept (success) not in the original statement. Option D claims exclusivity not stated. Understanding logical structure helps in strategy and argumentation.',
    timeLimit: 90,
    tags: ['logical-reasoning', 'contrapositive', 'deductive-reasoning'],
    points: 5,
  },
  {
    id: 'logic-006',
    type: 'logical',
    difficulty: 'senior',
    question: 'A company observes: When they increase ad spend, revenue goes up. When they decrease ad spend, revenue goes down. The CMO concludes: "Ad spend directly drives revenue."\n\nWhat is the logical flaw?',
    options: [
      'There is no flaw - the correlation proves causation',
      'Other factors (seasonality, market conditions, product changes) could be driving both ad spend decisions and revenue',
      'The sample size is too small',
      'Ad spend cannot influence revenue'
    ],
    correctAnswer: 'Other factors (seasonality, market conditions, product changes) could be driving both ad spend decisions and revenue',
    explanation: 'This tests understanding of causation, correlation, and confounding variables. The company might: Increase ad spend when they have a hot new product (product drives revenue, not just ads), Increase ad spend in Q4 (seasonality drives both decisions and revenue), Decrease spend during economic downturns (economy affects both). While ads likely do contribute to revenue, the observation alone doesn\'t prove direct causation. To test causality, you\'d need: Controlled experiments (randomized spend levels), Holding other factors constant, Time-series analysis controlling for confounds. This type of logical thinking prevents false conclusions in marketing analytics.',
    timeLimit: 180,
    tags: ['logical-reasoning', 'causation-vs-correlation', 'experimental-design'],
    points: 15,
  },
  {
    id: 'logic-007',
    type: 'logical',
    difficulty: 'mid',
    question: 'Premise 1: Brands with high awareness have lower customer acquisition costs.\nPremise 2: Company X has high brand awareness.\nConclusion: ?',
    options: [
      'Company X will have low acquisition costs',
      'Company X likely has low acquisition costs, all else being equal',
      'Company X definitely has the lowest acquisition costs in their industry',
      'Brand awareness always reduces acquisition costs'
    ],
    correctAnswer: 'Company X likely has low acquisition costs, all else being equal',
    explanation: 'This tests logical reasoning with qualifiers. Premise 1 states a general trend, not an absolute law. Option B correctly applies the logic with appropriate qualifiers: "likely" (not certain), "all else being equal" (other factors matter). Option A is too certain. Option C goes beyond what premises support. Option D overstates the premise. In business reasoning, few things are absolutes - trends, likelihoods, and qualifiers matter. High awareness helps with CAC but doesn\'t guarantee low CAC - pricing, product quality, competition, and other factors also matter.',
    timeLimit: 120,
    tags: ['logical-reasoning', 'deductive-reasoning', 'qualifiers'],
    points: 10,
  },
  {
    id: 'logic-008',
    type: 'logical',
    difficulty: 'senior',
    question: 'A study shows: "Companies that use marketing automation have 14% higher revenue."\n\nBefore investing €100K in marketing automation based on this finding, what critical question should you ask?',
    options: [
      'Which marketing automation platform is best?',
      'Is the correlation due to automation causing growth, or growing companies being more likely to invest in automation?',
      'How was the 14% calculated?',
      'What is the sample size of the study?'
    ],
    correctAnswer: 'Is the correlation due to automation causing growth, or growing companies being more likely to invest in automation?',
    explanation: 'This tests causal reasoning in business decisions. Option B identifies the key question: directionality of causation. Does automation → growth, or does growth → resources to invest in automation? This is a selection bias issue. Growing companies might: Have more budget for tools, Have larger teams who can leverage automation, Be more sophisticated in general. The 14% could be correlation without causation. To determine true causal impact, you\'d need: Controlled experiments, Companies of similar size/stage adopting vs not adopting, Before/after analysis. While C and D are valid methodological questions, B is the fundamental logical challenge. Mistaking correlation for causation leads to bad investments.',
    timeLimit: 180,
    tags: ['logical-reasoning', 'causation', 'research-methodology', 'critical-thinking'],
    points: 18,
  },
  {
    id: 'logic-009',
    type: 'logical',
    difficulty: 'mid',
    question: 'If the statement "No successful campaign lacks measurement" is true, which is equivalent?',
    options: [
      'All campaigns have measurement',
      'All successful campaigns have measurement',
      'Measurement guarantees success',
      'Only successful campaigns have measurement'
    ],
    correctAnswer: 'All successful campaigns have measurement',
    explanation: 'This tests logical equivalence with negatives. "No successful campaign lacks measurement" = "All successful campaigns have measurement." It\'s stating: If successful → has measurement. This doesn\'t mean: All campaigns with measurement are successful (C is wrong), Only successful campaigns have measurement (D is wrong - unsuccessful campaigns can also have measurement). Understanding logical statements with negatives is important for interpreting research, contracts, and policies accurately.',
    timeLimit: 120,
    tags: ['logical-reasoning', 'logical-equivalence', 'negatives'],
    points: 8,
  },
  {
    id: 'logic-010',
    type: 'logical',
    difficulty: 'entry',
    question: 'Which of the following is a logical conclusion from this data?\n\nCampaign performance:\n- Social media: 1,000 clicks, 50 conversions (5% rate)\n- Email: 500 clicks, 40 conversions (8% rate)\n- Paid search: 2,000 clicks, 120 conversions (6% rate)',
    options: [
      'Email is the best channel because it has the highest conversion rate',
      'Paid search is the best channel because it has the most conversions',
      'Email has the highest conversion rate, paid search generates the most volume; "best" depends on your goal',
      'Social media is worst and should be stopped'
    ],
    correctAnswer: 'Email has the highest conversion rate, paid search generates the most volume; "best" depends on your goal',
    explanation: 'This tests logical reasoning about optimization and context. Option C correctly identifies that "best" depends on objectives: If goal is efficiency (conversions per click): Email is best (8% rate), If goal is volume (total conversions): Paid search is best (120 total), If goal is both: You need both channels. Option A and B make absolute claims without context. Option D jumps to conclusion without considering: Social media might be early in customer journey (awareness/consideration), Social media ROI might still be positive, Volume matters. Logical thinking requires considering: Context and goals, Multiple dimensions of performance, Trade-offs between efficiency and scale.',
    timeLimit: 90,
    tags: ['logical-reasoning', 'data-interpretation', 'context-dependent-decisions'],
    points: 7,
  },
];
