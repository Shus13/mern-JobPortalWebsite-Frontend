import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { SkeletonRow } from "../../components/ui/Loader";
import { formatDate } from "../../utils/format";
import { fileUrl } from "../../services/userApi";
import { getAllUsers, deleteUser } from "../../services/adminApi";

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingId, setPendingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data.users || data || []);
    } catch {
      toast.error("Could not load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, query, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleConfirmDelete = async () => {
    setDeletingId(pendingId);
    try {
      await deleteUser(pendingId);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== pendingId));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete user");
    } finally {
      setDeletingId(null);
      setPendingId(null);
    }
  };

  return (
    <div>
      <PageTitle title="Users" subtitle={`${users.length} registered user${users.length === 1 ? "" : "s"} (excluding admins).`} />

      <div className="mb-5 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email"
          className="focus-ring w-full max-w-sm rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm placeholder:text-ink-400 hover:border-ink-300"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="focus-ring rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 hover:border-ink-300"
        >
          <option value="all">All roles</option>
          <option value="JobSeeker">Job Seekers</option>
          <option value="JobProvider">Employers</option>
        </select>
      </div>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState title="No users found" message="Try a different search or filter." />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Joined</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {isLoading &&
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)}

                  {!isLoading &&
                    paginated.map((u) => {
                      const id = u._id || u.id;
                      return (
                        <tr key={id} className="transition-colors hover:bg-ink-50/50">
                          <td className="px-5 py-4 font-medium text-ink-900">
                            <div className="flex items-center gap-2.5">
                              {u.profilePhoto ? (
                                <img
                                  src={fileUrl(u.profilePhoto)}
                                  alt={u.name}
                                  className="h-8 w-8 shrink-0 rounded-full border border-ink-200 object-cover"
                                />
                              ) : (
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xs font-bold text-brand-700">
                                  {u.name?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                              )}
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-ink-600">{u.email}</td>
                          <td className="px-5 py-4">
                            <Badge tone={u.role === "JobProvider" ? "brand" : "neutral"}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-ink-500">{formatDate(u.createdAt)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/users/${id}`}
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
        title="Delete this user?"
        message="This permanently removes their account, job postings, and applications. This cannot be undone."
        confirmLabel="Delete"
        isLoading={Boolean(deletingId)}
        onCancel={() => setPendingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminUsers;
