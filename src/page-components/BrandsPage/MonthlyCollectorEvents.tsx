import { CalendarDays, ExternalLink, MapPin } from "lucide-react";

const OCTOBER_2026_EVENTS = [
  { name: "Trading Card Con San Diego", dates: "Oct 2–4", lastDay: 4, city: "San Diego, CA", url: "https://tradingcardcon.com/event/san-diego-2026/", source: "Organizer" },
  { name: "SD Card Show", dates: "Oct 10", lastDay: 10, city: "Del Mar, CA", url: "https://www.delmarfairgrounds.com/events/2026/sd-card-show", source: "Venue" },
  { name: "Collectors Corner Card Show", dates: "Oct 15", lastDay: 15, city: "San Diego, CA", url: "https://www.collectorscornercardshow.com/", source: "Organizer" },
  { name: "NTX Universe", dates: "Oct 16–18", lastDay: 18, city: "Dallas, TX", url: "https://www.universecon.com/", source: "Organizer" },
  { name: "Collect-A-Con Dallas", dates: "Oct 24–25", lastDay: 25, city: "Dallas, TX", url: "https://collectaconusa.com/dallas/", source: "Organizer" },
];

export default function MonthlyCollectorEvents() {
  const today = new Date().toISOString().slice(0, 10);
  const events = OCTOBER_2026_EVENTS.map((event) => ({
    ...event,
    ended: `2026-10-${String(event.lastDay).padStart(2, "0")}` < today,
  }));

  return (
    <section className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="font-inter text-[11px] uppercase tracking-widest text-[#8B5CF6]">United States · October 2026</p><h2 className="mt-1 font-space-grotesk text-[22px] text-[#151E3C]">Collector events this month</h2></div>
        <p className="max-w-md font-inter text-[11px] leading-4 text-[#151E3C]/50">Verified organizer and venue highlights. For the broader live calendar, check <a className="text-[#6C36CE] underline" href="https://cardindustry.com/calendar" target="_blank" rel="noreferrer">Card Industry</a> and <a className="text-[#6C36CE] underline" href="https://thecardshopfinder.com/events/" target="_blank" rel="noreferrer">The Card Shop Finder</a>; listings can change.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => <a key={event.name} href={event.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-[#E5DFFD] p-4 transition hover:border-[#B39EF9] hover:bg-[#FEF9FF]">
          <div className="flex items-start justify-between gap-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2EFFE] px-2.5 py-1 font-inter text-[11px] font-medium text-[#5B18BE]"><CalendarDays className="h-3.5 w-3.5" />{event.dates}</span><span className="font-inter text-[10px] text-[#151E3C]/45">{event.ended ? "Past" : "Upcoming"}</span></div>
          <h3 className="mt-3 font-space-grotesk text-[16px] text-[#151E3C]">{event.name}</h3>
          <p className="mt-1 flex items-center gap-1 font-inter text-[12px] text-[#151E3C]/55"><MapPin className="h-3.5 w-3.5" />{event.city}</p>
          <p className="mt-3 flex items-center justify-between font-inter text-[10px] text-[#151E3C]/45"><span>Source: {event.source}</span><ExternalLink className="h-3.5 w-3.5 text-[#8B5CF6] transition group-hover:translate-x-0.5" /></p>
        </a>)}
      </div>
      <p className="mt-4 font-inter text-[10px] leading-4 text-[#151E3C]/40">This is a researched highlight list, not a complete nationwide event feed. Brand-linked events above come from KLLCTRS approved listings.</p>
    </section>
  );
}
