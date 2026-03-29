import { Course, GrabCardData } from "../types";
import { buildRakutenLink } from "./rakuten";
import { buildImpactLink } from "./impact";

/**
 * Wrap a course with an affiliate deep link and sub-ID tracking.
 * This is the PRD's top priority: ensuring the user lands on the
 * exact Checkout/Enroll page of the provider.
 */
export function wrapAffiliateLink(
  course: Course,
  queryHash: string
): GrabCardData {
  const subId = generateSubId(course.id, queryHash);

  let affiliateUrl: string;

  switch (course.provider) {
    case "udemy":
      affiliateUrl = buildRakutenLink(course.url, subId);
      break;
    case "coursera":
      affiliateUrl = buildImpactLink(course.url, subId);
      break;
    default:
      affiliateUrl = course.url;
  }

  const upsellText = generateUpsellText(course);

  return {
    ...course,
    affiliateUrl,
    upsellText,
  };
}

/**
 * Generate a unique sub-ID for tracking.
 * Format: {timestamp}_{queryHash}_{courseId}
 */
function generateSubId(courseId: string, queryHash: string): string {
  const timestamp = Date.now();
  return `${timestamp}_${queryHash}_${courseId}`;
}

/**
 * Generate upsell text for hybrid courses (free audit + paid certificate).
 */
function generateUpsellText(course: Course): string | undefined {
  if (course.bucket === "THE_HYBRID") {
    if (course.hasFinancialAid) {
      return "Free to audit! Pay only for the certificate. Financial aid available.";
    }
    return "Free to audit! Pay only if you want the certificate.";
  }

  if (course.bucket === "REVENUE_DRIVER" && course.price && course.price < 20) {
    return `Only $${course.price.toFixed(2)} — great value for a certified course.`;
  }

  return undefined;
}
