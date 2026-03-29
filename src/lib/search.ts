import {
  ParsedQuery,
  Course,
  Bucket,
  GrabCardData,
  SearchResponse,
} from "./types";
import { classifyBucket } from "./classify";

/**
 * Client-side search: parses query, generates sample courses,
 * classifies into buckets, and wraps with affiliate links.
 */
export async function performSearch(query: string): Promise<SearchResponse> {
  const parsedQuery = parseQueryClient(query);
  const courses = generateCourses(parsedQuery);

  const queryHash = simpleHash(query);
  const grabCards = courses.map((c) => wrapLink(c, queryHash));

  // Filter by price
  let filtered = grabCards;
  if (parsedQuery.maxPrice) {
    filtered = grabCards.filter(
      (c) => c.isFree || (c.price !== null && c.price <= parsedQuery.maxPrice!)
    );
  }
  if (parsedQuery.pricePref === "FREE") {
    filtered = filtered.filter((c) => c.isFree || c.isAuditAvailable);
  }

  const results: Record<Bucket, GrabCardData[]> = {
    TRUST_BUILDER: [],
    THE_HOOK: [],
    REVENUE_DRIVER: [],
    THE_HYBRID: [],
  };

  for (const card of filtered) {
    results[card.bucket].push(card);
  }

  return { query: parsedQuery, results };
}

function parseQueryClient(query: string): ParsedQuery {
  const lower = query.toLowerCase();
  const parsed: ParsedQuery = { topic: query };

  if (lower.includes("free")) parsed.pricePref = "FREE";
  else if (lower.includes("paid") || lower.includes("$"))
    parsed.pricePref = "PAID";
  else if (lower.includes("subscription")) parsed.pricePref = "SUBSCRIPTION";

  if (
    lower.includes("certificate") ||
    lower.includes("certified") ||
    lower.includes("credential") ||
    lower.includes("certification")
  )
    parsed.credentialPref = "CERTIFIED";

  if (lower.includes("audit")) parsed.financialPref = "AUDIT_AVAILABLE";
  else if (lower.includes("financial aid"))
    parsed.financialPref = "FINANCIAL_AID";

  if (lower.includes("short") || lower.includes("quick"))
    parsed.timePref = "SHORT_FORM";
  else if (lower.includes("specialization") || lower.includes("full"))
    parsed.timePref = "FULL_SPECIALIZATION";

  const priceMatch = lower.match(/under\s*\$?(\d+)/);
  if (priceMatch) parsed.maxPrice = parseInt(priceMatch[1], 10);

  parsed.topic = query
    .replace(
      /\b(free|paid|certificate|certified|certification|audit|financial aid|short|quick|specialization|full|under\s*\$?\d+|with\s+a|i\s+want\s+a?|course|courses|,)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

  if (!parsed.topic) parsed.topic = query;

  return parsed;
}

function generateCourses(query: ParsedQuery): Course[] {
  const t = query.topic;
  const slug = t.toLowerCase().replace(/\s+/g, "-");

  const courses: Course[] = [
    {
      id: "coursera-1",
      title: `Introduction to ${t}`,
      provider: "coursera" as const,
      url: `https://www.coursera.org/learn/intro-to-${slug}`,
      price: 0,
      isFree: true,
      hasCertificate: true,
      isAuditAvailable: false,
      hasFinancialAid: false,
      rating: 4.8,
      duration: "4 weeks",
      imageUrl: null,
      tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
      bucket: "THE_HOOK",
    },
    {
      id: "coursera-2",
      title: `${t} Professional Certificate by IBM`,
      provider: "coursera" as const,
      url: `https://www.coursera.org/professional-certificates/${slug}`,
      price: 49.0,
      isFree: false,
      hasCertificate: true,
      isAuditAvailable: true,
      hasFinancialAid: true,
      rating: 4.6,
      duration: "6 months at 10 hrs/week",
      imageUrl: null,
      tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
      bucket: "THE_HYBRID",
    },
    {
      id: "coursera-3",
      title: `${t} Specialization by Google`,
      provider: "coursera" as const,
      url: `https://www.coursera.org/specializations/${slug}`,
      price: 39.0,
      isFree: false,
      hasCertificate: true,
      isAuditAvailable: true,
      hasFinancialAid: true,
      rating: 4.7,
      duration: "3 months at 5 hrs/week",
      imageUrl: null,
      tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
      bucket: "THE_HYBRID",
    },
    {
      id: "udemy-1",
      title: `The Complete ${t} Bootcamp`,
      provider: "udemy" as const,
      url: `https://www.udemy.com/course/${slug}-bootcamp/`,
      price: 12.99,
      isFree: false,
      hasCertificate: true,
      isAuditAvailable: false,
      hasFinancialAid: false,
      rating: 4.7,
      duration: "42 total hours",
      imageUrl: null,
      tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
      bucket: "REVENUE_DRIVER",
    },
    {
      id: "udemy-2",
      title: `${t} Masterclass: Beginner to Expert`,
      provider: "udemy" as const,
      url: `https://www.udemy.com/course/${slug}-masterclass/`,
      price: 19.99,
      isFree: false,
      hasCertificate: true,
      isAuditAvailable: false,
      hasFinancialAid: false,
      rating: 4.8,
      duration: "56 total hours",
      imageUrl: null,
      tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
      bucket: "REVENUE_DRIVER",
    },
    {
      id: "udemy-3",
      title: `${t} Fundamentals — Free Course`,
      provider: "udemy" as const,
      url: `https://www.udemy.com/course/${slug}-fundamentals/`,
      price: null,
      isFree: true,
      hasCertificate: false,
      isAuditAvailable: false,
      hasFinancialAid: false,
      rating: 4.3,
      duration: "3.5 total hours",
      imageUrl: null,
      tags: { price: "FREE", credential: "KNOWLEDGE_ONLY", financial: "NONE", time: "SHORT_FORM" },
      bucket: "TRUST_BUILDER",
    },
  ];
  return courses.map((c) => ({ ...c, bucket: classifyBucket(c) }));
}

function wrapLink(course: Course, queryHash: string): GrabCardData {
  const subId = `${Date.now()}_${queryHash}_${course.id}`;
  let affiliateUrl: string;

  if (course.provider === "udemy") {
    const enrollUrl = encodeURIComponent(course.url + "enroll/");
    affiliateUrl = `https://click.linksynergy.com/deeplink?id=GRAB_IT&mid=39197&murl=${enrollUrl}&u1=${subId}`;
  } else {
    const enrollUrl = encodeURIComponent(course.url + "?action=enroll");
    affiliateUrl = `https://www.coursera.pxf.io/c/GRAB_IT/3294490/url?u=${enrollUrl}&subId1=${subId}`;
  }

  let upsellText: string | undefined;
  if (course.bucket === "THE_HYBRID") {
    upsellText = course.hasFinancialAid
      ? "Free to audit! Pay only for the certificate. Financial aid available."
      : "Free to audit! Pay only if you want the certificate.";
  } else if (course.bucket === "REVENUE_DRIVER" && course.price && course.price < 20) {
    upsellText = `Only $${course.price.toFixed(2)} — great value for a certified course.`;
  }

  return { ...course, affiliateUrl, upsellText };
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
