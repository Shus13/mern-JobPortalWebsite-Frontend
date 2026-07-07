import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import JobInfo from "../../components/jobs/JobInfo";
import { formatDate, formatSalary } from "../../utils/format";
import { fileUrl } from "../../services/userApi";
import { getJobById } from "../../services/jobApi";
import { deleteJobAdmin } from "../../services/adminApi";

const AdminJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getJobById(id);
        if (mounted) setJob(data.job || data);
      } catch {
        toast.error("Could not load this job");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteJobAdmin(id);
      toast.success("Job deleted");
      navigate("/admin/jobs");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete job");
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (isLoading) return <Loader label="Loading job…" fullHeight />;

  if (!job) {
    return <EmptyState title="Job not found" message="This posting may have been removed." />;
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="focus-ring mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <PageTitle
        title="Job Posting"
        subtitle="Full listing details as an admin."
        actions={
          <Button variant="dangerSolid" onClick={() => setConfirmOpen(true)}>
            Delete Job
          </Button>
        }
      />

      <Card className="max-w-2xl p-8">
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
            <h2 className="font-display text-xl font-bold text-ink-900">{job.title}</h2>
            <p className="mt-1 text-sm font-medium text-ink-600">{job.company}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-ink-100 py-5">
          <JobInfo type="location">{job.location}</JobInfo>
          <JobInfo type="salary">{formatSalary(job.salary)}</JobInfo>
          <JobInfo type="date">Posted {formatDate(job.createdAt)}</JobInfo>
        </div>

        <div className="mt-6">
          <h3 className="font-display text-base font-semibold text-ink-900">Description</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
            {job.description}
          </p>
        </div>

        <div className="mt-6 border-t border-ink-100 pt-5 text-sm">
          <p className="text-ink-500">Posted by</p>
          <p className="mt-1 font-medium text-ink-800">
            {job.User?.name || "—"} {job.User?.email && `· ${job.User.email}`}
          </p>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this job?"
        message="This permanently removes the job posting and all of its applications."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminJobDetails;
