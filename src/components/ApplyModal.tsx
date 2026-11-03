import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Building, MapPin } from 'lucide-react';
import { Job, JobApplication } from '../types/job';
import { validatePakistaniPhone } from '../utils/formatters';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (application: JobApplication) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onSubmitApplication,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [currentTitle, setCurrentTitle] = useState('');
  const [expectedSalaryPKR, setExpectedSalaryPKR] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('30 Days');
  const [city, setCity] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !job) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    if (!phone.trim() || !validatePakistaniPhone(phone)) {
      errs.phone = 'Please provide a valid Pakistani mobile number (+92 3XX XXXXXXX or 03XXXXXXXXX)';
    }
    if (!expectedSalaryPKR.trim()) errs.expectedSalaryPKR = 'Please specify expected monthly salary';
    if (!city.trim()) errs.city = 'Current city or domicile is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      city: city || job.city,
      fullName,
      email,
      phone,
      currentTitle: currentTitle || 'Candidate',
      expectedSalaryPKR,
      coverNote,
      appliedAt: new Date().toISOString(),
      status: 'Submitted',
    };

    onSubmitApplication(newApp);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">Direct Application</span>
            <h2 id="apply-modal-title" className="text-lg font-bold text-slate-900 mt-0.5">
              Apply for {job.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{job.company}</span>
              <span aria-hidden="true">·</span>
              <span>{job.city}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close application dialog"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              Your profile has been submitted to {job.company}. You can track this in your <strong>Applied Jobs</strong> dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
            {/* Full Name */}
            <div>
              <label htmlFor="applicant-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                id="applicant-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Asad Ali Khan"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all ${
                  errors.fullName ? 'border-red-400' : 'border-slate-300'
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="applicant-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="applicant-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all ${
                    errors.email ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="applicant-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Mobile *
                </label>
                <input
                  id="applicant-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all ${
                    errors.phone ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* City & Notice Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="applicant-city" className="block text-xs font-semibold text-slate-700 mb-1">
                  Current City / Domicile *
                </label>
                <input
                  id="applicant-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all ${
                    errors.city ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="applicant-notice" className="block text-xs font-semibold text-slate-700 mb-1">
                  Notice Period
                </label>
                <select
                  id="applicant-notice"
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                >
                  <option value="Immediate">Immediate / Serving Notice</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days (Standard)</option>
                  <option value="60 Days">60 Days (Executive)</option>
                </select>
              </div>
            </div>

            {/* Expected Salary & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="applicant-title" className="block text-xs font-semibold text-slate-700 mb-1">
                  Current / Recent Job Title
                </label>
                <input
                  id="applicant-title"
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="e.g. Mid Software Engineer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                >
                </input>
              </div>

              <div>
                <label htmlFor="applicant-salary" className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Salary (PKR / mo) *
                </label>
                <input
                  id="applicant-salary"
                  type="text"
                  value={expectedSalaryPKR}
                  onChange={(e) => setExpectedSalaryPKR(e.target.value)}
                  placeholder="e.g. PKR 300,000"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all ${
                    errors.expectedSalaryPKR ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.expectedSalaryPKR && <p className="text-[11px] text-red-600 mt-1">{errors.expectedSalaryPKR}</p>}
              </div>
            </div>

            {/* Cover Note / Summary */}
            <div>
              <label htmlFor="applicant-cover" className="block text-xs font-semibold text-slate-700 mb-1">
                Brief Cover Note or Experience Highlights
              </label>
              <textarea
                id="applicant-cover"
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Briefly state your core skills, HEC degree, and key achievements..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-xs leading-relaxed"
              />
            </div>

            {/* Submit Button */}
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
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
