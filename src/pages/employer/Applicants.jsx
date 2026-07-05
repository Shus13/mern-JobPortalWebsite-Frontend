import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import EmptyState from "../../components/ui/EmptyState";
import Badge, { statusTone } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { SkeletonRow } from "../../components/ui/Loader";
import { formatDate } from "../../utils/format";
import { getApplicantsForJob, updateApplicationStatus, downloadApplicantResume } from "../../services/applicationApi";
import { fileUrl } from "../../services/userApi";

const PAGE_SIZE = 8;

const Applicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const loadApplicants = async () => {
    setIsLoading(true);
    try {
      const data = await getApplicantsForJob(id);
      // Backend returns { count, applicants }, not { applications }.
      setApplications(data.applicants || data.applications || data || []);
    } catch {
      toast.error("Could not load applicants");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filtered = useMemo(() => {
    if (!query.trim()) return applications;
    const q = query.toLowerCase();
    return applications.filter(
      (a) =>
        (a.User || a.user)?.name?.toLowerCase().includes(q) ||
        (a.User || a.user)?.email?.toLowerCase().includes(q)
    );
  }, [applications, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((a) => ((a._id || a.id) === applicationId ? { ...a, status } : a))
      );
      toast.success(`Application marked as ${status}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadResume = async (applicationId, applicantName) => {
    setDownloadingId(applicationId);
    try {
      await downloadApplicantResume(applicationId, `${applicantName || "applicant"}-resume`);
    } catch (err) {
      toast.error(err.message || "Could not download resume");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <PageTitle title="Applicants" subtitle="Review and manage candidates for this job." />

      <div className="mb-5 max-w-sm">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email"
          className="focus-ring w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm placeholder:text-ink-400 hover:border-ink-300"
        />
      </div>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          message="Once candidates apply to this job, they'll show up here."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <th className="px-5 py-3.5">Applicant Name</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Applied Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">CV</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {isLoading &&
                    Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}

                  {!isLoading &&
                    paginated.map((app) => {
                      const appId = app._id || app.id;
                      const isUpdating = updatingId === appId;
                      const isDownloading = downloadingId === appId;
                      const applicant = app.User || app.user || {};
                      return (
                        <tr key={appId} className="transition-colors hover:bg-ink-50/50">
                          <td className="px-5 py-4 font-medium text-ink-900">
                            <div className="flex items-center gap-2.5">
                              {applicant.profilePhoto ? (
                                <img
                                  src={fileUrl(applicant.profilePhoto)}
                                  alt={applicant.name}
                                  className="h-8 w-8 shrink-0 rounded-full border border-ink-200 object-cover"
                                />
                              ) : (
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xs font-bold text-brand-700">
                                  {applicant.name?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                              )}
                              <span>{applicant.name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-ink-600">{applicant.email || "—"}</td>
                          <td className="px-5 py-4 text-ink-500">{formatDate(app.createdAt)}</td>
                          <td className="px-5 py-4">
                            <Badge tone={statusTone(app.status)}>{app.status}</Badge>
                          </td>
                          <td className="px-5 py-4">
                            {applicant.resume ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                isLoading={isDownloading}
                                onClick={() => handleDownloadResume(appId, applicant.name)}
                              >
                                Download
                              </Button>
                            ) : (
                              <span className="text-xs text-ink-400">Not uploaded</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={isUpdating || app.status === "reviewed"}
                                onClick={() => handleStatusChange(appId, "reviewed")}
                              >
                                Review
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                disabled={isUpdating || app.status === "accepted"}
                                onClick={() => handleStatusChange(appId, "accepted")}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                disabled={isUpdating || app.status === "rejected"}
                                onClick={() => handleStatusChange(appId, "rejected")}
                              >
                                Reject
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
    </div>
  );
};

export default Applicants;
