import { Link } from "react-router-dom";
import { SkeletonRow } from "../ui/Loader";
import { formatDate, formatSalary } from "../../utils/format";

const JobTable = ({ jobs, isLoading, onDelete, deletingId }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-semibold uppercase tracking-wide text-ink-500">
              <th className="px-5 py-3.5">Job Title</th>
              <th className="px-5 py-3.5">Company</th>
              <th className="px-5 py-3.5">Location</th>
              <th className="px-5 py-3.5">Salary</th>
              <th className="px-5 py-3.5">Created</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}

            {!isLoading &&
              jobs.map((job) => {
                const id = job._id || job.id;
                return (
                  <tr key={id} className="transition-colors hover:bg-ink-50/50">
                    <td className="max-w-[220px] px-5 py-4 font-medium text-ink-900">
                      <span className="line-clamp-1">{job.title}</span>
                    </td>
                    <td className="px-5 py-4 text-ink-600">{job.company}</td>
                    <td className="px-5 py-4 text-ink-600">{job.location}</td>
                    <td className="px-5 py-4 text-ink-600">{formatSalary(job.salary)}</td>
                    <td className="px-5 py-4 text-ink-500">{formatDate(job.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/jobs/${id}`}
                          className="focus-ring rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100"
                        >
                          View
                        </Link>
                        <Link
                          to={`/dashboard/jobs/${id}/applicants`}
                          className="focus-ring rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50"
                        >
                          Applicants
                        </Link>
                        <Link
                          to={`/dashboard/jobs/${id}/edit`}
                          className="focus-ring rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(id)}
                          disabled={deletingId === id}
                          className="focus-ring rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;
