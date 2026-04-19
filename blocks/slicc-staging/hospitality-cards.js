export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row is the heading row
  const headingRow = rows[0];
  headingRow.classList.add('hospitality-heading');

  // Remaining rows are card rows — build a grid
  const grid = document.createElement('div');
  grid.classList.add('hospitality-grid');

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.classList.add('hospitality-card');

    // Cell 0: image
    if (cells[0]) {
      const imgWrap = document.createElement('div');
      imgWrap.classList.add('hospitality-card-image');
      imgWrap.innerHTML = cells[0].innerHTML;
      card.appendChild(imgWrap);
    }

    // Cell 1: text content (title, description, CTA)
    if (cells[1]) {
      const content = document.createElement('div');
      content.classList.add('hospitality-card-content');
      
      // Move all children
      while (cells[1].firstChild) {
        content.appendChild(cells[1].firstChild);
      }
      
      // Style the CTA link
      const links = content.querySelectorAll('a');
      links.forEach((link) => {
        link.classList.remove('button');
        link.classList.add('btn', 'btn-primary');
      });
      
      card.appendChild(content);
    }

    grid.appendChild(card);
    row.remove();
  });

  block.appendChild(grid);
  
  // Add section-level dark class to parent
  const section = block.closest('.section') || block.closest('main > div') || block.parentElement;
  if (section) {
    section.classList.add('dark-section');
  }
}
