export type IconName =
  | "exam"
  | "college"
  | "school"
  | "research"
  | "courses"
  | "ai"
  | "professional"
  | "developer"
  | "books"
  | "misc"
  | "search"
  | "sun"
  | "moon"
  | "menu"
  | "close"
  | "external"
  | "github"
  | "home"
  | "chevron"
  | "guide"
  | "edit"
  | "info"
  | "tip"
  | "check"
  | "arrow"
  | "triangle"
  | "triangleOutline"
  | "back";

export type Resource = {
  name: string;
  url: string;
  tags: string[];
  description?: string;
};

export type ResourceGroup = {
  title: string;
  description: string;
  links: Resource[];
};

export type Topic = {
  slug: string;
  title: string;
  tagline: string;
  icon: IconName;
  keywords: string[];
  blocks: Block[];
  groups: ResourceGroup[];
  planned: string[];
};

export type Block =
  | { type: "callout"; variant: "tip" | "info" | "warning"; title: string; text: string }
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type ContentPage = {
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  keywords: string[];
  blocks: Block[];
};
