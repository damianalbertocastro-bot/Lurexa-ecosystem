import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-600"
            type="button"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};