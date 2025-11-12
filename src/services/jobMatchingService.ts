import type { QuestionType } from '../types';

// Type alias for convenience
type AssessmentType = QuestionType;

/**
 * Job-Assessment Matching Service
 * Analyzes job descriptions and matches them with relevant assessment types
 * based on company knowledge and job requirements
 */

// Company profiles with known assessment preferences
const COMPANY_ASSESSMENT_PROFILES: Record<string, {
  primaryTypes: AssessmentType[];
  secondaryTypes: AssessmentType[];
  focusAreas: string[];
}> = {
  // Tech companies
  'google': {
    primaryTypes: ['case-study', 'logical', 'technical'],
    secondaryTypes: ['situational', 'behavioral'],
    focusAreas: ['data-driven', 'analytical', 'strategic']
  },
  'meta': {
    primaryTypes: ['case-study', 'technical', 'behavioral'],
    secondaryTypes: ['situational', 'logical'],
    focusAreas: ['data analysis', 'performance marketing', 'growth']
  },
  'amazon': {
    primaryTypes: ['behavioral', 'case-study', 'situational'],
    secondaryTypes: ['numerical', 'logical'],
    focusAreas: ['leadership principles', 'customer obsession', 'data-driven']
  },

  // FMCG & Retail
  'unilever': {
    primaryTypes: ['numerical', 'case-study', 'situational'],
    secondaryTypes: ['verbal', 'behavioral'],
    focusAreas: ['brand management', 'consumer insights', 'sustainability']
  },
  'procter & gamble': {
    primaryTypes: ['numerical', 'case-study', 'technical'],
    secondaryTypes: ['situational', 'logical'],
    focusAreas: ['brand strategy', 'market research', 'analytical']
  },
  'nike': {
    primaryTypes: ['case-study', 'behavioral', 'situational'],
    secondaryTypes: ['verbal', 'personality'],
    focusAreas: ['brand storytelling', 'consumer connection', 'innovation']
  },
  'adidas': {
    primaryTypes: ['case-study', 'situational', 'behavioral'],
    secondaryTypes: ['verbal', 'personality'],
    focusAreas: ['brand strategy', 'sports marketing', 'digital']
  },

  // Consultancies
  'mckinsey': {
    primaryTypes: ['case-study', 'logical', 'numerical'],
    secondaryTypes: ['behavioral', 'situational'],
    focusAreas: ['problem solving', 'structured thinking', 'quantitative']
  },
  'bcg': {
    primaryTypes: ['case-study', 'logical', 'numerical'],
    secondaryTypes: ['behavioral', 'situational'],
    focusAreas: ['strategic thinking', 'analytical', 'creative']
  },
  'bain': {
    primaryTypes: ['case-study', 'numerical', 'behavioral'],
    secondaryTypes: ['logical', 'situational'],
    focusAreas: ['results-driven', 'analytical', 'teamwork']
  },

  // Dutch companies
  'coolblue': {
    primaryTypes: ['situational', 'behavioral', 'personality'],
    secondaryTypes: ['case-study', 'verbal'],
    focusAreas: ['customer service', 'culture fit', 'pragmatic']
  },
  'bol.com': {
    primaryTypes: ['technical', 'case-study', 'numerical'],
    secondaryTypes: ['situational', 'behavioral'],
    focusAreas: ['e-commerce', 'data analysis', 'customer experience']
  },
  'booking.com': {
    primaryTypes: ['technical', 'numerical', 'case-study'],
    secondaryTypes: ['behavioral', 'situational'],
    focusAreas: ['data-driven', 'experimentation', 'performance']
  },
  'heineken': {
    primaryTypes: ['numerical', 'case-study', 'situational'],
    secondaryTypes: ['behavioral', 'verbal'],
    focusAreas: ['brand management', 'commercial', 'innovation']
  },
  'philips': {
    primaryTypes: ['technical', 'case-study', 'numerical'],
    secondaryTypes: ['behavioral', 'situational'],
    focusAreas: ['innovation', 'health tech', 'data analysis']
  },
  'ing': {
    primaryTypes: ['numerical', 'logical', 'situational'],
    secondaryTypes: ['behavioral', 'technical'],
    focusAreas: ['financial', 'analytical', 'compliance']
  },
  'abn amro': {
    primaryTypes: ['numerical', 'situational', 'behavioral'],
    secondaryTypes: ['logical', 'verbal'],
    focusAreas: ['risk management', 'customer focus', 'innovation']
  },
};

