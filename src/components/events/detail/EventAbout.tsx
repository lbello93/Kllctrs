import type { Event } from "@/types";

export default function EventAbout({ event }: { event: Event }) {
  const tag = event.sponsors?.[0];
  const details = event.autograph_guests?.trim();

  return (
    <section className="min-w-0 rounded-2xl border border-[#E9E3F4] bg-white p-5 shadow-[0_12px_36px_rgba(21,30,60,0.04)] sm:p-7">
      <div className="flex flex-col gap-3">
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#8B5CF6]">The event</p>
        <h2 className="font-space-grotesk text-2xl font-bold tracking-tight text-[#151E3C] sm:text-[28px]">
          About The Show
        </h2>
        {tag && (
          <span className="w-fit rounded-[10px] border border-[#CBBEFB] bg-[#E5DFFD] px-3 py-1 text-[11px] tracking-tight text-[#8B5CF6]">
            {tag}
          </span>
        )}
      </div>

      <p className="mt-5 whitespace-pre-line break-words text-sm leading-7 text-[#46506B] sm:text-base">
        {details || "Details for this show are still being added."}
      </p>
    </section>
  );
}
