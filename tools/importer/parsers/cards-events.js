/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-events
 * Base block: cards (container block with card items)
 * Source: https://www.aba.com/
 * Selector: .calendar-event-tiles
 * Description: List of upcoming event cards. Each event has an image,
 *   a date (e.g. "May 5-7"), and a title link (e.g. "Risk and Compliance Conference").
 * Model fields: image (reference), text (richtext)
 * Generated: 2026-05-06
 *
 * Source DOM structure:
 *   ul.calendar-event-tiles
 *     div.col-12.col-md-12.col-lg-4
 *       li
 *         img (event image)
 *         a (wraps date and title)
 *           p.calendar-event-tiles__date (date text)
 *           p.hyperlink (title text)
 */
export default function parse(element, { document }) {
  // Each card is inside a div > li structure within the .calendar-event-tiles ul
  const cardContainers = element.querySelectorAll(':scope > div');
  const cells = [];

  cardContainers.forEach((container) => {
    const li = container.querySelector('li');
    if (!li) return;

    // Extract image
    const img = li.querySelector('img');

    // Extract link with date and title
    const link = li.querySelector('a');
    const dateParagraph = li.querySelector('.calendar-event-tiles__date');
    const titleParagraph = li.querySelector('.hyperlink');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      imageCell.appendChild(img);
    }

    // Build text cell with field hint
    // Combine date and title as linked content (richtext)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (link && dateParagraph && titleParagraph) {
      // Create a heading for the title wrapped in a link
      const heading = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = titleParagraph.textContent;
      heading.appendChild(anchor);

      // Create date paragraph
      const dateEl = document.createElement('p');
      dateEl.textContent = dateParagraph.textContent;

      textCell.appendChild(dateEl);
      textCell.appendChild(heading);
    } else if (link) {
      // Fallback: just append the link content
      textCell.appendChild(link);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-events', cells });
  element.replaceWith(block);
}
