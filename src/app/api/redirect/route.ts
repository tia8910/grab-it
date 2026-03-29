import { NextRequest, NextResponse } from "next/server";

/**
 * Affiliate redirect endpoint.
 * All affiliate clicks go through this route for centralized tracking.
 * Logs the click and 302-redirects to the actual affiliate URL.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const sid = request.nextUrl.searchParams.get("sid");

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  // Log the click (console for MVP; replace with analytics in Phase 2)
  console.log(`[CLICK] sid=${sid} url=${url} time=${new Date().toISOString()}`);

  // 302 redirect to the affiliate URL
  return NextResponse.redirect(url, 302);
}
