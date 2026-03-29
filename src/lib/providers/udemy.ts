import { Course, ParsedQuery } from "../types";
import { classifyBucket } from "../classify";

const UDEMY_API_BASE = "https://www.udemy.com/api-2.0";

interface UdemyApiCourse {
  id: number;
  title: string;
  url: string;
  price: string;
  is_paid: boolean;
  headline: string;
  avg_rating: number;
  content_info_short: string;
  image_240x135: string;
}

export async function searchUdemy(query: ParsedQuery): Promise<Course[]> {
  const token = process.env.RAKUTEN_API_TOKEN;

  // If no token configured, return sample data for demo purposes
  if (!token) {
    return getSampleUdemyCourses(query.topic);
  }

  const params = new URLSearchParams({
    search: query.topic,
    page_size: "10",
    ordering: "relevance",
  });

  if (query.pricePref === "FREE") params.set("price", "price-free");
  if (query.maxPrice) params.set("price", `price-paid`);

  const res = await fetch(`${UDEMY_API_BASE}/courses/?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error(`Udemy API error: ${res.status}`);
    return getSampleUdemyCourses(query.topic);
  }

  const data = await res.json();
  return (data.results || []).map((c: UdemyApiCourse) => normalizeCourse(c));
}

function normalizeCourse(raw: UdemyApiCourse): Course {
  const isFree = !raw.is_paid;
  const price = isFree ? null : parseFloat(raw.price.replace(/[^0-9.]/g, "")) || null;
  const hasCertificate = false; // Udemy doesn't generally issue certificates for free courses
  const isAuditAvailable = false;

  const course: Course = {
    id: `udemy-${raw.id}`,
    title: raw.title,
    provider: "udemy",
    url: `https://www.udemy.com${raw.url}`,
    price,
    isFree,
    hasCertificate: !isFree, // Paid Udemy courses come with completion certificates
    isAuditAvailable,
    hasFinancialAid: false,
    rating: raw.avg_rating ? Math.round(raw.avg_rating * 10) / 10 : null,
    duration: raw.content_info_short || null,
    imageUrl: raw.image_240x135 || null,
    tags: {
      price: isFree ? "FREE" : "PAID",
      credential: !isFree ? "CERTIFIED" : "KNOWLEDGE_ONLY",
      financial: "NONE",
      time: "SHORT_FORM",
    },
    bucket: "TRUST_BUILDER", // placeholder, will be overwritten
  };

  course.bucket = classifyBucket(course);
  return course;
}

function getSampleUdemyCourses(topic: string): Course[] {
  const samples: Course[] = [
    {
      id: "udemy-sample-1",
      title: `The Complete ${topic} Bootcamp`,
      provider: "udemy",
      url: `https://www.udemy.com/course/${topic.toLowerCase().replace(/\s+/g, "-")}-bootcamp/`,
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
      id: "udemy-sample-2",
      title: `${topic} Fundamentals — Free Course`,
      provider: "udemy",
      url: `https://www.udemy.com/course/${topic.toLowerCase().replace(/\s+/g, "-")}-fundamentals/`,
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
    {
      id: "udemy-sample-3",
      title: `${topic} Masterclass: From Beginner to Expert`,
      provider: "udemy",
      url: `https://www.udemy.com/course/${topic.toLowerCase().replace(/\s+/g, "-")}-masterclass/`,
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
  ];

  return samples;
}
