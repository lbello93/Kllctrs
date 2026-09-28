"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, User } from "lucide-react";

interface AvatarUploaderProps {
  avatarUrl?: string | null;
  previewUrl?: string | null;
  onFileSelect?: (file: File) => void;
}

export default function AvatarUploader({
  avatarUrl,
  previewUrl,
  onFileSelect,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect?.(file);
  }

  const imageSrc = previewUrl || avatarUrl;

  return (
    <div className="flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Card face — foil-edge frame, the product's own card metaphor applied to the avatar */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Change profile photo"
        className="
          group
          relative
          h-40
          w-40
          overflow-hidden
          rounded-[28px]
          bg-gradient-to-br
          from-white/10
          to-white/[0.02]
          p-[2px]
          shadow-[0_8px_40px_-8px_rgba(156,124,247,0.25)]
          transition-all
          duration-300
          hover:shadow-[0_12px_48px_-8px_rgba(156,124,247,0.4)]
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#9C7CF7]
        "
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(156,124,247,0.7), rgba(156,124,247,0.15) 40%, rgba(156,124,247,0.5))",
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-gradient-to-br from-[#240554] to-[#151E3C]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="Profile avatar"
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-12 w-12 text-white/30" />
            </div>
          )}

          {/* Hover overlay */}
          <div
            className="
              absolute inset-0
              flex items-center justify-center
              bg-[#151E3C]/60
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          >
            <Camera className="h-7 w-7 text-white" strokeWidth={1.75} />
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={handleClick}
        className="
          mt-4
          text-sm
          font-medium
          text-white/70
          underline-offset-4
          transition
          hover:text-white
          hover:underline
        "
      >
        Change photo
      </button>

      <p className="mt-1 text-[11px] tracking-wide text-white/35">
        PNG, JPG or WEBP
      </p>
    </div>
  );
}
