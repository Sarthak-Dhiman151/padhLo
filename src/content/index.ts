import { buildPage, buildTopic } from "./markdown";
import type { ContentPage, Topic } from "./types";

export type { Block, ContentPage, IconName, Resource, ResourceGroup, Topic } from "./types";
export { parseListItem, renderInline } from "./markdown";

// Vite loads every markdown file in these folders as raw text at build time,
// mirroring how a real VitePress site sources each wiki section from its own .md file.
const topicModules = import.meta.glob("./topics/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const pageModules = import.meta.glob("./pages/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const topicOrder = [
  "entrance-exams",
  "school-resources",
  "college-resources",
  "research-sources",
  "online-courses",
  "ai-resources",
  "professional-resources",
  "developer-learning",
  "book-resources",
  "miscellaneous",
];

const pageOrder = ["guide", "contribute"];

function slugFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

export const topics: Topic[] = Object.entries(topicModules)
  .map(([path, raw]) => buildTopic(slugFromPath(path), raw))
  .sort((a, b) => topicOrder.indexOf(a.slug) - topicOrder.indexOf(b.slug));

export const pages: ContentPage[] = Object.entries(pageModules)
  .map(([path, raw]) => buildPage(slugFromPath(path), raw))
  .sort((a, b) => pageOrder.indexOf(a.slug) - pageOrder.indexOf(b.slug));

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}

export function getPage(slug: string): ContentPage | undefined {
  return pages.find((page) => page.slug === slug);
}
