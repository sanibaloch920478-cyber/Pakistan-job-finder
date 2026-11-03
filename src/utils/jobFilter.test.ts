import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAndSortJobs } from './jobFilter';
import { Job } from '../types/job';

const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer',
    company: 'Systems Limited',
    city: 'Lahore',
    province: 'Punjab',
    sector: 'Tech & Software',
    workplaceType: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Senior (5-8 yrs)',
    minSalaryPKR: 350000,
    maxSalaryPKR: 500000,
    salaryCurrency: 'PKR',
    salaryPeriod: 'monthly',
    salaryDisclosed: true,
    postedDate: '2026-10-25T10:00:00Z',
    deadline: '2026-11-25T10:00:00Z',
    isGovernment: false,
    isVerified: true,
    description: 'Lead modern cloud microservices using React and Node.js.',
    responsibilities: ['Architect web solutions'],
    requirements: ['React, TypeScript, Node.js'],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    benefits: ['Provident Fund', 'Health Insurance'],
    education: 'BS CS',
  },
  {
    id: 'job-2',
    title: 'Assistant Director (BPS-17)',
    company: 'Federal Public Service Commission (FPSC)',
    city: 'Islamabad',
    province: 'Islamabad Capital',
    sector: 'Government & Public (BPS)',
    workplaceType: 'On-site',
    jobType: 'Full-time',
    experienceLevel: 'Fresh Graduate',
    minSalaryPKR: 120000,
    maxSalaryPKR: 160000,
    salaryCurrency: 'PKR',
    salaryPeriod: 'monthly',
    salaryDisclosed: true,
    postedDate: '2026-10-20T10:00:00Z',
    deadline: '2026-11-15T10:00:00Z',
    isGovernment: true,
    bpsGrade: 'BPS-17',
    isVerified: true,
    description: 'Federal government regular gazetted post.',
    responsibilities: ['Policy formulation and administrative supervision'],
    requirements: ['Masters or 16 years education'],
    skills: ['Public Administration', 'Analytical Writing'],
    benefits: ['Government Pension', 'Official Accommodation Allowance'],
    education: 'Master Degree / 16 years education',
  },
  {
    id: 'job-3',
    title: 'Senior React Developer (Remote)',
    company: 'Toptal / US Client',
    city: 'Remote (Worldwide)',
    province: 'Remote',
    sector: 'Tech & Software',
    workplaceType: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Senior (5-8 yrs)',
    minSalaryPKR: 800000,
    maxSalaryPKR: 1200000,
    salaryCurrency: 'USD',
    salaryPeriod: 'monthly',
    salaryDisclosed: true,
    postedDate: '2026-10-30T10:00:00Z',
    deadline: '2026-11-30T10:00:00Z',
    isGovernment: false,
    isVerified: true,
    description: 'Remote USD contract for top Pakistani engineers.',
    responsibilities: ['Build high scale React web applications'],
    requirements: ['Next.js, Tailwind, React'],
    skills: ['React', 'Next.js', 'Tailwind CSS'],
    benefits: ['Paid Time Off', 'Flexible hours'],
    education: 'BS CS / Software Engineering',
  },
];

test('filterAndSortJobs - searches by keyword query', () => {
  const result = filterAndSortJobs(mockJobs, { query: 'react' });
  assert.equal(result.length, 2);
  assert.ok(result.some((j) => j.id === 'job-1'));
  assert.ok(result.some((j) => j.id === 'job-3'));
});

test('filterAndSortJobs - filters by government only', () => {
  const result = filterAndSortJobs(mockJobs, { govFilter: 'govt_only' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'job-2');
  assert.equal(result[0].isGovernment, true);
});

test('filterAndSortJobs - filters by city', () => {
  const result = filterAndSortJobs(mockJobs, { city: 'Lahore' });
  assert.equal(result.length, 1);
  assert.equal(result[0].city, 'Lahore');
});

test('filterAndSortJobs - sorts by salary descending', () => {
  const result = filterAndSortJobs(mockJobs, { sortBy: 'salary_desc' });
  assert.equal(result[0].id, 'job-3'); // 1,200,000 max
  assert.equal(result[1].id, 'job-1'); // 500,000 max
  assert.equal(result[2].id, 'job-2'); // 160,000 max
});
