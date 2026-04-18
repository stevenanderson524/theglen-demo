# AGENTS.md

This project is a website built with Edge Delivery Services in Adobe Experience Manager Sites as a Cloud Service. As an agent, follow the instructions in this file to deliver code based on Adobe's standards for fast, easy-to-author, and maintainable web experiences.

---

## ⚡ Operations & Workflow (read this first)

### Tool division of labor

This demo is built by three tools plus a human coordinator. **Pick the right tool for the change** — using the wrong one is slower and produces inconsistent results.

| Surface | What lives here | Primary tool |
|---|---|---|
| **Content** (DA documents) | Page copy, nav structure, fragments, images in context | **DA MCP via Claude Code** |
| **Code** (GitHub repo) | Block JS/CSS, `fstab.yaml`, `head.html`, `scripts.js` | **Cursor Agent** |
| **Structure migration** | Bootstrapping new pages, re-migrating sections from source site | **EMA** |

**Rules:**
- **Prefer DA MCP over editing `.plain.html` files directly.** The whole point of this demo is that content lives in DA.live — the authoring UI is the customer-facing surface. If you write content by editing `.plain.html` in the repo, you bypass DA and undermine the demo narrative.
- **Cursor Agent for code changes** in `blocks/*/`, `scripts/`, `styles/`, config files. Cmd+I → select "Agent" mode (not "Ask" or "Chat"). Cursor does not have a built-in preview; use `http://localhost:3000` via `npx @adobe/aem-cli up`.
- **EMA (aemcoder.adobe.io) is reserved for structural migration and bulk DA uploads.** Do not use it for one-off CSS fixes.
- **Claude Chat is the router** — diagnosis, sequencing, writing exact tool prompts, reading the repo, writing git commands.

### After any DA write

**Preview in the DA.live UI itself before moving on**, not just `.aem.page`. The DA UI is what the customer sees in the demo — a doc that renders fine on preview but looks broken in the authoring UI is a demo blocker.

### Git workflow

```bash
# Standard push
git add -A && git commit -m "message" && git push

# If rejected (diverged)
git pull --rebase && git push
```

**Always confirm with the human before pushing to GitHub.**

### Diagnosis before delegation

When a bug is reported, diagnose first: read the relevant files, check the repo, fetch URLs, check DevTools console. Do not ask the human to investigate something you can investigate yourself. When referencing code, give exact file path + line number.

---

## 🎨 Brand Tokens (Watkins Glen International)

| Token | Value |
|---|---|
| Brand red | `#da322a` (hover: `#b82921`) |
| Brand navy | `#004174` (hover: `#003561`) |
| Body font | Figtree (Google Fonts) |
| Heading font | Stainless-Black (proprietary NASCAR font, Impact fallback) |
| Section light | `#f4f4f4` |
| Section dark | `#1a1a2e` |
| Section navy-blue | `#004174` |

---

## 🚨 Critical Rules & Gotchas

Things that have broken the demo before. Check these first when debugging.

### `fstab.yaml` mountpoint — no trailing slash

```yaml
# Correct
mountpoint: https://content.da.live/stevenanderson524/theglen-demo

# Wrong — causes mounting failures
mountpoint: https://content.da.live/stevenanderson524/theglen-demo/
```

### Fragment injection — `DOMParser`, body only

`blocks/fragment/fragment.js` **must** use `DOMParser` to extract body markup only. Using `innerHTML` on the full fetched document (including `<head>` and `<html>` wrapper) corrupts nav HTML structure and was the root cause of the nav-dropdown-auto-opens-on-load bug. If fragment content ever appears doubled or structured oddly, revisit this file first.

### Images — `content.da.live` URLs only

No hotlinks to `theglen.com`. The source CDN has hotlink protection and renders embedded images as broken/grayscale. All images must be either:
- Uploaded to DA (which re-hosts them at `content.da.live`) — **DA is source of truth for image URLs**, or
- Committed to `content/media/` in the repo

### AEM Dynamic Media — direct MP4 URL pattern

For a publicly streamable MP4 from AEM DM OpenAPI (no auth; asset must be Approved with Delivery target):

