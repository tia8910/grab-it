import { ParsedQuery, Course, Bucket, GrabCardData, SearchResponse, Provider } from "./types";
import { classifyBucket } from "./classify";

export async function performSearch(query: string): Promise<SearchResponse> {
  const parsedQuery = parseQueryClient(query);
  const courses = generateCourses(parsedQuery);
  const queryHash = simpleHash(query);
  const grabCards = courses.map((c) => wrapLink(c, queryHash));

  let filtered = grabCards;
  if (parsedQuery.maxPrice) {
    filtered = filtered.filter((c) => c.isFree || (c.price !== null && c.price <= parsedQuery.maxPrice!));
  }
  if (parsedQuery.pricePref === "FREE") {
    filtered = filtered.filter((c) => c.isFree || c.isAuditAvailable);
  }

  // Sort by value score (highest first)
  filtered.sort((a, b) => b.valueScore - a.valueScore);

  const results: Record<Bucket, GrabCardData[]> = {
    TRUST_BUILDER: [], THE_HOOK: [], REVENUE_DRIVER: [], THE_HYBRID: [],
  };
  for (const card of filtered) results[card.bucket].push(card);

  return { query: parsedQuery, results };
}

export function getOfferCourses(): GrabCardData[] {
  const offers = getAllOffers();
  return offers.map((c) => wrapLink(c, "offers"));
}

export function getTrendingCourses(): GrabCardData[] {
  const trending = getMostSearched();
  return trending.map((c) => wrapLink(c, "trending"));
}

export function getResumeRecommendations(skills: string[]): GrabCardData[] {
  const lower = skills.map((s) => s.toLowerCase());
  const allCourses = [
    ...generateCourses({ topic: "data science" }),
    ...generateCourses({ topic: "python" }),
    ...generateCourses({ topic: "machine learning" }),
    ...generateCourses({ topic: "cloud computing" }),
    ...generateCourses({ topic: "web development" }),
    ...generateCourses({ topic: "cybersecurity" }),
    ...generateCourses({ topic: "project management" }),
    ...generateCourses({ topic: "digital marketing" }),
  ];

  // Find gaps — courses NOT matching existing skills are recommendations
  const recommendations = allCourses.filter((c) => {
    const title = c.title.toLowerCase();
    // Recommend if user doesn't already have this skill
    const hasSkill = lower.some((s) => title.includes(s));
    // But also recommend advanced versions of skills they have
    const isAdvanced = title.includes("advanced") || title.includes("professional") || title.includes("specialization");
    return !hasSkill || isAdvanced;
  });

  // Deduplicate by ID and sort by value
  const seen = new Set<string>();
  const unique = recommendations.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  unique.sort((a, b) => b.valueScore - a.valueScore);
  return unique.slice(0, 8).map((c) => wrapLink(c, "resume"));
}

function parseQueryClient(query: string): ParsedQuery {
  const lower = query.toLowerCase();
  const parsed: ParsedQuery = { topic: query };

  if (lower.includes("free") || lower.includes("مجان")) parsed.pricePref = "FREE";
  else if (lower.includes("paid") || lower.includes("$") || lower.includes("مدفوع")) parsed.pricePref = "PAID";
  else if (lower.includes("subscription")) parsed.pricePref = "SUBSCRIPTION";

  if (/certificat|certified|credential|شهاد/.test(lower)) parsed.credentialPref = "CERTIFIED";
  if (lower.includes("audit")) parsed.financialPref = "AUDIT_AVAILABLE";
  if (lower.includes("financial aid")) parsed.financialPref = "FINANCIAL_AID";
  if (/\bshort\b|quick|سريع/.test(lower)) parsed.timePref = "SHORT_FORM";
  if (/specialization|full|تخصص/.test(lower)) parsed.timePref = "FULL_SPECIALIZATION";

  const priceMatch = lower.match(/under\s*\$?(\d+)/);
  if (priceMatch) parsed.maxPrice = parseInt(priceMatch[1], 10);

  parsed.topic = query
    .replace(/\b(free|paid|certificate|certified|certification|audit|financial aid|short|quick|specialization|full|under\s*\$?\d+|with\s+a|i\s+want\s+a?|course|courses|,|مجان[يا]?|مدفوع|شهاد[ةه]|دور[ةه]|سريع|تخصص)\b/gi, "")
    .replace(/\s+/g, " ").trim();
  if (!parsed.topic) parsed.topic = query;

  return parsed;
}

