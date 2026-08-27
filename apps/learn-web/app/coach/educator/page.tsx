import { redirect } from "next/navigation";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

export default function LegacyEducatorCoachPage() {
  const target = new URL("/educator", resolveLurexaPublicUrls().coach);
  redirect(target.toString());
}
