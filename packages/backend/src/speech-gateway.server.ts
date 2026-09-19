import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { getRawServiceAccountJson } from "../firebase-admin.server";
import { BusinessUsageService } from "../business-usage.server";
import { UsageLedgerService } from "../usage-ledger.server";

type SpeechProvider = "standard" | "elevenlabs";

interface SpeechRequest {
  product: "LEARN" | "COACH" | "TEACH" | "ADMIN" | "STUDIO" | "INSIGHT";
  capabilityId: string;
  text: string;
  learnerId: string;
  organizationId: string;
  premiumVoiceEntitled: boolean;
  provider?: SpeechProvider;
}

function standardClient(): TextToSpeechClient | null {
  const raw = getRawServiceAccountJson();
  if (!raw) return null;
  try {
    const account = JSON.parse(raw) as { project_id?: string; client_email?: string; private_key?: string };
    if (!account.project_id || !account.client_email || !account.private_key) return null;
    return new TextToSpeechClient({
      projectId: account.project_id,
      credentials: { client_email: account.client_email, private_key: account.private_key.replace(/\\n/g, "\n") },
    });
  } catch {
    return null;
  }
}

export const SpeechGateway = {
  async synthesize(input: SpeechRequest): Promise<{ bytes: ArrayBuffer; contentType: string; provider: SpeechProvider }> {
    if (!input.text.trim()) throw new Error("Speech text is required.");
    const provider: SpeechProvider = input.premiumVoiceEntitled ? "elevenlabs" : "standard";

    if (input.provider && input.provider !== provider) {
      throw new Error("Requested speech provider is not permitted by the resolved entitlement.");
    }

    const durationMinutes = Math.max(0.01, input.text.trim().length / 900);
    const businessApplied = await BusinessUsageService.consumeIfBusiness({
      learnerId: input.learnerId,
      organizationId: input.organizationId,
      voiceMinutes: durationMinutes,
      product: input.product,
    });
    if (!businessApplied) {
      const quota = await QuotaEnforcementServerService.assertAndConsumeQuota({
        actorId: input.learnerId,
        usageType: "voice_minutes",
        unitsToConsume: durationMinutes,
      });
      if (!quota.allowed) throw new Error(quota.message || "Voice usage quota exceeded.");
    }

    if (provider === "elevenlabs") {
      const key = process.env.ELEVENLABS_API_KEY?.trim();
      const voiceId = process.env.LUREXA_ELEVENLABS_VOICE_ID?.trim();
      if (!key || !voiceId) throw new Error("ElevenLabs is entitled but not configured for this runtime.");

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "xi-api-key": key },
        body: JSON.stringify({ text: input.text.trim(), model_id: process.env.LUREXA_ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2" }),
      });
      if (!response.ok) throw new Error(`ElevenLabs request failed (${response.status}).`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      await UsageLedgerService.record({
        product: input.product,
        capabilityId: input.capabilityId,
        provider,
        organizationId: input.organizationId,
        userId: input.learnerId,
        entitlementSource: businessApplied ? "business_contract" : "individual_or_explicit",
        usage: { voiceMinutes: durationMinutes },
        providerModel: process.env.LUREXA_ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2",
      });
      return { bytes: bytes.buffer, contentType: "audio/mpeg", provider };
    }

    const client = standardClient();
    if (!client) throw new Error("Standard speech provider is not configured for this runtime.");
    const [response] = await client.synthesizeSpeech({
      input: { text: input.text.trim() },
      voice: { languageCode: "en-US", name: process.env.LUREXA_LEARN_TTS_VOICE?.trim() || "en-US-Neural2-F" },
      audioConfig: { audioEncoding: "MP3", speakingRate: 0.92 },
    });
    if (!response.audioContent) throw new Error("Standard speech provider returned no audio.");

    const bytes = typeof response.audioContent === "string"
      ? Uint8Array.from(Buffer.from(response.audioContent, "base64"))
      : Uint8Array.from(response.audioContent);
    await UsageLedgerService.record({
      product: input.product,
      capabilityId: input.capabilityId,
      provider,
      organizationId: input.organizationId,
      userId: input.learnerId,
      entitlementSource: businessApplied ? "business_contract" : "individual_or_explicit",
      usage: { voiceMinutes: durationMinutes },
    });
    return { bytes: bytes.buffer, contentType: "audio/mpeg", provider };
  },
};
