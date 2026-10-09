"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { GoogleLogin } from "@react-oauth/google";
import gsap from "gsap";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");

  /* =========================================================
     GSAP MASCOT
  ========================================================= */

  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = mascotRef.current;

    if (!root) return;

    const q = gsap.utils.selector(root);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(q(".rb-eye"), {
        transformOrigin: "50% 50%",
      });

      gsap.set(q(".rb-head"), {
        transformOrigin: "50% 100%",
      });

      gsap.set(q(".rb-hand"), {
        transformOrigin: "50% 50%",
      });

      gsap.set(q(".rb-bubble"), {
        transformOrigin: "100% 100%",
      });

      /* -------------------------------------------------------
         Entrance animation
      ------------------------------------------------------- */

      gsap
        .timeline()
        .fromTo(
          q(".rb-robot"),
          {
            autoAlpha: 0,
            y: 20,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          }
        )
        .fromTo(
          q(".rb-bubble"),
          {
            autoAlpha: 0,
            scale: 0.8,
            y: 6,
          },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.8)",
          },
          "+=0.15"
        );

      if (reduceMotion) return;

      /* -------------------------------------------------------
         Gentle floating animation
      ------------------------------------------------------- */

      gsap.to(q(".rb-float"), {
        y: -5,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* -------------------------------------------------------
         Gentle blinking
      ------------------------------------------------------- */

      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 3.4,
          delay: 2,
        })
        .to(q(".rb-eye"), {
          scaleY: 0.08,
          duration: 0.08,
          ease: "power1.in",
        })
        .to(q(".rb-eye"), {
          scaleY: 1,
          duration: 0.12,
          ease: "power1.out",
        });
    }, root);

    return () => ctx.revert();
  }, []);

  /* =========================================================
     MASCOT MOOD
  ========================================================= */

  function setMood(
    mood: "idle" | "email" | "password"
  ) {
    const root = mascotRef.current;

    if (!root) return;

    const q = gsap.utils.selector(root);

    const base = {
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto" as const,
    };

    const head =
      mood === "email"
        ? {
            rotation: -7,
            x: -3,
            y: 2,
          }
        : mood === "password"
          ? {
              rotation: 5,
              x: 2,
              y: 1,
            }
          : {
              rotation: 0,
              x: 0,
              y: 0,
            };

    /* Head movement */

    gsap.to(q(".rb-head"), {
      ...head,
      ...base,
    });

    /* Eyes / face movement */

    gsap.to(q(".rb-face"), {
      x: mood === "email" ? -3 : 0,
      y: mood === "email" ? 2 : 0,
      ...base,
    });

    /* -------------------------------------------------------
       Password focus:
       robot covers its eyes
    ------------------------------------------------------- */

    const cover = mood === "password";

    gsap.to(q(".rb-hand-l"), {
      x: cover ? 18 : 0,
      y: cover ? -45 : 0,
      scale: cover ? 1.45 : 1,
      ...base,
      duration: cover ? 0.45 : 0.35,
      ease: cover
        ? "back.out(1.6)"
        : "power2.out",
    });

    gsap.to(q(".rb-hand-r"), {
      x: cover ? -18 : 0,
      y: cover ? -45 : 0,
      scale: cover ? 1.45 : 1,
      ...base,
      duration: cover ? 0.45 : 0.35,
      ease: cover
        ? "back.out(1.6)"
        : "power2.out",
    });
  }

  /* =========================================================
     MASCOT BUTTON BOUNCE
  ========================================================= */

  function bounceMascot() {
    const root = mascotRef.current;

    if (!root) return;

    const target =
      gsap.utils.selector(root)(".rb-bounce");

    gsap
      .timeline()
      .to(target, {
        y: -9,
        duration: 0.16,
        ease: "power2.out",
      })
      .to(target, {
        y: 0,
        duration: 0.5,
        ease: "bounce.out",
      });
  }

  /* =========================================================
     LOGIN
  ========================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setMessage("Enter a valid email address.");
      return;
    }

    if (!password) {
      setMessage("Enter your password.");
      return;
    }

    setMessage("");

    try {
      await login({
        email: trimmedEmail,
        password,
      });

      void rememberMe;

      router.push("/dashboard");
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const response = (
          error as {
            response?: {
              data?: {
                detail?: string;
              };
            };
          }
        ).response;

        setMessage(
          response?.data?.detail ||
            "Invalid email or password."
        );
      } else {
        setMessage(
          "Unable to sign in. Please try again."
        );
      }
    }
  }

  /* =========================================================
     GOOGLE LOGIN
  ========================================================= */

  async function handleGoogleSuccess(
    credentialResponse: {
      credential?: string;
    }
  ) {
    if (!credentialResponse.credential) {
      setMessage(
        "Google sign-in failed. Please try again."
      );
      return;
    }

    setMessage("");

    try {
      await googleLogin(
        credentialResponse.credential
      );

      router.push("/dashboard");
    } catch {
      setMessage(
        "Google sign-in failed. Please try again."
      );
    }
  }

  function handleGoogleError() {
    setMessage(
      "Google sign-in failed. Please try again."
    );
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --blue: #1d5be0;
          --blue-d: #1648c0;
          --sky: #2f7bf4;
          --ink: #14213d;
          --muted: #5f6f86;
          --line: #dbe3ee;
          --link: #1d5be0;
          --font:
            "Inter", system-ui, -apple-system, "Segoe UI",
            Roboto, sans-serif;

          box-sizing: border-box;

          padding-top:
            env(safe-area-inset-top, 0px);

          padding-bottom:
            env(safe-area-inset-bottom, 0px);
        }

        *,
        *::before,
        *::after {
          box-sizing: inherit;
        }

        html {
          scroll-padding-top:
            env(safe-area-inset-top, 0px);
        }

        body {
          margin: 0;
          min-height: 100vh;
          font-family: var(--font);
          color: var(--ink);

          background: #e6eefc;
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .researchlane-page {
          min-height: 100vh;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          overflow: hidden;
        }

        /* =====================================================
           LEFT SIDE
        ===================================================== */

       /* =====================================================
   LEFT RESEARCHLANE HERO
===================================================== */
.researchlane-left {
          position: relative;
          padding: 26px 36px 0;
          min-height: 620px;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(
              circle at 70% 45%,
              rgba(120, 190, 255, 0.55),
              transparent 55%
            ),
            linear-gradient(
              135deg,
              #1747d1 0%,
              #2a6ff0 55%,
              #2563eb 100%
            );
        }
            .researchlane-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
        }

        .researchlane-logo {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: #fff;
          color: var(--blue);
          display: grid;
          place-items: center;
          font-size: 11px;
          font-weight: 800;
        }

        .researchlane-hero {
          margin-top: 46px;
          position: relative;
          z-index: 2;
        }
           .researchlane-hero h1 {
          margin: 0;
          color: #fff;
          font-size: clamp(28px, 3vw, 38px);
          font-weight: 800;
          letter-spacing: -0.6px;
        }

        .researchlane-hero p {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
        }

        .researchlane-art {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 72%;
        }
          /* LEFT - responsive (inside @media (max-width: 900px)) */

