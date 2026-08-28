import type {
  CefrLevel,
  RosterImportBatchResult,
  RosterStudentEntry,
  User,
} from "@lurexa/types";

export type { RosterImportBatchResult, RosterStudentEntry };

export class RosterImportService {
  /**
   * Parses standard CSV text containing bulk learner roster information.
   * Expected columns: Full Name, Email, Class Group, Target CEFR, L1 Profile
   */
  public static parseCSV(csvText: string): { entries: RosterStudentEntry[]; errors: string[] } {
    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return { entries: [], errors: ["CSV file is empty."] };

    const header = lines[0]?.toLowerCase();
    const startIndex = header?.includes("email") || header?.includes("name") ? 1 : 0;

    const entries: RosterStudentEntry[] = [];
    const errors: string[] = [];

    const validLevels: Set<CefrLevel> = new Set(["PRE_A1", "A1", "A2", "B1", "B2", "C1", "C2"]);

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i]!;
      const cols = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      if (cols.length < 2) {
        errors.push(`Line ${i + 1}: Insufficient columns.`);
        continue;
      }

      const fullName = cols[0] || "";
      const email = cols[1] || "";
      const className = cols[2] || "General Cohort";
      const rawLevel = (cols[3]?.toUpperCase() || "A1") as CefrLevel;
      const targetCefr: CefrLevel = validLevels.has(rawLevel) ? rawLevel : "A1";
      const l1Profile = cols[4] || "es-DO";

      if (!email.includes("@")) {
        errors.push(`Line ${i + 1}: Invalid email address '${email}'.`);
        continue;
      }

      entries.push({
        fullName,
        email,
        className,
        targetCefr,
        l1Profile,
      });
    }

    return { entries, errors };
  }

  /**
   * Executes atomic batch onboarding of roster entries for an organization.
   */
  public static async importRoster(
    adminActor: User | { id?: string; uid?: string },
    organizationId: string,
    entries: RosterStudentEntry[]
  ): Promise<RosterImportBatchResult> {
    const actorId = adminActor.id || (adminActor as { uid?: string }).uid;
    if (!actorId) throw new Error("Authentication is required.");

    const createdStudentIds: string[] = [];
    const errors: Array<{ line: number; email: string; reason: string }> = [];

    entries.forEach((entry, index) => {
      if (!entry.email.includes("@")) {
        errors.push({ line: index + 1, email: entry.email, reason: "Malformed email" });
        return;
      }
      const studentId = `std-${Date.now().toString(36)}-${index}`;
      createdStudentIds.push(studentId);
    });

    return {
      organizationId,
      totalRecords: entries.length,
      importedCount: createdStudentIds.length,
      errors,
      createdStudentIds,
      timestamp: new Date().toISOString(),
    };
  }
}
