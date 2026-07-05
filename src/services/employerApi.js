import { getMyJobs } from "./jobApi";
import { getApplicantsForJob } from "./applicationApi";

/**
 * There is no dedicated dashboard-stats endpoint in the backend, so this
 * composes an overview from /jobs/my and /applications/job/:jobId.
 * Keeps the aggregation logic out of components, per the service-layer rule.
 */
export const getDashboardOverview = async () => {
  const { jobs = [] } = await getMyJobs();

  const applicationsByJob = await Promise.all(
    jobs.map((job) =>
      getApplicantsForJob(job._id || job.id).catch(() => ({ applicants: [] }))
    )
  );

  // Backend returns { count, applicants } for this endpoint.
  const allApplications = applicationsByJob.flatMap(
    (res) => res.applicants || res.applications || res || []
  );

  const totalJobs = jobs.length;
  const totalApplications = allApplications.length;
  const acceptedCandidates = allApplications.filter(
    (a) => a.status === "accepted"
  ).length;

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentApplications = [...allApplications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return {
    totalJobs,
    totalApplications,
    acceptedCandidates,
    recentJobs,
    recentApplications,
  };
};
