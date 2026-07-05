import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Container from "./Container";
import Button from "../ui/Button";
import { fileUrl } from "../../services/userApi";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-brand-600" : "text-ink-600 hover:text-ink-900"
  }`;

const Navbar = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                <path
                  d="M4 9.5l8-4 8 4-8 4-8-4z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M8 12v4.5l4 2 4-2V12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            Hirely
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              Browse Jobs
            </NavLink>
            {isAuthenticated && role === "JobSeeker" && (
              <NavLink to="/applications" className={navLinkClass}>
                My Applications
              </NavLink>
            )}
            {isAuthenticated && role === "JobProvider" && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!isAuthenticated && (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="focus-ring flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
                >
                  {user?.profilePhoto ? (
                    <img
                      src={fileUrl(user.profilePhoto)}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border border-ink-200 object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-display text-xs font-bold text-brand-700">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  )}
                  <span className="text-sm text-ink-600">
                    <span className="font-medium text-ink-800">{user?.name?.split(" ")[0]}</span>
                  </span>
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            )}
          </div>

          <button
            className="focus-ring rounded-lg p-2 text-ink-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>
      </Container>

      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <NavLink to="/" end onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              Home
            </NavLink>
            <NavLink to="/jobs" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              Browse Jobs
            </NavLink>
            {isAuthenticated && role === "JobSeeker" && (
              <NavLink to="/applications" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                My Applications
              </NavLink>
            )}
            {isAuthenticated && role === "JobProvider" && (
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                Dashboard
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/profile" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                My Profile
              </NavLink>
            )}
            <div className="mt-3 flex gap-2 px-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="w-full">
                    <Button variant="secondary" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="w-full">
                    <Button variant="primary" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </>
              ) : (
                <Button variant="secondary" className="w-full" onClick={handleLogout}>
                  Log out
                </Button>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
};

export default Navbar;
