"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ToastVariant = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  durationMs?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastMessage, "id">) => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Individual Toast                                                   */
/* ------------------------------------------------------------------ */

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string; iconColor: string; progress: string }> = {
  success: { bg: "bg-white", border: "border-emerald-200", icon: "✓", iconColor: "bg-emerald-500 text-white", progress: "bg-emerald-500" },
  error:   { bg: "bg-white", border: "border-rose-200",    icon: "✕", iconColor: "bg-rose-500 text-white",    progress: "bg-rose-500" },
  info:    { bg: "bg-white", border: "border-indigo-200",   icon: "i", iconColor: "bg-indigo-500 text-white",  progress: "bg-indigo-500" },
};

function ToastItem({ message, onDismiss }: { message: ToastMessage; onDismiss: (id: string) => void }) {
  const [exiting, setExiting] = useState(false);
  const style = variantStyles[message.variant];
  const duration = message.durationMs ?? 4000;

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(message.id), 250);
  }, [message.id, onDismiss]);

  React.useEffect(() => {
    const timer = setTimeout(handleDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, handleDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${exiting ? "animate-slide-out-right" : "animate-slide-in-right"} pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border ${style.border} ${style.bg} p-4 shadow-[0_16px_40px_rgba(0,0,0,.1)]`}
    >
      <span className={`mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-xs font-black ${style.iconColor}`}>
        {style.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{message.title}</p>
        {message.description && <p className="mt-0.5 text-xs text-slate-500">{message.description}</p>}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${style.progress} animate-toast-progress`} style={{ animationDuration: `${duration}ms` }} />
        </div>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="mt-0.5 flex-shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        aria-label="Dismiss notification"
      >
        <span aria-hidden="true" className="text-xs">✕</span>
      </button>
    </div>
  );
}

export interface ToastProviderProps {
  children?: any;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const counterRef = useRef(0);

  const toast = useCallback((options: Omit<ToastMessage, "id">) => {
    const id = `toast-${++counterRef.current}-${Date.now()}`;
    setMessages((prev) => [...prev, { ...options, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {typeof window !== "undefined"
        ? ((createPortal(
            <div
              aria-label="Notifications"
              className="pointer-events-none fixed right-0 top-0 z-[60] flex max-h-screen w-full flex-col items-end gap-3 p-4 sm:max-w-md sm:p-6"
            >
              {messages.map((msg) => (
                <ToastItem key={msg.id} message={msg} onDismiss={dismiss} />
              ))}
            </div>,
            document.body,
          ) as unknown) as React.ReactNode)
        : null}
    </ToastContext.Provider>
  );
};
