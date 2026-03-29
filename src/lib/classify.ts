import { Bucket } from "./types";

/**
 * Classify a course into one of the four PRD buckets.
 * Hybrid takes priority because it represents the upsell opportunity.
 */
export function classifyBucket(course: {
  isFree: boolean;
  hasCertificate: boolean;
  isAuditAvailable: boolean;
}): Bucket {
  if (course.isAuditAvailable) return "THE_HYBRID";
  if (course.isFree && course.hasCertificate) return "THE_HOOK";
  if (course.isFree && !course.hasCertificate) return "TRUST_BUILDER";
  return "REVENUE_DRIVER";
}
