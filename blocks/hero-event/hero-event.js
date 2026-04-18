/**
 * Hero background — first row:
 * - picture / img (unchanged)
 * - direct MP4/WebM: `https://…` **or** site path `/content/media/….mp4` (same-origin file in Git / CDN)
 * - Adobe `…/adobe/assets/…/play` → static poster from asset base URL (not OpenAPI—browser cannot call APIs with secrets).
 * - **OpenAPI** does not replace a video `src`; use a build/proxy that turns a URN into a short-lived HTTPS URL, then paste that URL here.
 */
const VIDEO_EXT = /\.(mp4|webm)(\?|#|$)/i;

/** Same-origin paths need optional Helix code base (non-root mounts). */
function resolveVideoSrc(pathOrUrl) {
  const u = pathOrUrl.trim();
  if (/^https?:\/\//i.test(u)) return u;
  const base = (window.hlx?.codeBasePath ?? '').replace(/\/$/, '');
  if (u.startsWith('/')) return `${base}${u}`;
  if (u.startsWith('./')) return `${base}/${u.slice(2)}`;
  return `${base}/${u}`;
}

function normalizeText(t) {
  return (t || '').replace(/[\u200b-\u200d\ufeff]/g, '').replace(/\s+/g, ' ').trim();
}

/** Absolute https(s) or same-origin path starting with `/` or `./` / `../` ending in .mp4/.webm */
function isVideoUrl(url) {
  if (typeof url !== 'string' || !VIDEO_EXT.test(url)) return false;
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return true;
  if (u.startsWith('/')) return true;
  if (u.startsWith('./') || u.startsWith('../')) return true;
  return false;
}

/** Adobe “Universal” player page — not a file URL; use base asset URL as poster image instead. */
function isAdobeAssetPlayerUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!/^https?:\/\//i.test(u)) return false;
  if (!/adobeaemcloud\.com/i.test(u)) return false;
  if (!/\/adobe\/assets\//i.test(u)) return false;
  return /\/play(?:\?|#|$)/i.test(u);
}

/** Base delivery URL (strip `/play`) — often returns a raster preview suitable as hero poster. */
function adobePlayUrlToPosterBase(url) {
  return url.trim().replace(/\/play(?:\?[^#]*)?(#.*)?$/i, '');
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
  const re = /https?:\/\/[^\s<>"']+\.(?:mp4|webm)(?:[^\s<>"']*)?|(?:\.\.\/|\.\/|\/)[^\s<>"']*\.(?:mp4|webm)(?:[^\s<>"']*)?/i;
  const m = norm.match(re);
  return m && isVideoUrl(m[0]) ? m[0].trim() : '';
}

/**
 * @returns {{ kind: 'video', url?: string, el?: HTMLVideoElement }
 *  | { kind: 'adobePoster', url: string }
 *  | null}
 */
function resolveBackgroundMedia(bgRoot) {
  const existing = bgRoot.querySelector('video');
  if (existing) {
    return { kind: 'video', el: existing };
  }

  const links = [...bgRoot.querySelectorAll('a[href]')];
  const hrefs = links.map((a) => (a.getAttribute('href') || '').trim()).filter(Boolean);
  const mp4Link = hrefs.find(isVideoUrl);
  if (mp4Link) return { kind: 'video', url: mp4Link };
  const adobePlay = hrefs.find(isAdobeAssetPlayerUrl);
  if (adobePlay) return { kind: 'adobePoster', url: adobePlay };

  const raw = bgRoot.textContent;
  const vid = findVideoUrlInText(raw);
  if (vid) return { kind: 'video', url: vid };
  const adobe = findAdobePlayerUrlInText(raw);
  if (adobe) return { kind: 'adobePoster', url: adobe };

  return null;
}

function mountPosterImage(row1, src) {
  const img = document.createElement('img');
  img.className = 'hero-event-bg-poster';
  img.src = resolveVideoSrc(src);
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.decoding = 'async';
  img.fetchPriority = 'high';
  row1.replaceChildren(img);
  return img;
}

function mountVideo(row1, url) {
  const video = document.createElement('video');
  video.className = 'hero-event-bg-video';
  video.src = resolveVideoSrc(url);
  video.setAttribute('preload', 'auto');
  video.setAttribute('muted', '');
  row1.replaceChildren(video);
  return video;
}

function configureNativeVideo(video, block) {
  video.classList.add('hero-event-bg-video');
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.setAttribute('aria-hidden', 'true');
  video.removeAttribute('controls');
  video.addEventListener('error', () => {
    video.classList.add('hero-event-video-error');
    block.classList.add('no-image');
  });
}

function attachReducedMotion(block, mediaEl, isVideo) {
  if (!isVideo) return;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onlyMotionBg = () => !block.querySelector(':scope > div:first-child picture')
    && !block.querySelector(':scope > div:first-child img');

  const sync = () => {
    const motionOnly = onlyMotionBg();
    if (mq.matches) {
      mediaEl.pause?.();
      mediaEl.removeAttribute?.('autoplay');
      mediaEl.style.display = 'none';
      if (motionOnly) block.classList.add('no-image');
    } else {
      mediaEl.style.display = '';
      mediaEl.setAttribute('autoplay', '');
      if (motionOnly) block.classList.remove('no-image');
      mediaEl.play?.().catch(() => {});
    }
  };
  sync();
  mq.addEventListener('change', sync);
}

/** First row: picture/img, <video>, MP4/WebM URL, or Adobe …/play (poster image fallback). */
function setupBackgroundMedia(block, row1) {
  const resolved = resolveBackgroundMedia(row1);
  if (!resolved) return false;

  if (resolved.kind === 'video' && resolved.el) {
    row1.replaceChildren(resolved.el);
    configureNativeVideo(resolved.el, block);
    attachReducedMotion(block, resolved.el, true);
  } else if (resolved.kind === 'video' && resolved.url) {
    const video = mountVideo(row1, resolved.url);
    configureNativeVideo(video, block);
    attachReducedMotion(block, video, true);
  } else if (resolved.kind === 'adobePoster') {
    const base = adobePlayUrlToPosterBase(resolved.url);
    mountPosterImage(row1, base);
  } else {
    return false;
  }

  block.classList.add('hero-event-has-video');
  return true;
}

export default function decorate(block) {
  const row1 = block.querySelector(':scope > div:first-child');
  const hasPicture = !!row1?.querySelector('picture');
  const hasImg = !!row1?.querySelector('img');
  const hasMotionBg = row1 && setupBackgroundMedia(block, row1);

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
