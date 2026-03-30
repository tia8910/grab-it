export type PriceTag = "FREE" | "PAID" | "SUBSCRIPTION";
export type CredentialTag = "CERTIFIED" | "KNOWLEDGE_ONLY";
export type FinancialPath = "AUDIT_AVAILABLE" | "FINANCIAL_AID" | "NONE";
export type TimeInvestment = "SHORT_FORM" | "FULL_SPECIALIZATION";
export type Provider = "udemy" | "coursera" | "nvidia" | "google" | "ibm" | "meta" | "hubspot";

export interface ParsedQuery {
  topic: string;
  pricePref?: PriceTag;
  credentialPref?: CredentialTag;
  financialPref?: FinancialPath;
  timePref?: TimeInvestment;
  maxPrice?: number;
}

export type Bucket = "TRUST_BUILDER" | "THE_HOOK" | "REVENUE_DRIVER" | "THE_HYBRID";

export const BUCKET_META: Record<Bucket, { label: string; labelAr: string; description: string; descriptionAr: string; icon: string }> = {
  THE_HOOK: { label: "Free + Certificate", labelAr: "مجاني + شهادة", description: "Free courses that include a certificate", descriptionAr: "دورات مجانية تتضمن شهادة", icon: "🎓" },
  THE_HYBRID: { label: "Audit Available", labelAr: "مراجعة مجانية", description: "Free to learn, pay only for the certificate", descriptionAr: "تعلم مجاناً، ادفع فقط للشهادة", icon: "🔓" },
  REVENUE_DRIVER: { label: "Premium Certified", labelAr: "معتمد مميز", description: "Premium courses with verified certificates", descriptionAr: "دورات مميزة بشهادات معتمدة", icon: "⭐" },
  TRUST_BUILDER: { label: "Free Learning", labelAr: "تعلم مجاني", description: "Free courses to start learning", descriptionAr: "دورات مجانية للبدء بالتعلم", icon: "📚" },
};

export interface Course {
  id: string;
  title: string;
  titleAr?: string;
  provider: Provider;
  url: string;
  price: number | null;
  originalPrice?: number | null;
  isFree: boolean;
  hasCertificate: boolean;
  isAuditAvailable: boolean;
  hasFinancialAid: boolean;
  rating: number | null;
  students?: string;
  duration: string | null;
  imageUrl: string | null;
  isOffer?: boolean;
  offerLabel?: string;
  tags: {
    price: PriceTag;
    credential: CredentialTag;
    financial: FinancialPath;
    time: TimeInvestment;
  };
  bucket: Bucket;
  valueScore: number;
}

export interface GrabCardData extends Course {
  affiliateUrl: string;
  upsellText?: string;
  upsellTextAr?: string;
}

export interface SearchResponse {
  query: ParsedQuery;
  results: Record<Bucket, GrabCardData[]>;
}

export type Lang = "en" | "ar";
