![PadhLo](public/banner.png)

# PadhLo

A curated, open wiki of trusted educational resources for Indian students -- covering entrance exams, school boards, college admissions, research tools, online courses, career prep, and more.

**Site**: [padhlo](https://github.com/Sarthak-Dhiman151/padhLo) | **Contribute**: [Guidelines](#contributing)

> This site does not host any files. It is a directory of links to official portals, open-access platforms, and free educational material.


## How It Works

PadhLo is a single-page React application. All content is authored in Markdown files under `docs/` at the project root and compiled at build time via Vite. There is no backend or database.

```
docs/
  topics/       # One .md file per wiki section (entrance-exams, school-resources, ...)
  pages/        # Static pages (guide, CONTRIBUTING)
src/
  content/      # Markdown loader (index.ts, markdown.tsx, types.ts)
  App.tsx       # Router, layout, search, rendering
  index.css     # Full design system
```

Each Markdown file has YAML frontmatter (`title`, `tagline`, `icon`, `keywords`) followed by standard Markdown with headings, lists, and callout blocks.


## Contributing

Contributions are welcome. Read the full [Contributing guidelines](docs/pages/CONTRIBUTING.md) on the site.

**Quick summary:**

- **Add a resource** -- Open a GitHub Issue with the resource name, URL, category, and a short description. Verify it is official or legally free.
- **Edit directly** -- Fork the repo, edit the relevant `.md` file in `src/content/topics/`, and submit a Pull Request.
- **Report a dead link** -- Open an Issue with the broken URL and which page it appears on.

**We accept:** Official government portals, open-access learning platforms, free courseware, public datasets, free resources, software.

**We reject:** Affiliate/referral links, unvetted WhatsApp groups, phishing sites, ad-heavy scraper blogs.

## License

Released under an open documentation spirit. See the site footer for details.
