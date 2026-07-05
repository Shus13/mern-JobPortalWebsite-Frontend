const TONES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  reviewed: "bg-sky-50 text-sky-700 ring-sky-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
};

const Badge = ({ children, tone = "neutral", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${TONES[tone] || TONES.neutral} ${className}`}
    >
      {children}
    </span>
  );
};

export const statusTone = (status) => {
  switch (status) {
    case "pending":
      return "pending";
    case "reviewed":
      return "reviewed";
    case "accepted":
      return "accepted";
    case "rejected":
      return "rejected";
    default:
      return "neutral";
  }
};

export default Badge;
