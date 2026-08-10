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

    // Simulate AI response
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
      <Text style={styles.headerTitle}>🤖 Mobile AI Tutor</Text>

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
            <Text
              style={
                item.role === "user" ? styles.userText : styles.assistantText
              }
            >
              {item.content}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask AI Tutor..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16, paddingTop: 50 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#0F172A", marginBottom: 12 },
  bubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userBubble: { backgroundColor: "#4F46E5", alignSelf: "flex-end" },
  assistantBubble: { backgroundColor: "#E2E8F0", alignSelf: "flex-start" },
  userText: { color: "#FFFFFF", fontSize: 14 },
  assistantText: { color: "#0F172A", fontSize: 14 },
  inputRow: { flexDirection: "row", gap: 8, paddingTop: 8 },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  sendButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  sendText: { color: "#FFFFFF", fontWeight: "bold" },
});