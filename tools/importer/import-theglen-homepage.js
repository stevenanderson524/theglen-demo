/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroEventParser from './parsers/hero-event.js';
import columnsIconsParser from './parsers/columns-icons.js';
import cardsTicketsParser from './parsers/cards-tickets.js';
import heroBannerParser from './parsers/hero-banner.js';
import columnsCalloutParser from './parsers/columns-callout.js';
import cardsVenuesParser from './parsers/cards-venues.js';
import carouselGalleryParser from './parsers/carousel-gallery.js';
import heroCtaParser from './parsers/hero-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/theglen-cleanup.js';
import sectionsTransformer from './transformers/theglen-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-event': heroEventParser,
  'columns-icons': columnsIconsParser,
  'cards-tickets': cardsTicketsParser,
  'hero-banner': heroBannerParser,
  'columns-callout': columnsCalloutParser,
  'cards-venues': cardsVenuesParser,
  'carousel-gallery': carouselGalleryParser,
  'hero-cta': heroCtaParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'theglen-homepage',
  description: 'Watkins Glen International homepage with hero, ticket cards, event callouts, venue highlights, sponsor carousel, and newsletter signup',
  urls: ['https://www.theglen.com/'],
  blocks: [
    { name: 'hero-event', instances: ['#pg-2-0 .main-hero'] },
    { name: 'columns-icons', instances: ['.icon-container'] },
    { name: 'cards-tickets', instances: ['#pg-2-3 .ticket-cards-container', '#pg-2-5 .ticket-cards-container'] },
    { name: 'hero-banner', instances: ['#pg-2-4 .tickets-section'] },
    { name: 'columns-callout', instances: ['.callout-container'] },
    { name: 'cards-venues', instances: ['#pg-2-9 .card-container'] },
    { name: 'carousel-gallery', instances: ['.image-slider-carousel'] },
    { name: 'hero-cta', instances: ['.ndms-newsletter_widget'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '#pg-2-0', style: null, blocks: ['hero-event'], defaultContent: [] },
    { id: 'section-2', name: 'Quick Links', selector: '#pg-2-1', style: 'light', blocks: ['columns-icons'], defaultContent: [] },
    { id: 'section-3', name: 'NASCAR Intro', selector: '#pg-2-2', style: 'light', blocks: [], defaultContent: ['.tickets-section'] },
    { id: 'section-4', name: 'NASCAR Tickets', selector: '#pg-2-3', style: 'light', blocks: ['cards-tickets'], defaultContent: [] },
    { id: 'section-5', name: 'IMSA Banner', selector: '#pg-2-4', style: 'dark', blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-6', name: 'IMSA Tickets', selector: '#pg-2-5', style: 'light', blocks: ['cards-tickets'], defaultContent: [] },
    { id: 'section-7', name: 'Callout Panels', selector: '#pg-2-6', style: 'light', blocks: ['columns-callout'], defaultContent: [] },
    { id: 'section-8', name: 'Fan Hospitality', selector: '#pg-2-9', style: 'navy-blue', blocks: ['cards-venues'], defaultContent: [] },
    { id: 'section-9', name: 'Sponsors', selector: '#pg-2-10', style: null, blocks: ['carousel-gallery'], defaultContent: [] },
    { id: 'section-10', name: 'Newsletter CTA', selector: '#pg-2-11', style: 'dark', blocks: ['hero-cta'], defaultContent: [] },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
