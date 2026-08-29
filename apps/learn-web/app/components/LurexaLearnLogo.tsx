import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";

export function LurexaLearnLogo({ inverse = false, href = "/" }: { inverse?: boolean; href?: string }) {
  return <Link href={href} className="inline-flex rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--lx-secondary)] focus:ring-offset-2" aria-label="Lurexa Learn home"><ProductMark product="learn" inverse={inverse} /></Link>;
}