import { LessonRuntime } from "../../components/LessonRuntime";

type GenericLessonPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
  searchParams: Promise<{ retrieval?: string | string[] }>;
};

export default async function GenericLessonPage({ params, searchParams }: GenericLessonPageProps) {
  const [{ courseId, lessonId }, query] = await Promise.all([params, searchParams]);
  const retrievalScheduleId = typeof query.retrieval === "string" ? query.retrieval : undefined;
  return (
    <LessonRuntime
      courseId={courseId}
      lessonId={lessonId}
      retrievalScheduleId={retrievalScheduleId}
    />
  );
}
