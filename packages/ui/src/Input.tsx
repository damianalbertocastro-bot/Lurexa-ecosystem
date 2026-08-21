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
      {label && <label htmlFor={inputId} className="text-sm font-bold text-[#243d82]">{label}</label>}
      <input
        {...props}
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy}
        className={`min-h-11 w-full rounded-xl border bg-white px-3.5 py-2.5 text-[#071d67] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#1d5add] focus:ring-4 focus:ring-[#1d5add]/10 motion-reduce:transition-none ${error ? "border-[#d5485f] focus:border-[#d5485f] focus:ring-[#d5485f]/10" : "border-[#d7e0f6]"} ${className}`}
      />
      {error && <span id={errorId} role="alert" className="text-xs font-semibold text-[#c62d48]">{error}</span>}
    </div>
  );
});
Input.displayName = "Input";
