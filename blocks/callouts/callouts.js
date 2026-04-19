export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];

    cells.forEach((cell) => {
      const pic = cell.querySelector('picture, img');
      const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');

      if (pic && !heading) {
        cell.classList.add('callout-image');
      } else if (heading || cell.querySelector('p')) {
        cell.classList.add('callout-text');

        // Process CTA buttons - detect ak.js classes
        const links = [...cell.querySelectorAll('a')];
        links.forEach((link) => {
          const isNegative = link.classList.contains('btn-negative');
          link.classList.remove('button', 'btn-negative', 'btn-primary', 'btn-secondary', 'accent');

          if (isNegative) {
            link.classList.add('btn', 'cta-buy');
          } else {
            link.classList.add('btn', 'cta-secondary');
          }

          // Unwrap from container paragraph if needed
          const wrapper = link.closest('p');
          if (wrapper && cell.contains(wrapper) && wrapper.querySelectorAll('a').length === 1) {
            wrapper.before(link);
            wrapper.remove();
          }
        });
      }
    });
  });
}
