"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  FlaskConical,
  Lightbulb,
  Network,
  PenLine,
  Star,
  Trash2,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import {
  deletePaper,
  getPapers,
  uploadPaper,
} from "@/lib/api";
import type { Paper } from "@/types/paper";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

const PAPER_PALETTE = [
  {
    background:
      "linear-gradient(180deg, #eaf5ff, #dcecfc)",
    border: "#9fd2f7",
  },
  {
    background:
      "linear-gradient(180deg, #e8f8e6, #d8f0d5)",
    border: "#9edb9a",
  },
  {
    background:
      "linear-gradient(180deg, #fff7d6, #fdefb8)",
    border: "#f3d672",
  },
  {
    background:
      "linear-gradient(180deg, #ffe7e7, #fcd6d6)",
    border: "#f2a4a4",
  },
  {
    background:
      "linear-gradient(180deg, #f1eafd, #e5dafa)",
    border: "#c3aaf0",
  },
  {
    background:
      "linear-gradient(180deg, #ffeedd, #fddcc0)",
    border: "#f6bd8d",
  },
];

const PAPER_ICONS = [
  FileText,
  Network,
  PenLine,
  Star,
];

function PaperDoodles() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="softDoodle">
          <feGaussianBlur
            stdDeviation="0.2"
          />
        </filter>
      </defs>

      <g
        opacity="0.45"
        filter="url(#softDoodle)"
      >
        {/* Book */}
        <g
          transform="translate(110 105) rotate(-12) scale(1.5)"
          fill="#cdf0e1"
          stroke="#2fa37a"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M-12 -8q6-3 12 2q6-5 12-2v16q-6-3-12 2q-6-5-12-2z" />
          <path d="M0 -6v16" />
        </g>

        {/* Light bulb */}
        <g
          transform="translate(360 190) rotate(18) scale(1.4)"
          fill="#ffeaa0"
          stroke="#e0a800"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0-12a8 8 0 0 0-4 15v4h8v-4a8 8 0 0 0-4-15z" />
          <path d="M-3 10h6" />
        </g>

        {/* Flask */}
        <g
          transform="translate(710 100) rotate(-10) scale(1.45)"
          fill="#e3d6fa"
          stroke="#8a63d2"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M-4-12h8" />
          <path d="M-3-12v9l-8 14h22l-8-14v-9" />
        </g>

        {/* Star */}
        <g
          transform="translate(1000 200) rotate(15) scale(1.3)"
          fill="#ffd3de"
          stroke="#e66a8a"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0-10l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" />
        </g>

        {/* Document */}
        <g
          transform="translate(180 430) rotate(8) scale(1.5)"
          fill="#cfe4fb"
          stroke="#4a90e2"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M-7-12h7l6 6v18H-7z" />
          <path d="M0-12v6h6" />
          <path d="M-3 2h6M-3 6h6" />
        </g>

        {/* Network */}
        <g
          transform="translate(470 520) rotate(-12) scale(1.3)"
          fill="#cdf0e1"
          stroke="#2fa37a"
          strokeWidth="1.4"
        >
          <circle cx="0" cy="0" r="3" />
          <circle cx="0" cy="-12" r="2" />
          <circle cx="12" cy="-5" r="2" />
          <circle cx="9" cy="9" r="2" />
          <circle cx="-9" cy="9" r="2" />
          <circle cx="-12" cy="-5" r="2" />

          <path
            d="M0-3V-10M3-1l7-3M2 3l6 5M-2 3l-6 5M-3-1l-7-3"
            fill="none"
          />
        </g>

        {/* Another bulb */}
        <g
          transform="translate(850 500) rotate(20) scale(1.5)"
          fill="#ffeaa0"
          stroke="#e0a800"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0-12a8 8 0 0 0-4 15v4h8v-4a8 8 0 0 0-4-15z" />
          <path d="M-3 10h6" />
        </g>

        {/* Flask */}
        <g
          transform="translate(1080 650) rotate(-18) scale(1.4)"
          fill="#e3d6fa"
          stroke="#8a63d2"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M-4-12h8" />
          <path d="M-3-12v9l-8 14h22l-8-14v-9" />
        </g>

        {/* Star */}
        <g
          transform="translate(560 730) rotate(12) scale(1.2)"
          fill="#ffd3de"
          stroke="#e66a8a"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0-10l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" />
        </g>
      </g>
    </svg>
  );
}

