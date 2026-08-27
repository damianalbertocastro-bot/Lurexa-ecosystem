import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ProgressService } from "@lurexa/backend";

export default function NativeCoachScreen() {
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    phoneme: string;
    tip: string;
  } | null>(null);

  const handleToggleRecord = () => {
    if (!recording) {
      setRecording(true);
      setRecorded(false);
      setFeedback(null);
      // Simulate audio capture
      setTimeout(() => {
        setRecording(false);
        setRecorded(true);
      }, 3000);
    }
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      // Simulate Mind speech evaluation targeting Dominican Spanish L1 transfer (/-s/ aspiration)
      setTimeout(async () => {
        setFeedback({
          score: 92,
          phoneme: "/s/ final cluster",
          tip: "Great clear pronunciation of the final 's' in 'students'! Clear intelligibility.",
        });

        await ProgressService.syncProgress({
          id: `mob_coach_${Date.now()}`,
          studentId: "student_mobile",
          lessonId: "coach_mob_01",
          moduleId: "mod_phonetics",
          courseId: "crs_coach_mobile",
          completed: true,
          timeSpentSeconds: 90,
          attempts: [],
          lastAccessedAt: new Date().toISOString(),
        });
        setEvaluating(false);
      }, 1200);
    } catch (err) {
      setEvaluating(false);
      Alert.alert("Offline Notice", "Spoken sample stored locally for sync.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productBar}>
        <View style={styles.productGlyph} />
        <View>
          <Text style={styles.productMaster}>Lurexa</Text>
          <Text style={styles.productName}>Coach</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.badgeText}>Voice • Caribbean L1 Transfer</Text>
        <Text style={styles.title}>Spoken Fluency &amp; Phonetics</Text>
        <Text style={styles.subtitle}>Target: Final /-s/ retention &amp; vowel timing</Text>
      </View>

      {/* Spoken Drill Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>PRACTICE PHRASE</Text>
        <Text style={styles.phraseText}>
          &ldquo;These students speak English with great confidence.&rdquo;
        </Text>
        <Text style={styles.phoneticGuide}>[ðiz ˈstudnts spik ˈɪŋɡlɪʃ wɪð ɡreɪt ˈkɑnfədəns]</Text>
      </View>

      {/* Recording Visualizer Box */}
      <View style={styles.visualizerBox}>
        {recording ? (
          <View style={styles.waveformRow}>
            {[24, 48, 32, 60, 40, 52, 28, 64, 38, 44, 56, 30].map((h, i) => (
              <View key={i} style={[styles.waveBar, { height: h }]} />
            ))}
          </View>
        ) : (
          <Text style={styles.visualizerPlaceholder}>
            {recorded ? "Audio sample captured ✓" : "Tap below to begin speaking"}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.recordBtn, recording && styles.recordBtnActive]}
          onPress={handleToggleRecord}
          disabled={recording || evaluating}
          accessibilityRole="button"
          accessibilityLabel="Record speech"
        >
          <Text style={styles.recordBtnText}>
            {recording ? "● Recording (3s)…" : recorded ? "Re-record 🎙️" : "Start Speaking 🎙️"}
          </Text>
        </TouchableOpacity>

        {recorded && (
          <TouchableOpacity
            style={styles.evalBtn}
            onPress={handleEvaluate}
            disabled={evaluating}
            accessibilityRole="button"
            accessibilityLabel="Evaluate pronunciation"
          >
            <Text style={styles.evalBtnText}>
              {evaluating ? "Analyzing with Mind…" : "Evaluate Pronunciation ⚡"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Feedback Card */}
      {feedback && (
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.scoreText}>{feedback.score}% Intelligibility</Text>
            <Text style={styles.phonemeBadge}>{feedback.phoneme}</Text>
          </View>
          <Text style={styles.feedbackTip}>{feedback.tip}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  productBar: { marginTop: 34, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 10 },
  productGlyph: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#592BD6", borderRightWidth: 10, borderRightColor: "#12CDD4" },
  productMaster: { color: "#071D67", fontSize: 17, lineHeight: 17, fontWeight: "900", letterSpacing: -0.7 },
  productName: { color: "#0B8F93", fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3 },
  header: { marginBottom: 20 },
  badgeText: { color: "#0B8F93", fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: "bold", color: "#071D67" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 3 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "#DFE6F8", marginBottom: 18 },
  cardLabel: { fontSize: 10, fontWeight: "900", color: "#64748B", letterSpacing: 1.5, marginBottom: 8 },
  phraseText: { fontSize: 18, fontWeight: "800", color: "#071D67", lineHeight: 26 },
  phoneticGuide: { fontSize: 13, color: "#592BD6", marginTop: 8, fontStyle: "italic" },
  visualizerBox: { backgroundColor: "#EDF2FD", height: 90, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 18, borderWidth: 1, borderColor: "#C7D8FA" },
  waveformRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  waveBar: { width: 5, backgroundColor: "#592BD6", borderRadius: 3 },
  visualizerPlaceholder: { fontSize: 13, fontWeight: "700", color: "#64748B" },
  actionRow: { gap: 10, marginBottom: 20 },
  recordBtn: { backgroundColor: "#592BD6", minHeight: 52, paddingVertical: 16, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  recordBtnActive: { backgroundColor: "#E11D48" },
  recordBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  evalBtn: { backgroundColor: "#071D67", minHeight: 52, paddingVertical: 16, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  evalBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  feedbackCard: { backgroundColor: "#E6FBF7", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "#A7F3E6", marginBottom: 30 },
  feedbackHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  scoreText: { fontSize: 16, fontWeight: "900", color: "#0D9488" },
  phonemeBadge: { fontSize: 11, fontWeight: "800", color: "#0F766E", backgroundColor: "#CCFBF1", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  feedbackTip: { fontSize: 13, color: "#115E59", lineHeight: 20 },
});
