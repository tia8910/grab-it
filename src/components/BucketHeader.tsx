import { Bucket, BUCKET_META } from "@/lib/types";

export default function BucketHeader({ bucket }: { bucket: Bucket }) {
  const meta = BUCKET_META[bucket];

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-gray-900">{meta.label}</h2>
      <p className="text-sm text-gray-500">{meta.description}</p>
    </div>
  );
}
