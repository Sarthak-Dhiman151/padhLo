import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { pages, parseListItem, renderInline, topics } from "./content";
import type { Block, ContentPage, IconName, Topic } from "./content";

type SearchEntry = {
  route: string;
  title: string;
  details: string;
  keywords: string[];
  icon: IconName;
};

// Topic and page content lives in `src/content/topics/*.md` and `src/content/pages/*.md`.
// The `content` module loads and parses those markdown files at build time.

const searchIndex: SearchEntry[] = [
  ...pages.map((page) => ({
    route: `/${page.slug}`,
    title: page.title,
    details: page.description,
    keywords: page.keywords,
    icon: page.icon,
  })),
  ...topics.flatMap((topic) => [
    {
      route: `/topic/${topic.slug}`,
      title: topic.title,
      details: topic.tagline,
      keywords: topic.keywords,
      icon: topic.icon,
    },
    ...topic.blocks
      .filter((block): block is Extract<Block, { type: "heading" }> => block.type === "heading")
      .map((block) => ({
        route: `/topic/${topic.slug}#${block.id}`,
        title: block.text,
        details: `${topic.title} • Section`,
        keywords: [topic.title, ...block.text.split(/[^a-zA-Z0-9]+/).filter(Boolean)],
        icon: topic.icon,
      })),
  ]),
];

const sidebarGroups = [
  { label: "Getting started", links: ["guide"] },
  {
    label: "Student resources",
    links: [
      "entrance-exams",
      "school-resources",
      "college-resources",
      "research-sources",
      "online-courses",
      "ai-resources",
      "developer-learning",
      "professional-resources",
      "book-resources",
      "miscellaneous",
    ],
  },
  { label: "Project", links: ["contributing"] },
];

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    exam: <><path d="M7 3h10v5H7z" /><path d="M5 5H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1" /><path d="m8.5 14 2 2 5-5" /></>,
    college: <><path d="m3 10 9-5 9 5-9 5z" /><path d="M7 13v4c3 2 7 2 10 0v-4" /><path d="M21 10v6" /></>,
    school: <><path d="M4 4h6a2 2 0 0 1 2 2v14a3 3 0 0 0-3-3H4z" /><path d="M20 4h-6a2 2 0 0 0-2 2v14a3 3 0 0 1 3-3h5z" /></>,
    research: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5M8 10.5h5M10.5 8v5" /></>,
    courses: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m10 9 5 3-5 3z" /></>,
    ai: <><rect x="6" y="6" width="12" height="12" rx="3" /><path d="M9 10h.01M15 10h.01M9.5 14h5M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M18 9h4M2 15h4M18 15h4" /></>,
    professional: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2" /></>,
    developer: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />,
    books: <><path d="M5 4h11a3 3 0 0 1 3 3v14H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h11M9 7h6" /></>,
    misc: <><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    external: <path d="M14 5h5v5M12 12l7-7M19 13v6H5V5h6" />,
    github: <path d="M12 2.8a9.4 9.4 0 0 0-3 18.3c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.1-4.7-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.7 5 .4.3.7 1 .7 1.9v2.8c0 .4.2.6.7.5A9.4 9.4 0 0 0 12 2.8z" />,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    guide: <><path d="M5 4h14v16H5z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5h.01" /></>,
    tip: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.3 1 2.5h6c0-1.2.2-1.8 1-2.5A6 6 0 0 0 12 3z" /></>,
    check: <path d="m5 12 5 5L20 7" />,
    arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
    triangle: <path d="M7 4 20 12 7 20z" fill="currentColor" stroke="none" />,
    triangleOutline: <path d="M8 5.5 18 12 8 18.5z" />,
    back: <path d="m11 6-6 6 6 6M19 6l-6 6 6 6" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function AcademicEmblem({ className = "" }: { className?: string }) {
  const spokes = Array.from({ length: 24 }, (_, index) => index * 15);
  return (
    <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
      <rect x="8" y="8" width="80" height="80" rx="20" className="emblem-bg" />
      <path d="M48 30c-8-6.4-20-9-32-8.2v40.2c12-.8 24 1.8 32 8.2 8-6.4 20-9 32-8.2V21.8C68 21 56 23.6 48 30Z" className="emblem-book" />
      <path d="M48 30v40.2M22 30.2c8.4-.4 17.2 1.8 22 5.4M74 30.2c-8.4-.4-17.2 1.8-22 5.4" className="emblem-line" />
      <circle cx="48" cy="42" r="11" className="emblem-line" />
      {spokes.map((angle) => (
        <line key={angle} x1="48" y1="33.5" x2="48" y2="50.5" className="emblem-spoke" transform={`rotate(${angle} 48 42)`} />
      ))}
      <circle cx="48" cy="42" r="1.8" className="emblem-dot" />
    </svg>
  );
}

