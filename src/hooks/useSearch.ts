"use client";

import { useState } from "react";
import { SearchResponse } from "@/lib/types";
import { performSearch } from "@/lib/search";

export function useSearch() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(query: string) {
    setIsLoading(true);
    setError(null);
    try {
      // Small delay to show loading state (simulates AI analysis)
      await new Promise((r) => setTimeout(r, 800));
      const data = await performSearch(query);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return { results, isLoading, error, search };
}
