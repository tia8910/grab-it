# Product Requirements Document (PRD): Grab It

**Version:** 2.0 (Final Execution Draft)

**Core Concept:** An AI-driven "Action Agent" that navigates the web to find direct, monetized links for educational courses, prioritized by user intent (Cost/Certificate).

---

## 1. Product Vision & Goals

**Mission:** To be the "Search-to-Action" layer for online education.

**Key KPI:** Conversion Rate (Clicks on "Grab" buttons to Affiliate Sales).

**User Problem:** Fragmented course data, hidden costs, and difficulty finding specific "Free + Certificate" options.

---

## 2. Core Functional Requirements

### A. The Smart-Search AI Engine

The AI must parse natural language and map it to four specific metadata tags:

| Tag Category | Possible Values |
|---|---|
| **Price Tag** | `[FREE]` \| `[PAID]` \| `[SUBSCRIPTION]` |
| **Credential Tag** | `[CERTIFIED]` \| `[KNOWLEDGE ONLY]` |
| **Financial Path** | `[AUDIT AVAILABLE]` \| `[FINANCIAL AID]` |
| **Time Investment** | `[SHORT-FORM]` \| `[FULL SPECIALIZATION]` |

### B. The Result Matrix (Logic Layer)

Every search result must be categorized into one of these buckets:

| Bucket | Name | Description | Examples |
|---|---|---|---|
| **Bucket 1** | Trust Builder | Free + No Certificate | YouTube, OCW |
| **Bucket 2** | The Hook | Free + Certificate | HubSpot, Google Garage |
| **Bucket 3** | The Revenue Driver | Paid + Certificate | Coursera, Udemy, Udacity |
| **Bucket 4** | The Hybrid | Free to Audit / Paid for Certificate (Upsell opportunity) | Coursera Audit tracks |

---

## 3. Affiliate & Monetization Infrastructure

### A. Network Integration

The backend must connect to the following Affiliate Networks via API/Tracking:

| Affiliate Network | Partners |
|---|---|
| **Impact.com** | Coursera, Skillshare, Udacity |
| **Rakuten Advertising** | Udemy (Primary partner) |
| **PartnerStack** | Specialized tech/SaaS certifications |

### B. The Link Wrapper (Technical Workflow)

- **Deep Linking:** The system must generate links that trigger the partner's native app (e.g., opening the Udemy App directly) to ensure 100% cookie attribution.
- **Sub-ID Tracking:** Every link must be appended with a unique identifier (e.g., `&subid=User_ID_123`) to track which users and which queries are most profitable.
- **Affiliate Disclosure:** A legal footer must be present: *"Grab It may earn a commission on qualifying purchases at no extra cost to you."*

---

## 4. Technical Stack & Data Flow

```
User Query
    |
    v
Smart-Search AI Engine (NLP Parsing -> Metadata Tags)
    |
    v
Result Matrix (Bucket Classification)
    |
    v
Affiliate Link Wrapper (Deep Link + Sub-ID Generation)
    |
    v
Grab Card UI (Displayed to User)
    |
    v
Click -> Affiliate Redirect -> Provider Checkout/Enroll Page
```

---

## 5. User Journey & UI Elements

### Step 1: The Query

> **User:** "I want a Data Science course with a certificate, under $20."

### Step 2: The "Grab Card" (UI Design)

The UI displays a card with:

- **Title:** Python for Data Science (IBM)
- **Smart Badges:** `[PAID: $19.99]` `[CERTIFIED: YES]` `[RATING: 4.8/5]`
- **The Upsell:** "This course is free to audit, but the certificate is currently 50% off."
- **Primary CTA:** **"Grab it Now"** (Redirects via Affiliate Link)

---

## 6. Launch Roadmap (Phased Approach)

### Phase 1 (MVP)
- Focus exclusively on **Courses**
- Integrate with **Udemy** (Rakuten) and **Coursera** (Impact)

### Phase 2 (Optimization)
- Add **"Price Drop" alerts**
- If a user "Grabs" a paid course but doesn't buy, notify them when it goes on sale

### Phase 3 (Expansion)
- Expand "Grab It" logic to **Shopping** (Amazon/Noon) and **Services** (Fiverr/Upwork)

---

## 7. Brand Identity & Slogans

- **Primary:** Grab It: Your Shortcut to Mastery.
- **Secondary:** Knowledge Found. Success Grabbed.
- **Tagline:** The Direct Link to Every Certificate.

---

## Developer Instructions

> **Priority:** Focus on the Deep Linking logic first. Ensuring the user lands exactly on the 'Checkout' or 'Enroll' page of the provider is the most critical technical requirement for revenue.
