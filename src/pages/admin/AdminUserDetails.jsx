import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { formatDate } from "../../utils/format";
import { fileUrl } from "../../services/userApi";
import { getUserById, downloadUserResume } from "../../services/adminApi";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getUserById(id);
        if (mounted) setUser(data.user || data);
      } catch {
        toast.error("Could not load this user");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadUserResume(id, `${user?.name || "user"}-resume`);
    } catch (err) {
      toast.error(err.message || "Could not download resume");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <Loader label="Loading user…" fullHeight />;

  if (!user) {
    return <EmptyState title="User not found" message="This account may have been removed." />;
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

      <PageTitle title="User Profile" subtitle="Full account details as an admin." />

      <Card className="max-w-2xl p-8">
        <div className="flex items-center gap-4">
          {user.profilePhoto ? (
            <img
              src={fileUrl(user.profilePhoto)}
              alt={user.name}
              className="h-16 w-16 shrink-0 rounded-2xl border border-ink-100 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 font-display text-xl font-bold text-brand-600">
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">{user.name}</h2>
            <Badge tone={user.role === "JobProvider" ? "brand" : "neutral"} className="mt-1">
              {user.role}
            </Badge>
          </div>
        </div>

        <dl className="mt-8 space-y-4 border-t border-ink-100 pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Email</dt>
            <dd className="font-medium text-ink-800">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Joined</dt>
            <dd className="font-medium text-ink-800">{formatDate(user.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink-500">Resume / CV</dt>
            <dd>
              {user.resume ? (
                <Button size="sm" variant="secondary" isLoading={isDownloading} onClick={handleDownload}>
                  Download
                </Button>
              ) : (
                <span className="text-ink-400">Not uploaded</span>
              )}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
};

export default AdminUserDetails;
