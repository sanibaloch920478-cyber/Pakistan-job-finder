/**
 * Pakistan FBR (Federal Board of Revenue) Income Tax Calculator
 * Slabs for Salaried Individuals (Tax Year 2024-2025 & 2025-2026)
 */

export interface TaxCalculationResult {
  monthlyGross: number;
  annualGross: number;
  annualTax: number;
  monthlyTax: number;
  monthlyNet: number;
  annualNet: number;
  effectiveTaxRate: number;
  marginalRate: number;
  slabNumber: number;
  slabDescription: string;
}

export function calculateSalaryTax(monthlyGross: number): TaxCalculationResult {
  const safeGross = Math.max(0, Number(monthlyGross) || 0);
  const annualGross = safeGross * 12;

  let annualTax = 0;
  let marginalRate = 0;
  let slabNumber = 1;
  let slabDescription = 'Up to PKR 600,000 / year (0% Tax Exempt)';

  if (annualGross <= 600_000) {
    annualTax = 0;
    marginalRate = 0;
    slabNumber = 1;
    slabDescription = 'Up to PKR 600,000 / year: 0% tax';
  } else if (annualGross <= 1_200_000) {
    annualTax = (annualGross - 600_000) * 0.05;
    marginalRate = 5;
    slabNumber = 2;
    slabDescription = 'PKR 600,001 to 1,200,000: 5% of amount exceeding 600,000';
  } else if (annualGross <= 2_200_000) {
    annualTax = 30_000 + (annualGross - 1_200_000) * 0.15;
    marginalRate = 15;
    slabNumber = 3;
    slabDescription = 'PKR 1,200,001 to 2,200,000: PKR 30,000 + 15% exceeding 1.2M';
  } else if (annualGross <= 3_200_000) {
    annualTax = 180_000 + (annualGross - 2_200_000) * 0.25;
    marginalRate = 25;
    slabNumber = 4;
    slabDescription = 'PKR 2,200,001 to 3,200,000: PKR 180,000 + 25% exceeding 2.2M';
  } else if (annualGross <= 4_100_000) {
    annualTax = 430_000 + (annualGross - 3_200_000) * 0.30;
    marginalRate = 30;
    slabNumber = 5;
    slabDescription = 'PKR 3,200,001 to 4,100,000: PKR 430,000 + 30% exceeding 3.2M';
  } else {
    annualTax = 700_000 + (annualGross - 4_100_000) * 0.35;
    marginalRate = 35;
    slabNumber = 6;
    slabDescription = 'Above PKR 4,100,000: PKR 700,000 + 35% exceeding 4.1M';
  }

  const monthlyTax = Math.round(annualTax / 12);
  const monthlyNet = Math.round(safeGross - monthlyTax);
  const annualNet = Math.round(annualGross - annualTax);
  const effectiveTaxRate = annualGross > 0 ? Number(((annualTax / annualGross) * 100).toFixed(2)) : 0;

  return {
    monthlyGross: safeGross,
    annualGross,
    annualTax: Math.round(annualTax),
    monthlyTax,
    monthlyNet,
    annualNet,
    effectiveTaxRate,
    marginalRate,
    slabNumber,
    slabDescription,
  };
}
