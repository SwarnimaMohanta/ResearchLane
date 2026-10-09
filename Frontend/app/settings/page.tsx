"use client";

import {
CalendarDays,
CheckCircle2,
LogOut,
Mail,
ShieldCheck,
UserRound,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/auth-store";

export default function SettingsPage() {
const { user, logout } = useAuthStore();

if (!user) {
return null;
}

const formattedDate = new Date(user.created_at).toLocaleDateString(
"en-US",
{
year: "numeric",
month: "long",
day: "numeric",
}
);

return ( <ProtectedRoute> <AppLayout> <main className="settings-page">
{/* Decorative background */} <div className="settings-glow settings-glow-one" /> <div className="settings-glow settings-glow-two" /> <div className="settings-glow settings-glow-three" />

```
      <div className="settings-doodle settings-doodle-one">✦</div>
      <div className="settings-doodle settings-doodle-two">✧</div>
      <div className="settings-doodle settings-doodle-three">◇</div>
      <div className="settings-doodle settings-doodle-four">✦</div>
      <div className="settings-doodle settings-doodle-five">○</div>
      <div className="settings-doodle settings-doodle-six">✧</div>

      <div className="settings-wrap">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="settings-header">
          <div className="settings-title-row">
            <h1>Settings</h1>

            <span className="settings-title-sparkle">✦</span>
            <span className="settings-title-flower">✿</span>
          </div>

          <p>
            Manage your ResearchLane account and security.
          </p>

          <span className="settings-header-leaf">❧</span>
        </header>

        {/* =====================================================
            PROFILE
        ===================================================== */}

        <section className="settings-card profile-card">
          {/* Floating avatar */}
          <div className="settings-big-avatar">
            <div className="avatar-head">
              <div className="avatar-hair" />

              <div className="avatar-face">
                <span className="avatar-glasses left">
                  <span className="avatar-eye" />
                </span>

                <span className="avatar-glasses right">
                  <span className="avatar-eye" />
                </span>

                <span className="avatar-mouth" />
              </div>
            </div>

            <span className="avatar-badge">ID</span>

            <span className="avatar-star avatar-star-one">✦</span>
            <span className="avatar-star avatar-star-two">✧</span>
          </div>

          <div className="settings-card-head profile">
            <div className="settings-icon-box profile-icon">
              <UserRound />
            </div>

            <div>
              <h2>Profile</h2>

              <p>
                Your ResearchLane account information.
              </p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="settings-grid">
              {/* Name */}
              <div className="settings-field">
                <span className="settings-label">
                  Name
                </span>

                <div className="settings-pill blue">
                  <span className="settings-pill-icon">
                    <UserRound />
                  </span>

                  <span className="settings-value">
                    {user.name}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="settings-field">
                <span className="settings-label">
                  Email
                </span>

                <div className="settings-pill sky">
                  <span className="settings-pill-icon">
                    <Mail />
                  </span>

                  <span className="settings-value">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Account Created */}
              <div className="settings-field">
                <span className="settings-label">
                  Account created
                </span>

                <div className="settings-pill pink">
                  <span className="settings-pill-icon">
                    <CalendarDays />
                  </span>

                  <span className="settings-value">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Account Status */}
              <div className="settings-field">
                <span className="settings-label">
                  Account status
                </span>

                <div className="settings-pill green">
                  <span className="settings-pill-icon">
                    <CheckCircle2 />
                  </span>

                  <span className="settings-value">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECURITY
        ===================================================== */}

        <section className="settings-card security-card">
          <div className="settings-card-head security">
            <div className="settings-icon-box security-icon">
              <ShieldCheck />
            </div>

            <div>
              <h2>Security</h2>

              <p>
                Manage your current ResearchLane session.
              </p>
            </div>

            <span className="security-decoration">✦</span>
          </div>

          <div className="settings-card-body">
            <div className="settings-signout">
              <div className="settings-signout-content">
                <div className="settings-signout-title">
                  <span>Sign out</span>

                  <span className="door-icon">
                    <LogOut />
                  </span>
                </div>

                <p>
                  Sign out of your ResearchLane account
                  on this device.
                </p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="settings-logout"
              >
                <LogOut />

                <span>Logout</span>
              </button>
            </div>
          </div>
        </section>

        {/* Small footer decoration */}
        <div className="settings-footer-decoration">
          <span>✦</span>
          <span>ResearchLane</span>
          <span>✦</span>
        </div>
      </div>
    </main>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap');

      /* =====================================================
         PAGE
      ===================================================== */

      .settings-page {
        position: relative;
        min-height: 100vh;
        overflow: hidden;

        font-family: "Fraunces", Georgia, serif;
        color: #2f2a45;

        background:
          radial-gradient(
            circle at 15% 5%,
            rgba(255,255,255,.72),
            transparent 30%
          ),
          radial-gradient(
            circle at 88% 90%,
            rgba(255,255,255,.45),
            transparent 30%
          ),
          radial-gradient(
            circle at 52% 45%,
            rgba(255,255,255,.22),
            transparent 38%
          ),
          linear-gradient(
            145deg,
            #e8def8 0%,
            #ddd1f2 42%,
            #d5c8ed 72%,
            #cec0e8 100%
          );
      }

      .settings-page *,
      .settings-page *::before,
      .settings-page *::after {
        box-sizing: border-box;
      }

      /* =====================================================
         BACKGROUND GLOWS
      ===================================================== */

      .settings-glow {
        position: absolute;
        border-radius: 999px;
        pointer-events: none;
        filter: blur(2px);
      }

      .settings-glow-one {
        width: 280px;
        height: 280px;
        top: -120px;
        right: 10%;
        background: rgba(255,255,255,.25);
      }

      .settings-glow-two {
        width: 220px;
        height: 220px;
        left: -100px;
        top: 38%;
        background: rgba(184,166,232,.25);
      }

      .settings-glow-three {
        width: 300px;
        height: 300px;
        right: -150px;
        bottom: -100px;
        background: rgba(255,255,255,.2);
      }

      /* =====================================================
         DECORATIVE SYMBOLS
      ===================================================== */

      .settings-doodle {
        position: absolute;
        z-index: 0;

        color: rgba(121,103,168,.48);

        font-family: Georgia, serif;
        pointer-events: none;

        text-shadow:
          0 2px 5px rgba(255,255,255,.45);
      }

      .settings-doodle-one {
        left: 4%;
        top: 70px;
        font-size: 30px;
        transform: rotate(-12deg);
      }

      .settings-doodle-two {
        right: 7%;
        top: 42px;
        font-size: 44px;
        transform: rotate(14deg);
      }

      .settings-doodle-three {
        left: 3%;
        top: 245px;
        font-size: 50px;
        opacity: .45;
        transform: rotate(-10deg);
      }

      .settings-doodle-four {
        right: 4%;
        top: 330px;
        font-size: 28px;
        transform: rotate(12deg);
      }

      .settings-doodle-five {
        left: 8%;
        bottom: 90px;
        font-size: 52px;
        opacity: .3;
      }

      .settings-doodle-six {
        right: 10%;
        bottom: 50px;
        font-size: 34px;
        opacity: .4;
      }

      /* =====================================================
         WRAPPER
      ===================================================== */

      .settings-wrap {
        position: relative;
        z-index: 1;

        width: min(860px, calc(100% - 40px));

        margin: 0 auto;

        padding:
          42px
          0
          70px;
      }

      /* =====================================================
         HEADER
      ===================================================== */

      .settings-header {
        position: relative;
        margin-bottom: 42px;
        padding-left: 18px;
      }

      .settings-title-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .settings-header h1 {
        margin: 0;

        font-size: clamp(32px, 4vw, 40px);
        line-height: 1;

        font-weight: 700;
        letter-spacing: -.6px;

        color: #4a3a73;

        text-shadow:
          0 2px 0 rgba(255,255,255,.75),
          0 9px 20px rgba(90,70,150,.16);
      }

      .settings-header p {
        margin: 10px 0 0;

        font-size: 14px;
        font-weight: 500;

        color: #554b70;
      }

      .settings-title-sparkle {
        display: inline-flex;

        align-items: center;
        justify-content: center;

        width: 28px;
        height: 28px;

        color: #8e76bd;

        font-size: 23px;

        filter:
          drop-shadow(
            0 4px 5px rgba(80,60,130,.2)
          );
      }

      .settings-title-flower {
        color: #b28bb7;
        font-size: 22px;

        filter:
          drop-shadow(
            0 4px 5px rgba(80,60,130,.16)
          );
      }

      .settings-header-leaf {
        position: absolute;

        left: -4px;
        bottom: -23px;

        color: #9b89c1;

        font-size: 27px;

        transform:
          rotate(-25deg);

        opacity: .8;
      }

      /* =====================================================
         CARDS
      ===================================================== */

      .settings-card {
        position: relative;

        margin-bottom: 27px;

        overflow: visible;

        border-radius: 25px;

        border:
          1px solid rgba(255,255,255,.92);

        background:
          rgba(255,255,255,.9);

        box-shadow:
          0 1px 0 rgba(255,255,255,.95) inset,
          0 0 0 1px rgba(145,125,205,.22),
          0 28px 50px -28px rgba(80,60,150,.58),
          0 9px 18px rgba(80,60,150,.09);

        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      .settings-card::after {
        content: "";

        position: absolute;
        inset: 1px;

        border-radius: 24px;

        pointer-events: none;

        background:
          linear-gradient(
            125deg,
            rgba(255,255,255,.28),
            transparent 28%,
            transparent 70%,
            rgba(255,255,255,.18)
          );
      }

      /* =====================================================
         CARD HEADER
      ===================================================== */

      .settings-card-head {
        position: relative;

        display: flex;
        align-items: center;

        gap: 14px;

        padding:
          21px
          24px
          18px;

        border-radius:
          24px
          24px
          0
          0;

        overflow: hidden;
      }

      .settings-card-head::before {
        content: "";

        position: absolute;

        left: 0;
        right: 0;
        top: 0;

        height: 60%;

        background:
          linear-gradient(
            180deg,
            rgba(255,255,255,.68),
            transparent
          );

        pointer-events: none;
      }

      .settings-card-head > * {
        position: relative;
        z-index: 1;
      }

      .settings-card-head.profile {
        background:
          linear-gradient(
            180deg,
            #bfd5f7 0%,
            #d9e7fb 100%
          );

        border-bottom:
          1px solid rgba(120,150,210,.24);
      }

      .settings-card-head.security {
        background:
          linear-gradient(
            180deg,
            #c9b9ef 0%,
            #e1d7f7 100%
          );

        border-bottom:
          1px solid rgba(140,120,205,.24);
      }

      .settings-card-head h2 {
        margin: 0;

        font-size: 19px;
        line-height: 1.2;

        font-weight: 700;

        color: #2e2947;
      }

      .settings-card-head p {
        margin: 3px 0 0;

        font-size: 13px;
        font-weight: 500;

        color: #4b4564;
      }

      /* =====================================================
         HEADER ICONS
      ===================================================== */

      .settings-icon-box {
        display: flex;

        align-items: center;
        justify-content: center;

        width: 48px;
        height: 48px;

        flex: none;

        border-radius: 15px;

        border:
          1px solid rgba(255,255,255,.82);

        box-shadow:
          0 1px 0 rgba(255,255,255,.85) inset,
          0 9px 14px -8px rgba(60,70,150,.55);

        backdrop-filter: blur(5px);
      }

      .settings-icon-box svg {
        width: 22px;
        height: 22px;
      }

      .profile-icon {
        color: #5479b7;
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.75),
            rgba(214,228,251,.8)
          );
      }

      .security-icon {
        color: #7258ae;
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.75),
            rgba(225,215,249,.85)
          );
      }

      .security-decoration {
        margin-left: auto;

        color: rgba(113,89,168,.52);

        font-size: 25px;

        transform: rotate(10deg);
      }

      /* =====================================================
         BIG AVATAR
      ===================================================== */

      .settings-big-avatar {
        position: absolute;

        z-index: 5;

        left: 50%;
        top: -38px;

        width: 88px;
        height: 88px;

        margin-left: -44px;

        border-radius: 50%;

        border:
          3px solid rgba(255,255,255,.96);

        background:
          radial-gradient(
            circle at 50% 30%,
            #f8f0ff,
            #d7e5fb 75%
          );

        box-shadow:
          0 0 0 5px rgba(255,255,255,.5),
          0 0 30px rgba(160,140,230,.5),
          0 17px 25px -9px rgba(60,70,150,.55);

        overflow: visible;
      }

      .avatar-head {
        position: absolute;

        left: 50%;
        top: 17px;

        width: 51px;
        height: 58px;

        transform: translateX(-50%);
      }

      .avatar-face {
        position: absolute;

        left: 3px;
        top: 9px;

        width: 45px;
        height: 47px;

        border-radius:
          48%
          48%
          45%
          45%;

        background:
          linear-gradient(
            145deg,
            #ffe1c3,
            #f4c39f
          );

        box-shadow:
          0 3px 5px rgba(120,80,60,.16);
      }

      .avatar-hair {
        position: absolute;

        z-index: 2;

        left: 0;
        top: 0;

        width: 51px;
        height: 38px;

        border-radius:
          52%
          52%
          35%
          35%;

        background:
          linear-gradient(
            145deg,
            #70452f,
            #4e3026
          );

        box-shadow:
          0 4px 7px rgba(70,45,35,.25);
      }

      .avatar-hair::after {
        content: "";

        position: absolute;

        left: -3px;
        top: 24px;

        width: 12px;
        height: 27px;

        border-radius: 50%;

        background: #5a3729;

        transform: rotate(9deg);
      }

      .avatar-glasses {
        position: absolute;

        z-index: 4;

        top: 20px;

        width: 18px;
        height: 14px;

        border:
          2px solid #79583e;

        border-radius: 50%;

        background:
          rgba(255,255,255,.24);
      }

      .avatar-glasses.left {
        left: 3px;
      }

      .avatar-glasses.right {
        right: 3px;
      }

      .avatar-glasses::after {
        content: "";

        position: absolute;

        top: 4px;
        right: -8px;

        width: 7px;
        height: 2px;

        background: #79583e;
      }

      .avatar-glasses.left::after {
        right: -8px;
      }

      .avatar-glasses.right::after {
        left: -8px;
      }

      .avatar-eye {
        position: absolute;

        left: 50%;
        top: 50%;

        width: 3px;
        height: 3px;

        border-radius: 50%;

        background: #3d2d25;

        transform: translate(-50%, -50%);
      }

      .avatar-mouth {
        position: absolute;

        left: 50%;
        bottom: 7px;

        width: 12px;
        height: 5px;

        border-bottom:
          2px solid #ae654f;

        border-radius: 50%;

        transform: translateX(-50%);
      }

      .avatar-badge {
        position: absolute;

        right: -17px;
        bottom: 1px;

        padding:
          3px
          7px;

        border-radius: 7px;

        background: #fff;

        border:
          1.5px solid #cfc3ea;

        color: #6a5aa0;

        font-size: 9px;
        font-weight: 700;

        letter-spacing: .5px;

        transform: rotate(8deg);

        box-shadow:
          0 5px 9px -4px rgba(70,60,130,.4);
      }

      .avatar-star {
        position: absolute;

        color: white;

        text-shadow:
          0 0 7px rgba(255,255,255,.95);

        filter:
          drop-shadow(
            0 0 3px rgba(170,150,235,.7)
          );
      }

      .avatar-star-one {
        left: -19px;
        top: 31px;
        font-size: 13px;
      }

      .avatar-star-two {
        right: -8px;
        top: -7px;
        font-size: 16px;
      }

      /* =====================================================
         CARD BODY
      ===================================================== */

      .settings-card-body {
        padding:
          23px
          24px
          27px;

        border-radius:
          0
          0
          24px
          24px;

        background:
          linear-gradient(
            180deg,
            rgba(255,255,255,.98),
            rgba(250,248,255,.98)
          );
      }

      /* =====================================================
         PROFILE GRID
      ===================================================== */

      .settings-grid {
        display: grid;

        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap:
          19px
          24px;
      }

      .settings-field {
        min-width: 0;
      }

      .settings-label {
        display: block;

        margin-bottom: 8px;

        font-size: 13px;
        font-weight: 600;

        color: #3a3452;
      }

      .settings-pill {
        position: relative;

        display: flex;

        align-items: center;

        gap: 11px;

        min-height: 54px;

        padding:
          7px
          14px
          7px
          8px;

        overflow: hidden;

        border-radius: 15px;

        border:
          1px solid rgba(255,255,255,.9);

        font-size: 14px;
        font-weight: 500;

        color: #302b46;

        box-shadow:
          0 1px 0 rgba(255,255,255,.95) inset,
          0 10px 17px -13px rgba(70,70,140,.5);

        transition:
          transform .2s ease,
          box-shadow .2s ease;
      }

      .settings-pill::before {
        content: "";

        position: absolute;

        left: 0;
        right: 0;
        top: 0;

        height: 52%;

        background:
          linear-gradient(
            180deg,
            rgba(255,255,255,.6),
            transparent
          );

        pointer-events: none;
      }

      .settings-pill:hover {
        transform: translateY(-2px);

        box-shadow:
          0 1px 0 rgba(255,255,255,.95) inset,
          0 17px 22px -13px rgba(70,70,140,.58);
      }

      .settings-pill > * {
        position: relative;
        z-index: 1;
      }

      .settings-pill-icon {
        display: flex;

        align-items: center;
        justify-content: center;

        width: 37px;
        height: 37px;

        flex: none;

        border-radius: 11px;

        background:
          rgba(255,255,255,.55);

        box-shadow:
          0 2px 6px rgba(90,70,130,.12);
      }

      .settings-pill-icon svg {
        width: 18px;
        height: 18px;
      }

      .settings-value {
        min-width: 0;

        overflow: hidden;

        text-overflow: ellipsis;

        white-space: nowrap;
      }

      .settings-pill.blue {
        background:
          linear-gradient(
            180deg,
            #e8edfd,
            #d9e2fa
          );
      }

      .settings-pill.blue .settings-pill-icon {
        color: #5e79bd;
      }

      .settings-pill.sky {
        background:
          linear-gradient(
            180deg,
            #e5f0fa,
            #d5e4f3
          );
      }

      .settings-pill.sky .settings-pill-icon {
        color: #5482aa;
      }

      .settings-pill.pink {
        background:
          linear-gradient(
            180deg,
            #f3e5f3,
            #e8d6eb
          );
      }

      .settings-pill.pink .settings-pill-icon {
        color: #a45f8d;
      }

      .settings-pill.green {
        background:
          linear-gradient(
            180deg,
            #dcf3dc,
            #cbe9cb
          );

        color: #315b36;
      }

      .settings-pill.green .settings-pill-icon {
        color: #4d9654;
      }

      /* =====================================================
         SIGN OUT
      ===================================================== */

      .settings-signout {
        display: flex;

        align-items: center;
        justify-content: space-between;

        gap: 20px;

        padding:
          19px
          21px;

        border-radius: 17px;

        border:
          1.5px solid #e4def2;

        background:
          linear-gradient(
            180deg,
            #ffffff,
            #fcfaff
          );

        box-shadow:
          0 1px 0 #fff inset,
          0 13px 21px -16px rgba(90,70,150,.5);
      }

      .settings-signout-title {
        display: flex;

        align-items: center;

        gap: 8px;

        font-size: 17px;
        font-weight: 600;

        color: #2c2845;
      }

      .door-icon {
        display: inline-flex;

        align-items: center;
        justify-content: center;

        width: 31px;
        height: 31px;

        border-radius: 9px;

        color: #7258ae;

        background:
          linear-gradient(
            145deg,
            #eee7fb,
            #ddd2f4
          );

        box-shadow:
          0 4px 8px -5px rgba(80,60,150,.45);
      }

      .door-icon svg {
        width: 17px;
        height: 17px;
      }

      .settings-signout-content p {
        margin: 6px 0 0;

        font-size: 13px;
        font-weight: 500;

        color: #5c5670;
      }

      /* =====================================================
         LOGOUT BUTTON
      ===================================================== */

      .settings-logout {
        position: relative;

        display: inline-flex;

        align-items: center;
        justify-content: center;

        gap: 9px;

        flex: none;

        overflow: hidden;

        cursor: pointer;

        padding:
          12px
          23px;

        border-radius: 14px;

        border:
          1.5px solid #e77b74;

        font-family:
          "Fraunces",
          Georgia,
          serif;

        font-size: 15px;
        font-weight: 600;

        color: #6e2828;

        background:
          linear-gradient(
            180deg,
            #ffc9bf 0%,
            #faa49c 52%,
            #f28b84 100%
          );

        box-shadow:
          0 1px 0 rgba(255,255,255,.78) inset,
          0 14px 20px -10px rgba(224,100,92,.7),
          0 0 0 4px rgba(250,150,140,.15);

        transition:
          transform .15s ease,
          filter .2s ease,
          box-shadow .2s ease;
      }

      .settings-logout::before {
        content: "";

        position: absolute;

        left: 0;
        right: 0;
        top: 0;

        height: 52%;

        background:
          linear-gradient(
            180deg,
            rgba(255,255,255,.5),
            transparent
          );
      }

      .settings-logout::after {
        content: "";

        position: absolute;

        top: 0;
        bottom: 0;

        left: -65%;

        width: 42%;

        background:
          linear-gradient(
            100deg,
            transparent,
            rgba(255,255,255,.58),
            transparent
          );

        transform: skewX(-20deg);

        transition:
          left .6s ease;
      }

      .settings-logout:hover::after {
        left: 130%;
      }

      .settings-logout:hover {
        filter: brightness(1.04);

        transform:
          translateY(-2px);

        box-shadow:
          0 1px 0 rgba(255,255,255,.78) inset,
          0 18px 24px -10px rgba(224,100,92,.76),
          0 0 0 4px rgba(250,150,140,.18);
      }

      .settings-logout:active {
        transform:
          translateY(1px);
      }

      .settings-logout svg,
      .settings-logout span {
        position: relative;
        z-index: 2;
      }

      .settings-logout svg {
        width: 18px;
        height: 18px;
      }

      .settings-logout:focus-visible {
        outline:
          3px solid rgba(240,135,128,.5);

        outline-offset: 3px;
      }

      /* =====================================================
         FOOTER
      ===================================================== */

      .settings-footer-decoration {
        display: flex;

        align-items: center;
        justify-content: center;

        gap: 10px;

        margin-top: 32px;

        color: rgba(88,72,126,.48);

        font-size: 12px;
        font-weight: 500;

        letter-spacing: .7px;
      }

      .settings-footer-decoration span:first-child,
      .settings-footer-decoration span:last-child {
        font-size: 9px;
      }

      /* =====================================================
         RESPONSIVE
      ===================================================== */

      @media (max-width: 700px) {
        .settings-wrap {
          width: min(
            100% - 28px,
            860px
          );

          padding:
            32px
            0
            50px;
        }

        .settings-header {
          padding-left: 10px;
          margin-bottom: 38px;
        }

        .settings-title-row {
          gap: 8px;
        }

        .settings-header h1 {
          font-size: 32px;
        }

        .settings-grid {
          grid-template-columns: 1fr;
          gap: 17px;
        }

        .settings-card-head {
          padding:
            19px
            17px
            17px;
        }

        .settings-card-body {
          padding:
            19px
            17px
            22px;
        }

        .settings-signout {
          flex-direction: column;

          align-items: stretch;
        }

        .settings-logout {
          width: 100%;
        }

        .settings-doodle-two,
        .settings-doodle-four,
        .settings-doodle-six {
          display: none;
        }

        .settings-big-avatar {
          width: 78px;
          height: 78px;

          top: -32px;

          margin-left: -39px;
        }
      }

      @media (max-width: 420px) {
        .settings-wrap {
          width: calc(100% - 20px);
        }

        .settings-header p {
          font-size: 13px;
        }

        .settings-card-head h2 {
          font-size: 17px;
        }

        .settings-card-head p {
          font-size: 12px;
        }

        .settings-pill {
          font-size: 13px;
        }

        .settings-signout-content p {
          line-height: 1.5;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .settings-page *,
        .settings-page *::before,
        .settings-page *::after {
          transition-duration: .01ms !important;
          animation-duration: .01ms !important;
        }
      }
    `}</style>
  </AppLayout>
</ProtectedRoute>
);
}