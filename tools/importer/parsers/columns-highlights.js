/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-highlights
 * Base block: columns
 * Source: section.text-list-section.grey-background
 * Description: 2-column Columns block. Left column (col-lg-8) contains highlight boxes
 *   with headings, descriptions, images, and CTAs. Right column (col-lg-4) contains
 *   a text list of upcoming events/trainings with links and dates.
 * Generated: 2026-05-06
 *
 * Note: Columns blocks do NOT require field hints per xwalk hinting rules.
 */
export default function parse(element, { document }) {
  // === LEFT COLUMN: Extract highlight boxes ===
  const leftColEl = element.querySelector('.col-lg-8, .col-md-8, [class*="col-lg-8"]');
  const leftContent = [];

  if (leftColEl) {
    const highlightBoxes = leftColEl.querySelectorAll('a.highlight-box');

    highlightBoxes.forEach((box) => {
      // Extract heading
      const heading = box.querySelector('h2, .highlight-box__info__headline');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim();
        leftContent.push(h2);
      }

      // Extract description
      const desc = box.querySelector('p.media-description, .highlight-box__info p');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        leftContent.push(p);
      }

      // Extract image
      const img = box.querySelector('.highlight-box__image img');
      if (img) {
        const image = document.createElement('img');
        image.src = img.src || img.getAttribute('src');
        if (img.alt) image.alt = img.alt;
        leftContent.push(image);
      }

      // Extract CTA as link
      const cta = box.querySelector('span.call-to-action');
      if (cta) {
        const link = document.createElement('a');
        link.href = box.href || box.getAttribute('href');
        link.textContent = cta.textContent.trim();
        leftContent.push(link);
      }

      // Add separator between highlight boxes
      const hr = document.createElement('hr');
      leftContent.push(hr);
    });

    // Remove trailing separator
    if (leftContent.length > 0 && leftContent[leftContent.length - 1].tagName === 'HR') {
      leftContent.pop();
    }
  }

  // === RIGHT COLUMN: Extract text list / upcoming trainings ===
  const rightColEl = element.querySelector('.col-lg-4, .col-md-4, [class*="col-lg-4"]');
  const rightContent = [];

  if (rightColEl) {
    // Extract heading (e.g. "Upcoming Trainings & Webinars")
    const heading = rightColEl.querySelector('h2, h3, .text-list h2, .text-list h3');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      rightContent.push(h2);
    }

    // Extract list items
    const listItems = rightColEl.querySelectorAll('ul li, .text-list li, .text-list__item');
    if (listItems.length > 0) {
      const ul = document.createElement('ul');
      listItems.forEach((item) => {
        const li = document.createElement('li');
        const link = item.querySelector('a');
        if (link) {
          const a = document.createElement('a');
          a.href = link.href || link.getAttribute('href');
          a.textContent = link.textContent.trim();
          li.appendChild(a);
        } else {
          li.textContent = item.textContent.trim();
        }
        ul.appendChild(li);
      });
      rightContent.push(ul);
    }

    // Extract bottom CTA (e.g. "View Full Calendar")
    const ctaLink = rightColEl.querySelector('a.call-to-action, a.cta, .text-list > a, a[class*="cta"], a.btn');
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href || ctaLink.getAttribute('href');
      link.textContent = ctaLink.textContent.trim();
      rightContent.push(link);
    }

    // Fallback: if no structured content found, grab all content
    if (rightContent.length === 0) {
      const allContent = rightColEl.querySelector('.text-list, .sidebar, .event-list');
      if (allContent) {
        rightContent.push(allContent);
      } else {
        // Last resort: clone the right column content
        const children = rightColEl.children;
        for (let i = 0; i < children.length; i++) {
          rightContent.push(children[i]);
        }
      }
    }
  }

  // === BUILD CELLS: Single row with 2 columns ===
  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-highlights', cells });
  element.replaceWith(block);
}
