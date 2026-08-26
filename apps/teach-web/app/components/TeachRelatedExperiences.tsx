"use client";

import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");
const teacherWorkspaceUrl = process.env.NEXT_PUBLIC_LUREXA_TEACHER_URL ?? getEcosystemUrl("learn", "/teacher/dashboard");
const docsUrl = getEcosystemUrl("docs");
const coachUrl = process.env.NEXT_PUBLIC_LUREXA_COACH_URL ?? getEcosystemUrl("learn", "/coach");
const campusUrl = process.env.NEXT_PUBLIC_LUREXA_CAMPUS_URL ?? ecosystemUrl;

export function TeachRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/" && pathname !== "/dashboard") return null;

  const items: RelatedExperience[] = pathname === "/dashboard"
    ? [
        { kind: "teach-community", title: "Teach Community", description: "Exchange classroom practice, evidence, resources, and feedback with educators who are growing too.", href: "/community", badge: "Inside Teach", cta: "Join the community" },
        { kind: "learn", title: "Lurexa Learn · Teacher workspace", description: "Move from professional growth back into class operations, assignments, learner progress, and instructional support.", href: teacherWorkspaceUrl, cta: "Open teacher workspace" },
        { kind: "campus", title: "Lurexa Campus", description: "Connect educator growth and academic departments across campus-wide institutional deployments.", href: campusUrl, cta: "View Campus" },
        { kind: "docs", title: "Lurexa Docs", description: "Use the canonical methodology, architecture, curriculum, and product documentation behind the ecosystem.", href: docsUrl, cta: "Open Docs" },
        { kind: "coach", title: "Lurexa Coach", description: "Strengthen your own speaking and pronunciation with guided practice connected to your Lurexa profile.", href: coachUrl, cta: "Practice with Coach" },
      ]
    : [
        { kind: "learn", title: "Lurexa Learn · Teacher workspace", description: "Teach owns your professional growth. Learn remains the place to manage classes, assignments, and learner progress.", href: teacherWorkspaceUrl, badge: "Operational workspace", cta: "Go to Learn" },
        { kind: "campus", title: "Lurexa Campus", description: "Connect educator professional development with institutional campus deployments and programs.", href: campusUrl, cta: "For campuses" },
        { kind: "teach-community", title: "Teach Community", description: "Professional growth is stronger when reflection, evidence, and peer exchange happen together.", href: "/community", cta: "Meet the community" },
        { kind: "docs", title: "Lurexa Docs", description: "Explore the source-of-truth methodology and architecture that shape Lurexa learning experiences.", href: docsUrl, cta: "Explore Docs" },
      ];

  return <div className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8"><RelatedExperiences items={items} title={pathname === "/dashboard" ? "Connect professional growth to the rest of Lurexa." : "Teaching work and professional growth stay connected—not collapsed together."} /></div>;
}
