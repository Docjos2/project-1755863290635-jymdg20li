import { Search, X, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useJobStore } from '../stores/useJobStore';

export function JobFilters() {
  const { filters, updateFilters, resetFilters } = useJobStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ location: e.target.value });
  };

  const toggleExperienceLevel = (level: string) => {
    const current = filters.experienceLevel;
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    updateFilters({ experienceLevel: updated });
  };

  const toggleShowNew = () => {
    updateFilters({ showOnlyNew: !filters.showOnlyNew });
  };

  const handleSortChange = (sortBy: 'posted_date' | 'matching_score') => {
    updateFilters({ sortBy });
  };

  const handleReset = () => {
    resetFilters();
    setShowAdvanced(false);
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.location ||
    filters.showOnlyNew ||
    filters.experienceLevel.length !== 2;

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek op functietitel of bedrijf..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilters({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
            showAdvanced
              ? 'bg-primary-50 border-primary-500 text-primary-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2">
        {/* New jobs toggle */}
        <button
          onClick={toggleShowNew}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            filters.showOnlyNew
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Alleen nieuwe
        </button>

        {/* Experience level filters */}
        <button
          onClick={() => toggleExperienceLevel('Medior')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filters.experienceLevel.includes('Medior')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Medior
        </button>

        <button
          onClick={() => toggleExperienceLevel('Senior')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filters.experienceLevel.includes('Senior')
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Senior
        </button>

        {/* Sort options */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-sm text-gray-600">Sorteer:</span>
          <button
            onClick={() => handleSortChange('posted_date')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filters.sortBy === 'posted_date'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Datum
          </button>
          <button
            onClick={() => handleSortChange('matching_score')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              filters.sortBy === 'matching_score'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Match
          </button>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 inline mr-1" />
            Reset
          </button>
        )}
      </div>

      {/* Advanced filters panel */}
      {showAdvanced && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          {/* Location filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locatie
            </label>
            <input
              type="text"
              placeholder="Bijv. Amsterdam, Utrecht..."
              value={filters.location}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Experience level checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ervaringsniveau
            </label>
            <div className="space-y-2">
              {['Junior', 'Medior', 'Senior'].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.experienceLevel.includes(level)}
                    onChange={() => toggleExperienceLevel(level)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              💡 <strong>Tip:</strong> Gebruik filters om vacatures te vinden die het beste
              bij jouw ervaring en locatie passen. De "Match" sortering toont vacatures die
              het beste aansluiten bij je assessment voorbereiding.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
