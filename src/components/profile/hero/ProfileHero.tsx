"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import EditProfileButton from "../edit/EditProfileButton";

interface Props {
  user: any;
  profile: any;
  onEdit: () => void;
}

export default function ProfileHero({ user, profile, onEdit }: Props) {
  const displayName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Collector";

  const games = profile?.favorite_games?.length
    ? profile.favorite_games
    : profile?.favorite_categories?.length
      ? profile.favorite_categories
      : [];

  const location = [profile?.city, profile?.state, profile?.country]
    .filter(Boolean)
    .join(", ");

  const collectorTypeLabels: Record<string, string> = {
    casual: "Casual Collector",
    investor: "Investor",
    trader: "Trader",
    competitive: "Competitive Player",
  };

  const collectorTypeLabel = profile?.collector_type
    ? (collectorTypeLabels[profile.collector_type] ?? profile.collector_type)
    : null;

  const collectingSinceYear =
    typeof profile?.years_collecting === "number"
      ? new Date().getFullYear() - profile.years_collecting
      : null;

  const isPro = user?.user_metadata?.subscription_tier === "pro_beta";

  return (
    <section className="relative overflow-hidden ">
      <div className="relative min-h-[340px] w-full">
        <Image
          src="/profile/ProfileHero.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-20 flex min-h-[340px] items-center px-8 py-10 md:px-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <ProfileAvatar avatarUrl={profile?.avatar_url} />

            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className=" text-4xl font-black uppercase  text-white">
                  {displayName}
                </h1>
                {isPro && (
                  <span className=" rounded-full  bg-[#F0C040] px-4 py-1 text-xs font-bold text-black ">
                    PRO
                  </span>
                )}
                <EditProfileButton onClick={onEdit} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/90">
                {collectingSinceYear && (
                  <span>Collecting since {collectingSinceYear}</span>
                )}

                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {location}
                  </span>
                )}
              </div>

              {profile?.bio && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
                  {profile.bio}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {collectorTypeLabel && (
                  <span className="rounded-full bg-[#E8B85C]/20 px-4 py-1 text-sm font-medium text-[#E8B85C] backdrop-blur">
                    {collectorTypeLabel}
                  </span>
                )}

                {games.map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/15 px-4 py-1 text-sm text-white backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
