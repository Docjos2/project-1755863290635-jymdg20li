import { supabase, type IndeedJob, type EnrichedIndeedJob } from '../lib/supabase';

// Filter options for job queries
export interface JobFilters {
  experienceLevel?: string[];
  location?: string;
  searchQuery?: string;
  isNew?: boolean;
  isFavorited?: boolean;
  isApplied?: boolean;
  matchedAssessmentTypes?: string[];
  limit?: number;
  sortBy?: 'posted_date' | 'matching_score' | 'scraped_at';
  sortOrder?: 'asc' | 'desc';
}

// Job statistics
export interface JobStats {
  total_jobs: number;
  new_jobs: number;
  favorited_jobs: number;
  applied_jobs: number;
  medior_jobs: number;
  senior_jobs: number;
  jobs_last_24h: number;
}

/**
 * Service for interacting with Indeed jobs in Supabase
 */
export const jobsService = {
  /**
   * Fetch jobs with optional filters
   */
  async getJobs(filters?: JobFilters): Promise<EnrichedIndeedJob[]> {
    try {
      let query = supabase
        .from('indeed_jobs')
        .select('*');

      // Apply filters
      if (filters?.experienceLevel?.length) {
        query = query.in('experience_level', filters.experienceLevel);
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.searchQuery) {
        query = query.or(
          `title.ilike.%${filters.searchQuery}%,company.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
        );
      }

      if (filters?.isNew !== undefined) {
        query = query.eq('is_new', filters.isNew);
      }

      if (filters?.isFavorited !== undefined) {
        query = query.eq('is_favorited', filters.isFavorited);
      }

      if (filters?.isApplied !== undefined) {
        query = query.eq('is_applied', filters.isApplied);
      }

      if (filters?.matchedAssessmentTypes?.length) {
        query = query.overlaps('matched_assessment_types', filters.matchedAssessmentTypes);
      }

      // Sorting
      const sortBy = filters?.sortBy || 'posted_date';
      const sortOrder = filters?.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Limit
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      // Enrich jobs with computed fields
      return (data || []).map(job => this.enrichJob(job));
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      return [];
    }
  },

  /**
   * Get a single job by ID
   */
  async getJobById(jobId: string): Promise<EnrichedIndeedJob | null> {
    try {
      const { data, error } = await supabase
        .from('indeed_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data ? this.enrichJob(data) : null;
    } catch (error) {
      console.error('Failed to fetch job:', error);
      return null;
    }
  },

  /**
   * Get count of new jobs
   */
  async getNewJobsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('indeed_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('is_new', true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Failed to fetch new jobs count:', error);
      return 0;
    }
  },

  /**
   * Get job statistics
   */
  async getJobStats(): Promise<JobStats | null> {
    try {
      const { data, error } = await supabase.rpc('get_job_stats');

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to fetch job stats:', error);
      return null;
    }
  },

  /**
   * Mark job as read
   */
  async markAsRead(jobId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('indeed_jobs')
        .update({ is_read: true, is_new: false })
        .eq('id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to mark job as read:', error);
      return false;
    }
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(jobId: string, isFavorited: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('indeed_jobs')
        .update({ is_favorited: isFavorited })
        .eq('id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return false;
    }
  },

  /**
   * Mark job as applied
   */
  async markAsApplied(jobId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('indeed_jobs')
        .update({
          is_applied: true,
          applied_at: new Date().toISOString(),
        })
        .eq('id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to mark job as applied:', error);
      return false;
    }
  },

  /**
   * Get favorite jobs
   */
  async getFavorites(): Promise<EnrichedIndeedJob[]> {
    return this.getJobs({ isFavorited: true });
  },

  /**
   * Get applied jobs
   */
  async getAppliedJobs(): Promise<EnrichedIndeedJob[]> {
    return this.getJobs({ isApplied: true });
  },

  /**
   * Get top matched jobs (high matching score)
   */
  async getTopMatchedJobs(limit: number = 10): Promise<EnrichedIndeedJob[]> {
    try {
      const { data, error } = await supabase
        .from('top_matched_jobs')
        .select('*')
        .limit(limit);

      if (error) throw error;
      return (data || []).map(job => this.enrichJob(job as IndeedJob));
    } catch (error) {
      console.error('Failed to fetch top matched jobs:', error);
      return [];
    }
  },

  /**
   * Get recent jobs (last 7 days)
   */
  async getRecentJobs(limit: number = 20): Promise<EnrichedIndeedJob[]> {
    try {
      const { data, error } = await supabase
        .from('recent_jobs')
        .select('*')
        .limit(limit);

      if (error) throw error;
      return (data || []).map(job => this.enrichJob(job as IndeedJob));
    } catch (error) {
      console.error('Failed to fetch recent jobs:', error);
      return [];
    }
  },

  /**
   * Subscribe to real-time job insertions
   */
  subscribeToNewJobs(callback: (job: EnrichedIndeedJob) => void) {
    const channel = supabase
      .channel('new_jobs_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'indeed_jobs',
        },
        (payload) => {
          const newJob = this.enrichJob(payload.new as IndeedJob);
          callback(newJob);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },

  /**
   * Enrich job with computed fields
   */
  enrichJob(job: IndeedJob): EnrichedIndeedJob {
    const postedDate = new Date(job.posted_date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postedDate.getTime());
    const daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isRecentlyPosted = daysAgo <= 3;
    const matchPercentage = job.matching_score || 0;

    return {
      ...job,
      daysAgo,
      isRecentlyPosted,
      matchPercentage,
    };
  },

  /**
   * Format relative time (e.g., "2 days ago")
   */
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Vandaag';
    if (diffDays === 1) return 'Gisteren';
    if (diffDays < 7) return `${diffDays} dagen geleden`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`;
    return `${Math.floor(diffDays / 30)} maanden geleden`;
  },
};
