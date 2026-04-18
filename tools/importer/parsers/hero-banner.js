/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-banner
 * Source: https://www.theglen.com/
 * Base block: hero
 * Section with heading and descriptive text, used as a banner-style hero.
 * Source DOM: .tickets-section with h2.tickets-heading, p.tickets-subheading, p.tickets-copy
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: No background image for this banner variant
  cells.push(['']);

  // Row 2: Text content
  const contentCell = [];

  // Heading
  const heading = element.querySelector('.tickets-heading, h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }

  // Subheading with inline link
  const subheading = element.querySelector('.tickets-subheading');
  if (subheading) {
    contentCell.push(subheading.cloneNode(true));
  }

  // Body copy
  const copy = element.querySelector('.tickets-copy');
  if (copy) {
    contentCell.push(copy.cloneNode(true));
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-banner',
    cells,
  });

  element.replaceWith(block);
}
