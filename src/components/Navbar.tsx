import React from 'react';
import { Briefcase, Calculator, Sparkles, Bookmark, PlusCircle, Building2 } from 'lucide-react';
import { City } from '../types/job';

interface NavbarProps {
  activeTab: 'jobs' | 'calculator' | 'ai' | 'saved' | 'my-applications';
  setActiveTab: (tab: 'jobs' | 'calculator' | 'ai' | 'saved' | 'my-applications') => void;
  savedCount: number;
  appliedCount: number;
  onPostJobClick: () => void;
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  appliedCount,
  onPostJobClick,
  selectedCity,
  onSelectCity,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-2">
          {/* Brand Logo & National Identity */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <button
              onClick={() => setActiveTab('jobs')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg cursor-pointer py-1"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-xs shrink-0">
                PJ
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-none">Pakistan Job Finder</span>
                  <span className="hidden md:inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm leading-none border border-emerald-200">
                    Verified
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-urdu leading-none hidden lg:block mt-1">
                  پاکستان کا مستند روزگار پورٹل
                </span>
              </div>
            </button>

            {/* City Quick Dropdown */}
            <div className="hidden xl:flex items-center text-xs text-slate-600 border-l border-slate-200 pl-4 py-1">
              <label htmlFor="nav-city-select" className="text-slate-500 mr-2 font-medium">City:</label>
              <select
                id="nav-city-select"
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value as City)}
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold py-1.5 px-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="All Cities">All Cities (Pakistan)</option>
                <option value="Karachi">Karachi (کراچی)</option>
                <option value="Lahore">Lahore (لاہور)</option>
                <option value="Islamabad">Islamabad (اسلام آباد)</option>
                <option value="Rawalpindi">Rawalpindi (راولپنڈی)</option>
                <option value="Faisalabad">Faisalabad (فیصل آباد)</option>
                <option value="Peshawar">Peshawar (پشاور)</option>
                <option value="Multan">Multan (ملتان)</option>
                <option value="Quetta">Quetta (کوئٹہ)</option>
                <option value="Remote (Pakistan)">Remote (Pakistan)</option>
                <option value="Remote (Worldwide)">Remote (Worldwide USD)</option>
              </select>
            </div>
          </div>

          {/* Navigation Items (Scrollable on mobile) */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                activeTab === 'jobs'
                  ? 'bg-slate-100 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
              <span>Jobs</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                activeTab === 'calculator'
                  ? 'bg-slate-100 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
              <span className="hidden sm:inline">Salary &amp; FBR Tax</span>
              <span className="sm:hidden">Tax</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                activeTab === 'ai'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              <span className="hidden sm:inline">AI Copilot</span>
              <span className="sm:hidden">AI</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0 ${
                activeTab === 'saved'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('my-applications')}
              className={`px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0 ${
                activeTab === 'my-applications'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Applied</span>
              {appliedCount > 0 && (
                <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.2 rounded-full">
                  {appliedCount}
                </span>
              )}
            </button>

            {/* Post a Job Button */}
            <button
              onClick={onPostJobClick}
              className="ml-1 sm:ml-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center gap-1 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Post a Job</span>
              <span className="sm:hidden">Post</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
