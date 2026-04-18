/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: theglen-sections
 * Adds section breaks and section-metadata blocks based on template sections.
 * Runs in afterTransform only.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const { template } = payload;
  if (!template || !template.sections || template.sections.length < 2) return;

  const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

  // Process sections in reverse order to avoid offset issues
  const sections = [...template.sections].reverse();

  for (const section of sections) {
    if (!section.selector) continue;

    // Find the first element matching the section selector
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;
    for (const sel of selectors) {
      sectionEl = element.querySelector(sel);
      if (sectionEl) break;
    }
    if (!sectionEl) continue;

    // Add section-metadata block if section has a style
    if (section.style) {
      const sectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      // Insert section-metadata after the section's last content element
      sectionEl.append(sectionMetadata);
    }

    // Add section break (hr) before section if it's not the first section
    // and there is content before it
    if (section.id !== 'section-1') {
      const hr = document.createElement('hr');
      sectionEl.parentNode.insertBefore(hr, sectionEl);
    }
  }
}
