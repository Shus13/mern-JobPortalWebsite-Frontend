const VARIANTS = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-soft disabled:bg-brand-300",
  secondary:
    "bg-white text-ink-800 border border-ink-200 hover:border-brand-300 hover:text-brand-600 disabled:text-ink-300",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100 disabled:text-ink-300",
  danger:
    "bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:text-red-200",
  dangerSolid: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  type = "button",
  className = "",
  icon: Icon,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed active:scale-[0.98] ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {!isLoading && Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;
