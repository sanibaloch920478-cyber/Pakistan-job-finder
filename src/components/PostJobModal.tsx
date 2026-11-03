import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, Building, AlertCircle } from 'lucide-react';
import { City, Sector, WorkplaceType, JobType, ExperienceLevel, Job } from '../types/job';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (newJob: Job) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState<City>('Lahore');
  const [locationArea, setLocationArea] = useState('');
  const [sector, setSector] = useState<Sector>('Tech & Software');
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>('Hybrid');
  const [jobType, setJobType] = useState<JobType>('Full-time');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-level (3-5 yrs)');
  const [minSalaryPKR, setMinSalaryPKR] = useState<number>(200000);
  const [maxSalaryPKR, setMaxSalaryPKR] = useState<number>(350000);
  const [isGovernment, setIsGovernment] = useState(false);
  const [bpsGrade, setBpsGrade] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [education, setEducation] = useState('BS Computer Science or equivalent');
  const [benefitsInput, setBenefitsInput] = useState('Provident Fund, Health Insurance (IPD/OPD), Fuel Allowance');
  const [deadlineDays, setDeadlineDays] = useState(30);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Job title is required';
    if (!company.trim()) errs.company = 'Company / Department name is required';
    if (!description.trim()) errs.description = 'Job description is required';
    if (minSalaryPKR <= 0 && !isGovernment) errs.minSalary = 'Enter a valid minimum salary';
    if (maxSalaryPKR < minSalaryPKR && !isGovernment) errs.maxSalary = 'Max salary must exceed min salary';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + (deadlineDays || 30));

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const benefits = benefitsInput
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const newJob: Job = {
      id: `custom-job-${Date.now()}`,
      title,
      company,
      city,
      province: city === 'Karachi' ? 'Sindh' : city === 'Islamabad' ? 'Islamabad Capital' : city === 'Peshawar' ? 'KPK' : city === 'Quetta' ? 'Balochistan' : 'Punjab',
      locationArea: locationArea || undefined,
      sector,
      workplaceType,
      jobType,
      experienceLevel,
      minSalaryPKR: Number(minSalaryPKR) || 0,
      maxSalaryPKR: Number(maxSalaryPKR) || 0,
      salaryCurrency: 'PKR',
      salaryPeriod: 'monthly',
      salaryDisclosed: true,
      postedDate: new Date().toISOString(),
      deadline: deadlineDate.toISOString(),
      isGovernment,
      bpsGrade: isGovernment ? bpsGrade || 'BPS-17' : undefined,
      isVerified: true,
      description,
      responsibilities: [
        'Execute core departmental and technical tasks in line with company objectives',
        'Collaborate with Pakistani and international team stakeholders',
        'Maintain high quality and adherence to regulatory and engineering standards',
      ],
      requirements: [
        `${experienceLevel} practical experience in ${sector}`,
        `Degree: ${education}`,
        'Strong communication skills and high integrity',
      ],
      skills: skills.length > 0 ? skills : ['Communication', 'Teamwork', 'Domain Knowledge'],
      benefits: benefits.length > 0 ? benefits : ['Market competitive package', 'Health Insurance'],
      education,
    };

    onJobCreated(newJob);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-job-title"
      >
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Employer Portal
            </span>
            <h2 id="post-job-title" className="text-lg font-bold text-slate-900 mt-0.5">
              Post a Job in Pakistan
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Job Successfully Published!</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Your opening is now live and searchable on Pakistan Job Finder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {/* Title & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="post-job-title-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  id="post-job-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white ${
                    errors.title ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.title && <p className="text-[11px] text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="post-company-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization *
                </label>
                <input
                  id="post-company-input"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Systems Limited, Meezan Bank, Jazz"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white ${
                    errors.company ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.company && <p className="text-[11px] text-red-600 mt-1">{errors.company}</p>}
              </div>
            </div>

            {/* City & Location Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="post-city-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <select
                  id="post-city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Multan">Multan</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Remote (Pakistan)">Remote (Pakistan)</option>
                  <option value="Remote (Worldwide)">Remote (Worldwide USD)</option>
                </select>
              </div>

              <div>
                <label htmlFor="post-location-area" className="block text-xs font-semibold text-slate-700 mb-1">
                  Area / Zone (Optional)
                </label>
                <input
                  id="post-location-area"
                  type="text"
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  placeholder="e.g. Clifton, Gulberg, Blue Area"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Sector & Workplace */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="post-sector-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Sector *
                </label>
                <select
                  id="post-sector-select"
                  value={sector}
                  onChange={(e) => setSector(e.target.value as Sector)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="Tech & Software">Tech & Software</option>
                  <option value="Banking & Fintech">Banking & Fintech</option>
                  <option value="Government & Public (BPS)">Government & Public (BPS)</option>
                  <option value="FMCG & Manufacturing">FMCG & Manufacturing</option>
                  <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                  <option value="Telecom & Networks">Telecom & Networks</option>
                  <option value="Education & NGO">Education & NGO</option>
                </select>
              </div>

              <div>
                <label htmlFor="post-workplace-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Workplace Type
                </label>
                <select
                  id="post-workplace-select"
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Government BPS Option */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-950">
                <input
                  type="checkbox"
                  checked={isGovernment}
                  onChange={(e) => setIsGovernment(e.target.checked)}
                  className="rounded-sm text-emerald-700 focus:ring-emerald-600"
                />
                <span>Is this a Government / Public Sector Gazetted Post?</span>
              </label>
              {isGovernment && (
                <div className="mt-2">
                  <label htmlFor="post-bps-grade" className="block text-xs font-semibold text-slate-700 mb-1">
                    BPS Grade / Testing Agency
                  </label>
                  <input
                    id="post-bps-grade"
                    type="text"
                    value={bpsGrade}
                    onChange={(e) => setBpsGrade(e.target.value)}
                    placeholder="e.g. BPS-17, BPS-18, FPSC, PPSC"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-xs"
                  />
                </div>
              )}
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="post-min-salary" className="block text-xs font-semibold text-slate-700 mb-1">
                  Min Salary (PKR / mo)
                </label>
                <input
                  id="post-min-salary"
                  type="number"
                  step="5000"
                  value={minSalaryPKR}
                  onChange={(e) => setMinSalaryPKR(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="post-max-salary" className="block text-xs font-semibold text-slate-700 mb-1">
                  Max Salary (PKR / mo)
                </label>
                <input
                  id="post-max-salary"
                  type="number"
                  step="5000"
                  value={maxSalaryPKR}
                  onChange={(e) => setMaxSalaryPKR(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="post-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                Job Overview & Description *
              </label>
              <textarea
                id="post-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe role objectives, team dynamics, and day-to-day work..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-xs"
              />
              {errors.description && <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>}
            </div>

            {/* Skills & Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="post-skills" className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  id="post-skills"
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="post-benefits" className="block text-xs font-semibold text-slate-700 mb-1">
                  Benefits & Perks (comma separated)
                </label>
                <input
                  id="post-benefits"
                  type="text"
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  placeholder="Provident Fund, Fuel, Health Insurance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Publish Job Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