function getRoute(): string | null {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash || hash === "/") return null;
  return hash;
}

function goHomeToSection(id: string) {
  const route = getRoute();
  if (route) {
    window.location.hash = "#/";
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 70);
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

function Header({
  theme,
  setTheme,
  openSearch,
  openMenu,
}: {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  openSearch: () => void;
  openMenu: () => void;
}) {
  return (
    <header className="VPNav">
      <div className="VPNavBar">
        <a className="VPNavBarTitle" href="#/" aria-label="PadhLo home">
          <AcademicEmblem className="nav-logo" />
          <span>PadhLo</span>
        </a>

        <nav className="VPNavLinks" aria-label="Main navigation">
          <a href="#/guide">Guide</a>
          <button onClick={() => goHomeToSection("features")}>Topics</button>
          <a href="#/contributing">Contribute</a>
          <a href="https://github.com/Sarthak-Dhiman151/padhLo" target="_blank" rel="noreferrer">GitHub</a>
        </nav>

        <div className="VPNavActions">
          <button className="DocSearch-Button" onClick={openSearch}>
            <Icon name="search" size={15} />
            <span className="DocSearch-Button-Placeholder">Search docs</span>
            <kbd><span className="DocSearch-Button-Keys">/</span></kbd>
          </button>
          <button
            className="VPSwitch"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle color mode"
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
          </button>
          <a className="VPSocialLink desktop" href="https://github.com/Sarthak-Dhiman151/padhLo" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Icon name="github" size={19} />
          </a>
          <button className="VPNavHamburger" onClick={openMenu} aria-label="Open navigation">
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>
      <div className="VPNavDivider" />
    </header>
  );
}

function MobileMenu({ open, close }: { open: boolean; close: () => void }) {
  if (!open) return null;
  return (
    <div className="VPNavScreenOverlay" onMouseDown={close}>
      <nav className="VPNavScreen" onMouseDown={(event) => event.stopPropagation()} aria-label="Mobile navigation">
        <div className="VPNavScreenHeader">
          <span>Navigation</span>
          <button className="VPSwitch" onClick={close} aria-label="Close navigation"><Icon name="close" size={20} /></button>
        </div>
        <a href="#/guide" onClick={close}><span>Beginner's Guide</span><Icon name="chevron" size={18} /></a>
        <button onClick={() => { close(); goHomeToSection("features"); }}><span>Topics</span><Icon name="chevron" size={18} /></button>
        <a href="#/contributing" onClick={close}><span>Contribute</span><Icon name="chevron" size={18} /></a>
        <a href="https://github.com/Sarthak-Dhiman151/padhLo" target="_blank" rel="noreferrer"><span>GitHub</span><Icon name="external" size={17} /></a>
      </nav>
    </div>
  );
}

function SearchModal({
  open,
  close,
  navigate,
}: {
  open: boolean;
  close: () => void;
  navigate: (route: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex;
    return searchIndex.filter((entry) => [entry.title, entry.details, ...entry.keywords].join(" ").toLowerCase().includes(q));
  }, [query]);

  if (!open) return null;

  return (
    <div className="DocSearch-ModalOverlay" onMouseDown={close}>
      <div className="DocSearch-Modal" role="dialog" aria-modal="true" aria-label="Search docs" onMouseDown={(event) => event.stopPropagation()}>
        <header className="DocSearch-SearchBar">
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && results[0]) navigate(results[0].route);
            }}
            placeholder="Search guides, exams and resources"
            aria-label="Search"
          />
          <button onClick={close}>Esc</button>
        </header>
        <div className="DocSearch-Dropdown">
          <p className="DocSearch-HitSource">{query ? "Results" : "All pages"}</p>
          {results.map((entry) => (
            <button className="DocSearch-Hit" key={entry.route} onClick={() => navigate(entry.route)}>
              <span className="DocSearch-Hit-icon"><Icon name={entry.icon} size={18} /></span>
              <span>
                <strong>{entry.title}</strong>
                <small>{entry.details}</small>
              </span>
              <Icon name="arrow" size={16} />
            </button>
          ))}
          {results.length === 0 && (
            <div className="DocSearch-NoResults">
              <strong>No results</strong>
              <span>Try searching for an exam, topic or skill.</span>
            </div>
          )}
        </div>
        <footer className="DocSearch-Footer">
          <span><kbd>Enter</kbd> to open</span>
          <span><kbd>Esc</kbd> to close</span>
        </footer>
      </div>
    </div>
  );
}

