export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const contentRow = rows[1];

  const img = imageRow.querySelector('img');
  const posterSrc = img ? img.src : '';

  block.textContent = '';

  // Video background
  const videoBg = document.createElement('div');
  videoBg.className = 'hero-bg';

  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  if (posterSrc) video.poster = posterSrc;

  const source = document.createElement('source');
  source.src = 'https://www.theglen.com/wp-content/uploads/sites/1022/2025/08/13/WGI16x9_2.mp4';
  source.type = 'video/mp4';
  video.appendChild(source);

  videoBg.appendChild(video);
  block.appendChild(videoBg);

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';
  block.appendChild(overlay);

  // Content
  const content = document.createElement('div');
  content.className = 'hero-content';

  const contentCell = contentRow.querySelector('div') || contentRow;

  const heading = contentCell.querySelector('h1, h2, h3');
  if (heading) content.appendChild(heading);

  const paragraphs = [...contentCell.querySelectorAll('p')];
  paragraphs.forEach((p) => {
    if (p.querySelector('a')) return; // skip button paragraphs
    if (p.textContent.trim()) {
      p.className = 'hero-subtitle';
      content.appendChild(p);
    }
  });

  // CTA buttons - detect ak.js classes
  const ctaDiv = document.createElement('div');
  ctaDiv.className = 'hero-cta';

  const allLinks = [...contentCell.querySelectorAll('a')];
  allLinks.forEach((link) => {
    const isNegative = link.classList.contains('btn-negative');
    link.className = ''; // Reset all classes

    if (isNegative) {
      link.classList.add('btn', 'btn-primary');
    } else {
      link.classList.add('btn', 'btn-secondary');
    }
    ctaDiv.appendChild(link);
  });

  content.appendChild(ctaDiv);
  block.appendChild(content);

  // Scroll arrow
  const scrollArrow = document.createElement('div');
  scrollArrow.className = 'hero-scroll-arrow';
  scrollArrow.innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32"><path d="M7 10l5 5 5-5" stroke="white" stroke-width="2" fill="none"/></svg>';
  block.appendChild(scrollArrow);
}
