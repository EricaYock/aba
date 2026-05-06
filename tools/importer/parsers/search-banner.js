/* eslint-disable */
/* global WebImporter */

/**
 * Parser: search-banner
 * Base block: search
 * Source selector: .coveo-for-sitecore-search-box-container
 * Description: Transforms a Coveo search box into an AEM Search block with a link to query-index.json.
 * Generated: 2026-05-06
 */
export default function parse(element, { document }) {
  // The Search block has a single field: "index" (a URL to query-index.json)
  // The source element is a Coveo search box that will be replaced with the AEM Search block.
  // Per block library: 1 column, 1 content row containing a link to the query index.

  // Derive the query-index URL from the current page origin
  const origin = document.location ? document.location.origin : '';
  const queryIndexUrl = `${origin}/query-index.json`;

  // Create the link element for the query index
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;

  // Build cells with field hint for xwalk UE integration
  // Field: "index" from the search model (_search.json)
  // Skip "classes" field per hinting rules (Rule 5)
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:index '));
  frag.appendChild(link);

  const cells = [
    [frag],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'search-banner', cells });
  element.replaceWith(block);
}
