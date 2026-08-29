import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export interface SpokenEvidenceRecorderProps {
  onRecordingComplete?: (audioBase64: string, durationMs: number) => void;
  disabled?: boolean;
}

export const SpokenEvidenceRecorder: React.FC<SpokenEvidenceRecorderProps> = ({
  onRecordingComplete,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const toggleRecording = () => {
    if (disabled) return;

    if (!isRecording) {
      setIsRecording(true);
      setHasRecorded(false);
      // Simulate audio capture with edge duration limit
      setTimeout(() => {
        setIsRecording(false);
        setHasRecorded(true);
        if (onRecordingComplete) {
          onRecordingComplete("mock_audio_base64_payload", 3000);
        }
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.visualizerContainer}>
        {isRecording ? (
          <View style={styles.waveformRow}>
            {[18, 36, 24, 48, 30, 42, 22, 50, 32, 38, 44, 26].map((h, i) => (
              <View key={i} style={[styles.waveBar, { height: h }]} />
            ))}
          </View>
        ) : (
          <Text style={styles.statusText}>
            {hasRecorded ? "Audio ready for phonemic analysis ✓" : "Tap microphone to record"}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.recordButton,
          isRecording && styles.recordButtonActive,
          disabled && styles.recordButtonDisabled,
        ]}
        onPress={toggleRecording}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "Listening..." : hasRecorded ? "Record Again" : "Start Speaking"}
        </Text>
      </TouchableOpacity>
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
    alignItems: "center",
  },
  visualizerContainer: {
    height: 70,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  waveformRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 60,
  },
  waveBar: {
    width: 4,
    backgroundColor: "#38bdf8",
    borderRadius: 2,
  },
  statusText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "500",
  },
  recordButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 9999,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  recordButtonActive: {
    backgroundColor: "#f43f5e",
  },
  recordButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
