import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, hint, className = "", textarea = false, rows = 5, ...props }, ref) => {
    const Component = textarea ? "textarea" : "input";
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-ink-800">
            {label}
          </label>
        )}
        <Component
          ref={ref}
          rows={textarea ? rows : undefined}
          className={`focus-ring w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors duration-150 ${
            error
              ? "border-red-300 focus-visible:outline-red-400"
              : "border-ink-200 hover:border-ink-300"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
