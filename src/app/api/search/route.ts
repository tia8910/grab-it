import { NextRequest, NextResponse } from "next/server";
import { parseQuery } from "@/lib/ai/parseQuery";
import { fetchAllProviders } from "@/lib/providers";
import { wrapAffiliateLink } from "@/lib/affiliate/linkWrapper";
import { Bucket, GrabCardData, SearchResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Step 1: Parse natural language query into structured metadata
    const parsedQuery = await parseQuery(query);

    // Step 2: Fetch courses from all providers
    const courses = await fetchAllProviders(parsedQuery);

    // Step 3: Generate a query hash for sub-ID tracking
    const queryHash = simpleHash(query);

    // Step 4: Wrap each course with affiliate links
    const grabCards = courses.map((course) =>
      wrapAffiliateLink(course, queryHash)
    );

    // Step 5: Filter by price preference if specified
    let filtered = grabCards;
    if (parsedQuery.maxPrice) {
      filtered = grabCards.filter(
        (c) => c.isFree || (c.price !== null && c.price <= parsedQuery.maxPrice!)
      );
    }
    if (parsedQuery.pricePref === "FREE") {
      filtered = filtered.filter((c) => c.isFree || c.isAuditAvailable);
    }

    // Step 6: Group results by bucket
    const results: Record<Bucket, GrabCardData[]> = {
      TRUST_BUILDER: [],
      THE_HOOK: [],
      REVENUE_DRIVER: [],
      THE_HYBRID: [],
    };

    for (const card of filtered) {
      results[card.bucket].push(card);
    }

    const response: SearchResponse = {
      query: parsedQuery,
      results,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
