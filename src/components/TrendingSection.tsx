"use client";

import { useEffect, useState } from "react";
import { GrabCardData, Lang } from "@/lib/types";
import { getTrendingCourses } from "@/lib/search";
import { t } from "@/lib/i18n";
import GrabCard from "./GrabCard";

export default function TrendingSection({ lang }: { lang: Lang }) {
  const [trending, setTrending] = useState<GrabCardData[]>([]);

  useEffect(() => {
    setTrending(getTrendingCourses());
  }, []);

  if (trending.length === 0) return null;

  return (
    <section id="trending" className="bg-white py-12 sm:py-16" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <h2 className="font-display mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            🔥 {t("trending.title", lang)}
          </h2>
          <p className="text-sm text-gray-500">{t("trending.subtitle", lang)}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((course) => (
            <GrabCard key={course.id} card={course} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
