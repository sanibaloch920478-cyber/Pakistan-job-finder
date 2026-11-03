import React from 'react';
import { Bookmark, Building, Clock, MapPin, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Job } from '../types/job';
import { formatSalaryDisplay, getDaysLeft } from '../utils/formatters';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onSelect: (job: Job) => void;
  onQuickApply: (job: Job) => void;
  onMatchResume: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onToggleSave,
  onSelect,
  onQuickApply,
  onMatchResume,
}) => {
  const daysInfo = getDaysLeft(job.deadline);
  const salaryText = formatSalaryDisplay(
    job.minSalaryPKR,
    job.maxSalaryPKR,
    job.salaryCurrency,
    job.salaryPeriod,
    job.salaryDisclosed
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-emerald-600/60 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header: Company & Action Buttons */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Company Avatar / Logo */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border ${
              job.isGovernment 
                ? 'bg-amber-50 text-amber-900 border-amber-200' 
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              {job.company.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-700 tracking-wide">
                  {job.company}
                </span>
                {job.isVerified && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" aria-label="Verified Employer" />
                )}
                {job.isGovernment && (
                  <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded-xs border border-amber-200">
                    {job.bpsGrade || 'Government Gazetted'}
                  </span>
                )}
              </div>

              <h2
                onClick={() => onSelect(job)}
                className="mt-0.5 text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-800 cursor-pointer leading-snug line-clamp-1 group-hover:text-emerald-800 transition-colors"
              >
                {job.title}
              </h2>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title} to bookmarks`}
            className={`p-2 rounded-lg transition-colors border ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-transparent hover:border-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-700' : ''}`} />
          </button>
        </div>

        {/* Clean Unboxed Metadata with Typographic Separators */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.city}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{job.workplaceType}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{job.experienceLevel}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-600">{job.sector}</span>
        </div>

        {/* Job Excerpt */}
        <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tagline - Clean unboxed text */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <span className="text-slate-400 font-medium">Skills:</span>
          {job.skills.slice(0, 4).map((skill, idx) => (
            <React.Fragment key={skill}>
              <span className="text-slate-700 font-medium">{skill}</span>
              {idx < Math.min(job.skills.length - 1, 3) && <span className="text-slate-300">/</span>}
            </React.Fragment>
          ))}
          {job.skills.length > 4 && (
            <span className="text-slate-400 text-[11px]">+{job.skills.length - 4} more</span>
          )}
        </div>
      </div>

      {/* Card Footer: Salary, Deadline, & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-emerald-900 tracking-tight">
            {salaryText}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className={daysInfo.isUrgent ? 'text-amber-700 font-semibold' : ''}>
              {daysInfo.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Match Button */}
          <button
            type="button"
            onClick={() => onMatchResume(job)}
            title="Evaluate your resume match with AI"
            className="p-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">AI Match</span>
          </button>

          {/* Quick Apply / View Details */}
          <button
            type="button"
            onClick={() => onSelect(job)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Details
          </button>

          <button
            type="button"
            onClick={() => onQuickApply(job)}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};
