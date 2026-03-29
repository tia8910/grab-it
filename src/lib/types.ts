// Metadata tag types from the PRD

export type PriceTag = "FREE" | "PAID" | "SUBSCRIPTION";
export type CredentialTag = "CERTIFIED" | "KNOWLEDGE_ONLY";
export type FinancialPath = "AUDIT_AVAILABLE" | "FINANCIAL_AID" | "NONE";
export type TimeInvestment = "SHORT_FORM" | "FULL_SPECIALIZATION";

// Output of AI query parsing
export interface ParsedQuery {
  topic: string;
  pricePref?: PriceTag;
  credentialPref?: CredentialTag;
  financialPref?: FinancialPath;
  timePref?: TimeInvestment;
  maxPrice?: number;
}

// PRD Result Matrix buckets
export type Bucket =
  | "TRUST_BUILDER"
  | "THE_HOOK"
  | "REVENUE_DRIVER"
  | "THE_HYBRID";

export const BUCKET_META: Record<
  Bucket,
  { label: string; description: string }
> = {
  TRUST_BUILDER: {
    label: "Free Learning",
    description: "Free courses — no certificate",
  },
  THE_HOOK: {
    label: "Free + Certificate",
    description: "Free courses that include a certificate",
  },
  REVENUE_DRIVER: {
    label: "Paid + Certificate",
    description: "Premium courses with verified certificates",
  },
  THE_HYBRID: {
    label: "Audit Available",
    description: "Free to learn, pay only for the certificate",
  },
};

// Normalized course from any provider
export interface Course {
  id: string;
  title: string;
  provider: "udemy" | "coursera";
  url: string;
  price: number | null;
  isFree: boolean;
  hasCertificate: boolean;
  isAuditAvailable: boolean;
  hasFinancialAid: boolean;
  rating: number | null;
  duration: string | null;
  imageUrl: string | null;
  tags: {
    price: PriceTag;
    credential: CredentialTag;
    financial: FinancialPath;
    time: TimeInvestment;
  };
  bucket: Bucket;
}

// What the UI receives — a course with affiliate link attached
export interface GrabCardData extends Course {
  affiliateUrl: string;
  upsellText?: string;
}

// Full search response
export interface SearchResponse {
  query: ParsedQuery;
  results: Record<Bucket, GrabCardData[]>;
}
