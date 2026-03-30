"use client";

import { GrabCardData, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { trackCTAClick } from "@/lib/analytics";
import SmartBadge from "./SmartBadge";

export default function GrabCard({ card, lang, compact }: { card: GrabCardData; lang: Lang; compact?: boolean }) {
  const title = lang === "ar" && card.titleAr ? card.titleAr : card.title;
  const desc = lang === "ar" && card.aiDescriptionAr ? card.aiDescriptionAr : card.aiDescription;

  const providerColor: Record<string, string> = {
    nvidia: "text-[#76b900]", google: "text-[#4285f4]", ibm: "text-[#0f62fe]",
    meta: "text-[#0668e1]", coursera: "text-[#0056d2]", udemy: "text-[#a435f0]",
    hubspot: "text-orange-500", aws: "text-[#ff9900]",
  };

  const handleGrab = () => {
    trackCTAClick(card.id, card.provider);
  };

  return (
    <div className="grab-card flex flex-col overflow-hidden rounded-2xl bg-white" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Image */}
      {card.imageUrl && !compact && (
        <a href={`/grab-it/course/${card.id}`} className="relative block h-32 overflow-hidden bg-gray-100 sm:h-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          {/* Offer overlay */}
          {card.isOffer && card.offerLabel && (
            <div className="absolute left-0 top-0 rounded-br-lg bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow offer-pulse">
              {card.offerLabel}
            </div>
          )}
          {/* AI Tags overlay */}
          {card.aiTags && card.aiTags.length > 0 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {card.aiTags.slice(0, 2).map((tag) => (
                <span key={tag} className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </a>
      )}

      {/* Compact offer ribbon (no image) */}
      {compact && card.isOffer && card.offerLabel && (
        <div className="flex items-center justify-between bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 px-4 py-1.5">
          <span className="text-xs font-bold text-white offer-pulse">{card.offerLabel}</span>
          {card.originalPrice && (
            <span className="text-xs text-white/80 line-through">${card.originalPrice.toFixed(2)}</span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        {/* Provider + meta */}
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold capitalize ${providerColor[card.provider] || "text-gray-500"}`}>
            {card.provider}
          </span>
          {card.duration && <span className="text-[10px] text-gray-400">{card.duration}</span>}
          {card.students && <span className="text-[10px] text-gray-400">{card.students}</span>}
        </div>

        {/* Title (links to detail) */}
        <a href={`/grab-it/course/${card.id}`} className="group">
          <h3 className="mb-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-indigo-600 sm:text-base">
            {title}
          </h3>
        </a>

        {/* AI Description (truncated) */}
        {desc && !compact && (
          <p className="mb-2.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{desc}</p>
        )}

        {/* Badges */}
        <div className="mb-2.5 flex flex-wrap gap-1">
          <SmartBadge variant={{ type: "price", value: card.tags.price, amount: card.price }} />
          <SmartBadge variant={{ type: "credential", value: card.tags.credential }} />
          {card.rating && <SmartBadge variant={{ type: "rating", value: card.rating }} />}
        </div>

        {/* Value Score */}
        <div className="mt-auto mb-2.5">
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>Value Score</span>
            <span className="font-semibold text-indigo-600">{card.valueScore}/120</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${Math.min((card.valueScore / 120) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Upsell */}
        {card.upsellText && (
          <p className="mb-2.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-800">
            {lang === "ar" ? card.upsellTextAr : card.upsellText}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-gray-50 p-3">
        <div className="mb-1.5 flex items-center justify-center gap-1">
          <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          <span className="text-[9px] font-medium text-green-600">{t("verified", lang)}</span>
        </div>
        <a
          href={card.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleGrab}
          className="grab-btn block w-full rounded-xl py-2.5 text-center text-xs font-bold text-white sm:text-sm"
        >
          {t("grab", lang)}
        </a>
      </div>
    </div>
  );
}
