"use client";

import { useEffect, useState } from "react";
import { GrabCardData, Lang } from "@/lib/types";
import { getOfferCourses } from "@/lib/search";
import { t } from "@/lib/i18n";
import GrabCard from "./GrabCard";

export default function OffersSection({ lang }: { lang: Lang }) {
  const [offers, setOffers] = useState<GrabCardData[]>([]);

  useEffect(() => {
    setOffers(getOfferCourses());
  }, []);

  if (offers.length === 0) return null;

  return (
    <section id="offers" className="relative overflow-hidden py-12 sm:py-16" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Golden background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.1),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25">
            <span className="offer-pulse inline-block h-2 w-2 rounded-full bg-white" />
            {t("offers.title", lang)}
          </div>
          <p className="text-sm text-amber-800/60">{t("offers.subtitle", lang)}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer) => (
            <GrabCard key={offer.id} card={offer} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
