const EmptyState = ({ title = "Nothing here yet", message, actionLabel, onAction, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
            <path
              d="M4 13V19a2 2 0 002 2h12a2 2 0 002-2v-6M4 13l2.2-6.6A2 2 0 018.1 5h7.8a2 2 0 011.9 1.4L20 13M4 13h4.5a1 1 0 01.9.55L10 15h4l.6-1.45a1 1 0 01.9-.55H20"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{message}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="focus-ring mt-6 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
