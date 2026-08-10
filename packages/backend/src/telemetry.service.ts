export interface SystemAlertEvent {
  level: "info" | "warning" | "error" | "critical";
  service: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export const TelemetryService = {
  /**
   * Capture exceptions and send telemetry to Sentry / Firebase Crashlytics
   */
  captureException(error: Error, context?: Record<string, unknown>): void {
    console.error(`[TELEMETRY EXCEPTION] ${error.name}: ${error.message}`, context);

    if (process.env.NODE_ENV === "production") {
      // Integration hook for Sentry.captureException(error, { extra: context });
    }
  },

  /**
   * Log platform operational metrics and API performance SLAs
   */
  logEvent(event: Omit<SystemAlertEvent, "timestamp">): void {
    const payload: SystemAlertEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    if (payload.level === "error" || payload.level === "critical") {
      console.error(`[SYSTEM ALERT] [${payload.service}] ${payload.message}`, payload.metadata);
    } else {
      console.log(`[TELEMETRY] [${payload.service}] ${payload.message}`);
    }
  },
};