function HomePage({ navigate, openSearch }: { navigate: (route: string) => void; openSearch: () => void }) {
  return (
    <main className="VPHeroPage">
      <section className="VPHero">
        <div className="VPHeroText">
          <p className="VPHeroTaglineKicker">Student resource index for India</p>
          <h1 className="VPHeroName">padhlo</h1>
          <p className="VPHeroTagline">A focused wiki for Indian students: exams, school, college, research, courses, careers, books and developer learning.</p>
          <div className="VPActionButtons">
            <button className="VPButton brand" onClick={() => navigate("/guide")}>Get Started</button>
            <button className="VPButton alt" onClick={openSearch}>Search</button>
            <a className="VPButton alt" href="#/contributing">Contribute</a>
          </div>
        </div>
        <div className="VPHeroImage">
          <div className="VPHeroImageBg" />
          <AcademicEmblem className="VPHeroLogo" />
        </div>
      </section>

      <section className="VPFeatures" id="features">
        <h2>Or browse these pages</h2>
        <div className="VPFeatureGrid">
          {topics.map((topic) => (
            <button className="VPFeature" key={topic.slug} onClick={() => navigate(`/topic/${topic.slug}`)}>
              <span className="VPFeatureIcon"><Icon name={topic.icon} size={27} /></span>
              <h3>{topic.title}</h3>
              <p>{topic.tagline}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function Sidebar({ active, close }: { active: string | null; close?: () => void }) {
  const findTitle = (slug: string) => topics.find((topic) => topic.slug === slug)?.title
    ?? pages.find((page) => page.slug === slug)?.title
    ?? slug;
  const findIcon = (slug: string): IconName => topics.find((topic) => topic.slug === slug)?.icon
    ?? (pages.find((page) => page.slug === slug)?.icon ?? "home");

  return (
    <nav className="VPSidebar" aria-label="Wiki sections">
      <a className={`VPSidebarItem home ${active === null ? "active" : ""}`} href="#/" onClick={close}>
        <Icon name="home" size={16} /><span>Wiki Home</span>
      </a>
      {sidebarGroups.map((group) => (
        <div className="VPSidebarGroup" key={group.label}>
          <p>{group.label}</p>
          {group.links.map((slug) => {
            const route = slug === "guide" || slug === "contributing" ? `/${slug}` : `/topic/${slug}`;
            return (
              <a
                key={slug}
                className={`VPSidebarItem ${active === slug ? "active" : ""}`}
                href={`#${route}`}
                onClick={close}
              >
                <Icon name={findIcon(slug)} size={15} />
                <span>{findTitle(slug)}</span>
              </a>
            );
          })}
        </div>
      ))}
      <div className="VPSidebarNote">
        <Icon name="info" size={16} />
        <p>Links are curated gradually. Official and open resources are prioritized.</p>
      </div>
    </nav>
  );
}

function Outline({ items, activeId }: { items: { id: string; title: string; level?: number }[]; activeId?: string }) {
  return (
    <aside className="VPDocAsideOutline">
      <div className="outline-title">On this page</div>
      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            className={`${activeId === item.id ? "active" : ""} ${item.level === 3 ? "sub-item" : ""}`}
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function BackToIndex() {
  return (
    <div className="doc-back">
      <a href="#/"><Icon name="back" size={15} /><span>Back to Wiki Index</span></a>
    </div>
  );
}

function Callout({ type, title, children }: { type: "tip" | "info"; title: string; children: ReactNode }) {
  return (
    <div className={`custom-block ${type}`}>
      <div className="custom-block-title"><Icon name={type === "tip" ? "tip" : "info"} size={17} /><span>{title}</span></div>
      <div className="custom-block-content">{children}</div>
    </div>
  );
}

function DocsShell({
  active,
  children,
  outline,
}: {
  active: string;
  children: ReactNode;
  outline: { id: string; title: string; level?: number }[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState(outline[0]?.id);

  useEffect(() => {
    setActiveId(outline[0]?.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-90px 0px -68% 0px", threshold: 0 }
    );
    outline.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [outline]);

  return (
    <main className="VPDoc">
      <aside className="VPDocAside"><Sidebar active={active} /></aside>

      <div className="VPDocMobileBar">
        <button onClick={() => setMobileOpen(true)}><Icon name="menu" size={17} /> Sections</button>
        <span>{topics.find((topic) => topic.slug === active)?.title ?? pages.find((page) => page.slug === active)?.title}</span>
      </div>

      {mobileOpen && (
        <div className="VPDocMobileOverlay" onMouseDown={() => setMobileOpen(false)}>
          <aside onMouseDown={(event) => event.stopPropagation()}>
            <div className="VPDocMobileHeader">
              <span>Wiki sections</span>
              <button className="VPSwitch" onClick={() => setMobileOpen(false)} aria-label="Close sections"><Icon name="close" size={20} /></button>
            </div>
            <Sidebar active={active} close={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="VPDocContainer">
        <article className="vp-doc">
          {children}
          <a className="vp-edit-link" href="https://github.com/Sarthak-Dhiman151/padhLo" target="_blank" rel="noreferrer">
            <Icon name="edit" size={15} />
            Edit this page
          </a>
        </article>
      </div>
      <Outline items={outline} activeId={activeId} />
    </main>
  );
}

/** Maps a tag label to a CSS-safe slug used by the `[data-tag]` chip selectors. */
function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[\s_/]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Renders the ordered list of blocks parsed from a markdown file. */
function MarkdownBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "callout") {
          return (
            <Callout key={index} type={block.variant === "tip" ? "tip" : "info"} title={block.title}>
              <p>{renderInline(block.text)}</p>
            </Callout>
          );
        }
        if (block.type === "heading") {
          const Tag = block.level === 3 ? "h3" : "h2";
          return (
            <Tag key={index} id={block.id}>
              <Icon name={block.level === 3 ? "triangleOutline" : "triangleOutline"} size={block.level === 3 ? 13 : 15} />
              {block.text}
            </Tag>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="resource-list">
              {block.items.map((item, itemIndex) => {
                const parsed = parseListItem(item);
                if (!parsed) return <li key={itemIndex}>{renderInline(item)}</li>;
                const external = /^https?:\/\//.test(parsed.url);
                return (
                  <li key={itemIndex}>
                    <a
                      href={parsed.url}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                    >
                      {parsed.name}
                    </a>
                    {parsed.tags.map((tag) => (
                      <span key={tag} className="tag" data-tag={tagSlug(tag)}>
                        {tag}
                      </span>
                    ))}
                    {parsed.description && (
                      <span className="resource-description"> — {parsed.description}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          );
        }
        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </>
  );
}

function TopicPage({ topic }: { topic: Topic }) {
  const outline = [
    { id: "overview", title: "Overview", level: 2 },
    ...topic.blocks
      .filter((block): block is Extract<Block, { type: "heading" }> => block.type === "heading")
      .map((block) => ({ id: block.id, title: block.text, level: block.level })),
  ];

  return (
    <DocsShell active={topic.slug} outline={outline}>
      <BackToIndex />
      <header id="overview" className="vp-page-header">
        <h1><Icon name="triangle" size={23} />{topic.title}</h1>
        <p>{topic.tagline}</p>
      </header>

      <MarkdownBlocks blocks={topic.blocks} />

      <nav className="vp-pager">
        <a href="#/">
          <span>Previous</span>
          <strong>Wiki Home</strong>
        </a>
        {(() => {
          const index = topics.findIndex((item) => item.slug === topic.slug);
          const next = topics[(index + 1) % topics.length];
          return (
            <a className="next" href={`#/topic/${next.slug}`}>
              <span>Next</span>
              <strong>{next.title}</strong>
            </a>
          );
        })()}
      </nav>
    </DocsShell>
  );
}

/** Generic documentation page driven entirely by a parsed `content/pages/*.md` file. */
function MarkdownPage({ page }: { page: ContentPage }) {
  const outline = [
    { id: "overview", title: "Overview", level: 2 },
    ...page.blocks
      .filter((block): block is Extract<Block, { type: "heading" }> => block.type === "heading")
      .map((block) => ({ id: block.id, title: block.text, level: block.level })),
  ];

  return (
    <DocsShell active={page.slug} outline={outline}>
      <BackToIndex />
      <header className="vp-page-header" id="overview">
        <h1><Icon name="triangle" size={23} />{page.title}</h1>
        <p>{page.description}</p>
      </header>

      <MarkdownBlocks blocks={page.blocks} />
    </DocsShell>
  );
}

function Footer({ docs = false }: { docs?: boolean }) {
  return (
    <footer className={`VPFooter ${docs ? "docs" : ""}`}>
      <p>Released under an open documentation spirit.</p>
      <p className="copyright">© 2026 PadhLo. This site does not host any files.</p>
    </footer>
  );
}

export default function App() {
  const [route, setRoute] = useState<string | null>(() => getRoute());
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("padhlo-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute());
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("padhlo-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", searchOpen || menuOpen);
  }, [searchOpen, menuOpen]);

  const navigate = (nextRoute: string) => {
    setSearchOpen(false);
    const [path, anchor] = nextRoute.split("#");
    window.location.hash = `#${path}`;
    if (anchor) {
      window.setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  };

  const topic = route?.startsWith("/topic/")
    ? topics.find((item) => item.slug === route.replace("/topic/", ""))
    : undefined;

  const page = !topic && route ? pages.find((item) => `/${item.slug}` === route) : undefined;

  return (
    <div className="VPApp">
      <Header
        theme={theme}
        setTheme={setTheme}
        openSearch={() => setSearchOpen(true)}
        openMenu={() => setMenuOpen(true)}
      />
      <MobileMenu open={menuOpen} close={() => setMenuOpen(false)} />
      <SearchModal open={searchOpen} close={() => setSearchOpen(false)} navigate={navigate} />

      {topic ? (
        <TopicPage topic={topic} />
      ) : page ? (
        <MarkdownPage page={page} />
      ) : (
        <HomePage navigate={navigate} openSearch={() => setSearchOpen(true)} />
      )}
      <Footer docs={Boolean(topic || page)} />
    </div>
  );
}
