/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-icons
 * Source: https://www.theglen.com/
 * Base block: columns
 * Row of 6 icon links for quick navigation.
 *
 * Columns block structure (from library):
 * Row 1: Block name
 * Subsequent rows: N cells per row (one per column)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each icon-item becomes a column cell
  const iconItems = element.querySelectorAll('.icon-item');
  if (iconItems.length > 0) {
    const row = [];
    iconItems.forEach((item) => {
      const cell = [];
      const link = item.querySelector('a');
      const iconText = item.querySelector('.icon-text');

      if (link && iconText) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = iconText.textContent.trim();
        cell.push(a);
      }

      row.push(cell);
    });
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-icons',
    cells,
  });

  element.replaceWith(block);
}
