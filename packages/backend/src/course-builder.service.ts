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
    orgId: string,
    authorId: string,
    title: string,
    description: string,
    subject: Course["subject"],
  ): Promise<never> {
    void [orgId, authorId, title, description, subject];
    throw new Error(directWriteError);
  },

  async addModule(
    courseId: string,
    title: string,
    order: number,
  ): Promise<never> {
    void [courseId, title, order];
    throw new Error(directWriteError);
  },

  async saveLesson(
    moduleId: string,
    lessonId: string | null,
    title: string,
    contentBlocks: ContentBlock[],
    order: number,
    estimatedMinutes: number,
  ): Promise<never> {
    void [moduleId, lessonId, title, contentBlocks, order, estimatedMinutes];
    throw new Error(directWriteError);
  },

  async publishCourse(courseId: string): Promise<never> {
    void courseId;
    throw new Error(directWriteError);
  },
};

// Keep type imports reachable for downstream migration tooling that historically
// referenced the service's return concepts.
export type LegacyCourseBuilderEntities = Course | Module | Lesson;
