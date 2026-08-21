import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "../../components/DocsShell";
import { MarkdownDocument } from "../../components/MarkdownDocument";
import { getAllDocs, getDocBySlug } from "../../../lib/docs-content";

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return { title: "Document not found | Lurexa Docs" };
  return { title: `${doc.title} | Lurexa Docs`, description: doc.excerpt };
}

export default async function CanonicalDocumentPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();
  const sectionHref = `/${doc.section.toLowerCase()}`;

  return <DocsShell active={doc.section}><main className="mx-auto max-w-[1480px] px-5 py-9 sm:px-8 sm:py-12">
    <div className="grid gap-8 xl:grid-cols-[240px_minmax(0,1fr)_260px]">
      <aside className="hidden xl:block"><div className="sticky top-28 rounded-[24px] border border-[#dfe6f8] bg-white p-5 shadow-[0_10px_28px_rgba(32,52,128,.05)]"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#7180a8]">CANONICAL SOURCE</p><p className="mt-3 break-words text-xs font-bold leading-5 text-[#53679f]">{doc.relativePath}</p><Link href={sectionHref} className="mt-5 inline-flex min-h-11 items-center text-sm font-extrabold text-[#315fd7]">← {doc.section}</Link><Link href="/search" className="mt-1 inline-flex min-h-11 items-center text-sm font-extrabold text-[#592bd6]">Search Docs →</Link></div></aside>

      <section className="min-w-0"><div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-extrabold text-[#7180a8]"><Link href="/" className="hover:text-[#315fd7]">Docs</Link><span>/</span><Link href={sectionHref} className="hover:text-[#315fd7]">{doc.section}</Link><span>/</span><span className="text-[#53679f]">{doc.title}</span></div><div className="rounded-[30px] border border-[#dfe6f8] bg-white px-6 py-8 shadow-[0_16px_40px_rgba(32,52,128,.055)] sm:px-9 sm:py-10"><MarkdownDocument content={doc.content} relativePath={doc.relativePath} /></div></section>

      <aside className="hidden xl:block"><div className="sticky top-28"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#7180a8]">ON THIS PAGE</p><nav className="mt-4 space-y-1" aria-label="Document headings">{doc.headings.filter((heading)=>heading.level<=3).slice(0,24).map((heading)=><a key={heading.id} href={`#${heading.id}`} className={`block rounded-lg py-1.5 text-xs font-bold leading-5 text-[#6677a5] hover:text-[#315fd7] ${heading.level===3?"pl-4":heading.level===2?"pl-2":""}`}>{heading.text}</a>)}</nav></div></aside>
    </div>
  </main></DocsShell>;
}
