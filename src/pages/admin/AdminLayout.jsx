import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ink-50/40">
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <AdminSidebar />
        </div>
      </div>

      <div className="flex-1">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
          <span className="font-display text-base font-bold text-ink-900">Admin</span>
          <button
            onClick={() => setMobileOpen(true)}
            className="focus-ring rounded-lg p-2 text-ink-700"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-ink-950/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64">
              <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
