"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  editable?: boolean;
  onClick?: () => void;
}

export default function ProfileAvatar({
  avatarUrl,
  editable = false,
  onClick,
}: ProfileAvatarProps) {
  return (
    <button
      type="button"
      onClick={editable ? onClick : undefined}
      className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-xl"
    >
      <Image
        src={avatarUrl || "/ProfilePage-artifact/profileDP.webp"}
        alt="avatar"
        fill
        sizes="112px"
        className="object-cover"
      />

      {editable && (
        <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
          <Camera className="h-4 w-4" />
        </div>
      )}
    </button>
  );
}
