import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import JobTable from "../../components/employer/JobTable";
import { getMyJobs, deleteJob } from "../../services/jobApi";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getMyJobs();
      setJobs(data.jobs || data || []);
    } catch {
      toast.error("Could not load your jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!query.trim()) return jobs;
    const q = query.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q)
    );
  }, [jobs, query]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const paginatedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleConfirmDelete = async () => {
    setDeletingId(pendingId);
    try {
      await deleteJob(pendingId);
      setJobs((prev) => prev.filter((j) => (j._id || j.id) !== pendingId));
      toast.success("Job deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete job");
    } finally {
      setDeletingId(null);
      setPendingId(null);
    }
  };

  return (
    <div>
      <PageTitle
        title="My Jobs"
        subtitle={`${jobs.length} job posting${jobs.length === 1 ? "" : "s"} in total.`}
        actions={
          <Link to="/dashboard/jobs/new">
            <Button>+ Post Job</Button>
          </Link>
        }
      />

      <div className="mb-5 max-w-sm">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title or location"
          className="focus-ring w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm placeholder:text-ink-400 hover:border-ink-300"
        />
      </div>

      {!isLoading && filteredJobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          message="Post your first job listing to start receiving applications."
          actionLabel="Post Job"
          onAction={() => (window.location.href = "/dashboard/jobs/new")}
        />
      ) : (
        <>
          <JobTable
            jobs={paginatedJobs}
            isLoading={isLoading}
            onDelete={(id) => setPendingId(id)}
            deletingId={deletingId}
          />

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between text-sm text-ink-500">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingId)}
        title="Delete this job?"
        message="This will permanently remove the job posting and cannot be undone."
        confirmLabel="Delete"
        isLoading={Boolean(deletingId)}
        onCancel={() => setPendingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MyJobs;
