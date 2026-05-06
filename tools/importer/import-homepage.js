/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsTagsParser from './parsers/cards-tags.js';
import cardsEventsParser from './parsers/cards-events.js';
import cardsIconsParser from './parsers/cards-icons.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import columnsHighlightsParser from './parsers/columns-highlights.js';
import searchBannerParser from './parsers/search-banner.js';

// TRANSFORMER IMPORTS
import abaCleanupTransformer from './transformers/aba-cleanup.js';
import abaSectionsTransformer from './transformers/aba-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-tags': cardsTagsParser,
  'cards-events': cardsEventsParser,
  'cards-icons': cardsIconsParser,
  'columns-featured': columnsFeaturedParser,
  'columns-highlights': columnsHighlightsParser,
  'search-banner': searchBannerParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'ABA homepage with hero, resource cards, news, events, feature content sections, member benefits, and footer',
  urls: [
    'https://www.aba.com/'
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.row.header-section']
    },
    {
      name: 'cards-tags',
      instances: ['section.featured-tiles:not(.grey-background) .quick-links__headline']
    },
    {
      name: 'columns-featured',
      instances: ['section.featured-tiles.grey-background .row.featured-tiles:first-child']
    },
    {
      name: 'cards-events',
      instances: ['.calendar-event-tiles']
    },
    {
      name: 'search-banner',
      instances: ['.coveo-for-sitecore-search-box-container']
    },
    {
      name: 'columns-highlights',
      instances: ['section.text-list-section.grey-background']
    },
    {
      name: 'cards-icons',
      instances: ['section.icon-blocks.icon-blocks--pattern-background']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.row.header-section',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Popular Resources',
      selector: 'section.featured-tiles:not(.grey-background):first-of-type',
      style: null,
      blocks: ['cards-tags'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Featured Content and News',
      selector: 'section.featured-tiles.grey-background',
      style: 'grey',
      blocks: ['columns-featured', 'cards-events'],
      defaultContent: ['.grey-background__headline']
    },
    {
      id: 'section-4',
      name: 'Search',
      selector: ['section.featured-tiles:nth-of-type(3)', 'section.featured-tiles:has(.coveo-for-sitecore-search-box-container)'],
      style: 'navy-blue',
      blocks: ['search-banner'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Feature Highlights and Webinars',
      selector: 'section.text-list-section.grey-background',
      style: 'grey',
      blocks: ['columns-highlights'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Member Benefits',
      selector: 'section.icon-blocks.icon-blocks--pattern-background',
      style: 'dark-navy',
      blocks: ['cards-icons'],
      defaultContent: ['.feature-subheading', '.feature-heading']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  abaCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [abaSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers
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
      }
    }];
  }
};
