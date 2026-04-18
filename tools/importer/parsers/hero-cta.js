/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-cta
 * Source: https://www.theglen.com/
 * Base block: hero
 * Newsletter signup CTA with background image, heading, subtitle, and sign-up link.
 * Source DOM: .ndms-newsletter_widget with img, .ndms-nw-heading, .ndms-nw-subheading
 *
 * Hero block: Row 1 = block name, Row 2 = background image, Row 3 = text content
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image
  const bgImg = element.querySelector(':scope > img');
  if (bgImg) {
    cells.push([bgImg.cloneNode(true)]);
  } else {
    cells.push(['']);
  }

  // Row 2: Text content
  const contentCell = [];

  const heading = element.querySelector('.ndms-nw-heading');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }

  const subheading = element.querySelector('.ndms-nw-subheading');
  if (subheading) {
    const p = document.createElement('p');
    p.textContent = subheading.textContent.trim();
    contentCell.push(p);
  }

  // Sign up CTA
  const signUpP = document.createElement('p');
  const signUpLink = document.createElement('a');
  signUpLink.href = '#newsletter-signup';
  signUpLink.textContent = 'Sign Up';
  signUpP.append(signUpLink);
  contentCell.push(signUpP);

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-cta',
    cells,
  });

  element.replaceWith(block);
}
