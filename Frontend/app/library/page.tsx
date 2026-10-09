"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { deletePaper, getPapers } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

import type { Paper } from "@/types/paper";

type SortOrder = "newest" | "oldest" | "az";

const PAPER_THEMES = [
  {
    bg1: "#eef7ff",
    bg2: "#d9e9fb",
    bd: "#8fb6e6",
    glow: "rgba(91,143,214,.28)",
    btn1: "#d9e9fb",
    btn2: "#b9d3f0",
    btnbd: "#7ca3d3",
    ac: "#31577f",
  },
  {
    bg1: "#fff9df",
    bg2: "#f7e9a9",
    bd: "#d6bc58",
    glow: "rgba(214,188,88,.28)",
    btn1: "#f7edb9",
    btn2: "#e8d579",
    btnbd: "#c5a93f",
    ac: "#665719",
  },
  {
    bg1: "#f5efff",
    bg2: "#e2d5f7",
    bd: "#a894e0",
    glow: "rgba(168,148,224,.28)",
    btn1: "#e6dbf7",
    btn2: "#cdb9eb",
    btnbd: "#9a82cc",
    ac: "#59477e",
  },
  {
    bg1: "#fff0f3",
    bg2: "#f8d5dd",
    bd: "#e49baa",
    glow: "rgba(228,155,170,.28)",
    btn1: "#f8d9df",
    btn2: "#efb5c0",
    btnbd: "#d78999",
    ac: "#773b48",
  },
  {
    bg1: "#ecfaf1",
    bg2: "#d1eddc",
    bd: "#86bd99",
    glow: "rgba(134,189,153,.28)",
    btn1: "#d8efdf",
    btn2: "#b7dfc3",
    btnbd: "#78ad8c",
    ac: "#356347",
  },
  {
    bg1: "#fff2e6",
    bg2: "#f6d8b8",
    bd: "#dda36e",
    glow: "rgba(221,163,110,.28)",
    btn1: "#f8dec2",
    btn2: "#edc096",
    btnbd: "#ce8d58",
    ac: "#754b2d",
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[26px] w-[26px]"
      fill="none"
    >
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="#d5efd9"
        stroke="#4f9d6c"
        strokeWidth="1.8"
      />
      <circle cx="8" cy="9" r="1" fill="#2d6b46" />
      <circle cx="12" cy="9" r="1" fill="#2d6b46" />
      <path
        d="M8 12q2 1.8 4 0"
        stroke="#2d6b46"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M15.5 15.5L21 21"
        stroke="#c98a4a"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AuthorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[26px] w-[26px]"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="#d5efd9"
        stroke="#4f9d6c"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="9.5"
        r="3.8"
        fill="#8fd1a0"
        stroke="#3f8a58"
        strokeWidth="1.2"
      />
      <path
        d="M5 20q7-9 14 0"
        fill="#8fd1a0"
        stroke="#3f8a58"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function BookArt({
  index,
}: {
  index: number;
}) {
  const common = {
    viewBox: "0 0 90 100",
    className:
      "pointer-events-none absolute right-6 top-[58px] h-[96px] w-[88px] drop-shadow-[0_8px_6px_rgba(0,0,0,.14)]",
  };

  if (index === 0) {
    return (
      <svg {...common}>
        <line
          x1="45"
          y1="6"
          x2="45"
          y2="15"
          stroke="#7f93b5"
          strokeWidth="2.5"
        />
        <circle cx="45" cy="5" r="3.5" fill="#f5a623" />
        <circle
          cx="45"
          cy="34"
          r="21"
          fill="#fff"
          stroke="#7f93b5"
          strokeWidth="2.2"
        />
        <rect
          x="31"
          y="24"
          width="28"
          height="19"
          rx="9"
          fill="#1e3a8a"
        />
        <path
          d="M37 33q2-3 4 0M49 33h5"
          stroke="#38d5ff"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="38"
          cy="22"
          rx="8"
          ry="3"
          fill="#fff"
          opacity=".8"
        />
        <rect
          x="29"
          y="58"
          width="32"
          height="24"
          rx="12"
          fill="#fff"
          stroke="#7f93b5"
          strokeWidth="2.2"
        />
        <rect
          x="14"
          y="66"
          width="30"
          height="24"
          rx="4"
          fill="#5b8fd6"
          stroke="#35609c"
          strokeWidth="2"
        />
        <rect
          x="46"
          y="66"
          width="30"
          height="24"
          rx="4"
          fill="#7aa6e6"
          stroke="#35609c"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg {...common}>
        <rect
          x="12"
          y="72"
          width="70"
          height="16"
          rx="3"
          fill="#e46f78"
          stroke="#8c3b44"
          strokeWidth="2"
        />
        <rect
          x="18"
          y="56"
          width="62"
          height="16"
          rx="3"
          fill="#f2b45a"
          stroke="#97651c"
          strokeWidth="2"
        />
        <rect
          x="10"
          y="40"
          width="64"
          height="16"
          rx="3"
          fill="#e9d46a"
          stroke="#8d7a1d"
          strokeWidth="2"
        />
        <rect
          x="20"
          y="24"
          width="56"
          height="16"
          rx="3"
          fill="#8bc58d"
          stroke="#3f7a42"
          strokeWidth="2"
        />
        <rect
          x="26"
          y="9"
          width="48"
          height="15"
          rx="3"
          fill="#6aa3d9"
          stroke="#2f5f93"
          strokeWidth="2"
        />
        <g stroke="#fff" strokeWidth="2" opacity=".7">
          <path d="M20 80h50" />
          <path d="M26 64h48" />
          <path d="M18 48h48" />
          <path d="M28 32h40" />
        </g>
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg {...common}>
        <g stroke="#7a62b8" strokeWidth="3" fill="none">
          <path d="M45 50L20 26M45 50l30-12M45 50l-8 38" />
        </g>
        <g stroke="#fff" strokeWidth="2">
          <circle cx="45" cy="50" r="15" fill="#a894e0" />
          <circle cx="20" cy="26" r="9" fill="#c4b6ee" />
          <circle cx="76" cy="38" r="9" fill="#c4b6ee" />
          <circle cx="36" cy="88" r="8" fill="#b8a8ea" />
        </g>
        <ellipse
          cx="40"
          cy="44"
          rx="6"
          ry="3"
          fill="#fff"
          opacity=".7"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect
        x="8"
        y="14"
        width="74"
        height="54"
        rx="8"
        fill="#e4eaf4"
        stroke="#6a7a96"
        strokeWidth="2.5"
      />
      <rect
        x="14"
        y="20"
        width="62"
        height="42"
        rx="5"
        fill="#6ec3ec"
      />
      <path
        d="M26 38q4-5 8 0M52 38l8 0"
        stroke="#17445f"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M38 48q7 6 14 0"
        stroke="#17445f"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx="24"
        cy="48"
        r="4"
        fill="#f6a5b5"
        opacity=".8"
      />
      <circle
        cx="66"
        cy="48"
        r="4"
        fill="#f6a5b5"
        opacity=".8"
      />
      <path
        d="M14 20h62l-4 8H18z"
        fill="#fff"
        opacity=".35"
      />
      <rect
        x="38"
        y="68"
        width="14"
        height="12"
        fill="#c7d0e0"
        stroke="#6a7a96"
        strokeWidth="2"
      />
      <rect
        x="26"
        y="80"
        width="38"
        height="8"
        rx="4"
        fill="#e4eaf4"
        stroke="#6a7a96"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function CornerDecoration({
  type,
}: {
  type: number;
}) {
  if (type === 3) {
    return (
      <>
        <div className="absolute left-3 right-3 top-[6px] h-4 opacity-70">
          <svg
            width="100%"
            height="16"
            viewBox="0 0 56 16"
            preserveAspectRatio="none"
          >
            <path
              d="M5 12a3 3 0 0 1 0-6 4 4 0 0 1 8-1 3 3 0 0 1 1 7z"
              fill="#fff"
              stroke="#9a82cc"
              strokeWidth="1.1"
            />
            <path
              d="M38 14c-6-4-8-7-5-10 2-2 4-1 5 1 1-2 3-3 5-1 3 3 1 6-5 10z"
              fill="#cdb9eb"
              stroke="#9a82cc"
              strokeWidth="1.1"
            />
          </svg>
        </div>

        <div className="absolute bottom-[6px] left-3 right-3 h-4 opacity-70">
          <svg
            width="100%"
            height="16"
            viewBox="0 0 56 16"
            preserveAspectRatio="none"
          >
            <path
              d="M5 12a3 3 0 0 1 0-6 4 4 0 0 1 8-1 3 3 0 0 1 1 7z"
              fill="#fff"
              stroke="#9a82cc"
              strokeWidth="1.1"
            />
            <path
              d="M38 14c-6-4-8-7-5-10 2-2 4-1 5 1 1-2 3-3 5-1 3 3 1 6-5 10z"
              fill="#cdb9eb"
              stroke="#9a82cc"
              strokeWidth="1.1"
            />
          </svg>
        </div>
      </>
    );
  }

  const symbol =
    type === 0
      ? "🐾"
      : type === 1
        ? "★"
        : "☾";

  return (
    <>
      <span className="absolute left-2 top-2 text-base opacity-75">
        {symbol}
      </span>
      <span className="absolute right-2 top-2 text-base opacity-75">
        {symbol}
      </span>
      <span className="absolute bottom-2 left-2 text-base opacity-75">
        {symbol}
      </span>
      <span className="absolute bottom-2 right-2 text-base opacity-75">
        {symbol}
      </span>
    </>
  );
}

export default function LibraryPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <LibraryContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function LibraryContent() {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("newest");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const loadPapers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getPapers(token);
        setPapers(data);
      } catch (error) {
        console.error("Failed to load papers:", error);
        setError("Unable to load your research papers.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPapers();
  }, [isAuthenticated, token]);

  const handleDelete = async (paperId: number) => {
    if (!token) {
      return;
    }

    const paper = papers.find(
      (item) => item.id === paperId
    );

    const confirmed = window.confirm(
      `Delete "${paper?.title ?? "this paper"}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePaper(token, paperId);

      setPapers((currentPapers) =>
        currentPapers.filter(
          (item) => item.id !== paperId
        )
      );
    } catch (error) {
      console.error("Failed to delete paper:", error);
      setError("Unable to delete the paper.");
    }
  };

  const availableYears = useMemo(() => {
    const years = papers.map((paper) =>
      new Date(paper.uploaded_at).getFullYear()
    );

    return Array.from(new Set(years)).sort(
      (a, b) => b - a
    );
  }, [papers]);

  const filteredAndSortedPapers = useMemo(() => {
    return [...papers]
      .filter((paper) =>
        paper.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .filter((paper) =>
        (paper.author ?? "")
          .toLowerCase()
          .includes(authorQuery.toLowerCase())
      )
      .filter((paper) => {
        if (selectedYear === "all") {
          return true;
        }

        return (
          new Date(
            paper.uploaded_at
          ).getFullYear() === Number(selectedYear)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "az") {
          return a.title.localeCompare(b.title);
        }

        const dateA = new Date(
          a.uploaded_at
        ).getTime();

        const dateB = new Date(
          b.uploaded_at
        ).getTime();

        return sortOrder === "newest"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [
    papers,
    searchQuery,
    authorQuery,
    selectedYear,
    sortOrder,
  ]);

  const hasActiveFilters =
    searchQuery ||
    authorQuery ||
    selectedYear !== "all";

  return (
    <div className="library-page">
      <style jsx>{`
        .library-page {
          --ink: #2a2430;
          --muted: #6c6475;
          --serif: "Fraunces", Georgia, "Times New Roman", serif;
          --sans:
            "Nunito", system-ui, -apple-system, "Segoe UI",
            sans-serif;

          min-height: 100vh;
          color: var(--ink);
          font-family: var(--sans);
          background:
            radial-gradient(
              circle at 50% 0%,
              #fffaf0,
              transparent 60%
            ),
            linear-gradient(
              180deg,
              #fbf5e8,
              #f8f0df
            );
        }

        .library-page *,
        .library-page *::before,
        .library-page *::after {
          box-sizing: border-box;
        }

        .library-doodle {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.42;
          z-index: 0;
        }

        .library-side {
          position: fixed;
          z-index: 0;
          pointer-events: none;
          width: 64px;
        }

        .library-side.s1 {
          left: 14px;
          top: 46%;
          color: #8fb6e6;
          transform: rotate(-7deg);
        }

        .library-side.s2 {
          left: 18px;
          top: 70%;
          color: #c9b6ea;
          transform: rotate(6deg);
        }

        .library-side.s3 {
          right: 14px;
          top: 30%;
          color: #f2b078;
          transform: rotate(8deg);
        }

        .library-top {
          position: relative;
          z-index: 1;
          padding: 26px 36px 20px;
          background:
            linear-gradient(
              180deg,
              #f3ead3,
              #f9f1de
            );
          border-bottom: 1px solid
            rgba(190, 170, 120, 0.25);
          box-shadow:
            0 10px 24px -20px
              rgba(120, 90, 30, 0.5);
        }

        .library-top h1 {
          margin: 0;
          font-family: var(--serif);
          font-weight: 700;
          font-size: clamp(26px, 3vw, 34px);
          letter-spacing: -0.4px;
        }

        .library-top p {
          margin: 4px 0 0;
          font-size: 14px;
          color: var(--muted);
          font-weight: 600;
        }

        .library-wrap {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          padding: 22px 36px 60px;
        }

        .library-filters {
          position: relative;
          display: grid;
          grid-template-columns:
            1.2fr 1.2fr 1fr 1fr;
          gap: 18px;
          padding: 22px 24px;
          border-radius: 24px;
          margin-bottom: 28px;
          overflow: hidden;
          background:
            linear-gradient(
              180deg,
              #d6efdc,
              #c4e4cd
            );
          border: 2px solid #9fcba9;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.8)
              inset,
            0 24px 36px -26px
              rgba(50, 120, 80, 0.6);
        }

        .library-filters::before {
          content: "";
          position: absolute;
          inset: 0 0 50% 0;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.5),
              transparent
            );
          pointer-events: none;
        }

        .filter-field {
          position: relative;
        }

        .filter-field label {
          display: block;
          font-family: var(--serif);
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 8px;
        }

        .filter-input-wrap {
          position: relative;
        }

        .filter-input-wrap svg {
          position: absolute;
          left: 10px;
          top: 50%;
          width: 26px;
          height: 26px;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .filter-input,
        .filter-select {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          border: 1.5px solid #b8cfbe;
          background:
            linear-gradient(
              180deg,
              #fff,
              #f4faf5
            );
          padding: 0 14px;
          font:
            600 15px var(--sans);
          color: var(--ink);
          outline: none;
          box-shadow:
            0 1px 0 #fff inset,
            0 8px 12px -10px
              rgba(40, 100, 70, 0.55);
          transition:
            border-color 0.15s,
            box-shadow 0.15s;
        }

        .filter-input {
          padding-left: 46px;
        }

        .filter-select {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          padding-right: 38px;
        }

        .select-field::after {
          content: "⌄";
          position: absolute;
          right: 14px;
          bottom: 8px;
          font-size: 20px;
          color: #4d6b57;
          pointer-events: none;
        }

        .filter-input:focus,
        .filter-select:focus {
          border-color: #4f9d6c;
          box-shadow:
            0 0 0 3px
              rgba(79, 157, 108, 0.22);
        }

        .library-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 26px;
        }

        .paper-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 215px;
          padding: 20px 24px 18px;
          border-radius: 26px;
          overflow: hidden;
          border: 2.5px solid
            var(--paper-border);
          background:
            linear-gradient(
              180deg,
              var(--paper-bg1),
              var(--paper-bg2)
            );
          box-shadow:
            0 1px 0
              rgba(255, 255, 255, 0.9)
              inset,
            0 0 0 4px
              var(--paper-glow),
            0 26px 36px -26px
              var(--paper-border),
            0 8px 14px
              rgba(60, 40, 20, 0.05);
          animation:
            paperPop 0.4s
              cubic-bezier(
                0.2,
                0.9,
                0.3,
                1.2
              )
              both;
          transition:
            transform 0.22s,
            box-shadow 0.22s;
        }

        .paper-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 1px 0
              rgba(255, 255, 255, 0.9)
              inset,
            0 0 0 4px
              var(--paper-glow),
            0 34px 44px -26px
              var(--paper-border),
            0 10px 16px
              rgba(60, 40, 20, 0.07);
        }

        .paper-card::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 44%;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.6),
              transparent
            );
          pointer-events: none;
        }

        @keyframes paperPop {
          from {
            opacity: 0;
            transform:
              translateY(12px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform: none;
          }
        }

        .paper-card-content {
          position: relative;
        }

        .paper-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-top: 6px;
        }

        .paper-header h2 {
          margin: 0;
          font-family: var(--serif);
          font-weight: 700;
          font-size: 21px;
          letter-spacing: -0.2px;
          word-break: break-word;
          padding-right: 10px;
        }

        .paper-badge {
          flex: none;
          font:
            800 12px var(--sans);
          letter-spacing: 0.5px;
          padding: 5px 14px;
          border-radius: 999px;
          color: var(--paper-ac);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.7),
              var(--paper-btn1)
            );
          border: 1px solid
            var(--paper-btnbd);
          box-shadow:
            0 1px 0 #fff inset;
        }

        .paper-sub {
          margin: 6px 0 14px;
          font-size: 12.5px;
          color: var(--muted);
          font-weight: 700;
          word-break: break-word;
        }

        .paper-meta {
          max-width: calc(100% - 104px);
          min-height: 62px;
        }

        .paper-meta b {
          display: block;
          font-weight: 800;
          font-size: 14.5px;
          margin-bottom: 4px;
        }

        .paper-meta span {
          display: block;
          font-size: 14.5px;
          font-weight: 600;
          line-height: 1.45;
          word-break: break-word;
        }

        .paper-footer {
          position: relative;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1.5px solid
            color-mix(
              in srgb,
              var(--paper-border) 45%,
              transparent
            );
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .paper-footer small {
          font-size: 13px;
          font-weight: 700;
          color: #4c4455;
        }

        .paper-actions {
          display: flex;
          gap: 10px;
        }

        .paper-btn {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font:
            800 14px var(--sans);
          padding: 9px 16px;
          border-radius: 12px;
          color: var(--paper-ac);
          background:
            linear-gradient(
              180deg,
              var(--paper-btn1),
              var(--paper-btn2)
            );
          border: 1.5px solid
            var(--paper-btnbd);
          box-shadow:
            0 1px 0
              rgba(255, 255, 255, 0.8)
              inset,
            0 10px 14px -10px
              var(--paper-btnbd);
          transition:
            transform 0.15s,
            filter 0.2s;
        }

        .paper-btn::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 50%;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.5),
              transparent
            );
        }

        .paper-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        .paper-btn:active {
          transform: translateY(1px);
        }

        .paper-btn.delete {
          color: #7d2323;
          background:
            linear-gradient(
              180deg,
              #fbd0d0,
              #f19c9c
            );
          border-color: #c45e5e;
          box-shadow:
            0 1px 0
              rgba(255, 255, 255, 0.8)
              inset,
            0 10px 14px -10px
              #c45e5e;
        }

        .paper-btn svg {
          width: 16px;
          height: 16px;
          position: relative;
        }

        .empty-library {
          grid-column: 1 / -1;
          text-align: center;
          padding: 50px 20px;
          color: var(--muted);
          font-weight: 700;
          font-size: 17px;
          background:
            rgba(255, 255, 255, 0.6);
          border-radius: 22px;
          border: 2px dashed #d8c9a4;
        }

        .library-error {
          position: relative;
          z-index: 2;
          margin-bottom: 22px;
          padding: 12px 16px;
          border-radius: 14px;
          border: 2px solid #e7a6a6;
          background: #fff0f0;
          color: #8a3030;
          font-size: 14px;
          font-weight: 700;
        }

        .library-loading {
          grid-column: 1 / -1;
          text-align: center;
          padding: 50px 20px;
          color: var(--muted);
          font-weight: 700;
          font-size: 17px;
          background:
            rgba(255, 255, 255, 0.6);
          border-radius: 22px;
          border: 2px dashed #d8c9a4;
        }

        .filter-count {
          margin: 12px 0 0;
          font-size: 12px;
          color: var(--muted);
          font-weight: 700;
        }

        @media (max-width: 1250px) {
          .library-side {
            display: none;
          }
        }

        @media (max-width: 980px) {
          .library-filters {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 760px) {
          .library-grid {
            grid-template-columns: 1fr;
          }

          .library-wrap {
            padding: 18px 16px 50px;
          }

          .library-top {
            padding: 20px 16px 16px;
          }

          .library-filters {
            grid-template-columns: 1fr;
          }

          .paper-meta {
            max-width: calc(100% - 96px);
          }

          .paper-footer {
            align-items: flex-start;
          }

          .paper-actions {
            width: 100%;
          }

          .paper-btn {
            flex: 1;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .library-page * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Decorative background */}
      <svg
        className="library-doodle"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {Array.from({
          length: 70,
        }).map((_, index) => {
          const x =
            (index % 10) * 120 +
            ((index * 37) % 70) +
            20;

          const y =
            Math.floor(index / 10) * 115 +
            ((index * 19) % 60) +
            14;

          const rotate =
            ((index * 43) % 50) - 25;

          const size =
            18 + ((index * 17) % 16);

          const type =
            index % 7;

          const color =
            [
              "#e9c6a0",
              "#f2d27a",
              "#b9c7e8",
              "#d9b6c8",
              "#a9d2b4",
            ][index % 5];

          if (type === 0) {
            return (
              <text
                key={index}
                x={x}
                y={y}
                fill={color}
                fontSize={size}
                transform={`rotate(${rotate} ${x} ${y})`}
              >
                ♥
              </text>
            );
          }

          if (type === 1) {
            return (
              <text
                key={index}
                x={x}
                y={y}
                fill={color}
                fontSize={size}
                transform={`rotate(${rotate} ${x} ${y})`}
              >
                ★
              </text>
            );
          }

          if (type === 2) {
            return (
              <text
                key={index}
                x={x}
                y={y}
                fill="none"
                stroke={color}
                strokeWidth="2"
                fontSize={size}
                transform={`rotate(${rotate} ${x} ${y})`}
              >
                ☁
              </text>
            );
          }

          if (type === 3) {
            return (
              <text
                key={index}
                x={x}
                y={y}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                fontSize={size}
                transform={`rotate(${rotate} ${x} ${y})`}
              >
                ♧
              </text>
            );
          }

          return (
            <text
              key={index}
              x={x}
              y={y}
              fill={color}
              fontSize={size}
              transform={`rotate(${rotate} ${x} ${y})`}
            >
              {type === 4
                ? "✦"
                : type === 5
                  ? "☾"
                  : "♥"}
            </text>
          );
        })}
      </svg>

      {/* Side books */}
      <div className="library-side s1">
        📘
      </div>

      <div className="library-side s2">
        📕
      </div>

      <div className="library-side s3">
        📙
      </div>

      {/* Header */}
      <header className="library-top">
        <h1>Paper Library</h1>

        <p>
          View and manage your uploaded research papers.
        </p>
      </header>

      <div className="library-wrap">
        {error && (
          <div className="library-error">
            {error}
          </div>
        )}

        {/* Filters */}
        {!isLoading && papers.length > 0 && (
          <section
            className="library-filters"
            aria-label="Filters"
          >
            <div className="filter-field">
              <label htmlFor="paper-search">
                Search by title
              </label>

              <div className="filter-input-wrap">
                <SearchIcon />

                <input
                  id="paper-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search papers..."
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-field">
              <label htmlFor="author-search">
                Search by author
              </label>

              <div className="filter-input-wrap">
                <AuthorIcon />

                <input
                  id="author-search"
                  type="search"
                  value={authorQuery}
                  onChange={(event) =>
                    setAuthorQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search authors..."
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-field select-field">
              <label htmlFor="year-filter">
                Filter by year
              </label>

              <select
                id="year-filter"
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(
                    event.target.value
                  )
                }
                className="filter-select"
              >
                <option value="all">
                  All years
                </option>

                {availableYears.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field select-field">
              <label htmlFor="sort-order">
                Sort by date
              </label>

              <select
                id="sort-order"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value as SortOrder
                  )
                }
                className="filter-select"
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="oldest">
                  Oldest first
                </option>

                <option value="az">
                  Title A–Z
                </option>
              </select>
            </div>

            {hasActiveFilters && (
              <p className="filter-count">
                Showing{" "}
                {filteredAndSortedPapers.length}{" "}
                {filteredAndSortedPapers.length === 1
                  ? "paper"
                  : "papers"}
              </p>
            )}
          </section>
        )}

        {/* Paper grid */}
        <section className="library-grid">
          {isLoading ? (
            <div className="library-loading">
              Loading your papers...
            </div>
          ) : papers.length === 0 ? (
            <div className="empty-library">
              No papers yet. Upload your first PDF to
              see it here.
            </div>
          ) : filteredAndSortedPapers.length ===
            0 ? (
            <div className="empty-library">
              <div>
                No papers match your filters.
              </div>

              <button
                type="button"
                className="paper-btn"
                style={{
                  marginTop: 18,
                  color: "#31577f",
                  background:
                    "linear-gradient(180deg,#d9e9fb,#b9d3f0)",
                  borderColor: "#7ca3d3",
                }}
                onClick={() => {
                  setSearchQuery("");
                  setAuthorQuery("");
                  setSelectedYear("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredAndSortedPapers.map(
              (paper, index) => {
                const originalIndex =
                  papers.findIndex(
                    (item) =>
                      item.id === paper.id
                  );

                const artIndex =
                  originalIndex % 4;

                const theme =
                  PAPER_THEMES[
                    originalIndex %
                      PAPER_THEMES.length
                  ];

                return (
                  <article
                    key={paper.id}
                    className="paper-card"
                    style={
                      {
                        "--paper-bg1":
                          theme.bg1,
                        "--paper-bg2":
                          theme.bg2,
                        "--paper-border":
                          theme.bd,
                        "--paper-glow":
                          theme.glow,
                        "--paper-btn1":
                          theme.btn1,
                        "--paper-btn2":
                          theme.btn2,
                        "--paper-btnbd":
                          theme.btnbd,
                        "--paper-ac":
                          theme.ac,
                        animationDelay: `${
                          index * 50
                        }ms`,
                      } as React.CSSProperties
                    }
                  >
                    <CornerDecoration
                      type={artIndex}
                    />

                    <BookArt
                      index={artIndex}
                    />

                    <div className="paper-card-content">
                      <div className="paper-header">
                        <h2>
                          {paper.title}
                        </h2>

                        <span className="paper-badge">
                          PDF
                        </span>
                      </div>

                      <div className="paper-sub">
                        {paper.filename}
                      </div>

                      <div className="paper-meta">
                        <b>Author</b>

                        <span>
                          {paper.author ||
                            "Author not detected"}
                        </span>
                      </div>
                    </div>

                    <div className="paper-footer">
                      <small>
                        Uploaded{" "}
                        {new Date(
                          paper.uploaded_at
                        ).toLocaleDateString(
                          "en-US"
                        )}
                      </small>

                      <div className="paper-actions">
                        <a
                          href={`/library/${paper.id}`}
                          className="paper-btn"
                        >
                          View Summary

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {artIndex === 0 && (
                              <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
                            )}

                            {artIndex === 1 && (
                              <path d="M6 3h12v18H6zM9 8h6M9 12h6" />
                            )}

                            {artIndex === 2 && (
                              <path d="M4 6h16M4 12h16M4 18h10" />
                            )}

                            {artIndex === 3 && (
                              <path d="M5 4h14v16H5zM9 9h6M9 13h4" />
                            )}
                          </svg>
                        </a>

                        <button
                          type="button"
                          className="paper-btn delete"
                          onClick={() =>
                            handleDelete(
                              paper.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )
          )}
        </section>
      </div>
    </div>
  );
}