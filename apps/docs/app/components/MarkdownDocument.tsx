import { resolveCanonicalMarkdownHref } from "../../lib/docs-content";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function safeHref(currentRelativePath: string, rawHref: string) {
  const resolved = resolveCanonicalMarkdownHref(currentRelativePath, rawHref.trim());
  if (resolved.startsWith("#") || resolved.startsWith("/") || /^https?:\/\//i.test(resolved) || /^mailto:/i.test(resolved)) {
    return escapeHtml(resolved);
  }
  return "#";
}

function inlineMarkdown(value: string, currentRelativePath: string) {
  let text = escapeHtml(value);
  const code: string[] = [];
  text = text.replace(/`([^`]+)`/g, (_, content: string) => {
    const token = `@@LUREXA_CODE_${code.length}@@`;
    code.push(`<code>${content}</code>`);
    return token;
  });
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt: string, href: string) => {
    const src = safeHref(currentRelativePath, href);
    if (src === "#") return `<span class="md-image-alt">[Image: ${alt}]</span>`;
    return `<img src="${src}" alt="${alt}" loading="lazy" />`;
  });
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    const target = safeHref(currentRelativePath, href);
    const external = /^https?:\/\//i.test(target);
    return `<a href="${target}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
  });
  text = text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_]+)_/g, "$1<em>$2</em>");
  code.forEach((html, index) => {
    text = text.replace(`@@LUREXA_CODE_${index}@@`, html);
  });
  return text;
}

function isTableDivider(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function cells(line: string) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function renderMarkdown(content: string, currentRelativePath: string) {
  const lines = content.replaceAll("\r\n", "\n").split("\n");
  const html: string[] = [];
  const headingCounts = new Map<string, number>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]!;
    if (!line.trim()) { index += 1; continue; }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index]!.startsWith("```")) {
        body.push(lines[index]!);
        index += 1;
      }
      index += 1;
      html.push(`<pre><code${language ? ` data-language="${escapeHtml(language)}"` : ""}>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (heading) {
      const level = heading[1]!.length;
      const title = heading[2]!.trim();
      const base = slugify(title);
      const count = headingCounts.get(base) ?? 0;
      headingCounts.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      html.push(`<h${level} id="${id}"><a class="heading-anchor" href="#${id}" aria-label="Link to ${escapeHtml(title)}">#</a>${inlineMarkdown(title, currentRelativePath)}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\s*(---+|___+|\*\*\*+)\s*$/.test(line)) {
      html.push("<hr />");
      index += 1;
      continue;
    }

    if (line.trim().startsWith(">")) {
      const quote: string[] = [];
      while (index < lines.length && lines[index]!.trim().startsWith(">")) {
        quote.push(lines[index]!.replace(/^\s*>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote>${quote.map((item) => `<p>${inlineMarkdown(item, currentRelativePath)}</p>`).join("")}</blockquote>`);
      continue;
    }

    if (index + 1 < lines.length && line.includes("|") && isTableDivider(lines[index + 1]!)) {
      const header = cells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index]!.includes("|") && lines[index]!.trim()) {
        rows.push(cells(lines[index]!));
        index += 1;
      }
      html.push(`<div class="md-table-wrap"><table><thead><tr>${header.map((cell) => `<th>${inlineMarkdown(cell, currentRelativePath)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell, currentRelativePath)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    if (unordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index]!.match(/^\s*[-*+]\s+(.+)$/);
        if (!match) break;
        items.push(match[1]!);
        index += 1;
      }
      html.push(`<ul>${items.map((item) => `<li>${inlineMarkdown(item, currentRelativePath)}</li>`).join("")}</ul>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (ordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index]!.match(/^\s*\d+[.)]\s+(.+)$/);
        if (!match) break;
        items.push(match[1]!);
        index += 1;
      }
      html.push(`<ol>${items.map((item) => `<li>${inlineMarkdown(item, currentRelativePath)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length) {
      const next = lines[index]!;
      if (!next.trim() || /^(#{1,6})\s+/.test(next) || next.startsWith("```") || /^\s*>/.test(next) || /^\s*[-*+]\s+/.test(next) || /^\s*\d+[.)]\s+/.test(next)) break;
      if (index + 1 < lines.length && next.includes("|") && isTableDivider(lines[index + 1]!)) break;
      paragraph.push(next.trim());
      index += 1;
    }
    html.push(`<p>${inlineMarkdown(paragraph.join(" "), currentRelativePath)}</p>`);
  }

  return html.join("\n");
}

export function MarkdownDocument({ content, relativePath }: { content: string; relativePath: string }) {
  const html = renderMarkdown(content, relativePath);
  return <article className="markdown-document" dangerouslySetInnerHTML={{ __html: html }} />;
}
