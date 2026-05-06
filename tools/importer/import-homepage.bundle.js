/* eslint-disable */
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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const heroImage = element.querySelector(".image-container-animated img, #hero-image, .col-lg-6:not(.texture-bg) img");
    const heading = element.querySelector('h1.display-4, h1, .header-text-animated h1, [class*="display"]');
    const subheading = element.querySelector("p.hero_subheading, .header-content p:not(:has(a)), .header-text-animated > p");
    const primaryCta = element.querySelector("a.btn-primary, a#cta-primary, .cta-buttons a:first-child");
    const secondaryCta = element.querySelector("a.btn-secondary, a#cta-secondary, .cta-buttons a:nth-child(2)");
    const textLink = element.querySelector("a.call-to-action, a#cta-link, .cta-buttons p a");
    const cells = [];
    if (heroImage) {
      const imageFragment = document.createDocumentFragment();
      imageFragment.appendChild(document.createComment(" field:image "));
      imageFragment.appendChild(heroImage);
      cells.push([imageFragment]);
    } else {
      cells.push([""]);
    }
    const textFragment = document.createDocumentFragment();
    textFragment.appendChild(document.createComment(" field:text "));
    if (heading) {
      textFragment.appendChild(heading);
    }
    if (subheading) {
      textFragment.appendChild(subheading);
    }
    if (primaryCta) {
      textFragment.appendChild(primaryCta);
    }
    if (secondaryCta) {
      textFragment.appendChild(secondaryCta);
    }
    if (textLink) {
      textFragment.appendChild(textLink);
    }
    cells.push([textFragment]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tags.js
  function parse2(element, { document }) {
    var _a;
    const parentContainer = element.closest(".col-12") || ((_a = element.parentElement) == null ? void 0 : _a.parentElement);
    const tagLinks = parentContainer ? Array.from(parentContainer.querySelectorAll("a.topic-tag")) : [];
    const cells = [];
    tagLinks.forEach((link) => {
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      textFrag.appendChild(link);
      cells.push(["", textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tags", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-events.js
  function parse3(element, { document }) {
    const cardContainers = element.querySelectorAll(":scope > div");
    const cells = [];
    cardContainers.forEach((container) => {
      const li = container.querySelector("li");
      if (!li) return;
      const img = li.querySelector("img");
      const link = li.querySelector("a");
      const dateParagraph = li.querySelector(".calendar-event-tiles__date");
      const titleParagraph = li.querySelector(".hyperlink");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        imageCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (link && dateParagraph && titleParagraph) {
        const heading = document.createElement("p");
        const anchor = document.createElement("a");
        anchor.href = link.href;
        anchor.textContent = titleParagraph.textContent;
        heading.appendChild(anchor);
        const dateEl = document.createElement("p");
        dateEl.textContent = dateParagraph.textContent;
        textCell.appendChild(dateEl);
        textCell.appendChild(heading);
      } else if (link) {
        textCell.appendChild(link);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-events", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icons.js
  function parse4(element, { document }) {
    const iconBlocks = element.querySelectorAll(".icon-block");
    const cells = [];
    iconBlocks.forEach((block2) => {
      const icon = block2.querySelector("img.icon-block__icon");
      const headingLink = block2.querySelector("h3 a, h3.h4-styling a");
      const description = block2.querySelector("p.icon-block__description, .icon-block__description");
      const col1 = document.createDocumentFragment();
      col1.appendChild(document.createComment(" field:image "));
      if (icon) {
        col1.appendChild(icon);
      }
      const col2 = document.createDocumentFragment();
      col2.appendChild(document.createComment(" field:text "));
      if (headingLink) {
        const h3 = document.createElement("h3");
        h3.appendChild(headingLink);
        col2.appendChild(h3);
      }
      if (description) {
        col2.appendChild(description);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icons", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse5(element, { document }) {
    const columns = element.querySelectorAll(':scope > [class*="col-"]');
    const cells = [];
    const row = [];
    columns.forEach((col) => {
      const cellContent = [];
      const featuredTile = col.querySelector(".featured-tile");
      if (featuredTile) {
        const tag = featuredTile.querySelector(".tag span");
        if (tag) {
          const tagP = document.createElement("p");
          tagP.textContent = tag.textContent.trim();
          tagP.setAttribute("class", "tag");
          cellContent.push(tagP);
        }
        const heading = featuredTile.querySelector("h2, h3, .featured-tile__headline");
        if (heading) {
          cellContent.push(heading);
        }
        const description = featuredTile.querySelector("p");
        if (description) {
          cellContent.push(description);
        }
        const cta = featuredTile.querySelector('a.call-to-action, a.cta, a[class*="call-to-action"]');
        if (cta) {
          cellContent.push(cta);
        }
      }
      const textList = col.querySelector(".text-list");
      if (textList) {
        const title = textList.querySelector("h2, h3, .section-title");
        if (title) {
          cellContent.push(title);
        }
        const list = textList.querySelector("ul, ol");
        if (list) {
          cellContent.push(list);
        }
      }
      if (cellContent.length === 0) {
        const children = col.children;
        for (let i = 0; i < children.length; i++) {
          cellContent.push(children[i]);
        }
      }
      row.push(cellContent);
    });
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-highlights.js
  function parse6(element, { document }) {
    const leftColEl = element.querySelector('.col-lg-8, .col-md-8, [class*="col-lg-8"]');
    const leftContent = [];
    if (leftColEl) {
      const highlightBoxes = leftColEl.querySelectorAll("a.highlight-box");
      highlightBoxes.forEach((box) => {
        const heading = box.querySelector("h2, .highlight-box__info__headline");
        if (heading) {
          const h2 = document.createElement("h2");
          h2.textContent = heading.textContent.trim();
          leftContent.push(h2);
        }
        const desc = box.querySelector("p.media-description, .highlight-box__info p");
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          leftContent.push(p);
        }
        const img = box.querySelector(".highlight-box__image img");
        if (img) {
          const image = document.createElement("img");
          image.src = img.src || img.getAttribute("src");
          if (img.alt) image.alt = img.alt;
          leftContent.push(image);
        }
        const cta = box.querySelector("span.call-to-action");
        if (cta) {
          const link = document.createElement("a");
          link.href = box.href || box.getAttribute("href");
          link.textContent = cta.textContent.trim();
          leftContent.push(link);
        }
        const hr = document.createElement("hr");
        leftContent.push(hr);
      });
      if (leftContent.length > 0 && leftContent[leftContent.length - 1].tagName === "HR") {
        leftContent.pop();
      }
    }
    const rightColEl = element.querySelector('.col-lg-4, .col-md-4, [class*="col-lg-4"]');
    const rightContent = [];
    if (rightColEl) {
      const heading = rightColEl.querySelector("h2, h3, .text-list h2, .text-list h3");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        rightContent.push(h2);
      }
      const listItems = rightColEl.querySelectorAll("ul li, .text-list li, .text-list__item");
      if (listItems.length > 0) {
        const ul = document.createElement("ul");
        listItems.forEach((item) => {
          const li = document.createElement("li");
          const link = item.querySelector("a");
          if (link) {
            const a = document.createElement("a");
            a.href = link.href || link.getAttribute("href");
            a.textContent = link.textContent.trim();
            li.appendChild(a);
          } else {
            li.textContent = item.textContent.trim();
          }
          ul.appendChild(li);
        });
        rightContent.push(ul);
      }
      const ctaLink = rightColEl.querySelector('a.call-to-action, a.cta, .text-list > a, a[class*="cta"], a.btn');
      if (ctaLink) {
        const link = document.createElement("a");
        link.href = ctaLink.href || ctaLink.getAttribute("href");
        link.textContent = ctaLink.textContent.trim();
        rightContent.push(link);
      }
      if (rightContent.length === 0) {
        const allContent = rightColEl.querySelector(".text-list, .sidebar, .event-list");
        if (allContent) {
          rightContent.push(allContent);
        } else {
          const children = rightColEl.children;
          for (let i = 0; i < children.length; i++) {
            rightContent.push(children[i]);
          }
        }
      }
    }
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-highlights", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/search-banner.js
  function parse7(element, { document }) {
    const origin = document.location ? document.location.origin : "";
    const queryIndexUrl = `${origin}/query-index.json`;
    const link = document.createElement("a");
    link.href = queryIndexUrl;
    link.textContent = queryIndexUrl;
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(" field:index "));
    frag.appendChild(link);
    const cells = [
      [frag]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "search-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/aba-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function removeElements(element, selectors) {
    if (typeof WebImporter !== "undefined" && WebImporter.DOMUtils) {
      WebImporter.DOMUtils.remove(element, selectors);
    } else {
      selectors.forEach((selector) => {
        element.querySelectorAll(selector).forEach((el) => el.remove());
      });
    }
  }
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      removeElements(element, [
        "#onetrust-consent-sdk",
        "#speaker-modal-container",
        ".video-modal",
        "loader"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      removeElements(element, [
        "header",
        "footer",
        ".js-ga-metadata",
        ".focusable-text-for-accessibility",
        "#coveo3a949f41",
        ".shade",
        ".js-url-mount",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/aba-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const document = element.ownerDocument;
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const cells = { style: section.style };
          if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
            const metadataBlock = WebImporter.Blocks.createBlock(document, {
              name: "Section Metadata",
              cells
            });
            sectionEl.after(metadataBlock);
          } else {
            const table = document.createElement("table");
            const headerRow = document.createElement("tr");
            const headerCell = document.createElement("th");
            headerCell.colSpan = 2;
            headerCell.textContent = "Section Metadata";
            headerRow.appendChild(headerCell);
            table.appendChild(headerRow);
            const dataRow = document.createElement("tr");
            const keyCell = document.createElement("td");
            keyCell.textContent = "style";
            const valueCell = document.createElement("td");
            valueCell.textContent = section.style;
            dataRow.appendChild(keyCell);
            dataRow.appendChild(valueCell);
            table.appendChild(dataRow);
            sectionEl.after(table);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-tags": parse2,
    "cards-events": parse3,
    "cards-icons": parse4,
    "columns-featured": parse5,
    "columns-highlights": parse6,
    "search-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "ABA homepage with hero, resource cards, news, events, feature content sections, member benefits, and footer",
    urls: [
      "https://www.aba.com/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".row.header-section"]
      },
      {
        name: "cards-tags",
        instances: ["section.featured-tiles:not(.grey-background) .quick-links__headline"]
      },
      {
        name: "columns-featured",
        instances: ["section.featured-tiles.grey-background .row.featured-tiles:first-child"]
      },
      {
        name: "cards-events",
        instances: [".calendar-event-tiles"]
      },
      {
        name: "search-banner",
        instances: [".coveo-for-sitecore-search-box-container"]
      },
      {
        name: "columns-highlights",
        instances: ["section.text-list-section.grey-background"]
      },
      {
        name: "cards-icons",
        instances: ["section.icon-blocks.icon-blocks--pattern-background"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".row.header-section",
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Popular Resources",
        selector: "section.featured-tiles:not(.grey-background):first-of-type",
        style: null,
        blocks: ["cards-tags"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Featured Content and News",
        selector: "section.featured-tiles.grey-background",
        style: "grey",
        blocks: ["columns-featured", "cards-events"],
        defaultContent: [".grey-background__headline"]
      },
      {
        id: "section-4",
        name: "Search",
        selector: ["section.featured-tiles:nth-of-type(3)", "section.featured-tiles:has(.coveo-for-sitecore-search-box-container)"],
        style: "navy-blue",
        blocks: ["search-banner"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Feature Highlights and Webinars",
        selector: "section.text-list-section.grey-background",
        style: "grey",
        blocks: ["columns-highlights"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Member Benefits",
        selector: "section.icon-blocks.icon-blocks--pattern-background",
        style: "dark-navy",
        blocks: ["cards-icons"],
        defaultContent: [".feature-subheading", ".feature-heading"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
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
  return __toCommonJS(import_homepage_exports);
})();
