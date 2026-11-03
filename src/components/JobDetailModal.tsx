import React from 'react';
import { X, MapPin, Building, Calendar, Clock, CheckCircle, Shield, Briefcase, GraduationCap, Gift, Sparkles, Send } from 'lucide-react';
import { Job } from '../types/job';
import { formatSalaryDisplay, getDaysLeft } from '../utils/formatters';
import { calculateSalaryTax } from '../utils/taxCalculator';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
  onMatchResume: (job: Job) => void;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  onMatchResume,
  isSaved,
  onToggleSave,
}) => {
  if (!isOpen || !job) return null;

  const daysInfo = getDaysLeft(job.deadline);
  const salaryText = formatSalaryDisplay(
    job.minSalaryPKR,
    job.maxSalaryPKR,
    job.salaryCurrency,
    job.salaryPeriod,
    job.salaryDisclosed
  );

  // Quick tax calculation if salary in PKR
  const midSalary = job.minSalaryPKR && job.maxSalaryPKR ? (job.minSalaryPKR + job.maxSalaryPKR) / 2 : job.minSalaryPKR || 0;
  const taxEst = job.salaryCurrency === 'PKR' && midSalary > 0 ? calculateSalaryTax(midSalary) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-title-heading"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 border ${
              job.isGovernment 
                ? 'bg-amber-100 text-amber-950 border-amber-300' 
                : 'bg-emerald-800 text-white border-emerald-900'
            }`}>
              {job.company.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-800">{job.company}</span>
                {job.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
                {job.isGovernment && (
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-sm border border-amber-300">
                    {job.bpsGrade || 'Government BPS Post'}
                  </span>
                )}
              </div>

              <h2 id="job-title-heading" className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                {job.title}
              </h2>

              {/* Clean unboxed metadata with separators */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.city} {job.locationArea ? `(${job.locationArea})` : ''}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{job.workplaceType}</span>
                <span aria-hidden="true">·</span>
                <span>{job.jobType}</span>
                <span aria-hidden="true">·</span>
                <span>{job.experienceLevel}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Key Facts Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Offered Package</span>
              <span className="text-sm font-bold text-emerald-900 block mt-0.5">{salaryText}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Application Deadline</span>
              <span className={`text-sm font-semibold block mt-0.5 ${daysInfo.isUrgent ? 'text-amber-800' : 'text-slate-800'}`}>
                {daysInfo.label}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Sector</span>
              <span className="text-sm font-semibold text-slate-800 block mt-0.5">{job.sector}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Education Requirement</span>
              <span className="text-sm font-semibold text-slate-800 block mt-0.5 line-clamp-1" title={job.education}>
                {job.education}
              </span>
            </div>
          </div>

          {/* Pakistan FBR Net In-Hand Insight Box */}
          {taxEst && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <span className="font-bold text-emerald-950 block">
                  Estimated Take-Home (Net Salary after FBR Income Tax):
                </span>
                <span className="text-emerald-800">
                  Around <strong>PKR {taxEst.monthlyNet.toLocaleString()} / mo</strong> (FBR deduction: PKR {taxEst.monthlyTax.toLocaleString()} / mo)
                </span>
              </div>
              <span className="text-[11px] text-emerald-900 bg-white/80 px-2 py-1 rounded-md border border-emerald-300 font-semibold">
                Slab #{taxEst.slabNumber}
              </span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Role Overview</h3>
            <p className="leading-relaxed text-slate-600 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Key Responsibilities</h3>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="leading-relaxed">{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Eligibility */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Candidate Requirements & Eligibility</h3>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
                {job.requirements.map((req, i) => (
                  <li key={i} className="leading-relaxed">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Required Core Skills</h3>
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-700">
                {job.skills.map((s, idx) => (
                  <span key={s} className="px-2.5 py-1 bg-slate-100 rounded-md font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits in Pakistan */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-700" />
                <span>Benefits & Allowances</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {job.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-150 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(job.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span>{isSaved ? 'Bookmarked' : 'Save Job'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onMatchResume(job);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg border border-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>AI Match My Resume</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
            >
              Back to List
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onApply(job);
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply for this Job</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
