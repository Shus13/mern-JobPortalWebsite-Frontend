import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import JobInfo from "../../components/jobs/JobInfo";
import { useAuth } from "../../hooks/useAuth";
import { getJobById } from "../../services/jobApi";
import { applyToJob, getMyApplications } from "../../services/applicationApi";
import { fileUrl } from "../../services/userApi";
import { formatDate, formatSalary } from "../../utils/format";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getJobById(id);
        if (!mounted) return;
        setJob(data.job || data);

        if (isAuthenticated && role === "JobSeeker") {
          try {
            const appsData = await getMyApplications();
            const apps = appsData.applications || appsData || [];
            // `jobId` is a direct column on Application, so it's always
            // present regardless of how the Job association is aliased.
            const applied = apps.some((a) => a.jobId === id);
            if (mounted) setHasApplied(applied);
          } catch {
            // non-fatal: apply button will just show default state
          }
        }
      } catch {
        if (mounted) setError("This job posting could not be found.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, isAuthenticated, role]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const data = await applyToJob(id);
      setHasApplied(true);
      // Backend returns 200 with a different message if you'd already
      // applied, so surface its own message rather than a generic one.
      toast.success(data?.message || "Application submitted!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not submit application");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) return <Loader label="Loading job details…" fullHeight />;

  if (error || !job) {
    return (
      <Container className="py-16">
        <EmptyState title="Job not found" message={error} />
      </Container>
    );
  }

  const renderApplyAction = () => {
    if (!isAuthenticated) {
      return (
        <Link to="/login" state={{ from: { pathname: `/jobs/${id}` } }}>
          <Button size="lg" className="w-full sm:w-auto">
            Login to Apply
          </Button>
        </Link>
      );
    }

    if (role === "JobProvider") {
      return (
        <Button size="lg" variant="secondary" disabled className="w-full sm:w-auto">
          Employers cannot apply
        </Button>
      );
    }

    if (hasApplied) {
      return (
        <Button size="lg" variant="secondary" disabled className="w-full sm:w-auto">
          Application Submitted
        </Button>
      );
    }

    return (
      <Button size="lg" className="w-full sm:w-auto" isLoading={isApplying} onClick={handleApply}>
        Apply Now
      </Button>
    );
  };

  return (
    <Container className="py-12">
      <button
        onClick={() => navigate(-1)}
        className="focus-ring mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="p-8 lg:col-span-2">
          <div className="flex items-start gap-4">
            {fileUrl(job.User?.profilePhoto) ? (
              <img
                src={fileUrl(job.User?.profilePhoto)}
                alt={job.company}
                className="h-14 w-14 shrink-0 rounded-2xl border border-ink-100 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 font-display text-xl font-bold text-brand-600">
                {job.company?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-bold text-ink-900">{job.title}</h1>
              <p className="mt-1 text-base font-medium text-ink-600">{job.company}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-ink-100 py-5">
            <JobInfo type="location">{job.location}</JobInfo>
            <JobInfo type="salary">{formatSalary(job.salary)}</JobInfo>
            <JobInfo type="date">Posted {formatDate(job.createdAt)}</JobInfo>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-ink-900">Job Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
              {job.description}
            </p>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-ink-900">About this role</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Employer</dt>
                <dd className="font-medium text-ink-800">
                  {job.User?.name || job.user?.name || job.company}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Location</dt>
                <dd className="font-medium text-ink-800">{job.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Salary(in month)</dt>
                <dd className="font-medium text-ink-800">{formatSalary(job.salary)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Posted</dt>
                <dd className="font-medium text-ink-800">{formatDate(job.createdAt)}</dd>
              </div>
            </dl>
            <div className="mt-6">{renderApplyAction()}</div>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default JobDetails;