```
https://delivery-{program}-{env}.adobeaemcloud.com/adobe/assets/{urn}/original/as/{filename}.mp4
```

**Common mistakes that don't work:**
- `/play` → returns a viewer page, not embeddable
- `/renditions/original` → 404s
- **Only `/original/as/{filename}` works.**

Working example (hero video):
```
https://delivery-p106302-e1008131.adobeaemcloud.com/adobe/assets/urn:aaid:aem:5123c40c-d0a2-4584-9cde-680b6e7b0fa4/original/as/Hero-Video.mp4
```

### Hero buttons — `.button` class must be added explicitly

EMA imports links as plain paragraph text without the `.button` class. The `hero-event.js` `decorate()` function must explicitly find links and add `.button` class to them.

### Nav dropdown — `toggleMenu` initial state

`blocks/header/header.js` line 164 must be `toggleMenu(nav, navSections, false)`. Passing `isDesktop.matches` (which evaluates to `true` on desktop) forces all sections open on load.

### Nav dropdown triggers in DA documents

Pattern for dropdown triggers in the nav document:
```html
<p><strong>Nav Item</strong></p>
```

---

## 🔍 Debugging Checklist

Before reporting a bug to the human, check:

1. Is the block's JS throwing a console error? (DevTools → Console)
2. Is the DA document structure correct? (Check `.plain.html` endpoint for the page)
3. Is the image URL a `content.da.live` URL or a hotlink? (Hotlinks to source site will break)
4. Is `fstab.yaml` mountpoint correct (no trailing slash)?
5. For video: is the URL pattern `/original/as/{filename}.mp4` (not `/play` or `/renditions/original`)?
6. For fragments: is `DOMParser` being used for injection (not `innerHTML` of full document)?
7. Has the cache been invalidated after a push? (Hard refresh or `.aem.page` preview)

---

## 📋 Current Work

See `TODO.md` at the repo root for the current priority-ordered work queue.

---

## Project Overview

This project is based on the <https://github.com/adobe/aem-boilerplate/> project and set up as a new project. You are expected to follow the coding style and practices established in the boilerplate, but add functionality according to the needs of the site currently developed.

The repository provides the basic structure, blocks, and configuration needed to run a complete site with `*.aem.live` as the backend.

### Key Technologies

