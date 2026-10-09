"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  comparePapers,
  getPapers,
} from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

import type {
  Paper,
  PaperComparison,
} from "@/types/paper";

export default function ComparePapersPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ComparePapersContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function ComparePapersContent() {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [papers, setPapers] = useState<Paper[]>([]);
  const [paperAId, setPaperAId] =
    useState<number | "">("");
  const [paperBId, setPaperBId] =
    useState<number | "">("");

  const [comparison, setComparison] =
    useState<PaperComparison | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);
  const [isComparing, setIsComparing] =
    useState(false);

  const [error, setError] = useState("");
  const [compareError, setCompareError] =
    useState("");

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const loadPapers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getPapers(token);
        setPapers(result);
      } catch (error) {
        console.error(
          "Failed to load papers:",
          error
        );

        setError(
          "Unable to load your research papers."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPapers();
  }, [isAuthenticated, token]);

  const handleCompare = async () => {
    if (!token) {
      return;
    }

    setCompareError("");
    setComparison(null);

    if (paperAId === "" || paperBId === "") {
      setCompareError(
        "Please select two papers to compare."
      );
      return;
    }

    if (paperAId === paperBId) {
      setCompareError(
        "Please select two different papers."
      );
      return;
    }

    try {
      setIsComparing(true);

      const result = await comparePapers(
        token,
        Number(paperAId),
        Number(paperBId)
      );

      setComparison(result);
    } catch (error) {
      console.error(
        "Paper comparison failed:",
        error
      );

      setCompareError(
        "Unable to compare the selected papers. Please try again."
      );
    } finally {
      setIsComparing(false);
    }
  };

  const selectedPaperA =
    papers.find(
      (paper) =>
        paper.id === Number(paperAId)
    );

  const selectedPaperB =
    papers.find(
      (paper) =>
        paper.id === Number(paperBId)
    );

  if (isLoading) {
    return (
      <div className="compare-page">
        <div className="compare-header">
          <h1>
            Compare Papers <span>🌙</span>
          </h1>

          <p>
            Select two research papers and let
            ResearchLane analyze their similarities
            and differences.
          </p>
        </div>

        <main className="compare-container">
          <section className="glossy-loading">
            <div className="compare-spinner" />

            <h2>
              Loading your research papers...
            </h2>

            <p>
              Please wait while ResearchLane
              loads your paper library.
            </p>
          </section>
        </main>

        <CompareStyles />
      </div>
    );
  }

  if (error) {
    return (
      <div className="compare-page">
        <div className="compare-header">
          <h1>
            Compare Papers <span>🌙</span>
          </h1>

          <p>
            Select two research papers and let
            ResearchLane analyze their similarities
            and differences.
          </p>
        </div>

        <main className="compare-container">
          <section className="error-card">
            <div className="error-icon">⚠️</div>

            <div>
              <h2>Unable to load papers</h2>
              <p>{error}</p>
            </div>
          </section>
        </main>

        <CompareStyles />
      </div>
    );
  }

  return (
    <div className="compare-page">
      {/* =========================
          HEADER
      ========================= */}

      <header className="compare-header">
        <div className="header-decoration header-star">
          ✦
        </div>

        <div className="header-content">
          <h1>
            Compare Papers{" "}
            <span aria-hidden="true">🌙</span>
          </h1>

          <p>
            Select two research papers and let
            ResearchLane analyze their similarities
            and differences.
          </p>
        </div>

        <div className="header-decoration header-dot">
          ✦
        </div>
      </header>

      <main className="compare-container">
        {/* =========================
            PAPER SELECTION
        ========================= */}

        <section className="paper-picker">
          <div className="heart-strip heart-strip-top">
            ♡　✦　♡　✦　♡　✦　♡　✦　♡
          </div>

          <div className="paper-picker-gloss" />

          <div className="picker-content">
            <div className="picker-heading">
              <h2>
                Select Research Papers
              </h2>

              <p>
                Choose two different papers for
                comparison.
              </p>
            </div>

            <div className="paper-columns">
              {/* =========================
                  PAPER A
              ========================= */}

              <div className="paper-column paper-a">
                <label htmlFor="paper-a">
                  <span className="paper-character">
                    <BirdIcon />
                  </span>

                  <span>Paper A</span>
                </label>

                <div className="select-wrapper">
                  <select
                    id="paper-a"
                    value={paperAId}
                    onChange={(event) => {
                      setPaperAId(
                        event.target.value === ""
                          ? ""
                          : Number(
                              event.target.value
                            )
                      );

                      setComparison(null);
                      setCompareError("");
                    }}
                  >
                    <option value="">
                      Select a paper…
                    </option>

                    {papers.map((paper) => (
                      <option
                        key={paper.id}
                        value={paper.id}
                        disabled={
                          paper.id ===
                          Number(paperBId)
                        }
                      >
                        {paper.title}
                      </option>
                    ))}
                  </select>

                  <span className="select-arrow">
                    ⌄
                  </span>
                </div>

                <div className="selected-chip">
                  <small>
                    SELECTED PAPER A
                  </small>

                  <b>
                    {selectedPaperA?.title ||
                      "–"}
                  </b>
                </div>
              </div>

              {/* =========================
                  PAPER B
              ========================= */}

              <div className="paper-column paper-b">
                <label htmlFor="paper-b">
                  <span className="paper-character">
                    <FoxIcon />
                  </span>

                  <span>Paper B</span>
                </label>

                <div className="select-wrapper">
                  <select
                    id="paper-b"
                    value={paperBId}
                    onChange={(event) => {
                      setPaperBId(
                        event.target.value === ""
                          ? ""
                          : Number(
                              event.target.value
                            )
                      );

                      setComparison(null);
                      setCompareError("");
                    }}
                  >
                    <option value="">
                      Select a paper…
                    </option>

                    {papers.map((paper) => (
                      <option
                        key={paper.id}
                        value={paper.id}
                        disabled={
                          paper.id ===
                          Number(paperAId)
                        }
                      >
                        {paper.title}
                      </option>
                    ))}
                  </select>

                  <span className="select-arrow">
                    ⌄
                  </span>
                </div>

                <div className="selected-chip">
                  <small>
                    SELECTED PAPER B
                  </small>

                  <b>
                    {selectedPaperB?.title ||
                      "–"}
                  </b>
                </div>
              </div>
            </div>

            {/* =========================
                ERROR
            ========================= */}

            {compareError && (
              <div className="compare-error">
                <span>⚠️</span>
                <p>{compareError}</p>
              </div>
            )}

            {/* =========================
                BUTTON
            ========================= */}

            <div className="compare-button-area">
              <button
                type="button"
                onClick={handleCompare}
                disabled={isComparing}
                className="glossy-compare-button"
              >
                <span className="button-book">
                  📖
                </span>

                <span>
                  {isComparing
                    ? "Comparing…"
                    : "Compare Papers"}
                </span>

                <span className="button-book">
                  📖
                </span>
              </button>
            </div>
          </div>

          <div className="heart-strip heart-strip-bottom">
            ♡　✦　♡　✦　♡　✦　♡　✦　♡
          </div>
        </section>

        {/* =========================
            NOT ENOUGH PAPERS
        ========================= */}

        {papers.length < 2 && (
          <section className="not-enough-card">
            <div className="not-enough-icon">
              📚
            </div>

            <div>
              <h2>Not enough papers</h2>

              <p>
                You need at least two research
                papers in your Paper Library before
                you can compare them.
              </p>
            </div>
          </section>
        )}

        {/* =========================
            COMPARISON LOADING
        ========================= */}

        {isComparing && (
          <section className="comparison-loading">
            <div className="loading-robot">
              🤖
            </div>

            <div className="compare-spinner" />

            <h2>
              AI is comparing your papers...
            </h2>

            <p>
              ResearchLane is analyzing the
              research goals, methodologies,
              datasets, and reported results of both
              papers.
            </p>

            <small>
              This may take a little while.
            </small>
          </section>
        )}

        {/* =========================
            RESULTS
        ========================= */}

        {comparison && !isComparing && (
          <section className="results-area">
            {/* PAPER HEADERS */}

            <div className="paper-result-pair">
              <div className="paper-result paper-result-a">
                <small>Paper A</small>

                <b>
                  {comparison.paper_a.title}
                </b>
              </div>

              <div className="paper-result paper-result-b">
                <small>Paper B</small>

                <b>
                  {comparison.paper_b.title}
                </b>
              </div>
            </div>

            {/* TITLE */}

            <div className="comparison-title-card">
              <div className="scale-icon">
                ⚖️
              </div>

              <div>
                <h2>
                  AI Paper Comparison
                </h2>

                <p>
                  ResearchLane&apos;s AI-generated
                  analysis of the selected research
                  papers.
                </p>
              </div>
            </div>

            {/* SECTIONS */}

            <ComparisonSection
              title="Similarities"
              icon="📎"
              description="Key common ideas identified between the two research papers."
              content={
                comparison.comparison
                  .similarities
              }
              theme="blue"
              illustration="clip"
            />

            <ComparisonSection
              title="Differences"
              icon="🧩"
              description="Important differences between the research papers."
              content={
                comparison.comparison
                  .differences
              }
              theme="purple"
              illustration="characters"
            />

            <ComparisonSection
              title="Methodology Comparison"
              icon="⚙️"
              description="Comparison of methods, algorithms and approaches used."
              content={
                comparison.comparison
                  .methodology
              }
              theme="orange"
              illustration="gear"
            />

            <ComparisonSection
              title="Dataset Comparison"
              icon="🗄️"
              description="Comparison of datasets, preprocessing and data augmentation."
              content={
                comparison.comparison.dataset
              }
              theme="coral"
              illustration="database"
            />

            <ComparisonSection
              title="Results Comparison"
              icon="📈"
              description="Comparison of experimental results, evaluation and findings."
              content={
                comparison.comparison.results
              }
              theme="blue dashed"
              illustration="chart"
            />

            <ComparisonSection
              title="Final AI Analysis"
              icon="💡"
              description="Overall analysis of the two research papers taken together."
              content={
                comparison.comparison
                  .final_analysis
              }
              theme="rose"
              illustration="brain"
            />
          </section>
        )}
      </main>

      <CompareStyles />
    </div>
  );
}

