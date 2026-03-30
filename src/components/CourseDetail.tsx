"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { GrabCardData, Lang, CATEGORY_META } from "@/lib/types";
import { getCourseByIdWrapped } from "@/lib/search";
import { t } from "@/lib/i18n";
import { trackEvent, trackCTAClick } from "@/lib/analytics";
import SmartBadge from "@/components/SmartBadge";
import AffiliateFooter from "@/components/AffiliateFooter";

export default function CourseDetail() {
  const params = useParams();
  const id = params.id as string;
  const [lang, setLang] = useState<Lang>("en");
  const [course, setCourse] = useState<GrabCardData | undefined>();

  useEffect(() => {
    const c = getCourseByIdWrapped(id);
    setCourse(c);
    if (c) trackEvent("page_view", { courseId: c.id, title: c.title });
  }, [id]);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafbff]">
        <div className="text-center">
          <p className="mb-4 text-6xl">🔍</p>
          <p className="mb-2 text-lg font-semibold text-gray-700">Course not found</p>
          <a href="/grab-it/" className="text-indigo-600 hover:underline">Back to home</a>
        </div>
      </div>
    );
  }

  const title = lang === "ar" && course.titleAr ? course.titleAr : course.title;
  const desc = lang === "ar" && course.aiDescriptionAr ? course.aiDescriptionAr : course.aiDescription;
  const catMeta = CATEGORY_META[course.category];
  const handleCTA = () => trackCTAClick(course.id, course.provider);

  return (
    <div className="min-h-screen bg-[#fafbff]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <nav className="border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/grab-it/" className="font-display flex items-center gap-2 text-lg font-bold text-gray-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L8 6V4C5.79 4 4 5.79 4 8V14C4 17.31 6.69 20 10 20H14C17.31 20 20 17.31 20 14V8C20 5.79 18.21 4 16 4V6L12 2Z"/></svg>
            </div>
            Grab <span className="text-indigo-600">It</span>
          </a>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="rounded-full border px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <a href="/grab-it/" className="hover:text-indigo-600">Home</a>
          <span>/</span>
          <span>{catMeta.icon} {lang === "ar" ? catMeta.labelAr : catMeta.label}</span>
          <span>/</span>
          <span className="capitalize text-gray-600">{course.provider}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            {course.imageUrl && (
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.imageUrl} alt={title} className="h-48 w-full object-cover sm:h-64" loading="lazy" />
                {course.isOffer && course.offerLabel && (
                  <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg offer-pulse">{course.offerLabel}</div>
                )}
              </div>
            )}

            <h1 className="font-display mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">{title}</h1>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold capitalize text-indigo-600">{course.provider}</span>
              {course.duration && <span className="text-sm text-gray-400">{course.duration}</span>}
              {course.students && <span className="text-sm text-gray-400">{course.students} {t("students", lang)}</span>}
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-500">{course.level}</span>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <SmartBadge variant={{ type: "price", value: course.tags.price, amount: course.price }} />
              <SmartBadge variant={{ type: "credential", value: course.tags.credential }} />
              {course.tags.financial !== "NONE" && <SmartBadge variant={{ type: "financial", value: course.tags.financial }} />}
              {course.rating && <SmartBadge variant={{ type: "rating", value: course.rating }} />}
            </div>

            {course.aiTags && course.aiTags.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {course.aiTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{tag}</span>
                ))}
              </div>
            )}

            {course.rating && (
              <div className="mb-6 flex items-center gap-4 rounded-xl bg-amber-50 px-5 py-4">
                <div className="text-4xl font-extrabold text-amber-600">{course.rating}</div>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className={`h-5 w-5 ${s <= Math.round(course.rating!) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-0.5 text-xs text-amber-700">{course.students} {t("students", lang)}</p>
                </div>
              </div>
            )}

            {desc && (
              <div className="mb-6">
                <h2 className="font-display mb-3 text-xl font-bold text-gray-900">{lang === "ar" ? "عن الدورة" : "About This Course"}</h2>
                <p className="text-base leading-relaxed text-gray-600">{desc}</p>
              </div>
            )}

            {course.aiBenefits && course.aiBenefits.length > 0 && (
              <div className="mb-6">
                <h2 className="font-display mb-3 text-xl font-bold text-gray-900">{lang === "ar" ? "المزايا الرئيسية" : "Key Benefits"}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {course.aiBenefits.map((b) => (
                    <div key={b} className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3">
                      <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5">
              <h2 className="font-display mb-4 text-xl font-bold text-gray-900">{lang === "ar" ? "تفاصيل الدورة" : "Course Details"}</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <Detail label={lang === "ar" ? "المستوى" : "Level"} value={course.level} />
                <Detail label={lang === "ar" ? "المدة" : "Duration"} value={course.duration || "Self-paced"} />
                <Detail label={lang === "ar" ? "الشهادة" : "Certificate"} value={course.hasCertificate ? "Yes" : "No"} />
                <Detail label={lang === "ar" ? "المنصة" : "Platform"} value={course.provider} />
                <Detail label={lang === "ar" ? "الفئة" : "Category"} value={lang === "ar" ? catMeta.labelAr : catMeta.label} />
                <Detail label={lang === "ar" ? "المساعدة المالية" : "Financial Aid"} value={course.hasFinancialAid ? "Available" : "N/A"} />
              </div>
            </div>

            {course.upsellText && (
              <div className="mb-6 rounded-xl bg-amber-50 px-5 py-4 text-sm text-amber-800">
                {lang === "ar" ? course.upsellTextAr : course.upsellText}
              </div>
            )}

            <div className="rounded-xl bg-gray-50 px-5 py-3 text-xs text-gray-400">{t("footer.disclosure", lang)}</div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 text-center">
                {course.isFree ? (
                  <p className="text-3xl font-extrabold text-green-600">FREE</p>
                ) : (
                  <div>
                    <p className="text-3xl font-extrabold text-gray-900">${course.price?.toFixed(2)}</p>
                    {course.originalPrice && <p className="text-sm text-gray-400 line-through">${course.originalPrice.toFixed(2)}</p>}
                  </div>
                )}
              </div>

              <div className="mb-5 rounded-xl bg-indigo-50 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-wide text-indigo-400">Value Score</p>
                <p className="text-3xl font-bold text-indigo-600">{course.valueScore}<span className="text-sm font-normal text-indigo-400">/120</span></p>
                <div className="mx-auto mt-2 h-2 w-full overflow-hidden rounded-full bg-indigo-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${Math.min((course.valueScore / 120) * 100, 100)}%` }} />
                </div>
              </div>

              <a href={course.affiliateUrl} target="_blank" rel="noopener noreferrer" onClick={handleCTA} className="grab-btn mb-3 block w-full rounded-xl py-4 text-center text-base font-bold text-white">
                {lang === "ar" ? "ابدأ الدورة الآن" : "Start Course Now"}
              </a>
              <a href={course.url} target="_blank" rel="noopener noreferrer" className="mb-4 block w-full rounded-xl border border-gray-200 bg-white py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                {lang === "ar" ? "اذهب للموقع الرسمي" : "Go to Official Course"}
              </a>

              <div className="flex flex-col items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-green-700">{t("verified", lang)}</span>
                </div>
                <p className="text-center text-[10px] text-green-600">{lang === "ar" ? "رابط رسمي موثق وآمن" : "Official verified & secure link"}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AffiliateFooter lang={lang} />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-semibold capitalize text-gray-700">{value}</p>
    </div>
  );
}
