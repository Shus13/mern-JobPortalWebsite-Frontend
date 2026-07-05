import Card from "../ui/Card";
import Badge, { statusTone } from "../ui/Badge";
import Button from "../ui/Button";
import JobInfo from "../jobs/JobInfo";
import { formatDate } from "../../utils/format";

const WITHDRAWABLE_STATUSES = ["pending", "reviewed"];

const ApplicationCard = ({ application, onWithdraw, isWithdrawing }) => {
  // Sequelize's default include alias is the model name, capitalized (`Job`),
  // since the association doesn't set a custom `as`.
  const job = application.Job || application.job || {};
  const canWithdraw = WITHDRAWABLE_STATUSES.includes(application.status);

  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h3 className="truncate font-display text-base font-semibold text-ink-900">
            {job.title || "Job posting removed"}
          </h3>
          <Badge tone={statusTone(application.status)}>{application.status}</Badge>
        </div>
        <p className="mt-1 text-sm font-medium text-ink-600">{job.company}</p>
        <div className="mt-2">
          <JobInfo type="date">Applied {formatDate(application.createdAt)}</JobInfo>
        </div>
      </div>

      {canWithdraw && (
        <Button
          variant="danger"
          size="sm"
          isLoading={isWithdrawing}
          onClick={() => onWithdraw(application._id || application.id)}
          className="shrink-0"
        >
          Withdraw
        </Button>
      )}
    </Card>
  );
};

export default ApplicationCard;
