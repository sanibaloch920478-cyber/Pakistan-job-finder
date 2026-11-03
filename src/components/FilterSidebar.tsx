import React from 'react';
import { Filter, RotateCcw, Building, Briefcase, MapPin, DollarSign, Layers } from 'lucide-react';
import { City, Sector, WorkplaceType, ExperienceLevel, JobFilterCriteria } from '../types/job';

interface FilterSidebarProps {
  filters: JobFilterCriteria;
  onUpdateFilters: (newFilters: Partial<JobFilterCriteria>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  activeFilterCount,
}) => {
  const sectors: (Sector | 'All Sectors')[] = [
    'All Sectors',
    'Tech & Software',
    'Banking & Fintech',
    'Government & Public (BPS)',
    'FMCG & Manufacturing',
    'Healthcare & Pharma',
    'Telecom & Networks',
    'Education & NGO',
  ];

  const workplaceTypes: (WorkplaceType | 'All')[] = ['All', 'On-site', 'Hybrid', 'Remote'];

  const experienceLevels: (ExperienceLevel | 'All')[] = [
    'All',
    'Fresh Graduate',
    'Entry-level (1-2 yrs)',
    'Mid-level (3-5 yrs)',
    'Senior (5-8 yrs)',
    'Lead / Director (8+ yrs)',
  ];

  const salaryOptions = [
    { label: 'Any Salary', val: 0 },
    { label: 'PKR 100k+ / mo', val: 100000 },
    { label: 'PKR 200k+ / mo', val: 200000 },
    { label: 'PKR 350k+ / mo', val: 350000 },
    { label: 'PKR 500k+ / mo', val: 500000 },
    { label: 'PKR 1M+ / mo (USD/Staff)', val: 1000000 },
  ];

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-800" />
          <h2 className="text-sm font-bold text-slate-900">Filter Jobs</h2>
          {activeFilterCount > 0 && (
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-slate-500 hover:text-emerald-800 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label htmlFor="filter-sort-by" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          id="filter-sort-by"
          value={filters.sortBy || 'recent'}
          onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white cursor-pointer"
        >
          <option value="recent">Most Recently Posted</option>
          <option value="salary_desc">Highest Offered Salary (PKR)</option>
          <option value="deadline_asc">Closing Soonest (Deadline)</option>
        </select>
      </div>

      {/* Sector Category */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Industry / Sector</span>
        </label>
        <div className="space-y-1">
          {sectors.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onUpdateFilters({ sector: s })}
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                (filters.sector || 'All Sectors') === s
                  ? 'bg-emerald-50 text-emerald-900 font-bold border-l-2 border-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="truncate">{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Workplace Mode */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>Workplace Setup</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {workplaceTypes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onUpdateFilters({ workplaceType: mode })}
              className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
                (filters.workplaceType || 'All') === mode
                  ? 'bg-emerald-900 text-white border-emerald-900 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label htmlFor="filter-experience-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Experience Level
        </label>
        <select
          id="filter-experience-select"
          value={filters.experienceLevel || 'All'}
          onChange={(e) => onUpdateFilters({ experienceLevel: e.target.value as any })}
          className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white cursor-pointer"
        >
          {experienceLevels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Salary Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          <span>Minimum Monthly Salary</span>
        </label>
        <div className="space-y-1">
          {salaryOptions.map((opt) => (
            <label
              key={opt.val}
              className={`flex items-center gap-2 p-1.5 rounded-md text-xs cursor-pointer ${
                (filters.minSalary || 0) === opt.val
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="minSalary"
                checked={(filters.minSalary || 0) === opt.val}
                onChange={() => onUpdateFilters({ minSalary: opt.val })}
                className="text-emerald-700 focus:ring-emerald-600"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
