"use client";

export default function AboutSection() {
  return (
    <section className="w-full bg-[#151E3C]">
      {/* Top Divider */}
      <div className="h-[52px] bg-[#151E3C]" />

      {/* Main Section */}
      <div className=" w-full h-[500px]  bg-[url('/aboutBG.png')]  bg-cover bg-center bg-no-repeat pt-[59px] pr-[678px]  pb-[107px] pl-[300px] ">
        {/* Content Wrapper */}
        <div className="w-[463px] flex flex-col gap-[34px]">
          {/* Header Block */}
          <div className="flex flex-col gap-[49px]">
            {/* Label */}
            <div className="flex items-center gap-[24px]">
              <img
                src="/footer/Gem_Pink.png"
                alt="Gem"
                className="w-[16px] h-[29px] object-contain"
              />

              <p className=" text-[14px] leading-[18px]  tracking-[0.15em] uppercase font-medium text-[#FEF9FF]">
                Why Are We Doing This
              </p>
            </div>

            {/* Title */}
            <h2
              className=" text-[48px] leading-[50px] tracking-[-0.04em] text-[#FEF9FF] font-normal "
              style={{
                fontFamily: "Unica One",
              }}
            >
              The hobby was never
              <br />
              just about the cards
            </h2>
          </div>

          {/* Paragraphs */}
          <div className="flex flex-col gap-[21px]">
            <p className="  text-[20px]  leading-[24px]  text-[#FEF9FF] font-normal">
              It is about discovering the shop two blocks away. About trade
              nights that become tradition. The conversations. The stories. The
              people.
            </p>

            <p className="  text-[20px]  leading-[24px] text-[#FEF9FF] font-normal ">
              KLLCTRS exists to make the hobby easier to discover, explore, and
              experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