function computeValue(c: { rating: number | null; isFree: boolean; hasCertificate: boolean; isAuditAvailable: boolean; hasFinancialAid: boolean; price: number | null; isOffer?: boolean }): number {
  let score = 0;
  score += (c.rating ?? 0) * 18;
  if (c.isFree) score += 30;
  if (c.hasCertificate) score += 25;
  if (c.isAuditAvailable) score += 15;
  if (c.hasFinancialAid) score += 10;
  if (c.price && c.price < 20) score += 15;
  if (c.isOffer) score += 20;
  return Math.round(score);
}

function makeCourse(data: Omit<Course, "bucket" | "valueScore" | "tags"> & { tags: Course["tags"] }): Course {
  const bucket = classifyBucket(data);
  const valueScore = computeValue(data);
  return { ...data, bucket, valueScore };
}

function generateCourses(query: ParsedQuery): Course[] {
  const t = query.topic;
  const slug = t.toLowerCase().replace(/\s+/g, "-");

  return [
    // --- NVIDIA ---
    makeCourse({
      id: `nvidia-${slug}-1`, title: `${t} with NVIDIA Deep Learning Institute`,
      titleAr: `${t} مع معهد NVIDIA للتعلم العميق`,
      provider: "nvidia" as Provider, url: `https://learn.nvidia.com/courses/${slug}`,
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.9, students: "120K+", duration: "8 hours",
      imageUrl: null, tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
    }),
    // --- GOOGLE ---
    makeCourse({
      id: `google-${slug}-1`, title: `Google ${t} Professional Certificate`,
      titleAr: `شهادة Google المهنية في ${t}`,
      provider: "google" as Provider, url: `https://grow.google/certificates/${slug}/`,
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.8, students: "1M+", duration: "6 months",
      imageUrl: null, tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
    }),
    // --- IBM ---
    makeCourse({
      id: `ibm-${slug}-1`, title: `IBM ${t} Professional Certificate`,
      titleAr: `شهادة IBM المهنية في ${t}`,
      provider: "ibm" as Provider, url: `https://www.ibm.com/training/collection/${slug}`,
      price: 49, isFree: false, hasCertificate: true, isAuditAvailable: true,
      hasFinancialAid: true, rating: 4.6, students: "500K+", duration: "4 months",
      imageUrl: null, tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
    }),
    // --- META ---
    makeCourse({
      id: `meta-${slug}-1`, title: `Meta ${t} Certificate Program`,
      titleAr: `برنامج شهادة Meta في ${t}`,
      provider: "meta" as Provider, url: `https://www.coursera.org/professional-certificates/meta-${slug}`,
      price: 39, isFree: false, hasCertificate: true, isAuditAvailable: true,
      hasFinancialAid: true, rating: 4.7, students: "350K+", duration: "5 months",
      imageUrl: null, tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
    }),
    // --- COURSERA ---
    makeCourse({
      id: `coursera-${slug}-1`, title: `Introduction to ${t}`,
      titleAr: `مقدمة في ${t}`,
      provider: "coursera" as Provider, url: `https://www.coursera.org/learn/intro-to-${slug}`,
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.8, students: "800K+", duration: "4 weeks",
      imageUrl: null, tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
    }),
    makeCourse({
      id: `coursera-${slug}-2`, title: `${t} Specialization by Google`,
      titleAr: `تخصص ${t} من Google`,
      provider: "coursera" as Provider, url: `https://www.coursera.org/specializations/${slug}`,
      price: 39, isFree: false, hasCertificate: true, isAuditAvailable: true,
      hasFinancialAid: true, rating: 4.7, students: "600K+", duration: "3 months",
      imageUrl: null, tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
    }),
    // --- UDEMY ---
    makeCourse({
      id: `udemy-${slug}-1`, title: `The Complete ${t} Bootcamp 2025`,
      titleAr: `معسكر ${t} الشامل 2025`,
      provider: "udemy" as Provider, url: `https://www.udemy.com/course/${slug}-bootcamp/`,
      price: 12.99, isFree: false, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.7, students: "450K+", duration: "42 hours",
      imageUrl: null, isOffer: true, offerLabel: "87% OFF", originalPrice: 99.99,
      tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
    }),
    makeCourse({
      id: `udemy-${slug}-2`, title: `${t} Masterclass: Zero to Hero`,
      titleAr: `${t} ماستركلاس: من الصفر إلى الاحتراف`,
      provider: "udemy" as Provider, url: `https://www.udemy.com/course/${slug}-masterclass/`,
      price: 14.99, isFree: false, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.8, students: "280K+", duration: "56 hours",
      imageUrl: null, isOffer: true, offerLabel: "85% OFF", originalPrice: 94.99,
      tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
    }),
    makeCourse({
      id: `udemy-${slug}-3`, title: `${t} Fundamentals — Free Course`,
      titleAr: `أساسيات ${t} — دورة مجانية`,
      provider: "udemy" as Provider, url: `https://www.udemy.com/course/${slug}-fundamentals/`,
      price: null, isFree: true, hasCertificate: false, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.3, students: "150K+", duration: "3.5 hours",
      imageUrl: null, tags: { price: "FREE", credential: "KNOWLEDGE_ONLY", financial: "NONE", time: "SHORT_FORM" },
    }),
    // --- HUBSPOT ---
    makeCourse({
      id: `hubspot-${slug}-1`, title: `HubSpot ${t} Certification`,
      titleAr: `شهادة HubSpot في ${t}`,
      provider: "hubspot" as Provider, url: `https://academy.hubspot.com/courses/${slug}`,
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.5, students: "200K+", duration: "5 hours",
      imageUrl: null, tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
    }),
  ];
}

