import React from 'react';
import { Search, MapPin, Building, ShieldCheck, Flame, Laptop, Sparkles } from 'lucide-react';
import { City, Sector } from '../types/job';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedSector: Sector | 'All Sectors';
  setSelectedSector: (sector: Sector | 'All Sectors') => void;
  govFilter: 'all' | 'govt_only' | 'private_only';
  setGovFilter: (filter: 'all' | 'govt_only' | 'private_only') => void;
  totalJobsCount: number;
  onOpenAi: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  govFilter,
  setGovFilter,
  totalJobsCount,
  onOpenAi,
}) => {
  return (
    <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40">
      <div className="max-w-5xl mx-auto text-center">
        {/* Editorial Subtitle with Pakistan Focus */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-emerald-300 uppercase mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Verified Pakistan Career Portal</span>
          <span aria-hidden="true">·</span>
          <span>Karachi · Lahore · Islamabad & Remote</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-tight">
          Find Your Next Career Move in Pakistan
        </h1>

        <p className="mt-3 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-normal">
          Verified corporate, software, Islamic banking, government BPS (FPSC/PPSC), and high-paying USD remote jobs.
        </p>

        {/* Main Search Bar Card */}
        <div className="mt-8 bg-white p-2 sm:p-3 rounded-2xl shadow-xl border border-slate-200 text-slate-800 text-left">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col md:flex-row gap-2"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:bg-white transition-all">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, skills (e.g. React, Python), or company (Systems, Meezan)..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium px-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 md:w-56 shrink-0">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as City)}
                className="w-full bg-transparent text-sm text-slate-800 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="All Cities">All Cities</option>
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

            {/* Submit / Filter Trigger */}
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore</span>
              <span className="text-emerald-200 text-xs">({totalJobsCount})</span>
            </button>
          </form>

          {/* Quick Filter Segmented Controls */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-medium mr-1">Sector Filter:</span>
              <button
                type="button"
                onClick={() => setGovFilter('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  govFilter === 'all'
                    ? 'bg-emerald-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Opportunities
              </button>
              <button
                type="button"
                onClick={() => setGovFilter('govt_only')}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  govFilter === 'govt_only'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Government (BPS-17 / FPSC / PPSC)</span>
              </button>
              <button
                type="button"
                onClick={() => setGovFilter('private_only')}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  govFilter === 'private_only'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Private & Tech / Remote</span>
              </button>
            </div>

            {/* AI Advisor Shortcut */}
            <button
              type="button"
              onClick={onOpenAi}
              className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resume Matcher & Career AI</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Clean unboxed stats ticker - No pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-emerald-200/90 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Employers</span>
          </div>
          <span className="hidden sm:inline text-emerald-600">·</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Active BPS Deadlines Tracked</span>
          </div>
          <span className="hidden sm:inline text-emerald-600">·</span>
          <span>Provident Fund & Fuel Allowance Specified</span>
          <span className="hidden sm:inline text-emerald-600">·</span>
          <span>FBR Income Tax Calculated on Salaries</span>
        </div>
      </div>
    </section>
  );
};
