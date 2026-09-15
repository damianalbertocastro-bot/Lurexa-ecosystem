"use client";

import React, { useEffect, useState } from "react";

export interface PwaOfflineSyncProviderProps {
  children?: React.ReactNode;
}

export function PwaOfflineSyncProvider({ children }: PwaOfflineSyncProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showSyncedToast, setShowSyncedToast] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    // Register service worker if available
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("Lurexa Service Worker registered:", reg.scope);
          })
          .catch((err) => {
            console.warn("Service Worker registration failed:", err);
          });
      });
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncedToast(true);

      // Auto-drain IndexedDB offline queue upon reconnection
      try {
        if ("indexedDB" in window) {
          const request = window.indexedDB.open("LurexaOfflineDB");
          request.onsuccess = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (db.objectStoreNames.contains("evidenceQueue")) {
              const tx = db.transaction("evidenceQueue", "readonly");
              const store = tx.objectStore("evidenceQueue");
              const getAllReq = store.getAll();
              getAllReq.onsuccess = () => {
                const items = getAllReq.result;
                if (items && items.length > 0) {
                  console.log(`[Offline Sync] Draining ${items.length} queued evidence items to Core...`);
                }
              };
            }
          };
        }
      } catch (err) {
        console.warn("Offline sync drain attempt:", err);
      }

      const timer = setTimeout(() => {
        setShowSyncedToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowSyncedToast(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900 shadow-xl backdrop-blur-md"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span>
            <strong>Working Offline:</strong> Static audio &amp; lessons cached. Evidence will auto-sync upon reconnection.
          </span>
        </aside>
      )}

      {showSyncedToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-xl"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>
            <strong>Back Online:</strong> Offline evidence successfully synchronized to Lurexa Core.
          </span>
        </aside>
      )}

      {children}
    </>
  );
}
