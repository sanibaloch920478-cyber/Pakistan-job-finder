/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { ApplyModal } from './components/ApplyModal';
import { SalaryTaxCalculator } from './components/SalaryTaxCalculator';
import { AiCareerHub } from './components/AiCareerHub';
import { MyApplicationsView } from './components/MyApplicationsView';
import { PostJobModal } from './components/PostJobModal';
import { FilterSidebar } from './components/FilterSidebar';
import { INITIAL_JOBS } from './data/initialJobs';
import { Job, JobFilterCriteria, JobApplication, City, Sector } from './types/job';
import { filterAndSortJobs } from './utils/jobFilter';
import { Briefcase, Building, ShieldCheck, Heart, Sparkles, Filter } from 'lucide-react';

export default function App() {
  // Jobs catalog state
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('pk_job_finder_jobs_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved jobs:', e);
    }
    return INITIAL_JOBS;
  });

  // Saved job IDs
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pk_job_finder_saved');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved IDs:', e);
    }
    return [];
  });

  // Applications
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem('pk_job_finder_apps');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse applications:', e);
    }
    return [];
  });

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'jobs' | 'calculator' | 'ai' | 'saved' | 'my-applications'>('jobs');

  // Filter criteria
  const [filters, setFilters] = useState<JobFilterCriteria>({
    query: '',
    city: 'All Cities',
    sector: 'All Sectors',
    workplaceType: 'All',
    jobType: 'All',
    experienceLevel: 'All',
    govFilter: 'all',
    minSalary: 0,
    sortBy: 'recent',
  });

  // Modals state
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [selectedJobForAi, setSelectedJobForAi] = useState<Job | null>(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pk_job_finder_jobs_v2', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('pk_job_finder_saved', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('pk_job_finder_apps', JSON.stringify(applications));
  }, [applications]);

  // URL Query param listener
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['jobs', 'calculator', 'ai', 'saved', 'my-applications'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
    const cityParam = params.get('city');
    if (cityParam) {
      setFilters((prev) => ({ ...prev, city: cityParam as City }));
    }
  }, []);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return filterAndSortJobs(jobs, filters);
  }, [jobs, filters]);

  // Saved jobs list
  const savedJobsList = useMemo(() => {
    return jobs.filter((j) => savedJobIds.includes(j.id));
  }, [jobs, savedJobIds]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.city && filters.city !== 'All Cities') count++;
    if (filters.sector && filters.sector !== 'All Sectors') count++;
    if (filters.workplaceType && filters.workplaceType !== 'All') count++;
    if (filters.experienceLevel && filters.experienceLevel !== 'All') count++;
    if (filters.govFilter && filters.govFilter !== 'all') count++;
    if (filters.minSalary && filters.minSalary > 0) count++;
    return count;
  }, [filters]);

  const handleToggleSave = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleUpdateFilters = (newFilters: Partial<JobFilterCriteria>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      city: 'All Cities',
      sector: 'All Sectors',
      workplaceType: 'All',
      jobType: 'All',
      experienceLevel: 'All',
      govFilter: 'all',
      minSalary: 0,
      sortBy: 'recent',
    });
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleSubmitApplication = (application: JobApplication) => {
    setApplications((prev) => [application, ...prev]);
  };

  const handleRemoveApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
  };

  const handleOpenAiWithJob = (job: Job) => {
    setSelectedJobForAi(job);
    setActiveTab('ai');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedJobIds.length}
        appliedCount={applications.length}
        onPostJobClick={() => setIsPostJobOpen(true)}
        selectedCity={filters.city || 'All Cities'}
        onSelectCity={(city) => handleUpdateFilters({ city })}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* TAB 1: JOBS DISCOVERY */}
        {activeTab === 'jobs' && (
          <div>
            <HeroSection
              searchQuery={filters.query || ''}
              setSearchQuery={(query) => handleUpdateFilters({ query })}
              selectedCity={filters.city || 'All Cities'}
              setSelectedCity={(city) => handleUpdateFilters({ city })}
              selectedSector={filters.sector || 'All Sectors'}
              setSelectedSector={(sector) => handleUpdateFilters({ sector })}
              govFilter={filters.govFilter || 'all'}
              setGovFilter={(govFilter) => handleUpdateFilters({ govFilter })}
              totalJobsCount={filteredJobs.length}
              onOpenAi={() => setActiveTab('ai')}
            />

            {/* Catalog Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="px-3.5 py-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-800 shadow-xs flex items-center gap-2"
                >
                  <Filter className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                </button>

                <span className="text-xs text-slate-500 font-medium">
                  Showing <strong>{filteredJobs.length}</strong> positions
                </span>
              </div>

              {/* Two Column Layout: Sidebar + Jobs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Desktop & Mobile Filter Sidebar */}
                <div className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                  <FilterSidebar
                    filters={filters}
                    onUpdateFilters={handleUpdateFilters}
                    onResetFilters={handleResetFilters}
                    activeFilterCount={activeFilterCount}
                  />
                </div>

                {/* Main Job Cards Feed (9 cols) */}
                <div className="lg:col-span-9 space-y-4">
                  {/* Results Count & Active Chips Bar */}
                  <div className="hidden lg:flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>Found <strong>{filteredJobs.length}</strong> verified opportunities in Pakistan</span>
                      {filters.city !== 'All Cities' && (
                        <span className="text-slate-700 font-semibold">· in {filters.city}</span>
                      )}
                      {filters.sector !== 'All Sectors' && (
                        <span className="text-slate-700 font-semibold">· {filters.sector}</span>
                      )}
                    </div>
                  </div>

                  {filteredJobs.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                      <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
                      <h3 className="text-base font-bold text-slate-800">No Matching Jobs Found</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try adjusting your keyword query, switching cities, or resetting the filters.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-block"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isSaved={savedJobIds.includes(job.id)}
                          onToggleSave={handleToggleSave}
                          onSelect={(j) => setSelectedJobForModal(j)}
                          onQuickApply={(j) => setSelectedJobForApply(j)}
                          onMatchResume={(j) => handleOpenAiWithJob(j)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SALARY & FBR TAX CALCULATOR */}
        {activeTab === 'calculator' && <SalaryTaxCalculator />}

        {/* TAB 3: AI COPILOT */}
        {activeTab === 'ai' && (
          <AiCareerHub
            jobs={jobs}
            selectedJobForReview={selectedJobForAi}
            onClearSelectedJob={() => setSelectedJobForAi(null)}
          />
        )}

        {/* TAB 4: SAVED JOBS */}
        {activeTab === 'saved' && (
          <MyApplicationsView
            savedJobs={savedJobsList}
            applications={applications}
            onToggleSave={handleToggleSave}
            onSelectJob={(j) => setSelectedJobForModal(j)}
            onQuickApply={(j) => setSelectedJobForApply(j)}
            onMatchResume={(j) => handleOpenAiWithJob(j)}
            onRemoveApplication={handleRemoveApplication}
            initialTab="saved"
          />
        )}

        {/* TAB 5: APPLIED JOBS */}
        {activeTab === 'my-applications' && (
          <MyApplicationsView
            savedJobs={savedJobsList}
            applications={applications}
            onToggleSave={handleToggleSave}
            onSelectJob={(j) => setSelectedJobForModal(j)}
            onQuickApply={(j) => setSelectedJobForApply(j)}
            onMatchResume={(j) => handleOpenAiWithJob(j)}
            onRemoveApplication={handleRemoveApplication}
            initialTab="applied"
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  PJ
                </div>
                <span className="text-white font-bold text-sm">Pakistan Job Finder</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Pakistan&apos;s verified career platform connecting professionals with software houses, corporate enterprises, Islamic banks, and federal/provincial civil services.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Top Employment Cities
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => {
                      handleUpdateFilters({ city: 'Lahore' });
                      setActiveTab('jobs');
                    }}
                    className="hover:text-emerald-400 text-left"
                  >
                    Jobs in Lahore (Gulberg, DHA, Johar Town)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleUpdateFilters({ city: 'Karachi' });
                      setActiveTab('jobs');
                    }}
                    className="hover:text-emerald-400 text-left"
                  >
                    Jobs in Karachi (Clifton, I.I. Chundrigar, Shahrah-e-Faisal)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleUpdateFilters({ city: 'Islamabad' });
                      setActiveTab('jobs');
                    }}
                    className="hover:text-emerald-400 text-left"
                  >
                    Jobs in Islamabad (Blue Area, F-8, I-9)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleUpdateFilters({ city: 'Remote (Worldwide)' });
                      setActiveTab('jobs');
                    }}
                    className="hover:text-emerald-400 text-left"
                  >
                    Remote USD Developer Roles
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Tools & Resources
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('calculator')} className="hover:text-emerald-400 text-left">
                    FBR Salary Tax Calculator (2024-2026)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('ai')} className="hover:text-emerald-400 text-left">
                    AI Resume & ATS Checker
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('ai')} className="hover:text-emerald-400 text-left">
                    Urdu Career Counseling (روشن مستقبل)
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsPostJobOpen(true)} className="hover:text-emerald-400 text-left">
                    Post a Verified Job in Pakistan
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Statutory Guidelines
              </h4>
              <p className="text-slate-400 leading-relaxed mb-2">
                All public gazetted posts adhere to FPSC/PPSC/NTS regulations and Federal Government salary pay scales.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Employers Only</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Pakistan Job Finder. Built for Pakistani Job Seekers &amp; Employers.
            </div>
            <div className="font-urdu text-xs text-slate-400">
              پاکستان کے روشن اور محفوظ مستقبل کے لیے
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JobDetailModal
        job={selectedJobForModal}
        isOpen={Boolean(selectedJobForModal)}
        onClose={() => setSelectedJobForModal(null)}
        onApply={(j) => setSelectedJobForApply(j)}
        onMatchResume={(j) => handleOpenAiWithJob(j)}
        isSaved={selectedJobForModal ? savedJobIds.includes(selectedJobForModal.id) : false}
        onToggleSave={handleToggleSave}
      />

      <ApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        onSubmitApplication={handleSubmitApplication}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
}
