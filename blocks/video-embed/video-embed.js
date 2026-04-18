/**
 * Video embed — single authored URL (e.g. pasted in DA as a link to an MP4/WebM).
 * Block name in document: "Video embed" → class video-embed
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  let url = link ? link.getAttribute('href').trim() : '';
  if (!url) {
    url = block.textContent.trim();
  }
  if (!url || !/^https?:\/\//i.test(url)) {
    return;
  }

  const video = document.createElement('video');
  video.className = 'video-embed-player';
  video.setAttribute('controls', '');
  video.setAttribute('playsinline', '');
  video.preload = 'metadata';
  video.src = url;

  const label = (link && link.textContent.trim()) || 'Video';
  video.setAttribute('aria-label', label);

  block.replaceChildren(video);
}
