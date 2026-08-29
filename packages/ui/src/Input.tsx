import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", id, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id || props.name || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex w-full flex-col gap-2">
      {label && <label htmlFor={inputId} className="text-sm font-bold text-[var(--lx-ink)]">{label}</label>}
      <input
        {...props}
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy}
        className={`min-h-11 w-full rounded-xl border bg-[var(--lx-surface)] px-3.5 py-2.5 text-[var(--lx-ink)] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--lx-secondary)] focus:ring-4 focus:ring-[var(--lx-secondary)]/15 focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring,#1d5add)] motion-reduce:transition-none ${error ? "border-[var(--lx-destructive)] focus:border-[var(--lx-destructive)] focus:ring-[var(--lx-destructive)]/15" : "border-[var(--lx-border)]"} ${className}`}
      />
      {error && <span id={errorId} role="alert" className="text-xs font-semibold text-[var(--lx-destructive)]">{error}</span>}
    </div>
  );
});
Input.displayName = "Input";
