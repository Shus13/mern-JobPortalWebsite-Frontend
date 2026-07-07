import { useEffect, useState } from "react";
import PageTitle from "../../components/ui/PageTitle";
import DashboardCard from "../../components/employer/DashboardCard";
import Loader from "../../components/ui/Loader";
import { getAdminStats } from "../../services/adminApi";

const UsersIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M17 20v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 005 18.5V20M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SeekerIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EmployerIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M4 21V6l8-3 8 3v15M9 21v-5h6v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const JobsIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ApplicationsIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M4 13V19a2 2 0 002 2h12a2 2 0 002-2v-6M4 13l2.2-6.6A2 2 0 018.1 5h7.8a2 2 0 011.9 1.4L20 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAdminStats();
        if (mounted) setStats(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return <Loader label="Loading platform overview…" fullHeight />;

  return (
    <div>
      <PageTitle title="Admin Overview" subtitle="Platform-wide stats across every user, job, and application." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard label="Total Users" value={stats?.totalUsers ?? 0} icon={UsersIcon} tone="brand" />
        <DashboardCard label="Job Seekers" value={stats?.totalJobSeekers ?? 0} icon={SeekerIcon} tone="emerald" />
        <DashboardCard label="Employers" value={stats?.totalEmployers ?? 0} icon={EmployerIcon} tone="amber" />
        <DashboardCard label="Total Jobs" value={stats?.totalJobs ?? 0} icon={JobsIcon} tone="brand" />
        <DashboardCard label="Total Applications" value={stats?.totalApplications ?? 0} icon={ApplicationsIcon} tone="emerald" />
      </div>
    </div>
  );
};

export default AdminDashboardHome;
