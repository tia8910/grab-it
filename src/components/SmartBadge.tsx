import { PriceTag, CredentialTag, FinancialPath } from "@/lib/types";

type BadgeVariant =
  | { type: "price"; value: PriceTag; amount?: number | null }
  | { type: "credential"; value: CredentialTag }
  | { type: "financial"; value: FinancialPath }
  | { type: "rating"; value: number };

const COLORS: Record<string, string> = {
  FREE: "bg-green-100 text-green-800",
  PAID: "bg-amber-100 text-amber-800",
  SUBSCRIPTION: "bg-blue-100 text-blue-800",
  CERTIFIED: "bg-purple-100 text-purple-800",
  KNOWLEDGE_ONLY: "bg-gray-100 text-gray-600",
  AUDIT_AVAILABLE: "bg-teal-100 text-teal-800",
  FINANCIAL_AID: "bg-emerald-100 text-emerald-800",
  rating: "bg-yellow-100 text-yellow-800",
};

function getLabel(variant: BadgeVariant): string {
  switch (variant.type) {
    case "price":
      if (variant.value === "FREE") return "FREE";
      if (variant.value === "SUBSCRIPTION") return "SUBSCRIPTION";
      return variant.amount ? `$${variant.amount.toFixed(2)}` : "PAID";
    case "credential":
      return variant.value === "CERTIFIED" ? "CERTIFIED" : "No Certificate";
    case "financial":
      if (variant.value === "AUDIT_AVAILABLE") return "Audit Available";
      if (variant.value === "FINANCIAL_AID") return "Financial Aid";
      return "";
    case "rating":
      return `★ ${variant.value}/5`;
  }
}

function getColor(variant: BadgeVariant): string {
  if (variant.type === "rating") return COLORS.rating;
  return COLORS[variant.value] || COLORS.KNOWLEDGE_ONLY;
}

export default function SmartBadge({ variant }: { variant: BadgeVariant }) {
  const label = getLabel(variant);
  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getColor(variant)}`}
    >
      {label}
    </span>
  );
}
