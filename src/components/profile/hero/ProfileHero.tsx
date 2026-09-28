"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import EditProfileButton from "../edit/EditProfileButton";

interface Props {
  user: any;
  profile: any;
  onEdit: () => void;
}

const COLLECTOR_TYPE_LABELS: Record<string, string> = {
  casual: "Casual Collector",
  investor: "Investor",
  trader: "Trader",
  competitive: "Competitive Player",
};

function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "gold";
}) {
  return (
    <span
      className={`rounded-[10px] border px-3 py-1 font-inter text-[11px] leading-[15px] ${tone === "gold" ? "border-[#E8B85C]/50 bg-[#E8B85C]/15 text-[#E8B85C]" : "border-[#5B18BE] bg-[rgba(64,14,138,0.2)] text-[#F2EFFE]"}`}
    >
      {children}
    </span>
  );
}

export default function ProfileHero({ user, profile, onEdit }: Props) {
  const displayName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Collector";

  const games: string[] = profile?.favorite_games?.length
    ? profile.favorite_games
    : profile?.favorite_categories?.length
      ? profile.favorite_categories
      : [];

  const location = [profile?.city, profile?.state, profile?.country]
    .filter(Boolean)
    .join(", ");

  const collectorTypeLabel = profile?.collector_type
    ? (COLLECTOR_TYPE_LABELS[profile.collector_type] ?? profile.collector_type)
    : null;

  const collectingSinceYear =
    typeof profile?.years_collecting === "number"
      ? new Date().getFullYear() - profile.years_collecting
      : null;

  const isPro = user?.user_metadata?.subscription_tier === "pro_beta";

  return (
    <section className="relative overflow-hidden bg-[#151E3C]">
      <Image
        src="/profile/ProfileHero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />

      <div className="absolute inset-0 bg-[#151E3C]/60 md:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#151E3C]/90 via-[#151E3C]/60 to-transparent md:block" />

      <div className="relative z-10 mx-auto flex min-h-[380px] max-w-7xl flex-col justify-end gap-6 px-6 pb-10 pt-32 md:flex-row md:items-end md:justify-start md:gap-8 md:px-10">
        <ProfileAvatar avatarUrl={profile?.avatar_url} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-unica-one text-[40px] leading-[44px] tracking-[-0.01em] text-[#FEF9FF] md:text-[48px] md:leading-[57px]">
              {displayName}
            </h1>

            {isPro && (
              <span className="rounded-full bg-[#F0C040] px-3 py-1 font-inter text-[11px] font-semibold leading-[15px] text-[#151E3C]">
                PRO
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 font-inter text-[14px] leading-[17px] text-[#FEF9FF]/80">
            {location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </span>
            )}

            {collectingSinceYear !== null && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Collecting since {collectingSinceYear}
              </span>
            )}
          </div>

          {profile?.bio && (
            <p className="mt-4 max-w-xl font-inter text-[14px] leading-6 text-[#FEF9FF]/75">
              {profile.bio}
            </p>
          )}

          {(collectorTypeLabel || games.length > 0) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {collectorTypeLabel && (
                <Chip tone="gold">{collectorTypeLabel}</Chip>
              )}
              {games.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          )}
        </div>

        <EditProfileButton
          onClick={onEdit}
          className="self-start md:self-end"
        />
      </div>
    </section>
  );
}