function ResearchRobot() {
  return (
    <svg
      className="pointer-events-none absolute -top-2 left-1/2 z-20 hidden w-[74px] -translate-x-1/2 -translate-y-full animate-[float_3.6s_ease-in-out_infinite] drop-shadow-[0_10px_8px_rgba(40,70,140,0.25)] sm:block"
      viewBox="0 0 80 100"
      aria-hidden="true"
    >
      <line
        x1="40"
        y1="6"
        x2="40"
        y2="16"
        stroke="#9db3d6"
        strokeWidth="3"
      />

      <circle
        cx="40"
        cy="5"
        r="4"
        fill="#3b8df0"
      />

      <rect
        x="14"
        y="16"
        width="52"
        height="40"
        rx="16"
        fill="#fff"
        stroke="#c3d2ea"
        strokeWidth="2"
      />

      <rect
        x="21"
        y="25"
        width="38"
        height="22"
        rx="10"
        fill="#1e3a8a"
      />

      <circle
        cx="33"
        cy="36"
        r="4"
        fill="#38d5ff"
      />

      <circle
        cx="47"
        cy="36"
        r="4"
        fill="#38d5ff"
      />

      <ellipse
        cx="30"
        cy="22"
        rx="10"
        ry="4"
        fill="white"
        opacity="0.75"
      />

      <rect
        x="20"
        y="60"
        width="40"
        height="30"
        rx="12"
        fill="#fff"
        stroke="#c3d2ea"
        strokeWidth="2"
      />

      <circle
        cx="40"
        cy="75"
        r="5"
        fill="#bfdbfe"
      />

      <path
        d="M20 68Q8 72 10 84M60 68Q72 72 70 84"
        fill="none"
        stroke="#c3d2ea"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DecorativeVines() {
  return (
    <>
      <div className="pointer-events-none absolute left-[14px] right-[14px] top-2 h-[14px] opacity-80">
        <svg
          width="100%"
          height="14"
          preserveAspectRatio="none"
          viewBox="0 0 480 14"
        >
          <path
            d="M0 7Q6 0 12 7T24 7T36 7T48 7T60 7T72 7T84 7T96 7T108 7T120 7T132 7T144 7T156 7T168 7T180 7T192 7T204 7T216 7T228 7T240 7T252 7T264 7T276 7T288 7T300 7T312 7T324 7T336 7T348 7T360 7T372 7T384 7T396 7T408 7T420 7T432 7T444 7T456 7T480 7"
            fill="none"
            stroke="#7c8196"
            strokeWidth="1.1"
          />

          {Array.from({
            length: 10,
          }).map((_, index) => (
            <ellipse
              key={index}
              cx={24 + index * 48}
              cy={index % 2 === 0 ? 3 : 11}
              rx="2.6"
              ry="1.3"
              fill="#b4c4a6"
              transform={`rotate(${
                index % 2 === 0 ? -30 : 30
              } ${24 + index * 48} ${
                index % 2 === 0 ? 3 : 11
              })`}
            />
          ))}
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-[14px] right-[14px] h-[14px] rotate-180 opacity-80">
        <svg
          width="100%"
          height="14"
          preserveAspectRatio="none"
          viewBox="0 0 480 14"
        >
          <path
            d="M0 7Q6 0 12 7T24 7T36 7T48 7T60 7T72 7T84 7T96 7T108 7T120 7T132 7T144 7T156 7T168 7T180 7T192 7T204 7T216 7T228 7T240 7T252 7T264 7T276 7T288 7T300 7T312 7T324 7T336 7T348 7T360 7T372 7T384 7T396 7T408 7T420 7T432 7T444 7T456 7T480 7"
            fill="none"
            stroke="#7c8196"
            strokeWidth="1.1"
          />

          {Array.from({
            length: 10,
          }).map((_, index) => (
            <ellipse
              key={index}
              cx={24 + index * 48}
              cy={index % 2 === 0 ? 3 : 11}
              rx="2.6"
              ry="1.3"
              fill="#b4c4a6"
            />
          ))}
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-[22px] left-2 top-[22px] w-[14px] opacity-80">
        <svg
          width="14"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 14 480"
        >
          <path
            d="M7 0Q0 6 7 12T7 24T7 36T7 48T7 60T7 72T7 84T7 96T7 108T7 120T7 132T7 144T7 156T7 168T7 180T7 192T7 204T7 216T7 228T7 240T7 252T7 264T7 276T7 288T7 300T7 312T7 324T7 336T7 348T7 360T7 372T7 384T7 396T7 408T7 420T7 432T7 444T7 456T7 480"
            fill="none"
            stroke="#7c8196"
            strokeWidth="1.1"
          />

          {Array.from({
            length: 10,
          }).map((_, index) => (
            <ellipse
              key={index}
              cx={index % 2 === 0 ? 3 : 11}
              cy={24 + index * 48}
              rx="1.3"
              ry="2.6"
              fill="#b4c4a6"
            />
          ))}
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-[22px] right-2 top-[22px] w-[14px] opacity-80">
        <svg
          width="14"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 14 480"
        >
          <path
            d="M7 0Q0 6 7 12T7 24T7 36T7 48T7 60T7 72T7 84T7 96T7 108T7 120T7 132T7 144T7 156T7 168T7 180T7 192T7 204T7 216T7 228T7 240T7 252T7 264T7 276T7 288T7 300T7 312T7 324T7 336T7 348T7 360T7 372T7 384T7 396T7 408T7 420T7 432T7 444T7 456T7 480"
            fill="none"
            stroke="#7c8196"
            strokeWidth="1.1"
          />

          {Array.from({
            length: 10,
          }).map((_, index) => (
            <ellipse
              key={index}
              cx={index % 2 === 0 ? 3 : 11}
              cy={24 + index * 48}
              rx="1.3"
              ry="2.6"
              fill="#b4c4a6"
            />
          ))}
        </svg>
      </div>
    </>
  );
}

export default function UploadPage() {
  const token = useAuthStore(
    (state) => state.token
  );

  const initialized = useAuthStore(
    (state) => state.initialized
  );

  const [files, setFiles] = useState<File[]>(
    []
  );

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [papers, setPapers] =
    useState<Paper[]>([]);

  const [dragging, setDragging] =
    useState(false);

  useEffect(() => {
    if (!initialized || !token) {
      return;
    }

    async function loadPapers() {
      try {
        const data = await getPapers(token);
        setPapers(data);
      } catch (error) {
        console.error(
          "Failed to load papers:",
          error
        );
      }
    }

    loadPapers();
  }, [initialized, token]);

  async function handleUpload() {
  if (
    files.length === 0 ||
    !token
  ) {
    return;
  }

  setUploading(true);
  setMessage("");

  try {
    const uploadedPapers: Paper[] = [];

    for (const file of files) {
      const paper = await uploadPaper(
        token,
        file
      );

      uploadedPapers.push(paper);
    }

    setPapers(
      (currentPapers) => [
        ...uploadedPapers,
        ...currentPapers,
      ]
    );

    setMessage(
      `${uploadedPapers.length} paper${
        uploadedPapers.length > 1
          ? "s"
          : ""
      } uploaded successfully. Processing in background...`
    );

    setFiles([]);
  } catch (error) {
    console.error(error);

    setMessage(
      "Upload failed. Please try again."
    );
  } finally {
    setUploading(false);
  }
}

  async function handleDelete(
    paperId: number
  ) {
    if (!token) {
      return;
    }

    try {
      await deletePaper(
        token,
        paperId
      );

      setPapers(
        (currentPapers) =>
          currentPapers.filter(
            (paper) =>
              paper.id !== paperId
          )
      );
    } catch (error) {
      console.error(
        "Failed to delete paper:",
        error
      );
    }
  }

  function chooseFiles(
    selectedFiles: File[]
  ) {
    const pdfFiles =
      selectedFiles.filter(
        (file) =>
          file.type ===
            "application/pdf" ||
          /\.pdf$/i.test(
            file.name
          )
      );

    setFiles(pdfFiles);
    setMessage("");
  }

  function formatSize(
    bytes: number
  ) {
    if (
      bytes >=
      1024 * 1024
    ) {
      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${Math.max(
      1,
      Math.round(
        bytes / 1024
      )
    )} KB`;
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f0f5fc,#e4ecf8)]">
          <PaperDoodles />

          <main className="relative z-10 mx-auto w-full max-w-[1100px] px-4 pb-16 pt-4 sm:px-7">
            {/* Header */}
            <header className="sticky top-0 z-30 mb-6 flex flex-col gap-2 border-b border-[rgba(150,170,210,0.3)] bg-[linear-gradient(180deg,rgba(240,245,252,0.95),rgba(236,242,251,0.88))] px-1 py-4 shadow-[0_12px_22px_-18px_rgba(40,70,140,0.45)] backdrop-blur-md sm:py-5">
              <div>
                <h1 className="font-serif text-[30px] font-bold tracking-[-0.6px] text-[#0f1a2e] sm:text-[40px]">
                  Upload Research Paper
                </h1>

                <p className="mt-1 font-serif text-[15px] text-[#1d2a40] sm:text-[17px]">
                  Upload PDF files to your
                  ResearchLane library.
                </p>
              </div>
            </header>

            {/* Upload Card */}
            <section className="relative overflow-hidden rounded-[26px] border border-white/90 bg-[linear-gradient(115deg,#e6dcfa_0%,#dbe9fb_22%,#dcf3e6_42%,#fcf5cc_62%,#fddfd3_82%,#fbd8e6_100%)] px-4 py-6 shadow-[0_1px_0_#fff_inset,0_0_0_1px_rgba(150,165,205,0.35),0_30px_50px_-28px_rgba(60,80,150,0.55),0_8px_16px_rgba(40,60,120,0.06)] sm:px-7">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-white/55 to-transparent" />

              <DecorativeVines />

              <div className="relative z-10">
                {/* Drop Area */}
                <label
                  htmlFor="paper-file-input"
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setDragging(false);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);

                    chooseFiles(
                      Array.from(
                        event.dataTransfer
                          .files
                      )
                    );
                  }}
                  className={`group relative grid min-h-[170px] cursor-pointer place-items-center rounded-xl border-[1.6px] border-dashed px-5 py-6 text-center font-serif transition-all duration-200 ${
                    dragging
                      ? "scale-[1.008] border-[#1f6fd6] bg-white/65"
                      : "border-[#7c8196] bg-white/40 hover:border-[#1f6fd6] hover:bg-white/60"
                  }`}
                >
                  <div>
                    <div className="text-[17px] text-[#111]">
                      Click here to choose
                      PDF files.
                    </div>

                    <div className="mt-1.5 text-[14px] text-[#222]">
                      You can select
                      multiple PDF files.
                    </div>

                    {files.length > 0 && (
                      <div className="mt-3 font-sans text-[14px] font-medium text-[#1c3d73]">
                        {files.length} file
                        {files.length >
                        1
                          ? "s"
                          : ""}{" "}
                        selected:{" "}
                        {files
                          .map(
                            (file) =>
                              file.name
                          )
                          .join(", ")}
                      </div>
                    )}
                  </div>

                  <input
                    id="paper-file-input"
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      chooseFiles(
                        Array.from(
                          event.target.files ??
                            []
                        )
                      );
                    }}
                  />
                </label>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="mt-3 rounded-xl border border-white/60 bg-white/35 px-4 py-3 backdrop-blur-sm">
                    <p className="text-sm font-medium text-[#1c3d73]">
                      Selected files
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {files.map(
                        (file) => (
                          <span
                            key={`${file.name}-${file.lastModified}`}
                            className="rounded-lg border border-white/80 bg-white/65 px-3 py-1.5 text-xs text-[#33415c] shadow-sm"
                          >
                            {file.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Upload button */}
                <button
                  type="button"
                  onClick={
                    handleUpload
                  }
                  disabled={
                    files.length ===
                      0 ||
                    uploading
                  }
                  className={`relative mt-[18px] w-full overflow-hidden rounded-xl px-6 py-3 font-sans text-[16px] font-medium transition-all duration-200 sm:w-auto ${
                    files.length ===
                      0 ||
                    uploading
                      ? "cursor-not-allowed bg-gradient-to-b from-[#8d9099] to-[#6f727b] text-white shadow-inner"
                      : "cursor-pointer bg-gradient-to-b from-[#3b8df0] via-[#1f6fd6] to-[#1b63c2] text-white shadow-[0_10px_18px_-8px_rgba(31,111,214,0.8),inset_0_1px_0_rgba(255,255,255,0.55)] hover:-translate-y-0.5 hover:shadow-[0_14px_22px_-8px_rgba(31,111,214,0.75)] active:translate-y-px"
                  }`}
                >
                  {files.length > 0 &&
                    !uploading && (
                      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                    )}

                  <span className="relative">
                    {uploading
                      ? "Uploading..."
                      : "Upload PDF"}
                  </span>
                </button>

                {/* Message */}
                {message && (
                  <div
                    className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                      message.includes(
                        "successfully"
                      )
                        ? "border-green-200 bg-green-50/80 text-green-700"
                        : "border-red-200 bg-red-50/80 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </section>

            {/* Papers heading */}
            <div className="relative mt-8">
              <h2 className="text-[24px] font-medium tracking-[-0.2px] text-[#0f1a2e]">
                Your Papers
              </h2>
            </div>

            {/* Papers */}
            <section className="relative mt-3 overflow-visible rounded-[22px] border border-white/95 bg-white/88 p-4 shadow-[0_1px_0_#fff_inset,0_24px_44px_-28px_rgba(40,70,140,0.5),0_0_0_1px_rgba(150,170,210,0.3)] backdrop-blur-md">
              <ResearchRobot />

              {papers.length === 0 ? (
                <div className="flex min-h-[150px] flex-col items-center justify-center rounded-xl px-5 py-8 text-center">
                  <BookOpen className="mb-3 h-10 w-10 text-[#9aa8bf]" />

                  <p className="text-[17px] text-[#56657d]">
                    No papers yet.
                  </p>

                  <p className="mt-1 text-sm text-[#7a879a]">
                    Upload your first PDF
                    above.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {papers.map(
                    (
                      paper,
                      index
                    ) => {
                      const palette =
                        PAPER_PALETTE[
                          index %
                            PAPER_PALETTE.length
                        ];

                      const Icon =
                        PAPER_ICONS[
                          index %
                            PAPER_ICONS.length
                        ];

                      return (
                        <div
                          key={
                            paper.id
                          }
                          className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border-2 p-3.5 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_18px_-12px_rgba(60,80,120,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_16px_22px_-12px_rgba(60,80,120,0.55)] sm:flex-row sm:items-center"
                          style={{
                            background:
                              palette.background,
                            borderColor:
                              palette.border,
                            animation:
                              "paperPop .35s cubic-bezier(.2,.9,.3,1.2)",
                          }}
                        >
                          {/* Shine */}
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/55 to-transparent" />

                          {/* Icon */}
                          <div className="relative grid h-12 w-12 flex-none place-items-center rounded-xl bg-white/65 shadow-[0_1px_0_#fff_inset,0_4px_8px_-4px_rgba(0,0,0,0.2)]">
                            <Icon className="h-7 w-7 text-[#4d5568]" />
                          </div>

                          {/* Information */}
                          <div className="relative min-w-0 flex-1">
                            <p className="truncate text-[17px] font-medium text-[#0f1a2e]">
                              {paper.title}
                            </p>

                            <p className="mt-0.5 truncate text-[14px] text-[#3d465a]">
                              {paper.filename}
                              {paper.uploaded_at
                                ? ` · ${new Date(
                                    paper.uploaded_at
                                  ).toLocaleDateString()}`
                                : " · PDF"}
                            </p>
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                paper.id
                              )
                            }
                            className="relative inline-flex items-center justify-center gap-2 rounded-[10px] border border-[rgba(192,57,43,0.35)] bg-gradient-to-b from-white to-[#fbe3e1] px-4 py-2 text-[14px] font-medium text-[#c0392b] shadow-[0_1px_0_#fff_inset,0_6px_10px_-8px_rgba(192,57,43,0.7)] transition-all duration-200 hover:bg-gradient-to-b hover:from-[#e5594a] hover:to-[#c0392b] hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 sm:px-[18px] sm:text-[16px]"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </section>
          </main>
        </div>

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,700&display=swap");

          @keyframes float {
            50% {
              transform: translate(-50%, -100%)
                translateY(-8px);
            }
          }

          @keyframes paperPop {
            from {
              opacity: 0;
              transform: translateY(10px)
                scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0)
                scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation: none !important;
              transition: none !important;
            }
          }
        `}</style>
      </AppLayout>
    </ProtectedRoute>
  );
}