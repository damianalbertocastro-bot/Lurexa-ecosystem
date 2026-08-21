"use client";

import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";
const learnUrl = process.env.NEXT_PUBLIC_LUREXA_LEARN_URL ?? ecosystemUrl;
const teachUrl = process.env.NEXT_PUBLIC_LUREXA_TEACH_URL ?? ecosystemUrl;
const adminUrl = process.env.NEXT_PUBLIC_LUREXA_ADMIN_URL ?? ecosystemUrl;

export function DocsRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  const items: RelatedExperience[] = [
    { kind: "ecosystem", title: "Lurexa ecosystem", description: "Move from source-of-truth documentation into the complete product family and understand where each capability becomes a real experience.", href: ecosystemUrl, badge: "Start here", cta: "Explore Lurexa" },
    { kind: "learn", title: "Lurexa Learn", description: "See curriculum, learner-model, and learning-experience decisions expressed in the student and teacher product.", href: learnUrl, cta: "Open Learn" },
    { kind: "teach", title: "Lurexa Teach", description: "See educator growth, evidence, assessment, credentials, and professional community expressed as a dedicated product.", href: teachUrl, cta: "Open Teach" },
    { kind: "admin", title: "Lurexa Admin", description: "See trust, access, institutional operations, and ecosystem governance represented in the administrative experience.", href: adminUrl, cta: "Open Admin" },
  ];

  return <div className="bg-[#f5f7ff] px-5 pb-16 sm:px-8"><div className="mx-auto max-w-[1480px]"><RelatedExperiences items={items} eyebrow="FROM DOCUMENTATION TO EXPERIENCE" title="See where Lurexa decisions become real product behavior." description="Docs explains the system. The connected products show how those architecture, curriculum, design, and governance decisions appear in practice." /></div></div>;
}
