import { Building2, MapPin, Calendar, Heart, ExternalLink, CheckCircle2, TrendingUp } from 'lucide-react';
import { Button } from './ui/Button';
import type { EnrichedIndeedJob } from '../lib/supabase';
import { jobsService } from '../services/jobsService';
import { getAssessmentRecommendations } from '../services/jobMatchingService';
import { useJobStore } from '../stores/useJobStore';

interface JobCardProps {
  job: EnrichedIndeedJob;
  onClick?: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const { toggleFavorite, markAsApplied } = useJobStore();

  const recommendations = getAssessmentRecommendations({
    title: job.title,
    company: job.company,
    description: job.description,
    snippet: job.snippet,
    experience_level: job.experience_level,
    matched_assessment_types: job.matched_assessment_types,
  });

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(job.id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(job.job_url, '_blank', 'noopener,noreferrer');
    markAsApplied(job.id);
  };

  const relativeTime = jobsService.getRelativeTime(job.posted_date);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md cursor-pointer ${
        job.is_new ? 'border-l-4 border-l-primary-500' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              {job.is_new && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                  NIEUW
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={job.is_favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 ${
                job.is_favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* Experience Level & Salary */}
        <div className="flex items-center gap-3 mb-3">
          {job.experience_level && (
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                job.experience_level === 'Senior'
                  ? 'bg-purple-100 text-purple-700'
                  : job.experience_level === 'Medior'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {job.experience_level}
            </span>
          )}
          {job.salary && (
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              {job.salary}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{relativeTime}</span>
          </div>
        </div>

        {/* Job snippet */}
        {job.snippet && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{job.snippet}</p>
        )}

        {/* Assessment matching */}
        {job.matched_assessment_types && job.matched_assessment_types.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-medium text-gray-700">
                Aanbevolen assessments
              </span>
              {job.matching_score && job.matching_score > 0 && (
                <span className="text-xs text-gray-500">
                  ({job.matching_score}% match)
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.matched_assessment_types.slice(0, 4).map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {formatAssessmentType(type)}
                </span>
              ))}
              {job.matched_assessment_types.length > 4 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{job.matched_assessment_types.length - 4} meer
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleApply}
            className="flex-1 flex items-center justify-center gap-2"
            disabled={job.is_applied}
          >
            {job.is_applied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Gesolliciteerd
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Bekijk vacature
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to format assessment type names
function formatAssessmentType(type: string): string {
  const typeMap: Record<string, string> = {
    'numerical': 'Numeriek',
    'verbal': 'Verbaal',
    'situational': 'Situationeel',
    'case-study': 'Case Study',
    'technical': 'Technisch',
    'behavioral': 'Gedragsmatig',
    'logical': 'Logisch',
    'personality': 'Persoonlijkheid',
  };
  return typeMap[type] || type;
}
