import type {
  AdaptiveLearningPathV1,
  KnowledgeObjectV1,
  LearnerPulseProjectionV1,
  MemoryThreadV1,
  MindTraceV1,
  ProductBridgeResolutionV1,
  ProductBridgeV1,
  SignatureProjectionRequestV1,
} from "@lurexa/types";

/**
 * Browser-safe application boundary for Lurexa signature experiences.
 * Implementations must authorize server-side; these request objects are not grants.
 */
export interface SignatureExperienceService {
  getLearnerPulse(request: SignatureProjectionRequestV1): Promise<LearnerPulseProjectionV1>;
  getAdaptivePath(request: SignatureProjectionRequestV1): Promise<AdaptiveLearningPathV1>;
  getMemoryThread(request: SignatureProjectionRequestV1): Promise<MemoryThreadV1>;
  getMindTrace(request: SignatureProjectionRequestV1): Promise<MindTraceV1>;
  createProductBridge(input: Omit<ProductBridgeV1, "bridgeId" | "createdAt" | "expiresAt"> & {
    ttlSeconds?: number;
  }): Promise<ProductBridgeV1>;
  resolveProductBridge(bridgeId: string): Promise<ProductBridgeResolutionV1>;
  getKnowledgeObject(id: string): Promise<KnowledgeObjectV1 | null>;
}
