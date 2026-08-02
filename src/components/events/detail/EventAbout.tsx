import type { Event } from "@/types";

export default function EventAbout({ event }: { event: Event }) {
  const tags = [
    event.sponsors?.[0],
    event.venue_name ? "TCG Specific" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-3 md:w-[750px] md:gap-12">
      <div className="flex flex-col gap-3">
        <h2 className="font-space-grotesk text-2xl font-bold tracking-tight text-[#151E3C] md:text-[32px]">
          About The Show
        </h2>
        {tags.length > 0 && (
          <div className="flex items-center gap-3">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className={`rounded-[10px] border px-3 py-1 text-[11px] tracking-tight ${
                  i === 0
                    ? "border-[#CBBEFB] bg-[#E5DFFD] text-[#8B5CF6]"
                    : "border-[#F0C040] bg-[#FEF7E7] text-[#F0C040]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {event.autograph_guests && (
        <p className="whitespace-pre-line text-base leading-5 text-[#151E3C]">
          {event.autograph_guests}
        </p>
      )}
    </div>
  );
}
