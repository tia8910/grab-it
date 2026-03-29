import { Course, ParsedQuery } from "../types";
import { classifyBucket } from "../classify";

const COURSERA_API_BASE = "https://api.coursera.org/api/courses.v1";

interface CourseraApiCourse {
  id: string;
  slug: string;
  name: string;
  photoUrl?: string;
  description?: string;
}

export async function searchCoursera(query: ParsedQuery): Promise<Course[]> {
  const token = process.env.IMPACT_AUTH_TOKEN;

  // If no token configured, return sample data for demo purposes
  if (!token) {
    return getSampleCourseraCourses(query.topic);
  }

  const params = new URLSearchParams({
    q: "search",
    query: query.topic,
    limit: "10",
    fields: "photoUrl,description",
  });

  const res = await fetch(`${COURSERA_API_BASE}?${params}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error(`Coursera API error: ${res.status}`);
    return getSampleCourseraCourses(query.topic);
  }

  const data = await res.json();
  return (data.elements || []).map((c: CourseraApiCourse) =>
    normalizeCourse(c)
  );
}

function normalizeCourse(raw: CourseraApiCourse): Course {
  // Most Coursera courses are free to audit with paid certificates
  const course: Course = {
    id: `coursera-${raw.id}`,
    title: raw.name,
    provider: "coursera",
    url: `https://www.coursera.org/learn/${raw.slug}`,
    price: 49.0,
    isFree: false,
    hasCertificate: true,
    isAuditAvailable: true,
    hasFinancialAid: true,
    rating: null,
    duration: null,
    imageUrl: raw.photoUrl || null,
    tags: {
      price: "SUBSCRIPTION",
      credential: "CERTIFIED",
      financial: "AUDIT_AVAILABLE",
      time: "SHORT_FORM",
    },
    bucket: "THE_HYBRID", // placeholder
  };

  course.bucket = classifyBucket(course);
  return course;
}

function getSampleCourseraCourses(topic: string): Course[] {
  const samples: Course[] = [
    {
      id: "coursera-sample-1",
      title: `${topic} by IBM (Professional Certificate)`,
      provider: "coursera",
      url: `https://www.coursera.org/professional-certificates/${topic.toLowerCase().replace(/\s+/g, "-")}`,
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
      id: "coursera-sample-2",
      title: `Introduction to ${topic}`,
      provider: "coursera",
      url: `https://www.coursera.org/learn/intro-to-${topic.toLowerCase().replace(/\s+/g, "-")}`,
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
      id: "coursera-sample-3",
      title: `${topic} Specialization by Google`,
      provider: "coursera",
      url: `https://www.coursera.org/specializations/${topic.toLowerCase().replace(/\s+/g, "-")}`,
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
  ];

  return samples;
}
