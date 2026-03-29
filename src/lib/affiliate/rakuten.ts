/**
 * Rakuten Advertising affiliate URL builder for Udemy.
 * Deep links to the course enrollment page to maximize conversion.
 */
export function buildRakutenLink(
  courseUrl: string,
  subId: string
): string {
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID || "GRAB_IT";
  const merchantId = process.env.RAKUTEN_MERCHANT_ID || "39197";

  // Deep link to the enrollment page for better conversion
  const enrollUrl = courseUrl.endsWith("/")
    ? `${courseUrl}enroll/`
    : `${courseUrl}/enroll/`;

  const encodedUrl = encodeURIComponent(enrollUrl);

  return `https://click.linksynergy.com/deeplink?id=${affiliateId}&mid=${merchantId}&murl=${encodedUrl}&u1=${subId}`;
}
