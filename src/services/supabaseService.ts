import { supabase, getCurrentUserId } from '../lib/supabase';
import type { Database } from '../types/database';

// Type aliases for easier usage
type Profile = Database['public']['Tables']['profiles']['Row'];
type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type AssessmentResult = Database['public']['Tables']['assessment_results']['Row'];
type BookmarkedQuestion = Database['public']['Tables']['bookmarked_questions']['Row'];
type UserSettings = Database['public']['Tables']['user_settings']['Row'];
type CategoryStatistics = Database['public']['Tables']['category_statistics']['Row'];

// =====================================================
// Authentication Service
// =====================================================

export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// =====================================================
// Profile Service
// =====================================================

export const profileService = {
  // Get user profile
  getProfile: async (userId?: string) => {
    const id = userId || await getCurrentUserId();
    if (!id) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Update user profile
  updateProfile: async (updates: any) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await (supabase as any)
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },
};

// =====================================================
// User Progress Service
// =====================================================

export const progressService = {
  // Get user progress
  getProgress: async () => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  },

  // This is handled automatically by database triggers,
  // but can be used for manual updates if needed
  updateProgress: async (updates: any) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await (supabase as any)
      .from('user_progress')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    return { data, error };
  },
};

// =====================================================
// Assessment Results Service
// =====================================================

export const assessmentService = {
  // Save assessment result
  saveResult: async (result: {
    category: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeTaken: number;
    answers: any[];
  }) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: userId,
        category: result.category,
        score: result.score,
        total_questions: result.totalQuestions,
        correct_answers: result.correctAnswers,
        time_taken: result.timeTaken,
        answers: result.answers as any,
      } as any)
      .select()
      .single();

    return { data, error };
  },

  // Get all assessment results for user
  getResults: async (limit?: number) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    let query = supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get assessment results by category
  getResultsByCategory: async (category: string, limit?: number) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    let query = supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('completed_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get single assessment result
  getResult: async (resultId: string) => {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('id', resultId)
      .single();

    return { data, error };
  },
};

// =====================================================
// Bookmarked Questions Service
// =====================================================

export const bookmarkService = {
  // Add bookmark
  addBookmark: async (questionId: string, category: string, notes?: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('bookmarked_questions')
      .insert({
        user_id: userId,
        question_id: questionId,
        category,
        notes,
      } as any)
      .select()
      .single();

    return { data, error };
  },

  // Remove bookmark
  removeBookmark: async (questionId: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { error } = await supabase
      .from('bookmarked_questions')
      .delete()
      .eq('user_id', userId)
      .eq('question_id', questionId);

    return { error };
  },

  // Get all bookmarks
  getBookmarks: async () => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('bookmarked_questions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Get bookmarks by category
  getBookmarksByCategory: async (category: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('bookmarked_questions')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Check if question is bookmarked
  isBookmarked: async (questionId: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: false, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('bookmarked_questions')
      .select('id')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single();

    return { data: !!data, error };
  },

  // Update bookmark notes
  updateBookmark: async (questionId: string, notes: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await (supabase as any)
      .from('bookmarked_questions')
      .update({ notes })
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .select()
      .single();

    return { data, error };
  },
};

// =====================================================
// User Settings Service
// =====================================================

export const settingsService = {
  // Get user settings
  getSettings: async () => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  },

  // Update user settings
  updateSettings: async (updates: any) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await (supabase as any)
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    return { data, error };
  },
};

// =====================================================
// Category Statistics Service
// =====================================================

export const statisticsService = {
  // Get all category statistics
  getAllStats: async () => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('category_statistics')
      .select('*')
      .eq('user_id', userId)
      .order('last_attempt_at', { ascending: false, nullsFirst: false });

    return { data, error };
  },

  // Get statistics for a specific category
  getCategoryStats: async (category: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('category_statistics')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .single();

    return { data, error };
  },
};

// =====================================================
// Export all services
// =====================================================

export const supabaseService = {
  auth: authService,
  profile: profileService,
  progress: progressService,
  assessment: assessmentService,
  bookmark: bookmarkService,
  settings: settingsService,
  statistics: statisticsService,
};

export default supabaseService;
