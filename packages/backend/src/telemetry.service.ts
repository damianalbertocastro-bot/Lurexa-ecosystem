export type TelemetryLevel = "info" | "warning" | "error" | "critical";
export type TelemetryResult = "success" | "failure" | "denied" | "skipped";

export interface SystemAlertEvent {
  level: TelemetryLevel;
  service: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface OperationalTelemetryContext {
  service: string;
  product?: string;
  surface?: string;
  requestId?: string;
  actorId?: string;
  tenantId?: string;
  operation?: string;
  provider?: string;
  version?: string;
  metadata?: Record<string, unknown>;
}

export interface OperationalTelemetryEvent extends OperationalTelemetryContext {
  eventId: string;
  timestamp: string;
  level: TelemetryLevel;
  message: string;
  result?: TelemetryResult;
  errorCode?: string;
  durationMs?: number;
}

const sensitiveMetadataKey = /(authorization|cookie|password|token|secret|api[-_]?key|service[-_]?account|email)/i;

function eventId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function sanitizeMetadata(metadata: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, sensitiveMetadataKey.test(key) ? "[redacted]" : value]),
  );
}

function emit(event: OperationalTelemetryEvent): void {
  const payload: OperationalTelemetryEvent = {
    ...event,
    ...(event.metadata ? { metadata: sanitizeMetadata(event.metadata) } : {}),
  };
  const serialized = JSON.stringify({ type: "lurexa.telemetry", ...payload });
  if (payload.level === "error" || payload.level === "critical") console.error(serialized);
  else console.log(serialized);
}

export const TelemetryService = {
  captureException(error: Error, context?: Record<string, unknown>): void {
    emit({
      eventId: eventId(),
      timestamp: new Date().toISOString(),
      level: "error",
      service: typeof context?.service === "string" ? context.service : "unknown",
      message: error.message,
      result: "failure",
      errorCode: error.name || "Error",
      metadata: context,
    });
  },

  logEvent(event: Omit<SystemAlertEvent, "timestamp">): void {
    emit({
      eventId: eventId(),
      timestamp: new Date().toISOString(),
      level: event.level,
      service: event.service,
      message: event.message,
      metadata: event.metadata,
    });
  },

  beginOperation(context: OperationalTelemetryContext) {
    const startedAt = Date.now();
    const requestId = context.requestId || eventId();

    return {
      requestId,
      complete(input: Partial<OperationalTelemetryEvent> = {}): void {
        emit({
          ...context,
          ...input,
          requestId,
          eventId: eventId(),
          timestamp: new Date().toISOString(),
          level: input.level ?? "info",
          service: input.service ?? context.service,
          message: input.message ?? `${context.operation ?? context.service} completed`,
          result: input.result ?? "success",
          durationMs: input.durationMs ?? Date.now() - startedAt,
          metadata: { ...context.metadata, ...input.metadata },
        });
      },
      fail(error: unknown, input: Partial<OperationalTelemetryEvent> = {}): void {
        const normalized = error instanceof Error ? error : new Error(String(error));
        emit({
          ...context,
          ...input,
          requestId,
          eventId: eventId(),
          timestamp: new Date().toISOString(),
          level: input.level ?? "error",
          service: input.service ?? context.service,
          message: input.message ?? normalized.message,
          result: input.result ?? "failure",
          errorCode: input.errorCode ?? normalized.name,
          durationMs: input.durationMs ?? Date.now() - startedAt,
          metadata: { ...context.metadata, ...input.metadata },
        });
      },
    };
  },
};
