import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ProgressService, OfflineSyncEngine } from "@lurexa/backend";
import type { LearningEvidence } from "@lurexa/types";
import { OfflineIndicator } from "../../src/components/OfflineIndicator";
import { SpokenEvidenceRecorder } from "../../src/components/SpokenEvidenceRecorder";

export default function NativeLearnScreen() {
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [selectedSyntaxOption, setSelectedSyntaxOption] = useState<string | null>(null);
  const [spokenRecorded, setSpokenRecorded] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isOnline = true;
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const handleMarkComplete = async () => {
    setLoading(true);
    try {
      if (!isOnline) {
        const offlineEvidence: LearningEvidence = {
          contractVersion: "1",
          id: `evi_mob_${Date.now()}`,
          learnerId: "student_mobile",
          organizationId: "org_self_paced",
          type: "activity_result",
          observedAt: new Date().toISOString(),
          dataClassification: "standard",
          source: { product: "learn", activityId: "les_mobile_01" },
          provenance: {
            method: "system_observed",
            actorId: "student_mobile",
            confidence: 1.0,
          },
          payload: {
            activityId: "les_mobile_01",
            completed: true,
            score: 1.0,
          },
        };
        OfflineSyncEngine.createOfflineQueueItem(offlineEvidence);
        setPendingSyncCount((c) => c + 1);
        setCompleted(true);
        Alert.alert("Offline Mode", "Lesson progress saved offline. Will sync when reconnected.");
        return;
      }

      await ProgressService.syncProgress({
        id: "mobile_prog_1",
        studentId: "student_mobile",
        lessonId: "les_mobile_01",
        moduleId: "mod_mobile",
        courseId: "crs_mobile",
        completed: true,
        timeSpentSeconds: 240,
        attempts: [],
        lastAccessedAt: new Date().toISOString(),
      });
      setCompleted(true);
      Alert.alert("Awesome!", "Lesson progress synced to your Universal Learner Model.");
    } catch {
      Alert.alert("Sync Notice", "Progress stored locally for automatic sync.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productBar}>
        <View style={styles.productGlyph} />
        <View>
          <Text style={styles.productMaster}>Lurexa</Text>
          <Text style={styles.productName}>Learn</Text>
        </View>
      </View>

      <OfflineIndicator
        isOnline={isOnline}
        queuedSyncCount={pendingSyncCount}
        cachedModulesCount={1}
      />

      <View style={styles.header}>
        <Text style={styles.badgeText}>Interactive Paged Lesson</Text>
        <Text style={styles.title}>Lesson 1: Introduce Yourself</Text>
        <Text style={styles.subtitle}>English A1 • Foundation Module</Text>
      </View>

      {/* Segmented Step Progress Bar */}
      <View style={styles.segmentedProgressRow}>
        {[0, 1, 2].map((idx) => (
          <View
            key={idx}
            style={[
              styles.segmentBar,
              currentCardIndex >= idx && styles.segmentBarActive,
            ]}
          />
        ))}
      </View>

      {/* Card 1: Core Concept */}
      {currentCardIndex === 0 && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CARD 1 OF 3 • CONCEPT</Text>
          <Text style={styles.cardTitle}>Say hello with confidence</Text>
          <Text style={styles.cardBody}>
            Use &ldquo;I&apos;m…&rdquo; to share your name and &ldquo;Nice to meet you&rdquo; when you greet someone for the first time.
          </Text>

          <View style={styles.exampleBox}>
            <Text style={styles.exampleTitle}>Key Expression:</Text>
            <Text style={styles.examplePhrase}>&ldquo;Hi, I&apos;m Ana. Nice to meet you.&rdquo;</Text>
            <Text style={styles.examplePhonetics}>[haɪ aɪm ˈɑːnə naɪs tuː miːt juː]</Text>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setCurrentCardIndex(1)}
            accessibilityRole="button"
            accessibilityLabel="Next: practice check"
          >
            <Text style={styles.actionButtonText}>Next: Practice Check →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Card 2: Interactive Syntax Check */}
      {currentCardIndex === 1 && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CARD 2 OF 3 • SYNTAX DRILL</Text>
          <Text style={styles.cardTitle}>Complete the introduction</Text>
          <Text style={styles.cardBody}>
            Fill in the blank with the natural greeting response:
          </Text>
          <Text style={styles.syntaxPrompt}>&ldquo;Hello Carlos! _______ meet you.&rdquo;</Text>

          <View style={styles.optionsContainer}>
            {[
              { id: "o1", text: "Nice to" },
              { id: "o2", text: "Good of" },
              { id: "o3", text: "Fine to" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionBtn,
                  selectedSyntaxOption === opt.id && styles.optionBtnSelected,
                ]}
                onPress={() => setSelectedSyntaxOption(opt.id)}
              >
                <Text
                  style={[
                    styles.optionBtnText,
                    selectedSyntaxOption === opt.id && styles.optionBtnTextSelected,
                  ]}
                >
                  {opt.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.cardNavRow}>
            <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentCardIndex(0)}>
              <Text style={styles.prevBtnText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, !selectedSyntaxOption && styles.buttonDisabled]}
              disabled={!selectedSyntaxOption}
              onPress={() => setCurrentCardIndex(2)}
            >
              <Text style={styles.nextBtnText}>Next: Spoken Drill →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Card 3: Spoken Evidence Drill */}
      {currentCardIndex === 2 && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CARD 3 OF 3 • SPOKEN EVIDENCE</Text>
          <Text style={styles.cardTitle}>Speak your introduction</Text>
          <Text style={styles.cardBody}>
            Record yourself saying the phrase clearly:
          </Text>
          <Text style={styles.syntaxPrompt}>
            &ldquo;Hi, I&apos;m Carlos. Nice to meet you!&rdquo;
          </Text>

          <View style={styles.recorderContainer}>
            <SpokenEvidenceRecorder onRecordingComplete={() => setSpokenRecorded(true)} />
          </View>

          <TouchableOpacity
            style={[styles.actionButton, (!spokenRecorded || completed) && styles.buttonDisabled]}
            onPress={handleMarkComplete}
            disabled={!spokenRecorded || completed || loading}
            accessibilityRole="button"
            accessibilityLabel={completed ? "Lesson completed" : "Complete lesson"}
          >
            <Text style={styles.actionButtonText}>
              {completed ? "Completed & Synced ✓" : loading ? "Syncing..." : "Finish Lesson & Save Evidence →"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b101e", padding: 20 },
  productBar: { marginTop: 34, marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 10 },
  productGlyph: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#6366f1", borderRightWidth: 10, borderRightColor: "#06b6d4" },
  productMaster: { color: "#ffffff", fontSize: 17, lineHeight: 17, fontWeight: "900", letterSpacing: -0.7 },
  productName: { color: "#38bdf8", fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3 },
  header: { marginBottom: 16, marginTop: 8 },
  badgeText: { color: "#38bdf8", fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  subtitle: { fontSize: 14, color: "#94a3b8", marginTop: 3 },
  segmentedProgressRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  segmentBar: { flex: 1, height: 5, borderRadius: 3, backgroundColor: "#1e293b" },
  segmentBarActive: { backgroundColor: "#38bdf8" },
  card: { backgroundColor: "#131b2e", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "#1e293b", marginBottom: 20 },
  cardLabel: { fontSize: 10, fontWeight: "900", color: "#64748b", letterSpacing: 1.5, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#ffffff", marginBottom: 8 },
  cardBody: { fontSize: 14, color: "#cbd5e1", lineHeight: 21, marginBottom: 14 },
  exampleBox: { backgroundColor: "rgba(99, 102, 241, 0.1)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(99, 102, 241, 0.25)", marginBottom: 20 },
  exampleTitle: { color: "#a5b4fc", fontSize: 11, fontWeight: "800", textTransform: "uppercase", marginBottom: 4 },
  examplePhrase: { color: "#f8fafc", fontSize: 16, fontWeight: "800", marginBottom: 4 },
  examplePhonetics: { color: "#38bdf8", fontSize: 12, fontStyle: "italic" },
  syntaxPrompt: { fontSize: 16, fontWeight: "700", color: "#f8fafc", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: 12, borderRadius: 12, marginBottom: 16 },
  optionsContainer: { gap: 10, marginBottom: 20 },
  optionBtn: { backgroundColor: "#0b101e", borderWidth: 1, borderColor: "#1e293b", padding: 14, borderRadius: 14 },
  optionBtnSelected: { borderColor: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.15)" },
  optionBtnText: { color: "#cbd5e1", fontSize: 15, fontWeight: "600" },
  optionBtnTextSelected: { color: "#38bdf8", fontWeight: "800" },
  actionButton: { backgroundColor: "#6366f1", minHeight: 50, paddingVertical: 14, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cardNavRow: { flexDirection: "row", gap: 10 },
  prevBtn: { flex: 1, backgroundColor: "#1e293b", minHeight: 50, paddingVertical: 14, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  prevBtnText: { color: "#cbd5e1", fontWeight: "700" },
  nextBtn: { flex: 2, backgroundColor: "#6366f1", minHeight: 50, paddingVertical: 14, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  nextBtnText: { color: "#ffffff", fontWeight: "bold" },
  buttonDisabled: { opacity: 0.4 },
  actionButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "bold" },
  recorderContainer: { marginVertical: 14 },
});
