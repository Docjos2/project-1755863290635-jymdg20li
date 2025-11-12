import { Question } from '../types';
import { numericalQuestions } from './numericalQuestions';
import { verbalQuestions } from './verbalQuestions';
import { situationalQuestions } from './situationalQuestions';
import { caseStudyQuestions } from './caseStudyQuestions';
import { technicalQuestions } from './technicalQuestions';
import { behavioralQuestions } from './behavioralQuestions';
import { logicalQuestions } from './logicalQuestions';
import { personalityQuestions } from './personalityQuestions';

// Combine all question banks
export const allQuestions: Question[] = [
  ...numericalQuestions,
  ...verbalQuestions,
  ...situationalQuestions,
  ...caseStudyQuestions,
  ...technicalQuestions,
  ...behavioralQuestions,
  ...logicalQuestions,
  ...personalityQuestions,
];

// Helper functions for filtering questions
export const getQuestionsByType = (type: Question['type']): Question[] => {
  return allQuestions.filter(q => q.type === type);
};

export const getQuestionsByDifficulty = (difficulty: Question['difficulty']): Question[] => {
  return allQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByIndustry = (industry: string): Question[] => {
  return allQuestions.filter(q =>
    q.industry?.includes(industry as any) || q.industry?.includes('General')
  );
};

export const getRandomQuestions = (count: number, filters?: {
  type?: Question['type'];
  difficulty?: Question['difficulty'];
  industry?: string;
}): Question[] => {
  let filtered = [...allQuestions];

  if (filters?.type) {
    filtered = filtered.filter(q => q.type === filters.type);
  }

  if (filters?.difficulty) {
    filtered = filtered.filter(q => q.difficulty === filters.difficulty);
  }

  if (filters?.industry) {
    filtered = filtered.filter(q =>
      q.industry?.includes(filters.industry as any) || q.industry?.includes('General')
    );
  }

  // Shuffle and return requested count
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const createMockAssessment = (params: {
  questionCount?: number;
  type?: Question['type'];
  difficulty?: Question['difficulty'];
  timeLimit?: number;
}) => {
  const {
    questionCount = 20,
    type,
    difficulty,
    timeLimit,
  } = params;

  const questions = getRandomQuestions(questionCount, { type, difficulty });

  return {
    id: `assessment-${Date.now()}`,
    title: `${type || 'Mixed'} Assessment`,
    questions,
    timeLimit: timeLimit || questions.reduce((sum, q) => sum + (q.timeLimit || 120), 0),
    difficulty: difficulty || 'mid',
    type: type || 'numerical',
  };
};

// Export question counts for statistics
export const questionStats = {
  total: allQuestions.length,
  byType: {
    numerical: numericalQuestions.length,
    verbal: verbalQuestions.length,
    situational: situationalQuestions.length,
    'case-study': caseStudyQuestions.length,
    technical: technicalQuestions.length,
    behavioral: behavioralQuestions.length,
    logical: logicalQuestions.length,
    personality: personalityQuestions.length,
  },
  byDifficulty: {
    entry: allQuestions.filter(q => q.difficulty === 'entry').length,
    mid: allQuestions.filter(q => q.difficulty === 'mid').length,
    senior: allQuestions.filter(q => q.difficulty === 'senior').length,
  },
};

export {
  numericalQuestions,
  verbalQuestions,
  situationalQuestions,
  caseStudyQuestions,
  technicalQuestions,
  behavioralQuestions,
  logicalQuestions,
  personalityQuestions,
};
