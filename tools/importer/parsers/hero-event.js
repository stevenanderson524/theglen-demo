/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-event
 * Source: https://www.theglen.com/
 * Base block: hero
 * Full-width hero with video background, heading, subtitle, and CTA buttons.
 *
 * Hero block structure (from library):
 * Row 1: Block name
 * Row 2: Background image (optional)
 * Row 3: Heading + subheading + CTAs
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image — use video poster or first available image
  const heroImg = element.querySelector('.main-hero img.lazy, .main-hero picture img');
  if (heroImg) {
    cells.push([heroImg.cloneNode(true)]);
  } else {
    // No image — video-only hero, use empty row
    cells.push(['']);
  }

  // Row 2: Text content — heading + subtitle + CTA buttons
  const contentCell = [];

  // Heading
  const heading = element.querySelector('.main-hero-textbox h2, .main-hero-textbox h1');
  if (heading) contentCell.push(heading.cloneNode(true));

  // Subtitle / hero copy
  const heroCopy = element.querySelector('.hero-copy');
  if (heroCopy) {
    const p = document.createElement('p');
    p.textContent = heroCopy.textContent.trim();
    contentCell.push(p);
  }

  // CTA buttons
  const buttons = element.querySelectorAll('.main-hero-button a');
  buttons.forEach((btn) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = btn.href;
    a.textContent = btn.textContent.trim();
    p.append(a);
    contentCell.push(p);
  });

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-event',
    cells,
  });

  element.replaceWith(block);
}
