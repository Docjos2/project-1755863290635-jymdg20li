import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  UserProgress,
  AssessmentSession,
  AssessmentResult,
  Question,
  QuestionType,
  DifficultyLevel,
  RoleType,
  IndustryType,
} from '../types';
import { supabaseService } from '../services/supabaseService';
import { useAuthStore } from './useAuthStore';

interface AppState {
  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // User Progress
  userProgress: UserProgress;
  addAssessmentSession: (session: AssessmentSession) => Promise<void>;
  bookmarkQuestion: (questionId: string, category: string) => Promise<void>;
  unbookmarkQuestion: (questionId: string) => Promise<void>;

  // Supabase sync
  loadUserData: () => Promise<void>;
  isAuthenticated: () => boolean;

  // Current Assessment
  currentAssessment: {
    questions: Question[];
    currentQuestionIndex: number;
    answers: Record<string, string | number>;
    startTime: number | null;
    timeRemaining: number | null;
    isTimerActive: boolean;
  };

  startAssessment: (questions: Question[], timeLimit?: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitAnswer: (questionId: string, answer: string | number) => void;
  finishAssessment: () => AssessmentSession;
  resetAssessment: () => void;
  updateTimer: (timeRemaining: number) => void;
  toggleTimer: () => void;

  // UI State
  showExplanations: boolean;
  setShowExplanations: (show: boolean) => void;

  // Filters
  filters: {
    type: QuestionType | 'all';
    difficulty: DifficultyLevel | 'all';
    industry: IndustryType | 'all';
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;
}

const initialProgress: UserProgress = {
  totalAssessments: 0,
  completedAssessments: 0,
  averageScore: 0,
  strongAreas: [],
  weakAreas: [],
  assessmentHistory: [],
  bookmarkedQuestions: [],
};

const initialAssessment = {
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  startTime: null,
  timeRemaining: null,
  isTimerActive: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      userProfile: null,
      userProgress: initialProgress,
      currentAssessment: initialAssessment,
      showExplanations: true,
      filters: {
        type: 'all',
        difficulty: 'all',
        industry: 'all',
      },

      // User Profile Actions
      setUserProfile: (profile) => set({ userProfile: profile }),

      updateUserProfile: (updates) =>
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, ...updates }
            : null,
        })),

      // Helper methods
      isAuthenticated: () => {
        const authState = useAuthStore.getState();
        return !!authState.user;
      },

      loadUserData: async () => {
        const authState = useAuthStore.getState();
        if (!authState.user) return;

        try {
          // Load user progress
          const { data: progressData } = await supabaseService.progress.getProgress();

          // Load bookmarks
          const { data: bookmarksData } = await supabaseService.bookmark.getBookmarks();

          // Load assessment results
          const { data: resultsData } = await supabaseService.assessment.getResults();

          if (progressData || bookmarksData || resultsData) {
            const bookmarkedQuestions = bookmarksData?.map((b: any) => b.question_id) || [];

            // Convert Supabase results to AssessmentSession format
            const assessmentHistory: AssessmentSession[] = resultsData?.map((result: any) => ({
              id: result.id,
              assessmentId: result.id,
              startTime: new Date(result.created_at).getTime(),
              endTime: new Date(result.completed_at).getTime(),
              results: (result.answers as any[]) || [],
              score: result.score,
              totalQuestions: result.total_questions,
              difficulty: 'mid' as DifficultyLevel,
              type: result.category as QuestionType,
            })) || [];

            set({
              userProgress: {
                totalAssessments: (progressData as any)?.total_questions_attempted || 0,
                completedAssessments: resultsData?.length || 0,
                averageScore: (progressData as any)?.average_score || 0,
                strongAreas: [],
                weakAreas: [],
                assessmentHistory,
                bookmarkedQuestions,
              },
            });
          }
        } catch (error) {
          console.error('Failed to load user data from Supabase:', error);
        }
      },

      // Progress Actions
      addAssessmentSession: async (session) => {
        set((state) => {
          const newHistory = [...state.userProgress.assessmentHistory, session];
          const totalScore = newHistory.reduce((sum, s) => sum + s.score, 0);
          const averageScore = totalScore / newHistory.length;

          // Calculate strong and weak areas
          const typeScores: Record<string, { correct: number; total: number }> = {};

          newHistory.forEach((sess) => {
            sess.results.forEach((result) => {
              const question = sess.results.find(r => r.questionId === result.questionId);
              if (question) {
                if (!typeScores[sess.type]) {
                  typeScores[sess.type] = { correct: 0, total: 0 };
                }
                typeScores[sess.type].total++;
                if (result.isCorrect) {
                  typeScores[sess.type].correct++;
                }
              }
            });
          });

          const typeAccuracies = Object.entries(typeScores).map(([type, scores]) => ({
            type: type as QuestionType,
            accuracy: scores.correct / scores.total,
          }));

          const sortedTypes = typeAccuracies.sort((a, b) => b.accuracy - a.accuracy);
          const strongAreas = sortedTypes
            .slice(0, 3)
            .filter((t) => t.accuracy > 0.7)
            .map((t) => t.type);
          const weakAreas = sortedTypes
            .slice(-3)
            .filter((t) => t.accuracy < 0.6)
            .map((t) => t.type);

          return {
            userProgress: {
              ...state.userProgress,
              totalAssessments: state.userProgress.totalAssessments + 1,
              completedAssessments: state.userProgress.completedAssessments + 1,
              averageScore,
              strongAreas,
              weakAreas,
              assessmentHistory: newHistory,
            },
          };
        });

        // Sync to Supabase if authenticated
        const authState = useAuthStore.getState();
        if (authState.user) {
          try {
            const endTime = session.endTime || Date.now();
            const startTime = session.startTime || Date.now();
            await supabaseService.assessment.saveResult({
              category: session.type,
              score: session.score,
              totalQuestions: session.totalQuestions,
              correctAnswers: session.results.filter(r => r.isCorrect).length,
              timeTaken: Math.floor((endTime - startTime) / 1000),
              answers: session.results,
            });
          } catch (error) {
            console.error('Failed to sync assessment to Supabase:', error);
          }
        }
      },

      bookmarkQuestion: async (questionId, category) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            bookmarkedQuestions: [
              ...state.userProgress.bookmarkedQuestions,
              questionId,
            ],
          },
        }));

        // Sync to Supabase if authenticated
        const authState = useAuthStore.getState();
        if (authState.user) {
          try {
            await supabaseService.bookmark.addBookmark(questionId, category);
          } catch (error) {
            console.error('Failed to sync bookmark to Supabase:', error);
          }
        }
      },

      unbookmarkQuestion: async (questionId) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            bookmarkedQuestions: state.userProgress.bookmarkedQuestions.filter(
              (id) => id !== questionId
            ),
          },
        }));

        // Sync to Supabase if authenticated
        const authState = useAuthStore.getState();
        if (authState.user) {
          try {
            await supabaseService.bookmark.removeBookmark(questionId);
          } catch (error) {
            console.error('Failed to remove bookmark from Supabase:', error);
          }
        }
      },

      // Assessment Actions
      startAssessment: (questions, timeLimit) =>
        set({
          currentAssessment: {
            questions,
            currentQuestionIndex: 0,
            answers: {},
            startTime: Date.now(),
            timeRemaining: timeLimit || null,
            isTimerActive: true,
          },
        }),

      nextQuestion: () =>
        set((state) => ({
          currentAssessment: {
            ...state.currentAssessment,
            currentQuestionIndex: Math.min(
              state.currentAssessment.currentQuestionIndex + 1,
              state.currentAssessment.questions.length - 1
            ),
          },
        })),

      previousQuestion: () =>
        set((state) => ({
          currentAssessment: {
            ...state.currentAssessment,
            currentQuestionIndex: Math.max(
              state.currentAssessment.currentQuestionIndex - 1,
              0
            ),
          },
        })),

      goToQuestion: (index) =>
        set((state) => ({
          currentAssessment: {
            ...state.currentAssessment,
            currentQuestionIndex: index,
          },
        })),

      submitAnswer: (questionId, answer) =>
        set((state) => ({
          currentAssessment: {
            ...state.currentAssessment,
            answers: {
              ...state.currentAssessment.answers,
              [questionId]: answer,
            },
          },
        })),

      finishAssessment: () => {
        const state = get();
        const { questions, answers, startTime } = state.currentAssessment;

        const results: AssessmentResult[] = questions.map((question) => {
          const userAnswer = answers[question.id];
          const isCorrect = String(userAnswer) === String(question.correctAnswer);

          return {
            assessmentId: `assessment-${Date.now()}`,
            questionId: question.id,
            userAnswer: userAnswer || '',
            correctAnswer: question.correctAnswer,
            isCorrect,
            timeSpent: 0, // Calculate based on individual question timing if tracked
            timestamp: Date.now(),
          };
        });

        const correctAnswers = results.filter((r) => r.isCorrect).length;
        const score = (correctAnswers / questions.length) * 100;

        const session: AssessmentSession = {
          id: `session-${Date.now()}`,
          assessmentId: `assessment-${Date.now()}`,
          startTime: startTime || Date.now(),
          endTime: Date.now(),
          results,
          score,
          totalQuestions: questions.length,
          difficulty: questions[0]?.difficulty || 'mid',
          type: questions[0]?.type || 'numerical',
        };

        state.addAssessmentSession(session);

        return session;
      },

      resetAssessment: () => set({ currentAssessment: initialAssessment }),

      updateTimer: (timeRemaining) =>
        set((state) => ({
          currentAssessment: {
            ...state.currentAssessment,
            timeRemaining,
          },
        })),

      toggleTimer: () =>
        set((state) => ({
          currentAssessment: {
            ...state.currentAssessment,
            isTimerActive: !state.currentAssessment.isTimerActive,
          },
        })),

      // UI Actions
      setShowExplanations: (show) => set({ showExplanations: show }),

      // Filter Actions
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
    }),
    {
      name: 'marketing-assessment-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        userProgress: state.userProgress,
      }),
    }
  )
);
