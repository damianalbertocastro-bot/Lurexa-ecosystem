export type SpeechTask = "text_to_speech" | "speech_to_text";

export type SpeechVoice = {
  provider: "elevenlabs" | "google" | "web";
  voiceId?: string;
  language?: string;
};

export type SpeechRequest = {
  task: SpeechTask;
  text?: string;
  audio?: Uint8Array;
  language?: string;
  voice?: SpeechVoice;
};

export type SpeechResult = {
  provider: SpeechVoice["provider"];
  audio?: Uint8Array;
  transcript?: string;
  durationMs?: number;
};

export interface SpeechProvider {
  readonly name: SpeechVoice["provider"];
  synthesize?(request: SpeechRequest): Promise<SpeechResult>;
  transcribe?(request: SpeechRequest): Promise<SpeechResult>;
}
