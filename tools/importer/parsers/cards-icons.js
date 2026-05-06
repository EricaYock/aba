/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-icons
 * Base block: cards
 * Source: https://www.aba.com/
 * Description: Member Benefits icon cards - each card has an icon image, heading link, and description.
 * Container block: each .icon-block becomes a row with image in col1, text content in col2.
 * Generated: 2026-05-06
 */
export default function parse(element, { document }) {
  // Extract all icon-block items from the source section
  const iconBlocks = element.querySelectorAll('.icon-block');

  const cells = [];

  iconBlocks.forEach((block) => {
    // Column 1: Icon image
    // Validated selector: img.icon-block__icon within each .icon-block
    const icon = block.querySelector('img.icon-block__icon');

    // Column 2: Text content (heading + description)
    // Validated selectors: h3 > a for heading link, p.icon-block__description for description
    const headingLink = block.querySelector('h3 a, h3.h4-styling a');
    const description = block.querySelector('p.icon-block__description, .icon-block__description');

    // Build column 1 cell with field hint
    const col1 = document.createDocumentFragment();
    col1.appendChild(document.createComment(' field:image '));
    if (icon) {
      col1.appendChild(icon);
    }

    // Build column 2 cell with field hint
    // The "text" field is richtext - combine heading and description
    const col2 = document.createDocumentFragment();
    col2.appendChild(document.createComment(' field:text '));
    if (headingLink) {
      // Wrap link in a heading element to preserve semantics
      const h3 = document.createElement('h3');
      h3.appendChild(headingLink);
      col2.appendChild(h3);
    }
    if (description) {
      col2.appendChild(description);
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icons', cells });
  element.replaceWith(block);
}
