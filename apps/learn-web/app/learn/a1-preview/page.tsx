import { redirect } from "next/navigation";

/**
 * Replaces the retired preview experience with the canonical, authenticated
 * A1 lesson route so activity evidence has one server-authorized path.
 */
export default function A1PreviewPage() {
  redirect("/learn/english-a1-foundations/a1-introduce-yourself");
}
