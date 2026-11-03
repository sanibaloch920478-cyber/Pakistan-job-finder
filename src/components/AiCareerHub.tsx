import React, { useState } from 'react';
import { Sparkles, FileText, MessageSquare, HelpCircle, CheckCircle2, AlertTriangle, Send, Loader2, ArrowRight } from 'lucide-react';
import { Job } from '../types/job';

interface AiCareerHubProps {
  jobs: Job[];
  selectedJobForReview: Job | null;
  onClearSelectedJob: () => void;
}

export const AiCareerHub: React.FC<AiCareerHubProps> = ({
  jobs,
  selectedJobForReview,
  onClearSelectedJob,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'resume' | 'coach' | 'interview'>('resume');

  // Resume Review State
  const [targetJobId, setTargetJobId] = useState<string>(selectedJobForReview?.id || (jobs[0]?.id || ''));
  const [resumeText, setResumeText] = useState<string>('');
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<any | null>(null);

  // Coach State
  const [question, setQuestion] = useState<string>('');
  const [coachLanguage, setCoachLanguage] = useState<'en' | 'ur'>('en');
  const [isCoachThinking, setIsCoachThinking] = useState<boolean>(false);
  const [coachResponse, setCoachResponse] = useState<string | null>(null);

  // Interview Prep State
  const [interviewJobId, setInterviewJobId] = useState<string>(jobs[0]?.id || '');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [interviewQuestions, setInterviewQuestions] = useState<any[] | null>(null);

  const selectedJob = jobs.find((j) => j.id === targetJobId) || jobs[0];

  const handleLoadSampleResume = () => {
    setResumeText(`MUHAMMAD HAMZA
Software Engineer | Full Stack Developer
Lahore, Pakistan | +92 300 4567890 | hamza.dev@example.com

SUMMARY:
Results-driven software engineer with 3.5 years of experience building web applications using React, TypeScript, Node.js, and PostgreSQL. Experienced in RESTful microservices, state management, and Git collaboration in fast-paced agile teams.

CORE SKILLS:
- Frontend: React.js, Next.js, TypeScript, Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express, PostgreSQL, MongoDB, REST APIs
- Tools: Git, Docker, Postman, Linux, VS Code

EXPERIENCE:
Software Engineer | FinTech Solutions (Lahore)
July 2023 - Present
- Developed responsive dashboard modules in React & TypeScript serving 40,000 active daily banking users across Pakistan.
- Optimized database query performance on PostgreSQL reducing API response times by 35%.
- Implemented real-time transaction updates using WebSockets and optimistic UI caching.

Junior Web Developer | Techlogix (Lahore)
Jan 2022 - June 2023
- Built front-end components and maintained client portals using React and Bootstrap.
- Collaborated in sprint planning and daily standups.

EDUCATION:
BS in Computer Science (4 Years) | FAST NUCES Lahore (2018 - 2022)
CGPA: 3.42 / 4.0`);
  };

  const handleReviewResume = async () => {
    if (!resumeText.trim()) return;
    setIsReviewing(true);
    setReviewResult(null);

    try {
      const res = await fetch('/api/ai/resume-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobTitle: selectedJob?.title,
          targetCompany: selectedJob?.company,
          jobRequirements: selectedJob?.requirements,
        }),
      });
      const data = await res.json();
      setReviewResult(data);
    } catch (err) {
      console.error('Failed to review resume:', err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleAskCoach = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;
    setIsCoachThinking(true);
    setCoachResponse(null);

    try {
      const res = await fetch('/api/ai/career-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          language: coachLanguage,
        }),
      });
      const data = await res.json();
      setCoachResponse(data.answer);
    } catch (err) {
      console.error('Coach failed:', err);
    } finally {
      setIsCoachThinking(false);
    }
  };

  const handleGenerateInterview = async () => {
    const target = jobs.find((j) => j.id === interviewJobId) || jobs[0];
    if (!target) return;
    setIsGeneratingQuestions(true);
    setInterviewQuestions(null);

    try {
      const res = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: target.title,
          company: target.company,
          sector: target.sector,
        }),
      });
      const data = await res.json();
      setInterviewQuestions(data);
    } catch (err) {
      console.error('Interview prep failed:', err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>AI Career Intelligence Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pakistani Job Market Copilot
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Evaluate CV match against Pakistani employers, generate role-specific interview prep, and get bilingual career advice.
        </p>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('resume')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeSubTab === 'resume'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume & JD Matcher</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('coach')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeSubTab === 'coach'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Bilingual Career Advisor (روشن مستقبل)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('interview')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeSubTab === 'interview'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interview Prep Simulator</span>
        </button>
      </div>

      {/* TAB 1: RESUME MATCHER */}
      {activeSubTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel (5 cols) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label htmlFor="target-job-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Pakistani Position
              </label>
              <select
                id="target-job-select"
                value={targetJobId}
                onChange={(e) => setTargetJobId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white cursor-pointer"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} · {j.company} ({j.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="resume-textarea" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Paste Resume / Profile Details
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleResume}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline"
                >
                  Load Sample Pakistani CV
                </button>
              </div>
              <textarea
                id="resume-textarea"
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your education (e.g. FAST, NUST, LUMS, IBA), technical skills, work experience, and projects..."
                className="w-full p-3 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white leading-relaxed"
              />
            </div>

            <button
              type="button"
              disabled={isReviewing || !resumeText.trim()}
              onClick={handleReviewResume}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isReviewing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Match Against Pakistani Market...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze CV Match & Advice</span>
                </>
              )}
            </button>
          </div>

          {/* Results Panel (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {reviewResult ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
                {/* Score Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Target Job Match Score
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      {selectedJob?.title} at {selectedJob?.company}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-extrabold text-emerald-900 block leading-none">
                      {reviewResult.matchScore}%
                    </span>
                    <span className="text-xs font-bold text-emerald-700 mt-1 block">
                      {reviewResult.matchTier}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  {reviewResult.summary}
                </p>

                {/* Strengths */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Candidate Strengths</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                    {reviewResult.strengths?.map((s: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Missing Keywords */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Keywords to Add / Polish</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {reviewResult.missingKeywords?.map((k: string, idx: number) => (
                      <span key={idx} className="text-xs px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200 font-medium">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pakistan Market Tips */}
                {reviewResult.pakistanMarketTips && (
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Local Job Market & Salary Tips
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc">
                      {reviewResult.pakistanMarketTips.map((tip: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{tip}</li>
                      ))}
                    </ul>
                    {reviewResult.suggestedSalaryRangePKR && (
                      <div className="mt-3 p-2.5 bg-emerald-50 rounded-lg text-xs font-semibold text-emerald-950 flex items-center justify-between">
                        <span>Realistic Salary Target:</span>
                        <span>{reviewResult.suggestedSalaryRangePKR}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Resume Analyzed Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Paste your CV on the left or click <strong>&quot;Load Sample Pakistani CV&quot;</strong> to get an instant breakdown of your match score and market salary in PKR.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BILINGUAL CAREER COACH */}
      {activeSubTab === 'coach' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Bilingual Advisor
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Ask Roshan Mustaqbil (روشن مستقبل)
                </h3>
              </div>

              {/* Language Toggle */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCoachLanguage('en')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    coachLanguage === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setCoachLanguage('ur')}
                  className={`px-3 py-1.5 rounded-md font-urdu transition-colors ${
                    coachLanguage === 'ur' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-medium py-1">Try asking:</span>
              {[
                'Software developer salaries in Lahore vs Karachi',
                'How to get 0.25% PSEB tax for remote USD freelance income?',
                'Preparation roadmap for FPSC/PPSC BPS-17 tests',
                'Best corporate MTO programs in Pakistan (Engro, Unilever, Meezan)',
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuestion(p);
                    handleAskCoach(p);
                  }}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()}
                placeholder={
                  coachLanguage === 'ur'
                    ? 'اپنا سوال یہاں لکھیں (مثلاً: سافٹ ویئر ہاؤسز میں اوسط تنخواہ کیا ہے؟)'
                    : 'Ask any question about Pakistani salaries, interviews, CSS, or remote jobs...'
                }
                className={`flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white ${
                  coachLanguage === 'ur' ? 'font-urdu text-right' : ''
                }`}
              />
              <button
                type="button"
                disabled={isCoachThinking || !question.trim()}
                onClick={() => handleAskCoach()}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                {isCoachThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Ask</span>
              </button>
            </div>
          </div>

          {/* Response Box */}
          {coachResponse && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Advisor Recommendation</span>
              </div>
              <div
                className={`text-sm text-slate-800 whitespace-pre-line leading-relaxed ${
                  coachLanguage === 'ur' ? 'font-urdu text-right text-base' : ''
                }`}
              >
                {coachResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTERVIEW PREP */}
      {activeSubTab === 'interview' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label htmlFor="interview-job-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Pakistani Position for Simulation
              </label>
              <select
                id="interview-job-select"
                value={interviewJobId}
                onChange={(e) => setInterviewJobId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white cursor-pointer"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} · {j.company} ({j.city})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={isGeneratingQuestions}
              onClick={handleGenerateInterview}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGeneratingQuestions ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Pakistani Interview Scenarios...</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  <span>Generate Tailored Interview Questions</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Questions */}
          {interviewQuestions && (
            <div className="space-y-4">
              {interviewQuestions.map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 uppercase tracking-wider">
                      Question #{idx + 1} · {item.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {item.question}
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-800">What Pakistani Interviewers Assess:</div>
                    <p>{item.whatInterviewerWants}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1">Recommended Response Strategy:</span>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                      {item.recommendedPoints?.map((pt: string, pidx: number) => (
                        <li key={pidx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
