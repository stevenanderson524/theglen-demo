# TODO — theglen-demo

Priority-ordered remaining work to match [theglen.com](https://www.theglen.com) as closely as possible. Ordered for fastest path to a demo-ready, DA-authored site.

**Current branch state (as of last update):**
- `main` rebased onto remote `28f186a`; 6 prior local commits replayed cleanly
- Hero video using DM OpenAPI direct MP4 URL
- Uncommitted WIP in working tree: header sub-nav accessibility/responsive polish + chat icon asset staged

---

## ✅ Completed

- [x] Nav dropdown auto-opening on load fixed
- [x] My Account nav alignment
- [x] Fragment injection fixed (DOMParser, body-only)
- [x] Hospitality card blank white bottoms fixed
- [x] All 30 images localized from theglen.com → `content/media/`
- [x] Favicon swapped to WGI
- [x] Hero video using DM OpenAPI direct MP4 URL (`/original/as/Hero-Video.mp4`)
- [x] **Hero-event block refactor** — Adobe Assets video source resolution, static poster image support, URL normalization (6 local commits, now on main)
- [x] **Header sub-nav block** — initial implementation committed (`bfcc1fa`)

---

## 🚧 In Progress (uncommitted WIP)

### Header sub-nav polish
**Files modified:** `blocks/header/header.css`, `blocks/header/header.js`, `content/nav.plain.html`  
**What's in the diff:**
- Skip link for keyboard accessibility (first tab stop, matches live theglen.com)
- iOS safe-area-inset-top handling for notch/home indicator
- Horizontal scroll behavior for narrow phones (<600px)
- `flex-wrap` + space-evenly for desktop (≥900px)
- `--header-layout-break: 900px` CSS var (sync with JS matchMedia)

**Next:** Commit when polish is verified on preview.

### Chat bubble icon (untracked)
**New file:** `icons/chat.svg`  
**Status:** Asset staged but not yet wired into `blocks/header/header.js`. See TODO item #4 below.

### Local hero video fallback (untracked)
**New file:** `content/media/wgi-hero-16x9.mp4`  
**Status:** Backup copy. Not referenced by `index.plain.html` (which uses the DM URL). Decide whether to commit as fallback or delete.

---

## 🔥 Active Priority Queue

### 1. Hospitality "LEARN MORE" buttons rendering as blank white rectangles
**Tool:** Cursor Agent  
**Files:** `blocks/cards-venues/cards-venues.css`, possibly `blocks/cards-venues/cards-venues.js`  
**Why first:** Visible bug on current demo. Kill it before adding anything new.

### 2. Newsletter section
**Tool:** DA MCP (content) + Cursor Agent (form styling)  
**Files:** Homepage doc in DA, new/updated section block

Changes:
- [ ] Replace "Sign Up" link with actual form fields: First Name, Last Name, Email, reCAPTCHA, red Sign Up button
- [ ] Background: full-bleed aerial drone photo (not dark navy + panorama)

### 3. Footer rebuild (biggest visual win remaining)
**Tool:** DA MCP (content) + Cursor Agent (styling)  
**Files:** Footer fragment in DA, `blocks/footer/footer.css`

Changes:
- [ ] Social media icons — circular icon buttons (Facebook, X, Instagram) instead of plain text
- [ ] App Store + Google Play download buttons
- [ ] NASCAR network legal strip: Copyright, Do Not Sell, Privacy Policy, AdChoices, Manage Cookies, Accessibility, Careers
- [ ] NASCAR network links: NASCAR Kids, NASCAR Latino, NASCAR Tracks App, Official Travel Packages, Shop
- [ ] Logo position moved to bottom of footer (currently top)

### 4. Header right-side icons
**Tool:** Cursor Agent  
**Files:** `blocks/header/header.js`, `blocks/header/header.css`  
**Assets:** `icons/chat.svg` already staged; need barcode/ticket + user profile icons

Currently: BUY TICKETS button + My Account text only.  
Add: chat bubble icon, barcode/ticket icon, user profile icon (to the left of BUY TICKETS).

### 5. Finish sub-nav polish and commit WIP
**Tool:** Cursor Agent  
Verify the uncommitted header/nav changes on preview, then commit. May happen in parallel with #4.

### 6. GoBowling / NASCAR Kids ad banner
**Tool:** DA MCP (content) + Cursor Agent (styling if needed)  
**Location:** Between "Track History" and "Fan Hospitality" sections on homepage.

### 7. Columns-icons bar — add actual icons
**Tool:** DA MCP (icon references) + Cursor Agent (rendering)  
**Files:** `blocks/columns-icons/*`  
Currently text-only labels; theglen.com has icons above each label.

### 8. Sponsor carousel partner label
**Tool:** Cursor Agent (CSS)  
Partner name currently renders as gray overlay box. Should be a clean label below the image, or hidden entirely.

### 9. Hero rotating carousel
**Tool:** Cursor Agent (new block or extend existing) + DA MCP (slide content)  
**Why last:** Most involved. Currently static image + video. Build new `carousel` or extend `hero-event` / use existing `carousel-gallery` block to cycle multiple slides.

---

## 📝 Notes

- After every DA MCP content write, **preview in DA.live UI** before moving on (not just `.aem.page`).
- After every code push, hard-refresh `.aem.page` to verify cache invalidation.
- Target Lighthouse score: 100.
- `content/media/wgi-hero-16x9.mp4` is a local fallback; the authored hero video uses DM OpenAPI URL.
