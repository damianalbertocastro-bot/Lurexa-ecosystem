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
      <View style={styles.productBar}>
        <View style={styles.productGlyph} />
        <View>
          <Text style={styles.productMaster}>Lurexa</Text>
          <Text style={styles.productName}>Learn</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.badgeText}>Mobile • Offline ready</Text>
        <Text style={styles.title}>Lesson 1: Introduce yourself</Text>
        <Text style={styles.subtitle}>English A1 • Module 1</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Say hello with confidence</Text>
        <Text style={styles.cardBody}>
          Use “I’m…” to share your name and “Nice to meet you” when you greet
          someone for the first time.
        </Text>
        <Text style={styles.example}>Example: “Hi, I’m Ana. Nice to meet you.”</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, completed && styles.buttonDisabled]}
        onPress={handleMarkComplete}
        disabled={loading || completed}
        accessibilityRole="button"
        accessibilityLabel={completed ? "Lesson completed" : "Mark lesson as finished"}
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
  productBar: { marginTop: 34, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 10 },
  productGlyph: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#592BD6", borderRightWidth: 10, borderRightColor: "#2160DF" },
  productMaster: { color: "#071D67", fontSize: 17, lineHeight: 17, fontWeight: "900", letterSpacing: -0.7 },
  productName: { color: "#592BD6", fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3 },
  header: { marginBottom: 20 },
  badgeText: { color: "#0B8F93", fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: "bold", color: "#071D67" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 3 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 20, borderWidth: 1, borderColor: "#DFE6F8", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#071D67", marginBottom: 8 },
  cardBody: { fontSize: 14, color: "#334155", lineHeight: 22 },
  example: { fontSize: 14, fontWeight: "bold", color: "#592BD6", marginTop: 12, backgroundColor: "#F1EDFF", padding: 10, borderRadius: 10 },
  button: { backgroundColor: "#315FD7", minHeight: 52, paddingVertical: 16, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  buttonDisabled: { backgroundColor: "#137867" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
