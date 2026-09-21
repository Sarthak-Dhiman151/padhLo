# PadhLo

A curated, open wiki of trusted educational resources for Indian students -- covering entrance exams, school boards, college admissions, research tools, online courses, career prep, and more.

**Site**: [padhlo](https://github.com/Sarthak-Dhiman151/padhLo) | **Contribute**: [Guidelines](#contributing)

> This site does not host any files. It is a directory of links to official portals, open-access platforms, and free educational material.

---

## Index

### [Entrance Exams](src/content/topics/entrance-exams.md)

JEE Main, JEE Advanced, NEET UG, CUET, CLAT, CAT, GATE, UPSC, NDA, NID, NIFT, and more. Official portals, syllabus bulletins, past-year papers, counselling hubs.

---

### [School Resources](src/content/topics/school-resources.md)

CBSE, ICSE, and state board material for Classes 9-12. NCERT textbooks, sample papers, marking schemes.

---

### [College Resources](src/content/topics/college-resources.md)

University regulators (UGC, AICTE, NAAC), credit frameworks, branch-specific material, campus utilities.

---

### [Research Sources](src/content/topics/research-sources.md)

Thesis archives, open-access journals, public datasets, citation managers, and academic writing tools.

---

### [Online Courses](src/content/topics/online-courses.md)

NPTEL, SWAYAM, MIT OCW, and other national MOOC platforms. University-level courseware and certifications.

---

### [AI Resources](src/content/topics/ai-resources.md)

AI/ML courses, free GPU compute, open-weight model hubs, prompt engineering references.

---

### [Developer Learning](src/content/topics/developer-learning.md)

CS roadmaps, DSA practice sheets, system design primers, deployment and DevOps guides.

---

### [Professional Resources](src/content/topics/professional-resources.md)

Apprenticeship portals, resume builders, placement prep, government job boards, interview guides.

---

### [Book Resources](src/content/topics/book-resources.md)

Digital libraries, open-access textbooks, national digital library portals, and reading archives.

---

### [Miscellaneous](src/content/topics/miscellaneous.md)

Scholarships, DigiLocker, student discounts, mental health helplines, and other student utilities.

---

## How It Works

PadhLo is a single-page React application. All content is authored in Markdown files under `src/content/` and compiled at build time via Vite. There is no backend or database.

```
src/
  content/
    topics/       # One .md file per wiki section (entrance-exams, school-resources, ...)
    pages/        # Static pages (guide, contribute)
  App.tsx         # Router, layout, search, rendering
  index.css       # Full design system
```

Each Markdown file has YAML frontmatter (`title`, `tagline`, `icon`, `keywords`) followed by standard Markdown with headings, lists, and callout blocks.

## Development

Prerequisites: Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

## Contributing

Contributions are welcome. Read the full [Contributing guidelines](src/content/pages/contribute.md) on the site.

**Quick summary:**

- **Add a resource** -- Open a GitHub Issue with the resource name, URL, category, and a short description. Verify it is official or legally free.
- **Edit directly** -- Fork the repo, edit the relevant `.md` file in `src/content/topics/`, and submit a Pull Request.
- **Report a dead link** -- Open an Issue with the broken URL and which page it appears on.

**We accept:** Official government portals, open-access learning platforms, free courseware, public datasets.

**We reject:** Affiliate/referral links, pirated content, unvetted Telegram/WhatsApp groups, phishing sites, ad-heavy scraper blogs.

## License

Released under an open documentation spirit. See the site footer for details.
