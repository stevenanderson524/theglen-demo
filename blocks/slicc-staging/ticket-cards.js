export default async function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const imageCell = cells[0];
    const contentCell = cells[1];

    imageCell.classList.add('ticket-cards-image');
    contentCell.classList.add('ticket-cards-content');

    // Process CTAs — ak.js already converts <del><a> to a.btn-negative
    // and <strong><a> to a.btn-primary. We remap these to our system.
    const allLinks = [...contentCell.querySelectorAll('a')];
    const ctaContainer = document.createElement('div');
    ctaContainer.classList.add('ticket-cards-cta');

    allLinks.forEach((link) => {
      // Detect the ak.js-applied classes
      const isNegative = link.classList.contains('btn-negative'); // was <del> = red CTA
      const isPrimary = link.classList.contains('btn-primary'); // was <strong> = secondary CTA

      // Remove all ak.js classes
      link.classList.remove('button', 'btn-negative', 'btn-primary', 'btn-secondary', 'accent');

      // Apply our classes: negative (del) = red, everything else = navy
      if (isNegative) {
        link.classList.add('btn', 'cta-buy');
      } else {
        link.classList.add('btn', 'cta-secondary');
      }

      // Remove the button wrapper paragraph
      const wrapper = link.closest('p') || link.closest('.button-container');
      if (wrapper && contentCell.contains(wrapper)) {
        wrapper.before(link);
        if (!wrapper.querySelector('a')) wrapper.remove();
      }

      ctaContainer.appendChild(link);
    });

    // Separate: buy button on top, secondaries in a row below
    const buyBtns = ctaContainer.querySelectorAll('.cta-buy');
    const secBtns = ctaContainer.querySelectorAll('.cta-secondary');

    ctaContainer.textContent = '';
    buyBtns.forEach((b) => ctaContainer.appendChild(b));

    if (secBtns.length > 0) {
      const row2 = document.createElement('div');
      row2.className = 'cta-row';
      secBtns.forEach((b) => row2.appendChild(b));
      ctaContainer.appendChild(row2);
    }

    contentCell.appendChild(ctaContainer);
  });
}
