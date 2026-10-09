"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cloud,
  ExternalLink,
  FileText,
  History,
  Loader2,
  Quote,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  getChatHistory,
  getPaperPage,
  getPapers,
  sendChatMessage,
} from "@/lib/api";

import { useAuthStore } from "@/store/auth-store";

import type { Paper } from "@/types/paper";
import type {
  ChatHistoryItem,
  ChatResponse,
  ChatSource,
} from "@/types/chat";

/* =========================================================
   Decorative SVGs
   ========================================================= */

function RobotIllustration({
  size = 76,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M60 13V25"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle
        cx="60"
        cy="10"
        r="5"
        fill="currentColor"
      />

      <rect
        x="25"
        y="27"
        width="70"
        height="60"
        rx="18"
        fill="white"
        stroke="currentColor"
        strokeWidth="4"
      />

      <circle
        cx="45"
        cy="55"
        r="7"
        fill="currentColor"
      />

      <circle
        cx="75"
        cy="55"
        r="7"
        fill="currentColor"
      />

      <path
        d="M45 70C52 77 68 77 75 70"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M25 47H17C13 47 10 50 10 54V69"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M95 47H103C107 47 110 50 110 54V69"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle
        cx="10"
        cy="73"
        r="5"
        fill="currentColor"
      />

      <circle
        cx="110"
        cy="73"
        r="5"
        fill="currentColor"
      />

      <path
        d="M42 88V98"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M78 88V98"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M32 99H48"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M72 99H88"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlaneIllustration() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13 51L85 18L63 83L48 58L13 51Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      <path
        d="M48 58L85 18"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M48 58L46 78L63 83"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaperDoodle() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
      viewBox="0 0 800 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M70 80C120 40 170 55 190 100C210 145 170 180 130 165C90 150 55 115 70 80Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />

      <path
        d="M670 75C710 60 745 90 730 120C715 150 675 140 665 115"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />

      <path
        d="M90 460C130 425 175 435 190 470C205 505 175 535 140 525"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />

      <path
        d="M630 470C680 430 735 450 745 495"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />

      <path
        d="M350 60L365 45L380 60L365 75L350 60Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />

      <path
        d="M530 510L545 495L560 510L545 525L530 510Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

/* =========================================================
   Main Page
   ========================================================= */

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ChatContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function ChatContent() {
  const token = useAuthStore((state) => state.token);

  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaperId, setSelectedPaperId] =
    useState<number | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<ChatSource[]>([]);

  const [isLoadingPapers, setIsLoadingPapers] =
    useState(true);

  const [isLoadingAnswer, setIsLoadingAnswer] =
    useState(false);

  const [selectedSource, setSelectedSource] =
    useState<ChatSource | null>(null);

  const [pdfUrl, setPdfUrl] =
    useState<string | null>(null);

  const [isLoadingPdf, setIsLoadingPdf] =
    useState(false);

  const [pdfError, setPdfError] =
    useState<string | null>(null);

  const [
    isPaperDropdownOpen,
    setIsPaperDropdownOpen,
  ] = useState(false);

  const [chatHistory, setChatHistory] = useState<
    ChatHistoryItem[]
  >([]);

  const [
    isLoadingHistory,
    setIsLoadingHistory,
  ] = useState(true);

  const [
    isHistoryOpen,
    setIsHistoryOpen,
  ] = useState(true);

  const [
    selectedHistoryId,
    setSelectedHistoryId,
  ] = useState<number | null>(null);

  /*
   * Preview page is kept separate from the actual
   * citation page. This means navigating the PDF preview
   * never changes the original citation metadata.
   */
  const [previewPage, setPreviewPage] =
    useState<number | null>(null);

  const [isChangingPdfPage, setIsChangingPdfPage] =
    useState(false);
  
  const pageRef = useRef<HTMLDivElement>(null);

  /* ======================================================
     Load papers
     ====================================================== */

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadPapers = async () => {
      try {
        setIsLoadingPapers(true);

        const data = await getPapers(token);

        setPapers(data);

        if (data.length > 0) {
          setSelectedPaperId(data[0].id);
        }
      } catch (error) {
        console.error(
          "Failed to load papers:",
          error
        );
      } finally {
        setIsLoadingPapers(false);
      }
    };

    loadPapers();
  }, [token]);

  /* ======================================================
     Load chat history
     ====================================================== */

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadChatHistory = async () => {
      try {
        setIsLoadingHistory(true);

        const history =
          await getChatHistory(token);

        setChatHistory(history);
      } catch (error) {
        console.error(
          "Failed to load chat history:",
          error
        );

        setChatHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [token]);

  /* ======================================================
     Ask question
     ====================================================== */

  const handleAskQuestion = async () => {
    if (!token) {
      return;
    }

    const trimmedQuestion =
      question.trim();

    if (
      !trimmedQuestion ||
      isLoadingAnswer
    ) {
      return;
    }

    try {
      setIsLoadingAnswer(true);

      setAnswer("");
      setSources([]);

      setSelectedSource(null);
      setPdfUrl(null);
      setPdfError(null);
      setPreviewPage(null);

      setSelectedHistoryId(null);

      const response: ChatResponse =
        await sendChatMessage(
          token,
          trimmedQuestion,
          selectedPaperId
        );

      setAnswer(response.answer);
      setSources(response.sources);

      const updatedHistory =
        await getChatHistory(token);

      setChatHistory(updatedHistory);

      setQuestion("");
    } catch (error) {
      console.error(
        "Chat request failed:",
        error
      );

      setAnswer(
        "Sorry, I could not process your question. Please try again."
      );

      setSources([]);
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  /* ======================================================
     Previous conversation
     ====================================================== */

  const handleHistoryClick = (
    chat: ChatHistoryItem
  ) => {
    setSelectedHistoryId(chat.id);

    setQuestion(chat.question);
    setAnswer(chat.answer);
    setSources(chat.sources || []);

    setSelectedSource(null);
    setPdfError(null);
    setPreviewPage(null);

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }

    if (chat.paper_id !== null) {
      setSelectedPaperId(chat.paper_id);
    }
  };

  /* ======================================================
     Enter key
     ====================================================== */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleAskQuestion();
    }
  };

  /* ======================================================
     Source click
     ====================================================== */

  const handleSourceClick = async (
    source: ChatSource
  ) => {
    if (
      !token ||
      source.paper_id === null ||
      source.page_number === null
    ) {
      return;
    }

    try {
      setSelectedSource(source);
      setPdfError(null);
      setIsLoadingPdf(true);

      setPreviewPage(source.page_number);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const blob = await getPaperPage(
        token,
        source.paper_id,
        source.page_number
      );

      const url =
        URL.createObjectURL(blob);

      setPdfUrl(url);
    } catch (error) {
      console.error(
        "Failed to load PDF page:",
        error
      );

      setPdfError(
        "Unable to load this PDF page."
      );
    } finally {
      setIsLoadingPdf(false);
    }
  };

  /* ======================================================
     PDF page navigation
     ====================================================== */

  const changePdfPage = async (
    direction: "previous" | "next"
  ) => {
    if (
      !token ||
      !selectedSource ||
      selectedSource.paper_id === null ||
      previewPage === null ||
      isChangingPdfPage
    ) {
      return;
    }

    const nextPage =
      direction === "previous"
        ? previewPage - 1
        : previewPage + 1;

    if (nextPage < 1) {
      return;
    }

    try {
      setIsChangingPdfPage(true);
      setPdfError(null);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const blob = await getPaperPage(
        token,
        selectedSource.paper_id,
        nextPage
      );

      const url =
        URL.createObjectURL(blob);

      setPdfUrl(url);
      setPreviewPage(nextPage);
    } catch (error) {
      console.error(
        "Failed to change PDF page:",
        error
      );

      setPdfError(
        "This PDF page could not be loaded."
      );
    } finally {
      setIsChangingPdfPage(false);
    }
  };

  /* ======================================================
     Cleanup PDF
     ====================================================== */

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  /* ======================================================
     Close citation
     ====================================================== */

  const closePreview = () => {
    setSelectedSource(null);
    setPdfError(null);
    setPreviewPage(null);

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    setPdfUrl(null);
  };

  /* ======================================================
     Selected paper
     ====================================================== */

  const selectedPaper = papers.find(
    (paper) =>
      paper.id === selectedPaperId
  );

  /* ======================================================
     History date
     ====================================================== */

  const formatHistoryDate = (
    createdAt: string
  ) => {
    try {
      return new Date(
        createdAt
      ).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return createdAt;
    }
  };

  /* ======================================================
     Current source selected
     ====================================================== */

  const selectedSourceKey =
    selectedSource
      ? `${selectedSource.paper_id}-${selectedSource.page_number}-${selectedSource.chunk_number}`
      : null;

     /* ======================================================
   GSAP: page entrance + floating decorations (runs once)
   ====================================================== */

