export const Spinner = ({ className = "h-6 w-6", label = "Loading" }) => (
  <div role="status" aria-label={label} className="flex items-center justify-center">
    <svg className={`animate-spin text-brand-500 ${className}`} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
);

const Loader = ({ label = "Loading…", fullHeight = false }) => (
  <div
    className={`flex w-full flex-col items-center justify-center gap-3 py-16 ${
      fullHeight ? "min-h-[50vh]" : ""
    }`}
  >
    <Spinner className="h-8 w-8" />
    <p className="text-sm text-ink-500">{label}</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
    <div className="mb-4 h-5 w-2/3 rounded bg-ink-100" />
    <div className="mb-2 h-3 w-1/2 rounded bg-ink-100" />
    <div className="mb-2 h-3 w-1/3 rounded bg-ink-100" />
    <div className="mt-4 h-3 w-full rounded bg-ink-100" />
    <div className="mt-2 h-3 w-4/5 rounded bg-ink-100" />
    <div className="mt-5 h-9 w-28 rounded-xl bg-ink-100" />
  </div>
);

export const SkeletonRow = ({ cols = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-3 w-full max-w-30 rounded bg-ink-100" />
      </td>
    ))}
  </tr>
);

export default Loader;
