"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@lurexa/ui/Badge";
import { OfflineSyncService } from "@lurexa/backend";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine
  );
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = async () => {
      setIsOnline(true);
      setSyncing(true);
      const result = await OfflineSyncService.processPendingSyncQueue();
      const totalSynced = result.syncedMutations + result.syncedEvidence + result.syncedDeltas;
      if (totalSynced > 0) {
        console.log(`Synced ${totalSynced} offline updates.`);
      }
      setSyncing(false);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !syncing) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce">
      {!isOnline ? (
        <Badge variant="warning">⚡ Offline Mode — Changes Saved Locally</Badge>
      ) : (
        <Badge variant="info">🔄 Syncing Offline Progress...</Badge>
      )}
    </div>
  );
}
