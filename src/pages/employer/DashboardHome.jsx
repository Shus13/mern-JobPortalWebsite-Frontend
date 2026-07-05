import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import DashboardCard from "../../components/employer/DashboardCard";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Badge, { statusTone } from "../../components/ui/Badge";
import { formatDate } from "../../utils/format";
import { getDashboardOverview } from "../../services/employerApi";

const BriefcaseIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M4 21V6l8-3 8 3v15M9 21v-5h6v5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InboxIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M4 13V19a2 2 0 002 2h12a2 2 0 002-2v-6M4 13l2.2-6.6A2 2 0 018.1 5h7.8a2 2 0 011.9 1.4L20 13"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DashboardHome = () => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getDashboardOverview();
        if (mounted) setOverview(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return <Loader label="Loading your dashboard…" fullHeight />;

  const { totalJobs, totalApplications, acceptedCandidates, recentJobs, recentApplications } =
    overview || {};

  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle="A quick look at your job postings and applicant activity."
        actions={
          <Link
            to="/dashboard/jobs/new"
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            + Post Job
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <DashboardCard label="Total Jobs" value={totalJobs ?? 0} icon={BriefcaseIcon} tone="brand" />
        <DashboardCard
          label="Total Applications"
          value={totalApplications ?? 0}
          icon={InboxIcon}
          tone="amber"
        />
        <DashboardCard
          label="Accepted Candidates"
          value={acceptedCandidates ?? 0}
          icon={CheckIcon}
          tone="emerald"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-base font-semibold text-ink-900">Recent Jobs</h3>
          {recentJobs?.length ? (
            <ul className="mt-4 divide-y divide-ink-100">
              {recentJobs.map((job) => (
                <li key={job._id || job.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-ink-900">{job.title}</p>
                    <p className="text-ink-500">{job.location}</p>
                  </div>
                  <span className="text-xs text-ink-400">{formatDate(job.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6">
              <EmptyState title="No jobs posted yet" message="Post your first job to see it here." />
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-base font-semibold text-ink-900">Recent Applications</h3>
          {recentApplications?.length ? (
            <ul className="mt-4 divide-y divide-ink-100">
              {recentApplications.map((app) => {
                const applicant = app.User || app.user || {};
                const job = app.Job || app.job || {};
                return (
                  <li key={app._id || app.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium text-ink-900">{applicant.name || "Applicant"}</p>
                      <p className="text-ink-500">{job.title || "Job"}</p>
                    </div>
                    <Badge tone={statusTone(app.status)}>{app.status}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-6">
              <EmptyState title="No applications yet" message="Applications will appear here once candidates apply." />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
