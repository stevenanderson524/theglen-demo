export default async function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    // cells[0] = icon cell (contains span.icon)
    // cells[1] = label cell (contains p > a)

    const iconCell = cells[0];
    const labelCell = cells[1];

    // Extract the icon element (move, not clone - so loadIcons can still find it)
    const icon = iconCell?.querySelector('.icon') || iconCell?.querySelector('svg') || iconCell?.querySelector('img');
    // Extract the link
    const link = labelCell?.querySelector('a');

    if (!link) return;

    // Build the card: wrap everything in the anchor
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.title = link.textContent.trim();
    anchor.setAttribute('aria-label', link.textContent.trim());
    if (link.target) anchor.target = link.target;

    // Icon wrapper
    const iconDiv = document.createElement('div');
    iconDiv.className = 'event-bar-icon';
    if (icon) iconDiv.appendChild(icon); // move, not clone
    anchor.appendChild(iconDiv);

    // Label wrapper
    const labelDiv = document.createElement('div');
    labelDiv.className = 'event-bar-label';
    labelDiv.textContent = link.textContent.trim();
    anchor.appendChild(labelDiv);

    // Replace row contents with the single anchor
    row.textContent = '';
    row.appendChild(anchor);
  });
}
