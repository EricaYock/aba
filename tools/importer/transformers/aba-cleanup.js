/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ABA site-wide cleanup.
 * Removes non-authorable content (header, footer, nav, cookie consent, modals, overlays).
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function removeElements(element, selectors) {
  if (typeof WebImporter !== 'undefined' && WebImporter.DOMUtils) {
    WebImporter.DOMUtils.remove(element, selectors);
  } else {
    selectors.forEach((selector) => {
      element.querySelectorAll(selector).forEach((el) => el.remove());
    });
  }
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Rewrite local scraped image paths back to original ABA URLs
    const imgs = element.querySelectorAll('img[src*="/migration-work/images/"], img[src^="./images/"]');
    imgs.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        const filename = src.split('/').pop();
        img.setAttribute('src', 'https://www.aba.com/-/media/images/' + filename);
      }
    });

    // Remove cookie consent banner (OneTrust) - found at #onetrust-consent-sdk
    // Remove video modals that block parsing - found at .video-modal
    // Remove speaker modal - found at #speaker-modal-container
    // Remove loader overlay - found at <loader> element with .overlay child
    removeElements(element, [
      '#onetrust-consent-sdk',
      '#speaker-modal-container',
      '.video-modal',
      'loader',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header with navigation - found at <header>
    // Remove site footer - found at <footer>
    // Remove Google Analytics metadata div - found at .js-ga-metadata
    // Remove skip-to-content accessibility link - found at .focusable-text-for-accessibility
    // Remove Coveo search context div - found at #coveo3a949f41
    // Remove shade overlay - found at .shade
    // Remove URL mount div - found at .js-url-mount
    // Remove CSS link elements - found at <link> tags for Coveo CSS
    removeElements(element, [
      'header',
      'footer',
      '.js-ga-metadata',
      '.focusable-text-for-accessibility',
      '#coveo3a949f41',
      '.shade',
      '.js-url-mount',
      'link',
      'noscript',
    ]);
  }
}
