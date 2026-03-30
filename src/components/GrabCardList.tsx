import { Bucket, GrabCardData, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import BucketHeader from "./BucketHeader";
import GrabCard from "./GrabCard";

const BUCKET_ORDER: Bucket[] = ["THE_HOOK", "THE_HYBRID", "REVENUE_DRIVER", "TRUST_BUILDER"];

interface Props {
  results: Record<Bucket, GrabCardData[]>;
  lang: Lang;
}

export default function GrabCardList({ results, lang }: Props) {
  const hasAny = BUCKET_ORDER.some((b) => results[b].length > 0);

  if (!hasAny) {
    return (
      <div className="py-12 text-center text-gray-500" dir={lang === "ar" ? "rtl" : "ltr"}>
        {t("noresults", lang)}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {BUCKET_ORDER.map((bucket) => {
        const cards = results[bucket];
        if (cards.length === 0) return null;
        return (
          <section key={bucket}>
            <BucketHeader bucket={bucket} lang={lang} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <GrabCard key={card.id} card={card} lang={lang} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
