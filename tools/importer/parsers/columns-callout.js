/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-callout
 * Source: https://www.theglen.com/
 * Base block: columns
 * Single text+image callout panel. Parser receives each .callout-container individually.
 * Source DOM: .callout-container > .callout-container-inner > .callout-content + .callout-image
 *
 * Columns block: Row 1 = block name, Row 2+ = [Col1 | Col2]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Text column
  const textCell = [];

  // Header (title)
  const header = element.querySelector('.callout-header');
  if (header) {
    const headerLink = header.closest('a');
    const h3 = document.createElement('h3');
    if (headerLink) {
      const a = document.createElement('a');
      a.href = headerLink.href;
      a.textContent = header.textContent.trim();
      h3.append(a);
    } else {
      h3.textContent = header.textContent.trim();
    }
    textCell.push(h3);
  }

  // Sub-header
  const subHeader = element.querySelector('.callout-sub-header');
  if (subHeader) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = subHeader.textContent.trim();
    p.append(strong);
    textCell.push(p);
  }

  // Text header (italic tagline)
  const textHeader = element.querySelector('.callout-text-header');
  if (textHeader) {
    const p = document.createElement('p');
    const em = document.createElement('em');
    em.textContent = textHeader.textContent.trim();
    p.append(em);
    textCell.push(p);
  }

  // Subtext (description) — get first meaningful text
  const subtext = element.querySelector('.callout-subtext');
  if (subtext) {
    // Clone and clean the subtext: remove nested non-content divs
    const clone = subtext.cloneNode(true);
    // Remove junk divs (tailwind classes etc)
    clone.querySelectorAll('div[class*="text-base"], div[class*="thread-content"]').forEach((d) => d.remove());
    clone.querySelectorAll('div.z-0').forEach((d) => d.remove());

    // Get remaining text content as paragraph
    const textNodes = [];
    clone.childNodes.forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        textNodes.push(node.textContent.trim());
      }
    });
    if (textNodes.length > 0) {
      const p = document.createElement('p');
      p.textContent = textNodes.join(' ');
      textCell.push(p);
    }

    // Extract list if present
    const list = clone.querySelector('ul');
    if (list) {
      const strongP = document.createElement('p');
      strongP.textContent = 'Includes:';
      textCell.push(strongP);
      textCell.push(list.cloneNode(true));
    }
  }

  // CTA button — look for .tickets-btn or button.primary-btn inside an <a>
  const ticketsBtn = element.querySelector('a.tickets-btn');
  const primaryBtn = element.querySelector('a:has(button.primary-btn), a[title="LEARN MORE"], a[title="BUY NOW"]');
  const ctaLink = ticketsBtn || primaryBtn;
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    p.append(a);
    textCell.push(p);
  }

  // Image column
  const img = element.querySelector('.callout-image img');
  const imgCell = img ? img.cloneNode(true) : '';

  cells.push([textCell, imgCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-callout',
    cells,
  });

  element.replaceWith(block);
}