@media (max-width: 900px) {
  .researchlane-left {
    min-height: 430px;
    padding: 22px 20px 0;
  }

  .researchlane-hero {
    margin-top: 30px;
  }

  .researchlane-art {
    height: 62%;
  }
}
  

        /* =====================================================
           RIGHT SIDE
        ===================================================== */

        .researchlane-right {
          position: relative;

          display: grid;
          place-items: center;

          padding: 32px 24px;

          background:
            radial-gradient(
              circle at 20% 20%,
              #f4f8ff,
              transparent 50%
            ),
            linear-gradient(
              180deg,
              #e9f1ff,
              #dce8fb
            );
        }

        /* =====================================================
           EXISTING DECORATIONS
        ===================================================== */

        .researchlane-deco {
          position: absolute;

          pointer-events: none;

          filter:
            drop-shadow(
              0 14px 12px
              rgba(14, 30, 80, 0.35)
            )
            drop-shadow(
              0 2px 3px
              rgba(14, 30, 80, 0.3)
            );
        }

        .researchlane-d-cup {
          left: 5%;
          top: 7%;
          width: 92px;
        }

        .researchlane-d-lap1 {
          right: -26px;
          top: -6px;

          width: 160px;

          transform: rotate(14deg);
        }

        .researchlane-d-bot {
          right: -6px;
          top: 38%;

          width: 96px;
        }

        .researchlane-d-lap2 {
          left: 5%;
          bottom: 5%;

          width: 140px;

          transform: rotate(-16deg);
        }

        .researchlane-d-mic {
          right: 4%;
          bottom: 4%;

          width: 96px;
        }

        /* =====================================================
           LOGIN CARD WRAPPER
        ===================================================== */

        .researchlane-card-wrap {
          position: relative;

          z-index: 2;

          width: 100%;
          max-width: 382px;

          margin-top: 78px;
        }

        .researchlane-card-wrap
          .researchlane-card {
          max-width: none;
        }

        /* =====================================================
           CUTE GSAP ROBOT MASCOT
        ===================================================== */

        .rb-mascot {
          position: absolute;

          top: -80px;
          right: 10px;

          z-index: 3;

          display: flex;
          align-items: flex-end;

          gap: 8px;

          pointer-events: none;
        }

        /*
          GSAP reveals these after mounting.
        */

        .rb-robot,
        .rb-bubble {
          visibility: hidden;
        }

        .rb-robot {
          filter:
            drop-shadow(
              0 8px 8px
              rgba(20, 33, 61, 0.22)
            );
        }

        /* =====================================================
           SPEECH BUBBLE
        ===================================================== */

        .rb-bubble {
          position: relative;

          margin-bottom: 36px;

          padding: 8px 13px;

          background: #fff;

          color: var(--ink);

          border: 1px solid var(--line);

          border-radius: 14px;

          font:
            600 12px var(--font);

          white-space: nowrap;

          box-shadow:
            0 8px 20px -8px
            rgba(29, 91, 224, 0.35);
        }

        .rb-bubble::after {
          content: "";

          position: absolute;

          right: -5px;
          bottom: 10px;

          width: 9px;
          height: 9px;

          background: #fff;

          border-right:
            1px solid var(--line);

          border-top:
            1px solid var(--line);

          transform: rotate(45deg);
        }

        /* =====================================================
           CARD
        ===================================================== */

        .researchlane-card {
          position: relative;

          z-index: 2;

          width: 100%;
          max-width: 382px;

          background: #fff;

          border-radius: 18px;

          padding:
            30px 28px 24px;

          box-shadow:
            0 30px 60px -20px
              rgba(29, 91, 224, 0.28),
            0 6px 18px
              rgba(20, 33, 61, 0.08);
        }

        .researchlane-card h2 {
          margin: 0 0 4px;

          font-size: 21px;
          font-weight: 700;

          letter-spacing: -0.2px;
        }

        .researchlane-sub {
          margin: 0 0 20px;

          font-size: 12.5px;

          color: var(--muted);
        }

        /* =====================================================
           FORM
        ===================================================== */

        .researchlane-lab {
          display: block;

          font-size: 11.5px;
          font-weight: 600;

          color: #2a3a55;

          margin-bottom: 6px;
        }

        .researchlane-row {
          display: flex;

          justify-content:
            space-between;

          align-items: baseline;
        }

        .researchlane-row a {
          font-size: 11.5px;
          font-weight: 600;

          color: var(--link);

          text-decoration: none;
        }

        .researchlane-row a:hover {
          text-decoration: underline;
        }

        .researchlane-field {
          margin-bottom: 14px;
        }

        .researchlane-field input {
          width: 100%;
          height: 40px;

          border:
            1px solid var(--line);

          border-radius: 7px;

          background: #fff;

          padding: 0 12px;

          font:
            500 13px var(--font);

          color: var(--ink);

          outline: none;

          transition:
            border-color 0.15s,
            box-shadow 0.15s;
        }

        .researchlane-field input::placeholder {
          color: #8a97aa;
        }

        .researchlane-field input:focus {
          border-color: var(--sky);

          box-shadow:
            0 0 0 3px
            rgba(47, 123, 244, 0.18);
        }

        /* =====================================================
           REMEMBER ME
        ===================================================== */

        .researchlane-remember {
          display: flex;
          align-items: center;

          gap: 8px;

          font-size: 12px;

          color: var(--muted);

          margin:
            2px 0 16px;

          cursor: pointer;
        }

        .researchlane-remember input {
          width: 14px;
          height: 14px;

          margin: 0;

          accent-color: var(--blue);
        }

        /* =====================================================
           ERROR
        ===================================================== */

        .researchlane-msg {
          min-height: 16px;

          margin:
            -6px 0 6px;

          font-size: 12px;

          color: #c0392b;

          font-weight: 600;
        }

        /* =====================================================
           SIGN IN BUTTON
        ===================================================== */

        .researchlane-btn {
          width: 100%;
          height: 42px;

          border: 0;

          border-radius: 9px;

          cursor: pointer;

          color: #fff;

          font:
            700 14px var(--font);

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              180deg,
              #2f6ff0,
              var(--blue-d)
            );

          box-shadow:
            0 8px 16px -8px
            rgba(29, 91, 224, 0.8);

          transition:
            filter 0.15s,
            transform 0.1s;
        }

        .researchlane-btn::after {
          content: "";

          position: absolute;

          right: -20px;
          top: -30px;

          width: 90px;
          height: 90px;

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.14);
        }

        .researchlane-btn:hover {
          filter: brightness(1.07);
        }

        .researchlane-btn:active {
          transform:
            translateY(1px);
        }

        .researchlane-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .researchlane-btn:focus-visible,
        .researchlane-gbtn:focus-visible {
          outline:
            3px solid
            rgba(47, 123, 244, 0.4);

          outline-offset: 2px;
        }

        /* =====================================================
           OR
        ===================================================== */

        .researchlane-or {
          display: flex;

          align-items: center;

          gap: 12px;

          margin: 16px 0;

          color: #8a97aa;

          font-size: 11px;

          font-weight: 600;
        }

        .researchlane-or::before,
        .researchlane-or::after {
          content: "";

          flex: 1;

          height: 1px;

          background: var(--line);
        }

        /* =====================================================
           GOOGLE
        ===================================================== */

        .researchlane-google-wrapper {
          width: 100%;
          height: 42px;

          display: flex;

          align-items: center;
          justify-content: center;

          overflow: hidden;
        }

        .researchlane-google-wrapper > div {
          width: 100% !important;
        }

        .researchlane-google-wrapper iframe {
          max-width: 100% !important;
        }

        .researchlane-google-fallback {
          width: 100%;
          height: 42px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          border:
            1px solid var(--line);

          border-radius: 9px;

          background: #fff;

          color: #2a3a55;

          font:
            600 13.5px var(--font);
        }

        .researchlane-google-fallback svg {
          width: 18px;
          height: 18px;
        }

        /* =====================================================
           REGISTER
        ===================================================== */

        .researchlane-alt {
          text-align: center;

          font-size: 12px;

          color: var(--muted);

          margin:
            18px 0 0;
        }

        .researchlane-alt a {
          color: var(--link);

          font-weight: 600;

          text-decoration: none;
        }

        .researchlane-alt a:hover {
          text-decoration: underline;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 900px) {
          .researchlane-page {
            grid-template-columns: 1fr;
          }

          .researchlane-left {
            min-height: 430px;

            padding:
              22px 20px 0;
          }

          .researchlane-hero {
            margin-top: 30px;
          }

          .researchlane-art {
            height: 62%;
          }

          .researchlane-right {
            padding:
              100px 16px 40px;
          }

          .researchlane-d-bot,
          .researchlane-d-lap1,
          .researchlane-d-mic {
            display: none;
          }

          .researchlane-d-cup,
          .researchlane-d-lap2 {
            opacity: 0.75;
          }

          .researchlane-card-wrap {
            margin-top: 30px;
          }

          .rb-mascot {
            top: -80px;
            right: 8px;
          }
        }

        @media (max-width: 420px) {
          .rb-bubble {
            font-size: 11px;

            padding:
              7px 10px;
          }

          .rb-robot svg {
            width: 68px;
            height: 76px;
          }

          .researchlane-card {
            padding:
              26px 20px 22px;
          }

          .researchlane-card-wrap {
            max-width: 100%;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition: none !important;
          }
        }
      `}</style>

      {/* =====================================================
          SHARED GLOSSY GRADIENTS + LAPTOP SYMBOL
      ===================================================== */}

      <svg
        width="0"
        height="0"
        style={{
          position: "absolute",
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="gSilver"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stopColor="#f4f7fc"
            />
            <stop
              offset=".5"
              stopColor="#b9c6da"
            />
            <stop
              offset="1"
              stopColor="#6f819e"
            />
          </linearGradient>

          <linearGradient
            id="gScreen"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0"
              stopColor="#2563eb"
            />
            <stop
              offset=".55"
              stopColor="#1239a8"
            />
            <stop
              offset="1"
              stopColor="#081a52"
            />
          </linearGradient>

          <linearGradient
            id="gBase"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stopColor="#dfe7f3"
            />
            <stop
              offset="1"
              stopColor="#7d8fae"
            />
          </linearGradient>

          <linearGradient
            id="gWhite"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0"
              stopColor="#ffffff"
            />
            <stop
              offset=".6"
              stopColor="#e3ebf8"
            />
            <stop
              offset="1"
              stopColor="#a9b9d3"
            />
          </linearGradient>

          <linearGradient
            id="gNavy"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0"
              stopColor="#3b6fd8"
            />
            <stop
              offset=".5"
              stopColor="#143a96"
            />
            <stop
              offset="1"
              stopColor="#071a52"
            />
          </linearGradient>

          <linearGradient
            id="gMetal"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0"
              stopColor="#8fa3c4"
            />
            <stop
              offset=".35"
              stopColor="#f1f5fb"
            />
            <stop
              offset=".7"
              stopColor="#a5b5d0"
            />
            <stop
              offset="1"
              stopColor="#5d7096"
            />
          </linearGradient>

          <radialGradient
            id="gCoffee"
            cx=".4"
            cy=".35"
            r=".8"
          >
            <stop
              offset="0"
              stopColor="#b57443"
            />
            <stop
              offset=".45"
              stopColor="#6b3a1c"
            />
            <stop
              offset="1"
              stopColor="#2a1208"
            />
          </radialGradient>

          <filter
            id="glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="2.2"
            />
          </filter>

          <g id="laptop">
            <rect
              x="14"
              y="4"
              width="112"
              height="76"
              rx="8"
              fill="url(#gSilver)"
            />

            <rect
              x="19"
              y="9"
              width="102"
              height="64"
              rx="4"
              fill="#0a1233"
            />

            <rect
              x="21"
              y="11"
              width="98"
              height="60"
              rx="3"
              fill="url(#gScreen)"
            />

            <rect
              x="29"
              y="21"
              width="42"
              height="4"
              rx="2"
              fill="#7fb2ff"
            />

            <rect
              x="29"
              y="31"
              width="62"
              height="4"
              rx="2"
              fill="#4f86e8"
            />

            <rect
              x="29"
              y="41"
              width="50"
              height="4"
              rx="2"
              fill="#4f86e8"
            />

            <rect
              x="94"
              y="21"
              width="20"
              height="24"
              rx="3"
              fill="#38bdf8"
              opacity=".85"
            />

            <path
              d="M21 11h60L52 71H21z"
              fill="#fff"
              opacity=".13"
            />

            <path
              d="M3 80h134l-8 14H11z"
              fill="url(#gBase)"
            />

            <path
              d="M3 80h134"
              stroke="#fff"
              strokeWidth="1.4"
              opacity=".8"
            />

            <rect
              x="52"
              y="82"
              width="36"
              height="5"
              rx="2.5"
              fill="#5d7096"
              opacity=".75"
            />
          </g>
        </defs>
      </svg>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="researchlane-page">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        {/* =====================================================
    LEFT SIDE — RESEARCHLANE HERO
===================================================== */}
           <section className="researchlane-left">
          <div className="researchlane-brand">
            <span className="researchlane-logo">RL</span>
            ResearchLane
          </div>

          <div className="researchlane-hero">
            <h1>The Art of Analysis</h1>
            <p>
              Upload, analyze, and compare research papers instantly.
            </p>
          </div>

          <svg
            className="researchlane-art"
            viewBox="0 0 540 400"
            preserveAspectRatio="xMidYMax meet"
            aria-hidden="true"
          >
            
             <defs>
  <radialGradient id="orb" cx=".38" cy=".3" r=".85">
    <stop offset="0" stopColor="#d6f0ff" />
    <stop offset=".4" stopColor="#5aa9ff" />
    <stop offset="1" stopColor="#0b2a8a" />
  </radialGradient>

  <radialGradient id="aura">
    <stop offset="0" stopColor="#9fd8ff" stopOpacity=".7" />
    <stop offset="1" stopColor="#9fd8ff" stopOpacity="0" />
  </radialGradient>

  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stopColor="#fde68a" />
    <stop offset=".5" stopColor="#7dd3fc" />
    <stop offset="1" stopColor="#fbbf24" />
  </linearGradient>

  <linearGradient id="trail" x1="0" y1="1" x2="1" y2="0">
    <stop offset="0" stopColor="#f59e0b" stopOpacity="0" />
    <stop offset=".6" stopColor="#fbbf24" />
    <stop offset="1" stopColor="#fff7c2" />
  </linearGradient>

  <marker
    id="ah"
    viewBox="0 0 10 10"
    refX="7"
    refY="5"
    markerWidth="6"
    markerHeight="6"
    orient="auto"
  >
    <path d="M0 0L10 5L0 10z" fill="#fbbf24" />
  </marker>

  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow
      dx="0"
      dy="6"
      stdDeviation="6"
      floodColor="#06236b"
      floodOpacity=".35"
    />
  </filter>

  <linearGradient id="rWhite" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#ffffff" />
    <stop offset=".6" stopColor="#e6eefb" />
    <stop offset="1" stopColor="#a9bbd8" />
  </linearGradient>

  <linearGradient id="rVisor" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#2c4fb8" />
    <stop offset=".5" stopColor="#122a78" />
    <stop offset="1" stopColor="#060f3a" />
  </linearGradient>

  <radialGradient id="rEye" cx=".5" cy=".35" r=".8">
    <stop offset="0" stopColor="#e6fdff" />
    <stop offset=".5" stopColor="#38d5ff" />
    <stop offset="1" stopColor="#0a7be0" />
  </radialGradient>
</defs>
            
            {/* AI orb */}
            <circle
              cx="372"
              cy="150"
              r="96"
              fill="url(#aura)"
            />

            <ellipse
              cx="372"
              cy="150"
              rx="104"
              ry="30"
              fill="none"
              stroke="url(#ring)"
              strokeWidth="3"
              opacity=".85"
              transform="rotate(-24 372 150)"
            />

            <circle
              cx="372"
              cy="150"
              r="52"
              fill="url(#orb)"
              filter="url(#sh)"
            />
            <ellipse
              cx="354"
              cy="124"
              rx="24"
              ry="12"
              fill="#fff"
              opacity=".35"
              transform="rotate(-25 354 124)"
            />

            <text
              x="372"
              y="166"
              textAnchor="middle"
              fontFamily="Inter,sans-serif"
              fontWeight="800"
              fontSize="46"
              fill="#fff"
            >
              AI
            </text>

            <path
              d="M268 150A104 30 0 0 0 476 150"
              fill="none"
              stroke="url(#ring)"
              strokeWidth="3.5"
              transform="rotate(-24 372 150)"
            />

            {/* arrows + glow trail */}
            <path
              d="M262 132Q292 124 316 142"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeLinecap="round"
              markerEnd="url(#ah)"
            />
            <path
              d="M404 202Q430 226 428 250"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeLinecap="round"
              markerEnd="url(#ah)"
            />

            <path
              d="M296 292C300 250 316 214 338 190"
              fill="none"
              stroke="url(#trail)"
              strokeWidth="9"
              strokeLinecap="round"
            />

            <path
              d="M306 282C316 250 326 226 346 204"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity=".7"
            />

            {/* papers */}
            <g
              transform="translate(168 78) rotate(-9)"
              filter="url(#sh)"
            >
              <rect
                width="58"
                height="74"
                rx="4"
                fill="#fff"
              />
               <g fill="#c6d3ea">
                <rect
                  x="8"
                  y="12"
                  width="30"
                  height="4"
                  rx="2"
                />
                <rect
                  x="8"
                  y="24"
                  width="42"
                  height="3"
                  rx="1.5"
                />
                <rect
                  x="8"
                  y="33"
                  width="42"
                  height="3"
                  rx="1.5"
                />
                <rect
                  x="8"
                  y="42"
                  width="36"
                  height="3"
                  rx="1.5"
                />
                <rect
                  x="8"
                  y="51"
                  width="40"
                  height="3"
                  rx="1.5"
                />
              </g>
               </g>

            <g
              transform="translate(404 252) rotate(10)"
              filter="url(#sh)"
            >
              <rect
                width="52"
                height="66"
                rx="4"
                fill="#fff"
              />

              <text
                x="8"
                y="22"
                fontFamily="Inter,sans-serif"
                fontWeight="800"
                fontSize="13"
                fill="#1d5be0"
              >
                AI
              </text>

              <g fill="#c6d3ea">
                <rect
                  x="8"
                  y="30"
                  width="36"
                  height="3"
                  rx="1.5"
                />
                 <rect
                  x="8"
                  y="39"
                  width="36"
                  height="3"
                  rx="1.5"
                />
                <rect
                  x="8"
                  y="48"
                  width="28"
                  height="3"
                  rx="1.5"
                />
              </g>

              <path
                d="M32 18l5 5 9-10"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>

            <g
              transform="translate(450 196) rotate(18)"
            >
              <rect
                width="30"
                height="38"
                rx="3"
                fill="#fff"
                opacity=".9"
              />
              <rect
                x="6"
                y="9"
                width="18"
                height="3"
                rx="1.5"
                fill="#c6d3ea"
              />
              <rect
                x="6"
                y="17"
                width="18"
                height="3"
                rx="1.5"
                fill="#c6d3ea"
              />
            </g>

            {/* Cute robot */}
            <g filter="url(#sh)">
              <line
                x1="160"
                y1="192"
                x2="160"
                y2="170"
                stroke="#9db3d6"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <circle
                cx="160"
                cy="163"
                r="9"
                fill="url(#rEye)"
              />
               <circle
                cx="157"
                cy="159"
                r="2.6"
                fill="#fff"
                opacity=".9"
              />

              {/* body */}
              <path
                d="M100 400C100 344 122 312 160 312C198 312 220 344 220 400Z"
                fill="url(#rWhite)"
              />

              <path
                d="M120 322Q160 340 200 322"
                fill="none"
                stroke="#2f6ff0"
                strokeWidth="7"
                strokeLinecap="round"
              />

              <circle
                cx="160"
                cy="360"
                r="14"
                fill="url(#rVisor)"
              />

              <circle
                cx="160"
                cy="360"
                r="7"
                fill="#7be8ff"
              />

              <circle
                cx="157"
                cy="357"
                r="2.4"
                fill="#fff"
              />
              <path
                d="M112 345q-4 22 -2 40"
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
                opacity=".8"
              />

              {/* arms */}
              <path
                d="M108 340C90 352 80 366 76 382"
                fill="none"
                stroke="url(#rWhite)"
                strokeWidth="17"
                strokeLinecap="round"
              />

              <path
                d="M212 338C232 330 246 312 252 292"
                fill="none"
                stroke="url(#rWhite)"
                strokeWidth="17"
                strokeLinecap="round"
              />

              <circle
                cx="75"
                cy="386"
                r="10"
                fill="#dbe6f7"
              />

              <circle
                cx="253"
                cy="288"
                r="10"
                fill="#dbe6f7"
              />
              {/* neck */}
              <rect
                x="146"
                y="294"
                width="28"
                height="22"
                rx="8"
                fill="#b9c8e2"
              />

              {/* ear pods */}
              <rect
                x="80"
                y="232"
                width="20"
                height="44"
                rx="10"
                fill="url(#rVisor)"
              />

              <rect
                x="220"
                y="232"
                width="20"
                height="44"
                rx="10"
                fill="url(#rVisor)"
              />

              {/* head */}
              <rect
                x="94"
                y="188"
                width="132"
                height="110"
                rx="50"
                fill="url(#rWhite)"
              />
               <path
                d="M112 206q20 -14 50 -14"
                fill="none"
                stroke="#fff"
                strokeWidth="5"
                strokeLinecap="round"
                opacity=".95"
              />

              {/* visor face */}
              <rect
                x="108"
                y="208"
                width="104"
                height="70"
                rx="32"
                fill="url(#rVisor)"
              />

              <ellipse
                cx="140"
                cy="240"
                rx="12"
                ry="15"
                fill="url(#rEye)"
              />

              <ellipse
                cx="180"
                cy="240"
                rx="12"
                ry="15"
                fill="url(#rEye)"
              />
              <ellipse
                cx="140"
                cy="240"
                rx="12"
                ry="15"
                fill="none"
                stroke="#7be8ff"
                strokeWidth="1.5"
                opacity=".7"
              />

              <ellipse
                cx="180"
                cy="240"
                rx="12"
                ry="15"
                fill="none"
                stroke="#7be8ff"
                strokeWidth="1.5"
                opacity=".7"
              />

              <circle
                cx="136"
                cy="234"
                r="4.6"
                fill="#fff"
              />

              <circle
                cx="176"
                cy="234"
                r="4.6"
                fill="#fff"
              />

              <circle
                cx="145"
                cy="246"
                r="2"
                fill="#fff"
                opacity=".85"
              />
              <circle
                cx="185"
                cy="246"
                r="2"
                fill="#fff"
                opacity=".85"
              />

              <path
                d="M150 262Q160 271 170 262"
                fill="none"
                stroke="#7be8ff"
                strokeWidth="3.4"
                strokeLinecap="round"
              />

              <ellipse
                cx="124"
                cy="260"
                rx="7"
                ry="4"
                fill="#ff7aa8"
                opacity=".55"
              />

              <ellipse
                cx="196"
                cy="260"
                rx="7"
                ry="4"
                fill="#ff7aa8"
                opacity=".55"
              />

              <path
                d="M118 218q30 -8 62 -4"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                opacity=".3"
              />
               </g>

            {/* floating tablet */}
            <ellipse
              cx="318"
              cy="396"
              rx="42"
              ry="7"
              fill="#06236b"
              opacity=".25"
            />

            <g
              transform="translate(266 236) rotate(-14)"
              filter="url(#sh)"
            >
              <rect
                width="96"
                height="124"
                rx="9"
                fill="#1b2438"
              />

              <rect
                x="6"
                y="6"
                width="84"
                height="112"
                rx="5"
                fill="#3b82f6"
              />

              <rect
                x="14"
                y="16"
                width="44"
                height="6"
                rx="3"
                fill="#bfdbfe"
              />
               <rect
                x="14"
                y="30"
                width="68"
                height="40"
                rx="5"
                fill="#93c5fd"
              />

              <path
                d="M20 62l14-14 12 10 16-18 12 12"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <rect
                x="14"
                y="80"
                width="62"
                height="5"
                rx="2.5"
                fill="#bfdbfe"
              />

              <rect
                x="14"
                y="92"
                width="46"
                height="5"
                rx="2.5"
                fill="#bfdbfe"
              />
            </g>
            {/* sparkles */}
            <g fill="#fff">
              <circle
                cx="456"
                cy="110"
                r="2.5"
                opacity=".9"
              />

              <circle
                cx="278"
                cy="60"
                r="2"
                opacity=".7"
              />

              <circle
                cx="500"
                cy="170"
                r="2"
                opacity=".7"
              />

              <circle
                cx="238"
                cy="206"
                r="2"
                opacity=".6"
              />

              <path
                d="M470 74q0 8 8 8q-8 0-8 8q0-8-8-8q8 0 8-8z"
                opacity=".9"
              />

              <path
                d="M300 36q0 6 6 6q-6 0-6 6q0-6-6-6q6 0 6-6z"
                opacity=".8"
              />
            </g>
          </svg>
        </section>
                   
                

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <section className="researchlane-right">

          {/* =================================================
              EXISTING DECORATIVE SVGs

              KEEP YOUR CURRENT:
              - coffee cup
              - laptop
              - glossy robot
              - second laptop
              - microphone

              exactly as they are here.
          ================================================= */}

          {/* Coffee cup */}
          {/* YOUR EXISTING COFFEE SVG */}

          {/* Laptop 1 */}
          {/* YOUR EXISTING LAPTOP SVG */}

          {/* Existing glossy robot */}
          {/* YOUR EXISTING ROBOT SVG */}

          {/* Laptop 2 */}
          {/* YOUR EXISTING LAPTOP SVG */}

          {/* Microphone */}
          {/* YOUR EXISTING MICROPHONE SVG */}


          {/* =================================================
              LOGIN CARD + NEW MASCOT
          ================================================= */}

          <div className="researchlane-card-wrap">

            {/* =================================================
                CUTE ROBOT MASCOT
            ================================================= */}

            <div
              className="rb-mascot"
              ref={mascotRef}
              aria-hidden="true"
            >

              {/* Speech bubble */}

              <div className="rb-bubble">
                Sign in here, please? 🥺
              </div>

              {/* Robot */}

              <div className="rb-robot">

                <svg
                  className="rb-float"
                  viewBox="0 0 100 110"
                  width="78"
                  height="86"
                >

                  <defs>

                    <linearGradient
                      id="rbWhite"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop
                        offset="0"
                        stopColor="#ffffff"
                      />

                      <stop
                        offset=".6"
                        stopColor="#e6eefb"
                      />

                      <stop
                        offset="1"
                        stopColor="#a9bbd8"
                      />
                    </linearGradient>

                    <linearGradient
                      id="rbVisor"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop
                        offset="0"
                        stopColor="#3b6fe8"
                      />

                      <stop
                        offset=".55"
                        stopColor="#4a3fc4"
                      />

                      <stop
                        offset="1"
                        stopColor="#1e1b6e"
                      />
                    </linearGradient>

                    <radialGradient
                      id="rbEye"
                      cx=".5"
                      cy=".35"
                      r=".8"
                    >
                      <stop
                        offset="0"
                        stopColor="#e6fdff"
                      />

                      <stop
                        offset=".5"
                        stopColor="#38d5ff"
                      />

                      <stop
                        offset="1"
                        stopColor="#0a7be0"
                      />
                    </radialGradient>

                  </defs>

                  {/* Soft ground shadow */}

                  <ellipse
                    cx="50"
                    cy="107"
                    rx="22"
                    ry="3"
                    fill="#14213d"
                    opacity=".12"
                  />

                  <g className="rb-bounce">

                    {/* Body */}

                    <rect
                      x="30"
                      y="74"
                      width="40"
                      height="30"
                      rx="15"
                      fill="url(#rbWhite)"
                    />

                    <circle
                      cx="50"
                      cy="89"
                      r="5.5"
                      fill="url(#rbVisor)"
                    />

                    <circle
                      cx="50"
                      cy="89"
                      r="2.4"
                      fill="#7be8ff"
                    />

                    {/* Head */}

                    <g className="rb-head">

                      {/* Antenna */}

                      <line
                        x1="50"
                        y1="11"
                        x2="50"
                        y2="4"
                        stroke="#9db3d6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="50"
                        cy="4"
                        r="3.5"
                        fill="url(#rbEye)"
                      />

                      <circle
                        cx="49"
                        cy="3"
                        r="1.1"
                        fill="#fff"
                        opacity=".9"
                      />

                      {/* Ear pods */}

                      <rect
                        x="5"
                        y="32"
                        width="9"
                        height="22"
                        rx="4.5"
                        fill="url(#rbVisor)"
                      />

                      <rect
                        x="86"
                        y="32"
                        width="9"
                        height="22"
                        rx="4.5"
                        fill="url(#rbVisor)"
                      />

                      {/* Head */}

                      <rect
                        x="11"
                        y="10"
                        width="78"
                        height="64"
                        rx="28"
                        fill="url(#rbWhite)"
                      />

                      <path
                        d="M22 20q12-8 28-8"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity=".9"
                      />

                      {/* Visor */}

                      <rect
                        x="19"
                        y="21"
                        width="62"
                        height="42"
                        rx="20"
                        fill="url(#rbVisor)"
                      />

                      <g className="rb-face">

                        {/* Pleading brows */}

                        <path
                          d="M28 31L44 26"
                          stroke="#bfe9ff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          opacity=".85"
                        />

                        <path
                          d="M72 31L56 26"
                          stroke="#bfe9ff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          opacity=".85"
                        />

                        {/* Left eye */}

                        <g className="rb-eye">

                          <ellipse
                            cx="38"
                            cy="43"
                            rx="8"
                            ry="10"
                            fill="url(#rbEye)"
                          />

                          <circle
                            cx="35"
                            cy="39"
                            r="3.6"
                            fill="#fff"
                          />

                          <circle
                            cx="41"
                            cy="48"
                            r="1.6"
                            fill="#fff"
                            opacity=".85"
                          />

                        </g>

                        {/* Right eye */}

                        <g className="rb-eye">

                          <ellipse
                            cx="62"
                            cy="43"
                            rx="8"
                            ry="10"
                            fill="url(#rbEye)"
                          />

                          <circle
                            cx="59"
                            cy="39"
                            r="3.6"
                            fill="#fff"
                          />

                          <circle
                            cx="65"
                            cy="48"
                            r="1.6"
                            fill="#fff"
                            opacity=".85"
                          />

                        </g>

                        {/* Pouty mouth */}

                        <path
                          d="M45 56Q50 52.5 55 56"
                          fill="none"
                          stroke="#7be8ff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />

                        {/* Blush */}

                        <ellipse
                          cx="27"
                          cy="54"
                          rx="5"
                          ry="3"
                          fill="#ff7aa8"
                          opacity=".5"
                        />

                        <ellipse
                          cx="73"
                          cy="54"
                          rx="5"
                          ry="3"
                          fill="#ff7aa8"
                          opacity=".5"
                        />

                      </g>
                    </g>

                    {/* =================================================
                        HANDS

                        Drawn LAST so they can cover the eyes
                        when password is focused.
                    ================================================= */}

                    <circle
                      className="rb-hand rb-hand-l"
                      cx="20"
                      cy="88"
                      r="6.5"
                      fill="url(#rbWhite)"
                      stroke="#c9d6ec"
                      strokeWidth="1"
                    />

                    <circle
                      className="rb-hand rb-hand-r"
                      cx="80"
                      cy="88"
                      r="6.5"
                      fill="url(#rbWhite)"
                      stroke="#c9d6ec"
                      strokeWidth="1"
                    />

                  </g>
                </svg>
              </div>
            </div>

            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <main className="researchlane-card">

              <h2>
                Welcome back
              </h2>

              <p className="researchlane-sub">
                Sign in to continue to ResearchLane
              </p>

              <form
                id="f"
                noValidate
                onSubmit={handleSubmit}
              >

                {/* EMAIL */}

                <div className="researchlane-field">

                  <label
                    className="researchlane-lab"
                    htmlFor="email"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    onFocus={() =>
                      setMood("email")
                    }
                    onBlur={() =>
                      setMood("idle")
                    }
                  />

                </div>

                {/* PASSWORD */}

                <div className="researchlane-field">

                  <div className="researchlane-row">

                    <label
                      className="researchlane-lab"
                      htmlFor="pw"
                    >
                      Password
                    </label>

                    <Link href="/forgot-password">
                      Forgot password?
                    </Link>

                  </div>

                  <input
                    id="pw"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    onFocus={() =>
                      setMood("password")
                    }
                    onBlur={() =>
                      setMood("idle")
                    }
                  />

                </div>

                {/* REMEMBER ME */}

                <label className="researchlane-remember">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                  />

                  Remember me for 30 days

                </label>

                {/* MESSAGE */}

                <div
                  className="researchlane-msg"
                  role="alert"
                >
                  {message}
                </div>

                {/* SIGN IN */}

                <button
                  className="researchlane-btn"
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={bounceMascot}
                >
                  {isLoading
                    ? "Signing in..."
                    : "Sign in"}
                </button>

              </form>

              {/* OR */}

              <div className="researchlane-or">
                OR
              </div>

              {/* GOOGLE LOGIN */}

              <div className="researchlane-google-wrapper">

                <GoogleLogin
                  onSuccess={
                    handleGoogleSuccess
                  }
                  onError={
                    handleGoogleError
                  }
                  theme="outline"
                  size="large"
                  width="326"
                  text="signin_with"
                  shape="rectangular"
                />

              </div>

              {/* REGISTER */}

              <p className="researchlane-alt">

                Don't have an account?{" "}

                <Link href="/register">
                  Create an account
                </Link>

              </p>

            </main>
          </div>
        </section>
      </div>
    </>
  );
}