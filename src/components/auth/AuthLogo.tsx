interface AuthLogoProps {
  /** Height of the gem in pixels. The text scales with it. */
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function AuthLogo({
  size = 32,
  showText = true,
  className = "",
}: AuthLogoProps) {
  const width = Math.round((size * 14) / 24);

  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`}>
      <svg
        role={showText ? undefined : "img"}
        aria-label={showText ? undefined : "KLLCTRS"}
        aria-hidden={showText}
        viewBox="0 0 14 24"
        width={width}
        height={size}
        fill="#8B5CF6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4.24335 3.87914L4.33319 10.9585C4.33838 11.4169 4.90163 11.6585 5.26445 11.359L10.9384 6.64105C10.7691 6.32828 10.5946 6.01387 10.4166 5.69614C9.23311 3.5945 8.0185 1.69641 6.83153 0.000213623L4.15869 3.60774C4.21052 3.68717 4.24162 3.77984 4.24335 3.88079V3.87914Z" />
        <path d="M9.11218 11.6287L12.5193 16.2324C13.0756 15.132 13.5681 14.0712 14.0017 13.0618C13.4177 11.6519 12.7439 10.1625 11.9664 8.61194L9.20202 10.9105C8.98432 11.0925 8.94458 11.402 9.11218 11.6287Z" />
        <path d="M7.48465 13.1197C7.29286 12.8599 6.90757 12.8152 6.65705 13.0254L4.58029 14.7547C4.45589 14.8589 4.38505 15.0095 4.38678 15.1684L4.4127 19.931C5.52537 21.2879 6.63805 22.6432 7.75072 24.0002C8.93942 22.3768 10.1782 20.5035 11.3738 18.3771L7.48465 13.123V13.1197Z" />
        <path d="M2.03875 6.46729L0 9.22092L0.387017 15.0211C0.974454 15.7376 1.56189 16.4542 2.14933 17.1707L2.03875 6.46729Z" />
      </svg>

      {showText && (
        <span
          className="font-unica-one leading-none tracking-[0.04em] text-[#8B5CF6]"
          style={{ fontSize: Math.round(size * 0.8) }}
        >
          KLLCTRS
        </span>
      )}
    </div>
  );
}
