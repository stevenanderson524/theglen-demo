/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-gallery
 * Source: https://www.theglen.com/
 * Base block: carousel
 * Sponsor/partner logo carousel. Source DOM: .image-slider-carousel with .slick-slide items.
 * Skips .slick-cloned duplicates.
 *
 * Carousel block: Row 1 = block name, subsequent rows = [Image | Text/Link]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get only non-cloned slides to avoid duplicates
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned)');
  const seen = new Set();

  slides.forEach((slide) => {
    const link = slide.querySelector('a');
    const img = slide.querySelector('img');
    const titleSpan = slide.querySelector('.image-slider-item-title');

    if (!link || !titleSpan) return;

    // Deduplicate by title text
    const titleText = titleSpan.textContent.trim();
    if (seen.has(titleText)) return;
    seen.add(titleText);

    // Column 1: Image
    const imgCell = img ? img.cloneNode(true) : '';

    // Column 2: Link with sponsor name
    const a = document.createElement('a');
    a.href = link.href;
    a.title = link.title || '';
    a.textContent = titleText;

    cells.push([imgCell, a]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-gallery',
    cells,
  });

  element.replaceWith(block);
}
