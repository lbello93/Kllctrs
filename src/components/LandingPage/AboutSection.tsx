"use client";

import Image from "next/image";

function DesktopAbout() {
  return (
    <section className="w-full bg-[#151E3C]">
      {/* Top Divider */}
      <div className="h-[52px] bg-[#151E3C]" />

      {/* Main Section */}
      <div className="w-full h-[500px] bg-[url('/aboutBG.png')] bg-cover bg-center bg-no-repeat pt-[59px] pr-[678px] pb-[107px] pl-[300px]">
        {/* Content Wrapper */}
        <div className="w-[463px] flex flex-col gap-[34px]">
          {/* Header Block */}
          <div className="flex flex-col gap-[49px]">
            {/* Label */}
            <div className="flex items-center gap-[24px]">
              <img
                src="/Favicon/logo.png"
                alt="Gem"
                className="w-[16px] h-[29px] object-contain"
              />

              <p className="font-inter text-[14px] leading-[18px] tracking-[0.15em] uppercase font-medium text-[#FEF9FF]">
                Why Are We Doing This
              </p>
            </div>

            {/* Title */}
            <h2 className="font-unica-one text-[48px] leading-[50px] tracking-[-0.04em] text-[#FEF9FF] font-normal">
              The hobby was never
              <br />
              just about the cards
            </h2>
          </div>

          {/* Paragraphs */}
          <div className="flex flex-col gap-[21px]">
            <p className="text-[20px] leading-[24px] text-[#FEF9FF] font-normal">
              It is about discovering the shop two blocks away. About trade
              nights that become tradition. The conversations. The stories. The
              people.
            </p>

            <p className="text-[20px] leading-[24px] text-[#FEF9FF] font-normal">
              KLLCTRS exists to make the hobby easier to discover, explore, and
              experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileAbout() {
  return (
    <section className="relative w-full h-[375px] overflow-hidden">
      {/* Background */}
      <Image
        src="/aboutBG-mobile.png"
        alt="About Background"
        fill
        sizes="393px"
        priority
        className="object-cover"
      />

      {/* Content */}
      <div className="relative z-10 h-full">
        {/* Label */}
        <div className="absolute left-[34px] top-[30px] flex items-center gap-6">
          <Image src="/Favicon/logo.png" alt="Gem" width={16} height={29} />

          <span className="font-space-grotesk text-[14px] leading-[18px] tracking-[0.15em] uppercase text-white font-medium">
            Why Are We Doing This
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-unica-one absolute left-[74px] top-[74px] w-[279px] text-[32px] leading-[90%] tracking-[-0.04em] text-white">
          The hobby was never
          <br />
          just about the cards
        </h2>

        {/* Description */}
        <div className="font-inter absolute left-[203px] top-[170px] w-[156px] flex flex-col gap-7 text-white text-[12px] leading-[100%]">
          <p>
            It is about discovering the shop two towns away. About trade nights
            that become tradition. The conversations.
            <br />
            The stories. The people.
          </p>

          <p>
            KLLCTRS exists to make the hobby easier to discover, explore, and
            experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AboutSection() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopAbout />
      </div>

      <div className="block md:hidden">
        <MobileAbout />
      </div>
    </>
  );
}
