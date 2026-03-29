import { Bucket, GrabCardData } from "@/lib/types";
import BucketHeader from "./BucketHeader";
import GrabCard from "./GrabCard";

const BUCKET_ORDER: Bucket[] = [
  "THE_HOOK",
  "THE_HYBRID",
  "REVENUE_DRIVER",
  "TRUST_BUILDER",
];

interface Props {
  results: Record<Bucket, GrabCardData[]>;
}

export default function GrabCardList({ results }: Props) {
  const hasAnyResults = BUCKET_ORDER.some((b) => results[b].length > 0);

  if (!hasAnyResults) {
    return (
      <div className="py-12 text-center text-gray-500">
        No courses found. Try a different search.
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
            <BucketHeader bucket={bucket} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <GrabCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