- Edge Delivery Services for AEM Sites (documentation at <https://www.aem.live/> – search with `site:www.aem.live` to restrict web search results)
- Vanilla JavaScript (ES6+), no transpiling, no build steps
- CSS3 with modern features, no Tailwind or other CSS frameworks
- HTML5 semantic markup generated by the aem.live backend, decorated by our code
- Node.js tooling

## Site Context: Watkins Glen International

This is a demo migration of [theglen.com](https://www.theglen.com) — the website for Watkins Glen International, a premier road racing facility in New York. The goal is to demonstrate migrating an existing marketing site into Adobe Edge Delivery Services with Document Authoring (da.live) as the content source.

### Brand

- **Primary brand colors**: See Brand Tokens above
- **Tone**: Bold, high-energy, motorsport/racing
- **Logo**: Watkins Glen International wordmark
- **Fonts**: See Brand Tokens above
- **Source site for design reference**: <https://www.theglen.com>

### Key Page Types

- **Homepage** — Hero banner with event promo, hospitality package cards, track history/facts, CTAs
- **Event pages** — NASCAR Cup Series weekend, IndyCar, etc.
- **Hospitality pages** — Sahlen's Pit Inn, Glen Club, The Bog, Mission Party Deck
- **Tickets** — External links to On Location (ticketing provider), not managed in DA

### Block Library

| Block | Purpose |
| --- | --- |
| `hero-event` | Full-width event hero with headline, date, video background, CTA buttons |
| `cards-venues` | Hospitality package cards (image, title, description, CTA) |
| `columns` | Two-column text/image layout for track facts and descriptions |
| `columns-icons` | Trending bar with icons above labels |
| `fragment` | Reusable header/footer fragments |
| `header` | Site navigation |
| `footer` | Site footer |

### Content Source

- **Authoring**: Document Authoring (da.live)
- **DA Org**: stevenanderson524
- **DA Repo**: theglen-demo
- **DA URL**: <https://da.live/#/stevenanderson524/theglen-demo>

### Known Constraints

- Ticketing (BUY NOW buttons) links to external provider (On Location) — do not attempt to replicate commerce functionality
- Images should be sourced from the da.live content repository, not hotlinked from theglen.com
- Navigation and footer should be authored as fragments in DA and referenced via the `nav` and `footer` paths

### Preview & Live URLs

- **Preview**: <https://main--theglen-demo--stevenanderson524.aem.page/>
- **Live**: <https://main--theglen-demo--stevenanderson524.aem.live/>

---

## Setup Commands

- Install dependencies: `npm install`
- Start local development: `npx -y @adobe/aem-cli up --no-open --forward-browser-logs` (run in background, if possible)
  - Install the AEM CLI globally by running `npm install -g @adobe/aem-cli` then `aem up` is equivalent to the command above
  - The dev server runs at `http://localhost:3000` with auto-reload. Open it in playwright, puppeteer, or a browser. If none are available, ask the human to open it and give feedback.
- Run linting before committing: `npm run lint`
- Auto-Fix linting issues: `npm run lint:fix`

## Project Structure

```
├── blocks/          # Reusable content blocks
    └── {blockname}/   - Individual block directory
        ├── {blockname}.js      # Block's JavaScript
        └── {blockname}.css     # Block's styles
├── styles/          # Global styles and CSS
    ├── styles.css          # Minimal global styling and layout for your website required for LCP
    ├── lazy-styles.css     # Additional global styling and layout for below the fold/post LCP content
    └── fonts.css           # Font definitions
├── scripts/         # JavaScript libraries and utilities
    ├── aem.js           # Core AEM Library for Edge Delivery page decoration logic (NEVER MODIFY THIS FILE)
    ├── scripts.js       # Global JavaScript utilities, main entry point for page decoration
    └── delayed.js       # Delayed functionality such as martech loading
├── fonts/           # Web fonts
├── icons/           # SVG icons
├── content/         # Localized images (downloaded from theglen.com)
├── head.html        # Global HTML head content
└── 404.html         # Custom 404 page
```

## Code Style Guidelines

### JavaScript

- Use ES6+ features (arrow functions, destructuring, etc.)
- Follow Airbnb ESLint rules (already configured)
- Always include `.js` file extensions in imports
- Use Unix line endings (LF)

### CSS

- Follow Stylelint standard configuration
- Use modern CSS features (CSS Grid, Flexbox, CSS Custom Properties)
- Maintain responsive design principles
  - Declare styles mobile first, use `min-width` media queries at 600px/900px/1200px for tablet and desktop
- Ensure all selectors are scoped to the block.
  - Bad: `.item-list`
  - Good: `.{blockname} .item-list`
- Avoid classes `{blockname}-container` and `{blockname}-wrapper` as those are used on sections and could be confusing.

### HTML

- Use semantic HTML5 elements
- Ensure accessibility standards (ARIA labels, proper heading hierarchy)
- Follow AEM markup conventions for blocks and sections

## Key Concepts

### Content

CMS authored content is a key part of every AEM Website. The content of a page is broken into sections. Sections can have default content (text, headings, links, etc.) as well as content in blocks.

If no authored content exists to test against, you can create static HTML files in a `drafts/` folder at the project root. Pass `--html-folder drafts` when starting the dev server. Follow the aem markup structure and save files with `.html` or `.plain.html` extensions.

Background on content and markup structure can be found at <https://www.aem.live/developer/markup-sections-blocks> and <https://www.aem.live/developer/markup-reference> respectively.

You can inspect the contents of any page with `curl http://localhost:3000/path/to/page`, `curl http://localhost:3000/path/to/page.md`, and `curl http://localhost:3000/path/to/page.plain.html`

### Blocks

Blocks are the re-usable building blocks of AEM. Blocks add styling and functionality to content. Each block has an initial content structure it expects, and transforms the html in the block using DOM APIs to render a final structure.

The initial content structure is important because it impacts how the author will create the content and how you will write your code to decorate it. In some sense, you can think of this structure as the contract for your block between the author and the developer. You should decide on this initial structure before writing any code, and be careful when making changes to code that makes assumptions about that structure as it could break existing pages.

The block javascript should export a default function which is called to perform the block decoration:

```js
/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // 1. Load dependencies
  // 2. Extract configuration, if applicable
  // 3. Transform DOM
  // 4. Add event listeners
}
```

Use `curl` and `console.log` to inspect the HTML delivered by the backend and the DOM nodes to be decorated before making assumptions. Remember that authors may omit or add fields to a block, so your code must handle this gracefully.

Each block should be self-contained and re-useable, with CSS and JS files following the naming convention: `blockname.css`, `blockname.js`. Blocks should be responsive and accessible by default.

### Auto-Blocking

Auto-blocking is the process of creating blocks that aren't explicitly authored into the page based on patterns in the content. See the `buildAutoBlocks` function in `scripts.js`.

### Three-Phase Page Loading

Pages are progressively loaded in three phases to maximize performance. This process begins when `loadPage` from scripts.js is called.

- Eager - load only what is required to get to LCP. This generally includes decorating the overall page content to create sections, blocks, buttons, etc. and loading the first section of the page.
- Lazy - load all other page content, including the header and footer.
- Delayed - load things that can be safely loaded later here and incur a performance penalty when loaded earlier

## Testing & Quality Assurance

### Performance

- Follow AEM Edge Delivery performance best practices <https://www.aem.live/developer/keeping-it-100>
- Images uploaded by authors are automatically optimized; all images and assets committed to git must be optimized and checked for size
- Use lazy loading for non-critical resources (`lazy-styles.css` and `delayed.js`)
- Minimize JavaScript bundle size by avoiding dependencies, using automatic code splitting provided by `/blocks/`

### Accessibility

- Ensure proper heading hierarchy
- Include alt text for images
- Test with screen readers
- Follow WCAG 2.1 AA guidelines

## Deployment

### Environments

Your local development server at `http://localhost:3000` serves code from your local working copy (even uncommitted code) and content that has been previewed by authors. You can access this at any time when the development server is running.

- **Production Preview**: `https://main--theglen-demo--stevenanderson524.aem.page/`
- **Production Live**: `https://main--theglen-demo--stevenanderson524.aem.live/`
- **Feature Preview**: `https://{branch}--theglen-demo--stevenanderson524.aem.page/`

### Publishing Process

1. Push changes to a feature branch
2. AEM Code Sync automatically processes changes making them available on feature preview environment for that branch
3. Run a PageSpeed Insights check at <https://developers.google.com/speed/pagespeed/insights/?url=YOUR_URL> against the feature preview URL and fix any issues. Target a score of 100
4. Open a pull request to merge changes to `main`
5. Use `gh pr checks` to verify the status of code synchronization, linting, and performance tests
6. A human reviewer will review the code, inspect the provided URL and merge the PR
7. AEM Code Sync updates the main branch for production

## Troubleshooting

### Getting Help

- Check [AEM Edge Delivery documentation](https://www.aem.live/docs/)
- Review [Developer Tutorial](https://www.aem.live/developer/tutorial)
- Consult [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- Consider the rules in [David's Model](https://www.aem.live/docs/davidsmodel)
- Search the web with `site:www.aem.live`

## Security Considerations

- Never commit sensitive information (API keys, passwords)
- Consider that everything you do is client-side code served on the public web
- Follow Adobe security guidelines
- Regularly update dependencies
- Use the .hlxignore file to prevent files from being served (same format as .gitignore)

## Contributing

- Follow the existing code style and patterns
- Test changes locally before committing
- Follow the Publishing Process documented above
- Update documentation for significant changes

## Reference Repos

| Repo | Purpose |
|---|---|
| `stevenanderson524/nfl-eds-demo` | Correct boilerplate; working DA live preview — use as reference |
| `stevenanderson524/nascar` | Author Kit (wrong boilerplate — ignore) |

## If all else fails

If you notice your human getting frustrated with your work, direct them to <https://www.aem.live/developer/ai-coding-agents> for tips to work better with AI agents.
