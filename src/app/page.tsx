"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import GrabCardList from "@/components/GrabCardList";
import FilterBar, { Filters } from "@/components/FilterBar";
import ResumeUpload from "@/components/ResumeUpload";
import OffersSection from "@/components/OffersSection";
import TrendingSection from "@/components/TrendingSection";
import Logo from "@/components/Logo";
import AffiliateFooter from "@/components/AffiliateFooter";
import { useSearch } from "@/hooks/useSearch";
import { Bucket, GrabCardData, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { trackSearch } from "@/lib/analytics";

export default function Home() {
  const { results, isLoading, error, search: rawSearch } = useSearch();
  const [lang, setLang] = useState<Lang>("en");
  const [filters, setFilters] = useState<Filters>({
    price: "all", certificate: "all", category: "all", level: "all", sortBy: "value",
  });

  const search = (q: string) => {
    rawSearch(q);
    trackSearch(q, 0);
  };

  const filteredResults = results ? applyFilters(results.results, filters) : null;

  return (
    <div className="min-h-screen" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* ===== HERO ===== */}
      <section className="hero-bg relative px-4 pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="particle absolute left-[10%] top-[20%] h-2 w-2" style={{ animationDelay: "0s" }} />
        <div className="particle absolute left-[70%] top-[15%] h-3 w-3" style={{ animationDelay: "3s" }} />
        <div className="particle absolute left-[40%] top-[60%] h-1.5 w-1.5" style={{ animationDelay: "6s" }} />
        <div className="particle absolute left-[85%] top-[50%] h-2.5 w-2.5" style={{ animationDelay: "9s" }} />

        <div className="relative z-10 mx-auto max-w-6xl">
          <nav className="mb-8 flex items-center justify-between sm:mb-12">
            <Logo lang={lang} />
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="#offers" className="hidden text-sm font-medium text-purple-200 transition-colors hover:text-white sm:block">
                {t("nav.offers", lang)}
              </a>
              <a href="#trending" className="hidden text-sm font-medium text-purple-200 transition-colors hover:text-white sm:block">
                {t("nav.trending", lang)}
              </a>
              <a href="#resume" className="hidden text-sm font-medium text-purple-200 transition-colors hover:text-white sm:block">
                {t("nav.resume", lang)}
              </a>
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="rounded-full border border-purple-400/30 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                {lang === "en" ? "العربية" : "English"}
              </button>
            </div>
          </nav>

          <div className="mb-8 text-center sm:mb-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-200 sm:px-4 sm:py-1.5 sm:text-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400" />
              {t("hero.badge", lang)}
            </div>
            <h1 className="font-display mb-3 text-4xl font-extrabold tracking-tight text-white sm:mb-4 sm:text-6xl lg:text-7xl">
              {t("hero.title1", lang)}{" "}
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {t("hero.title2", lang)}
              </span>
            </h1>
            <p className="mb-1 text-base text-purple-100/90 sm:mb-2 sm:text-xl">{t("hero.subtitle", lang)}</p>
            <p className="text-xs text-purple-300/60 sm:text-sm">{t("hero.desc", lang)}</p>
          </div>

          <div className="mb-6">
            <SearchBar onSearch={search} isLoading={isLoading} lang={lang} />
          </div>

          {!results && !isLoading && (
            <div className="flex flex-wrap justify-center gap-2">
              {(lang === "ar"
                ? ["دورة بايثون مجانية بشهادة", "علم البيانات أقل من 20$", "شهادة تسويق رقمي", "تعلم الآلة", "NVIDIA deep learning"]
                : ["Free Python course with certificate", "Data Science under $20", "Digital marketing certification", "Machine learning", "NVIDIA deep learning free", "UX design Google"]
              ).map((ex) => (
                <button
                  key={ex}
                  onClick={() => search(ex)}
                  className="rounded-full border border-purple-400/20 bg-white/5 px-3 py-1.5 text-xs text-purple-200 backdrop-blur transition-all hover:border-purple-400/40 hover:bg-white/10 hover:text-white sm:px-4 sm:py-2 sm:text-sm"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">{error}</div>
        </div>
      )}

      {results && (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <FilterBar filters={filters} onChange={setFilters} lang={lang} />
          <GrabCardList results={filteredResults!} lang={lang} />
        </section>
      )}

      {isLoading && (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="shimmer h-32" />
                <div className="p-4">
                  <div className="shimmer mb-2 h-4 w-20 rounded" />
                  <div className="shimmer mb-2 h-5 w-full rounded" />
                  <div className="shimmer mb-3 h-5 w-3/4 rounded" />
                  <div className="flex gap-1.5">
                    <div className="shimmer h-5 w-14 rounded-full" />
                    <div className="shimmer h-5 w-18 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <OffersSection lang={lang} />
      <TrendingSection lang={lang} />
      <ResumeUpload lang={lang} />

      {/* Trust section */}
      <section className="border-t border-gray-100 bg-white py-10 sm:py-12" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-display mb-2 text-xl font-bold text-gray-900 sm:text-2xl">{t("trust.title", lang)}</h2>
          <p className="mb-6 text-xs text-gray-400">{t("trust.secure", lang)}</p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {[
              { name: "NVIDIA", c: "text-[#76b900]" }, { name: "Google", c: "text-[#4285f4]" },
              { name: "IBM", c: "text-[#0f62fe]" }, { name: "Meta", c: "text-[#0668e1]" },
              { name: "Coursera", c: "text-[#0056d2]" }, { name: "Udemy", c: "text-[#a435f0]" },
              { name: "HubSpot", c: "text-orange-500" }, { name: "AWS", c: "text-[#ff9900]" },
            ].map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-1">
                <span className={`text-xs font-bold sm:text-sm ${p.c}`}>{p.name}</span>
                <div className="flex items-center gap-0.5">
                  <svg className="h-2.5 w-2.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[9px] text-green-600">{t("verified", lang)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AffiliateFooter lang={lang} />
    </div>
  );
}

function applyFilters(results: Record<Bucket, GrabCardData[]>, filters: Filters): Record<Bucket, GrabCardData[]> {
  const out: Record<Bucket, GrabCardData[]> = {
    TRUST_BUILDER: [], THE_HOOK: [], REVENUE_DRIVER: [], THE_HYBRID: [],
  };

  for (const bucket of Object.keys(results) as Bucket[]) {
    let cards = [...results[bucket]];

    if (filters.price === "free") cards = cards.filter((c) => c.isFree || c.isAuditAvailable);
    else if (filters.price === "paid") cards = cards.filter((c) => !c.isFree);

    if (filters.certificate === "yes") cards = cards.filter((c) => c.hasCertificate);
    else if (filters.certificate === "no") cards = cards.filter((c) => !c.hasCertificate);

    if (filters.category !== "all") cards = cards.filter((c) => c.category === filters.category);
    if (filters.level !== "all") cards = cards.filter((c) => c.level === filters.level);

    cards.sort((a, b) => {
      switch (filters.sortBy) {
        case "value": return b.valueScore - a.valueScore;
        case "rating": return (b.rating ?? 0) - (a.rating ?? 0);
        case "price-low": return (a.price ?? 0) - (b.price ?? 0);
        case "price-high": return (b.price ?? 0) - (a.price ?? 0);
        default: return 0;
      }
    });

    out[bucket] = cards;
  }

  return out;
}
