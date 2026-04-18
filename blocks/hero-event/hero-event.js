const VIDEO_EXT = /\.(mp4|webm)(\?|#|$)/i;

function isVideoUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url) && VIDEO_EXT.test(url);
}

/** First URL-shaped MP4/WebM substring in text (DA often pastes plain text, not a link). */
function findVideoUrlInText(root) {
  const text = root.textContent.trim();
  if (isVideoUrl(text)) return text;
  const match = text.match(/https?:\/\/\S+?\.(mp4|webm)(\?[^?\s#]*)?(#[^\s]*)?/i);
  return match ? match[0] : '';
}

/**
 * Hero background: first row may be picture/img, a <video>, a link to MP4/WebM, or plain URL text (DA).
 */
function setupBackgroundVideo(block, bgRoot) {
  let video = bgRoot.querySelector('video');
  const mp4Link = [...bgRoot.querySelectorAll('a[href]')].find((a) => isVideoUrl(a.getAttribute('href')));
  const plainUrl = !video && !mp4Link ? findVideoUrlInText(bgRoot) : '';

  if (!video && mp4Link) {
    video = document.createElement('video');
    video.className = 'hero-event-bg-video';
    video.src = mp4Link.getAttribute('href');
    bgRoot.replaceChildren(video);
  } else if (!video && plainUrl) {
    video = document.createElement('video');
    video.className = 'hero-event-bg-video';
    video.src = plainUrl;
    bgRoot.replaceChildren(video);
  }

  if (!video) return false;

  video.classList.add('hero-event-bg-video');
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.removeAttribute('controls');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const syncMotion = () => {
    const onlyVideo = !block.querySelector(':scope > div:first-child picture')
      && !block.querySelector(':scope > div:first-child img');
    if (prefersReducedMotion.matches) {
      video.pause();
      video.removeAttribute('autoplay');
      video.style.display = 'none';
      if (onlyVideo) block.classList.add('no-image');
    } else {
      video.style.display = '';
      video.setAttribute('autoplay', '');
      if (onlyVideo) block.classList.remove('no-image');
      video.play?.().catch(() => {});
    }
  };
  syncMotion();
  prefersReducedMotion.addEventListener('change', syncMotion);

  block.classList.add('hero-event-has-video');
  return true;
}

export default function decorate(block) {
  const bgRoot = block.querySelector(':scope > div:first-child > div') || block.querySelector(':scope > div:first-child');
  const hasPicture = !!block.querySelector(':scope > div:first-child picture');
  const hasImg = !!block.querySelector(':scope > div:first-child img');
  const hasVideo = bgRoot && setupBackgroundVideo(block, bgRoot);

  if (!hasPicture && !hasImg && !hasVideo) {
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