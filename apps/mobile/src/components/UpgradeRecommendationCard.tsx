import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import type { SubscriptionTier } from "@lurexa/types";

export interface UpgradeRecommendationCardProps {
  currentTier?: SubscriptionTier;
  targetTier?: SubscriptionTier;
  reason?: string;
  onUpgradePress?: (tier: SubscriptionTier) => void;
}

export const UpgradeRecommendationCard: React.FC<UpgradeRecommendationCardProps> = ({
  currentTier = "BASIC",
  targetTier = "ULTRA",
  reason = "Unlock real-time Universal Learner Model sync across Learn, Coach, and Teach with unlimited offline downloads.",
  onUpgradePress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RECOMMENDED TIER: {targetTier}</Text>
        </View>
        <Text style={styles.currentTierText}>Current: {currentTier}</Text>
      </View>

      <Text style={styles.title}>Universal Learner Model</Text>
      <Text style={styles.reasonText}>{reason}</Text>

      <View style={styles.benefitsList}>
        <Text style={styles.benefitItem}>✓ Cross-Product Error Sync (Coach → Learn)</Text>
        <Text style={styles.benefitItem}>✓ Unlimited Offline Module Downloads</Text>
        <Text style={styles.benefitItem}>✓ 300+ Monthly Voice Minutes &amp; Fast Turns</Text>
      </View>

      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={() => onUpgradePress && onUpgradePress(targetTier)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Upgrade to ${targetTier} plan`}
      >
        <Text style={styles.upgradeButtonText}>Upgrade to {targetTier} Plan →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0d1326",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#38bdf8",
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#38bdf8",
  },
  badgeText: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  currentTierText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  reasonText: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  benefitsList: {
    gap: 4,
    marginBottom: 16,
    paddingLeft: 4,
  },
  benefitItem: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "600",
  },
  upgradeButton: {
    backgroundColor: "var(--lx-info)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeButtonText: {
    color: "#04101e",
    fontSize: 14,
    fontWeight: "900",
  },
});
