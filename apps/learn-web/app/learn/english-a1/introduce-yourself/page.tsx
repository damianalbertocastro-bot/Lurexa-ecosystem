import { redirect } from "next/navigation";

/**
 * Legacy A1 URL retained for existing links. The canonical lesson runtime is
 * the only learner route allowed to record trusted course progress.
 */
export default function LegacyIntroduceYourselfPage() {
  redirect("/learn/english-a1-foundations/a1-introduce-yourself");
}
