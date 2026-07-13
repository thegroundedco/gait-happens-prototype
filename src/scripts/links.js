// Shared "is this href external" predicate (Course PDP Chunk B1, final
// review fix wave). ComparisonChart.astro's CTA and CourseDetails.astro's
// enroll CTA each independently declared the same `/^https?:/` regex to
// decide whether to spread `target="_blank" rel="noopener noreferrer"` onto
// an outbound link — the codebase's only "is this link external" rule, now
// with one home instead of two (soon-to-be-three, once the Shopify porting
// team needed it again) copies of the same regex.
//
// A protocol-relative URL is intentionally NOT treated as external: neither
// caller has ever produced one, and adding that case here without a real
// example to verify against would be speculative.
export function isExternalHref(href) {
  return /^https?:/.test(href);
}
