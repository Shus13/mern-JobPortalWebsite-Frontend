import { Link } from "react-router-dom";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                <path d="M4 9.5l8-4 8 4-8 4-8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M8 12v4.5l4 2 4-2V12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            Hirely
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-500">
            A focused space where job seekers and employers find the right match, faster.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">For Job Seekers</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
            <li>
              <Link to="/jobs" className="hover:text-brand-600">Browse jobs</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-brand-600">Create an account</Link>
            </li>
            <li>
              <Link to="/applications" className="hover:text-brand-600">Track applications</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">For Employers</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
            <li>
              <Link to="/register" className="hover:text-brand-600">Post a job</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-brand-600">Employer dashboard</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
            <li>
              <Link to="/about" className="hover:text-brand-600">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand-600">Contact</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-brand-600">Privacy</Link>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-ink-100 py-6">
        <Container>
          <p className="text-center text-xs text-ink-400">
            © {new Date().getFullYear()} Hirely. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
