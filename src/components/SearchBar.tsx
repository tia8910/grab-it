"use client";

import { useState } from "react";
import { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

interface Props {
  onSearch: (query: string) => void;
  isLoading: boolean;
  lang: Lang;
}

export default function SearchBar({ onSearch, isLoading, lang }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl sm:gap-3 sm:p-2">
        {/* AI icon */}
        <div className="hidden items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-2.5 sm:flex">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder", lang)}
          className="search-input min-w-0 flex-1 rounded-xl border-0 bg-transparent px-2 py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none sm:px-4 sm:py-4 sm:text-base"
          disabled={isLoading}
          dir={lang === "ar" ? "rtl" : "ltr"}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="grab-btn flex-shrink-0 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-4 sm:text-base"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin sm:h-5 sm:w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="hidden sm:inline">{t("search.loading", lang)}</span>
            </span>
          ) : (
            t("search.btn", lang)
          )}
        </button>
      </div>
    </form>
  );
}
