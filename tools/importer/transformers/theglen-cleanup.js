/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: theglen-cleanup
 * Site-wide DOM cleanup for theglen.com
 * Removes non-authorable content (header, footer, ads, cookie banners, widgets)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent and overlays that may block parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
      '#lightboxjs-lightboxlib',
      '.globalSkinAdSlot',
    ]);

    // Remove ad containers
    WebImporter.DOMUtils.remove(element, [
      '.nascar-ad-container',
      '[id*="google_ads_iframe"]',
      '.nascar-advertisement',
    ]);

    // Remove chat widget
    WebImporter.DOMUtils.remove(element, [
      '.satisfi_prompt',
      '.satisfi_chat-button',
      '#satisfi_chat-label',
      '[class*="satisfi"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site shell
    WebImporter.DOMUtils.remove(element, [
      'header#masthead',
      'footer',
      '.skip-link',
      '#site-navigation',
      '.trending-nav-container',
      'nav.main-navigation',
    ]);

    // Remove iframes, scripts, noscript
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'source',
    ]);

    // Remove toggle-details buttons (site-specific interactive elements)
    WebImporter.DOMUtils.remove(element, [
      '.toggle-details',
      '.main-hero-scroll-more',
    ]);

    // Remove ad slot containers that may remain
    WebImporter.DOMUtils.remove(element, [
      '.ad-container',
      '[class*="nascarad"]',
    ]);

    // Clean up empty divs from removed content
    element.querySelectorAll('div:empty').forEach((div) => {
      if (!div.id && !div.className) div.remove();
    });
  }
}
