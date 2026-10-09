"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "⏰",
    subtitle: "Your overview",
    color: "pink",
  },
  {
    name: "Upload Papers",
    href: "/upload",
    icon: "☁️",
    subtitle: "Add new PDFs",
    color: "blue",
  },
  {
    name: "AI Chat",
    href: "/chat",
    icon: "🤖",
    subtitle: "Ask questions",
    color: "purple",
  },
  {
    name: "Paper Library",
    href: "/library",
    icon: "📚",
    subtitle: "Saved papers",
    color: "yellow",
  },
  {
    name: "Compare Papers",
    href: "/compare",
    icon: "🐭",
    subtitle: "Side by side",
    color: "pink2",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "⚙️",
    subtitle: "Preferences",
    color: "indigo",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="research-sidebar">
        {/* Background doodles */}
        <div className="sidebar-doodles" aria-hidden="true">
          <span className="doodle owl">🦉</span>
          <span className="doodle book">📖</span>
          <span className="doodle flask">🧪</span>
          <span className="doodle mouse-doodle">🐭</span>
          <span className="doodle star">⭐</span>
          <span className="doodle sparkle">✨</span>
          <span className="doodle microscope">🔬</span>
        </div>

        {/* Brand */}
        <div className="research-brand">
          <div className="brand-owl" aria-hidden="true">
            🦉
          </div>

          <div className="brand-name">
            <span>Research</span>
            <strong>Lane</strong>
          </div>
        </div>

        {/* Navigation */}
        <nav className="research-nav">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`research-nav-item ${item.color} ${
                  isActive ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>

                <span className="nav-text">
                  <span className="nav-name">{item.name}</span>

                  <small>{item.subtitle}</small>
                </span>

                <span className="nav-badge" />
              </Link>
            );
          })}
        </nav>

        {/* Bottom mouse */}
        <div className="sidebar-mouse" aria-hidden="true">
          🐭
          <span>🥼</span>
        </div>
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@500;600;700&display=swap');

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .research-sidebar {
          --sidebar-bg: #e3f3ff;
          --sidebar-ink: #5d5470;
          --sidebar-muted: #9a8fa8;
          --sidebar-edge: #f3dccf;

          position: fixed;
          left: 0;
          top: 0;
          z-index: 40;

          width: 260px;
          height: 100vh;

          display: flex;
          flex-direction: column;

          padding: 22px 14px 0;

          overflow: hidden;

          font-family:
            "Nunito",
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color: var(--sidebar-ink);

          background:
            radial-gradient(
              circle at 10% 8%,
              rgba(255,255,255,.55),
              transparent 32%
            ),
            linear-gradient(
              180deg,
              #e5f4ff 0%,
              #e1f2ff 55%,
              #dff0fc 100%
            );

          border-right:
            1px solid var(--sidebar-edge);

          box-shadow:
            6px 0 24px rgba(183,156,214,.075);
        }

        .research-sidebar *,
        .research-sidebar *::before,
        .research-sidebar *::after {
          box-sizing: border-box;
        }

        /* =====================================================
           BACKGROUND DOODLES
        ===================================================== */

        .sidebar-doodles {
          position: absolute;
          inset: 0;

          overflow: hidden;

          pointer-events: none;

          opacity: .10;
        }

        .sidebar-doodles .doodle {
          position: absolute;

          font-size: 25px;

          user-select: none;

          filter:
            grayscale(.15)
            drop-shadow(
              0 2px 3px rgba(80,70,100,.15)
            );
        }

        .sidebar-doodles .owl {
          left: 10px;
          top: 110px;
          font-size: 24px;
          transform: rotate(-8deg);
        }

        .sidebar-doodles .book {
          right: 16px;
          top: 195px;
          font-size: 22px;
          transform: rotate(8deg);
        }

        .sidebar-doodles .flask {
          left: 34px;
          top: 330px;
          font-size: 24px;
          transform: rotate(-7deg);
        }

        .sidebar-doodles .mouse-doodle {
          right: 18px;
          top: 445px;
          font-size: 25px;
          transform: rotate(8deg);
        }

        .sidebar-doodles .star {
          right: 42px;
          top: 72px;
          font-size: 15px;
        }

        .sidebar-doodles .sparkle {
          left: 10px;
          top: 525px;
          font-size: 15px;
        }

        .sidebar-doodles .microscope {
          right: 34px;
          bottom: 115px;
          font-size: 21px;
          transform: rotate(-8deg);
        }

        /* =====================================================
           BRAND
        ===================================================== */

        .research-brand {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: flex-end;

          gap: 8px;

          padding:
            0
            4px
            22px;
        }

        .brand-owl {
          font-size: 32px;
          line-height: 1;

          filter:
            drop-shadow(
              0 3px 4px rgba(0,0,0,.13)
            );

          animation:
            sidebar-bob 3s ease-in-out infinite;
        }

        @keyframes sidebar-bob {
          50% {
            transform:
              translateY(-4px)
              rotate(-4deg);
          }
        }

        .brand-name {
          display: flex;
          align-items: baseline;

          font-family:
            "Baloo 2",
            "Nunito",
            sans-serif;

          font-size: 27px;
          line-height: 1;

          font-weight: 800;

          letter-spacing: -.5px;

          white-space: nowrap;
        }

        .brand-name span {
          color: #5b4b78;
        }

        .brand-name strong {
          font-weight: 800;
          font-style: normal;

          background:
            linear-gradient(
              90deg,
              #3ccfb4,
              #5aa8ff,
              #a679ff
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;
        }

        /* =====================================================
           NAVIGATION
        ===================================================== */

        .research-nav {
          position: relative;
          z-index: 2;

          display: flex;
          flex-direction: column;

          gap: 11px;

          width: 100%;
        }

        /* =====================================================
           NAV ITEM
        ===================================================== */

        .research-nav-item {
          --item-bg: #ffd3e4;
          --item-icon: #ee7fb0;

          position: relative;

          display: flex;
          align-items: center;

          width: 100%;

          min-height: 62px;

          padding:
            8px
            12px;

          gap: 10px;

          border-radius: 20px;

          border:
            2px solid
            color-mix(
              in srgb,
              var(--item-icon) 30%,
              #fff
            );

          background:
            linear-gradient(
              135deg,
              var(--item-bg),
              color-mix(
                in srgb,
                var(--item-bg) 70%,
                #fff
              )
            );

          color: var(--sidebar-ink);

          text-decoration: none;

          cursor: pointer;

          box-shadow:
            0 1px 0 rgba(255,255,255,.65) inset,
            0 5px 10px rgba(90,80,120,.035);

          transition:
            background .2s ease,
            transform .2s ease,
            box-shadow .2s ease,
            border-color .2s ease;
        }

        .research-nav-item:hover {
          transform: translateY(-2px);

          box-shadow:
            0 8px 16px
            color-mix(
              in srgb,
              var(--item-icon) 22%,
              transparent
            );
        }

        .research-nav-item:focus-visible {
          outline:
            3px solid var(--item-icon);

          outline-offset: 2px;
        }

        /* =====================================================
           ICON
        ===================================================== */

        .nav-icon {
          width: 38px;
          height: 38px;

          flex: none;

          display: grid;
          place-items: center;

          font-size: 27px;
          line-height: 1;

          background: transparent;

          transition:
            transform .25s ease;
        }

        .research-nav-item:hover .nav-icon {
          transform:
            rotate(-8deg)
            scale(1.08);
        }

        /* =====================================================
           TEXT
        ===================================================== */

        .nav-text {
          display: flex;
          flex-direction: column;

          min-width: 0;

          line-height: 1.15;
        }

        .nav-name {
          overflow: hidden;

          font-size: 15px;
          font-weight: 700;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nav-text small {
          margin-top: 2px;

          font-family:
            "Nunito",
            system-ui,
            sans-serif;

          font-size: 11px;
          font-weight: 600;

          color: var(--sidebar-ink);

          opacity: .65;
        }

        /* =====================================================
           ACTIVE PAGE
        ===================================================== */

        .research-nav-item.active {
          border-color: var(--item-icon);

          box-shadow:
            0 0 0 3px
            color-mix(
              in srgb,
              var(--item-icon) 30%,
              transparent
            ),
            0 10px 20px
            color-mix(
              in srgb,
              var(--item-icon) 28%,
              transparent
            ),
            0 1px 0 rgba(255,255,255,.7) inset;

          transform:
            translateX(5px);

          font-weight: 800;
        }

        .research-nav-item.active .nav-name {
          font-weight: 800;
        }

        .research-nav-item.active .nav-text small {
          opacity: .72;
        }

        /* =====================================================
           ACTIVE DOT
        ===================================================== */

        .nav-badge {
          width: 9px;
          height: 9px;

          margin-left: auto;

          flex: none;

          border-radius: 50%;

          background: var(--item-icon);

          opacity: 0;

          transform: scale(.3);

          box-shadow:
            0 0 8px
            color-mix(
              in srgb,
              var(--item-icon) 45%,
              transparent
            );

          transition:
            opacity .25s ease,
            transform .25s ease;
        }

        .research-nav-item.active .nav-badge {
          opacity: 1;
          transform: scale(1);
        }

        /* =====================================================
           INDIVIDUAL COLORS
        ===================================================== */

        .research-nav-item.pink {
          --item-bg: #ffd3e4;
          --item-icon: #ee7fb0;
        }

        .research-nav-item.blue {
          --item-bg: #bfe2ff;
          --item-icon: #5aaef0;
        }

        .research-nav-item.purple {
          --item-bg: #d3d8ff;
          --item-icon: #7a86e8;
        }

        .research-nav-item.yellow {
          --item-bg: #fff0b5;
          --item-icon: #e3bd3c;
        }

        .research-nav-item.pink2 {
          --item-bg: #fbd5f2;
          --item-icon: #e58ad0;
        }

        .research-nav-item.indigo {
          --item-bg: #c6cdfb;
          --item-icon: #6572e0;
        }

        /* =====================================================
           BOTTOM MOUSE
        ===================================================== */

        .sidebar-mouse {
          position: absolute;

          z-index: 3;

          right: 8px;
          bottom: -7px;

          font-size: 62px;
          line-height: 1;

          transform: rotate(-8deg);

          filter:
            drop-shadow(
              0 3px 5px rgba(0,0,0,.13)
            );

          cursor: pointer;

          user-select: none;

          transition:
            transform .3s ease;
        }

        .sidebar-mouse:hover {
          transform:
            rotate(6deg)
            translateY(-8px);
        }

        .sidebar-mouse span {
          position: absolute;

          left: -8px;
          top: 25px;

          font-size: 26px;
        }

        /* =====================================================
           SMALLER SCREENS
        ===================================================== */

        @media (max-width: 700px) {
          .research-sidebar {
            width: 240px;

            padding:
              18px
              11px
              0;
          }

          .brand-name {
            font-size: 25px;
          }

          .brand-owl {
            font-size: 30px;
          }

          .research-nav {
            gap: 9px;
          }

          .research-nav-item {
            min-height: 58px;

            padding:
              7px
              10px;

            gap: 9px;

            border-radius: 18px;
          }

          .nav-icon {
            width: 34px;
            height: 34px;

            font-size: 24px;
          }

          .nav-name {
            font-size: 14px;
          }

          .nav-text small {
            font-size: 10px;
          }

          .sidebar-mouse {
            right: 5px;
            font-size: 54px;
          }

          .sidebar-mouse span {
            font-size: 23px;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .research-sidebar *,
          .research-sidebar *::before,
          .research-sidebar *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}