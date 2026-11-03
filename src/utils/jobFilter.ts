import { Job, JobFilterCriteria } from '../types/job';

export function filterAndSortJobs(jobs: Job[], criteria: JobFilterCriteria): Job[] {
  let result = [...jobs];

  // Search Query filter
  if (criteria.query && criteria.query.trim() !== '') {
    const q = criteria.query.toLowerCase().trim();
    result = result.filter((job) => {
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchCity = job.city.toLowerCase().includes(q);
      const matchSector = job.sector.toLowerCase().includes(q);
      const matchBps = job.bpsGrade ? job.bpsGrade.toLowerCase().includes(q) : false;
      const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q));
      const matchDesc = job.description.toLowerCase().includes(q);
      return matchTitle || matchCompany || matchCity || matchSector || matchBps || matchSkills || matchDesc;
    });
  }

  // City filter
  if (criteria.city && criteria.city !== 'All Cities') {
    result = result.filter((job) => {
      if (criteria.city === 'Remote (Worldwide)' || criteria.city === 'Remote (Pakistan)') {
        return job.city.toLowerCase().includes('remote') || job.workplaceType === 'Remote';
      }
      return job.city === criteria.city;
    });
  }

  // Sector filter
  if (criteria.sector && criteria.sector !== 'All Sectors') {
    result = result.filter((job) => job.sector === criteria.sector);
  }

  // Workplace type filter
  if (criteria.workplaceType && criteria.workplaceType !== 'All') {
    result = result.filter((job) => job.workplaceType === criteria.workplaceType);
  }

  // Job type filter
  if (criteria.jobType && criteria.jobType !== 'All') {
    result = result.filter((job) => job.jobType === criteria.jobType);
  }

  // Experience level filter
  if (criteria.experienceLevel && criteria.experienceLevel !== 'All') {
    result = result.filter((job) => job.experienceLevel === criteria.experienceLevel);
  }

  // Government / Private filter
  if (criteria.govFilter && criteria.govFilter !== 'all') {
    if (criteria.govFilter === 'govt_only') {
      result = result.filter((job) => job.isGovernment);
    } else if (criteria.govFilter === 'private_only') {
      result = result.filter((job) => !job.isGovernment);
    }
  }

  // Min Salary filter (in PKR monthly)
  if (criteria.minSalary && criteria.minSalary > 0) {
    result = result.filter((job) => {
      if (!job.salaryDisclosed) return true; // keep undisclosed
      return job.maxSalaryPKR >= (criteria.minSalary || 0);
    });
  }

  // Sorting
  const sortBy = criteria.sortBy || 'recent';
  if (sortBy === 'recent') {
    result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  } else if (sortBy === 'salary_desc') {
    result.sort((a, b) => (b.maxSalaryPKR || 0) - (a.maxSalaryPKR || 0));
  } else if (sortBy === 'deadline_asc') {
    result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }

  return result;
}
