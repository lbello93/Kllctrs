// src/components/ui/KllctrsLoader.tsx
"use client";

export function KllctrsLoader({
  size = 64,
  label,
  className = "",
}: {
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 ${className}`}
      role="status"
      aria-label={label ?? "KllCTRS"}
    >
      <div
        className="kllctrs-loader-zoom relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Flash burst as the gem rushes toward the viewer */}
        <span className="kllctrs-loader-flash absolute inset-0 rounded-full bg-white blur-2xl" />

        {/* Soft pulsing glow behind the gem, kicks in once settled */}
        <span className="kllctrs-loader-glow absolute inset-0 rounded-full bg-[#8B5CF6] blur-xl" />

        {/* Gem mark */}
        <svg
          viewBox="0 0 14 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: size * 0.42, height: size * 0.72 }}
          className="relative z-10"
        >
          <path
            className="kllctrs-loader-facet"
            style={{ animationDelay: "900ms" }}
            fill="#8B5CF6"
            d="M4.24335 3.87914L4.33319 10.9585C4.33838 11.4169 4.90163 11.6585 5.26445 11.359L10.9384 6.64105C10.7691 6.32828 10.5946 6.01387 10.4166 5.69614C9.23311 3.5945 8.0185 1.69641 6.83153 0.000213623L4.15869 3.60774C4.21052 3.68717 4.24162 3.77984 4.24335 3.88079V3.87914Z"
          />
          <path
            className="kllctrs-loader-facet"
            style={{ animationDelay: "1050ms" }}
            fill="#8B5CF6"
            d="M9.11218 11.6287L12.5193 16.2324C13.0756 15.132 13.5681 14.0712 14.0017 13.0618C13.4177 11.6519 12.7439 10.1625 11.9664 8.61194L9.20202 10.9105C8.98432 11.0925 8.94458 11.402 9.11218 11.6287Z"
          />
          <path
            className="kllctrs-loader-facet"
            style={{ animationDelay: "1200ms" }}
            fill="#8B5CF6"
            d="M7.48465 13.1197C7.29286 12.8599 6.90757 12.8152 6.65705 13.0254L4.58029 14.7547C4.45589 14.8589 4.38505 15.0095 4.38678 15.1684L4.4127 19.931C5.52537 21.2879 6.63805 22.6432 7.75072 24.0002C8.93942 22.3768 10.1782 20.5035 11.3738 18.3771L7.48465 13.123V13.1197Z"
          />
          <path
            className="kllctrs-loader-facet"
            style={{ animationDelay: "1350ms" }}
            fill="#8B5CF6"
            d="M2.03875 6.46729L0 9.22092L0.387017 15.0211C0.974454 15.7376 1.56189 16.4542 2.14933 17.1707L2.03875 6.46729Z"
          />
        </svg>
      </div>

      {label && (
        <p className="kllctrs-loader-text font-inter text-[20px] sm:text-[24px] font-semibold tracking-[0.14em] uppercase text-[#5B18BE]">
          {label}
        </p>
      )}

      <style>{`
        @keyframes kllctrs-loader-zoom {
          0%   { opacity: 0;   transform: scale(0.08); filter: blur(10px); }
          15%  { opacity: 1; }
          55%  { transform: scale(1.55); filter: blur(0px); }
          75%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .kllctrs-loader-zoom {
          animation: kllctrs-loader-zoom 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes kllctrs-loader-flash {
          0%   { opacity: 0; transform: scale(0.3); }
          50%  { opacity: 0.6; transform: scale(1.6); }
          100% { opacity: 0; transform: scale(2.2); }
        }
        .kllctrs-loader-flash {
          animation: kllctrs-loader-flash 900ms ease-out both;
        }

        @keyframes kllctrs-loader-facet {
          0%, 100% { opacity: 0.25; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
        }
        .kllctrs-loader-facet {
          transform-origin: center;
          transform-box: fill-box;
          opacity: 0;
          animation: kllctrs-loader-facet 1.6s ease-in-out infinite;
        }

        @keyframes kllctrs-loader-glow {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        .kllctrs-loader-glow {
          opacity: 0;
          animation: kllctrs-loader-glow 1.6s ease-in-out 900ms infinite;
        }

        @keyframes kllctrs-loader-text {
          0% { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }
        .kllctrs-loader-text {
          opacity: 0;
          animation: kllctrs-loader-text 500ms cubic-bezier(0.16, 1, 0.3, 1) 950ms both;
          text-shadow: 0 0 18px rgba(139, 92, 246, 0.45);
        }
      `}</style>
    </div>
  );
}

export default function KllctrsPageLoader({
  label = "KLLCTRS",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FEF9FF]">
      <KllctrsLoader size={72} label={label} />
    </div>
  );
}
