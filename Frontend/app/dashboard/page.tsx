
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

import {
  getDashboardStats,
  getRecentPapers,
  getRecentActivity,
  clearRecentActivity,
} from "@/lib/api";

import type {
  DashboardStats,
  RecentPaper,
  RecentActivity,
} from "@/types/dashboard";

import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

export default function DashboardPage() {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [recentPapers, setRecentPapers] =
    useState<RecentPaper[]>([]);

  const [recentActivity, setRecentActivity] =
    useState<RecentActivity[]>([]);

  const [loading, setLoading] = useState(true);

  const [isClearingActivity, setIsClearingActivity] =
    useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const authToken = token;

    async function loadDashboard() {
      try {
        setLoading(true);

        const [
          statsData,
          papersData,
          activityData,
        ] = await Promise.all([
          getDashboardStats(authToken),
          getRecentPapers(authToken),
          getRecentActivity(authToken),
        ]);

        setStats(statsData);
        setRecentPapers(papersData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function handleUpload() {
    router.push("/upload");
  }

  async function handleClearActivity() {
    if (
      !token ||
      recentActivity.length === 0 ||
      isClearingActivity
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear your recent activity?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsClearingActivity(true);

      await clearRecentActivity(token);

      setRecentActivity([]);

      setStats((currentStats) => {
        if (!currentStats) {
          return currentStats;
        }

        return {
          ...currentStats,
          total_chats: 0,
        };
      });
    } catch (error) {
      console.error("Failed to clear recent activity:", error);

      window.alert(
        "Unable to clear recent activity. Please try again."
      );
    } finally {
      setIsClearingActivity(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <main className="research-dashboard relative min-h-screen overflow-hidden text-[#2a1c10]">

          {/* =====================================================
              GOOGLE FONTS + DASHBOARD STYLES
          ===================================================== */}

          <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Roboto+Condensed:wght@400;500;700&display=swap');

            .research-dashboard,
            .research-dashboard * {
              font-family: "Roboto Condensed", "Arial Narrow", system-ui, sans-serif;
            }

            .research-dashboard .fraunces {
              font-family: "Fraunces", Georgia, serif;
            }

            .research-dashboard {
              background:
                radial-gradient(
                  circle at 12% 0%,
                  rgba(255, 244, 214, 0.9),
                  transparent 40%
                ),
                radial-gradient(
                  circle at 90% 100%,
                  rgba(236, 214, 170, 0.45),
                  transparent 38%
                ),
                linear-gradient(
                  180deg,
                  #f8f3e9,
                  #efe7d7
                );
            }

            .research-dashboard .glossy-button {
              position: relative;
              overflow: hidden;
              border: 1px solid rgba(255,255,255,.35);
              border-radius: 14px;
              background:
                linear-gradient(
                  180deg,
                  #1b6a73 0%,
                  #0f4c55 55%,
                  #0a3b44 100%
                );
              box-shadow:
                0 1px 0 rgba(255,255,255,.35) inset,
                0 14px 22px -10px rgba(10,59,68,.8),
                0 0 0 3px rgba(31,140,140,.12);
              transition:
                transform .15s ease,
                filter .2s ease;
            }

            .research-dashboard .glossy-button::before {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              height: 50%;
              background:
                linear-gradient(
                  180deg,
                  rgba(255,255,255,.28),
                  transparent
                );
              pointer-events: none;
            }

            .research-dashboard .glossy-button::after {
              content: "";
              position: absolute;
              top: 0;
              bottom: 0;
              left: -60%;
              width: 40%;
              background:
                linear-gradient(
                  100deg,
                  transparent,
                  rgba(255,255,255,.45),
                  transparent
                );
              transform: skewX(-20deg);
              transition: left .6s ease;
              pointer-events: none;
            }

            .research-dashboard .glossy-button:hover::after {
              left: 130%;
            }

            .research-dashboard .glossy-button:hover {
              filter: brightness(1.1);
              transform: translateY(-2px);
            }

            .research-dashboard .glossy-button:active {
              transform: translateY(1px);
            }

            .research-dashboard .glossy-card {
              position: relative;
              overflow: hidden;
              border-radius: 26px;
              border: 2px solid rgba(255,255,255,.95);
              background:
                linear-gradient(
                  180deg,
                  #fffcf4 0%,
                  #f6efe0 100%
                );
              box-shadow:
                0 1px 0 #fff inset,
                0 0 0 2px var(--rim),
                0 0 30px var(--glow),
                0 26px 36px -26px rgba(90,60,20,.5);
              transition: transform .25s ease;
            }

            .research-dashboard .glossy-card:hover {
              transform: translateY(-4px);
            }

            .research-dashboard .glossy-card::after {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              height: 42%;
              background:
                linear-gradient(
                  180deg,
                  rgba(255,255,255,.65),
                  transparent
                );
              pointer-events: none;
            }

            .research-dashboard .gold-card {
              --rim: rgba(226,186,98,.7);
              --glow: rgba(226,186,98,.5);
            }

            .research-dashboard .plum-card {
              --rim: rgba(160,120,210,.6);
              --glow: rgba(160,110,220,.45);
            }

            .research-dashboard .panel-card {
              --rim: rgba(226,186,98,.7);
              --glow: rgba(205,130,170,.4);
            }

            .research-dashboard .shine-bar {
              box-shadow:
                inset 0 -3px 5px rgba(0,0,0,.12),
                inset 0 2px 3px rgba(255,255,255,.35);
            }

            .research-dashboard .paper-list::-webkit-scrollbar {
              width: 6px;
            }

            .research-dashboard .paper-list::-webkit-scrollbar-track {
              background: rgba(214,196,158,.2);
              border-radius: 999px;
            }

            .research-dashboard .paper-list::-webkit-scrollbar-thumb {
              background: rgba(143,111,55,.45);
              border-radius: 999px;
            }
          `}</style>

          {/* =====================================================
              SVG DEFINITIONS
          ===================================================== */}

          <svg
            width="0"
            height="0"
            className="absolute"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="research-gold"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0" stopColor="#f3d98a" />
                <stop offset=".5" stopColor="#d4a640" />
                <stop offset="1" stopColor="#a87722" />
              </linearGradient>

              <linearGradient
                id="research-plum"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0" stopColor="#c47ca6" />
                <stop offset="1" stopColor="#8e4271" />
              </linearGradient>

              <linearGradient
                id="research-shine"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0"
                  stopColor="#fff"
                  stopOpacity=".75"
                />
                <stop
                  offset="1"
                  stopColor="#fff"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* =====================================================
              RESEARCH NETWORK BACKGROUND
          ===================================================== */}

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
            viewBox="0 0 1000 700"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <g
              stroke="#cdbf9f"
              strokeWidth="1.5"
            >
              <line x1="570" y1="163" x2="674" y2="235" />
              <line x1="570" y1="163" x2="422" y2="54" />
              <line x1="570" y1="163" x2="648" y2="32" />
              <line x1="570" y1="163" x2="404" y2="93" />
              <line x1="570" y1="163" x2="651" y2="71" />
              <line x1="570" y1="163" x2="424" y2="281" />

              <line x1="674" y1="235" x2="805" y2="208" />
              <line x1="674" y1="235" x2="648" y2="32" />
              <line x1="674" y1="235" x2="819" y2="365" />
              <line x1="674" y1="235" x2="651" y2="71" />
              <line x1="674" y1="235" x2="754" y2="315" />

              <line x1="137" y1="422" x2="73" y2="391" />
              <line x1="137" y1="422" x2="139" y2="314" />
              <line x1="137" y1="422" x2="213" y2="463" />
              <line x1="137" y1="422" x2="62" y2="318" />

              <line x1="375" y1="316" x2="341" y2="209" />
              <line x1="375" y1="316" x2="385" y2="434" />
              <line x1="375" y1="316" x2="466" y2="469" />
              <line x1="375" y1="316" x2="336" y2="164" />
              <line x1="375" y1="316" x2="404" y2="93" />
              <line x1="375" y1="316" x2="424" y2="281" />
              <line x1="375" y1="316" x2="213" y2="463" />

              <line x1="805" y1="208" x2="844" y2="391" />
              <line x1="805" y1="208" x2="819" y2="365" />
              <line x1="805" y1="208" x2="651" y2="71" />
              <line x1="805" y1="208" x2="754" y2="315" />

              <line x1="844" y1="391" x2="909" y2="455" />
              <line x1="844" y1="391" x2="755" y2="462" />
              <line x1="844" y1="391" x2="819" y2="365" />
              <line x1="844" y1="391" x2="754" y2="315" />

              <line x1="909" y1="455" x2="755" y2="462" />
              <line x1="909" y1="455" x2="819" y2="365" />
              <line x1="909" y1="455" x2="754" y2="315" />

              <line x1="415" y1="692" x2="621" y2="656" />
              <line x1="415" y1="692" x2="466" y2="469" />
              <line x1="781" y1="695" x2="621" y2="656" />

              <line x1="422" y1="54" x2="341" y2="209" />
              <line x1="422" y1="54" x2="336" y2="164" />
              <line x1="422" y1="54" x2="648" y2="32" />
              <line x1="422" y1="54" x2="265" y2="55" />
              <line x1="422" y1="54" x2="404" y2="93" />
              <line x1="422" y1="54" x2="651" y2="71" />
              <line x1="422" y1="54" x2="424" y2="281" />

              <line x1="755" y1="462" x2="819" y2="365" />
              <line x1="755" y1="462" x2="754" y2="315" />

              <line x1="197" y1="109" x2="341" y2="209" />
              <line x1="197" y1="109" x2="336" y2="164" />
              <line x1="197" y1="109" x2="265" y2="55" />
              <line x1="197" y1="109" x2="404" y2="93" />
              <line x1="197" y1="109" x2="139" y2="314" />
              <line x1="197" y1="109" x2="104" y2="171" />

              <line x1="73" y1="391" x2="139" y2="314" />
              <line x1="73" y1="391" x2="213" y2="463" />
              <line x1="73" y1="391" x2="62" y2="318" />
              <line x1="73" y1="391" x2="104" y2="171" />

              <line x1="341" y1="209" x2="385" y2="434" />
              <line x1="341" y1="209" x2="336" y2="164" />
              <line x1="341" y1="209" x2="265" y2="55" />
              <line x1="341" y1="209" x2="404" y2="93" />
              <line x1="341" y1="209" x2="424" y2="281" />
              <line x1="341" y1="209" x2="139" y2="314" />

              <line x1="385" y1="434" x2="466" y2="469" />
              <line x1="385" y1="434" x2="424" y2="281" />
              <line x1="385" y1="434" x2="213" y2="463" />

              <line x1="466" y1="469" x2="424" y2="281" />

              <line x1="336" y1="164" x2="265" y2="55" />
              <line x1="336" y1="164" x2="404" y2="93" />
              <line x1="336" y1="164" x2="424" y2="281" />

              <line x1="648" y1="32" x2="651" y2="71" />
              <line x1="819" y1="365" x2="754" y2="315" />

              <line x1="265" y1="55" x2="404" y2="93" />
              <line x1="265" y1="55" x2="104" y2="171" />

              <line x1="404" y1="93" x2="424" y2="281" />

              <line x1="139" y1="314" x2="213" y2="463" />
              <line x1="139" y1="314" x2="62" y2="318" />
              <line x1="139" y1="314" x2="104" y2="171" />

              <line x1="213" y1="463" x2="62" y2="318" />
              <line x1="62" y1="318" x2="104" y2="171" />
            </g>

            <g fill="#d9cdb0">
              <circle cx="570" cy="163" r="7" />
              <circle cx="674" cy="235" r="7" />
              <circle cx="137" cy="422" r="4" />
              <circle cx="375" cy="316" r="8" />
              <circle cx="805" cy="208" r="8" />
              <circle cx="844" cy="391" r="8" />
              <circle cx="909" cy="455" r="4" />
              <circle cx="415" cy="692" r="4" />
              <circle cx="781" cy="695" r="5" />
              <circle cx="422" cy="54" r="9" />
              <circle cx="755" cy="462" r="7" />
              <circle cx="197" cy="109" r="7" />
              <circle cx="164" cy="689" r="6" />
              <circle cx="73" cy="391" r="6" />
              <circle cx="341" cy="209" r="5" />
              <circle cx="385" cy="434" r="3" />
              <circle cx="621" cy="656" r="5" />
              <circle cx="466" cy="469" r="5" />
              <circle cx="336" cy="164" r="8" />
              <circle cx="648" cy="32" r="8" />
              <circle cx="819" cy="365" r="4" />
              <circle cx="265" cy="55" r="3" />
              <circle cx="404" cy="93" r="8" />
              <circle cx="651" cy="71" r="9" />
              <circle cx="424" cy="281" r="9" />
              <circle cx="139" cy="314" r="4" />
              <circle cx="213" cy="463" r="3" />
              <circle cx="62" cy="318" r="8" />
              <circle cx="104" cy="171" r="5" />
              <circle cx="754" cy="315" r="6" />
            </g>
          </svg>

          {/* =====================================================
              MAIN CONTENT
          ===================================================== */}

          <div className="relative z-10 mx-auto max-w-[1020px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-start">

              <div>
                <h1
                  className="fraunces text-[30px] font-bold tracking-[-0.4px] sm:text-[36px] lg:text-[40px]"
                  style={{
                    background:
                      "linear-gradient(180deg,#a67c2e,#7b5a1c)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    filter:
                      "drop-shadow(0 2px 0 rgba(255,255,255,.55))",
                  }}
                >
                  ResearchLane Dashboard
                </h1>

                <p className="mt-1 text-[21px] font-normal text-[#1d140b] sm:text-[24px] lg:text-[30px]">
                  Welcome back,{" "}
                  <span>{user?.name || "Researcher"}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="glossy-button shrink-0 px-7 py-3 text-[19px] font-medium text-white sm:px-8 sm:text-[20px]"
              >
                <span className="relative z-10">
                  Logout
                </span>
              </button>
            </header>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
              <div className="glossy-card panel-card relative rounded-[26px] p-10 text-center">
                <p className="relative z-10 text-lg text-[#695a43]">
                  Loading dashboard...
                </p>
              </div>
            ) : (
              <>
                {/* =============================================
                    STATISTICS
                ============================================= */}

                <section className="grid gap-6 lg:grid-cols-2">

                  {/* TOTAL PAPERS */}

                  <article className="glossy-card gold-card min-h-[170px]">

                    <div className="shine-bar absolute left-0 right-0 top-0 z-[2] h-5 bg-gradient-to-r from-[#0f5560] to-[#25867f]" />

                    <div className="relative z-10 flex min-h-[170px] items-center justify-between gap-4 px-7 pb-7 pt-11 sm:px-8">

                      <div>
                        <h3 className="text-[22px] font-normal sm:text-[26px]">
                          Total Papers:
                        </h3>

                        <strong className="mt-0.5 block text-[46px] font-bold leading-[1.1] text-[#2a1a0e] sm:text-[56px]">
                          {stats?.total_papers ?? 0}
                        </strong>
                      </div>

                      {/* PAPER ICON */}

                      <svg
                        className="h-[70px] w-[64px] shrink-0 drop-shadow-[0_10px_8px_rgba(120,80,20,.35)] sm:h-[78px] sm:w-[70px]"
                        viewBox="0 0 64 72"
                        aria-hidden="true"
                      >
                        <path
                          d="M10 6h30l16 16v38a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6z"
                          fill="url(#research-gold)"
                          stroke="#fff"
                          strokeWidth="2"
                        />

                        <path
                          d="M40 6v12a4 4 0 0 0 4 4h12z"
                          fill="#f6e3a8"
                        />

                        <path
                          d="M14 34h24M14 44h32M14 54h20"
                          stroke="#fff8e0"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10 6h30l4 4H8z"
                          fill="url(#research-shine)"
                        />
                      </svg>
                    </div>
                  </article>

                  {/* AI CHATS */}

                  <article className="glossy-card plum-card min-h-[170px]">

                    <div className="shine-bar absolute left-0 right-0 top-0 z-[2] h-5 bg-gradient-to-r from-[#8e4271] to-[#c07aa2]" />

                    <div className="relative z-10 flex min-h-[170px] items-center justify-between gap-4 px-7 pb-7 pt-11 sm:px-8">

                      <div>
                        <h3 className="text-[22px] font-normal sm:text-[26px]">
                          AI Chats:
                        </h3>

                        <strong className="mt-0.5 block text-[46px] font-bold leading-[1.1] text-[#2a1a0e] sm:text-[56px]">
                          {stats?.total_chats ?? 0}
                        </strong>
                      </div>

                      {/* CHAT ICON */}

                      <svg
                        className="h-[70px] w-[74px] shrink-0 drop-shadow-[0_10px_8px_rgba(120,80,20,.35)] sm:h-[76px] sm:w-[82px]"
                        viewBox="0 0 72 64"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 4h48a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10H34L14 62V50A10 10 0 0 1 2 40V14A10 10 0 0 1 12 4z"
                          fill="url(#research-plum)"
                          stroke="#fff"
                          strokeWidth="2"
                        />

                        <path
                          d="M16 20h40M16 32h30"
                          stroke="#f7e3ee"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        <path
                          d="M12 4h48a10 10 0 0 1 9 6H3a10 10 0 0 1 9-6z"
                          fill="url(#research-shine)"
                        />
                      </svg>
                    </div>
                  </article>
                </section>

                {/* =============================================
                    RECENT PAPERS + ACTIVITY
                ============================================= */}

                <section className="mt-7 grid gap-6 lg:grid-cols-2">

                  {/* ===========================================
                      RECENT PAPERS
                  =========================================== */}

                  <article className="glossy-card panel-card relative min-h-[420px] p-7 sm:p-8">

                    <h2 className="relative z-10 text-[25px] font-normal sm:text-[29px]">
                      Recent Papers
                    </h2>

                    {recentPapers.length === 0 ? (
                      <div className="relative z-10 flex min-h-[315px] flex-1 flex-col items-center justify-center pb-2 pt-5 text-center">

                        {/* PAPER EMPTY ICON */}

                        <svg
                          className="mb-3 h-[112px] w-[98px] drop-shadow-[0_14px_10px_rgba(120,80,20,.3)]"
                          viewBox="0 0 96 110"
                          aria-hidden="true"
                        >
                          <path
                            d="M34 6h38l22 22v62a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8z"
                            fill="#c99a38"
                            opacity=".75"
                          />

                          <path
                            d="M18 18h40l22 22v62a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z"
                            fill="url(#research-gold)"
                            stroke="#fff"
                            strokeWidth="2"
                          />

                          <path
                            d="M58 18v18a6 6 0 0 0 6 6h16"
                            fill="#f6e3a8"
                          />

                          <path
                            d="M24 62h38M24 74h38M24 86h24"
                            stroke="#fff8e0"
                            strokeWidth="5"
                            strokeLinecap="round"
                          />

                          <path
                            d="M18 18h40l6 6H14z"
                            fill="url(#research-shine)"
                          />
                        </svg>

                        <h4 className="text-[27px] font-normal sm:text-[31px]">
                          Recent Papers
                        </h4>

                        <p className="mt-0.5 text-[18px] text-[#5d4e39] sm:text-[21px]">
                          No papers uploaded yet.
                        </p>

                        <button
                          type="button"
                          onClick={handleUpload}
                          className="glossy-button mt-4 px-7 py-2.5 text-[19px] font-medium text-white"
                        >
                          <span className="relative z-10">
                            Upload Now
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="paper-list relative z-10 mt-5 max-h-[310px] space-y-3 overflow-y-auto pr-1">

                        {recentPapers.map((paper) => (
                          <div
                            key={paper.id}
                            className="rounded-2xl border border-[#e2d6bd] bg-white/75 p-4 shadow-[0_8px_18px_-14px_rgba(90,60,20,.55)] transition hover:-translate-y-0.5 hover:bg-white"
                          >
                            <p className="text-[17px] font-medium text-[#2a1c10] sm:text-[19px]">
                              {paper.title}
                            </p>

                            <p className="mt-1 text-sm text-[#77674e]">
                              {paper.filename}
                            </p>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleUpload}
                          className="glossy-button mx-auto mt-3 block px-7 py-2.5 text-[18px] font-medium text-white"
                        >
                          <span className="relative z-10">
                            Upload Now
                          </span>
                        </button>
                      </div>
                    )}

                    {/* BOOK DECORATION */}

                    <svg
                      className="pointer-events-none absolute bottom-0 left-0 z-0 w-[150px] opacity-75"
                      viewBox="0 0 210 190"
                      aria-hidden="true"
                    >
                      <path
                        d="M14 70q40-8 76 10v100q-36-18-76-10z"
                        fill="#fffaf0"
                        stroke="#9b8864"
                        strokeWidth="3"
                      />

                      <path
                        d="M168 70q-40-8-76 10v100q36-18 76-10z"
                        fill="#f2eadb"
                        stroke="#9b8864"
                        strokeWidth="3"
                      />

                      <path
                        d="M28 88q22-3 46 6M28 104q22-3 46 6M28 120q22-3 46 6M28 136q22-3 46 6"
                        stroke="#9b8864"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <path
                        d="M44 56v14M92 40v38M140 56v14"
                        stroke="#9b8864"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="34"
                        cy="44"
                        r="5"
                        fill="white"
                        stroke="#9b8864"
                        strokeWidth="2"
                      />

                      <circle
                        cx="102"
                        cy="26"
                        r="5"
                        fill="white"
                        stroke="#9b8864"
                        strokeWidth="2"
                      />

                      <circle
                        cx="152"
                        cy="44"
                        r="5"
                        fill="white"
                        stroke="#9b8864"
                        strokeWidth="2"
                      />
                    </svg>
                  </article>

                  {/* ===========================================
                      RECENT ACTIVITY
                  =========================================== */}

                  <article className="glossy-card panel-card relative min-h-[420px] p-7 sm:p-8">

                    <div className="relative z-20 flex items-center justify-between gap-3">

                      <h2 className="text-[25px] font-normal sm:text-[29px]">
                        Recent Activity
                      </h2>

                      {recentActivity.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearActivity}
                          disabled={isClearingActivity}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#8f6f37]/30 bg-gradient-to-b from-white to-[#f1e7d3] px-3.5 py-1.5 text-xs font-medium text-[#7b5a1c] shadow-[0_1px_0_#fff_inset,0_5px_10px_-8px_rgba(90,60,20,.55)] transition hover:bg-gradient-to-b hover:from-[#1b6a73] hover:to-[#0f4c55] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M6 6l1 14h10l1-14" />
                            <path d="M10 11v5" />
                            <path d="M14 11v5" />
                          </svg>

                          {isClearingActivity
                            ? "Clearing..."
                            : "Clear"}
                        </button>
                      )}
                    </div>

                    {recentActivity.length === 0 ? (
                      <div className="relative z-10 flex min-h-[315px] flex-1 flex-col items-center justify-center pb-2 pt-5 text-center">

                        {/* ACTIVITY ICON */}

                        <svg
                          className="mb-3 h-[112px] w-[110px] drop-shadow-[0_14px_10px_rgba(120,80,20,.3)]"
                          viewBox="0 0 110 96"
                          aria-hidden="true"
                        >
                          <g
                            fill="none"
                            strokeLinecap="round"
                            strokeWidth="6"
                          >
                            <path
                              d="M8 20h8M24 20h8"
                              stroke="#c99a38"
                            />

                            <path
                              d="M60 20h22a14 14 0 0 1 0 28H36a14 14 0 0 0 0 28h60"
                              stroke="#b28aa0"
                            />
                          </g>

                          <circle
                            cx="46"
                            cy="20"
                            r="11"
                            fill="url(#research-gold)"
                            stroke="#fff"
                            strokeWidth="2"
                          />

                          <circle
                            cx="60"
                            cy="48"
                            r="11"
                            fill="url(#research-gold)"
                            stroke="#fff"
                            strokeWidth="2"
                          />

                          <circle
                            cx="46"
                            cy="76"
                            r="11"
                            fill="url(#research-plum)"
                            stroke="#fff"
                            strokeWidth="2"
                          />
                        </svg>

                        <h4 className="text-[27px] font-normal sm:text-[31px]">
                          Recent Activity
                        </h4>

                        <p className="mt-0.5 text-[18px] text-[#5d4e39] sm:text-[21px]">
                          No activity yet.
                        </p>

                        <button
                          type="button"
                          onClick={handleUpload}
                          className="mt-3 px-1 py-1 text-[20px] font-normal text-[#0f5a63] transition hover:underline"
                        >
                          Start Your Journey
                        </button>
                      </div>
                    ) : (
                      <div className="paper-list relative z-10 mt-5 max-h-[315px] space-y-3 overflow-y-auto pr-1">

                        {recentActivity.map(
                          (activity) => (
                            <div
                              key={activity.id}
                              className="rounded-2xl border border-[#e2d6bd] bg-white/75 p-4 shadow-[0_8px_18px_-14px_rgba(90,60,20,.55)] transition hover:-translate-y-0.5 hover:bg-white"
                            >
                              <p className="text-[16px] font-medium text-[#2a1c10] sm:text-[18px]">
                                {activity.question}
                              </p>

                              <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#77674e]">
                                {activity.answer}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* MOLECULE DECORATION */}

                    <svg
                      className="pointer-events-none absolute right-[-30px] top-6 z-0 hidden w-[165px] opacity-70 sm:block"
                      viewBox="0 0 210 240"
                      aria-hidden="true"
                    >
                      <g
                        stroke="#8f8068"
                        strokeWidth="5"
                        fill="none"
                      >
                        <path d="M44 118l62-4" />
                        <path d="M110 112l58-52" />
                        <path d="M112 112l62 66" />
                        <path d="M166 180l-40 34" />
                        <path d="M168 62l-2-34" />
                      </g>

                      <g stroke="#fff" strokeWidth="2">
                        <circle
                          cx="40"
                          cy="118"
                          r="26"
                          fill="#bfa8ce"
                        />

                        <circle
                          cx="112"
                          cy="112"
                          r="40"
                          fill="#bfa8ce"
                        />

                        <circle
                          cx="172"
                          cy="56"
                          r="20"
                          fill="#bfa8ce"
                        />

                        <circle
                          cx="180"
                          cy="184"
                          r="30"
                          fill="#bfa8ce"
                        />

                        <circle
                          cx="124"
                          cy="214"
                          r="18"
                          fill="#d5c17c"
                        />

                        <circle
                          cx="166"
                          cy="22"
                          r="12"
                          fill="#d5c17c"
                        />
                      </g>
                    </svg>

                    {/* MICROSCOPE DECORATION */}

                    <svg
                      className="pointer-events-none absolute bottom-[-5px] right-[-5px] z-0 hidden w-[140px] opacity-70 sm:block"
                      viewBox="0 0 190 220"
                      fill="none"
                      stroke="#8f8068"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect
                        x="30"
                        y="196"
                        width="150"
                        height="14"
                        rx="5"
                        fill="#efe7d7"
                      />

                      <path
                        d="M60 196v-16h30v16"
                        fill="#f5efe3"
                      />

                      <path d="M178 150a50 50 0 0 1-70 44" />

                      <rect
                        x="74"
                        y="26"
                        width="28"
                        height="86"
                        rx="8"
                        fill="#f5efe3"
                        transform="rotate(28 88 70)"
                      />

                      <rect
                        x="52"
                        y="108"
                        width="34"
                        height="22"
                        rx="5"
                        fill="#e5dac5"
                        transform="rotate(28 69 119)"
                      />

                      <circle
                        cx="102"
                        cy="118"
                        r="14"
                        fill="#fffaf0"
                      />

                      <circle
                        cx="102"
                        cy="118"
                        r="5"
                      />

                      <rect
                        x="106"
                        y="10"
                        width="26"
                        height="18"
                        rx="5"
                        fill="#f5efe3"
                        transform="rotate(28 119 19)"
                      />
                    </svg>
                  </article>
                </section>
              </>
            )}
          </div>
        </main>
      </AppLayout>
    </ProtectedRoute>
  );
}
