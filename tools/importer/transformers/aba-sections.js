/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ABA section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Sections from page-templates.json:
 *   1. Hero (dark) - .row.header-section
 *   2. Popular Resources (null) - section.featured-tiles:not(.grey-background):first-of-type
 *   3. Featured Content and News (grey) - section.featured-tiles.grey-background
 *   4. Search (navy-blue) - section.featured-tiles:has(.coveo-for-sitecore-search-box-container)
 *   5. Feature Highlights and Webinars (grey) - section.text-list-section.grey-background
 *   6. Member Benefits (dark-navy) - section.icon-blocks.icon-blocks--pattern-background
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const document = element.ownerDocument;
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;

    // Process sections in reverse order to avoid shifting DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      let selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first element matching any of the selectors
      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const cells = { style: section.style };
        if (typeof WebImporter !== 'undefined' && WebImporter.Blocks) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: 'Section Metadata',
            cells,
          });
          sectionEl.after(metadataBlock);
        } else {
          // Fallback: create a table manually
          const table = document.createElement('table');
          const headerRow = document.createElement('tr');
          const headerCell = document.createElement('th');
          headerCell.colSpan = 2;
          headerCell.textContent = 'Section Metadata';
          headerRow.appendChild(headerCell);
          table.appendChild(headerRow);

          const dataRow = document.createElement('tr');
          const keyCell = document.createElement('td');
          keyCell.textContent = 'style';
          const valueCell = document.createElement('td');
          valueCell.textContent = section.style;
          dataRow.appendChild(keyCell);
          dataRow.appendChild(valueCell);
          table.appendChild(dataRow);

          sectionEl.after(table);
        }
      }

      // Insert <hr> before the section element (except for the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
