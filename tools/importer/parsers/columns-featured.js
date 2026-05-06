/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-featured
 * Base block: columns
 * Source selector: section.featured-tiles.grey-background .row.featured-tiles:first-child
 * Description: 3-column layout with two featured tiles (tag, heading, description, CTA)
 *   and a text-list news column. Each column becomes a cell in a single Columns row.
 * xwalk note: Columns blocks do NOT require field hint comments per hinting rules.
 * Generated: 2026-05-06
 * Validated selectors against source.html:
 *   - :scope > [class*="col-"] → matches .col-12.col-md-12.col-lg-4 divs
 *   - .featured-tile → matches .linkedDiv.featured-tile divs in cols 1 & 2
 *   - .tag span → matches tag labels (Resource, Advocacy)
 *   - h2, .featured-tile__headline → matches h2.h2-styling.featured-tile__headline
 *   - a.call-to-action → matches CTA links in featured tiles
 *   - .text-list → matches the news list container in col 3
 *   - .section-title → matches h2.section-title "Latest Banking News"
 *   - ul, ol → matches ul.text-list__items.unlisted
 */
export default function parse(element, { document }) {
  // Get the three column containers from the .row.featured-tiles element
  const columns = element.querySelectorAll(':scope > [class*="col-"]');

  const cells = [];

  // Build one row with as many columns as found (expect 3)
  const row = [];

  columns.forEach((col) => {
    const cellContent = [];

    // Check if this column has a featured-tile
    const featuredTile = col.querySelector('.featured-tile');
    if (featuredTile) {
      // Extract tag
      const tag = featuredTile.querySelector('.tag span');
      if (tag) {
        const tagP = document.createElement('p');
        tagP.textContent = tag.textContent.trim();
        tagP.setAttribute('class', 'tag');
        cellContent.push(tagP);
      }

      // Extract heading
      const heading = featuredTile.querySelector('h2, h3, .featured-tile__headline');
      if (heading) {
        cellContent.push(heading);
      }

      // Extract description paragraph
      const description = featuredTile.querySelector('p');
      if (description) {
        cellContent.push(description);
      }

      // Extract CTA link
      const cta = featuredTile.querySelector('a.call-to-action, a.cta, a[class*="call-to-action"]');
      if (cta) {
        cellContent.push(cta);
      }
    }

    // Check if this column has a text-list (news list)
    const textList = col.querySelector('.text-list');
    if (textList) {
      // Extract section title
      const title = textList.querySelector('h2, h3, .section-title');
      if (title) {
        cellContent.push(title);
      }

      // Extract the list of news items
      const list = textList.querySelector('ul, ol');
      if (list) {
        cellContent.push(list);
      }
    }

    // If no structured content found, include all child content as fallback
    if (cellContent.length === 0) {
      const children = col.children;
      for (let i = 0; i < children.length; i++) {
        cellContent.push(children[i]);
      }
    }

    row.push(cellContent);
  });

  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
