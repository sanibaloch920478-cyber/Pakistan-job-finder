import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Info, FileSpreadsheet, Percent, HelpCircle } from 'lucide-react';
import { calculateSalaryTax } from '../utils/taxCalculator';
import { formatPKR } from '../utils/formatters';

export const SalaryTaxCalculator: React.FC = () => {
  const [monthlyGross, setMonthlyGross] = useState<number>(250000);
  const [regime, setRegime] = useState<'standard' | 'it_freelance'>('standard');
  const [providentFundDeduction, setProvidentFundDeduction] = useState<boolean>(true);

  // Calculate standard FBR tax
  const taxData = calculateSalaryTax(monthlyGross);

  // IT Exporter / Freelancer regime: 0.25% PSEB registered final withholding tax
  const itAnnualTax = regime === 'it_freelance' ? Math.round(monthlyGross * 12 * 0.0025) : taxData.annualTax;
  const itMonthlyTax = regime === 'it_freelance' ? Math.round(monthlyGross * 0.0025) : taxData.monthlyTax;
  const itEffectiveRate = regime === 'it_freelance' ? 0.25 : taxData.effectiveTaxRate;

  // Optional PF (standard 8.33% or 10% basic salary; typically ~5% of gross)
  const pfMonthly = providentFundDeduction ? Math.round(monthlyGross * 0.05) : 0;
  const eobiMonthly = 1300; // Standard employee EOBI contribution in Pakistan
  const totalDeductions = itMonthlyTax + pfMonthly + eobiMonthly;
  const takeHomeMonthly = Math.max(0, monthlyGross - totalDeductions);

  const presets = [
    { label: 'Fresh Grad (PKR 80k)', val: 80000 },
    { label: 'BPS-17 Govt (PKR 140k)', val: 140000 },
    { label: 'Mid Dev (PKR 250k)', val: 250000 },
    { label: 'Senior Dev (PKR 450k)', val: 450000 },
    { label: 'Tech Lead (PKR 700k)', val: 700000 },
    { label: 'Director / 1M+', val: 1000000 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4 text-emerald-700" />
          <span>FBR Income Tax Year 2024–2026</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pakistan Salary & Income Tax Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl">
          Calculate your monthly in-hand net salary, FBR income tax deductions, and take-home pay based on updated Finance Act salary slabs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs & Options (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <label htmlFor="gross-salary-input" className="block text-sm font-bold text-slate-900 mb-2">
              Monthly Gross Salary (PKR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                PKR
              </span>
              <input
                id="gross-salary-input"
                type="number"
                step="5000"
                value={monthlyGross || ''}
                onChange={(e) => setMonthlyGross(Math.max(0, Number(e.target.value)))}
                className="w-full pl-14 pr-4 py-3 text-lg font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Annual Gross: {formatPKR(monthlyGross * 12)} / year
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Pakistani Benchmarks:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setMonthlyGross(p.val)}
                  className={`text-left text-xs p-2.5 rounded-lg border transition-colors ${
                    monthlyGross === p.val
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tax Regime Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Employment Tax Category
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="regime"
                  checked={regime === 'standard'}
                  onChange={() => setRegime('standard')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Salaried Individual (Standard FBR Slabs)</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    For employees at private companies, banks, FMCG, and government institutions.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="regime"
                  checked={regime === 'it_freelance'}
                  onChange={() => setRegime('it_freelance')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">IT / Software Exporter (PSEB Registered)</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Concessionary 0.25% final withholding tax for IT export earnings remitted via SBP PRC.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Optional Additional Deductions */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={providentFundDeduction}
                onChange={(e) => setProvidentFundDeduction(e.target.checked)}
                className="rounded-sm text-emerald-700 focus:ring-emerald-600"
              />
              <span>Include Estimated Provident Fund Contribution (~5% gross)</span>
            </label>
          </div>
        </div>

        {/* Right Output: Calculations & Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Take-Home Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase block">
              Estimated Monthly Take-Home Pay
            </span>
            <div className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              {formatPKR(takeHomeMonthly)}
              <span className="text-sm sm:text-base font-normal text-emerald-200 ml-2">/ month</span>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-emerald-700/60 text-xs">
              <div>
                <span className="text-emerald-300/90 block">Monthly FBR Tax</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {formatPKR(itMonthlyTax)}
                </span>
              </div>
              <div>
                <span className="text-emerald-300/90 block">Effective Tax Rate</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {itEffectiveRate}%
                </span>
              </div>
              <div>
                <span className="text-emerald-300/90 block">Annual Net Pay</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {formatPKR(takeHomeMonthly * 12)}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Itemized Deductions Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Monthly Salary Breakdown</span>
              <span className="text-xs font-normal text-slate-500">Tax Year 2024-2026</span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Monthly Gross Salary</span>
                <span className="text-slate-900 font-bold">{formatPKR(monthlyGross)}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-red-600">
                <div className="flex items-center gap-1.5">
                  <span>(-) FBR Income Tax Deduction</span>
                  {regime === 'standard' && (
                    <span className="text-[11px] text-slate-500">(Slab #{taxData.slabNumber})</span>
                  )}
                </div>
                <span className="font-semibold">- {formatPKR(itMonthlyTax)}</span>
              </div>

              {providentFundDeduction && (
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-amber-700">
                  <span className="flex items-center gap-1">
                    <span>(-) Employee Provident Fund (~5%)</span>
                  </span>
                  <span className="font-semibold">- {formatPKR(pfMonthly)}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-slate-500 text-xs">
                <span>(-) Standard Employee EOBI Contribution</span>
                <span>- PKR 1,300</span>
              </div>

              <div className="flex items-center justify-between pt-2 text-base font-extrabold text-emerald-950">
                <span>Net In-Hand Salary</span>
                <span>{formatPKR(takeHomeMonthly)}</span>
              </div>
            </div>

            {/* Slab Rule Explanation */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 mb-0.5">Applicable Tax Law:</div>
              <p>
                {regime === 'standard'
                  ? taxData.slabDescription
                  : 'PSEB Registered IT exporters pay a final withholding tax rate of 0.25% under section 154A of the Income Tax Ordinance.'}
              </p>
            </div>
          </div>

          {/* Pakistan FBR Slabs Reference Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Official FBR Salary Tax Slabs (Salaried Individuals)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                    <th className="p-2">Slab</th>
                    <th className="p-2">Annual Taxable Income</th>
                    <th className="p-2">Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className={taxData.slabNumber === 1 ? 'bg-emerald-50/80 font-bold text-emerald-900' : ''}>
                    <td className="p-2">1</td>
                    <td className="p-2">Up to PKR 600,000</td>
                    <td className="p-2">0% (Tax Exempt)</td>
                  </tr>
                  <tr className={taxData.slabNumber === 2 ? 'bg-emerald-50/80 font-bold text-emerald-900' : ''}>
                    <td className="p-2">2</td>
                    <td className="p-2">PKR 600,001 to 1,200,000</td>
                    <td className="p-2">5% of amount &gt; 600k</td>
                  </tr>
                  <tr className={taxData.slabNumber === 3 ? 'bg-emerald-50/80 font-bold text-emerald-900' : ''}>
                    <td className="p-2">3</td>
                    <td className="p-2">PKR 1,200,001 to 2,200,000</td>
                    <td className="p-2">PKR 30k + 15% &gt; 1.2M</td>
                  </tr>
                  <tr className={taxData.slabNumber === 4 ? 'bg-emerald-50/80 font-bold text-emerald-900' : ''}>
                    <td className="p-2">4</td>
                    <td className="p-2">PKR 2,200,001 to 3,200,000</td>
                    <td className="p-2">PKR 180k + 25% &gt; 2.2M</td>
                  </tr>
                  <tr className={taxData.slabNumber === 5 ? 'bg-emerald-50/80 font-bold text-emerald-900' : ''}>
                    <td className="p-2">5</td>
                    <td className="p-2">PKR 3,200,001 to 4,100,000</td>
                    <td className="p-2">PKR 430k + 30% &gt; 3.2M</td>
                  </tr>
                  <tr className={taxData.slabNumber === 6 ? 'bg-emerald-50/80 font-bold text-emerald-900' : ''}>
                    <td className="p-2">6</td>
                    <td className="p-2">Exceeding PKR 4,100,000</td>
                    <td className="p-2">PKR 700k + 35% &gt; 4.1M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
