"use client";

import { Pencil } from "lucide-react";

interface EditProfileButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function EditProfileButton({
  onClick,
  disabled = false,
  loading = false,
  className = "",
}: EditProfileButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label="Edit Profile"
      className={`
        inline-flex
        items-center
        justify-center
        gap-2

        rounded-xl

        border
        border-white/20

        bg-white/10
        backdrop-blur-md

        px-4
        py-2

        text-sm
        font-medium
        text-white

        shadow-lg

        transition-all
        duration-200

        hover:bg-white/20
        hover:border-white/30
        hover:shadow-xl

        active:scale-[0.98]

        disabled:cursor-not-allowed
        disabled:opacity-50

        ${className}
      `}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="opacity-100"
            fill="currentColor"
            d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
          />
        </svg>
      ) : (
        <Pencil className="h-4 w-4 shrink-0" strokeWidth={2} />
      )}

      <span>{loading ? "Loading..." : "Edit Profile"}</span>
    </button>
  );
}
