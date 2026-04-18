/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-tickets
 * Source: https://www.theglen.com/
 * Base block: cards
 * Ticket option cards with image, title, subtitle, description, and CTA buttons.
 *
 * Cards block structure (from library):
 * Row 1: Block name
 * Subsequent rows: [Image | Text content (heading + description + CTAs)]
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('.ticket-option-card');
  cards.forEach((card) => {
    // Column 1: Image
    const img = card.querySelector('.ticket-media img');
    const imgCell = img ? img.cloneNode(true) : '';

    // Column 2: Text content
    const textCell = [];

    // Title
    const title = card.querySelector('.ticket-title');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.push(h3);
    }

    // Subtitle (e.g. FULL WEEKEND)
    const priceLabel = card.querySelector('.ticket-price-label');
    if (priceLabel) {
      const p = document.createElement('p');
      p.textContent = priceLabel.textContent.trim();
      textCell.push(p);
    }

    // Description paragraphs
    const descPs = card.querySelectorAll('.ticket-description p');
    descPs.forEach((dp) => {
      textCell.push(dp.cloneNode(true));
    });

    // CTA buttons
    const ctas = card.querySelectorAll('.ticket-cta-button');
    ctas.forEach((cta) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      a.title = cta.title || '';
      p.append(a);
      textCell.push(p);
    });

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-tickets',
    cells,
  });

  element.replaceWith(block);
}
