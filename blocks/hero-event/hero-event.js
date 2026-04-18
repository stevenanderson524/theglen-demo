/**
 * Hero background: first row = image (picture/img), direct MP4/WebM URL, or Adobe AEM Assets
 * `/adobe/assets/.../play` URL (Dynamic Media player page — embedded as iframe, not <video>).
 * Use absolute https URLs (DAM / CDN); EDS typically does not host large video binaries in Git.
 */
const VIDEO_EXT = /\.(mp4|webm)(\?|#|$)/i;

function normalizeText(t) {
  return (t || '').replace(/[\u200b-\u200d\ufeff]/g, '').replace(/\s+/g, ' ').trim();
}

function isVideoUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url) && VIDEO_EXT.test(url);
}

/** Adobe delivery “player” page (not a raw file); must use iframe. */
function isAdobeAssetPlayerUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!/^https?:\/\//i.test(u)) return false;
  if (!/adobeaemcloud\.com/i.test(u)) return false;
  if (!/\/adobe\/assets\//i.test(u)) return false;
  return /\/play(?:\?|#|$)/i.test(u);
}

function findAdobePlayerUrlInText(text) {
  const norm = normalizeText(text);
  if (isAdobeAssetPlayerUrl(norm)) return norm;
  const re = /https:\/\/[^\s<>"']*adobeaemcloud\.com\/adobe\/assets\/[^\s<>"']*\/play(?:[^\s<>"']*)?/i;
  const m = norm.match(re);
  return m && isAdobeAssetPlayerUrl(m[0]) ? m[0].trim() : '';
}

function findVideoUrlInText(text) {
  const norm = normalizeText(text);
  if (isVideoUrl(norm)) return norm;
  const re = /https?:\/\/[^\s<>"']+\.(?:mp4|webm)(?:[^\s<>"']*)?/i;
  const m = norm.match(re);
  return m && isVideoUrl(m[0]) ? m[0].trim() : '';
}

/**
 * @returns {{ kind: 'video', url?: string, el?: HTMLVideoElement } | { kind: 'iframe', url: string } | null}
 */
function resolveBackgroundMedia(bgRoot) {
  const existing = bgRoot.querySelector('video');
  if (existing) {
    return { kind: 'video', el: existing };
  }

  const links = [...bgRoot.querySelectorAll('a[href]')];
  const hrefs = links.map((a) => (a.getAttribute('href') || '').trim()).filter(Boolean);
  const adobeLink = hrefs.find(isAdobeAssetPlayerUrl);
  if (adobeLink) return { kind: 'iframe', url: adobeLink };
  const mp4Link = hrefs.find(isVideoUrl);
  if (mp4Link) return { kind: 'video', url: mp4Link };

  const raw = bgRoot.textContent;
  const adobe = findAdobePlayerUrlInText(raw);
  if (adobe) return { kind: 'iframe', url: adobe };
  const vid = findVideoUrlInText(raw);
  if (vid) return { kind: 'video', url: vid };

  return null;
}

function mountIframe(bgRoot, url) {
  const iframe = document.createElement('iframe');
  iframe.className = 'hero-event-bg-embed';
  iframe.src = url;
  iframe.setAttribute('title', 'Hero background video');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture');
  iframe.setAttribute('loading', 'eager');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  bgRoot.replaceChildren(iframe);
  return iframe;
}

function mountVideo(bgRoot, url) {
  const video = document.createElement('video');
  video.className = 'hero-event-bg-video';
  video.src = url;
  bgRoot.replaceChildren(video);
  return video;
}

function configureNativeVideo(video) {
  video.classList.add('hero-event-bg-video');
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.removeAttribute('controls');
}

function attachReducedMotion(block, mediaEl, isIframe) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onlyMotionBg = () => !block.querySelector(':scope > div:first-child picture')
    && !block.querySelector(':scope > div:first-child img');

  const sync = () => {
    const motionOnly = onlyMotionBg();
    if (mq.matches) {
      if (!isIframe) {
        mediaEl.pause?.();
        mediaEl.removeAttribute?.('autoplay');
      }
      mediaEl.style.display = 'none';
      if (motionOnly) block.classList.add('no-image');
    } else {
      mediaEl.style.display = '';
      if (!isIframe) {
        mediaEl.setAttribute('autoplay', '');
        mediaEl.play?.().catch(() => {});
      }
      if (motionOnly) block.classList.remove('no-image');
    }
  };
  sync();
  mq.addEventListener('change', sync);
}

/** First row: picture/img, <video>, MP4/WebM URL, or Adobe Assets …/play URL. */
function setupBackgroundMedia(block, bgRoot) {
  const resolved = resolveBackgroundMedia(bgRoot);
  if (!resolved) return false;

  let mediaEl;
  let isIframe = false;

  if (resolved.kind === 'video' && resolved.el) {
    mediaEl = resolved.el;
    bgRoot.replaceChildren(mediaEl);
    configureNativeVideo(mediaEl);
    attachReducedMotion(block, mediaEl, false);
  } else if (resolved.kind === 'iframe') {
    mediaEl = mountIframe(bgRoot, resolved.url);
    isIframe = true;
    attachReducedMotion(block, mediaEl, true);
  } else if (resolved.kind === 'video' && resolved.url) {
    mediaEl = mountVideo(bgRoot, resolved.url);
    configureNativeVideo(mediaEl);
    attachReducedMotion(block, mediaEl, false);
  } else {
    return false;
  }

  block.classList.add('hero-event-has-video');
  return true;
}

export default function decorate(block) {
  const bgRoot = block.querySelector(':scope > div:first-child > div') || block.querySelector(':scope > div:first-child');
  const hasPicture = !!block.querySelector(':scope > div:first-child picture');
  const hasImg = !!block.querySelector(':scope > div:first-child img');
  const hasMotionBg = bgRoot && setupBackgroundMedia(block, bgRoot);

  if (!hasPicture && !hasImg && !hasMotionBg) {
    block.classList.add('no-image');
  }

  const contentRows = [...block.querySelectorAll(':scope > div')].slice(1);
  const links = contentRows.flatMap((row) => [...row.querySelectorAll('a')]);
  links.forEach((link, index) => {
    link.classList.add('button');
    if (index === 0) {
      link.classList.add('secondary');
    } else if (index === 1) {
      link.classList.add('primary');
    }
  });
}
