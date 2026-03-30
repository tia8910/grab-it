"use client";

import { GrabCardData, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import SmartBadge from "./SmartBadge";

export default function GrabCard({ card, lang }: { card: GrabCardData; lang: Lang }) {
  const title = lang === "ar" && card.titleAr ? card.titleAr : card.title;
  const upsell = lang === "ar" && card.upsellTextAr ? card.upsellTextAr : card.upsellText;

  const providerColor: Record<string, string> = {
    nvidia: "provider-nvidia",
    google: "provider-google",
    ibm: "provider-ibm",
    meta: "provider-meta",
    coursera: "provider-coursera",
    udemy: "provider-udemy",
    hubspot: "text-orange-500",
  };

  return (
    <div className="grab-card flex flex-col rounded-2xl bg-white shadow-sm" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Offer ribbon */}
      {card.isOffer && card.offerLabel && (
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 px-4 py-1.5">
          <span className="text-xs font-bold text-white offer-pulse">{card.offerLabel}</span>
          {card.originalPrice && (
            <span className="text-xs text-white/80 line-through">${card.originalPrice.toFixed(2)}</span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Provider + Duration + Students */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold capitalize ${providerColor[card.provider] || "text-gray-500"}`}>
            {card.provider}
          </span>
          {card.duration && (
            <span className="text-[11px] text-gray-400">
              {card.duration}
            </span>
          )}
          {card.students && (
            <span className="text-[11px] text-gray-400">
              {card.students} {t("students", lang)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-3 text-base font-bold leading-snug text-gray-900 sm:text-lg">
          {title}
        </h3>

        {/* Badges */}
        <div className="mb-3 flex flex-wrap gap-1">
          <SmartBadge variant={{ type: "price", value: card.tags.price, amount: card.price }} />
          <SmartBadge variant={{ type: "credential", value: card.tags.credential }} />
          {card.tags.financial !== "NONE" && (
            <SmartBadge variant={{ type: "financial", value: card.tags.financial }} />
          )}
          {card.rating && <SmartBadge variant={{ type: "rating", value: card.rating }} />}
        </div>

        {/* Value Score bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>Value Score</span>
            <span className="font-semibold text-indigo-600">{card.valueScore}/120</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${Math.min((card.valueScore / 120) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Upsell */}
        {upsell && (
          <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {upsell}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-gray-50 p-4">
        {/* Trusted link badge */}
        <div className="mb-2 flex items-center justify-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] font-medium text-green-600">{t("verified", lang)}</span>
        </div>
        <a
          href={card.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grab-btn block w-full rounded-xl py-3 text-center text-sm font-bold text-white"
        >
          {t("grab", lang)}
        </a>
      </div>
    </div>
  );
}
