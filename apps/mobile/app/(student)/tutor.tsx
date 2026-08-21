import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AIMessage } from "@lurexa/types";

export default function NativeAITutorScreen() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content: "Hello! Ask me any question about your mobile lesson.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: AIMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Prototype response only. Production learner intelligence must route through Lurexa Mind.
    setTimeout(() => {
      const assistantMsg: AIMessage = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: "Here is a quick breakdown to help you solve that algebra problem!",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.productBar}>
        <View style={styles.productGlyph} />
        <View>
          <Text style={styles.productMaster}>Lurexa</Text>
          <Text style={styles.productName}>Learn</Text>
        </View>
      </View>
      <Text style={styles.eyebrow}>LEARNING SUPPORT</Text>
      <Text style={styles.headerTitle}>AI Tutor</Text>
      <Text style={styles.headerSubtitle}>Support inside Lurexa Learn • prototype</Text>

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
        contentContainerStyle={{ paddingVertical: 14 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask about this lesson..."
          placeholderTextColor="#7B88A8"
          value={input}
          onChangeText={setInput}
          accessibilityLabel="Ask the Lurexa Learn tutor"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} accessibilityRole="button" accessibilityLabel="Send message">
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16, paddingTop: 42 },
  productBar: { marginBottom: 22, flexDirection: "row", alignItems: "center", gap: 10 },
  productGlyph: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#592BD6", borderRightWidth: 10, borderRightColor: "#2160DF" },
  productMaster: { color: "#071D67", fontSize: 17, lineHeight: 17, fontWeight: "900", letterSpacing: -0.7 },
  productName: { color: "#592BD6", fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3 },
  eyebrow: { color: "#0B8F93", fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "#071D67", marginTop: 4 },
  headerSubtitle: { fontSize: 12, color: "#64748B", marginTop: 3, marginBottom: 8 },
  bubble: { padding: 13, borderRadius: 17, marginBottom: 8, maxWidth: "82%" },
  userBubble: { backgroundColor: "#315FD7", alignSelf: "flex-end" },
  assistantBubble: { backgroundColor: "#F1EDFF", borderWidth: 1, borderColor: "#DFD6FF", alignSelf: "flex-start" },
  userText: { color: "#FFFFFF", fontSize: 14, lineHeight: 20 },
  assistantText: { color: "#071D67", fontSize: 14, lineHeight: 20 },
  inputRow: { flexDirection: "row", gap: 8, paddingTop: 8 },
  input: { flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C9D4EE", borderRadius: 13, paddingHorizontal: 12, height: 50, color: "#071D67" },
  sendButton: { backgroundColor: "#315FD7", borderRadius: 13, justifyContent: "center", paddingHorizontal: 18, minHeight: 50 },
  sendText: { color: "#FFFFFF", fontWeight: "bold" },
});