import Image from "next/image";
import SponsorStatBox from "./SponsorStatBox";
import { getSponsorLogo } from "@/lib/sponsors/sponsorLogos";

import type { Sponsor } from "@/types";

interface Props {
  sponsor: Sponsor;
}

export default function SponsorHeader({ sponsor }: Props) {
  const logo = getSponsorLogo(sponsor.name);

  return (
    <div className="flex flex-row items-center justify-between w-full h-[77px] gap-[13px]">
      {/* Left Section */}
      <div className="flex flex-row items-center gap-[13px] flex-1 min-w-0">
        {/* Logo */}
        <div className="relative w-[56px] h-[56px] rounded-full bg-[#D9D9D9] overflow-hidden shrink-0">
          {logo ? (
            <Image
              src={logo}
              alt={sponsor.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#D9D9D9]" />
          )}
        </div>

        {/* Sponsor Name */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h2 className="text-[16px] leading-[19px] font-semibold text-black line-clamp-2">
            {sponsor.name}
          </h2>
        </div>
      </div>

      {/* Right Stat Box */}
      <SponsorStatBox title="this year" left={8} total={20} />
    </div>
  );
}