// Keywords mapping to assessment types
const KEYWORD_ASSESSMENT_MAP: Record<AssessmentType, string[]> = {
  'numerical': [
    'budget', 'roi', 'kpi', 'metrics', 'analytics', 'data analysis',
    'financial', 'performance', 'attribution', 'conversion', 'revenue',
    'forecasting', 'reporting', 'dashboard', 'excel', 'sql'
  ],
  'verbal': [
    'communication', 'copywriting', 'content', 'brand voice', 'messaging',
    'storytelling', 'presentation', 'written', 'documentation', 'briefing'
  ],
  'situational': [
    'stakeholder', 'priority', 'decision making', 'problem solving',
    'conflict', 'team management', 'leadership', 'collaboration', 'agile'
  ],
  'case-study': [
    'strategy', 'strategic', 'planning', 'campaign', 'market analysis',
    'competitive', 'positioning', 'go-to-market', 'launch', 'initiative',
    'project management', 'end-to-end'
  ],
  'technical': [
    'google analytics', 'facebook ads', 'google ads', 'seo', 'sem',
    'marketing automation', 'crm', 'martech', 'tools', 'platforms',
    'html', 'api', 'tracking', 'tag manager', 'attribution modeling'
  ],
  'behavioral': [
    'team player', 'leadership', 'motivation', 'influence', 'persuasion',
    'coaching', 'mentoring', 'feedback', 'adaptability', 'resilience',
    'entrepreneurial', 'ownership', 'star method'
  ],
  'logical': [
    'analytical', 'critical thinking', 'reasoning', 'systematic',
    'structured', 'problem-solving', 'methodology', 'framework', 'process'
  ],
  'abstract': [
    'pattern recognition', 'visual reasoning', 'spatial awareness',
    'non-verbal', 'diagram interpretation', 'sequences', 'matrices'
  ],
  'personality': [
    'culture fit', 'values', 'work style', 'personality', 'attitude',
    'mindset', 'character', 'traits', 'psychometric', 'behavioral assessment'
  ]
};

// Seniority level indicators
const SENIORITY_KEYWORDS = {
  senior: ['senior', 'lead', 'head of', 'director', 'cmo', 'chief', 'principal', 'vp'],
  medior: ['manager', 'specialist', 'medior', 'mid-level', 'coordinator'],
  junior: ['junior', 'assistant', 'associate', 'starter', 'entry']
};

/**
 * Match a job to relevant assessment types
 */
export function matchJobToAssessments(job: {
  title: string;
  company: string;
  description?: string | null;
  snippet?: string | null;
  experience_level?: string | null;
}): {
  matchedTypes: AssessmentType[];
  matchingScore: number;
  reasoning: string[];
} {
  const matchedTypes = new Set<AssessmentType>();
  const reasoning: string[] = [];
  let totalScore = 0;
  const weights = { company: 30, keywords: 40, seniority: 20, industry: 10 };

  // Combine all text for analysis
  const allText = [
    job.title,
    job.company,
    job.description || '',
    job.snippet || ''
  ].join(' ').toLowerCase();

  // 1. Company-based matching (30 points)
  const companyKey = Object.keys(COMPANY_ASSESSMENT_PROFILES).find(key =>
    job.company.toLowerCase().includes(key)
  );

  if (companyKey) {
    const profile = COMPANY_ASSESSMENT_PROFILES[companyKey];
    profile.primaryTypes.forEach(type => matchedTypes.add(type));
    profile.secondaryTypes.forEach(type => matchedTypes.add(type));

    totalScore += weights.company;
    reasoning.push(
      `${job.company} typically uses: ${profile.primaryTypes.join(', ')}`
    );
  } else {
    totalScore += weights.company * 0.3; // Partial score for unknown company
  }

  // 2. Keyword-based matching (40 points)
  const keywordMatches: Record<string, number> = {};

  Object.entries(KEYWORD_ASSESSMENT_MAP).forEach(([assessmentType, keywords]) => {
    const matchCount = keywords.filter(keyword =>
      allText.includes(keyword.toLowerCase())
    ).length;

    if (matchCount > 0) {
      matchedTypes.add(assessmentType as AssessmentType);
      keywordMatches[assessmentType] = matchCount;
    }
  });

  const maxKeywordMatches = Math.max(...Object.values(keywordMatches), 0);
  if (maxKeywordMatches > 0) {
    totalScore += weights.keywords * Math.min(maxKeywordMatches / 5, 1);

    const topMatches = Object.entries(keywordMatches)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    reasoning.push(`Strong keyword matches: ${topMatches.join(', ')}`);
  }

  // 3. Seniority-based matching (20 points)
  const titleLower = job.title.toLowerCase();
  const experienceLevel = job.experience_level?.toLowerCase();

  if (SENIORITY_KEYWORDS.senior.some(k => titleLower.includes(k) || experienceLevel?.includes(k))) {
    matchedTypes.add('case-study');
    matchedTypes.add('behavioral');
    matchedTypes.add('situational');
    totalScore += weights.seniority;
    reasoning.push('Senior role: case-study, behavioral, situational assessments common');
  } else if (SENIORITY_KEYWORDS.medior.some(k => titleLower.includes(k) || experienceLevel?.includes(k))) {
    matchedTypes.add('technical');
    matchedTypes.add('numerical');
    matchedTypes.add('situational');
    totalScore += weights.seniority * 0.8;
    reasoning.push('Medior role: technical, numerical, situational assessments expected');
  }

  // 4. Industry/role-specific matching (10 points)
  const roleTypes = {
    'performance marketing': ['technical', 'numerical'],
    'brand': ['case-study', 'verbal', 'behavioral'],
    'content': ['verbal', 'situational'],
    'digital': ['technical', 'numerical'],
    'growth': ['technical', 'case-study', 'numerical'],
    'product marketing': ['case-study', 'technical', 'situational'],
    'communications': ['verbal', 'situational', 'behavioral'],
  };

  Object.entries(roleTypes).forEach(([roleKey, types]) => {
    if (allText.includes(roleKey)) {
      types.forEach(type => matchedTypes.add(type as AssessmentType));
      totalScore += weights.industry / Object.keys(roleTypes).length;
      reasoning.push(`${roleKey} focus suggests: ${types.join(', ')}`);
    }
  });

  // Ensure we always have at least some assessment types
  if (matchedTypes.size === 0) {
    // Default assessments for marketing roles
    ['situational', 'behavioral', 'case-study'].forEach(type =>
      matchedTypes.add(type as AssessmentType)
    );
    reasoning.push('Using default marketing assessment types');
  }

  return {
    matchedTypes: Array.from(matchedTypes),
    matchingScore: Math.round(totalScore),
    reasoning
  };
}

