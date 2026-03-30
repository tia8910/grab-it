"use client";

import { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

export default function AffiliateFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-gray-200 bg-white py-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Trust badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1">
              <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-semibold text-green-700">{t("trust.secure", lang)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">{t("footer.disclosure", lang)}</p>
        </div>
      </div>
    </footer>
  );
}
