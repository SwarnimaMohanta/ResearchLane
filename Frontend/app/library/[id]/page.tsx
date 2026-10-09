
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getPapers,
  generatePaperSummary,
} from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

import type {
  Paper,
  PaperSummary,
} from "@/types/paper";

export default function PaperDetailsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <PaperDetailsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function PaperDetailsContent() {
  const params = useParams();
  const paperId = Number(params.id);

  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [paper, setPaper] = useState<Paper | null>(null);
  const [summary, setSummary] =
    useState<PaperSummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const [error, setError] = useState("");
  const [summaryError, setSummaryError] = useState("");

  /* =========================
     LOAD PAPER
  ========================= */

  useEffect(() => {
    if (!isAuthenticated || !token || !paperId) {
      return;
    }

    const loadPaper = async () => {
      try {
        setIsLoading(true);
        setError("");

        const papers = await getPapers(token);

        const foundPaper = papers.find(
          (item) => item.id === paperId
        );

        if (!foundPaper) {
          setError("Paper not found.");
          return;
        }

        setPaper(foundPaper);
      } catch {
        setError("Unable to load the paper.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPaper();
  }, [isAuthenticated, token, paperId]);

  /* =========================
     GENERATE AI SUMMARY
  ========================= */

  const handleGenerateSummary = async () => {
    if (!token || !paperId) {
      return;
    }

    try {
      setIsGenerating(true);
      setSummaryError("");

      const result = await generatePaperSummary(
        token,
        paperId
      );

      setSummary(result);
    } catch (error) {
      console.error(
        "Summary generation failed:",
        error
      );

      setSummaryError(
        "Unable to generate the AI summary. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.9),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(214,226,246,0.6),transparent_40%),linear-gradient(180deg,#eef3f9,#e7edf6)]">
        <header className="border-b border-[#dde5ef] bg-gradient-to-b from-white to-[#f9fbfe] shadow-[0_14px_28px_-22px_rgba(60,80,130,0.55)]">
          <div className="mx-auto max-w-[920px] px-6 py-6">
            <h1 className="font-serif text-4xl font-bold tracking-[-0.8px] text-[#1f2a44] drop-shadow-[0_8px_20px_rgba(60,90,160,0.14)]">
              Paper Details
            </h1>

            <p className="mt-2 font-serif text-lg italic text-[#5a6a88]">
              View your research paper and generate an AI summary
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-[920px] px-6 py-8">
          <div className="rounded-[22px] border border-white bg-white/80 p-10 text-center shadow-[0_20px_40px_-28px_rgba(50,90,160,0.5)] backdrop-blur">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#dce8f7] border-t-[#3b86dc]" />

            <p className="font-sans text-sm font-semibold text-[#46506a]">
              Loading paper...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.9),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(214,226,246,0.6),transparent_40%),linear-gradient(180deg,#eef3f9,#e7edf6)]">
        <header className="border-b border-[#dde5ef] bg-gradient-to-b from-white to-[#f9fbfe] shadow-[0_14px_28px_-22px_rgba(60,80,130,0.55)]">
          <div className="mx-auto max-w-[920px] px-6 py-6">
            <h1 className="font-serif text-4xl font-bold tracking-[-0.8px] text-[#1f2a44]">
              Paper Details
            </h1>

            <p className="mt-2 font-serif text-lg italic text-[#5a6a88]">
              View your research paper and generate an AI summary
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-[920px] px-6 py-8">
          <div className="rounded-[22px] border border-red-200 bg-red-50 p-6 font-sans text-sm text-red-700 shadow-[0_15px_30px_-20px_rgba(180,50,50,0.4)]">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.85),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(214,226,246,0.6),transparent_40%),linear-gradient(180deg,#eef3f9,#e7edf6)]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#dde5ef] bg-gradient-to-b from-white to-[#f9fbfe] shadow-[0_14px_28px_-22px_rgba(60,80,130,0.55)]">
        <div className="mx-auto max-w-[920px] px-6 py-6">
          <h1 className="font-serif text-[clamp(32px,4.4vw,46px)] font-bold leading-tight tracking-[-0.8px] text-[#1f2a44] drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">
            Paper Details
          </h1>

          <p className="mt-2 font-serif text-[clamp(16px,1.9vw,20px)] italic text-[#5a6a88]">
            View your research paper and generate an AI summary
          </p>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[920px] px-3 py-7 sm:px-6 sm:py-8">

        {/* =================================================
            PAPER INFORMATION CARD
        ================================================= */}

        {paper && (
          <section className="relative mb-[22px] overflow-hidden rounded-[22px] border border-white bg-gradient-to-b from-[#e7f3fc] to-[#d7eaf8] p-5 shadow-[0_1px_0_#fff_inset,0_0_0_1px_rgba(110,170,230,0.35),0_0_38px_rgba(100,170,245,0.42),0_26px_40px_-28px_rgba(50,90,160,0.55)] sm:p-7">

            {/* Gloss highlight */}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/60 to-transparent" />

            <div className="relative">

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <h2 className="break-words font-serif text-[26px] font-bold tracking-[-0.4px] text-[#1d2640] sm:text-[30px]">
                    {paper.title}
                  </h2>

                  <p className="mt-1.5 break-all text-[14px] text-[#3b4660] sm:text-[15px]">
                    {paper.filename}
                  </p>

                </div>

                {/* PDF ICON */}

                <svg
                  className="h-14 w-[46px] flex-none drop-shadow-[0_10px_8px_rgba(60,70,110,0.28)]"
                  viewBox="0 0 46 56"
                  aria-hidden="true"
                >
                  <path
                    d="M6 2h24l12 12v36a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"
                    fill="#fff"
                    stroke="#cfd7e6"
                    strokeWidth="2"
                  />

                  <path
                    d="M30 2v12h12"
                    fill="#e8edf7"
                  />

                  <path
                    d="M13 38c6-4 10-12 9-18 0-2-3-2-3 1 0 6 6 13 14 14 2 0 2-3-1-3-6 0-12 2-19 6z"
                    fill="none"
                    stroke="#e5483d"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />

                  <text
                    x="23"
                    y="50"
                    textAnchor="middle"
                    fontFamily="Nunito, sans-serif"
                    fontWeight="800"
                    fontSize="9"
                    fill="#e5483d"
                  >
                    PDF
                  </text>
                </svg>

              </div>

              {/* META */}

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                {/* AUTHOR */}

                <div>
                  <div className="flex items-center gap-2 font-sans text-[13.5px] font-extrabold text-[#26304a]">

                    <svg
                      className="h-4 w-4 text-[#4a5a7a]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle
                        cx="12"
                        cy="8"
                        r="4"
                      />

                      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
                    </svg>

                    Author
                  </div>

                  <p className="ml-6 mt-1 text-[15px] text-[#2f3a54]">
                    {paper.author || "Not detected"}
                  </p>
                </div>

                {/* UPLOADED */}

                <div>
                  <div className="flex items-center gap-2 font-sans text-[13.5px] font-extrabold text-[#26304a]">

                    <svg
                      className="h-4 w-4 text-[#4a5a7a]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="3"
                      />

                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>

                    Uploaded
                  </div>

                  <p className="ml-6 mt-1 text-[15px] text-[#2f3a54]">
                    {new Date(
                      paper.uploaded_at
                    ).toLocaleDateString()}
                  </p>
                </div>

              </div>

              {/* DESCRIPTION */}

              {paper.description && (
                <div className="mt-5 border-t border-white/60 pt-4">

                  <p className="font-sans text-[13.5px] font-extrabold text-[#26304a]">
                    Description
                  </p>

                  <p className="mt-1.5 text-[15px] leading-7 text-[#2f3a54]">
                    {paper.description}
                  </p>

                </div>
              )}

            </div>
          </section>
        )}

        {/* =================================================
            AI SUMMARY CARD
        ================================================= */}

        <section className="relative overflow-hidden rounded-[22px] border border-white bg-gradient-to-b from-[#f3eefc] to-[#eae2f8] p-5 shadow-[0_1px_0_#fff_inset,0_0_0_1px_rgba(170,140,235,0.35),0_0_42px_rgba(170,140,245,0.42),0_26px_40px_-28px_rgba(90,60,160,0.55)] sm:p-7">

          {/* Gloss */}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/60 to-transparent" />

          <div className="relative">

            {/* SUMMARY HEADER */}

            <div className="mb-[18px] flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <h2 className="font-serif text-[23px] font-bold tracking-[-0.3px] text-[#1f2540] sm:text-[25px]">
                  AI Research Summary
                </h2>

                <p className="mt-1 text-[14px] text-[#46506a] sm:text-[15px]">
                  Generate a structured summary of this research paper
                </p>

              </div>

              {/* GENERATE BUTTON */}

              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className={`group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/55 px-5 py-3 font-sans text-[15px] font-extrabold text-white shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_14px_22px_-10px_rgba(44,111,196,0.85),0_0_24px_rgba(70,150,240,0.5)] transition duration-200 sm:w-auto ${
                  isGenerating
                    ? "cursor-not-allowed bg-gradient-to-b from-[#8bbef0] via-[#70a6e5] to-[#6397d6]"
                    : "bg-gradient-to-b from-[#5aa6ee] via-[#3b86dc] to-[#2c6fc4] hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_18px_26px_-10px_rgba(44,111,196,0.9),0_0_34px_rgba(70,150,240,0.7)]"
                }`}
              >

                {/* Shine */}

                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent" />

                <svg
                  className="relative h-[18px] w-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />

                  <path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
                </svg>

                <span className="relative">
                  {isGenerating
                    ? "Generating..."
                    : "Generate AI Summary"}
                </span>

              </button>

            </div>

            {/* =================================================
                SUMMARY ERROR
            ================================================= */}

            {summaryError && (
              <div className="relative mb-4 rounded-[18px] border border-red-200 bg-red-50/90 p-4 shadow-[0_10px_25px_-18px_rgba(180,60,60,0.5)]">

                <p className="text-sm text-red-700">
                  {summaryError}
                </p>

              </div>
            )}

            {/* =================================================
                PLACEHOLDER
            ================================================= */}

            {!summary &&
              !isGenerating &&
              !summaryError && (
                <div className="relative rounded-[18px] border border-dashed border-[#c9bce4] bg-white/35 p-8 text-center shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]">

                  <p className="text-sm text-[#625b72]">
                    Click{" "}
                    <span className="font-bold text-[#51476a]">
                      Generate AI Summary
                    </span>{" "}
                    to analyze this research paper.
                  </p>

                </div>
              )}

            {/* =================================================
                GENERATING
            ================================================= */}

            {isGenerating && (
              <div className="relative rounded-[18px] border border-white/80 bg-white/35 p-10 text-center shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">

                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#d6ccef] border-t-[#6d54a8]" />

                <p className="text-sm font-semibold text-[#4d465c]">
                  AI is analyzing the research paper...
                </p>

                <p className="mt-1 text-xs text-[#70697d]">
                  This may take a little while because each
                  section is being analyzed separately.
                </p>

              </div>
            )}

            {/* =================================================
                GENERATED SUMMARY
            ================================================= */}

            {summary && !isGenerating && (
              <div className="space-y-4">

                {/* ABSTRACT */}

                <SummarySection
                  className="border-[#a6dba6] bg-gradient-to-b from-[#dcf3dc] to-[#cbebcb] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_0_30px_rgba(110,205,125,0.42),0_18px_28px_-22px_#a6dba6]"
                  emoji="🔬"
                  title="Abstract"
                  content={summary.summaries.abstract}
                />

                {/* INTRODUCTION */}

                <SummarySection
                  className="border-[#ddd37c] bg-gradient-to-b from-[#fcf8cf] to-[#f7f0b3] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_0_30px_rgba(235,215,80,0.42),0_18px_28px_-22px_#ddd37c]"
                  emoji="💡"
                  title="Introduction"
                  content={summary.summaries.introduction}
                />

                {/* METHODOLOGY */}

                <SummarySection
                  className="border-[#efbb8c] bg-gradient-to-b from-[#fee9d0] to-[#fbdcbd] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_0_30px_rgba(250,170,90,0.42),0_18px_28px_-22px_#efbb8c]"
                  emoji="🧪"
                  title="Methodology"
                  content={summary.summaries.methodology}
                />

                {/* RESULTS */}

                <SummarySection
                  className="border-[#ef9f9f] bg-gradient-to-b from-[#fcdcdc] to-[#f8cbcb] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_0_30px_rgba(240,120,120,0.42),0_18px_28px_-22px_#ef9f9f]"
                  emoji="📊"
                  title="Results"
                  content={summary.summaries.results}
                />

                {/* CONCLUSION */}

                <SummarySection
                  className="border-[#c4a9ef] bg-gradient-to-b from-[#ecdffc] to-[#e1d2f8] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_0_30px_rgba(170,130,245,0.46),0_18px_28px_-22px_#c4a9ef]"
                  emoji="✅"
                  title="Conclusion"
                  content={summary.summaries.conclusion}
                />

              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}

/* ============================================================
   SUMMARY ACCORDION SECTION
============================================================ */

function SummarySection({
  emoji,
  title,
  content,
  className,
}: {
  emoji: string;
  title: string;
  content: string;
  className: string;
}) {
  return (
    <details
      open
      className={`group relative overflow-hidden rounded-[18px] border-[1.5px] transition-shadow duration-200 hover:shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_0_42px_rgba(150,130,220,0.35),0_22px_32px_-22px_rgba(100,80,150,0.5)] ${className}`}
    >

      {/* Gloss highlight */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-white/55 to-transparent" />

      <summary className="relative flex cursor-pointer list-none items-center gap-2.5 px-4 py-4 outline-none sm:px-[22px] [&::-webkit-details-marker]:hidden">

        <span className="text-xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.15)]">
          {emoji}
        </span>

        <h3 className="font-serif text-[18px] font-bold text-[#1f1c28] sm:text-[19px]">
          {title}
        </h3>

        <svg
          className="h-4 w-4 text-[#3a3648] transition-transform duration-200 group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>

        {/* RIGHT SIDE TOOLS */}

        <div className="ml-auto flex gap-2">

          {/* Bookmark */}

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
            }}
            aria-label={`Bookmark ${title}`}
            className="grid h-[30px] w-[30px] place-items-center rounded-[9px] border border-white/70 bg-white/45 text-[#3a3648] shadow-[0_1px_0_#fff_inset] transition hover:bg-white/70"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
          </button>

          {/* Comment */}

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
            }}
            aria-label={`Comment on ${title}`}
            className="grid h-[30px] w-[30px] place-items-center rounded-[9px] border border-white/70 bg-white/45 text-[#3a3648] shadow-[0_1px_0_#fff_inset] transition hover:bg-white/70"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.7A8 8 0 1 1 21 12z" />
            </svg>
          </button>

        </div>

      </summary>

      {/* CONTENT */}

      <div className="relative px-4 pb-5 sm:px-[22px]">

        <p className="whitespace-pre-line text-[15px] leading-[1.85] text-[#2a2630]">
          {content}
        </p>

      </div>

    </details>
  );
}