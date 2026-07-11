import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Button from "../../components/ui/Button";
import { SkeletonRow } from "../../components/ui/Loader";
import { formatDate, formatSalary } from "../../utils/format";
import { getAllJobsAdmin, deleteJobAdmin } from "../../services/adminApi";

const PAGE_SIZE = 10;

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pendingId, setPendingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getAllJobsAdmin();
      setJobs(data.jobs || data || []);
    } catch {
      toast.error("Could not load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return jobs;
    const q = query.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.User?.name?.toLowerCase().includes(q) ||
        j.User?.email?.toLowerCase().includes(q)
    );
  }, [jobs, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleConfirmDelete = async () => {
    setDeletingId(pendingId);
    try {
      await deleteJobAdmin(pendingId);
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
      <PageTitle title="All Jobs" subtitle={`${jobs.length} job posting${jobs.length === 1 ? "" : "s"} across every employer.`} />

      <div className="mb-5 max-w-sm">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title, company, or employer"
          className="focus-ring w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm placeholder:text-ink-400 hover:border-ink-300"
        />
      </div>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState title="No jobs found" message="Try a different search." />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <th className="px-5 py-3.5">Job Title</th>
                    <th className="px-5 py-3.5">Company</th>
                    <th className="px-5 py-3.5">Posted By</th>
                    <th className="px-5 py-3.5">Salary</th>
                    <th className="px-5 py-3.5">Created</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {isLoading &&
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}

                  {!isLoading &&
                    paginated.map((job) => {
                      const id = job._id || job.id;
                      return (
                        <tr key={id} className="transition-colors hover:bg-ink-50/50">
                          <td className="max-w-50 px-5 py-4 font-medium text-ink-900">
                            <span className="line-clamp-1">{job.title}</span>
                          </td>
                          <td className="px-5 py-4 text-ink-600">{job.company}</td>
                          <td className="px-5 py-4 text-ink-600">
                            <div className="flex flex-col">
                              <span>{job.User?.name || "—"}</span>
                              <span className="text-xs text-ink-400">{job.User?.email}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-ink-600">{formatSalary(job.salary)}</td>
                          <td className="px-5 py-4 text-ink-500">{formatDate(job.createdAt)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/jobs/${id}`}
                                className="focus-ring rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100"
                              >
                                View
                              </Link>
                              <Button
                                size="sm"
                                variant="danger"
                                disabled={deletingId === id}
                                onClick={() => setPendingId(id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between text-sm text-ink-500">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </Button>
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
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
        message="This permanently removes the job posting and all of its applications. This cannot be undone."
        confirmLabel="Delete"
        isLoading={Boolean(deletingId)}
        onCancel={() => setPendingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminJobs;
