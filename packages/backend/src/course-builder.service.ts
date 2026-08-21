import { Course, Module, Lesson, ContentBlock } from "@lurexa/types";

const trustedWriteError =
  "Legacy CourseBuilderService writes are disabled. Use the trusted Learn /api/learning CoursePlatform boundary.";

/**
 * @deprecated
 *
 * Course authoring is an authoritative Core workflow. The canonical Learn
 * teacher experience now writes through `/api/learning`, where authentication,
 * organization ownership, validation, evidence contracts, and future audit
 * requirements can be enforced consistently.
 *
 * These methods remain temporarily for import compatibility, but all mutation
 * attempts fail closed. Remove the service after all legacy consumers have been
 * migrated to the trusted CoursePlatform boundary.
 */
export const CourseBuilderService = {
  async createCourse(
    orgId: string,
    authorId: string,
    title: string,
    description: string,
    subject: Course["subject"],
  ): Promise<Course> {
    void orgId;
    void authorId;
    void title;
    void description;
    void subject;
    throw new Error(trustedWriteError);
  },

  async addModule(courseId: string, title: string, order: number): Promise<Module> {
    void courseId;
    void title;
    void order;
    throw new Error(trustedWriteError);
  },

  async saveLesson(
    moduleId: string,
    lessonId: string | null,
    title: string,
    contentBlocks: ContentBlock[],
    order: number,
    estimatedMinutes: number,
  ): Promise<Lesson> {
    void moduleId;
    void lessonId;
    void title;
    void contentBlocks;
    void order;
    void estimatedMinutes;
    throw new Error(trustedWriteError);
  },

  async publishCourse(courseId: string): Promise<void> {
    void courseId;
    throw new Error(trustedWriteError);
  },
};
