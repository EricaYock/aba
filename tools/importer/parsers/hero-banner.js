/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://www.aba.com/
 * Selector: .row.header-section
 * Generated: 2026-05-06
 * xwalk: true (field hinting enabled)
 *
 * UE Model fields:
 *   - image (reference) → Row 1: hero/background image
 *   - imageAlt (collapsed into image) → skipped for hinting
 *   - text (richtext) → Row 2: heading, subheading, CTAs
 *
 * Source DOM structure:
 *   .row.header-section
 *     .col-lg-6.texture-bg
 *       img (texture background)
 *       .header-content
 *         h1.display-4 (main heading)
 *         p.hero_subheading (subheading)
 *         .cta-buttons
 *           a.btn-primary (primary CTA)
 *           a.btn-secondary (secondary CTA)
 *           a.call-to-action (text link)
 *     .col-lg-6
 *       .image-container-animated
 *         img#hero-image (hero image)
 */
export default function parse(element, { document }) {
  // Extract hero image (right side main image)
  const heroImage = element.querySelector('.image-container-animated img, #hero-image, .col-lg-6:not(.texture-bg) img');

  // Extract heading
  const heading = element.querySelector('h1.display-4, h1, .header-text-animated h1, [class*="display"]');

  // Extract subheading
  const subheading = element.querySelector('p.hero_subheading, .header-content p:not(:has(a)), .header-text-animated > p');

  // Extract CTA buttons and links
  const primaryCta = element.querySelector('a.btn-primary, a#cta-primary, .cta-buttons a:first-child');
  const secondaryCta = element.querySelector('a.btn-secondary, a#cta-secondary, .cta-buttons a:nth-child(2)');
  const textLink = element.querySelector('a.call-to-action, a#cta-link, .cta-buttons p a');

  // Build cells array matching block library structure:
  // Row 1: image (with field hint)
  // Row 2: text content - heading, subheading, CTAs (with field hint)
  const cells = [];

  // Row 1: Hero image with field hint
  if (heroImage) {
    const imageFragment = document.createDocumentFragment();
    imageFragment.appendChild(document.createComment(' field:image '));
    imageFragment.appendChild(heroImage);
    cells.push([imageFragment]);
  } else {
    // Empty row required by xwalk model structure
    cells.push(['']);
  }

  // Row 2: Text content (heading + subheading + CTAs) with field hint
  const textFragment = document.createDocumentFragment();
  textFragment.appendChild(document.createComment(' field:text '));

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
