/**
 * Formatting utilities for Pakistan Job Finder
 */

export function formatPKR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'PKR 0';
  return 'PKR ' + new Intl.NumberFormat('en-PK').format(Math.round(amount));
}

export function formatSalaryDisplay(
  min: number,
  max: number,
  currency: 'PKR' | 'USD' = 'PKR',
  period: 'monthly' | 'yearly' = 'monthly',
  disclosed: boolean = true
): string {
  if (!disclosed || (!min && !max)) {
    return 'Undisclosed / Market Competitive';
  }

  const periodLabel = period === 'yearly' ? 'yr' : 'mo';

  if (currency === 'USD') {
    if (min && max && min !== max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()} USD / ${periodLabel} (~PKR ${(min * 278 / 1000).toFixed(0)}k - ${(max * 278 / 1000).toFixed(0)}k)`;
    }
    return `$${(min || max).toLocaleString()} USD / ${periodLabel}`;
  }

  // PKR formatting
  if (min >= 1_000_000 || max >= 1_000_000) {
    const minM = (min / 1_000_000).toFixed(1).replace(/\.0$/, '');
    const maxM = (max / 1_000_000).toFixed(1).replace(/\.0$/, '');
    if (min && max && min !== max) {
      return `PKR ${minM}M - ${maxM}M / ${periodLabel}`;
    }
    return `PKR ${(minM || maxM)}M / ${periodLabel}`;
  }

  if (min && max && min !== max) {
    return `PKR ${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(0)}k / ${periodLabel}`;
  }

  const single = min || max;
  return `PKR ${(single / 1000).toFixed(0)}k / ${periodLabel}`;
}

export function getDaysLeft(deadlineStr: string): { days: number; label: string; isUrgent: boolean } {
  if (!deadlineStr) return { days: 99, label: 'Ongoing', isUrgent: false };
  const target = new Date(deadlineStr).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { days, label: 'Applications Closed', isUrgent: false };
  }
  if (days === 0) {
    return { days, label: 'Closing Today!', isUrgent: true };
  }
  if (days === 1) {
    return { days, label: '1 day left', isUrgent: true };
  }
  if (days <= 5) {
    return { days, label: `${days} days left`, isUrgent: true };
  }
  return { days, label: `${days} days left`, isUrgent: false };
}

export function validatePakistaniPhone(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  // Matches: 03001234567 or +923001234567 or 923001234567 or 00923001234567
  const regex = /^((\+92|0092|92)?(3\d{2})|03\d{2})\d{7}$/;
  return regex.test(clean);
}
