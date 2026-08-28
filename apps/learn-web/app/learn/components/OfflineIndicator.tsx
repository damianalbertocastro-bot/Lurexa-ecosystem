"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@lurexa/ui/Toast";
import { useSoundEffects } from "@lurexa/ui/useSoundEffects";
import { OfflineSyncService } from "@lurexa/backend";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine
  );
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  const { playSuccess } = useSoundEffects();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = async () => {
      setIsOnline(true);
      setSyncing(true);
      try {
        const result = await OfflineSyncService.processPendingSyncQueue();
        const totalSynced = result.syncedMutations + result.syncedEvidence + result.syncedDeltas;
        if (totalSynced > 0) {
          playSuccess();
          toast({
            variant: "success",
            title: "Back online",
            description: `Synchronized ${totalSynced} offline learning updates with Lurexa Core.`,
          });
        }
      } catch (err) {
        console.warn("Offline sync error", err);
      } finally {
        setSyncing(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        variant: "info",
        title: "Offline mode active",
        description: "You can continue practicing. Progress is stored safely on your device.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [playSuccess, toast]);

  if (isOnline && !syncing) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-slide-up">
      {!isOnline ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-[var(--lx-surface)] px-4 py-2.5 shadow-xl backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-black text-amber-700 dark:text-amber-300">
            Offline Mode — Changes Saved Locally
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-2xl border border-indigo-500/30 bg-[var(--lx-surface)] px-4 py-2.5 shadow-xl backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-spin" />
          <span className="text-xs font-black text-indigo-700 dark:text-indigo-300">
            Syncing Offline Progress…
          </span>
        </div>
      )}
    </div>
  );
}
