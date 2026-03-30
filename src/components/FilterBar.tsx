"use client";

import { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

export type Filters = {
  price: "all" | "free" | "paid";
  certificate: "all" | "yes" | "no";
  sortBy: "value" | "rating" | "price-low" | "price-high";
};

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  lang: Lang;
}

export default function FilterBar({ filters, onChange, lang }: Props) {
  const set = (p: Partial<Filters>) => onChange({ ...filters, ...p });

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1">
          <svg className="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{t("filter.label", lang)}</span>
        </div>

        <Toggle
          options={[
            { value: "all", label: t("filter.all", lang) },
            { value: "free", label: t("filter.free", lang) },
            { value: "paid", label: t("filter.paid", lang) },
          ]}
          selected={filters.price}
          onChange={(v) => set({ price: v as Filters["price"] })}
          color="indigo"
        />

        <div className="hidden h-5 w-px bg-gray-200 sm:block" />

        <Toggle
          options={[
            { value: "all", label: t("filter.all", lang) },
            { value: "yes", label: t("filter.cert", lang) },
            { value: "no", label: t("filter.nocert", lang) },
          ]}
          selected={filters.certificate}
          onChange={(v) => set({ certificate: v as Filters["certificate"] })}
          color="purple"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t("filter.sort", lang)}</span>
        <select
          value={filters.sortBy}
          onChange={(e) => set({ sortBy: e.target.value as Filters["sortBy"] })}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="value">{t("sort.value", lang)}</option>
          <option value="rating">{t("sort.rating", lang)}</option>
          <option value="price-low">{t("sort.pricelow", lang)}</option>
          <option value="price-high">{t("sort.pricehigh", lang)}</option>
        </select>
      </div>
    </div>
  );
}

function Toggle({ options, selected, onChange, color }: {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (v: string) => void;
  color: "indigo" | "purple";
}) {
  const active = color === "indigo" ? "bg-indigo-600 text-white shadow-sm" : "bg-purple-600 text-white shadow-sm";
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 ${selected === o.value ? active : "text-gray-500 hover:text-gray-700"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
