export default async function decorate(block) {
  // Fetch nav content — try /drafts/nav first (for drafts pages), then /nav
  const navPath = '/drafts/nav';
  let resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) {
    resp = await fetch('/nav.plain.html');
  }
  if (!resp.ok) return;

  const html = await resp.text();
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Parse sections (each <div> is a section)
  const sections = [...temp.children];
  const logoSection = sections[0];
  const mainNavSection = sections[1];
  const utilSection = sections[2];
  const secNavSection = sections[3];

  // Clear block
  block.textContent = '';

  // === Top bar ===
  const topBar = document.createElement('div');
  topBar.className = 'header-top';

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.className = 'header-logo';
  if (logoSection) {
    const logoLink = logoSection.querySelector('a');
    const logoImg = logoSection.querySelector('img');
    if (logoLink) {
      const a = document.createElement('a');
      a.href = logoLink.href || '/';
      if (logoImg) {
        const img = document.createElement('img');
        img.src = logoImg.src;
        img.alt = logoImg.alt || 'Watkins Glen International';
        img.loading = 'eager';
        a.appendChild(img);
      } else {
        a.textContent = 'Watkins Glen International';
      }
      logoDiv.appendChild(a);
    }
  }
  topBar.appendChild(logoDiv);

  // Main nav
  const mainNav = document.createElement('nav');
  mainNav.className = 'header-nav';
  if (mainNavSection) {
    const links = mainNavSection.querySelectorAll('a');
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      mainNav.appendChild(a);
    });
  }
  topBar.appendChild(mainNav);

  // Utility links (right side)
  const utilDiv = document.createElement('div');
  utilDiv.className = 'header-util';
  if (utilSection) {
    const links = utilSection.querySelectorAll('a');
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      a.className = 'util-link';
      utilDiv.appendChild(a);
    });
  }
  topBar.appendChild(utilDiv);

  // Hamburger button (mobile)
  const hamburger = document.createElement('button');
  hamburger.className = 'header-hamburger';
  hamburger.setAttribute('aria-label', 'Toggle menu');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  hamburger.addEventListener('click', () => {
    block.classList.toggle('nav-open');
  });
  topBar.appendChild(hamburger);

  block.appendChild(topBar);

  // === Secondary nav bar ===
  if (secNavSection) {
    const secBar = document.createElement('div');
    secBar.className = 'header-secondary';
    const secNav = document.createElement('nav');
    secNav.className = 'secondary-nav';
    const links = secNavSection.querySelectorAll('a');
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      secNav.appendChild(a);
    });
    secBar.appendChild(secNav);
    block.appendChild(secBar);
  }
}
