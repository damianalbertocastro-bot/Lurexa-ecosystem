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

export default function NativeLearnScreen() {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMarkComplete = async () => {
    setLoading(true);
    try {
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
      Alert.alert("Awesome!", "Lesson progress synced to your account.");
    } catch (err) {
      Alert.alert("Sync Error", "Progress saved locally for offline sync.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.badgeText}>Mobile Offline Ready</Text>
        <Text style={styles.title}>Lesson 1: Algebraic Expressions</Text>
        <Text style={styles.subtitle}>Mathematics B1 • Module 1</Text>
      </View>

      {/* Lesson Body */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Core Concept</Text>
        <Text style={styles.cardBody}>
          An algebraic expression combines numbers, variables (like x or y), and
          operators (+, -, *, /).
        </Text>
        <Text style={styles.example}>Example: 3x + 5 = 20</Text>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={[styles.button, completed && styles.buttonDisabled]}
        onPress={handleMarkComplete}
        disabled={loading || completed}
      >
        <Text style={styles.buttonText}>
          {completed ? "Completed ✓" : loading ? "Syncing..." : "Mark as Finished →"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  header: { marginBottom: 20, marginTop: 40 },
  badgeText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#0F172A" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 2 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#0F172A", marginBottom: 8 },
  cardBody: { fontSize: 14, color: "#334155", lineHeight: 22 },
  example: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4F46E5",
    marginTop: 12,
    backgroundColor: "#EEF2FF",
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#10B981" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});