/**
 * Get assessment recommendations for a job
 */
export function getAssessmentRecommendations(job: {
  title: string;
  company: string;
  description?: string | null;
  snippet?: string | null;
  experience_level?: string | null;
  matched_assessment_types?: string[] | null;
}): {
  recommended: AssessmentType[];
  priority: 'high' | 'medium' | 'low';
  message: string;
} {
  const matchResult = matchJobToAssessments(job);

  let priority: 'high' | 'medium' | 'low' = 'medium';
  if (matchResult.matchingScore >= 70) priority = 'high';
  else if (matchResult.matchingScore < 50) priority = 'low';

  const companyName = job.company;
  const message = priority === 'high'
    ? `Great match! Practice these assessments to prepare for ${companyName}`
    : priority === 'medium'
    ? `Consider practicing these assessments for ${companyName}`
    : `General preparation for marketing roles at ${companyName}`;

  return {
    recommended: matchResult.matchedTypes,
    priority,
    message
  };
}

/**
 * Check if user's completed assessments align with a job
 */
export function checkAssessmentReadiness(
  jobMatchedTypes: string[],
  userCompletedTypes: AssessmentType[]
): {
  readinessScore: number;
  completedTypes: AssessmentType[];
  missingTypes: AssessmentType[];
  message: string;
} {
  const jobTypes = new Set(jobMatchedTypes);
  const userTypes = new Set(userCompletedTypes);

  const completedTypes = Array.from(jobTypes).filter(type =>
    userTypes.has(type as AssessmentType)
  ) as AssessmentType[];

  const missingTypes = Array.from(jobTypes).filter(type =>
    !userTypes.has(type as AssessmentType)
  ) as AssessmentType[];

  const readinessScore = jobTypes.size > 0
    ? Math.round((completedTypes.length / jobTypes.size) * 100)
    : 0;

  let message = '';
  if (readinessScore === 100) {
    message = '✅ You\'re fully prepared! You\'ve practiced all relevant assessment types.';
  } else if (readinessScore >= 70) {
    message = '👍 Good preparation! Consider practicing the missing types for best results.';
  } else if (readinessScore >= 40) {
    message = '⚠️ Partial preparation. Practice the missing types to improve your chances.';
  } else {
    message = '📚 More practice needed. Focus on the recommended assessment types.';
  }

  return {
    readinessScore,
    completedTypes,
    missingTypes,
    message
  };
}

/**
 * Export for use in N8N workflow (can be copy-pasted)
 */
export function getMatchingScoreForN8N(jobData: {
  title: string;
  company: string;
  description?: string;
  snippet?: string;
  experience_level?: string;
}): {
  matched_assessment_types: string[];
  matching_score: number;
} {
  const result = matchJobToAssessments(jobData);
  return {
    matched_assessment_types: result.matchedTypes,
    matching_score: result.matchingScore
  };
}
