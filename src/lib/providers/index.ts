import { Course, ParsedQuery } from "../types";
import { searchUdemy } from "./udemy";
import { searchCoursera } from "./coursera";

/**
 * Fetch courses from all providers in parallel.
 * Uses Promise.allSettled so one provider failure doesn't block the others.
 */
export async function fetchAllProviders(
  query: ParsedQuery
): Promise<Course[]> {
  const results = await Promise.allSettled([
    searchUdemy(query),
    searchCoursera(query),
  ]);

  const courses: Course[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      courses.push(...result.value);
    } else {
      console.error("Provider fetch failed:", result.reason);
    }
  }

  // Sort by rating (highest first), then by price (lowest first)
  courses.sort((a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    if (ratingB !== ratingA) return ratingB - ratingA;
    const priceA = a.price ?? 0;
    const priceB = b.price ?? 0;
    return priceA - priceB;
  });

  return courses;
}
