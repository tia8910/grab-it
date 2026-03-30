import { ParsedQuery, Course, Bucket, GrabCardData, SearchResponse } from "./types";
import { ALL_COURSES, getOfferCourses as getOffers, getTrendingCourses as getTrending, getCourseById as getById } from "./courses";

export function performSearch(query: string): SearchResponse {
  const parsedQuery = parseQueryClient(query);
  const matching = findMatchingCourses(parsedQuery);
  const grabCards = matching.map((c) => wrapLink(c));

  const results: Record<Bucket, GrabCardData[]> = {
    TRUST_BUILDER: [], THE_HOOK: [], REVENUE_DRIVER: [], THE_HYBRID: [],
  };
  for (const card of grabCards) results[card.bucket].push(card);

  return { query: parsedQuery, results, allResults: grabCards };
}

export function getOfferCourses(): GrabCardData[] {
  return getOffers().map(wrapLink);
}

export function getTrendingCourses(): GrabCardData[] {
  return getTrending().map(wrapLink);
}

export function getCourseByIdWrapped(id: string): GrabCardData | undefined {
  const c = getById(id);
  return c ? wrapLink(c) : undefined;
}

export function getResumeRecommendations(skills: string[]): GrabCardData[] {
  const lower = skills.map((s) => s.toLowerCase());
  const recs = ALL_COURSES.filter((c) => {
    const title = c.title.toLowerCase();
    const hasSkill = lower.some((s) => title.includes(s));
    const isAdvanced = c.level !== "beginner";
    return !hasSkill || isAdvanced;
  });
  const seen = new Set<string>();
  const unique = recs.filter((c) => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
  unique.sort((a, b) => b.valueScore - a.valueScore);
  return unique.slice(0, 9).map(wrapLink);
}

export function getAllCoursesWrapped(): GrabCardData[] {
  return ALL_COURSES.map(wrapLink);
}

function findMatchingCourses(query: ParsedQuery): Course[] {
  const topic = query.topic.toLowerCase();
  const words = topic.split(/\s+/).filter((w) => w.length > 2);

  let results = ALL_COURSES.filter((c) => {
    const text = `${c.title} ${c.category} ${c.provider} ${c.aiDescription || ""}`.toLowerCase();
    return words.some((w) => text.includes(w));
  });

  // If no matches, return top courses
  if (results.length === 0) results = [...ALL_COURSES];

  // Apply price filter
  if (query.pricePref === "FREE") {
    const free = results.filter((c) => c.isFree || c.isAuditAvailable);
    if (free.length > 0) results = free;
  }
  if (query.maxPrice) {
    const affordable = results.filter((c) => c.isFree || (c.price !== null && c.price <= query.maxPrice!));
    if (affordable.length > 0) results = affordable;
  }
  if (query.credentialPref === "CERTIFIED") {
    const certified = results.filter((c) => c.hasCertificate);
    if (certified.length > 0) results = certified;
  }

  results.sort((a, b) => b.valueScore - a.valueScore);
  return results;
}

function parseQueryClient(query: string): ParsedQuery {
  const lower = query.toLowerCase();
  const parsed: ParsedQuery = { topic: query };

  if (lower.includes("free") || lower.includes("مجان")) parsed.pricePref = "FREE";
  else if (lower.includes("paid") || lower.includes("$") || lower.includes("مدفوع")) parsed.pricePref = "PAID";
  if (/certificat|certified|credential|شهاد/.test(lower)) parsed.credentialPref = "CERTIFIED";
  if (lower.includes("audit")) parsed.financialPref = "AUDIT_AVAILABLE";
  if (/\bshort\b|quick|سريع/.test(lower)) parsed.timePref = "SHORT_FORM";

  const priceMatch = lower.match(/under\s*\$?(\d+)/);
  if (priceMatch) parsed.maxPrice = parseInt(priceMatch[1], 10);

  parsed.topic = query
    .replace(/\b(free|paid|certificate|certified|certification|audit|financial aid|short|quick|under\s*\$?\d+|with\s+a|i\s+want\s+a?|course|courses|,|مجان[يا]?|مدفوع|شهاد[ةه]|دور[ةه])\b/gi, "")
    .replace(/\s+/g, " ").trim();
  if (!parsed.topic) parsed.topic = query;

  return parsed;
}

function wrapLink(course: Course): GrabCardData {
  const sep = course.url.includes("?") ? "&" : "?";
  const affiliateUrl = `${course.url}${sep}utm_source=grabit&utm_medium=affiliate&ref=grabit_${course.id}`;

  let upsellText: string | undefined;
  let upsellTextAr: string | undefined;

  if (course.bucket === "THE_HYBRID") {
    upsellText = course.hasFinancialAid
      ? "Free to audit! Pay only for the certificate. Financial aid available."
      : "Free to audit! Pay only if you want the certificate.";
    upsellTextAr = course.hasFinancialAid
      ? "مراجعة مجانية! ادفع فقط للشهادة. المساعدة المالية متاحة."
      : "مراجعة مجانية! ادفع فقط إذا أردت الشهادة.";
  } else if (course.isOffer && course.originalPrice && course.price) {
    const discount = Math.round((1 - course.price / course.originalPrice) * 100);
    upsellText = `${discount}% OFF — was $${course.originalPrice.toFixed(2)}, now $${course.price.toFixed(2)}!`;
    upsellTextAr = `خصم ${discount}% — كان $${course.originalPrice.toFixed(2)}، الآن $${course.price.toFixed(2)}!`;
  }

  return { ...course, affiliateUrl, upsellText, upsellTextAr };
}
