"use client";

import SearchBar from "@/components/SearchBar";
import GrabCardList from "@/components/GrabCardList";
import { useSearch } from "@/hooks/useSearch";

export default function Home() {
  const { results, isLoading, error, search } = useSearch();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Grab <span className="text-indigo-600">It</span>
        </h1>
        <p className="mb-1 text-lg text-gray-600">
          Your Shortcut to Mastery
        </p>
        <p className="text-sm text-gray-400">
          The Direct Link to Every Certificate
        </p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <SearchBar onSearch={search} isLoading={isLoading} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {results && <GrabCardList results={results.results} />}

      {/* Empty state before search */}
      {!results && !isLoading && (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-400">
            Search for any course — tell us what you want to learn, your budget,
            and if you need a certificate.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              "Free Python course with certificate",
              "Data Science under $20",
              "Digital marketing certification",
              "Free machine learning course",
            ].map((example) => (
              <button
                key={example}
                onClick={() => search(example)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
