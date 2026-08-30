import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import type { CefrLevel } from "@lurexa/types";
import { SpokenEvidenceRecorder } from "../../src/components/SpokenEvidenceRecorder";
import { UpgradeRecommendationCard } from "../../src/components/UpgradeRecommendationCard";

export default function NativePlacementScreen() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSyntaxOption, setSelectedSyntaxOption] = useState<string | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<boolean>(false);
  const [evaluatedCefr, setEvaluatedCefr] = useState<CefrLevel | null>(null);

  const handleNextStep = () => {
    if (currentStep === 1 && selectedSyntaxOption) {
      setCurrentStep(2);
    } else if (currentStep === 2 && recordedAudio) {
      // Evaluate placement
      setEvaluatedCefr("A1");
      setCurrentStep(3);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productBar}>
        <View style={styles.productGlyph} />
        <View>
          <Text style={styles.productMaster}>Lurexa</Text>
          <Text style={styles.productName}>Diagnostic</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.badgeText}>Multi-Modal Placement</Text>
        <Text style={styles.title}>CEFR English Diagnostic</Text>
        <Text style={styles.subtitle}>
          {currentStep === 3
            ? "Your diagnostic results are ready!"
            : `Step ${currentStep} of 2 • Fast level placement`}
        </Text>
      </View>

      {/* Step 1: Syntax Assessment */}
      {currentStep === 1 && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>WRITTEN SYNTAX QUESTION</Text>
          <Text style={styles.questionText}>
            Choose the correct phrase to complete the sentence:
          </Text>
          <Text style={styles.promptSentence}>
            &ldquo;Every morning, Maria _______ coffee before work.&rdquo;
          </Text>

          <View style={styles.optionsList}>
            {[
              { id: "opt1", text: "drink" },
              { id: "opt2", text: "drinks" },
              { id: "opt3", text: "is drink" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionButton,
                  selectedSyntaxOption === opt.id && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedSyntaxOption(opt.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSyntaxOption === opt.id && styles.optionTextSelected,
                  ]}
                >
                  {opt.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, !selectedSyntaxOption && styles.buttonDisabled]}
            disabled={!selectedSyntaxOption}
            onPress={handleNextStep}
          >
            <Text style={styles.nextButtonText}>Continue to Spoken Prompt →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Spoken Acoustic Diagnostic */}
      {currentStep === 2 && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>SPOKEN PHONEMIC PROMPT</Text>
          <Text style={styles.questionText}>
            Read this sentence out loud clearly:
          </Text>
          <Text style={styles.phraseText}>
            &ldquo;These students speak English with great confidence.&rdquo;
          </Text>
          <Text style={styles.phoneticGuide}>
            Targeting /s/ coda retention &amp; consonant cluster onset
          </Text>

          <View style={styles.recorderContainer}>
            <SpokenEvidenceRecorder onRecordingComplete={() => setRecordedAudio(true)} />
          </View>

          <TouchableOpacity
            style={[styles.nextButton, !recordedAudio && styles.buttonDisabled]}
            disabled={!recordedAudio}
            onPress={handleNextStep}
          >
            <Text style={styles.nextButtonText}>Calculate My Level ⚡</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 3: Diagnostic Results & Upgrade Card */}
      {currentStep === 3 && evaluatedCefr && (
        <View style={styles.resultsContainer}>
          <View style={styles.levelCard}>
            <Text style={styles.levelCardEyebrow}>ASSESSED CEFR STANDING</Text>
            <Text style={styles.levelCardLevel}>{evaluatedCefr}</Text>
            <Text style={styles.levelCardDesc}>
              A1 Breakthrough: Ready for introductory conversational phrases and foundation phonetics.
            </Text>

            <View style={styles.transferSummary}>
              <Text style={styles.transferSummaryTitle}>Dominican L1 Transfer Profile:</Text>
              <Text style={styles.transferBullet}>• /s/ cluster initial epenthesis (active)</Text>
              <Text style={styles.transferBullet}>• Final consonant coda retention (drilling)</Text>
            </View>
          </View>

          <UpgradeRecommendationCard
            currentTier="BASIC"
            targetTier="ULTRA"
            reason="Your A1 baseline is calibrated! Ultra gives you universal sync between Coach speaking drills and Learn grammar review cards."
            onUpgradePress={(tier) => alert(`Opening checkout for ${tier} plan...`)}
          />
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
  header: { marginBottom: 20, marginTop: 8 },
  badgeText: { color: "#38bdf8", fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  subtitle: { fontSize: 14, color: "#94a3b8", marginTop: 3 },
  card: { backgroundColor: "#131b2e", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "#1e293b", marginBottom: 20 },
  cardLabel: { fontSize: 10, fontWeight: "900", color: "#64748b", letterSpacing: 1.5, marginBottom: 8 },
  questionText: { fontSize: 14, color: "#cbd5e1", marginBottom: 8 },
  promptSentence: { fontSize: 17, fontWeight: "700", color: "#f8fafc", marginBottom: 16, backgroundColor: "rgba(99, 102, 241, 0.1)", padding: 12, borderRadius: 12 },
  phraseText: { fontSize: 17, fontWeight: "800", color: "#f8fafc", marginBottom: 6 },
  phoneticGuide: { fontSize: 12, color: "#a5b4fc", fontStyle: "italic", marginBottom: 14 },
  optionsList: { gap: 10, marginBottom: 20 },
  optionButton: { backgroundColor: "#0b101e", borderWidth: 1, borderColor: "#1e293b", padding: 14, borderRadius: 14 },
  optionButtonSelected: { borderColor: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.15)" },
  optionText: { color: "#f8fafc", fontSize: 15, fontWeight: "600" },
  optionTextSelected: { color: "#38bdf8", fontWeight: "800" },
  recorderContainer: { marginVertical: 14 },
  nextButton: { backgroundColor: "#6366f1", paddingVertical: 15, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  buttonDisabled: { opacity: 0.4 },
  nextButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "bold" },
  resultsContainer: { marginBottom: 30 },
  levelCard: { backgroundColor: "#131b2e", borderRadius: 20, padding: 22, borderWidth: 1, borderColor: "#1e293b", marginBottom: 16, alignItems: "center" },
  levelCardEyebrow: { color: "#38bdf8", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  levelCardLevel: { color: "#ffffff", fontSize: 44, fontWeight: "900", marginVertical: 4 },
  levelCardDesc: { color: "#cbd5e1", fontSize: 13, textAlign: "center", lineHeight: 19 },
  transferSummary: { marginTop: 16, alignSelf: "stretch", backgroundColor: "rgba(245, 158, 11, 0.1)", borderWidth: 1, borderColor: "rgba(245, 158, 11, 0.3)", padding: 12, borderRadius: 12 },
  transferSummaryTitle: { color: "var(--lx-warning)", fontSize: 12, fontWeight: "800", marginBottom: 4 },
  transferBullet: { color: "#fef3c7", fontSize: 12, marginTop: 2 },
});
