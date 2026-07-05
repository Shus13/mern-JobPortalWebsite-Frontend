const ICONS = {
  location: (
    <path
      d="M12 21s7-6.1 7-11.5A7 7 0 105 9.5C5 14.9 12 21 12 21z M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  salary: (
    <path
      d="M12 3v18M17 6.5c0-1.8-2-3-5-3s-5 1.2-5 3 2 3 5 3 5 1.2 5 3-2 3-5 3-5-1.2-5-3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  company: (
    <path
      d="M4 21V6l8-3 8 3v15M9 21v-5h6v5M9 10h.01M9 13h.01M15 10h.01M15 13h.01"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  date: (
    <path
      d="M8 3v3M16 3v3M4 9h16M5 6h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

const JobInfo = ({ type, children, className = "" }) => {
  return (
    <div className={`flex items-center gap-1.5 text-sm text-ink-500 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-ink-400">
        {ICONS[type]}
      </svg>
      <span className="truncate">{children}</span>
    </div>
  );
};

export default JobInfo;
