"use client";

import { useState, useCallback } from "react";
import { GrabCardData, Lang } from "@/lib/types";
import { getResumeRecommendations } from "@/lib/search";
import { t } from "@/lib/i18n";
import GrabCard from "./GrabCard";

interface Props {
  lang: Lang;
}

export default function ResumeUpload({ lang }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [gaps, setGaps] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<GrabCardData[]>([]);
  const [dragging, setDragging] = useState(false);

  const analyzeResume = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setSkills([]);
    setGaps([]);
    setRecommendations([]);

    // Simulate AI analysis of resume text
    await new Promise((r) => setTimeout(r, 1500));

    const text = await file.text();
    const lower = text.toLowerCase();

    // Extract skills from common keywords
    const allSkills = [
      "python", "javascript", "react", "java", "sql", "html", "css", "node.js",
      "aws", "docker", "kubernetes", "git", "linux", "typescript", "c++",
      "data analysis", "machine learning", "deep learning", "tensorflow",
      "project management", "agile", "scrum", "excel", "power bi", "tableau",
      "marketing", "seo", "google analytics", "photoshop", "figma",
      "communication", "leadership", "teamwork", "problem solving",
    ];

    const found = allSkills.filter((s) => lower.includes(s));
    if (found.length === 0) {
      // Default skills if nothing detected
      found.push("communication", "teamwork");
    }

    // Identify skill gaps (in-demand skills they don't have)
    const inDemand = [
      "python", "data analysis", "machine learning", "cloud computing",
      "cybersecurity", "project management", "digital marketing", "web development",
    ];
    const missing = inDemand.filter((s) => !found.includes(s));

    setSkills(found.slice(0, 10));
    setGaps(missing.slice(0, 6));

    // Get course recommendations based on gaps
    const recs = getResumeRecommendations(found);
    setRecommendations(recs);
    setIsAnalyzing(false);
  }, []);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.");
      return;
    }
    analyzeResume(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <section id="resume" className="bg-gradient-to-b from-indigo-50 to-purple-50 py-12 sm:py-16" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <h2 className="font-display mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            📄 {t("resume.title", lang)}
          </h2>
          <p className="text-sm text-gray-500">{t("resume.subtitle", lang)}</p>
        </div>

        {/* Upload zone */}
        <div
          className={`upload-zone mx-auto max-w-lg rounded-2xl bg-white p-8 text-center transition-all sm:p-12 ${dragging ? "dragging" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="h-10 w-10 animate-spin text-indigo-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm font-medium text-indigo-600">{t("resume.analyzing", lang)}</p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <label className="cursor-pointer">
                <p className="mb-1 text-sm font-medium text-gray-700">{t("resume.upload", lang)}</p>
                <p className="text-xs text-gray-400">{t("resume.formats", lang)}</p>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleChange}
                />
              </label>
            </>
          )}
        </div>

        {/* Analysis Results */}
        {skills.length > 0 && (
          <div className="mx-auto mt-8 max-w-3xl space-y-6">
            {/* Skills detected */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs">✓</span>
                {t("resume.skills", lang)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Gaps to develop */}
            {gaps.length > 0 && (
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs">↑</span>
                  {t("resume.gaps", lang)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {gaps.map((g) => (
                    <span key={g} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium capitalize text-amber-700">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended courses */}
            {recommendations.length > 0 && (
              <div>
                <h3 className="mb-4 font-display text-xl font-bold text-gray-900">
                  🎯 {t("resume.recs", lang)}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.slice(0, 6).map((rec) => (
                    <GrabCard key={rec.id} card={rec} lang={lang} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
