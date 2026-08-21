type CurriculumAudioDefinition = {
  text: string;
  instructions: string;
  voice: string;
};

const SPEECH_ENDPOINT = "https://api.openai.com/v1/audio/speech";
const SPEECH_MODEL = "gpt-4o-mini-tts";

const CURRICULUM_AUDIO: Record<string, CurriculumAudioDefinition> = {
  "a1-m1-u1-l1-model-listening-production": {
    text: "Carlos: Hello, I'm Carlos. What's your name? Elena: I'm Elena. Nice to meet you. Carlos: Nice to meet you too, Elena!",
    instructions: "Speak clearly and naturally for an A1 English learner. Use a warm classroom tone, moderate pace, clear phrase boundaries, and natural English stress. Do not exaggerate or use an artificial teaching cadence.",
    voice: "coral",
  },
};

export const LearnCurriculumAudioService = {
  async generate(activityId: string): Promise<{ bytes: ArrayBuffer; contentType: string }> {
    const definition = CURRICULUM_AUDIO[activityId];
    if (!definition) throw new Error("Curriculum audio activity is not available.");

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Production curriculum audio is not configured yet.");

    const response = await fetch(SPEECH_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: SPEECH_MODEL,
        input: definition.text,
        voice: definition.voice,
        instructions: definition.instructions,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      throw new Error(`Curriculum audio provider request failed (${response.status}).`);
    }

    return {
      bytes: await response.arrayBuffer(),
      contentType: response.headers.get("content-type") || "audio/mpeg",
    };
  },
};
