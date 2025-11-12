export type QuestionType =
  | 'numerical'
  | 'verbal'
  | 'logical'
  | 'abstract'
  | 'situational'
  | 'case-study'
  | 'personality'
  | 'technical'
  | 'behavioral';

export type DifficultyLevel = 'entry' | 'mid' | 'senior';

export type IndustryType =
  | 'Retail'
  | 'FMCG'
  | 'B2B Services'
  | 'Tech'
  | 'Healthcare'
  | 'E-commerce'
  | 'General';

export type RoleType =
  | 'Marketing Manager'
  | 'Communications Manager'
  | 'Brand Manager'
  | 'Digital Marketing Manager';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  industry?: IndustryType[];
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  timeLimit?: number; // in seconds
  resources?: string[];
  tags: string[];
  detailedExplanation?: string;
  points?: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  questions: Question[];
  timeLimit?: number;
  difficulty: DifficultyLevel;
}

export interface AssessmentResult {
  assessmentId: string;
  questionId: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: number;
}

export interface AssessmentSession {
  id: string;
  assessmentId: string;
  startTime: number;
  endTime?: number;
  results: AssessmentResult[];
  score: number;
  totalQuestions: number;
  difficulty: DifficultyLevel;
  type: QuestionType;
}

export interface UserProfile {
  id: string;
  targetRole: RoleType;
  industry: IndustryType;
  experienceYears: number;
  createdAt: number;
}

export interface UserProgress {
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  strongAreas: QuestionType[];
  weakAreas: QuestionType[];
  assessmentHistory: AssessmentSession[];
  bookmarkedQuestions: string[];
}

export interface PerformanceMetrics {
  byType: Record<QuestionType, {
    attempted: number;
    correct: number;
    averageTime: number;
    accuracy: number;
  }>;
  byDifficulty: Record<DifficultyLevel, {
    attempted: number;
    correct: number;
    accuracy: number;
  }>;
  overallAccuracy: number;
  totalTimeSpent: number;
  improvementTrend: number[];
}
