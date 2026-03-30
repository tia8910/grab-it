/**
 * Simple analytics tracking.
 * Logs events to console in development.
 * Replace with your analytics provider (GA4, Mixpanel, etc.) in production.
 */

interface EventData {
  courseId?: string;
  title?: string;
  provider?: string;
  query?: string;
  filter?: string;
  [key: string]: string | number | undefined;
}

export function trackEvent(event: string, data?: EventData): void {
  // Log to console (always available)
  console.log(`[Analytics] ${event}`, data || {});

  // Send to Google Analytics if available
  if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
    const gtag = (window as unknown as Record<string, (...args: unknown[]) => void>).gtag;
    gtag("event", event, data);
  }
}

export function trackPageView(path: string): void {
  trackEvent("page_view", { page: path });
}

export function trackCTAClick(courseId: string, provider: string): void {
  trackEvent("cta_click", { courseId, provider });
}

export function trackSearch(query: string, resultCount: number): void {
  trackEvent("search", { query, resultCount });
}

export function trackFilter(filterType: string, value: string): void {
  trackEvent("filter_change", { filter: filterType, value });
}
