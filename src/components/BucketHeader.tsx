import { Bucket, BUCKET_META, Lang } from "@/lib/types";

export default function BucketHeader({ bucket, lang }: { bucket: Bucket; lang: Lang }) {
  const meta = BUCKET_META[bucket];
  return (
    <div className="mb-4 flex items-center gap-3" dir={lang === "ar" ? "rtl" : "ltr"}>
      <span className="text-2xl">{meta.icon}</span>
      <div>
        <h2 className="font-display text-xl font-bold text-gray-900">
          {lang === "ar" ? meta.labelAr : meta.label}
        </h2>
        <p className="text-sm text-gray-500">
          {lang === "ar" ? meta.descriptionAr : meta.description}
        </p>
      </div>
    </div>
  );
}
