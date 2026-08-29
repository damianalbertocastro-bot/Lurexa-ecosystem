import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface OfflineIndicatorProps {
  isOnline?: boolean;
  queuedSyncCount?: number;
  cachedModulesCount?: number;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline = true,
  queuedSyncCount = 0,
  cachedModulesCount = 1,
}) => {
  if (isOnline && queuedSyncCount === 0) {
    return null;
  }

  return (
    <View style={[styles.container, isOnline ? styles.syncingContainer : styles.offlineContainer]}>
      <View style={styles.dot} />
      <View style={styles.textContainer}>
        <Text style={styles.primaryText}>
          {isOnline
            ? `Syncing ${queuedSyncCount} pending offline learning actions...`
            : `Offline Mode Active • ${cachedModulesCount} Module Cached`}
        </Text>
        <Text style={styles.secondaryText}>
          {isOnline
            ? "Lurexa Core persistence in progress"
            : "Evidence will automatically sync when connection restores"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    gap: 10,
  },
  offlineContainer: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  syncingContainer: {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.3)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f59e0b",
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700",
  },
  secondaryText: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "400",
  },
});
