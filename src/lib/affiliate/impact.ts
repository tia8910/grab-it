/**
 * Impact.com affiliate URL builder for Coursera.
 * Deep links to the course enrollment page.
 */
export function buildImpactLink(
  courseUrl: string,
  subId: string
): string {
  const accountSid = process.env.IMPACT_ACCOUNT_SID || "GRAB_IT";
  const programId = process.env.IMPACT_PROGRAM_ID || "3294490";

  // Ensure we deep link to the enrollment action
  const enrollUrl = courseUrl.includes("?")
    ? `${courseUrl}&action=enroll`
    : `${courseUrl}?action=enroll`;

  const encodedUrl = encodeURIComponent(enrollUrl);

  return `https://www.coursera.pxf.io/c/${accountSid}/${programId}/url?u=${encodedUrl}&subId1=${subId}`;
}
