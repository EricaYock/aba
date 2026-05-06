/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-tags
 * Base block: cards
 * Description: "Popular Resources:" label followed by pill-shaped tag links.
 *   Each tag link becomes a card row with text content (link) only, no images.
 * Source selector: section.featured-tiles:not(.grey-background) .quick-links__headline
 * Model fields: image (reference), text (richtext)
 * Validated: 2026-05-06
 *
 * Source DOM structure:
 *   div.col-12.col-md-12.col-lg-8
 *     span.rich-text
 *       span.quick-links__headline "Popular Resources:"  <-- element
 *     span.rich-text
 *       a.topic-tag[href="..."] "Fraud Prevention"
 *     span.rich-text
 *       a.topic-tag[href="..."] "ABA Routing Number"
 *
 * UE Model (card): image (reference), text (richtext)
 * Container block: each tag link = one card row [empty image | text link]
 */
export default function parse(element, { document }) {
  // The element is .quick-links__headline span.
  // Navigate to the parent container that holds all sibling .rich-text spans with .topic-tag links.
  const parentContainer = element.closest('.col-12') || element.parentElement?.parentElement;

  // Find all topic-tag links (sibling .rich-text spans contain a.topic-tag)
  const tagLinks = parentContainer
    ? Array.from(parentContainer.querySelectorAll('a.topic-tag'))
    : [];

  const cells = [];

  tagLinks.forEach((link) => {
    // Each card row has 2 columns per the model: image | text
    // image cell is empty (no images for tag links)
    // text cell contains the link with field hint

    // Build text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    textFrag.appendChild(link);

    // Row: [imageCell, textCell]
    // Empty image cell (no hint needed per hinting rules for empty cells)
    cells.push(['', textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tags', cells });
  element.replaceWith(block);
}
