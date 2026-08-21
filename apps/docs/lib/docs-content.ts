import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";

export type CanonicalDoc = {
  slug: string[];
  href: string;
  title: string;
  section: string;
  relativePath: string;
  content: string;
  excerpt: string;
  headings: Array<{ level: number; text: string; id: string }>;
};

let canonicalDocsCache: CanonicalDoc[] | null = null;

const slugify = (value: string) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

function findDocsRoot(): string {
  const candidates = [
    resolve(process.cwd(), "Docs"),
    resolve(process.cwd(), "../../Docs"),
    resolve(process.cwd(), "../Docs"),
  ];
  const root = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isDirectory());
  if (!root) throw new Error("Canonical Docs/ directory could not be located.");
  return root;
}

function walkMarkdown(directory: string): string[] {
  return readdirSync(directory)
    .flatMap((name) => {
      const fullPath = join(directory, name);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) return walkMarkdown(fullPath);
      return extname(name).toLowerCase() === ".md" ? [fullPath] : [];
    })
    .sort((a, b) => a.localeCompare(b));
}

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/[>*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(content: string, fallback: string): string {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || fallback.replace(/\.md$/i, "");
}

function extractHeadings(content: string) {
  const seen = new Map<string, number>();
  return Array.from(content.matchAll(/^(#{1,6})\s+(.+)$/gm)).map((match) => {
    const level = match[1]!.length;
    const text = match[2]!.replace(/\s+#+\s*$/, "").trim();
    const base = slugify(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return { level, text, id: count === 0 ? base : `${base}-${count + 1}` };
  });
}

function toDoc(root: string, filePath: string): CanonicalDoc {
  const relativePath = relative(root, filePath).replaceAll("\\", "/");
  const parts = relativePath.split("/");
  const slug = parts.map((part, index) => slugify(index === parts.length - 1 ? part.replace(/\.md$/i, "") : part));
  const content = readFileSync(filePath, "utf8");
  const plain = stripMarkdown(content);
  return {
    slug,
    href: `/docs/${slug.map(encodeURIComponent).join("/")}`,
    title: extractTitle(content, basename(filePath)),
    section: parts[0] ?? "Docs",
    relativePath: `Docs/${relativePath}`,
    content,
    excerpt: plain.slice(0, 240) + (plain.length > 240 ? "…" : ""),
    headings: extractHeadings(content),
  };
}

export function getAllDocs(): CanonicalDoc[] {
  if (canonicalDocsCache) return canonicalDocsCache;
  const root = findDocsRoot();
  canonicalDocsCache = walkMarkdown(root).map((filePath) => toDoc(root, filePath));
  return canonicalDocsCache;
}

export function getDocBySlug(slug: string[]): CanonicalDoc | null {
  const key = slug.join("/").toLowerCase();
  return getAllDocs().find((doc) => doc.slug.join("/") === key) ?? null;
}

export function getDocsBySection(section: string): CanonicalDoc[] {
  const normalized = slugify(section);
  return getAllDocs().filter((doc) => slugify(doc.section) === normalized);
}

export type DocsSearchResult = CanonicalDoc & { score: number; matchExcerpt: string };

export function searchDocs(query: string): DocsSearchResult[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return getAllDocs()
    .map((doc) => {
      const title = doc.title.toLowerCase();
      const path = doc.relativePath.toLowerCase();
      const content = stripMarkdown(doc.content).toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 12;
        if (path.includes(term)) score += 6;
        const contentMatches = content.split(term).length - 1;
        score += Math.min(contentMatches, 8);
      }
      const firstTerm = terms.find((term) => content.includes(term));
      let matchExcerpt = doc.excerpt;
      if (firstTerm) {
        const index = content.indexOf(firstTerm);
        const start = Math.max(0, index - 100);
        const end = Math.min(content.length, index + firstTerm.length + 180);
        matchExcerpt = `${start > 0 ? "…" : ""}${content.slice(start, end).trim()}${end < content.length ? "…" : ""}`;
      }
      return { ...doc, score, matchExcerpt };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 40);
}

export function resolveCanonicalMarkdownHref(currentRelativePath: string, href: string): string {
  if (!href || href.startsWith("#") || /^https?:\/\//i.test(href) || href.startsWith("mailto:")) return href;
  if (!href.toLowerCase().includes(".md")) return href;

  const root = findDocsRoot();
  const currentAbsolute = resolve(root, currentRelativePath.replace(/^Docs\//, ""));
  const targetAbsolute = resolve(dirname(currentAbsolute), decodeURIComponent(href.split("#")[0]!));
  const targetRelative = relative(root, targetAbsolute).replaceAll("\\", "/");
  if (targetRelative.startsWith("..")) return href;

  const target = getAllDocs().find((doc) => doc.relativePath === `Docs/${targetRelative}`);
  const hash = href.includes("#") ? `#${href.split("#").slice(1).join("#")}` : "";
  return target ? `${target.href}${hash}` : href;
}