/* =========================================================
   COMPARISON SECTION
========================================================= */

type ComparisonSectionProps = {
  title: string;
  icon: string;
  description: string;
  content: string;
  theme:
    | "blue"
    | "purple"
    | "orange"
    | "coral"
    | "blue dashed"
    | "rose";
  illustration:
    | "clip"
    | "characters"
    | "gear"
    | "database"
    | "chart"
    | "brain";
};

function ComparisonSection({
  title,
  icon,
  description,
  content,
  theme,
  illustration,
}: ComparisonSectionProps) {
  return (
    <section
      className={`comparison-section theme-${theme.replace(
        " ",
        "-"
      )}`}
    >
      <div className="section-gloss" />

      <SectionIllustration
        type={illustration}
      />

      <div className="section-heading">
        <div className="section-icon">
          {icon}
        </div>

        <div>
          <h3>{title}</h3>

          <p>{description}</p>
        </div>
      </div>

      <div className="section-body">
        <p>{content}</p>
      </div>
    </section>
  );
}

/* =========================================================
   ILLUSTRATIONS
========================================================= */

function BirdIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <ellipse
        cx="20"
        cy="23"
        rx="14"
        ry="12"
        fill="#7ec3ef"
        stroke="#3f86bd"
        strokeWidth="1.7"
      />

      <path
        d="M18 11q3-7 8-4-1 4-5 6z"
        fill="#7ec3ef"
        stroke="#3f86bd"
        strokeWidth="1.5"
      />

      <path
        d="M32 20l7 3-7 3z"
        fill="#f5a623"
      />

      <circle
        cx="25"
        cy="19"
        r="2"
        fill="#222"
      />

      <ellipse
        cx="16"
        cy="25"
        rx="7"
        ry="4"
        fill="#a8dbf7"
      />
    </svg>
  );
}

function FoxIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <path
        d="M5 5l10 7h10l10-7 1 16q0 14-16 15Q4 34 4 21z"
        fill="#c4a8f0"
        stroke="#7d5fc2"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M11 25q9 8 18 0q-9 3-18 0z"
        fill="#fff"
      />

      <circle
        cx="14"
        cy="19"
        r="2"
        fill="#222"
      />

      <circle
        cx="26"
        cy="19"
        r="2"
        fill="#222"
      />

      <ellipse
        cx="20"
        cy="25"
        rx="2"
        ry="1.4"
        fill="#5a3f94"
      />
    </svg>
  );
}

function SectionIllustration({
  type,
}: {
  type: ComparisonSectionProps["illustration"];
}) {
  if (type === "clip") {
    return (
      <div className="section-art">
        <div className="clip-art pink" />
        <div className="clip-art coral" />
      </div>
    );
  }

  if (type === "characters") {
    return (
      <div className="section-art characters-art">
        <span>🐻</span>
        <span>🦊</span>
      </div>
    );
  }

  if (type === "gear") {
    return (
      <div className="section-art gear-art">
        <span>⚙️</span>
        <span>⚙️</span>
      </div>
    );
  }

  if (type === "database") {
    return (
      <div className="section-art database-art">
        🗄️
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="section-art chart-art">
        <span className="bar bar-one" />
        <span className="bar bar-two" />
        <span className="bar bar-three" />
        <span className="chart-line" />
      </div>
    );
  }

  return (
    <div className="section-art brain-art">
      🧠
      <span>💡</span>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

function CompareStyles() {
  return (
    <style>{`
      .compare-page {
        --ink: #2a2740;
        --muted: #6a6783;
        --blue: #2f7be0;
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        padding-bottom: 70px;
        color: var(--ink);
        font-family:
          Nunito,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        background:
          linear-gradient(
            180deg,
            #fbf6fb 0%,
            #f3f1fb 40%,
            #eef5fb 100%
          );
      }

      .compare-page *,
      .compare-page *::before,
      .compare-page *::after {
        box-sizing: border-box;
      }

      .compare-page::before {
        content: "✦   ✧       ✦        ✧    ✦";
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        color: rgba(211, 193, 240, 0.55);
        font-size: 25px;
        letter-spacing: 65px;
        line-height: 150px;
        transform: rotate(-8deg);
        opacity: 0.6;
      }

      .compare-header {
        position: relative;
        z-index: 1;
        overflow: hidden;
        padding: 20px 30px;
        border-bottom: 1px solid
          rgba(190, 160, 200, 0.4);
        background:
          linear-gradient(
            100deg,
            #e4e6f8,
            #f1e5f6 55%,
            #fbdde4
          );
        box-shadow:
          0 12px 24px -20px
          rgba(120, 80, 150, 0.55);
      }

      .header-content {
        position: relative;
        z-index: 2;
      }

      .compare-header h1 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family:
          Fraunces,
          Georgia,
          serif;
        font-size: clamp(
          24px,
          3vw,
          31px
        );
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      .compare-header h1 span {
        font-size: 25px;
      }

      .compare-header p {
        margin: 4px 0 0;
        color: #5a5775;
        font-size: 14px;
        font-weight: 600;
      }

      .header-decoration {
        position: absolute;
        color: rgba(193, 151, 209, 0.55);
        font-size: 30px;
      }

      .header-star {
        top: 10px;
        right: 80px;
      }

      .header-dot {
        right: 30px;
        bottom: 8px;
        font-size: 18px;
      }

      .compare-container {
        position: relative;
        z-index: 1;
        width: min(
          100% - 60px,
          1000px
        );
        margin: 0 auto;
        padding-top: 22px;
      }

      /* -----------------------------------------
         PICKER
      ----------------------------------------- */

      .paper-picker {
        position: relative;
        overflow: hidden;
        margin-bottom: 22px;
        padding: 34px 30px 28px;
        border: 2px solid #efc3d2;
        border-radius: 26px;
        background:
          linear-gradient(
            180deg,
            #ffffff,
            #fdf8fc
          );
        box-shadow:
          0 1px 0 #fff inset,
          0 0 0 5px
            rgba(239, 195, 210, 0.28),
          0 30px 44px -30px
            rgba(190, 100, 140, 0.55);
      }

      .paper-picker-gloss {
        position: absolute;
        inset: 0 0 55% 0;
        pointer-events: none;
        background:
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.85),
            transparent
          );
      }

      .picker-content {
        position: relative;
        z-index: 2;
      }

      .heart-strip {
        position: absolute;
        left: 14px;
        right: 14px;
        overflow: hidden;
        height: 17px;
        color: #e28ca5;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 7px;
        white-space: nowrap;
        opacity: 0.8;
      }

      .heart-strip-top {
        top: 6px;
      }

      .heart-strip-bottom {
        bottom: 5px;
      }

      .picker-heading h2 {
        margin: 0;
        font-family:
          Fraunces,
          Georgia,
          serif;
        font-size: 21px;
        font-weight: 700;
      }

      .picker-heading p {
        margin: 2px 0 18px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      .paper-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 26px;
      }

      .paper-column label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 800;
      }

      .paper-character {
        display: grid;
        width: 38px;
        height: 38px;
        place-items: center;
        border-radius: 12px;
        background:
          linear-gradient(
            180deg,
            #ffffff,
            #e9f2fc
          );
        box-shadow:
          0 1px 0 #fff inset,
          0 7px 12px -7px
            rgba(80, 100, 150, 0.5);
      }

      .paper-character svg {
        width: 30px;
        height: 30px;
      }

      .select-wrapper {
        position: relative;
      }

      .select-wrapper select {
        width: 100%;
        height: 46px;
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        border: 1.5px solid
          var(--select-border);
        border-radius: 14px;
        padding: 0 44px 0 14px;
        color: var(--ink);
        background:
          linear-gradient(
            180deg,
            #ffffff,
            var(--select-bg)
          );
        font:
          700 15px
          Nunito,
          system-ui,
          sans-serif;
        outline: none;
        box-shadow:
          0 1px 0 #fff inset,
          0 8px 12px -10px
            var(--select-border);
        transition:
          box-shadow 0.2s,
          transform 0.2s;
      }

      .paper-a {
        --select-border: #7fb0e6;
        --select-bg: #eaf3fd;
      }

      .paper-b {
        --select-border: #b9a2e6;
        --select-bg: #f1ebfb;
      }

      .select-wrapper select:focus {
        box-shadow:
          0 1px 0 #fff inset,
          0 0 0 3px
            rgba(47, 123, 224, 0.12),
          0 8px 15px -10px
            var(--select-border);
      }

      .select-arrow {
        position: absolute;
        top: 50%;
        right: 13px;
        pointer-events: none;
        transform: translateY(-58%);
        color: var(--select-border);
        font-size: 21px;
        font-weight: 800;
      }

      .selected-chip {
        margin-top: 12px;
        min-height: 66px;
        padding: 12px 16px;
        overflow: hidden;
        border: 1px solid
          var(--select-border);
        border-radius: 14px;
        background:
          linear-gradient(
            180deg,
            #fff,
            var(--select-bg)
          );
        box-shadow:
          0 1px 0 #fff inset;
      }

      .selected-chip small {
        display: block;
        margin-bottom: 3px;
        color: var(--select-border);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.8px;
        filter: brightness(0.7);
      }

      .selected-chip b {
        display: block;
        overflow: hidden;
        color: var(--ink);
        font-size: 15px;
        font-weight: 800;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .compare-error {
        display: flex;
        align-items: center;
        gap: 9px;
        min-height: 38px;
        margin-top: 13px;
        padding: 8px 13px;
        border: 1px solid #efb5b0;
        border-radius: 13px;
        background: #fff1f0;
        color: #b33a31;
        font-size: 13px;
        font-weight: 800;
      }

      .compare-error p {
        margin: 0;
      }

      .compare-button-area {
        display: flex;
        justify-content: center;
        margin-top: 22px;
      }

      .glossy-compare-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        overflow: hidden;
        cursor: pointer;
        border: 0;
        border-radius: 16px;
        padding: 13px 30px;
        color: #ffffff;
        background:
          linear-gradient(
            180deg,
            #4a98f2 0%,
            #2f7be0 55%,
            #2468c4 100%
          );
        box-shadow:
          0 14px 22px -10px
            rgba(47, 123, 224, 0.85),
          inset 0 1px 0
            rgba(255, 255, 255, 0.6),
          inset 0 -2px 0
            rgba(0, 0, 0, 0.12);
        font:
          800 16px
          Nunito,
          system-ui,
          sans-serif;
        transition:
          transform 0.15s,
          filter 0.2s;
      }

      .glossy-compare-button::before {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 50%;
        content: "";
        pointer-events: none;
        background:
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.34),
            transparent
          );
      }

      .glossy-compare-button:hover {
        filter: brightness(1.06);
        transform: translateY(-1px);
      }

      .glossy-compare-button:active {
        transform: translateY(1px);
      }

      .glossy-compare-button:disabled {
        cursor: wait;
        filter: grayscale(0.35);
      }

      .button-book {
        position: relative;
        z-index: 1;
        font-size: 23px;
      }

      /* -----------------------------------------
         EMPTY
      ----------------------------------------- */

      .not-enough-card {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 22px;
        padding: 18px 22px;
        border: 2px dashed #e9bf6a;
        border-radius: 22px;
        background:
          linear-gradient(
            180deg,
            #fffdf5,
            #fff7e0
          );
        box-shadow:
          0 18px 26px -22px
            #d9a21f;
      }

      .not-enough-icon {
        display: grid;
        width: 50px;
        height: 50px;
        flex: none;
        place-items: center;
        border-radius: 15px;
        background: #ffffff;
        box-shadow:
          0 5px 12px -7px
            rgba(150, 100, 30, 0.5);
        font-size: 25px;
      }

      .not-enough-card h2 {
        margin: 0;
        font-family:
          Fraunces,
          Georgia,
          serif;
        font-size: 19px;
      }

      .not-enough-card p {
        margin: 3px 0 0;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      /* -----------------------------------------
         LOADING
      ----------------------------------------- */

      .glossy-loading,
      .comparison-loading {
        position: relative;
        overflow: hidden;
        border: 2px solid #d9e8f8;
        border-radius: 24px;
        padding: 50px 30px;
        text-align: center;
        background:
          linear-gradient(
            180deg,
            #ffffff,
            #eef5fd
          );
        box-shadow:
          0 1px 0 #fff inset,
          0 25px 40px -30px
            rgba(47, 123, 224, 0.5);
      }

      .glossy-loading h2,
      .comparison-loading h2 {
        margin: 16px 0 0;
        font-family:
          Fraunces,
          Georgia,
          serif;
        font-size: 21px;
      }

      .glossy-loading p,
      .comparison-loading p {
        max-width: 600px;
        margin: 7px auto 0;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
        line-height: 1.7;
      }

      .comparison-loading small {
        display: block;
        margin-top: 10px;
        color: #9995ad;
        font-size: 12px;
      }

      .compare-spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto;
        border: 4px solid #cfe0f7;
        border-top-color: #2f7be0;
        border-radius: 50%;
        animation: compareSpin 0.85s linear infinite;
      }

      @keyframes compareSpin {
        to {
          transform: rotate(360deg);
        }
      }

      .loading-robot {
        margin-bottom: 10px;
        font-size: 35px;
        animation: robotFloat 1.5s ease-in-out infinite;
      }

      @keyframes robotFloat {
        0%,
        100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-6px);
        }
      }

      /* -----------------------------------------
         RESULTS
      ----------------------------------------- */

      .results-area {
        padding-bottom: 20px;
      }

      .paper-result-pair {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 22px;
        margin-bottom: 22px;
      }

      .paper-result {
        position: relative;
        overflow: hidden;
        border: 1.5px solid;
        border-radius: 18px;
        padding: 18px 22px;
        background:
          linear-gradient(
            180deg,
            var(--result-bg),
            #ffffff
          );
        box-shadow:
          0 1px 0 #fff inset,
          0 18px 26px -20px
            var(--result-border);
      }

      .paper-result::before {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 50%;
        content: "";
        background:
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.65),
            transparent
          );
      }

      .paper-result-a {
        --result-border: #8fb9e8;
        --result-bg: #e4f0fc;
        border-color: #8fb9e8;
      }

      .paper-result-b {
        --result-border: #bfa9e8;
        --result-bg: #eee6fb;
        border-color: #bfa9e8;
      }

      .paper-result small,
      .paper-result b {
        position: relative;
        z-index: 1;
      }

      .paper-result small {
        display: block;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      .paper-result b {
        display: block;
        margin-top: 3px;
        overflow-wrap: anywhere;
        font-size: 18px;
        font-weight: 800;
      }

      .comparison-title-card {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
        overflow: hidden;
        margin-bottom: 22px;
        padding: 18px 24px;
        border: 2px dashed #e9bf6a;
        border-radius: 22px;
        background:
          linear-gradient(
            180deg,
            #fffdf5,
            #fff7e0
          );
        box-shadow:
          0 18px 26px -22px
            #d9a21f;
      }

      .scale-icon {
        display: grid;
        width: 48px;
        height: 48px;
        flex: none;
        place-items: center;
        border-radius: 14px;
        background: #ffffff;
        box-shadow:
          0 1px 0 #fff inset,
          0 8px 14px -9px
            rgba(180, 130, 50, 0.6);
        font-size: 26px;
      }

      .comparison-title-card h2 {
        margin: 0;
        font-family:
          Fraunces,
          Georgia,
          serif;
        font-size: 23px;
      }

      .comparison-title-card p {
        margin: 4px 0 0;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      /* -----------------------------------------
         COMPARISON SECTIONS
      ----------------------------------------- */

      .comparison-section {
        position: relative;
        overflow: hidden;
        margin-bottom: 20px;
        padding: 18px 22px 20px;
        border: 2.5px solid var(--section-border);
        border-radius: 22px;
        background:
          linear-gradient(
            180deg,
            #ffffff,
            var(--section-bg)
          );
        box-shadow:
          0 1px 0 #fff inset,
          0 0 0 4px var(--section-glow),
          0 24px 34px -26px
            var(--section-border);
        animation:
          comparePop 0.5s
          cubic-bezier(
            0.2,
            0.9,
            0.3,
            1.15
          )
          both;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }

      .comparison-section:hover {
        transform: translateY(-3px);
      }

      .comparison-section.theme-blue {
        --section-border: #6ea3da;
        --section-bg: #eef5fd;
        --section-inner: #d9e8f8;
        --section-glow: rgba(
          110,
          163,
          218,
          0.22
        );
      }

      .comparison-section.theme-purple {
        --section-border: #a58fd8;
        --section-bg: #f4effc;
        --section-inner: #e4dbf8;
        --section-glow: rgba(
          165,
          143,
          216,
          0.22
        );
      }

      .comparison-section.theme-orange {
        --section-border: #e6a066;
        --section-bg: #fff3e8;
        --section-inner: #fddcc4;
        --section-glow: rgba(
          230,
          160,
          102,
          0.24
        );
      }

      .comparison-section.theme-coral {
        --section-border: #e48888;
        --section-bg: #fff1f0;
        --section-inner: #fadada;
        --section-glow: rgba(
          228,
          136,
          136,
          0.22
        );
      }

      .comparison-section.theme-blue-dashed {
        --section-border: #6ea3da;
        --section-bg: #eef5fd;
        --section-inner: #d9e8f8;
        --section-glow: rgba(
          110,
          163,
          218,
          0.22
        );
        border-style: dashed;
      }

      .comparison-section.theme-rose {
        --section-border: #e07a92;
        --section-bg: #fff0f4;
        --section-inner: #fbd6df;
        --section-glow: rgba(
          224,
          122,
          146,
          0.24
        );
      }

      .section-gloss {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 40%;
        pointer-events: none;
        background:
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.7),
            transparent
          );
      }

      .section-heading {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 58px;
        margin-bottom: 12px;
        padding-right: 100px;
      }

      .section-icon {
        display: grid;
        width: 44px;
        height: 44px;
        flex: none;
        place-items: center;
        border-radius: 13px;
        background:
          linear-gradient(
            180deg,
            #ffffff,
            var(--section-inner)
          );
        box-shadow:
          0 1px 0 #fff inset,
          0 6px 10px -6px
            var(--section-border);
        font-size: 22px;
      }

      .section-heading h3 {
        margin: 0;
        font-family:
          Fraunces,
          Georgia,
          serif;
        font-size: 19px;
        font-weight: 700;
      }

      .section-heading p {
        margin: 2px 0 0;
        color: var(--muted);
        font-size: 12.5px;
        font-weight: 700;
      }

      .section-body {
        position: relative;
        z-index: 2;
        border: 1px solid
          rgba(255, 255, 255, 0.9);
        border-radius: 14px;
        padding: 16px 18px;
        background:
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.55),
            var(--section-inner)
          );
        box-shadow:
          0 1px 0 #fff inset;
      }

      .section-body p {
        margin: 0;
        color: #2f2d46;
        font-size: 14.5px;
        font-weight: 600;
        line-height: 1.65;
        white-space: pre-line;
      }

      @keyframes comparePop {
        from {
          opacity: 0;
          transform:
            translateY(16px)
            scale(0.97);
        }

        to {
          opacity: 1;
          transform:
            translateY(0)
            scale(1);
        }
      }

      /* -----------------------------------------
         SECTION ART
      ----------------------------------------- */

      .section-art {
        position: absolute;
        top: 10px;
        right: 18px;
        z-index: 3;
        width: 84px;
        height: 72px;
        filter:
          drop-shadow(
            0 6px 5px
            rgba(0, 0, 0, 0.12)
          );
      }

      .clip-art {
        position: absolute;
        width: 21px;
        height: 50px;
        border: 5px solid;
        border-radius: 0 0 14px 14px;
        border-top: 0;
        transform: rotate(1deg);
      }

      .clip-art::after {
        position: absolute;
        top: -8px;
        left: 3px;
        width: 9px;
        height: 32px;
        content: "";
        border: 4px solid currentColor;
        border-bottom: 0;
        border-radius: 10px 10px 0 0;
      }

      .clip-art.pink {
        left: 20px;
        top: 13px;
        color: #f08cb0;
      }

      .clip-art.coral {
        left: 49px;
        top: 16px;
        color: #f26a63;
      }

      .characters-art {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        font-size: 42px;
      }

      .characters-art span:first-child {
        transform: translateY(5px);
      }

      .characters-art span:last-child {
        transform: translateY(-3px);
      }

      .gear-art {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        font-size: 35px;
      }

      .gear-art span:first-child {
        transform: rotate(-15deg);
      }

      .gear-art span:last-child {
        margin-left: -12px;
        transform:
          translateY(-16px)
          scale(0.65);
      }

      .database-art {
        display: grid;
        place-items: center;
        color: #6a8cc0;
        font-size: 48px;
      }

      .chart-art {
        position: absolute;
        right: 15px;
        bottom: 5px;
        left: 10px;
        display: flex;
        align-items: flex-end;
        gap: 7px;
        height: 62px;
        padding: 0 5px 4px;
        border-bottom: 3px solid #5a7aa8;
        border-left: 3px solid #5a7aa8;
      }

      .chart-art .bar {
        width: 11px;
        border-radius: 3px 3px 0 0;
        background:
          linear-gradient(
            180deg,
            #7fc0ef,
            #4f98dc
          );
      }

      .bar-one {
        height: 20px;
      }

      .bar-two {
        height: 34px;
      }

      .bar-three {
        height: 48px;
      }

      .chart-line {
        position: absolute;
        right: -1px;
        bottom: 23px;
        left: 0;
        height: 3px;
        background: #f26a63;
        transform:
          rotate(-18deg)
          translateY(-2px);
        transform-origin: left center;
      }

      .brain-art {
        display: grid;
        place-items: center;
        font-size: 49px;
      }

      .brain-art span {
        position: absolute;
        right: 0;
        bottom: 3px;
        font-size: 25px;
      }

      /* -----------------------------------------
         ERROR
      ----------------------------------------- */

      .error-card {
        display: flex;
        align-items: center;
        gap: 16px;
        border: 1.5px solid #e8aaaa;
        border-radius: 20px;
        padding: 22px;
        background:
          linear-gradient(
            180deg,
            #fff5f4,
            #ffeceb
          );
        box-shadow:
          0 20px 30px -25px
            rgba(180, 70, 60, 0.6);
      }

      .error-icon {
        display: grid;
        width: 48px;
        height: 48px;
        flex: none;
        place-items: center;
        border-radius: 14px;
        background: #ffffff;
        font-size: 24px;
      }

      .error-card h2 {
        margin: 0;
        font-family:
          Fraunces,
          Georgia,
          serif;
        font-size: 20px;
      }

      .error-card p {
        margin: 4px 0 0;
        color: #a33a32;
        font-size: 13px;
        font-weight: 700;
      }

      /* -----------------------------------------
         RESPONSIVE
      ----------------------------------------- */

      @media (max-width: 900px) {
        .compare-container {
          width: min(
            100% - 32px,
            1000px
          );
        }
      }

      @media (max-width: 700px) {
        .compare-header {
          padding: 16px;
        }

        .compare-container {
          width: calc(100% - 28px);
          padding-top: 16px;
        }

        .paper-picker {
          padding: 30px 18px 25px;
        }

        .paper-columns,
        .paper-result-pair {
          grid-template-columns: 1fr;
        }

        .section-heading {
          padding-right: 0;
        }

        .section-art {
          display: none;
        }

        .comparison-title-card {
          align-items: flex-start;
          padding: 18px;
        }

        .comparison-title-card h2 {
          font-size: 20px;
        }

        .paper-result b {
          font-size: 16px;
        }
      }

      @media (max-width: 480px) {
        .compare-header h1 {
          font-size: 24px;
        }

        .compare-header p {
          font-size: 12.5px;
        }

        .paper-picker {
          border-radius: 21px;
        }

        .picker-heading h2 {
          font-size: 19px;
        }

        .glossy-compare-button {
          width: 100%;
          padding: 13px 18px;
        }

        .comparison-section {
          padding: 16px;
          border-radius: 19px;
        }

        .section-heading {
          gap: 9px;
        }

        .section-icon {
          width: 40px;
          height: 40px;
          font-size: 19px;
        }

        .section-heading h3 {
          font-size: 17px;
        }

        .section-heading p {
          font-size: 11.5px;
        }

        .section-body {
          padding: 14px;
        }

        .section-body p {
          font-size: 13.5px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .compare-page *,
        .compare-page *::before,
        .compare-page *::after {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  );
}