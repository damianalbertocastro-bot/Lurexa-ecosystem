import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, ariaLabel, children }) => {
  const titleId = React.useId();
  if (!isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel ?? "Dialog"}
        className="animate-scale-in relative w-full max-w-lg rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-[var(--lx-border)] pb-3">
          {title && <h2 id={titleId} className="text-xl font-bold text-[var(--lx-ink)]">{title}</h2>}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto grid min-h-11 min-w-11 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring,#1d5add)] focus-visible:ring-offset-2 motion-reduce:transition-none"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
