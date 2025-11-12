import { supabase } from './supabase';
import { UserProfile, UserProgress, AssessmentSession } from '../types';
import { Database } from '../types/database';

type DbUserProfile = Database['public']['Tables']['user_profiles']['Row'];
type DbUserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type DbUserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];
type DbAssessmentSession = Database['public']['Tables']['assessment_sessions']['Insert'];
type DbAssessmentResult = Database['public']['Tables']['assessment_results']['Insert'];

/**
 * Sync user profile to Supabase
 */
export async function syncUserProfile(profile: UserProfile): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const dbProfile: DbUserProfileUpdate = {
    target_role: profile.targetRole,
    industry: profile.industry,
    experience_years: profile.experienceYears,
  };

  const { error } = await supabase
    .from('user_profiles')
    .update(dbProfile)
    .eq('id', user.id);

  if (error) throw error;
}

/**
 * Load user profile from Supabase
 */
export async function loadUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;

  const profile: UserProfile = {
    id: data.id,
    targetRole: data.target_role,
    industry: data.industry,
    experienceYears: data.experience_years,
    createdAt: new Date(data.created_at).getTime(),
  };

  return profile;
}

/**
 * Sync assessment session to Supabase
 */
export async function syncAssessmentSession(session: AssessmentSession): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  // Insert assessment session
  const dbSession: DbAssessmentSession = {
    user_id: user.id,
    assessment_id: session.assessmentId,
    start_time: new Date(session.startTime).toISOString(),
    end_time: session.endTime ? new Date(session.endTime).toISOString() : null,
    score: session.score,
    total_questions: session.totalQuestions,
    difficulty: session.difficulty,
    type: session.type,
  };

  const { data: insertedSession, error: sessionError } = await supabase
    .from('assessment_sessions')
    .insert(dbSession)
    .select()
    .single();

  if (sessionError) throw sessionError;
  if (!insertedSession) throw new Error('Failed to create session');

  // Insert assessment results
  const dbResults: DbAssessmentResult[] = session.results.map(result => ({
    session_id: insertedSession.id,
    user_id: user.id,
    assessment_id: result.assessmentId,
    question_id: result.questionId,
    user_answer: String(result.userAnswer),
    correct_answer: String(result.correctAnswer),
    is_correct: result.isCorrect,
    time_spent: result.timeSpent,
    timestamp: new Date(result.timestamp).toISOString(),
  }));

  const { error: resultsError } = await supabase
    .from('assessment_results')
    .insert(dbResults);

  if (resultsError) throw resultsError;
}

/**
 * Load assessment history from Supabase
 */
export async function loadAssessmentHistory(): Promise<AssessmentSession[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get all sessions with their results
  const { data: sessions, error: sessionsError } = await supabase
    .from('assessment_sessions')
    .select('*, assessment_results(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (sessionsError) throw sessionsError;
  if (!sessions) return [];

  // Transform to AssessmentSession format
  const history: AssessmentSession[] = sessions.map(session => ({
    id: session.id,
    assessmentId: session.assessment_id,
    startTime: new Date(session.start_time).getTime(),
    endTime: session.end_time ? new Date(session.end_time).getTime() : undefined,
    score: Number(session.score),
    totalQuestions: session.total_questions,
    difficulty: session.difficulty as 'entry' | 'mid' | 'senior',
    type: session.type as any,
    results: (session as any).assessment_results.map((result: any) => ({
      assessmentId: result.assessment_id,
      questionId: result.question_id,
      userAnswer: result.user_answer,
      correctAnswer: result.correct_answer,
      isCorrect: result.is_correct,
      timeSpent: result.time_spent,
      timestamp: new Date(result.timestamp).getTime(),
    })),
  }));

  return history;
}

/**
 * Sync bookmarked question
 */
export async function addBookmark(questionId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const { error } = await supabase
    .from('bookmarked_questions')
    .insert({
      user_id: user.id,
      question_id: questionId,
    });

  if (error && error.code !== '23505') { // Ignore duplicate key errors
    throw error;
  }
}

/**
 * Remove bookmarked question
 */
export async function removeBookmark(questionId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const { error } = await supabase
    .from('bookmarked_questions')
    .delete()
    .eq('user_id', user.id)
    .eq('question_id', questionId);

  if (error) throw error;
}

/**
 * Load bookmarked questions
 */
export async function loadBookmarks(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('bookmarked_questions')
    .select('question_id')
    .eq('user_id', user.id);

  if (error) throw error;
  return data?.map(b => b.question_id) || [];
}

/**
 * Load complete user progress from Supabase
 */
export async function loadUserProgress(): Promise<UserProgress> {
  const history = await loadAssessmentHistory();
  const bookmarks = await loadBookmarks();

  // Calculate progress metrics from history
  const completedAssessments = history.filter(s => s.endTime).length;
  const totalScore = history.reduce((sum, s) => sum + s.score, 0);
  const averageScore = completedAssessments > 0 ? totalScore / completedAssessments : 0;

  // Calculate strong and weak areas
  const typeScores: Record<string, { correct: number; total: number }> = {};

  history.forEach((session) => {
    session.results.forEach((result) => {
      if (!typeScores[session.type]) {
        typeScores[session.type] = { correct: 0, total: 0 };
      }
      typeScores[session.type].total++;
      if (result.isCorrect) {
        typeScores[session.type].correct++;
      }
    });
  });

  const typeAccuracies = Object.entries(typeScores).map(([type, scores]) => ({
    type: type as any,
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
    totalAssessments: history.length,
    completedAssessments,
    averageScore,
    strongAreas,
    weakAreas,
    assessmentHistory: history,
    bookmarkedQuestions: bookmarks,
  };
}
