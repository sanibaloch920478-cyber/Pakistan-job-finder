export type City = 
  | 'All Cities'
  | 'Karachi'
  | 'Lahore'
  | 'Islamabad'
  | 'Rawalpindi'
  | 'Peshawar'
  | 'Faisalabad'
  | 'Multan'
  | 'Quetta'
  | 'Sialkot'
  | 'Remote (Pakistan)'
  | 'Remote (Worldwide)';

export type Sector = 
  | 'Tech & Software'
  | 'Banking & Fintech'
  | 'Government & Public (BPS)'
  | 'FMCG & Manufacturing'
  | 'Healthcare & Pharma'
  | 'Telecom & Networks'
  | 'Education & NGO';

export type WorkplaceType = 'On-site' | 'Hybrid' | 'Remote';

export type JobType = 'Full-time' | 'Contract' | 'Part-time' | 'Internship / MTO';

export type ExperienceLevel = 
  | 'Fresh Graduate'
  | 'Entry-level (1-2 yrs)'
  | 'Mid-level (3-5 yrs)'
  | 'Senior (5-8 yrs)'
  | 'Lead / Director (8+ yrs)';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  city: City;
  province: 'Sindh' | 'Punjab' | 'KPK' | 'Balochistan' | 'Islamabad Capital' | 'Remote';
  locationArea?: string; // e.g. "Clifton, Karachi" or "Gulberg III, Lahore" or "Blue Area, Islamabad"
  sector: Sector;
  workplaceType: WorkplaceType;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  minSalaryPKR: number;
  maxSalaryPKR: number;
  salaryCurrency: 'PKR' | 'USD';
  salaryPeriod: 'monthly' | 'yearly';
  salaryDisclosed: boolean;
  postedDate: string; // ISO date string
  deadline: string;   // ISO date string
  isGovernment: boolean;
  bpsGrade?: string;  // e.g. 'BPS-17', 'BPS-18', 'FPSC', 'PPSC'
  isUrgent?: boolean;
  isVerified: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  education: string;
  applicationUrl?: string;
  contactEmail?: string;
}

export interface JobFilterCriteria {
  query?: string;
  city?: City;
  sector?: Sector | 'All Sectors';
  workplaceType?: WorkplaceType | 'All';
  jobType?: JobType | 'All';
  experienceLevel?: ExperienceLevel | 'All';
  govFilter?: 'all' | 'govt_only' | 'private_only';
  minSalary?: number;
  sortBy?: 'recent' | 'salary_desc' | 'deadline_asc';
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  city: string;
  fullName: string;
  email: string;
  phone: string;
  currentTitle: string;
  expectedSalaryPKR: string;
  coverNote: string;
  appliedAt: string;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled';
}
