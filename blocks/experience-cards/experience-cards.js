export default async function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];

    if (cells.length >= 5) {
      // 5-cell structure: image, title, label, description, cta
      const imageCell = cells[0];
      const titleCell = cells[1];
      const labelCell = cells[2];
      const descCell = cells[3];
      const ctaCell = cells[4];

      imageCell.classList.add('experience-cards-image');

      const content = document.createElement('div');
      content.classList.add('experience-cards-content');

      const title = titleCell.querySelector('h2, h3, h4');
      if (title) content.appendChild(title);

      const labelText = labelCell.textContent.trim();
      if (labelText) {
        const label = document.createElement('span');
        label.className = 'card-label';
        label.textContent = labelText;
        content.appendChild(label);
      }

      const descPs = [...descCell.querySelectorAll('p')];
      descPs.forEach((p) => content.appendChild(p));

      // CTAs - detect ak.js classes
      const ctaContainer = document.createElement('div');
      ctaContainer.className = 'experience-cards-cta';

      const allLinks = [...ctaCell.querySelectorAll('a')];
      allLinks.forEach((link) => {
        const isNegative = link.classList.contains('btn-negative');
        link.classList.remove('button', 'btn-negative', 'btn-primary', 'btn-secondary', 'accent');

        if (isNegative) {
          link.classList.add('btn', 'cta-buy');
        } else {
          link.classList.add('btn', 'cta-secondary');
        }
        ctaContainer.appendChild(link);
      });

      const buyBtns = ctaContainer.querySelectorAll('.cta-buy');
      const secBtns = ctaContainer.querySelectorAll('.cta-secondary');
      ctaContainer.textContent = '';
      buyBtns.forEach((b) => ctaContainer.appendChild(b));
      if (secBtns.length > 0) {
        const ctaRow = document.createElement('div');
        ctaRow.className = 'cta-row';
        secBtns.forEach((b) => ctaRow.appendChild(b));
        ctaContainer.appendChild(ctaRow);
      }

      content.appendChild(ctaContainer);
      titleCell.remove();
      labelCell.remove();
      descCell.remove();
      ctaCell.remove();
      row.appendChild(content);
    } else if (cells.length >= 2) {
      cells[0].classList.add('experience-cards-image');
      cells[1].classList.add('experience-cards-content');
    }
  });
}