function getAllOffers(): Course[] {
  return [
    makeCourse({
      id: "offer-1", title: "ChatGPT & AI Mastery Bundle",
      titleAr: "حزمة احتراف ChatGPT والذكاء الاصطناعي",
      provider: "udemy" as Provider, url: "https://www.udemy.com/course/chatgpt-ai-mastery/",
      price: 9.99, originalPrice: 89.99, isFree: false, hasCertificate: true,
      isAuditAvailable: false, hasFinancialAid: false, rating: 4.7, students: "320K+",
      duration: "28 hours", imageUrl: null, isOffer: true, offerLabel: "89% OFF",
      tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
    }),
    makeCourse({
      id: "offer-2", title: "NVIDIA: Fundamentals of Deep Learning",
      titleAr: "NVIDIA: أساسيات التعلم العميق",
      provider: "nvidia" as Provider, url: "https://learn.nvidia.com/courses/fundamentals-of-deep-learning",
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.9, students: "95K+", duration: "8 hours",
      imageUrl: null, isOffer: true, offerLabel: "FREE CERT",
      tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
    }),
    makeCourse({
      id: "offer-3", title: "Google Project Management Certificate",
      titleAr: "شهادة إدارة المشاريع من Google",
      provider: "google" as Provider, url: "https://grow.google/certificates/project-management/",
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.8, students: "1.2M+", duration: "6 months",
      imageUrl: null, isOffer: true, offerLabel: "FREE",
      tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
    }),
    makeCourse({
      id: "offer-4", title: "AWS Cloud Practitioner Essentials",
      titleAr: "أساسيات AWS السحابية",
      provider: "ibm" as Provider, url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.7, students: "500K+", duration: "6 hours",
      imageUrl: null, isOffer: true, offerLabel: "FREE CERT",
      tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
    }),
  ];
}

