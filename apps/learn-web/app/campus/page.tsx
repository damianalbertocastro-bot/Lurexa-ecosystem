import Link from "next/link";
import { getEcosystemUrl } from "@lurexa/config/domains";

const surfaces = [
  {
    name: "Lurexa Learn",
    role: "Learner delivery and the embedded Teacher Workspace for course operations.",
    href: "/dashboard",
    status: "Implemented surface",
  },
  {
    name: "Lurexa Coach",
    role: "Standalone speaking, pronunciation and fluency practice connected through Product Bridge.",
    href: getEcosystemUrl("coach"),
    status: "Standalone product",
  },
  {
    name: "Lurexa Teach",
    role: "Educator professional development and professional learner growth.",
    href: getEcosystemUrl("teach"),
    status: "Standalone product",
  },
  {
    name: "Lurexa Admin",
    role: "Institutional governance, educator authorization and administrative controls.",
    href: getEcosystemUrl("admin"),
    status: "Governance surface",
  },
  {
    name: "Lurexa Insight",
    role: "Future standalone institutional and cohort analytics. Learn Teacher Insights remain an instructional Learn feature.",
    href: getEcosystemUrl("insight"),
    status: "Foundation pending",
  },
  {
    name: "Lurexa Studio",
    role: "Future standalone governed authoring for Knowledge Objects, lessons and assessments.",
    href: getEcosystemUrl("studio"),
    status: "Foundation pending",
  },
];

export default function CampusWorkspacePage() {
  return (
    <main className="min-h-screen bg-[#f8faff] px-5 py-10 text-[#071d67] sm:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#162f85] to-[#315fd7] p-8 text-white shadow-xl sm:p-12">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.14em] text-[#8df4ef]">
            Representative institutional shell prototype
          </span>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-.055em] sm:text-6xl">
            Campus will orchestrate Lurexa for an institution without becoming a seventh sibling product.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-indigo-100 sm:text-base">
            This page demonstrates the intended information architecture only. It is not connected to a real institution, tenant, accreditation record, single sign-on provider, entitlement set, enrollment count, faculty roster, or institutional analytics projection.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="text-xs font-black uppercase tracking-[.14em]">Prototype boundary</p>
          <p className="mt-2 text-sm leading-7">
            Any future Campus workspace must resolve the authenticated organization through Core, derive product entitlements from trusted records, and create purpose-scoped bridges into the six Lurexa products. Representative copy on this page must never be interpreted as a live institutional claim.
          </p>
        </div>

        <section className="mt-10">
          <p className="text-xs font-black uppercase tracking-[.15em] text-[#6b2bd9]">Intended orchestration model</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-.04em]">One institutional entry point, specialized product ownership.</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {surfaces.map((surface) => {
              const external = surface.href.startsWith("http");
              const classes = "flex h-full flex-col rounded-3xl border border-[#dfe6f8] bg-white p-6 shadow-sm";
              const body = (
                <>
                  <span className="w-fit rounded-full bg-[#f2efff] px-2.5 py-1 text-[10px] font-black uppercase tracking-[.12em] text-[#6540bb]">
                    {surface.status}
                  </span>
                  <h3 className="mt-4 text-xl font-black">{surface.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#6074a5]">{surface.role}</p>
                  <span className="mt-5 text-sm font-black text-[#315fd7]">View surface →</span>
                </>
              );
              return external ? (
                <a key={surface.name} href={surface.href} className={classes}>{body}</a>
              ) : (
                <Link key={surface.name} href={surface.href} className={classes}>{body}</Link>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
