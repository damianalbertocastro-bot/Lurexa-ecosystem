import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";

export function LurexaLearnLogo({ inverse = false, href = "/" }: { inverse?: boolean; href?: string }) {
  return <Link href={href} className="inline-flex rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d5add] focus:ring-offset-2" aria-label="Lurexa Learn home"><ProductMark product="learn" inverse={inverse} /></Link>;
}