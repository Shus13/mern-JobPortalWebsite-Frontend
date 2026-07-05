import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { fileUrl } from "../../services/userApi";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    end: true,
    icon: (
      <path
        d="M4 13h6V4H4v9zM4 20h6v-4H4v4zM14 20h6v-9h-6v9zM14 4v4h6V4h-6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: "/dashboard/jobs",
    label: "My Jobs",
    icon: (
      <path
        d="M4 21V6l8-3 8 3v15M9 21v-5h6v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: "/dashboard/jobs/new",
    label: "Post Job",
    icon: (
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ),
  },
];

const DashboardSidebar = ({ onNavigate }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-ink-100 bg-white p-4">
      <div>
        <div className="mb-6 flex items-center gap-2 px-2 font-display text-lg font-extrabold text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
              <path d="M4 9.5l8-4 8 4-8 4-8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M8 12v4.5l4 2 4-2V12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </span>
          Hirely
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                }`
              }
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5 shrink-0">
                {link.icon}
              </svg>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-ink-100 pt-4">
        <Link
          to="/profile"
          onClick={onNavigate}
          className="focus-ring mb-1 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-ink-50"
        >
          {user?.profilePhoto ? (
            <img
              src={fileUrl(user.profilePhoto)}
              alt={user.name}
              className="h-9 w-9 shrink-0 rounded-full border border-ink-200 object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-700">
              {user?.name?.charAt(0)?.toUpperCase() || "E"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-900">{user?.name}</p>
            <p className="truncate text-xs text-ink-400">{user?.email}</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-ink-300">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        
        <button
          onClick={handleLogout}
          className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
            <path
              d="M15 17l5-5-5-5M20 12H9M13 21H7a2 2 0 01-2-2V5a2 2 0 012-2h6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
