"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth-store";
import { registerUser } from "@/lib/api";

const NS = "http://www.w3.org/2000/svg";

function TreeIllustration() {
  const smallRef = useRef<SVGGElement | null>(null);
  const woodRef = useRef<SVGGElement | null>(null);
  const leavesRef = useRef<SVGGElement | null>(null);
  const nodesRef = useRef<SVGGElement | null>(null);
  const sparkRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const small = smallRef.current as SVGGElement;
    const wood = woodRef.current as SVGGElement;
    const leaves = leavesRef.current as SVGGElement;
    const nodes = nodesRef.current as SVGGElement;
    const spark = sparkRef.current as SVGGElement;

    if (!small || !wood || !leaves || !nodes || !spark) {
      return;
    }

    small.replaceChildren();
    wood.replaceChildren();
    leaves.replaceChildren();
    nodes.replaceChildren();
    spark.replaceChildren();

    let seed = 0;

    function rnd(value: number) {
      const x =
        Math.sin(value * 9301 + 49297) * 233280;

      return x - Math.floor(x);
    }

    function random() {
      seed += 1;
      return rnd(seed);
    }

    function createElement(
      name: string,
      attributes: Record<string, string | number>,
      parent: SVGElement
    ) {
      const element = document.createElementNS(NS, name);

      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, String(value));
      });

      parent.appendChild(element);

      return element;
    }

    function getPoints(
      pathData: string,
      count: number
    ) {
      const path = createElement("path", { d: pathData }, wood) as SVGPathElement;

      const length = path.getTotalLength();

      const points: {
        x: number;
        y: number;
        angle: number;
      }[] = [];

      for (let i = 0; i <= count; i++) {
        const distance = (length * i) / count;

        const point = path.getPointAtLength(distance);

        const next = path.getPointAtLength(
          Math.min(length, distance + 1)
        );

        const previous = path.getPointAtLength(
          Math.max(0, distance - 1)
        );

        points.push({
          x: point.x,
          y: point.y,
          angle: Math.atan2(
            next.y - previous.y,
            next.x - previous.x
          ),
        });
      }

      wood.removeChild(path);

      return {
        points,
        length,
      };
    }

    function taper(
      pathData: string,
      widthStart: number,
      widthEnd: number,
      fill: string,
      offset = 0,
      opacity = 1,
      scale = 1
    ) {
      const result = getPoints(pathData, 36);

      const left: string[] = [];
      const right: string[] = [];

      result.points.forEach((point, index) => {
        const width =
          (widthStart +
            (widthEnd - widthStart) *
              (index / 36)) /
          2;

        const adjustedOffset =
          (offset * width) / scale;

        const normalX = -Math.sin(point.angle);
        const normalY = Math.cos(point.angle);

        left.push(
          `${(
            point.x +
            normalX * (width + adjustedOffset)
          ).toFixed(1)} ${(
            point.y +
            normalY * (width + adjustedOffset)
          ).toFixed(1)}`
        );

        right.push(
          `${(
            point.x -
            normalX * (width - adjustedOffset)
          ).toFixed(1)} ${(
            point.y -
            normalY * (width - adjustedOffset)
          ).toFixed(1)}`
        );
      });

      createElement(
        "path",
        {
          d: `M${left.join(
            "L"
          )}L${right.reverse().join("L")}Z`,
          fill,
          opacity,
          "stroke-linejoin": "round",
        },
        wood
      );

      return result;
    }

    const gradients = [
      "url(#g1)",
      "url(#g2)",
      "url(#g3)",
      "url(#g4)",
    ];

    function createLeaf(
      parent: SVGElement,
      x: number,
      y: number,
      rotation: number,
      scale: number
    ) {
      createElement(
        "use",
        {
          href: "#leaf",
          transform: `translate(${x.toFixed(
            1
          )} ${y.toFixed(
            1
          )}) rotate(${rotation.toFixed(
            0
          )}) scale(${scale.toFixed(2)})`,
          fill:
            gradients[
              Math.floor(
                random() * gradients.length
              )
            ],
        },
        parent
      );
    }

    const branches: [
      string,
      number,
      number,
      number
    ][] = [
      [
        "M293 532C298 472 290 412 300 348",
        42,
        21,
        0,
      ],
      [
        "M300 348C304 282 292 172 285 96",
        21,
        3.5,
        1,
      ],
      [
        "M298 306C280 244 230 198 205 168",
        10,
        2,
        1,
      ],
      [
        "M302 292C330 228 370 164 388 138",
        9,
        2,
        1,
      ],
      [
        "M304 342C350 308 430 264 468 226",
        9,
        2,
        1,
      ],
      [
        "M296 352C250 328 190 294 155 278",
        8,
        2,
        1,
      ],
      [
        "M306 372C350 360 400 336 428 316",
        7,
        2,
        1,
      ],
      [
        "M291 226C268 214 244 212 228 196",
        5,
        1.2,
        1,
      ],
      [
        "M298 196C330 188 346 170 366 150",
        5,
        1.2,
        1,
      ],
      [
        "M290 170C274 150 266 128 250 112",
        4,
        1,
        1,
      ],
      [
        "M296 140C316 124 330 108 346 92",
        4,
        1,
        1,
      ],
      [
        "M388 250C408 244 420 232 440 226",
        4,
        1,
        1,
      ],
      [
        "M296 528C268 528 238 530 204 538",
        11,
        1.5,
        0,
      ],
      [
        "M304 528C334 528 366 531 400 540",
        11,
        1.5,
        0,
      ],
      [
        "M300 530C296 536 292 540 284 546",
        6,
        1,
        0,
      ],
    ];

    branches.forEach((branch) => {
      const [path, widthStart, widthEnd, hasLeaves] =
        branch;

      const result = taper(
        path,
        widthStart,
        widthEnd,
        "url(#bark)"
      );

      taper(
        path,
        widthStart * 0.3,
        widthEnd * 0.3,
        "#b7e0bd",
        -0.5,
        0.3,
        0.3
      );

      if (!hasLeaves) {
        return;
      }

      const leafPoints = getPoints(
        path,
        Math.max(
          6,
          Math.round(result.length / 11)
        )
      ).points;

      leafPoints.forEach((point, index) => {
        if (index < leafPoints.length * 0.22) {
          return;
        }

        const degrees =
          (point.angle * 180) / Math.PI;

        [-1, 1].forEach((direction) => {
          createLeaf(
            leaves,
            point.x,
            point.y,
            degrees +
              direction *
                (40 + random() * 40),
            0.5 + random() * 0.55
          );
        });
      });

      const last =
        leafPoints[leafPoints.length - 1];

      const degrees =
        (last.angle * 180) / Math.PI;

      for (let j = -2; j <= 2; j++) {
        createLeaf(
          leaves,
          last.x,
          last.y,
          degrees + j * 28,
          0.8 + random() * 0.4
        );
      }
    });

    const icons: Record<string, string> = {
      book:
        "M-9 -7h7a3 3 0 0 1 3 3v11a3 3 0 0 0 -3 -3h-7zM9 -7h-7a3 3 0 0 0 -3 3v11a3 3 0 0 1 3 -3h7z",

      bulb:
        "M0 -9a6 6 0 0 0 -3.6 10.8V5h7.2V1.8A6 6 0 0 0 0 -9zM-3 8h6",

      leaf:
        "M-8 7C-8 -3 0 -9 8 -8C9 0 3 8 -8 7zM-8 7L2 -3",

      doc:
        "M-6 -9h8l5 5v13h-13zM2 -9v5h5M-3 0h7M-3 4h7",

      atom:
        "M0 -3a3 3 0 1 0 .01 0M-9 0a9 3.8 0 1 0 18 0a9 3.8 0 1 0 -18 0M-4.5 -7.8a9 3.8 60 1 0 9 15.6a9 3.8 60 1 0 -9 -15.6",
    };

    function createNode(
      x: number,
      y: number,
      radius: number,
      icon?: string
    ) {
      for (let j = 0; j < 11; j++) {
        const angle =
          j * (360 / 11) + random() * 12;

        const radians =
          (angle * Math.PI) / 180;

        createLeaf(
          leaves,
          x +
            Math.cos(radians) *
              radius *
              0.85,
          y +
            Math.sin(radians) *
              radius *
              0.85,
          angle,
          0.45 + radius / 34
        );
      }

      const group = createElement(
        "g",
        {
          transform: `translate(${x} ${y})`,
        },
        nodes
      );

      createElement(
        "circle",
        {
          r: radius * 2.3,
          fill: "url(#halo)",
        },
        group
      );

      createElement(
        "circle",
        {
          r: radius,
          fill: "url(#ng)",
          stroke: "#fff",
          "stroke-width": 2.2,
          filter: "url(#drop)",
        },
        group
      );

      createElement(
        "circle",
        {
          r: radius - 3.5,
          fill: "none",
          stroke: "#fff",
          "stroke-width": 1,
          opacity: 0.4,
        },
        group
      );

      if (icon && icons[icon]) {
        const iconGroup = createElement(
          "g",
          {
            transform: `scale(${
              radius / 20
            })`,
            fill: "none",
            stroke: "#fff",
            "stroke-width": 1.8,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          group
        );

        createElement(
          "path",
          {
            d: icons[icon],
          },
          iconGroup
        );
      }

      createElement(
        "ellipse",
        {
          cx: -radius * 0.28,
          cy: -radius * 0.5,
          rx: radius * 0.55,
          ry: radius * 0.27,
          fill: "url(#spec)",
          transform: "rotate(-22)",
        },
        group
      );

      createElement(
        "ellipse",
        {
          cx: radius * 0.22,
          cy: radius * 0.62,
          rx: radius * 0.38,
          ry: radius * 0.11,
          fill: "#fff",
          opacity: 0.28,
        },
        group
      );
    }

    const mainNodes: [
      number,
      number,
      number,
      string?
    ][] = [
      [285, 70, 27, "book"],
      [200, 150, 20, "leaf"],
      [390, 118, 19, "atom"],
      [470, 202, 22, "bulb"],
      [150, 256, 16, "doc"],
      [430, 296, 14, "leaf"],
      [246, 104, 8],
      [350, 88, 8],
      [336, 190, 7],
    ];

    mainNodes.forEach((node) => {
      createNode(
        node[0],
        node[1],
        node[2],
        node[3]
      );
    });

    for (let s = 0; s < 30; s++) {
      const x = 40 + random() * 520;
      const y = 20 + random() * 330;
      const scale = 0.4 + random() * 0.9;

      if (s % 3) {
        createElement(
          "circle",
          {
            cx: x,
            cy: y,
            r: 1 + random() * 1.8,
            fill: "#fff",
            opacity: 0.35 + random() * 0.5,
          },
          spark
        );
      } else {
        createElement(
          "path",
          {
            d:
              "M0-7Q0 0 7 0Q0 0 0 7Q0 0-7 0Q0 0 0-7Z",
            fill: "#fff",
            opacity: 0.85,
            transform: `translate(${x} ${y}) scale(${scale})`,
          },
          spark
        );
      }
    }

    function mini(
      x: number,
      y: number,
      scale: number,
      withNode: boolean
    ) {
      const group = createElement(
        "g",
        {
          transform: `translate(${x} ${y}) scale(${scale})`,
        },
        small
      );

      createElement(
        "path",
        {
          d: "M0 0C2 -30 -2 -60 0 -92",
          stroke: "url(#bark)",
          "stroke-width": 5,
          fill: "none",
          "stroke-linecap": "round",
        },
        group
      );

      for (let k = 1; k < 10; k++) {
        const yy = -12 - k * 8;
        const side = k % 2 ? 1 : -1;

        createLeaf(
          group,
          0,
          yy,
          side > 0 ? -25 : 205,
          1 + random() * 0.3
        );

        createLeaf(
          group,
          0,
          yy - 3,
          side > 0 ? 205 : -25,
          0.85 + random() * 0.3
        );
      }

      createLeaf(
        group,
        0,
        -92,
        -90,
        1.5
      );

      if (withNode) {
        const nodeGroup = createElement(
          "g",
          {
            transform: "translate(0 -114)",
          },
          group
        );

        createElement(
          "circle",
          {
            r: 22,
            fill: "url(#halo)",
          },
          nodeGroup
        );

        createElement(
          "circle",
          {
            r: 10.5,
            fill: "url(#ng)",
            stroke: "#fff",
            "stroke-width": 1.8,
          },
          nodeGroup
        );

        createElement(
          "ellipse",
          {
            cx: -3,
            cy: -5,
            rx: 5.5,
            ry: 2.8,
            fill: "url(#spec)",
            transform: "rotate(-22)",
          },
          nodeGroup
        );
      }
    }

    mini(46, 520, 1.15, true);
    mini(125, 520, 1, true);
    mini(215, 520, 0.75, false);
    mini(690, 520, 0.9, true);
    mini(730, 520, 0.7, false);
  }, []);

  return (
    <svg
      className="tree"
      viewBox="0 0 760 520"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="g1"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#d4f59a" />
          <stop offset=".5" stopColor="#6fc27a" />
          <stop offset="1" stopColor="#2f8f5b" />
        </linearGradient>

        <linearGradient
          id="g2"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#aeeaa6" />
          <stop offset=".5" stopColor="#3fae7a" />
          <stop offset="1" stopColor="#1f7a52" />
        </linearGradient>

        <linearGradient
          id="g3"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#e8f9b0" />
          <stop offset=".5" stopColor="#8ccf7a" />
          <stop offset="1" stopColor="#3f9a62" />
        </linearGradient>

        <linearGradient
          id="g4"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#9fe3cb" />
          <stop offset=".5" stopColor="#3aa28f" />
          <stop offset="1" stopColor="#1e7872" />
        </linearGradient>

        <linearGradient
          id="gloss"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#fff"
            stopOpacity=".85"
          />
          <stop
            offset="1"
            stopColor="#fff"
            stopOpacity="0"
          />
        </linearGradient>

        <linearGradient
          id="bark"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#1f4a38" />
          <stop offset=".5" stopColor="#3b7552" />
          <stop offset="1" stopColor="#5f9a6e" />
        </linearGradient>

        <radialGradient
          id="ng"
          cx=".35"
          cy=".3"
          r=".85"
        >
          <stop
            offset="0"
            stopColor="#f4fffc"
          />
          <stop
            offset=".42"
            stopColor="#9fe6da"
          />
          <stop
            offset=".8"
            stopColor="#3aa3b0"
          />
          <stop
            offset="1"
            stopColor="#1f6f93"
          />
        </radialGradient>

        <linearGradient
          id="spec"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#fff"
            stopOpacity=".95"
          />
          <stop
            offset="1"
            stopColor="#fff"
            stopOpacity="0"
          />
        </linearGradient>

        <radialGradient id="halo">
          <stop
            offset="0"
            stopColor="#c8f6ea"
            stopOpacity=".85"
          />
          <stop
            offset=".5"
            stopColor="#8fe0d0"
            stopOpacity=".3"
          />
          <stop
            offset="1"
            stopColor="#8fe0d0"
            stopOpacity="0"
          />
        </radialGradient>

        <radialGradient id="cl">
          <stop
            offset="0"
            stopColor="#fff"
            stopOpacity=".5"
          />
          <stop
            offset="1"
            stopColor="#fff"
            stopOpacity="0"
          />
        </radialGradient>

        <filter
          id="drop"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor="#0b3b4f"
            floodOpacity=".35"
          />
        </filter>

        <g id="leaf">
          <path d="M0 0C6-12 22-13 32 0C22 13 6 12 0 0Z" />
          <path
            d="M2 0H29"
            stroke="#fff"
            strokeOpacity=".4"
            strokeWidth=".8"
            fill="none"
          />
          <path
            d="M0 0C6-12 22-13 32 0C20-4 8-4 0 0Z"
            fill="url(#gloss)"
            opacity=".5"
          />
        </g>
      </defs>

      <circle
        cx="475"
        cy="200"
        r="290"
        fill="url(#cl)"
      />

      <path
        d="M-40 520C80 470 200 480 320 505C440 485 600 470 800 510V540H-40Z"
        fill="#6fbf9a"
        opacity=".35"
      />

      <path
        d="M-40 532C120 497 260 507 380 522C520 502 660 497 800 527V540H-40Z"
        fill="#3f9a7a"
        opacity=".4"
      />

      <g ref={smallRef} />

      <g transform="translate(95,0)">
        <g ref={woodRef} />
        <g ref={leavesRef} filter="url(#drop)" />
        <g ref={nodesRef} />
        <g ref={sparkRef} />
      </g>
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const googleLogin = useAuthStore(
    (state) => state.googleLogin
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");

  const [registerLoading, setRegisterLoading] =
    useState(false);

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setMessage("Please enter your full name.");
      return;
    }

    if (
      !/^\S+@\S+\.\S+$/.test(trimmedEmail)
    ) {
      setMessage(
        "Please enter a valid email address."
      );
      return;
    }

    if (!password) {
      setMessage("Please enter a password.");
      return;
    }

    if (password.length < 1) {
      setMessage("Password cannot be empty.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setRegisterLoading(true);

    try {
      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      router.push("/login");
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  }

  async function handleGoogleRegister(
    credential: string
  ) {
    setMessage("");

    try {
      await googleLogin(credential);

      router.push("/dashboard");
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          "Google sign up failed. Please try again."
      );
    }
  }

  return (
    <div className="researchlane-register">
      <section className="register-left">
        <div className="register-brand">
          <span className="register-logo">
            RL
          </span>

          <span>ResearchLane</span>
        </div>

        <div className="register-hero">
          <h1>
            Elevate Your Research with
            <br />
            The Tree of Knowledge
          </h1>

          <p>
            Upload, analyze, and compare research
            papers instantly.
          </p>
        </div>

        <TreeIllustration />
      </section>

      <section className="register-right">
        <main className="register-card">
          <svg
            className="corner c-tl"
            viewBox="0 0 44 44"
          >
            <use href="#sprig" />
          </svg>

          <svg
            className="corner c-tr"
            viewBox="0 0 44 44"
          >
            <use href="#sprig" />
          </svg>

          <svg
            className="corner c-bl"
            viewBox="0 0 44 44"
          >
            <use href="#sprig" />
          </svg>

          <svg
            className="corner c-br"
            viewBox="0 0 44 44"
          >
            <use href="#sprig" />
          </svg>

          <svg
            className="top-orn"
            viewBox="0 0 120 20"
            fill="none"
            stroke="#9cc3a8"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M6 12C26 12 36 6 52 10M114 12C94 12 84 6 68 10" />

            <path
              d="M60 4C54 8 54 14 60 18C66 14 66 8 60 4Z"
              fill="#cfe5d6"
            />
          </svg>

          <h2>Create your account</h2>

          <p className="register-sub">
            Start your research journey with
            ResearchLane
          </p>

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="register-label">
              Full Name
            </div>

            <div className="register-field">
              <svg
                className="field-icon"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  fill="#2f7d4f"
                />

                <path
                  d="M4 21c.8-4.2 3.4-6.5 8-6.5s7.2 2.3 8 6.5"
                  fill="#3f9a63"
                />
              </svg>

              <input
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            {/* Email */}
            <div className="register-label">
              Email Address
            </div>

            <div className="register-field">
              <svg
                className="field-icon"
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  fill="#2f7d4f"
                />

                <path
                  d="M4 7l8 6 8-6"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            {/* Password */}
            <div className="register-label">
              Password
            </div>

            <div className="register-field">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                style={{
                  paddingLeft: "14px",
                  paddingRight: "42px",
                }}
                required
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                      fill="none"
                      stroke="#2f7d4f"
                      strokeWidth="2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                      fill="none"
                      stroke="#2f7d4f"
                      strokeWidth="2"
                    />

                    <path
                      d="M4 4l16 16"
                      stroke="#2f7d4f"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="5"
                      y="10.5"
                      width="14"
                      height="10"
                      rx="2.6"
                      fill="#2f7d4f"
                    />

                    <path
                      d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
                      fill="none"
                      stroke="#2f7d4f"
                      strokeWidth="2"
                    />

                    <circle
                      cx="12"
                      cy="15.5"
                      r="1.5"
                      fill="#fff"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="register-label">
              Confirm Password
            </div>

            <div className="register-field">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                style={{
                  paddingLeft: "14px",
                  paddingRight: "42px",
                }}
                required
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                      fill="none"
                      stroke="#2f7d4f"
                      strokeWidth="2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                      fill="none"
                      stroke="#2f7d4f"
                      strokeWidth="2"
                    />

                    <path
                      d="M4 4l16 16"
                      stroke="#2f7d4f"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="5"
                      y="10.5"
                      width="14"
                      height="10"
                      rx="2.6"
                      fill="#2f7d4f"
                    />

                    <path
                      d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
                      fill="none"
                      stroke="#2f7d4f"
                      strokeWidth="2"
                    />

                    <circle
                      cx="12"
                      cy="15.5"
                      r="1.5"
                      fill="#fff"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Message */}
            <div
              className={`register-message ${
                message ? "visible" : ""
              }`}
              role="alert"
            >
              {message}
            </div>

            {/* Register */}
            <button
              className="register-button"
              type="submit"
              disabled={registerLoading}
            >
              {registerLoading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="register-or">
            <span>OR</span>
          </div>

          {/* Google */}
          <div className="google-register-wrapper">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (
                  !credentialResponse.credential
                ) {
                  setMessage(
                    "Google sign up failed."
                  );
                  return;
                }

                handleGoogleRegister(
                  credentialResponse.credential
                );
              }}
              onError={() => {
                setMessage(
                  "Google sign up failed. Please try again."
                );
              }}
            />
          </div>

          {/* Login */}
          <p className="register-alt">
            Already have an account?{" "}
            <Link href="/login">
              Sign in
            </Link>
          </p>
        </main>
      </section>

      {/* Shared SVG decoration */}
      <svg
        width="0"
        height="0"
        style={{
          position: "absolute",
        }}
        aria-hidden="true"
      >
        <defs>
          <g
            id="sprig"
            fill="none"
            stroke="#a9c9b3"
            strokeWidth="1.3"
            strokeLinecap="round"
          >
            <path d="M4 40C8 22 20 10 40 5" />

            <path
              d="M12 30C8 26 8 21 11 18C15 21 16 26 12 30Z"
              fill="#d6eadb"
              stroke="none"
            />

            <path
              d="M20 20C17 15 18 10 22 8C25 12 24 17 20 20Z"
              fill="#d6eadb"
              stroke="none"
            />

            <path
              d="M30 13C29 8 32 4 36 3C37 8 35 11 30 13Z"
              fill="#d6eadb"
              stroke="none"
            />
          </g>
        </defs>
      </svg>

      <style jsx global>{`
        :root {
          --navy: #173f7a;
          --blue: #2a67a8;
          --teal: #2e8c8a;
          --mint: #e4f1ea;
          --paper: #f4faf6;
          --green: #2f6a4a;
          --green-d: #255a3d;
          --leaf: #5fa86a;
          --leaf-d: #3f8a57;
          --ink: #16293b;
          --muted: #5d6f7c;
          --line: #dce6e0;
          --link: #2563a8;

          --font:
            "Plus Jakarta Sans",
            system-ui,
            -apple-system,
            "Segoe UI",
            Roboto,
            sans-serif;
        }

        .researchlane-register {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          position: relative;
          overflow: hidden;
          font-family: var(--font);
          color: var(--ink);

          background: linear-gradient(
            100deg,
            var(--navy) 0%,
            var(--blue) 28%,
            var(--teal) 50%,
            #9fcdbb 64%,
            var(--mint) 78%,
            var(--paper) 100%
          );
        }

        .register-left {
          position: relative;
          padding: 28px 40px 0;
          display: flex;
          flex-direction: column;
          min-height: 640px;
          overflow: hidden;
        }

        .register-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.2px;
          z-index: 3;
        }

        .register-logo {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #fff;
          color: var(--blue);
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 800;
        }

        .register-hero {
          margin-top: 64px;
          z-index: 3;
          max-width: 430px;
        }

        .register-hero h1 {
          margin: 0;
          color: #fff;
          font-size: clamp(
            28px,
            3.1vw,
            40px
          );
          line-height: 1.12;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .register-hero p {
          margin: 16px 0 0;
          color: rgba(
            255,
            255,
            255,
            0.88
          );
          font-size: 15px;
          font-weight: 500;
        }

        .tree {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 78%;
          z-index: 1;
        }

        .register-right {
          display: grid;
          place-items: center;
          padding: 32px 28px;
          position: relative;
          z-index: 4;
        }

        .register-card {
          position: relative;
          width: 100%;
          max-width: 440px;

          background: rgba(
            255,
            255,
            255,
            0.93
          );

          backdrop-filter: blur(8px);

          border: 1px solid
            rgba(255, 255, 255, 0.9);

          border-radius: 18px;

          padding: 34px 34px 30px;

          box-shadow:
            0 24px 60px -18px
              rgba(23, 63, 122, 0.35),
            0 4px 14px
              rgba(23, 63, 122, 0.08);

          overflow: hidden;
        }

        .corner {
          position: absolute;
          width: 44px;
          height: 44px;
          opacity: 0.9;
        }

        .c-tl {
          top: 6px;
          left: 8px;
        }

        .c-tr {
          top: 6px;
          right: 8px;
          transform: scaleX(-1);
        }

        .c-bl {
          bottom: 6px;
          left: 8px;
          transform: scaleY(-1);
        }

        .c-br {
          bottom: 6px;
          right: 8px;
          transform: scale(-1, -1);
        }

        .top-orn {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 20px;
        }

        .register-card h2 {
          margin: 12px 0 4px;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .register-sub {
          margin: 0 0 20px;
          font-size: 14px;
          color: var(--muted);
        }

        .register-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: #2a3d4d;
          margin-bottom: 6px;
        }

        .register-field {
          position: relative;
          margin-bottom: 13px;
        }

        .register-field input {
          width: 100%;
          height: 46px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: #fff;
          padding: 0 42px 0 42px;
          font:
            500 14px var(--font);
          color: var(--ink);
          outline: none;

          transition:
            border-color 0.15s,
            box-shadow 0.15s;

          box-sizing: border-box;
        }

        .register-field input::placeholder {
          color: #97a5ae;
        }

        .register-field input:focus {
          border-color: var(--leaf-d);

          box-shadow:
            0 0 0 3px
              rgba(
                63,
                138,
                87,
                0.18
              );
        }

        .field-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          width: 20px;
          height: 20px;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .password-eye {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border: 0;
          background: none;
          cursor: pointer;
          display: grid;
          place-items: center;
          border-radius: 8px;
        }

        .password-eye:focus-visible {
          outline: 2px solid
            var(--leaf-d);
        }

        .register-button {
          width: 100%;
          height: 48px;
          border: 0;
          border-radius: 10px;
          cursor: pointer;

          color: #fff;

          font:
            700 15px var(--font);

          letter-spacing: 0.2px;

          background: linear-gradient(
            180deg,
            #38775a,
            var(--green-d)
          );

          box-shadow:
            0 8px 18px -8px
              rgba(
                37,
                90,
                61,
                0.7
              );

          transition:
            transform 0.12s,
            filter 0.15s;
        }

        .register-button:hover {
          filter: brightness(1.08);
        }

        .register-button:active {
          transform: translateY(1px);
        }

        .register-button:focus-visible {
          outline: 3px solid
            rgba(
              63,
              138,
              87,
              0.4
            );

          outline-offset: 2px;
        }

        .register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .register-message {
          min-height: 18px;
          margin: -4px 0 8px;
          font-size: 12.5px;
          color: #b4412f;
          font-weight: 600;
        }

        .register-message:empty {
          visibility: hidden;
        }

        .register-or {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 18px 0;
          color: #8a99a3;
          font-size: 12px;
          font-weight: 600;
        }

        .register-or::before,
        .register-or::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--line);
        }

        .register-or span {
          flex-shrink: 0;
        }

        .google-register-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: 18px;
        }

        .register-alt {
          text-align: center;
          font-size: 13.5px;
          color: var(--muted);
          margin: 0;
        }

        .register-alt a {
          color: var(--link);
          font-weight: 700;
          text-decoration: none;
        }

        .register-alt a:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .researchlane-register {
            grid-template-columns: 1fr;

            background: linear-gradient(
              180deg,
              var(--navy) 0%,
              var(--blue) 22%,
              var(--teal) 40%,
              var(--mint) 70%,
              var(--paper) 100%
            );
          }

          .register-left {
            min-height: 360px;
            padding: 24px 22px 0;
          }

          .register-hero {
            margin-top: 36px;
          }

          .register-hero h1 {
            font-size: 30px;
          }

          .tree {
            height: 70%;
            opacity: 0.85;
          }

          .register-right {
            padding: 0 18px 36px;
            margin-top: -30px;
          }

          .register-card {
            max-width: 440px;
          }
        }

        @media (max-width: 480px) {
          .register-left {
            min-height: 330px;
          }

          .register-hero h1 {
            font-size: 26px;
          }

          .register-hero p {
            font-size: 14px;
          }

          .register-card {
            padding: 30px 24px 26px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
