import { useEffect } from 'react';
import { Briefcase, RefreshCw, AlertCircle } from 'lucide-react';
import { useJobStore } from '../stores/useJobStore';
import { JobCard } from './JobCard';
import { JobFilters } from './JobFilters';
import { Button } from './ui/Button';

export function JobList() {
  const {
    jobs,
    isLoading,
    error,
    newJobsCount,
    fetchJobs,
    fetchNewJobsCount,
    subscribeToJobs,
    unsubscribeFromJobs,
    refreshJobs,
    clearError,
  } = useJobStore();

  useEffect(() => {
    // Initial fetch
    fetchJobs();
    fetchNewJobsCount();

    // Subscribe to real-time updates
    subscribeToJobs();

    // Cleanup
    return () => {
      unsubscribeFromJobs();
    };
  }, []);

  const handleRefresh = async () => {
    await refreshJobs();
    await fetchNewJobsCount();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Briefcase className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Marketing Vacatures</h2>
            <p className="text-sm text-gray-600">
              Actuele vacatures in Nederland
              {newJobsCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full">
                  {newJobsCount} nieuw
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Vernieuwen</span>
        </Button>
      </div>

      {/* Filters */}
      <JobFilters />

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-900">Fout bij laden</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Sluiten
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && jobs.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vacatures laden...</p>
        </div>
      ) : (
        <>
          {/* Job count */}
          {jobs.length > 0 && (
            <div className="text-sm text-gray-600">
              {jobs.length} vacature{jobs.length !== 1 ? 's' : ''} gevonden
            </div>
          )}

          {/* Jobs grid */}
          {jobs.length > 0 ? (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Geen vacatures gevonden
              </h3>
              <p className="text-gray-600 mb-4">
                Probeer je filters aan te passen of vernieuw de pagina
              </p>
              <Button onClick={handleRefresh} variant="outline">
                Vernieuwen
              </Button>
            </div>
          )}

          {/* Info box */}
          {jobs.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-medium text-primary-900 mb-2">
                💡 Voorbereidingstip
              </h3>
              <p className="text-sm text-primary-800">
                Bekijk de aanbevolen assessments bij elke vacature om je voor te bereiden.
                Bedrijven gebruiken vaak specifieke assessment types - oefen deze voordat je
                solliciteert om je kansen te vergroten!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
