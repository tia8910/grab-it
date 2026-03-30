"use client";

import { Lang } from "@/lib/types";

export default function Logo({ lang }: { lang: Lang }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Inline SVG logo */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 shadow-lg shadow-purple-500/25">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L8 6V4C5.79 4 4 5.79 4 8V14C4 17.31 6.69 20 10 20H14C17.31 20 20 17.31 20 14V8C20 5.79 18.21 4 16 4V6L12 2Z" fill="white" fillOpacity="0.9"/>
          <path d="M9 10C9 9.45 9.45 9 10 9H14C14.55 9 15 9.45 15 10V14C15 15.1 14.1 16 13 16H11C9.9 16 9 15.1 9 14V10Z" fill="white" fillOpacity="0.3"/>
          <circle cx="18" cy="4" r="2" fill="#fbbf24"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-display text-lg font-bold leading-tight text-white sm:text-xl">
          {lang === "ar" ? (
            <>احصل <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">عليها</span></>
          ) : (
            <>Grab <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">It</span></>
          )}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-purple-300/50">
          {lang === "ar" ? "اكتشف الدورات" : "Course Finder"}
        </span>
      </div>
    </div>
  );
}
