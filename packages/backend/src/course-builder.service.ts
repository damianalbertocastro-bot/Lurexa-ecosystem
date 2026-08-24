import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";

const directWriteError =
  "Direct browser curriculum writes are disabled. Use the authenticated Lurexa Core learning API.";

/**
 * @deprecated Legacy client-side builder compatibility facade.
 *
 * The original implementation wrote courses/modules/lessons directly through
 * the Firebase browser SDK, bypassing Core authorization and publication
 * policy. The canonical Learn teacher workspace now uses the trusted server
 * learning API, so these mutation methods deliberately fail closed while old
 * imports are migrated or removed.
 */
export const CourseBuilderService = {
  async createCourse(
    _orgId: string,
    _authorId: string,
    _title: string,
    _description: string,
    _subject: Course["subject"],
  ): Promise<never> {
    throw new Error(directWriteError);
  },

  async addModule(
    _courseId: string,
    _title: string,
    _order: number,
  ): Promise<never> {
    throw new Error(directWriteError);
  },

  async saveLesson(
    _moduleId: string,
    _lessonId: string | null,
    _title: string,
    _contentBlocks: ContentBlock[],
    _order: number,
    _estimatedMinutes: number,
  ): Promise<never> {
    throw new Error(directWriteError);
  },

  async publishCourse(_courseId: string): Promise<never> {
    throw new Error(directWriteError);
  },
};

// Keep type imports reachable for downstream migration tooling that historically
// referenced the service's return concepts.
export type LegacyCourseBuilderEntities = Course | Module | Lesson;
