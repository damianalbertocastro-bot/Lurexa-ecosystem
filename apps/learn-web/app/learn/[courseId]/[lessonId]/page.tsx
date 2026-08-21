import { LessonRuntime } from "../../components/LessonRuntime";

export default async function GenericLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  return <LessonRuntime courseId={courseId} lessonId={lessonId} />;
}
