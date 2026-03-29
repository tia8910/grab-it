import { GrabCardData } from "@/lib/types";
import SmartBadge from "./SmartBadge";

export default function GrabCard({ card }: { card: GrabCardData }) {
  const redirectUrl = card.affiliateUrl;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex-1 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-500">
            {card.provider}
          </span>
          {card.duration && (
            <span className="text-xs text-gray-400">{card.duration}</span>
          )}
        </div>

        <h3 className="mb-3 text-lg font-semibold leading-tight text-gray-900">
          {card.title}
        </h3>

        {/* Smart Badges */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <SmartBadge
            variant={{ type: "price", value: card.tags.price, amount: card.price }}
          />
          <SmartBadge variant={{ type: "credential", value: card.tags.credential }} />
          {card.tags.financial !== "NONE" && (
            <SmartBadge variant={{ type: "financial", value: card.tags.financial }} />
          )}
          {card.rating && (
            <SmartBadge variant={{ type: "rating", value: card.rating }} />
          )}
        </div>

        {/* Upsell Text */}
        {card.upsellText && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {card.upsellText}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-gray-100 p-4">
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-lg bg-indigo-600 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
        >
          Grab It Now
        </a>
      </div>
    </div>
  );
}
