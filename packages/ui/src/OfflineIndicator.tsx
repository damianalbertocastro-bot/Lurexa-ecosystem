"use client";

import React, { useEffect, useState } from "react";

export interface OfflineIndicatorProps {
  pendingCount?: number;
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  pendingCount = 0,
  className = "",
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <aside
      aria-live="polite"
      role="status"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs font-extrabold shadow-[0_12px_28px_rgba(7,29,103,0.18)] backdrop-blur-md transition-all duration-300 motion-reduce:transition-none ${
        !isOnline
          ? "border-[#ffd37a] bg-[#fff8e8] text-[#8f5200]"
          : "border-[#bfe8ff] bg-[#f0f9ff] text-[#006097]"
      } ${className}`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          !isOnline ? "bg-[#e58a00] animate-pulse" : "bg-[#0284c7]"
        }`}
        aria-hidden="true"
      />
      <span>
        {!isOnline
          ? "Offline Mode — Local Dexie storage active"
          : `Online — Syncing ${pendingCount} pending updates...`}
      </span>
    </aside>
  );
};
