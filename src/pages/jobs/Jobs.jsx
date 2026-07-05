import { useEffect, useMemo, useState } from "react";
import Container from "../../components/common/Container";
import PageTitle from "../../components/ui/PageTitle";
import JobCard from "../../components/jobs/JobCard";
import { SkeletonCard } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { getJobs } from "../../services/jobApi";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const data = await getJobs();
        if (mounted) setJobs(data.jobs || []);
      } catch {
        if (mounted) setError("Could not load jobs right now.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    if (!query.trim()) return jobs;
    const q = query.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(q) ||
        job.company?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q)
    );
  }, [jobs, query]);

  return (
    <Container className="py-12">
      <PageTitle
        title="Browse jobs"
        subtitle={`${jobs.length} open role${jobs.length === 1 ? "" : "s"} from companies actively hiring.`}
      />

      <div className="mb-8">
        <div className="relative max-w-md">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400"
          >
            <path
              d="M21 21l-4.3-4.3M19 11a8 8 0 11-16 0 8 8 0 0116 0z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, company, or location"
            className="focus-ring w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-400 hover:border-ink-300"
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState title="Something went wrong" message={error} />
      )}

      {!isLoading && !error && filteredJobs.length === 0 && (
        <EmptyState
          title="No jobs match your search"
          message="Try a different keyword, or check back later for new postings."
        />
      )}

      {!isLoading && !error && filteredJobs.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default Jobs;
