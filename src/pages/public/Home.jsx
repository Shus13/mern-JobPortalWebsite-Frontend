import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/common/Container";
import SectionTitle from "../../components/ui/SectionTitle";
import Button from "../../components/ui/Button";
import JobCard from "../../components/jobs/JobCard";
import { SkeletonCard } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { getJobs } from "../../services/jobApi";
import { useAuth } from "../../hooks/useAuth";

const STATS = [
  { label: "Live roles", value: "2,400+" },
  { label: "Hiring companies", value: "310" },
  { label: "Avg. time to hire", value: "9 days" },
];

const Home = () => {
  const { isAuthenticated, role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getJobs();
        if (mounted) setJobs((data.jobs || []).slice(0, 6));
      } catch {
        if (mounted) setJobs([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/60 via-white to-white">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
          aria-hidden="true"
        />
        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-600">
              Now hiring across 40+ industries
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Find work that actually fits.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-500">
              Hirely connects job seekers with employers who are ready to hire —
              no noise, no dead-end applications, just real roles from real
              companies.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/jobs">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Jobs
                </Button>
              </Link>
              {role !== "JobSeeker" && (
                <Link to={role === "JobProvider" ? "/dashboard/jobs/new" : "/register"}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Post a Job
                  </Button>
                </Link>
              )}
              {role === "JobSeeker" && (
                <Link to="/applications">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    My Applications
                  </Button>
                </Link>
              )}
            </div>

            <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-ink-100 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-ink-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-ink-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured jobs */}
      <section className="py-20">
        <Container>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Fresh opportunities"
              title="Featured jobs"
              subtitle="A snapshot of roles hiring managers have posted recently."
            />
            <Link to="/jobs">
              <Button variant="secondary">View all jobs</Button>
            </Link>
          </div>

          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!isLoading && jobs.length === 0 && (
            <EmptyState
              title="No jobs posted yet"
              message="Check back soon, or be the first employer to post a role."
              actionLabel={role === "JobSeeker" ? undefined : "Post a Job"}
              onAction={
                role === "JobSeeker"
                  ? undefined
                  : () => (window.location.href = role === "JobProvider" ? "/dashboard/jobs/new" : "/register")
              }
            />
          )}

          {!isLoading && jobs.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="py-8">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-ink-900 px-8 py-14 text-center sm:px-16">
            {role === "JobSeeker" ? (
              <>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  Ready to find your next role?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-ink-300">
                  Browse open positions from companies actively hiring and apply in just a
                  couple of clicks.
                </p>
                <Link to="/jobs">
                  <Button size="lg" className="mt-7">
                    Browse Jobs
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  Hiring? Get in front of serious candidates today.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-ink-300">
                  {isAuthenticated
                    ? "Publish your next opening in under two minutes."
                    : "Create a free employer account and publish your first opening in under two minutes."}
                </p>
                <Link to={role === "JobProvider" ? "/dashboard/jobs/new" : "/register"}>
                  <Button size="lg" className="mt-7">
                    Post a Job
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
