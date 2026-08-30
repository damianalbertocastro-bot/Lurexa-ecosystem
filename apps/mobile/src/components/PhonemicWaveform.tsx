import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PhonemicAlignmentSegment } from "@lurexa/types";

export interface PhonemicWaveformProps {
  segments: PhonemicAlignmentSegment[];
}

export const PhonemicWaveform: React.FC<PhonemicWaveformProps> = ({ segments }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phonemic Alignment &amp; Transfer Radar</Text>

      <View style={styles.segmentsRow}>
        {segments.map((seg, idx) => {
          const isHigh = seg.score >= 0.85;
          const isMed = seg.score >= 0.65 && seg.score < 0.85;

          const barColor = isHigh ? "var(--lx-success)" : isMed ? "var(--lx-warning)" : "var(--lx-destructive)";
          const barHeight = Math.max(20, Math.round(seg.score * 55));

          return (
            <View key={idx} style={styles.segmentColumn}>
              <View style={[styles.bar, { height: barHeight, backgroundColor: barColor }]} />
              <Text style={styles.wordLabel}>{seg.word}</Text>
              <Text style={[styles.ipaLabel, { color: barColor }]}>
                {seg.observedIpa || seg.expectedIpa}
              </Text>
              {seg.isTransferPoint && (
                <View style={styles.transferBadge}>
                  <Text style={styles.transferBadgeText}>L1</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#0d1326",
    borderWidth: 1,
    borderColor: "#1e293b",
    marginVertical: 8,
  },
  title: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  segmentsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 100,
    paddingBottom: 8,
  },
  segmentColumn: {
    alignItems: "center",
    gap: 4,
  },
  bar: {
    width: 24,
    borderRadius: 6,
  },
  wordLabel: {
    color: "#f8fafc",
    fontSize: 11,
    fontWeight: "600",
  },
  ipaLabel: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  transferBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.4)",
  },
  transferBadgeText: {
    color: "var(--lx-warning)",
    fontSize: 9,
    fontWeight: "800",
  },
});
