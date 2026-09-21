import type { ReactNode } from "react";
import type { Block, ContentPage, IconName, Resource, ResourceGroup, Topic } from "./types";

/** Parses simple `---\nkey: value\n---` frontmatter used by the content files. */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key) data[key] = value;
  });

  return { data, content: raw.slice(match[0].length) };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createSlugger() {
  const counts: Record<string, number> = {};
  return (text: string) => {
    const raw = slugify(text) || "section";
    if (counts[raw] === undefined) {
      counts[raw] = 0;
      return raw;
    }
    counts[raw]++;
    return `${raw}-${counts[raw]}`;
  };
}

function parseKeywords(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

/** Block parser supporting the markdown subset used across PadhLo content files:
 * `## headings`, `### subheadings`, `- list items`, plain paragraphs and `::: tip / ::: info` callouts. */
function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  const makeSlug = createSlugger();
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const calloutMatch = line.match(/^:::\s*(tip|info|warning)\s*(.*)$/i);
    if (calloutMatch) {
      const variant = calloutMatch[1].toLowerCase() as "tip" | "info" | "warning";
      const title = calloutMatch[2].trim();
      i++;
      const inner: string[] = [];
      while (i < lines.length && lines[i].trim() !== ":::") {
        inner.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "callout", variant, title: title || variant.toUpperCase(), text: inner.join(" ").trim() });
      continue;
    }

    const headingMatch = line.match(/^(#{2,3})\s+(.*)$/);
    if (headingMatch) {
      const text = headingMatch[2].trim();
      blocks.push({ type: "heading", level: headingMatch[1].length as 2 | 3, id: makeSlug(text), text });
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,3})\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^:::/.test(lines[i])
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

/**
 * Parses a resource list item of the shape:
 * `[Name](url) [Tag] [Tag] - short description`
 *
 * Tags are bare `[Word]` groups sitting between the link and the dash; they
 * carry the "is this legit / useful" signal so the descriptions can stay terse.
 * Returns null for plain prose bullets that are not links.
 */
export function parseListItem(item: string): Resource | null {
  const match = item.match(
    /^\[(.+?)\]\((.+?)\)\s*((?:\[[^\]]+\]\s*)*)\s*(?:[-\u2013\u2014]\s*(.*))?$/
  );
  if (!match) return null;

  const tags: string[] = [];
  const tagRegex = /\[([^\]]+)\]/g;
  let tagMatch: RegExpExecArray | null;
  while ((tagMatch = tagRegex.exec(match[3] || ""))) {
    tags.push(tagMatch[1].trim());
  }

  return {
    name: match[1].trim(),
    url: match[2].trim(),
    tags,
    description: match[4]?.trim() || undefined,
  };
}

function parseResourceLine(item: string): Resource {
  return parseListItem(item) ?? { name: item, url: "#", tags: [] };
}

/** Builds a Topic (grouped resource sections) from a `content/topics/*.md` file. */
export function buildTopic(slug: string, raw: string): Topic {
  const { data, content } = parseFrontmatter(raw);
  const blocks = parseBlocks(content);

  const groups: ResourceGroup[] = [];
  const planned: string[] = [];

  let current: { title: string; descriptionParts: string[]; links: Resource[] } | null = null;
  let isPlanned = false;

  const flush = () => {
    if (current && !isPlanned) {
      groups.push({
        title: current.title,
        description: current.descriptionParts.join(" "),
        links: current.links,
      });
    }
    current = null;
  };

  for (const block of blocks) {
    if (block.type === "heading") {
      flush();
      isPlanned = block.text.toLowerCase() === "planned additions";
      current = { title: block.text, descriptionParts: [], links: [] };
    } else if (block.type === "paragraph" && current) {
      current.descriptionParts.push(block.text);
    } else if (block.type === "list" && current) {
      if (isPlanned) {
        planned.push(...block.items);
      } else {
        current.links.push(...block.items.map(parseResourceLine));
      }
    }
  }
  flush();

  return {
    slug,
    title: data.title ?? slug,
    tagline: data.tagline ?? "",
    icon: (data.icon as IconName) ?? "misc",
    keywords: parseKeywords(data.keywords),
    blocks,
    groups,
    planned,
  };
}

/** Builds a generic documentation page from a `content/pages/*.md` file. */
export function buildPage(slug: string, raw: string): ContentPage {
  const { data, content } = parseFrontmatter(raw);
  const blocks = parseBlocks(content);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    icon: (data.icon as IconName) ?? "guide",
    keywords: parseKeywords(data.keywords),
    blocks,
  };
}

/** Renders inline `[label](url)`, `**bold**`, `*italic*`, and `` `code` `` markdown syntax within plain text. */
export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Token matchers:
  // 1, 2: **[bold link](url)**
  // 3, 4: [link](url)
  // 5: **bold**
  // 6: *italic*
  // 7: `code`
  const regex = /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      const url = match[2];
      const external = /^https?:\/\//.test(url);
      nodes.push(
        <a key={key++} href={url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
          <strong>{match[1]}</strong>
        </a>
      );
    } else if (match[3] && match[4]) {
      const url = match[4];
      const external = /^https?:\/\//.test(url);
      const inner = match[3];
      // Check if inner has bold
      const boldMatch = inner.match(/^\*\*(.+?)\*\*$/);
      nodes.push(
        <a key={key++} href={url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
          {boldMatch ? <strong>{boldMatch[1]}</strong> : inner}
        </a>
      );
    } else if (match[5]) {
      nodes.push(<strong key={key++}>{match[5]}</strong>);
    } else if (match[6]) {
      nodes.push(<em key={key++}>{match[6]}</em>);
    } else if (match[7]) {
      nodes.push(<code key={key++} className="inline-code">{match[7]}</code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
