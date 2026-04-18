var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-theglen-homepage.js
  var import_theglen_homepage_exports = {};
  __export(import_theglen_homepage_exports, {
    default: () => import_theglen_homepage_default
  });

  // tools/importer/parsers/hero-event.js
  function parse(element, { document }) {
    const cells = [];
    const heroImg = element.querySelector(".main-hero img.lazy, .main-hero picture img");
    if (heroImg) {
      cells.push([heroImg.cloneNode(true)]);
    } else {
      cells.push([""]);
    }
    const contentCell = [];
    const heading = element.querySelector(".main-hero-textbox h2, .main-hero-textbox h1");
    if (heading) contentCell.push(heading.cloneNode(true));
    const heroCopy = element.querySelector(".hero-copy");
    if (heroCopy) {
      const p = document.createElement("p");
      p.textContent = heroCopy.textContent.trim();
      contentCell.push(p);
    }
    const buttons = element.querySelectorAll(".main-hero-button a");
    buttons.forEach((btn) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = btn.href;
      a.textContent = btn.textContent.trim();
      p.append(a);
      contentCell.push(p);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-event",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-icons.js
  function parse2(element, { document }) {
    const cells = [];
    const iconItems = element.querySelectorAll(".icon-item");
    if (iconItems.length > 0) {
      const row = [];
      iconItems.forEach((item) => {
        const cell = [];
        const link = item.querySelector("a");
        const iconText = item.querySelector(".icon-text");
        if (link && iconText) {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = iconText.textContent.trim();
          cell.push(a);
        }
        row.push(cell);
      });
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-icons",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tickets.js
  function parse3(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".ticket-option-card");
    cards.forEach((card) => {
      const img = card.querySelector(".ticket-media img");
      const imgCell = img ? img.cloneNode(true) : "";
      const textCell = [];
      const title = card.querySelector(".ticket-title");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      const priceLabel = card.querySelector(".ticket-price-label");
      if (priceLabel) {
        const p = document.createElement("p");
        p.textContent = priceLabel.textContent.trim();
        textCell.push(p);
      }
      const descPs = card.querySelectorAll(".ticket-description p");
      descPs.forEach((dp) => {
        textCell.push(dp.cloneNode(true));
      });
      const ctas = card.querySelectorAll(".ticket-cta-button");
      ctas.forEach((cta) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        a.title = cta.title || "";
        p.append(a);
        textCell.push(p);
      });
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-tickets",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse4(element, { document }) {
    const cells = [];
    cells.push([""]);
    const contentCell = [];
    const heading = element.querySelector(".tickets-heading, h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    }
    const subheading = element.querySelector(".tickets-subheading");
    if (subheading) {
      contentCell.push(subheading.cloneNode(true));
    }
    const copy = element.querySelector(".tickets-copy");
    if (copy) {
      contentCell.push(copy.cloneNode(true));
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-banner",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-callout.js
  function parse5(element, { document }) {
    const cells = [];
    const textCell = [];
    const header = element.querySelector(".callout-header");
    if (header) {
      const headerLink = header.closest("a");
      const h3 = document.createElement("h3");
      if (headerLink) {
        const a = document.createElement("a");
        a.href = headerLink.href;
        a.textContent = header.textContent.trim();
        h3.append(a);
      } else {
        h3.textContent = header.textContent.trim();
      }
      textCell.push(h3);
    }
    const subHeader = element.querySelector(".callout-sub-header");
    if (subHeader) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = subHeader.textContent.trim();
      p.append(strong);
      textCell.push(p);
    }
    const textHeader = element.querySelector(".callout-text-header");
    if (textHeader) {
      const p = document.createElement("p");
      const em = document.createElement("em");
      em.textContent = textHeader.textContent.trim();
      p.append(em);
      textCell.push(p);
    }
    const subtext = element.querySelector(".callout-subtext");
    if (subtext) {
      const clone = subtext.cloneNode(true);
      clone.querySelectorAll('div[class*="text-base"], div[class*="thread-content"]').forEach((d) => d.remove());
      clone.querySelectorAll("div.z-0").forEach((d) => d.remove());
      const textNodes = [];
      clone.childNodes.forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          textNodes.push(node.textContent.trim());
        }
      });
      if (textNodes.length > 0) {
        const p = document.createElement("p");
        p.textContent = textNodes.join(" ");
        textCell.push(p);
      }
      const list = clone.querySelector("ul");
      if (list) {
        const strongP = document.createElement("p");
        strongP.textContent = "Includes:";
        textCell.push(strongP);
        textCell.push(list.cloneNode(true));
      }
    }
    const ticketsBtn = element.querySelector("a.tickets-btn");
    const primaryBtn = element.querySelector('a:has(button.primary-btn), a[title="LEARN MORE"], a[title="BUY NOW"]');
    const ctaLink = ticketsBtn || primaryBtn;
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      p.append(a);
      textCell.push(p);
    }
    const img = element.querySelector(".callout-image img");
    const imgCell = img ? img.cloneNode(true) : "";
    cells.push([textCell, imgCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-callout",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-venues.js
  function parse6(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll("article.card:not(.ad-container)");
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const imgCell = img ? img.cloneNode(true) : "";
      const textCell = [];
      const title = card.querySelector(".card-title");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      const description = card.querySelector(".card-description");
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }
      const cta = card.querySelector(".card-cta a");
      if (cta) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        p.append(a);
        textCell.push(p);
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-venues",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-gallery.js
  function parse7(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned)");
    const seen = /* @__PURE__ */ new Set();
    slides.forEach((slide) => {
      const link = slide.querySelector("a");
      const img = slide.querySelector("img");
      const titleSpan = slide.querySelector(".image-slider-item-title");
      if (!link || !titleSpan) return;
      const titleText = titleSpan.textContent.trim();
      if (seen.has(titleText)) return;
      seen.add(titleText);
      const imgCell = img ? img.cloneNode(true) : "";
      const a = document.createElement("a");
      a.href = link.href;
      a.title = link.title || "";
      a.textContent = titleText;
      cells.push([imgCell, a]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-gallery",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse8(element, { document }) {
    const cells = [];
    const bgImg = element.querySelector(":scope > img");
    if (bgImg) {
      cells.push([bgImg.cloneNode(true)]);
    } else {
      cells.push([""]);
    }
    const contentCell = [];
    const heading = element.querySelector(".ndms-nw-heading");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    }
    const subheading = element.querySelector(".ndms-nw-subheading");
    if (subheading) {
      const p = document.createElement("p");
      p.textContent = subheading.textContent.trim();
      contentCell.push(p);
    }
    const signUpP = document.createElement("p");
    const signUpLink = document.createElement("a");
    signUpLink.href = "#newsletter-signup";
    signUpLink.textContent = "Sign Up";
    signUpP.append(signUpLink);
    contentCell.push(signUpP);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-cta",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/theglen-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter",
        "#lightboxjs-lightboxlib",
        ".globalSkinAdSlot"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".nascar-ad-container",
        '[id*="google_ads_iframe"]',
        ".nascar-advertisement"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".satisfi_prompt",
        ".satisfi_chat-button",
        "#satisfi_chat-label",
        '[class*="satisfi"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#masthead",
        "footer",
        ".skip-link",
        "#site-navigation",
        ".trending-nav-container",
        "nav.main-navigation"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        "source"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".toggle-details",
        ".main-hero-scroll-more"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".ad-container",
        '[class*="nascarad"]'
      ]);
      element.querySelectorAll("div:empty").forEach((div) => {
        if (!div.id && !div.className) div.remove();
      });
    }
  }

  // tools/importer/transformers/theglen-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
    const sections = [...template.sections].reverse();
    for (const section of sections) {
      if (!section.selector) continue;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.append(sectionMetadata);
      }
      if (section.id !== "section-1") {
        const hr = document.createElement("hr");
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }

  // tools/importer/import-theglen-homepage.js
  var parsers = {
    "hero-event": parse,
    "columns-icons": parse2,
    "cards-tickets": parse3,
    "hero-banner": parse4,
    "columns-callout": parse5,
    "cards-venues": parse6,
    "carousel-gallery": parse7,
    "hero-cta": parse8
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "theglen-homepage",
    description: "Watkins Glen International homepage with hero, ticket cards, event callouts, venue highlights, sponsor carousel, and newsletter signup",
    urls: ["https://www.theglen.com/"],
    blocks: [
      { name: "hero-event", instances: ["#pg-2-0 .main-hero"] },
      { name: "columns-icons", instances: [".icon-container"] },
      { name: "cards-tickets", instances: ["#pg-2-3 .ticket-cards-container", "#pg-2-5 .ticket-cards-container"] },
      { name: "hero-banner", instances: ["#pg-2-4 .tickets-section"] },
      { name: "columns-callout", instances: [".callout-container"] },
      { name: "cards-venues", instances: ["#pg-2-9 .card-container"] },
      { name: "carousel-gallery", instances: [".image-slider-carousel"] },
      { name: "hero-cta", instances: [".ndms-newsletter_widget"] }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: "#pg-2-0", style: null, blocks: ["hero-event"], defaultContent: [] },
      { id: "section-2", name: "Quick Links", selector: "#pg-2-1", style: "light", blocks: ["columns-icons"], defaultContent: [] },
      { id: "section-3", name: "NASCAR Intro", selector: "#pg-2-2", style: "light", blocks: [], defaultContent: [".tickets-section"] },
      { id: "section-4", name: "NASCAR Tickets", selector: "#pg-2-3", style: "light", blocks: ["cards-tickets"], defaultContent: [] },
      { id: "section-5", name: "IMSA Banner", selector: "#pg-2-4", style: "dark", blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-6", name: "IMSA Tickets", selector: "#pg-2-5", style: "light", blocks: ["cards-tickets"], defaultContent: [] },
      { id: "section-7", name: "Callout Panels", selector: "#pg-2-6", style: "light", blocks: ["columns-callout"], defaultContent: [] },
      { id: "section-8", name: "Fan Hospitality", selector: "#pg-2-9", style: "navy-blue", blocks: ["cards-venues"], defaultContent: [] },
      { id: "section-9", name: "Sponsors", selector: "#pg-2-10", style: null, blocks: ["carousel-gallery"], defaultContent: [] },
      { id: "section-10", name: "Newsletter CTA", selector: "#pg-2-11", style: "dark", blocks: ["hero-cta"], defaultContent: [] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_theglen_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_theglen_homepage_exports);
})();
