export default function decorate(block) {
  // Add no-image class if no picture element
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Find all links in the content div and style as buttons
  const contentDiv = block.querySelector(':scope > div:nth-child(2)');
  if (contentDiv) {
    const links = contentDiv.querySelectorAll('a');
    links.forEach((link, index) => {
      link.classList.add('button');
      if (index === 0) {
        link.classList.add('secondary'); // BUY NOW — white outlined
      } else if (index === 1) {
        link.classList.add('primary'); // LEARN MORE — red filled
      }
    });
  }
}