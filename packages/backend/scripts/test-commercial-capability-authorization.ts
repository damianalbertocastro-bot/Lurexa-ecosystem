import { authorizeCommercialCapability } from "../src/capability-enforcement.server";

async function expectRejected(label: string, input: Parameters<typeof authorizeCommercialCapability>[0], expected: string): Promise<void> {
  try {
    await authorizeCommercialCapability(input);
    throw new Error(`[${label}] expected rejection but authorization succeeded`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes(expected)) {
      throw new Error(`[${label}] unexpected error: ${message}`);
    }
  }
}

async function main(): Promise<void> {
  // The vulnerable behavior allowed a caller to substitute another learnerId.
  // This check must fail before any tenant data is loaded.
  await expectRejected(
    "cross-learner substitution",
    {
      actorId: "authenticated-user-a",
      learnerId: "learner-b",
      organizationId: "org-b",
      product: "LEARN",
      capabilityId: "mind.conversational_roleplay",
    },
    "cannot act on behalf of this learner",
  );

  await expectRejected(
    "missing authenticated subject",
    {
      actorId: "",
      learnerId: "learner-a",
      organizationId: "org-a",
      product: "LEARN",
      capabilityId: "mind.conversational_roleplay",
    },
    "Authenticated identity is required",
  );

  console.log("[commercial-capability-authorization] authenticated-subject binding passed.");
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
