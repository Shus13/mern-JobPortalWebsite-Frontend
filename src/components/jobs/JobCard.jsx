import { Link } from "react-router-dom";
import Card from "../ui/Card";
import JobInfo from "./JobInfo";
import { formatSalary, timeAgo } from "../../utils/format";
import { fileUrl } from "../../services/userApi";

const JobCard = ({ job }) => {
  const id = job._id || job.id;
  const employer = job.User || job.user;
  const logoUrl = fileUrl(employer?.profilePhoto);

  return (
    <Card hover className="flex h-full flex-col p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={job.company}
            className="h-11 w-11 shrink-0 rounded-xl border border-ink-100 object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-display text-base font-bold text-brand-600">
            {job.company?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <span className="whitespace-nowrap rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-500">
          {timeAgo(job.createdAt || job.postedDate)}
        </span>
      </div>

      <h3 className="font-display text-base font-semibold leading-snug text-ink-900">
        {job.title}
      </h3>
      <p className="mt-0.5 text-sm font-medium text-ink-600">{job.company}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <JobInfo type="location">{job.location}</JobInfo>
        <JobInfo type="salary">{formatSalary(job.salary)}</JobInfo>
      </div>

      {job.description && (
        <p className="mt-3 line-clamp-2 text-sm text-ink-500">{job.description}</p>
      )}

      <div className="mt-5 border-t border-ink-100 pt-4">
        <Link
          to={`/jobs/${id}`}
          className="focus-ring inline-flex w-full items-center justify-center rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
        >
          View Details
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;
