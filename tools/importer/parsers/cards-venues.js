/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-venues
 * Source: https://www.theglen.com/
 * Base block: cards
 * Venue cards with background images, names, descriptions, and LEARN MORE links.
 * Source DOM: .card-container with article.card elements
 *
 * Cards block: Row 1 = block name, subsequent rows = [Image | Text content]
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('article.card:not(.ad-container)');
  cards.forEach((card) => {
    // Column 1: Image
    const img = card.querySelector('img');
    const imgCell = img ? img.cloneNode(true) : '';

    // Column 2: Text content
    const textCell = [];

    const title = card.querySelector('.card-title');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.push(h3);
    }

    const description = card.querySelector('.card-description');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }

    const cta = card.querySelector('.card-cta a');
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      p.append(a);
      textCell.push(p);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-venues',
    cells,
  });

  element.replaceWith(block);
}