useEffect(() => {
  const root = pageRef.current;
  if (!root) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) return;

  const ctx = gsap.context(() => {
    // Header drops in
    gsap.from(".research-chat-header", {
      autoAlpha: 0,
      y: -24,
      duration: 0.7,
      ease: "power3.out",
    });

    // Cards (history, paper, question) cascade up
    gsap.from(
      ".chat-card-history, .chat-card-paper, .chat-card-question",
      {
        autoAlpha: 0,
        y: 34,
        duration: 0.7,
        stagger: 0.14,
        delay: 0.2,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      }
    );

    // Question robot: soft float
    gsap.to(".question-robot svg", {
      y: -5,
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Decorative plane + cloud: very slow drift
    gsap.to(".research-chat-plane", {
      y: -7,
      rotation: -3,
      duration: 3.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(".research-chat-cloud", {
      y: 6,
      x: -4,
      duration: 4.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Header sparkles (the two ✦)
    gsap.to(".research-chat-title-wrap h1 span", {
      scale: 1.25,
      rotation: 12,
      duration: 1.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.4,
      transformOrigin: "50% 50%",
    });
  }, root);

  return () => ctx.revert();
}, []);

/* ======================================================
   GSAP: AI answer reveal
   ====================================================== */

useEffect(() => {
  const root = pageRef.current;
  if (!root || !answer || isLoadingAnswer) return;

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const ctx = gsap.context(() => {
    const tl = gsap.timeline();

    tl.from(".chat-card-answer:not(.loading)", {
      autoAlpha: 0,
      y: 26,
      duration: 0.55,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
    })
      .from(
        ".answer-text",
        {
          autoAlpha: 0,
          scale: 0.97,
          y: 10,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility",
        },
        "-=0.25"
      );

    // Answer robot gentle float
    gsap.to(".answer-robot svg", {
      y: -5,
      duration: 2.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, root);

  return () => ctx.revert();
}, [answer, isLoadingAnswer]);

/* ======================================================
   GSAP: loading robot pulse
   ====================================================== */

useEffect(() => {
  const root = pageRef.current;
  if (!root || !isLoadingAnswer) return;

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const ctx = gsap.context(() => {
    gsap.from(".chat-card-answer.loading", {
      autoAlpha: 0,
      y: 18,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(".answer-loading-robot", {
      scale: 1.06,
      duration: 0.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, root);

  return () => ctx.revert();
}, [isLoadingAnswer]);

/* ======================================================
   GSAP: sources stagger in
   ====================================================== */

useEffect(() => {
  const root = pageRef.current;
  if (!root || sources.length === 0) return;

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const ctx = gsap.context(() => {
    gsap.from(".chat-card-sources", {
      autoAlpha: 0,
      y: 26,
      duration: 0.55,
      delay: 0.15,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
    });

    gsap.from(".source-card", {
      autoAlpha: 0,
      x: -22,
      duration: 0.5,
      stagger: 0.09,
      delay: 0.35,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });

    gsap.from(".sources-count", {
      scale: 0,
      duration: 0.5,
      delay: 0.5,
      ease: "back.out(2.2)",
      clearProps: "transform",
    });
  }, root);

  return () => ctx.revert();
}, [sources]);

/* ======================================================
   GSAP: citation viewer content + PDF page
   ====================================================== */

useEffect(() => {
  const root = pageRef.current;
  if (!root || !selectedSource) return;

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const ctx = gsap.context(() => {
    gsap.from(
      ".citation-details-card, .pdf-reference, .pdf-preview-card",
      {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      }
    );

    gsap.from(
      ".citation-detail-block, .citation-detail-small",
      {
        autoAlpha: 0,
        x: 14,
        duration: 0.4,
        stagger: 0.06,
        delay: 0.2,
        ease: "power2.out",
        clearProps: "transform,opacity,visibility",
      }
    );
  }, root);

  return () => ctx.revert();
}, [selectedSource]);

/* Fade each PDF page image in as it loads */
useEffect(() => {
  const root = pageRef.current;
  if (!root || !pdfUrl) return;

  const ctx = gsap.context(() => {
    gsap.from(".pdf-page-image", {
      autoAlpha: 0,
      scale: 0.97,
      duration: 0.45,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });
  }, root);

  return () => ctx.revert();
}, [pdfUrl]);

/* ======================================================
   GSAP: paper dropdown open
   ====================================================== */

useEffect(() => {
  const root = pageRef.current;
  if (!root || !isPaperDropdownOpen) return;

  const ctx = gsap.context(() => {
    gsap.from(".paper-dropdown-menu", {
      autoAlpha: 0,
      y: -10,
      scale: 0.96,
      transformOrigin: "50% 0%",
      duration: 0.28,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });

    gsap.from(".paper-option", {
      autoAlpha: 0,
      x: -10,
      duration: 0.25,
      stagger: 0.04,
      delay: 0.06,
      ease: "power1.out",
      clearProps: "transform,opacity,visibility",
    });
  }, root);

  return () => ctx.revert();
}, [isPaperDropdownOpen]);

/* ======================================================
   GSAP: history list open
   ====================================================== */

useEffect(() => {
  const root = pageRef.current;
  if (!root || !isHistoryOpen || isLoadingHistory) return;

  const ctx = gsap.context(() => {
    gsap.from(".history-item", {
      autoAlpha: 0,
      y: 12,
      duration: 0.35,
      stagger: 0.07,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });
  }, root);

  return () => ctx.revert();
}, [isHistoryOpen, isLoadingHistory, chatHistory.length]); 

useEffect(() => {
  const root = pageRef.current;
  if (!root || !selectedSource) return;

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const ctx = gsap.context(() => {
    gsap.from(".citation-scroll", {
      x: 60,
      autoAlpha: 0,
      duration: 0.55,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
    });

    gsap.from(".citation-close", {
      scale: 0,
      rotation: -90,
      duration: 0.45,
      ease: "back.out(2)",
      clearProps: "transform",
    });
  }, root);

  return () => ctx.revert();
}, [selectedSource]);
  /* ======================================================
     Render
     ====================================================== */

  return (
    <>
      <div className="research-chat-page" ref={pageRef}>
        <div className="research-chat-shell">

          {/* ==================================================
              LEFT / MAIN CHAT AREA
              ================================================== */}

          <main className="research-chat-main">
            <PaperDoodle />

            <div className="research-chat-content">

              {/* ==================================================
                  HEADER
                  ================================================== */}

              <header className="research-chat-header">
                <div className="research-chat-header-top">
                  <div className="research-chat-plane">
                    <PlaneIllustration />
                  </div>

                  <div className="research-chat-title-wrap">
                    <h1>
                      <span>✦</span>
                      AI Research Chat
                      <span>✦</span>
                    </h1>

                    <p>
                      Ask questions, explore papers,
                      and discover insights.
                    </p>
                  </div>

                  <Cloud
                    className="research-chat-cloud"
                    size={30}
                    strokeWidth={1.7}
                  />
                </div>
              </header>

              {/* ==================================================
                  PREVIOUS CONVERSATIONS
                  ================================================== */}

              <section className="chat-card chat-card-history">
                <button
                  type="button"
                  onClick={() =>
                    setIsHistoryOpen(
                      (previous) => !previous
                    )
                  }
                  className="chat-card-header-button"
                >
                  <div className="chat-card-title-group">
                    <div className="chat-icon-circle blue">
                      <History size={19} />
                    </div>

                    <div>
                      <h2>
                        Previous Conversations
                      </h2>

                      <p>
                        {chatHistory.length === 0
                          ? "Your research journey will appear here"
                          : `${chatHistory.length} conversation${
                              chatHistory.length === 1
                                ? ""
                                : "s"
                            }`}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`chat-chevron ${
                      isHistoryOpen
                        ? "open"
                        : ""
                    }`}
                  />
                </button>

                {isHistoryOpen && (
                  <div className="chat-history-body">
                    {isLoadingHistory ? (
                      <div className="chat-empty-state">
                        <Loader2
                          size={24}
                          className="animate-spin"
                        />

                        <span>
                          Loading your conversations...
                        </span>
                      </div>
                    ) : chatHistory.length === 0 ? (
                      <div className="chat-empty-state">
                        <History size={28} />

                        <strong>
                          No conversations yet
                        </strong>

                        <span>
                          Ask your first question below.
                        </span>
                      </div>
                    ) : (
                      <div className="chat-history-list">
                        {chatHistory.map(
                          (chat) => {
                            const isSelected =
                              selectedHistoryId ===
                              chat.id;

                            return (
                              <button
                                key={chat.id}
                                type="button"
                                onClick={() =>
                                  handleHistoryClick(
                                    chat
                                  )
                                }
                                className={`history-item ${
                                  isSelected
                                    ? "selected"
                                    : ""
                                }`}
                              >
                                <div className="history-item-icon">
                                  <FileText
                                    size={17}
                                  />
                                </div>

                                <div className="history-item-content">
                                  <p>
                                    {chat.question}
                                  </p>

                                  <div className="history-item-meta">
                                    {chat.paper_id !==
                                      null && (
                                      <span>
                                        Paper #
                                        {
                                          chat.paper_id
                                        }
                                      </span>
                                    )}

                                    <span>
                                      {formatHistoryDate(
                                        chat.created_at
                                      )}
                                    </span>

                                    {chat.sources
                                      ?.length >
                                      0 && (
                                      <span>
                                        {
                                          chat
                                            .sources
                                            .length
                                        } sources
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* ==================================================
                  SELECT PAPER
                  ================================================== */}

              <section className="chat-card chat-card-paper">
                <div className="chat-section-heading">
                  <div className="chat-icon-circle orange">
                    <FileText size={19} />
                  </div>

                  <div>
                    <h2>
                      Select Research Paper
                    </h2>

                    <p>
                      Choose the paper you want to
                      explore.
                    </p>
                  </div>
                </div>

                {isLoadingPapers ? (
                  <div className="paper-select-loading">
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />

                    Loading papers...
                  </div>
                ) : papers.length === 0 ? (
                  <div className="paper-select-empty">
                    No research papers available.
                  </div>
                ) : (
                  <div className="paper-dropdown">
                    <button
                      type="button"
                      onClick={() =>
                        setIsPaperDropdownOpen(
                          (previous) =>
                            !previous
                        )
                      }
                      className="paper-dropdown-button"
                    >
                      <div className="paper-dropdown-left">
                        <div className="paper-mini-icon">
                          <FileText size={17} />
                        </div>

                        <span>
                          {selectedPaper?.title ??
                            "Select a paper"}
                        </span>
                      </div>

                      <ChevronDown
                        size={20}
                        className={
                          isPaperDropdownOpen
                            ? "rotate-180"
                            : ""
                        }
                      />
                    </button>

                    {isPaperDropdownOpen && (
                      <div className="paper-dropdown-menu">
                        {papers.map(
                          (paper) => (
                            <button
                              key={paper.id}
                              type="button"
                              onClick={() => {
                                setSelectedPaperId(
                                  paper.id
                                );

                                setIsPaperDropdownOpen(
                                  false
                                );

                                setAnswer("");
                                setSources([]);
                                setSelectedHistoryId(
                                  null
                                );

                                closePreview();
                              }}
                              className={`paper-option ${
                                selectedPaperId ===
                                paper.id
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <FileText
                                size={17}
                              />

                              <span>
                                {paper.title}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* ==================================================
                  ASK QUESTION
                  ================================================== */}

              <section className="chat-card chat-card-question">
                <div className="question-layout">
                  <div className="question-robot">
                    <RobotIllustration size={92} />
                  </div>

                  <div className="question-content">
                    <div className="chat-section-heading compact">
                      <div className="chat-icon-circle orange">
                        <Sparkles size={18} />
                      </div>

                      <div>
                        <h2>
                          Ask a Question
                        </h2>

                        <p>
                          What would you like to know
                          about this paper?
                        </p>
                      </div>
                    </div>

                    <div className="question-input-wrapper">
                      <textarea
                        value={question}
                        onChange={(event) =>
                          setQuestion(
                            event.target.value
                          )
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Ask something about this research paper..."
                        rows={4}
                        disabled={
                          isLoadingAnswer
                        }
                        className="question-textarea"
                      />

                      <button
                        type="button"
                        onClick={
                          handleAskQuestion
                        }
                        disabled={
                          !question.trim() ||
                          isLoadingAnswer ||
                          !selectedPaperId
                        }
                        className="question-send-button"
                        title="Ask question"
                      >
                        {isLoadingAnswer ? (
                          <Loader2
                            size={21}
                            className="animate-spin"
                          />
                        ) : (
                          <Send size={21} />
                        )}
                      </button>
                    </div>

                    <p className="question-hint">
                      Press Enter to ask · Shift +
                      Enter for a new line
                    </p>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  LOADING ANSWER
                  ================================================== */}

              {isLoadingAnswer && (
                <section className="chat-card chat-card-answer loading">
                  <div className="answer-loading">
                    <div className="answer-loading-robot">
                      <RobotIllustration
                        size={72}
                      />
                    </div>

                    <div>
                      <h3>
                        ResearchLane is thinking...
                      </h3>

                      <p>
                        Analyzing your research paper
                        and retrieving relevant sources.
                      </p>
                    </div>

                    <Loader2
                      size={23}
                      className="animate-spin"
                    />
                  </div>
                </section>
              )}

              {/* ==================================================
                  AI ANSWER
                  ================================================== */}

              {answer && !isLoadingAnswer && (
                <section className="chat-card chat-card-answer">
                  <div className="answer-top">
                    <div className="answer-robot">
                      <RobotIllustration
                        size={82}
                      />
                    </div>

                    <div className="answer-heading">
                      <div className="chat-section-heading compact">
                        <div className="chat-icon-circle blue">
                          <Sparkles size={18} />
                        </div>

                        <div>
                          <h2>
                            AI Answer
                          </h2>

                          <p>
                            Generated from your
                            research sources.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="answer-text">
                    {answer}
                  </div>
                </section>
              )}

              {/* ==================================================
                  SOURCES
                  ================================================== */}

              {sources.length > 0 && (
                <section className="chat-card chat-card-sources">
                  <div className="sources-heading">
                    <div className="chat-section-heading">
                      <div className="chat-icon-circle blue">
                        <Quote size={18} />
                      </div>

                      <div>
                        <h2>
                          Sources
                        </h2>

                        <p>
                          Retrieved passages used to
                          generate the answer.
                        </p>
                      </div>
                    </div>

                    <span className="sources-count">
                      {sources.length}
                    </span>
                  </div>

                  <div className="source-list">
                    {sources.map(
                      (source, index) => {
                        const sourceKey = `${source.paper_id}-${source.page_number}-${source.chunk_number}`;

                        const isSelected =
                          selectedSourceKey ===
                          sourceKey;

                        return (
                          <button
                            key={`${sourceKey}-${index}`}
                            type="button"
                            onClick={() =>
                              handleSourceClick(
                                source
                              )
                            }
                            disabled={
                              source.paper_id ===
                                null ||
                              source.page_number ===
                                null
                            }
                            className={`source-card ${
                              isSelected
                                ? "selected"
                                : ""
                            }`}
                          >
                            <div
                              className={`source-pdf-icon ${
                                isSelected
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <FileText
                                size={20}
                              />
                            </div>

                            <div className="source-card-content">
                              <div className="source-card-title">
                                {source.paper_name ??
                                  "Research Paper"}
                              </div>

                              {source.author && (
                                <div className="source-card-author">
                                  {source.author}
                                </div>
                              )}

                              <div className="source-card-meta">
                                {source.page_number !==
                                  null && (
                                  <span>
                                    Page{" "}
                                    {
                                      source.page_number
                                    }
                                  </span>
                                )}

                                {source.chunk_number !==
                                  null && (
                                  <span>
                                    Chunk{" "}
                                    {
                                      source.chunk_number
                                    }
                                  </span>
                                )}

                                {source.distance !==
                                  null && (
                                  <span>
                                    Distance{" "}
                                    {source.distance.toFixed(
                                      3
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="source-view">
                              {isSelected
                                ? "Viewing"
                                : "View"}

                              <ExternalLink
                                size={15}
                              />
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </section>
              )}
            </div>
          </main>

          {/* ==================================================
              RIGHT CITATION VIEWER
              ================================================== */}

          <aside className="citation-viewer">

            <div className="citation-header">
              <div>
                <div className="citation-header-title">
                  <Quote size={17} />
                  <span>
                    Citation Viewer
                  </span>
                </div>

                <p>
                  {selectedSource
                    ? "Explore the source behind the answer."
                    : "Select a source to view citation details."}
                </p>
              </div>

              {selectedSource && (
                <button
                  type="button"
                  onClick={closePreview}
                  className="citation-close"
                  title="Close citation viewer"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="citation-scroll">

              {!selectedSource ? (
                <div className="citation-empty">
                  <div className="citation-empty-illustration">
                    <Quote size={29} />
                  </div>

                  <h3>
                    Your citation viewer
                  </h3>

                  <p>
                    Click a source from your AI
                    answer to see its paper details,
                    exact retrieved text, and PDF
                    page.
                  </p>

                  <div className="citation-empty-cloud">
                    <Cloud size={58} />
                  </div>
                </div>
              ) : (
                <>
                  {/* ==================================================
                      CITATION DETAILS
                      ================================================== */}

                  <section className="citation-card citation-details-card">
                    <div className="citation-card-title">
                      <div className="citation-card-icon">
                        <Quote size={17} />
                      </div>

                      <div>
                        <h3>
                          Citation Details
                        </h3>

                        <p>
                          Retrieved source reference
                        </p>
                      </div>
                    </div>

                    <div className="citation-detail-block">
                      <span className="citation-label">
                        <FileText size={14} />
                        Paper
                      </span>

                      <p>
                        {selectedSource.paper_name ??
                          "Research Paper"}
                      </p>
                    </div>

                    <div className="citation-detail-block">
                      <span className="citation-label">
                        <UserRound size={14} />
                        Author
                      </span>

                      <p>
                        {selectedSource.author ??
                          "Author information not available"}
                      </p>
                    </div>

                    <div className="citation-two-column">
                      <div className="citation-detail-small">
                        <span>
                          Page
                        </span>

                        <strong>
                          {selectedSource.page_number ??
                            "N/A"}
                        </strong>
                      </div>

                      <div className="citation-detail-small">
                        <span>
                          Chunk
                        </span>

                        <strong>
                          {selectedSource.chunk_number ??
                            "N/A"}
                        </strong>
                      </div>
                    </div>

                    {selectedSource.distance !==
                      null && (
                      <div className="citation-detail-small full">
                        <span>
                          Retrieval Distance
                        </span>

                        <strong>
                          {selectedSource.distance.toFixed(
                            4
                          )}
                        </strong>
                      </div>
                    )}

                    <div className="exact-source">
                      <div className="exact-source-heading">
                        <div>
                          <Quote size={14} />
                          <span>
                            Exact Source Chunk
                          </span>
                        </div>

                        {selectedSource.source_text && (
                          <small>
                            Retrieved
                          </small>
                        )}
                      </div>

                      <div className="exact-source-text">
                        {selectedSource.source_text ? (
                          selectedSource.source_text
                        ) : (
                          <span className="muted">
                            Source text is not available
                            for this citation. This may
                            be an older conversation
                            created before source text
                            persistence was added.
                          </span>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* ==================================================
                      PDF REFERENCE
                      ================================================== */}

                  <section className="pdf-reference">
                    <div className="pdf-reference-left">
                      <div className="pdf-reference-icon">
                        <FileText size={17} />
                      </div>

                      <div>
                        <strong>
                          PDF Preview
                        </strong>

                        <span>
                          Page{" "}
                          {selectedSource.page_number ??
                            "N/A"}{" "}
                          · Chunk{" "}
                          {selectedSource.chunk_number ??
                            "N/A"}
                        </span>
                      </div>
                    </div>

                    <ExternalLink
                      size={17}
                    />
                  </section>

                  {/* ==================================================
                      PDF PREVIEW
                      ================================================== */}

                  <section className="pdf-preview-card">
                    <div className="pdf-preview-top">
                      <div>
                        <h3>
                          Research Paper
                        </h3>

                        <p>
                          PDF page reference
                        </p>
                      </div>

                      <span className="pdf-page-badge">
                        Page{" "}
                        {previewPage ??
                          selectedSource.page_number ??
                          "—"}
                      </span>
                    </div>

                    <div className="pdf-preview-stage">
                      {isLoadingPdf ||
                      isChangingPdfPage ? (
                        <div className="pdf-loading">
                          <Loader2
                            size={30}
                            className="animate-spin"
                          />

                          <span>
                            Loading PDF page...
                          </span>
                        </div>
                      ) : pdfError ? (
                        <div className="pdf-error">
                          <div>
                            <FileText
                              size={24}
                            />
                          </div>

                          <strong>
                            Unable to load page
                          </strong>

                          <p>
                            {pdfError}
                          </p>
                        </div>
                      ) : pdfUrl ? (
                        <div className="pdf-image-wrapper">
                          <img
                            src={pdfUrl}
                            alt={`PDF page ${
                              previewPage ??
                              selectedSource.page_number
                            }`}
                            className="pdf-page-image"
                          />
                        </div>
                      ) : (
                        <div className="pdf-unavailable">
                          <FileText
                            size={34}
                          />

                          <span>
                            PDF preview unavailable.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pdf-navigation">
                      <button
                        type="button"
                        onClick={() =>
                          changePdfPage(
                            "previous"
                          )
                        }
                        disabled={
                          !previewPage ||
                          previewPage <= 1 ||
                          isChangingPdfPage
                        }
                        className="pdf-nav-button"
                      >
                        <ChevronLeft
                          size={17}
                        />

                        Previous
                      </button>

                      <span>
                        Page{" "}
                        {previewPage ??
                          selectedSource.page_number ??
                          "—"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          changePdfPage(
                            "next"
                          )
                        }
                        disabled={
                          !previewPage ||
                          isChangingPdfPage
                        }
                        className="pdf-nav-button"
                      >
                        Next

                        <ChevronRight
                          size={17}
                        />
                      </button>
                    </div>
                  </section>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================================
          MOBILE CITATION VIEWER
          ======================================================== */}

      {selectedSource && (
        <section className="mobile-citation-viewer">
          <div className="mobile-citation-header">
            <div>
              <div className="mobile-citation-title">
                <Quote size={17} />
                Citation Viewer
              </div>

              <p>
                Page{" "}
                {selectedSource.page_number}{" "}
                ·{" "}
                {selectedSource.paper_name}
              </p>
            </div>

            <button
              type="button"
              onClick={closePreview}
              className="citation-close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mobile-citation-body">
            <section className="citation-card">
              <div className="citation-card-title">
                <div className="citation-card-icon">
                  <Quote size={17} />
                </div>

                <div>
                  <h3>
                    Citation Details
                  </h3>

                  <p>
                    Retrieved source reference
                  </p>
                </div>
              </div>

              <div className="citation-detail-block">
                <span className="citation-label">
                  Paper
                </span>

                <p>
                  {selectedSource.paper_name ??
                    "Research Paper"}
                </p>
              </div>

              <div className="citation-detail-block">
                <span className="citation-label">
                  Author
                </span>

                <p>
                  {selectedSource.author ??
                    "Author information not available"}
                </p>
              </div>

              <div className="citation-two-column">
                <div className="citation-detail-small">
                  <span>
                    Page
                  </span>

                  <strong>
                    {selectedSource.page_number ??
                      "N/A"}
                  </strong>
                </div>

                <div className="citation-detail-small">
                  <span>
                    Chunk
                  </span>

                  <strong>
                    {selectedSource.chunk_number ??
                      "N/A"}
                  </strong>
                </div>
              </div>

              {selectedSource.distance !==
                null && (
                <div className="citation-detail-small full">
                  <span>
                    Retrieval Distance
                  </span>

                  <strong>
                    {selectedSource.distance.toFixed(
                      4
                    )}
                  </strong>
                </div>
              )}

              <div className="exact-source">
                <div className="exact-source-heading">
                  <div>
                    <Quote size={14} />
                    <span>
                      Exact Source Chunk
                    </span>
                  </div>
                </div>

                <div className="exact-source-text">
                  {selectedSource.source_text ? (
                    selectedSource.source_text
                  ) : (
                    <span className="muted">
                      Source text is not available
                      for this citation.
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="mobile-pdf-card">
              <div className="mobile-pdf-heading">
                <div>
                  <strong>
                    PDF Reference
                  </strong>

                  <span>
                    Page{" "}
                    {selectedSource.page_number ??
                      "N/A"}
                  </span>
                </div>
              </div>

              <div className="pdf-preview-stage">
                {isLoadingPdf ||
                isChangingPdfPage ? (
                  <div className="pdf-loading">
                    <Loader2
                      size={27}
                      className="animate-spin"
                    />

                    <span>
                      Loading PDF page...
                    </span>
                  </div>
                ) : pdfError ? (
                  <div className="pdf-error">
                    <strong>
                      Unable to load page
                    </strong>

                    <p>
                      {pdfError}
                    </p>
                  </div>
                ) : pdfUrl ? (
                  <div className="pdf-image-wrapper">
                    <img
                      src={pdfUrl}
                      alt={`PDF page ${
                        previewPage ??
                        selectedSource.page_number
                      }`}
                      className="pdf-page-image"
                    />
                  </div>
                ) : (
                  <div className="pdf-unavailable">
                    <FileText size={30} />

                    <span>
                      PDF preview unavailable.
                    </span>
                  </div>
                )}
              </div>

              <div className="pdf-navigation">
                <button
                  type="button"
                  onClick={() =>
                    changePdfPage(
                      "previous"
                    )
                  }
                  disabled={
                    !previewPage ||
                    previewPage <= 1 ||
                    isChangingPdfPage
                  }
                  className="pdf-nav-button"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <span>
                  Page{" "}
                  {previewPage ??
                    selectedSource.page_number ??
                    "—"}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    changePdfPage("next")
                  }
                  disabled={
                    !previewPage ||
                    isChangingPdfPage
                  }
                  className="pdf-nav-button"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </section>
          </div>
        </section>
      )}

      {/* ========================================================
          PAGE STYLES
          ======================================================== */}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito:wght@400;500;600;700;800&display=swap');

        .research-chat-page {
          min-height: 100vh;
          font-family: "Nunito", sans-serif;
          background:
            radial-gradient(
              circle at 12% 12%,
              rgba(255, 255, 255, 0.4),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #bfe4ff 0%,
              #d7eaff 44%,
              #c9d5ff 100%
            );
          color: #25314d;
        }

        .research-chat-page *,
        .research-chat-page *::before,
        .research-chat-page *::after {
          box-sizing: border-box;
        }

        .research-chat-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 400px;
        }

        /* =====================================================
           MAIN AREA
           ===================================================== */

        .research-chat-main {
          position: relative;
          min-width: 0;
          overflow: hidden;
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 12% 8%,
              rgba(255, 255, 255, 0.5),
              transparent 27%
            ),
            radial-gradient(
              circle at 92% 88%,
              rgba(255, 255, 255, 0.28),
              transparent 24%
            ),
            linear-gradient(
              145deg,
              #a9dcff 0%,
              #c6e8ff 42%,
              #c9d4ff 100%
            );
        }

        .research-chat-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          padding: 38px 34px 70px;
        }

        .research-chat-header {
          margin-bottom: 27px;
        }

        .research-chat-header-top {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 88px;
        }

        .research-chat-plane {
          position: absolute;
          left: 0;
          top: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          color: #507bb7;
          transform: rotate(-7deg);
        }

        .research-chat-title-wrap {
          text-align: center;
        }

        .research-chat-title-wrap h1 {
          margin: 0;
          color: #263858;
          font-family: "Fraunces", Georgia, serif;
          font-size: clamp(29px, 3vw, 42px);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }

        .research-chat-title-wrap h1 span {
          margin: 0 8px;
          color: #e6a34f;
          font-size: 0.65em;
          vertical-align: middle;
        }

        .research-chat-title-wrap p {
          margin: 9px 0 0;
          color: #52739d;
          font-size: 14px;
          font-weight: 600;
        }

        .research-chat-cloud {
          position: absolute;
          right: 4px;
          top: 9px;
          color: rgba(74, 119, 171, 0.45);
        }

        /* =====================================================
           CARDS
           ===================================================== */

        .chat-card {
          position: relative;
          overflow: visible;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 22px;
          box-shadow:
            0 18px 42px rgba(70, 104, 153, 0.12),
            0 3px 10px rgba(70, 104, 153, 0.07);
          backdrop-filter: blur(10px);
        }

        .chat-card::before {
          content: "";
          position: absolute;
          left: 12%;
          right: 12%;
          top: -1px;
          height: 1px;
          background: rgba(255, 255, 255, 0.9);
          opacity: 0.9;
        }

        .chat-card-history {
          background:
            linear-gradient(
              135deg,
              rgba(229, 244, 255, 0.97),
              rgba(214, 236, 255, 0.9)
            );
        }

        .chat-card-paper {
          padding: 22px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 237, 211, 0.96),
              rgba(255, 224, 190, 0.9)
            );
        }

        .chat-card-question {
          padding: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.98),
              rgba(241, 249, 255, 0.94)
            );
        }

        .chat-card-answer {
          padding: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(225, 243, 255, 0.98),
              rgba(215, 235, 255, 0.93)
            );
        }

        .chat-card-sources {
          padding: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(226, 243, 255, 0.98),
              rgba(217, 233, 255, 0.94)
            );
        }

        .chat-card-header-button {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          padding: 19px 21px;
          border: 0;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .chat-card-title-group,
        .chat-section-heading {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .chat-section-heading.compact {
          margin-bottom: 14px;
        }

        .chat-section-heading h2,
        .chat-card-title-group h2 {
          margin: 0;
          color: #293958;
          font-family: "Fraunces", Georgia, serif;
          font-size: 19px;
          font-weight: 700;
          line-height: 1.2;
        }

        .chat-section-heading p,
        .chat-card-title-group p {
          margin: 4px 0 0;
          color: #7184a0;
          font-size: 12px;
          font-weight: 600;
        }

        .chat-icon-circle {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 14px;
        }

        .chat-icon-circle.blue {
          color: #4f7db8;
          background: rgba(255, 255, 255, 0.7);
        }

        .chat-icon-circle.orange {
          color: #d18a46;
          background: rgba(255, 255, 255, 0.68);
        }

        .chat-chevron {
          color: #6780a1;
          transition: transform 0.25s ease;
        }

        .chat-chevron.open {
          transform: rotate(180deg);
        }

        /* =====================================================
           HISTORY
           ===================================================== */

        .chat-history-body {
          border-top: 1px solid rgba(130, 166, 204, 0.16);
        }

        .chat-history-list {
          max-height: 330px;
          overflow-y: auto;
          padding: 7px;
        }

        .history-item {
          display: flex;
          width: 100%;
          align-items: flex-start;
          gap: 12px;
          padding: 13px 14px;
          border: 0;
          border-radius: 15px;
          background: transparent;
          color: inherit;
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .history-item:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: translateX(2px);
        }

        .history-item.selected {
          background: rgba(255, 255, 255, 0.7);
          box-shadow: inset 3px 0 #6f9ed2;
        }

        .history-item-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 11px;
          color: #6487b1;
          background: rgba(255, 255, 255, 0.62);
        }

        .history-item-content {
          min-width: 0;
          flex: 1;
        }

        .history-item-content p {
          display: -webkit-box;
          margin: 0;
          overflow: hidden;
          color: #334463;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.45;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .history-item-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 12px;
          margin-top: 6px;
          color: #8192ab;
          font-size: 10px;
          font-weight: 700;
        }

        .chat-empty-state {
          display: flex;
          min-height: 150px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 25px;
          color: #7890ad;
          text-align: center;
        }

        .chat-empty-state strong {
          color: #526985;
          font-size: 13px;
        }

        .chat-empty-state span {
          font-size: 11px;
        }

        /* =====================================================
           PAPER SELECTOR
           ===================================================== */

        .paper-dropdown {
          position: relative;
          margin-top: 17px;
        }

        .paper-dropdown-button {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 15px;
          border: 1px solid rgba(211, 170, 127, 0.35);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.64);
          color: #5e4c3d;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .paper-dropdown-button:hover {
          border-color: rgba(203, 143, 75, 0.55);
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 8px 20px rgba(165, 112, 59, 0.08);
        }

        .paper-dropdown-left {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 11px;
        }

        .paper-dropdown-left span {
          overflow: hidden;
          color: #4c5260;
          font-size: 13px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .paper-mini-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 11px;
          color: #cb8641;
          background: rgba(255, 255, 255, 0.7);
        }

        .paper-dropdown-menu {
          position: absolute;
          z-index: 50;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          max-height: 270px;
          overflow-y: auto;
          padding: 6px;
          border: 1px solid rgba(210, 176, 144, 0.35);
          border-radius: 15px;
          background: rgba(255, 250, 246, 0.98);
          box-shadow:
            0 18px 45px rgba(116, 89, 61, 0.17),
            0 4px 10px rgba(116, 89, 61, 0.08);
        }

        .paper-option {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #66594d;
          cursor: pointer;
          text-align: left;
        }

        .paper-option:hover,
        .paper-option.selected {
          background: #fff0df;
          color: #bc7637;
        }

        .paper-option span {
          overflow: hidden;
          font-size: 12px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .paper-select-loading,
        .paper-select-empty {
          display: flex;
          min-height: 49px;
          align-items: center;
          gap: 9px;
          margin-top: 17px;
          padding: 0 15px;
          border: 1px dashed rgba(195, 143, 94, 0.38);
          border-radius: 15px;
          color: #8a7768;
          background: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          font-weight: 700;
        }

        /* =====================================================
           QUESTION
           ===================================================== */

        .question-layout {
          display: grid;
          grid-template-columns: 105px minmax(0, 1fr);
          gap: 18px;
          align-items: center;
        }

        .question-robot {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 115px;
          border-radius: 20px;
          color: #6d98c4;
          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.8),
              rgba(225, 241, 255, 0.45)
            );
        }

        .question-content {
          min-width: 0;
        }

        .question-input-wrapper {
          position: relative;
        }

        .question-textarea {
          display: block;
          width: 100%;
          min-height: 125px;
          resize: vertical;
          padding: 16px 62px 16px 17px;
          border: 1px solid rgba(143, 177, 211, 0.42);
          border-radius: 17px;
          outline: none;
          background: rgba(255, 255, 255, 0.78);
          color: #34435e;
          font-family: "Nunito", sans-serif;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.6;
          box-shadow: inset 0 1px 5px rgba(65, 98, 135, 0.04);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .question-textarea::placeholder {
          color: #9baabe;
        }

        .question-textarea:focus {
          border-color: #85afd8;
          background: rgba(255, 255, 255, 0.95);
          box-shadow:
            0 0 0 4px rgba(115, 165, 211, 0.13),
            inset 0 1px 5px rgba(65, 98, 135, 0.04);
        }

        .question-send-button {
          position: absolute;
          right: 12px;
          bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border: 0;
          border-radius: 50%;
          color: white;
          background: linear-gradient(
            145deg,
            #e9a353,
            #d8873f
          );
          cursor: pointer;
          box-shadow:
            0 8px 18px rgba(201, 126, 52, 0.28),
            inset 0 1px 1px rgba(255, 255, 255, 0.35);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .question-send-button:hover:not(:disabled) {
          transform: translateY(-2px) rotate(-3deg);
          box-shadow:
            0 11px 23px rgba(201, 126, 52, 0.34),
            inset 0 1px 1px rgba(255, 255, 255, 0.35);
        }

        .question-send-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .question-hint {
          margin: 7px 0 0;
          color: #899bb2;
          font-size: 10px;
          font-weight: 700;
        }

        /* =====================================================
           ANSWER
           ===================================================== */

        .answer-top {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .answer-robot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 91px;
          min-width: 91px;
          height: 91px;
          border-radius: 20px;
          color: #5c8fc2;
          background: rgba(255, 255, 255, 0.55);
        }

        .answer-heading {
          min-width: 0;
          flex: 1;
        }

        .answer-text {
          margin-top: 19px;
          padding: 19px 20px;
          border: 1px solid rgba(141, 181, 220, 0.27);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.57);
          color: #465774;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.75;
          white-space: pre-wrap;
        }

        .chat-card-answer.loading {
          padding: 22px;
        }

        .answer-loading {
          display: flex;
          align-items: center;
          gap: 15px;
          color: #5e7695;
        }

        .answer-loading-robot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 76px;
          height: 76px;
          border-radius: 19px;
          color: #5f8fc0;
          background: rgba(255, 255, 255, 0.55);
        }

        .answer-loading h3 {
          margin: 0;
          color: #3e5574;
          font-family: "Fraunces", Georgia, serif;
          font-size: 17px;
        }

        .answer-loading p {
          margin: 4px 0 0;
          color: #8192a9;
          font-size: 11px;
          font-weight: 600;
        }

        .answer-loading > svg {
          margin-left: auto;
          color: #5f8fc0;
        }

        /* =====================================================
           SOURCES
           ===================================================== */

        .sources-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 17px;
        }

        .sources-count {
          display: flex;
          min-width: 31px;
          height: 31px;
          align-items: center;
          justify-content: center;
          padding: 0 9px;
          border-radius: 11px;
          color: #547eac;
          background: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          font-weight: 800;
        }

        .source-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .source-card {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 13px;
          padding: 14px;
          border: 1px solid rgba(144, 181, 216, 0.26);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.57);
          color: inherit;
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .source-card:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: rgba(115, 159, 202, 0.4);
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 8px 18px rgba(73, 112, 153, 0.08);
        }

        .source-card.selected {
          border-color: rgba(103, 150, 197, 0.55);
          background: rgba(237, 247, 255, 0.95);
          box-shadow: inset 3px 0 #5e91c3;
        }

        .source-card:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .source-pdf-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 13px;
          color: #628db8;
          background: rgba(216, 237, 255, 0.8);
        }

        .source-pdf-icon.selected {
          color: white;
          background: #6595c4;
        }

        .source-card-content {
          min-width: 0;
          flex: 1;
        }

        .source-card-title {
          overflow: hidden;
          color: #405371;
          font-size: 12px;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .source-card-author {
          margin-top: 2px;
          overflow: hidden;
          color: #8293aa;
          font-size: 10px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .source-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 11px;
          margin-top: 6px;
          color: #8498b0;
          font-size: 9px;
          font-weight: 800;
        }

        .source-view {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 5px;
          color: #638bb2;
          font-size: 10px;
          font-weight: 800;
        }

        /* =====================================================
           CITATION VIEWER
           ===================================================== */

        .citation-viewer {
          position: sticky;
          top: 0;
          display: flex;
          height: 100vh;
          min-width: 0;
          flex-direction: column;
          overflow: hidden;
          border-left: 1px solid rgba(116, 149, 192, 0.2);
          background:
            radial-gradient(
              circle at 82% 10%,
              rgba(255, 255, 255, 0.5),
              transparent 25%
            ),
            linear-gradient(
              155deg,
              #d9dcff 0%,
              #e4ddff 44%,
              #d7e9ff 100%
            );
        }

        .citation-header {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 88px;
          padding: 18px 21px;
          border-bottom: 1px solid rgba(113, 137, 183, 0.15);
          background: rgba(255, 255, 255, 0.25);
        }

        .citation-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4f5f88;
          font-family: "Fraunces", Georgia, serif;
          font-size: 17px;
          font-weight: 700;
        }

        .citation-header-title svg {
          color: #7583b3;
        }

        .citation-header p {
          margin: 4px 0 0;
          color: #8490ae;
          font-size: 10px;
          font-weight: 700;
        }

        .citation-close {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 11px;
          color: #7784a2;
          background: rgba(255, 255, 255, 0.42);
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .citation-close:hover {
          color: #4c5b7b;
          background: rgba(255, 255, 255, 0.78);
        }

        .citation-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 18px;
        }

        .citation-empty {
          display: flex;
          min-height: calc(100vh - 125px);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 25px;
          text-align: center;
        }

        .citation-empty-illustration {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 67px;
          height: 67px;
          border-radius: 21px;
          color: #7e8fbe;
          background: rgba(255, 255, 255, 0.5);
          box-shadow: 0 10px 28px rgba(87, 98, 153, 0.08);
        }

        .citation-empty h3 {
          margin: 17px 0 0;
          color: #596887;
          font-family: "Fraunces", Georgia, serif;
          font-size: 19px;
        }

        .citation-empty p {
          max-width: 270px;
          margin: 7px 0 0;
          color: #8995b1;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.65;
        }

        .citation-empty-cloud {
          margin-top: 30px;
          color: rgba(126, 145, 190, 0.25);
        }

        .citation-card {
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.58);
          box-shadow:
            0 13px 30px rgba(89, 102, 157, 0.1),
            inset 0 1px rgba(255, 255, 255, 0.75);
        }

        .citation-details-card {
          padding: 17px;
        }

        .citation-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .citation-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 11px;
          color: #6c7eb3;
          background: rgba(255, 255, 255, 0.66);
        }

        .citation-card-title h3 {
          margin: 0;
          color: #596682;
          font-family: "Fraunces", Georgia, serif;
          font-size: 16px;
          font-weight: 700;
        }

        .citation-card-title p {
          margin: 2px 0 0;
          color: #929bb2;
          font-size: 9px;
          font-weight: 700;
        }

        .citation-detail-block {
          margin-bottom: 10px;
          padding: 11px 12px;
          border: 1px solid rgba(132, 151, 194, 0.16);
          border-radius: 13px;
          background: rgba(246, 247, 255, 0.68);
        }

        .citation-label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #8992ac;
          font-size: 9px;
          font-weight: 800;
        }

        .citation-detail-block p {
          margin: 5px 0 0;
          color: #52627e;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.5;
          word-break: break-word;
        }

        .citation-two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-bottom: 10px;
        }

        .citation-detail-small {
          padding: 11px 12px;
          border: 1px solid rgba(132, 151, 194, 0.16);
          border-radius: 13px;
          background: rgba(246, 247, 255, 0.68);
        }

        .citation-detail-small.full {
          margin-bottom: 10px;
        }

        .citation-detail-small span {
          display: block;
          color: #8992ac;
          font-size: 9px;
          font-weight: 800;
        }

        .citation-detail-small strong {
          display: block;
          margin-top: 5px;
          color: #52627e;
          font-size: 12px;
          font-weight: 800;
        }

        .exact-source {
          margin-top: 4px;
        }

        .exact-source-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }

        .exact-source-heading > div {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #62729a;
        }

        .exact-source-heading span {
          font-size: 10px;
          font-weight: 800;
        }

        .exact-source-heading small {
          padding: 3px 6px;
          border-radius: 6px;
          color: #6681ac;
          background: rgba(213, 229, 255, 0.72);
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .exact-source-text {
          max-height: 220px;
          overflow-y: auto;
          padding: 13px;
          border: 1px solid rgba(135, 159, 213, 0.18);
          border-radius: 13px;
          background: rgba(228, 238, 255, 0.56);
          color: #64738e;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.75;
          white-space: pre-wrap;
        }

        .exact-source-text .muted {
          color: #98a1b4;
        }

        /* =====================================================
           PDF
           ===================================================== */

        .pdf-reference {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 13px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.45);
          color: #7180a0;
        }

        .pdf-reference-left {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .pdf-reference-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 33px;
          height: 33px;
          border-radius: 10px;
          color: #7387bb;
          background: rgba(255, 255, 255, 0.58);
        }

        .pdf-reference strong {
          display: block;
          color: #5c6b8a;
          font-size: 10px;
          font-weight: 800;
        }

        .pdf-reference span {
          display: block;
          margin-top: 2px;
          color: #929cb3;
          font-size: 8px;
          font-weight: 700;
        }

        .pdf-preview-card {
          margin-top: 13px;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.47);
        }

        .pdf-preview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .pdf-preview-top h3 {
          margin: 0;
          color: #5d6c8b;
          font-family: "Fraunces", Georgia, serif;
          font-size: 13px;
        }

        .pdf-preview-top p {
          margin: 2px 0 0;
          color: #9ba3b7;
          font-size: 8px;
          font-weight: 700;
        }

        .pdf-page-badge {
          padding: 5px 8px;
          border-radius: 8px;
          color: #687ea9;
          background: rgba(222, 234, 255, 0.8);
          font-size: 8px;
          font-weight: 800;
        }

        .pdf-preview-stage {
          position: relative;
          display: flex;
          min-height: 310px;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(124, 146, 185, 0.18);
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              rgba(239, 242, 255, 0.95),
              rgba(225, 233, 249, 0.9)
            );
        }

        .pdf-image-wrapper {
          display: flex;
          max-width: 100%;
          justify-content: center;
          padding: 7px;
        }

        .pdf-page-image {
          display: block;
          width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: 5px;
          background: white;
          box-shadow:
            0 10px 22px rgba(60, 78, 115, 0.17),
            0 2px 5px rgba(60, 78, 115, 0.09);
        }

        .pdf-loading,
        .pdf-error,
        .pdf-unavailable {
          display: flex;
          min-height: 280px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 25px;
          color: #8995ad;
          text-align: center;
        }

        .pdf-loading svg {
          color: #7189b8;
        }

        .pdf-loading span,
        .pdf-unavailable span {
          font-size: 10px;
          font-weight: 700;
        }

        .pdf-error > div {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          border-radius: 13px;
          color: #bd7580;
          background: #fff0f1;
        }

        .pdf-error strong {
          color: #766579;
          font-size: 11px;
        }

        .pdf-error p {
          max-width: 200px;
          margin: 0;
          color: #a28f9b;
          font-size: 9px;
          line-height: 1.5;
        }

        .pdf-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 10px;
        }

        .pdf-navigation > span {
          color: #8792aa;
          font-size: 9px;
          font-weight: 800;
        }

        .pdf-nav-button {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 7px 9px;
          border: 1px solid rgba(128, 150, 190, 0.18);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.56);
          color: #65789e;
          cursor: pointer;
          font-size: 9px;
          font-weight: 800;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .pdf-nav-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.85);
          transform: translateY(-1px);
        }

        .pdf-nav-button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* =====================================================
           MOBILE CITATION
           ===================================================== */

        .mobile-citation-viewer {
          display: none;
        }

        /* =====================================================
           RESPONSIVE
           ===================================================== */

        @media (max-width: 1180px) {
          .research-chat-shell {
            grid-template-columns: minmax(0, 1fr) 360px;
          }

          .research-chat-content {
            padding-right: 25px;
            padding-left: 25px;
          }
        }

        @media (max-width: 980px) {
          .research-chat-shell {
            display: block;
          }

          .citation-viewer {
            display: none;
          }

          .research-chat-content {
            max-width: 900px;
            padding: 28px 20px 55px;
          }

          .mobile-citation-viewer {
            display: block;
            margin: 0 20px 30px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 22px;
            background:
              linear-gradient(
                145deg,
                #dedfff,
                #e9e1ff 45%,
                #dcecff
              );
            box-shadow:
              0 18px 42px rgba(70, 104, 153, 0.13);
          }

          .mobile-citation-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 17px 19px;
            border-bottom: 1px solid rgba(116, 137, 179, 0.16);
          }

          .mobile-citation-title {
            display: flex;
            align-items: center;
            gap: 7px;
            color: #596a90;
            font-family: "Fraunces", Georgia, serif;
            font-size: 16px;
            font-weight: 700;
          }

          .mobile-citation-header p {
            max-width: 250px;
            margin: 4px 0 0;
            overflow: hidden;
            color: #8995b1;
            font-size: 9px;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobile-citation-body {
            padding: 17px;
          }

          .mobile-pdf-card {
            margin-top: 13px;
            padding: 13px;
            border: 1px solid rgba(255, 255, 255, 0.75);
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.47);
          }

          .mobile-pdf-heading {
            margin-bottom: 10px;
          }

          .mobile-pdf-heading strong {
            display: block;
            color: #5d6c8b;
            font-family: "Fraunces", Georgia, serif;
            font-size: 13px;
          }

          .mobile-pdf-heading span {
            display: block;
            margin-top: 3px;
            color: #929cb3;
            font-size: 8px;
            font-weight: 700;
          }
        }

        @media (max-width: 700px) {
          .research-chat-content {
            padding: 22px 13px 35px;
          }

          .research-chat-header {
            margin-bottom: 21px;
          }

          .research-chat-header-top {
            min-height: 80px;
          }

          .research-chat-plane {
            left: -7px;
            width: 49px;
            height: 49px;
            opacity: 0.75;
          }

          .research-chat-cloud {
            right: -2px;
            width: 25px;
          }

          .research-chat-title-wrap {
            padding: 0 35px;
          }

          .research-chat-title-wrap h1 {
            font-size: 27px;
          }

          .research-chat-title-wrap h1 span {
            margin: 0 4px;
          }

          .research-chat-title-wrap p {
            font-size: 10px;
          }

          .chat-card {
            margin-bottom: 14px;
            border-radius: 18px;
          }

          .chat-card-paper,
          .chat-card-question,
          .chat-card-answer,
          .chat-card-sources {
            padding: 17px;
          }

          .chat-section-heading h2,
          .chat-card-title-group h2 {
            font-size: 16px;
          }

          .chat-section-heading p,
          .chat-card-title-group p {
            font-size: 10px;
          }

          .question-layout {
            grid-template-columns: 1fr;
          }

          .question-robot {
            display: none;
          }

          .answer-top {
            align-items: flex-start;
          }

          .answer-robot {
            width: 66px;
            min-width: 66px;
            height: 66px;
          }

          .source-card {
            align-items: flex-start;
          }

          .source-view {
            padding-top: 3px;
          }

          .source-view svg {
            display: none;
          }

          .mobile-citation-viewer {
            margin-right: 13px;
            margin-left: 13px;
            border-radius: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
          /* =====================================================
   GLOW + GLOSS LAYER (CSS only, no logic is touched)
   Paste this at the very END of your CSS, right above the closing
   backtick of your style jsx global block.
   ===================================================== */

/* ---------- main cards: glass, sheen and a coloured glow ---------- */
.chat-card {
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.35),
    0 0 34px var(--glow, rgba(120, 175, 235, 0.4)),
    0 24px 50px rgba(70, 104, 153, 0.14),
    0 7px 18px rgba(70, 104, 153, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(130, 160, 200, 0.1);
  backdrop-filter: blur(18px) saturate(125%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  isolation: isolate;
  transition: box-shadow 0.3s ease;
}

.chat-card::before {
  content: "";
  position: absolute;
  z-index: 5;
  pointer-events: none;
  left: 5%;
  right: 5%;
  top: 1px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0));
  opacity: 0.6;
  filter: blur(8px);
}

.chat-card::after {
  content: "";
  position: absolute;
  z-index: -1;
  pointer-events: none;
  inset: 8px;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.26), transparent 55%);
}

.chat-card:hover {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.5),
    0 0 46px var(--glow, rgba(120, 175, 235, 0.4)),
    0 28px 56px rgba(70, 104, 153, 0.17),
    0 8px 20px rgba(70, 104, 153, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(130, 160, 200, 0.12);
}

.chat-card-history { --glow: rgba(120, 180, 255, 0.42); z-index: 1; }
.chat-card-paper { --glow: rgba(255, 178, 92, 0.46); z-index: 20; } /* stays above the cards below so its dropdown is never covered */
.chat-card-question { --glow: rgba(150, 200, 255, 0.42); }
.chat-card-answer { --glow: rgba(110, 170, 240, 0.44); }
.chat-card-sources { --glow: rgba(130, 185, 250, 0.42); }

/* ---------- icon badges ---------- */
.chat-icon-circle {
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    0 8px 16px rgba(74, 111, 155, 0.12),
    0 0 20px var(--ic, rgba(120, 175, 235, 0.4)),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.chat-icon-circle.blue {
  --ic: rgba(120, 175, 235, 0.45);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(210, 233, 255, 0.72));
}
.chat-icon-circle.orange {
  --ic: rgba(255, 175, 90, 0.5);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 228, 196, 0.75));
}

/* ---------- previous conversations ---------- */
.chat-card-header-button { border-radius: 22px; transition: background 0.25s ease; }
.chat-card-header-button:hover { background: rgba(255, 255, 255, 0.2); }

.history-item { border: 1px solid transparent; }
.history-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.4));
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 22px rgba(120, 175, 235, 0.35), 0 9px 20px rgba(72, 112, 153, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.history-item.selected {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(228, 243, 255, 0.72));
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: inset 3px 0 #6f9ed2, 0 0 24px rgba(111, 158, 210, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.history-item-icon {
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(220, 238, 255, 0.65));
  box-shadow: 0 5px 12px rgba(75, 113, 155, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

/* ---------- paper selector ---------- */
.paper-dropdown-button {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(255, 240, 222, 0.62));
  box-shadow:
    0 0 20px rgba(255, 178, 92, 0.25),
    0 10px 22px rgba(165, 112, 59, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.paper-dropdown-button:hover {
  border-color: rgba(230, 160, 85, 0.65);
  box-shadow:
    0 0 30px rgba(255, 170, 80, 0.45),
    0 13px 26px rgba(165, 112, 59, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}
.paper-mini-icon {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 226, 190, 0.7));
  box-shadow: 0 0 16px rgba(255, 175, 90, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.paper-dropdown-menu {
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: linear-gradient(145deg, rgba(255, 252, 248, 0.97), rgba(255, 238, 220, 0.92));
  box-shadow:
    0 0 36px rgba(255, 178, 92, 0.35),
    0 24px 50px rgba(116, 89, 61, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}
.paper-option:hover,
.paper-option.selected {
  background: linear-gradient(135deg, rgba(255, 240, 223, 0.95), rgba(255, 226, 192, 0.72));
  box-shadow: 0 0 18px rgba(255, 175, 90, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

/* ---------- question box ---------- */
.question-robot {
  border: 1px solid rgba(255, 255, 255, 0.8);
  background:
    radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.95), transparent 45%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(222, 240, 255, 0.5));
  box-shadow: 0 0 30px rgba(130, 190, 255, 0.45), 0 13px 25px rgba(78, 119, 160, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.98);
}
.question-textarea {
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(239, 248, 255, 0.7));
  box-shadow: 0 0 22px rgba(130, 185, 245, 0.25), 0 10px 24px rgba(67, 105, 143, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.98);
}
.question-textarea:focus {
  border-color: #85afd8;
  box-shadow: 0 0 0 4px rgba(115, 165, 211, 0.16), 0 0 38px rgba(110, 175, 245, 0.5), 0 14px 30px rgba(67, 105, 143, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1);
}
.question-send-button {
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: linear-gradient(145deg, #f2b872, #d8873f);
  box-shadow:
    0 0 26px rgba(255, 165, 70, 0.55),
    0 10px 22px rgba(201, 126, 52, 0.3),
    inset 0 2px 2px rgba(255, 255, 255, 0.5),
    inset 0 -2px 3px rgba(145, 78, 29, 0.12);
}
.question-send-button:hover:not(:disabled) {
  box-shadow:
    0 0 38px rgba(255, 160, 60, 0.75),
    0 14px 27px rgba(201, 126, 52, 0.36),
    inset 0 2px 2px rgba(255, 255, 255, 0.55);
}
.question-send-button:disabled { box-shadow: none; }

/* ---------- answer ---------- */
.answer-robot,
.answer-loading-robot {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background:
    radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.95), transparent 45%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(214, 236, 255, 0.5));
  box-shadow: 0 0 30px rgba(120, 180, 250, 0.5), 0 12px 25px rgba(72, 112, 153, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.98);
}
.answer-text {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.74), rgba(231, 244, 255, 0.55));
  box-shadow: 0 0 26px rgba(130, 185, 245, 0.28), 0 9px 20px rgba(73, 112, 153, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

/* ---------- sources ---------- */
.sources-count {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(218, 237, 255, 0.62));
  box-shadow: 0 0 18px rgba(120, 175, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.source-card {
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.74), rgba(232, 244, 255, 0.55));
  box-shadow: 0 0 18px rgba(130, 185, 245, 0.2), 0 8px 18px rgba(73, 112, 153, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.source-card:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 1);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(228, 244, 255, 0.72));
  box-shadow: 0 0 32px rgba(110, 175, 245, 0.45), 0 13px 25px rgba(73, 112, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1);
}
.source-card.selected {
  border-color: rgba(255, 255, 255, 1);
  background: linear-gradient(145deg, rgba(244, 251, 255, 0.96), rgba(222, 240, 255, 0.8));
  box-shadow: inset 3px 0 #5e91c3, 0 0 34px rgba(94, 145, 195, 0.5), 0 12px 25px rgba(73, 112, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1);
}
.source-pdf-icon {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(240, 249, 255, 0.95), rgba(203, 230, 255, 0.7));
  box-shadow: 0 6px 13px rgba(72, 112, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.98);
}
.source-pdf-icon.selected {
  background: linear-gradient(145deg, #86b2dc, #5787ba);
  box-shadow: 0 0 22px rgba(87, 135, 186, 0.6), 0 8px 17px rgba(69, 112, 157, 0.24), inset 0 1px 2px rgba(255, 255, 255, 0.5);
}

/* ---------- citation viewer ---------- */
.citation-header {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.22));
  box-shadow: 0 10px 24px -16px rgba(87, 98, 153, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.citation-close {
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.36));
  box-shadow: 0 0 16px rgba(150, 140, 230, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.citation-close:hover { box-shadow: 0 0 26px rgba(150, 140, 230, 0.55), inset 0 1px 0 rgba(255, 255, 255, 1); }

.citation-empty-illustration {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background:
    radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.95), transparent 45%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.68), rgba(222, 226, 255, 0.5));
  box-shadow: 0 0 34px rgba(150, 140, 235, 0.5), 0 15px 30px rgba(87, 98, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.98);
}

.citation-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.76), rgba(239, 238, 255, 0.52));
  box-shadow:
    0 0 32px rgba(160, 145, 235, 0.38),
    0 18px 35px rgba(89, 102, 157, 0.12),
    0 5px 12px rgba(89, 102, 157, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(120, 135, 180, 0.07);
  backdrop-filter: blur(16px) saturate(125%);
  -webkit-backdrop-filter: blur(16px) saturate(125%);
}
.citation-card::before {
  content: "";
  position: absolute;
  pointer-events: none;
  top: -10px;
  left: 12%;
  right: 12%;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), transparent);
  filter: blur(9px);
}
.citation-card-icon {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(222, 226, 255, 0.62));
  box-shadow: 0 0 18px rgba(150, 140, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.98);
}
.citation-detail-block,
.citation-detail-small {
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(242, 243, 255, 0.5));
  box-shadow: 0 0 14px rgba(160, 150, 235, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.exact-source-heading small {
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(145deg, rgba(240, 248, 255, 0.9), rgba(210, 228, 255, 0.65));
  box-shadow: 0 0 12px rgba(120, 160, 235, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.exact-source-text {
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(145deg, rgba(234, 243, 255, 0.76), rgba(220, 234, 255, 0.52));
  box-shadow: 0 0 20px rgba(120, 165, 235, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.pdf-reference {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.66), rgba(239, 241, 255, 0.45));
  box-shadow: 0 0 24px rgba(160, 150, 235, 0.3), 0 9px 19px rgba(89, 102, 157, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.pdf-reference-icon {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.85), rgba(224, 228, 255, 0.55));
  box-shadow: 0 0 14px rgba(150, 140, 235, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.98);
}

.pdf-preview-card,
.mobile-pdf-card {
  border: 1px solid rgba(255, 255, 255, 0.88);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.64), rgba(235, 237, 255, 0.44));
  box-shadow: 0 0 30px rgba(160, 150, 235, 0.32), 0 12px 24px rgba(89, 102, 157, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.98);
}
.pdf-page-badge {
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: linear-gradient(145deg, rgba(240, 248, 255, 0.9), rgba(212, 228, 255, 0.62));
  box-shadow: 0 0 12px rgba(120, 160, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.pdf-preview-stage {
  border: 1px solid rgba(255, 255, 255, 0.7);
  background:
    radial-gradient(circle at 30% 15%, rgba(255, 255, 255, 0.75), transparent 38%),
    linear-gradient(135deg, rgba(239, 242, 255, 0.95), rgba(225, 233, 249, 0.82));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 0 28px rgba(150, 160, 230, 0.12);
}
.pdf-page-image {
  box-shadow: 0 0 26px rgba(130, 150, 230, 0.35), 0 14px 28px rgba(60, 78, 115, 0.18), 0 3px 7px rgba(60, 78, 115, 0.1);
}
.pdf-nav-button {
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.76), rgba(232, 237, 255, 0.5));
  box-shadow: 0 0 14px rgba(150, 150, 235, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.pdf-nav-button:hover:not(:disabled) {
  box-shadow: 0 0 24px rgba(140, 145, 235, 0.5), 0 9px 17px rgba(89, 102, 157, 0.09), inset 0 1px 0 rgba(255, 255, 255, 1);
}

/* ---------- mobile citation viewer ---------- */
@media (max-width: 980px) {
  .mobile-citation-viewer {
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow:
      0 0 36px rgba(160, 150, 235, 0.4),
      0 24px 50px rgba(70, 104, 153, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
}
  .citation-close:hover svg {
  transform: rotate(90deg);
}

.citation-close svg {
  transition: transform 0.3s ease;
}
      `}</style>
    </>
  );
}
