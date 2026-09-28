"use client";

import { ArrowUpRight, Globe } from "lucide-react";

interface SponsorWebsiteLinkProps {
  sponsorId: string;
  website: string;
}

export default function SponsorWebsiteLink({
  sponsorId,
  website,
}: SponsorWebsiteLinkProps) {
  const href = /^https?:\/\//i.test(website) ? website : `https://${website}`;

  function trackClick() {
    fetch(`/api/sponsors/${sponsorId}/click`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(94.43deg,#5B18BE_35.73%,#9C7CF7_100%)] px-4 font-inter text-[14px] leading-[17px] text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition hover:opacity-90"
    >
      <Globe className="h-4 w-4" />
      Visit website
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}
