import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnrichedIndeedJob } from '../lib/supabase';
import { jobsService, type JobFilters } from '../services/jobsService';

interface JobState {
  // Data
  jobs: EnrichedIndeedJob[];
  favorites: EnrichedIndeedJob[];
  appliedJobs: EnrichedIndeedJob[];
  selectedJob: EnrichedIndeedJob | null;
  newJobsCount: number;

  // UI State
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;

  // Filters
  filters: {
    experienceLevel: string[];
    location: string;
    searchQuery: string;
    showOnlyNew: boolean;
    sortBy: 'posted_date' | 'matching_score';
  };

  // Real-time subscription
  subscription: { unsubscribe: () => void } | null;

  // Actions
  fetchJobs: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  fetchAppliedJobs: () => Promise<void>;
  fetchNewJobsCount: () => Promise<void>;
  updateFilters: (filters: Partial<JobState['filters']>) => void;
  resetFilters: () => void;
  markAsRead: (jobId: string) => Promise<void>;
  toggleFavorite: (jobId: string) => Promise<void>;
  markAsApplied: (jobId: string) => Promise<void>;
  selectJob: (job: EnrichedIndeedJob | null) => void;
  subscribeToJobs: () => void;
  unsubscribeFromJobs: () => void;
  clearError: () => void;
  refreshJobs: () => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      // Initial state
      jobs: [],
      favorites: [],
      appliedJobs: [],
      selectedJob: null,
      newJobsCount: 0,
      isLoading: false,
      error: null,
      lastFetch: null,
      subscription: null,

      filters: {
        experienceLevel: ['Medior', 'Senior'],
        location: '',
        searchQuery: '',
        showOnlyNew: false,
        sortBy: 'posted_date',
      },

      // Fetch jobs with current filters
      fetchJobs: async () => {
        const state = get();

        // Check cache
        if (
          state.lastFetch &&
          Date.now() - state.lastFetch < CACHE_DURATION &&
          state.jobs.length > 0
        ) {
          return; // Use cached data
        }

        set({ isLoading: true, error: null });

        try {
          const filters: JobFilters = {
            experienceLevel: state.filters.experienceLevel,
            location: state.filters.location || undefined,
            searchQuery: state.filters.searchQuery || undefined,
            isNew: state.filters.showOnlyNew || undefined,
            sortBy: state.filters.sortBy,
            sortOrder: 'desc',
          };

          const jobs = await jobsService.getJobs(filters);

          set({
            jobs,
            isLoading: false,
            lastFetch: Date.now(),
          });
        } catch (error) {
          console.error('Failed to fetch jobs:', error);
          set({
            error: 'Failed to load jobs. Please try again.',
            isLoading: false,
          });
        }
      },

      // Fetch favorite jobs
      fetchFavorites: async () => {
        try {
          const favorites = await jobsService.getFavorites();
          set({ favorites });
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
        }
      },

      // Fetch applied jobs
      fetchAppliedJobs: async () => {
        try {
          const appliedJobs = await jobsService.getAppliedJobs();
          set({ appliedJobs });
        } catch (error) {
          console.error('Failed to fetch applied jobs:', error);
        }
      },

      // Fetch count of new jobs
      fetchNewJobsCount: async () => {
        try {
          const count = await jobsService.getNewJobsCount();
          set({ newJobsCount: count });
        } catch (error) {
          console.error('Failed to fetch new jobs count:', error);
        }
      },

      // Update filters and refresh jobs
      updateFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          lastFetch: null, // Invalidate cache
        }));
        get().fetchJobs();
      },

      // Reset filters to default
      resetFilters: () => {
        set({
          filters: {
            experienceLevel: ['Medior', 'Senior'],
            location: '',
            searchQuery: '',
            showOnlyNew: false,
            sortBy: 'posted_date',
          },
          lastFetch: null,
        });
        get().fetchJobs();
      },

      // Mark job as read
      markAsRead: async (jobId) => {
        const success = await jobsService.markAsRead(jobId);

        if (success) {
          set((state) => ({
            jobs: state.jobs.map((job) =>
              job.id === jobId ? { ...job, is_read: true, is_new: false } : job
            ),
          }));
          get().fetchNewJobsCount();
        }
      },

      // Toggle favorite status
      toggleFavorite: async (jobId) => {
        const state = get();
        const job = state.jobs.find((j) => j.id === jobId);
        if (!job) return;

        const newFavoritedState = !job.is_favorited;
        const success = await jobsService.toggleFavorite(jobId, newFavoritedState);

        if (success) {
          set((state) => ({
            jobs: state.jobs.map((j) =>
              j.id === jobId ? { ...j, is_favorited: newFavoritedState } : j
            ),
          }));

          // Update favorites list
          get().fetchFavorites();
        }
      },

      // Mark job as applied
      markAsApplied: async (jobId) => {
        const success = await jobsService.markAsApplied(jobId);

        if (success) {
          const now = new Date().toISOString();
          set((state) => ({
            jobs: state.jobs.map((job) =>
              job.id === jobId
                ? { ...job, is_applied: true, applied_at: now }
                : job
            ),
          }));

          // Update applied jobs list
          get().fetchAppliedJobs();
        }
      },

      // Select a job for detail view
      selectJob: (job) => {
        set({ selectedJob: job });

        // Mark as read when viewed
        if (job && !job.is_read) {
          get().markAsRead(job.id);
        }
      },

      // Subscribe to real-time job updates
      subscribeToJobs: () => {
        const state = get();

        // Don't subscribe if already subscribed
        if (state.subscription) return;

        const subscription = jobsService.subscribeToNewJobs((newJob) => {
          // Add new job to the list
          set((state) => ({
            jobs: [newJob, ...state.jobs],
            newJobsCount: state.newJobsCount + 1,
          }));

          // Show browser notification if supported and permitted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nieuwe Marketing Vacature! 🎯', {
              body: `${newJob.title} bij ${newJob.company}`,
              icon: '/favicon.ico',
              tag: newJob.id,
            });
          }
        });

        set({ subscription });
      },

      // Unsubscribe from real-time updates
      unsubscribeFromJobs: () => {
        const state = get();
        if (state.subscription) {
          state.subscription.unsubscribe();
          set({ subscription: null });
        }
      },

      // Clear error message
      clearError: () => {
        set({ error: null });
      },

      // Force refresh jobs (bypass cache)
      refreshJobs: async () => {
        set({ lastFetch: null });
        await get().fetchJobs();
      },
    }),
    {
      name: 'job-storage',
      // Only persist filters and favorites/applied status
      partialize: (state) => ({
        filters: state.filters,
        lastFetch: state.lastFetch,
      }),
    }
  )
);

// Request notification permission on first load
if (typeof window !== 'undefined' && 'Notification' in window) {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
