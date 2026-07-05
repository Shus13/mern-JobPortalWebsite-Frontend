import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import PageTitle from "../../components/ui/PageTitle";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ApplicationCard from "../../components/applications/ApplicationCard";
import { getMyApplications, withdrawApplication } from "../../services/applicationApi";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getMyApplications();
      setApplications(data.applications || data || []);
    } catch {
      toast.error("Could not load your applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleConfirmWithdraw = async () => {
    setWithdrawingId(pendingId);
    try {
      await withdrawApplication(pendingId);
      setApplications((prev) => prev.filter((a) => (a._id || a.id) !== pendingId));
      toast.success("Application withdrawn");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not withdraw application");
    } finally {
      setWithdrawingId(null);
      setPendingId(null);
    }
  };

  return (
    <Container className="py-12">
      <PageTitle
        title="My Applications"
        subtitle="Track the status of every job you've applied to."
      />

      {isLoading && <Loader label="Loading your applications…" />}

      {!isLoading && applications.length === 0 && (
        <EmptyState
          title="No applications yet"
          message="Once you apply to a job, you'll be able to track its status here."
          actionLabel="Browse Jobs"
          onAction={() => (window.location.href = "/jobs")}
        />
      )}

      {!isLoading && applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id || application.id}
              application={application}
              isWithdrawing={withdrawingId === (application._id || application.id)}
              onWithdraw={(appId) => setPendingId(appId)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingId)}
        title="Withdraw application?"
        message="This will permanently withdraw your application. You can re-apply later if the job is still open."
        confirmLabel="Withdraw"
        isLoading={Boolean(withdrawingId)}
        onCancel={() => setPendingId(null)}
        onConfirm={handleConfirmWithdraw}
      />
    </Container>
  );
};

export default MyApplications;
