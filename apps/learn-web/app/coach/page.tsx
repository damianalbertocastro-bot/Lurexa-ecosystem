import { redirect } from "next/navigation";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

export default async function LegacyCoachPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const bridge = typeof params.bridge === "string" ? params.bridge : undefined;
  const target = new URL("/practice", resolveLurexaPublicUrls().coach);
  if (bridge) target.searchParams.set("bridge", bridge);
  redirect(target.toString());
}
