import React from 'react';
import { Bookmark, Building2, Clock, MapPin, CheckCircle2, Trash2, ArrowUpRight } from 'lucide-react';
import { Job, JobApplication } from '../types/job';
import { JobCard } from './JobCard';

interface MyApplicationsViewProps {
  savedJobs: Job[];
  applications: JobApplication[];
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onQuickApply: (job: Job) => void;
  onMatchResume: (job: Job) => void;
  onRemoveApplication: (applicationId: string) => void;
  initialTab?: 'saved' | 'applied';
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({
  savedJobs,
  applications,
  onToggleSave,
  onSelectJob,
  onQuickApply,
  onMatchResume,
  onRemoveApplication,
  initialTab = 'applied',
}) => {
  const [tab, setTab] = React.useState<'applied' | 'saved'>(initialTab);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Candidate Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Saved Jobs & Applications
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('applied')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              tab === 'applied' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Submitted Applications ({applications.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('saved')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              tab === 'saved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4 text-emerald-700" />
            <span>Saved Bookmarks ({savedJobs.length})</span>
          </button>
        </div>
      </div>

      {/* APPLIED TAB */}
      {tab === 'applied' && (
        <div>
          {applications.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Applications Submitted Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the job catalog and click <strong>&quot;Apply Now&quot;</strong> on any Pakistani tech or corporate opening to track your progress here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{app.jobTitle}</span>
                      <span className="text-xs text-slate-500">at {app.company}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.city}</span>
                      <span aria-hidden="true">·</span>
                      <span>Expected: {app.expectedSalaryPKR}</span>
                      <span aria-hidden="true">·</span>
                      <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      Applicant: {app.fullName} ({app.phone})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{app.status}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => onRemoveApplication(app.id)}
                      title="Remove from history"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SAVED TAB */}
      {tab === 'saved' && (
        <div>
          {savedJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
              <Bookmark className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Saved Jobs Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the bookmark icon on any job card to save it for quick review or later application.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={true}
                  onToggleSave={onToggleSave}
                  onSelect={onSelectJob}
                  onQuickApply={onQuickApply}
                  onMatchResume={onMatchResume}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