function getMostSearched(): Course[] {
  return [
    makeCourse({
      id: "trend-1", title: "Python for Everybody", titleAr: "بايثون للجميع",
      provider: "coursera" as Provider, url: "https://www.coursera.org/specializations/python",
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: true,
      hasFinancialAid: true, rating: 4.8, students: "3.2M+", duration: "8 months",
      imageUrl: null, tags: { price: "FREE", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
    }),
    makeCourse({
      id: "trend-2", title: "Google Data Analytics Certificate", titleAr: "شهادة تحليل البيانات من Google",
      provider: "google" as Provider, url: "https://grow.google/certificates/data-analytics/",
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false,
      hasFinancialAid: false, rating: 4.8, students: "2.1M+", duration: "6 months",
      imageUrl: null, tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
    }),
    makeCourse({
      id: "trend-3", title: "Machine Learning by Stanford", titleAr: "تعلم الآلة من ستانفورد",
      provider: "coursera" as Provider, url: "https://www.coursera.org/learn/machine-learning",
      price: 0, isFree: true, hasCertificate: true, isAuditAvailable: true,
      hasFinancialAid: true, rating: 4.9, students: "5M+", duration: "3 months",
      imageUrl: null, tags: { price: "FREE", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
    }),
    makeCourse({
      id: "trend-4", title: "Meta Front-End Developer", titleAr: "مطور واجهات أمامية من Meta",
      provider: "meta" as Provider, url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      price: 39, isFree: false, hasCertificate: true, isAuditAvailable: true,
      hasFinancialAid: true, rating: 4.7, students: "400K+", duration: "7 months",
      imageUrl: null, tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
    }),
  ];
}

// --- Affiliate link builder (TRUSTED links only — real provider domains) ---
function wrapLink(course: Course, queryHash: string): GrabCardData {
  const subId = `${Date.now()}_${queryHash}_${course.id}`;
  // All links go directly to the trusted provider domain.
  // In production, these would be wrapped via Impact.com / Rakuten server-side.
  // The user sees the real provider URL — no scary redirects.
  const affiliateUrl = appendTracking(course.url, subId);

  let upsellText: string | undefined;
  let upsellTextAr: string | undefined;

  if (course.bucket === "THE_HYBRID") {
    upsellText = course.hasFinancialAid
      ? "Free to audit! Pay only for the certificate. Financial aid available."
      : "Free to audit! Pay only if you want the certificate.";
    upsellTextAr = course.hasFinancialAid
      ? "مراجعة مجانية! ادفع فقط للشهادة. المساعدة المالية متاحة."
      : "مراجعة مجانية! ادفع فقط إذا أردت الشهادة.";
  } else if (course.isOffer && course.originalPrice) {
    const discount = Math.round((1 - (course.price ?? 0) / course.originalPrice) * 100);
    upsellText = `${discount}% OFF — was $${course.originalPrice.toFixed(2)}, now $${(course.price ?? 0).toFixed(2)}!`;
    upsellTextAr = `خصم ${discount}% — كان $${course.originalPrice.toFixed(2)}، الآن $${(course.price ?? 0).toFixed(2)}!`;
  } else if (course.bucket === "REVENUE_DRIVER" && course.price && course.price < 20) {
    upsellText = `Only $${course.price.toFixed(2)} — great value for a certified course.`;
    upsellTextAr = `فقط $${course.price.toFixed(2)} — قيمة ممتازة لدورة معتمدة.`;
  }

  return { ...course, affiliateUrl, upsellText, upsellTextAr };
}

function appendTracking(url: string, subId: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}utm_source=grabit&utm_medium=affiliate&ref=${subId}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = (hash << 5) - hash + str.charCodeAt(i); hash |= 0; }
  return Math.abs(hash).toString(36);
}
