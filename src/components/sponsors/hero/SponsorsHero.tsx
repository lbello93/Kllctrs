import Image from "next/image";
import type { SponsorsSummary } from "../shared";

export default function SponsorsHero({
  summary,
}: {
  summary: SponsorsSummary;
}) {
  const stats = [
    { value: summary.brands, label: "Brands" },
    { value: summary.shows, label: "Upcoming sponsored shows" },
    { value: summary.states, label: "States covered" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#151E3C]">
      <Image
        src="/sponsors/sponsMobile.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="block select-none object-cover object-center md:hidden"
      />
      <Image
        src="/sponsors/sponsors.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden select-none object-cover object-center md:block"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#151E3C]/85 via-[#151E3C]/50 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[340px] max-w-[1320px] flex-col justify-end gap-6 px-6 pb-10 pt-32">
        <div className="max-w-[560px] space-y-4">
          <p className="font-space-grotesk text-[11px] font-medium uppercase leading-[14px] tracking-[0.15em] text-[#CBBEFB]">
            The Hobby Index
          </p>

          <h1 className="font-unica-one text-[36px] leading-[38px] tracking-[-0.04em] text-[#FEF9FF] md:text-[48px] md:leading-[50px]">
            Explore Brands That
            <br />
            Shape Collecting
          </h1>

          <p className="font-inter text-[14px] leading-6 text-[#FEF9FF]/75">
            See which brands back which card shows, and where to find them next.
          </p>
        </div>

        <dl className="flex flex-wrap gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <dt className="font-inter text-[12px] leading-[15px] text-[#FEF9FF]/70">
                {stat.label}
              </dt>
              <dd className="font-unica-one text-[28px] leading-[32px] text-[#FEF9FF]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
