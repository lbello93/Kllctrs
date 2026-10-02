import type { Event } from "@/types";

export default function EventAbout({ event }: { event: Event }) {
  const tag = event.sponsors?.[0];
  const details = event.autograph_guests?.trim();

  return (
    <div className="flex flex-col gap-3 md:w-[750px] md:gap-12">
      <div className="flex flex-col gap-3">
        <h2 className="font-space-grotesk text-2xl font-bold tracking-tight text-[#151E3C] md:text-[32px]">
          About The Show
        </h2>
        {tag && (
          <span className="w-fit rounded-[10px] border border-[#CBBEFB] bg-[#E5DFFD] px-3 py-1 text-[11px] tracking-tight text-[#8B5CF6]">
            {tag}
          </span>
        )}
      </div>

      <p className="whitespace-pre-line text-base leading-5 text-[#151E3C]">
        {details || "Details for this show are still being added."}
      </p>
    </div>
  );
}
