import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import type { AIMessage } from "@lurexa/types";

const QUICK_CHIPS = [
  { label: "Why add -s here?", query: "Why do we add -s to the verb in third-person singular (e.g., 'she speaks')?" },
  { label: "Pronounce this slowly", query: "Can you break down the pronunciation of 'These students speak English' slowly?" },
  { label: "Dominican workplace example", query: "Give me an example of introducing myself in a bilingual workplace in Santo Domingo." },
];

export default function NativeAITutorScreen() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content: "Hello! I am your Lurexa Learn AI Tutor. Ask me any English grammar, vocabulary, or Dominican L1 transfer question about your current lesson.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendText = (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    const userMsg: AIMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate Mind intelligent tutor response grounded in CEFR A1 Dominican English pedagogy
    setTimeout(() => {
      let reply = "That is a great question! In English, we focus on clear intelligibility and steady rhythm.";

      if (query.includes("Why do we add -s") || query.includes("-s")) {
        reply = "In English present simple, when the subject is he, she, or it (3rd person singular), we add '-s' or '-es' (e.g., 'He speaks English'). In Dominican Spanish, final -s is often softened or dropped in casual speech, so remember to articulate the final /s/ clearly!";
      } else if (query.includes("pronunciation") || query.includes("slowly")) {
        reply = "Here is the slow phonetic breakdown:\n• 'These' [ðiːz] - voiced 'th', long vowel\n• 'students' [ˈstjuːdnts] - start right on the 's', don't add an 'e' in front!\n• 'speak' [spiːk]\n• 'English' [ˈɪŋɡlɪʃ]";
      } else if (query.includes("workplace") || query.includes("Dominican")) {
        reply = "Here is a natural introduction: 'Good morning! My name is Carlos. I am a software specialist from Santo Domingo, and I am excited to collaborate with our team in English.'";
      }

      const assistantMsg: AIMessage = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <View style={styles.productBar}>
        <View style={styles.productGlyph} />
        <View>
          <Text style={styles.productMaster}>Lurexa</Text>
          <Text style={styles.productName}>Learn Tutor</Text>
        </View>
      </View>

      <Text style={styles.eyebrow}>AI LEARNING COMPANION</Text>
      <Text style={styles.headerTitle}>Context-Aware Tutor</Text>
      <Text style={styles.headerSubtitle}>Dominican English L1 Transfer &amp; Grammar Assistant</Text>

      {/* Quick Action Chips */}
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {QUICK_CHIPS.map((chip, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.chipButton}
              onPress={() => handleSendText(chip.query)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipText}>{chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text style={item.role === "user" ? styles.userText : styles.assistantText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question about this lesson..."
          placeholderTextColor="#64748b"
          value={input}
          onChangeText={setInput}
          accessibilityLabel="Ask the Lurexa AI tutor"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSendText(input)}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b101e", padding: 16, paddingTop: 40 },
  productBar: { marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  productGlyph: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#6366f1", borderRightWidth: 10, borderRightColor: "#06b6d4" },
  productMaster: { color: "#ffffff", fontSize: 17, lineHeight: 17, fontWeight: "900", letterSpacing: -0.7 },
  productName: { color: "#38bdf8", fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3 },
  eyebrow: { color: "#38bdf8", fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "#ffffff", marginTop: 4 },
  headerSubtitle: { fontSize: 12, color: "#94a3b8", marginTop: 2, marginBottom: 8 },
  chipsContainer: { marginBottom: 8 },
  chipsScroll: { gap: 8, paddingVertical: 4 },
  chipButton: {
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.35)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "700",
  },
  bubble: { padding: 14, borderRadius: 18, marginBottom: 10, maxWidth: "84%" },
  userBubble: { backgroundColor: "#6366f1", alignSelf: "flex-end" },
  assistantBubble: { backgroundColor: "#131b2e", borderWidth: 1, borderColor: "#1e293b", alignSelf: "flex-start" },
  userText: { color: "#ffffff", fontSize: 14, lineHeight: 21 },
  assistantText: { color: "#f8fafc", fontSize: 14, lineHeight: 21 },
  inputRow: { flexDirection: "row", gap: 8, paddingTop: 8 },
  input: { flex: 1, backgroundColor: "#131b2e", borderWidth: 1, borderColor: "#1e293b", borderRadius: 14, paddingHorizontal: 14, height: 50, color: "#f8fafc" },
  sendButton: { backgroundColor: "#6366f1", borderRadius: 14, justifyContent: "center", paddingHorizontal: 20, minHeight: 50 },
  sendText: { color: "#ffffff", fontWeight: "bold", fontSize: 15 },
});