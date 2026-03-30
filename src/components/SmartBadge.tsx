import { PriceTag, CredentialTag, FinancialPath } from "@/lib/types";

type BadgeVariant =
  | { type: "price"; value: PriceTag; amount?: number | null }
  | { type: "credential"; value: CredentialTag }
  | { type: "financial"; value: FinancialPath }
  | { type: "rating"; value: number }
  | { type: "provider"; value: string }
  | { type: "offer"; value: string }
  | { type: "students"; value: string };

function getLabel(v: BadgeVariant): string {
  switch (v.type) {
    case "price":
      if (v.value === "FREE") return "FREE";
      if (v.value === "SUBSCRIPTION") return "SUBSCRIPTION";
      return v.amount ? `$${v.amount.toFixed(2)}` : "PAID";
    case "credential":
      return v.value === "CERTIFIED" ? "CERTIFIED" : "No Certificate";
    case "financial":
      if (v.value === "AUDIT_AVAILABLE") return "Audit Available";
      if (v.value === "FINANCIAL_AID") return "Financial Aid";
      return "";
    case "rating": return `★ ${v.value}/5`;
    case "provider": return v.value;
    case "offer": return v.value;
    case "students": return `${v.value}`;
  }
}

function getClass(v: BadgeVariant): string {
  switch (v.type) {
    case "price":
      if (v.value === "FREE") return "badge-free";
      if (v.value === "SUBSCRIPTION") return "badge-sub";
      return "badge-paid";
    case "credential": return v.value === "CERTIFIED" ? "badge-cert" : "badge-nocert";
    case "financial":
      if (v.value === "AUDIT_AVAILABLE") return "badge-audit";
      return "badge-aid";
    case "rating": return "badge-rating";
    case "offer": return "bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold";
    case "provider": return "bg-gray-800 text-white";
    case "students": return "bg-gray-100 text-gray-600";
  }
}

export default function SmartBadge({ variant }: { variant: BadgeVariant }) {
  const label = getLabel(variant);
  if (!label) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getClass(variant)}`}>
      {label}
    </span>
  );
}
